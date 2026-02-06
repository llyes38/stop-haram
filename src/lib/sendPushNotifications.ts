/**
 * Envoi de notifications push (tous les abonnés ou un user).
 * Utilisé par /api/push/send, /api/cron/daily-reminder et /api/cron/tick.
 */
import {
  getAllSubscriptions,
  getSubscriptionsByUserId,
  getSubscriptionsByDeviceKey,
  removePushSubscriptionByEndpoint,
} from "@/lib/pushSubscriptionStore";
import webpush from "web-push";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://stop-haram.vercel.app";

export type SendPushOptions = {
  title?: string;
  body?: string;
  url?: string;
  /** URL absolue de l'icône (ex. favicon) affichée dans la notification */
  icon?: string;
};

function getWebPush() {
  const publicKey = (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "").trim();
  const privateKey = (process.env.VAPID_PRIVATE_KEY ?? "").trim();
  if (!publicKey || !privateKey) return null;
  webpush.setVapidDetails(
    (process.env.VAPID_MAILTO || "mailto:contact@stopharam.com").trim(),
    publicKey,
    privateKey
  );
  return webpush;
}

export async function sendPushToAll(options: SendPushOptions = {}): Promise<{ sent: number; total: number; error?: string }> {
  const wp = getWebPush();
  if (!wp) return { sent: 0, total: 0, error: "Clés VAPID manquantes (variables d'environnement)." };

  const title = options.title ?? "StopHaram";
  const body = options.body ?? "Rappel : pense à tes actions du jour.";
  const payload = JSON.stringify({
    title,
    body,
    url: options.url ?? "/",
    icon: options.icon ?? `${SITE_URL}/favicon.png`,
    vibrate: [300, 100, 300, 100, 300],
  });

  const subs = await getAllSubscriptions();
  if (!subs.length) return { sent: 0, total: 0, error: "Aucun abonnement enregistré." };

  const results = await Promise.allSettled(subs.map((sub) => wp.sendNotification(sub, payload)));
  return { sent: results.filter((r) => r.status === "fulfilled").length, total: subs.length };
}

export type SendPushToUserResult = { sent: number; total: number; removed: number };

/** Envoie une notif à toutes les subscriptions d'un user. Supprime les endpoints 410 Gone. */
export async function sendPushToUser(
  userId: string,
  options: SendPushOptions
): Promise<SendPushToUserResult> {
  const wp = getWebPush();
  if (!wp) return { sent: 0, total: 0, removed: 0 };

  const title = options.title ?? "StopHaram";
  const body = options.body ?? "Rappel";
  const payload = JSON.stringify({
    title,
    body,
    url: options.url ?? "/",
    icon: options.icon ?? `${SITE_URL}/favicon.png`,
    vibrate: [300, 100, 300, 100, 300],
  });

  const subs = await getSubscriptionsByUserId(userId);
  if (!subs.length) return { sent: 0, total: 0, removed: 0 };

  let sent = 0;
  let removed = 0;
  for (const sub of subs) {
    try {
      await wp.sendNotification(sub, payload);
      sent++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("410") || msg.includes("Gone")) {
        await removePushSubscriptionByEndpoint(sub.endpoint, userId);
        removed++;
      }
    }
  }
  return { sent, total: subs.length, removed };
}

/** Envoie une notif aux subscriptions d'un appareil (MVP sans compte). */
export async function sendPushToDevice(
  deviceKey: string,
  options: SendPushOptions
): Promise<SendPushToUserResult> {
  const wp = getWebPush();
  if (!wp) return { sent: 0, total: 0, removed: 0 };

  const title = options.title ?? "StopHaram";
  const body = options.body ?? "Rappel";
  const payload = JSON.stringify({
    title,
    body,
    url: options.url ?? "/",
    icon: options.icon ?? `${SITE_URL}/favicon.png`,
    vibrate: [300, 100, 300, 100, 300],
  });

  const subs = await getSubscriptionsByDeviceKey(deviceKey);
  if (!subs.length) return { sent: 0, total: 0, removed: 0 };

  let sent = 0;
  let removed = 0;
  for (const sub of subs) {
    try {
      await wp.sendNotification(sub, payload);
      sent++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("410") || msg.includes("Gone")) {
        await removePushSubscriptionByEndpoint(sub.endpoint, undefined, deviceKey);
        removed++;
      }
    }
  }
  return { sent, total: subs.length, removed };
}
