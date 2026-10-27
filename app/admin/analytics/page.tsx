import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import AnalyticsDashboard, { type AnalyticsRow } from "./analytics-dashboard";

type AnalyticsTable = "clients" | "projects" | "tasks" | "service_requests";

async function loadTable(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: AnalyticsTable,
): Promise<{ rows: AnalyticsRow[]; error: string | null }> {
  let result:
    | { data: unknown[] | null; error: { message: string } | null }
    | undefined;

  switch (table) {
    case "clients":
      result = await supabase.from("clients").select("*").limit(2000);
      break;
    case "projects":
      result = await supabase.from("projects").select("*").limit(2000);
      break;
    case "tasks":
      result = await supabase.from("tasks").select("*").limit(2000);
      break;
    case "service_requests":
      result = await supabase.from("service_requests").select("*").limit(2000);
      break;
  }

  return {
    rows: (result.data ?? []) as AnalyticsRow[],
    error: result.error ? `${table}: ${result.error.message}` : null,
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
