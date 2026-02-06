const DEVICE_ID_KEY = "stopharam_device_id";

/** Identifiant unique par appareil (localStorage), pour push et notifs. */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(DEVICE_ID_KEY);
  if (!id || id.length < 8) {
    id = crypto.randomUUID?.() ?? `dev-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    window.localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}
