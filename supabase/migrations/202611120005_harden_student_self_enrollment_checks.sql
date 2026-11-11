-- Prevent students from pre-setting progress or completion metadata
-- when submitting a self-enrollment request.
DROP POLICY IF EXISTS "Students request enrollment" ON public.enrollments;

CREATE POLICY "Students request enrollment"
ON public.enrollments
FOR INSERT
TO authenticated
WITH CHECK (
  student_id = (SELECT auth.uid())
  AND status = 'pending'
  AND enrollment_source = 'self'
  AND created_by IS NULL
  AND progress_percent = 0
  AND completed_at IS NULL
  AND EXISTS (
    SELECT 1
    FROM public.courses AS c
    WHERE c.id = enrollments.course_id
      AND c.status = 'published'
  )
);
