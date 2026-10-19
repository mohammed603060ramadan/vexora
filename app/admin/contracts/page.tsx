import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Contract = {
  id: string;
  contract_number?: string | number | null;
  title?: string | null;
  name?: string | null;
  status?: string | null;
  currency?: string | null;
  total_amount?: number | string | null;
  amount?: number | string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
  client_id?: string | null;
  project_id?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAmount(value: number | string | null | undefined, currency = "USD") {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: /^[A-Z]{3}$/.test(currency) ? currency : "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function statusStyle(status?: string | null) {
  const normalized = (status ?? "unknown").toLowerCase();

  if (["active", "signed", "approved", "completed"].includes(normalized)) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (["draft", "pending", "review"].includes(normalized)) {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  if (["cancelled", "canceled", "terminated", "rejected", "expired"].includes(normalized)) {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }

  return "border-white/10 bg-white/5 text-slate-300";
}

export default async function AdminContractsPage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return (
      <main className="min-h-screen bg-[#080b10] p-6 text-white">
        <h1 className="text-xl font-semibold">Access restricted</h1>
        <p className="mt-2 text-sm text-slate-400">
          You do not have permission to view contract records.
        </p>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const contracts = (data ?? []) as Contract[];
  const total = contracts.length;
  const active = contracts.filter((item) =>
    ["active", "signed", "approved"].includes((item.status ?? "").toLowerCase()),
  ).length;
  const pending = contracts.filter((item) =>
    ["draft", "pending", "review"].includes((item.status ?? "").toLowerCase()),
  ).length;
  const value = contracts.reduce(
    (sum, item) => sum + Number(item.total_amount ?? item.amount ?? 0),
    0,
  );

  return (
    <main className="min-h-screen bg-[#080b10] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex text-sm text-slate-400 transition hover:text-[#45a5ff]"
            >
              ← Back to Dashboard
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
              VEXORA / Administration
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Contracts
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Review contract records and monitor their current status.
            </p>
          </div>

          <Link
            href="/admin/projects"
            className="rounded-xl border border-[#45a5ff]/30 bg-[#1687ff]/10 px-4 py-3 text-sm font-medium text-[#8bc7ff] transition hover:bg-[#1687ff]/20"
          >
            View Projects →
          </Link>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5">
            <h2 className="font-medium text-rose-300">
              Could not load contracts
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Supabase did not return the contract records. Check that the
              contracts table exists and that your current account has the
              required read permissions.
            </p>
            <p className="mt-2 break-words text-xs text-slate-500">
              {error.message}
            </p>
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Loaded Contracts", value: total.toString(), detail: "Latest 100 records at most" },
            { label: "Active / Signed", value: active.toString(), detail: "Among the loaded records" },
            { label: "Pending / Draft", value: pending.toString(), detail: "Among the loaded records" },
            { label: "Loaded Contract Value", value: formatAmount(value), detail: "Based on returned records" },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-white/[0.08] bg-[#0d121b] p-5"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-3 break-words text-2xl font-semibold tracking-tight">
                {item.value}
              </p>
              <p className="mt-2 text-xs text-slate-500">{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d121b]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-lg font-semibold">Contract Register</h2>
              <p className="mt-1 text-sm text-slate-400">
                Records returned by Supabase under your current permissions.
              </p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
              Read-only
            </span>
          </div>

          {!error && contracts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl text-slate-400">
                §
              </div>
              <h3 className="mt-4 font-medium">No contracts found</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                No contract records were returned. Confirm the table and
                permissions if you expected to see data here.
              </p>
            </div>
          ) : !error ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Contract</th>
                    <th className="px-6 py-4 font-medium">Client ID</th>
                    <th className="px-6 py-4 font-medium">Project ID</th>
                    <th className="px-6 py-4 font-medium">Value</th>
                    <th className="px-6 py-4 font-medium">Start Date</th>
                    <th className="px-6 py-4 font-medium">End Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="transition hover:bg-white/[0.025]">
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">
                          <Link href={`/admin/contracts/${encodeURIComponent(contract.id)}`} className="transition hover:text-blue-400">{contract.title || contract.name || "Untitled contract"}</Link>
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {contract.contract_number != null
                            ? `Contract #${contract.contract_number}`
                            : `ID: ${contract.id}`}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        {contract.client_id || "—"}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        {contract.project_id || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-200">
                        {formatAmount(contract.total_amount ?? contract.amount, contract.currency ?? "EGP")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                        {formatDate(contract.start_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                        {formatDate(contract.end_date)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${statusStyle(contract.status)}`}>
                          {(contract.status || "Unknown").replaceAll("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <div className="border-t border-white/[0.08] px-5 py-4 text-xs leading-5 text-slate-500 sm:px-6">
            This page is read-only. It does not create, sign, update, or delete
            contracts, and it does not assume that missing records are valid.
          </div>
        </section>
      </div>
    </main>
  );
}


