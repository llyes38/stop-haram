"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="antialiased min-h-screen flex flex-col items-center justify-center bg-[#0a1f12] px-4">
        <div className="max-w-md w-full rounded-2xl bg-white/10 border border-white/20 p-6 text-white">
          <h1 className="text-xl font-bold mb-2">Erreur au chargement</h1>
          <p className="text-white/80 text-sm mb-4 break-words">
            {error?.message ?? "Erreur inconnue"}
          </p>
          <p className="text-white/50 text-xs mb-6 font-mono break-all max-h-32 overflow-y-auto">
            {error?.stack}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="w-full rounded-xl bg-emerald-500/30 border border-emerald-400/50 py-3.5 text-emerald-200 font-semibold hover:bg-emerald-500/40"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
