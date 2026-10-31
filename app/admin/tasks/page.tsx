
"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/supabase/browser";

type Project = {
  id: string;
  title: string;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  assigned_to: string | null;
  priority: "low" | "normal" | "high" | "urgent";
  status: "backlog" | "todo" | "in_progress" | "review" | "completed" | "blocked" | "cancelled";
  due_date: string | null;
  created_at: string;
  projects?: { title: string } | null;
};

type TaskForm = {
  title: string;
  description: string;
  project_id: string;
  assigned_to: string;
  priority: Task["priority"];
  status: Task["status"];
  due_date: string;
};

const emptyForm: TaskForm = {
  title: "",
  description: "",
  project_id: "",
  assigned_to: "",
  priority: "normal",
  status: "todo",
  due_date: "",
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
} as const;

const statusLabels: Record<Task["status"], string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  review: "In Review",
  completed: "Completed",
  blocked: "Blocked",
  cancelled: "Cancelled",
};

const priorityLabels: Record<Task["priority"], string> = {
  low: "Low",
  normal: "Medium",
  high: "High",
  urgent: "Urgent",
};

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(error.message);
  }

  return "An unexpected error occurred. Please try again.";
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [taskResult, projectResult] = await Promise.all([
        supabase
          .from("tasks")
          .select("*, projects(title)")
          .order("created_at", { ascending: false }),
        supabase
          .from("projects")
          .select("id, title")
          .order("title", { ascending: true }),
      ]);

      if (taskResult.error) {
        throw taskResult.error;
      }

      setTasks((taskResult.data ?? []) as Task[]);

      if (projectResult.error) {
        setProjects([]);
        setError(
          `Tasks loaded, but projects could not be loaded: ${projectResult.error.message}`,
        );
      } else {
        setProjects((projectResult.data ?? []) as Project[]);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeTasks() {
      try {
        const [taskResult, projectResult] = await Promise.all([
          supabase
            .from("tasks")
            .select("*, projects(title)")
            .order("created_at", { ascending: false }),
          supabase
            .from("projects")
            .select("id, title")
            .order("title", { ascending: true }),
        ]);

        if (cancelled) return;

        if (taskResult.error) {
          throw taskResult.error;
        }

        setTasks((taskResult.data ?? []) as Task[]);

        if (projectResult.error) {
          setProjects([]);
          setError(
            `Tasks loaded, but projects could not be loaded: ${projectResult.error.message}`,
          );
        } else {
          setProjects((projectResult.data ?? []) as Project[]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializeTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField<K extends keyof TaskForm>(
    field: K,
    value: TaskForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openNewForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(task: Task) {
    setForm({
      title: task.title,
      description: task.description ?? "",
      project_id: task.project_id ?? "",
      assigned_to: task.assigned_to ?? "",
      priority: task.priority,
      status: task.status,
      due_date: task.due_date ?? "",
    });

    setEditingId(task.id);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setError("");
    setMessage("");

    const title = form.title.trim();

    if (!title) {
      setError("Task title is required.");
      return;
    }

    if (title.length > 200) {
      setError("Task title cannot exceed 200 characters.");
      return;
    }

    if (form.description.length > 5000) {
      setError("Description cannot exceed 5000 characters.");
      return;
    }

    if (!form.project_id) {
      setError("Select a project. Every task must belong to a project.");
      return;
    }

    const assignedUserId = form.assigned_to.trim();
    if (assignedUserId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(assignedUserId)) {
      setError("Assigned To must be a valid Supabase Auth user UUID, not a name or email address.");
      return;
    }

    const payload = {
      title,
      description: form.description.trim() || null,
      project_id: form.project_id,
      assigned_to: assignedUserId || null,
      priority: form.priority,
      status: form.status,
      due_date: form.due_date || null,
      updated_at: new Date().toISOString(),
    };

    setSaving(true);

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("tasks")
          .update(payload)
          .eq("id", editingId);

        if (updateError) throw updateError;

        setMessage("Task updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("tasks")
          .insert(payload);

        if (insertError) throw insertError;

        setMessage("Task created successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function deleteTask(task: Task) {
    if (busyTaskId || saving) return;

    const confirmed = window.confirm(
      `Delete task "${task.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setBusyTaskId(task.id);
    setError("");
    setMessage("");

    try {
      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", task.id);

      if (deleteError) throw deleteError;

      setTasks((current) =>
        current.filter((item) => item.id !== task.id),
      );

      setMessage("Task deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyTaskId(null);
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      query === "" ||
      [
        task.title,
        task.description,
        task.assigned_to,
        task.projects?.title,
      ].some((value) => value?.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const cardStyle = {
    background: "#111827",
    border: "1px solid #263449",
    borderRadius: "14px",
    padding: "22px",
  } as const;

  function badgeStyle(color: string) {
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
              Tasks
            </h1>

            <p style={{ color: "#94a3b8", marginTop: "10px" }}>
              Organize work, priorities, deadlines, and project assignments.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewForm}
            disabled={saving || Boolean(busyTaskId)}
            style={{
              ...buttonStyle,
              background: "#1677ee",
              borderColor: "#1677ee",
              fontWeight: 700,
              padding: "13px 20px",
              opacity: saving || busyTaskId ? 0.6 : 1,
            }}
          >
            + Add Task
          </button>
        </header>

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
              ["Total Tasks", tasks.length],
              ["To Do", tasks.filter((task) => task.status === "todo").length],
              [
                "In Progress",
                tasks.filter((task) => task.status === "in_progress").length,
              ],
              [
                "Completed",
                tasks.filter((task) => task.status === "completed").length,
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
          <div
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
            <p style={{ margin: 0 }}>{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              style={{
                ...buttonStyle,
                marginTop: "10px",
                padding: "6px 10px",
              }}
            >
              Dismiss
            </button>
          </div>
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
              {editingId ? "Edit Task" : "Create New Task"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "18px",
                }}
              >
                <label style={{ display: "grid", gap: "8px" }}>
                  Task Title *
                  <input
                    required
                    maxLength={200}
                    value={form.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    placeholder="Enter task title"
                    style={inputStyle}
                  />
                </label>

                <label style={{ display: "grid", gap: "8px" }}>
                  Project
                  <select
                    value={form.project_id}
                    onChange={(event) =>
                      updateField("project_id", event.target.value)
                    }
                    style={inputStyle}
                  >
                    <option value="">Select a project (required)</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={{ display: "grid", gap: "8px" }}>
                  Assigned User ID (optional)
                  <input
                    maxLength={150}
                    value={form.assigned_to}
                    onChange={(event) =>
                      updateField("assigned_to", event.target.value)
                    }
                    placeholder="Paste the Supabase Auth user UUID"
                    style={inputStyle}
                  />
                </label>

                <label style={{ display: "grid", gap: "8px" }}>
                  Due Date
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(event) =>
                      updateField("due_date", event.target.value)
                    }
                    style={inputStyle}
                  />
                </label>

                <label style={{ display: "grid", gap: "8px" }}>
                  Priority
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      updateField(
                        "priority",
                        event.target.value as Task["priority"],
                      )
                    }
                    style={inputStyle}
                  >
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
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
                        event.target.value as Task["status"],
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
                  Description
                  <textarea
                    rows={4}
                    maxLength={5000}
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Describe the task..."
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
                  disabled={saving}
                  style={{
                    ...buttonStyle,
                    background: "#1677ee",
                    borderColor: "#1677ee",
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Task"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
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
            <h2 style={{ fontSize: "20px", margin: 0 }}>All Tasks</h2>

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
                aria-label="Search tasks"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks..."
                style={{ ...inputStyle, maxWidth: "260px" }}
              />

              <select
                aria-label="Filter tasks by status"
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
                onClick={() => void loadTasks()}
                disabled={loading}
                style={{
                  ...buttonStyle,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {loading ? (
            <p style={{ color: "#94a3b8", padding: "25px 0" }}>
              Loading tasks...
            </p>
          ) : filteredTasks.length === 0 ? (
            <div style={{ padding: "35px 10px", textAlign: "center" }}>
              <p style={{ fontSize: "18px", fontWeight: 650 }}>
                {search.trim() || statusFilter !== "all"
                  ? "No matching tasks"
                  : "No tasks yet"}
              </p>
              <p style={{ color: "#94a3b8" }}>
                Create a task to start tracking your team&apos;s work.
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
                      "Task",
                      "Project",
                      "Assigned To",
                      "Priority",
                      "Status",
                      "Due Date",
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
                  {filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td
                        style={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #202b3b",
                        }}
                      >
                        <strong>{task.title}</strong>
                        {task.description && (
                          <p
                            style={{
                              color: "#94a3b8",
                              fontSize: "12px",
                              maxWidth: "220px",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {task.description}
                          </p>
                        )}
                      </td>

                      <td
                        style={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #202b3b",
                        }}
                      >
                        {task.projects?.title || "—"}
                      </td>

                      <td
                        style={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #202b3b",
                        }}
                      >
                        {task.assigned_to || "—"}
                      </td>

                      <td
                        style={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #202b3b",
                        }}
                      >
                        <span
                          style={badgeStyle(
                            task.priority === "urgent"
                              ? "#fb7185"
                              : task.priority === "high"
                                ? "#fb923c"
                                : task.priority === "medium"
                                  ? "#facc15"
                                  : "#93c5fd",
                          )}
                        >
                          {priorityLabels[task.priority]}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #202b3b",
                        }}
                      >
                        <span
                          style={badgeStyle(
                            task.status === "completed"
                              ? "#4ade80"
                              : task.status === "in_progress"
                                ? "#60a5fa"
                                : task.status === "blocked"
                                  ? "#fb7185"
                                  : "#cbd5e1",
                          )}
                        >
                          {statusLabels[task.status]}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #202b3b",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {task.due_date || "—"}
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
                          onClick={() => openEditForm(task)}
                          disabled={Boolean(busyTaskId) || saving}
                          style={{
                            ...buttonStyle,
                            marginRight: "7px",
                            opacity: busyTaskId || saving ? 0.6 : 1,
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => void deleteTask(task)}
                          disabled={Boolean(busyTaskId) || saving}
                          style={{
                            ...buttonStyle,
                            color: "#fca5a5",
                            borderColor: "#71343b",
                            opacity: busyTaskId || saving ? 0.6 : 1,
                          }}
                        >
                          {busyTaskId === task.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p
            style={{
              color: "#64748b",
              fontSize: "12px",
              marginTop: "20px",
            }}
          >
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
        </section>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: "12px",
            marginTop: "24px",
          }}
        >
          VEXORA Admin · Task Management
        </p>
      </div>
    </main>
  );
}
