"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type Status = "new" | "reviewing" | "contacted" | "accepted" | "rejected";
type Registration = {
  id: string; full_name: string; email: string; phone: string | null; country: string | null;
  education_level: string | null; track: string; experience: string | null; motivation: string | null;
  status: Status; source: string; admin_notes: string | null; created_at: string; updated_at: string;
};
const options: { value: Status; label: string }[] = [
  { value: "new", label: "New" }, { value: "reviewing", label: "Reviewing" },
  { value: "contacted", label: "Contacted" }, { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];
const badge: Record<Status, string> = {
  new: "border-blue-400/20 bg-blue-400/10 text-blue-200",
  reviewing: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  contacted: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
  accepted: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  rejected: "border-rose-400/20 bg-rose-400/10 text-rose-200",
};
const field = "w-full rounded-xl border border-white/10 bg-[#080d16] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60";

export default function StudentRegistrationsAdminPage() {
  const [items, setItems] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const { data, error: queryError } = await supabase.from("student_registrations").select("*").order("created_at", { ascending: false });
    if (queryError) { setError(queryError.message); setItems([]); }
    else {
      const rows = (data ?? []) as Registration[];
      setItems(rows);
      setNotes(Object.fromEntries(rows.map((row) => [row.id, row.admin_notes ?? ""])));
    }
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((row) => (!term || [row.full_name, row.email, row.phone, row.country, row.track].some((value) => value?.toLowerCase().includes(term))) && (filter === "all" || row.status === filter));
  }, [items, search, filter]);
  const counts = useMemo(() => ({
    total: items.length, fresh: items.filter((row) => row.status === "new").length,
    reviewing: items.filter((row) => row.status === "reviewing").length,
    accepted: items.filter((row) => row.status === "accepted").length,
  }), [items]);

  async function updateStatus(row: Registration, status: Status) {
    setBusyId(row.id); setError(""); setNotice("");
    const { error: updateError } = await supabase.from("student_registrations").update({ status, updated_at: new Date().toISOString() }).eq("id", row.id);
    if (updateError) setError(updateError.message);
    else { setItems((current) => current.map((item) => item.id === row.id ? { ...item, status } : item)); setNotice("Registration status updated."); }
    setBusyId("");
  }
  async function saveNotes(row: Registration) {
    setBusyId(row.id); setError(""); setNotice("");
    const adminNotes = (notes[row.id] ?? "").trim() || null;
    const { error: updateError } = await supabase.from("student_registrations").update({ admin_notes: adminNotes, updated_at: new Date().toISOString() }).eq("id", row.id);
    if (updateError) setError(updateError.message);
    else { setItems((current) => current.map((item) => item.id === row.id ? { ...item, admin_notes: adminNotes } : item)); setNotice("Internal notes saved."); }
    setBusyId("");
  }
  async function remove(row: Registration) {
    if (!window.confirm("Delete the registration from " + row.full_name + "? This cannot be undone.")) return;
    setBusyId(row.id); setError(""); setNotice("");
    const { error: deleteError } = await supabase.from("student_registrations").delete().eq("id", row.id);
    if (deleteError) setError(deleteError.message);
    else { setItems((current) => current.filter((item) => item.id !== row.id)); setNotice("Registration deleted."); }
    setBusyId("");
  }

  return <div className="space-y-6">
    <header className="rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-[#10283a] via-[#0c1421] to-[#090e17] p-5 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">VEXORA / Academy</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Student registrations<span className="text-cyan-300">.</span></h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Review applications submitted through the public form. Changing status or notes does not create an account or enroll a student.</p>
    </header>
    {error && <div role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-200">{error}</div>}
    {notice && <div role="status" className="rounded-xl border border-blue-400/20 bg-blue-400/[0.06] px-4 py-3 text-sm text-blue-200">{notice}</div>}
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {[{label:"Total applications",value:counts.total},{label:"New",value:counts.fresh},{label:"Reviewing",value:counts.reviewing},{label:"Accepted",value:counts.accepted}].map((item) => <div key={item.label} className="rounded-2xl border border-white/[0.08] bg-[#0c111b] p-5"><p className="text-xs text-slate-500">{item.label}</p><p className="mt-3 text-3xl font-semibold text-white">{item.value}</p></div>)}
    </section>
    <section className="rounded-2xl border border-white/[0.08] bg-[#0c111b] p-4 sm:p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
        <label className="block text-sm text-slate-300">Search registrations<input className={field + " mt-2"} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email, phone, country, track..." /></label>
        <label className="block text-sm text-slate-300">Status<select className={field + " mt-2"} value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All statuses</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <button type="button" onClick={() => void load()} disabled={loading} className="self-end rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/40 disabled:opacity-50">{loading ? "Loading..." : "Refresh"}</button>
      </div>
    </section>
    {loading ? <div className="rounded-2xl border border-white/[0.08] bg-[#0c111b] p-8 text-sm text-slate-400">Loading registrations...</div> : filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 bg-[#0c111b] p-10 text-center"><p className="font-medium text-white">No registrations found</p><p className="mt-2 text-sm text-slate-500">New submissions will appear here.</p></div> : <div className="space-y-4">
      {filtered.map((row) => <article key={row.id} className="rounded-2xl border border-white/[0.08] bg-[#0c111b] p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-semibold text-white">{row.full_name}</h2><span className={"rounded-full border px-2.5 py-1 text-xs " + badge[row.status]}>{options.find((option) => option.value === row.status)?.label ?? row.status}</span></div><p className="mt-2 break-all text-sm text-cyan-200">{row.email}</p><p className="mt-1 text-xs text-slate-500">{new Date(row.created_at).toLocaleString()} · {row.source}</p></div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center"><label className="text-xs text-slate-400">Status<select className={field + " mt-1 min-w-36"} value={row.status} disabled={busyId === row.id} onChange={(e) => void updateStatus(row, e.target.value as Status)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><button type="button" onClick={() => void remove(row)} disabled={busyId === row.id} className="mt-4 rounded-xl border border-rose-400/20 px-3 py-2.5 text-xs text-rose-200 transition hover:bg-rose-400/[0.06] disabled:opacity-50 sm:mt-0">Delete</button></div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[{label:"Phone",value:row.phone},{label:"Country",value:row.country},{label:"Education",value:row.education_level},{label:"Learning track",value:row.track}].map((item) => <div key={item.label}><p className="text-xs text-slate-500">{item.label}</p><p className="mt-1 text-sm text-slate-200">{item.value || "—"}</p></div>)}
          <div className="sm:col-span-2"><p className="text-xs text-slate-500">Experience</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-300">{row.experience || "—"}</p></div>
          <div className="sm:col-span-2 xl:col-span-3"><p className="text-xs text-slate-500">Motivation</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-300">{row.motivation || "—"}</p></div>
        </div>
        <div className="mt-5 border-t border-white/[0.07] pt-4"><label className="block text-sm text-slate-300">Internal admin notes<textarea className={field + " mt-2"} rows={2} maxLength={4000} value={notes[row.id] ?? ""} onChange={(e) => setNotes((current) => ({ ...current, [row.id]: e.target.value }))} placeholder="Follow-up notes (visible only to administrators)..." /></label><button type="button" onClick={() => void saveNotes(row)} disabled={busyId === row.id} className="mt-3 rounded-xl border border-cyan-400/20 px-4 py-2.5 text-sm text-cyan-200 transition hover:bg-cyan-400/[0.06] disabled:opacity-50">{busyId === row.id ? "Saving..." : "Save notes"}</button></div>
      </article>)}
    </div>}
  </div>;
}
