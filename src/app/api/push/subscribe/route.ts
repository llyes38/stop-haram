import { NextRequest, NextResponse } from "next/server";
import { addPushSubscription, type PushSubscriptionJSON } from "@/lib/pushSubscriptionStore";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { subscription: PushSubscriptionJSON; userId?: string };
    const { subscription, userId } = body;
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json(
        { error: "subscription invalide (endpoint, keys requis)" },
        { status: 400 }
      );
    }
    await addPushSubscription(subscription, userId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
