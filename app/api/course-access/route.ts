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
  return data.user;
}


export async function GET() {
  const user = await getSignedInUser();
  if (!user) return fail("Sign in to view course access requests.", 401);
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase generated types do not include course_access_requests yet.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase generated types do not include course_access_requests yet.
  const admin: any = createAdminClient();
    const { data, error } = await admin
      .from("course_access_requests")
      .select("id,course_id,student_id,email,purchase_code,status,student_message,admin_note,reviewed_by,reviewed_at,created_at,updated_at,courses(id,title,slug,price,currency,course_type,cover_image_url,promo_video_url)")
      .eq("student_id", user.id)
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
  const user = await getSignedInUser();
  if (!user) return fail("Sign in before requesting course access.", 401);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase generated types do not include course_access_requests yet.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase generated types do not include course_access_requests yet.
  const admin: any = createAdminClient();
    const { data: course, error: courseError } = await admin
      .from("courses")
      .select("id,title,status,price")
      .eq("id", courseId)
      .eq("status", "published")
      .maybeSingle();
    if (courseError) throw courseError;
    if (!course) return fail("This course is not available for access requests.", 404);

    const { data: existing, error: existingError } = await admin
      .from("course_access_requests")
      .select("id,purchase_code,status")
      .eq("course_id", courseId)
      .eq("student_id", user.id)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing) {
      if (existing.status === "rejected" || existing.status === "cancelled") {
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

    const { data: created, error: insertError } = await admin
      .from("course_access_requests")
      .insert({ course_id: courseId, student_id: user.id, email, student_message: studentMessage })
      .select("id,purchase_code,status,course_id,created_at")
      .single();
    if (insertError) throw insertError;
    return NextResponse.json({ request: created, message: "Request created. Keep your reference code; access is enabled after administrator approval." }, { status: 201, headers });
  } catch (error) {
    console.error("Course access request creation failed:", error);
    return fail("Could not create the access request. Check that the course access migration is applied.", 500);
  }
}
