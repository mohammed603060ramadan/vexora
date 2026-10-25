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
        and c.auth_user_id = (select auth.uid())
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
        and c.auth_user_id = (select auth.uid())
    )
  )
  with check (
    user_id = (select auth.uid())
    and status = 'cancelled'
    and exists (
      select 1 from public.clients c
      where c.id = project_requests.client_id
        and c.auth_user_id = (select auth.uid())
    )
  );

grant select, update on public.project_requests to authenticated;
grant all on public.project_requests to service_role;
