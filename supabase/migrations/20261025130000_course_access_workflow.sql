-- VEXORA Academy paid-course access workflow.
-- Additive only: preserves existing courses, enrollments, and student registrations.
BEGIN;

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
  ADD COLUMN IF NOT EXISTS promo_video_url TEXT;

ALTER TABLE public.courses
  DROP CONSTRAINT IF EXISTS courses_cover_image_url_check;
ALTER TABLE public.courses
  ADD CONSTRAINT courses_cover_image_url_check
  CHECK (cover_image_url IS NULL OR cover_image_url ~* '^https?://') NOT VALID;

ALTER TABLE public.courses
  DROP CONSTRAINT IF EXISTS courses_promo_video_url_check;
ALTER TABLE public.courses
  ADD CONSTRAINT courses_promo_video_url_check
  CHECK (promo_video_url IS NULL OR promo_video_url ~* '^https?://') NOT VALID;

CREATE TABLE IF NOT EXISTS public.course_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  purchase_code TEXT NOT NULL UNIQUE DEFAULT (
    'VX-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))
  ),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  student_message TEXT,
  admin_note TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Permit a new request after a previous request was rejected or cancelled,
-- while preventing duplicate pending requests for the same student/course.
ALTER TABLE public.course_access_requests
  DROP CONSTRAINT IF EXISTS course_access_one_open_request;
CREATE UNIQUE INDEX IF NOT EXISTS course_access_one_pending_request
  ON public.course_access_requests (course_id, student_id)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS course_access_requests_status_created_idx
  ON public.course_access_requests (status, created_at DESC);
CREATE INDEX IF NOT EXISTS course_access_requests_student_created_idx
  ON public.course_access_requests (student_id, created_at DESC);

ALTER TABLE public.course_access_requests ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.course_access_requests TO authenticated;
GRANT SELECT, UPDATE ON public.course_access_requests TO authenticated;
GRANT ALL ON public.course_access_requests TO service_role;

-- Use VEXORA's existing administrator registry rather than a permission helper
-- that may not exist in the target database.
CREATE OR REPLACE FUNCTION public.is_vexora_academy_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT (SELECT auth.uid()) IS NOT NULL
    AND (
      (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
      OR EXISTS (
        SELECT 1
        FROM public.vexora_admins AS administrators
        WHERE administrators.user_id = (SELECT auth.uid())
      )
    );
$$;

REVOKE ALL ON FUNCTION public.is_vexora_academy_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_vexora_academy_admin() TO anon, authenticated, service_role;

DROP POLICY IF EXISTS course_access_requests_student_read ON public.course_access_requests;
CREATE POLICY course_access_requests_student_read
  ON public.course_access_requests FOR SELECT TO authenticated
  USING (student_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS course_access_requests_student_create ON public.course_access_requests;
CREATE POLICY course_access_requests_student_create
  ON public.course_access_requests FOR INSERT TO authenticated
  WITH CHECK (
    student_id = (SELECT auth.uid())
    AND lower(email) = lower((SELECT auth.jwt() ->> 'email'))
    AND status = 'pending'
    AND reviewed_by IS NULL
    AND reviewed_at IS NULL
  );

DROP POLICY IF EXISTS course_access_requests_admin_read ON public.course_access_requests;
CREATE POLICY course_access_requests_admin_read
  ON public.course_access_requests FOR SELECT TO authenticated
  USING (
    public.is_vexora_academy_admin()
  );

DROP POLICY IF EXISTS course_access_requests_admin_update ON public.course_access_requests;
CREATE POLICY course_access_requests_admin_update
  ON public.course_access_requests FOR UPDATE TO authenticated
  USING (
    public.is_vexora_academy_admin()
  )
  WITH CHECK (
    public.is_vexora_academy_admin()
    AND status IN ('pending', 'approved', 'rejected', 'cancelled')
  );

-- The purchase/access code only records the request; access is granted after
-- an administrator approves it. Approval creates the real Academy enrollment.
CREATE OR REPLACE FUNCTION public.grant_course_enrollment_on_access_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.status = 'approved'
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'approved') THEN
    INSERT INTO public.enrollments AS existing_enrollment (
      course_id, student_id, enrolled_by, status, progress_percent
    )
    VALUES (
      NEW.course_id, NEW.student_id, NEW.reviewed_by, 'active', 0
    )
    ON CONFLICT (course_id, student_id)
    DO UPDATE SET
      status = CASE
        WHEN existing_enrollment.status = 'cancelled' THEN 'active'
        ELSE existing_enrollment.status
      END,
      updated_at = now();
    NEW.reviewed_at := COALESCE(NEW.reviewed_at, now());
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS course_access_requests_grant_enrollment
  ON public.course_access_requests;
CREATE TRIGGER course_access_requests_grant_enrollment
  BEFORE INSERT OR UPDATE OF status ON public.course_access_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.grant_course_enrollment_on_access_approval();

-- Apply the lesson policy only when the canonical legacy lessons table exists.
-- Some deployed VEXORA databases use course_lessons instead. Do not guess at or
-- overwrite that table's existing RLS policies without inspecting the live policy set.
DO $$
BEGIN
  IF to_regclass('public.lessons') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS lessons_read ON public.lessons';
    EXECUTE $policy$
      CREATE POLICY lessons_read
      ON public.lessons
      FOR SELECT TO anon, authenticated
      USING (
        status = 'published'
        AND EXISTS (
          SELECT 1 FROM public.courses c
          WHERE c.id = lessons.course_id AND c.status = 'published'
        )
        AND (SELECT auth.uid()) IS NOT NULL
        AND (
          public.is_vexora_academy_admin()
          OR EXISTS (
            SELECT 1 FROM public.enrollments e
            WHERE e.course_id = lessons.course_id
              AND e.student_id = (SELECT auth.uid())
              AND e.status IN ('active', 'completed')
          )
          OR EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = lessons.course_id
              AND c.instructor_id = (SELECT auth.uid())
          )
        )
      )
    $policy$;
  ELSIF to_regclass('public.course_lessons') IS NOT NULL THEN
    RAISE NOTICE 'VEXORA uses public.course_lessons; its existing RLS policies were preserved. Review the read-only schema audit before changing lesson access policies.';
  ELSE
    RAISE NOTICE 'No supported lesson table was found. Course access workflow was installed without changing lesson policies.';
  END IF;
END;
$$;

NOTIFY pgrst, 'reload schema';
COMMIT;
