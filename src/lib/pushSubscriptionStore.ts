/**
 * Stockage des abonnements push.
 * En prod (Vercel) : utilise Upstash Redis si UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN sont définis.
 * En local : mémoire (pas persistant entre redémarrages).
 */
export type PushSubscriptionJSON = {
  endpoint: string;
  expirationTime: number | null;
  keys: { p256dh: string; auth: string };
};

const KEY_GLOBAL = "stopharam_push_subs";
const KEY_PREFIX_USER = "stopharam_push_subs:user:";
const KEY_PREFIX_DEVICE = "stopharam_push_subs:device:";

// Mémoire (fallback local)
type SubscriptionRecord = { subscription: PushSubscriptionJSON; userId?: string; deviceKey?: string };
const memoryStore: SubscriptionRecord[] = [];

function getRedisConfig(): { url: string; token: string } | null {
  if (typeof process === "undefined") return null;
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

function useRedis(): boolean {
  return !!getRedisConfig();
}

async function getRedisClient() {
  const config = getRedisConfig();
  if (!config) throw new Error("Redis non configuré");
  const { Redis } = await import("@upstash/redis");
  return new Redis({ url: config.url, token: config.token });
}

export async function addPushSubscription(
  subscription: PushSubscriptionJSON,
  userId?: string,
  deviceKey?: string
): Promise<void> {
  const storageKey = userId ?? (deviceKey ? `device:${deviceKey}` : undefined);
  if (useRedis()) {
    const redis = await getRedisClient();
    const key = userId ? `${KEY_PREFIX_USER}${userId}` : deviceKey ? `${KEY_PREFIX_DEVICE}${deviceKey}` : KEY_GLOBAL;
    const raw = await redis.get<PushSubscriptionJSON[]>(key);
    const list = Array.isArray(raw) ? raw : [];
    const idx = list.findIndex((s) => s.endpoint === subscription.endpoint);
    const record = { ...subscription };
    if (idx >= 0) list[idx] = record;
    else list.push(record);
    await redis.set(key, list);
    return;
  }
  const idx = memoryStore.findIndex((s) => s.subscription.endpoint === subscription.endpoint);
  const record: SubscriptionRecord = { subscription, userId, deviceKey };
  if (idx >= 0) memoryStore[idx] = record;
  else memoryStore.push(record);
}

/** Retourne les abonnements push d'un appareil (MVP sans compte). */
export async function getSubscriptionsByDeviceKey(deviceKey: string): Promise<PushSubscriptionJSON[]> {
  if (useRedis()) {
    try {
      const redis = await getRedisClient();
      const key = `${KEY_PREFIX_DEVICE}${deviceKey}`;
      const raw = await redis.get<PushSubscriptionJSON[]>(key);
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }
  return memoryStore.filter((s) => s.deviceKey === deviceKey).map((s) => s.subscription);
}

/** Retourne les abonnements push d'un utilisateur (pour envoi ciblé). */
export async function getSubscriptionsByUserId(userId: string): Promise<PushSubscriptionJSON[]> {
  if (useRedis()) {
    try {
      const redis = await getRedisClient();
      const key = `${KEY_PREFIX_USER}${userId}`;
      const raw = await redis.get<PushSubscriptionJSON[]>(key);
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }
  return memoryStore.filter((s) => s.userId === userId).map((s) => s.subscription);
}

/** Supprime un abonnement par endpoint (ex. après 410 Gone). */
export async function removePushSubscriptionByEndpoint(
  endpoint: string,
  userId?: string,
  deviceKey?: string
): Promise<void> {
  if (useRedis()) {
    const redis = await getRedisClient();
    const key = userId ? `${KEY_PREFIX_USER}${userId}` : deviceKey ? `${KEY_PREFIX_DEVICE}${deviceKey}` : KEY_GLOBAL;
    const raw = await redis.get<PushSubscriptionJSON[]>(key);
    const list = Array.isArray(raw) ? raw : [];
    const next = list.filter((s) => s.endpoint !== endpoint);
    await redis.set(key, next);
    return;
  }
  const idx = memoryStore.findIndex((s) => s.subscription.endpoint === endpoint);
  if (idx >= 0) memoryStore.splice(idx, 1);
}

/** Préfixe pour lister toutes les clés d'abonnements (user, device, global). */
const KEY_PREFIX = "stopharam_push_subs";

export async function getAllSubscriptions(): Promise<PushSubscriptionJSON[]> {
  if (useRedis()) {
    try {
      const redis = await getRedisClient();
      // Les abonnements sont stockés sous user:xxx et device:xxx, jamais sous KEY_GLOBAL.
      // On agrège toutes les clés pour le rappel global (ex. daily-reminder).
      const keys = await redis.keys(`${KEY_PREFIX}*`);
      const seen = new Set<string>();
      const out: PushSubscriptionJSON[] = [];
      for (const key of keys) {
        const raw = await redis.get<PushSubscriptionJSON[]>(key);
        const list = Array.isArray(raw) ? raw : [];
        for (const sub of list) {
          if (sub?.endpoint && !seen.has(sub.endpoint)) {
            seen.add(sub.endpoint);
            out.push(sub);
          }
        }
      }
      return out;
    } catch {
      return [];
    }
  }
  return memoryStore.map((s) => s.subscription);
}
