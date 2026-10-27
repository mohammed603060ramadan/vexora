import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Quotation = {
  id: string;
  quotation_number?: number | string | null;
  title?: string | null;
  status?: string | null;
  currency?: string | null;
  total_amount?: number | string | null;
  amount?: number | string | null;
  valid_until?: string | null;
  created_at?: string | null;
  client_id?: string | null;
  request_id?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAmount(
  value: number | string | null | undefined,
  currency?: string | null
) {
  if (value === null || value === undefined || value === "") return "—";

  const amount = Number(value);
  if (!Number.isFinite(amount)) return String(value);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "EGP",
    maximumFractionDigits: 2,
  }).format(amount);
}

function statusStyle(status?: string | null) {
  switch ((status || "").toLowerCase()) {
    case "approved":
    case "accepted":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "rejected":
    case "declined":
    case "expired":
      return "border-red-400/20 bg-red-400/10 text-red-300";
    case "sent":
    case "pending":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    default:
      return "border-blue-400/20 bg-blue-400/10 text-blue-300";
  }
}

export default async function QuotationsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quotations" as never)
    .select("*")
    .order("created_at", { ascending: false });

  const quotations = (data || []) as Quotation[];

  const total = quotations.length;
  const accepted = quotations.filter((item) =>
    ["approved", "accepted"].includes((item.status || "").toLowerCase())
  ).length;
  const pending = quotations.filter((item) =>
    ["pending", "sent", "draft"].includes((item.status || "").toLowerCase())
  ).length;

  const totalValue = quotations.reduce((sum, item) => {
    const value = Number(item.total_amount ?? item.amount ?? 0);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  return (
    <main className="min-h-screen bg-[#080b10] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="text-sm text-blue-400 transition hover:text-blue-300"
        >
          ← Back to dashboard
        </Link>

        <header className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Sales & Finance
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Quotations
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Review customer quotations and their current status.
            </p>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total quotations", value: String(total) },
            { label: "Accepted", value: String(accepted) },
            { label: "Awaiting response", value: String(pending) },
            {
              label: "Combined value",
              value: formatAmount(totalValue, "EGP"),
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-[#0d121b] p-5"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-3 break-words text-2xl font-semibold">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0d121b]">
          <div className="border-b border-white/10 p-5">
            <h2 className="text-lg font-semibold">All quotations</h2>
            <p className="mt-1 text-sm text-slate-400">
              Latest quotations appear first.
            </p>
          </div>

          {error ? (
            <div className="p-6">
              <p className="font-medium text-red-300">
                Unable to load quotations
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Check the quotations table schema and your account permissions.
              </p>
            </div>
          ) : quotations.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium">No quotations found</p>
              <p className="mt-2 text-sm text-slate-400">
                Quotations will appear here once they exist in the database.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Quotation</th>
                    <th className="px-5 py-4">Value</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Valid until</th>
                    <th className="px-5 py-4">Created</th>
                    <th className="px-5 py-4">Related records</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {quotations.map((item) => (
                    <tr key={item.id} className="align-top hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {item.title ||
                            (item.quotation_number
                              ? `Quotation #${item.quotation_number}`
                              : `Quotation ${item.id.slice(0, 8)}`)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.quotation_number
                            ? `Reference #${item.quotation_number}`
                            : item.id}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-medium">
                        {formatAmount(
                          item.total_amount ?? item.amount,
                          item.currency
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs capitalize ${statusStyle(item.status)}`}
                        >
                          {(item.status || "unknown").replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                        {formatDate(item.valid_until)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400">
                        <p>Client: {item.client_id || "—"}</p>
                        <p className="mt-1">Request: {item.request_id || "—"}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-white/10 px-5 py-3 text-xs text-slate-500">
            {total} quotation{total === 1 ? "" : "s"} found
          </div>
        </section>
      </div>
    </main>
  );
}
