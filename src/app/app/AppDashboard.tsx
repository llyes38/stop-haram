"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import StopHaramLogo from "@/components/brand/StopHaramLogo";
import { supabase } from "@/lib/supabase/client";

export default function AppDashboard({ userEmail }: { userEmail?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  const handlePortal = async () => {
    try {
      const res = await fetch("/api/portal", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } catch {
      // ignore
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white">
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 px-6 pt-12 pb-8">
        <StopHaramLogo size={120} variant="dark" className="block mb-6" />
        <h1 className="text-xl font-bold">Ton espace</h1>
        {userEmail && (
          <p className="text-white/70 text-sm mt-1">{userEmail}</p>
        )}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/home"
            className="w-full rounded-xl bg-white py-4 text-gray-900 font-semibold text-center hover:bg-gray-100 transition-colors"
          >
            Accéder à l&apos;app
          </Link>
          <button
            type="button"
            onClick={handlePortal}
            className="w-full rounded-xl bg-white/10 border border-white/20 py-4 text-white font-medium hover:bg-white/15 transition-colors"
          >
            Gérer mon abonnement
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl border border-white/20 py-4 text-white/80 font-medium hover:bg-white/10 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </main>
  );
}
