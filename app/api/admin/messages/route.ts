import { readJsonBody } from "@/lib/server/read-json-body";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const headers = { "Cache-Control": "private, no-store" };

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers });
}

function validOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function authorizeAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { response: json({ error: "Authentication required." }, 401) };
  if (data.user.app_metadata?.role !== "admin") return { response: json({ error: "Administrator access required." }, 403) };
  return { response: null };
}

export async function GET(request: Request) {
  if (!validOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  const { response } = await authorizeAdmin();
  if (response) return response;

  const { data, error } = await createAdminClient()
    .from("inquiries")
    .select("id,full_name,email,phone,company,service,message,source,status,priority,created_at,updated_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("[Admin Messages API] Read failed:", error);
    return json({ error: "Could not load messages from the inquiries database." }, 500);
  }

  return json({ messages: data ?? [] });
}

export async function POST(request: Request) {
  if ((!request.headers.get("origin") || !validOrigin(request))) return json({ error: "Invalid request origin." }, 403);
  const { response } = await authorizeAdmin();
  if (response) return response;

  const body: unknown = await readJsonBody(request, 16384);
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "A valid message is required." }, 400);
  const value = body as Record<string, unknown>;
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const email = typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  const subject = typeof value.subject === "string" ? value.subject.trim() : "";
  const message = typeof value.message === "string" ? value.message.trim() : "";
  const company = typeof value.company === "string" ? value.company.trim() : "";
  const priority = value.priority;

  if (name.length < 2 || name.length > 160) return json({ error: "Enter a name between 2 and 160 characters." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return json({ error: "Enter a valid email address." }, 400);
  if (!subject || subject.length > 180) return json({ error: "A subject is required (180 characters maximum)." }, 400);
  if (!message || message.length > 10000) return json({ error: "A message is required (10,000 characters maximum)." }, 400);
  if (company.length > 180) return json({ error: "Company must be 180 characters or fewer." }, 400);
  if (!["Normal", "Important", "Urgent"].includes(String(priority))) return json({ error: "Select a valid priority." }, 400);

  const { data, error } = await createAdminClient()
    .from("inquiries")
    .insert({
      full_name: name,
      email,
      company: company || null,
      service: subject,
      message,
      source: "admin",
      status: "new",
      priority: priority === "Urgent" ? "urgent" : priority === "Important" ? "high" : "medium",
    })
    .select("id,full_name,email,phone,company,service,message,source,status,priority,created_at,updated_at")
    .single();

  if (error) {
    console.error("[Admin Messages API] Create failed:", error);
    return json({ error: "Could not save this message to the inquiries database." }, 500);
  }

  return json({ message: data, success: true }, 201);
}

export async function PATCH(request: Request) {
  if ((!request.headers.get("origin") || !validOrigin(request))) return json({ error: "Invalid request origin." }, 403);
  const { response } = await authorizeAdmin();
  if (response) return response;

  const body: unknown = await readJsonBody(request, 16384);
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "A valid message update is required." }, 400);
  const value = body as Record<string, unknown>;
  const id = typeof value.id === "string" ? value.id : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return json({ error: "A valid message ID is required." }, 400);

  const updates: { status?: string; priority?: string } = {};
  if (value.status !== undefined) {
    if (!["Unread", "Read", "Archived"].includes(String(value.status))) return json({ error: "Invalid message status." }, 400);
    updates.status = value.status === "Unread" ? "new" : value.status === "Archived" ? "closed" : "contacted";
  }
  if (value.priority !== undefined) {
    if (!["Normal", "Important", "Urgent"].includes(String(value.priority))) return json({ error: "Invalid message priority." }, 400);
    updates.priority = value.priority === "Urgent" ? "urgent" : value.priority === "Important" ? "high" : "medium";
  }
  if (value.starred !== undefined) {
    if (typeof value.starred !== "boolean") return json({ error: "Starred must be a boolean." }, 400);
    if (value.priority === undefined) updates.priority = value.starred ? "high" : "medium";
  }
  if (Object.keys(updates).length === 0) return json({ error: "No supported message changes were provided." }, 400);

  const { data, error } = await createAdminClient()
    .from("inquiries")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id,full_name,email,phone,company,service,message,source,status,priority,created_at,updated_at")
    .maybeSingle();

  if (error) {
    console.error("[Admin Messages API] Update failed:", error);
    return json({ error: "Could not update this message." }, 500);
  }
  if (!data) return json({ error: "Message not found." }, 404);
  return json({ message: data, success: true });
}
