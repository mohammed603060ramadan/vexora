import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ModuleCard = { title: string; description: string; href: string; code: string; group: string; icon: string };
const modules: ModuleCard[] = [
  { title: "Projects", description: "Project records, delivery status, media and timelines.", href: "/admin/projects", code: "PR", group: "Operations", icon: "▱" },
  { title: "Clients", description: "Client profiles, company details and relationships.", href: "/admin/clients", code: "CL", group: "Operations", icon: "◉" },
  { title: "Tasks", description: "Assignments, priorities, deadlines and progress.", href: "/admin/tasks", code: "TK", group: "Operations", icon: "⌁" },
  { title: "Client Inquiries", description: "Review leads and convert qualified inquiries into clients.", href: "/admin/inquiries", code: "IN", group: "Sales", icon: "↗" },
  { title: "Service Requests", description: "Track new service requests and fulfillment.", href: "/admin/service-requests", code: "SR", group: "Sales", icon: "⌘" },
  { title: "Quotations", description: "Prepare and manage client quotations.", href: "/admin/quotations", code: "QT", group: "Sales", icon: "≋" },
  { title: "Contracts", description: "Manage contracts and client agreements.", href: "/admin/contracts", code: "CT", group: "Sales", icon: "▤" },
  { title: "Academy", description: "Publish courses and organize learning tracks.", href: "/admin/academy", code: "AC", group: "Content", icon: "⌑" },
  { title: "Events", description: "Publish events to the public VEXORA website.", href: "/admin/events", code: "EV", group: "Content", icon: "◷" },
  { title: "Technology News", description: "Maintain technology news and editorial updates.", href: "/admin/news", code: "NW", group: "Content", icon: "◌" },
  { title: "Website Pages", description: "Manage editable website page content.", href: "/admin/pages", code: "PG", group: "Content", icon: "▧" },
  { title: "Services", description: "Maintain the VEXORA service catalogue.", href: "/admin/services", code: "SV", group: "Content", icon: "◇" },
  { title: "Managers", description: "Manage authorized manager accounts.", href: "/admin/managers", code: "MG", group: "People", icon: "⬡" },
  { title: "Team & Roles", description: "Manage team records and responsibilities.", href: "/admin/team", code: "TM", group: "People", icon: "♧" },
  { title: "Users", description: "Review registered platform users.", href: "/admin/users", code: "US", group: "People", icon: "◎" },
  { title: "Student Registrations", description: "Review Academy applications and enrollment.", href: "/admin/registrations", code: "ST", group: "People", icon: "⌂" },
  { title: "Finance", description: "Review financial operations and records.", href: "/admin/finance", code: "FN", group: "Business", icon: "＄" },
  { title: "Analytics & Reports", description: "Monitor operational data and business performance.", href: "/admin/analytics", code: "AN", group: "Business", icon: "⌁" },
  { title: "Messages", description: "Review incoming messages and communication.", href: "/admin/messages", code: "MS", group: "Business", icon: "✉" },
  { title: "Settings", description: "Configure platform preferences and operations.", href: "/admin/settings", code: "ST", group: "System", icon: "⚙" },
];

async function countRows(supabase: Awaited<ReturnType<typeof createClient>>, table: string, column?: string, value?: string) {
  let query = supabase.from(table as never).select("id", { count: "exact", head: true });
  if (column && value) query = query.eq(column as never, value as never);
  const { count, error } = await query;
  return error ? null : count ?? 0;
}
function formatCount(value: number | null) { return value === null ? "—" : new Intl.NumberFormat("en").format(value); }

function MetricIcon({ code }: { code: string }) {
  const paths: Record<string,string> = {
    PR:"M4 7h16M4 12h16M4 17h10", CL:"M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M10 11a4 4 0 1 0 0-8", IN:"M4 4h16v16H4z M4 13h4l2 3h4l2-3h4", TK:"m4 12 5 5L20 6", AC:"M4 4h16v16H4z M8 8h8 M8 12h8"
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d={paths[code] || "M12 3v18 M3 12h18"} /></svg>;
}

export default async function AdminPage() {
  await connection();
  const supabase = await createClient();
  const [projects, clients, tasks, inquiries, courses, events] = await Promise.all([
    countRows(supabase, "projects"), countRows(supabase, "clients"), countRows(supabase, "tasks"),
    countRows(supabase, "inquiries", "status", "new"), countRows(supabase, "courses"), countRows(supabase, "events", "status", "published"),
  ]);
  const metrics = [
    { label:"Projects", value:projects, note:"Tracked delivery work", code:"PR", tint:"from-blue-400/20 to-blue-500/[0.02]" },
    { label:"Clients", value:clients, note:"Client records", code:"CL", tint:"from-cyan-400/20 to-cyan-500/[0.02]" },
    { label:"Open inquiries", value:inquiries, note:"New leads to review", code:"IN", tint:"from-amber-400/20 to-amber-500/[0.02]" },
    { label:"Tasks", value:tasks, note:"Operational workload", code:"TK", tint:"from-violet-400/20 to-violet-500/[0.02]" },
    { label:"Courses", value:courses, note:"Academy course records", code:"AC", tint:"from-fuchsia-400/20 to-fuchsia-500/[0.02]" },
    { label:"Published events", value:events, note:"Visible on the website", code:"EV", tint:"from-emerald-400/20 to-emerald-500/[0.02]" },
  ];
  const groups = ["Operations", "Sales", "Content", "People", "Business", "System"];
  const known = metrics.filter((item) => item.value !== null).length;
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-10">
      <section className="relative isolate overflow-hidden rounded-[28px] border border-sky-300/20 bg-[linear-gradient(115deg,rgba(7,19,37,.97),rgba(7,14,28,.92)_58%,rgba(10,36,63,.84))] p-6 shadow-[0_25px_90px_rgba(0,0,0,.28)] sm:p-9 lg:p-11">
        <div className="pointer-events-none absolute -right-24 -top-32 h-[27rem] w-[27rem] rounded-full border border-sky-300/10 [box-shadow:0_0_0_35px_rgba(56,189,248,.025),0_0_0_80px_rgba(56,189,248,.018)]" />
        <div className="pointer-events-none absolute right-[18%] top-0 h-full w-px bg-gradient-to-b from-transparent via-sky-300/20 to-transparent" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="hidden shrink-0 sm:block"><Image src="/vexora-logo.png" alt="Official VEXORA logo" width={112} height={112} priority className="h-24 w-24 rounded-full object-contain drop-shadow-[0_0_28px_rgba(38,151,255,.4)] transition duration-700 hover:rotate-6 hover:scale-105" /></div>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.2em] text-emerald-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_10px_#34d399]" /> Command systems operational</div>
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[.32em] text-sky-300">VEXORA Intelligence Division</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl xl:text-6xl">Command <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-slate-100 bg-clip-text text-transparent">Center.</span></h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300/75 sm:text-base">A unified operational view of company performance, client delivery, platform activity and business intelligence.</p>
            </div>
          </div>
          <div className="relative flex flex-wrap gap-3 lg:max-w-[230px] lg:flex-col">
            <Link href="/admin/analytics" className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-300/30 bg-sky-400/10 px-4 py-3 text-sm font-semibold text-sky-100 transition duration-300 hover:-translate-y-0.5 hover:border-sky-200/60 hover:bg-sky-400/20 hover:shadow-[0_8px_30px_rgba(14,165,233,.16)]">Explore intelligence <span className="transition group-hover:translate-x-1">↗</span></Link>
            <Link href="/admin/projects" className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3 text-sm font-bold text-white shadow-[0_8px_28px_rgba(37,99,235,.24)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110">Open operations <span className="transition group-hover:translate-x-1">↗</span></Link>
          </div>
        </div>
        <div className="relative mt-9 grid grid-cols-2 gap-3 border-t border-white/[.08] pt-5 sm:grid-cols-4">
          {[["PLATFORM","LIVE"],["DATA SOURCES",String(known)+"/6"],["MODULES",String(modules.length)],["ACCESS","ADMIN ONLY"]].map(([label,value])=><div key={label}><p className="text-[9px] font-semibold tracking-[.2em] text-slate-500">{label}</p><p className="mt-1.5 text-xs font-bold tracking-[.12em] text-slate-200">{value}</p></div>)}
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[.26em] text-sky-300">Live telemetry</p><h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">Business overview</h2><p className="mt-1 text-xs text-slate-500">Current totals from records readable by your administrator session.</p></div><Link href="/admin/analytics" className="text-xs font-semibold text-sky-300 transition hover:text-white">Full analytics ↗</Link></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {metrics.map((metric) => <article key={metric.label} className="group relative overflow-hidden rounded-2xl border border-white/[.08] bg-[#091321]/80 p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-300/30 hover:shadow-[0_14px_38px_rgba(0,0,0,.22)]">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70 transition duration-500 group-hover:opacity-100 ${metric.tint}`} />
            <div className="relative flex items-center justify-between"><span className="text-xs font-medium text-slate-400">{metric.label}</span><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#07101e]/70 text-sky-200 transition duration-300 group-hover:scale-110 group-hover:rotate-3"><MetricIcon code={metric.code} /></span></div>
            <p className="relative mt-5 text-3xl font-black tracking-tight text-white tabular-nums">{formatCount(metric.value)}</p><p className="relative mt-1 text-[10px] text-slate-500">{metric.note}</p><div className="relative mt-4 h-px overflow-hidden bg-white/[.07]"><div className="h-full w-1/3 bg-gradient-to-r from-transparent via-sky-300 to-transparent transition-all duration-700 group-hover:translate-x-full" /></div>
          </article>)}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[.26em] text-sky-300">System architecture</p><h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">Management modules</h2><p className="mt-1 text-xs text-slate-500">Every module opens its dedicated workspace.</p></div><span className="rounded-full border border-sky-300/15 bg-sky-300/[.05] px-3 py-1.5 text-[10px] font-semibold text-sky-200">{modules.length} destinations</span></div>
        <div className="mt-6 space-y-7">{groups.map((group) => { const items = modules.filter((item) => item.group === group); if (!items.length) return null; return <section key={group} aria-label={group}><div className="mb-3 flex items-center gap-3"><span className="h-px w-6 bg-sky-400/60" /><h3 className="text-[10px] font-bold uppercase tracking-[.23em] text-slate-400">{group}</h3><span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" /></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => <Link key={item.href} href={item.href} className="group relative overflow-hidden rounded-2xl border border-white/[.075] bg-[#091321]/75 p-4 backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:border-sky-300/30 hover:bg-[#0b1a2b]/90 hover:shadow-[0_14px_36px_rgba(0,0,0,.2)]"><div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-400/[.06] blur-2xl transition duration-500 group-hover:bg-sky-400/[.14]" /><div className="relative flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-gradient-to-br from-sky-400/[.15] to-blue-500/[.04] text-xl text-sky-200 transition duration-300 group-hover:scale-105 group-hover:border-sky-200/40 group-hover:shadow-[0_0_20px_rgba(56,189,248,.13)]">{item.icon}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-semibold text-slate-100 transition group-hover:text-sky-200">{item.title}</h4><span className="text-[9px] font-bold tracking-[.12em] text-slate-600">{item.code}</span></div><p className="mt-1.5 text-xs leading-5 text-slate-500">{item.description}</p></div><span className="relative mt-1 text-slate-600 transition duration-300 group-hover:translate-x-1 group-hover:text-sky-300">↗</span></div></Link>)}</div></section>; })}</div>
      </section>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[.07] py-5 text-[10px] text-slate-600"><span>VEXORA · Technology Operations</span><span>Live values reflect records readable by the current administrator session.</span></footer>
    </div>
  );
}
