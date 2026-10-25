import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BUCKET = "project-media";
const SIGNED_URL_SECONDS = 60 * 15;

type PortfolioProject = {
  id: string;
  title: string;
  description: string | null;
  status: string;
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

function failure(message: string, status = 500) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data: projects, error: projectsError } = await admin
      .from("projects")
      .select("id,title,description,status,show_on_projects_page,portfolio_category")
      .eq("show_on_projects_page", true)
      .in("status", ["in_progress", "completed"])
      .order("created_at", { ascending: false });

    if (projectsError) {
      console.error("Public portfolio project query failed:", {
        code: projectsError.code,
        message: projectsError.message,
        details: projectsError.details,
        hint: projectsError.hint,
      });
      if (projectsError.code === "42703" || projectsError.code === "PGRST204" || projectsError.code === "PGRST200") {
        return failure("Portfolio database schema is out of date. Verify the portfolio migration was applied to the production Supabase project.");
      }
      return failure("Portfolio data could not be loaded from Supabase. Check the server logs for the database error.");
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
      console.error("Public portfolio media query failed:", {
        code: mediaError.code,
        message: mediaError.message,
        details: mediaError.details,
        hint: mediaError.hint,
      });
      return failure("Portfolio projects loaded, but media metadata could not be loaded. Check the project_media table schema.");
    }

    const safeMedia = (media ?? []) as unknown as PortfolioMedia[];
    const mediaWithUrls = await Promise.all(safeMedia.map(async (item) => {
      try {
        const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(item.path, SIGNED_URL_SECONDS);
        if (error) {
          console.error("Portfolio media signed URL failed:", { mediaId: item.id, message: error.message });
        }
        return {
          id: item.id,
          project_id: item.project_id,
          name: item.name,
          mime_type: item.mime_type,
          url: error ? null : data.signedUrl,
        };
      } catch (error) {
        console.error("Portfolio media URL generation failed:", error);
        return { id: item.id, project_id: item.project_id, name: item.name, mime_type: item.mime_type, url: null };
      }
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
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Missing Supabase server environment variables")) {
      return failure("Portfolio server configuration is incomplete. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the production hosting environment.");
    }
    return failure("Portfolio service is temporarily unavailable. Check the production server logs for the underlying error.");
  }
}
