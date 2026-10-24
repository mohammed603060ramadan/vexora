import Link from "next/link";

const categories = [
  { name: "Cybersecurity", subtitle: "Security operations, defense and ethical security.", icon: "⌘", color: "from-cyan-400/20 to-blue-600/5" },
  { name: "Software Development", subtitle: "Programming, applications and engineering.", icon: "</>", color: "from-blue-400/20 to-indigo-600/5" },
  { name: "Networks & Infrastructure", subtitle: "Networks, cloud foundations and infrastructure.", icon: "⌁", color: "from-violet-400/20 to-blue-600/5" },
  { name: "Data Analytics", subtitle: "Data workflows, reporting and insight.", icon: "▥", color: "from-sky-400/20 to-cyan-600/5" },
  { name: "Digital Marketing", subtitle: "Digital strategy, campaigns and measurement.", icon: "↗", color: "from-indigo-400/20 to-purple-600/5" },
];

export default function AcademyCategoriesPage() {
  return (
    <main className="min-h-screen bg-[#070a10] px-5 py-12 text-white sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <Link href="/academy" className="text-sm text-blue-300 transition hover:text-white">← Back to Academy</Link>
        <header className="mt-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-300">VEXORA / Learning paths</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Choose your technology track.</h1>
          <p className="mt-5 text-base leading-8 text-slate-400">Explore five focused learning departments. Courses published by the VEXORA Academy team appear automatically in the matching category.</p>
        </header>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <Link key={category.name} href={`/academy/courses?category=${encodeURIComponent(category.name)}`} className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-blue-300/35 hover:bg-white/[0.04]">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-300/20 bg-gradient-to-br ${category.color} font-mono text-2xl font-bold text-blue-200 transition group-hover:scale-105`} aria-hidden="true">{category.icon}</div>
              <p className="mt-7 text-xs font-semibold tracking-[0.22em] text-slate-500">TRACK 0{index + 1}</p>
              <h2 className="mt-2 text-xl font-bold">{category.name}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{category.subtitle}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 group-hover:text-white">Explore courses <span aria-hidden="true">↗</span></span>
            </Link>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-blue-300/15 bg-blue-400/[0.04] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div><h2 className="font-semibold">Browse every published course</h2><p className="mt-2 text-sm leading-6 text-slate-400">Search the full catalogue or compare course levels and learning formats.</p></div>
          <Link href="/academy/courses" className="mt-4 inline-flex rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold transition hover:bg-blue-400 sm:mt-0">Open course directory</Link>
        </div>
      </div>
    </main>
  );
}
