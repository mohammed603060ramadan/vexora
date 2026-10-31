import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;
type Props = { params: Promise<{ slug: string }> };

async function getArticle(slug: string) {
  const { data, error } = await createAdminClient()
    .from("news_articles")
    .select("title,slug,excerpt,content,category,author,published_at,seo_title,seo_description")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) {
    console.error("[Public News Article]", error);
    throw new Error("This article is temporarily unavailable.");
  }
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    alternates: { canonical: `/news/${article.slug}` },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const paragraphs = article.content.split(/\n\s*\n/).map((part: string) => part.trim()).filter(Boolean);

  return (
    <main className="min-h-screen bg-[#070b12] px-5 py-10 text-white sm:px-8">
      <article className="mx-auto max-w-4xl">
        <header className="border-b border-white/10 pb-8">
          <Link href="/news" className="text-sm text-blue-300 hover:text-white">← Back to newsroom</Link>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">{article.category}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">{article.title}</h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500"><span>{article.author}</span>{article.published_at && <time dateTime={article.published_at}>{new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(article.published_at))}</time>}</div>
        </header>
        <div className="space-y-6 py-10 text-base leading-8 text-slate-300">{paragraphs.map((paragraph: string, index: number) => <p key={index} className="whitespace-pre-wrap">{paragraph}</p>)}</div>
        <footer className="border-t border-white/10 pt-6"><Link href="/news" className="text-sm font-semibold text-blue-300 hover:text-white">← More VEXORA news</Link></footer>
      </article>
    </main>
  );
}
