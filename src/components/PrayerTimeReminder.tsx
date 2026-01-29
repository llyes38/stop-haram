"use client";

import { useEffect, useRef } from "react";
import {
  getPrayerSettings,
  getNextPrayerFromTimings,
  minutesUntil,
  wasRemindedToday,
  setRemindedToday,
  type Timings,
} from "@/lib/prayerReminder";

const REMIND_MINUTES = 5; // Rappel X min avant l'heure de prière
const CHECK_INTERVAL_MS = 30_000; // Vérifier toutes les 30 s

export default function PrayerTimeReminder() {
  const timingsRef = useRef<Timings | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const settings = getPrayerSettings();
    if (!settings) return;

    const params = new URLSearchParams({
      city: settings.city,
      country: settings.country,
      method: window.localStorage.getItem("stopharam_prayer_method") ?? "3",
      school: window.localStorage.getItem("stopharam_school") ?? "0",
    });

    fetch(`/api/prayer-times?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { timings?: Timings } | null) => {
        if (data?.timings) timingsRef.current = data.timings;
      })
      .catch(() => {});

    const check = () => {
      const timings = timingsRef.current;
      if (!timings) return;

      const next = getNextPrayerFromTimings(timings);
      if (!next) return;

      const mins = minutesUntil(next.time);
      if (mins == null || mins < 0 || mins > REMIND_MINUTES) return;
      if (wasRemindedToday(next.name)) return;

      setRemindedToday(next.name);

      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }

      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification("StopHaram — Prière", {
          body: `Prochaine prière : ${next.name} dans ${mins} min (${next.time}).`,
          icon: "/file.svg",
          tag: `prayer_${next.name}_${Date.now()}`,
        });
      }
    };

    const id = setInterval(check, CHECK_INTERVAL_MS);
    check();

    return () => clearInterval(id);
  }, []);

  return null;
}
