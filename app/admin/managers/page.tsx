"use client";

import { useCallback, useEffect, useState } from "react";

type Manager = {
  id?: string;
  user_id?: string;
  email: string | null;
  created_at?: string | null;
  email_confirmed?: boolean;
};

export default function AdminManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadManagers = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const response = await fetch("/api/admin/managers", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to load administrator accounts."
        );
      }

      setManagers(Array.isArray(result.managers) ? result.managers : []);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while loading administrators."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialManagers() {
      try {
        const response = await fetch("/api/admin/managers", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Failed to load administrator accounts."
          );
        }

        if (!cancelled) {
          setManagers(Array.isArray(result.managers) ? result.managers : []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "An error occurred while loading administrators."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchInitialManagers();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter an email address.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/managers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to create the administrator account."
        );
      }

      setMessage("Administrator invitation sent successfully. The invitee must verify their email and set a password before signing in.");
      setEmail("");

      await loadManagers(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while creating the account."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(manager: Manager) {
    const id = manager.user_id ?? manager.id;

    if (!id) {
      setError("The administrator ID is invalid.");
      return;
    }

    if (!manager.email) {
      setError("The email address for this account could not be identified.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove administrator privileges from ${manager.email}? The user account itself will not be deleted.`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");
    setDeletingId(id);

    try {
      const response = await fetch("/api/admin/managers", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to remove administrator privileges."
        );
      }

      setMessage("Administrator privileges removed successfully.");

      await loadManagers(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while removing administrator privileges."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <main
      dir="ltr"
      className="min-h-screen bg-[#060914] px-4 py-8 text-white sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-3 text-sm font-semibold tracking-widest text-blue-400">
            VEXORA / ADMINISTRATION
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Administrator Management
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Manage administrator accounts and access privileges from one
            central location.
          </p>
        </header>

        {message && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300"
          >
            {error}
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-blue-950/20 sm:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              Invite a Manager
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Send a secure invitation to a new manager. They will verify their email and set their own password before signing in.
            </p>
          </div>

          <form
            onSubmit={handleCreate}
            className="grid gap-5 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <label
                htmlFor="manager-email"
                className="mb-2 block text-sm text-slate-300"
              >
                Email Address
              </label>

              <input
                id="manager-email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending invitation...
                  </>
                ) : (
                  "Send Manager Invitation"
                )}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                Current Administrators
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Total Accounts: {managers.length}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadManagers()}
              disabled={loading}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm transition hover:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh List"}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-400" />
              Loading administrators...
            </div>
          ) : managers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-12 text-center">
              <p className="font-medium text-slate-300">
                No administrator accounts found.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                You can refresh the list or review the service access
                configuration.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="px-3 py-4 font-medium">
                      Email Address
                    </th>

                    <th className="px-3 py-4 font-medium">
                      Email Verification
                    </th>

                    <th className="px-3 py-4 font-medium">
                      Date Added
                    </th>

                    <th className="px-3 py-4 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {managers.map((manager) => {
                    const id =
                      manager.user_id ?? manager.id ?? manager.email ?? "";

                    return (
                      <tr
                        key={id}
                        className="border-b border-white/5 transition hover:bg-white/[0.02] last:border-0"
                      >
                        <td className="px-3 py-4 text-slate-200">
                          {manager.email ?? "Email unavailable"}
                        </td>

                        <td className="px-3 py-4">
                          {manager.email_confirmed ? (
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                              Verified
                            </span>
                          ) : (
                            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                              Not Verified
                            </span>
                          )}
                        </td>

                        <td className="px-3 py-4 text-slate-400">
                          {manager.created_at
                            ? new Date(
                                manager.created_at
                              ).toLocaleDateString("en-US")
                            : "—"}
                        </td>

                        <td className="px-3 py-4">
                          <button
                            type="button"
                            onClick={() => void handleDelete(manager)}
                            disabled={deletingId !== "" || !manager.email}
                            className="rounded-lg border border-red-500/30 px-3 py-2 text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === id
                              ? "Removing..."
                              : "Remove Privileges"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="mt-6 text-center text-xs leading-6 text-slate-500">
          VEXORA Administration · Removing administrator privileges does not
          delete the underlying user account.
        </footer>
      </div>
    </main>
  );
}