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
  "amount",
  "total_amount",
  "subtotal",
  "tax_amount",
  "currency",
  "paid_at",
  "payment_date",
  "expense_date",
  "updated_at",
  "due_at",
  "completed_at",
  "progress",
  "progress_percent",
  "priority",
  "client_id",
  "project_id",
  "invoice_id",
  "payment_method",
  "type",
  "category",
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

async function queryTablePage(
  supabase: ReturnType<typeof createAdminClient>,
  table: AnalyticsTable,
  from: number,
  to: number,
): Promise<{ data: unknown[] | null; error: { message: string } | null }> {
  switch (table) {
    case "clients":
      return await supabase.from("clients").select("*").order("id", { ascending: true }).range(from, to);
    case "projects":
      return await supabase.from("projects").select("*").order("id", { ascending: true }).range(from, to);
    case "tasks":
      return await supabase.from("tasks").select("*").order("id", { ascending: true }).range(from, to);
    case "service_requests":
      return await supabase.from("service_requests").select("*").order("id", { ascending: true }).range(from, to);
    case "invoices":
      return await supabase.from("invoices" as never).select("*").order("id", { ascending: true }).range(from, to) as unknown as { data: unknown[] | null; error: { message: string } | null };
    case "payments":
      return await supabase.from("payments" as never).select("*").order("id", { ascending: true }).range(from, to) as unknown as { data: unknown[] | null; error: { message: string } | null };
    case "expenses":
      return await supabase.from("expenses" as never).select("*").order("id", { ascending: true }).range(from, to) as unknown as { data: unknown[] | null; error: { message: string } | null };
  }
}

async function loadTable(
  supabase: ReturnType<typeof createAdminClient>,
  table: AnalyticsTable,
): Promise<{ rows: AnalyticsRow[]; error: string | null }> {
  const allRows: unknown[] = [];
  const pageSize = 1000;

  for (let offset = 0; ; offset += pageSize) {
    const result = await queryTablePage(supabase, table, offset, offset + pageSize - 1);
    if (result.error) return normalizeRows(table, result);
    const page = result.data ?? [];
    allRows.push(...page);
    if (page.length < pageSize) break;
  }

  return normalizeRows(table, { data: allRows, error: null });
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
