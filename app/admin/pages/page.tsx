"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SitePage = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: "Published" | "Draft" | "Archived";
  updatedAt: string;
};

const initialPages: SitePage[] = [
  { id: "home", title: "Home", slug: "/", category: "Main website", status: "Published", updatedAt: "—" },
  { id: "about", title: "About", slug: "/about", category: "Company", status: "Draft", updatedAt: "—" },
  { id: "services", title: "Services", slug: "/services", category: "Main website", status: "Published", updatedAt: "—" },
  { id: "contact", title: "Contact", slug: "/contact", category: "Company", status: "Draft", updatedAt: "—" },
];

const statusStyle: Record<SitePage["status"], string> = {
  Published: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Draft: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Archived: "border-slate-400/20 bg-slate-400/10 text-slate-300",
};

export default function PagesManagementPage() {
  const [pages, setPages] = useState<SitePage[]>(initialPages);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Main website");
  const [status, setStatus] = useState<SitePage["status"]>("Draft");
  const [notice, setNotice] = useState("");

  const filteredPages = useMemo(() => {
    const term = search.trim().toLowerCase();

    return pages.filter((page) => {
      const matchesSearch =
        !term ||
        page.title.toLowerCase().includes(term) ||
        page.slug.toLowerCase().includes(term) ||
        page.category.toLowerCase().includes(term);

      return matchesSearch && (filter === "All" || page.status === filter);
    });
  }, [pages, search, filter]);

  const published = pages.filter((page) => page.status === "Published").length;
  const drafts = pages.filter((page) => page.status === "Draft").length;
  const archived = pages.filter((page) => page.status === "Archived").length;

  function openNewPage() {
    setEditingId(null);
    setTitle("");
    setSlug("/");
    setCategory("Main website");
    setStatus("Draft");
    setNotice("");
    setEditorOpen(true);
  }

  function openEditPage(page: SitePage) {
    setEditingId(page.id);
    setTitle(page.title);
    setSlug(page.slug);
    setCategory(page.category);
    setStatus(page.status);
    setNotice("");
    setEditorOpen(true);
  }

  function savePage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedSlug = slug.startsWith("/") ? slug : `/${slug}`;
    const duplicate = pages.some(
      (page) =>
        page.slug.toLowerCase() === normalizedSlug.toLowerCase() &&
        page.id !== editingId
    );

    if (duplicate) {
      setNotice("This URL already exists. Choose a unique URL.");
      return;
    }

    const nextPage: SitePage = {
      id: editingId || `page-${Date.now()}`,
      title: title.trim(),
      slug: normalizedSlug,
      category,
      status,
      updatedAt: new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date()),
    };

    setPages((current) =>
      editingId
        ? current.map((page) => (page.id === editingId ? nextPage : page))
        : [nextPage, ...current]
    );

    setEditorOpen(false);
    setNotice("");
  }

  function deletePage(page: SitePage) {
    if (!window.confirm(`Delete "${page.title}" from this temporary list?`)) {
      return;
    }

    setPages((current) => current.filter((item) => item.id !== page.id));
  }

  return (
    <main className="min-h-screen bg-[#080b10] px-4 py-6 text-white sm:px-7 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-blue-400 hover:text-blue-300">
          ← Back to dashboard
        </Link>

        <header className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
              Content management
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Pages Management
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Organize website pages, manage publishing status, and maintain clean URLs.
            </p>
          </div>

          <button
            onClick={openNewPage}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold transition hover:bg-blue-400"
          >
            <span className="text-lg">+</span> Create page
          </button>
        </header>

        <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm leading-6 text-amber-100/90">
          Preview mode: changes are held in page state only and are not saved to Supabase. The listed starter pages are examples, not a database inventory.
        </div>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total pages", value: pages.length, icon: "▤" },
            { label: "Published", value: published, icon: "↗" },
            { label: "Drafts", value: drafts, icon: "✎" },
            { label: "Archived", value: archived, icon: "◷" },
          ].map((item) => (
            <div
              key={item.label}
              className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d121b] p-5"
            >
              <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-blue-500/[0.08] blur-2xl" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold tabular-nums">{item.value}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-lg text-blue-300">
                  {item.icon}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d121b]">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">All website pages</h2>
              <p className="mt-1 text-sm text-slate-400">
                Search, filter, and edit the current preview list.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, URL, category..."
                aria-label="Search pages"
                className="min-w-0 rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-400/50 sm:w-72"
              />
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filter pages by status"
                className="rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm outline-none focus:border-blue-400/50"
              >
                <option>All</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </div>
          </div>

          {filteredPages.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-medium">No pages match your search</p>
              <p className="mt-2 text-sm text-slate-400">
                Try another search term or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Page</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Last updated</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredPages.map((page) => (
                    <tr key={page.id} className="transition hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <p className="font-medium">{page.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{page.slug}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{page.category}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full border px-2.5 py-1 text-xs ${statusStyle[page.status]}`}>
                          {page.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{page.updatedAt}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditPage(page)}
                            className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-blue-400/40 hover:text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePage(page)}
                            className="rounded-lg border border-red-400/15 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10"
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
          )}

          <div className="border-t border-white/[0.07] px-5 py-3 text-xs text-slate-500">
            Showing {filteredPages.length} of {pages.length} preview pages
          </div>
        </section>
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <form
            onSubmit={savePage}
            className="my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#0d121b] p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Page editor
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  {editingId ? "Edit page" : "Create page"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                aria-label="Close editor"
                className="rounded-lg border border-white/10 px-3 py-1.5 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="page-title" className="mb-2 block text-sm text-slate-300">Page title</label>
                <input
                  id="page-title"
                  required
                  maxLength={100}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. About VEXORA"
                  className="w-full rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm outline-none focus:border-blue-400/50"
                />
              </div>

              <div>
                <label htmlFor="page-slug" className="mb-2 block text-sm text-slate-300">Page URL</label>
                <input
                  id="page-slug"
                  required
                  maxLength={150}
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="/about"
                  className="w-full rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm outline-none focus:border-blue-400/50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="page-category" className="mb-2 block text-sm text-slate-300">Category</label>
                  <select
                    id="page-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-sm outline-none focus:border-blue-400/50"
                  >
                    <option>Main website</option>
                    <option>Company</option>
                    <option>Services</option>
                    <option>Landing page</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="page-status" className="mb-2 block text-sm text-slate-300">Status</label>
                  <select
                    id="page-status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value as SitePage["status"])}
                    className="w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-sm outline-none focus:border-blue-400/50"
                  >
                    <option>Draft</option>
                    <option>Published</option>
                    <option>Archived</option>
                  </select>
                </div>
              </div>

              {notice && (
                <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/[0.06] p-3 text-sm text-red-300">
                  {notice}
                </p>
              )}

              <p className="text-xs leading-5 text-slate-500">
                Preview only: saving updates this browser page state, not your website content or database.
              </p>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-400"
              >
                Save page
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
