import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "private, no-store" };

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers });
}

async function authorizeAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { user: null, response: json({ error: "Sign in to use VEXORA AI." }, 401) };
  }

  if (data.user.app_metadata?.role !== "admin") {
    return { user: null, response: json({ error: "Administrator access required." }, 403) };
  }

  return { user: data.user, response: null };
}

function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function GET() {
  const auth = await authorizeAdmin();
  if (auth.response) return auth.response;

  return json({
    configured: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL),
    provider: "OpenAI",
    model: process.env.OPENAI_MODEL ?? null,
  });
}

export async function POST(request: Request) {
  const auth = await authorizeAdmin();
  if (auth.response || !auth.user) {
    return auth.response ?? json({ error: "Administrator access required." }, 403);
  }

  if (!hasSameOrigin(request)) {
    return json({ error: "Request origin could not be verified." }, 403);
  }

  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL) {
    return json({
      error: "VEXORA AI is not configured yet. Add OPENAI_API_KEY and OPENAI_MODEL to the server environment, then redeploy.",
    }, 503);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 12_000) {
    return json({ error: "The prompt is too large. Keep it under 8,000 characters." }, 413);
  }

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body) || !("prompt" in body) || typeof body.prompt !== "string") {
    return json({ error: "Enter a valid prompt." }, 400);
  }

  const prompt = body.prompt.trim();
  if (!prompt) return json({ error: "Enter a prompt before sending." }, 400);
  if (prompt.length > 8_000) return json({ error: "The prompt must be 8,000 characters or fewer." }, 413);

  const safetyIdentifier = createHash("sha256").update(auth.user.id).digest("hex");

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL,
        instructions: [
          "You are VEXORA AI, the private business and technology assistant for VEXORA administrators.",
          "Help with software development, cybersecurity, networks and infrastructure, data analytics, digital marketing, project delivery, operations, and business planning.",
          "Be accurate, practical, structured, and concise. Clearly distinguish verified facts from assumptions.",
          "You do not have access to VEXORA's database or private records unless the administrator includes information in the prompt.",
          "Never claim to have changed code, deployed software, accessed accounts, or modified company data.",
          "For cybersecurity topics, provide defensive and authorized guidance only.",
        ].join(" "),
        input: prompt,
        max_output_tokens: 1_200,
        store: false,
        safety_identifier: safetyIdentifier,
      }),
      signal: AbortSignal.timeout(45_000),
      cache: "no-store",
    });

    const result: unknown = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      const apiMessage =
        result && typeof result === "object" && "error" in result &&
        result.error && typeof result.error === "object" && "message" in result.error &&
        typeof result.error.message === "string"
          ? result.error.message
          : "The AI provider could not complete the request.";

      console.error("[VEXORA AI] Provider request failed:", {
        status: upstream.status,
        message: apiMessage.slice(0, 300),
      });

      return json({
        error: upstream.status === 401 || upstream.status === 403
          ? "The AI provider rejected the server credentials. Check the OpenAI API key and project access."
          : upstream.status === 429
            ? "The AI provider rate limit or usage quota was reached. Check the API project limits."
            : "The AI provider is temporarily unavailable. Try again shortly.",
      }, upstream.status === 429 ? 429 : 502);
    }

    const output = result && typeof result === "object" && "output" in result && Array.isArray(result.output)
      ? result.output
      : [];

    const answer = output.flatMap((item) => {
      if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray(item.content)) return [];
      return item.content.flatMap((part) =>
        part && typeof part === "object" && "type" in part && part.type === "output_text" &&
        "text" in part && typeof part.text === "string" ? [part.text] : []
      );
    }).join("\n\n").trim();

    if (!answer) {
      return json({ error: "The AI provider returned no text. Please try a different prompt." }, 502);
    }

    return json({ answer, model: process.env.OPENAI_MODEL });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    console.error("[VEXORA AI] Request failed:", error instanceof Error ? error.message : "Unknown error");
    return json({
      error: timedOut
        ? "The AI request took too long. Try a shorter prompt."
        : "VEXORA AI could not connect to the provider. Try again shortly.",
    }, 502);
  }
}
