import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteContext = { params: Promise<{ id: string }> };
const columns =
  "id,title,slug,category,excerpt,content,status,seo_title,seo_description,published_at,created_at,updated_at";

async function authorizeAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { user: null, response: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  if (data.user.app_metadata?.role !== "admin") return { user: null, response: NextResponse.json({ error: "Administrator access required." }, { status: 403 }) };
  return { user: data.user, response: null };
}

function validOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

function databaseError(error: { code?: string; message?: string; details?: string; hint?: string }) {
  console.error("[Admin Pages API]", error);
  return NextResponse.json({
    error: error.message || "The pages database operation failed.",
    code: error.code || null, details: error.details || null, hint: error.hint || null,
  }, { status: error.code === "23505" ? 409 : 400 });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validatePage(value: unknown) {
  if (!isRecord(value)) return "A valid page payload is required.";
  if (typeof value.title !== "string" || !value.title.trim() || value.title.trim().length > 160) return "Title is required and must be 160 characters or fewer.";
  if (typeof value.slug !== "string" || value.slug.length > 180 || !/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(value.slug)) return "Use a clean URL slug such as about-us or company/partners.";
  if (typeof value.category !== "string" || !value.category.trim() || value.category.length > 80) return "Category is required and must be 80 characters or fewer.";
  if (value.excerpt !== null && value.excerpt !== undefined && (typeof value.excerpt !== "string" || value.excerpt.length > 320)) return "Excerpt must be 320 characters or fewer.";
  if (typeof value.content !== "string" || value.content.length > 100_000) return "Page content is required and must be 100,000 characters or fewer.";
  if (!["draft", "published", "archived"].includes(String(value.status))) return "Status must be draft, published, or archived.";
  if (value.seo_title !== null && value.seo_title !== undefined && (typeof value.seo_title !== "string" || value.seo_title.length > 160)) return "SEO title must be 160 characters or fewer.";
  if (value.seo_description !== null && value.seo_description !== undefined && (typeof value.seo_description !== "string" || value.seo_description.length > 320)) return "SEO description must be 320 characters or fewer.";
  return null;
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!validOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const { user, response } = await authorizeAdmin();
  if (response) return response;

  const { id } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid page ID." }, { status: 400 });
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const validationError = validatePage(body);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const page = body as Record<string, unknown>;
  const { data: existing, error: existingError } = await createAdminClient()
    .from("site_pages").select("id,published_at").eq("id", id).maybeSingle();
  if (existingError) return databaseError(existingError);
  if (!existing) return NextResponse.json({ error: "Page not found." }, { status: 404 });

  const status = page.status as string;
  const payload = {
    title: (page.title as string).trim(),
    slug: page.slug,
    category: (page.category as string).trim(),
    excerpt: typeof page.excerpt === "string" ? page.excerpt.trim() || null : null,
    content: page.content,
    status,
    seo_title: typeof page.seo_title === "string" ? page.seo_title.trim() || null : null,
    seo_description: typeof page.seo_description === "string" ? page.seo_description.trim() || null : null,
    published_at: status === "published" ? existing.published_at || new Date().toISOString() : null,
    updated_by: user!.id,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await createAdminClient()
    .from("site_pages").update(payload).eq("id", id).select(columns).single();
  if (error) return databaseError(error);
  return NextResponse.json({ page: data });
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!validOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const { response } = await authorizeAdmin();
  if (response) return response;

  const { id } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid page ID." }, { status: 400 });
  }

  const { data, error } = await createAdminClient()
    .from("site_pages").delete().eq("id", id).select("id").maybeSingle();
  if (error) return databaseError(error);
  if (!data) return NextResponse.json({ error: "Page not found." }, { status: 404 });
  return NextResponse.json({ success: true });
}
