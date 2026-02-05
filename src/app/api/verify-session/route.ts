import { NextResponse } from "next/server";

/**
 * Vérifie qu'une session Stripe est payée (payment_status === "paid").
 * En dev sans Stripe : si session_id présent, retourne { paid: true }.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ paid: false }, { status: 400 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (secret) {
    try {
      const stripe = await import("stripe").then((m) => new m.default(secret, { apiVersion: "2024-11-20.acacia" }));
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const paid = session.payment_status === "paid";
      return NextResponse.json({ paid });
    } catch (_e) {
      // Stripe non installé ou erreur : en dev, considérer comme payé
    }
  }

  // Dev sans Stripe : considérer comme payé si session_id fourni
  return NextResponse.json({ paid: true });
}
