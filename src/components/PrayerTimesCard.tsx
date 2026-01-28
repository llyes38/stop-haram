"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEYS = {
  city: "stopharam_city",
  country: "stopharam_country",
  method: "stopharam_prayer_method",
  school: "stopharam_school",
} as const;

type Timings = Record<string, string>;

const ORDER: (keyof Timings)[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function parseTime(hhmm: string): { h: number; m: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return { h, m: min };
}

function getNextPrayer(timings: Timings): { name: string; time: string } | null {
  if (typeof window === "undefined") return null;
  const now = new Date();
  const nowM = now.getHours() * 60 + now.getMinutes();
  for (const name of ORDER) {
    const time = timings[name];
    if (!time) continue;
    const p = parseTime(time);
    if (!p) continue;
    const prayerM = p.h * 60 + p.m;
    if (prayerM > nowM) return { name, time };
  }
  const first = ORDER[0];
  const firstTime = timings[first];
  if (firstTime) return { name: first, time: firstTime };
  return null;
}

export default function PrayerTimesCard() {
  const [city, setCity] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [method, setMethod] = useState("3");
  const [school, setSchool] = useState("0");
  const [timings, setTimings] = useState<Timings | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const c = window.localStorage.getItem(STORAGE_KEYS.city)?.trim();
      const co = window.localStorage.getItem(STORAGE_KEYS.country)?.trim();
      setCity(c || null);
      setCountry(co || null);
      setMethod(window.localStorage.getItem(STORAGE_KEYS.method) ?? "3");
      setSchool(window.localStorage.getItem(STORAGE_KEYS.school) ?? "0");

      if (!c || !co) {
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        city: c,
        country: co,
        method: window.localStorage.getItem(STORAGE_KEYS.method) ?? "3",
        school: window.localStorage.getItem(STORAGE_KEYS.school) ?? "0",
      });
      fetch(`/api/prayer-times?${params.toString()}`)
        .then((r) => {
          if (!r.ok) throw new Error("Erreur horaires");
          return r.json();
        })
        .then((data: { timings?: Timings; date?: string | null }) => {
          setTimings(data.timings ?? null);
          setDate(data.date ?? null);
          setError(null);
        })
        .catch(() => setError("Impossible de charger les horaires"))
        .finally(() => setLoading(false));
    } catch {
      setLoading(false);
    }
  }, []);

  if (!city || !country) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-5">
        <p className="text-white/80 text-sm font-semibold mb-2">Horaires de prière</p>
        <p className="text-white/60 text-xs mb-4">Ville non configurée. Choisis ta ville pour afficher les horaires.</p>
        <Link
          href="/account/prayer-settings"
          className="inline-flex rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-2.5 text-emerald-200 text-sm font-medium hover:bg-emerald-500/30 transition-colors"
        >
          Configurer ma ville
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-5">
        <p className="text-white/80 text-sm font-semibold mb-2">Horaires de prière</p>
        <p className="text-white/50 text-xs">Chargement…</p>
      </div>
    );
  }

  if (error || !timings) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-5">
        <p className="text-white/80 text-sm font-semibold mb-2">Horaires de prière</p>
        <p className="text-white/60 text-xs mb-4">{error ?? "Aucun horaire disponible."}</p>
        <Link
          href="/account/prayer-settings"
          className="inline-flex rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-white/90 text-sm font-medium hover:bg-white/15"
        >
          Modifier ma ville
        </Link>
      </div>
    );
  }

  const next = getNextPrayer(timings);

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-5">
      <p className="text-white/90 text-sm font-semibold mb-1">Horaires de prière (aujourd&apos;hui)</p>
      {date && <p className="text-white/50 text-xs mb-4">{date}</p>}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
        {ORDER.map((name) => (
          <div key={name} className="flex justify-between gap-2">
            <span className="text-white/70 text-xs">{name}</span>
            <span className="text-white font-medium text-sm tabular-nums">{timings[name] ?? "—"}</span>
          </div>
        ))}
      </div>
      {next && (
        <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/30 px-4 py-2.5">
          <p className="text-emerald-200 text-xs font-medium">
            Prochaine : {next.name} à {next.time}
          </p>
        </div>
      )}
      <Link
        href="/account/prayer-settings"
        className="mt-3 inline-block text-white/50 hover:text-white/70 text-xs"
      >
        Modifier ma ville
      </Link>
    </div>
  );
}
