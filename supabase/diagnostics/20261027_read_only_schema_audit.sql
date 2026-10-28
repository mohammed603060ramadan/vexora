-- VEXORA read-only database audit (2026-10-27)
-- SAFE: metadata-only SELECTs. This file does not change tables, policies, or data.
-- Run in the SQL Editor for the intended Supabase project and save results securely.

-- 1) Presence, row-level security, and forced RLS for application tables.
WITH expected(table_name) AS (
  VALUES ('clients'), ('profiles'), ('projects'), ('project_requests'), ('tasks'),
    ('courses'), ('course_lessons'), ('enrollments'), ('course_access_requests'),
    ('student_registrations'), ('services'), ('departments'), ('site_settings'),
    ('events'), ('inquiries'), ('service_requests'), ('vexora_admins'),
    ('notifications'), ('messages'), ('contracts'), ('quotations')
)
SELECT e.table_name, (c.oid IS NOT NULL) AS table_exists,
       COALESCE(c.relrowsecurity, false) AS rls_enabled,
       COALESCE(c.relforcerowsecurity, false) AS rls_forced
FROM expected e
LEFT JOIN pg_namespace n ON n.nspname = 'public'
LEFT JOIN pg_class c ON c.relnamespace = n.oid
 AND c.relname = e.table_name AND c.relkind IN ('r', 'p')
ORDER BY e.table_name;

-- 2) Actual column names/types/nullability/defaults.
SELECT table_name, ordinal_position, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
 AND table_name IN ('clients','profiles','projects','project_requests','tasks','courses',
 'course_lessons','enrollments','course_access_requests','student_registrations','services',
 'departments','site_settings','events','inquiries','service_requests','vexora_admins',
 'notifications','messages','contracts','quotations')
ORDER BY table_name, ordinal_position;

-- 3) RLS policies and exact predicates.
SELECT schemaname, tablename, policyname, permissive, roles, cmd,
       qual AS using_expression, with_check AS check_expression
FROM pg_policies
WHERE schemaname = 'public'
 AND tablename IN ('clients','profiles','projects','project_requests','tasks','courses',
 'course_lessons','enrollments','course_access_requests','student_registrations','services',
 'departments','site_settings','events','inquiries','service_requests','vexora_admins',
 'notifications','messages','contracts','quotations')
ORDER BY tablename, policyname;

-- 4) Foreign keys for major workflows.
SELECT tc.table_name, kcu.column_name, ccu.table_name AS referenced_table,
       ccu.column_name AS referenced_column, rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
 ON tc.constraint_name = kcu.constraint_name AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.constraint_column_usage ccu
 ON ccu.constraint_name = tc.constraint_name AND ccu.constraint_schema = tc.constraint_schema
JOIN information_schema.referential_constraints rc
 ON rc.constraint_name = tc.constraint_name AND rc.constraint_schema = tc.constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
 AND tc.table_name IN ('clients','profiles','projects','project_requests','tasks','courses',
 'course_lessons','enrollments','course_access_requests','student_registrations','services',
 'departments','site_settings','events','inquiries','service_requests','vexora_admins')
ORDER BY tc.table_name, kcu.column_name;

-- 5) Optional migration history check.
-- Run this separately only if the metadata table exists and is readable.
-- Keeping it separate prevents a missing/inaccessible Supabase metadata table
-- from making the main schema/RLS audit batch report an avoidable SQL error.
-- If unavailable, inspect migration history in the Supabase dashboard instead.
-- SELECT version, name
-- FROM supabase_migrations.schema_migrations
-- ORDER BY version DESC LIMIT 50;
