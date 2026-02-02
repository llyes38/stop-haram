import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback OAuth (Google, etc.) — route API uniquement, pas de page.
 * Sur Vercel, seul le serveur traite la requête : lecture du code verifier
 * dans les cookies, échange du code contre une session, redirection.
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
    console.error("[api/auth/callback]", error.message);
    return NextResponse.redirect(new URL("/login?error=callback", request.url));
  }

  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}${next}`);
}
