import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ServiceRequest = {
  id: string;
  request_number: number | string;
  client_id: string;
  service_id: string | null;
  assigned_to: string | null;
  title: string;
  description: string | null;
  budget_min: number | string | null;
  budget_max: number | string | null;
  currency: string | null;
  status: string;
  priority: string;
  requested_at: string | null;
  due_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatBudget(
  min: number | string | null,
  max: number | string | null,
  currency: string | null
) {
  const format = (value: number | string) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return String(value);

    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const hasMin = min !== null && min !== "";
  const hasMax = max !== null && max !== "";

  if (!hasMin && !hasMax) return "Not specified";

  const unit = currency || "EGP";

  if (hasMin && hasMax) {
    return `${format(min!)} – ${format(max!)} ${unit}`;
  }

  return `${format((hasMin ? min : max)!)} ${unit}`;
}

function statusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
    case "approved":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "rejected":
    case "cancelled":
      return "border-red-400/20 bg-red-400/10 text-red-300";
    case "in_progress":
    case "reviewing":
    case "quoted":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    default:
      return "border-blue-400/20 bg-blue-400/10 text-blue-300";
  }
}

function priorityStyle(priority: string) {
  switch (priority.toLowerCase()) {
    case "urgent":
      return "text-red-300";
    case "high":
      return "text-orange-300";
    case "medium":
      return "text-amber-300";
    default:
      return "text-slate-400";
  }
}

export default async function ServiceRequestsPage() {
  await connection();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("service_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const requests = (data || []) as ServiceRequest[];

  const activeCount = requests.filter((item) =>
    ["new", "reviewing", "quoted", "approved", "in_progress"].includes(
      (item.status || "").toLowerCase()
    )
  ).length;

  const completedCount = requests.filter(
    (item) => item.status?.toLowerCase() === "completed"
  ).length;

  const urgentCount = requests.filter(
    (item) => item.priority?.toLowerCase() === "urgent"
  ).length;

  return (
    <main className="min-h-screen bg-[#080b10] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="text-sm text-blue-400 transition hover:text-blue-300"
        >
          ← Back to dashboard
        </Link>

        <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Operations
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Service Requests
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Track incoming service requests, priorities, and deadlines.
            </p>
          </div>

          <Link
            href="/admin/quotations"
            className="inline-flex w-fit items-center rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:border-blue-400/40 hover:text-white"
          >
            View quotations →
          </Link>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total requests", value: requests.length },
            { label: "Active requests", value: activeCount },
            { label: "Completed", value: completedCount },
            { label: "Urgent priority", value: urgentCount },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-[#0d121b] p-5"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold tabular-nums">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0d121b]">
          <div className="border-b border-white/10 p-5">
            <h2 className="text-lg font-semibold">All service requests</h2>
            <p className="mt-1 text-sm text-slate-400">
              Requests are sorted by creation date, newest first.
            </p>
          </div>

          {error ? (
            <div className="p-6">
              <p className="font-medium text-red-300">
                Unable to load service requests
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Verify the service_requests table, database connection, and
                access permissions.
              </p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium">No service requests yet</p>
              <p className="mt-2 text-sm text-slate-400">
                New requests will appear here when records are added.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Request</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Priority</th>
                    <th className="px-5 py-4">Budget</th>
                    <th className="px-5 py-4">Requested</th>
                    <th className="px-5 py-4">Due date</th>
                    <th className="px-5 py-4">Related records</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.06]">
                  {requests.map((item) => (
                    <tr
                      key={item.id}
                      className="align-top transition hover:bg-white/[0.02]"
                    >
                      <td className="max-w-sm px-5 py-4">
                        <p className="font-medium">
                          {item.title || `Request #${item.request_number}`}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Request #{item.request_number}
                        </p>
                        {item.description && (
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
                            {item.description}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs ${statusStyle(item.status || "")}`}
                        >
                          {(item.status || "unknown").replaceAll("_", " ")}
                        </span>
                      </td>

                      <td
                        className={`px-5 py-4 font-medium capitalize ${priorityStyle(item.priority || "")}`}
                      >
                        {item.priority || "Normal"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                        {formatBudget(
                          item.budget_min,
                          item.budget_max,
                          item.currency
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                        {formatDate(item.requested_at || item.created_at)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                        {formatDate(item.due_date)}
                      </td>

                      <td className="max-w-[220px] px-5 py-4 text-xs text-slate-400">
                        <p className="break-all">
                          Client: {item.client_id || "—"}
                        </p>
                        <p className="mt-2 break-all">
                          Service: {item.service_id || "—"}
                        </p>
                        {item.assigned_to && (
                          <p className="mt-2 break-all">
                            Assigned to: {item.assigned_to}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-white/10 px-5 py-3 text-xs text-slate-500">
            {requests.length} request{requests.length === 1 ? "" : "s"} found
          </div>
        </section>
      </div>
    </main>
  );
}
