"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STORAGE_KEYS = {
  city: "stopharam_city",
  country: "stopharam_country",
  method: "stopharam_prayer_method",
  school: "stopharam_school",
} as const;

const METHOD_OPTIONS = [
  { value: "2", label: "University of Islamic Sciences, Karachi" },
  { value: "3", label: "Muslim World League" },
  { value: "4", label: "Umm Al-Qura, Makkah" },
  { value: "5", label: "Egyptian General Authority" },
  { value: "8", label: "Institute of Geophysics, University of Tehran" },
  { value: "12", label: "Union des organisations islamiques de France" },
  { value: "13", label: "Diyanet İşleri Başkanlığı, Turkey" },
  { value: "14", label: "Spiritual Administration of Muslims of Russia" },
  { value: "15", label: "Islamic Society of North America" },
] as const;

const SCHOOL_OPTIONS = [
  { value: "0", label: "Shafi, Maliki, Hanbali" },
  { value: "1", label: "Hanafi" },
] as const;

export default function PrayerSettingsPage() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [method, setMethod] = useState("3");
  const [school, setSchool] = useState("0");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setCity(window.localStorage.getItem(STORAGE_KEYS.city) ?? "");
      setCountry(window.localStorage.getItem(STORAGE_KEYS.country) ?? "");
      setMethod(window.localStorage.getItem(STORAGE_KEYS.method) ?? "3");
      setSchool(window.localStorage.getItem(STORAGE_KEYS.school) ?? "0");
    } finally {
      setLoaded(true);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const c = city.trim();
    const co = country.trim();
    if (!c || !co) return;
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.city, c);
    window.localStorage.setItem(STORAGE_KEYS.country, co);
    window.localStorage.setItem(STORAGE_KEYS.method, method);
    window.localStorage.setItem(STORAGE_KEYS.school, school);
    router.replace("/home");
  };

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
          <h1 className="text-xl font-bold tracking-tight text-white">Horaires de prière</h1>
        </div>
        <p className="text-white/70 text-sm">Choisis ta ville pour afficher les horaires.</p>
      </header>

      {!loaded ? (
        <p className="text-white/60 text-sm">Chargement…</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label htmlFor="prayer-city" className="block text-white/80 text-sm font-medium mb-1.5">Ville</label>
            <input
              id="prayer-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex. Lyon"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              required
            />
          </div>
          <div>
            <label htmlFor="prayer-country" className="block text-white/80 text-sm font-medium mb-1.5">Pays</label>
            <input
              id="prayer-country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Ex. France"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              required
            />
          </div>
          <div>
            <label htmlFor="prayer-method" className="block text-white/80 text-sm font-medium mb-1.5">Méthode de calcul</label>
            <select
              id="prayer-method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 appearance-none bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.6)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")" }}
            >
              {METHOD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#0a1f12] text-white">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="prayer-school" className="block text-white/80 text-sm font-medium mb-1.5">École (Asr)</label>
            <select
              id="prayer-school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 appearance-none bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.6)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")" }}
            >
              {SCHOOL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#0a1f12] text-white">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!city.trim() || !country.trim()}
              className={`flex-1 rounded-xl py-3.5 text-base font-semibold transition-colors ${
                city.trim() && country.trim()
                  ? "bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/40"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              }`}
            >
              Enregistrer
            </button>
            <Link
              href="/account"
              className="flex-1 rounded-xl bg-white/10 border border-white/20 py-3.5 text-center text-white/90 font-medium hover:bg-white/15 transition-colors"
            >
              Retour
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
