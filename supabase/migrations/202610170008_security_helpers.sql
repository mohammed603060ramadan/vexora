
-- =========================================================
-- VEXORA Platform
-- Migration 008: Security Helpers
-- PostgreSQL / Supabase
-- =========================================================

BEGIN;

-- =========================================================
-- 1. Check whether the current user has a specific role
-- =========================================================

CREATE OR REPLACE FUNCTION public.has_role(
    p_role_name TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT CASE
        WHEN (SELECT auth.uid()) IS NULL THEN false
        WHEN p_role_name IS NULL
          OR length(trim(p_role_name)) = 0 THEN false
        ELSE EXISTS (
            SELECT 1
            FROM public.user_roles AS ur
            JOIN public.app_roles AS ar
                ON ar.id = ur.role_id
            WHERE ur.user_id = (SELECT auth.uid())
              AND ar.name = p_role_name
        )
    END;
$$;

-- =========================================================
-- 2. Check whether the current user has a permission
-- =========================================================

CREATE OR REPLACE FUNCTION public.has_permission(
    p_permission_code TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT CASE
        WHEN (SELECT auth.uid()) IS NULL THEN false
        WHEN p_permission_code IS NULL
          OR length(trim(p_permission_code)) = 0 THEN false
        ELSE EXISTS (
            SELECT 1
            FROM public.user_roles AS ur
            JOIN public.app_roles AS ar
                ON ar.id = ur.role_id
            JOIN public.role_permissions AS rp
                ON rp.role_id = ar.id
            JOIN public.permissions AS p
                ON p.id = rp.permission_id
            WHERE ur.user_id = (SELECT auth.uid())
              AND p.code = p_permission_code
        )
    END;
$$;

-- =========================================================
-- 3. Check whether the current user is an active employee
-- =========================================================

CREATE OR REPLACE FUNCTION public.is_employee()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.employees AS e
        WHERE e.user_id = (SELECT auth.uid())
          AND e.employment_status = 'active'
    );
$$;

-- =========================================================
-- 4. Restrict function execution permissions
-- =========================================================

REVOKE ALL
ON FUNCTION public.has_role(TEXT)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.has_permission(TEXT)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.is_employee()
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.has_role(TEXT)
FROM anon;

REVOKE ALL
ON FUNCTION public.has_permission(TEXT)
FROM anon;

REVOKE ALL
ON FUNCTION public.is_employee()
FROM anon;

GRANT EXECUTE
ON FUNCTION public.has_role(TEXT)
TO authenticated;

GRANT EXECUTE
ON FUNCTION public.has_permission(TEXT)
TO authenticated;

GRANT EXECUTE
ON FUNCTION public.is_employee()
TO authenticated;

COMMIT;
