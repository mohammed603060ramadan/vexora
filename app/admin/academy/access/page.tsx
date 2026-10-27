"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type AccessRequest = {
  id: string;
  course_id: string;
  student_id: string;
  email: string;
  purchase_code: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  student_message: string | null;
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  courses: { id: string; title: string; slug: string; price: number | null; currency: string | null; course_type: string | null } | null;
};

const statusStyle: Record<string, string> = {
  pending: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  approved: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  rejected: "border-rose-300/25 bg-rose-300/10 text-rose-100",
  cancelled: "border-slate-300/15 bg-white/5 text-slate-400",
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function CourseAccessAdminPage() {
  const [items, setItems] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/course-access", { cache: "no-store" });
      const payload = await response.json() as { requests?: AccessRequest[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not load requests.");
      const rows = Array.isArray(payload.requests) ? payload.requests : [];
      setItems(rows);
      setNotes(Object.fromEntries(rows.map((row) => [row.id, row.admin_note ?? ""])));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load course access requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) =>
      (filter === "all" || item.status === filter) &&
      (!term || [item.email, item.purchase_code, item.courses?.title, item.student_message].some((value) => value?.toLowerCase().includes(term)))
    );
  }, [items, filter, search]);

  const counts = useMemo(() => ({
    total: items.length,
    pending: items.filter((item) => item.status === "pending").length,
    approved: items.filter((item) => item.status === "approved").length,
    rejected: items.filter((item) => item.status === "rejected").length,
  }), [items]);

  async function updateRequest(item: AccessRequest, status: "approved" | "rejected" | "pending") {
    setBusy(item.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/course-access", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status, adminNote: notes[item.id] ?? "" }),
      });
      const payload = await response.json() as { request?: AccessRequest; error?: string; message?: string };
      if (!response.ok || !payload.request) throw new Error(payload.error || "Could not update request.");
      setItems((current) => current.map((row) => row.id === item.id ? { ...row, ...payload.request } : row));
      setNotice(payload.message || "Request updated.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update request.");
    } finally {
      setBusy("");
    }
  }

  return (
    <main className="min-h-screen bg-[#070b12] px-4 py-7 text-white sm:px-7 lg:px-10">
      <div aria-hidden="true" className="pointer-events-none fixed -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none fixed -left-32 top-1/2 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="relative mx-auto max-w-7xl space-y-7">
        <Link href="/admin/academy" className="inline-flex items-center gap-2 text-sm text-cyan-200 transition hover:text-white">← Back to Academy management</Link>
        <header className="overflow-hidden rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-[#123047] via-[#0c1726] to-[#090e17] p-6 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">VEXORA / Secure Learning</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Course access requests<span className="text-cyan-300">.</span></h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Review purchase inquiries, check the reference code, and explicitly grant course access. Approving a request creates the Academy enrollment.</p>
            </div>
            <button type="button" onClick={() => void load()} disabled={loading} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:border-cyan-200/40 disabled:opacity-50">{loading ? "Refreshing…" : "↻ Refresh requests"}</button>
          </div>
        </header>
        {error && <div role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-4 text-sm text-rose-100">{error}</div>}
        {notice && <div role="status" className="rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4 text-sm text-emerald-100">{notice}</div>}
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[{ label: "All requests", value: counts.total, symbol: "◈" }, { label: "Awaiting review", value: counts.pending, symbol: "⌛" }, { label: "Access approved", value: counts.approved, symbol: "✦" }, { label: "Not approved", value: counts.rejected, symbol: "◇" }].map((item) => (
            <article key={item.label} className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/25">
              <span aria-hidden="true" className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-cyan-400/[0.06] blur-2xl transition group-hover:bg-cyan-400/15" />
              <div className="relative flex items-center justify-between"><span className="text-sm text-slate-400">{item.label}</span><span className="text-2xl text-cyan-200">{item.symbol}</span></div>
              <p className="relative mt-4 text-3xl font-semibold tabular-nums">{item.value}</p>
            </article>
          ))}
        </section>
        <section className="rounded-2xl border border-white/[0.08] bg-[#0b111b]/90 p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Search requests<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Email, course or reference code…" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080d16] px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-cyan-300/50" /></label>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Request status<select value={filter} onChange={(event) => setFilter(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080d16] px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-cyan-300/50"><option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="cancelled">Cancelled</option></select></label>
          </div>
        </section>
        {loading ? <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-slate-400"><span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-cyan-200/20 border-t-cyan-200" /><p className="mt-4">Loading access requests…</p></div> : filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center"><span className="text-4xl text-cyan-200">✧</span><h2 className="mt-4 text-xl font-semibold">No matching requests</h2><p className="mt-2 text-sm text-slate-400">Requests submitted by learners will appear here automatically.</p></div> : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filtered.map((item) => (
              <article key={item.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.045] to-white/[0.012] p-5 transition hover:border-cyan-300/25 sm:p-6">
                <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/[0.07] blur-3xl" />
                <div className="relative flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">{item.courses?.course_type || "Course"} · {item.courses?.currency || "USD"} {item.courses?.price ?? "—"}</p><h2 className="mt-2 break-words text-xl font-semibold">{item.courses?.title || "Course unavailable"}</h2><p className="mt-2 break-all text-sm text-slate-400">{item.email}</p></div>
                  <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${statusStyle[item.status] || statusStyle.pending}`}>{item.status}</span>
                </div>
                <div className="relative mt-5 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.045] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/70">Purchase / access reference</p><div className="mt-2 flex flex-wrap items-center justify-between gap-2"><code className="text-lg font-bold tracking-[0.14em] text-white">{item.purchase_code}</code><button type="button" onClick={() => void navigator.clipboard?.writeText(item.purchase_code)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-200/30 hover:text-white">Copy code</button></div><p className="mt-2 text-xs text-slate-500">Created {formatDate(item.created_at)}{item.reviewed_at ? ` · Reviewed ${formatDate(item.reviewed_at)}` : ""}</p></div>
                {item.student_message && <p className="relative mt-4 text-sm leading-6 text-slate-300"><span className="font-semibold text-white">Learner message: </span>{item.student_message}</p>}
                <label className="relative mt-4 block text-xs font-semibold uppercase tracking-wider text-slate-400">Administrator note<textarea rows={2} value={notes[item.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [item.id]: event.target.value }))} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#080d16] px-3 py-2.5 text-sm normal-case tracking-normal text-white outline-none focus:border-cyan-300/50" placeholder="Optional reason, payment confirmation or follow-up…" /></label>
                <div className="relative mt-4 flex flex-wrap gap-2">
                  <button type="button" disabled={busy === item.id || item.status === "approved"} onClick={() => void updateRequest(item, "approved")} className="rounded-xl bg-emerald-300 px-4 py-2.5 text-sm font-bold text-[#052218] transition hover:bg-emerald-200 disabled:opacity-40">✓ Approve & grant access</button>
                  <button type="button" disabled={busy === item.id || item.status === "rejected"} onClick={() => void updateRequest(item, "rejected")} className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/10 disabled:opacity-40">Reject</button>
                  {item.status !== "pending" && <button type="button" disabled={busy === item.id} onClick={() => void updateRequest(item, "pending")} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:border-cyan-200/30 disabled:opacity-40">Return to pending</button>}
                </div>
              </article>
            ))}
          </div>
        )}
        <p className="text-xs leading-6 text-slate-500">A reference code is not proof of payment by itself. Verify the payment separately before granting access. Approval is the action that activates course enrollment.</p>
      </div>
    </main>
  );
}
