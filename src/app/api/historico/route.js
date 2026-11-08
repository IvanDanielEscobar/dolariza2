import { NextResponse } from "next/server";
import { getHistoricalRatesSeries } from "../../../services/argentinaDatosService";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30", 10);
    const series = await getHistoricalRatesSeries(days);

    return NextResponse.json({
      success: true,
      provider: "ArgentinaDatos",
      days,
      data: series,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
