import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteProps = { params: Promise<{ slug: string[] }> };

async function getPublishedPage(slug: string) {
  const { data, error } = await createAdminClient()
    .from("site_pages")
    .select("title,slug,excerpt,content,seo_title,seo_description,published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) {
    console.error("[CMS public page]", error);
    throw new Error("Page content is temporarily unavailable.");
  }
  return data;
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug.join("/"));
  if (!page) return {};
  return {
    title: page.seo_title || page.title,
    description: page.seo_description || page.excerpt || undefined,
    alternates: { canonical: `/${page.slug}` },
  };
}

export default async function CmsPublicPage({ params }: RouteProps) {
  const { slug } = await params;
  const page = await getPublishedPage(slug.join("/"));
  if (!page) notFound();

  const paragraphs = page.content.split(/\n\s*\n/).map((item: string) => item.trim()).filter(Boolean);

  return (
    <main className="min-h-screen bg-[#080b10] px-5 py-20 text-white sm:px-8">
      <article className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">{page.slug}</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">{page.title}</h1>
        {page.excerpt && <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{page.excerpt}</p>}
        <div className="mt-12 space-y-6 border-t border-white/10 pt-10 text-base leading-8 text-slate-300">
          {paragraphs.map((paragraph: string, index: number) => <p key={index} className="whitespace-pre-wrap">{paragraph}</p>)}
        </div>
      </article>
    </main>
  );
}
