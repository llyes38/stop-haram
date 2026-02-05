import { NextResponse } from "next/server";

/**
 * Health check : aucune dépendance externe.
 * Permet de vérifier que le serveur répond vite (pas de freeze JS).
 */
export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
