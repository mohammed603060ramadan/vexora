"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/supabase/browser";

type EventStatus = "draft" | "published" | "completed" | "cancelled";
type EventType = "conference" | "webinar" | "workshop" | "meeting" | "other";
type EventRecord = {
  id: string;
  title: string;
  description: string | null;
  event_type: EventType;
  status: EventStatus;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  registration_url: string | null;
  created_at: string;
};
type EventForm = {
  title: string;
  description: string;
  event_type: EventType;
  status: EventStatus;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  registration_url: string;
};
const emptyForm: EventForm = {
  title: "", description: "", event_type: "webinar", status: "draft",
  event_date: "", start_time: "", end_time: "", location: "", registration_url: "",
};
const inputClass = "w-full rounded-xl border border-white/10 bg-[#0b1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15";
const statusStyle: Record<EventStatus, string> = {
  draft: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  published: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  completed: "border-blue-400/20 bg-blue-400/10 text-blue-200",
  cancelled: "border-rose-400/20 bg-rose-400/10 text-rose-200",
};
const eventTypes: { value: EventType; label: string }[] = [
  { value: "conference", label: "Conference" }, { value: "webinar", label: "Webinar" },
  { value: "workshop", label: "Workshop" }, { value: "meeting", label: "Meeting" },
  { value: "other", label: "Other" },
];
function formatDate(value: string | null) {
  if (!value) return "Date not set";
  const date = new Date(value + "T12:00:00");
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(date);
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EventStatus>("all");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: queryError } = await supabase
      .from("events")
      .select("id,title,description,event_type,status,event_date,start_time,end_time,location,registration_url,created_at")
      .order("event_date", { ascending: true, nullsFirst: false });
    if (queryError) {
      setError(queryError.message.includes("does not exist")
        ? "The events database migration has not been applied yet."
        : queryError.message);
      setEvents([]);
    } else {
      setEvents((data ?? []) as EventRecord[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void loadEvents(); }, [loadEvents]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events.filter((event) =>
      (statusFilter === "all" || event.status === statusFilter) &&
      (!query || [event.title, event.description, event.location, event.event_type]
        .some((value) => value?.toLowerCase().includes(query)))
    );
  }, [events, search, statusFilter]);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setEditorOpen(true);
    setNotice("");
    setError("");
  }
  function openEdit(event: EventRecord) {
    setForm({
      title: event.title, description: event.description ?? "",
      event_type: event.event_type, status: event.status,
      event_date: event.event_date ?? "", start_time: event.start_time?.slice(0, 5) ?? "",
      end_time: event.end_time?.slice(0, 5) ?? "", location: event.location ?? "",
      registration_url: event.registration_url ?? "",
    });
    setEditingId(event.id);
    setEditorOpen(true);
    setNotice("");
    setError("");
  }
  function change<K extends keyof EventForm>(key: K, value: EventForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    if (form.start_time && form.end_time && form.end_time <= form.start_time) {
      setError("The end time must be later than the start time.");
      setSaving(false);
      return;
    }
    if (form.registration_url) {
      try {
        const url = new URL(form.registration_url);
        if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
      } catch {
        setError("Enter a valid registration URL starting with https:// or http://.");
        setSaving(false);
        return;
      }
    }
    const payload = {
      title: form.title.trim(), description: form.description.trim() || null,
      event_type: form.event_type, status: form.status,
      event_date: form.event_date || null, start_time: form.start_time || null,
      end_time: form.end_time || null, location: form.location.trim() || null,
      registration_url: form.registration_url.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const result = editingId
      ? await supabase.from("events").update(payload).eq("id", editingId).select("id").single()
      : await supabase.from("events").insert(payload).select("id").single();
    if (result.error) {
      setError(result.error.message.includes("row-level security")
        ? "Your account does not have permission to manage events."
        : result.error.message);
      setSaving(false);
      return;
    }
    setNotice(editingId ? "Event updated successfully." : "Event created successfully.");
    setEditorOpen(false);
    setSaving(false);
    await loadEvents();
  }

  async function deleteEvent(event: EventRecord) {
    if (!window.confirm(`Delete "${event.title}"? This action cannot be undone.`)) return;
    setDeletingId(event.id);
    setError("");
    const { error: deleteError } = await supabase.from("events").delete().eq("id", event.id);
    if (deleteError) setError(deleteError.message);
    else {
      setNotice("Event deleted.");
      await loadEvents();
    }
    setDeletingId(null);
  }

  const counts = {
    total: events.length,
    published: events.filter((item) => item.status === "published").length,
    drafts: events.filter((item) => item.status === "draft").length,
  };

  return (
    <main className="min-h-screen bg-[#070b12] px-4 py-7 text-white sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-blue-300 transition hover:text-blue-200">← Back to dashboard</Link>
        <header className="mt-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-300">Content operations / Events</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Events Management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Create, publish and manage VEXORA events. Published events are displayed on the public website.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">＋ Create event</button>
        </header>

        {(notice || error) && <div role="status" className={`mt-6 rounded-xl border px-4 py-3 text-sm ${error ? "border-rose-400/25 bg-rose-400/10 text-rose-200" : "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"}`}>{error || notice}</div>}

        <section className="mt-7 grid gap-3 sm:grid-cols-3">
          {[["Total events", counts.total, "All saved events"], ["Published", counts.published, "Visible on the website"], ["Drafts", counts.drafts, "Not public yet"]].map(([label, value, helper]) => (
            <div key={String(label)} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-3xl font-semibold">{value}</p><p className="mt-1 text-xs text-slate-500">{helper}</p>
            </div>
          ))}
        </section>

        {editorOpen && <section className="mt-6 rounded-2xl border border-blue-400/20 bg-[#0b1220] p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">{editingId ? "Edit event" : "Create event"}</h2><p className="mt-1 text-sm text-slate-400">Use English content for a consistent VEXORA experience.</p></div><button onClick={() => setEditorOpen(false)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5">Close</button></div>
          <form onSubmit={saveEvent} className="grid gap-5 md:grid-cols-2">
            <label className="text-sm text-slate-300 md:col-span-2">Event title *<input required maxLength={220} className={`${inputClass} mt-2`} value={form.title} onChange={(e) => change("title", e.target.value)} placeholder="e.g. VEXORA Cybersecurity Summit" /></label>
            <label className="text-sm text-slate-300">Event type<select className={`${inputClass} mt-2`} value={form.event_type} onChange={(e) => change("event_type", e.target.value as EventType)}>{eventTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label className="text-sm text-slate-300">Publication status<select className={`${inputClass} mt-2`} value={form.status} onChange={(e) => change("status", e.target.value as EventStatus)}><option value="draft">Draft</option><option value="published">Published</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></label>
            <label className="text-sm text-slate-300">Date<input type="date" className={`${inputClass} mt-2`} value={form.event_date} onChange={(e) => change("event_date", e.target.value)} /></label>
            <div className="grid grid-cols-2 gap-3"><label className="text-sm text-slate-300">Start time<input type="time" className={`${inputClass} mt-2`} value={form.start_time} onChange={(e) => change("start_time", e.target.value)} /></label><label className="text-sm text-slate-300">End time<input type="time" className={`${inputClass} mt-2`} value={form.end_time} onChange={(e) => change("end_time", e.target.value)} /></label></div>
            <label className="text-sm text-slate-300">Location<input maxLength={300} className={`${inputClass} mt-2`} value={form.location} onChange={(e) => change("location", e.target.value)} placeholder="Online / venue" /></label>
            <label className="text-sm text-slate-300">Registration URL<input type="url" className={`${inputClass} mt-2`} value={form.registration_url} onChange={(e) => change("registration_url", e.target.value)} placeholder="https://..." /></label>
            <label className="text-sm text-slate-300 md:col-span-2">Description<textarea rows={4} maxLength={5000} className={`${inputClass} mt-2 resize-y`} value={form.description} onChange={(e) => change("description", e.target.value)} placeholder="Describe the event, audience and key topics." /></label>
            <div className="flex flex-wrap gap-3 md:col-span-2"><button disabled={saving} className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold disabled:opacity-50">{saving ? "Saving..." : editingId ? "Save changes" : "Create event"}</button><button type="button" onClick={() => setEditorOpen(false)} className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5">Cancel</button></div>
          </form>
        </section>}

        <section className="mt-7 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between"><h2 className="font-semibold">Event directory <span className="ml-2 text-sm font-normal text-slate-500">{filtered.length} records</span></h2><div className="flex flex-col gap-3 sm:flex-row"><input aria-label="Search events" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className={`${inputClass} sm:w-64`} /><select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className={`${inputClass} sm:w-44`}><option value="all">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div></div>
          {loading ? <div className="p-12 text-center text-sm text-slate-400">Loading events...</div> : filtered.length === 0 ? <div className="p-12 text-center"><p className="font-medium">No events found</p><p className="mt-2 text-sm text-slate-500">Create an event to start publishing updates to the website.</p></div> : <div className="divide-y divide-white/[0.06]">{filtered.map((event) => <article key={event.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{event.title}</h3><span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${statusStyle[event.status]}`}>{event.status}</span><span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-slate-400">{event.event_type}</span></div><p className="mt-2 text-sm text-slate-400">{event.description || "No description provided."}</p><p className="mt-2 text-xs text-slate-500">{formatDate(event.event_date)}{event.start_time ? ` · ${event.start_time.slice(0, 5)}` : ""}{event.location ? ` · ${event.location}` : ""}</p></div><div className="flex shrink-0 gap-2"><button onClick={() => openEdit(event)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5">Edit</button><button disabled={deletingId === event.id} onClick={() => void deleteEvent(event)} className="rounded-lg border border-rose-400/20 px-3 py-2 text-sm text-rose-300 hover:bg-rose-400/10 disabled:opacity-50">{deletingId === event.id ? "Deleting..." : "Delete"}</button></div></article>)}</div>}
        </section>
      </div>
    </main>
  );
}
