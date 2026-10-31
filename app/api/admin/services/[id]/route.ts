import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteContext = { params: Promise<{ id: string }> };

async function authorizeAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { response: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  }
  if (data.user.app_metadata?.role !== "admin") {
    return { response: NextResponse.json({ error: "Administrator access required." }, { status: 403 }) };
  }
  return { response: null };
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

function databaseError(error: { code?: string; message?: string; details?: string; hint?: string }) {
  console.error("[Admin Services API]", error);
  return NextResponse.json({
    error: error.message || "The services database operation failed.",
    code: error.code || null,
    details: error.details || null,
    hint: error.hint || null,
  }, { status: error.code === "23505" ? 409 : 400 });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!validOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const { response } = await authorizeAdmin();
  if (response) return response;

  const { id } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid service ID." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!isRecord(body)) {
    return NextResponse.json({ error: "A valid update payload is required." }, { status: 400 });
  }

  const allowed = ["name", "slug", "description", "starting_price", "currency", "estimated_days", "status", "display_order"];
  if (Object.keys(body).length === 0 || Object.keys(body).some((key) => !allowed.includes(key))) {
    return NextResponse.json({ error: "The update contains no fields or unsupported fields." }, { status: 400 });
  }

  if ("status" in body && !["active", "inactive", "archived"].includes(String(body.status))) {
    return NextResponse.json({ error: "Status must be active, inactive, or archived." }, { status: 400 });
  }

  if ("name" in body && (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 180)) {
    return NextResponse.json({ error: "Service name is invalid." }, { status: 400 });
  }
  if ("slug" in body && (typeof body.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug) || body.slug.length > 120)) {
    return NextResponse.json({ error: "Service slug is invalid." }, { status: 400 });
  }
  if ("currency" in body && (typeof body.currency !== "string" || !/^[A-Z]{3}$/.test(body.currency))) {
    return NextResponse.json({ error: "Currency must be a three-letter uppercase code." }, { status: 400 });
  }
  if ("starting_price" in body && body.starting_price !== null &&
      (typeof body.starting_price !== "number" || !Number.isFinite(body.starting_price) || body.starting_price < 0)) {
    return NextResponse.json({ error: "Starting price must be non-negative or null." }, { status: 400 });
  }
  if ("estimated_days" in body && body.estimated_days !== null &&
      (!Number.isInteger(body.estimated_days) || Number(body.estimated_days) < 0)) {
    return NextResponse.json({ error: "Estimated days must be a non-negative whole number or null." }, { status: 400 });
  }
  if ("display_order" in body && !Number.isInteger(body.display_order)) {
    return NextResponse.json({ error: "Display order must be a whole number." }, { status: 400 });
  }
  if ("description" in body && body.description !== null && typeof body.description !== "string") {
    return NextResponse.json({ error: "Description must be text or null." }, { status: 400 });
  }

  const { data, error } = await createAdminClient()
    .from("services")
    .update(body)
    .eq("id", id)
    .select("id, department_id, slug, name, description, starting_price, currency, estimated_days, status, display_order, created_at, updated_at")
    .maybeSingle();

  if (error) return databaseError(error);
  if (!data) return NextResponse.json({ error: "Service not found." }, { status: 404 });
  return NextResponse.json({ service: data });
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!validOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const { response } = await authorizeAdmin();
  if (response) return response;

  const { id } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid service ID." }, { status: 400 });
  }

  const { data, error } = await createAdminClient()
    .from("services")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return databaseError(error);
  if (!data) return NextResponse.json({ error: "Service not found." }, { status: 404 });
  return NextResponse.json({ success: true });
}
