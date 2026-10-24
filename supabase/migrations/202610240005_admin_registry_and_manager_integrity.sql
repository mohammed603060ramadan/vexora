BEGIN;

-- Canonical registry for privileged VEXORA administrators.
-- Application access uses the server-side service-role client only.
CREATE TABLE IF NOT EXISTS public.vexora_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.vexora_admins
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Protect against duplicate registry entries if this table pre-existed.
CREATE UNIQUE INDEX IF NOT EXISTS vexora_admins_user_id_uidx
  ON public.vexora_admins (user_id);

ALTER TABLE public.vexora_admins ENABLE ROW LEVEL SECURITY;

-- No direct browser access to the privileged registry. The server-side
-- service-role client is used by the protected /api/admin/managers route.
REVOKE ALL ON TABLE public.vexora_admins FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE public.vexora_admins TO service_role;

COMMENT ON TABLE public.vexora_admins IS
  'Registry of VEXORA administrator user IDs. Accessed only through protected server-side service-role code.';

COMMENT ON COLUMN public.vexora_admins.user_id IS
  'Supabase Auth user ID with administrator privileges.';

COMMIT;
