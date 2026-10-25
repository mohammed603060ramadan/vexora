BEGIN;

-- Backwards-compatible client/auth link. The original schema uses user_id,
-- while current portal and project-request code uses auth_user_id.
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS auth_user_id UUID
  REFERENCES auth.users(id) ON DELETE SET NULL;

UPDATE public.clients
SET auth_user_id = user_id
WHERE auth_user_id IS NULL
  AND user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS clients_auth_user_id_unique_idx
  ON public.clients (auth_user_id)
  WHERE auth_user_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.sync_client_auth_user_ids()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.auth_user_id IS NULL THEN
      NEW.auth_user_id := NEW.user_id;
    ELSIF NEW.user_id IS NULL THEN
      NEW.user_id := NEW.auth_user_id;
    END IF;
  ELSIF NEW.auth_user_id IS DISTINCT FROM OLD.auth_user_id THEN
    NEW.user_id := NEW.auth_user_id;
  ELSIF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    NEW.auth_user_id := NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS clients_sync_auth_user_ids ON public.clients;
CREATE TRIGGER clients_sync_auth_user_ids
BEFORE INSERT OR UPDATE OF user_id, auth_user_id
ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.sync_client_auth_user_ids();

NOTIFY pgrst, 'reload schema';

COMMIT;
