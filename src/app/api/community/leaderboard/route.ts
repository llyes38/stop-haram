import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const CHALLENGE_ID = "challenge_30d_v1";
const DEFAULT_LIMIT = 50;

/**
 * GET /api/community/leaderboard?challenge_id=challenge_30d_v1&limit=50
 * Top entries where consent_public=true, tri: score desc, completed_at asc, updated_at asc.
 */
export async function GET(request: NextRequest) {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Service indisponible" },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get("challenge_id") || CHALLENGE_ID;
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT));

    const { data, error } = await supabase
      .from("leaderboard_entries")
      .select("device_key, display_name, instagram_handle, score, streak_days, completed_at, created_at, updated_at")
      .eq("challenge_id", challengeId)
      .eq("consent_public", true)
      .order("score", { ascending: false })
      .order("completed_at", { ascending: true, nullsFirst: false })
      .order("updated_at", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("[community/leaderboard]", error);
      return NextResponse.json(
        { error: "Impossible de charger le classement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ entries: data ?? [] });
  } catch (e) {
    console.error("[community/leaderboard]", e);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
