import { NextResponse } from "next/server";
import { connection } from "next/server";

const DEV_TO_API = "https://dev.to/api/articles?tag=technology&per_page=9";
const REQUEST_TIMEOUT_MS = 10_000;
const CACHE_SECONDS = 300;

type TechnologyArticle = {
  id: number;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeArticle(value: unknown): TechnologyArticle | null {
  if (!isRecord(value)) {
    return null;
  }

  const { id, title, description, url, published_at, reading_time_minutes, tag_list } =
    value;

  if (
    typeof id !== "number" ||
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    typeof title !== "string" ||
    !title.trim() ||
    typeof url !== "string"
  ) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.protocol !== "https:" ||
      parsedUrl.hostname !== "dev.to" ||
      parsedUrl.username ||
      parsedUrl.password
    ) {
      return null;
    }
  } catch {
    return null;
  }

  const safeDescription =
    typeof description === "string" ? description.slice(0, 1200) : "";

  const safePublishedAt =
    typeof published_at === "string" &&
    !Number.isNaN(Date.parse(published_at))
      ? published_at
      : "";

  const safeReadingTime =
    typeof reading_time_minutes === "number" &&
    Number.isFinite(reading_time_minutes) &&
    reading_time_minutes > 0
      ? Math.min(Math.floor(reading_time_minutes), 1440)
      : 1;

  const safeTags = Array.isArray(tag_list)
    ? tag_list
        .filter(
          (tag): tag is string =>
            typeof tag === "string" && tag.trim().length > 0
        )
        .slice(0, 3)
        .map((tag) => tag.slice(0, 40))
    : [];

  return {
    id,
    title: title.trim().slice(0, 300),
    description: safeDescription,
    url,
    publishedAt: safePublishedAt,
    readingTime: safeReadingTime,
    tags: safeTags,
  };
}

export async function GET() {
  await connection();

  try {
    const response = await fetch(DEV_TO_API, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: CACHE_SECONDS,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Technology feed is temporarily unavailable." },
        {
          status: 502,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid response from technology feed." },
        {
          status: 502,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    const articles = data
      .map(normalizeArticle)
      .filter((article): article is TechnologyArticle => article !== null)
      .slice(0, 9);

    return NextResponse.json(
      { articles },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to retrieve technology updates." },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}