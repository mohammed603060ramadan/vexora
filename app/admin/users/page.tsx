"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type UserRole = "Admin" | "Manager" | "Employee" | "Client";
type UserStatus = "Active" | "Pending" | "Suspended";

type UserItem = {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  lastActive: string;
};

const initialUsers: UserItem[] = [
  { id: "USR-001", name: "Ahmed Hassan", email: "ahmed@example.com", company: "Hassan Group", role: "Client", status: "Active", joined: "2026-10-02", lastActive: "Today, 09:42" },
  { id: "USR-002", name: "Sarah Mohamed", email: "sarah@example.com", company: "Nile Solutions", role: "Manager", status: "Active", joined: "2026-09-28", lastActive: "Today, 08:15" },
  { id: "USR-003", name: "Omar Ali", email: "omar@example.com", company: "VEXORA", role: "Employee", status: "Active", joined: "2026-09-20", lastActive: "Yesterday" },
  { id: "USR-004", name: "Mariam Adel", email: "mariam@example.com", company: "Orbit Business", role: "Client", status: "Pending", joined: "2026-10-15", lastActive: "Never" },
  { id: "USR-005", name: "Youssef Ibrahim", email: "youssef@example.com", company: "VEXORA", role: "Admin", status: "Active", joined: "2026-08-12", lastActive: "Today, 10:04" },
  { id: "USR-006", name: "Nour Khaled", email: "nour@example.com", company: "Independent", role: "Client", status: "Suspended", joined: "2026-09-04", lastActive: "Oct 10, 2026" },
];

const statusStyle: Record<UserStatus, string> = {
  Active: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Suspended: "border-rose-400/20 bg-rose-400/10 text-rose-300",
};

const roleStyle: Record<UserRole, string> = {
  Admin: "text-violet-300",
  Manager: "text-blue-300",
  Employee: "text-cyan-300",
  Client: "text-slate-300",
};

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "Client" as UserRole,
  });

  const selectedUser = users.find((user) => user.id === selectedId) ?? null;

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((user) => user.status === "Active").length,
    pending: users.filter((user) => user.status === "Pending").length,
    internal: users.filter((user) => user.role !== "Client").length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch = !query || [
        user.name, user.email, user.company, user.id, user.role,
      ].some((value) => value.toLowerCase().includes(query));

      return matchesSearch &&
        (roleFilter === "All" || user.role === roleFilter) &&
        (statusFilter === "All" || user.status === statusFilter);
    });
  }, [users, search, roleFilter, statusFilter]);

  function updateUser(id: string, updates: Partial<UserItem>) {
    setUsers((current) => current.map((user) =>
      user.id === id ? { ...user, ...updates } : user
    ));
  }

  function addUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = form.email.trim().toLowerCase();
    if (users.some((user) => user.email.toLowerCase() === email)) {
      setNotice("This email already exists in the current demo list.");
      return;
    }

    const newUser: UserItem = {
      id: `USR-${Date.now()}`,
      name: form.name.trim(),
      email,
      company: form.company.trim() || "Not provided",
      role: form.role,
      status: "Pending",
      joined: new Date().toISOString().slice(0, 10),
      lastActive: "Never",
    };

    setUsers((current) => [newUser, ...current]);
    setForm({ name: "", email: "", company: "", role: "Client" });
    setShowForm(false);
    setSearch("");
    setRoleFilter("All");
    setStatusFilter("All");
    setNotice("Demo user added with Pending status. No account or invitation was created.");
  }

  function removeDemoUser(user: UserItem) {
    if (!window.confirm(`Remove ${user.name} from this demo list? This will not delete a real account.`)) return;
    setUsers((current) => current.filter((item) => item.id !== user.id));
    if (selectedId === user.id) setSelectedId(null);
    setNotice("User removed from the current demo list only.");
  }

  return (
    <main className="min-h-screen bg-[#080b12] px-4 py-6 text-white sm:px-6 lg:px-9 lg:py-9">
      <div className="mx-auto max-w-[1500px] space-y-7">
        <header className="flex flex-col justify-between gap-5 border-b border-white/[0.08] pb-7 md:flex-row md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              VEXORA / Administration
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              User Management<span className="text-blue-400">.</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage your user directory, review account status, and organize access roles.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.04]">
              ← Dashboard
            </Link>
            <button type="button" onClick={() => { setNotice(""); setShowForm(true); }} className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400">
              + Add demo user
            </button>
          </div>
        </header>

        {notice && (
          <div role="status" className="flex items-center justify-between gap-3 rounded-xl border border-blue-400/20 bg-blue-400/[0.07] px-4 py-3 text-sm text-blue-200">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification">✕</button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total users", value: stats.total, icon: "◎", note: "In this demo directory", color: "text-white" },
            { label: "Active accounts", value: stats.active, icon: "✓", note: "Marked as active", color: "text-emerald-300" },
            { label: "Pending review", value: stats.pending, icon: "◷", note: "Awaiting review", color: "text-amber-300" },
            { label: "Internal team", value: stats.internal, icon: "⌘", note: "Admins, managers and staff", color: "text-blue-300" },
          ].map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#111a2a] to-[#0b101a] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
              </div>
              <p className={`mt-5 text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
              <p className="mt-2 text-xs text-slate-500">{stat.note}</p>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c111b]">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold">User directory</h2>
              <p className="mt-1 text-xs text-slate-500">{filteredUsers.length} users displayed</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[700px]">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, company..." aria-label="Search users" className="min-w-0 rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-blue-400/60" />
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="Filter by role" className="rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-slate-300 outline-none focus:border-blue-400/60">
                <option value="All">All roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
                <option value="Client">Client</option>
              </select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status" className="rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-slate-300 outline-none focus:border-blue-400/60">
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="text-3xl text-slate-500">◎</div>
              <h3 className="mt-4 font-medium">No users found</h3>
              <p className="mt-2 text-sm text-slate-500">Try another search or clear the filters.</p>
              <button type="button" onClick={() => { setSearch(""); setRoleFilter("All"); setStatusFilter("All"); }} className="mt-4 text-sm text-blue-300">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">User</th>
                      <th className="px-5 py-4 font-medium">Role</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 font-medium">Last active</th>
                      <th className="px-5 py-4 font-medium">Joined</th>
                      <th className="px-5 py-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="transition hover:bg-white/[0.025]">
                        <td className="px-5 py-4">
                          <button type="button" onClick={() => setSelectedId(user.id)} className="flex items-center gap-3 text-left">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-xs font-semibold text-blue-200">{initials(user.name)}</span>
                            <span className="min-w-0">
                              <span className="block font-medium text-slate-200">{user.name}</span>
                              <span className="mt-1 block text-xs text-slate-500">{user.email}</span>
                              <span className="mt-1 block text-xs text-slate-600">{user.company}</span>
                            </span>
                          </button>
                        </td>
                        <td className={`px-5 py-4 text-xs font-medium ${roleStyle[user.role]}`}>{user.role}</td>
                        <td className="px-5 py-4"><span className={`rounded-full border px-2.5 py-1 text-[11px] ${statusStyle[user.status]}`}>{user.status}</span></td>
                        <td className="px-5 py-4 text-xs text-slate-400">{user.lastActive}</td>
                        <td className="px-5 py-4 text-xs text-slate-400">{user.joined}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setSelectedId(user.id)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05]">View</button>
                            <button type="button" onClick={() => removeDemoUser(user)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 hover:border-rose-400/30 hover:text-rose-300">Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-4 md:hidden">
                {filteredUsers.map((user) => (
                  <article key={user.id} className="rounded-xl border border-white/[0.07] bg-[#080c14] p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xs font-semibold text-blue-200">{initials(user.name)}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="mt-1 break-all text-xs text-slate-500">{user.email}</p>
                        <p className="mt-1 text-xs text-slate-600">{user.company}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-1 text-[10px] ${statusStyle[user.status]}`}>{user.status}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3">
                      <span className={`text-xs ${roleStyle[user.role]}`}>{user.role}</span>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setSelectedId(user.id)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300">View</button>
                        <button type="button" onClick={() => removeDemoUser(user)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400">Remove</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          <div className="flex flex-col gap-2 border-t border-white/[0.07] px-5 py-4 text-xs text-slate-500 sm:flex-row sm:justify-between">
            <span>Showing {filteredUsers.length} of {users.length} demo users</span>
            <span>VEXORA Access Management · Preview mode</span>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-white/[0.06] pt-5 text-xs leading-5 text-slate-600 sm:flex-row sm:justify-between">
          <p>VEXORA Admin · User management</p>
          <p>Sample data only · Changes reset when the page refreshes</p>
        </footer>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedId(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="user-detail-title" className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/10 bg-[#0c111b] shadow-2xl sm:rounded-2xl">
            <div className="flex items-start justify-between border-b border-white/[0.08] p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Account profile</p>
                <h2 id="user-detail-title" className="mt-2 text-xl font-semibold">{selectedUser.name}</h2>
                <p className="mt-1 text-xs text-slate-500">{selectedUser.id}</p>
              </div>
              <button type="button" onClick={() => setSelectedId(null)} aria-label="Close user details" className="rounded-lg border border-white/10 px-3 py-2 text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-5 p-5">
              <div className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-[#080c14] p-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-lg font-semibold text-blue-200">{initials(selectedUser.name)}</span>
                <div className="min-w-0">
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="break-all text-sm text-slate-400">{selectedUser.email}</p>
                  <p className="mt-1 text-xs text-slate-500">{selectedUser.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.07] p-4">
                  <p className="text-xs text-slate-500">Account status</p>
                  <span className={`mt-2 inline-block rounded-full border px-2.5 py-1 text-xs ${statusStyle[selectedUser.status]}`}>{selectedUser.status}</span>
                </div>
                <div className="rounded-xl border border-white/[0.07] p-4">
                  <p className="text-xs text-slate-500">Joined</p>
                  <p className="mt-2 text-sm text-slate-200">{selectedUser.joined}</p>
                </div>
              </div>

              <label className="block text-xs text-slate-400">
                Demo role
                <select value={selectedUser.role} onChange={(event) => updateUser(selectedUser.id, { role: event.target.value as UserRole })} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60">
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                  <option value="Client">Client</option>
                </select>
              </label>

              <label className="block text-xs text-slate-400">
                Demo account status
                <select value={selectedUser.status} onChange={(event) => updateUser(selectedUser.id, { status: event.target.value as UserStatus })} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60">
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </label>

              <p className="rounded-xl border border-amber-300/15 bg-amber-300/[0.05] p-3 text-xs leading-5 text-amber-100/80">
                Preview mode: role and status changes affect only this page. They do not change Supabase Auth, database permissions, or a real account.
              </p>
              <button type="button" onClick={() => setSelectedId(null)} className="w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-400">Done</button>
            </div>
          </section>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="add-user-title" className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-white/10 bg-[#0c111b] shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Directory tools</p>
                <h2 id="add-user-title" className="mt-2 text-xl font-semibold">Add demo user</h2>
              </div>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Close form" className="rounded-lg border border-white/10 px-3 py-2 text-slate-400">✕</button>
            </div>
            <form onSubmit={addUser} className="space-y-4 p-5">
              <p className="rounded-xl border border-amber-300/15 bg-amber-300/[0.05] p-3 text-xs leading-5 text-amber-100/80">
                This creates a demo record only. It will not create a login, send an invitation, or grant access.
              </p>
              <label className="block text-xs text-slate-400">
                Full name *
                <input required maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60" />
              </label>
              <label className="block text-xs text-slate-400">
                Email address *
                <input required type="email" maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="name@example.com" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60" />
              </label>
              <label className="block text-xs text-slate-400">
                Company
                <input maxLength={150} value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} placeholder="Company or organization" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60" />
              </label>
              <label className="block text-xs text-slate-400">
                Intended role (demo only)
                <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as UserRole })} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60">
                  <option value="Client">Client</option>
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </label>
              <div className="flex gap-3 border-t border-white/[0.07] pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300">Cancel</button>
                <button type="submit" className="flex-1 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-400">Add demo user</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
