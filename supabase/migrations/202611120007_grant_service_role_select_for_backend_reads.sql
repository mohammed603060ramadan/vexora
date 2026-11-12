-- Restore backend-only read privileges required by server-side admin and student APIs.
-- RLS remains enabled; anon and authenticated grants are unchanged.
GRANT SELECT ON TABLE
  public.inquiries,
  public.profiles,
  public.courses,
  public.tasks
TO service_role;
