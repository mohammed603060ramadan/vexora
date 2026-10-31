import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Department = { id: string; name: string };

type AdminQuery = {
  select: (columns: string) => AdminQuery;
  upsert: (values: Record<string, unknown>, options: { onConflict: string }) => PromiseLike<{
    error: { message: string } | null;
  }>;
};

type AdminDatabase = {
  from: (table: string) => AdminQuery;
};

function validOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!validOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (authData.user.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    !("email" in body) ||
    typeof body.email !== "string" ||
    !("full_name" in body) ||
    typeof body.full_name !== "string" ||
    !("status" in body) ||
    typeof body.status !== "string" ||
    !("department" in body) ||
    (body.department !== null && typeof body.department !== "string") ||
    !("job_title" in body) ||
    (body.job_title !== null && typeof body.job_title !== "string")
  ) {
    return NextResponse.json({ error: "Invalid team member details." }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required to link a login account." }, { status: 400 });
  }

  if (!["active", "on_leave", "inactive"].includes(body.status)) {
    return NextResponse.json({ error: "Invalid team member status." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (usersError) {
    console.error("Team member account lookup failed:", usersError.message);
    return NextResponse.json({ error: "Could not verify the team member login account." }, { status: 500 });
  }

  const user = usersData.users.find((item) => item.email?.toLowerCase() === email);
  if (!user) {
    return NextResponse.json({
      linked: false,
      message: "Team member saved, but no existing login account uses this email. Create or invite the account first, then save the team member again.",
    });
  }

  const { data: departmentsRaw, error: departmentsError } = await admin
    .from("departments")
    .select("id, name");

  if (departmentsError) {
    console.error("Department lookup failed:", departmentsError.message);
    return NextResponse.json({ error: "Could not match the employee department." }, { status: 500 });
  }

  const departments = (departmentsRaw ?? []) as unknown as Department[];
  const departmentName = typeof body.department === "string" ? body.department.trim() : "";
  const department = departments.find((item) => item.name.toLowerCase() === departmentName.toLowerCase());

  const employeeStatus = body.status === "active" ? "active" : "inactive";
  const database = admin as unknown as AdminDatabase;
  const { error: upsertError } = await database.from("employees").upsert({
    user_id: user.id,
    department_id: department?.id ?? null,
    job_title: typeof body.job_title === "string" ? body.job_title.trim() || null : null,
    employment_status: employeeStatus,
  }, { onConflict: "user_id" });

  if (upsertError) {
    console.error("Employee account link failed:", upsertError.message);
    return NextResponse.json({ error: "The team member was saved, but the login account could not be linked to the employee directory." }, { status: 500 });
  }

  return NextResponse.json({
    linked: true,
    user_id: user.id,
    message: "Team member is linked to the existing login account and can now receive assigned tasks.",
  });
}
