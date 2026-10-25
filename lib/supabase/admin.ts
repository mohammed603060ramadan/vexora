import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// The repository does not currently include generated Database types.
// Keep this privileged client explicitly schema-agnostic until those types
// are committed, rather than letting Supabase infer table rows as never.
let adminClient: SupabaseClient<any> | null = null;

export function createAdminClient(): SupabaseClient<any> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase server environment variables."
    );
  }

  if (!adminClient) {
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
