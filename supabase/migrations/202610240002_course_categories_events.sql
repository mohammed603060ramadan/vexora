BEGIN;

-- Academy course departments are stored with each course, so the public
-- catalogue and the administration form share the same source of truth.
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Cybersecurity';

ALTER TABLE public.courses
  DROP CONSTRAINT IF EXISTS courses_category_check;

ALTER TABLE public.courses
  ADD CONSTRAINT courses_category_check
  CHECK (category IN (
    'Cybersecurity',
    'Software Development',
    'Networks & Infrastructure',
    'Data Analytics',
    'Digital Marketing'
  ));

CREATE INDEX IF NOT EXISTS courses_category_status_idx
  ON public.courses (category, status);

-- Academy discovery is account-only. Keep existing management policies and
-- student data policies intact; only tighten catalogue-content read policies.
DROP POLICY IF EXISTS courses_read ON public.courses;
CREATE POLICY courses_read
  ON public.courses
  FOR SELECT TO authenticated
  USING (
    status = 'published'
    OR public.has_permission('academy.manage')
    OR instructor_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS course_sections_read ON public.course_sections;
CREATE POLICY course_sections_read
  ON public.course_sections
  FOR SELECT TO authenticated
  USING (
    public.has_permission('academy.manage')
    OR EXISTS (
      SELECT 1
      FROM public.courses AS c
      WHERE c.id = course_id
        AND c.status = 'published'
    )
  );

DROP POLICY IF EXISTS lessons_read ON public.lessons;
CREATE POLICY lessons_read
  ON public.lessons
  FOR SELECT TO authenticated
  USING (
    public.has_permission('academy.manage')
    OR (
      status = 'published'
      AND EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = course_id
          AND c.status = 'published'
      )
    )
    OR (
      is_preview = true
      AND status = 'published'
      AND EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = course_id
          AND c.status = 'published'
      )
    )
  );

-- Persist events created in Admin > Events and publish them to the website.
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(220) NOT NULL,
  description TEXT,
  event_type VARCHAR(30) NOT NULL DEFAULT 'webinar'
    CHECK (event_type IN ('conference', 'webinar', 'workshop', 'meeting', 'other')),
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
  event_date DATE,
  start_time TIME,
  end_time TIME,
  location VARCHAR(300),
  registration_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT events_end_after_start_check
    CHECK (start_time IS NULL OR end_time IS NULL OR end_time > start_time),
  CONSTRAINT events_registration_url_check
    CHECK (registration_url IS NULL OR registration_url ~* '^https?://')
);

CREATE INDEX IF NOT EXISTS events_status_date_idx
  ON public.events (status, event_date);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;

DROP POLICY IF EXISTS events_public_read ON public.events;
CREATE POLICY events_public_read
  ON public.events
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS events_admin_manage ON public.events;
CREATE POLICY events_admin_manage
  ON public.events
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

COMMIT;
