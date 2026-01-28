"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ensureUserDefaults, saveUser, domainsToSins } from "@/lib/storage";
import { generatePlan } from "@/lib/programEngine";
import { setAuth, setProfile, setState, updateLastRoute } from "@/lib/authState";

export default function ProfilePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window === "undefined" || !firstName.trim() || !age.trim()) return;
    const name = firstName.trim();
    const profile = {
      firstName: name,
      age: parseInt(age, 10),
    };
    window.localStorage.setItem("stopharam_profile", JSON.stringify(profile));
    setProfile({ name, ...profile });
    setAuth({ isLoggedIn: true });
    setState({ onboardingComplete: false, lastRoute: "/profile", startDate: new Date().toISOString().slice(0, 10), dayCount: 0 });
    updateLastRoute("/profile");
    const domainLabelsRaw = window.localStorage.getItem("stopharam_domains");
    const domainLabels = domainLabelsRaw ? (JSON.parse(domainLabelsRaw) as string[]) : [];
    const selectedSins = domainsToSins(domainLabels);
    const scores: Record<string, number> = {};
    selectedSins.forEach((sin) => { scores[sin] = 50; });
    const user = ensureUserDefaults({
      name,
      selectedSins,
      scores,
      startDateISO: new Date().toISOString().slice(0, 10),
      streakDays: 0,
    });
    if (!user.plan?.days?.length) {
      user.plan = generatePlan(user);
    }
    saveUser(user);
    window.localStorage.setItem("user_name", name);
    router.push("/quiz");
  };

  return (
    <main
      className="min-h-screen w-full flex flex-col px-6 pt-10 pb-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #0a1f12 0%, #0d2818 30%, #0f2d22 60%, #0d2435 85%, #0a1c2e 100%)",
      }}
    >
      {/* Légères étoiles en arrière-plan */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <span className="absolute top-[12%] left-[10%] w-1 h-1 rounded-full bg-white/40" />
        <span className="absolute top-[18%] left-[78%] w-1 h-1 rounded-full bg-white/30" />
        <span className="absolute top-[25%] left-[22%] w-1.5 h-1.5 rounded-full bg-white/35" />
        <span className="absolute top-[8%] left-[55%] w-1 h-1 rounded-full bg-white/25" />
        <span className="absolute top-[22%] left-[88%] w-1 h-1 rounded-full bg-white/30" />
      </div>

      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 relative z-10">
        <h1 className="text-white text-2xl sm:text-3xl font-bold text-left mb-8">
          Un peu plus sur toi
        </h1>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="space-y-6 mb-8">
            <div>
              <label
                htmlFor="firstName"
                className="block text-white/90 text-sm font-medium mb-2"
              >
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all"
                placeholder="Ton prénom"
                required
              />
            </div>

            <div>
              <label
                htmlFor="age"
                className="block text-white/90 text-sm font-medium mb-2"
              >
                Âge
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="120"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all"
                placeholder="Ton âge"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!firstName.trim() || !age.trim()}
            className={`w-full py-3.5 rounded-xl font-semibold text-base transition-colors ${
              firstName.trim() && age.trim()
                ? "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                : "bg-white/20 text-white/50 cursor-not-allowed"
            }`}
          >
            Continuer
          </button>
        </form>
      </div>
    </main>
  );
}
