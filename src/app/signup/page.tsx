"use client";

import { useRouter } from "next/navigation";

const STORAGE_KEYS = { is_logged_in: "is_logged_in", user_name: "user_name" } as const;

function getProfileFirstName(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = window.localStorage.getItem("stopharam_profile");
    if (!raw) return "";
    const parsed = JSON.parse(raw) as { firstName?: string };
    return typeof parsed.firstName === "string" ? parsed.firstName.trim() : "";
  } catch {
    return "";
  }
}

export default function SignupPage() {
  const router = useRouter();

  const connectAndGoToRechute = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.is_logged_in, "true");
      const name = getProfileFirstName() || "Utilisateur";
      window.localStorage.setItem(STORAGE_KEYS.user_name, name);
    }
    router.replace("/rechute");
  };

  const handleApple = () => {
    // TODO: auth Apple
    connectAndGoToRechute();
  };

  const handleGoogle = () => {
    // TODO: auth Google
    connectAndGoToRechute();
  };

  const handleSkip = () => {
    connectAndGoToRechute();
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#1a0a2e] via-[#0f172a] to-[#050818] text-white">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <span className="absolute top-[12%] left-[10%] h-1 w-1 rounded-full bg-white/50" />
        <span className="absolute top-[25%] left-[85%] h-1.5 w-1.5 rounded-full bg-white/40" />
        <span className="absolute top-[50%] left-[15%] h-1 w-1 rounded-full bg-white/30" />
        <span className="absolute top-[70%] left-[80%] h-1 w-1 rounded-full bg-white/35" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-w-[420px] mx-auto w-full px-5 pt-6 pb-8">
        <header className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
            aria-label="Retour"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-white/60 text-sm">9:41</span>
        </header>

        <div className="flex flex-col items-center flex-1 pt-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-center mb-2">
            StopHaram
          </h1>

          {/* Illustration : oiseau / palmiers style Quittr (simplifié) */}
          <div className="relative w-full max-w-[240px] h-[160px] flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-end justify-center gap-8 pb-4">
              <div className="w-12 h-20 rounded-t-full bg-emerald-600/40 border border-emerald-500/40" style={{ transform: "skew(-5deg)" }} />
              <div className="w-12 h-24 rounded-t-full bg-emerald-600/40 border border-emerald-500/40" style={{ transform: "skew(5deg)" }} />
            </div>
            <div className="relative w-16 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center -mb-2">
              <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">
            Deviens un StopHaram
          </h2>
          <p className="text-sm text-white/80 text-center max-w-[320px] mb-8">
            Rejoins ceux qui reprennent le contrôle. Crée un compte pour sauvegarder ta progression et accéder à ton parcours sur tous tes appareils.
          </p>

          <div className="w-full max-w-[320px] space-y-3">
            <button
              type="button"
              onClick={handleApple}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-white py-3.5 text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Continuer avec Apple
            </button>
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-white py-3.5 text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continuer avec Google
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-500/80 py-3.5 text-white font-semibold hover:bg-indigo-500 transition-colors border border-white/20"
            >
              Passer pour l&apos;instant
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>

          <p className="mt-6 text-xs text-white/60 text-center">
            Tu pourras créer un compte plus tard depuis le menu.
          </p>
        </div>

        <footer className="pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
          <span className="font-medium text-white/50">StopHaram</span>
        </footer>
      </div>
    </main>
  );
}
