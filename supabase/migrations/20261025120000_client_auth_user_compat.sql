-- Link client portal records to Supabase Auth without replacing legacy user_id data.
BEGIN;

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

UPDATE public.clients
SET auth_user_id = user_id
WHERE auth_user_id IS NULL AND user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS clients_auth_user_id_unique_idx
  ON public.clients (auth_user_id)
  WHERE auth_user_id IS NOT NULL;

-- Keep both supported link columns synchronized for older pages and policies.
CREATE OR REPLACE FUNCTION public.sync_client_auth_user_link()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.auth_user_id IS NULL AND NEW.user_id IS NOT NULL THEN
    NEW.auth_user_id := NEW.user_id;
  ELSIF NEW.user_id IS NULL AND NEW.auth_user_id IS NOT NULL THEN
    NEW.user_id := NEW.auth_user_id;
  ELSIF NEW.auth_user_id IS NOT NULL AND NEW.user_id IS NOT NULL
        AND NEW.auth_user_id <> NEW.user_id THEN
    RAISE EXCEPTION 'Client auth user link columns must match';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS clients_sync_auth_user_link ON public.clients;
CREATE TRIGGER clients_sync_auth_user_link
BEFORE INSERT OR UPDATE OF user_id, auth_user_id ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.sync_client_auth_user_link();

NOTIFY pgrst, 'reload schema';
COMMIT;
