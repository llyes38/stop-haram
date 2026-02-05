import { NextResponse } from "next/server";

/**
 * Vérifie la session Stripe Checkout + statut abonnement.
 * Retourne paid + subscriptionStatus (active | trialing | null).
 * Sans Stripe : paid true, subscriptionStatus active si session_id fourni.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ paid: false, subscriptionStatus: null }, { status: 400 });
  }

  // Avec Stripe : installer le package stripe, définir STRIPE_SECRET_KEY, et appeler
  // stripe.checkout.sessions.retrieve(sessionId, { expand: ["subscription"] }) pour
  // retourner paid + subscriptionStatus (active | trialing | null).
  // Sans Stripe (dev) : considérer comme payé + abonnement actif.
  return NextResponse.json({ paid: true, subscriptionStatus: "active" });
}
