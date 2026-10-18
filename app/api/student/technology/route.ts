
import { NextResponse } from "next/server";
import { connection } from "next/server";

type DevToArticle = {
  id: number;
  title: string;
  description: string | null;
  url: string;
  published_at: string;
  reading_time_minutes: number;
  tag_list: string[];
};

export async function GET() {
  await connection();

  try {
    const response = await fetch(
      "https://dev.to/api/articles?tag=technology&per_page=9",
      {
        signal: AbortSignal.timeout(10000),
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Technology feed is temporarily unavailable." },
        { status: 502 }
      );
    }

    const data: DevToArticle[] = await response.json();

    const articles = data
      .filter(
        (article) =>
          article.id &&
          article.title &&
          typeof article.url === "string" &&
          article.url.startsWith("https://dev.to/")
      )
      .map((article) => ({
        id: article.id,
        title: article.title,
        description: article.description ?? "",
        url: article.url,
        publishedAt: article.published_at,
        readingTime: article.reading_time_minutes || 1,
        tags: Array.isArray(article.tag_list)
          ? article.tag_list.slice(0, 3)
          : [],
      }));

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Technology feed API failed:", error);

    return NextResponse.json(
      { error: "Unable to retrieve technology updates." },
      { status: 502 }
    );
  }
}
