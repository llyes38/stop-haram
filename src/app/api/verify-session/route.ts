import { NextResponse } from "next/server";

/**
 * GET /api/verify-session?session_id=...
 * Vérifie via Stripe que la session checkout est payée et que l'abonnement est active/trialing.
 * Aucun stockage DB.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id")?.trim();
  if (!sessionId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return NextResponse.json({ ok: sessionId === "dev" }, { status: 200 });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecret);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });
    if (session.payment_status !== "paid") {
      return NextResponse.json({ ok: false });
    }
    const metadata = (session.metadata ?? {}) as Record<string, string>;
    const isGift = metadata.type === "gift" && (metadata.plan === "monthly" || metadata.plan === "annual");
    if (isGift) {
      return NextResponse.json({ ok: true, gift: true, plan: metadata.plan });
    }
    const sub = session.subscription;
    const subObj = typeof sub === "object" && sub !== null && "status" in sub ? sub : null;
    const status = subObj ? (subObj as { status?: string }).status : null;
    const active = status === "active" || status === "trialing";
    return NextResponse.json({ ok: active });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
