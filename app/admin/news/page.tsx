"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type NewsStatus = "Published" | "Draft" | "Archived";
type NewsCategory = "Company News" | "Announcements" | "Technology" | "Events";

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  status: NewsStatus;
  author: string;
  publishedAt: string;
  updatedAt: string;
};

const initialNews: NewsItem[] = [
  {
    id: "news-1",
    title: "Welcome to VEXORA",
    excerpt: "Introducing our technology vision and the services we provide to help businesses grow.",
    category: "Company News",
    status: "Draft",
    author: "VEXORA Team",
    publishedAt: "",
    updatedAt: "",
  },
  {
    id: "news-2",
    title: "Building Secure Digital Experiences",
    excerpt: "How security-first thinking helps organizations protect their digital infrastructure.",
    category: "Technology",
    status: "Draft",
    author: "VEXORA Team",
    publishedAt: "",
    updatedAt: "",
  },
];

const statusClasses: Record<NewsStatus, string> = {
  Published: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Draft: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Archived: "border-slate-400/20 bg-slate-400/10 text-slate-300",
};

function formatDate(value: string) {
  if (!value) return "Not published";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<NewsCategory>("Company News");
  const [status, setStatus] = useState<NewsStatus>("Draft");
  const [author, setAuthor] = useState("VEXORA Team");
  const [notice, setNotice] = useState("");

  const filteredNews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return news.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [news, search, statusFilter, categoryFilter]);

  const publishedCount = news.filter((item) => item.status === "Published").length;
  const draftCount = news.filter((item) => item.status === "Draft").length;
  const archivedCount = news.filter((item) => item.status === "Archived").length;

  function openCreate() {
    setEditingId(null);
    setTitle("");
    setExcerpt("");
    setCategory("Company News");
    setStatus("Draft");
    setAuthor("VEXORA Team");
    setNotice("");
    setEditorOpen(true);
  }

  function openEdit(item: NewsItem) {
    setEditingId(item.id);
    setTitle(item.title);
    setExcerpt(item.excerpt);
    setCategory(item.category);
    setStatus(item.status);
    setAuthor(item.author);
    setNotice("");
    setEditorOpen(true);
  }

  function saveNews(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanExcerpt = excerpt.trim();
    const cleanAuthor = author.trim() || "VEXORA Team";

    if (!cleanTitle || !cleanExcerpt) {
      setNotice("Please provide a title and a short description.");
      return;
    }

    if (!makeSlug(cleanTitle)) {
      setNotice("Please use a title containing English letters or numbers for the URL.");
      return;
    }

    const now = new Date().toISOString();
    const existing = news.find((item) => item.id === editingId);

    const nextItem: NewsItem = {
      id: editingId || `news-${Date.now()}`,
      title: cleanTitle,
      excerpt: cleanExcerpt,
      category,
      status,
      author: cleanAuthor,
      publishedAt:
        status === "Published"
          ? existing?.publishedAt || now
          : existing?.publishedAt || "",
      updatedAt: now,
    };

    setNews((current) =>
      editingId
        ? current.map((item) => (item.id === editingId ? nextItem : item))
        : [nextItem, ...current]
    );

    setEditorOpen(false);
    setNotice("");
  }

  function deleteNews(item: NewsItem) {
    if (!window.confirm(`Delete "${item.title}" from this preview list?`)) {
      return;
    }

    setNews((current) => current.filter((entry) => entry.id !== item.id));
  }

  function togglePublish(item: NewsItem) {
    const nextStatus: NewsStatus =
      item.status === "Published" ? "Draft" : "Published";

    setNews((current) =>
      current.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              status: nextStatus,
              publishedAt:
                nextStatus === "Published"
                  ? entry.publishedAt || new Date().toISOString()
                  : entry.publishedAt,
              updatedAt: new Date().toISOString(),
            }
          : entry
      )
    );
  }

  return (
    <main className="min-h-screen bg-[#080b10] px-4 py-6 text-white sm:px-7 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="text-sm text-blue-400 transition hover:text-blue-300"
        >
          ← Back to dashboard
        </Link>

        <header className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
              Content studio
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              News & Announcements
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Create company updates, organize announcements, and manage editorial status.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold transition hover:bg-blue-400"
          >
            <span className="text-lg">+</span>
            Create article
          </button>
        </header>

        <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm leading-6 text-amber-100/90">
          Preview mode: articles are currently held in page state. They are not yet saved in Supabase or published on the public website.
        </div>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total articles", value: news.length, icon: "▤", glow: "bg-blue-500/10" },
            { label: "Published", value: publishedCount, icon: "↗", glow: "bg-emerald-500/10" },
            { label: "Drafts", value: draftCount, icon: "✎", glow: "bg-amber-500/10" },
            { label: "Archived", value: archivedCount, icon: "◷", glow: "bg-slate-500/10" },
          ].map((metric) => (
            <div
              key={metric.label}
              className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d121b] p-5"
            >
              <div className={`absolute -right-5 -top-7 h-24 w-24 rounded-full blur-2xl ${metric.glow}`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold tabular-nums">{metric.value}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-lg text-blue-300">
                  {metric.icon}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d121b]">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-semibold">All articles</h2>
              <p className="mt-1 text-sm text-slate-400">
                Search content and filter by publication status or category.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:flex">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search articles..."
                aria-label="Search articles"
                className="min-w-0 rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-blue-400/50 xl:w-64"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by status"
                className="rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-sm outline-none focus:border-blue-400/50"
              >
                <option>All</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filter by category"
                className="rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-sm outline-none focus:border-blue-400/50"
              >
                <option>All</option>
                <option>Company News</option>
                <option>Announcements</option>
                <option>Technology</option>
                <option>Events</option>
              </select>
            </div>
          </div>

          {filteredNews.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-medium">No articles found</p>
              <p className="mt-2 text-sm text-slate-400">
                Try changing your search or filters, or create a new article.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Article</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Author</th>
                    <th className="px-5 py-4">Updated</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.06]">
                  {filteredNews.map((item) => (
                    <tr key={item.id} className="transition hover:bg-white/[0.02]">
                      <td className="max-w-sm px-5 py-4">
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {item.excerpt}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{item.category}</td>
                      <td className="px-5 py-4">
                        <span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs ${statusClasses[item.status]}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-400">{item.author}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                        {formatDate(item.updatedAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-blue-400/40 hover:text-white"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => togglePublish(item)}
                            className="rounded-lg border border-emerald-400/15 px-3 py-2 text-xs text-emerald-300 transition hover:bg-emerald-400/10"
                          >
                            {item.status === "Published" ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteNews(item)}
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
            Showing {filteredNews.length} of {news.length} articles
          </div>
        </section>

        {editorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
            <form
              onSubmit={saveNews}
              className="my-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d121b] p-5 shadow-2xl sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                    Editorial workspace
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    {editingId ? "Edit article" : "Create article"}
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
                  <label htmlFor="news-title" className="mb-2 block text-sm text-slate-300">Article title</label>
                  <input
                    id="news-title"
                    required
                    maxLength={160}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Enter a clear headline"
                    className="w-full rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm outline-none focus:border-blue-400/50"
                  />
                </div>

                <div>
                  <label htmlFor="news-excerpt" className="mb-2 block text-sm text-slate-300">Summary</label>
                  <textarea
                    id="news-excerpt"
                    required
                    maxLength={600}
                    rows={4}
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    placeholder="Write a short introduction for this article..."
                    className="w-full resize-y rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm leading-6 outline-none focus:border-blue-400/50"
                  />
                  <p className="mt-1 text-right text-xs text-slate-500">{excerpt.length}/600</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="news-category" className="mb-2 block text-sm text-slate-300">Category</label>
                    <select
                      id="news-category"
                      value={category}
                      onChange={(event) => setCategory(event.target.value as NewsCategory)}
                      className="w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-sm outline-none focus:border-blue-400/50"
                    >
                      <option>Company News</option>
                      <option>Announcements</option>
                      <option>Technology</option>
                      <option>Events</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="news-status" className="mb-2 block text-sm text-slate-300">Publication status</label>
                    <select
                      id="news-status"
                      value={status}
                      onChange={(event) => setStatus(event.target.value as NewsStatus)}
                      className="w-full rounded-xl border border-white/10 bg-[#080b10] px-3 py-3 text-sm outline-none focus:border-blue-400/50"
                    >
                      <option>Draft</option>
                      <option>Published</option>
                      <option>Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="news-author" className="mb-2 block text-sm text-slate-300">Author / team</label>
                  <input
                    id="news-author"
                    maxLength={100}
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm outline-none focus:border-blue-400/50"
                  />
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                  <p className="text-xs text-slate-500">Suggested article URL</p>
                  <p className="mt-1 break-all text-sm text-blue-300">
                    /news/{makeSlug(title) || "article-title"}
                  </p>
                </div>

                {notice && (
                  <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/[0.06] p-3 text-sm text-red-300">
                    {notice}
                  </p>
                )}

                <p className="text-xs leading-5 text-slate-500">
                  This editor currently updates the preview list only. It does not create a public article or write to the database.
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
                  Save article
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
