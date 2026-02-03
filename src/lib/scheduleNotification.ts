/**
 * Calcule scheduled_at (UTC) pour "aujourd'hui à HH:mm" dans un fuseau donné.
 * Utilise Intl pour le jour dans la TZ + offset pour construire l'instant UTC.
 */
export function getScheduledAtUtc(
  timeStr: string,
  timezone: string,
  refDate: Date = new Date()
): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const hour = Number.isFinite(h) ? h : 0;
  const min = Number.isFinite(m) ? m : 0;

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(refDate);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  const year = parseInt(get("year"), 10);
  const month = parseInt(get("month"), 10) - 1;
  const day = parseInt(get("day"), 10);

  const noonLocal = new Date(year, month, day, 12, 0, 0, 0);
  const offsetStr = noonLocal.toLocaleString("en-US", {
    timeZone: timezone,
    timeZoneName: "longOffset",
  });
  const match = offsetStr.match(/GMT([+-])(\d+)(?::(\d+))?/);
  let offsetHours = 0;
  if (match) {
    const sign = match[1] === "+" ? 1 : -1;
    offsetHours = sign * (parseInt(match[2], 10) + (parseInt(match[3] ?? "0", 10) || 0) / 60);
  }
  const utcHours = hour - offsetHours;
  return new Date(Date.UTC(year, month, day, utcHours, min, 0, 0));
}

/** Vérifie si un instant (Date) tombe dans la plage quiet [quietStart, quietEnd] (heures "HH:mm"). */
export function isInQuietHours(
  scheduled: Date,
  quietStart: string,
  quietEnd: string,
  timezone: string
): boolean {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const timeStr = formatter.format(scheduled);
  const [h, m] = timeStr.split(":").map(Number);
  const minutes = h * 60 + m;

  const [qsH, qsM] = quietStart.split(":").map(Number);
  const [qeH, qeM] = quietEnd.split(":").map(Number);
  const quietStartMin = qsH * 60 + (qsM ?? 0);
  let quietEndMin = qeH * 60 + (qeM ?? 0);
  if (quietEndMin <= quietStartMin) quietEndMin += 24 * 60;

  let sMin = minutes;
  if (quietStartMin > quietEndMin - 24 * 60 && minutes < quietStartMin) sMin += 24 * 60;
  return sMin >= quietStartMin && sMin < quietEndMin;
}

/** Retourne le prochain instant autorisé après quiet_end. */
export function shiftAfterQuietEnd(
  _scheduled: Date,
  quietEnd: string,
  timezone: string
): Date {
  const [qeH, qeM] = quietEnd.split(":").map(Number);
  const timeStr = `${String(qeH).padStart(2, "0")}:${String(qeM ?? 0).padStart(2, "0")}`;
  return getScheduledAtUtc(timeStr, timezone, new Date());
}
