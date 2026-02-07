import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/community/me?device_key=xxx
 * Retourne l'entrée du leaderboard pour ce device_key (pour préremplir le profil et afficher "Tu participes au tirage").
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
    const deviceKey = searchParams.get("device_key")?.trim() || "";
    if (!deviceKey) {
      return NextResponse.json(
        { error: "device_key requis" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("leaderboard_entries")
      .select("device_key, display_name, instagram_handle, score, streak_days, completed_at, consent_public, eligible_for_draw, draw_month, updated_at")
      .eq("device_key", deviceKey)
      .maybeSingle();

    if (error) {
      console.error("[community/me]", error);
      return NextResponse.json(
        { error: "Erreur serveur" },
        { status: 500 }
      );
    }

    return NextResponse.json({ entry: data ?? null });
  } catch (e) {
    console.error("[community/me]", e);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
