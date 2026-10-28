-- VEXORA project request workflow.
-- Safe additive migration: creates a dedicated table and does not alter existing project/client records.
create table if not exists public.project_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'reviewing', 'approved', 'rejected', 'cancelled', 'completed')),
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_requests_client_created_idx
  on public.project_requests (client_id, created_at desc);
create index if not exists project_requests_project_status_idx
  on public.project_requests (project_id, status);

-- Enforce that the requested project belongs to the same client recorded on
-- the request. The pair constraint is additive and does not change existing rows.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.projects'::regclass
      AND conname = 'projects_id_client_id_unique'
  ) THEN
    ALTER TABLE public.projects
      ADD CONSTRAINT projects_id_client_id_unique UNIQUE (id, client_id);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.project_requests'::regclass
      AND conname = 'project_requests_project_client_fk'
  ) THEN
    ALTER TABLE public.project_requests
      ADD CONSTRAINT project_requests_project_client_fk
      FOREIGN KEY (project_id, client_id)
      REFERENCES public.projects (id, client_id)
      ON DELETE CASCADE NOT VALID;
  END IF;
END;
$$;

-- NOT VALID preserves existing data while enforcing the relationship for
-- new/updated requests. Validate after the live schema audit confirms legacy rows.

-- One active request per client/project. Closed requests may be submitted again.
create unique index if not exists project_requests_one_open_per_client_project
  on public.project_requests (client_id, project_id)
  where status in ('pending', 'reviewing', 'approved');

alter table public.project_requests enable row level security;

drop policy if exists "Clients can read their own project requests" on public.project_requests;
create policy "Clients can read their own project requests"
  on public.project_requests for select to authenticated
  using (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.clients c
      where c.id = project_requests.client_id
        and c.user_id = (select auth.uid())
    )
  );

-- Authenticated clients may only cancel their own pending request.
drop policy if exists "Clients can cancel their own pending project requests" on public.project_requests;
create policy "Clients can cancel their own pending project requests"
  on public.project_requests for update to authenticated
  using (
    user_id = (select auth.uid())
    and status = 'pending'
    and exists (
      select 1 from public.clients c
      where c.id = project_requests.client_id
        and c.user_id = (select auth.uid())
    )
  )
  with check (
    user_id = (select auth.uid())
    and status = 'cancelled'
    and exists (
      select 1 from public.clients c
      where c.id = project_requests.client_id
        and c.user_id = (select auth.uid())
    )
  );

grant select, update on public.project_requests to authenticated;
grant all on public.project_requests to service_role;
