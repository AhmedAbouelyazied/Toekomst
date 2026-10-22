import { NextResponse } from "next/server";
import { getPrayerTimes } from "@/lib/mawaqit";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getPrayerTimes();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600" },
    });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
