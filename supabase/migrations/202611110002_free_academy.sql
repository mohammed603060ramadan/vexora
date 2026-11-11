-- VEXORA Academy: all published courses are free and self-enrollment is immediate.
UPDATE public.courses
SET price = 0
WHERE price <> 0;

ALTER TABLE public.courses
  DROP CONSTRAINT IF EXISTS courses_price_must_be_free;

ALTER TABLE public.courses
  ADD CONSTRAINT courses_price_must_be_free CHECK (price = 0);

-- Published lesson content is available to everyone because the Academy is free.
DROP POLICY IF EXISTS "Public can read published course lessons" ON public.course_lessons;
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
    )
  );

GRANT SELECT ON public.course_lessons TO anon, authenticated;
