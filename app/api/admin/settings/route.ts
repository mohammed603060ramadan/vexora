import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];


async function getAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { supabase, user: null, response: NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    ) };
  }

  if (data.user.app_metadata?.role !== "admin") {
    return { supabase, user: null, response: NextResponse.json(
      { error: "Administrator access required." },
      { status: 403 }
    ) };
  }

  return { supabase, user: data.user, response: null };
}

export async function GET() {
  const { supabase, response } = await getAdmin();
  if (response) return response;

  const { data, error } = await supabase
    .from("site_settings")
    .select("settings, updated_at")
    .eq("id", "global")
    .maybeSingle();

  if (error) {
    console.error("Settings read failed:", error.message);
    return NextResponse.json(
      { error: "Could not load settings. Check the database migration." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    settings: data?.settings ?? {},
    updatedAt: data?.updated_at ?? null,
  });
}

export async function PUT(request: Request) {
  const { supabase, user, response } = await getAdmin();
  if (response) return response;

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 100_000) {
    return NextResponse.json(
      { error: "Settings payload is too large." },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
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
    return NextResponse.json(
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
    return NextResponse.json(
      { error: "Settings must be a JSON object." },
      { status: 400 }
    );
  }

  if (JSON.stringify(settingsValue).length > 90_000) {
    return NextResponse.json(
      { error: "Settings payload is too large." },
      { status: 413 }
    );
  }

  const settings = settingsValue as Json;

  const { data, error } = await supabase
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
    return NextResponse.json(
      { error: "Could not save settings. Check the database migration and permissions." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    settings: data.settings,
    updatedAt: data.updated_at,
  });
}
