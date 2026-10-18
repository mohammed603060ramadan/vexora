
-- =========================================================
-- VEXORA Platform
-- Migration 004: Projects, tasks and project activity
-- PostgreSQL / Supabase
-- =========================================================

BEGIN;

-- ---------------------------------------------------------
-- 1. Projects
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,

    client_id UUID
        REFERENCES public.clients(id) ON DELETE RESTRICT,

    service_request_id UUID
        REFERENCES public.service_requests(id) ON DELETE SET NULL,

    department_id UUID
        REFERENCES public.departments(id) ON DELETE SET NULL,

    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE,
    description TEXT,

    project_manager_id UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'planned'
        CHECK (status IN (
            'draft', 'planned', 'in_progress', 'on_hold',
            'completed', 'cancelled'
        )),

    priority VARCHAR(20) NOT NULL DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

    progress_percent SMALLINT NOT NULL DEFAULT 0
        CHECK (progress_percent BETWEEN 0 AND 100),

    budget NUMERIC(14, 2)
        CHECK (budget IS NULL OR budget >= 0),

    currency CHAR(3) NOT NULL DEFAULT 'USD',
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMPTZ,

    created_by UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT projects_date_range_check
        CHECK (
            start_date IS NULL
            OR due_date IS NULL
            OR due_date >= start_date
        )
);

-- ---------------------------------------------------------
-- 2. Project members
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.project_members (
    project_id UUID NOT NULL
        REFERENCES public.projects(id) ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,

    project_role VARCHAR(40) NOT NULL DEFAULT 'member',

    added_by UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (project_id, user_id)
);

-- ---------------------------------------------------------
-- 3. Project milestones
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL
        REFERENCES public.projects(id) ON DELETE CASCADE,

    title VARCHAR(200) NOT NULL,
    description TEXT,

    sequence_number INTEGER NOT NULL DEFAULT 1
        CHECK (sequence_number > 0),

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN (
            'pending', 'in_progress', 'completed', 'blocked'
        )),

    due_date DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT project_milestones_project_sequence_unique
        UNIQUE (project_id, sequence_number),

    -- Required for the task-to-milestone composite FK.
    CONSTRAINT project_milestones_id_project_unique
        UNIQUE (id, project_id)
);

-- ---------------------------------------------------------
-- 4. Tasks
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL
        REFERENCES public.projects(id) ON DELETE CASCADE,

    -- These relationships are defined below using composite
    -- foreign keys to ensure they belong to the same project.
    milestone_id UUID,
    parent_task_id UUID,

    title VARCHAR(220) NOT NULL,
    description TEXT,

    assigned_to UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    created_by UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    status VARCHAR(25) NOT NULL DEFAULT 'todo'
        CHECK (status IN (
            'backlog', 'todo', 'in_progress',
            'review', 'blocked', 'completed', 'cancelled'
        )),

    priority VARCHAR(20) NOT NULL DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

    estimated_hours NUMERIC(8, 2)
        CHECK (estimated_hours IS NULL OR estimated_hours >= 0),

    actual_hours NUMERIC(8, 2)
        CHECK (actual_hours IS NULL OR actual_hours >= 0),

    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMPTZ,
    sequence_number INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT tasks_date_range_check
        CHECK (
            start_date IS NULL
            OR due_date IS NULL
            OR due_date >= start_date
        ),

    -- Prevent a task from being its own parent.
    CONSTRAINT tasks_cannot_parent_themselves
        CHECK (parent_task_id IS NULL OR parent_task_id <> id),

    -- Required target for the self-referencing composite FK.
    CONSTRAINT tasks_id_project_unique
        UNIQUE (id, project_id),

    -- A task's milestone must belong to the same project.
    -- Deleting the milestone clears only milestone_id.
    CONSTRAINT tasks_milestone_same_project_fk
        FOREIGN KEY (milestone_id, project_id)
        REFERENCES public.project_milestones (id, project_id)
        ON DELETE SET NULL (milestone_id),

    -- A parent task must belong to the same project.
    -- Deleting the parent clears only parent_task_id.
    CONSTRAINT tasks_parent_same_project_fk
        FOREIGN KEY (parent_task_id, project_id)
        REFERENCES public.tasks (id, project_id)
        ON DELETE SET NULL (parent_task_id)
);

-- ---------------------------------------------------------
-- 5. Task comments
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    task_id UUID NOT NULL
        REFERENCES public.tasks(id) ON DELETE CASCADE,

    author_id UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    body TEXT NOT NULL
        CHECK (length(trim(body)) > 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- 6. Project updates / activity log
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.project_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL
        REFERENCES public.projects(id) ON DELETE CASCADE,

    author_id UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    update_type VARCHAR(40) NOT NULL DEFAULT 'general',
    title VARCHAR(200),
    body TEXT NOT NULL,

    progress_percent SMALLINT
        CHECK (
            progress_percent IS NULL
            OR progress_percent BETWEEN 0 AND 100
        ),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- 7. Project documents / links
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.project_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL
        REFERENCES public.projects(id) ON DELETE CASCADE,

    uploaded_by UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    resource_name VARCHAR(220) NOT NULL,

    resource_type VARCHAR(30) NOT NULL DEFAULT 'link'
        CHECK (resource_type IN (
            'link', 'file', 'document', 'repository'
        )),

    storage_path TEXT,
    external_url TEXT,
    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT project_resources_location_required
        CHECK (
            storage_path IS NOT NULL
            OR external_url IS NOT NULL
        )
);

-- ---------------------------------------------------------
-- 8. Indexes
-- ---------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_projects_client
    ON public.projects(client_id);

CREATE INDEX IF NOT EXISTS idx_projects_department
    ON public.projects(department_id);

CREATE INDEX IF NOT EXISTS idx_projects_manager
    ON public.projects(project_manager_id);

CREATE INDEX IF NOT EXISTS idx_projects_status_due
    ON public.projects(status, due_date);

CREATE INDEX IF NOT EXISTS idx_project_members_user
    ON public.project_members(user_id);

CREATE INDEX IF NOT EXISTS idx_milestones_project_status
    ON public.project_milestones(project_id, status);

CREATE INDEX IF NOT EXISTS idx_tasks_project_status
    ON public.tasks(project_id, status);

CREATE INDEX IF NOT EXISTS idx_tasks_assignee_status
    ON public.tasks(assigned_to, status);

CREATE INDEX IF NOT EXISTS idx_tasks_due_date
    ON public.tasks(due_date);

CREATE INDEX IF NOT EXISTS idx_tasks_milestone
    ON public.tasks(milestone_id);

CREATE INDEX IF NOT EXISTS idx_tasks_parent
    ON public.tasks(parent_task_id);

CREATE INDEX IF NOT EXISTS idx_task_comments_task_date
    ON public.task_comments(task_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_updates_project_date
    ON public.project_updates(project_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_resources_project
    ON public.project_resources(project_id);

-- ---------------------------------------------------------
-- 9. updated_at triggers
-- ---------------------------------------------------------

DROP TRIGGER IF EXISTS trg_projects_updated_at
    ON public.projects;

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_milestones_updated_at
    ON public.project_milestones;

CREATE TRIGGER trg_milestones_updated_at
BEFORE UPDATE ON public.project_milestones
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_tasks_updated_at
    ON public.tasks;

CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_task_comments_updated_at
    ON public.task_comments;

CREATE TRIGGER trg_task_comments_updated_at
BEFORE UPDATE ON public.task_comments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMIT;
