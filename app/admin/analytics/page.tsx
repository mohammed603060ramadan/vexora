import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import AnalyticsDashboard, { type AnalyticsRow } from "./analytics-dashboard";

async function loadTable(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string
): Promise<{ rows: AnalyticsRow[]; error: string | null }> {
  const { data, error } = await supabase.from(table).select("*").limit(2000);

  return {
    rows: (data || []) as AnalyticsRow[],
    error: error ? `${table}: ${error.message}` : null,
  };
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
