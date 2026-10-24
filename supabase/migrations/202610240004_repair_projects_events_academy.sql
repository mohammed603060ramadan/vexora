BEGIN;

-- Repair existing projects tables created before the due_date column was added.
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS due_date DATE,
  ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS show_on_projects_page BOOLEAN NOT NULL DEFAULT FALSE;

-- Keep existing legacy deadline data when that column is present.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'projects'
      AND column_name = 'deadline'
  ) THEN
    EXECUTE 'UPDATE public.projects SET due_date = deadline WHERE due_date IS NULL AND deadline IS NOT NULL';
  END IF;
END
$$;

-- The category column is required by both Academy management and the course catalogue.
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

-- Make event storage complete even if an earlier partial table already existed.
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
  show_on_homepage BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS title VARCHAR(220);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_type VARCHAR(30) NOT NULL DEFAULT 'webinar';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'draft';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_date DATE;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_time TIME;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS location VARCHAR(300);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

DO $
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_title_nonempty_check' AND conrelid = 'public.events'::regclass) THEN
    ALTER TABLE public.events ADD CONSTRAINT events_title_nonempty_check
      CHECK (length(trim(title)) > 0) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_type_valid_check' AND conrelid = 'public.events'::regclass) THEN
    ALTER TABLE public.events ADD CONSTRAINT events_type_valid_check
      CHECK (event_type IN ('conference', 'webinar', 'workshop', 'meeting', 'other')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_status_valid_check' AND conrelid = 'public.events'::regclass) THEN
    ALTER TABLE public.events ADD CONSTRAINT events_status_valid_check
      CHECK (status IN ('draft', 'published', 'completed', 'cancelled')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_time_order_check' AND conrelid = 'public.events'::regclass) THEN
    ALTER TABLE public.events ADD CONSTRAINT events_time_order_check
      CHECK (start_time IS NULL OR end_time IS NULL OR end_time > start_time) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_registration_url_check' AND conrelid = 'public.events'::regclass) THEN
    ALTER TABLE public.events ADD CONSTRAINT events_registration_url_check
      CHECK (registration_url IS NULL OR registration_url ~* '^https?://') NOT VALID;
  END IF;
END
$;

CREATE INDEX IF NOT EXISTS events_status_date_idx
  ON public.events (status, event_date);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;

DROP POLICY IF EXISTS events_public_read ON public.events;
CREATE POLICY events_public_read
  ON public.events FOR SELECT TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS events_admin_manage ON public.events;
CREATE POLICY events_admin_manage
  ON public.events FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Public website can only read project fields explicitly approved for display.
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
GRANT SELECT (id, name, description, status, due_date, show_on_homepage, show_on_projects_page)
  ON public.projects TO anon, authenticated;
DROP POLICY IF EXISTS vexora_public_project_showcases_read ON public.projects;
CREATE POLICY vexora_public_project_showcases_read
  ON public.projects
  FOR SELECT TO anon, authenticated
  USING (
    status IN ('in_progress', 'completed')
    AND (show_on_homepage = TRUE OR show_on_projects_page = TRUE)
  );

-- Reload the REST schema cache after the repair so the API sees the new columns.
NOTIFY pgrst, 'reload schema';

COMMIT;
