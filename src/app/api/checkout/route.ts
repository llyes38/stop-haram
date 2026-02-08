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

  // Offrir : 1 mois = 9,99 € (OFFRIR_MONTHLY), annuel = 59,94 € (OFFRIR_ANNUAL). Pas d'inversion.
  const priceMonthly = isOffrir
    ? (process.env.STRIPE_PRICE_ID_OFFRIR_MONTHLY ?? process.env.STRIPE_PRICE_ID_MONTHLY ?? process.env.STRIPE_PRICE_ID)
    : (process.env.STRIPE_PRICE_ID_MONTHLY ?? process.env.STRIPE_PRICE_ID);
  const priceAnnual = isOffrir
    ? (process.env.STRIPE_PRICE_ID_OFFRIR_ANNUAL ?? process.env.STRIPE_PRICE_ID_ANNUAL)
    : process.env.STRIPE_PRICE_ID_ANNUAL;
  // Correction inversion : en mode offrir, "1 mois" doit ouvrir le prix 9,99 et "annuel" le prix 59,94.
  const priceIdMonthly = isOffrir ? priceAnnual : priceMonthly;
  const priceIdAnnual = isOffrir ? priceMonthly : priceAnnual;

  const priceId = plan === "annual" && priceIdAnnual ? priceIdAnnual : priceIdMonthly;

  if (stripeSecret && priceId) {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeSecret);
      // Offrir à un proche : paiement unique (prix one-time). Abo classique : subscription (prix récurrent).
      const mode = isOffrir ? "payment" : "subscription";
      const session = await stripe.checkout.sessions.create({
        mode,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_URL}/paywall`,
        ...(isOffrir && {
          metadata: { type: "gift", plan },
        }),
      });
      const payload: { url: string; session_id?: string } = { url: session.url ?? `${SITE_URL}/paywall` };
      if (isOffrir && session.id) payload.session_id = session.id;
      return NextResponse.json(payload);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[checkout] Stripe error:", e);
      return NextResponse.json(
        { error: msg ? `Erreur checkout: ${msg}` : "Erreur checkout" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ url: `${SITE_URL}/success?session_id=dev` });
}
