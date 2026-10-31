"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

type NewsStatus = "published" | "draft" | "archived";
type NewsCategory = "Company News" | "Announcements" | "Technology" | "Events";
type NewsItem = {
  id: string; title: string; slug: string; excerpt: string; content: string;
  category: NewsCategory; status: NewsStatus; author: string;
  seo_title: string | null; seo_description: string | null;
  published_at: string | null; updated_at: string;
};
type ArticleForm = {
  title: string; slug: string; excerpt: string; content: string;
  category: NewsCategory; status: NewsStatus; author: string;
  seo_title: string; seo_description: string;
};
const emptyForm: ArticleForm = {
  title: "", slug: "", excerpt: "", content: "", category: "Company News",
  status: "draft", author: "VEXORA Team", seo_title: "", seo_description: "",
};
const inputClass = "w-full rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400/50";
const statusClasses: Record<NewsStatus, string> = {
  published: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  draft: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  archived: "border-slate-400/20 bg-slate-400/10 text-slate-300",
};
const categories: NewsCategory[] = ["Company News", "Announcements", "Technology", "Events"];
function makeSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function formatDate(value: string | null) {
  if (!value) return "Not published";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/news", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load articles.");
        if (!cancelled) setNews(result.articles ?? []);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Could not load articles.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filteredNews = useMemo(() => {
    const query = search.trim().toLowerCase();
    return news.filter((item) =>
      (statusFilter === "all" || item.status === statusFilter) &&
      (categoryFilter === "all" || item.category === categoryFilter) &&
      (!query || [item.title, item.slug, item.excerpt, item.author].some((value) => value.toLowerCase().includes(query)))
    );
  }, [news, search, statusFilter, categoryFilter]);

  function openCreate() {
    setEditingId(null); setForm(emptyForm); setError(""); setNotice(""); setEditorOpen(true);
  }
  function openEdit(item: NewsItem) {
    setEditingId(item.id);
    setForm({
      title: item.title, slug: item.slug, excerpt: item.excerpt, content: item.content,
      category: item.category, status: item.status, author: item.author,
      seo_title: item.seo_title ?? "", seo_description: item.seo_description ?? "",
    });
    setError(""); setNotice(""); setEditorOpen(true);
  }
  function change<K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  async function saveNews(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    const slug = (form.slug.trim() || makeSlug(form.title)).toLowerCase().replace(/^\/+|\/+$/g, "");
    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError("Use an English URL slug with lowercase letters, numbers and hyphens."); setSaving(false); return;
    }
    const payload = { ...form, title: form.title.trim(), slug, excerpt: form.excerpt.trim(),
      content: form.content.trim(), author: form.author.trim() || "VEXORA Team",
      seo_title: form.seo_title.trim() || null, seo_description: form.seo_description.trim() || null };
    try {
      const response = await fetch(editingId ? `/api/admin/news/${editingId}` : "/api/admin/news", {
        method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save article.");
      setNotice(editingId ? "Article updated successfully." : "Article created successfully.");
      setEditorOpen(false);
      const refreshed = await fetch("/api/admin/news", { cache: "no-store" });
      const data = await refreshed.json();
      if (!refreshed.ok) throw new Error(data.error || "Article saved, but refresh failed.");
      setNews(data.articles ?? []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save article.");
    } finally { setSaving(false); }
  }
  async function deleteNews(item: NewsItem) {
    if (!window.confirm(`Permanently delete "${item.title}"? This cannot be undone.`)) return;
    setDeletingId(item.id); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/news/${item.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not delete article.");
      setNews((current) => current.filter((entry) => entry.id !== item.id));
      setNotice("Article deleted.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not delete article."); }
    finally { setDeletingId(null); }
  }
  async function changeStatus(item: NewsItem, status: NewsStatus) {
    setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/news/${item.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not update publication status.");
      setNews((current) => current.map((entry) => entry.id === item.id ? result.article : entry));
      setNotice(`Article moved to ${status}.`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update status."); }
  }

  const published = news.filter((item) => item.status === "published").length;
  const drafts = news.filter((item) => item.status === "draft").length;
  const archived = news.filter((item) => item.status === "archived").length;

  return (
    <main className="min-h-screen bg-[#080b10] px-4 py-6 text-white sm:px-7 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-blue-400 transition hover:text-blue-300">← Back to dashboard</Link>
        <header className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">Content studio / CMS</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">News & Announcements</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Create, edit, publish and manage company articles from one workspace.</p>
          </div>
          <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold transition hover:bg-blue-400">＋ Create article</button>
        </header>
        {(error || notice) && <div role={error ? "alert" : "status"} className={`mt-6 rounded-xl border p-4 text-sm ${error ? "border-red-400/20 bg-red-400/[0.06] text-red-300" : "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"}`}>{error || notice}</div>}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[["Total articles", news.length], ["Published", published], ["Drafts", drafts], ["Archived", archived]].map(([label, value]) =>
            <div key={String(label)} className="rounded-2xl border border-white/[0.09] bg-[#0d121b] p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-3xl font-semibold tabular-nums">{loading ? "—" : value}</p></div>)}
        </section>
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d121b]">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 xl:flex-row xl:items-center xl:justify-between">
            <div><h2 className="font-semibold">Article library</h2><p className="mt-1 text-sm text-slate-400">Live database inventory. Only published articles appear publicly.</p></div>
            <div className="grid gap-3 sm:grid-cols-3">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..." aria-label="Search articles" className={inputClass} />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status" className={inputClass}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label="Filter by category" className={inputClass}><option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
            </div>
          </div>
          {loading ? <div className="p-12 text-center text-sm text-slate-400">Loading articles from Supabase…</div>
            : filteredNews.length === 0 ? <div className="p-12 text-center"><p className="font-medium">No articles found</p><p className="mt-2 text-sm text-slate-400">Create your first article or adjust the filters.</p></div>
            : <div className="overflow-x-auto"><table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Article</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Author</th><th className="px-5 py-4">Updated</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-white/[0.06]">{filteredNews.map((item) =>
                <tr key={item.id} className="transition hover:bg-white/[0.02]">
                  <td className="max-w-sm px-5 py-4"><p className="font-medium">{item.title}</p><p className="mt-1 text-xs text-slate-500">/news/{item.slug}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.excerpt}</p></td>
                  <td className="px-5 py-4 text-slate-400">{item.category}</td>
                  <td className="px-5 py-4"><span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs ${statusClasses[item.status]}`}>{item.status}</span></td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-400">{item.author}</td><td className="whitespace-nowrap px-5 py-4 text-slate-400">{formatDate(item.updated_at)}</td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-2">
                    {item.status === "published" && <Link href={`/news/${item.slug}`} target="_blank" className="rounded-lg border border-white/10 px-3 py-2 text-xs text-blue-300">View</Link>}
                    <button type="button" onClick={() => openEdit(item)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-blue-400/40">Edit</button>
                    <select aria-label={`Status for ${item.title}`} value={item.status} onChange={(e) => void changeStatus(item, e.target.value as NewsStatus)} className="max-w-28 rounded-lg border border-white/10 bg-[#080b10] px-2 py-2 text-xs"><option value="draft">Draft</option><option value="published">Publish</option><option value="archived">Archive</option></select>
                    <button type="button" disabled={deletingId === item.id} onClick={() => void deleteNews(item)} className="rounded-lg border border-red-400/15 px-3 py-2 text-xs text-red-300 disabled:opacity-50">{deletingId === item.id ? "Deleting…" : "Delete"}</button>
                  </div></td>
                </tr>)}</tbody></table></div>}
          <div className="border-t border-white/[0.07] px-5 py-3 text-xs text-slate-500">Showing {filteredNews.length} of {news.length} articles</div>
        </section>
        {editorOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm">
          <form onSubmit={saveNews} className="my-auto max-h-[94vh] w-full max-w-3xl space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#0d121b] p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Editorial workspace</p><h2 className="mt-2 text-2xl font-semibold">{editingId ? "Edit article" : "Create article"}</h2></div><button type="button" onClick={() => setEditorOpen(false)} className="rounded-lg border border-white/10 px-3 py-2 text-slate-400">✕</button></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-slate-300">Article title<input required maxLength={160} value={form.title} onChange={(e) => { change("title", e.target.value); if (!editingId || !form.slug) change("slug", makeSlug(e.target.value)); }} className={`${inputClass} mt-2`} /></label>
              <label className="text-sm text-slate-300">URL slug<input required maxLength={180} value={form.slug} onChange={(e) => change("slug", e.target.value)} placeholder="company-update" className={`${inputClass} mt-2`} /><span className="mt-1 block text-xs text-slate-500">/news/{form.slug || "article-slug"}</span></label>
              <label className="text-sm text-slate-300">Category<select value={form.category} onChange={(e) => change("category", e.target.value as NewsCategory)} className={`${inputClass} mt-2`}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="text-sm text-slate-300">Status<select value={form.status} onChange={(e) => change("status", e.target.value as NewsStatus)} className={`${inputClass} mt-2`}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
            </div>
            <label className="block text-sm text-slate-300">Summary<textarea required rows={3} maxLength={600} value={form.excerpt} onChange={(e) => change("excerpt", e.target.value)} className={`${inputClass} mt-2 resize-y`} /><span className="mt-1 block text-right text-xs text-slate-500">{form.excerpt.length}/600</span></label>
            <label className="block text-sm text-slate-300">Article content<textarea required rows={12} maxLength={150000} value={form.content} onChange={(e) => change("content", e.target.value)} placeholder="Write the complete article. Separate paragraphs with a blank line." className={`${inputClass} mt-2 resize-y font-mono leading-6`} /></label>
            <label className="block text-sm text-slate-300">Author<input required maxLength={120} value={form.author} onChange={(e) => change("author", e.target.value)} className={`${inputClass} mt-2`} /></label>
            <details className="rounded-xl border border-white/10 p-4"><summary className="cursor-pointer text-sm font-medium">Search engine settings (SEO)</summary><div className="mt-4 space-y-4"><label className="block text-sm text-slate-300">SEO title<input maxLength={160} value={form.seo_title} onChange={(e) => change("seo_title", e.target.value)} className={`${inputClass} mt-2`} /></label><label className="block text-sm text-slate-300">SEO description<textarea rows={2} maxLength={320} value={form.seo_description} onChange={(e) => change("seo_description", e.target.value)} className={`${inputClass} mt-2`} /></label></div></details>
            <div className="flex justify-end gap-3 border-t border-white/[0.07] pt-4"><button type="button" onClick={() => setEditorOpen(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300">Cancel</button><button disabled={saving} type="submit" className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold disabled:opacity-50">{saving ? "Saving…" : "Save article"}</button></div>
          </form>
        </div>}
      </div>
    </main>
  );
}
