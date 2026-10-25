
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

function logSupabaseError(
  label: string,
  error: {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
  },
) {
  console.error(
    `${label} ${JSON.stringify({
      code: error.code ?? null,
      message: error.message ?? null,
      details: error.details ?? null,
      hint: error.hint ?? null,
    })}`,
  );
}

export async function GET() {
  try {
    const admin = createAdminClient();

    const {
      data: projects,
      error: projectsError,
    } = await admin
      .from("projects")
      .select(
        "id,title,description,status,show_on_projects_page,portfolio_category",
      )
      .eq("show_on_projects_page", true)
      .in("status", ["in_progress", "completed"])
      .order("created_at", { ascending: false });

    if (projectsError) {
      logSupabaseError(
        "Public portfolio project query failed:",
        projectsError,
      );

      if (
        projectsError.code === "42703" ||
        projectsError.code === "PGRST204" ||
        projectsError.code === "PGRST200"
      ) {
        return failure(
          "Portfolio database schema is out of date. Verify the required portfolio migrations and project columns in Supabase.",
        );
      }

      return failure(
        "Portfolio data could not be loaded from Supabase. Check the server logs for the database error.",
      );
    }

    const safeProjects = (projects ?? []) as unknown as PortfolioProject[];

    if (safeProjects.length === 0) {
      return NextResponse.json(
        { projects: [] },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const projectIds = safeProjects.map((project) => project.id);

    const {
      data: media,
      error: mediaError,
    } = await admin
      .from("project_media")
      .select("id,project_id,name,path,mime_type,created_at")
      .in("project_id", projectIds)
      .order("created_at", { ascending: false });

    if (mediaError) {
      logSupabaseError(
        "Public portfolio media query failed:",
        mediaError,
      );

      return failure(
        "Portfolio projects loaded, but media metadata could not be loaded. Check the project_media table schema.",
      );
    }

    const safeMedia = (media ?? []) as unknown as PortfolioMedia[];

    const mediaWithUrls = await Promise.all(
      safeMedia.map(async (item) => {
        try {
          const {
            data,
            error,
          } = await admin.storage
            .from(BUCKET)
            .createSignedUrl(item.path, SIGNED_URL_SECONDS);

          if (error) {
            console.error(
              `Portfolio media signed URL failed: ${JSON.stringify({
                mediaId: item.id,
                message: error.message,
              })}`,
            );
          }

          return {
            id: item.id,
            project_id: item.project_id,
            name: item.name,
            mime_type: item.mime_type,
            url: error ? null : data.signedUrl,
          };
        } catch (error) {
          console.error(
            "Portfolio media URL generation failed:",
            error instanceof Error ? error.message : String(error),
          );

          return {
            id: item.id,
            project_id: item.project_id,
            name: item.name,
            mime_type: item.mime_type,
            url: null,
          };
        }
      }),
    );

    return NextResponse.json(
      {
        projects: safeProjects.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          status: project.status,
          category:
            project.portfolio_category || "Software Development",
          media: mediaWithUrls.filter(
            (item) => item.project_id === project.id,
          ),
        })),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);

    console.error(
      `Public portfolio endpoint failed: ${message}`,
    );

    if (
      message.includes(
        "Missing Supabase server environment variables",
      )
    ) {
      return failure(
        "Portfolio server configuration is incomplete. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the local or production environment.",
      );
    }

    return failure(
      "Portfolio service is temporarily unavailable. Check the server logs for the underlying error.",
    );
  }
}
