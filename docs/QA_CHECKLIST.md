# VEXORA Project QA Checklist

Audit checklist for `audit/vexora-hardening-2026-10`. This is a tracking checklist, not a claim that every item has passed.

## Automated validation
- [ ] GitHub Actions ESLint passes on the latest commit.
- [ ] GitHub Actions production build passes on the latest commit.
- [ ] Supabase migration `202610250001_portfolio_categories_and_storage_admin.sql` has been reviewed and applied to the intended project.
- [ ] Supabase migration `20261026100000_restore_public_published_course_read.sql` has been reviewed and applied to the intended project; verify anonymous users can read published course metadata but cannot read protected lessons.
- [ ] Confirm deployed environment contains `SUPABASE_SERVICE_ROLE_KEY` and Supabase URL/anon key; never expose service-role key to client code.

## Route-by-route manual smoke tests
- [ ] `/` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/about` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/academy` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/academy/[slug]` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/academy/categories` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/academy/courses` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/account/security` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin-login` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/academy` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/analytics` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/clients` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/contracts` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/contracts/[id]` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/events` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/finance` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/finance/[section]` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/inquiries` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/managers` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/messages` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/news` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/pages` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/portfolio` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/projects` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/quotations` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/registrations` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/reports` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/service-requests` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/services` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/settings` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/tasks` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/team` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/admin/users` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/client` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/contact` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/events` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/login` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/portfolio` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/privacy` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/projects` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/register/[type]` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/services` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/services/cybersecurity` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/services/data-analytics` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/services/digital-marketing` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/services/networks-infrastructure` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/services/software-development` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.
- [ ] `/student` — load without console errors; test visible links, forms, loading/error/empty states, mobile layout, and permissions.

## Authentication and authorization
- [ ] Anonymous visitor can browse `/academy`, `/academy/categories`, `/academy/courses`, `/portfolio`, `/projects`, and `/`.
- [ ] Course registration validates inputs, submits successfully, and displays a success/error state.
- [ ] Non-admin users cannot open protected `/admin/*` routes or call `/api/admin/*` endpoints.
- [ ] An administrator can create an admin account with a 12+ character initial password, list admins, and remove privileges from another admin.
- [ ] The last administrator and the currently signed-in administrator cannot be removed through the manager page.

## Academy
- [ ] Five category cards navigate to the correct filtered course directory.
- [ ] Published Supabase courses replace the preview catalogue automatically.
- [ ] Search, category filters, format filters, course details, registration, modal close/Escape, and certificate print work.
- [ ] Admin creates/edits/publishes a course; verify it appears in the public catalogue under its selected category.

## Portfolio and storage
- [ ] Admin uploads an image and a video within allowed limits; both metadata and storage objects are created.
- [ ] Upload failure shows a useful error and cleans up partial uploads.
- [ ] Only explicitly approved projects with status `in_progress` or `completed` appear publicly.
- [ ] Public portfolio shows the correct five categories and valid signed image/video URLs.
- [ ] Private projects and unrelated client data remain inaccessible to anonymous visitors.

## Homepage, projects, events, and database
- [ ] Homepage events query succeeds with actual deployed `events` columns and only published/featured items are displayed.
- [ ] Homepage featured projects and `/projects` public directory show only explicitly approved projects.
- [ ] Admin create/update/delete actions persist and refresh correctly for projects, courses, events, clients, inquiries, tasks, and media.
- [ ] RLS is tested using anonymous, ordinary authenticated, and admin accounts; do not treat table grants alone as proof of access.

## Final acceptance
- [ ] Test at desktop and mobile widths.
- [ ] Verify browser console and server logs are free of runtime errors.
- [ ] Verify production deployment and Supabase migration state after automated checks pass.
