-- VEXORA security hardening: restrict trigger-function execution and
-- remove non-application table privileges that bypass RLS.
-- This migration does not alter rows, enrollment statuses, or existing policies.
BEGIN;

-- The trigger invokes this function as part of the existing trigger.
-- Browser roles and service_role do not need to call it directly.
DO $migration$
BEGIN
  IF to_regprocedure('public.grant_course_enrollment_on_access_approval()') IS NULL THEN
    RAISE EXCEPTION
      'Expected trigger function public.grant_course_enrollment_on_access_approval() was not found';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger AS t
    JOIN pg_class AS c ON c.oid = t.tgrelid
    JOIN pg_namespace AS n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'course_access_requests'
      AND t.tgname = 'course_access_requests_grant_enrollment'
      AND NOT t.tgisinternal
  ) THEN
    RAISE EXCEPTION
      'Expected trigger course_access_requests_grant_enrollment was not found on public.course_access_requests';
  END IF;
END;
$migration$;

REVOKE ALL ON FUNCTION public.grant_course_enrollment_on_access_approval()
  FROM PUBLIC, anon, authenticated, service_role;

-- TRUNCATE bypasses row-level security. The browser roles and service_role
-- do not need TRUNCATE, REFERENCES, or TRIGGER privileges on these app tables.
REVOKE TRUNCATE, REFERENCES, TRIGGER ON TABLE
  public.course_access_requests,
  public.course_lessons,
  public.courses,
  public.enrollments,
  public.site_settings,
  public.vexora_admins
FROM anon, authenticated, service_role;

-- Prevent future tables created by postgres in public from inheriting these
-- unnecessary privileges. Do not alter Supabase-managed supabase_admin defaults.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE TRUNCATE, REFERENCES, TRIGGER ON TABLES
  FROM anon, authenticated, service_role;

COMMIT;
