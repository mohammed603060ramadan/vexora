import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const allowed = new Set(["account_created", "login", "profile_updated", "password_changed", "logout"]);

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles").select("account_type").eq("id", user.id).maybeSingle();
  if (profileError || (profile?.account_type !== "student" && profile?.account_type !== "client")) {
    return NextResponse.json({ error: "Account profile could not be verified." }, { status: 403 });
  }
  const isStudent = profile.account_type === "student";
  const [logsResult, enrollmentsResult, registrationsResult, requestsResult, tasksResult] = await Promise.all([
    admin.from("student_activity_logs").select("id,title,description,created_at,activity_type").eq("user_id", user.id).order("created_at", { ascending: false }).limit(40),
    isStudent ? admin.from("enrollments").select("id,course_id,status,progress_percent,enrolled_at").eq("student_id", user.id).order("enrolled_at", { ascending: false }).limit(30) : Promise.resolve({ data: [], error: null }),
    isStudent && user.email ? admin.from("student_registrations").select("id,track,status,created_at").eq("email", user.email.toLowerCase()).order("created_at", { ascending: false }).limit(30) : Promise.resolve({ data: [], error: null }),
    admin.from("project_requests").select("id,status,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30),
    admin.from("tasks").select("id,title,status,created_at,updated_at").eq("assigned_to", user.id).order("updated_at", { ascending: false }).limit(30),
  ]);

  const courseIds = [...new Set((enrollmentsResult.data ?? []).map((row: { course_id: string }) => row.course_id).filter(Boolean))];
  const coursesResult = courseIds.length ? await admin.from("courses").select("id,title").in("id", courseIds) : { data: [], error: null };
  const courseNames = new Map((coursesResult.data ?? []).map((row: { id: string; title: string }) => [row.id, row.title]));

  const events: Array<{ id: string; title: string; description: string; created_at: string; activity_type: string }> = [];
  for (const row of logsResult.data ?? []) events.push({ ...row, description: row.description ?? "", activity_type: row.activity_type });
  for (const row of enrollmentsResult.data ?? []) events.push({
    id: `enrollment:${row.id}`, title: row.status === "completed" ? "Course completed" : "Course enrollment",
    description: `${courseNames.get(row.course_id) ?? "VEXORA course"} · ${row.progress_percent ?? 0}% progress · ${row.status}`,
    created_at: row.enrolled_at, activity_type: row.status === "completed" ? "course_completed" : "course_registered",
  });
  for (const row of registrationsResult.data ?? []) events.push({
    id: `registration:${row.id}`, title: "Offline course registration",
    description: `${row.track} · ${row.status === "new" ? "Received" : row.status}`,
    created_at: row.created_at, activity_type: "offline_registration",
  });
  for (const row of requestsResult.data ?? []) events.push({
    id: `request:${row.id}`, title: "Project request",
    description: `Request status: ${row.status}`, created_at: row.created_at, activity_type: "project_request",
  });
  for (const row of tasksResult.data ?? []) events.push({
    id: `task:${row.id}`, title: "Task updated",
    description: `${row.title} · ${row.status}`, created_at: row.updated_at ?? row.created_at, activity_type: "task_updated",
  });
  events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return NextResponse.json({ activities: events.slice(0, 50) }, { headers: { "Cache-Control": "private, no-store" } });
}

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
    account_created: { title: "Account created", description: "Your VEXORA account was created." },
    login: { title: "Signed in", description: "You signed in to your VEXORA account." },
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
  });
  if (insertError) {
    console.error("Account activity log insert failed:", insertError.message);
    return NextResponse.json({ error: "Could not save activity." }, { status: 500 });
  }
  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
}
