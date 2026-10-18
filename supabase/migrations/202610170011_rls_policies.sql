
-- =========================================================
-- VEXORA Platform
-- Migration 011: Row Level Security Policies
-- LOCAL REVIEW ONLY. DO NOT DEPLOY YET.
-- =========================================================

BEGIN;

-- ---------------------------------------------------------
-- SECURITY-DEFINER HELPERS
-- These functions avoid policy recursion when checking
-- client ownership, project membership, and ticket access.
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION public.owns_client(p_client_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.clients c
        WHERE c.id = p_client_id
          AND c.user_id = (SELECT auth.uid())
    );
$$;

CREATE OR REPLACE FUNCTION public.can_access_project(p_project_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT CASE
        WHEN (SELECT auth.uid()) IS NULL THEN false
        ELSE
            public.has_permission('projects.view')
            OR public.has_permission('projects.manage')
            OR EXISTS (
                SELECT 1
                FROM public.projects p
                WHERE p.id = p_project_id
                  AND (
                      p.project_manager_id = (SELECT auth.uid())
                      OR p.created_by = (SELECT auth.uid())
                      OR public.owns_client(p.client_id)
                      OR EXISTS (
                          SELECT 1
                          FROM public.project_members pm
                          WHERE pm.project_id = p.id
                            AND pm.user_id = (SELECT auth.uid())
                      )
                  )
            )
    END;
$$;

CREATE OR REPLACE FUNCTION public.can_access_ticket(p_ticket_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT CASE
        WHEN (SELECT auth.uid()) IS NULL THEN false
        ELSE
            public.has_permission('support.manage')
            OR EXISTS (
                SELECT 1
                FROM public.support_tickets t
                WHERE t.id = p_ticket_id
                  AND (
                      t.created_by = (SELECT auth.uid())
                      OR t.assigned_to = (SELECT auth.uid())
                      OR public.owns_client(t.client_id)
                  )
            )
    END;
$$;

REVOKE ALL ON FUNCTION public.owns_client(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_access_project(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_access_ticket(UUID) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.owns_client(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_project(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_ticket(UUID) TO authenticated;

-- ---------------------------------------------------------
-- ORGANIZATION AND ACCESS CONTROL
-- ---------------------------------------------------------

CREATE POLICY departments_read ON public.departments
FOR SELECT TO authenticated
USING (
    public.is_employee()
    OR public.has_permission('departments.view')
);

CREATE POLICY departments_manage ON public.departments
FOR ALL TO authenticated
USING (public.has_permission('departments.manage'))
WITH CHECK (public.has_permission('departments.manage'));

CREATE POLICY app_roles_read ON public.app_roles
FOR SELECT TO authenticated
USING (public.has_permission('roles.view'));

CREATE POLICY app_roles_manage ON public.app_roles
FOR ALL TO authenticated
USING (public.has_permission('roles.manage'))
WITH CHECK (public.has_permission('roles.manage'));

CREATE POLICY permissions_read ON public.permissions
FOR SELECT TO authenticated
USING (public.has_permission('roles.view'));

CREATE POLICY permissions_manage ON public.permissions
FOR ALL TO authenticated
USING (public.has_permission('roles.manage'))
WITH CHECK (public.has_permission('roles.manage'));

CREATE POLICY role_permissions_read ON public.role_permissions
FOR SELECT TO authenticated
USING (public.has_permission('roles.view'));

CREATE POLICY role_permissions_manage ON public.role_permissions
FOR ALL TO authenticated
USING (public.has_permission('roles.manage'))
WITH CHECK (public.has_permission('roles.manage'));

CREATE POLICY employees_read ON public.employees
FOR SELECT TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR public.has_permission('users.view')
);

CREATE POLICY employees_manage ON public.employees
FOR ALL TO authenticated
USING (public.has_permission('users.manage'))
WITH CHECK (public.has_permission('users.manage'));

CREATE POLICY user_roles_read ON public.user_roles
FOR SELECT TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR public.has_permission('roles.view')
);

CREATE POLICY user_roles_manage ON public.user_roles
FOR ALL TO authenticated
USING (public.has_permission('roles.manage'))
WITH CHECK (public.has_permission('roles.manage'));

-- ---------------------------------------------------------
-- CLIENTS, SERVICES, REQUESTS, QUOTATIONS, CONTRACTS
-- ---------------------------------------------------------

CREATE POLICY clients_read ON public.clients
FOR SELECT TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR public.has_permission('clients.view')
);

CREATE POLICY clients_manage ON public.clients
FOR ALL TO authenticated
USING (public.has_permission('clients.manage'))
WITH CHECK (public.has_permission('clients.manage'));

CREATE POLICY services_public_read ON public.services
FOR SELECT TO anon, authenticated
USING (
    status = 'active'
    OR (
        (SELECT auth.uid()) IS NOT NULL
        AND public.has_permission('services.view')
    )
);

CREATE POLICY services_manage ON public.services
FOR ALL TO authenticated
USING (public.has_permission('services.manage'))
WITH CHECK (public.has_permission('services.manage'));

CREATE POLICY service_requests_read ON public.service_requests
FOR SELECT TO authenticated
USING (
    public.owns_client(client_id)
    OR public.has_permission('requests.view')
    OR public.has_permission('requests.manage')
);

CREATE POLICY service_requests_client_create ON public.service_requests
FOR INSERT TO authenticated
WITH CHECK (public.owns_client(client_id));

CREATE POLICY service_requests_staff_manage ON public.service_requests
FOR UPDATE TO authenticated
USING (public.has_permission('requests.manage'))
WITH CHECK (public.has_permission('requests.manage'));

CREATE POLICY service_requests_staff_delete ON public.service_requests
FOR DELETE TO authenticated
USING (public.has_permission('requests.manage'));

CREATE POLICY quotations_read ON public.quotations
FOR SELECT TO authenticated
USING (
    public.owns_client(client_id)
    OR public.has_permission('quotations.view')
    OR public.has_permission('quotations.manage')
);

CREATE POLICY quotations_manage ON public.quotations
FOR ALL TO authenticated
USING (public.has_permission('quotations.manage'))
WITH CHECK (public.has_permission('quotations.manage'));

CREATE POLICY quotation_items_read ON public.quotation_items
FOR SELECT TO authenticated
USING (
    public.has_permission('quotations.view')
    OR public.has_permission('quotations.manage')
    OR EXISTS (
        SELECT 1
        FROM public.quotations q
        WHERE q.id = quotation_id
          AND public.owns_client(q.client_id)
    )
);

CREATE POLICY quotation_items_manage ON public.quotation_items
FOR ALL TO authenticated
USING (public.has_permission('quotations.manage'))
WITH CHECK (public.has_permission('quotations.manage'));

CREATE POLICY contracts_read ON public.contracts
FOR SELECT TO authenticated
USING (
    public.owns_client(client_id)
    OR public.has_permission('contracts.view')
    OR public.has_permission('contracts.manage')
);

CREATE POLICY contracts_manage ON public.contracts
FOR ALL TO authenticated
USING (public.has_permission('contracts.manage'))
WITH CHECK (public.has_permission('contracts.manage'));

-- ---------------------------------------------------------
-- PROJECTS AND TASKS
-- ---------------------------------------------------------

CREATE POLICY projects_read ON public.projects
FOR SELECT TO authenticated
USING (public.can_access_project(id));

CREATE POLICY projects_manage ON public.projects
FOR ALL TO authenticated
USING (public.has_permission('projects.manage'))
WITH CHECK (public.has_permission('projects.manage'));

CREATE POLICY project_members_read ON public.project_members
FOR SELECT TO authenticated
USING (public.can_access_project(project_id));

CREATE POLICY project_members_manage ON public.project_members
FOR ALL TO authenticated
USING (public.has_permission('projects.manage'))
WITH CHECK (public.has_permission('projects.manage'));

CREATE POLICY project_milestones_read ON public.project_milestones
FOR SELECT TO authenticated
USING (public.can_access_project(project_id));

CREATE POLICY project_milestones_manage ON public.project_milestones
FOR ALL TO authenticated
USING (public.has_permission('projects.manage'))
WITH CHECK (public.has_permission('projects.manage'));

CREATE POLICY tasks_read ON public.tasks
FOR SELECT TO authenticated
USING (
    public.can_access_project(project_id)
    OR assigned_to = (SELECT auth.uid())
);

CREATE POLICY tasks_create ON public.tasks
FOR INSERT TO authenticated
WITH CHECK (
    public.has_permission('tasks.manage')
    OR (
        created_by = (SELECT auth.uid())
        AND public.can_access_project(project_id)
    )
);

CREATE POLICY tasks_update ON public.tasks
FOR UPDATE TO authenticated
USING (
    public.has_permission('tasks.manage')
    OR assigned_to = (SELECT auth.uid())
)
WITH CHECK (
    public.has_permission('tasks.manage')
    OR assigned_to = (SELECT auth.uid())
);

CREATE POLICY tasks_delete ON public.tasks
FOR DELETE TO authenticated
USING (public.has_permission('tasks.manage'));

CREATE POLICY task_comments_read ON public.task_comments
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.tasks t
        WHERE t.id = task_id
          AND public.can_access_project(t.project_id)
    )
);

CREATE POLICY task_comments_create ON public.task_comments
FOR INSERT TO authenticated
WITH CHECK (
    author_id = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1
        FROM public.tasks t
        WHERE t.id = task_id
          AND public.can_access_project(t.project_id)
    )
);

CREATE POLICY task_comments_manage ON public.task_comments
FOR UPDATE TO authenticated
USING (
    author_id = (SELECT auth.uid())
    OR public.has_permission('tasks.manage')
)
WITH CHECK (
    author_id = (SELECT auth.uid())
    OR public.has_permission('tasks.manage')
);

CREATE POLICY task_comments_delete ON public.task_comments
FOR DELETE TO authenticated
USING (
    author_id = (SELECT auth.uid())
    OR public.has_permission('tasks.manage')
);

CREATE POLICY project_updates_read ON public.project_updates
FOR SELECT TO authenticated
USING (public.can_access_project(project_id));

CREATE POLICY project_updates_create ON public.project_updates
FOR INSERT TO authenticated
WITH CHECK (
    author_id = (SELECT auth.uid())
    AND public.can_access_project(project_id)
);

CREATE POLICY project_updates_manage ON public.project_updates
FOR UPDATE TO authenticated
USING (public.has_permission('projects.manage'))
WITH CHECK (public.has_permission('projects.manage'));

CREATE POLICY project_updates_delete ON public.project_updates
FOR DELETE TO authenticated
USING (public.has_permission('projects.manage'));

CREATE POLICY project_resources_read ON public.project_resources
FOR SELECT TO authenticated
USING (public.can_access_project(project_id));

CREATE POLICY project_resources_create ON public.project_resources
FOR INSERT TO authenticated
WITH CHECK (
    uploaded_by = (SELECT auth.uid())
    AND public.can_access_project(project_id)
);

CREATE POLICY project_resources_manage ON public.project_resources
FOR UPDATE TO authenticated
USING (
    uploaded_by = (SELECT auth.uid())
    OR public.has_permission('projects.manage')
)
WITH CHECK (
    uploaded_by = (SELECT auth.uid())
    OR public.has_permission('projects.manage')
);

CREATE POLICY project_resources_delete ON public.project_resources
FOR DELETE TO authenticated
USING (public.has_permission('projects.manage'));

-- ---------------------------------------------------------
-- FINANCE
-- Client roles can read their own invoices and payments.
-- Financial writes remain restricted to finance.manage.
-- ---------------------------------------------------------

CREATE POLICY invoices_read ON public.invoices
FOR SELECT TO authenticated
USING (
    public.owns_client(client_id)
    OR public.has_permission('finance.view')
    OR public.has_permission('finance.manage')
);

CREATE POLICY invoices_manage ON public.invoices
FOR ALL TO authenticated
USING (public.has_permission('finance.manage'))
WITH CHECK (public.has_permission('finance.manage'));

CREATE POLICY invoice_items_read ON public.invoice_items
FOR SELECT TO authenticated
USING (
    public.has_permission('finance.view')
    OR public.has_permission('finance.manage')
    OR EXISTS (
        SELECT 1
        FROM public.invoices i
        WHERE i.id = invoice_id
          AND public.owns_client(i.client_id)
    )
);

CREATE POLICY invoice_items_manage ON public.invoice_items
FOR ALL TO authenticated
USING (public.has_permission('finance.manage'))
WITH CHECK (public.has_permission('finance.manage'));

CREATE POLICY payments_read ON public.payments
FOR SELECT TO authenticated
USING (
    public.owns_client(client_id)
    OR public.has_permission('finance.view')
    OR public.has_permission('finance.manage')
);

CREATE POLICY payments_manage ON public.payments
FOR ALL TO authenticated
USING (public.has_permission('finance.manage'))
WITH CHECK (public.has_permission('finance.manage'));

CREATE POLICY expense_categories_read ON public.expense_categories
FOR SELECT TO authenticated
USING (
    public.has_permission('finance.view')
    OR public.has_permission('finance.manage')
);

CREATE POLICY expense_categories_manage ON public.expense_categories
FOR ALL TO authenticated
USING (public.has_permission('finance.manage'))
WITH CHECK (public.has_permission('finance.manage'));

CREATE POLICY expenses_read ON public.expenses
FOR SELECT TO authenticated
USING (
    public.has_permission('finance.view')
    OR public.has_permission('finance.manage')
);

CREATE POLICY expenses_manage ON public.expenses
FOR ALL TO authenticated
USING (public.has_permission('finance.manage'))
WITH CHECK (public.has_permission('finance.manage'));

-- ---------------------------------------------------------
-- ACADEMY
-- Published course material can be read publicly.
-- Student records remain scoped to the signed-in student.
-- ---------------------------------------------------------

CREATE POLICY courses_read ON public.courses
FOR SELECT TO anon, authenticated
USING (
    status = 'published'
    OR (
        (SELECT auth.uid()) IS NOT NULL
        AND (
            public.has_permission('academy.manage')
            OR instructor_id = (SELECT auth.uid())
        )
    )
);

CREATE POLICY courses_manage ON public.courses
FOR ALL TO authenticated
USING (
    public.has_permission('academy.manage')
    OR instructor_id = (SELECT auth.uid())
)
WITH CHECK (
    public.has_permission('academy.manage')
    OR instructor_id = (SELECT auth.uid())
);

CREATE POLICY course_sections_read ON public.course_sections
FOR SELECT TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = course_id
          AND c.status = 'published'
    )
    OR (
        (SELECT auth.uid()) IS NOT NULL
        AND public.has_permission('academy.manage')
    )
);

CREATE POLICY course_sections_manage ON public.course_sections
FOR ALL TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

CREATE POLICY lessons_read ON public.lessons
FOR SELECT TO anon, authenticated
USING (
    (
        status = 'published'
        AND EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = course_id
              AND c.status = 'published'
        )
    )
    OR (
        is_preview = true
        AND status = 'published'
    )
    OR (
        (SELECT auth.uid()) IS NOT NULL
        AND public.has_permission('academy.manage')
    )
);

CREATE POLICY lessons_manage ON public.lessons
FOR ALL TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

CREATE POLICY enrollments_read ON public.enrollments
FOR SELECT TO authenticated
USING (
    student_id = (SELECT auth.uid())
    OR public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
);

CREATE POLICY enrollments_create ON public.enrollments
FOR INSERT TO authenticated
WITH CHECK (
    public.has_permission('academy.manage')
    OR (
        student_id = (SELECT auth.uid())
        AND EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = course_id
              AND c.status = 'published'
        )
    )
);

CREATE POLICY enrollments_manage ON public.enrollments
FOR UPDATE TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

CREATE POLICY enrollments_delete ON public.enrollments
FOR DELETE TO authenticated
USING (public.has_permission('academy.manage'));

CREATE POLICY lesson_progress_read ON public.lesson_progress
FOR SELECT TO authenticated
USING (
    student_id = (SELECT auth.uid())
    OR public.has_permission('academy.manage')
);

CREATE POLICY lesson_progress_create ON public.lesson_progress
FOR INSERT TO authenticated
WITH CHECK (
    student_id = (SELECT auth.uid())
    OR public.has_permission('academy.manage')
);

CREATE POLICY lesson_progress_update ON public.lesson_progress
FOR UPDATE TO authenticated
USING (
    student_id = (SELECT auth.uid())
    OR public.has_permission('academy.manage')
)
WITH CHECK (
    student_id = (SELECT auth.uid())
    OR public.has_permission('academy.manage')
);

CREATE POLICY lesson_progress_delete ON public.lesson_progress
FOR DELETE TO authenticated
USING (public.has_permission('academy.manage'));

CREATE POLICY assessments_read ON public.assessments
FOR SELECT TO authenticated
USING (
    status = 'published'
    OR public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
);

CREATE POLICY assessments_manage ON public.assessments
FOR ALL TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

CREATE POLICY assessment_questions_read ON public.assessment_questions
FOR SELECT TO authenticated
USING (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1 FROM public.assessments a
        WHERE a.id = assessment_id
          AND a.status = 'published'
    )
);

CREATE POLICY assessment_questions_manage ON public.assessment_questions
FOR ALL TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

CREATE POLICY assessment_attempts_read ON public.assessment_attempts
FOR SELECT TO authenticated
USING (
    student_id = (SELECT auth.uid())
    OR public.has_permission('academy.manage')
    OR graded_by = (SELECT auth.uid())
);

CREATE POLICY assessment_attempts_create ON public.assessment_attempts
FOR INSERT TO authenticated
WITH CHECK (
    student_id = (SELECT auth.uid())
    AND status = 'in_progress'
    AND score IS NULL
    AND passed IS NULL
    AND graded_by IS NULL
    AND graded_at IS NULL
);

CREATE POLICY assessment_attempts_student_update ON public.assessment_attempts
FOR UPDATE TO authenticated
USING (
    student_id = (SELECT auth.uid())
    AND status = 'in_progress'
)
WITH CHECK (
    student_id = (SELECT auth.uid())
    AND status IN ('in_progress', 'submitted')
    AND score IS NULL
    AND passed IS NULL
    AND graded_by IS NULL
    AND graded_at IS NULL
);

CREATE POLICY assessment_attempts_grade ON public.assessment_attempts
FOR UPDATE TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

CREATE POLICY course_certificates_read ON public.course_certificates
FOR SELECT TO authenticated
USING (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1 FROM public.enrollments e
        WHERE e.id = enrollment_id
          AND e.student_id = (SELECT auth.uid())
    )
);

CREATE POLICY course_certificates_manage ON public.course_certificates
FOR ALL TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

-- ---------------------------------------------------------
-- SUPPORT, NOTIFICATIONS, AUDIT
-- ---------------------------------------------------------

CREATE POLICY support_tickets_read ON public.support_tickets
FOR SELECT TO authenticated
USING (public.can_access_ticket(id));

CREATE POLICY support_tickets_create ON public.support_tickets
FOR INSERT TO authenticated
WITH CHECK (
    created_by = (SELECT auth.uid())
    AND (
        client_id IS NULL
        OR public.owns_client(client_id)
    )
);

CREATE POLICY support_tickets_manage ON public.support_tickets
FOR UPDATE TO authenticated
USING (public.has_permission('support.manage'))
WITH CHECK (public.has_permission('support.manage'));

CREATE POLICY support_tickets_delete ON public.support_tickets
FOR DELETE TO authenticated
USING (public.has_permission('support.manage'));

CREATE POLICY support_ticket_replies_read ON public.support_ticket_replies
FOR SELECT TO authenticated
USING (
    public.can_access_ticket(ticket_id)
    AND (
        is_internal = false
        OR public.has_permission('support.manage')
    )
);

CREATE POLICY support_ticket_replies_create ON public.support_ticket_replies
FOR INSERT TO authenticated
WITH CHECK (
    author_user_id = (SELECT auth.uid())
    AND (
        (
            is_internal = false
            AND public.can_access_ticket(ticket_id)
        )
        OR public.has_permission('support.manage')
    )
);

CREATE POLICY support_ticket_replies_manage ON public.support_ticket_replies
FOR UPDATE TO authenticated
USING (public.has_permission('support.manage'))
WITH CHECK (public.has_permission('support.manage'));

CREATE POLICY support_ticket_replies_delete ON public.support_ticket_replies
FOR DELETE TO authenticated
USING (public.has_permission('support.manage'));

CREATE POLICY notifications_read ON public.notifications
FOR SELECT TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR public.has_permission('users.manage')
);

CREATE POLICY notifications_update ON public.notifications
FOR UPDATE TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY audit_logs_read ON public.audit_logs
FOR SELECT TO authenticated
USING (public.has_permission('audit.view'));

-- Intentionally no client-facing INSERT, UPDATE, or DELETE
-- policies for audit_logs. Writes should use a trusted server
-- or a separately reviewed SECURITY DEFINER audit function.

COMMIT;
