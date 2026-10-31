-- VEXORA team directory and administrator-only browser access.
-- Safe to apply on databases where the table already exists.

BEGIN;

CREATE OR REPLACE FUNCTION public.is_vexora_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.vexora_admins AS admins
    WHERE admins.user_id = (SELECT auth.uid())
  );
$$;

REVOKE ALL ON FUNCTION public.is_vexora_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_vexora_admin() TO authenticated;

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  job_title TEXT,
  department TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'on_leave', 'inactive')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT team_members_full_name_not_blank
    CHECK (length(trim(full_name)) BETWEEN 1 AND 200)
);

CREATE INDEX IF NOT EXISTS team_members_created_at_idx
  ON public.team_members (created_at DESC);

CREATE INDEX IF NOT EXISTS team_members_status_idx
  ON public.team_members (status);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.team_members TO authenticated;

DROP POLICY IF EXISTS team_members_admin_all ON public.team_members;

CREATE POLICY team_members_admin_all
  ON public.team_members
  FOR ALL
  TO authenticated
  USING (public.is_vexora_admin())
  WITH CHECK (public.is_vexora_admin());

COMMENT ON TABLE public.team_members IS
  'VEXORA internal team directory. Browser access is restricted to registered administrators; login linkage is stored separately in public.employees.';

COMMIT;
