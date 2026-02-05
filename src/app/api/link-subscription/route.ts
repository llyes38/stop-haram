import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const COOKIE_NAME = "stopharam_checkout_session";

/**
 * Lie la session Stripe (cookie) au user connecté : upsert subscriptions puis supprime le cookie.
 * Appelé depuis /create-account après signUp réussi.
 */
export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const sessionId = match ? match[1].trim() : "";
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "Cookie session manquant" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 });
  }

  let stripeCustomerId: string | null = null;
  let stripeSubscriptionId: string | null = null;
  let status: string | null = null;
  let currentPeriodEnd: number | null = null;

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (stripeSecret) {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeSecret);
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription"],
      });
      if (session.payment_status !== "paid") {
        return NextResponse.json({ ok: false, error: "Paiement non confirmé" }, { status: 400 });
      }
      stripeCustomerId = session.customer as string | null ?? null;
      const sub = session.subscription;
      const subObj = typeof sub === "object" && sub !== null ? sub : null;
      if (subObj && "id" in subObj) {
        stripeSubscriptionId = subObj.id as string;
        status = "status" in subObj ? (subObj.status as string) : null;
        currentPeriodEnd = "current_period_end" in subObj ? (subObj.current_period_end as number) : null;
      }
      if (!["active", "trialing"].includes(status ?? "")) {
        return NextResponse.json({ ok: false, error: "Abonnement non actif" }, { status: 400 });
      }
    } catch (e) {
      console.error("[link-subscription] Stripe error:", e);
      return NextResponse.json({ ok: false, error: "Session Stripe invalide" }, { status: 400 });
    }
  } else {
    status = "active";
  }

  const admin = createAdminClient();
  const { error: upsertError } = await admin.from("subscriptions").upsert(
    {
      user_id: user.id,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      status: status ?? "active",
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (upsertError) {
    console.error("[link-subscription] Supabase upsert error:", upsertError);
    return NextResponse.json({ ok: false, error: "Erreur enregistrement" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}
