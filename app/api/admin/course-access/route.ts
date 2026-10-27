import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const headers = { "Cache-Control": "private, no-store" };

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers });
}

async function authorizeAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { user: null, response: fail("Sign in required.", 401) };
  if (data.user.app_metadata?.role === "admin") return { user: data.user, response: null };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase generated types do not include course_access_requests yet.
  const admin: any = createAdminClient();
  const { data: registry, error: registryError } = await admin
    .from("vexora_admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (registryError || !registry) return { user: null, response: fail("Administrator permission required.", 403) };
  return { user: data.user, response: null };
}

export async function GET() {
  const auth = await authorizeAdmin();
  if (auth.response) return auth.response;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase generated types do not include course_access_requests yet.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase generated types do not include course_access_requests yet.
  const admin: any = createAdminClient();
    const { data, error } = await admin
      .from("course_access_requests")
      .select("id,course_id,student_id,email,purchase_code,status,student_message,admin_note,reviewed_by,reviewed_at,created_at,updated_at,courses(id,title,slug,price,currency,course_type,cover_image_url,promo_video_url)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return NextResponse.json({ requests: data ?? [] }, { headers });
  } catch (error) {
    console.error("Admin course access lookup failed:", error);
    return fail("Could not load course access requests. Check the course access migration.", 500);
  }
}

export async function PATCH(request: Request) {
  const auth = await authorizeAdmin();
  if (auth.response || !auth.user) return auth.response ?? fail("Administrator permission required.", 403);
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("id" in body) || typeof body.id !== "string" || !("status" in body) || !["approved", "rejected", "pending"].includes(String(body.status))) {
    return fail("A valid request and status are required.", 400);
  }
  const id = body.id.trim();
  const status = body.status as "approved" | "rejected" | "pending";
  const adminNote = "adminNote" in body && typeof body.adminNote === "string" ? body.adminNote.trim().slice(0, 1500) || null : null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase generated types do not include course_access_requests yet.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase generated types do not include course_access_requests yet.
  const admin: any = createAdminClient();
    const { data: current, error: currentError } = await admin
      .from("course_access_requests")
      .select("id,status,course_id,student_id")
      .eq("id", id)
      .maybeSingle();
    if (currentError) throw currentError;
    if (!current) return fail("Access request not found.", 404);
    if (status === "approved") {
      const { data: course, error: courseError } = await admin.from("courses").select("id,status").eq("id", current.course_id).maybeSingle();
      if (courseError) throw courseError;
      if (!course || course.status !== "published") return fail("Publish the course before approving access.", 409);
    }
    const { data, error } = await admin
      .from("course_access_requests")
      .update({ status, admin_note: adminNote, reviewed_by: auth.user.id, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id,course_id,student_id,email,purchase_code,status,student_message,admin_note,reviewed_by,reviewed_at,created_at,updated_at")
      .single();
    if (error) throw error;
    return NextResponse.json({ request: data, message: status === "approved" ? "Access approved. The enrollment is granted by the database trigger." : "Access request updated." }, { headers });
  } catch (error) {
    console.error("Admin course access update failed:", error);
    return fail("Could not update this access request. Check the migration and administrator permissions.", 500);
  }
}
