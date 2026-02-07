import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const CHALLENGE_ID = "challenge_30d_v1";

/**
 * POST /api/community/upsert
 * Body: { device_key, display_name, instagram_handle?, score, streak_days, completed_at?, consent_public }
 * Upsert par device_key.
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
    const body = await request.json().catch(() => ({})) as {
      device_key?: string;
      display_name?: string;
      instagram_handle?: string;
      score?: number;
      streak_days?: number;
      completed_at?: string | null;
      consent_public?: boolean;
    };

    const deviceKey = typeof body.device_key === "string" ? body.device_key.trim() : "";
    const displayName = typeof body.display_name === "string" ? body.display_name.trim() : "";
    if (!deviceKey || !displayName) {
      return NextResponse.json(
        { error: "device_key et display_name requis" },
        { status: 400 }
      );
    }
    if (displayName.length < 3 || displayName.length > 20) {
      return NextResponse.json(
        { error: "Le pseudo doit faire entre 3 et 20 caractères" },
        { status: 400 }
      );
    }

    const instagramHandle = typeof body.instagram_handle === "string" ? body.instagram_handle.trim().replace(/^@/, "") || null : null;
    const score = typeof body.score === "number" ? Math.max(0, Math.round(body.score)) : 0;
    const streakDays = typeof body.streak_days === "number" ? Math.max(0, Math.min(30, Math.round(body.streak_days))) : 0;
    const completedAt = body.completed_at != null && body.completed_at !== "" ? body.completed_at : null;
    const consentPublic = !!body.consent_public;

    const row = {
      device_key: deviceKey,
      display_name: displayName,
      instagram_handle: instagramHandle,
      score,
      streak_days: streakDays,
      challenge_id: CHALLENGE_ID,
      completed_at: completedAt,
      consent_public: consentPublic,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("leaderboard_entries")
      .upsert(row, { onConflict: "device_key" });

    if (error) {
      console.error("[community/upsert]", error);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[community/upsert]", e);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
