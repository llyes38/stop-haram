import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://stop-haram.vercel.app";

/**
 * Checkout Stripe (subscription).
 * success_url: /success?session_id={CHECKOUT_SESSION_ID}
 * cancel_url: /paywall
 * Sans Stripe (dev) : redirige vers /success?session_id=dev.
 */
export async function POST(_request: Request) {
  // Avec Stripe : créer session mode "subscription", success_url, cancel_url.
  return NextResponse.json({ url: `${SITE_URL}/success?session_id=dev` });
}
