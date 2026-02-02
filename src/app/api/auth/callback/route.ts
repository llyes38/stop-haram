import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Callback OAuth (Google, etc.) — route API uniquement, pas de page.
 * Les cookies de session sont copiés explicitement sur la réponse de redirection
 * pour que la PWA (app installée) les reçoive correctement.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") ?? "/home";
  const next = redirectTo.startsWith("/") ? redirectTo : "/home";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=callback", request.url));
  }

  const cookieStore = await cookies();
  const capturedCookies: { name: string; value: string; options?: Record<string, unknown> }[] = [];

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            capturedCookies.push({ name, value, options });
          });
        } catch {
          // ignore
        }
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[api/auth/callback]", error.message);
    return NextResponse.redirect(new URL("/login?error=callback", request.url));
  }

  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(`${origin}${next}`);

  for (const { name, value, options } of capturedCookies) {
    response.cookies.set(name, value, options ?? {});
  }

  return response;
}
