"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { name: "Cybersecurity", code: "SEC / 01", icon: "⌘", description: "Security engineering, risk reduction, and digital protection." },
  { name: "Software Development", code: "DEV / 02", icon: "</>", description: "Web platforms, applications, and custom software solutions." },
  { name: "Networks & Infrastructure", code: "NET / 03", icon: "⌁", description: "Reliable networks, infrastructure, and connected systems." },
  { name: "Data Analytics", code: "DATA / 04", icon: "▥", description: "Data platforms, analytics, and actionable business insights." },
  { name: "Digital Marketing", code: "GROWTH / 05", icon: "↗", description: "Digital campaigns and measurable growth initiatives." },
] as const;

type Media = { id: string; name: string; mime_type: string | null; url: string | null };
type Achievement = { id: string; title: string; description: string | null; status: string; category: string; media: Media[] };

export default function AchievementsPage() {
  const [projects, setProjects] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/public/portfolio", { cache: "no-store" });
        const result = (await response.json()) as { projects?: Achievement[]; error?: string };
        if (!response.ok) throw new Error(result.error || "Achievements are temporarily unavailable.");
        if (active) setProjects(Array.isArray(result.projects) ? result.projects : []);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Achievements are temporarily unavailable.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#04070b] px-5 py-10 text-white sm:px-8 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/projects" className="text-sm text-blue-300 transition hover:text-white">← Back to Projects</Link>
          <Link href="/client" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-300/40 hover:text-white">Client Portal</Link>
        </nav>

        <header className="relative mt-8 overflow-hidden rounded-3xl border border-blue-400/20 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,.2),transparent_50%),linear-gradient(135deg,#0b1220,#070a10)] p-7 sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-blue-300/10" />
          <div className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full border border-blue-300/10" />
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-300">VEXORA / Achievements</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">Achievements built with purpose.</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">Explore published VEXORA projects across our five technology and digital departments. Project details and uploaded media are loaded from the project database.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((category, index) => (
              <a key={category.name} href={`#achievement-${index + 1}`} className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:-translate-y-0.5 hover:border-blue-300/30 hover:bg-blue-400/[0.06]">
                <span className="font-mono text-2xl font-bold text-blue-200 transition group-hover:text-white">{category.icon}</span>
                <span className="mt-3 block text-sm font-semibold text-slate-100">{category.name}</span>
                <span className="mt-2 block font-mono text-[10px] tracking-[0.18em] text-slate-500">{category.code}</span>
              </a>
            ))}
          </div>
        </header>

        {loading ? <div className="py-20 text-center text-slate-400" role="status">Loading achievements from VEXORA…</div> :
          error ? <div role="alert" className="mt-8 rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6 text-rose-200">{error}</div> :
          <div className="mt-10 space-y-12">
            {CATEGORIES.map((category, index) => {
              const items = projects.filter((project) => project.category === category.name);
              return (
                <section id={`achievement-${index + 1}`} key={category.name} className="scroll-mt-8">
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <p className="font-mono text-xs tracking-[0.2em] text-blue-300">{category.code}</p>
                      <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{category.name}</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{category.description}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400">{items.length} {items.length === 1 ? "project" : "projects"}</span>
                  </div>
                  {items.length === 0 ?
                    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.015] p-7 sm:p-9">
                      <p className="font-semibold text-slate-200">More achievements coming soon</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">Projects in this category will appear automatically when they are marked for the projects page and have a public status.</p>
                    </div> :
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {items.map((project) => {
                        const imageMedia = project.media.find((media) => media.url && media.mime_type?.startsWith("image/"));
                        const videoMedia = project.media.find((media) => media.url && media.mime_type?.startsWith("video/"));
                        return (
                          <article key={project.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition hover:border-blue-300/30">
                            <div className="relative flex min-h-48 items-center justify-center overflow-hidden bg-[#0b111b]">
                              {imageMedia?.url ?
                                <img src={imageMedia.url} alt={project.title} loading="lazy" className="h-56 w-full object-cover" /> :
                                <div className="flex h-56 w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,.15),transparent_65%)]">
                                  <span className="font-mono text-4xl font-bold text-blue-200" aria-hidden="true">{category.icon}</span>
                                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">VEXORA achievement</span>
                                </div>}
                              <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-xs text-blue-100 backdrop-blur">{category.name}</span>
                            </div>
                            <div className="p-6">
                              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">{project.status.replaceAll("_", " ")}</div>
                              <h3 className="mt-3 text-xl font-bold">{project.title}</h3>
                              <p className="mt-3 text-sm leading-6 text-slate-400">{project.description || "Selected work delivered by VEXORA."}</p>
                              {videoMedia?.url && <video controls preload="metadata" className="mt-5 w-full rounded-xl border border-white/10 bg-black"><source src={videoMedia.url} type={videoMedia.mime_type || undefined} />Your browser does not support video playback.</video>}
                            </div>
                          </article>
                        );
                      })}
                    </div>}
                </section>
              );
            })}
          </div>}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div><h2 className="font-semibold">Have a project in mind?</h2><p className="mt-2 text-sm text-slate-400">Let’s discuss a practical solution for your business.</p></div>
          <Link href="/contact" className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold transition hover:bg-blue-400">Contact VEXORA</Link>
        </div>
      </div>
    </main>
  );
}
