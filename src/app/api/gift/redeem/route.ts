import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/gift/redeem
 * Body: { code }
 * Marque le code comme utilisé et retourne { plan }. Une seule utilisation par code.
 */
export async function POST(request: NextRequest) {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json({ error: "Service indisponible" }, { status: 503 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { code?: string };
    const code = typeof body.code === "string" ? body.code.trim() : "";
    if (!code) {
      return NextResponse.json({ error: "code requis" }, { status: 400 });
    }

    const { data: row, error: fetchError } = await supabase
      .from("gift_codes")
      .select("code, plan")
      .eq("code", code)
      .is("used_at", null)
      .maybeSingle();

    if (fetchError || !row) {
      return NextResponse.json({ error: "Code invalide ou déjà utilisé" }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("gift_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("code", code);

    if (updateError) {
      console.error("[gift/redeem]", updateError);
      return NextResponse.json({ error: "Erreur" }, { status: 500 });
    }
    return NextResponse.json({ plan: row.plan });
  } catch (e) {
    console.error("[gift/redeem]", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
