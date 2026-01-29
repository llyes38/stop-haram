/**
 * Stockage des abonnements push (en mémoire).
 * En production, remplacer par une base (Vercel KV, Supabase, etc.).
 */
export type PushSubscriptionJSON = {
  endpoint: string;
  expirationTime: number | null;
  keys: { p256dh: string; auth: string };
};

type SubscriptionRecord = { subscription: PushSubscriptionJSON; userId?: string };

const store: SubscriptionRecord[] = [];

export function addPushSubscription(subscription: PushSubscriptionJSON, userId?: string): void {
  const key = subscription.endpoint;
  const idx = store.findIndex((s) => s.subscription.endpoint === key);
  const record: SubscriptionRecord = { subscription, userId };
  if (idx >= 0) store[idx] = record;
  else store.push(record);
}

export function getAllSubscriptions(): PushSubscriptionJSON[] {
  return store.map((s) => s.subscription);
}
