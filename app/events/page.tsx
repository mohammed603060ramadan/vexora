"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type PublicEvent = {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  registration_url: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "Date to be announced";
  const parsed = new Date(value + "T12:00:00");
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    weekday: "short", day: "2-digit", month: "long", year: "numeric",
  }).format(parsed);
}

function EventGlyph({ type }: { type: string }) {
  const paths: Record<string, React.ReactNode> = {
    conference: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 11h8M8 15h5" /></>,
    webinar: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="m10 8 5 2.5-5 2.5zM8 21h8M12 17v4" /></>,
    workshop: <><path d="m14 6 4-4 4 4-4 4zM2 22l8-8M7 5l12 12M3 9l6-6" /></>,
    meeting: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M15 15a5 5 0 0 1 6 5" /></>,
    other: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">{paths[type] ?? paths.other}</svg>;
}

export default function EventsPage() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error: queryError } = await supabase
        .from("events")
        .select("id,title,description,event_type,event_date,start_time,end_time,location,registration_url")
        .eq("status", "published")
        .order("event_date", { ascending: true, nullsFirst: false });
      if (!active) return;
      if (queryError) {
        setError(queryError.message.includes("does not exist")
          ? "The events catalogue is being prepared. Please check back soon."
          : "Events are temporarily unavailable. Please try again later.");
      } else {
        setEvents((data ?? []) as PublicEvent[]);
      }
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#05080e] text-white">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(22,135,255,0.15),transparent_35%),radial-gradient(ellipse_at_85%_60%,rgba(69,165,255,0.08),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link href="/" className="text-sm font-semibold tracking-[0.22em] text-white">VEXORA <span className="text-blue-400">/ EVENTS</span></Link>
          <nav className="flex items-center gap-4 text-sm text-slate-400"><Link href="/" className="transition hover:text-white">Home</Link><Link href="/login" className="rounded-lg border border-white/10 px-3 py-2 text-white transition hover:border-blue-400/50">Sign in</Link></nav>
        </header>
        <section className="relative py-16 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">Connect · Learn · Build</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Ideas move technology <span className="text-blue-300">forward.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">Explore VEXORA conferences, workshops and online sessions designed to share practical knowledge and bring technology communities together.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#upcoming-events" className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold transition hover:bg-blue-400">Explore events <span aria-hidden="true">↘</span></a><Link href="/contact" className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/5">Contact the team</Link></div>
        </section>
        <section id="upcoming-events" className="scroll-mt-8 pb-20">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">The VEXORA calendar</p><h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Published events</h2></div><p className="text-sm text-slate-500">{events.length} {events.length === 1 ? "event" : "events"} available</p></div>
          {loading ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[1,2,3].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />)}</div>
          : error ? <div role="status" className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm text-slate-400">{error}</div>
          : events.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-blue-300"><EventGlyph type="other" /></div><h3 className="mt-5 text-lg font-semibold">New events are on the way</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">There are no published events right now. Check back soon for upcoming VEXORA sessions and workshops.</p></div>
          : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{events.map((event) => <article key={event.id} className="group flex min-h-72 flex-col rounded-2xl border border-white/[0.09] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-blue-400/[0.035]"><div className="flex items-start justify-between gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 text-blue-300"><EventGlyph type={event.event_type} /></div><span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{event.event_type}</span></div><p className="mt-6 text-xs font-semibold uppercase tracking-wide text-blue-300">{formatDate(event.event_date)}</p><h3 className="mt-2 text-xl font-semibold leading-snug">{event.title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{event.description || "More details will be announced soon."}</p><div className="mt-5 space-y-2 border-t border-white/[0.07] pt-4 text-xs text-slate-500">{event.location && <p><span className="mr-2 text-blue-300">⌖</span>{event.location}</p>}{event.start_time && <p><span className="mr-2 text-blue-300">◷</span>{event.start_time.slice(0,5)}{event.end_time ? ` – ${event.end_time.slice(0,5)}` : ""}</p>}</div>{event.registration_url && <a href={event.registration_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-white">Register for event <span aria-hidden="true">↗</span></a>}</article>)}</div>}
        </section>
        <footer className="border-t border-white/10 py-6 text-xs text-slate-600">© {new Date().getFullYear()} VEXORA. All rights reserved.</footer>
      </div>
    </main>
  );
}
