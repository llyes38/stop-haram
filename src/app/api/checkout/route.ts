import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://stop-haram.vercel.app";

/**
 * POST /api/checkout
 * Crée une session Stripe Checkout mode "subscription".
 * success_url = /success?session_id={CHECKOUT_SESSION_ID}, cancel_url = /paywall.
 */
export async function POST() {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

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
