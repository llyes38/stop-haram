import { NextResponse } from "next/server";

/**
 * Ancienne route callback OAuth — plus utilisée.
 * La page /auth/callback (client) établit la session.
 */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(new URL(`${origin}/start`, request.url));
}
