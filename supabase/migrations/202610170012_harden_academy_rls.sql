
-- =========================================================
-- VEXORA Academy RLS Hardening
-- File: 202610170012_harden_academy_rls.sql
--
-- LOCAL REVIEW ONLY.
-- Do not apply to production before local SQL validation.
-- Existing migrations 001-011 remain unchanged.
-- =========================================================

BEGIN;

-- =========================================================
-- 1. COURSES
-- Published courses are publicly readable.
-- Instructors can manage their own courses.
-- academy.manage grants administrative access.
-- =========================================================

DROP POLICY IF EXISTS courses_read ON public.courses;

CREATE POLICY courses_read
ON public.courses
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

DROP POLICY IF EXISTS courses_manage ON public.courses;

CREATE POLICY courses_manage
ON public.courses
FOR ALL TO authenticated
USING (
    public.has_permission('academy.manage')
    OR (
        (SELECT auth.uid()) IS NOT NULL
        AND instructor_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    public.has_permission('academy.manage')
    OR (
        (SELECT auth.uid()) IS NOT NULL
        AND instructor_id = (SELECT auth.uid())
    )
);

-- =========================================================
-- 2. COURSE SECTIONS
-- =========================================================

DROP POLICY IF EXISTS course_sections_read
ON public.course_sections;

CREATE POLICY course_sections_read
ON public.course_sections
FOR SELECT TO anon, authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = course_sections.course_id
          AND c.status = 'published'
    )
    OR (
        (SELECT auth.uid()) IS NOT NULL
        AND (
            public.has_permission('academy.manage')
            OR EXISTS (
                SELECT 1
                FROM public.courses AS c
                WHERE c.id = course_sections.course_id
                  AND c.instructor_id = (SELECT auth.uid())
            )
        )
    )
);

DROP POLICY IF EXISTS course_sections_manage
ON public.course_sections;

CREATE POLICY course_sections_manage
ON public.course_sections
FOR ALL TO authenticated
USING (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = course_sections.course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = course_sections.course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
);

-- =========================================================
-- 3. LESSONS
-- Both lesson and parent course must be published for public
-- access. is_preview does not bypass publication requirements.
-- =========================================================

DROP POLICY IF EXISTS lessons_read ON public.lessons;

CREATE POLICY lessons_read
ON public.lessons
FOR SELECT TO anon, authenticated
USING (
    (
        status = 'published'
        AND EXISTS (
            SELECT 1
            FROM public.courses AS c
            WHERE c.id = lessons.course_id
              AND c.status = 'published'
        )
    )
    OR (
        (SELECT auth.uid()) IS NOT NULL
        AND (
            public.has_permission('academy.manage')
            OR EXISTS (
                SELECT 1
                FROM public.courses AS c
                WHERE c.id = lessons.course_id
                  AND c.instructor_id = (SELECT auth.uid())
            )
        )
    )
);

DROP POLICY IF EXISTS lessons_manage ON public.lessons;

CREATE POLICY lessons_manage
ON public.lessons
FOR ALL TO authenticated
USING (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = lessons.course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = lessons.course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
);

-- =========================================================
-- 4. ENROLLMENTS
-- Students read their own enrollments.
-- Assigned instructors and managers can read enrollments.
-- Self-enrollment cannot mark a course completed directly.
-- =========================================================

DROP POLICY IF EXISTS enrollments_read
ON public.enrollments;

CREATE POLICY enrollments_read
ON public.enrollments
FOR SELECT TO authenticated
USING (
    student_id = (SELECT auth.uid())
    OR public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = enrollments.course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS enrollments_create
ON public.enrollments;

CREATE POLICY enrollments_create
ON public.enrollments
FOR INSERT TO authenticated
WITH CHECK (
    public.has_permission('academy.manage')
    OR (
        student_id = (SELECT auth.uid())
        AND status = 'active'
        AND completed_at IS NULL
        AND progress_percent = 0
        AND EXISTS (
            SELECT 1
            FROM public.courses AS c
            WHERE c.id = enrollments.course_id
              AND c.status = 'published'
        )
    )
);

DROP POLICY IF EXISTS enrollments_manage
ON public.enrollments;

CREATE POLICY enrollments_manage
ON public.enrollments
FOR UPDATE TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

DROP POLICY IF EXISTS enrollments_delete
ON public.enrollments;

CREATE POLICY enrollments_delete
ON public.enrollments
FOR DELETE TO authenticated
USING (public.has_permission('academy.manage'));

-- =========================================================
-- 5. LESSON PROGRESS
-- =========================================================

DROP POLICY IF EXISTS lesson_progress_read
ON public.lesson_progress;

CREATE POLICY lesson_progress_read
ON public.lesson_progress
FOR SELECT TO authenticated
USING (
    student_id = (SELECT auth.uid())
    OR public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = lesson_progress.course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS lesson_progress_create
ON public.lesson_progress;

CREATE POLICY lesson_progress_create
ON public.lesson_progress
FOR INSERT TO authenticated
WITH CHECK (
    public.has_permission('academy.manage')
    OR (
        student_id = (SELECT auth.uid())
        AND EXISTS (
            SELECT 1
            FROM public.enrollments AS e
            JOIN public.courses AS c
              ON c.id = e.course_id
            JOIN public.lessons AS l
              ON l.course_id = e.course_id
            WHERE e.id = lesson_progress.enrollment_id
              AND e.course_id = lesson_progress.course_id
              AND e.student_id = (SELECT auth.uid())
              AND e.status = 'active'
              AND c.status = 'published'
              AND l.id = lesson_progress.lesson_id
              AND l.status = 'published'
        )
    )
);

DROP POLICY IF EXISTS lesson_progress_update
ON public.lesson_progress;

CREATE POLICY lesson_progress_update
ON public.lesson_progress
FOR UPDATE TO authenticated
USING (
    student_id = (SELECT auth.uid())
    OR public.has_permission('academy.manage')
)
WITH CHECK (
    public.has_permission('academy.manage')
    OR (
        student_id = (SELECT auth.uid())
        AND EXISTS (
            SELECT 1
            FROM public.enrollments AS e
            JOIN public.courses AS c
              ON c.id = e.course_id
            JOIN public.lessons AS l
              ON l.course_id = e.course_id
            WHERE e.id = lesson_progress.enrollment_id
              AND e.course_id = lesson_progress.course_id
              AND e.student_id = (SELECT auth.uid())
              AND e.status = 'active'
              AND c.status = 'published'
              AND l.id = lesson_progress.lesson_id
              AND l.status = 'published'
        )
    )
);

DROP POLICY IF EXISTS lesson_progress_delete
ON public.lesson_progress;

CREATE POLICY lesson_progress_delete
ON public.lesson_progress
FOR DELETE TO authenticated
USING (public.has_permission('academy.manage'));

-- =========================================================
-- 6. ASSESSMENTS
-- Published assessments are readable only when their course
-- is also published. Instructors manage their own courses.
-- =========================================================

DROP POLICY IF EXISTS assessments_read
ON public.assessments;

CREATE POLICY assessments_read
ON public.assessments
FOR SELECT TO authenticated
USING (
    (
        status = 'published'
        AND EXISTS (
            SELECT 1
            FROM public.courses AS c
            WHERE c.id = assessments.course_id
              AND c.status = 'published'
        )
    )
    OR public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = assessments.course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS assessments_manage
ON public.assessments;

CREATE POLICY assessments_manage
ON public.assessments
FOR ALL TO authenticated
USING (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = assessments.course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = assessments.course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
);

-- =========================================================
-- 7. ASSESSMENT QUESTIONS
-- Published question content is visible to authenticated
-- users. Consider enrollment restrictions if questions are
-- intended only for enrolled students.
-- =========================================================

DROP POLICY IF EXISTS assessment_questions_read
ON public.assessment_questions;

CREATE POLICY assessment_questions_read
ON public.assessment_questions
FOR SELECT TO authenticated
USING (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.assessments AS a
        JOIN public.courses AS c
          ON c.id = a.course_id
        WHERE a.id = assessment_questions.assessment_id
          AND a.status = 'published'
          AND c.status = 'published'
    )
    OR EXISTS (
        SELECT 1
        FROM public.assessments AS a
        JOIN public.courses AS c
          ON c.id = a.course_id
        WHERE a.id = assessment_questions.assessment_id
          AND c.instructor_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS assessment_questions_manage
ON public.assessment_questions;

CREATE POLICY assessment_questions_manage
ON public.assessment_questions
FOR ALL TO authenticated
USING (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.assessments AS a
        JOIN public.courses AS c
          ON c.id = a.course_id
        WHERE a.id = assessment_questions.assessment_id
          AND c.instructor_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.assessments AS a
        JOIN public.courses AS c
          ON c.id = a.course_id
        WHERE a.id = assessment_questions.assessment_id
          AND c.instructor_id = (SELECT auth.uid())
    )
);

-- =========================================================
-- 8. ASSESSMENT ATTEMPTS
-- =========================================================

DROP POLICY IF EXISTS assessment_attempts_read
ON public.assessment_attempts;

CREATE POLICY assessment_attempts_read
ON public.assessment_attempts
FOR SELECT TO authenticated
USING (
    student_id = (SELECT auth.uid())
    OR public.has_permission('academy.manage')
    OR graded_by = (SELECT auth.uid())
    OR EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = assessment_attempts.course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS assessment_attempts_create
ON public.assessment_attempts;

CREATE POLICY assessment_attempts_create
ON public.assessment_attempts
FOR INSERT TO authenticated
WITH CHECK (
    student_id = (SELECT auth.uid())
    AND status = 'in_progress'
    AND score IS NULL
    AND passed IS NULL
    AND graded_by IS NULL
    AND graded_at IS NULL
    AND EXISTS (
        SELECT 1
        FROM public.assessments AS a
        JOIN public.courses AS c
          ON c.id = a.course_id
        JOIN public.enrollments AS e
          ON e.course_id = c.id
        WHERE a.id = assessment_attempts.assessment_id
          AND a.course_id = assessment_attempts.course_id
          AND a.status = 'published'
          AND c.status = 'published'
          AND e.student_id = (SELECT auth.uid())
          AND e.status = 'active'
    )
);

DROP POLICY IF EXISTS assessment_attempts_student_update
ON public.assessment_attempts;

CREATE POLICY assessment_attempts_student_update
ON public.assessment_attempts
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

DROP POLICY IF EXISTS assessment_attempts_grade
ON public.assessment_attempts;

CREATE POLICY assessment_attempts_grade
ON public.assessment_attempts
FOR UPDATE TO authenticated
USING (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = assessment_attempts.course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.courses AS c
        WHERE c.id = assessment_attempts.course_id
          AND c.instructor_id = (SELECT auth.uid())
    )
);

-- =========================================================
-- 9. COURSE CERTIFICATES
-- =========================================================

DROP POLICY IF EXISTS course_certificates_read
ON public.course_certificates;

CREATE POLICY course_certificates_read
ON public.course_certificates
FOR SELECT TO authenticated
USING (
    public.has_permission('academy.manage')
    OR EXISTS (
        SELECT 1
        FROM public.enrollments AS e
        WHERE e.id = course_certificates.enrollment_id
          AND e.student_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS course_certificates_manage
ON public.course_certificates;

CREATE POLICY course_certificates_manage
ON public.course_certificates
FOR ALL TO authenticated
USING (public.has_permission('academy.manage'))
WITH CHECK (public.has_permission('academy.manage'));

COMMIT;
