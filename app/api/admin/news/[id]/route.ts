import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Context = { params: Promise<{id:string}> };
const columns = "id,title,slug,excerpt,content,category,status,author,seo_title,seo_description,published_at,created_at,updated_at";
async function authorizeAdmin() {
  const supabase=await createClient(); const {data,error}=await supabase.auth.getUser();
  if(error || !data.user) return {user:null,response:NextResponse.json({error:"Authentication required."},{status:401})};
  if(data.user.app_metadata?.role!=="admin") return {user:null,response:NextResponse.json({error:"Administrator access required."},{status:403})};
  return {user:data.user,response:null};
}
function validOrigin(request:Request) {
  const origin=request.headers.get("origin"); if(!origin) return true;
  try{return new URL(origin).origin===new URL(request.url).origin;}catch{return false;}
}
function dbError(error:{code?:string;message?:string;details?:string;hint?:string}) {
  console.error("[Admin News API]",error);
  return NextResponse.json({error:error.message||"News database operation failed.",code:error.code||null,details:error.details||null,hint:error.hint||null},{status:error.code==="23505"?409:400});
}
export async function PATCH(request:Request,context:Context) {
  if(!validOrigin(request)) return NextResponse.json({error:"Invalid request origin."},{status:403});
  const {user,response}=await authorizeAdmin(); if(response) return response;
  const {id}=await context.params;
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return NextResponse.json({error:"Invalid article ID."},{status:400});
  let body:unknown; try{body=await request.json();}catch{return NextResponse.json({error:"Invalid JSON body."},{status:400});}
  if(!body || typeof body!=="object" || Array.isArray(body)) return NextResponse.json({error:"A valid article payload is required."},{status:400});
  const item=body as Record<string,unknown>;
  if(typeof item.title!=="string"||!item.title.trim()||item.title.length>160) return NextResponse.json({error:"Title is required (160 characters maximum)."},{status:400});
  if(typeof item.slug!=="string"||item.slug.length>180||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)||["about","academy","admin","api","client","contact","events","login","news","projects","services","student"].includes(item.slug)) return NextResponse.json({error:"Invalid or reserved article URL slug."},{status:400});
  if(typeof item.excerpt!=="string"||!item.excerpt.trim()||item.excerpt.length>600||typeof item.content!=="string"||!item.content.trim()||item.content.length>150000) return NextResponse.json({error:"Summary and article content are required and must be within their size limits."},{status:400});
  if(!["Company News","Announcements","Technology","Events"].includes(String(item.category))||!["draft","published","archived"].includes(String(item.status))) return NextResponse.json({error:"Invalid category or status."},{status:400});
  if(typeof item.author!=="string"||!item.author.trim()||item.author.length>120) return NextResponse.json({error:"Author is required."},{status:400});
  if(item.seo_title!=null&&(typeof item.seo_title!=="string"||item.seo_title.length>160)) return NextResponse.json({error:"SEO title is too long."},{status:400});
  if(item.seo_description!=null&&(typeof item.seo_description!=="string"||item.seo_description.length>320)) return NextResponse.json({error:"SEO description is too long."},{status:400});
  const admin=createAdminClient();
  const {data:existing,error:readError}=await admin.from("news_articles").select("id,published_at").eq("id",id).maybeSingle();
  if(readError) return dbError(readError);
  if(!existing) return NextResponse.json({error:"Article not found."},{status:404});
  const status=item.status as string;
  const payload={
    title:(item.title as string).trim(),slug:item.slug,excerpt:(item.excerpt as string).trim(),content:(item.content as string).trim(),
    category:item.category,status,author:(item.author as string).trim(),
    seo_title:typeof item.seo_title==="string"?item.seo_title.trim()||null:null,
    seo_description:typeof item.seo_description==="string"?item.seo_description.trim()||null:null,
    published_at:status==="published"?existing.published_at||new Date().toISOString():null,
    updated_by:user!.id,updated_at:new Date().toISOString()
  };
  const {data,error}=await admin.from("news_articles").update(payload).eq("id",id).select(columns).single();
  if(error) return dbError(error);
  return NextResponse.json({article:data});
}
export async function DELETE(request:Request,context:Context) {
  if(!validOrigin(request)) return NextResponse.json({error:"Invalid request origin."},{status:403});
  const {response}=await authorizeAdmin(); if(response) return response;
  const {id}=await context.params;
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(id)) return NextResponse.json({error:"Invalid article ID."},{status:400});
  const {data,error}=await createAdminClient().from("news_articles").delete().eq("id",id).select("id").maybeSingle();
  if(error) return dbError(error);
  if(!data) return NextResponse.json({error:"Article not found."},{status:404});
  return NextResponse.json({success:true});
}
