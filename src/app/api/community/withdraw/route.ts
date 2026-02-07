import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/community/withdraw
 * Body: { device_key }
 * consent_public=false, instagram_handle=null, eligible_for_draw=false.
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

    const { error } = await supabase
      .from("leaderboard_entries")
      .update({
        consent_public: false,
        instagram_handle: null,
        eligible_for_draw: false,
        draw_month: null,
        updated_at: new Date().toISOString(),
      })
      .eq("device_key", deviceKey);

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ ok: true });
      }
      console.error("[community/withdraw]", error);
      return NextResponse.json(
        { error: "Erreur lors du retrait" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[community/withdraw]", e);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
