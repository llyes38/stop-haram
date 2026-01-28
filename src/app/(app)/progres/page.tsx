"use client";

import { useState, useEffect } from "react";

const STORAGE_KEYS = { days_clean: "days_clean" } as const;

function getDaysClean(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEYS.days_clean);
  if (raw === null || raw === "") return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

export default function ProgresPage() {
  const [daysClean, setDaysClean] = useState<number | null>(null);

  useEffect(() => {
    setDaysClean(getDaysClean());
  }, []);

  const statusText = daysClean !== null ? `Jour ${daysClean} sans rechute` : "Chaque effort compte";

  return (
    <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white">
      <header className="mb-8">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Progrès
        </h1>
      </header>

      <section className="flex-1 space-y-6">
        <p className="text-white/90 text-lg">
          {statusText}
        </p>
        <p className="text-white/60 text-sm leading-relaxed">
          Ta continuité et tes efforts sont enregistrés ici. Pas de chiffres anxiogènes, juste un rappel bienveillant.
        </p>
      </section>
    </div>
  );
}
