"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type EventStatus = "Draft" | "Published" | "Completed" | "Cancelled";
type EventType = "Conference" | "Webinar" | "Workshop" | "Meeting" | "Other";

type EventItem = {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  registrationUrl: string;
};

const initialEvents: EventItem[] = [];

const statusClasses: Record<EventStatus, string> = {
  Draft: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Published: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Completed: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  Cancelled: "border-red-400/20 bg-red-400/10 text-red-300",
};

function formatDate(date: string) {
  if (!date) return "Date not set";

  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function eventTiming(event: EventItem) {
  if (event.status === "Cancelled") return "Cancelled";
  if (!event.date) return "Unscheduled";

  const today = new Date();
  const eventDate = new Date(`${event.date}T23:59:59`);
  if (eventDate < today) return "Past event";
  if (event.date === today.toISOString().slice(0, 10)) return "Today";
  return "Upcoming";
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [view, setView] = useState<"list" | "cards">("list");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<EventType>("Webinar");
  const [status, setStatus] = useState<EventStatus>("Draft");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [location, setLocation] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [notice, setNotice] = useState("");

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || event.status === statusFilter;

      const matchesType = typeFilter === "All" || event.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    }).sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
  }, [events, search, statusFilter, typeFilter]);

  const today = new Date().toISOString().slice(0, 10);

  const upcomingCount = events.filter(
    (event) =>
      event.status === "Published" &&
      Boolean(event.date) &&
      event.date >= today
  ).length;

  const completedCount = events.filter(
    (event) => event.status === "Completed" || (
      Boolean(event.date) &&
      event.date < today &&
      event.status === "Published"
    )
  ).length;

  const draftCount = events.filter((event) => event.status === "Draft").length;
  const cancelledCount = events.filter((event) => event.status === "Cancelled").length;

  function openCreate() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setType("Webinar");
    setStatus("Draft");
    setDate("");
    setStartTime("10:00");
    setEndTime("11:00");
    setLocation("");
    setRegistrationUrl("");
    setNotice("");
    setEditorOpen(true);
  }

  function openEdit(event: EventItem) {
    setEditingId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setType(event.type);
    setStatus(event.status);
    setDate(event.date);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setLocation(event.location);
    setRegistrationUrl(event.registrationUrl);
    setNotice("");
    setEditorOpen(true);
  }

  function saveEvent(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    if (!title.trim()) {
      setNotice("Enter an event title.");
      return;
    }

    if (startTime && endTime && endTime <= startTime) {
      setNotice("The end time must be later than the start time.");
      return;
    }

    if (registrationUrl) {
      try {
        const url = new URL(registrationUrl);
        if (!["http:", "https:"].includes(url.protocol)) {
          setNotice("Registration links must use HTTP or HTTPS.");
          return;
        }
      } catch {
        setNotice("Enter a valid registration URL including https://.");
        return;
      }
    }

    const nextEvent: EventItem = {
      id: editingId || `event-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      type,
      status,
      date,
      startTime,
      endTime,
      location: location.trim(),
      registrationUrl: registrationUrl.trim(),
    };

    setEvents((current) =>
      editingId
        ? current.map((item) => item.id === editingId ? nextEvent : item)
        : [...current, nextEvent]
    );

    setEditorOpen(false);
    setNotice("");
  }

  function deleteEvent(event: EventItem) {
    if (!window.confirm(`Delete "${event.title}" from this preview?`)) return;
    setEvents((current) => current.filter((item) => item.id !== event.id));
  }

  return (
    <main className="min-h-screen bg-[#080b10] px-4 py-6 text-white sm:px-7 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-blue-400 transition hover:text-blue-300">
          ← Back to dashboard
        </Link>

        <header className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
              Planning & engagement
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Events Management
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Organize VEXORA events, manage schedules, and keep every engagement on track.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold transition hover:bg-blue-400"
          >
            <span className="text-lg">+</span> Create event
          </button>
        </header>

        <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm leading-6 text-amber-100/90">
          Preview mode: events are stored in page state only. They will not persist after a reload or appear on the public website until database integration is completed.
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total events", value: events.length, icon: "▦", tint: "bg-blue-500/10" },
            { label: "Upcoming & published", value: upcomingCount, icon: "◷", tint: "bg-emerald-500/10" },
            { label: "Completed", value: completedCount, icon: "✓", tint: "bg-violet-500/10" },
            { label: "Drafts", value: draftCount, icon: "✎", tint: "bg-amber-500/10" },
          ].map((item) => (
            <div key={item.label} className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d121b] p-5">
              <div className={`absolute -right-6 -top-8 h-24 w-24 rounded-full blur-2xl ${item.tint}`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold tabular-nums">{item.value}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-lg text-blue-300">
                  {item.icon}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d121b]">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-semibold">Event calendar & schedule</h2>
              <p className="mt-1 text-sm text-slate-400">
                Search events and filter the schedule by status or type.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:flex">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events..."
                aria-label="Search events"
                className="min-w-0 rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-blue-400/50 xl:w-60"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by event status"
                className="rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-sm outline-none focus:border-blue-400/50"
              >
                <option>All</option>
                <option>Draft</option>
                <option>Published</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                aria-label="Filter by event type"
                className="rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-sm outline-none focus:border-blue-400/50"
              >
                <option>All</option>
                <option>Conference</option>
                <option>Webinar</option>
                <option>Workshop</option>
                <option>Meeting</option>
                <option>Other</option>
              </select>
              <div className="flex rounded-xl border border-white/10 bg-[#080b10] p-1">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                  className={`rounded-lg px-3 py-2 text-xs ${view === "list" ? "bg-blue-500 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  List
                </button>
                <button
                  type="button"
                  onClick={() => setView("cards")}
                  aria-pressed={view === "cards"}
                  className={`rounded-lg px-3 py-2 text-xs ${view === "cards" ? "bg-blue-500 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-2xl text-blue-300">▦</div>
              <p className="mt-4 font-medium">No events found</p>
              <p className="mt-2 text-sm text-slate-400">
                Create your first event or adjust your search filters.
              </p>
              <button type="button" onClick={openCreate} className="mt-5 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold hover:bg-blue-400">
                Create first event
              </button>
            </div>
          ) : view === "list" ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Event</th>
                    <th className="px-5 py-4">Date & time</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="transition hover:bg-white/[0.02]">
                      <td className="max-w-xs px-5 py-4">
                        <p className="font-medium">{event.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{event.description || "No description added"}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="text-slate-200">{formatDate(event.date)}</p>
                        <p className="mt-1 text-xs text-slate-500">{event.startTime || "—"}{event.endTime ? ` – ${event.endTime}` : ""}</p>
                        <p className="mt-1 text-xs text-blue-300">{eventTiming(event)}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{event.type}</td>
                      <td className="px-5 py-4">
                        <span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs ${statusClasses[event.status]}`}>{event.status}</span>
                      </td>
                      <td className="max-w-[180px] px-5 py-4 text-slate-400">
                        <span className="line-clamp-2">{event.location || "Not specified"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => openEdit(event)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-blue-400/40 hover:text-white">Edit</button>
                          <button type="button" onClick={() => deleteEvent(event)} className="rounded-lg border border-red-400/15 px-3 py-2 text-xs text-red-300 hover:bg-red-400/10">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event) => (
                <article key={event.id} className="rounded-2xl border border-white/[0.08] bg-[#080b10] p-5 transition hover:border-blue-400/25">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-lg border border-blue-400/15 bg-blue-400/[0.07] px-3 py-2 text-xs text-blue-300">{event.type}</span>
                    <span className={`rounded-full border px-2.5 py-1 text-xs ${statusClasses[event.status]}`}>{event.status}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{event.title}</h3>
                  <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-6 text-slate-400">{event.description || "No description added."}</p>
                  <div className="mt-5 space-y-3 border-t border-white/[0.07] pt-4 text-sm">
                    <p className="text-slate-300">◷ <span className="ml-2">{formatDate(event.date)}</span></p>
                    <p className="text-slate-400">⌚ <span className="ml-2">{event.startTime || "—"}{event.endTime ? ` – ${event.endTime}` : ""}</span></p>
                    <p className="break-words text-slate-400">⌖ <span className="ml-2">{event.location || "Location not specified"}</span></p>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <button type="button" onClick={() => openEdit(event)} className="flex-1 rounded-xl border border-white/10 px-3 py-2.5 text-sm hover:border-blue-400/40">Edit event</button>
                    <button type="button" onClick={() => deleteEvent(event)} className="rounded-xl border border-red-400/15 px-3 py-2.5 text-sm text-red-300 hover:bg-red-400/10">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="border-t border-white/[0.07] px-5 py-3 text-xs text-slate-500">
            Showing {filteredEvents.length} of {events.length} events
            <span className="ml-3">· {cancelledCount} cancelled</span>
          </div>
        </section>

        {editorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
            <form onSubmit={saveEvent} className="my-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d121b] p-5 shadow-2xl sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Event workspace</p>
                  <h2 className="mt-2 text-xl font-semibold">{editingId ? "Edit event" : "Create event"}</h2>
                </div>
                <button type="button" onClick={() => setEditorOpen(false)} aria-label="Close editor" className="rounded-lg border border-white/10 px-3 py-1.5 text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="event-title" className="mb-2 block text-sm text-slate-300">Event title *</label>
                  <input id="event-title" required maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. VEXORA Technology Webinar" className="w-full rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm outline-none focus:border-blue-400/50" />
                </div>

                <div>
                  <label htmlFor="event-description" className="mb-2 block text-sm text-slate-300">Description</label>
                  <textarea id="event-description" rows={3} maxLength={1500} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the purpose and details of this event..." className="w-full resize-y rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm leading-6 outline-none focus:border-blue-400/50" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="event-type" className="mb-2 block text-sm text-slate-300">Event type</label>
                    <select id="event-type" value={type} onChange={(event) => setType(event.target.value as EventType)} className="w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-sm outline-none focus:border-blue-400/50">
                      <option>Conference</option><option>Webinar</option><option>Workshop</option><option>Meeting</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="event-status" className="mb-2 block text-sm text-slate-300">Status</label>
                    <select id="event-status" value={status} onChange={(event) => setStatus(event.target.value as EventStatus)} className="w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-sm outline-none focus:border-blue-400/50">
                      <option>Draft</option><option>Published</option><option>Completed</option><option>Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="event-date" className="mb-2 block text-sm text-slate-300">Event date</label>
                  <input id="event-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-400/50" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="event-start" className="mb-2 block text-sm text-slate-300">Start time</label>
                    <input id="event-start" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm outline-none focus:border-blue-400/50" />
                  </div>
                  <div>
                    <label htmlFor="event-end" className="mb-2 block text-sm text-slate-300">End time</label>
                    <input id="event-end" type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm outline-none focus:border-blue-400/50" />
                  </div>
                </div>

                <div>
                  <label htmlFor="event-location" className="mb-2 block text-sm text-slate-300">Location or meeting link</label>
                  <input id="event-location" maxLength={300} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Office, online, or venue address" className="w-full rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm outline-none focus:border-blue-400/50" />
                </div>

                <div>
                  <label htmlFor="event-registration" className="mb-2 block text-sm text-slate-300">Registration URL</label>
                  <input id="event-registration" type="url" value={registrationUrl} onChange={(event) => setRegistrationUrl(event.target.value)} placeholder="https://example.com/register" className="w-full rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm outline-none focus:border-blue-400/50" />
                </div>

                {notice && <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/[0.06] p-3 text-sm text-red-300">{notice}</p>}

                <p className="text-xs leading-5 text-slate-500">
                  Changes are currently local to this page and will reset after a reload. Database persistence and public publishing are not enabled yet.
                </p>
              </div>

              <div className="mt-7 flex justify-end gap-3">
                <button type="button" onClick={() => setEditorOpen(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:text-white">Cancel</button>
                <button type="submit" className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-400">Save event</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
