-- Restrict public project showcase visibility to unauthenticated visitors.
-- Authenticated clients retain access through projects_select_own_client_projects.
-- Admin access remains governed by the existing admin policies.

DROP POLICY IF EXISTS "vexora_public_project_showcases_read" ON public.projects;

CREATE POLICY "vexora_public_project_showcases_read"
ON public.projects
FOR SELECT
TO anon
USING (
  status IN ('in_progress', 'completed')
  AND (show_on_homepage = true OR show_on_projects_page = true)
);
