import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type RequestStatus =
  | "pending"
  | "reviewing"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

const statuses: readonly RequestStatus[] = [
  "pending",
  "reviewing",
  "approved",
  "rejected",
  "cancelled",
  "completed",
];

const headers = { "Cache-Control": "private, no-store" };

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers });
}

async function authorizeAdmin() {
  const session = await createClient();
  const { data, error } = await session.auth.getUser();
  if (error || !data.user) return { user: null, response: jsonError("Sign in as an administrator.", 401) };

  if (data.user.app_metadata?.role === "admin") return { user: data.user, response: null };

  const admin = createAdminClient();
  const { data: registry, error: registryError } = await admin
    .from("vexora_admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (registryError || !registry) return { user: null, response: jsonError("Administrator access is required.", 403) };
  return { user: data.user, response: null };
}

function validMutationOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const source = origin ?? referer;
  if (!source) return false;
  try {
    return new URL(source).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function GET() {
  const auth = await authorizeAdmin();
  if (auth.response) return auth.response;

  try {
    const admin = createAdminClient();
    const { data: rows, error } = await admin
      .from("project_requests")
      .select("id,client_id,project_id,user_id,status,message,created_at,updated_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;

    const requests = rows ?? [];
    const clientIds = [...new Set(requests.map((row) => row.client_id))];
    const projectIds = [...new Set(requests.map((row) => row.project_id))];

    const [clientsResult, projectsResult] = await Promise.all([
      clientIds.length
        ? admin.from("clients").select("id,name,email,company_name").in("id", clientIds)
        : Promise.resolve({ data: [], error: null }),
      projectIds.length
        ? admin.from("projects").select("id,title,status").in("id", projectIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (clientsResult.error) throw clientsResult.error;
    if (projectsResult.error) throw projectsResult.error;

    const clients = new Map((clientsResult.data ?? []).map((item) => [item.id, item]));
    const projects = new Map((projectsResult.data ?? []).map((item) => [item.id, item]));

    return NextResponse.json({
      requests: requests.map((item) => ({
        ...item,
        client: (() => { const client = clients.get(item.client_id); return client ? { ...client, company: client.company_name ?? null } : null; })(),
        project: projects.get(item.project_id) ?? null,
      })),
    }, { headers });
  } catch (error) {
    console.error("Admin project requests GET failed:", error);
    return jsonError("Project requests could not be loaded. Verify the project_requests migration and database schema.", 500);
  }
}

export async function PATCH(request: Request) {
  if (!validMutationOrigin(request)) return jsonError("Invalid request origin.", 403);

  const auth = await authorizeAdmin();
  if (auth.response) return auth.response;

  const body: unknown = await request.json().catch(() => null);
  if (
    typeof body !== "object" || body === null ||
    !("requestId" in body) || typeof body.requestId !== "string" ||
    !("status" in body) || typeof body.status !== "string" ||
    !statuses.includes(body.status as RequestStatus)
  ) return jsonError("A valid request ID and status are required.", 400);

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("project_requests")
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq("id", body.requestId)
      .select("id,client_id,project_id,user_id,status,message,created_at,updated_at")
      .maybeSingle();

    if (error) throw error;
    if (!data) return jsonError("Project request not found.", 404);

    return NextResponse.json({ request: data }, { headers });
  } catch (error) {
    console.error("Admin project request update failed:", error);
    return jsonError("The project request could not be updated.", 500);
  }
}
