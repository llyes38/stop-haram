"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";

type Prefs = {
  timezone: string;
  daily_checkin_enabled: boolean;
  daily_checkin_time: string;
  actions_morning: boolean;
  actions_morning_time: string;
  actions_evening: boolean;
  actions_evening_time: string;
  sin_reminder_enabled: boolean;
  sin_reminder_time: string;
  quiet_start: string;
  quiet_end: string;
  city: string | null;
  country: string | null;
};

const DEFAULT_PREFS: Prefs = {
  timezone: "Europe/Paris",
  daily_checkin_enabled: true,
  daily_checkin_time: "20:30",
  actions_morning: true,
  actions_morning_time: "08:30",
  actions_evening: true,
  actions_evening_time: "21:30",
  sin_reminder_enabled: false,
  sin_reminder_time: "23:00",
  quiet_start: "23:30",
  quiet_end: "08:00",
  city: null,
  country: null,
};

const TIMEZONES = [
  "Europe/Paris",
  "Europe/London",
  "Europe/Brussels",
  "Europe/Madrid",
  "Europe/Algiers",
  "Africa/Casablanca",
  "Africa/Tunis",
  "America/Montreal",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Istanbul",
  "Africa/Douala",
  "Africa/Abidjan",
];

function toTimeInput(v: string): string {
  if (!v) return "20:30";
  const [h, m] = v.split(":").map(Number);
  const hh = Number.isFinite(h) ? h : 20;
  const mm = Number.isFinite(m) ? m : 30;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function fromTimeInput(s: string): string {
  if (!s) return "20:30";
  return s.slice(0, 5);
}

export default function SettingsNotificationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      if (!authLoading) setLoaded(true);
      return;
    }
    let cancelled = false;
    supabase
      .from("notification_prefs")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) {
          setPrefs({
            timezone: (data.timezone as string) ?? DEFAULT_PREFS.timezone,
            daily_checkin_enabled: (data.daily_checkin_enabled as boolean) ?? true,
            daily_checkin_time: toTimeInput((data.daily_checkin_time as string) ?? ""),
            actions_morning: (data.actions_morning as boolean) ?? true,
            actions_morning_time: toTimeInput((data.actions_morning_time as string) ?? ""),
            actions_evening: (data.actions_evening as boolean) ?? true,
            actions_evening_time: toTimeInput((data.actions_evening_time as string) ?? ""),
            sin_reminder_enabled: (data.sin_reminder_enabled as boolean) ?? false,
            sin_reminder_time: toTimeInput((data.sin_reminder_time as string) ?? ""),
            quiet_start: toTimeInput((data.quiet_start as string) ?? ""),
            quiet_end: toTimeInput((data.quiet_end as string) ?? ""),
            city: (data.city as string) ?? null,
            country: (data.country as string) ?? null,
          });
        }
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    const row = {
      user_id: user.id,
      timezone: prefs.timezone,
      daily_checkin_enabled: prefs.daily_checkin_enabled,
      daily_checkin_time: fromTimeInput(prefs.daily_checkin_time),
      actions_morning: prefs.actions_morning,
      actions_morning_time: fromTimeInput(prefs.actions_morning_time),
      actions_evening: prefs.actions_evening,
      actions_evening_time: fromTimeInput(prefs.actions_evening_time),
      sin_reminder_enabled: prefs.sin_reminder_enabled,
      sin_reminder_time: fromTimeInput(prefs.sin_reminder_time),
      quiet_start: fromTimeInput(prefs.quiet_start),
      quiet_end: fromTimeInput(prefs.quiet_end),
      city: prefs.city?.trim() || null,
      country: prefs.country?.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("notification_prefs").upsert(row, {
      onConflict: "user_id",
    });
    setSaving(false);
    if (error) {
      alert("Erreur lors de la sauvegarde : " + error.message);
      return;
    }
    router.replace("/account");
  };

  if (authLoading || !loaded) {
    return (
      <div className="w-full flex flex-col px-6 pt-6 pb-8 text-white">
        <p className="text-white/70 text-sm">Chargement…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full flex flex-col px-6 pt-6 pb-8 text-white">
        <p className="text-white/70 text-sm mb-4">Connecte-toi pour gérer tes rappels planifiés.</p>
        <button
          type="button"
          onClick={() => router.push("/login?redirect=/settings/notifications")}
          className="rounded-xl bg-emerald-500/30 border border-emerald-400/50 py-3 text-emerald-200 font-semibold text-sm"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col px-6 pt-6 pb-8 text-white">
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/account"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/15"
            aria-label="Retour"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-white">Rappels planifiés</h1>
        </div>
        <p className="text-white/70 text-sm">Check-in quotidien, actions du matin/soir et rappel optionnel. Les heures sont dans ton fuseau.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Ville / Pays */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="notif-city" className="block text-white/80 text-sm font-medium mb-1.5">Ville</label>
            <input
              id="notif-city"
              type="text"
              value={prefs.city ?? ""}
              onChange={(e) => setPrefs((p) => ({ ...p, city: e.target.value || null }))}
              placeholder="Ex. Lyon"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
          </div>
          <div>
            <label htmlFor="notif-country" className="block text-white/80 text-sm font-medium mb-1.5">Pays</label>
            <input
              id="notif-country"
              type="text"
              value={prefs.country ?? ""}
              onChange={(e) => setPrefs((p) => ({ ...p, country: e.target.value || null }))}
              placeholder="Ex. France"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
          </div>
        </div>

        {/* Fuseau */}
        <div>
          <label htmlFor="notif-timezone" className="block text-white/80 text-sm font-medium mb-1.5">Fuseau horaire</label>
          <select
            id="notif-timezone"
            value={prefs.timezone}
            onChange={(e) => setPrefs((p) => ({ ...p, timezone: e.target.value }))}
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz} className="bg-[#0d2818] text-white">
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in quotidien */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-white/90 text-sm font-medium">Check-in quotidien</label>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.daily_checkin_enabled}
              onClick={() => setPrefs((p) => ({ ...p, daily_checkin_enabled: !p.daily_checkin_enabled }))}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${prefs.daily_checkin_enabled ? "bg-emerald-500" : "bg-white/20"}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${prefs.daily_checkin_enabled ? "translate-x-5" : "translate-x-1"}`} style={{ top: "2px" }} />
            </button>
          </div>
          {prefs.daily_checkin_enabled && (
            <div>
              <label htmlFor="daily-checkin-time" className="block text-white/70 text-xs mb-1">Heure</label>
              <input
                id="daily-checkin-time"
                type="time"
                value={prefs.daily_checkin_time}
                onChange={(e) => setPrefs((p) => ({ ...p, daily_checkin_time: e.target.value }))}
                className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              />
            </div>
          )}
        </div>

        {/* Actions matin */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-white/90 text-sm font-medium">Rappel actions du matin</label>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.actions_morning}
              onClick={() => setPrefs((p) => ({ ...p, actions_morning: !p.actions_morning }))}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${prefs.actions_morning ? "bg-emerald-500" : "bg-white/20"}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${prefs.actions_morning ? "translate-x-5" : "translate-x-1"}`} style={{ top: "2px" }} />
            </button>
          </div>
          {prefs.actions_morning && (
            <div>
              <label htmlFor="actions-morning-time" className="block text-white/70 text-xs mb-1">Heure</label>
              <input
                id="actions-morning-time"
                type="time"
                value={prefs.actions_morning_time}
                onChange={(e) => setPrefs((p) => ({ ...p, actions_morning_time: e.target.value }))}
                className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              />
            </div>
          )}
        </div>

        {/* Actions soir */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-white/90 text-sm font-medium">Rappel actions du soir</label>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.actions_evening}
              onClick={() => setPrefs((p) => ({ ...p, actions_evening: !p.actions_evening }))}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${prefs.actions_evening ? "bg-emerald-500" : "bg-white/20"}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${prefs.actions_evening ? "translate-x-5" : "translate-x-1"}`} style={{ top: "2px" }} />
            </button>
          </div>
          {prefs.actions_evening && (
            <div>
              <label htmlFor="actions-evening-time" className="block text-white/70 text-xs mb-1">Heure</label>
              <input
                id="actions-evening-time"
                type="time"
                value={prefs.actions_evening_time}
                onChange={(e) => setPrefs((p) => ({ ...p, actions_evening_time: e.target.value }))}
                className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              />
            </div>
          )}
        </div>

        {/* Rappel optionnel (sin) */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-white/90 text-sm font-medium">Rappel personnalisé</label>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.sin_reminder_enabled}
              onClick={() => setPrefs((p) => ({ ...p, sin_reminder_enabled: !p.sin_reminder_enabled }))}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${prefs.sin_reminder_enabled ? "bg-emerald-500" : "bg-white/20"}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${prefs.sin_reminder_enabled ? "translate-x-5" : "translate-x-1"}`} style={{ top: "2px" }} />
            </button>
          </div>
          {prefs.sin_reminder_enabled && (
            <div>
              <label htmlFor="sin-reminder-time" className="block text-white/70 text-xs mb-1">Heure</label>
              <input
                id="sin-reminder-time"
                type="time"
                value={prefs.sin_reminder_time}
                onChange={(e) => setPrefs((p) => ({ ...p, sin_reminder_time: e.target.value }))}
                className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              />
            </div>
          )}
        </div>

        {/* Heures calmes */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
          <label className="text-white/90 text-sm font-medium">Heures calmes (pas de notif)</label>
          <p className="text-white/60 text-xs">Les rappels tombant dans cette plage sont décalés après la fin.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="quiet-start" className="block text-white/70 text-xs mb-1">Début</label>
              <input
                id="quiet-start"
                type="time"
                value={prefs.quiet_start}
                onChange={(e) => setPrefs((p) => ({ ...p, quiet_start: e.target.value }))}
                className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              />
            </div>
            <div>
              <label htmlFor="quiet-end" className="block text-white/70 text-xs mb-1">Fin</label>
              <input
                id="quiet-end"
                type="time"
                value={prefs.quiet_end}
                onChange={(e) => setPrefs((p) => ({ ...p, quiet_end: e.target.value }))}
                className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-emerald-500/30 border border-emerald-400/50 py-3 text-emerald-200 font-semibold text-sm hover:bg-emerald-500/40 disabled:opacity-50 transition-colors"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
