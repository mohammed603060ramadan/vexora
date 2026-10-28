"use server";

import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Invoices | VEXORA Client Portal",
  description: "Review your VEXORA invoices, invoice items, and recorded payments.",
};

type Invoice = {
  id: string;
  invoice_number: number | string;
  project_id: string | null;
  issue_date: string;
  due_date: string | null;
  subtotal: number | string;
  discount_amount: number | string;
  tax_amount: number | string;
  total_amount: number | string;
  currency: string;
  status: string;
  notes: string | null;
};

type InvoiceItem = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number | string;
  unit_price: number | string;
  line_total: number | string;
};

type Payment = {
  id: string;
  invoice_id: string | null;
  payment_number: number | string;
  amount: number | string;
  currency: string;
  payment_method: string;
  status: string;
  paid_at: string | null;
};

const money = (amount: number | string, currency: string) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: (currency || "USD").trim(),
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const date = (value: string | null) => {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(parsed);
};

function statusStyle(value: string) {
  switch ( value ) {
    case "paid":
    case "completed":
      return "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";
    case "issued":
    case "partially_paid":
    case "pending":
      return "border-amber-400/25 bg-amber-400/10 text-amber-200";
    case "overdue":
    case "failed":
    case "void":
      return "border-rose-400/25 bg-rose-400/10 text-rose-300";
    default:
      return "border-slate-400/20 bg-slate-400/10 text-slate-300";
  }
}

function Status({ value }: { value: string }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle(value)}`}>
      {value.replaceAll("_", " ")}
    </span>
  );
}

export default async function ClientInvoicesPage() {
  await connection();
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/login?next=/client/invoices");
  }

  // Resolve ownership with the signed-in user's session. Never use the service
  // role here: invoice/payment visibility must continue to be enforced by RLS.
  let clientResult = await supabase
    .from("clients")
    .select("id, name, company:company_name")
    .eq("auth_user_id", authData.user.id)
    .maybeSingle();

  if (
    clientResult.error &&
    /auth_user_id|column .* does not exist|schema cache/i.test(clientResult.error.message)
  ) {
    clientResult = await supabase
      .from("clients")
      .select("id, name, company:company_name")
      .eq("user_id", authData.user.id)
      .maybeSingle();
  }

  if (clientResult.error) {
    console.error("Client invoice ownership lookup failed:", clientResult.error);
  }

  const client = clientResult.data;
  let invoices: Invoice[] = [];
  let items: InvoiceItem[] = [];
  let payments: Payment[] = [];
  let loadError = Boolean(clientResult.error);

  if (client) {
    const invoiceResult = await supabase
      .from("invoices" as never)
      .select("id, invoice_number, project_id, issue_date, due_date, subtotal, discount_amount, tax_amount, total_amount, currency, status, notes")
      .order("created_at", { ascending: false })
      .limit(100) as unknown as { data: Invoice[] | null; error: { message: string } | null };

    if (invoiceResult.error) {
      console.error("Client invoice list query failed:", invoiceResult.error);
      loadError = true;
    } else {
      invoices = invoiceResult.data ?? [];
    }

    const invoiceIds = invoices.map((invoice) => invoice.id);
    const [itemResult, paymentResult] = invoiceIds.length
      ? await Promise.all([
          supabase
            .from("invoice_items" as never)
            .select("id, invoice_id, description, quantity, unit_price, line_total")
            .in("invoice_id", invoiceIds) as unknown as Promise<{ data: InvoiceItem[] | null; error: { message: string } | null }>,
          supabase
            .from("payments" as never)
            .select("id, invoice_id, payment_number, amount, currency, payment_method, status, paid_at")
            .eq("client_id", client.id)
            .order("created_at", { ascending: false })
            .limit(100) as unknown as Promise<{ data: Payment[] | null; error: { message: string } | null }>,
        ])
      : [
          { data: [] as InvoiceItem[], error: null },
          await supabase
            .from("payments" as never)
            .select("id, invoice_id, payment_number, amount, currency, payment_method, status, paid_at")
            .eq("client_id", client.id)
            .order("created_at", { ascending: false })
            .limit(100) as unknown as { data: Payment[] | null; error: { message: string } | null },
        ];

    if (itemResult.error) {
      console.error("Client invoice items query failed:", itemResult.error);
      loadError = true;
    } else {
      items = itemResult.data ?? [];
    }

    if (paymentResult.error) {
      console.error("Client payment history query failed:", paymentResult.error);
      loadError = true;
    } else {
      payments = paymentResult.data ?? [];
    }
  }

  const itemsByInvoice = new Map<string, InvoiceItem[]>();
  for (const item of items) {
    const current = itemsByInvoice.get(item.invoice_id) ?? [];
    current.push(item);
    itemsByInvoice.set(item.invoice_id, current);
  }

  const dueInvoices = invoices.filter((invoice) =>
    ["issued", "partially_paid", "overdue"].includes(invoice.status),
  );
  const totalDueByCurrency = new Map<string, number>();
  for (const invoice of dueInvoices) {
    const currency = (invoice.currency || "USD").trim();
    totalDueByCurrency.set(
      currency,
      (totalDueByCurrency.get(currency) ?? 0) + Number(invoice.total_amount || 0),
    );
  }

  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/client" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <span aria-hidden="true">←</span> Back to client portal
        </Link>

        <header className="mt-7 flex flex-col justify-between gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">VEXORA · Client Finance</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Invoices & payments</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Review invoices issued to your account, itemized charges, due dates, and recorded payment history.
            </p>
            {client && <p className="mt-2 text-sm text-slate-300">{client.company || client.name || "Client account"}</p>}
          </div>
          <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200 transition hover:border-blue-300/60 hover:bg-blue-500/20">
            Contact VEXORA about billing
          </Link>
        </header>

        {loadError && (
          <section role="alert" className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] p-4 text-sm text-amber-100">
            Some finance records could not be loaded. Refresh the page or contact VEXORA support. No private database details are shown here.
          </section>
        )}

        {!client && !loadError && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="text-2xl" aria-hidden="true">◈</div>
            <h2 className="mt-4 text-xl font-semibold">Your client account is not linked yet</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              We could not find a client record linked to this signed-in account. Contact VEXORA support to connect your account; invoices will appear here once linked.
            </p>
            <Link href="/contact" className="mt-5 inline-flex rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-400">Contact support</Link>
          </section>
        )}

        {client && (
          <>
            <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/[0.13] to-white/[0.02] p-5">
                <p className="text-sm text-slate-400">Invoices on record</p>
                <p className="mt-3 text-3xl font-semibold tabular-nums">{invoices.length}</p>
                <p className="mt-2 text-xs text-slate-500">Latest 100 invoices for your account</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-slate-400">Open invoices</p>
                <p className="mt-3 text-3xl font-semibold tabular-nums">{dueInvoices.length}</p>
                <p className="mt-2 text-xs text-slate-500">Issued, partially paid, or overdue</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:col-span-2 xl:col-span-1">
                <p className="text-sm text-slate-400">Outstanding total</p>
                {totalDueByCurrency.size ? (
                  <div className="mt-3 space-y-1">
                    {[...totalDueByCurrency.entries()].map(([currency, amount]) => (
                      <p key={currency} className="text-2xl font-semibold tabular-nums">{money(amount, currency)}</p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-2xl font-semibold tabular-nums">{money(0, "USD")}</p>
                )}
                <p className="mt-2 text-xs text-slate-500">Currencies are shown separately, not combined</p>
              </article>
            </section>

            <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
              <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Your invoices</h2>
                  <p className="mt-1 text-sm text-slate-400">Open an invoice below to review its itemized charges.</p>
                </div>
              </div>
              {invoices.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-base font-medium text-slate-200">No invoices available</p>
                  <p className="mt-2 text-sm text-slate-500">New invoices will appear here when VEXORA issues them to your account.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.07]">
                  {invoices.map((invoice) => (
                    <details key={invoice.id} className="group">
                      <summary className="grid cursor-pointer list-none gap-3 px-5 py-5 transition hover:bg-white/[0.025] sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center">
                        <div>
                          <p className="font-semibold">Invoice #{invoice.invoice_number}</p>
                          <p className="mt-1 text-xs text-slate-500">Issued {date(invoice.issue_date)} · Due {date(invoice.due_date)}</p>
                        </div>
                        <p className="text-lg font-semibold tabular-nums">{money(invoice.total_amount, invoice.currency)}</p>
                        <Status value={invoice.status} />
                        <span className="text-xs text-slate-500 group-open:rotate-180" aria-hidden="true">⌄</span>
                      </summary>
                      <div className="border-t border-white/[0.06] bg-black/10 px-5 py-5">
                        {invoice.notes && <p className="mb-4 text-sm leading-6 text-slate-400">{invoice.notes}</p>}
                        {(itemsByInvoice.get(invoice.id) ?? []).length ? (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[540px] text-left text-sm">
                              <thead className="text-xs uppercase tracking-wider text-slate-500">
                                <tr><th className="py-2 pr-4 font-medium">Description</th><th className="py-2 pr-4 text-right font-medium">Qty</th><th className="py-2 pr-4 text-right font-medium">Unit price</th><th className="py-2 text-right font-medium">Total</th></tr>
                              </thead>
                              <tbody>
                                {(itemsByInvoice.get(invoice.id) ?? []).map((item) => (
                                  <tr key={item.id} className="border-t border-white/[0.06]">
                                    <td className="py-3 pr-4 text-slate-200">{item.description}</td>
                                    <td className="py-3 pr-4 text-right tabular-nums text-slate-400">{Number(item.quantity).toLocaleString("en")}</td>
                                    <td className="py-3 pr-4 text-right tabular-nums text-slate-400">{money(item.unit_price, invoice.currency)}</td>
                                    <td className="py-3 text-right tabular-nums text-slate-200">{money(item.line_total, invoice.currency)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">No line items are attached to this invoice yet.</p>
                        )}
                        <div className="mt-5 ml-auto max-w-sm space-y-2 border-t border-white/10 pt-4 text-sm">
                          <div className="flex justify-between gap-4 text-slate-400"><span>Subtotal</span><span>{money(invoice.subtotal, invoice.currency)}</span></div>
                          <div className="flex justify-between gap-4 text-slate-400"><span>Discount</span><span>−{money(invoice.discount_amount, invoice.currency)}</span></div>
                          <div className="flex justify-between gap-4 text-slate-400"><span>Tax</span><span>{money(invoice.tax_amount, invoice.currency)}</span></div>
                          <div className="flex justify-between gap-4 border-t border-white/10 pt-3 font-semibold text-white"><span>Total</span><span>{money(invoice.total_amount, invoice.currency)}</span></div>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
              <div className="border-b border-white/10 px-5 py-5">
                <h2 className="text-lg font-semibold">Payment history</h2>
                <p className="mt-1 text-sm text-slate-400">Recorded payment attempts and their current status.</p>
              </div>
              {payments.length === 0 ? (
                <div className="px-5 py-10 text-sm text-slate-500">No payment records are available for your account yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500">
                      <tr><th className="px-5 py-3 font-medium">Payment</th><th className="px-5 py-3 font-medium">Invoice</th><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Method</th><th className="px-5 py-3 font-medium">Amount</th><th className="px-5 py-3 font-medium">Status</th></tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-t border-white/[0.06]">
                          <td className="px-5 py-4 font-medium">#{payment.payment_number}</td>
                          <td className="px-5 py-4 text-slate-400">{payment.invoice_id ? invoices.find((invoice) => invoice.id === payment.invoice_id)?.invoice_number ?? "—" : "Unallocated"}</td>
                          <td className="px-5 py-4 text-slate-400">{date(payment.paid_at)}</td>
                          <td className="px-5 py-4 capitalize text-slate-400">{payment.payment_method.replaceAll("_", " ")}</td>
                          <td className="px-5 py-4 font-medium tabular-nums">{money(payment.amount, payment.currency)}</td>
                          <td className="px-5 py-4"><Status value={payment.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
        <footer className="mt-8 border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">
          Invoice records are read-only in this portal. For corrections or billing questions, contact VEXORA support.
        </footer>
      </div>
    </main>
  );
}
