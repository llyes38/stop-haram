import { NextRequest, NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://stop-haram.vercel.app";

/**
 * POST /api/checkout
 * Body: { plan?: "monthly" | "annual", mode?: "offrir" }
 * Crée une session Stripe Checkout avec le prix mensuel ou annuel.
 * Si mode === "offrir", utilise les prix "offrir à un proche" (1 mois gratuit / annuel).
 */
export async function POST(request: NextRequest) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const body = await request.json().catch(() => ({})) as { plan?: string; mode?: string };
  const plan = body.plan === "annual" ? "annual" : "monthly";
  const isOffrir = body.mode === "offrir";

  const priceMonthly = isOffrir
    ? (process.env.STRIPE_PRICE_ID_OFFRIR_MONTHLY ?? process.env.STRIPE_PRICE_ID_MONTHLY ?? process.env.STRIPE_PRICE_ID)
    : (process.env.STRIPE_PRICE_ID_MONTHLY ?? process.env.STRIPE_PRICE_ID);
  const priceAnnual = isOffrir
    ? (process.env.STRIPE_PRICE_ID_OFFRIR_ANNUAL ?? process.env.STRIPE_PRICE_ID_ANNUAL)
    : process.env.STRIPE_PRICE_ID_ANNUAL;

  const priceId = plan === "annual" && priceAnnual ? priceAnnual : priceMonthly;

  if (stripeSecret && priceId) {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeSecret);
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_URL}/paywall`,
      });
      return NextResponse.json({ url: session.url ?? `${SITE_URL}/paywall` });
    } catch (e) {
      console.error("[checkout] Stripe error:", e);
      return NextResponse.json({ error: "Erreur checkout" }, { status: 500 });
    }
  }

  return NextResponse.json({ url: `${SITE_URL}/success?session_id=dev` });
}
