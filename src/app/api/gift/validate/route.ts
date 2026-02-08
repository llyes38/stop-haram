import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/gift/validate?code=XXX
 * Retourne { valid, plan } si le code existe et n'a pas été utilisé.
 */
export async function GET(request: NextRequest) {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json({ valid: false }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.trim() ?? "";
    if (!code) {
      return NextResponse.json({ valid: false });
    }

    const { data, error } = await supabase
      .from("gift_codes")
      .select("code, plan")
      .eq("code", code)
      .is("used_at", null)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ valid: false });
    }
    return NextResponse.json({ valid: true, plan: data.plan });
  } catch (e) {
    console.error("[gift/validate]", e);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
