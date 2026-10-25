# VEXORA Supabase Database Migrations

This directory is the version-controlled source for VEXORA's database schema changes.

## Before applying migrations

- Confirm the Supabase project URL matches the intended VEXORA environment.
- Take or verify a current database backup before production schema changes.
- Review the SQL against the live schema and check Supabase migration history first.
- Do not blindly execute every file in SQL Editor in a single batch. Some older migrations are explicitly marked LOCAL REVIEW ONLY and require validation before production deployment.
- Never commit Supabase service-role keys, database passwords, access tokens, or .env.local.

## Migration inventory

Apply migrations through the team's chosen Supabase migration workflow, in version order, after reviewing the notes in each file.

| Version | File | Scope |
|---|---|---|
| 202610170001 | 202610170001_initial_schema.sql | Initial schema |
| 202610170002 | 202610170002_organization.sql | Organization and roles |
| 202610170003 | 202610170003_clients_services.sql | Clients and services |
| 202610170004 | 202610170004_projects_tasks.sql | Projects and tasks |
| 202610170005 | 202610170005_finance.sql | Finance records |
| 202610170006 | 202610170006_academy.sql | Academy and course records |
| 202610170007 | 202610170007_support_notifications_audit.sql | Support, notifications and audit |
| 202610170008 | 202610170008_security_helpers.sql | Security helper functions |
| 202610170009 | 202610170009_seed_data.sql | Seed data |
| 202610170010–013 | Existing RLS and Academy policy migrations | Review their LOCAL REVIEW ONLY warnings before production use. |
| 202610190001 | 202610190001_site_settings.sql | Site settings |
| 202610240001 | 202610240001_student_registrations.sql | Student registrations |
| 202610240002 | 202610240002_course_categories_events.sql | Course categories, events and related policies |
| 202610240003 | 202610240003_admin_project_media_access.sql | Project media and access policies |
| 202610240004 | 202610240004_repair_projects_events_academy.sql | Project due date, public placement flags, event validation and schema-cache refresh |
| 20261025120000 | 20261025120000_client_auth_user_compat.sql | Safe compatibility link for client auth accounts |
| 20261025130000 | 20261025130000_course_access_workflow.sql | Paid course reference codes, admin approval, enrollment grants and lesson access policies |
| 202610240005 | 202610240005_admin_registry_and_manager_integrity.sql | Protected administrator registry used by manager administration |
| 20261025100000 | 20261025100000_project_requests.sql | Client project request tracking |

## Important verification notes

- GitHub stores migration files; it does not apply them to Supabase automatically.
- Before using student project requests, verify `20261025100000_project_requests.sql` is applied and the client account can be matched by `auth_user_id` or legacy `user_id`.
- Before using paid Academy course access, review and apply `20261025130000_course_access_workflow.sql` to the intended Supabase project. It adds course media fields, access requests, an approval-to-enrollment trigger, and a lesson visibility policy; verify the existing `lessons_read` policy and role permissions before applying in production.
- Before deploying 202610240004, verify the live projects table has the expected columns (id, title, description, status, deadline) and that existing RLS policies are compatible with public showcase access.
- Before deploying 202610240005, check whether public.vexora_admins already exists and whether the live manager API uses that table. The migration intentionally preserves existing registry rows.
- Test administrator invitation/removal, project save/media upload, event create/publish, and course create/publish against a non-production/test record before relying on production behavior.
- Use Supabase CLI migration commands only after the repository and linked project are confirmed and pending migrations have been reviewed. Do not reset the production database to make migration history match.

## Suggested post-deployment smoke tests

1. Create and edit a test project with a due date; verify no schema-cache error.
2. Create a draft event, set its date/time, save, then publish it and verify the selected homepage setting.
3. Create a course with each allowed category and verify the public directory only displays published courses.
4. Verify a non-admin cannot call protected manager API endpoints.
5. Confirm project media stays private unless explicitly exposed through approved public fields.
