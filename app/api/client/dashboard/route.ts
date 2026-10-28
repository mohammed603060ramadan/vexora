import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const headers = { "Cache-Control": "private, no-store" };

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers });
}

type ClientRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  created_at: string;
};

async function resolveClient(admin: ReturnType<typeof createAdminClient>, userId: string, email: string | null) {
  // The repository Supabase Database type does not include every legacy clients column.
  // Keep this compatibility route dynamically typed at the query boundary only.
  const db = admin as any;
  const modern = await db
    .from("clients")
    .select("id, name, email, phone, company, created_at")
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (!modern.error && modern.data) {
    return { client: modern.data as ClientRow, linkColumn: "auth_user_id" as const };
  }

  const modernColumnMissing = Boolean(modern.error && /auth_user_id|column .* does not exist|schema cache/i.test(modern.error.message));
  if (modern.error && !modernColumnMissing) throw modern.error;

  if (modernColumnMissing) {
    const legacy = await db
      .from("clients")
      .select("id, name, email, phone, company, created_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (legacy.error) throw legacy.error;
    if (legacy.data) return { client: legacy.data as ClientRow, linkColumn: "user_id" as const };
  }

  if (!email) return { client: null, linkColumn: modernColumnMissing ? "user_id" as const : "auth_user_id" as const };

  // Admin-created client records may predate account linking. Link only one
  // exact-email match whose account link is empty; never take over another user.
  const modernCandidates = await db
    .from("clients")
    .select("id, name, email, phone, company, created_at, auth_user_id")
    .eq("email", email)
    .limit(2);

  if (!modernCandidates.error) {
    const candidates = modernCandidates.data ?? [];
    if (candidates.length > 1) throw new Error("Multiple client records match this account email.");
    const candidate = candidates[0];
    if (!candidate) return { client: null, linkColumn: "auth_user_id" as const };
    if (candidate.auth_user_id && candidate.auth_user_id !== userId) {
      return { client: null, linkColumn: "auth_user_id" as const };
    }
    if (!candidate.auth_user_id) {
      const linked = await db.from("clients")
        .update({ auth_user_id: userId })
        .eq("id", candidate.id)
        .is("auth_user_id", null)
        .select("id")
        .maybeSingle();
      if (linked.error) throw linked.error;
      if (!linked.data) return { client: null, linkColumn: "auth_user_id" as const };
    }
    const { auth_user_id: _ignored, ...client } = candidate;
    return { client: client as ClientRow, linkColumn: "auth_user_id" as const };
  }

  if (!/auth_user_id|column .* does not exist|schema cache/i.test(modernCandidates.error.message)) {
    throw modernCandidates.error;
  }

  const legacyCandidates = await db
    .from("clients")
    .select("id, name, email, phone, company, created_at, user_id")
    .eq("email", email)
    .limit(2);
  if (legacyCandidates.error) throw legacyCandidates.error;
  const candidates = legacyCandidates.data ?? [];
  if (candidates.length > 1) throw new Error("Multiple client records match this account email.");
  const candidate = candidates[0];
  if (!candidate) return { client: null, linkColumn: "user_id" as const };
  if (candidate.user_id && candidate.user_id !== userId) {
    return { client: null, linkColumn: "user_id" as const };
  }
  if (!candidate.user_id) {
    const linked = await db.from("clients")
      .update({ user_id: userId })
      .eq("id", candidate.id)
      .is("user_id", null)
      .select("id")
      .maybeSingle();
    if (linked.error) throw linked.error;
    if (!linked.data) return { client: null, linkColumn: "user_id" as const };
  }
  const { user_id: _ignored, ...client } = candidate;
  return { client: client as ClientRow, linkColumn: "user_id" as const };
}

export async function GET() {
  try {
    const sessionClient = await createClient();
    const { data, error } = await sessionClient.auth.getUser();
    if (error || !data.user) return jsonError("Sign in to view your client workspace.", 401);

    const admin = createAdminClient();
    const db = admin as any;
    const resolved = await resolveClient(admin, data.user.id, data.user.email?.trim().toLowerCase() ?? null);
    if (!resolved.client) {
      return NextResponse.json({ client: null, projects: [], tasks: [], linked: false }, { headers });
    }

    const projectBase = db.from("projects")
      .select("id, title, description, status, deadline, created_at")
      .eq("client_id", resolved.client.id)
      .order("created_at", { ascending: false })
      .limit(100);
    const projectResult = await projectBase;
    if (projectResult.error) throw projectResult.error;

    const projectIds = (projectResult.data ?? []).map((project) => project.id);
    let projects = (projectResult.data ?? []).map((project) => ({ ...project, budget: null as number | null }));

    if (projectIds.length) {
      const budgetResult = await db.from("projects")
        .select("id, budget")
        .in("id", projectIds);
      if (!budgetResult.error) {
        const budgetById = new Map((budgetResult.data ?? []).map((project) => [project.id, project.budget]));
        projects = projects.map((project) => ({ ...project, budget: budgetById.get(project.id) ?? null }));
      } else if (!/budget|column .* does not exist|schema cache/i.test(budgetResult.error.message)) {
        throw budgetResult.error;
      }
    }

    let tasks: Array<{
      id: string; project_id: string | null; title: string; description: string | null;
      status: string; priority: string; due_date: string | null;
    }> = [];
    if (projectIds.length) {
      const taskResult = await db.from("tasks")
        .select("id, project_id, title, description, status, priority, due_date")
        .in("project_id", projectIds)
        .order("due_date", { ascending: true, nullsFirst: false })
        .limit(500);
      if (taskResult.error) throw taskResult.error;
      tasks = taskResult.data ?? [];
    }

    return NextResponse.json({
      client: resolved.client,
      projects,
      tasks,
      linked: true,
      generatedAt: new Date().toISOString(),
    }, { headers });
  } catch (error) {
    console.error("Client dashboard data load failed:", error);
    return jsonError("Client workspace data is temporarily unavailable. Please refresh or contact VEXORA support.", 500);
  }
}
