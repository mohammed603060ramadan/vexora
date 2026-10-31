import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const serviceColumns =
  "id, department_id, slug, name, description, starting_price, currency, estimated_days, status, display_order, created_at, updated_at";

async function authorizeAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      response: NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      ),
    };
  }

  if (data.user.app_metadata?.role !== "admin") {
    return {
      response: NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 },
      ),
    };
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

function databaseError(error: {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}) {
  console.error("[Admin Services API]", error);
  return NextResponse.json(
    {
      error: error.message || "The services database operation failed.",
      code: error.code || null,
      details: error.details || null,
      hint: error.hint || null,
    },
    { status: error.code === "23505" ? 409 : 400 },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validateService(value: unknown) {
  if (!isRecord(value)) return "A valid service payload is required.";

  const { name, slug, description, starting_price, currency, estimated_days, status, display_order } = value;

  if (typeof name !== "string" || !name.trim() || name.trim().length > 180) {
    return "Service name is required and must be 180 characters or fewer.";
  }
  if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) {
    return "A valid unique URL slug is required.";
  }
  if (description !== null && description !== undefined && typeof description !== "string") {
    return "Description must be text.";
  }
  if (starting_price !== null && starting_price !== undefined &&
      (typeof starting_price !== "number" || !Number.isFinite(starting_price) || starting_price < 0)) {
    return "Starting price must be a non-negative number or null.";
  }
  if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) {
    return "Currency must be a three-letter uppercase code.";
  }
  if (estimated_days !== null && estimated_days !== undefined &&
      (!Number.isInteger(estimated_days) || Number(estimated_days) < 0)) {
    return "Estimated days must be a non-negative whole number or null.";
  }
  if (!["active", "inactive", "archived"].includes(String(status))) {
    return "Status must be active, inactive, or archived.";
  }
  if (!Number.isInteger(display_order)) {
    return "Display order must be a whole number.";
  }

  return null;
}

export async function GET(request: Request) {
  if (!validOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const { response } = await authorizeAdmin();
  if (response) return response;

  const { data, error } = await createAdminClient()
    .from("services")
    .select(serviceColumns)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return databaseError(error);
  return NextResponse.json({ services: data ?? [] });
}

export async function POST(request: Request) {
  if (!validOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const { response } = await authorizeAdmin();
  if (response) return response;

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 20_000) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validationError = validateService(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { data, error } = await createAdminClient()
    .from("services")
    .insert(body as Record<string, unknown>)
    .select(serviceColumns)
    .single();

  if (error) return databaseError(error);
  return NextResponse.json({ service: data }, { status: 201 });
}
