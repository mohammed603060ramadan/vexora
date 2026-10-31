import "server-only";

import { createClient } from "@supabase/supabase-js";

// The admin client accesses tables added by migrations that are not yet represented
// in a generated Database type. Keep this server-only client schema-agnostic until
// the project maintains a complete generated Supabase schema.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let adminClient: ReturnType<typeof createClient<any>> | null = null;

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase server environment variables."
    );
  }

  if (!adminClient) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adminClient = createClient<any>(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return adminClient;
}
