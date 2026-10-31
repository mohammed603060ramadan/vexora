"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type RequestStatus = "pending" | "reviewing" | "approved" | "rejected" | "cancelled" | "completed";
type RequestRow = {
  id: string;
  client_id: string;
  project_id: string;
  user_id: string;
  status: RequestStatus;
  message: string | null;
  created_at: string;
  updated_at: string;
  client: { id: string; name: string; email: string | null; company: string | null } | null;
  project: { id: string; title: string; status: string } | null;
};

const statusOptions: { value: RequestStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminProjectRequestsPage() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState<"all" | RequestStatus>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/project-requests", { cache: "no-store" });
      const payload = await response.json() as { requests?: RequestRow[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not load project requests.");
      setRows(Array.isArray(payload.requests) ? payload.requests : []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load project requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function updateStatus(row: RequestRow, status: RequestStatus) {
    if (row.status === status) return;
    setBusyId(row.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/project-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: row.id, status }),
      });
      const payload = await response.json() as { request?: RequestRow; error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not update request.");
      setRows((current) => current.map((item) => item.id === row.id ? { ...item, status: payload.request?.status ?? status, updated_at: payload.request?.updated_at ?? new Date().toISOString() } : item));
      setNotice("Project request status updated.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update request.");
    } finally {
      setBusyId(null);
    }
  }

  const filtered = useMemo(() => filter === "all" ? rows : rows.filter((row) => row.status === filter), [rows, filter]);
  const pendingCount = rows.filter((row) => row.status === "pending").length;
  const reviewingCount = rows.filter((row) => row.status === "reviewing").length;

  return (
    <main className="min-h-screen space-y-7 bg-[#080d16] p-4 text-slate-100 sm:p-7">
      <div className="mx-auto max-w-[1450px] space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-400">VEXORA / Operations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Project Requests</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Review incoming client project requests and keep their status synchronized with the client and student workspaces.</p>
          </div>
          <button type="button" onClick={() => void load()} disabled={loading} className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-400 disabled:opacity-50">{loading ? "Refreshing..." : "Refresh requests ↻"}</button>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          {[{ label: "Total requests", value: rows.length }, { label: "Awaiting review", value: pendingCount }, { label: "Under review", value: reviewingCount }].map((metric) => (
            <article key={metric.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"><p className="text-sm text-slate-400">{metric.label}</p><p className="mt-3 text-3xl font-semibold tabular-nums text-white">{metric.value}</p></article>
          ))}
        </section>

        {error && <div role="alert" className="rounded-xl border border-rose-400/25 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-200">{error}</div>}
        {notice && <div role="status" className="rounded-xl border border-emerald-400/25 bg-emerald-400/[0.07] px-4 py-3 text-sm text-emerald-200">{notice}</div>}

        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c121e]">
          <div className="flex flex-col justify-between gap-3 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center sm:px-5">
            <div><h2 className="font-semibold text-white">Incoming requests</h2><p className="mt-1 text-xs text-slate-500">{filtered.length} records shown</p></div>
            <select value={filter} onChange={(event) => setFilter(event.target.value as "all" | RequestStatus)} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-blue-400">
              <option value="all">All statuses</option>
              {statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>

          {loading ? <div className="p-10 text-center text-sm text-slate-400">Loading project requests...</div> :
            filtered.length === 0 ? <div className="p-10 text-center"><p className="font-medium text-slate-200">No project requests found</p><p className="mt-2 text-sm text-slate-500">New requests submitted by clients will appear here.</p></div> :
            <div className="divide-y divide-white/[0.06]">
              {filtered.map((row) => (
                <article key={row.id} className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_230px] lg:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-white">{row.project?.title || "Project unavailable"}</h3><span className="rounded-full border border-blue-400/20 bg-blue-400/[0.07] px-2.5 py-1 text-[11px] font-medium text-blue-200">{row.status.replaceAll("_", " ")}</span></div>
                    <p className="mt-2 text-sm text-slate-300">{row.client?.name || "Client unavailable"}{row.client?.company ? " · " + row.client.company : ""}</p>
                    <p className="mt-1 text-xs text-slate-500">{row.client?.email || "No email"} · Submitted {dateLabel(row.created_at)}</p>
                    {row.message && <p className="mt-3 whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-black/10 p-3 text-sm leading-6 text-slate-300">{row.message}</p>}
                    <p className="mt-2 text-[11px] text-slate-600">Request ID: {row.id}</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={"status-" + row.id} className="block text-xs font-medium text-slate-400">Update request status</label>
                    <select id={"status-" + row.id} value={row.status} disabled={busyId === row.id} onChange={(event) => void updateStatus(row, event.target.value as RequestStatus)} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white outline-none focus:border-blue-400 disabled:opacity-50">
                      {statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                    <p className="text-[11px] text-slate-600">Last updated {dateLabel(row.updated_at)}</p>
                  </div>
                </article>
              ))}
            </div>}
        </section>
      </div>
    </main>
  );
}
