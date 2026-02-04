"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { dhikrSoir } from "@/lib/dhikrSoir";
import type { DhikrItem } from "@/lib/dhikr";
import {
  getDhikrSoirCountsForToday,
  incrementDhikrSoir,
  DHIKR_SOIR_TARGETS,
  type DhikrSoirCounts,
} from "@/lib/dhikrSoirCounts";
import { todayKey } from "@/lib/date";
import { addInvocations } from "@/lib/progressStats";

const DONE_KEY = "dhikr_soir_done";

export default function DhikrSoirPage() {
  const router = useRouter();
  const [toast, setToast] = useState(false);
  const [doneToday, setDoneToday] = useState(false);
  const [dhikrSoirCounts, setDhikrSoirCounts] = useState<DhikrSoirCounts | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(DONE_KEY);
    setDoneToday(raw === todayKey());
    setDhikrSoirCounts(getDhikrSoirCountsForToday());
  }, []);

  const copyItem = (item: DhikrItem) => {
    const text = item.arabic
      ? `${item.arabic}\n\n${item.french}`
      : item.french;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setToast(true);
        setTimeout(() => setToast(false), 1500);
      });
    }
  };

  const handleDone = () => {
    if (typeof window === "undefined") return;
    if (!doneToday) addInvocations(1);
    window.localStorage.setItem(DONE_KEY, todayKey());
    setDoneToday(true);
    router.back();
  };

  return (
    <div className="w-full min-h-full flex flex-col px-6 pt-8 pb-8 text-white max-w-[420px] mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white">Invocations avant de dormir</h1>
        <p className="text-white/70 text-sm mt-1">
          Termine ta journée par le rappel d&apos;Allah. Chaque invocation est une protection pour la nuit.
        </p>
      </header>

      {/* Compteur avec vibration (33/33/34) */}
      <section className="mb-6 rounded-xl bg-white/5 border border-white/10 px-4 py-4">
        <p className="text-white/70 text-sm mb-2">
          SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34. Touche pour compter.
        </p>
        <p className="text-emerald-200/90 text-sm mb-3 border-l-2 border-emerald-400/40 pl-2">
          « Que tu glorifies Allah 33 fois avant de dormir, que tu loues Allah 33 fois, puis que tu proclames Sa grandeur 34 fois. » — Rapporté par Alî (ra)
        </p>
        <p className="text-white/60 text-xs mb-3">Touche pour compter (vibration à chaque touche).</p>
        {dhikrSoirCounts && (
          <div className="space-y-2">
            {(["subhanallah", "alhamdulillah", "allahu_akbar"] as const).map((key) => {
              const count = dhikrSoirCounts[key];
              const target = DHIKR_SOIR_TARGETS[key];
              const label =
                key === "subhanallah" ? "SubhanAllah" : key === "alhamdulillah" ? "Alhamdulillah" : "Allahu Akbar";
              const isComplete = count >= target;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(50);
                    setDhikrSoirCounts(incrementDhikrSoir(key));
                  }}
                  disabled={isComplete}
                  className={`w-full rounded-xl border py-4 px-4 flex items-center justify-between transition-colors ${
                    isComplete
                      ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-200"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/15 active:scale-[0.98]"
                  }`}
                >
                  <span className="font-semibold">{label}</span>
                  <span className="tabular-nums font-bold text-lg">
                    {count}<span className="text-white/50 font-normal">/{target}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <div className="mb-6 flex items-center gap-2 text-white/70 text-sm">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/80" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </span>
        <span>Audio (bientôt)</span>
      </div>

      <div className="space-y-4 flex-1">
        {dhikrSoir.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-4"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-emerald-200 font-semibold text-sm">{item.title}</h2>
              {item.repeat != null && (
                <span className="rounded-full bg-emerald-500/25 px-2.5 py-0.5 text-emerald-200 text-xs font-semibold shrink-0">
                  ×{item.repeat}
                </span>
              )}
            </div>
            {item.arabic && (
              <p className="text-white/90 text-base mb-2 leading-relaxed" dir="rtl">
                {item.arabic}
              </p>
            )}
            {item.phonetic && (
              <p className="text-white/60 text-xs mb-2 italic" dir="ltr">
                {item.phonetic}
              </p>
            )}
            <p className="text-white/80 text-sm mb-2">{item.french}</p>
            {item.reference && (
              <p className="text-white/50 text-xs mb-2">
                {item.reference}
              </p>
            )}
            {item.merit && (
              <p className="text-emerald-200/80 text-xs mb-3 border-l-2 border-emerald-400/40 pl-2">
                {item.merit}
              </p>
            )}
            {item.audioUrl && (
              <div className="mb-3">
                <audio
                  controls
                  preload="metadata"
                  className="w-full h-9 rounded-lg"
                  src={item.audioUrl}
                >
                  Ton navigateur ne supporte pas l&apos;audio.
                </audio>
              </div>
            )}
            <button
              type="button"
              onClick={() => copyItem(item)}
              className="rounded-lg bg-white/10 border border-white/20 px-3 py-1.5 text-white/90 text-xs font-medium hover:bg-white/15 transition-colors"
            >
              Copier
            </button>
          </div>
        ))}
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-emerald-500/90 px-4 py-2 text-white text-sm font-medium shadow-lg">
          Copié ✓
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleDone}
          className="w-full rounded-xl bg-emerald-500/25 border border-emerald-400/40 py-3.5 text-emerald-200 font-semibold hover:bg-emerald-500/35 transition-colors"
        >
          J&apos;ai terminé ✓
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full rounded-xl border border-white/20 py-3 text-white/80 font-medium hover:bg-white/10 transition-colors"
        >
          Revenir
        </button>
      </div>
    </div>
  );
}
