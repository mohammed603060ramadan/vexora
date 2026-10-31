import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;
export const metadata: Metadata = {
  title: "News & Announcements | VEXORA",
  description: "Company news, technology insights and announcements from VEXORA.",
};

export default async function NewsIndexPage() {
  const { data, error } = await createAdminClient()
    .from("news_articles")
    .select("id,title,slug,excerpt,category,author,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) {
    console.error("[Public News]", error);
    throw new Error("News articles are temporarily unavailable.");
  }

  return (
    <main className="min-h-screen bg-[#070b12] px-5 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link href="/" className="text-sm font-semibold tracking-[0.22em]">VEXORA <span className="text-blue-400">/ NEWS</span></Link>
          <nav className="flex gap-4 text-sm text-slate-400"><Link href="/" className="hover:text-white">Home</Link><Link href="/contact" className="hover:text-white">Contact</Link></nav>
        </header>
        <section className="py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-300">The VEXORA newsroom</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">News & Announcements</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">Company updates, technology insights and announcements from the VEXORA team.</p>
        </section>
        {data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center"><h2 className="text-xl font-semibold">No news published yet</h2><p className="mt-2 text-sm text-slate-400">New updates from VEXORA will appear here.</p></div>
        ) : (
          <section className="grid gap-5 pb-20 md:grid-cols-2 lg:grid-cols-3">
            {data.map((article) => (
              <article key={article.id} className="flex flex-col rounded-2xl border border-white/[0.09] bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-blue-400/30">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-300">{article.category}</p>
                <h2 className="mt-4 text-xl font-semibold leading-snug">{article.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{article.excerpt}</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4 text-xs text-slate-500"><span>{article.author}</span><span>{article.published_at ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(article.published_at)) : ""}</span></div>
                <Link href={`/news/${article.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-white">Read article <span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </section>
        )}
        <footer className="border-t border-white/10 py-6 text-xs text-slate-600">© VEXORA. All rights reserved.</footer>
      </div>
    </main>
  );
}
