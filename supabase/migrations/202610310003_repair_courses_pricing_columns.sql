-- VEXORA Academy: safely align existing courses tables with the application schema.
-- Additive and idempotent: existing course records are preserved.

BEGIN;

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency CHAR(3) NOT NULL DEFAULT 'USD';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.courses'::regclass
      AND conname = 'courses_price_nonnegative_check'
  ) THEN
    ALTER TABLE public.courses
      ADD CONSTRAINT courses_price_nonnegative_check
      CHECK (price >= 0) NOT VALID;
  END IF;
END;
$$;

ALTER TABLE public.courses
  VALIDATE CONSTRAINT courses_price_nonnegative_check;

NOTIFY pgrst, 'reload schema';

COMMIT;
