"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { dhikrMatin, INVOCATIONS_MATIN_AUDIO_SOURCE, type DhikrItem } from "@/lib/dhikr";
import { todayKey } from "@/lib/date";
import { addInvocations } from "@/lib/progressStats";

const DONE_KEY = "dhikr_matin_done";

export default function DhikrMatinPage() {
  const router = useRouter();
  const [toast, setToast] = useState(false);
  const [doneToday, setDoneToday] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(DONE_KEY);
    setDoneToday(raw === todayKey());
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
        <h1 className="text-xl font-bold tracking-tight text-white">Invocations du matin</h1>
        <p className="text-white/70 text-sm mt-1">
          Commence ta journée par le rappel d&apos;Allah. Chaque invocation est une protection et une bénédiction.
        </p>
        <a
          href={INVOCATIONS_MATIN_AUDIO_SOURCE}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-white/90 text-sm font-medium hover:bg-white/15 transition-colors"
        >
          <span aria-hidden>🔊</span>
          Écouter avec audio et phonétique (Hisnii)
        </a>
      </header>

      <div className="space-y-4 flex-1">
        {dhikrMatin.map((item) => (
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
                  Ton navigateur ne supporte pas l&apos;audio. <a href={INVOCATIONS_MATIN_AUDIO_SOURCE} target="_blank" rel="noopener noreferrer" className="underline">Écouter sur Hisnii</a>.
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
