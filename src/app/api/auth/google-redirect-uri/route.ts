import { NextResponse } from "next/server";

/**
 * Retourne l'URI de redirection exacte à ajouter dans Google Cloud Console
 * pour éviter redirect_uri_mismatch. Ouvre cette URL sur l'environnement
 * où tu testes (Vercel ou local) pour récupérer la bonne valeur.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_SUPABASE_URL absente" },
      { status: 500 }
    );
  }
  const redirectUri = `${url.replace(/\/$/, "")}/auth/v1/callback`;
  return NextResponse.json({
    redirectUri,
    instructions: "Dans Google Cloud Console → Credentials → ton client OAuth (Web) → Authorized redirect URIs : ajoute exactement la valeur 'redirectUri' ci-dessus (copier-coller).",
  });
}
