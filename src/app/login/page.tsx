"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEYS = {
  is_logged_in: "is_logged_in",
  user_name: "user_name",
} as const;

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleContinue = () => {
    const trimmed = name.trim();
    const displayName = trimmed || "Utilisateur";
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.is_logged_in, "true");
      window.localStorage.setItem(STORAGE_KEYS.user_name, displayName);
    }
    router.replace("/rechute");
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white">
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 px-6 pt-12 pb-8">
        <header className="mb-12">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            StopHaram
          </h1>
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
