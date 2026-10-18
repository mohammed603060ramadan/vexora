BEGIN;

-- VEXORA Academy: only users with academy.manage
-- can create, update, or delete academy content.

-- 1. Courses
DROP POLICY IF EXISTS courses_manage ON public.courses;

CREATE POLICY courses_manage
ON public.courses
FOR ALL TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

-- 2. Course sections
DROP POLICY IF EXISTS course_sections_manage ON public.course_sections;

CREATE POLICY course_sections_manage
ON public.course_sections
FOR ALL TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

-- 3. Lessons
DROP POLICY IF EXISTS lessons_manage ON public.lessons;

CREATE POLICY lessons_manage
ON public.lessons
FOR ALL TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

-- 4. Assessments
DROP POLICY IF EXISTS assessments_manage ON public.assessments;

CREATE POLICY assessments_manage
ON public.assessments
FOR ALL TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

-- 5. Assessment questions
DROP POLICY IF EXISTS assessment_questions_manage
ON public.assessment_questions;

CREATE POLICY assessment_questions_manage
ON public.assessment_questions
FOR ALL TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

-- 6. Only admins can grade or modify submitted attempts
DROP POLICY IF EXISTS assessment_attempts_grade
ON public.assessment_attempts;

CREATE POLICY assessment_attempts_grade
ON public.assessment_attempts
FOR UPDATE TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

COMMIT;
