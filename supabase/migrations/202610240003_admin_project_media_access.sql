BEGIN;

-- Keep the project-media metadata table aligned with the admin uploader.
CREATE TABLE IF NOT EXISTS public.project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS project_media_project_created_idx
  ON public.project_media (project_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_media TO authenticated;

-- Align project administration with the same server-verified admin role
-- already enforced by app/admin/layout.tsx and protected API routes.
-- These additive policies do not remove the existing permission-based rules.
DROP POLICY IF EXISTS vexora_app_admin_projects_access ON public.projects;
CREATE POLICY vexora_app_admin_projects_access
  ON public.projects
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Project media metadata is managed only by authenticated VEXORA admins.
DO $$
BEGIN
  IF to_regclass('public.project_media') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS vexora_app_admin_project_media_access ON public.project_media';
    EXECUTE $policy$
      CREATE POLICY vexora_app_admin_project_media_access
        ON public.project_media
        FOR ALL TO authenticated
        USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
        WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    $policy$;
  END IF;
END
$$;

-- The media bucket remains private. Authenticated admins can upload, view
-- (including signed-URL previews), replace and delete objects in this bucket.
DROP POLICY IF EXISTS vexora_app_admin_project_media_storage_insert ON storage.objects;
CREATE POLICY vexora_app_admin_project_media_storage_insert
  ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'project-media'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

DROP POLICY IF EXISTS vexora_app_admin_project_media_storage_select ON storage.objects;
CREATE POLICY vexora_app_admin_project_media_storage_select
  ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'project-media'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

DROP POLICY IF EXISTS vexora_app_admin_project_media_storage_update ON storage.objects;
CREATE POLICY vexora_app_admin_project_media_storage_update
  ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'project-media'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    bucket_id = 'project-media'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

DROP POLICY IF EXISTS vexora_app_admin_project_media_storage_delete ON storage.objects;
CREATE POLICY vexora_app_admin_project_media_storage_delete
  ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'project-media'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

COMMIT;
