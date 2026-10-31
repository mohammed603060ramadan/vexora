
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Compatibility layer for tables or columns missing from generated Supabase types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminDb = any;

type TaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "review"
  | "completed"
  | "blocked"
  | "cancelled";

type ProjectRow = {
  id: string;
  title: string | null;
  description: string | null;
  status: string | null;
  deadline: string | null;
  progress_percent: number | null;
  client_id: string | null;
};

type ProjectRequestRow = {
  id: string;
  project_id: string | null;
  status: string | null;
  message: string | null;
  created_at: string;
  updated_at: string | null;
};

type TaskRow = {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus | string;
  priority: string | null;
  due_date: string | null;
  assigned_to: string;
  created_at: string;
  updated_at: string | null;
};

const headers = {
  "Cache-Control": "private, no-store",
};

// Students may move work out of backlog, but cancellation remains admin-only.
const allowedStatuses: readonly TaskStatus[] = [
  "backlog",
  "todo",
  "in_progress",
  "review",
  "completed",
  "blocked",
];

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers });
}

async function findClientForUser(admin: AdminDb, userId: string) {
  const byAuthUser = await admin
    .from("clients")
    .select("id")
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (!byAuthUser.error) {
    // If the modern column exists, its null result is authoritative. Do not
    // silently resolve a different/stale legacy account link for this user.
    return byAuthUser.data;
  }

  const authColumnMissing =
    /auth_user_id|column .* does not exist|schema cache/i.test(
      byAuthUser.error.message,
    );

  if (!authColumnMissing) throw byAuthUser.error;

  // Compatibility only when this database does not have auth_user_id.
  const byLegacyUser = await admin
    .from("clients")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (byLegacyUser.error) throw byLegacyUser.error;
  return byLegacyUser.data;
}

export async function GET() {
  const supabase = await createClient();
  const { data: auth, error: authError } =
    await supabase.auth.getUser();

  if (authError || !auth.user) {
    return errorResponse(
      "Sign in to view your projects and tasks.",
      401
    );
  }

  try {
    const admin: AdminDb = createAdminClient();

    const client = await findClientForUser(
      admin,
      auth.user.id
    );

    const [projectResult, requestResult, taskResult] =
      await Promise.all([
        client
          ? admin
              .from("projects")
              .select(
                "id,title,description,status,deadline,client_id"
              )
              .eq("client_id", client.id)
              .order("created_at", { ascending: false })
              .limit(100)
          : Promise.resolve({ data: [], error: null }),

        admin
          .from("project_requests")
          .select(
            "id,project_id,status,message,created_at,updated_at"
          )
          .eq("user_id", auth.user.id)
          .order("created_at", { ascending: false })
          .limit(100),

        admin
          .from("tasks")
          .select(
            "id,project_id,title,description,status,priority,due_date,assigned_to,created_at,updated_at"
          )
          .eq("assigned_to", auth.user.id)
          .order("created_at", { ascending: false })
          .limit(200),
      ]);

    if (projectResult.error) {
      throw projectResult.error;
    }

    if (requestResult.error) {
      throw requestResult.error;
    }

    if (taskResult.error) {
      throw taskResult.error;
    }

    const clientProjects =
      (projectResult.data ?? []) as ProjectRow[];

    const requests =
      (requestResult.data ?? []) as ProjectRequestRow[];

    const tasks =
      (taskResult.data ?? []) as TaskRow[];

    const projectIds = [
      ...new Set<string>(
        [
          ...clientProjects.map((item) => item.id),
          ...requests.map((item) => item.project_id),
          ...tasks.map((item) => item.project_id),
        ].filter(
          (id): id is string =>
            typeof id === "string" && id.length > 0
        )
      ),
    ];

    // Load projects referenced by the user's requests or tasks,
    // including projects without a linked client record.
    const relatedProjectsResult = projectIds.length
      ? await admin
          .from("projects")
          .select(
            "id,title,description,status,deadline,client_id"
          )
          .in("id", projectIds)
      : { data: [], error: null };

    if (relatedProjectsResult.error) {
      throw relatedProjectsResult.error;
    }

    const relatedProjects =
      (relatedProjectsResult.data ?? []) as ProjectRow[];

    const projectById = new Map<string, ProjectRow>(
      relatedProjects.map(
        (item): [string, ProjectRow] => [item.id, item]
      )
    );

    const nameMap = new Map<string, string>(
      relatedProjects.map(
        (item): [string, string] => [
          item.id,
          item.title || "Project",
        ]
      )
    );

    const projects = projectIds
      .map((id) => projectById.get(id))
      .filter(
        (item): item is ProjectRow => item !== undefined
      )
      .map((item) => ({
        ...item,
        title: item.title || "Project",
        // This column is absent in the deployed projects schema. Preserve the
        // response field for existing UI consumers without querying a missing DB column.
        progress_percent: null,
      }));

    return NextResponse.json(
      {
        projects,

        requests: requests.map((item) => ({
          ...item,
          project_title: item.project_id
            ? nameMap.get(item.project_id) || "Project"
            : "Project",
        })),

        tasks: tasks.map((item) => ({
          ...item,
          project_title: item.project_id
            ? nameMap.get(item.project_id) || "Project"
            : "Project",
        })),
      },
      { headers }
    );
  } catch (error) {
    console.error("Student workspace load failed:", error);

    return errorResponse(
      "Could not load projects, requests, or tasks. Verify the project and task schema and migrations.",
      500
    );
  }
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: auth, error: authError } =
    await supabase.auth.getUser();

  if (authError || !auth.user) {
    return errorResponse(
      "Sign in to update a task.",
      401
    );
  }

  const body: unknown = await request
    .json()
    .catch(() => null);

  if (
    typeof body !== "object" ||
    body === null ||
    !("taskId" in body) ||
    !("status" in body) ||
    typeof body.taskId !== "string" ||
    body.taskId.trim().length === 0 ||
    typeof body.status !== "string" ||
    !allowedStatuses.includes(body.status as TaskStatus)
  ) {
    return errorResponse(
      "A valid task and status are required.",
      400
    );
  }

  const taskId = body.taskId;
  const status = body.status as TaskStatus;

  try {
    const admin: AdminDb = createAdminClient();

    const { data: task, error: taskError } = await admin
      .from("tasks")
      .select("id,assigned_to,status")
      .eq("id", taskId)
      .maybeSingle();

    if (taskError) {
      throw taskError;
    }

    if (!task || task.assigned_to !== auth.user.id) {
      return errorResponse(
        "This task is not assigned to your account.",
        404
      );
    }

    const { data, error } = await admin
      .from("tasks")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .eq("assigned_to", auth.user.id)
      .select("id,status,updated_at")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { task: data },
      { headers }
    );
  } catch (error) {
    console.error("Student task update failed:", error);

    return errorResponse(
      "Could not update this task.",
      500
    );
  }
}
