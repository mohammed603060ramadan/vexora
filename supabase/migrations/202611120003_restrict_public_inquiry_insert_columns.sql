-- Restrict anonymous inquiry submissions to visitor-provided contact fields.
-- Internal workflow fields (notes, status, priority, source, timestamps) remain
-- controlled by database defaults and trusted authenticated/admin operations.
-- Existing inquiry rows are not modified.

REVOKE INSERT ON TABLE public.inquiries FROM anon, authenticated;

GRANT INSERT (
  full_name,
  email,
  phone,
  company,
  service,
  message
) ON TABLE public.inquiries TO anon, authenticated;
