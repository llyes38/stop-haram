import { NextResponse } from "next/server";

/**
 * Ancienne route callback OAuth (Google) — plus utilisée.
 * Le Magic Link utilise la page /auth/callback (client) pour établir la session.
 */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(new URL(`${origin}/login`, request.url));
}
