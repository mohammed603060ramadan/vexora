import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Finance | VEXORA Admin",
  description: "Financial overview for VEXORA.",
};


type Invoice = {
  id: string;
  invoice_number: number;
  total_amount: number | string;
  currency: string;
  status: string;
  issue_date: string;
  due_date: string | null;
};

type Payment = {
  id: string;
  payment_number: number;
  amount: number | string;
  currency: string;
  status: string;
  paid_at: string | null;
};

type Expense = {
  id: string;
  title: string;
  amount: number | string;
  currency: string;
  status: string;
  expense_date: string;
};

function formatMoney(amount: number | string, currency: string) {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "—";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.trim() || "USD",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(date);
}

function statusClass(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
    case "completed":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "overdue":
    case "failed":
    case "cancelled":
      return "border-red-400/30 bg-red-400/10 text-red-300";
    case "issued":
    case "pending":
    case "partially_paid":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    default:
      return "border-white/10 bg-white/5 text-slate-300";
  }
}

function Status({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(value)}`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}

export default async function AdminFinancePage() {
  await connection();

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/login?next=/admin/finance");
  }

  const role = authData.user.app_metadata?.role;

  if (role !== "admin") {
    redirect("/client");
  }

  const [
    invoicesResult,
    paymentsResult,
    expensesResult,
  ] = await Promise.all([
    supabase
      .from("invoices")
      .select("id, invoice_number, total_amount, currency, status, issue_date, due_date")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("payments")
      .select("id, payment_number, amount, currency, status, paid_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("expenses")
      .select("id, title, amount, currency, status, expense_date")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const invoices = (invoicesResult.data ?? []) as Invoice[];
  const payments = (paymentsResult.data ?? []) as Payment[];
  const expenses = (expensesResult.data ?? []) as Expense[];

  const queryErrors = [
    invoicesResult.error,
    paymentsResult.error,
    expensesResult.error,
  ].filter(Boolean);

  const outstandingInvoices = invoices.filter((invoice) =>
    ["issued", "partially_paid", "overdue"].includes(invoice.status),
  );

  const completedPayments = payments.filter(
    (payment) => payment.status === "completed",
  );

  const recordedExpenses = expenses.filter(
    (expense) => expense.status === "recorded",
  );

  const totalOutstanding = outstandingInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.total_amount || 0),
    0,
  );

  const totalPayments = completedPayments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0,
  );

  const totalExpenses = recordedExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0,
  );

  const cards = [
    {
      label: "Outstanding invoices",
      value: String(outstandingInvoices.length),
      detail: "Across the latest 10 invoices",
    },
    {
      label: "Outstanding value",
      value: formatMoney(totalOutstanding, outstandingInvoices[0]?.currency ?? "USD"),
      detail: "Latest invoices only; currencies are not consolidated",
    },
    {
      label: "Completed payments",
      value: String(completedPayments.length),
      detail: `Latest 10 payments; recorded value ${formatMoney(totalPayments, completedPayments[0]?.currency ?? "USD")}`,
    },
    {
      label: "Recorded expenses",
      value: String(recordedExpenses.length),
      detail: `Latest 10 expenses; recorded value ${formatMoney(totalExpenses, recordedExpenses[0]?.currency ?? "USD")}`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#080b10] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
              VEXORA / Administration
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Finance overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Review recent invoices, payments, and recorded expenses.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex w-fit items-center rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-[#45a5ff]/50 hover:text-white"
          >
            ← Back to dashboard
          </Link>
        </header>

        {queryErrors.length > 0 && (
          <section
            role="alert"
            className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-200"
          >
            Some finance data could not be loaded. Check the Supabase table
            permissions and database schema. No financial data has been
            modified.
          </section>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {card.value}
              </p>
              <p className="mt-2 text-xs text-slate-500">{card.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-semibold">Latest invoices</h2>
            <p className="mt-1 text-sm text-slate-400">
              Recent invoices visible to your account.
            </p>

            {invoices.length === 0 ? (
              <p className="py-8 text-sm text-slate-500">
                No invoices to display.
              </p>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[540px] text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500">
                    <tr>
                      <th className="pb-3 pr-4 font-medium">Invoice</th>
                      <th className="pb-3 pr-4 font-medium">Issued</th>
                      <th className="pb-3 pr-4 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-t border-white/5"
                      >
                        <td className="py-3 pr-4 font-medium">
                          #{invoice.invoice_number}
                        </td>
                        <td className="py-3 pr-4 text-slate-400">
                          {formatDate(invoice.issue_date)}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          {formatMoney(invoice.total_amount, invoice.currency)}
                        </td>
                        <td className="py-3">
                          <Status value={invoice.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-semibold">Latest payments</h2>
            <p className="mt-1 text-sm text-slate-400">
              Recent payment records and their status.
            </p>

            {payments.length === 0 ? (
              <p className="py-8 text-sm text-slate-500">
                No payments to display.
              </p>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500">
                    <tr>
                      <th className="pb-3 pr-4 font-medium">Payment</th>
                      <th className="pb-3 pr-4 font-medium">Date</th>
                      <th className="pb-3 pr-4 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-t border-white/5"
                      >
                        <td className="py-3 pr-4 font-medium">
                          #{payment.payment_number}
                        </td>
                        <td className="py-3 pr-4 text-slate-400">
                          {formatDate(payment.paid_at)}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          {formatMoney(payment.amount, payment.currency)}
                        </td>
                        <td className="py-3">
                          <Status value={payment.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-semibold">Latest expenses</h2>
          <p className="mt-1 text-sm text-slate-400">
            Recent operational expense records.
          </p>

          {expenses.length === 0 ? (
            <p className="py-8 text-sm text-slate-500">
              No expenses to display.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[580px] text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="pb-3 pr-4 font-medium">Expense</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 pr-4 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-t border-white/5">
                      <td className="py-3 pr-4 font-medium">{expense.title}</td>
                      <td className="py-3 pr-4 text-slate-400">
                        {formatDate(expense.expense_date)}
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {formatMoney(expense.amount, expense.currency)}
                      </td>
                      <td className="py-3">
                        <Status value={expense.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="border-t border-white/10 pt-4 text-xs text-slate-500">
          Financial figures shown here are based on the latest records returned
          by the database, not full accounting totals. Different currencies are
          not combined into a single monetary total.
        </footer>
      </div>
    </main>
  );
}


