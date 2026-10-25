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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT course_access_one_open_request
    UNIQUE (course_id, student_id)
);

CREATE INDEX IF NOT EXISTS course_access_requests_status_created_idx
  ON public.course_access_requests (status, created_at DESC);
CREATE INDEX IF NOT EXISTS course_access_requests_student_created_idx
  ON public.course_access_requests (student_id, created_at DESC);

ALTER TABLE public.course_access_requests ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.course_access_requests TO authenticated;
GRANT SELECT, UPDATE ON public.course_access_requests TO authenticated;
GRANT ALL ON public.course_access_requests TO service_role;

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
    public.has_permission('academy.manage')
    OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

DROP POLICY IF EXISTS course_access_requests_admin_update ON public.course_access_requests;
CREATE POLICY course_access_requests_admin_update
  ON public.course_access_requests FOR UPDATE TO authenticated
  USING (
    public.has_permission('academy.manage')
    OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (
      public.has_permission('academy.manage')
      OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
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
    INSERT INTO public.enrollments (
      course_id, student_id, enrolled_by, status, progress_percent
    )
    VALUES (
      NEW.course_id, NEW.student_id, NEW.reviewed_by, 'active', 0
    )
    ON CONFLICT (course_id, student_id)
    DO UPDATE SET
      status = CASE
        WHEN public.enrollments.status = 'cancelled' THEN 'active'
        ELSE public.enrollments.status
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

-- Published course metadata is public; actual lessons are preview-only until
-- the signed-in student has an active/completed enrollment.
DROP POLICY IF EXISTS lessons_read ON public.lessons;
CREATE POLICY lessons_read
ON public.lessons
FOR SELECT TO anon, authenticated
USING (
  status = 'published'
  AND EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = lessons.course_id AND c.status = 'published'
  )
  AND (
    is_preview = true
    OR (
      (SELECT auth.uid()) IS NOT NULL
      AND (
        public.has_permission('academy.manage')
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
  )
);

NOTIFY pgrst, 'reload schema';
COMMIT;
