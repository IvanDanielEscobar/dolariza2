import { NextResponse } from "next/server";
import { getFinancialNews } from "../../../services/newsService";

export const revalidate = 180; // Cache for 3 minutes

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limitParam = parseInt(searchParams.get("limit") || "30", 10);
    const limit = isNaN(limitParam) ? 30 : Math.min(60, Math.max(1, limitParam));

    let news = await getFinancialNews(limit);

    if (category && category !== "all") {
      news = news.filter((n) => n.category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json(
      {
        success: true,
        provider: "Ámbito Financiero & El Cronista Comercial",
        count: news.length,
        timestamp: new Date().toISOString(),
        data: news,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: "No se pudieron obtener las noticias financieras.",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
