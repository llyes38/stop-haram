import { NextRequest, NextResponse } from "next/server";
import { getAllSubscriptions } from "@/lib/pushSubscriptionStore";
import webpush from "web-push";

export async function POST(request: NextRequest) {
  try {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    if (!publicKey || !privateKey) {
      return NextResponse.json(
        { error: "Clés VAPID manquantes (variables d'environnement)." },
        { status: 500 }
      );
    }

    webpush.setVapidDetails(
      process.env.VAPID_MAILTO || "mailto:contact@stopharam.com",
      publicKey,
      privateKey
    );

    const body = (await request.json().catch(() => ({}))) as {
      title?: string;
      body?: string;
    };
    const title = body.title ?? "StopHaram";
    const payloadBody = body.body ?? "Rappel : pense à tes actions du jour.";
    const payload = JSON.stringify({ title, body: payloadBody });

    const subs = await getAllSubscriptions();
    if (!subs.length) {
      return NextResponse.json(
        { sent: 0, error: "Aucun abonnement enregistré. Réactive les notifications puis réessaie." },
        { status: 200 }
      );
    }

    const results = await Promise.allSettled(
      subs.map((sub) => webpush.sendNotification(sub, payload))
    );
    const sent = results.filter((r) => r.status === "fulfilled").length;
    return NextResponse.json({ sent, total: subs.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Erreur lors de l'envoi : ${msg}` },
      { status: 500 }
    );
  }
}
