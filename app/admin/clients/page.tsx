
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  created_at: string;
};

type ClientForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
};

type ClientProject = {
  id: string;
  title: string;
  status: string;
  deadline: string | null;
  budget: number | null;
};

type CourseRegistration = {
  id: string;
  full_name: string;
  email: string;
  track: string;
  status: string;
  created_at: string;
};

type FilterType = "all" | "companies" | "individuals";
type SortType = "newest" | "oldest" | "name";

const emptyForm: ClientForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-blue-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50";

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(value: number | null) {
  if (value == null) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadClientsCsv(clients: Client[]) {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Company",
    "Notes",
    "Created At",
  ];

  const rows = clients.map((client) => [
    client.name,
    client.email,
    client.phone,
    client.company,
    client.notes,
    client.created_at,
  ]);

  const csv = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => row.map(escapeCsv).join(",")),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `vexora-clients-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [courseRegistrations, setCourseRegistrations] = useState<CourseRegistration[]>([]);
  const [courseRegistrationsError, setCourseRegistrationsError] = useState("");
  const [form, setForm] = useState<ClientForm>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientProjects, setClientProjects] = useState<ClientProject[]>([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCourseRegistrations = useCallback(async () => {
    const { data, error: queryError } = await supabase
      .from("student_registrations")
      .select("id, full_name, email, track, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (queryError) {
      setCourseRegistrationsError("Course registrations could not be loaded. Check the Academy registration table and admin permissions.");
      setCourseRegistrations([]);
      return;
    }

    setCourseRegistrations((data ?? []) as CourseRegistration[]);
    setCourseRegistrationsError("");
  }, []);

  async function loadClients(showRefreshIndicator = false) {
    if (showRefreshIndicator) {
      setRefreshing(true);
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("clients")
        .select(
          "id, name, email, phone, company, notes, created_at"
        )
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(`Could not load clients: ${fetchError.message}`);
        return false;
      }

      setClients((data ?? []) as Client[]);
      await loadCourseRegistrations();
      setError("");
      return true;
    } catch {
      setError("An unexpected error occurred while loading clients.");
      return false;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function initialLoad() {
      try {
        const { data, error: fetchError } = await supabase
          .from("clients")
          .select(
            "id, name, email, phone, company, notes, created_at"
          )
          .order("created_at", { ascending: false });

        if (!active) return;

        if (fetchError) {
          setError(`Could not load clients: ${fetchError.message}`);
        } else {
          setClients((data ?? []) as Client[]);
        }
      } catch {
        if (active) {
          setError("An unexpected error occurred while loading clients.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void initialLoad();
    void loadCourseRegistrations();

    return () => {
      active = false;
    };
  }, [loadCourseRegistrations]);

  function updateField(field: keyof ClientForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openNewForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setError("");
    setShowForm(true);
    setSelectedClient(null);
  }

  function openEditForm(client: Client) {
    setForm({
      name: client.name,
      email: client.email ?? "",
      phone: client.phone ?? "",
      company: client.company ?? "",
      notes: client.notes ?? "",
    });

    setEditingId(client.id);
    setMessage("");
    setError("");
    setSelectedClient(null);
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const company = form.company.trim();
    const notes = form.notes.trim();

    if (!name) {
      setError("Client name is required.");
      return;
    }

    if (name.length > 150) {
      setError("Client name cannot exceed 150 characters.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      name,
      email: email || null,
      phone: phone || null,
      company: company || null,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    };

    try {
      const result = editingId
        ? await supabase
            .from("clients")
            .update(payload)
            .eq("id", editingId)
            .select("id")
        : await supabase
            .from("clients")
            .insert(payload)
            .select("id");

      if (result.error) {
        setError(`Could not save client: ${result.error.message}`);
        return;
      }

      if (!result.data || result.data.length === 0) {
        setError(
          "No client was returned after saving. Check your Supabase permissions."
        );
        return;
      }

      const wasEditing = Boolean(editingId);

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      const refreshed = await loadClients();

      if (refreshed) {
        setMessage(
          wasEditing
            ? "Client updated successfully."
            : "Client created successfully."
        );
      }
    } catch {
      setError("An unexpected error occurred while saving the client.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteClient(client: Client) {
    const confirmed = window.confirm(
      `Delete "${client.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(client.id);
    setError("");
    setMessage("");

    try {
      const { data, error: deleteError } = await supabase
        .from("clients")
        .delete()
        .eq("id", client.id)
        .select("id");

      if (deleteError) {
        setError(`Could not delete client: ${deleteError.message}`);
        return;
      }

      if (!data || data.length === 0) {
        setError(
          "No client was deleted. Check your Supabase permissions."
        );
        return;
      }

      setClients((current) =>
        current.filter((item) => item.id !== client.id)
      );

      if (selectedClient?.id === client.id) {
        setSelectedClient(null);
        setClientProjects([]);
      }

      setMessage("Client deleted successfully.");
    } catch {
      setError("An unexpected error occurred while deleting the client.");
    } finally {
      setDeletingId(null);
    }
  }

  async function openClientDetails(client: Client) {
    setSelectedClient(client);
    setClientProjects([]);
    setDetailsLoading(true);
    setError("");

    try {
      const { data, error: projectsError } = await supabase
        .from("projects")
        .select("id, title, status, deadline, budget")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false });

      if (projectsError) {
        setError(
          `Could not load related projects: ${projectsError.message}`
        );
        return;
      }

      setClientProjects((data ?? []) as ClientProject[]);
    } catch {
      setError("Could not load the client's project details.");
    } finally {
      setDetailsLoading(false);
    }
  }

  const filteredClients = useMemo(() => {
    const query = search.toLowerCase().trim();

    return clients
      .filter((client) => {
        const matchesSearch = [
          client.name,
          client.email,
          client.phone,
          client.company,
          client.notes,
        ].some((value) => value?.toLowerCase().includes(query));

        const hasCompany = Boolean(client.company?.trim());

        const matchesFilter =
          filter === "all" ||
          (filter === "companies" && hasCompany) ||
          (filter === "individuals" && !hasCompany);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sort === "name") {
          return a.name.localeCompare(b.name);
        }

        const dateA = new Date(a.created_at).getTime() || 0;
        const dateB = new Date(b.created_at).getTime() || 0;

        return sort === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [clients, search, filter, sort]);

  const companyCount = clients.filter(
    (client) => Boolean(client.company?.trim())
  ).length;

  const emailCount = clients.filter(
    (client) => Boolean(client.email?.trim())
  ).length;

  const phoneCount = clients.filter(
    (client) => Boolean(client.phone?.trim())
  ).length;

  const projectBudget = clientProjects.reduce(
    (total, project) => total + (project.budget ?? 0),
    0
  );

  return (
    <main className="min-h-screen space-y-8 bg-[#080d16] p-4 text-slate-100 sm:p-6 xl:p-8">
      <div className="mx-auto max-w-[1500px] space-y-8">
        <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
              VEXORA / Management
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Client Management
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Manage your relationships, contact information, and client
              projects from one workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={refreshing || loading}
              onClick={() => void loadClients(true)}
              className={buttonClass}
            >
              <span aria-hidden="true">↻</span>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              disabled={loading || clients.length === 0}
              onClick={() => downloadClientsCsv(filteredClients)}
              className={buttonClass}
            >
              Export CSV
            </button>

            <button
              type="button"
              onClick={openNewForm}
              className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              + Add Client
            </button>
          </div>
        </header>

        {message && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start justify-between gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
          >
            <span>{message}</span>
            <button
              type="button"
              aria-label="Dismiss success message"
              onClick={() => setMessage("")}
              className="text-emerald-200 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            <span className="break-words">{error}</span>
            <button
              type="button"
              aria-label="Dismiss error message"
              onClick={() => setError("")}
              className="shrink-0 text-red-200 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Clients",
              value: clients.length,
              description: "All registered clients",
              icon: "01",
            },
            {
              label: "Companies",
              value: companyCount,
              description: "Clients with a company",
              icon: "02",
            },
            {
              label: "Email Contacts",
              value: emailCount,
              description: "Clients with an email",
              icon: "03",
            },
            {
              label: "Phone Contacts",
              value: phoneCount,
              description: "Clients with a phone number",
              icon: "04",
            },
          ].map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-blue-500/40"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <span className="text-xs font-semibold tracking-widest text-blue-400">
                  {stat.icon}
                </span>
              </div>

              <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {loading ? "—" : stat.value}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {stat.description}
              </p>
            </article>
          ))}
        </section>

        {showForm && (
          <section
            className="rounded-2xl border border-blue-500/30 bg-slate-950/80 p-5 sm:p-7"
            aria-labelledby="client-form-title"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
                  Client Profile
                </p>

                <h2
                  id="client-form-title"
                  className="text-xl font-semibold text-white"
                >
                  {editingId ? "Edit Client" : "Create New Client"}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Fields marked with * are required.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={closeForm}
                className={buttonClass}
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <label className="grid gap-2 text-sm text-slate-300">
                  Full Name *
                  <input
                    required
                    autoFocus
                    maxLength={150}
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Client full name"
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2 text-sm text-slate-300">
                  Email Address
                  <input
                    type="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="client@example.com"
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2 text-sm text-slate-300">
                  Phone Number
                  <input
                    type="tel"
                    maxLength={40}
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="+20..."
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2 text-sm text-slate-300 sm:col-span-2 xl:col-span-1">
                  Company
                  <input
                    maxLength={200}
                    value={form.company}
                    onChange={(event) =>
                      updateField("company", event.target.value)
                    }
                    placeholder="Company name"
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2 text-sm text-slate-300 sm:col-span-2 xl:col-span-3">
                  Notes
                  <textarea
                    rows={4}
                    maxLength={5000}
                    value={form.notes}
                    onChange={(event) =>
                      updateField("notes", event.target.value)
                    }
                    placeholder="Client requirements, preferences, and important information..."
                    className={`${inputClass} resize-y`}
                  />

                  <span className="text-right text-xs text-slate-500">
                    {form.notes.length}/5000
                  </span>
                </label>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Client"}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={closeForm}
                  className={buttonClass}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
          <div className="space-y-5 border-b border-slate-800 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Client Directory
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {loading
                    ? "Loading client records..."
                    : `${filteredClients.length} of ${clients.length} clients`}
                </p>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(200px,1fr)_190px_190px]">
              <input
                type="search"
                aria-label="Search clients"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, phone, company..."
                className={inputClass}
              />

              <select
                aria-label="Filter client type"
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as FilterType)
                }
                className={inputClass}
              >
                <option value="all">All client types</option>
                <option value="companies">Companies</option>
                <option value="individuals">Individuals</option>
              </select>

              <select
                aria-label="Sort clients"
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as SortType)
                }
                className={inputClass}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />
              <p className="text-sm text-slate-400">
                Loading your client directory...
              </p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-10 text-center sm:p-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-xl text-blue-400">
                +
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                {search || filter !== "all"
                  ? "No matching clients"
                  : "Your client directory is empty"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                {search || filter !== "all"
                  ? "Try another search term or change the selected filter."
                  : "Add your first client to start organizing relationships and project information."}
              </p>

              {search === "" && filter === "all" && (
                <button
                  type="button"
                  onClick={openNewForm}
                  className="mt-5 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400"
                >
                  + Add First Client
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4 font-medium">Client</th>
                    <th className="px-5 py-4 font-medium">Contact</th>
                    <th className="px-5 py-4 font-medium">Company</th>
                    <th className="px-5 py-4 font-medium">Added</th>
                    <th className="px-5 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className="transition hover:bg-slate-900/60"
                    >
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => void openClientDetails(client)}
                          className="text-left font-semibold text-white transition hover:text-blue-400"
                        >
                          {client.name}
                        </button>

                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                          {client.notes || "No additional notes"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="break-all text-slate-300">
                          {client.email || "No email"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {client.phone || "No phone"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {client.company || "Individual"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                        {formatDate(client.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(client)}
                            className={buttonClass}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === client.id}
                            onClick={() => void deleteClient(client)}
                            className="rounded-xl border border-red-500/30 px-3 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                          >
                            {deletingId === client.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedClient && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedClient(null);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="client-details-title"
              className="my-6 w-full max-w-3xl rounded-2xl border border-slate-700 bg-[#0b1220] p-5 shadow-2xl sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
                    Client Details
                  </p>

                  <h2
                    id="client-details-title"
                    className="text-2xl font-semibold text-white"
                  >
                    {selectedClient.name}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {selectedClient.company || "Individual client"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  aria-label="Close client details"
                  className={buttonClass}
                >
                  Close
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    label: "Email",
                    value: selectedClient.email || "Not provided",
                  },
                  {
                    label: "Phone",
                    value: selectedClient.phone || "Not provided",
                  },
                  {
                    label: "Company",
                    value: selectedClient.company || "Not provided",
                  },
                  {
                    label: "Client Since",
                    value: formatDate(selectedClient.created_at),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                  >
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="mt-2 break-words text-sm text-slate-200">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs text-slate-500">Notes</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                  {selectedClient.notes || "No notes have been added."}
                </p>
              </div>

              <div className="mt-7 border-t border-slate-800 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white">
                    Related Projects
                  </h3>

                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                    {clientProjects.length} projects
                  </span>
                </div>

                {detailsLoading ? (
                  <p className="py-8 text-sm text-slate-400">
                    Loading related projects...
                  </p>
                ) : clientProjects.length === 0 ? (
                  <p className="py-8 text-sm text-slate-400">
                    No related projects were found for this client.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {clientProjects.map((project) => (
                      <article
                        key={project.id}
                        className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 p-4 sm:flex-row sm:items-center"
                      >
                        <div>
                          <h4 className="font-medium text-white">
                            {project.title}
                          </h4>

                          <p className="mt-1 text-xs text-slate-400">
                            Deadline: {formatDate(project.deadline)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                            {project.status.replace(/_/g, " ")}
                          </span>

                          <span className="text-sm text-slate-300">
                            {formatMoney(project.budget)}
                          </span>
                        </div>
                      </article>
                    ))}

                    <p className="text-right text-xs text-slate-500">
                      Total recorded project budgets:{" "}
                      {formatMoney(projectBudget)}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openEditForm(selectedClient)}
                  className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400"
                >
                  Edit Client
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className={buttonClass}
                >
                  Close Details
                </button>
              </div>
            </section>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-[#0d1a2a] via-slate-950 to-slate-950 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-200">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H17a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6.5A2.5 2.5 0 0 1 4 18.5z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Academy / Offline learning</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Course registrations</h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">Applications are listed with the email address and course track submitted by each learner.</p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-1.5 text-xs font-semibold text-cyan-100">{courseRegistrations.length} registrations</span>
          </div>
          <div className="p-4 sm:p-6">
            {courseRegistrationsError ? (
              <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-4 text-sm text-rose-200">{courseRegistrationsError}</p>
            ) : courseRegistrations.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-400">No Academy registrations have been submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-3 font-medium">Student</th><th className="px-3 py-3 font-medium">Email</th><th className="px-3 py-3 font-medium">Course</th><th className="px-3 py-3 font-medium">Status</th><th className="px-3 py-3 font-medium">Submitted</th></tr></thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {courseRegistrations.map((registration) => (
                      <tr key={registration.id} className="transition hover:bg-white/[0.025]">
                        <td className="px-3 py-4 font-medium text-white">{registration.full_name}</td>
                        <td className="px-3 py-4 text-slate-300">{registration.email}</td>
                        <td className="px-3 py-4 text-cyan-100">{registration.track}</td>
                        <td className="px-3 py-4"><span className={`rounded-full border px-2.5 py-1 text-xs ${registration.status === "accepted" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : registration.status === "rejected" ? "border-rose-400/20 bg-rose-400/10 text-rose-200" : "border-amber-400/20 bg-amber-400/10 text-amber-100"}`}>{registration.status}</span></td>
                        <td className="px-3 py-4 text-slate-400">{formatDate(registration.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <footer className="border-t border-slate-800 pt-5 text-center text-xs text-slate-500">
          VEXORA Technology · Client Management Workspace
        </footer>
      </div>
    </main>
  );
}
