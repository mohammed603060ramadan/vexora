import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "project-media";
const SIGNED_URL_SECONDS = 60 * 15;

type PortfolioProject = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  deadline: string | null;
  show_on_projects_page: boolean;
  portfolio_category: string | null;
};

type PortfolioMedia = {
  id: string;
  project_id: string;
  name: string;
  path: string;
  mime_type: string | null;
  created_at: string;
};

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data: projects, error: projectsError } = await admin
      .from("projects")
      .select("id,title,description,status,deadline,show_on_projects_page,portfolio_category")
      .eq("show_on_projects_page", true)
      .in("status", ["in_progress", "completed"])
      .order("created_at", { ascending: false });

    if (projectsError) {
      console.error("Public portfolio project query failed:", projectsError.message);
      return NextResponse.json({ error: "Portfolio is temporarily unavailable." }, { status: 500 });
    }

    const safeProjects = (projects ?? []) as unknown as PortfolioProject[];
    if (safeProjects.length === 0) {
      return NextResponse.json({ projects: [] }, { headers: { "Cache-Control": "no-store" } });
    }

    const ids = safeProjects.map((project) => project.id);
    const { data: media, error: mediaError } = await admin
      .from("project_media")
      .select("id,project_id,name,path,mime_type,created_at")
      .in("project_id", ids)
      .order("created_at", { ascending: false });

    if (mediaError) {
      console.error("Public portfolio media query failed:", mediaError.message);
      return NextResponse.json({ error: "Portfolio media is temporarily unavailable." }, { status: 500 });
    }

    const safeMedia = (media ?? []) as unknown as PortfolioMedia[];
    const mediaWithUrls = await Promise.all(safeMedia.map(async (item) => {
      const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(item.path, SIGNED_URL_SECONDS);
      return {
        id: item.id,
        project_id: item.project_id,
        name: item.name,
        mime_type: item.mime_type,
        url: error ? null : data.signedUrl,
      };
    }));

    return NextResponse.json({
      projects: safeProjects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        category: project.portfolio_category || "Software Development",
        media: mediaWithUrls.filter((item) => item.project_id === project.id),
      })),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Public portfolio endpoint failed:", error);
    return NextResponse.json({ error: "Portfolio is temporarily unavailable." }, { status: 500 });
  }
}
