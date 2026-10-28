import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import AnalyticsDashboard, { type AnalyticsRow } from "./analytics-dashboard";

type AnalyticsTable = "clients" | "projects" | "tasks" | "service_requests";

function normalizeRows(
  table: AnalyticsTable,
  result: { data: unknown[] | null; error: { message: string } | null },
): { rows: AnalyticsRow[]; error: string | null } {
  return {
    rows: (result.data ?? []) as AnalyticsRow[],
    error: result.error ? `${table}: ${result.error.message}` : null,
  };
}

async function loadTable(
  supabase: ReturnType<typeof createAdminClient>,
  table: AnalyticsTable,
): Promise<{ rows: AnalyticsRow[]; error: string | null }> {
  switch (table) {
    case "clients":
      return normalizeRows(table, await supabase.from("clients").select("*").limit(2000));
    case "projects":
      return normalizeRows(table, await supabase.from("projects").select("*").limit(2000));
    case "tasks":
      return normalizeRows(table, await supabase.from("tasks").select("*").limit(2000));
    case "service_requests":
      return normalizeRows(table, await supabase.from("service_requests").select("*").limit(2000));
  }
}

export default async function AnalyticsPage() {
  await connection();

  const sessionClient = await createClient();
  const { data: authData, error: authError } = await sessionClient.auth.getUser();

  if (authError || !authData.user) redirect("/login?next=/admin/analytics");

  let authorized = authData.user.app_metadata?.role === "admin";
  const admin = createAdminClient();

  if (!authorized) {
    const { data: registry, error: registryError } = await admin
      .from("vexora_admins")
      .select("user_id")
      .eq("user_id", authData.user.id)
      .maybeSingle();
    authorized = !registryError && Boolean(registry);
  }

  if (!authorized) redirect("/client");

  // Analytics are administrator-only; use the server-side service-role client
  // after explicit identity and administrator-registry authorization.
  const supabase = admin;

  const [clients, projects, tasks, requests] = await Promise.all([
    loadTable(supabase, "clients"),
    loadTable(supabase, "projects"),
    loadTable(supabase, "tasks"),
    loadTable(supabase, "service_requests"),
  ]);

  const errors = [clients, projects, tasks, requests]
    .map((result) => result.error)
    .filter((error): error is string => Boolean(error));

  return (
    <AnalyticsDashboard
      clients={clients.rows}
      projects={projects.rows}
      tasks={tasks.rows}
      requests={requests.rows}
      errors={errors}
    />
  );
}
