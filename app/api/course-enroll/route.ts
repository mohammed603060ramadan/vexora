import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const headers = { "Cache-Control": "private, no-store" };

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return fail("Request origin could not be verified.", 403);
  try {
    if (new URL(origin).origin !== new URL(request.url).origin) {
      return fail("Invalid request origin.", 403);
    }
  } catch {
    return fail("Invalid request origin.", 403);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 2_048) return fail("Request body is too large.", 413);
  const rawBody = await request.text().catch(() => "");
  if (rawBody.length > 2_048) return fail("Request body is too large.", 413);
  let body: unknown = null;
  try { body = JSON.parse(rawBody); } catch { return fail("Invalid JSON body.", 400); }

  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return fail("Sign in to enroll in a free course.", 401);

  if (!body || typeof body !== "object" || Array.isArray(body) || !("courseId" in body) || typeof body.courseId !== "string") {
    return fail("Select a valid course.", 400);
  }
  const courseId = body.courseId.trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(courseId)) {
    return fail("Select a valid course.", 400);
  }

  try {
    const admin = createAdminClient();
    const { data: accountProfile, error: accountProfileError } = await admin
      .from("profiles")
      .select("account_type")
      .eq("id", auth.user.id)
      .maybeSingle();
    if (accountProfileError) throw accountProfileError;
    if (accountProfile?.account_type !== "student") return fail("Only student accounts can enroll in Academy courses.", 403);

    const { data: course, error: courseError } = await admin
      .from("courses")
      .select("id,title,status,price")
      .eq("id", courseId)
      .eq("status", "published")
      .maybeSingle();
    if (courseError) throw courseError;
    if (!course) return fail("This course is not currently published.", 404);
    if (Number(course.price ?? 0) !== 0) return fail("This VEXORA Academy course is not configured as free. Contact the Academy team.", 409);

    const { data: existing, error: existingError } = await admin
      .from("enrollments")
      .select("id,status")
      .eq("student_id", auth.user.id)
      .eq("course_id", courseId)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing?.status === "active" || existing?.status === "completed") {
      return NextResponse.json({ success: true, message: "You are already enrolled. Your course is ready in My Courses." }, { headers });
    }

    const enrollmentPayload = {
      student_id: auth.user.id,
      course_id: courseId,
      status: "active",
      enrollment_source: "self",
      progress_percent: 0,
      created_by: null,
      enrolled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { error: enrollmentError } = await admin
      .from("enrollments")
      .upsert(enrollmentPayload, { onConflict: "student_id,course_id" });
    if (enrollmentError) throw enrollmentError;

    await admin.from("student_activity_logs").insert({
      user_id: auth.user.id,
      activity_type: "course_registered",
      title: "Course enrollment completed",
      description: `You enrolled in ${String(course.title).slice(0, 160)}.`,
      metadata: { course_id: course.id },
    });

    return NextResponse.json({ success: true, message: "Free enrollment completed. Open My Courses to start learning." }, { status: 201, headers });
  } catch (error) {
    console.error("Free course enrollment failed:", error);
    return fail("We could not complete your enrollment right now. Please try again.", 500);
  }
}
