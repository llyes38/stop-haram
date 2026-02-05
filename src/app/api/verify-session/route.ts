import { NextResponse } from "next/server";

/**
 * Vérifie qu'une session de paiement est valide.
 * Pour l'instant : Stripe ignoré, on retourne { paid: true } si session_id présent.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ paid: false }, { status: 400 });
  }

  // Stripe ignoré pour l'instant : on considère comme payé si session_id fourni.
  return NextResponse.json({ paid: true });
}
