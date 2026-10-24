CREATE TABLE IF NOT EXISTS public.student_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 2 AND 100),
  email TEXT NOT NULL CHECK (char_length(email) <= 254 AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone TEXT CHECK (phone IS NULL OR char_length(phone) <= 40),
  country TEXT CHECK (country IS NULL OR char_length(country) <= 100),
  education_level TEXT CHECK (education_level IS NULL OR char_length(education_level) <= 100),
  track TEXT NOT NULL CHECK (char_length(btrim(track)) BETWEEN 1 AND 100),
  experience TEXT CHECK (experience IS NULL OR char_length(experience) <= 2000),
  motivation TEXT CHECK (motivation IS NULL OR char_length(motivation) <= 3000),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'contacted', 'accepted', 'rejected')),
  source TEXT NOT NULL DEFAULT 'website' CHECK (source = 'website'),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.student_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit student registrations" ON public.student_registrations;
CREATE POLICY "Public can submit student registrations" ON public.student_registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'new' AND source = 'website' AND admin_notes IS NULL AND reviewed_by IS NULL);

DROP POLICY IF EXISTS "Admins can read student registrations" ON public.student_registrations;
CREATE POLICY "Admins can read student registrations" ON public.student_registrations
  FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can update student registrations" ON public.student_registrations;
CREATE POLICY "Admins can update student registrations" ON public.student_registrations
  FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can delete student registrations" ON public.student_registrations;
CREATE POLICY "Admins can delete student registrations" ON public.student_registrations
  FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

GRANT INSERT ON public.student_registrations TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.student_registrations TO authenticated;

CREATE INDEX IF NOT EXISTS student_registrations_created_at_idx ON public.student_registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS student_registrations_status_idx ON public.student_registrations (status);
