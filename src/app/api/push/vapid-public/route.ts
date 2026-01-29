import { NextResponse } from "next/server";

/** Retourne la clé VAPID publique pour que le client puisse s'abonner aux notifications. */
export async function GET() {
  const publicKey =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return NextResponse.json(
      { error: "Clé VAPID publique non configurée (voir .env.local ou variables d'environnement)." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
  return NextResponse.json(
    { publicKey },
    { headers: { "Cache-Control": "no-store" } }
  );
}
