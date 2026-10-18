
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type ProjectStatus = "planning" | "in_progress" | "completed" | "on_hold";

type Client = {
  id: string;
  name: string;
  company: string | null;
};

type Project = {
  id: string;
  title: string;
  client_id: string | null;
  client_name: string | null;
  description: string | null;
  status: ProjectStatus;
  budget: number | null;
  deadline: string | null;
  created_at: string;
};

type ProjectForm = {
  title: string;
  client_id: string;
  description: string;
  status: ProjectStatus;
  budget: string;
  deadline: string;
};

const emptyForm: ProjectForm = {
  title: "",
  client_id: "",
  description: "",
  status: "planning",
  budget: "",
  deadline: "",
};

const statusLabels: Record<ProjectStatus, string> = {
  planning: "Planning",
  in_progress: "In Progress",
  completed: "Completed",
  on_hold: "On Hold",
};

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">(
    "success"
  );

  // Initial data loading.
  // State updates happen after the asynchronous Supabase requests finish.
  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      try {
        const [projectsResult, clientsResult] = await Promise.all([
          supabase
            .from("projects")
            .select(
              "id, title, client_id, client_name, description, status, budget, deadline, created_at"
            )
            .order("created_at", { ascending: false }),

          supabase
            .from("clients")
            .select("id, name, company")
            .order("name", { ascending: true }),
        ]);

        if (cancelled) return;

        if (projectsResult.error) {
          setMessage(
            `Could not load projects: ${projectsResult.error.message}`
          );
          setMessageType("error");
        } else {
          setProjects((projectsResult.data ?? []) as Project[]);
        }

        if (clientsResult.error) {
          setMessage(
            `Could not load clients: ${clientsResult.error.message}`
          );
          setMessageType("error");
        } else {
          setClients((clientsResult.data ?? []) as Client[]);
        }
      } catch {
        if (cancelled) return;

        setMessage("An unexpected error occurred while loading data.");
        setMessageType("error");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initialLoad();

    return () => {
      cancelled = true;
    };
  }, []);

  // Reload projects and clients after creating or updating a project.
  async function loadData() {
    setLoading(true);

    try {
      const [projectsResult, clientsResult] = await Promise.all([
        supabase
          .from("projects")
          .select(
            "id, title, client_id, client_name, description, status, budget, deadline, created_at"
          )
          .order("created_at", { ascending: false }),

        supabase
          .from("clients")
          .select("id, name, company")
          .order("name", { ascending: true }),
      ]);

      if (projectsResult.error) {
        setMessage(
          `Could not load projects: ${projectsResult.error.message}`
        );
        setMessageType("error");
      } else {
        setProjects((projectsResult.data ?? []) as Project[]);
      }

      if (clientsResult.error) {
        setMessage(
          `Could not load clients: ${clientsResult.error.message}`
        );
        setMessageType("error");
      } else {
        setClients((clientsResult.data ?? []) as Client[]);
      }
    } catch {
      setMessage("An unexpected error occurred while loading data.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  function openNewForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(project: Project) {
    setEditingId(project.id);

    setForm({
      title: project.title,
      client_id: project.client_id ?? "",
      description: project.description ?? "",
      status: project.status,
      budget: project.budget == null ? "" : String(project.budget),
      deadline: project.deadline ?? "",
    });

    setMessage("");
    setShowForm(true);
  }

  async function saveProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const title = form.title.trim();
    const budgetText = form.budget.trim();
    const budget = budgetText === "" ? null : Number(budgetText);

    if (!title) {
      setMessage("Project title is required.");
      setMessageType("error");
      return;
    }

    if (
      budgetText !== "" &&
      (!Number.isFinite(budget) || Number(budget) < 0)
    ) {
      setMessage("Enter a valid, non-negative budget.");
      setMessageType("error");
      return;
    }

    if (
      form.client_id &&
      !clients.some((client) => client.id === form.client_id)
    ) {
      setMessage("Please select a valid client.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");

    const selectedClient =
      clients.find((client) => client.id === form.client_id) ?? null;

    const payload = {
      title,
      client_id: selectedClient?.id ?? null,
      client_name: selectedClient
        ? selectedClient.company
          ? `${selectedClient.name} (${selectedClient.company})`
          : selectedClient.name
        : null,
      description: form.description.trim() || null,
      status: form.status,
      budget,
      deadline: form.deadline || null,
      updated_at: new Date().toISOString(),
    };

    try {
      const result = editingId
        ? await supabase
            .from("projects")
            .update(payload)
            .eq("id", editingId)
            .select("id")
        : await supabase.from("projects").insert(payload).select("id");

      if (result.error) {
        setMessage(`Could not save project: ${result.error.message}`);
        setMessageType("error");
        return;
      }

      if (!result.data || result.data.length === 0) {
        setMessage(
          "The project was not saved. Check your Supabase permissions."
        );
        setMessageType("error");
        return;
      }

      const wasEditing = Boolean(editingId);

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);

      await loadData();

      setMessage(
        wasEditing
          ? "Project updated successfully."
          : "Project created successfully."
      );
      setMessageType("success");
    } catch {
      setMessage("An unexpected error occurred while saving the project.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setMessage("");

    try {
      const { data, error } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id)
        .select("id");

      if (error) {
        setMessage(`Could not delete project: ${error.message}`);
        setMessageType("error");
        return;
      }

      if (!data || data.length === 0) {
        setMessage(
          "The project was not deleted. Check your Supabase permissions."
        );
        setMessageType("error");
        return;
      }

      setProjects((current) =>
        current.filter((item) => item.id !== project.id)
      );

      setMessage("Project deleted successfully.");
      setMessageType("success");
    } catch {
      setMessage("An unexpected error occurred while deleting the project.");
      setMessageType("error");
    }
  }

  const filteredProjects = projects.filter((project) => {
    const client = clients.find((item) => item.id === project.client_id);

    const clientDisplay = client?.company
      ? `${client.name} ${client.company}`
      : client?.name ?? project.client_name ?? "";

    const matchesSearch = [
      project.title,
      clientDisplay,
      project.description ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus = filter === "all" || project.status === filter;

    return matchesSearch && matchesStatus;
  });

  const completedCount = projects.filter(
    (project) => project.status === "completed"
  ).length;

  const activeCount = projects.filter(
    (project) => project.status === "in_progress"
  ).length;

  const planningCount = projects.filter(
    (project) => project.status === "planning"
  ).length;

  const onHoldCount = projects.filter(
    (project) => project.status === "on_hold"
  ).length;

  function getClientDisplay(project: Project) {
    const client = clients.find((item) => item.id === project.client_id);

    if (client) {
      return client.company
        ? `${client.name} (${client.company})`
        : client.name;
    }

    return project.client_name || "—";
  }

  function formatBudget(budget: number | null) {
    if (budget == null) return "—";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(budget);
  }

  return (
    <main className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            Workspace / Projects
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Projects Management
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Manage project details, clients, budgets, and delivery deadlines
            in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewForm}
          className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
        >
          + New Project
        </button>
      </section>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-xl border px-4 py-3 text-sm ${
            messageType === "error"
              ? "border-red-500/40 bg-red-500/10 text-red-200"
              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {message}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Total Projects", value: projects.length },
          { label: "In Progress", value: activeCount },
          { label: "Planning", value: planningCount },
          { label: "Completed", value: completedCount },
          { label: "On Hold", value: onHoldCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
          >
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {showForm && (
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {editingId ? "Edit Project" : "Create New Project"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Enter the project information below.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setMessage("");
              }}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={saveProject} className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              Project Title *
              <input
                required
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="Website Redesign"
                className={inputClass}
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              Client
              <select
                value={form.client_id}
                onChange={(event) =>
                  setForm({ ...form, client_id: event.target.value })
                }
                className={inputClass}
              >
                <option value="">No client assigned</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                    {client.company ? ` — ${client.company}` : ""}
                  </option>
                ))}
              </select>

              {clients.length === 0 && (
                <span className="block text-xs text-amber-300">
                  No clients found. Add a client in Client Management first.
                </span>
              )}
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              Status
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value as ProjectStatus,
                  })
                }
                className={inputClass}
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              Budget (USD)
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.budget}
                onChange={(event) =>
                  setForm({ ...form, budget: event.target.value })
                }
                placeholder="0.00"
                className={inputClass}
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
              Deadline
              <input
                type="date"
                value={form.deadline}
                onChange={(event) =>
                  setForm({ ...form, deadline: event.target.value })
                }
                className={inputClass}
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
              Description
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Project scope, goals, and important details..."
                className={`${inputClass} resize-y`}
              />
            </label>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Project"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setMessage("");
                }}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
        <div className="flex flex-col gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">All Projects</h2>
            <p className="mt-1 text-sm text-slate-400">
              {filteredProjects.length} project
              {filteredProjects.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects or clients..."
              aria-label="Search projects"
              className="min-w-0 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 sm:w-64"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter by status"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Loading projects and clients...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-base font-medium text-white">
              {search || filter !== "all"
                ? "No matching projects"
                : "No projects yet"}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              {search || filter !== "all"
                ? "Try changing your search or filter."
                : "Create your first project to get started."}
            </p>

            {!search && filter === "all" && (
              <button
                type="button"
                onClick={openNewForm}
                className="mt-5 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-400"
              >
                + Create First Project
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-900/70 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-medium">Project</th>
                  <th className="px-5 py-4 font-medium">Client</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Budget</th>
                  <th className="px-5 py-4 font-medium">Deadline</th>
                  <th className="px-5 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="transition hover:bg-slate-900/50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{project.title}</p>
                      <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                        {project.description || "No description"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {getClientDisplay(project)}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
                        {statusLabels[project.status] ?? project.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {formatBudget(project.budget)}
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {project.deadline || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(project)}
                          className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:border-blue-500 hover:text-white"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => void deleteProject(project)}
                          className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-red-400 hover:border-red-500 hover:bg-red-500/10"
                        >
                          Delete
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
    </main>
  );
}
