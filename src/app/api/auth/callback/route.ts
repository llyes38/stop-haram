import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback OAuth (Google, etc.) — route API uniquement, pas de page.
 * Seuls les comptes ayant fait l'onboarding + paiement + inscription (présents dans user_progress) peuvent se reconnecter.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") ?? "/home";
  const next = redirectTo.startsWith("/") ? redirectTo : "/home";
  const origin = new URL(request.url).origin;
  const isNewSignup = searchParams.get("new_signup") === "1";

  if (!code) {
    return NextResponse.redirect(new URL(`${origin}/login?error=callback`, request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[api/auth/callback]", error.message);
    return NextResponse.redirect(new URL(`${origin}/login?error=callback`, request.url));
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) {
    return NextResponse.redirect(new URL(`${origin}/login?error=callback`, request.url));
  }

  if (isNewSignup) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const { data: row } = await supabase
    .from("user_progress")
    .select("data")
    .eq("user_id", user.id)
    .single();

  // Compte inscrit = au moins une ligne user_progress (parcours fait + inscription)
  const hasProgressRow = row != null && row.data != null;
  if (!hasProgressRow) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL(`${origin}/login?error=not_registered`, request.url));
  }

  return NextResponse.redirect(`${origin}${next}`);
}
