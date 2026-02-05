import { NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Webhook Stripe : MVP sans stockage. Vérifie la signature et retourne 200.
 * Aucun SQL, aucune DB.
 */
export async function POST(request: Request) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 500 });
  }
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }
  return NextResponse.json({ received: true });
}
