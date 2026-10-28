-- Keep project-request RLS compatible with both deployed client account-link schemas.
-- Some VEXORA environments use clients.auth_user_id; older ones use clients.user_id.
-- This migration is intentionally separate from the original project_requests migration
-- so databases that already applied the original migration receive the policy fix.

DO $$
DECLARE
  client_auth_column text;
BEGIN
  SELECT column_name
    INTO client_auth_column
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'clients'
    AND column_name IN ('auth_user_id', 'user_id')
  ORDER BY CASE column_name WHEN 'auth_user_id' THEN 0 ELSE 1 END
  LIMIT 1;

  IF client_auth_column IS NULL THEN
    RAISE EXCEPTION 'Cannot secure project_requests: public.clients has neither auth_user_id nor user_id';
  END IF;

  EXECUTE 'drop policy if exists "Clients can read their own project requests" on public.project_requests';
  EXECUTE format(
    'create policy "Clients can read their own project requests"
      on public.project_requests for select to authenticated
      using (
        user_id = (select auth.uid())
        and exists (
          select 1 from public.clients c
          where c.id = project_requests.client_id
            and c.%I = (select auth.uid())
        )
      )',
    client_auth_column
  );

  EXECUTE 'drop policy if exists "Clients can cancel their own pending project requests" on public.project_requests';
  EXECUTE format(
    'create policy "Clients can cancel their own pending project requests"
      on public.project_requests for update to authenticated
      using (
        user_id = (select auth.uid())
        and status = ''pending''
        and exists (
          select 1 from public.clients c
          where c.id = project_requests.client_id
            and c.%I = (select auth.uid())
        )
      )
      with check (
        user_id = (select auth.uid())
        and status = ''cancelled''
        and exists (
          select 1 from public.clients c
          where c.id = project_requests.client_id
            and c.%I = (select auth.uid())
        )
      )',
    client_auth_column,
    client_auth_column
  );
END $$;
