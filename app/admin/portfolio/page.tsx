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
      <div className="mt-7 rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-5 text-sm leading-6 text-amber-100/80">
        To publish work, open the project manager, choose its portfolio department, upload images or videos, set the project status to In progress or Completed, and enable Public projects page. Items that are not explicitly approved remain hidden from the public portfolio.
      </div>
    </main>
  );
}
