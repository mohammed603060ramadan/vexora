
-- =========================================================
-- VEXORA Platform
-- Migration 002: Organization, Teams and Access Roles
-- PostgreSQL / Supabase
-- =========================================================

BEGIN;

-- ---------------------------------------------------------
-- 1. Departments
-- Each department has at most one team leader.
-- The leader must be an employee of the same department.
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    manager_user_id UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,
    status public.record_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- 2. Application roles
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.app_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(60) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- 3. Permissions
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- 4. Role permissions
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL
        REFERENCES public.app_roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL
        REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (role_id, permission_id)
);

-- ---------------------------------------------------------
-- 5. Employees
-- Every employee belongs to zero or one department.
-- A user can have only one employee record.
-- The composite unique constraint supports leader validation.
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE
        REFERENCES auth.users(id) ON DELETE CASCADE,
    department_id UUID
        REFERENCES public.departments(id) ON DELETE SET NULL,
    job_title VARCHAR(120),
    employee_code VARCHAR(40) UNIQUE,
    employment_status public.app_user_status
        NOT NULL DEFAULT 'pending',
    hired_at DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT employees_department_user_unique
        UNIQUE (department_id, user_id)
);

-- ---------------------------------------------------------
-- 6. Enforce that the department leader is an employee
-- of that same department.
--
-- A department may temporarily have no leader.
-- Create the department and employee first, then assign
-- manager_user_id to the employee's user_id.
-- ---------------------------------------------------------

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname =
            'departments_manager_same_department_fk'
          AND conrelid = 'public.departments'::regclass
    ) THEN
        ALTER TABLE public.departments
        ADD CONSTRAINT departments_manager_same_department_fk
        FOREIGN KEY (id, manager_user_id)
        REFERENCES public.employees (department_id, user_id)
        ON DELETE SET NULL (manager_user_id);
    END IF;
END;
$$;

-- ---------------------------------------------------------
-- 7. Assign roles to users
-- A user can hold multiple application roles.
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL
        REFERENCES public.app_roles(id) ON DELETE CASCADE,
    assigned_by UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role_id)
);

-- ---------------------------------------------------------
-- 8. Indexes
-- ---------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_departments_manager
    ON public.departments(manager_user_id);

CREATE INDEX IF NOT EXISTS idx_employees_department
    ON public.employees(department_id);

CREATE INDEX IF NOT EXISTS idx_employees_status
    ON public.employees(employment_status);

CREATE INDEX IF NOT EXISTS idx_user_roles_role
    ON public.user_roles(role_id);

CREATE INDEX IF NOT EXISTS idx_role_permissions_permission
    ON public.role_permissions(permission_id);

-- ---------------------------------------------------------
-- 9. updated_at triggers
-- ---------------------------------------------------------

DROP TRIGGER IF EXISTS trg_departments_updated_at
    ON public.departments;

CREATE TRIGGER trg_departments_updated_at
BEFORE UPDATE ON public.departments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_employees_updated_at
    ON public.employees;

CREATE TRIGGER trg_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMIT;
