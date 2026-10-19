
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_BODY_LENGTH = 20_000;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  phone?: unknown;
  company?: unknown;
  service?: unknown;
};

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  const contentLength = Number(
    request.headers.get("content-length") ?? "0",
  );

  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_BODY_LENGTH
  ) {
    return NextResponse.json(
      { error: "Request body is too large." },
      { status: 413 },
    );
  }

  let payload: ContactPayload;

  try {
    const rawBody = await request.text();

    if (rawBody.length > MAX_BODY_LENGTH) {
      return NextResponse.json(
        { error: "Request body is too large." },
        { status: 413 },
      );
    }

    const parsed: unknown = JSON.parse(rawBody);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    payload = parsed as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const name = cleanText(payload.name, 100);
  const email = cleanText(payload.email, 254).toLowerCase();
  const subject = cleanText(payload.subject, 200);
  const message = cleanText(payload.message, 5000);
  const phone = cleanText(payload.phone, 40);
  const company = cleanText(payload.company, 150);
  const service = cleanText(payload.service, 100);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !name ||
    name.length < 2 ||
    !email ||
    !emailPattern.test(email) ||
    !message ||
    message.length < 10
  ) {
    return NextResponse.json(
      {
        error:
          "Please provide a valid name, email address, and message of at least 10 characters.",
      },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("inquiries")
      .insert({
        full_name: name,
        email,
        phone: phone || null,
        company: company || null,
        service: service || null,
        message: subject
          ? `Subject: ${subject}\n\n${message}`
          : message,
        source: "website",
        status: "new",
        priority: "medium",
      });

    if (error) {
      console.error(
        "Contact inquiry insert failed:",
        error.message,
      );

      return NextResponse.json(
        {
          error:
            "Could not save your inquiry. Please try again later.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been received.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact submission failed:", error);

    return NextResponse.json(
      {
        error:
          "A server error occurred. Please try again later.",
      },
      { status: 500 },
    );
  }
}
