
"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";

type Service = {
  id: string;
  department_id: string | null;
  slug: string;
  name: string;
  description: string | null;
  starting_price: number | null;
  currency: string;
  estimated_days: number | null;
  status: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

type ServiceForm = {
  name: string;
  slug: string;
  description: string;
  starting_price: string;
  currency: string;
  estimated_days: string;
  status: string;
  display_order: string;
};

const emptyForm: ServiceForm = {
  name: "",
  slug: "",
  description: "",
  starting_price: "",
  currency: "USD",
  estimated_days: "",
  status: "active",
  display_order: "0",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0b111b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500";

const labelClass = "mb-2 block text-sm font-medium text-slate-300";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const dbError = error as {
      message?: unknown;
      code?: unknown;
      details?: unknown;
      hint?: unknown;
    };

    const message =
      typeof dbError.message === "string"
        ? dbError.message
        : "An unexpected database error occurred.";
    const code =
      typeof dbError.code === "string" ? dbError.code : "";
    const details =
      typeof dbError.details === "string" ? dbError.details : "";
    const hint =
      typeof dbError.hint === "string" ? dbError.hint : "";

    console.error("[Admin Services] Supabase operation failed", {
      code: code || undefined,
      message,
      details: details || undefined,
      hint: hint || undefined,
    });

    if (/duplicate key|unique constraint/i.test(message)) {
      return "This slug is already in use. Choose another slug.";
    }

    if (/foreign key constraint/i.test(message)) {
      return "This service cannot be changed because related records exist.";
    }

    return [
      code ? `Database error (${code})` : "Database error",
      message,
      details ? `Details: ${details}` : "",
      hint ? `Hint: ${hint}` : "",
    ]
      .filter(Boolean)
      .join(" — ");
  }

  return "An unexpected error occurred. Please try again.";
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("services")
        .select(
          "id, department_id, slug, name, description, starting_price, currency, estimated_days, status, display_order, created_at, updated_at",
        )
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setServices((data ?? []) as Service[]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeServices() {
      try {
        const { data, error: queryError } = await supabase
          .from("services")
          .select(
            "id, department_id, slug, name, description, starting_price, currency, estimated_days, status, display_order, created_at, updated_at",
          )
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (queryError) throw queryError;

        if (!cancelled) {
          setServices((data ?? []) as Service[]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializeServices();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredServices = services.filter((service) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      service.name.toLowerCase().includes(searchText) ||
      service.slug.toLowerCase().includes(searchText) ||
      (service.description ?? "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || service.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function updateForm<K extends keyof ServiceForm>(
    key: K,
    value: ServiceForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setSlugManuallyEdited(false);
    setShowForm(true);
    setMessage("");
    setError("");
  }

  function openEditForm(service: Service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      slug: service.slug,
      description: service.description ?? "",
      starting_price:
        service.starting_price === null
          ? ""
          : String(service.starting_price),
      currency: service.currency.trim() || "USD",
      estimated_days:
        service.estimated_days === null
          ? ""
          : String(service.estimated_days),
      status: service.status,
      display_order: String(service.display_order),
    });
    setSlugManuallyEdited(true);
    setShowForm(true);
    setMessage("");
    setError("");
  }

  function closeForm() {
    if (saving) return;
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const name = form.name.trim();
    const slug = slugify(form.slug);

    if (!name) {
      setError("Enter a service name.");
      return;
    }

    if (!slug) {
      setError(
        "Enter a valid slug using English letters or numbers.",
      );
      return;
    }

    const price =
      form.starting_price.trim() === ""
        ? null
        : Number(form.starting_price);

    const days =
      form.estimated_days.trim() === ""
        ? null
        : Number(form.estimated_days);

    const displayOrder = Number(form.display_order);

    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      setError("Price must be a number greater than or equal to zero.");
      return;
    }

    if (days !== null && (!Number.isInteger(days) || days < 0)) {
      setError("Duration must be a whole number of days greater than or equal to zero.");
      return;
    }

    if (!Number.isInteger(displayOrder)) {
      setError("Display order must be a whole number.");
      return;
    }

    const currency = form.currency.trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(currency)) {
      setError("Currency must be a three-letter code, such as USD or EGP.");
      return;
    }

    if (!["active", "inactive"].includes(form.status)) {
      setError("Invalid service status.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name,
        slug,
        description: form.description.trim() || null,
        starting_price: price,
        currency,
        estimated_days: days,
        status: form.status,
        display_order: displayOrder,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from("services")
          .update(payload as never)
          .eq("id", editingId);

        if (updateError) throw updateError;

        setMessage("Service updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("services")
          .insert(payload as never);

        if (insertError) throw insertError;

        setMessage("Service created successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setSlugManuallyEdited(false);
      await loadServices();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(service: Service) {
    if (busyId) return;

    const nextStatus =
      service.status === "active" ? "inactive" : "active";

    const confirmed = window.confirm(
      `Change the status of service "${service.name}" to ${
        nextStatus === "active" ? "Active" : "Inactive"
      }?`,
    );

    if (!confirmed) return;

    setBusyId(service.id);
    setError("");
    setMessage("");

    try {
      const { error: updateError } = await supabase
        .from("services")
        .update({ status: nextStatus })
        .eq("id", service.id);

      if (updateError) throw updateError;

      setServices((current) =>
        current.map((item) =>
          item.id === service.id
            ? { ...item, status: nextStatus }
            : item,
        ),
      );

      setMessage("Service status updated.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function deleteService(service: Service) {
    if (busyId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete service "${service.name}"? This deletion cannot be undone.`,
    );

    if (!confirmed) return;

    setBusyId(service.id);
    setError("");
    setMessage("");

    try {
      const { error: deleteError } = await supabase
        .from("services")
        .delete()
        .eq("id", service.id);

      if (deleteError) throw deleteError;

      setServices((current) =>
        current.filter((item) => item.id !== service.id),
      );

      setMessage("Service deleted.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  const activeCount = services.filter(
    (service) => service.status === "active",
  ).length;

  const inactiveCount = services.length - activeCount;

  return (
    <main
      dir="ltr"
      className="min-h-screen bg-[#080b10] p-4 text-white sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
              VEXORA / ADMINISTRATION
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Services Management
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage your company services, pricing, and visibility.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            + Add New Service
          </button>
        </header>

        {message && (
          <div
            role="status"
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              className="mt-2 text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Services",
              value: services.length,
              detail: "All registered services",
            },
            {
              label: "Active Services",
              value: activeCount,
              detail: "Currently marked active",
            },
            {
              label: "Other Statuses",
              value: inactiveCount,
              detail: "Services not marked active",
            },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-white/10 bg-[#101722] p-5"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-bold">{item.value}</p>
              <p className="mt-2 text-xs text-slate-500">{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101722]">
          <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, slug, or description..."
              className={`${inputClass} flex-1`}
              aria-label="Search services"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={`${inputClass} sm:max-w-52`}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              type="button"
              onClick={() => void loadServices()}
              disabled={loading}
              className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">
              Loading services...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-semibold text-slate-200">
                No services found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Add a service or change your search filters.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-4 font-medium">Service</th>
                      <th className="px-5 py-4 font-medium">Price</th>
                      <th className="px-5 py-4 font-medium">Duration</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 font-medium">Order</th>
                      <th className="px-5 py-4 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {filteredServices.map((service) => (
                      <tr
                        key={service.id}
                        className="transition hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-white">
                            {service.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {service.slug}
                          </p>
                          {service.description && (
                            <p className="mt-2 max-w-xs text-xs text-slate-400">
                              {service.description}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-slate-300">
                          {service.starting_price === null
                            ? "Contact us"
                            : `${service.starting_price} ${service.currency.trim()}`}
                        </td>
                        <td className="px-5 py-4 text-slate-300">
                          {service.estimated_days === null
                            ? "Not set"
                            : `${service.estimated_days} days`}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              service.status === "active"
                                ? "bg-emerald-500/10 text-emerald-300"
                                : "bg-slate-500/10 text-slate-300"
                            }`}
                          >
                            {service.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-400">
                          {service.display_order}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(service)}
                              disabled={Boolean(busyId)}
                              className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5 disabled:opacity-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void toggleStatus(service)}
                              disabled={Boolean(busyId)}
                              className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5 disabled:opacity-50"
                            >
                              {busyId === service.id
                                ? "Processing..."
                                : service.status === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteService(service)}
                              disabled={Boolean(busyId)}
                              className="rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-4 md:hidden">
                {filteredServices.map((service) => (
                  <article
                    key={service.id}
                    className="rounded-xl border border-white/10 bg-[#0b111b] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-semibold">{service.name}</h2>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {service.slug}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">
                        {service.status}
                      </span>
                    </div>

                    {service.description && (
                      <p className="mt-3 text-sm text-slate-400">
                        {service.description}
                      </p>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">Starting price</p>
                        <p className="mt-1 text-slate-200">
                          {service.starting_price === null
                            ? "Contact us"
                            : `${service.starting_price} ${service.currency.trim()}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Duration</p>
                        <p className="mt-1 text-slate-200">
                          {service.estimated_days === null
                            ? "Not set"
                            : `${service.estimated_days} days`}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(service)}
                        disabled={Boolean(busyId)}
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void toggleStatus(service)}
                        disabled={Boolean(busyId)}
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs disabled:opacity-50"
                      >
                        {busyId === service.id
                          ? "Processing..."
                          : service.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteService(service)}
                        disabled={Boolean(busyId)}
                        className="rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-300 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          <div className="border-t border-white/10 px-5 py-4 text-xs text-slate-500">
            Showing {filteredServices.length} of {services.length} services
          </div>
        </section>

        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-4 py-8 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeForm();
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-form-title"
              className="my-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#101722] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <div>
                  <h2 id="service-form-title" className="text-xl font-bold">
                    {editingId ? "Edit Service" : "Add New Service"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Enter the service details below.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  aria-label="Close form"
                  className="rounded-lg px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-5">
                <div>
                  <label htmlFor="service-name" className={labelClass}>
                    Service name *
                  </label>
                  <input
                    id="service-name"
                    required
                    maxLength={180}
                    value={form.name}
                    onChange={(event) => {
                      const name = event.target.value;
                      setForm((current) => ({
                        ...current,
                        name,
                        slug: slugManuallyEdited
                          ? current.slug
                          : slugify(name),
                      }));
                    }}
                    className={inputClass}
                    placeholder="Software Development"
                  />
                </div>

                <div>
                  <label htmlFor="service-slug" className={labelClass}>
                    URL slug *
                  </label>
                  <input
                    id="service-slug"
                    required
                    maxLength={120}
                    value={form.slug}
                    onChange={(event) => {
                      setSlugManuallyEdited(true);
                      updateForm("slug", event.target.value);
                    }}
                    className={inputClass}
                    placeholder="software-development"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    The slug must be unique. It will be normalized before saving.
                  </p>
                </div>

                <div>
                  <label htmlFor="service-description" className={labelClass}>
                    Description
                  </label>
                  <textarea
                    id="service-description"
                    rows={4}
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                    className={inputClass}
                    placeholder="Describe what this service offers..."
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="service-price" className={labelClass}>
                      Starting price
                    </label>
                    <input
                      id="service-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.starting_price}
                      onChange={(event) =>
                        updateForm("starting_price", event.target.value)
                      }
                      className={inputClass}
                      placeholder="Leave empty if not set"
                    />
                  </div>

                  <div>
                    <label htmlFor="service-currency" className={labelClass}>
                      Currency
                    </label>
                    <input
                      id="service-currency"
                      required
                      maxLength={3}
                      minLength={3}
                      value={form.currency}
                      onChange={(event) =>
                        updateForm("currency", event.target.value)
                      }
                      className={inputClass}
                      placeholder="USD"
                    />
                  </div>

                  <div>
                    <label htmlFor="service-days" className={labelClass}>
                      Estimated days
                    </label>
                    <input
                      id="service-days"
                      type="number"
                      min="0"
                      step="1"
                      value={form.estimated_days}
                      onChange={(event) =>
                        updateForm("estimated_days", event.target.value)
                      }
                      className={inputClass}
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label htmlFor="service-status" className={labelClass}>
                      Status
                    </label>
                    <select
                      id="service-status"
                      value={form.status}
                      onChange={(event) =>
                        updateForm("status", event.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="service-order" className={labelClass}>
                      Display order
                    </label>
                    <input
                      id="service-order"
                      type="number"
                      step="1"
                      value={form.display_order}
                      onChange={(event) =>
                        updateForm("display_order", event.target.value)
                      }
                      className={inputClass}
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Smaller numbers appear first.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Save Changes"
                        : "Create Service"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}