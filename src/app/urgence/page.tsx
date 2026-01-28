"use client";

import { useRouter } from "next/navigation";

export default function UrgencePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white">
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 px-6 pt-8 pb-8">
        <header className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
            aria-label="Retour"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Besoin d&apos;aide maintenant
          </h1>
        </header>

        <section className="flex-1 flex flex-col gap-6">
          <p className="text-2xl font-semibold text-white text-center py-4">
            O Allah aide-moi 🤲
          </p>
          <p className="text-white/90 text-base leading-relaxed">
            Tu n&apos;es pas seul. Respire. Chaque instant est une nouvelle chance.
          </p>
          <p className="text-white/70 text-sm leading-relaxed">
            Contenu d&apos;aide immédiate à venir (ressources, rappels, soutien).
          </p>
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="mt-auto w-full rounded-xl bg-white/10 py-3.5 text-white font-medium hover:bg-white/20 transition-colors border border-white/10"
          >
            Retour à l&apos;accueil
          </button>
        </section>
      </div>
    </main>
  );
}
