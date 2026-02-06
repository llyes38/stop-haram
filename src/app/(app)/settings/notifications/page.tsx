"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePushNotifications } from "@/lib/usePushNotifications";

const STORAGE_KEY = "stopharam_notification_prefs";

type Prefs = {
  timezone: string;
  daily_checkin_enabled: boolean;
  daily_checkin_time: string;
  checkin_2h_enabled: boolean;
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
  checkin_2h_enabled: false,
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
  const { status: pushStatus, requestPermissionAndSubscribe } = usePushNotifications();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as Partial<Prefs>;
        setPrefs({
          ...DEFAULT_PREFS,
          ...data,
          daily_checkin_time: toTimeInput(data.daily_checkin_time ?? ""),
          actions_morning_time: toTimeInput(data.actions_morning_time ?? ""),
          actions_evening_time: toTimeInput(data.actions_evening_time ?? ""),
          sin_reminder_time: toTimeInput(data.sin_reminder_time ?? ""),
          quiet_start: toTimeInput(data.quiet_start ?? ""),
          quiet_end: toTimeInput(data.quiet_end ?? ""),
        });
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const toSave: Prefs = {
        ...prefs,
        daily_checkin_time: fromTimeInput(prefs.daily_checkin_time),
        actions_morning_time: fromTimeInput(prefs.actions_morning_time),
        actions_evening_time: fromTimeInput(prefs.actions_evening_time),
        sin_reminder_time: fromTimeInput(prefs.sin_reminder_time),
        quiet_start: fromTimeInput(prefs.quiet_start),
        quiet_end: fromTimeInput(prefs.quiet_end),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      }
      router.replace("/account");
    } catch (err) {
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <div className="w-full flex flex-col px-6 pt-6 pb-8 text-white">
        <p className="text-white/70 text-sm">Chargement…</p>
      </div>
    );
  }

  return (
      <div className="w-full flex flex-col px-6 pt-6 pb-8 text-white">
        <p className="text-white/70 text-sm">Charge ton profil depuis l’onglet Compte pour configurer tes rappels.</p>
        <Link href="/account" className="mt-4 rounded-xl bg-emerald-500/30 border border-emerald-400/50 py-3 text-emerald-200 font-semibold text-sm text-center">
          Aller au Compte
        </Link>
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

      {pushStatus !== "subscribed" && pushStatus !== "denied" && (
        <div className="rounded-xl bg-amber-500/15 border border-amber-400/30 px-4 py-4 mb-6">
          <p className="text-amber-200 text-sm font-medium mb-1">Autoriser les notifications sur cet appareil</p>
          <p className="text-white/70 text-xs mb-3">Pour recevoir les rappels à l’heure choisie, ton téléphone doit autoriser l’app. Clique ci-dessous : le navigateur affichera « Autoriser ».</p>
          <button
            type="button"
            onClick={() => requestPermissionAndSubscribe()}
            className="w-full rounded-xl bg-amber-500/40 border border-amber-400/50 py-3 text-amber-100 font-semibold text-sm hover:bg-amber-500/50 transition-colors"
          >
            Activer les notifications
          </button>
        </div>
      )}
      {pushStatus === "denied" && (
        <div className="rounded-xl bg-red-500/15 border border-red-400/25 px-4 py-3 space-y-2 mb-6">
          <p className="text-red-200 text-sm">
            Les notifications sont bloquées. Paramètres du navigateur → Notifications → StopHaram → Autoriser.
          </p>
          <p className="text-red-200/80 text-xs">Après avoir autorisé, clique ici pour réessayer :</p>
          <button
            type="button"
            onClick={() => requestPermissionAndSubscribe()}
            className="rounded-lg bg-red-500/30 border border-red-400/40 px-3 py-2 text-red-100 text-sm font-medium hover:bg-red-500/40"
          >
            Réessayer
          </button>
        </div>
      )}

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
          <div className="flex items-center justify-between gap-3">
            <div>
              <label className="text-white/90 text-sm font-medium block">Check-in quotidien</label>
              <p className="text-white/55 text-xs mt-0.5">Rappel pour faire ton check-in du jour (comment tu vas, rechute, etc.).</p>
            </div>
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

        {/* Check-in toutes les 2 h */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <label className="text-white/90 text-sm font-medium block">Check-in toutes les 2 h</label>
              <p className="text-white/55 text-xs mt-0.5">Toutes les 2 h (8h, 10h, 12h… jusqu&apos;à 22h), on te demande comment tu te sens et on t&apos;envoie une invocation adaptée. Respecte les heures calmes.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.checkin_2h_enabled}
              onClick={() => setPrefs((p) => ({ ...p, checkin_2h_enabled: !p.checkin_2h_enabled }))}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${prefs.checkin_2h_enabled ? "bg-emerald-500" : "bg-white/20"}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${prefs.checkin_2h_enabled ? "translate-x-5" : "translate-x-1"}`} style={{ top: "2px" }} />
            </button>
          </div>
        </div>

        {/* Actions matin */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <label className="text-white/90 text-sm font-medium block">Rappel actions du matin</label>
              <p className="text-white/55 text-xs mt-0.5">Rappel le matin pour penser à tes actions du jour (invocations, objectifs).</p>
            </div>
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
          <div className="flex items-center justify-between gap-3">
            <div>
              <label className="text-white/90 text-sm font-medium block">Rappel actions du soir</label>
              <p className="text-white/55 text-xs mt-0.5">Rappel le soir pour valider ou faire les actions du jour avant la nuit.</p>
            </div>
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
          <div className="flex items-center justify-between gap-3">
            <div>
              <label className="text-white/90 text-sm font-medium block">Rappel personnalisé</label>
              <p className="text-white/55 text-xs mt-0.5">Un rappel à l&apos;heure que tu choisis (optionnel).</p>
            </div>
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
