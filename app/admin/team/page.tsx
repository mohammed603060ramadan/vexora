
"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/supabase/browser";

type TeamStatus = "active" | "on_leave" | "inactive";

type TeamMember = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  department: string | null;
  status: TeamStatus;
  notes: string | null;
  created_at: string;
};

type MemberForm = {
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  department: string;
  status: TeamStatus;
  notes: string;
};

type AdminManager = {
  id: string;
  user_id: string;
  email: string | null;
  created_at: string | null;
  email_confirmed?: boolean;
};

type AdminManagerResponse = {
  id?: unknown;
  user_id?: unknown;
  email?: unknown;
  created_at?: unknown;
  email_confirmed?: unknown;
};

const emptyForm: MemberForm = {
  full_name: "",
  email: "",
  phone: "",
  job_title: "",
  department: "",
  status: "active",
  notes: "",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  background: "#0b1220",
  border: "1px solid #273449",
  borderRadius: "9px",
  color: "#f1f5f9",
  boxSizing: "border-box" as const,
};

const buttonStyle = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#111c2e",
  color: "#e2e8f0",
  cursor: "pointer",
};

const statusLabels: Record<TeamStatus, string> = {
  active: "Active",
  on_leave: "On Leave",
  inactive: "Inactive",
};

const departments = [
  "Management",
  "Software Development",
  "Cybersecurity",
  "Networks & Infrastructure",
  "Data Analytics",
  "Digital Marketing",
  "Human Resources",
  "Other",
];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred. Please try again.";
}

function normalizeAdminManagers(value: unknown): AdminManager[] {
  if (!Array.isArray(value)) {
    throw new Error("Unexpected administrator list response.");
  }

  return value.map((item: AdminManagerResponse) => {
    const id =
      typeof item.id === "string" ? item.id : "";
    const userId =
      typeof item.user_id === "string" ? item.user_id : "";
    const resolvedId = userId || id;

    if (!UUID_PATTERN.test(resolvedId)) {
      throw new Error(
        "An administrator record has an invalid user ID. Refresh the list and try again."
      );
    }

    return {
      id: id || resolvedId,
      user_id: resolvedId,
      email: typeof item.email === "string" ? item.email : null,
      created_at:
        typeof item.created_at === "string"
          ? item.created_at
          : null,
      email_confirmed:
        typeof item.email_confirmed === "boolean"
          ? item.email_confirmed
          : undefined,
    };
  });
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [managers, setManagers] = useState<AdminManager[]>([]);
  const [managerEmail, setManagerEmail] = useState("");
  const [managersLoading, setManagersLoading] = useState(true);
  const [managerSaving, setManagerSaving] = useState(false);
  const [removingManagerId, setRemovingManagerId] = useState<string | null>(
    null
  );
  const [managerError, setManagerError] = useState("");
  const [managerMessage, setManagerMessage] = useState("");

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setMembers((data ?? []) as TeamMember[]);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchMembers() {
      try {
        const { data, error: fetchError } = await supabase
          .from("team_members")
          .select("*")
          .order("created_at", { ascending: false });

        if (cancelled) return;

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setMembers((data ?? []) as TeamMember[]);
      } catch (loadError) {
        if (!cancelled) {
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchMembers();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField<K extends keyof MemberForm>(
    field: K,
    value: MemberForm[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openNewForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(member: TeamMember) {
    setForm({
      full_name: member.full_name,
      email: member.email ?? "",
      phone: member.phone ?? "",
      job_title: member.job_title ?? "",
      department: member.department ?? "",
      status: member.status,
      notes: member.notes ?? "",
    });

    setEditingId(member.id);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const fullName = form.full_name.trim();

    if (!fullName) {
      setError("Full name is required.");
      return;
    }

    if (form.email.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(form.email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    if (!Object.hasOwn(statusLabels, form.status)) {
      setError("Please select a valid member status.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      full_name: fullName,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      job_title: form.job_title.trim() || null,
      department: form.department || null,
      status: form.status,
      notes: form.notes.trim() || null,
      updated_at: new Date().toISOString(),
    };

    try {
      const result = editingId
        ? await supabase
            .from("team_members")
            .update(payload)
            .eq("id", editingId)
        : await supabase.from("team_members").insert(payload);

      if (result.error) {
        throw new Error(result.error.message);
      }

      let accountLinkNotice = "";

      if (payload.email) {
        try {
          const linkResponse = await fetch("/api/admin/team-members/link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: payload.email,
              full_name: payload.full_name,
              status: payload.status,
              department: payload.department,
              job_title: payload.job_title,
            }),
          });
          const linkPayload = await linkResponse.json() as {
            linked?: boolean;
            message?: string;
            error?: string;
          };

          if (!linkResponse.ok) {
            accountLinkNotice = linkPayload.error || "The login account could not be linked.";
          } else if (linkPayload.linked) {
            accountLinkNotice = linkPayload.message || "Login account linked.";
          } else {
            accountLinkNotice = linkPayload.message || "No existing login account was found for this email.";
          }
        } catch {
          accountLinkNotice = "Team member saved, but login account linking could not be completed. Retry by saving the member again.";
        }
      }

      setMessage(
        (editingId
          ? "Team member updated successfully."
          : "Team member added successfully.") +
        (accountLinkNotice ? ` ${accountLinkNotice}` : "")
      );

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadMembers();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function deleteMember(member: TeamMember) {
    if (deletingId || saving) return;

    const confirmed = window.confirm(
      `Delete ${member.full_name} from the team?`
    );

    if (!confirmed) return;

    setDeletingId(member.id);
    setError("");
    setMessage("");

    try {
      const { error: deleteError } = await supabase
        .from("team_members")
        .delete()
        .eq("id", member.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setMembers((current) =>
        current.filter((item) => item.id !== member.id)
      );

      setMessage("Team member deleted successfully.");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setDeletingId(null);
    }
  }

  const loadManagers = useCallback(async () => {
    setManagersLoading(true);
    setManagerError("");

    try {
      const response = await fetch("/api/admin/managers", {
        method: "GET",
        cache: "no-store",
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error || "Could not load administrator accounts."
        );
      }

      const rows =
        payload.managers ?? payload.data ?? payload.records ?? [];

      setManagers(normalizeAdminManagers(rows));
    } catch (loadError) {
      setManagerError(getErrorMessage(loadError));
    } finally {
      setManagersLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchManagers() {
      try {
        const response = await fetch("/api/admin/managers", {
          method: "GET",
          cache: "no-store",
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(
            payload.error || "Could not load administrator accounts."
          );
        }

        const rows =
          payload.managers ?? payload.data ?? payload.records ?? [];
        const normalized = normalizeAdminManagers(rows);

        if (!cancelled) {
          setManagers(normalized);
          setManagerError("");
        }
      } catch (loadError) {
        if (!cancelled) {
          setManagerError(getErrorMessage(loadError));
        }
      } finally {
        if (!cancelled) {
          setManagersLoading(false);
        }
      }
    }

    void fetchManagers();

    return () => {
      cancelled = true;
    };
  }, []);

  async function inviteManager(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (managerSaving || removingManagerId) return;

    const email = managerEmail.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setManagerError("Please enter a valid email address.");
      return;
    }

    setManagerSaving(true);
    setManagerError("");
    setManagerMessage("");

    try {
      const response = await fetch("/api/admin/managers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error || "Could not invite this administrator."
        );
      }

      setManagerMessage(
        payload.message || `Invitation request processed for ${email}.`
      );
      setManagerEmail("");
      await loadManagers();
    } catch (inviteError) {
      setManagerError(getErrorMessage(inviteError));
    } finally {
      setManagerSaving(false);
    }
  }

  async function removeManager(manager: AdminManager) {
    if (removingManagerId || managerSaving) return;

    // Resolve the canonical Auth user ID before making a request.
    const targetId = manager.user_id || manager.id;

    if (!targetId || !UUID_PATTERN.test(targetId)) {
      setManagerError(
        "A valid administrator ID is required. Refresh the administrator list and try again."
      );
      return;
    }

    const confirmed = window.confirm(
      `Remove administrator privileges from ${manager.email || targetId}? The user account will not be deleted.`
    );

    if (!confirmed) return;

    setRemovingManagerId(targetId);
    setManagerError("");
    setManagerMessage("");

    try {
      const response = await fetch("/api/admin/managers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: targetId }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error || "Could not remove administrator privileges."
        );
      }

      setManagerMessage(
        payload.message ||
          "Administrator privileges were removed. The account was not deleted."
      );

      await loadManagers();
    } catch (removeError) {
      setManagerError(getErrorMessage(removeError));
    } finally {
      setRemovingManagerId(null);
    }
  }

  const query = search.trim().toLowerCase();

  const filteredMembers = members.filter((member) => {
    const matchesSearch = [
      member.full_name,
      member.email,
      member.phone,
      member.job_title,
      member.department,
    ].some((value) => value?.toLowerCase().includes(query));

    return (
      matchesSearch &&
      (statusFilter === "all" || member.status === statusFilter)
    );
  });

  const cardStyle = {
    background: "#111827",
    border: "1px solid #263449",
    borderRadius: "14px",
    padding: "22px",
  };

  function badgeStyle(status: TeamStatus) {
    const color =
      status === "active"
        ? "#4ade80"
        : status === "on_leave"
          ? "#facc15"
          : "#94a3b8";

    return {
      display: "inline-block",
      padding: "5px 9px",
      borderRadius: "7px",
      background: `${color}20`,
      color,
      fontSize: "12px",
      fontWeight: 650,
      whiteSpace: "nowrap" as const,
    };
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080d16",
        color: "#e5edf8",
        padding: "32px",
      }}
    >
      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "18px",
            marginBottom: "30px",
          }}
        >
          <div>
            <p
              style={{
                color: "#60a5fa",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "3px",
                marginBottom: "10px",
              }}
            >
              VEXORA MANAGEMENT
            </p>

            <h1 style={{ fontSize: "32px", fontWeight: 750, margin: 0 }}>
              Team Management
            </h1>

            <p style={{ color: "#94a3b8", marginTop: "10px" }}>
              Manage team members, departments, and employment status.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewForm}
            disabled={saving || Boolean(deletingId)}
            style={{
              ...buttonStyle,
              background: "#1677ee",
              borderColor: "#1677ee",
              fontWeight: 700,
              padding: "13px 20px",
              opacity: saving || deletingId ? 0.6 : 1,
            }}
          >
            + Add Member
          </button>
        </header>

        <section style={{ ...cardStyle, marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              marginBottom: "18px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "21px", margin: "0 0 8px" }}>
                Admin Accounts
              </h2>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>
                Invite administrators and manage their access separately from
                team members.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadManagers()}
              disabled={
                managersLoading ||
                managerSaving ||
                Boolean(removingManagerId)
              }
              style={buttonStyle}
            >
              {managersLoading ? "Loading..." : "Refresh Admins"}
            </button>
          </div>

          <form
            onSubmit={inviteManager}
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <input
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              aria-label="Email address for new administrator"
              placeholder="manager@example.com"
              value={managerEmail}
              onChange={(event) => setManagerEmail(event.target.value)}
              style={{ ...inputStyle, flex: "1 1 260px" }}
            />

            <button
              type="submit"
              disabled={managerSaving || Boolean(removingManagerId)}
              style={{
                ...buttonStyle,
                background: "#1677ee",
                borderColor: "#1677ee",
                opacity: managerSaving || removingManagerId ? 0.6 : 1,
              }}
            >
              {managerSaving ? "Sending..." : "Invite Administrator"}
            </button>
          </form>

          {managerMessage && (
            <p
              role="status"
              style={{
                padding: "12px 14px",
                borderRadius: "9px",
                background: "#123326",
                color: "#86efac",
                overflowWrap: "anywhere",
              }}
            >
              {managerMessage}
            </p>
          )}

          {managerError && (
            <p
              role="alert"
              style={{
                padding: "12px 14px",
                borderRadius: "9px",
                background: "#3a171b",
                color: "#fca5a5",
                overflowWrap: "anywhere",
              }}
            >
              {managerError}
            </p>
          )}

          {managersLoading ? (
            <p style={{ color: "#94a3b8" }}>
              Loading administrator accounts...
            </p>
          ) : managers.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>
              No administrator records were returned.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  minWidth: "600px",
                }}
              >
                <thead>
                  <tr style={{ color: "#94a3b8", fontSize: "13px" }}>
                    {["Email", "Administrator Since", "Access"].map(
                      (heading) => (
                        <th
                          key={heading}
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #293548",
                          }}
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {managers.map((manager) => (
                    <tr key={manager.user_id}>
                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #202b3b",
                          overflowWrap: "anywhere",
                        }}
                      >
                        <strong>
                          {manager.email || "Email unavailable"}
                        </strong>
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #202b3b",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {manager.created_at
                          ? new Date(
                              manager.created_at
                            ).toLocaleDateString("en-GB")
                          : "—"}
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #202b3b",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <button
                          type="button"
                          disabled={
                            managerSaving ||
                            Boolean(removingManagerId) ||
                            managers.length <= 1
                          }
                          title={
                            managers.length <= 1
                              ? "The last administrator cannot be removed."
                              : "Remove administrator privileges without deleting the account."
                          }
                          onClick={() => void removeManager(manager)}
                          style={{
                            ...buttonStyle,
                            color: "#fca5a5",
                            borderColor: "#71343b",
                            opacity:
                              managerSaving ||
                              removingManagerId ||
                              managers.length <= 1
                                ? 0.5
                                : 1,
                          }}
                        >
                          {removingManagerId === manager.user_id
                            ? "Removing..."
                            : "Remove Admin Access"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: 0 }}>
            Removing access must not delete the user account. Never share the
            service-role key with the browser.
          </p>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {(
            [
              ["Total Members", members.length],
              ["Active", members.filter((m) => m.status === "active").length],
              [
                "On Leave",
                members.filter((m) => m.status === "on_leave").length,
              ],
              [
                "Inactive",
                members.filter((m) => m.status === "inactive").length,
              ],
            ] as [string, number][]
          ).map(([label, value]) => (
            <section key={label} style={cardStyle}>
              <p style={{ color: "#94a3b8", margin: "0 0 12px" }}>
                {label}
              </p>
              <strong style={{ fontSize: "30px" }}>{value}</strong>
            </section>
          ))}
        </div>

        {message && (
          <p
            role="status"
            style={{
              padding: "13px 16px",
              borderRadius: "9px",
              background: "#123326",
              color: "#86efac",
              marginBottom: "18px",
            }}
          >
            {message}
          </p>
        )}

        {error && (
          <p
            role="alert"
            style={{
              padding: "13px 16px",
              borderRadius: "9px",
              background: "#3a171b",
              color: "#fca5a5",
              overflowWrap: "anywhere",
              marginBottom: "18px",
            }}
          >
            {error}
          </p>
        )}

        {showForm && (
          <section style={{ ...cardStyle, marginBottom: "24px" }}>
            <h2
              style={{
                fontSize: "21px",
                marginTop: 0,
                marginBottom: "22px",
              }}
            >
              {editingId ? "Edit Team Member" : "Add Team Member"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "18px",
                }}
              >
                <label style={{ display: "grid", gap: "8px" }}>
                  Full Name *
                  <input
                    required
                    maxLength={150}
                    value={form.full_name}
                    onChange={(event) =>
                      updateField("full_name", event.target.value)
                    }
                    placeholder="Full name"
                    style={inputStyle}
                  />
                </label>

                <label style={{ display: "grid", gap: "8px" }}>
                  Email Address
                  <input
                    type="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="member@example.com"
                    style={inputStyle}
                  />
                </label>

                <label style={{ display: "grid", gap: "8px" }}>
                  Phone Number
                  <input
                    type="tel"
                    maxLength={40}
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="+20..."
                    style={inputStyle}
                  />
                </label>

                <label style={{ display: "grid", gap: "8px" }}>
                  Job Title
                  <input
                    maxLength={150}
                    value={form.job_title}
                    onChange={(event) =>
                      updateField("job_title", event.target.value)
                    }
                    placeholder="e.g. Software Engineer"
                    style={inputStyle}
                  />
                </label>

                <label style={{ display: "grid", gap: "8px" }}>
                  Department
                  <select
                    value={form.department}
                    onChange={(event) =>
                      updateField("department", event.target.value)
                    }
                    style={inputStyle}
                  >
                    <option value="">Select department</option>
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={{ display: "grid", gap: "8px" }}>
                  Status
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.value as TeamStatus
                      )
                    }
                    style={inputStyle}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label
                  style={{
                    display: "grid",
                    gap: "8px",
                    gridColumn: "1 / -1",
                  }}
                >
                  Notes
                  <textarea
                    rows={4}
                    maxLength={5000}
                    value={form.notes}
                    onChange={(event) =>
                      updateField("notes", event.target.value)
                    }
                    placeholder="Additional information..."
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "22px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="submit"
                  disabled={saving || Boolean(deletingId)}
                  style={{
                    ...buttonStyle,
                    background: "#1677ee",
                    borderColor: "#1677ee",
                    opacity: saving || deletingId ? 0.6 : 1,
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Member"}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm(emptyForm);
                    setError("");
                  }}
                  style={{
                    ...buttonStyle,
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontSize: "20px", margin: 0 }}>
              All Team Members
            </h2>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                flex: "1 1 320px",
                justifyContent: "flex-end",
              }}
            >
              <input
                aria-label="Search team members"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search members..."
                style={{ ...inputStyle, maxWidth: "260px" }}
              />

              <select
                aria-label="Filter team members by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                style={{ ...inputStyle, maxWidth: "180px" }}
              >
                <option value="all">All Statuses</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => void loadMembers()}
                disabled={loading || Boolean(deletingId) || saving}
                style={{
                  ...buttonStyle,
                  opacity: loading || deletingId || saving ? 0.6 : 1,
                }}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {loading ? (
            <p style={{ color: "#94a3b8", padding: "25px 0" }}>
              Loading team members...
            </p>
          ) : filteredMembers.length === 0 ? (
            <div style={{ padding: "35px 10px", textAlign: "center" }}>
              <p style={{ fontSize: "18px", fontWeight: 650 }}>
                {query || statusFilter !== "all"
                  ? "No matching team members"
                  : "No team members yet"}
              </p>

              <p style={{ color: "#94a3b8" }}>
                {query || statusFilter !== "all"
                  ? "Try changing your search or status filter."
                  : "Add your first team member to get started."}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  minWidth: "900px",
                }}
              >
                <thead>
                  <tr style={{ color: "#94a3b8", fontSize: "13px" }}>
                    {[
                      "Member",
                      "Contact",
                      "Department",
                      "Status",
                      "Added",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #293548",
                          fontWeight: 600,
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id}>
                      <td
                        style={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #202b3b",
                        }}
                      >
                        <strong>{member.full_name}</strong>
                        <p
                          style={{
                            color: "#94a3b8",
                            fontSize: "12px",
                            margin: "5px 0 0",
                          }}
                        >
                          {member.job_title || "No job title"}
                        </p>
                      </td>

                      <td
                        style={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #202b3b",
                        }}
                      >
                        <div>{member.email || "—"}</div>
                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: "13px",
                            marginTop: "5px",
                          }}
                        >
                          {member.phone || ""}
                        </div>
                      </td>

                      <td
                        style={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #202b3b",
                        }}
                      >
                        {member.department || "—"}
                      </td>

                      <td
                        style={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #202b3b",
                        }}
                      >
                        <span style={badgeStyle(member.status)}>
                          {statusLabels[member.status] ?? "Unknown"}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #202b3b",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {member.created_at
                          ? new Date(
                              member.created_at
                            ).toLocaleDateString("en-GB")
                          : "—"}
                      </td>

                      <td
                        style={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #202b3b",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <button
                          type="button"
                          disabled={Boolean(deletingId) || saving}
                          onClick={() => openEditForm(member)}
                          style={{
                            ...buttonStyle,
                            marginRight: "7px",
                            opacity: deletingId || saving ? 0.6 : 1,
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={Boolean(deletingId) || saving}
                          onClick={() => void deleteMember(member)}
                          style={{
                            ...buttonStyle,
                            color: "#fca5a5",
                            borderColor: "#71343b",
                            opacity: deletingId || saving ? 0.6 : 1,
                          }}
                        >
                          {deletingId === member.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: "12px",
            marginTop: "24px",
          }}
        >
          VEXORA Admin · Team Management
        </p>
      </div>
    </main>
  );
}
