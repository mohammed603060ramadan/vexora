import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const headers = {
  "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
};

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("projects")
      .select("id,title,description,status,show_on_homepage")
      .eq("show_on_homepage", true)
      .in("status", ["in_progress", "completed"])
      .order("created_at", { ascending: true })
      .limit(3);

    if (error) throw error;

    return NextResponse.json({ projects: data ?? [] }, { headers });
  } catch (error) {
    console.error("Homepage projects lookup failed:", error);
    return NextResponse.json(
      { error: "Featured projects are temporarily unavailable." },
      { status: 500, headers },
    );
  }
}
