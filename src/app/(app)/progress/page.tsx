"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getSinLabel } from "@/lib/storage";

export default function ProgressPage() {
  const router = useRouter();
  const [streakDays, setStreakDays] = useState<number | null>(null);
  const [focusSin, setFocusSin] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    const legacyDays = typeof window !== "undefined" ? window.localStorage.getItem("days_clean") : null;
    setStreakDays(user?.streakDays ?? (legacyDays != null && legacyDays !== "" ? parseInt(legacyDays, 10) : null));
    setFocusSin(user?.plan?.focusSin ? getSinLabel(user.plan.focusSin) : null);
  }, []);

  return (
    <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white">
      <header className="mb-8">
        <h1 className="text-xl font-bold tracking-tight text-white">Progrès (bientôt)</h1>
      </header>

      <section className="flex-1 space-y-6">
        <p className="text-white/90 text-lg">
          {streakDays != null && Number.isFinite(streakDays)
            ? `Jour ${streakDays} sans rechute`
            : "Chaque effort compte."}
        </p>
        {focusSin && (
          <p className="text-white/70 text-sm">
            Focus actuel : {focusSin}
          </p>
        )}
        <p className="text-white/50 text-sm leading-relaxed">
          Statistiques et suivi détaillé à venir.
        </p>
        <button
          type="button"
          onClick={() => router.push("/parcours")}
          className="rounded-xl bg-white/10 py-3 px-4 text-white/90 text-sm font-medium hover:bg-white/20 transition-colors"
        >
          Voir le parcours
        </button>
      </section>
    </div>
  );
}
