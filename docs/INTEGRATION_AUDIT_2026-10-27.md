# VEXORA integration audit — 2026-10-27

## Scope and safety

This branch contains targeted compatibility fixes for the student workspace, client dashboard, public course directory, admin services form, settings API, analytics page, and admin overview. It is an integration candidate, not a declaration that production has passed acceptance testing.

No production database was modified by this audit. The companion SQL file is metadata-only and read-only. Do not run schema-changing migrations until the live schema, migration history, RLS, and backup state have been reviewed.

## Confirmed repository-level findings

1. The student workspace queried `projects.progress_percent`, while the repository's generated `projects` type and known project migration do not include that column. The student route now queries the known project columns and supplies `progress_percent: null` as a response compatibility field.
2. Client account linkage has a known legacy split: some schemas use `clients.auth_user_id`; the initial schema uses `clients.user_id`. The client dashboard integration retries the legacy link when the newer column is missing. The student workspace route also checks both identifiers.
3. The course directory now retries narrower select lists when optional course media/category columns are missing from the live schema cache. The UI still needs a real browser test against the target Supabase project.
4. The admin services form now sends an explicit nullable `department_id` and omits an empty `estimated_days`. The repository migration defines `department_id` with `ON DELETE SET NULL` and allows `estimated_days` to be null; confirm the deployed database matches this migration before accepting writes.
5. Admin analytics and dashboard queries use explicit table cases instead of a dynamic table name. Analytics still depends on `service_requests` existing and the admin account having the appropriate read policy.
6. The settings API validates that the request contains a JSON object, enforces a payload limit, and checks the authenticated user's `app_metadata.role`. The live `site_settings` table and RLS policy must still be verified in Supabase.

## Data flows that must be checked end-to-end

- Public contact/inquiry form → `inquiries` → admin inquiries page → client creation (verify duplicate handling and source linkage).
- Client login → `profiles` and `clients` identity link → client dashboard → client-owned projects/tasks/requests.
- Client project request → `project_requests` with the correct `client_id` and `user_id` → admin review → status visible to that same client only.
- Admin project/task assignment → `projects` / `tasks.assigned_to` → student workspace API → task status update restricted to the assigned user.
- Admin course publish → `courses.status = 'published'` → public course directory → course detail/registration/access request → admin approval → `enrollments` and permitted `course_lessons`.
- Admin services/settings changes → persisted database row → public service catalogue/site settings on the next read.
- Events/projects approved for public display → public homepage and directory, without exposing private client/project data.

## Live database inspection

Run `supabase/diagnostics/20261027_read_only_schema_audit.sql` in the intended Supabase project. It only reads PostgreSQL metadata. Save and compare the outputs for:
- expected table presence;
- column names, data types, nullability, and defaults;
- RLS enabled/forced status;
- exact policy predicates;
- foreign-key relationships;
- migration history (if the Supabase migration-history table is accessible).

Do not paste secrets, service-role keys, passwords, customer data, or full private row contents into GitHub or chat.

## Required acceptance checks before merge/deploy

- [ ] Latest GitHub Actions ESLint and production build pass for this exact branch head.
- [ ] Read-only schema audit has been run against the correct Supabase project.
- [ ] Verify every expected table/column exists or has an explicit, tested compatibility path.
- [ ] Test anonymous, normal client/student, and admin permissions independently; confirm users cannot read another client's records or update another user's task.
- [ ] Test admin service create/edit with a null department and an empty estimated duration.
- [ ] Test settings GET/PUT, invalid JSON, oversized payload, unauthenticated caller, and non-admin caller.
- [ ] Test client login when linked by `auth_user_id` and when using the legacy `user_id` schema.
- [ ] Test project requests from creation through admin status change and client refresh.
- [ ] Test course publication, filters, details, registration/access request, approval, enrollment, and lesson access.
- [ ] Test dashboard counts against known records and check error/empty states.
- [ ] Verify browser console, server logs, mobile layout, and production deployment after merge.

## Explicit limitations

GitHub source and migration files do not prove that a migration has been applied to the live Supabase project. No production smoke test, authenticated browser test, or live RLS test is claimed by this document. Keep this checklist unchecked until a person or automated test has actually performed each step.
