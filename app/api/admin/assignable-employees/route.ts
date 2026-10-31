import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type EmployeeRow = {
  user_id: string;
  department_id: string | null;
  job_title: string | null;
  employee_code: string | null;
  employment_status: string;
};

type DepartmentRow = {
  id: string;
  name: string;
};

type EmployeeQuery = {
  select: (columns: string) => EmployeeQuery;
  eq: (column: string, value: string) => EmployeeQuery;
  order: (column: string, options?: { ascending?: boolean }) => EmployeeQuery;
  then: PromiseLike<{ data: unknown; error: { message: string } | null }>["then"];
};

type AdminDatabase = {
  from: (table: string) => EmployeeQuery;
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

export async function GET(request: Request) {
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

  const admin = createAdminClient() as unknown as AdminDatabase;
  const [employeeResult, departmentResult] = await Promise.all([
    admin.from("employees").select("user_id, department_id, job_title, employee_code, employment_status"),
    admin.from("departments").select("id, name"),
  ]);

  const employeeData = employeeResult as unknown as {
    data: EmployeeRow[] | null;
    error: { message: string } | null;
  };
  const departmentData = departmentResult as unknown as {
    data: DepartmentRow[] | null;
    error: { message: string } | null;
  };

  if (employeeData.error || departmentData.error) {
    console.error("Assignable employee lookup failed:", employeeData.error?.message ?? departmentData.error?.message);
    return NextResponse.json({ error: "Could not load assignable employees." }, { status: 500 });
  }

  const { data: usersData, error: usersError } = await createAdminClient().auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (usersError) {
    console.error("Assignable employee account lookup failed:", usersError.message);
    return NextResponse.json({ error: "Could not load employee account details." }, { status: 500 });
  }

  const usersById = new Map(usersData.users.map((user) => [user.id, user]));
  const departmentsById = new Map((departmentData.data ?? []).map((department) => [department.id, department.name]));

  const employees = (employeeData.data ?? [])
    .filter((employee) => employee.employment_status === "active" && usersById.has(employee.user_id))
    .map((employee) => {
      const user = usersById.get(employee.user_id)!;
      return {
        user_id: employee.user_id,
        name: typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : user.email ?? employee.user_id,
        email: user.email ?? null,
        job_title: employee.job_title,
        employee_code: employee.employee_code,
        department: employee.department_id
          ? departmentsById.get(employee.department_id) ?? null
          : null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(
    { employees },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
