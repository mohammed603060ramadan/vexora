-- Restore anonymous read access to published course metadata.
-- The public Academy catalogue uses the anon Supabase client; course content
-- and lessons remain protected by their own RLS policies.
BEGIN;

DROP POLICY IF EXISTS courses_read ON public.courses;

CREATE POLICY courses_read
  ON public.courses
  FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    OR (
      (SELECT auth.uid()) IS NOT NULL
      AND (
        public.is_vexora_academy_admin()
        OR instructor_id = (SELECT auth.uid())
      )
    )
  );

NOTIFY pgrst, 'reload schema';
COMMIT;
