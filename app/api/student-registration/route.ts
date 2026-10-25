import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_BODY_LENGTH = 12_000;
type Payload = {
  full_name?: unknown; email?: unknown; phone?: unknown; country?: unknown;
  education_level?: unknown; track?: unknown; experience?: unknown;
  motivation?: unknown; website?: unknown;
};
function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Sign in to view your course registrations." }, { status: 401 });
  }

  const email = authData.user.email?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ registrations: [] }, { status: 200 });
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("student_registrations")
      .select("id, full_name, email, track, status, created_at, education_level, experience")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Student registrations lookup failed:", error.message);
      return NextResponse.json({ error: "Could not load course registrations." }, { status: 500 });
    }

    return NextResponse.json({ registrations: data ?? [] }, {
      status: 200,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Student registrations lookup failed:", error);
    return NextResponse.json({ error: "Course registrations are temporarily unavailable." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }
  const length = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > MAX_BODY_LENGTH) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }
  let payload: Payload;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_LENGTH) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    payload = parsed as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (cleanText(payload.website, 200)) return NextResponse.json({ success: true }, { status: 201 });

  const fullName = cleanText(payload.full_name, 100);
  const email = cleanText(payload.email, 254).toLowerCase();
  const phone = cleanText(payload.phone, 40);
  const country = cleanText(payload.country, 100);
  const educationLevel = cleanText(payload.education_level, 100);
  const track = cleanText(payload.track, 100);
  const experience = cleanText(payload.experience, 2000);
  const motivation = cleanText(payload.motivation, 3000);
  if (fullName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !track) {
    return NextResponse.json({ error: "Please provide a valid full name, email address, and learning track." }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("student_registrations").insert({
      full_name: fullName, email, phone: phone || null, country: country || null,
      education_level: educationLevel || null, track, experience: experience || null,
      motivation: motivation || null, status: "new", source: "website",
    });
    if (error) {
      console.error("Student registration insert failed:", error.message);
      return NextResponse.json({ error: "Could not save your registration. Please try again later." }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "Registration received." }, { status: 201 });
  } catch (error) {
    console.error("Student registration failed:", error);
    return NextResponse.json({ error: "A server error occurred. Please try again later." }, { status: 500 });
  }
}
