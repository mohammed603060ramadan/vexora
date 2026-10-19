import Link from "next/link";
import { connection } from "next/server";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Row = Record<string, unknown>;
type Section = "invoices" | "payments" | "expenses";

const config: Record<
  Section,
  {
    title: string;
    description: string;
    table: string;
    columns: { key: string; label: string }[];
  }
> = {
  invoices: {
    title: "Invoices",
    description: "Review invoice totals, due dates, and payment status.",
    table: "invoices",
    columns: [
      { key: "invoice_number", label: "Invoice #" },
      { key: "issue_date", label: "Issue date" },
      { key: "due_date", label: "Due date" },
      { key: "total_amount", label: "Total" },
      { key: "currency", label: "Currency" },
      { key: "status", label: "Status" },
    ],
  },
  payments: {
    title: "Payments",
    description: "Review recorded payments and their transaction details.",
    table: "payments",
    columns: [
      { key: "payment_number", label: "Payment #" },
      { key: "paid_at", label: "Paid at" },
      { key: "amount", label: "Amount" },
      { key: "currency", label: "Currency" },
      { key: "payment_method", label: "Method" },
      { key: "status", label: "Status" },
    ],
  },
  expenses: {
    title: "Expenses",
    description: "Review recorded expenses, dates, and payment status.",
    table: "expenses",
    columns: [
      { key: "expense_number", label: "Expense #" },
      { key: "title", label: "Title" },
      { key: "expense_date", label: "Expense date" },
      { key: "amount", label: "Amount" },
      { key: "currency", label: "Currency" },
      { key: "status", label: "Status" },
    ],
  },
};

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return "Details available";
  }

  return String(value);
}

function formatDate(value: unknown): string {
  if (typeof value !== "string" || !value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function isDateColumn(key: string): boolean {
  return key.endsWith("_date") || key === "paid_at";
}

export default async function FinanceSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  await connection();

  const { section } = await params;

  if (
    section !== "invoices" &&
    section !== "payments" &&
    section !== "expenses"
  ) {
    notFound();
  }

  const current = config[section as Section];
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?next=/admin/finance/" + section);
  }

  if (user.app_metadata?.role !== "admin") {
    redirect("/client");
  }

  const { data, error } = await supabase
    .from(current.table)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as unknown as Row[];
  const amountKey =
    section === "invoices"
      ? "total_amount"
      : "amount";

  const total = rows.reduce((sum, row) => {
    const value = row[amountKey];

    if (typeof value === "number") return sum + value;

    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return sum + parsed;
    }

    return sum;
  }, 0);

  const currencies = Array.from(
    new Set(
      rows
        .map((row) => row.currency)
        .filter(
          (currency): currency is string =>
            typeof currency === "string" && currency.length > 0,
        ),
    ),
  );

  return (
    <main className="min-h-screen bg-[#080b10] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/finance"
              className="mb-3 inline-flex text-sm text-blue-400 transition hover:text-blue-300"
            >
              ← Back to Finance
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
              VEXORA / Administration
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {current.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              {current.description}
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex w-fit items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium transition hover:bg-white/[0.08]"
          >
            Admin dashboard
          </Link>
        </header>

        <nav className="flex flex-wrap gap-2" aria-label="Finance sections">
          {(
            [
              ["invoices", "Invoices"],
              ["payments", "Payments"],
              ["expenses", "Expenses"],
            ] as const
          ).map(([key, label]) => (
            <Link
              key={key}
              href={`/admin/finance/${key}`}
              aria-current={section === key ? "page" : undefined}
              className={`rounded-xl border px-4 py-2.5 text-sm transition ${
                section === key
                  ? "border-blue-400/40 bg-blue-500/15 text-blue-300"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#10151e] p-5">
            <p className="text-sm text-slate-400">Records loaded</p>
            <p className="mt-3 text-3xl font-bold tabular-nums">
              {error ? "—" : rows.length}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Latest 100 records at most
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#10151e] p-5">
            <p className="text-sm text-slate-400">
              Sum of displayed amounts
            </p>
            <p className="mt-3 break-words text-3xl font-bold tabular-nums">
              {error
                ? "—"
                : new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 2,
                  }).format(total)}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {currencies.length === 0
                ? "Currency totals are not consolidated"
                : currencies.length === 1
                  ? `Currency: ${currencies[0]}`
                  : "Multiple currencies — totals are not comparable"}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#10151e]">
          <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold">{current.title} register</h2>
            <span className="text-xs text-slate-500">
              Read-only view · Supabase access policies apply
            </span>
          </div>

          {error ? (
            <div
              role="alert"
              className="m-5 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300"
            >
              <p className="font-semibold">
                Could not load {current.title.toLowerCase()}.
              </p>
              <p className="mt-2 break-words text-red-200/80">
                {error.message}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Check the table schema, Supabase connection, and the current
                user&apos;s read permissions. No database changes were made.
              </p>
            </div>
          ) : rows.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="font-medium text-slate-200">
                No {current.title.toLowerCase()} found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Records will appear here when available to your account.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    {current.columns.map((column) => (
                      <th key={column.key} className="px-5 py-4 font-medium">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {rows.map((row, index) => (
                    <tr
                      key={
                        typeof row.id === "string" ||
                        typeof row.id === "number"
                          ? String(row.id)
                          : `${section}-${index}`
                      }
                      className="transition hover:bg-white/[0.025]"
                    >
                      {current.columns.map((column) => {
                        const raw = row[column.key];
                        const value = isDateColumn(column.key)
                          ? formatDate(raw)
                          : displayValue(raw);
                        const isStatus = column.key === "status";

                        return (
                          <td
                            key={column.key}
                            className="whitespace-nowrap px-5 py-4 text-slate-300"
                          >
                            {isStatus ? (
                              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs">
                                {value}
                              </span>
                            ) : (
                              value
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="text-xs leading-5 text-slate-500">
          This page displays records returned by Supabase under the current
          account&apos;s permissions. The sum covers only the displayed records
          and is not an accounting balance or a full-ledger total.
        </p>
      </div>
    </main>
  );
}

