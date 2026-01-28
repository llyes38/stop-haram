"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEYS = { user_name: "user_name" } as const;

function getUserName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEYS.user_name) || "";
}

export default function ComptePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(getUserName());
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("is_logged_in", "false");
    }
    router.replace("/login");
  };

  return (
    <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white">
      <header className="mb-8">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Compte
        </h1>
      </header>

      <section className="flex-1 space-y-6">
        <div>
          <p className="text-white/60 text-sm">Prénom</p>
          <p className="text-white/90 font-medium">{userName || "—"}</p>
        </div>
        <p className="text-white/50 text-sm leading-relaxed">
          Infos utilisateur et paramètres. Plus d&apos;options à venir.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl bg-white/10 py-3.5 text-white/90 font-medium text-sm hover:bg-white/15 transition-colors border border-white/10"
        >
          Se déconnecter
        </button>
      </section>
    </div>
  );
}
