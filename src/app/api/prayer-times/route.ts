import { NextRequest, NextResponse } from "next/server";

const ALADHAN_BASE = "https://api.aladhan.com/v1/timingsByCity";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  const country = searchParams.get("country")?.trim();
  const method = searchParams.get("method")?.trim() || "3";
  const school = searchParams.get("school")?.trim() || "0";

  if (!city || !country) {
    return NextResponse.json(
      { error: "city and country are required" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    city,
    country,
    method,
    school,
  });
  const url = `${ALADHAN_BASE}?${params.toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "AlAdhan API error", details: text },
        { status: res.status }
      );
    }
    const data = (await res.json()) as {
      data?: {
        timings?: Record<string, string>;
        date?: { readable?: string };
      };
    };

    const timings = data?.data?.timings;
    const dateReadable = data?.data?.date?.readable;

    if (!timings) {
      return NextResponse.json(
        { error: "Invalid AlAdhan response" },
        { status: 502 }
      );
    }

    const out: Record<string, string> = {};
    const keys = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
    for (const k of keys) {
      if (timings[k]) out[k] = timings[k];
    }

    return NextResponse.json({
      timings: out,
      date: dateReadable ?? null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch prayer times", details: msg },
      { status: 500 }
    );
  }
}
