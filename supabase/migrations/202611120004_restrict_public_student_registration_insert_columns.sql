-- Restrict public student-registration inserts to applicant-controlled fields.
-- Internal workflow fields and generated identifiers/timestamps must use database defaults.
REVOKE INSERT ON TABLE public.student_registrations FROM anon, authenticated;

GRANT INSERT (
  full_name,
  email,
  phone,
  country,
  education_level,
  track,
  experience,
  motivation
) ON TABLE public.student_registrations TO anon, authenticated;
