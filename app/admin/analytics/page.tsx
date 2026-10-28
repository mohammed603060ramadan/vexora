import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import AnalyticsDashboard, { type AnalyticsRow } from "./analytics-dashboard";

type AnalyticsTable = "clients" | "projects" | "tasks" | "service_requests" | "invoices" | "payments" | "expenses";

const ANALYTICS_FIELDS = [
  "id",
  "title",
  "name",
  "full_name",
  "status",
  "created_at",
  "requested_at",
  "created_on",
  "due_date",
  "request_number",
] as const;

function normalizeRows(
  table: AnalyticsTable,
  result: { data: unknown[] | null; error: { message: string } | null },
): { rows: AnalyticsRow[]; error: string | null } {
  const rows = (result.data ?? []).map((item) => {
    const source = item && typeof item === "object"
      ? item as Record<string, unknown>
      : {};
    const safeRow: AnalyticsRow = {};
    for (const field of ANALYTICS_FIELDS) {
      if (field in source) safeRow[field] = source[field];
    }
    return safeRow;
  });

  if (result.error) {
    console.error(`Admin analytics query failed for ${table}:`, result.error);
  }

  return {
    rows,
    error: result.error
      ? `${table}: Records could not be loaded. Check the table schema and administrator permissions.`
      : null,
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
    case "invoices":
      return normalizeRows(table, await supabase.from("invoices" as never).select("*").limit(2000) as unknown as { data: unknown[] | null; error: { message: string } | null });
    case "payments":
      return normalizeRows(table, await supabase.from("payments" as never).select("*").limit(2000) as unknown as { data: unknown[] | null; error: { message: string } | null });
    case "expenses":
      return normalizeRows(table, await supabase.from("expenses" as never).select("*").limit(2000) as unknown as { data: unknown[] | null; error: { message: string } | null });
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

  const [clients, projects, tasks, requests, invoices, payments, expenses] = await Promise.all([
    loadTable(supabase, "clients"),
    loadTable(supabase, "projects"),
    loadTable(supabase, "tasks"),
    loadTable(supabase, "service_requests"),
    loadTable(supabase, "invoices"),
    loadTable(supabase, "payments"),
    loadTable(supabase, "expenses"),
  ]);

  const errors = [clients, projects, tasks, requests, invoices, payments, expenses]
    .map((result) => result.error)
    .filter((error): error is string => Boolean(error));

  return (
    <AnalyticsDashboard
      clients={clients.rows}
      projects={projects.rows}
      tasks={tasks.rows}
      requests={requests.rows}
      invoices={invoices.rows}
      payments={payments.rows}
      expenses={expenses.rows}
      errors={errors}
    />
  );
}
