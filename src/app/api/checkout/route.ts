import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://stop-haram.vercel.app";

/**
 * Crée une session Stripe Checkout.
 * success_url = /success?session_id={CHECKOUT_SESSION_ID}
 * En dev sans Stripe : redirige vers /success?session_id=dev
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const forfait = (body.forfait as string) ?? "annuel";

    const secret = process.env.STRIPE_SECRET_KEY;
    if (secret) {
      const stripe = await import("stripe").then((m) => new m.default(secret, { apiVersion: "2024-11-20.acacia" }));
      const priceIdMonthly = process.env.STRIPE_PRICE_ID_MONTHLY;
      const priceIdYearly = process.env.STRIPE_PRICE_ID_YEARLY;
      const priceId = forfait === "annuel" ? priceIdYearly : priceIdMonthly;
      if (!priceId) {
        return NextResponse.json({ error: "Stripe price non configuré" }, { status: 500 });
      }
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_URL}/checkout`,
      });
      return NextResponse.json({ url: session.url ?? `${SITE_URL}/checkout` });
    }

    // Dev sans Stripe : rediriger vers success avec session_id factice
    return NextResponse.json({ url: `${SITE_URL}/success?session_id=dev` });
  } catch (e) {
    console.error("[checkout]", e);
    // Sans Stripe configuré : rediriger vers success avec session_id factice (dev)
    return NextResponse.json({ url: `${SITE_URL}/success?session_id=dev` });
  }
}
