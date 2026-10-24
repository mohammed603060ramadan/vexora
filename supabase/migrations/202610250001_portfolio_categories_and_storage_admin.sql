BEGIN;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS portfolio_category TEXT NOT NULL DEFAULT 'Software Development';

ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS projects_portfolio_category_check;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_portfolio_category_check
  CHECK (portfolio_category IN (
    'Cybersecurity',
    'Software Development',
    'Networks & Infrastructure',
    'Data Analytics',
    'Digital Marketing'
  ));

CREATE INDEX IF NOT EXISTS projects_portfolio_public_idx
  ON public.projects (portfolio_category, status, show_on_projects_page);

-- Storage uploads are allowed only for authenticated VEXORA administrators.
-- The SECURITY DEFINER helper permits checking the private admin registry
-- without granting browser users direct access to that registry.
CREATE OR REPLACE FUNCTION public.is_vexora_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $function$
  SELECT
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    OR EXISTS (
      SELECT 1
      FROM public.vexora_admins AS admin_record
      WHERE admin_record.user_id = auth.uid()
    );
$function$;

REVOKE ALL ON FUNCTION public.is_vexora_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_vexora_admin() TO authenticated;

DROP POLICY IF EXISTS vexora_app_admin_project_media_storage_insert ON storage.objects;
CREATE POLICY vexora_app_admin_project_media_storage_insert
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-media' AND public.is_vexora_admin());

DROP POLICY IF EXISTS vexora_app_admin_project_media_storage_select ON storage.objects;
CREATE POLICY vexora_app_admin_project_media_storage_select
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'project-media' AND public.is_vexora_admin());

DROP POLICY IF EXISTS vexora_app_admin_project_media_storage_update ON storage.objects;
CREATE POLICY vexora_app_admin_project_media_storage_update
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-media' AND public.is_vexora_admin())
  WITH CHECK (bucket_id = 'project-media' AND public.is_vexora_admin());

DROP POLICY IF EXISTS vexora_app_admin_project_media_storage_delete ON storage.objects;
CREATE POLICY vexora_app_admin_project_media_storage_delete
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-media' AND public.is_vexora_admin());

NOTIFY pgrst, 'reload schema';
COMMIT;
