import { NextResponse } from "next/server";

/** MVP : aucun stockage, pas de customer_id. Le portail Stripe n'est pas disponible. */
export async function POST() {
  return NextResponse.json(
    { error: "Gestion d'abonnement non disponible en mode MVP" },
    { status: 400 }
  );
}
