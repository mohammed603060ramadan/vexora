import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const allowed = new Set(["profile_updated", "password_changed", "logout"]);

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("activity_type" in body) ||
      typeof body.activity_type !== "string" || !allowed.has(body.activity_type)) {
    return NextResponse.json({ error: "Unsupported activity." }, { status: 400 });
  }

  const labels: Record<string, { title: string; description: string }> = {
    profile_updated: { title: "Profile updated", description: "Your account profile details were updated." },
    password_changed: { title: "Password changed", description: "Your account password was changed." },
    logout: { title: "Signed out", description: "You signed out of your VEXORA account." },
  };
  const entry = labels[body.activity_type];
  const admin = createAdminClient();
  const { error: insertError } = await admin.from("student_activity_logs").insert({
    user_id: user.id,
    activity_type: body.activity_type,
    title: entry.title,
    description: entry.description,
    metadata: { account_type: typeof user.user_metadata?.account_type === "string" ? user.user_metadata.account_type : "account" },
  });
  if (insertError) {
    console.error("Account activity log insert failed:", insertError.message);
    return NextResponse.json({ error: "Could not save activity." }, { status: 500 });
  }
  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
}
