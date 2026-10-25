"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  { name: "Cybersecurity", code: "SEC / 01", icon: "⌘", description: "Security engineering, risk reduction, and digital protection.", tone: "from-cyan-400/20 to-blue-500/5" },
  { name: "Software Development", code: "DEV / 02", icon: "</>", description: "Web platforms, applications, and custom software solutions.", tone: "from-blue-400/20 to-indigo-500/5" },
  { name: "Networks & Infrastructure", code: "NET / 03", icon: "⌁", description: "Reliable networks, infrastructure, and connected systems.", tone: "from-sky-400/20 to-cyan-500/5" },
  { name: "Data Analytics", code: "DATA / 04", icon: "▥", description: "Data platforms, analytics, and actionable business insights.", tone: "from-violet-400/20 to-blue-500/5" },
  { name: "Digital Marketing", code: "GROWTH / 05", icon: "↗", description: "Digital campaigns and measurable growth initiatives.", tone: "from-fuchsia-400/20 to-blue-500/5" },
] as const;

type Media = { id: string; name: string; mime_type: string | null; url: string | null };
type Achievement = { id: string; title: string; description: string | null; status: string; category: string; media: Media[] };

function CategoryGlyph({ name }: { name: string }) {
  if (name === "Cybersecurity") return <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10"><path d="M24 4 40 10v12c0 10-7 17-16 22C15 39 8 32 8 22V10L24 4Z" stroke="currentColor" strokeWidth="2.2"/><path d="m17 24 5 5 10-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "Software Development") return <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10"><path d="m17 14-10 10 10 10M31 14l10 10-10 10M27 9l-6 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "Networks & Infrastructure") return <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10"><rect x="17" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="4" y="34" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="31" y="34" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M24 14v10M10.5 34V24H37.5V34" stroke="currentColor" strokeWidth="2"/></svg>;
  if (name === "Data Analytics") return <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10"><path d="M6 41V7M6 41h37" stroke="currentColor" strokeWidth="2"/><rect x="12" y="26" width="6" height="15" rx="1" fill="currentColor" fillOpacity=".65"/><rect x="23" y="17" width="6" height="24" rx="1" fill="currentColor" fillOpacity=".8"/><rect x="34" y="8" width="6" height="33" rx="1" fill="currentColor"/></svg>;
  return <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10"><path d="M9 34 36 7M19 7h17v17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 18v22h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
}

export default function AchievementsPage() {
  const [projects, setProjects] = useState<Achievement[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/public/portfolio", { cache: "no-store" });
      const result = (await response.json()) as { projects?: Achievement[]; error?: string };
      if (!response.ok) throw new Error(result.error || "Portfolio could not be loaded.");
      setProjects(Array.isArray(result.projects) ? result.projects : []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Portfolio could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialProjects() {
      try {
        const response = await fetch("/api/public/portfolio", { cache: "no-store" });
        const result = (await response.json()) as { projects?: Achievement[]; error?: string };
        if (!response.ok) {
          throw new Error(result.error || "Portfolio could not be loaded.");
        }
        if (!cancelled) {
          setProjects(Array.isArray(result.projects) ? result.projects : []);
          setError("");
        }
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Portfolio could not be loaded.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadInitialProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map((item) => [item.name, projects.filter((p) => p.category === item.name).length])), [projects]);
  const visibleProjects = useMemo(() => activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory), [projects, activeCategory]);
  const selectedCategory = CATEGORIES.find((item) => item.name === activeCategory);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03060c] px-4 py-6 text-white sm:px-7 lg:px-10 lg:py-9">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(59,130,246,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.045) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      <div aria-hidden="true" className="pointer-events-none fixed -left-40 top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"><span aria-hidden="true">←</span> Back to Projects</Link>
          <div className="flex items-center gap-3"><span className="hidden font-mono text-[10px] tracking-[.25em] text-slate-600 sm:block">VXR / PORTFOLIO SYSTEM</span><Link href="/client" className="rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-300/40 hover:bg-blue-400/10">Client Portal ↗</Link></div>
        </nav>

        <header className="relative mt-7 overflow-hidden rounded-[2rem] border border-blue-300/20 bg-[radial-gradient(ellipse_at_80%_0%,rgba(37,99,235,.24),transparent_45%),linear-gradient(130deg,#0c1424,#070a11_65%)] p-6 shadow-2xl shadow-blue-950/20 sm:p-10 lg:p-14">
          <div aria-hidden="true" className="absolute -right-12 -top-14 h-72 w-72 rounded-full border border-blue-300/10 sm:h-96 sm:w-96"><div className="absolute inset-8 rounded-full border border-blue-300/10"><div className="absolute inset-8 rounded-full border border-blue-300/10" /></div></div>
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.32em] text-blue-300 sm:text-xs"><span className="h-px w-8 bg-blue-400" /> VEXORA / Achievements</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.05] tracking-[-.04em] sm:text-6xl lg:text-7xl">Technology that <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-white bg-clip-text text-transparent">moves business</span> forward.</h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">Explore published work from our five departments. Choose a discipline to open its dedicated project collection; approved uploads appear here automatically.</p>
            </div>
            <div className="relative grid grid-cols-2 gap-3 lg:w-56">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4"><p className="font-mono text-3xl font-semibold">{projects.length.toString().padStart(2, "0")}</p><p className="mt-2 text-[10px] uppercase tracking-[.18em] text-slate-500">Published projects</p></div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4"><p className="font-mono text-3xl font-semibold">05</p><p className="mt-2 text-[10px] uppercase tracking-[.18em] text-slate-500">Departments</p></div>
            </div>
          </div>
        </header>

        <section className="relative mt-8" aria-label="Portfolio departments">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="font-mono text-[10px] tracking-[.25em] text-blue-300">01 / SELECT A DEPARTMENT</p><h2 className="mt-2 text-xl font-semibold sm:text-2xl">Explore by expertise</h2></div><p className="text-xs text-slate-500">Select a card to view its projects</p></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((item, index) => {
              const active = activeCategory === item.name;
              return <button key={item.name} type="button" aria-pressed={active} onClick={() => setActiveCategory(active ? "All" : item.name)} className={`group relative isolate min-h-52 overflow-hidden rounded-2xl border p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-blue-300/40 hover:shadow-xl hover:shadow-blue-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${active ? "border-blue-300/60 bg-blue-400/[.10] shadow-lg shadow-blue-950/30" : "border-white/10 bg-[#0a101a]/90"}`}>
                <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${item.tone} opacity-60 transition group-hover:opacity-100`} />
                <div className="flex items-start justify-between"><span className={`inline-flex h-14 w-14 items-center justify-center rounded-xl border transition ${active ? "border-blue-200/40 bg-blue-300/15 text-blue-100" : "border-white/10 bg-black/20 text-blue-300 group-hover:border-blue-300/30 group-hover:text-white"}`}><CategoryGlyph name={item.name} /></span><span className="font-mono text-[10px] text-slate-600">0{index + 1}</span></div>
                <h3 className="mt-5 text-sm font-bold leading-5 text-slate-100">{item.name}</h3>
                <div className="mt-3 flex items-center justify-between gap-2"><span className="font-mono text-[10px] tracking-[.16em] text-slate-500">{counts[item.name] ?? 0} PROJECTS</span><span className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition ${active ? "rotate-45 border-blue-200/40 bg-blue-300/15 text-blue-100" : "border-white/10 text-slate-500 group-hover:border-blue-300/40 group-hover:text-white"}`} aria-hidden="true">↗</span></div>
              </button>;
            })}
          </div>
        </section>

        <section className="relative mt-12 scroll-mt-8" aria-live="polite">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div><p className="font-mono text-[10px] tracking-[.25em] text-blue-300">02 / PROJECT ARCHIVE</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">{selectedCategory?.name ?? "All achievements"}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{selectedCategory?.description ?? "Browse the complete collection of projects approved for public display."}</p></div>
            <button type="button" onClick={() => setActiveCategory("All")} className={`rounded-lg border px-3 py-2 text-xs transition ${activeCategory === "All" ? "border-blue-300/30 bg-blue-400/10 text-blue-100" : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"}`}>View all projects</button>
          </div>

          {loading ? <div role="status" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0,1,2].map((n) => <div key={n} className="h-80 animate-pulse rounded-2xl border border-white/10 bg-white/[.03]" />)}</div> :
            error ? <div role="alert" className="rounded-2xl border border-rose-300/20 bg-rose-300/[.05] p-6 sm:p-8"><p className="font-semibold text-rose-100">Portfolio connection needs attention</p><p className="mt-2 text-sm leading-6 text-rose-100/70">{error}</p><button type="button" onClick={() => void loadProjects()} className="mt-5 rounded-xl border border-rose-200/20 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/10">Try again</button></div> :
            visibleProjects.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 bg-white/[.015] px-6 py-12 text-center sm:px-10"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-400/[.06] text-blue-200"><CategoryGlyph name={selectedCategory?.name ?? "Software Development"} /></div><h3 className="mt-5 text-xl font-semibold">{activeCategory === "All" ? "Your portfolio starts here" : "This department is ready for its first project"}</h3><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">Upload a project from Admin → Projects, choose the matching portfolio department, set its status to In progress or Completed, and enable Public projects page. It will appear here automatically.</p><Link href="/admin/projects" className="mt-6 inline-flex rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">Open project manager ↗</Link></div> :
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{visibleProjects.map((project, index) => {
              const imageMedia = project.media.find((media) => media.url && media.mime_type?.startsWith("image/"));
              const videoMedia = project.media.find((media) => media.url && media.mime_type?.startsWith("video/"));
              return <article key={project.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#090e17] transition duration-300 hover:-translate-y-1 hover:border-blue-300/30 hover:shadow-2xl hover:shadow-blue-950/20">
                <div className="relative flex min-h-48 items-center justify-center overflow-hidden bg-[#070b12]">
                  {imageMedia?.url ? <Image src={imageMedia.url} alt={project.title} width={1200} height={675} unoptimized loading="lazy" className="h-56 w-full object-cover transition duration-700 group-hover:scale-[1.035]" /> : <div className="flex h-56 w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,.18),transparent_65%)]"><CategoryGlyph name={project.category} /><span className="font-mono text-[10px] uppercase tracking-[.22em] text-slate-500">VEXORA / PROJECT {String(index + 1).padStart(3, "0")}</span></div>}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" /><span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/65 px-3 py-1.5 text-[10px] font-semibold text-blue-100 backdrop-blur">{project.category}</span><span className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-[10px] text-slate-300">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="p-5 sm:p-6"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />{project.status.replaceAll("_", " ")}</div><h3 className="mt-3 text-xl font-bold tracking-tight">{project.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{project.description || "Selected work delivered by VEXORA."}</p>
                  {videoMedia?.url && <video controls preload="metadata" className="mt-5 w-full rounded-xl border border-white/10 bg-black"><source src={videoMedia.url} type={videoMedia.mime_type || undefined} />Your browser does not support video playback.</video>}
                  <div className="mt-5 flex items-center justify-between border-t border-white/[.07] pt-4 text-[10px] uppercase tracking-[.16em] text-slate-600"><span>VEXORA / Selected work</span><span>{project.media.length} media file{project.media.length === 1 ? "" : "s"}</span></div>
                </div>
              </article>;
            })}</div>}
        </section>

        <footer className="relative mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-300/15 bg-[radial-gradient(ellipse_at_right,rgba(37,99,235,.12),transparent_60%),#090e17] p-6 sm:p-8"><div><p className="font-mono text-[10px] tracking-[.24em] text-blue-300">LET’S BUILD WHAT’S NEXT</p><h2 className="mt-2 text-xl font-bold">Have a project in mind?</h2><p className="mt-2 text-sm text-slate-400">Let’s discuss a practical solution for your business.</p></div><Link href="/contact" className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-950/30 transition hover:from-blue-500 hover:to-cyan-500">Contact VEXORA ↗</Link></footer>
      </div>
    </main>
  );
}
