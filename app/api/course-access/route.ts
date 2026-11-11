import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const headers = { "Cache-Control": "private, no-store" };

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers });
}

async function getSignedInUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { supabase, user: data.user };
}

export async function GET() {
  const session = await getSignedInUser();
  if (!session) return fail("Sign in to view course access requests.", 401);
  try {
    const { data, error } = await session.supabase
      .from("course_access_requests")
      .select("id,course_id,student_id,email,purchase_code,status,student_message,admin_note,reviewed_by,reviewed_at,created_at,updated_at,courses(id,title,slug,price,currency,course_type)")
      .eq("student_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return NextResponse.json({ requests: data ?? [] }, { headers });
  } catch (error) {
    console.error("Course access request lookup failed:", error);
    return fail("Course access requests are not available yet. Apply the course access migration in Supabase.", 500);
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return fail("Invalid request origin.", 403);
      }
    } catch {
      return fail("Invalid request origin.", 403);
    }
  }
  const session = await getSignedInUser();
  if (!session) return fail("Sign in before requesting course access.", 401);
  const { supabase, user } = session;
  const email = user.email?.trim().toLowerCase();
  if (!email) return fail("Your account needs a verified email address.", 400);

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("courseId" in body) || typeof body.courseId !== "string") {
    return fail("Select a valid course.", 400);
  }
  const courseId = body.courseId.trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(courseId)) {
    return fail("Select a valid course.", 400);
  }
  const studentMessage = "message" in body && typeof body.message === "string" ? body.message.trim().slice(0, 1000) || null : null;

  try {
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id,title,status,price")
      .eq("id", courseId)
      .eq("status", "published")
      .maybeSingle();
    if (courseError) throw courseError;
    if (!course) return fail("This course is not available for access requests.", 404);

    const { data: existing, error: existingError } = await supabase
      .from("course_access_requests")
      .select("id,purchase_code,status")
      .eq("course_id", courseId)
      .eq("student_id", user.id)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing) {
      if (existing.status === "rejected" || existing.status === "cancelled") {
        // Reopening a reviewed request is an administrator-only mutation;
        // keep that narrow operation on the server-side service client.
        const admin = createAdminClient();
        const { data: reopened, error: reopenError } = await admin
          .from("course_access_requests")
          .update({ status: "pending", student_message: studentMessage, admin_note: null, reviewed_by: null, reviewed_at: null, updated_at: new Date().toISOString() })
          .eq("id", existing.id)
          .select("id,purchase_code,status,course_id,created_at")
          .single();
        if (reopenError) throw reopenError;
        return NextResponse.json({ request: reopened, message: "Your access request has been resubmitted." }, { status: 200, headers });
      }
      return NextResponse.json({ request: existing, message: "You already have an access request for this course." }, { status: 200, headers });
    }

    // New requests are written with the signed-in session. The database RLS
    // policy verifies student_id and email against the user's JWT, so this
    // path does not depend on a service-role key being present in the deploy.
    const { data: created, error: insertError } = await supabase
      .from("course_access_requests")
      .insert({ course_id: courseId, student_id: user.id, email, student_message: studentMessage })
      .select("id,purchase_code,status,course_id,created_at")
      .single();
    if (insertError?.code === "23505") {
      return fail("An access request for this course already exists.", 409);
    }
    if (insertError) throw insertError;
    return NextResponse.json({ request: created, message: "Request created. Keep your reference code; access is enabled after administrator approval." }, { status: 201, headers });
  } catch (error) {
    console.error("Course access request creation failed:", error);
    return fail("We could not save your access request right now. Please try again. If the problem continues, contact the VEXORA Academy team.", 500);
  }
}
