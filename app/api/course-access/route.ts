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
  const admin: any = createAdminClient();
    const { data: course, error: courseError } = await admin
      .from("courses")
      .select("id,title,status,price")
      .eq("id", courseId)
      .eq("status", "published")
      .maybeSingle();
    if (courseError) throw courseError;
    if (!course) return fail("This course is not available for access requests.", 404);

    // Free courses are enrolled directly; they must never create a purchase
    // request or enter a payment workflow. Price must be explicitly zero.
    if (course.price != null && Number(course.price) === 0) {
      const { data: existingEnrollment, error: existingEnrollmentError } = await admin
        .from("enrollments")
        .select("id,status")
        .eq("course_id", courseId)
        .eq("student_id", user.id)
        .limit(1)
        .maybeSingle();

      if (existingEnrollmentError) throw existingEnrollmentError;

      if (!existingEnrollment || !["active", "completed"].includes(existingEnrollment.status)) {
        const enrollmentPayload = {
          course_id: courseId,
          student_id: user.id,
          status: "active",
          progress_percent: 0,
        };
        let enrollmentInsert = await admin
          .from("enrollments")
          .insert({ ...enrollmentPayload, enrolled_by: user.id });

        if (enrollmentInsert.error && /enrolled_by|column .* does not exist|schema cache/i.test(enrollmentInsert.error.message)) {
          enrollmentInsert = await admin
            .from("enrollments")
            .insert({ ...enrollmentPayload, enrollment_source: "self" });
        }

        if (enrollmentInsert.error && enrollmentInsert.error.code === "23505") {
          // A concurrent request may have created the enrollment; verify it.
          const { data: racedEnrollment, error: racedError } = await admin
            .from("enrollments")
            .select("id,status")
            .eq("course_id", courseId)
            .eq("student_id", user.id)
            .limit(1)
            .maybeSingle();
          if (racedError || !racedEnrollment || !["active", "completed"].includes(racedEnrollment.status)) {
            throw enrollmentInsert.error;
          }
        } else if (enrollmentInsert.error) {
          throw enrollmentInsert.error;
        }
      }

      return NextResponse.json({
        free: true,
        enrolled: true,
        request: { id: null, course_id: courseId, status: "approved", purchase_code: null },
        message: "This course is free. You are enrolled—no payment or purchase request is needed.",
      }, { status: 200, headers });
    }

    // Return an existing pending/approved request first. There may be multiple
    // historical rejected/cancelled rows, so never use maybeSingle() across all
    // statuses after enabling resubmission in the database.
    const { data: openRequest, error: openRequestError } = await admin
      .from("course_access_requests")
      .select("id,purchase_code,status,course_id,created_at")
      .eq("course_id", courseId)
      .eq("student_id", user.id)
      .in("status", ["pending", "approved"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (openRequestError) throw openRequestError;
    if (openRequest) {
      return NextResponse.json({ request: openRequest, message: "You already have an access request for this course." }, { status: 200, headers });
    }

    // A student who already has an active/completed enrollment should not
    // create a fresh purchase/access request for the same course. Older
    // deployments may not have an enrollments table or may use other statuses;
    // only treat a confirmed enrollment as a reason to stop the request.
    const { data: enrollment, error: enrollmentError } = await admin
      .from("enrollments")
      .select("id,status")
      .eq("course_id", courseId)
      .eq("student_id", user.id)
      .in("status", ["active", "completed"])
      .limit(1)
      .maybeSingle();

    if (
      enrollmentError &&
      /relation .*enrollments.* does not exist|could not find the table .*enrollments.*schema cache/i.test(
        enrollmentError.message,
      )
    ) {
      return fail(
        "Course enrollment is not configured in the database yet. Apply and verify the Academy access migration before accepting requests.",
        503,
      );
    }

    if (enrollmentError) throw enrollmentError;

    if (enrollment) {
      return NextResponse.json(
        {
          request: {
            id: null,
            course_id: courseId,
            status: "approved",
            purchase_code: null,
          },
          message: "You already have access to this course.",
        },
        { status: 200, headers },
      );
    }

    // Reopen the most recent closed request if one exists; otherwise create one.
    const { data: closedRequest, error: closedRequestError } = await admin
      .from("course_access_requests")
      .select("id,purchase_code,status,course_id,created_at")
      .eq("course_id", courseId)
      .eq("student_id", user.id)
      .in("status", ["rejected", "cancelled"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (closedRequestError) throw closedRequestError;
    if (closedRequest) {
      const { data: reopened, error: reopenError } = await admin
        .from("course_access_requests")
        .update({ status: "pending", student_message: studentMessage, admin_note: null, reviewed_by: null, reviewed_at: null, updated_at: new Date().toISOString() })
        .eq("id", closedRequest.id)
        .select("id,purchase_code,status,course_id,created_at")
        .single();
      if (reopenError) throw reopenError;
      return NextResponse.json({ request: reopened, message: "Your access request has been resubmitted." }, { status: 200, headers });
    }

    const { data: created, error: insertError } = await admin
      .from("course_access_requests")
      .insert({ course_id: courseId, student_id: user.id, email, student_message: studentMessage })
      .select("id,purchase_code,status,course_id,created_at")
      .single();
    if (insertError) throw insertError;
    return NextResponse.json({ request: created, message: "Request created. Keep your reference code; access is enabled after administrator approval." }, { status: 201, headers });
  } catch (error) {
    // Concurrent submissions can race after the duplicate check. The partial
    // unique index is the final guard; return the winning request instead of
    // surfacing a misleading server error to the student.
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase generated types do not include course_access_requests yet.
        const admin: any = createAdminClient();
        const { data: existing, error: lookupError } = await admin
          .from("course_access_requests")
          .select("id,purchase_code,status,course_id,created_at")
          .eq("course_id", courseId)
          .eq("student_id", user.id)
          .in("status", ["pending", "approved"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!lookupError && existing) {
          return NextResponse.json(
            {
              request: existing,
              message: "You already have an access request for this course.",
            },
            { status: 200, headers },
          );
        }
      } catch (lookupError) {
        console.error("Duplicate course access request lookup failed:", lookupError);
      }
    }

    console.error("Course access request creation failed:", error);
    return fail("Could not create the access request. Check that the course access migration is applied.", 500);
  }
}
