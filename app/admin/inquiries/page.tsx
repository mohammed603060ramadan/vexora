"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type Inquiry = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string | null;
  source: string;
  status: "new" | "contacted" | "qualified" | "converted" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  notes: string | null;
  created_at: string;
};

const statuses = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];

const priorities = ["low", "medium", "high", "urgent"] as const;

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0b111b] px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400";
const buttonClass =
  "rounded-xl border border-white/10 px-3 py-2 text-sm transition hover:border-blue-400/60 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50";

const emptyForm = {
  full_name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  message: "",
  source: "website",
  status: "new" as Inquiry["status"],
  priority: "medium" as Inquiry["priority"],
  notes: "",
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [editing, setEditing] = useState<Inquiry | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setInquiries([]);
    } else {
      setInquiries((data ?? []) as Inquiry[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error: queryError } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (queryError) {
        setError(queryError.message);
      } else {
        setInquiries((data ?? []) as Inquiry[]);
      }

      setLoading(false);
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const filteredInquiries = useMemo(() => {
    const term = search.trim().toLowerCase();

    return inquiries.filter((item) => {
      const matchesSearch = [
        item.full_name,
        item.email,
        item.phone,
        item.company,
        item.service,
        item.message,
      ].some((value) => value?.toLowerCase().includes(term));

      return (
        matchesSearch &&
        (statusFilter === "all" || item.status === statusFilter) &&
        (priorityFilter === "all" || item.priority === priorityFilter)
      );
    });
  }, [inquiries, search, statusFilter, priorityFilter]);

  const stats = useMemo(
    () => ({
      total: inquiries.length,
      new: inquiries.filter((item) => item.status === "new").length,
      active: inquiries.filter(
        (item) => item.status === "contacted" || item.status === "qualified"
      ).length,
      converted: inquiries.filter((item) => item.status === "converted").length,
    }),
    [inquiries]
  );

  function startNew() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setShowForm(true);
  }

  function startEdit(item: Inquiry) {
    setEditing(item);
    setForm({
      full_name: item.full_name,
      email: item.email ?? "",
      phone: item.phone ?? "",
      company: item.company ?? "",
      service: item.service ?? "",
      message: item.message ?? "",
      source: item.source || "website",
      status: item.status,
      priority: item.priority,
      notes: item.notes ?? "",
    });
    setError("");
    setNotice("");
    setShowForm(true);
  }

  async function saveInquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      company: form.company.trim() || null,
      service: form.service.trim() || null,
      message: form.message.trim() || null,
      source: form.source,
      status: form.status,
      priority: form.priority,
      notes: form.notes.trim() || null,
    };

    const result = editing
      ? await supabase
          .from("inquiries")
          .update(payload)
          .eq("id", editing.id)
          .select()
          .single()
      : await supabase.from("inquiries").insert(payload).select().single();

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setNotice(editing ? "Inquiry updated successfully." : "Inquiry added successfully.");
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    await loadInquiries();
    setSaving(false);
  }

  async function updateStatus(item: Inquiry, status: Inquiry["status"]) {
    setError("");
    setNotice("");

    const { error: updateError } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", item.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setInquiries((current) =>
      current.map((entry) =>
        entry.id === item.id ? { ...entry, status } : entry
      )
    );
    setNotice("Inquiry status updated.");
  }

  async function convertInquiry(item: Inquiry) {
    if (item.status === "converted") return;

    const confirmed = window.confirm(
      `Convert "${item.full_name}" into a client? This will create a client record and mark the inquiry as converted.`,
    );

    if (!confirmed) return;

    setConvertingId(item.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/admin/inquiries/${encodeURIComponent(item.id)}/convert`,
        { method: "POST" },
      );
      const result = (await response.json()) as {
        error?: string;
        message?: string;
        client?: { id: string; name: string };
      };

      if (!response.ok) {
        setError(result.error || "Could not convert this inquiry.");
        return;
      }

      setInquiries((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? { ...entry, status: "converted" }
            : entry,
        ),
      );
      setNotice(
        result.message ||
          `"${item.full_name}" was converted to a client successfully.`,
      );
      await loadInquiries();
    } catch {
      setError("A network error occurred while converting the inquiry.");
    } finally {
      setConvertingId(null);
    }
  }

  async function deleteInquiry(item: Inquiry) {
    if (!window.confirm(`Delete the inquiry from ${item.full_name}?`)) return;

    setError("");
    setNotice("");

    const { error: deleteError } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", item.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setInquiries((current) => current.filter((entry) => entry.id !== item.id));
    setNotice("Inquiry deleted successfully.");
  }

  return (
    <main className="min-h-screen bg-[#080b10] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
              VEXORA / CRM
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Client Inquiries
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Track leads, manage follow-ups, and turn opportunities into projects.
            </p>
          </div>

          <button
            type="button"
            onClick={startNew}
            className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            + Add Inquiry
          </button>
        </header>

        {error && (
          <div role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {notice && (
          <div role="status" className="rounded-xl border border-blue-400/30 bg-blue-400/10 p-4 text-sm text-blue-200">
            {notice}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Inquiries", value: stats.total },
            { label: "New Inquiries", value: stats.new },
            { label: "In Progress", value: stats.active },
            { label: "Converted", value: stats.converted },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#0d121b] p-5">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </section>

        {showForm && (
          <section className="rounded-2xl border border-white/10 bg-[#0d121b] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {editing ? "Edit Inquiry" : "Add New Inquiry"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Enter the lead details and follow-up status.
                </p>
              </div>
              <button type="button" className={buttonClass} onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>

            <form onSubmit={saveInquiry} className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                <span>Full Name *</span>
                <input
                  className={inputClass}
                  required
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Client name"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Email</span>
                <input
                  className={inputClass}
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="client@example.com"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Phone</span>
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+20..."
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Company</span>
                <input
                  className={inputClass}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Company name"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Service</span>
                <select
                  className={inputClass}
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                >
                  <option value="">Select a service</option>
                  <option>Software Development</option>
                  <option>Cybersecurity</option>
                  <option>Networks & Infrastructure</option>
                  <option>Data Analytics</option>
                  <option>Digital Marketing</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Lead Source</span>
                <select
                  className={inputClass}
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                >
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social_media">Social Media</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Status</span>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Inquiry["status"] })}
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Priority</span>
                <select
                  className={inputClass}
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as Inquiry["priority"] })}
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>{priority.toUpperCase()}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                <span>Inquiry Details</span>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="What does the client need?"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                <span>Internal Notes</span>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Follow-up details for the team"
                />
              </label>

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold hover:bg-blue-400 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Save Changes" : "Create Inquiry"}
                </button>
                <button type="button" className={buttonClass} onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d121b]">
          <div className="grid gap-3 border-b border-white/10 p-4 md:grid-cols-[1fr_180px_180px]">
            <input
              className={inputClass}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company, or service..."
              aria-label="Search inquiries"
            />
            <select
              className={inputClass}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            <select
              className={inputClass}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by priority"
            >
              <option value="all">All priorities</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>{priority.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-400">Loading inquiries...</div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium">No inquiries found</p>
              <p className="mt-2 text-sm text-slate-400">
                Add an inquiry or adjust your search and filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Client</th>
                    <th className="px-5 py-4">Service</th>
                    <th className="px-5 py-4">Priority</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Received</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredInquiries.map((item) => (
                    <tr key={item.id} className="align-top transition hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <p className="font-medium">{item.full_name}</p>
                        {item.company && <p className="mt-1 text-xs text-slate-400">{item.company}</p>}
                        {item.email && <p className="mt-1 text-xs text-slate-400">{item.email}</p>}
                        {item.phone && <p className="mt-1 text-xs text-slate-400">{item.phone}</p>}
                        {item.message && <p className="mt-2 max-w-xs whitespace-pre-wrap text-xs text-slate-500">{item.message}</p>}
                      </td>
                      <td className="px-5 py-4 text-slate-300">{item.service || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.priority === "urgent" ? "bg-red-400/15 text-red-300" :
                          item.priority === "high" ? "bg-orange-400/15 text-orange-300" :
                          item.priority === "low" ? "bg-slate-400/15 text-slate-300" :
                          "bg-blue-400/15 text-blue-300"
                        }`}>
                          {item.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          className="rounded-lg border border-white/10 bg-[#080b10] px-2 py-2 text-xs text-white"
                          value={item.status}
                          onChange={(e) => void updateStatus(item, e.target.value as Inquiry["status"])}
                          aria-label={`Status for ${item.full_name}`}
                        >
                          {statuses.map((status) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {item.status !== "converted" && (
                            <button
                              type="button"
                              className="rounded-xl border border-emerald-400/25 px-3 py-2 text-sm text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                              onClick={() => void convertInquiry(item)}
                              disabled={convertingId === item.id}
                            >
                              {convertingId === item.id ? "Converting..." : "Convert to Client"}
                            </button>
                          )}
                          <button type="button" className={buttonClass} onClick={() => startEdit(item)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-red-400/20 px-3 py-2 text-sm text-red-300 hover:bg-red-400/10"
                            onClick={() => void deleteInquiry(item)}
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

          <div className="border-t border-white/10 px-5 py-3 text-xs text-slate-500">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </div>
        </section>
      </div>
    </main>
  );
}
