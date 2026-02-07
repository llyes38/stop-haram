import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/community/join-draw
 * Body: { device_key }
 * Vérifie streak_days>=30, instagram_handle non null, consent_public=true.
 * Set eligible_for_draw=true, draw_month=YYYY-MM.
 */
export async function POST(request: NextRequest) {
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
    const body = await request.json().catch(() => ({})) as { device_key?: string };
    const deviceKey = typeof body.device_key === "string" ? body.device_key.trim() : "";
    if (!deviceKey) {
      return NextResponse.json(
        { error: "device_key requis" },
        { status: 400 }
      );
    }

    const { data: row, error: fetchError } = await supabase
      .from("leaderboard_entries")
      .select("streak_days, instagram_handle, consent_public")
      .eq("device_key", deviceKey)
      .single();

    if (fetchError || !row) {
      return NextResponse.json(
        { error: "Enregistre d'abord ton profil et publie ton score." },
        { status: 400 }
      );
    }

    const streakDays = Number(row.streak_days) ?? 0;
    const hasHandle = !!row.instagram_handle && String(row.instagram_handle).trim() !== "";
    const consent = !!row.consent_public;

    if (streakDays < 30) {
      return NextResponse.json(
        { error: "Termine ton défi 30 jours pour participer au tirage." },
        { status: 400 }
      );
    }
    if (!consent) {
      return NextResponse.json(
        { error: "Accepte d'apparaître dans le classement pour participer." },
        { status: 400 }
      );
    }
    if (!hasHandle) {
      return NextResponse.json(
        { error: "Renseigne ton Instagram pour qu'on puisse te contacter si tu gagnes." },
        { status: 400 }
      );
    }

    const now = new Date();
    const drawMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const { error: updateError } = await supabase
      .from("leaderboard_entries")
      .update({
        eligible_for_draw: true,
        draw_month: drawMonth,
        updated_at: new Date().toISOString(),
      })
      .eq("device_key", deviceKey);

    if (updateError) {
      console.error("[community/join-draw]", updateError);
      return NextResponse.json(
        { error: "Erreur lors de l'inscription au tirage" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, draw_month: drawMonth });
  } catch (e) {
    console.error("[community/join-draw]", e);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
