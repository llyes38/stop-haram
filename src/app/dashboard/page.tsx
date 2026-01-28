"use client";

import { useRouter } from "next/navigation";

// Nombre affiché pour la communauté (ex. depuis une API plus tard)
const COMMUNITY_COUNT = "13 933";

export default function DashboardPage() {
  const router = useRouter();

  const handleStillStrong = () => {
    // TODO: enregistrer "je tiens bon" (streak, stats)
    router.push("/summary");
  };

  const handleRelapsed = () => {
    // TODO: enregistrer rechute, proposer soutien
    router.push("/summary");
  };

  const handleClose = () => {
    router.push("/summary");
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#1a0a2e] via-[#0f172a] to-[#050818] text-white">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <span className="absolute top-[10%] left-[8%] h-1 w-1 rounded-full bg-white/50" />
        <span className="absolute top-[18%] left-[88%] h-1.5 w-1.5 rounded-full bg-white/40" />
        <span className="absolute top-[35%] left-[12%] h-1 w-1 rounded-full bg-white/30" />
        <span className="absolute top-[55%] left-[85%] h-1 w-1 rounded-full bg-white/35" />
        <span className="absolute top-[75%] left-[20%] h-1.5 w-1.5 rounded-full bg-white/25" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-w-[420px] mx-auto w-full px-5 pt-6 pb-24">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold tracking-tight text-white">
            StopHaram
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/summary")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
              aria-label="Croissance"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </button>
            <button
              type="button"
              onClick={() => router.push("/summary")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
              aria-label="Succès"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </header>

        {/* Médaillon / cercle métallique */}
        <div className="flex justify-center my-6">
          <div
            className="w-40 h-40 rounded-full border-4 border-white/20 shadow-2xl"
            style={{
              background: "radial-gradient(circle at 30% 30%, #e8e8e8, #a0a0a0 40%, #606060 70%, #303030)",
              boxShadow: "inset 0 2px 8px rgba(255,255,255,0.3), inset 0 -4px 8px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.5)",
            }}
          />
        </div>
        <div className="h-px w-16 mx-auto bg-white/20 mb-8" />

        {/* Question + partage */}
        <section className="flex flex-col items-center text-center mb-8">
          <p className="text-4xl mb-2" aria-hidden>👀</p>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-4 max-w-[320px]">
            Avez-vous rechuté ? Informez la communauté
          </h2>
          <p className="text-4xl sm:text-5xl font-bold text-white mb-1 tabular-nums">
            {COMMUNITY_COUNT}
          </p>
          <p className="text-sm text-white/80 mb-8">
            tiennent encore bon
          </p>

          <div className="w-full max-w-[320px] space-y-3">
            <button
              type="button"
              onClick={handleStillStrong}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-500 py-4 text-white font-semibold text-base hover:bg-indigo-600 active:bg-indigo-700 transition-colors shadow-lg border border-white/10"
            >
              Non, je tiens encore bon 💪
            </button>
            <button
              type="button"
              onClick={handleRelapsed}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600/90 py-4 text-white font-semibold text-base hover:bg-red-600 active:bg-red-700 transition-colors border border-red-500/30"
            >
              Oui, j&apos;ai rechuté ⚠️
            </button>
          </div>
        </section>

        {/* Barre de navigation bas */}
        <nav className="fixed bottom-0 left-0 right-0 z-20 max-w-[420px] mx-auto bg-[#0a0f1a]/95 border-t border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-around h-16 px-2">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex flex-col items-center gap-0.5 py-2 text-white/90"
              aria-label="Accueil"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
              <span className="text-[10px]">Accueil</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/summary")}
              className="flex flex-col items-center gap-0.5 py-2 text-white/60 hover:text-white/80"
              aria-label="Stats"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <span className="text-[10px]">Stats</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/summary")}
              className="flex flex-col items-center gap-0.5 py-2 text-white/60 hover:text-white/80"
              aria-label="Succès"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              <span className="text-[10px]">Succès</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/summary")}
              className="flex flex-col items-center gap-0.5 py-2 text-white/60 hover:text-white/80"
              aria-label="Communauté"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <span className="text-[10px]">Communauté</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="flex flex-col items-center gap-0.5 py-2 text-white/60 hover:text-white/80"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              <span className="text-[10px]">Menu</span>
            </button>
          </div>
        </nav>
      </div>
    </main>
  );
}
