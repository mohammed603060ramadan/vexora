import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type UserRole = "Admin" | "Manager" | "Employee" | "Client" | "Student";
type UserStatus = "Active" | "Pending" | "Suspended";

const headers = { "Cache-Control": "private, no-store" };

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers });
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

async function authorizeAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { user: null, response: json({ error: "Authentication required." }, 401) };
  }
  if (data.user.app_metadata?.role !== "admin") {
    return { user: null, response: json({ error: "Administrator access required." }, 403) };
  }
  return { user: data.user, response: null };
}

function normalizeRole(value: unknown): UserRole {
  const role = typeof value === "string" ? value.toLowerCase() : "";
  if (role === "admin") return "Admin";
  if (role === "manager") return "Manager";
  if (role === "employee") return "Employee";
  if (role === "student") return "Student";
  return "Client";
}

function normalizeStatus(user: {
  email_confirmed_at?: string | null;
  banned_until?: string | null;
}): UserStatus {
  if (user.banned_until && Date.parse(user.banned_until) > Date.now()) {
    return "Suspended";
  }
  return user.email_confirmed_at ? "Active" : "Pending";
}

export async function GET(request: Request) {
  if (!validOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  const { response } = await authorizeAdmin();
  if (response) return response;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) throw error;

    const authUsers = data.users;
    const ids = authUsers.map((user) => user.id);
    const emails = authUsers.map((user) => user.email).filter((email): email is string => Boolean(email));

    const [profilesResult, clientsResult, teamResult] = await Promise.all([
      ids.length ? admin.from("profiles").select("id,full_name,account_type").in("id", ids) : Promise.resolve({ data: [], error: null }),
      ids.length ? admin.from("clients").select("auth_user_id,name,company").in("auth_user_id", ids) : Promise.resolve({ data: [], error: null }),
      emails.length ? admin.from("team_members").select("email,job_title,department").in("email", emails) : Promise.resolve({ data: [], error: null }),
    ]);

    if (profilesResult.error) throw profilesResult.error;
    if (clientsResult.error) throw clientsResult.error;
    if (teamResult.error) throw teamResult.error;

    const profiles = new Map((profilesResult.data ?? []).map((item) => [item.id, item]));
    const clients = new Map((clientsResult.data ?? []).map((item) => [item.auth_user_id, item]));
    const team = new Map((teamResult.data ?? []).map((item) => [item.email?.toLowerCase(), item]));

    const users = authUsers.map((user) => {
      const profile = profiles.get(user.id);
      const client = clients.get(user.id);
      const member = user.email ? team.get(user.email.toLowerCase()) : undefined;
      const metadataRole = user.app_metadata?.role;
      const role = metadataRole
        ? normalizeRole(metadataRole)
        : member
          ? /manager/i.test(member.job_title ?? "") ? "Manager" : "Employee"
          : normalizeRole(profile?.account_type ?? "client");

      return {
        id: user.id,
        name: profile?.full_name || user.user_metadata?.full_name || user.email || "Unnamed user",
        email: user.email ?? "",
        company: client?.company || member?.department || user.user_metadata?.company || "Not provided",
        role,
        status: normalizeStatus(user),
        joined: user.created_at,
        lastActive: user.last_sign_in_at ?? "",
      };
    });

    users.sort((a, b) => Date.parse(b.joined) - Date.parse(a.joined));
    return json({ users });
  } catch (error) {
    console.error("[Admin Users API] List failed:", error);
    return json({ error: "Could not load real user accounts from Supabase Auth." }, 500);
  }
}

export async function POST(request: Request) {
  if (!validOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  const { response } = await authorizeAdmin();
  if (response) return response;

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ error: "A valid user invitation is required." }, 400);
  }

  const value = body as Record<string, unknown>;
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const email = typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  const company = typeof value.company === "string" ? value.company.trim() : "";
  const role = value.role;

  if (name.length < 2 || name.length > 120) return json({ error: "Enter a name between 2 and 120 characters." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return json({ error: "Enter a valid email address." }, 400);
  if (company.length > 160) return json({ error: "Company must be 160 characters or fewer." }, 400);
  if (!["Admin", "Manager", "Employee", "Client", "Student"].includes(String(role))) return json({ error: "Select a valid user role." }, 400);

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: name,
        company,
        account_type: role === "Client" ? "client" : role === "Student" ? "student" : String(role).toLowerCase(),
      },
      redirectTo: new URL("/login", request.url).toString(),
    });
    if (error || !data.user) throw error ?? new Error("Supabase did not return the invited user.");

    const invitedUser = data.user;
    const { error: roleError } = await admin.auth.admin.updateUserById(invitedUser.id, {
      app_metadata: { ...(invitedUser.app_metadata ?? {}), role: String(role).toLowerCase() },
    });
    if (roleError) {
      console.error("[Admin Users API] Invite role assignment failed:", roleError);
      return json({ error: "The invitation was sent, but the role could not be assigned. Review this account before inviting again.", userId: invitedUser.id }, 500);
    }

    if (role === "Client") {
      const { error: clientError } = await admin.from("clients")
        .update({ company: company || null })
        .eq("auth_user_id", invitedUser.id);
      if (clientError) {
        console.error("[Admin Users API] Client profile update failed:", clientError);
        return json({ error: "The invitation was sent, but the client profile could not be updated. Review this account before retrying.", userId: invitedUser.id }, 500);
      }
    } else if (role === "Admin") {
      const { error: registryError } = await admin.from("vexora_admins").upsert({ user_id: invitedUser.id }, { onConflict: "user_id" });
      if (registryError) {
        console.error("[Admin Users API] Admin registry creation failed:", registryError);
        return json({ error: "The invitation was sent, but the administrator registry could not be updated. Review this account before retrying.", userId: invitedUser.id }, 500);
      }
    } else if (role === "Manager" || role === "Employee") {
      const { error: teamError } = await admin.from("team_members").insert({
        full_name: name,
        email,
        job_title: role,
        department: company || null,
        status: "active",
      });
      if (teamError) {
        console.error("[Admin Users API] Team record creation failed:", teamError);
        return json({ error: "The invitation was sent, but the team record could not be created. Review this account before retrying.", userId: invitedUser.id }, 500);
      }
    }

    return json({ success: true, message: "Invitation sent successfully.", userId: invitedUser.id }, 201);
  } catch (error) {
    console.error("[Admin Users API] Invitation failed:", error);
    return json({ error: error instanceof Error ? error.message : "Could not invite this user." }, 400);
  }
}

export async function PATCH(request: Request) {
  if (!validOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  const { user: currentUser, response } = await authorizeAdmin();
  if (response) return response;

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "A valid user update is required." }, 400);
  const value = body as Record<string, unknown>;
  const id = typeof value.id === "string" ? value.id : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return json({ error: "A valid user ID is required." }, 400);
  }
  if (id === currentUser?.id && value.status === "Suspended") {
    return json({ error: "You cannot suspend your own administrator account." }, 400);
  }

  const admin = createAdminClient();
  const { data, error: lookupError } = await admin.auth.admin.getUserById(id);
  if (lookupError || !data.user) return json({ error: "User account not found." }, 404);

  const updates: { app_metadata?: Record<string, unknown>; ban_duration?: string } = {};
  if (value.role !== undefined) {
    if (!["Admin", "Manager", "Employee", "Client", "Student"].includes(String(value.role))) return json({ error: "Select a valid user role." }, 400);
    updates.app_metadata = { ...(data.user.app_metadata ?? {}), role: String(value.role).toLowerCase() };
  }
  if (value.status !== undefined) {
    if (value.status === "Suspended") updates.ban_duration = "876000h";
    else if (value.status === "Active") updates.ban_duration = "none";
    else return json({ error: "Pending status is controlled by email confirmation and cannot be set manually." }, 400);
  }
  if (!updates.app_metadata && !updates.ban_duration) return json({ error: "No supported account changes were provided." }, 400);

  const { data: updated, error } = await admin.auth.admin.updateUserById(id, updates);
  if (error || !updated.user) return json({ error: error?.message || "Could not update the user account." }, 400);

  if (value.role !== undefined) {
    const accountType = value.role === "Student"
      ? "student"
      : value.role === "Client"
        ? "client"
        : String(value.role).toLowerCase();
    const { error: profileError } = await admin.from("profiles")
      .upsert({ id, account_type: accountType }, { onConflict: "id" });
    if (profileError) return json({ error: "The Auth role was updated, but the profile type could not be synchronized." }, 500);

    if (value.role === "Admin") {
      const { error: registryError } = await admin.from("vexora_admins").upsert({ user_id: id }, { onConflict: "user_id" });
      if (registryError) return json({ error: "The Auth role was updated, but the administrator registry could not be synchronized." }, 500);
    } else {
      const { error: registryError } = await admin.from("vexora_admins").delete().eq("user_id", id);
      if (registryError) return json({ error: "The Auth role was updated, but the administrator registry could not be synchronized." }, 500);
    }

    if (value.role === "Client" && data.user.email) {
      const { data: clientLink, error: clientLookupError } = await admin.from("clients")
        .select("id").eq("auth_user_id", id).maybeSingle();
      if (clientLookupError) return json({ error: "The profile role changed, but the client workspace could not be checked." }, 500);
      if (!clientLink) {
        const { error: clientInsertError } = await admin.from("clients").insert({
          name: data.user.user_metadata?.full_name || data.user.email,
          email: data.user.email,
          company: data.user.user_metadata?.company || null,
          auth_user_id: id,
        });
        if (clientInsertError) return json({ error: "The profile role changed, but the client workspace could not be created." }, 500);
      }
    }

    if (value.role === "Manager" || value.role === "Employee") {
      const { data: teamRecords, error: teamLookupError } = await admin.from("team_members")
        .select("id").eq("email", data.user.email ?? "").limit(1);
      if (teamLookupError) return json({ error: "The profile role changed, but the team record could not be checked." }, 500);
      if (teamRecords?.[0]) {
        const { error: teamUpdateError } = await admin.from("team_members")
          .update({ job_title: String(value.role) }).eq("id", teamRecords[0].id);
        if (teamUpdateError) return json({ error: "The profile role changed, but the team record could not be synchronized." }, 500);
      } else {
        const { error: teamInsertError } = await admin.from("team_members").insert({
          full_name: data.user.user_metadata?.full_name || data.user.email || "Team member",
          email: data.user.email,
          job_title: String(value.role),
          department: data.user.user_metadata?.company || null,
          status: "active",
        });
        if (teamInsertError) return json({ error: "The profile role changed, but the team record could not be created." }, 500);
      }
    }
  }

  return json({
    success: true,
    user: {
      id: updated.user.id,
      role: normalizeRole(updated.user.app_metadata?.role),
      status: normalizeStatus(updated.user),
    },
  });
}
