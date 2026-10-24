"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const categories = ["All", "Cybersecurity", "Software Development", "Networks & Infrastructure", "Data Analytics", "Digital Marketing"] as const;
type Category = typeof categories[number];
type Media = { id: string; name: string; mime_type: string; url: string | null };
type Project = { id: string; title: string; description: string | null; status: string; category: string; media: Media[] };

const categoryIcons: Record<string, string> = {
  Cybersecurity: "⌘",
  "Software Development": "</>",
  "Networks & Infrastructure": "⌁",
  "Data Analytics": "▥",
  "Digital Marketing": "↗",
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [category, setCategory] = useState<Category>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/public/portfolio", { cache: "no-store" });
        const result = await response.json() as { projects?: Project[]; error?: string };
        if (!response.ok) throw new Error(result.error || "Could not load portfolio.");
        if (active) setProjects(Array.isArray(result.projects) ? result.projects : []);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Could not load portfolio.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => projects.filter((project) => category === "All" || project.category === category), [projects, category]);

  return (
    <main className="min-h-screen bg-[#070a10] px-5 py-12 text-white sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm text-blue-300 transition hover:text-white">← Back to VEXORA</Link>
        <header className="mt-8 rounded-3xl border border-blue-400/15 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,.17),transparent_55%),#0b111b] p-7 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-300">VEXORA / Selected work</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">Work built to make an impact.</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">Explore selected projects across our five technology and digital departments. Only work approved for public display appears here.</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`rounded-full border px-4 py-2.5 text-sm transition ${category === item ? "border-blue-300/40 bg-blue-400/10 text-blue-100" : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}>{item}</button>)}
          </div>
        </header>

        {loading ? <div className="py-20 text-center text-slate-400">Loading selected work…</div> :
          error ? <div role="alert" className="mt-8 rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6 text-rose-200">{error}</div> :
          filtered.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-12 text-center"><h2 className="text-xl font-semibold">More work is on the way</h2><p className="mt-3 text-sm leading-6 text-slate-400">Approved portfolio projects will appear here when the administration team publishes them.</p></div> :
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => <article key={project.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition hover:border-blue-300/30">
              <div className="relative flex min-h-48 items-center justify-center overflow-hidden bg-[#0b111b]">
                {project.media.find((media) => media.url && media.mime_type.startsWith("image/")) ? <img src={project.media.find((media) => media.url && media.mime_type.startsWith("image/"))!.url!} alt={project.title} loading="lazy" className="h-56 w-full object-cover" /> :
                  <div className="flex h-56 w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,.15),transparent_65%)]"><span className="font-mono text-4xl font-bold text-blue-200" aria-hidden="true">{categoryIcons[project.category] || "◇"}</span><span className="text-xs uppercase tracking-[0.2em] text-slate-500">VEXORA project</span></div>}
                <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-xs text-blue-100 backdrop-blur">{project.category}</span>
              </div>
              <div className="p-6"><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">{project.status.replaceAll("_", " ")}</div><h2 className="mt-3 text-xl font-bold">{project.title}</h2><p className="mt-3 text-sm leading-6 text-slate-400">{project.description || "Selected work delivered by VEXORA."}</p>
                {project.media.some((media) => media.url && media.mime_type.startsWith("video/")) && <video controls preload="metadata" className="mt-5 w-full rounded-xl border border-white/10 bg-black"><source src={project.media.find((media) => media.url && media.mime_type.startsWith("video/"))!.url!} type={project.media.find((media) => media.url && media.mime_type.startsWith("video/"))!.mime_type} />Your browser does not support video playback.</video>}
              </div>
            </article>)}
          </div>}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6"><div><h2 className="font-semibold">Have a project in mind?</h2><p className="mt-2 text-sm text-slate-400">Let’s discuss a practical solution for your business.</p></div><Link href="/contact" className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold transition hover:bg-blue-400">Contact VEXORA</Link></div>
      </div>
    </main>
  );
}
