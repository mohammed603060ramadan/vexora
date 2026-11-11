import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const headers = { "Cache-Control": "private, no-store" };
const BUCKET = "project-media";
const SIGNED_URL_SECONDS = 60 * 60;

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data: projects, error: projectsError } = await admin
      .from("projects")
      .select("id,title,description,status,deadline,portfolio_category,show_on_projects_page")
      .eq("show_on_projects_page", true)
      .in("status", ["in_progress", "completed"])
      .order("created_at", { ascending: false })
      .limit(12);

    if (projectsError) throw projectsError;
    const rows = projects ?? [];
    if (!rows.length) {
      return NextResponse.json({ projects: [] }, { headers });
    }

    const ids = rows.map((project) => project.id);
    const { data: mediaRows, error: mediaError } = await admin
      .from("project_media")
      .select("id,project_id,name,path,mime_type,size_bytes,created_at")
      .in("project_id", ids)
      .order("created_at", { ascending: true })
      .limit(300);

    if (mediaError) throw mediaError;

    const mediaByProject = new Map<string, Array<{
      id: string;
      name: string;
      mime_type: string;
      url: string | null;
    }>>();

    for (const media of mediaRows ?? []) {
      const group = mediaByProject.get(media.project_id) ?? [];
      if (group.length >= 5) continue;
      const { data: signed, error: signedError } = await admin.storage
        .from(BUCKET)
        .createSignedUrl(media.path, SIGNED_URL_SECONDS);
      group.push({
        id: media.id,
        name: media.name,
        mime_type: media.mime_type,
        url: signedError ? null : signed?.signedUrl ?? null,
      });
      mediaByProject.set(media.project_id, group);
    }

    const published = rows.map((project) => ({
      ...project,
      media: mediaByProject.get(project.id) ?? [],
    }));

    return NextResponse.json({ projects: published }, { headers });
  } catch (error) {
    console.error("Public featured projects lookup failed:", error);
    return NextResponse.json(
      { error: "Featured projects are temporarily unavailable." },
      { status: 500, headers },
    );
  }
}
