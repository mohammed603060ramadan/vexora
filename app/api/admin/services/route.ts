import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const headers = { "Cache-Control": "private, no-store" };

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers });
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

async function authorizeAdmin(request: Request) {
  if (!validOrigin(request)) {
    return { admin: null, response: json({ error: "Invalid request origin." }, 403) };
  }

  const session = await createClient();
  const { data, error } = await session.auth.getUser();

  if (error || !data.user) {
    return { admin: null, response: json({ error: "Authentication required." }, 401) };
  }

  if (data.user.app_metadata?.role === "admin") {
    return { admin: createAdminClient(), response: null };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The admin registry is not present in the generated database types.
    const db: any = createAdminClient();
    const { data: record, error: registryError } = await db
      .from("vexora_admins")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (!registryError && record) {
      return { admin: db, response: null };
    }
  } catch (registryError) {
    console.error("Services administrator registry check failed:", registryError);
  }

  return { admin: null, response: json({ error: "Administrator access required." }, 403) };
}

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 20_000) return null;

  try {
    const body: unknown = await request.json();
    return body && typeof body === "object" && !Array.isArray(body)
      ? body as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}

function validateService(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const price = body.starting_price === null || body.starting_price === "" ? null : Number(body.starting_price);
  const days = body.estimated_days === null || body.estimated_days === "" ? null : Number(body.estimated_days);
  const displayOrder = body.display_order === undefined ? 0 : Number(body.display_order);
  const currency = typeof body.currency === "string" ? body.currency.trim().toUpperCase() : "USD";
  const status = typeof body.status === "string" ? body.status : "active";
  const departmentId = body.department_id === null || body.department_id === undefined
    ? null
    : typeof body.department_id === "string" ? body.department_id : "__invalid__";

  if (!name || name.length > 180) return { error: "Enter a service name up to 180 characters." };
  if (!slug || slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { error: "Enter a valid English slug using letters, numbers, and hyphens." };
  if (description.length > 10_000) return { error: "The service description is too long." };
  if (price !== null && (!Number.isFinite(price) || price < 0 || price > 9999999999)) return { error: "Price must be a valid non-negative number." };
  if (days !== null && (!Number.isInteger(days) || days < 0 || days > 100000)) return { error: "Duration must be a whole number of non-negative days." };
  if (!Number.isInteger(displayOrder) || displayOrder < -100000 || displayOrder > 100000) return { error: "Display order must be a whole number." };
  if (!/^[A-Z]{3}$/.test(currency)) return { error: "Currency must be a three-letter code, such as USD or EGP." };
  if (!["active", "inactive"].includes(status)) return { error: "Invalid service status." };
  if (departmentId === "__invalid__") return { error: "Invalid department ID." };

  return {
    value: {
      name,
      slug,
      description: description || null,
      starting_price: price,
      currency,
      estimated_days: days,
      display_order: displayOrder,
      status,
      department_id: departmentId,
    },
  };
}

function databaseError(error: { code?: string; message?: string }, fallback: string) {
  if (error.code === "23505") return json({ error: "This slug is already in use. Choose another slug." }, 409);
  if (error.code === "23503") return json({ error: "This service references a department or related record that no longer exists." }, 409);
  console.error(fallback, error.message ?? error.code ?? "Unknown database error");
  return json({ error: fallback }, 500);
}

export async function GET(request: Request) {
  const { admin, response } = await authorizeAdmin(request);
  if (response) return response;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Isolate service-table access while deployed database types are being reconciled.
  const db: any = admin;
  const { data, error } = await db
    .from("services")
    .select("id, department_id, slug, name, description, starting_price, currency, estimated_days, status, display_order, created_at, updated_at")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return databaseError(error, "Could not load services. Check the database schema and administrator permissions.");
  return json({ services: data ?? [] });
}

export async function POST(request: Request) {
  const { admin, response } = await authorizeAdmin(request);
  if (response) return response;

  const body = await readBody(request);
  if (!body) return json({ error: "Invalid JSON body or request is too large." }, 400);

  const validated = validateService(body);
  if ("error" in validated) return json({ error: validated.error }, 400);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Isolate service-table access while deployed database types are being reconciled.
  const db: any = admin;
  const { data, error } = await db.from("services").insert(validated.value).select("id").single();

  if (error) return databaseError(error, "Could not create the service.");
  return json({ success: true, id: data.id }, 201);
}

export async function PATCH(request: Request) {
  const { admin, response } = await authorizeAdmin(request);
  if (response) return response;

  const body = await readBody(request);
  if (!body) return json({ error: "Invalid JSON body or request is too large." }, 400);
  if (typeof body.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.id)) {
    return json({ error: "A valid service ID is required." }, 400);
  }

  // Status-only updates are used by the quick status toggle.
  let updates: Record<string, unknown>;
  if (Object.keys(body).length === 2 && ["active", "inactive"].includes(String(body.status))) {
    updates = { status: body.status };
  } else {
    const validated = validateService(body);
    if ("error" in validated) return json({ error: validated.error }, 400);
    updates = validated.value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Isolate service-table access while deployed database types are being reconciled.
  const db: any = admin;
  const { data, error } = await db.from("services").update(updates).eq("id", body.id).select("id").maybeSingle();

  if (error) return databaseError(error, "Could not update the service.");
  if (!data) return json({ error: "Service not found." }, 404);
  return json({ success: true });
}

export async function DELETE(request: Request) {
  const { admin, response } = await authorizeAdmin(request);
  if (response) return response;

  const body = await readBody(request);
  if (!body || typeof body.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.id)) {
    return json({ error: "A valid service ID is required." }, 400);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Isolate service-table access while deployed database types are being reconciled.
  const db: any = admin;
  const { data, error } = await db.from("services").delete().eq("id", body.id).select("id").maybeSingle();

  if (error) return databaseError(error, "Could not delete the service.");
  if (!data) return json({ error: "Service not found." }, 404);
  return json({ success: true });
}
