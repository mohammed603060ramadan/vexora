import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ModuleCard = { title: string; description: string; href: string; code: string; group: string };
const modules: ModuleCard[] = [
  { title: "Projects", description: "Project records, delivery status, media and timelines.", href: "/admin/projects", code: "PR", group: "Operations" },
  { title: "Clients", description: "Client profiles, company details and relationships.", href: "/admin/clients", code: "CL", group: "Operations" },
  { title: "Client Inquiries", description: "Review incoming leads and convert qualified inquiries into clients.", href: "/admin/inquiries", code: "IN", group: "Sales" },
  { title: "Service Requests", description: "Track new service requests and fulfillment.", href: "/admin/service-requests", code: "SR", group: "Sales" },
  { title: "Quotations", description: "Prepare and manage client quotations.", href: "/admin/quotations", code: "QT", group: "Sales" },
  { title: "Contracts", description: "Manage contracts and client agreements.", href: "/admin/contracts", code: "CT", group: "Sales" },
  { title: "Tasks", description: "Coordinate assignments, priorities and deadlines.", href: "/admin/tasks", code: "TK", group: "Operations" },
  { title: "Academy", description: "Publish courses and organize learning tracks.", href: "/admin/academy", code: "AC", group: "Content" },
  { title: "Events", description: "Publish events to the public VEXORA website.", href: "/admin/events", code: "EV", group: "Content" },
  { title: "Technology News", description: "Maintain technology news and editorial updates.", href: "/admin/news", code: "NW", group: "Content" },
  { title: "Website Pages", description: "Manage editable website page content.", href: "/admin/pages", code: "PG", group: "Content" },
  { title: "Services", description: "Maintain the VEXORA service catalogue.", href: "/admin/services", code: "SV", group: "Content" },
  { title: "Managers", description: "Manage authorized manager accounts securely.", href: "/admin/managers", code: "MG", group: "People" },
  { title: "Team & Roles", description: "Manage team records and role assignments.", href: "/admin/team", code: "TM", group: "People" },
  { title: "Users", description: "Review registered platform users.", href: "/admin/users", code: "US", group: "People" },
  { title: "Student Registrations", description: "Review Academy applications and enrollment requests.", href: "/admin/registrations", code: "ST", group: "People" },
  { title: "Finance", description: "Review financial operations and records.", href: "/admin/finance", code: "FN", group: "Business" },
  { title: "Analytics & Reports", description: "Monitor operational data and business performance.", href: "/admin/analytics", code: "AN", group: "Business" },
  { title: "Messages", description: "Review incoming messages and communication.", href: "/admin/messages", code: "MS", group: "Business" },
  { title: "Settings", description: "Configure site settings and platform preferences.", href: "/admin/settings", code: "ST", group: "System" },
];

async function countRows(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
  column?: string,
  value?: string,
) {
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (column && value) query = query.eq(column, value);
  const { count, error } = await query;
  return error ? null : count ?? 0;
}

function formatCount(value: number | null) {
  return value === null ? "—" : new Intl.NumberFormat("en").format(value);
}

export default async function AdminPage() {
  await connection();
  const supabase = await createClient();
  const [projects, clients, tasks, inquiries, courses, events] = await Promise.all([
    countRows(supabase, "projects"),
    countRows(supabase, "clients"),
    countRows(supabase, "tasks"),
    countRows(supabase, "inquiries", "status", "new"),
    countRows(supabase, "courses"),
    countRows(supabase, "events", "status", "published"),
  ]);

  const metrics = [
    { label: "Projects", value: projects, note: "Tracked delivery work", code: "PR" },
    { label: "Clients", value: clients, note: "Client records", code: "CL" },
    { label: "Open inquiries", value: inquiries, note: "New leads to review", code: "IN" },
    { label: "Tasks", value: tasks, note: "Operational workload", code: "TK" },
    { label: "Courses", value: courses, note: "Academy course records", code: "AC" },
    { label: "Published events", value: events, note: "Visible on the website", code: "EV" },
  ];

  const groups = ["Operations", "Sales", "Content", "People", "Business", "System"];

  return (
    <main className="min-h-screen bg-[#070b12] px-4 py-7 text-white sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <header className="relative overflow-hidden rounded-3xl border border-blue-400/15 bg-[radial-gradient(ellipse_at_80%_0%,rgba(22,135,255,0.18),transparent_42%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(7,11,18,0.98))] p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border border-blue-300/10" />
          <div className="pointer-events-none absolute -right-2 -top-6 h-44 w-44 rounded-full border border-blue-300/10" />
          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Secure administration workspace</p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">VEXORA Control Center</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">One workspace for company operations, client delivery, content publishing and learning management.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/projects" className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold transition hover:bg-blue-400">Open projects <span aria-hidden="true">↗</span></Link>
              <Link href="/admin/settings" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:bg-white/[0.07]">System settings</Link>
            </div>
          </div>
        </header>

        <section aria-label="Live platform metrics" className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {metrics.map((metric) => (
            <article key={metric.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <div className="flex items-center justify-between"><span className="text-sm text-slate-400">{metric.label}</span><span className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-400/15 bg-blue-400/[0.06] text-[10px] font-bold tracking-wide text-blue-200">{metric.code}</span></div>
              <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">{formatCount(metric.value)}</p>
              <p className="mt-1 text-xs text-slate-500">{metric.note}</p>
            </article>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-300">Platform modules</p><h2 className="mt-2 text-2xl font-semibold">Management workspace</h2></div><p className="text-sm text-slate-500">{modules.length} connected destinations</p></div>
          <div className="mt-6 space-y-8">
            {groups.map((group) => {
              const items = modules.filter((item) => item.group === group);
              if (!items.length) return null;
              return <section key={group} aria-label={group}><h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{group}</h3><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => <Link key={item.href} href={item.href} className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-400/25 hover:bg-blue-400/[0.035]"><div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-gradient-to-br from-blue-400/15 to-cyan-400/[0.03] text-xs font-bold tracking-wide text-blue-200">{item.code}</span><div className="min-w-0 flex-1"><h4 className="font-semibold text-slate-100 transition group-hover:text-blue-200">{item.title}</h4><p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p></div><span className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-blue-300" aria-hidden="true">↗</span></div></Link>)}</div></section>;
            })}
          </div>
        </section>
        <footer className="mt-12 flex flex-col justify-between gap-2 border-t border-white/[0.07] py-5 text-xs text-slate-600 sm:flex-row"><span>VEXORA · Technology Operations</span><span>Live values are based on records available to your administrator account.</span></footer>
      </div>
    </main>
  );
}
