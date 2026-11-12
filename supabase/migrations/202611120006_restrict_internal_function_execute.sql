-- Keep invoice status recalculation available to trusted server-side code only.
REVOKE EXECUTE ON FUNCTION public.refresh_invoice_payment_status(uuid)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.refresh_invoice_payment_status(uuid)
TO service_role;

-- Supabase migrations may create functions as supabase_admin.
-- Require explicit grants instead of exposing future public-schema functions by default.
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public
REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated;
