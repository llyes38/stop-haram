"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuth, setProfile, getState, FIRST_PARCOURS_STEP } from "@/lib/authState";
import StopHaramLogo from "@/components/brand/StopHaramLogo";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleContinue = () => {
    const trimmed = name.trim();
    const displayName = trimmed || "Utilisateur";
    if (typeof window !== "undefined") {
      setAuth({ isLoggedIn: true });
      setProfile({ name: displayName });
      window.localStorage.setItem("user_name", displayName);
      const state = getState();
      if (state?.onboardingComplete) {
        router.replace("/home");
      } else {
        router.replace(FIRST_PARCOURS_STEP);
      }
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white">
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 px-6 pt-12 pb-8">
        <header className="mb-12">
          <StopHaramLogo size={140} variant="dark" className="block" />
          <p className="text-white/60 text-sm mt-1">
            Un pas à la fois
          </p>
        </header>

        <section className="flex-1">
          <label htmlFor="name" className="block text-white/90 text-sm font-medium mb-2">
            Ton prénom (optionnel)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Comment on t&apos;appelle ?"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 mb-8"
          />
          <button
            type="button"
            onClick={handleContinue}
            className="w-full rounded-xl bg-white py-4 text-gray-900 font-semibold text-base hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          >
            Continuer
          </button>
        </section>
      </div>
    </main>
  );
}
