import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Contract = {
  id: string;
  contract_number: string | null;
  title: string | null;
  name: string | null;
  status: string | null;
  currency: string | null;
  total_amount: number | string | null;
  amount: number | string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  client_id: string | null;
  project_id: string | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAmount(value: number | string | null, currency: string | null) {
  if (value === null || value === "") return "—";

  const amount = Number(value);
  if (!Number.isFinite(amount)) return String(value);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "EGP",
    maximumFractionDigits: 2,
  }).format(amount);
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm font-medium text-slate-100">
        {value || "—"}
      </p>
    </div>
  );
}

export default async function ContractDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <main className="min-h-screen bg-[#080b10] px-5 py-10 text-white sm:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
          <h1 className="text-xl font-semibold">Unable to load contract</h1>
          <p className="mt-2 text-sm text-slate-400">
            The contract could not be retrieved. Check the database schema and
            your account permissions, then try again.
          </p>
          <Link
            href="/admin/contracts"
            className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            Back to contracts
          </Link>
        </div>
      </main>
    );
  }

  if (!data) notFound();

  const contract = data as Contract;
  const title = contract.title || contract.name || "Untitled contract";
  const status = (contract.status || "unknown").replaceAll("_", " ");

  return (
    <main className="min-h-screen bg-[#080b10] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/contracts"
          className="text-sm text-blue-400 transition hover:text-blue-300"
        >
          ← Back to contracts
        </Link>

        <header className="mt-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Contract details
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Contract number: {contract.contract_number || contract.id}
            </p>
          </div>

          <span className="w-fit rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-medium capitalize text-blue-300">
            {status}
          </span>
        </header>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Financial information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Detail
              label="Contract value"
              value={formatAmount(
                contract.total_amount ?? contract.amount,
                contract.currency
              )}
            />
            <Detail label="Currency" value={contract.currency || "EGP"} />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Contract timeline</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Detail label="Start date" value={formatDate(contract.start_date)} />
            <Detail label="End date" value={formatDate(contract.end_date)} />
            <Detail
              label="Created at"
              value={formatDate(contract.created_at)}
            />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Related records</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Detail label="Client ID" value={contract.client_id || "—"} />
            <Detail label="Project ID" value={contract.project_id || "—"} />
          </div>
        </section>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-400">
          This page is read-only. Contract editing, document uploads, and
          electronic signatures are not enabled here.
        </div>
      </div>
    </main>
  );
}
