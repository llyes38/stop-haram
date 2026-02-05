import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://stop-haram.vercel.app";

/**
 * Checkout : pour l'instant redirige vers /success?session_id=dev (Stripe ignoré).
 * Plus tard : installer stripe et créer une vraie session Stripe.
 */
export async function POST(_request: Request) {
  // Stripe ignoré pour l'instant : redirection directe vers success (session_id factice).
  // Plus tard : installer stripe, définir STRIPE_SECRET_KEY + price ids, et décommenter la logique Stripe.
  return NextResponse.json({ url: `${SITE_URL}/success?session_id=dev` });
}
