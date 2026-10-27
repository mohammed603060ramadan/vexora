import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Reports | VEXORA Admin",
  description: "Live operational reports for VEXORA.",
};

type ReportItem = {
  label: string;
  table: string;
  href: string;
  description: string;
  count: number | null;
  error: string | null;
};

function formatCount(value: number | null) {
  if (value === null) return "Unavailable";
  return new Intl.NumberFormat("en-US").format(value);
}

export default async function AdminReportsPage() {
  await connection();

  const supabase = await createClient();
  const { data: authData, error: authError } =
    await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/login?next=/admin/reports");
  }

  if (authData.user.app_metadata?.role !== "admin") {
    redirect("/client");
  }

  const definitions = [
    {
      label: "Clients",
      table: "clients",
      href: "/admin/clients",
      description: "Registered clients",
    },
    {
      label: "Projects",
      table: "projects",
      href: "/admin/projects",
      description: "Projects recorded in the system",
    },
    {
      label: "Tasks",
      table: "tasks",
      href: "/admin/tasks",
      description: "Tasks recorded in the system",
    },
    {
      label: "Services",
      table: "services",
      href: "/admin/services",
      description: "Available company services",
    },
    {
      label: "Invoices",
      table: "invoices",
      href: "/admin/finance",
      description: "Financial records visible to your account",
    },
    {
      label: "Payments",
      table: "payments",
      href: "/admin/finance",
      description: "Payment records visible to your account",
    },
    {
      label: "Expenses",
      table: "expenses",
      href: "/admin/finance",
      description: "Expense records visible to your account",
    },
  ] as const;

  const results = await Promise.all(
    definitions.map(async (item): Promise<ReportItem> => {
      const { count, error } = await supabase
        .from(item.table as never)
        .select("id", { count: "exact", head: true });

      return {
        label: item.label,
        table: item.table,
        href: item.href,
        description: item.description,
        count: error ? null : (count ?? 0),
        error: error?.message ?? null,
      };
    }),
  );

  const failedCount = results.filter((item) => item.error).length;
  const availableCount = results.length - failedCount;

  return (
    <main className="min-h-screen bg-[#080b10] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm text-slate-400 transition hover:text-[#45a5ff]"
            >
              ← Back to Admin
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#45a5ff]">
              VEXORA / Analytics
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Operational Reports
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Live record counts retrieved from Supabase using your
              authenticated session and database access policies.
            </p>
          </div>

          <Link
            href="/admin/finance"
            className="inline-flex w-fit items-center rounded-xl border border-[#45a5ff]/30 bg-[#1687ff]/10 px-5 py-3 text-sm font-medium text-[#8bc7ff] transition hover:bg-[#1687ff]/20"
          >
            Open Finance →
          </Link>
        </header>

        {failedCount > 0 && (
          <section
            role="alert"
            className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5"
          >
            <h2 className="font-semibold text-amber-300">
              Some report queries failed
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {failedCount} of {results.length} queries could not be
              completed. Check the table names, Supabase connection,
              and Row Level Security policies. Unavailable counts are
              not displayed as zero.
            </p>
          </section>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Report sources</p>
            <p className="mt-3 text-3xl font-semibold">
              {results.length}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Configured database tables
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Available sources</p>
            <p className="mt-3 text-3xl font-semibold text-emerald-300">
              {availableCount}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Queries completed successfully
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Unavailable sources</p>
            <p className="mt-3 text-3xl font-semibold text-amber-300">
              {failedCount}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Requires investigation if nonzero
            </p>
          </div>

          <div className="rounded-2xl border border-[#45a5ff]/20 bg-[#1687ff]/[0.06] p-5">
            <p className="text-sm text-slate-400">Data access</p>
            <p className="mt-3 text-xl font-semibold text-[#8bc7ff]">
              Authenticated
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Uses the current Supabase session
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <h2 className="text-lg font-semibold">Database Overview</h2>
            <p className="mt-1 text-sm text-slate-400">
              Exact counts returned by Supabase, subject to database
              permissions and row-level security.
            </p>
          </div>

          <div className="divide-y divide-white/[0.07]">
            {results.map((item) => (
              <div
                key={item.table}
                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {item.description}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Table: {item.table}
                  </p>
                  {item.error && (
                    <p className="mt-2 break-words text-xs text-amber-300">
                      Query error: {item.error}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-5 sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-500">Records</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums">
                      {formatCount(item.count)}
                    </p>
                  </div>

                  <Link
                    href={item.href}
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-[#45a5ff]/40 hover:text-[#8bc7ff]"
                  >
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-xs leading-6 text-slate-500">
          VEXORA Admin · Reports use live database queries. Counts reflect
          rows visible to the signed-in account; they do not represent
          financial totals or guarantee that every record is visible.
        </footer>
      </div>
    </main>
  );
}
