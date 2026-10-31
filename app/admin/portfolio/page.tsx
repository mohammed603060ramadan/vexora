import Link from "next/link";

const departments = [
  { name: "Cybersecurity", icon: "⌘", description: "Security reviews, protection and response projects." },
  { name: "Software Development", icon: "</>", description: "Websites, applications, platforms and integrations." },
  { name: "Networks & Infrastructure", icon: "⌁", description: "Networks, infrastructure and cloud deployments." },
  { name: "Data Analytics", icon: "▥", description: "Dashboards, analytics and data solutions." },
  { name: "Digital Marketing", icon: "↗", description: "Campaigns, digital growth and measurement." },
];

export default function AdminPortfolioPage() {
  return (
    <main className="min-h-screen text-white">
      <header className="rounded-2xl border border-blue-400/15 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,.15),transparent_55%),#0b111b] p-6 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-300">VEXORA / Content management</p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Portfolio Studio</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Organize published work into five departments, upload images and videos, and control which approved projects appear on the public website. Media stays private in storage; the public portfolio receives time-limited signed links only for approved projects.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/projects" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500">Manage projects and upload media</Link>
          <Link href="/portfolio" target="_blank" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/25 hover:text-white">Preview public portfolio ↗</Link>
        </div>
      </header>
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {departments.map((department, index) => <article key={department.name} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-300/20 bg-blue-400/[0.07] font-mono text-xl font-bold text-blue-200" aria-hidden="true">{department.icon}</div>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Department 0{index + 1}</p>
          <h2 className="mt-2 text-lg font-bold">{department.name}</h2>
          <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{department.description}</p>
          <Link href="/admin/projects" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-white">Open project manager ↗</Link>
        </article>)}
      </section>

      <aside
        aria-labelledby="portfolio-publishing-title"
        className="relative isolate mt-7 overflow-hidden rounded-2xl border border-blue-400/30 bg-[linear-gradient(115deg,rgba(15,35,62,.92),rgba(8,15,27,.98)_58%,rgba(12,25,45,.94))] p-5 shadow-[0_0_28px_rgba(37,99,235,0.12),inset_0_1px_0_rgba(147,197,253,0.08)] sm:p-6"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-1/4 -z-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-300/30 bg-blue-400/10 text-blue-200 shadow-[0_0_18px_rgba(59,130,246,0.18)]" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
              <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-300">Publishing guidelines</p>
            <h2 id="portfolio-publishing-title" className="mt-1 text-lg font-bold tracking-tight text-white sm:text-xl">Bring your work into the spotlight.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
              Select a department, add your project media, set its status to <span className="font-semibold text-white">In progress</span> or <span className="font-semibold text-white">Completed</span>, then enable <span className="font-semibold text-blue-200">Public projects page</span> to publish it. Only explicitly approved projects are displayed in the public portfolio.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-blue-200/10 pt-4 text-xs font-medium text-slate-400">
          <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.9)]" /> Department selected</span>
          <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.9)]" /> Media uploaded</span>
          <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.9)]" /> Public visibility approved</span>
        </div>
      </aside>
    </main>
  );
}
