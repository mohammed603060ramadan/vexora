
-- =========================================================
-- VEXORA Platform
-- Migration 009: Initial Reference Data
-- PostgreSQL / Supabase
-- =========================================================

BEGIN;

-- ---------------------------------------------------------
-- 1. Company Departments
-- Insert missing departments only.
-- Preserve existing department descriptions and settings.
-- ---------------------------------------------------------

INSERT INTO public.departments (name, description)
VALUES
    (
        'Software Development',
        'Websites, web applications and custom software.'
    ),
    (
        'Cybersecurity',
        'Security assessments, risk analysis and protection.'
    ),
    (
        'Networks & Infrastructure',
        'Networking, infrastructure and IT solutions.'
    ),
    (
        'Data Analytics',
        'Data analysis, reporting and business insights.'
    ),
    (
        'Digital Marketing',
        'Digital strategy, campaigns and optimization.'
    )
ON CONFLICT (name) DO NOTHING;

-- ---------------------------------------------------------
-- 2. Application Roles
-- Insert missing roles only.
-- ---------------------------------------------------------

INSERT INTO public.app_roles (name, description)
VALUES
    ('super_admin', 'Full platform administration access.'),
    ('admin', 'Administrative access to authorized areas.'),
    ('department_manager', 'Manages an assigned department.'),
    ('employee', 'Internal team member access.'),
    ('client', 'Client access to authorized records.'),
    ('instructor', 'Manages assigned courses and lessons.'),
    ('student', 'Accesses enrolled courses and assessments.')
ON CONFLICT (name) DO NOTHING;

-- ---------------------------------------------------------
-- 3. Permissions
-- Insert missing permissions only.
-- ---------------------------------------------------------

INSERT INTO public.permissions (code, description)
VALUES
    ('dashboard.view', 'View the platform dashboard.'),
    ('users.view', 'View authorized user records.'),
    ('users.manage', 'Manage users and employee records.'),
    ('roles.view', 'View application roles.'),
    ('roles.manage', 'Manage roles and assignments.'),
    ('departments.view', 'View company departments.'),
    ('departments.manage', 'Manage company departments.'),
    ('clients.view', 'View authorized client records.'),
    ('clients.manage', 'Manage client records.'),
    ('services.view', 'View the service catalog.'),
    ('services.manage', 'Manage services.'),
    ('requests.view', 'View authorized service requests.'),
    ('requests.manage', 'Manage service requests.'),
    ('quotations.view', 'View authorized quotations.'),
    ('quotations.manage', 'Manage quotations.'),
    ('contracts.view', 'View authorized contracts.'),
    ('contracts.manage', 'Manage contracts.'),
    ('projects.view', 'View authorized projects.'),
    ('projects.manage', 'Manage projects and project teams.'),
    ('tasks.view', 'View authorized tasks.'),
    ('tasks.manage', 'Manage tasks and assignments.'),
    ('finance.view', 'View authorized financial records.'),
    ('finance.manage', 'Manage invoices, payments and expenses.'),
    ('academy.manage', 'Manage courses and learning content.'),
    ('support.manage', 'Manage support tickets.'),
    ('audit.view', 'View audit logs.')
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------
-- 4. Super Admin Role Permissions
-- Add all currently defined permissions to super_admin.
-- ---------------------------------------------------------

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.app_roles AS r
CROSS JOIN public.permissions AS p
WHERE r.name = 'super_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ---------------------------------------------------------
-- 5. Admin Role Permissions
-- Add the defined administrative permission set.
-- ---------------------------------------------------------

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.app_roles AS r
JOIN public.permissions AS p
    ON p.code IN (
        'dashboard.view',
        'users.view',
        'users.manage',
        'roles.view',
        'departments.view',
        'departments.manage',
        'clients.view',
        'clients.manage',
        'services.view',
        'services.manage',
        'requests.view',
        'requests.manage',
        'quotations.view',
        'quotations.manage',
        'contracts.view',
        'contracts.manage',
        'projects.view',
        'projects.manage',
        'tasks.view',
        'tasks.manage',
        'finance.view',
        'finance.manage',
        'academy.manage',
        'support.manage'
    )
WHERE r.name = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ---------------------------------------------------------
-- 6. Initial Service Catalog
-- Insert missing services and synchronize the designated
-- reference fields for services with matching slugs.
-- Preserve IDs, prices and estimated delivery times.
-- ---------------------------------------------------------

INSERT INTO public.services (
    department_id,
    slug,
    name,
    description,
    currency,
    display_order
)
SELECT
    d.id,
    lower(
        regexp_replace(
            s.name,
            '[^a-zA-Z0-9]+',
            '-',
            'g'
        )
    ) AS slug,
    s.name,
    s.description,
    'USD',
    s.display_order
FROM (
    VALUES
        (
            'Software Development',
            'Web Development',
            'Design and development of modern business websites.',
            1
        ),
        (
            'Software Development',
            'Web Applications',
            'Custom web applications for business workflows.',
            2
        ),
        (
            'Software Development',
            'Custom Software',
            'Software solutions for specific business needs.',
            3
        ),
        (
            'Cybersecurity',
            'Security Assessment',
            'Assessment of systems and applications for security risks.',
            4
        ),
        (
            'Cybersecurity',
            'Risk Analysis',
            'Identification and evaluation of technology risks.',
            5
        ),
        (
            'Cybersecurity',
            'Security Protection',
            'Security improvements and protection planning.',
            6
        ),
        (
            'Networks & Infrastructure',
            'Network Solutions',
            'Network planning, configuration and troubleshooting.',
            7
        ),
        (
            'Networks & Infrastructure',
            'IT Infrastructure',
            'Infrastructure planning and implementation services.',
            8
        ),
        (
            'Data Analytics',
            'Data Analysis',
            'Analysis of business data for better decisions.',
            9
        ),
        (
            'Data Analytics',
            'Business Reporting',
            'Reports and dashboards for business performance.',
            10
        ),
        (
            'Digital Marketing',
            'Digital Strategy',
            'Digital marketing strategy and campaign planning.',
            11
        ),
        (
            'Digital Marketing',
            'Campaign Optimization',
            'Campaign monitoring and performance optimization.',
            12
        )
) AS s(department_name, name, description, display_order)
JOIN public.departments AS d
    ON d.name = s.department_name
ON CONFLICT (slug) DO UPDATE
SET
    department_id = EXCLUDED.department_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    currency = EXCLUDED.currency,
    display_order = EXCLUDED.display_order,
    updated_at = now();

COMMIT;
