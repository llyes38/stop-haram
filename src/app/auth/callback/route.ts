import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Gère le callback OAuth (Google, etc.) côté serveur.
 * Lit le code verifier PKCE depuis les cookies de la requête et échange le code
 * contre une session, ce qui évite l'erreur "PKCE code verifier not found"
 * (notamment sur mobile ou quand le callback s'ouvre dans un autre contexte).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") ?? "/home";
  const next = redirectTo.startsWith("/") ? redirectTo : "/home";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=callback", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback]", error.message);
    return NextResponse.redirect(new URL("/login?error=callback", request.url));
  }

  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}${next}`);
}
