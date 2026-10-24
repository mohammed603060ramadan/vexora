
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function authorizeAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      ),
    };
  }

  if (data.user.app_metadata?.role !== "admin") {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 }
      ),
    };
  }

  return { user: data.user, response: null };
}

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
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 }
    );
  }

  const { response } = await authorizeAdmin();
  if (response) return response;

  const admin = createAdminClient();

  const { data: recordsRaw, error: recordsError } = await admin
    .from("vexora_admins")
    .select("user_id, created_at")
    .order("created_at", { ascending: true });

  if (recordsError) {
    console.error("Admin registry read failed:", recordsError.message);
    return NextResponse.json(
      { error: "Could not load administrator accounts." },
      { status: 500 }
    );
  }

  const records = (recordsRaw ?? []) as unknown as {
    user_id: string;
    created_at: string;
  }[];

  const { data: usersData, error: usersError } =
    await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (usersError) {
    console.error("Admin user listing failed:", usersError.message);
    return NextResponse.json(
      { error: "Could not load administrator account details." },
      { status: 500 }
    );
  }

  const usersById = new Map(
    usersData.users.map((user) => [user.id, user])
  );

  const managers = records.map((record) => {
    const user = usersById.get(record.user_id);

    return {
      // Keep both names for compatibility with existing consumers.
      id: record.user_id,
      user_id: record.user_id,
      email: user?.email ?? null,
      created_at: record.created_at,
      email_confirmed: Boolean(user?.email_confirmed_at),
    };
  });

  return NextResponse.json({ managers });
}

export async function POST(request: Request) {
  if (!validOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 }
    );
  }

  const { response } = await authorizeAdmin();
  if (response) return response;

  const contentLength = Number(
    request.headers.get("content-length") ?? 0
  );

  if (contentLength > 10_000) {
    return NextResponse.json(
      { error: "Request body is too large." },
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
    !("email" in body) ||
    typeof body.email !== "string" ||
    !("password" in body) ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json(
      { error: "A valid email address and initial password are required." },
      { status: 400 }
    );
  }

  const email = body.email.trim().toLowerCase();
  const password = body.password;

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  if (password.length < 12 || password.length > 128 || password.trim() !== password) {
    return NextResponse.json(
      { error: "The initial password must be 12–128 characters and cannot start or end with spaces." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data: existingUsers, error: lookupError } =
    await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (lookupError) {
    console.error("User lookup failed:", lookupError.message);
    return NextResponse.json(
      {
        error:
          "Could not verify whether this email already has an account.",
      },
      { status: 500 }
    );
  }

  const existingUser = existingUsers.users.find(
    (user) => user.email?.toLowerCase() === email
  );

  if (existingUser) {
    const { data: registryEntry, error: registryLookupError } =
      await admin
        .from("vexora_admins")
        .select("user_id")
        .eq("user_id", existingUser.id)
        .maybeSingle();

    if (registryLookupError) {
      console.error("Admin lookup failed:", registryLookupError.message);
      return NextResponse.json(
        { error: "Could not verify administrator status." },
        { status: 500 }
      );
    }

    if (registryEntry) {
      return NextResponse.json(
        {
          error:
            "This account is already registered as an administrator.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error:
          "This email already has an account. To promote an existing user, use a separate verified promotion flow. No changes were made.",
      },
      { status: 409 }
    );
  }

  const { data: createdData, error: createError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: "admin" },
    });

  if (createError || !createdData.user) {
    console.error("Manager account creation failed:", createError?.message ?? "No user returned.");
    return NextResponse.json(
      { error: "Could not create the administrator account. Check Supabase Auth settings and try again." },
      { status: 400 }
    );
  }

  const createdUser = createdData.user;
  const { error: registryError } = await admin
    .from("vexora_admins")
    .insert({ user_id: createdUser.id } as never);

  if (registryError) {
    const { error: rollbackError } = await admin.auth.admin.deleteUser(createdUser.id);
    console.error("Admin registry insert failed:", registryError.message);
    if (rollbackError) console.error("Admin account rollback failed:", rollbackError.message);
    return NextResponse.json(
      { error: "The account was created but administrator registration failed. The system attempted to remove the new account; verify the administrator list before retrying." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Administrator account created successfully." },
    { status: 201 }
  );
}

export async function DELETE(request: Request) {
  if (!validOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 }
    );
  }

  const { user: currentUser, response } = await authorizeAdmin();
  if (response) return response;

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
    !("id" in body) ||
    typeof body.id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      body.id
    )
  ) {
    return NextResponse.json(
      { error: "A valid administrator ID is required." },
      { status: 400 }
    );
  }

  const targetId = body.id;

  if (targetId === currentUser!.id) {
    return NextResponse.json(
      {
        error:
          "You cannot remove your own administrator access here.",
      },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data: registry, error: registryError } = await admin
    .from("vexora_admins")
    .select("user_id")
    .order("created_at", { ascending: true });

  if (registryError) {
    console.error("Admin registry check failed:", registryError.message);
    return NextResponse.json(
      { error: "Could not verify administrator accounts." },
      { status: 500 }
    );
  }

  const managers = (registry ?? []) as unknown as {
    user_id: string;
  }[];

  if (!managers.some((manager) => manager.user_id === targetId)) {
    return NextResponse.json(
      { error: "Administrator account not found." },
      { status: 404 }
    );
  }

  if (managers.length <= 1) {
    return NextResponse.json(
      { error: "The last administrator cannot be removed." },
      { status: 409 }
    );
  }

  const { data: targetData, error: targetError } =
    await admin.auth.admin.getUserById(targetId);

  if (targetError || !targetData.user) {
    return NextResponse.json(
      { error: "Could not find the associated user account." },
      { status: 404 }
    );
  }

  const targetUser = targetData.user;
  const remainingMetadata = { ...(targetUser.app_metadata ?? {}) };
  delete remainingMetadata.role;

  const { error: roleError } =
    await admin.auth.admin.updateUserById(targetId, {
      app_metadata: remainingMetadata,
    });

  if (roleError) {
    console.error("Admin role removal failed:", roleError.message);
    return NextResponse.json(
      { error: "Could not remove administrator access." },
      { status: 500 }
    );
  }

  const { error: deleteError } = await admin
    .from("vexora_admins")
    .delete()
    .eq("user_id", targetId as never);

  if (deleteError) {
    console.error("Admin registry removal failed:", deleteError.message);

    // Restore admin role if registry cleanup failed.
    const { error: restoreError } =
      await admin.auth.admin.updateUserById(targetId, {
        app_metadata: targetUser.app_metadata ?? {},
      });

    if (restoreError) {
      console.error(
        "Admin role restoration failed:",
        restoreError.message
      );
    }

    return NextResponse.json(
      {
        error:
          "Administrator registry cleanup failed. The account was preserved; refresh and verify administrator access.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message:
      "Administrator access removed. The user account was preserved.",
  });
}
