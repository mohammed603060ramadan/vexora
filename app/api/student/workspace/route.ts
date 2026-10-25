import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const headers = { "Cache-Control": "private, no-store" };
function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers });
}

async function findClientForUser(admin: ReturnType<typeof createAdminClient>, userId: string) {
  const byAuthUser = await admin.from("clients").select("id").eq("auth_user_id", userId).maybeSingle();
  if (!byAuthUser.error && byAuthUser.data) return byAuthUser.data;
  const byLegacyUser = await admin.from("clients").select("id").eq("user_id", userId).maybeSingle();
  if (byLegacyUser.error) {
    if (byAuthUser.error) throw byAuthUser.error;
    throw byLegacyUser.error;
  }
  return byLegacyUser.data;
}

export async function GET() {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return errorResponse("Sign in to view your projects and tasks.", 401);

  try {
    const admin = createAdminClient();
    const client = await findClientForUser(admin, auth.user.id);

    const [projectResult, requestResult, taskResult] = await Promise.all([
      client
        ? admin.from("projects")
            .select("id,title,description,status,deadline,progress_percent,client_id")
            .eq("client_id", client.id)
            .order("created_at", { ascending: false })
            .limit(100)
        : Promise.resolve({ data: [], error: null }),
      admin.from("project_requests")
        .select("id,project_id,status,message,created_at,updated_at")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false })
        .limit(100),
      admin.from("tasks")
        .select("id,project_id,title,description,status,priority,due_date,assigned_to,created_at,updated_at")
        .eq("assigned_to", auth.user.id)
        .order("created_at", { ascending: false })
        .limit(200),
    ]);

    if (projectResult.error) throw projectResult.error;
    if (requestResult.error) throw requestResult.error;
    if (taskResult.error) throw taskResult.error;

    const clientProjects = projectResult.data ?? [];
    const requests = requestResult.data ?? [];
    const tasks = taskResult.data ?? [];
    const projectIds = [...new Set([
      ...clientProjects.map((item) => item.id),
      ...requests.map((item) => item.project_id),
      ...tasks.map((item) => item.project_id),
    ].filter((id): id is string => Boolean(id)))];

    // Include projects connected to the signed-in student through their
    // assigned tasks or own project requests, even without a client record.
    const { data: relatedProjects, error: relatedProjectsError } = projectIds.length
      ? await admin
          .from("projects")
          .select("id,title,description,status,deadline,progress_percent,client_id")
          .in("id", projectIds)
      : { data: [], error: null };
    if (relatedProjectsError) throw relatedProjectsError;

    const projectById = new Map(
      (relatedProjects ?? []).map((item) => [item.id, item])
    );
    const nameMap = new Map(
      (relatedProjects ?? []).map((item) => [item.id, item.title || "Project"])
    );

    return NextResponse.json({
      projects: projectIds
        .map((id) => projectById.get(id))
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .map((item) => ({ ...item, title: item.title || "Project" })),
      requests: requests.map((item) => ({ ...item, project_title: nameMap.get(item.project_id) || "Project" })),
      tasks: tasks.map((item) => ({ ...item, project_title: nameMap.get(item.project_id) || "Project" })),
    }, { headers });
  } catch (error) {
    console.error("Student workspace load failed:", error);
    return errorResponse("Could not load projects, requests, or tasks. Verify the project and task schema and migrations.", 500);
  }
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return errorResponse("Sign in to update a task.", 401);
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("taskId" in body) || typeof body.taskId !== "string" || !("status" in body) || !["todo", "in_progress", "review", "completed", "blocked"].includes(String(body.status))) {
    return errorResponse("A valid task and status are required.", 400);
  }
  try {
    const admin = createAdminClient();
    const { data: task, error: taskError } = await admin.from("tasks")
      .select("id,assigned_to,status")
      .eq("id", body.taskId)
      .maybeSingle();
    if (taskError) throw taskError;
    if (!task || task.assigned_to !== auth.user.id) return errorResponse("This task is not assigned to your account.", 404);
    const { data, error } = await admin.from("tasks")
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq("id", body.taskId)
      .eq("assigned_to", auth.user.id)
      .select("id,status,updated_at")
      .single();
    if (error) throw error;
    return NextResponse.json({ task: data }, { headers });
  } catch (error) {
    console.error("Student task update failed:", error);
    return errorResponse("Could not update this task.", 500);
  }
}
