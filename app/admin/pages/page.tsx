"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type PageStatus = "published" | "draft" | "archived";
type SitePage = {
  id: string; title: string; slug: string; category: string; excerpt: string | null;
  content: string; status: PageStatus; seo_title: string | null; seo_description: string | null;
  published_at: string | null; created_at: string; updated_at: string;
};

const emptyForm = {
  title: "", slug: "", category: "General", excerpt: "", content: "",
  status: "draft" as PageStatus, seo_title: "", seo_description: "",
};
const statusStyle: Record<PageStatus, string> = {
  published: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  draft: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  archived: "border-slate-400/20 bg-slate-400/10 text-slate-300",
};
const reservedSlugs = new Set([
  "about", "academy", "account", "admin", "admin-login", "api", "client", "contact",
  "events", "login", "portfolio", "privacy", "projects", "register", "services", "student",
]);

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export default function PagesManagementPage() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadPages = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/pages", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not load pages.");
      setPages(payload.pages ?? []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load pages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/pages", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Could not load pages.");
        if (!cancelled) setPages(payload.pages ?? []);
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Could not load pages.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPages = useMemo(() => {
    const term = search.trim().toLowerCase();
    return pages.filter((page) => {
      const matches = !term || [page.title, page.slug, page.category].some((item) => item.toLowerCase().includes(term));
      return matches && (filter === "all" || page.status === filter);
    });
  }, [pages, search, filter]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setNotice("");
    setError("");
    setEditorOpen(true);
  }

  function openEdit(page: SitePage) {
    setEditingId(page.id);
    setForm({
      title: page.title, slug: page.slug, category: page.category,
      excerpt: page.excerpt ?? "", content: page.content, status: page.status,
      seo_title: page.seo_title ?? "", seo_description: page.seo_description ?? "",
    });
    setNotice("");
    setError("");
    setEditorOpen(true);
  }

  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function savePage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const cleanSlug = form.slug.toLowerCase().replace(/^\/+|\/+$/g, "");
    if (!cleanSlug || cleanSlug.split("/").some((part) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part))) {
      setError("Use a valid URL slug, for example company/partners.");
      setSaving(false);
      return;
    }
    if (!editingId && (cleanSlug.includes("/") ? reservedSlugs.has(cleanSlug.split("/")[0]) : reservedSlugs.has(cleanSlug))) {
      setError("This URL is already reserved by an existing VEXORA website route.");
      setSaving(false);
      return;
    }
    const payload = {
      ...form, slug: cleanSlug, title: form.title.trim(), category: form.category.trim(),
      excerpt: form.excerpt.trim() || null, seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
    };
    try {
      const response = await fetch(editingId ? `/api/admin/pages/${editingId}` : "/api/admin/pages", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save page.");
      setNotice("Page saved successfully.");
      setEditorOpen(false);
      await loadPages();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save page.");
    } finally {
      setSaving(false);
    }
  }

  async function deletePage(page: SitePage) {
    if (!window.confirm(`Permanently delete "${page.title}"? This cannot be undone.`)) return;
    setError("");
    try {
      const response = await fetch(`/api/admin/pages/${page.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not delete page.");
      setPages((current) => current.filter((item) => item.id !== page.id));
      setNotice("Page deleted.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete page.");
    }
  }

  async function changeStatus(page: SitePage, status: PageStatus) {
    try {
      const response = await fetch(`/api/admin/pages/${page.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: page.title, slug: page.slug, category: page.category,
          excerpt: page.excerpt, content: page.content, status,
          seo_title: page.seo_title, seo_description: page.seo_description }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not update page status.");
      setPages((current) => current.map((item) => item.id === page.id ? result.page : item));
      setNotice(`Page moved to ${status}.`);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update status.");
    }
  }

  const published = pages.filter((page) => page.status === "published").length;
  const drafts = pages.filter((page) => page.status === "draft").length;
  const archived = pages.filter((page) => page.status === "archived").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-white">
      <Link href="/admin" className="text-sm text-blue-400 hover:text-blue-300">← Back to dashboard</Link>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">Content management system</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Pages Management</h1>
          <p className="mt-2 text-sm text-slate-400">Create, edit, preview, and publish content-managed website pages.</p>
        </div>
        <button onClick={openCreate} className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold hover:bg-blue-400">+ Create page</button>
      </header>

      {notice && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3 text-sm text-emerald-300">{notice}</p>}
      {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3 text-sm text-red-300">{error}</p>}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total pages", pages.length], ["Published", published], ["Drafts", drafts], ["Archived", archived],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/[0.08] bg-[#0d121b] p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-semibold tabular-nums">{loading ? "—" : value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d121b]">
        <div className="flex flex-col gap-3 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-semibold">CMS page inventory</h2><p className="mt-1 text-xs text-slate-500">This list contains database-managed pages, not hard-coded application routes.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search pages..." aria-label="Search pages" className="rounded-xl border border-white/10 bg-[#080b10] px-4 py-2.5 text-sm outline-none focus:border-blue-400/50" />
            <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter by status" className="rounded-xl border border-white/10 bg-[#080b10] px-4 py-2.5 text-sm">
              <option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option>
            </select>
          </div>
        </div>
        {loading ? <div className="p-12 text-center text-sm text-slate-400">Loading pages from Supabase…</div> :
          filteredPages.length === 0 ? <div className="p-12 text-center"><p className="font-medium">No CMS pages found</p><p className="mt-2 text-sm text-slate-500">Create your first page to get started.</p></div> :
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Page</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Updated</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredPages.map((page) => <tr key={page.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-4"><p className="font-medium">{page.title}</p><p className="mt-1 text-xs text-slate-500">/{page.slug}</p></td>
                  <td className="px-5 py-4 text-slate-400">{page.category}</td>
                  <td className="px-5 py-4"><span className={`rounded-full border px-2.5 py-1 text-xs ${statusStyle[page.status]}`}>{page.status}</span></td>
                  <td className="px-5 py-4 text-slate-400">{dateLabel(page.updated_at)}</td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-2">
                    {page.status === "published" && <Link href={`/${page.slug}`} target="_blank" className="rounded-lg border border-white/10 px-3 py-2 text-xs text-blue-300 hover:bg-white/[0.04]">View</Link>}
                    <button onClick={() => openEdit(page)} className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:border-blue-400/40">Edit</button>
                    <select aria-label={`Change status for ${page.title}`} value={page.status} onChange={(event) => void changeStatus(page, event.target.value as PageStatus)} className="max-w-28 rounded-lg border border-white/10 bg-[#080b10] px-2 py-2 text-xs">
                      <option value="draft">Draft</option><option value="published">Publish</option><option value="archived">Archive</option>
                    </select>
                    <button onClick={() => void deletePage(page)} className="rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300 hover:bg-red-400/10">Delete</button>
                  </div></td>
                </tr>)}
              </tbody>
            </table>
          </div>}
        <div className="border-t border-white/[0.07] px-5 py-3 text-xs text-slate-500">Showing {filteredPages.length} of {pages.length} CMS pages</div>
      </section>

      {editorOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm">
        <form onSubmit={savePage} className="my-auto max-h-[94vh] w-full max-w-3xl space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#0d121b] p-5 shadow-2xl sm:p-7">
          <div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-blue-400">VEXORA CMS editor</p><h2 className="mt-2 text-2xl font-semibold">{editingId ? "Edit page" : "Create page"}</h2></div><button type="button" onClick={() => setEditorOpen(false)} className="rounded-lg border border-white/10 px-3 py-2 text-slate-400">✕</button></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-300">Page title<input required maxLength={160} value={form.title} onChange={(e) => update("title", e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-white" /></label>
            <label className="text-sm text-slate-300">URL slug<input required maxLength={180} value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="about-our-company" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-white" /><span className="mt-1 block text-xs text-slate-500">Public URL: /{form.slug || "your-page"}</span></label>
            <label className="text-sm text-slate-300">Category<input required maxLength={80} value={form.category} onChange={(e) => update("category", e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-white" /></label>
            <label className="text-sm text-slate-300">Publishing status<select value={form.status} onChange={(e) => update("status", e.target.value as PageStatus)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-white"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
          </div>
          <label className="block text-sm text-slate-300">Short excerpt<textarea rows={2} maxLength={320} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-white" /></label>
          <label className="block text-sm text-slate-300">Page content<textarea required rows={12} maxLength={100000} value={form.content} onChange={(e) => update("content", e.target.value)} placeholder="Write your page content here. Separate paragraphs with blank lines." className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 font-mono text-sm leading-6 text-white" /><span className="mt-1 block text-xs text-slate-500">Plain text content with paragraph formatting. HTML is not executed.</span></label>
          <details className="rounded-xl border border-white/10 p-4"><summary className="cursor-pointer text-sm font-medium text-slate-200">Search engine settings (SEO)</summary><div className="mt-4 space-y-4"><label className="block text-sm text-slate-300">SEO title<input maxLength={160} value={form.seo_title} onChange={(e) => update("seo_title", e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-white" /></label><label className="block text-sm text-slate-300">SEO description<textarea rows={2} maxLength={320} value={form.seo_description} onChange={(e) => update("seo_description", e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-white" /></label></div></details>
          {error && <p role="alert" className="rounded-lg bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
          <div className="flex justify-end gap-3 border-t border-white/[0.07] pt-4"><button type="button" onClick={() => setEditorOpen(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300">Cancel</button><button disabled={saving} type="submit" className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold disabled:opacity-50">{saving ? "Saving…" : "Save page"}</button></div>
        </form>
      </div>}
    </div>
  );
}
