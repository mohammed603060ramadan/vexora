# VEXORA integration audit — 2026-10-27

## Scope and safety
This branch integrates targeted fixes for the student workspace, client dashboard, public course directory, admin services form, settings API, analytics page, and admin overview. It is a review candidate, not a claim that production passed acceptance testing.

No production database was modified. The companion SQL file is metadata-only and read-only. Do not apply schema-changing migrations until the live schema, migration history, RLS, and backup state have been reviewed.

## Repository findings and changes
1. The student workspace queried `projects.progress_percent`, while the repository's project type and known project migration do not define that column. The route now selects known project columns and returns `progress_percent: null` as a compatibility field.
2. Client account linkage has a legacy split: newer code uses `clients.auth_user_id`; the initial schema uses `clients.user_id`. The client dashboard retries the legacy link if the newer column is missing; the student workspace checks both identifiers.
3. The course directory retries narrower select lists when optional category/media columns are missing from the schema cache. Verify this against the actual database.
4. The admin services form sends nullable `department_id` and omits an empty `estimated_days`. The repository migration allows both to be null; confirm the deployed database matches.
5. Admin analytics and dashboard queries use explicit table cases instead of dynamic table names. Analytics still requires `service_requests` and appropriate admin read permissions.
6. The settings API validates the object payload, enforces a size limit, and checks `app_metadata.role === "admin"`. Verify the live `site_settings` table and RLS.

## End-to-end relationships to test
- Public contact/inquiry form → `inquiries` → admin inquiries → client creation; verify duplicate handling and source linkage.
- Client login → `profiles` and `clients` identity link → client dashboard → that client's projects/tasks/requests.
- Client project request → `project_requests` with correct `client_id` and `user_id` → admin review → same client's refreshed status.
- Admin project/task assignment → `projects` / `tasks.assigned_to` → student workspace API → task status updates limited to the assigned user.
- Admin course publish → `courses.status = 'published'` → public directory/detail/registration/access request → admin approval → `enrollments` and permitted `course_lessons`.
- Admin service/settings edits → persisted database row → public service catalogue/settings.
- Approved public projects/events → homepage and public directories, without exposing private client or project data.

## Forward migration added during follow-up review

A separate forward migration, `supabase/migrations/20261028101500_project_requests_client_link_compat.sql`, recreates the project-request client RLS policies using the account-link column that actually exists (`clients.auth_user_id` preferred, otherwise legacy `clients.user_id`). It fails closed if neither column exists. This is separate from the original migration so databases that already recorded the original migration can receive the policy fix.

The migration is committed to the review branch only. It has **not** been applied to the live Supabase project and still requires review against the read-only schema audit and normal migration procedure before production use.

## Live database inspection
Run `supabase/diagnostics/20261027_read_only_schema_audit.sql` in the intended Supabase project. It only reads PostgreSQL metadata. Compare expected table presence, columns/types/nullability/defaults, RLS status, policy predicates, foreign keys, and migration history.

Never commit or share service-role keys, passwords, customer records, or private row contents.

## Required acceptance checks before merge/deploy
- [ ] GitHub Actions ESLint and production build pass for the exact branch head.
- [ ] Read-only schema audit is run against the correct Supabase project.
- [ ] Expected tables/columns exist or have explicit, tested compatibility handling.
- [ ] Anonymous, normal client/student, and admin permissions are tested independently.
- [ ] A client cannot read another client's data; a student cannot update another user's task.
- [ ] Admin service create/edit works with null department and empty estimated duration.
- [ ] Settings GET/PUT, invalid JSON, oversized payload, anonymous caller, and non-admin caller are tested.
- [ ] Client login is tested with both supported account-link columns where applicable.
- [ ] Project request is tested from submission through admin status change and client refresh.
- [ ] Course publication, filters, details, access request, approval, enrollment, and lesson permissions are tested.
- [ ] Dashboard counts match known records; empty/error states are checked.
- [ ] Browser console, server logs, mobile layout, and production deployment are verified after merge.

## Limitations
Repository migrations do not prove that migrations are applied to live Supabase. No live database/RLS test or authenticated browser test is claimed here. Keep the checklist unchecked until each test is actually performed.
