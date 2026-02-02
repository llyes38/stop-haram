/**
 * Envoi de notifications push à tous les abonnés (utilisé par /api/push/send et /api/cron/daily-reminder).
 */
import { getAllSubscriptions } from "@/lib/pushSubscriptionStore";
import webpush from "web-push";

export type SendPushOptions = {
  title?: string;
  body?: string;
};

export async function sendPushToAll(options: SendPushOptions = {}): Promise<{ sent: number; total: number; error?: string }> {
  const publicKey = (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "").trim();
  const privateKey = (process.env.VAPID_PRIVATE_KEY ?? "").trim();
  if (!publicKey || !privateKey) {
    return { sent: 0, total: 0, error: "Clés VAPID manquantes (variables d'environnement)." };
  }

  webpush.setVapidDetails(
    (process.env.VAPID_MAILTO || "mailto:contact@stopharam.com").trim(),
    publicKey,
    privateKey
  );

  const title = options.title ?? "StopHaram";
  const body = options.body ?? "Rappel : pense à tes actions du jour.";
  const payload = JSON.stringify({ title, body });

  const subs = await getAllSubscriptions();
  if (!subs.length) {
    return { sent: 0, total: 0, error: "Aucun abonnement enregistré." };
  }

  const results = await Promise.allSettled(
    subs.map((sub) => webpush.sendNotification(sub, payload))
  );
  const sent = results.filter((r) => r.status === "fulfilled").length;
  return { sent, total: subs.length };
}
