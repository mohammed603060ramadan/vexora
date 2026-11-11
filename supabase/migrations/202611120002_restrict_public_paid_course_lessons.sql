-- Public visitors may read published lessons only when the parent course is free.
-- Enrolled students retain access through "Enrolled students view published lessons".
-- Admin access remains governed by "Admins manage course lessons".
-- Course prices are public catalog information; grant only the price column needed
-- for the RLS predicate to evaluate for anonymous visitors.

GRANT SELECT (price) ON public.courses TO anon;

DROP POLICY IF EXISTS "Public can read published course lessons"
ON public.course_lessons;

CREATE POLICY "Public can read published course lessons"
ON public.course_lessons
FOR SELECT
TO anon, authenticated
USING (
  is_published = true
  AND EXISTS (
    SELECT 1
    FROM public.courses AS c
    WHERE c.id = course_lessons.course_id
      AND c.status = 'published'
      AND COALESCE(c.price, 0) = 0
  )
);
