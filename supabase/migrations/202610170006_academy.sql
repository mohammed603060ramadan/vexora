
-- =========================================================
-- VEXORA Platform
-- Migration 006: Academy and learning management
-- PostgreSQL / Supabase
-- =========================================================

BEGIN;

-- ---------------------------------------------------------
-- 1. Courses
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID
        REFERENCES public.departments(id) ON DELETE SET NULL,
    instructor_id UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    title VARCHAR(220) NOT NULL,
    subtitle VARCHAR(300),
    description TEXT,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'beginner'
        CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    course_type VARCHAR(20) NOT NULL DEFAULT 'online'
        CHECK (course_type IN ('online', 'in_person', 'hybrid')),
    price NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (price >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    estimated_hours NUMERIC(8, 2)
        CHECK (estimated_hours IS NULL OR estimated_hours >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT courses_id_unique UNIQUE (id)
);

-- ---------------------------------------------------------
-- 2. Course sections
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.course_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL
        REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(220) NOT NULL,
    description TEXT,
    sequence_number INTEGER NOT NULL DEFAULT 1
        CHECK (sequence_number > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT course_sections_course_sequence_unique
        UNIQUE (course_id, sequence_number),

    CONSTRAINT course_sections_id_course_unique
        UNIQUE (id, course_id)
);

-- ---------------------------------------------------------
-- 3. Lessons
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    section_id UUID NOT NULL,
    course_id UUID NOT NULL,

    title VARCHAR(220) NOT NULL,
    description TEXT,

    lesson_type VARCHAR(20) NOT NULL DEFAULT 'video'
        CHECK (lesson_type IN ('video', 'article', 'file', 'live')),

    content TEXT,
    video_url TEXT,
    resource_path TEXT,

    duration_minutes INTEGER
        CHECK (duration_minutes IS NULL OR duration_minutes >= 0),

    is_preview BOOLEAN NOT NULL DEFAULT false,

    sequence_number INTEGER NOT NULL DEFAULT 1
        CHECK (sequence_number > 0),

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT lessons_section_course_fk
        FOREIGN KEY (section_id, course_id)
        REFERENCES public.course_sections (id, course_id)
        ON DELETE CASCADE,

    CONSTRAINT lessons_section_sequence_unique
        UNIQUE (section_id, sequence_number),

    CONSTRAINT lessons_id_course_unique
        UNIQUE (id, course_id)
);

-- ---------------------------------------------------------
-- 4. Student enrollments
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    course_id UUID NOT NULL
        REFERENCES public.courses(id) ON DELETE RESTRICT,

    student_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,

    enrolled_by UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN (
            'pending', 'active', 'completed', 'cancelled'
        )),

    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,

    progress_percent SMALLINT NOT NULL DEFAULT 0
        CHECK (progress_percent BETWEEN 0 AND 100),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT enrollments_course_student_unique
        UNIQUE (course_id, student_id),

    CONSTRAINT enrollments_id_course_student_unique
        UNIQUE (id, course_id, student_id),

    CONSTRAINT enrollments_completion_consistency
        CHECK (
            (status = 'completed' AND completed_at IS NOT NULL)
            OR
            (status <> 'completed' AND completed_at IS NULL)
        )
);

-- ---------------------------------------------------------
-- 5. Lesson progress
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lesson_progress (
    enrollment_id UUID NOT NULL,
    course_id UUID NOT NULL,
    lesson_id UUID NOT NULL,

    student_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'not_started'
        CHECK (status IN ('not_started', 'in_progress', 'completed')),

    progress_percent SMALLINT NOT NULL DEFAULT 0
        CHECK (progress_percent BETWEEN 0 AND 100),

    last_position_seconds INTEGER NOT NULL DEFAULT 0
        CHECK (last_position_seconds >= 0),

    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (enrollment_id, lesson_id),

    CONSTRAINT lesson_progress_enrollment_fk
        FOREIGN KEY (enrollment_id, course_id, student_id)
        REFERENCES public.enrollments (id, course_id, student_id)
        ON DELETE CASCADE,

    CONSTRAINT lesson_progress_lesson_fk
        FOREIGN KEY (lesson_id, course_id)
        REFERENCES public.lessons (id, course_id)
        ON DELETE CASCADE,

    CONSTRAINT lesson_progress_completion_consistency
        CHECK (
            (status = 'completed' AND completed_at IS NOT NULL)
            OR
            (status <> 'completed' AND completed_at IS NULL)
        )
);

-- ---------------------------------------------------------
-- 6. Assessments
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    course_id UUID NOT NULL
        REFERENCES public.courses(id) ON DELETE CASCADE,

    title VARCHAR(220) NOT NULL,
    description TEXT,

    assessment_type VARCHAR(20) NOT NULL DEFAULT 'quiz'
        CHECK (assessment_type IN ('quiz', 'assignment', 'exam')),

    max_score NUMERIC(8, 2) NOT NULL DEFAULT 100
        CHECK (max_score > 0),

    passing_score NUMERIC(8, 2) NOT NULL DEFAULT 60
        CHECK (passing_score >= 0 AND passing_score <= max_score),

    time_limit_minutes INTEGER
        CHECK (time_limit_minutes IS NULL OR time_limit_minutes > 0),

    due_at TIMESTAMPTZ,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT assessments_id_course_unique
        UNIQUE (id, course_id)
);

-- ---------------------------------------------------------
-- 7. Assessment questions
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    assessment_id UUID NOT NULL
        REFERENCES public.assessments(id) ON DELETE CASCADE,

    question_text TEXT NOT NULL,

    question_type VARCHAR(25) NOT NULL DEFAULT 'multiple_choice'
        CHECK (question_type IN (
            'multiple_choice', 'true_false', 'short_answer', 'essay'
        )),

    options JSONB NOT NULL DEFAULT '[]'::JSONB
        CHECK (jsonb_typeof(options) = 'array'),

    points NUMERIC(8, 2) NOT NULL DEFAULT 1
        CHECK (points > 0),

    sequence_number INTEGER NOT NULL DEFAULT 1
        CHECK (sequence_number > 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT assessment_questions_sequence_unique
        UNIQUE (assessment_id, sequence_number)
);

-- ---------------------------------------------------------
-- 8. Student assessment attempts
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    assessment_id UUID NOT NULL,
    course_id UUID NOT NULL,

    student_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,

    attempt_number INTEGER NOT NULL DEFAULT 1
        CHECK (attempt_number > 0),

    answers JSONB NOT NULL DEFAULT '{}'::JSONB
        CHECK (jsonb_typeof(answers) = 'object'),

    score NUMERIC(8, 2)
        CHECK (score IS NULL OR score >= 0),

    passed BOOLEAN,

    status VARCHAR(20) NOT NULL DEFAULT 'in_progress'
        CHECK (status IN ('in_progress', 'submitted', 'graded')),

    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at TIMESTAMPTZ,

    graded_by UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    graded_at TIMESTAMPTZ,
    feedback TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT assessment_attempts_assessment_course_fk
        FOREIGN KEY (assessment_id, course_id)
        REFERENCES public.assessments (id, course_id)
        ON DELETE CASCADE,

    CONSTRAINT assessment_attempts_enrollment_fk
        FOREIGN KEY (course_id, student_id)
        REFERENCES public.enrollments (course_id, student_id)
        ON DELETE CASCADE,

    CONSTRAINT assessment_attempts_number_unique
        UNIQUE (assessment_id, student_id, attempt_number),

    CONSTRAINT assessment_attempts_score_state_check
        CHECK (
            (status <> 'graded' OR score IS NOT NULL)
            AND
            (status <> 'graded' OR graded_at IS NOT NULL)
        )
);

-- ---------------------------------------------------------
-- 9. Course certificates
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.course_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    enrollment_id UUID NOT NULL UNIQUE
        REFERENCES public.enrollments(id) ON DELETE RESTRICT,

    certificate_number VARCHAR(100) NOT NULL UNIQUE,

    issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    issued_by UUID
        REFERENCES auth.users(id) ON DELETE SET NULL,

    certificate_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- 10. Validate assessment scores against max_score
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION public.validate_assessment_attempt_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    v_max_score NUMERIC(8, 2);
BEGIN
    SELECT a.max_score
    INTO v_max_score
    FROM public.assessments AS a
    WHERE a.id = NEW.assessment_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Assessment % does not exist', NEW.assessment_id;
    END IF;

    IF NEW.score IS NOT NULL AND NEW.score > v_max_score THEN
        RAISE EXCEPTION
            'Score (%) cannot exceed assessment max score (%)',
            NEW.score, v_max_score;
    END IF;

    IF NEW.status = 'graded' AND NEW.graded_at IS NULL THEN
        NEW.graded_at := now();
    END IF;

    IF NEW.status = 'graded' AND NEW.passed IS NULL THEN
        NEW.passed := (NEW.score >= (
            SELECT a.passing_score
            FROM public.assessments AS a
            WHERE a.id = NEW.assessment_id
        ));
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_assessment_attempt_score
    ON public.assessment_attempts;

CREATE TRIGGER trg_validate_assessment_attempt_score
BEFORE INSERT OR UPDATE OF assessment_id, score, status, graded_at, passed
ON public.assessment_attempts
FOR EACH ROW
EXECUTE FUNCTION public.validate_assessment_attempt_score();

-- ---------------------------------------------------------
-- 11. Validate certificate eligibility
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION public.validate_course_certificate()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    v_enrollment_status VARCHAR(20);
BEGIN
    SELECT e.status
    INTO v_enrollment_status
    FROM public.enrollments AS e
    WHERE e.id = NEW.enrollment_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Enrollment % does not exist', NEW.enrollment_id;
    END IF;

    IF v_enrollment_status <> 'completed' THEN
        RAISE EXCEPTION
            'A certificate can only be issued for a completed enrollment';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_course_certificate
    ON public.course_certificates;

CREATE TRIGGER trg_validate_course_certificate
BEFORE INSERT OR UPDATE OF enrollment_id
ON public.course_certificates
FOR EACH ROW
EXECUTE FUNCTION public.validate_course_certificate();

-- ---------------------------------------------------------
-- 12. Indexes
-- ---------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_courses_status
    ON public.courses(status);

CREATE INDEX IF NOT EXISTS idx_courses_department
    ON public.courses(department_id);

CREATE INDEX IF NOT EXISTS idx_sections_course
    ON public.course_sections(course_id, sequence_number);

CREATE INDEX IF NOT EXISTS idx_lessons_section
    ON public.lessons(section_id, sequence_number);

CREATE INDEX IF NOT EXISTS idx_lessons_course
    ON public.lessons(course_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_student_status
    ON public.enrollments(student_id, status);

CREATE INDEX IF NOT EXISTS idx_enrollments_course
    ON public.enrollments(course_id);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_student
    ON public.lesson_progress(student_id, status);

CREATE INDEX IF NOT EXISTS idx_assessments_course
    ON public.assessments(course_id);

CREATE INDEX IF NOT EXISTS idx_questions_assessment
    ON public.assessment_questions(assessment_id, sequence_number);

CREATE INDEX IF NOT EXISTS idx_attempts_student
    ON public.assessment_attempts(student_id, status);

CREATE INDEX IF NOT EXISTS idx_attempts_assessment
    ON public.assessment_attempts(assessment_id);

-- ---------------------------------------------------------
-- 13. updated_at triggers
-- ---------------------------------------------------------

DROP TRIGGER IF EXISTS trg_courses_updated_at ON public.courses;

CREATE TRIGGER trg_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_course_sections_updated_at
    ON public.course_sections;

CREATE TRIGGER trg_course_sections_updated_at
BEFORE UPDATE ON public.course_sections
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_lessons_updated_at ON public.lessons;

CREATE TRIGGER trg_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_enrollments_updated_at
    ON public.enrollments;

CREATE TRIGGER trg_enrollments_updated_at
BEFORE UPDATE ON public.enrollments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_assessments_updated_at
    ON public.assessments;

CREATE TRIGGER trg_assessments_updated_at
BEFORE UPDATE ON public.assessments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_attempts_updated_at
    ON public.assessment_attempts;

CREATE TRIGGER trg_attempts_updated_at
BEFORE UPDATE ON public.assessment_attempts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_lesson_progress_updated_at
    ON public.lesson_progress;

CREATE TRIGGER trg_lesson_progress_updated_at
BEFORE UPDATE ON public.lesson_progress
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMIT;
