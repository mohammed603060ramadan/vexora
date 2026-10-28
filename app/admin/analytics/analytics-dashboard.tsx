"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type AnalyticsRow = Record<string, unknown>;

type Props = {
  clients: AnalyticsRow[];
  projects: AnalyticsRow[];
  tasks: AnalyticsRow[];
  requests: AnalyticsRow[];
  invoices: AnalyticsRow[];
  payments: AnalyticsRow[];
  expenses: AnalyticsRow[];
  errors: string[];
};

type Period = "30" | "90" | "365";

const panel =
  "rounded-2xl border border-white/[0.09] bg-[#0d121b] shadow-[0_16px_50px_rgba(0,0,0,0.12)]";

function value(row: AnalyticsRow, key: string): string {
  const item = row[key];
  return item === null || item === undefined ? "" : String(item);
}

function normalizedStatus(row: AnalyticsRow): string {
  return value(row, "status").toLowerCase().replaceAll("_", " ").trim();
}

function completedPaymentTotals(rows: AnalyticsRow[]): string {
  const totals = new Map<string, number>();

  for (const row of rows) {
    if (normalizedStatus(row) !== "completed") continue;
    const amount = Number(value(row, "amount"));
    if (!Number.isFinite(amount)) continue;

    const rawCurrency = value(row, "currency").trim().toUpperCase();
    const currency = /^[A-Z]{3}$/.test(rawCurrency) ? rawCurrency : "UNKNOWN";
    totals.set(currency, (totals.get(currency) ?? 0) + amount);
  }

  if (totals.size === 0) return "No completed payments";

  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([currency, amount]) => {
      const formatted = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return `${currency} ${formatted}`;
    })
    .join(" · ");
}

function isCompleted(row: AnalyticsRow): boolean {
  return ["completed", "complete", "done", "closed"].includes(
    normalizedStatus(row)
  );
}

function dateOf(row: AnalyticsRow): Date | null {
  const raw =
    value(row, "created_at") ||
    value(row, "requested_at") ||
    value(row, "created_on");

  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date: Date | null): string {
  if (!date) return "Date unavailable";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function shortMonth(date: Date): string {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(date);
}

function isWithinPeriod(row: AnalyticsRow, days: number): boolean {
  const date = dateOf(row);
  if (!date) return false;

  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - days);
  return date >= start && date <= now;
}

function isOverdue(row: AnalyticsRow): boolean {
  const due = value(row, "due_date");
  if (!due || isCompleted(row)) return false;

  const date = new Date(due);
  if (Number.isNaN(date.getTime())) return false;

  return date < new Date();
}

function MetricCard({
  label,
  number,
  detail,
  icon,
  accent,
}: {
  label: string;
  number: string | number;
  detail: string;
  icon: string;
  accent: string;
}) {
  return (
    <div className={`${panel} group relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30`}>
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl ${accent}`} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white tabular-nums">
            {number}
          </p>
          <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-white/10 px-5 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

export default function AnalyticsDashboard({
  clients,
  projects,
  tasks,
  requests,
  invoices,
  payments,
  expenses,
  errors,
}: Props) {
  const [period, setPeriod] = useState<Period>("30");

  const days = Number(period);
  const periodLabel = period === "30" ? "Last 30 days" : period === "90" ? "Last 90 days" : "Last 12 months";

  const filtered = useMemo(() => ({
    clients: clients.filter((row) => isWithinPeriod(row, days)),
    projects: projects.filter((row) => isWithinPeriod(row, days)),
    tasks: tasks.filter((row) => isWithinPeriod(row, days)),
    requests: requests.filter((row) => isWithinPeriod(row, days)),
  }), [clients, projects, tasks, requests, days]);

  const completedTasks = tasks.filter(isCompleted).length;
  const overdueTasks = tasks.filter(isOverdue).length;
  const activeProjects = projects.filter((row) =>
    ["in progress", "in_progress", "active", "planning"].includes(
      normalizedStatus(row)
    )
  ).length;
  const openRequests = requests.filter((row) =>
    ["new", "reviewing", "quoted", "approved", "in progress", "in_progress"].includes(
      normalizedStatus(row)
    )
  ).length;

  const taskCompletion = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const monthlyActivity = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - days);

    const months: { key: string; label: string; count: number }[] = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth(), 1);

    while (cursor <= last && months.length < 13) {
      months.push({
        key: `${cursor.getFullYear()}-${cursor.getMonth()}`,
        label: shortMonth(cursor),
        count: 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    const monthMap = new Map(months.map((month) => [month.key, month]));

    const allRows = [
      ...clients,
      ...projects,
      ...tasks,
      ...requests,
      ...invoices,
      ...payments,
      ...expenses,
    ];

    for (const row of allRows) {
      const date = dateOf(row);
      if (!date || date < start || date > now) continue;

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const month = monthMap.get(key);
      if (month) month.count += 1;
    }

    return months;
  }, [clients, projects, tasks, requests, invoices, payments, expenses, days]);

  const maxActivity = Math.max(1, ...monthlyActivity.map((item) => item.count));

  const projectStatuses = useMemo(() => {
    const groups = new Map<string, number>();

    for (const project of projects) {
      const status = normalizedStatus(project) || "unknown";
      groups.set(status, (groups.get(status) || 0) + 1);
    }

    const colors = [
      "#3b82f6",
      "#22c55e",
      "#f59e0b",
      "#a78bfa",
      "#f87171",
      "#64748b",
    ];

    return Array.from(groups.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([status, count], index) => ({
        status,
        count,
        color: colors[index % colors.length],
      }));
  }, [projects]);

  const totalProjectCount = projectStatuses.reduce(
    (sum, item) => sum + item.count,
    0
  );

  let runningPercent = 0;
  const donutGradient = projectStatuses.length
    ? `conic-gradient(${projectStatuses.map((item) => {
        const start = runningPercent;
        runningPercent += (item.count / totalProjectCount) * 100;
        return `${item.color} ${start}% ${runningPercent}%`;
      }).join(", ")})`
    : "conic-gradient(#263244 0% 100%)";

  const recentActivity = useMemo(() => {
    const entries = [
      ...clients.map((row) => ({ row, type: "Client", href: "/admin/clients", icon: "◉" })),
      ...projects.map((row) => ({ row, type: "Project", href: "/admin/projects", icon: "▦" })),
      ...tasks.map((row) => ({ row, type: "Task", href: "/admin/tasks", icon: "✓" })),
      ...requests.map((row) => ({ row, type: "Service request", href: "/admin/service-requests", icon: "↗" })),
      ...invoices.map((row) => ({ row, type: "Invoice", href: "/admin/finance/invoices", icon: "$" })),
      ...payments.map((row) => ({ row, type: "Payment", href: "/admin/finance/payments", icon: "↙" })),
      ...expenses.map((row) => ({ row, type: "Expense", href: "/admin/finance/expenses", icon: "−" })),
    ];

    return entries
      .sort((a, b) => {
        const dateA = dateOf(a.row)?.getTime() || 0;
        const dateB = dateOf(b.row)?.getTime() || 0;
        return dateB - dateA;
      })
      .slice(0, 6);
  }, [clients, projects, tasks, requests, invoices, payments, expenses]);

  return (
    <main className="min-h-screen bg-[#080b10] px-4 py-6 text-white sm:px-7 sm:py-8">
      <div className="mx-auto max-w-[1500px]">
        <Link href="/admin" className="text-sm text-blue-400 transition hover:text-blue-300">
          ← Back to dashboard
        </Link>

        <header className="mt-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_14px_#3b82f6]" />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
                VEXORA Intelligence
              </p>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Analytics Overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              A live operational snapshot of your clients, projects, tasks, and service requests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              role="status"
              aria-live="polite"
              className={errors.length > 0
                ? "rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-3 py-2 text-xs text-amber-200"
                : "rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2 text-xs text-emerald-300"}
            >
              {errors.length > 0
                ? `● Partial data · ${errors.length} source${errors.length === 1 ? "" : "s"} unavailable`
                : "● Connected to current page data"}
            </span>
            <label className="sr-only" htmlFor="analytics-period">Analytics period</label>
            <select
              id="analytics-period"
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
              className="rounded-xl border border-white/10 bg-[#0d121b] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-400/50"
            >
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 12 months</option>
            </select>
          </div>
        </header>

        {errors.length > 0 && (
          <section className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
            <p className="font-medium text-amber-200">Some analytics sources could not be loaded.</p>
            <p className="mt-1 text-sm text-slate-400">
              The available sections are still shown. Check that the affected tables exist and that your Supabase permissions allow reading them.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-amber-100/80">
              {errors.map((error) => <li key={error}>• {error}</li>)}
            </ul>
          </section>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total clients" number={clients.length} detail={`${filtered.clients.length} created in selected period`} icon="◉" accent="bg-blue-500/20" />
          <MetricCard label="Total projects" number={projects.length} detail={`${activeProjects} currently active`} icon="▦" accent="bg-violet-500/20" />
          <MetricCard label="Open service requests" number={openRequests} detail={`${filtered.requests.length} requests in selected period`} icon="↗" accent="bg-cyan-500/20" />
          <MetricCard label="Overdue tasks" number={overdueTasks} detail={`${completedTasks} tasks completed overall`} icon="◷" accent="bg-rose-500/20" />
          <Link href="/admin/finance/invoices" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"><MetricCard label="Invoices" number={invoices.length} detail="Open invoice register" icon="$" accent="bg-amber-500/20" /></Link>
          <Link href="/admin/finance/payments" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"><MetricCard label="Payments" number={payments.length} detail="Open payment register" icon="↙" accent="bg-emerald-500/20" /></Link>
          <div className="sm:col-span-2"><MetricCard label="Completed payment value" number={completedPaymentTotals(payments)} detail="Grouped by currency · completed payments only" icon="¤" accent="bg-cyan-500/20" /></div>
          <Link href="/admin/finance/expenses" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"><MetricCard label="Expenses" number={expenses.length} detail="Open expense register" icon="−" accent="bg-rose-500/20" /></Link>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.65fr_1fr]">
          <div className={`${panel} p-5 sm:p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">Business activity</h2>
                <p className="mt-1 text-sm text-slate-400">New records across all available modules</p>
              </div>
              <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400">{periodLabel}</span>
            </div>

            {monthlyActivity.some((item) => item.count > 0) ? (
              <div className="mt-8">
                <div className="flex h-52 items-end gap-2 sm:gap-4">
                  {monthlyActivity.map((item) => {
                    const height = Math.max(5, (item.count / maxActivity) * 100);
                    return (
                      <div key={item.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                        <span className="text-[10px] tabular-nums text-slate-400 sm:text-xs">{item.count}</span>
                        <div className="flex h-[78%] w-full items-end">
                          <div
                            title={`${item.label}: ${item.count} records`}
                            className="w-full rounded-t-md bg-gradient-to-t from-blue-700 to-sky-400 transition-all duration-500 hover:brightness-125"
                            style={{ height: `${height}%`, minHeight: "3px" }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 sm:text-xs">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-5 border-t border-white/[0.07] pt-4 text-xs leading-5 text-slate-500">
                  Each bar combines dated client, project, task, service-request, invoice, payment, and expense records for that month. This is operational activity, not revenue.
                </p>
              </div>
            ) : (
              <div className="mt-6"><EmptyChart message="No dated records found in this period. Add records or select a wider period to see activity." /></div>
            )}
          </div>

          <div className={`${panel} p-5 sm:p-6`}>
            <h2 className="font-semibold">Project status</h2>
            <p className="mt-1 text-sm text-slate-400">Distribution across current projects</p>

            {projects.length > 0 ? (
              <>
                <div className="mt-7 flex flex-col items-center gap-6 sm:flex-row xl:flex-col 2xl:flex-row">
                  <div
                    className="relative h-44 w-44 shrink-0 rounded-full"
                    style={{ background: donutGradient }}
                    role="img"
                    aria-label="Project status distribution chart"
                  >
                    <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full border border-white/[0.06] bg-[#0d121b]">
                      <span className="text-3xl font-semibold tabular-nums">{projects.length}</span>
                      <span className="mt-1 text-xs text-slate-400">Projects</span>
                    </div>
                  </div>

                  <div className="w-full space-y-3">
                    {projectStatuses.map((item) => (
                      <div key={item.status}>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="flex min-w-0 items-center gap-2 capitalize text-slate-300">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: item.color }} />
                            <span className="truncate">{item.status}</span>
                          </span>
                          <span className="text-slate-400 tabular-nums">{item.count}</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(item.count / projects.length) * 100}%`, background: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-6"><EmptyChart message="Project status analytics will appear when project records are available." /></div>
            )}
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className={`${panel} p-5`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Task completion</h2>
                <p className="mt-1 text-sm text-slate-400">Based on current task statuses</p>
              </div>
              <span className="text-sm font-semibold text-blue-300">{taskCompletion}%</span>
            </div>
            <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-300 transition-all duration-700" style={{ width: `${taskCompletion}%` }} />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-2xl font-semibold">{completedTasks}</p>
                <p className="mt-1 text-xs text-slate-400">Completed tasks</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{tasks.length}</p>
                <p className="mt-1 text-xs text-slate-400">Total tasks</p>
              </div>
            </div>
            <Link href="/admin/tasks" className="mt-6 inline-flex text-sm text-blue-400 hover:text-blue-300">Open task management →</Link>
          </div>

          <div className={`${panel} p-5`}>
            <h2 className="font-semibold">Operational snapshot</h2>
            <p className="mt-1 text-sm text-slate-400">Current workload indicators</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
                <span className="text-sm text-slate-400">Active projects</span>
                <span className="font-semibold tabular-nums">{activeProjects}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
                <span className="text-sm text-slate-400">Open requests</span>
                <span className="font-semibold tabular-nums">{openRequests}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-400">Overdue tasks</span>
                <span className={overdueTasks > 0 ? "font-semibold text-rose-300 tabular-nums" : "font-semibold text-emerald-300 tabular-nums"}>{overdueTasks}</span>
              </div>
            </div>
          </div>

          <div className={`${panel} p-5`}>
            <h2 className="font-semibold">Quick access</h2>
            <p className="mt-1 text-sm text-slate-400">Go directly to a module</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Clients", href: "/admin/clients", icon: "◉" },
                { label: "Projects", href: "/admin/projects", icon: "▦" },
                { label: "Tasks", href: "/admin/tasks", icon: "✓" },
                { label: "Requests", href: "/admin/service-requests", icon: "↗" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition hover:border-blue-400/30 hover:bg-blue-400/[0.05]">
                  <span className="text-lg text-blue-300">{item.icon}</span>
                  <span className="mt-2 block text-sm font-medium">{item.label}</span>
                  <span className="mt-1 block text-xs text-slate-500">Open module ↗</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={`${panel} mt-5 overflow-hidden`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] p-5">
            <div>
              <h2 className="font-semibold">Recent activity</h2>
              <p className="mt-1 text-sm text-slate-400">Latest records across connected modules</p>
            </div>
            <span className="text-xs text-slate-500">{recentActivity.length} records shown</span>
          </div>

          {recentActivity.length === 0 ? (
            <div className="p-8"><EmptyChart message="Recent activity will appear here when records are available." /></div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {recentActivity.map((entry, index) => {
                const title =
                  value(entry.row, "title") ||
                  value(entry.row, "name") ||
                  value(entry.row, "full_name") ||
                  (value(entry.row, "request_number")
                    ? `Request #${value(entry.row, "request_number")}`
                    : `${entry.type} record`);

                return (
                  <Link key={`${entry.type}-${value(entry.row, "id") || index}`} href={entry.href} className="flex items-center gap-3 px-5 py-4 transition hover:bg-white/[0.025]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-blue-300">{entry.icon}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{title}</p>
                      <p className="mt-1 text-xs text-slate-500">{entry.type} · {formatDate(dateOf(entry.row))}</p>
                    </div>
                    <span className="hidden rounded-full border border-white/[0.08] px-2.5 py-1 text-xs capitalize text-slate-400 sm:inline-flex">{normalizedStatus(entry.row) || "recorded"}</span>
                    <span className="text-slate-500">↗</span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <span>VEXORA · Analytics workspace</span>
          <span>Figures reflect records readable by the current Supabase session.</span>
        </footer>
      </div>
    </main>
  );
}
