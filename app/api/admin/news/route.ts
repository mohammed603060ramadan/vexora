import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const columns = "id,title,slug,excerpt,content,category,status,author,seo_title,seo_description,published_at,created_at,updated_at";
const reservedSlugs = new Set(["about","academy","admin","api","client","contact","events","login","news","projects","services","student"]);

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
function validate(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "A valid article payload is required.";
  const item = value as Record<string, unknown>;
  if (typeof item.title !== "string" || !item.title.trim() || item.title.length > 160) return "Title is required (160 characters maximum).";
  if (typeof item.slug !== "string" || item.slug.length > 180 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) return "Use a clean lowercase URL slug.";
  if (reservedSlugs.has(item.slug)) return "This URL is reserved by an existing VEXORA route.";
  if (typeof item.excerpt !== "string" || !item.excerpt.trim() || item.excerpt.length > 600) return "Summary is required (600 characters maximum).";
  if (typeof item.content !== "string" || !item.content.trim() || item.content.length > 150000) return "Article content is required (150,000 characters maximum).";
  if (!["Company News","Announcements","Technology","Events"].includes(String(item.category))) return "Invalid article category.";
  if (!["draft","published","archived"].includes(String(item.status))) return "Invalid publication status.";
  if (typeof item.author !== "string" || !item.author.trim() || item.author.length > 120) return "Author is required (120 characters maximum).";
  if (item.seo_title != null && (typeof item.seo_title !== "string" || item.seo_title.length > 160)) return "SEO title is too long.";
  if (item.seo_description != null && (typeof item.seo_description !== "string" || item.seo_description.length > 320)) return "SEO description is too long.";
  return null;
}
function dbError(error: {code?:string;message?:string;details?:string;hint?:string}) {
  console.error("[Admin News API]", error);
  return NextResponse.json({error:error.message || "News database operation failed.",code:error.code || null,details:error.details || null,hint:error.hint || null},{status:error.code==="23505"?409:400});
}
export async function GET(request: Request) {
  if (!validOrigin(request)) return NextResponse.json({error:"Invalid request origin."},{status:403});
  const {response}=await authorizeAdmin(); if(response) return response;
  const {data,error}=await createAdminClient().from("news_articles").select(columns).order("updated_at",{ascending:false});
  if(error) return dbError(error);
  return NextResponse.json({articles:data ?? []});
}
export async function POST(request: Request) {
  if (!validOrigin(request)) return NextResponse.json({error:"Invalid request origin."},{status:403});
  const {user,response}=await authorizeAdmin(); if(response) return response;
  let body: unknown; try { body=await request.json(); } catch { return NextResponse.json({error:"Invalid JSON body."},{status:400}); }
  const invalid=validate(body); if(invalid) return NextResponse.json({error:invalid},{status:400});
  const item=body as Record<string,unknown>, status=item.status as string;
  const payload={
    title:(item.title as string).trim(),slug:item.slug,excerpt:(item.excerpt as string).trim(),
    content:(item.content as string).trim(),category:item.category,status,
    author:(item.author as string).trim(),
    seo_title:typeof item.seo_title==="string"?item.seo_title.trim()||null:null,
    seo_description:typeof item.seo_description==="string"?item.seo_description.trim()||null:null,
    published_at:status==="published"?new Date().toISOString():null,
    created_by:user!.id,updated_by:user!.id,updated_at:new Date().toISOString()
  };
  const {data,error}=await createAdminClient().from("news_articles").insert(payload).select(columns).single();
  if(error) return dbError(error);
  return NextResponse.json({article:data},{status:201});
}
