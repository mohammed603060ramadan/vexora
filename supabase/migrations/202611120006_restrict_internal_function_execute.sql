-- Keep invoice status recalculation available to trusted server-side code only.
REVOKE EXECUTE ON FUNCTION public.refresh_invoice_payment_status(uuid)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.refresh_invoice_payment_status(uuid)
TO service_role;
