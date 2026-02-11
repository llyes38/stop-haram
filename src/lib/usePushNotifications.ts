"use client";

import { useState, useCallback, useEffect } from "react";
import { getDeviceId } from "@/lib/deviceId";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export type PushStatus = "unsupported" | "prompt" | "subscribed" | "denied" | "error";

export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>("prompt");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof Notification === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    const perm = Notification.permission;
    if (perm === "denied") {
      setStatus("denied");
      setError("Autorisation refusée.");
      return;
    }
    if (perm !== "granted") return;
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        if (sub) setStatus("subscribed");
      })
      .catch(() => {});
  }, []);

  const subscribe = useCallback(async (userId?: string) => {
    setError(null);
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      setError("Notifications push non supportées par ce navigateur.");
      return;
    }

    // Toujours récupérer la clé depuis le serveur (fonctionne sur PC et téléphone)
    let publicKey: string | null = null;
    try {
      const url = typeof window !== "undefined" ? `${window.location.origin}/api/push/vapid-public` : "/api/push/vapid-public";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.publicKey) publicKey = data.publicKey;
    } catch (_) {
      /* ignore */
    }
    if (!publicKey) {
      setError("Les notifications ne sont pas disponibles pour le moment. Réessaie plus tard.");
      setStatus("error");
      return;
    }

    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await reg.update();
      let subscription = await reg.pushManager.getSubscription();
      if (!subscription) {
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }
      const subJson = subscription.toJSON();
      const deviceKey = typeof window !== "undefined" ? getDeviceId() : undefined;
      // Pour que le cron (tick) trouve les abonnements, on enregistre aussi sous user_id = device_id
      // quand il n’y a pas de compte (userId). Ainsi Redis a une clé cohérente pour les rappels planifiés.
      const effectiveUserId = userId ?? deviceKey ?? undefined;
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subJson, userId: effectiveUserId, device_key: deviceKey || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de l'abonnement");
      }
      setStatus("subscribed");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      setError(msg);
      if (msg.toLowerCase().includes("denied") || msg.toLowerCase().includes("permission")) {
        setStatus("denied");
      } else {
        setStatus("error");
      }
    }
  }, []);

  const requestPermissionAndSubscribe = useCallback(async (userId?: string) => {
    if (typeof Notification === "undefined") {
      setStatus("unsupported");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "denied") {
      setStatus("denied");
      setError("Autorisation refusée.");
      return;
    }
    if (perm === "granted") await subscribe(userId);
  }, [subscribe]);

  return { status, error, subscribe, requestPermissionAndSubscribe };
}
