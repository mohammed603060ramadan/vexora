import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type JsonResponseInit = { status?: number };
const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

function jsonResponse(body: unknown, init: JsonResponseInit = {}) {
  return NextResponse.json(body, { ...init, headers: NO_STORE_HEADERS });
}


async function getAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      user: null,
      admin: null,
      response: jsonResponse({ error: "Authentication required." }, { status: 401 }),
    };
  }

  if (data.user.app_metadata?.role === "admin") {
    return { user: data.user, admin: createAdminClient(), response: null };
  }

  // Keep compatibility with VEXORA's canonical admin registry. The registry
  // is queried only on the server through the service-role client.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Settings schema is JSONB and admin registry is not in generated types.
    const admin: any = createAdminClient();
    const { data: registry, error: registryError } = await admin
      .from("vexora_admins")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (!registryError && registry) {
      return { user: data.user, admin, response: null };
    }
  } catch (registryError) {
    console.error("Administrator registry check failed:", registryError);
  }

  return {
    user: null,
    admin: null,
    response: jsonResponse({ error: "Administrator access required." }, { status: 403 }),
  };
}

export async function GET() {
  const { admin, response } = await getAdmin();
  if (response) return response;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- site_settings JSONB is intentionally flexible.
  const { data, error } = await (admin as any)
    .from("site_settings")
    .select("settings, updated_at")
    .eq("id", "global")
    .maybeSingle();

  if (error) {
    console.error("Settings read failed:", error.message);
    return jsonResponse(
      { error: "Could not load settings. Check the database migration." },
      { status: 500 }
    );
  }

  return jsonResponse({
    settings: data?.settings ?? {},
    updatedAt: data?.updated_at ?? null,
  });
}

export async function PUT(request: Request) {
  const { admin, user, response } = await getAdmin();
  if (response) return response;

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 100_000) {
    return jsonResponse(
      { error: "Settings payload is too large." },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    !("settings" in body)
  ) {
    return jsonResponse(
      { error: "Expected a settings object." },
      { status: 400 }
    );
  }

  const settingsValue = (body as { settings: unknown }).settings;

  if (
    !settingsValue ||
    typeof settingsValue !== "object" ||
    Array.isArray(settingsValue)
  ) {
    return jsonResponse(
      { error: "Settings must be a JSON object." },
      { status: 400 }
    );
  }

  if (JSON.stringify(settingsValue).length > 90_000) {
    return jsonResponse(
      { error: "Settings payload is too large." },
      { status: 413 }
    );
  }

  const settings = settingsValue as Json;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- site_settings JSONB is intentionally flexible.
  const { data, error } = await (admin as any)
    .from("site_settings")
    .upsert(
      {
        id: "global",
        settings,
        updated_at: new Date().toISOString(),
        updated_by: user!.id,
      },
      { onConflict: "id" }
    )
    .select("settings, updated_at")
    .single();

  if (error) {
    console.error("Settings save failed:", error.message);
    return jsonResponse(
      { error: "Could not save settings. Check the database migration and permissions." },
      { status: 500 }
    );
  }

  return jsonResponse({
    success: true,
    settings: data.settings,
    updatedAt: data.updated_at,
  });
}
