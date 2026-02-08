import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://stop-haram.vercel.app";

function randomCode(length: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < length; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

/**
 * POST /api/gift/create
 * Body: { session_id }
 * Vérifie la session Stripe (payée, metadata type=gift), crée un code cadeau en DB, retourne { code, plan, url }.
 */
export async function POST(request: NextRequest) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json({ error: "Service indisponible" }, { status: 503 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { session_id?: string };
    const sessionId = typeof body.session_id === "string" ? body.session_id.trim() : "";
    if (!sessionId) {
      return NextResponse.json({ error: "session_id requis" }, { status: 400 });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecret);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Session non payée" }, { status: 400 });
    }
    const metadata = (session.metadata ?? {}) as Record<string, string>;
    if (metadata.type !== "gift" || (metadata.plan !== "monthly" && metadata.plan !== "annual")) {
      return NextResponse.json({ error: "Pas une session cadeau" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("gift_codes")
      .select("code, plan")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();
    if (existing) {
      const url = `${SITE_URL}/start?offer=${encodeURIComponent(existing.code)}`;
      return NextResponse.json({ code: existing.code, plan: existing.plan, url });
    }

    let code = randomCode(10);
    for (let i = 0; i < 5; i++) {
      const { error } = await supabase.from("gift_codes").insert({
        code,
        plan: metadata.plan,
        stripe_session_id: sessionId,
      });
      if (!error) break;
      if (error.code === "23505") code = randomCode(10);
      else {
        console.error("[gift/create]", error);
        return NextResponse.json({ error: "Erreur création code" }, { status: 500 });
      }
    }

    const url = `${SITE_URL}/start?offer=${encodeURIComponent(code)}`;
    return NextResponse.json({ code, plan: metadata.plan, url });
  } catch (e) {
    console.error("[gift/create]", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
