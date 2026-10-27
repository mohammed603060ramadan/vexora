import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
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
  supabase: Awaited<ReturnType<typeof createClient>>,
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

  const supabase = await createClient();

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
