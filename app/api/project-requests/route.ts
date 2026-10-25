import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type DatabaseTable<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type ProjectRequestsDatabase = {
  public: {
    Tables: {
      clients: DatabaseTable<
        { id: string; auth_user_id: string | null; user_id: string | null },
        { id?: string; auth_user_id?: string | null; user_id?: string | null },
        { id?: string; auth_user_id?: string | null; user_id?: string | null }
      >;
      projects: DatabaseTable<
        {
          id: string;
          title: string;
          portfolio_category: string | null;
          show_on_projects_page: boolean;
          status: string;
        },
        Record<string, unknown>,
        Record<string, unknown>
      >;
      project_requests: DatabaseTable<
        {
          id: string;
          client_id: string;
          project_id: string;
          user_id: string;
          status: string;
          message: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          client_id: string;
          project_id: string;
          user_id: string;
          status: string;
          message: string | null;
        },
        {
          status?: string;
          message?: string | null;
          updated_at?: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: NO_STORE_HEADERS,
    }
  );
}

function getAdminClient() {
  return createAdminClient() as unknown as SupabaseClient<ProjectRequestsDatabase>;
}

async function findClientForUser(admin: ReturnType<typeof getAdminClient>, userId: string) {
  const byAuthUser = await admin
    .from("clients")
    .select("id")
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (!byAuthUser.error && byAuthUser.data) return byAuthUser.data;

  // Compatibility with installations created before auth_user_id was added.
  const byLegacyUser = await admin
    .from("clients")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (byLegacyUser.error) {
    if (byAuthUser.error) throw byAuthUser.error;
    throw byLegacyUser.error;
  }
  return byLegacyUser.data;
}

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonError("Sign in to view your project requests.", 401);
    }

    const admin = getAdminClient();

    const client = await findClientForUser(admin, user.id);

    if (!client) {
      return NextResponse.json(
        { requests: [] },
        { headers: NO_STORE_HEADERS }
      );
    }

    const { data, error } = await admin
      .from("project_requests")
      .select(
        "id,client_id,project_id,status,message,created_at,updated_at"
      )
      .eq("client_id", client.id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const rows = data ?? [];
    const projectIds = [...new Set(rows.map((item) => item.project_id))];

    const { data: projects, error: projectsError } = projectIds.length
      ? await admin
          .from("projects")
          .select("id,title,portfolio_category")
          .in("id", projectIds)
      : { data: [], error: null };

    if (projectsError) {
      throw projectsError;
    }

    const projectById = new Map(
      (projects ?? []).map((project) => [project.id, project])
    );

    const requests = rows.map((item) => ({
      ...item,
      projects: projectById.get(item.project_id) ?? null,
    }));

    return NextResponse.json(
      { requests },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Project requests GET failed:", error);

    return jsonError(
      "Project requests are temporarily unavailable. Verify the project_requests migration is applied.",
      500
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonError("Sign in to request a project.", 401);
    }

    const body: unknown = await request.json().catch(() => null);

    if (
      !body ||
      typeof body !== "object" ||
      !("projectId" in body) ||
      typeof body.projectId !== "string"
    ) {
      return jsonError("A valid project is required.", 400);
    }

    const projectId = body.projectId.trim();

    if (!isValidUuid(projectId)) {
      return jsonError("A valid project is required.", 400);
    }

    const message =
      "message" in body && typeof body.message === "string"
        ? body.message.trim().slice(0, 1000) || null
        : null;

    const admin = getAdminClient();

    const [
      client,
      { data: project, error: projectError },
    ] = await Promise.all([
      findClientForUser(admin, user.id),

      admin
        .from("projects")
        .select("id,title,show_on_projects_page,status")
        .eq("id", projectId)
        .maybeSingle(),
    ]);

    if (projectError) {
      throw projectError;
    }

    if (!client) {
      return jsonError(
        "Complete your client account before requesting a project.",
        403
      );
    }

    if (
      !project ||
      !project.show_on_projects_page ||
      !["in_progress", "completed"].includes(project.status)
    ) {
      return jsonError(
        "This project is not available for requests.",
        404
      );
    }

    const { data: existing, error: existingError } = await admin
      .from("project_requests")
      .select("id,status")
      .eq("client_id", client.id)
      .eq("project_id", projectId)
      .in("status", ["pending", "reviewing", "approved"])
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existing) {
      return NextResponse.json(
        {
          error: "You already have an active request for this project.",
          request: existing,
        },
        {
          status: 409,
          headers: NO_STORE_HEADERS,
        }
      );
    }

    const { data: created, error: insertError } = await admin
      .from("project_requests")
      .insert({
        client_id: client.id,
        project_id: projectId,
        user_id: user.id,
        message,
        status: "pending",
      })
      .select(
        "id,client_id,project_id,status,message,created_at,updated_at"
      )
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return jsonError(
          "You already have an active request for this project.",
          409
        );
      }

      throw insertError;
    }

    return NextResponse.json(
      { request: created },
      {
        status: 201,
        headers: NO_STORE_HEADERS,
      }
    );
  } catch (error) {
    console.error("Project request POST failed:", error);

    return jsonError(
      "The request could not be saved. Verify the project_requests migration is applied.",
      500
    );
  }
}
