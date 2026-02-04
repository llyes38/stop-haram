"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

/**
 * Page de confirmation du lien par email (magic link).
 * Supabase redirige ici avec token_hash (et éventuellement type) en query ou en hash.
 * Le serveur (/api/auth/callback) ne reçoit pas le hash, donc on gère tout côté client.
 */
export default function AuthConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const redirectTo = searchParams.get("redirect") ?? "/home";
      const next = redirectTo.startsWith("/") ? redirectTo : "/home";

      // token_hash peut être en query (?token_hash=...&type=email) ou en hash (#token_hash=...&type=...)
      let token_hash = searchParams.get("token_hash");
      let type = searchParams.get("type") ?? "email";

      if (!token_hash && typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.slice(1);
        const params = new URLSearchParams(hash);
        token_hash = params.get("token_hash");
        if (params.get("type")) type = params.get("type") ?? "email";
        // Ancien format : #access_token=...&refresh_token=...
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (cancelled) return;
          if (error) {
            setStatus("error");
            router.replace("/login?error=callback");
            return;
          }
          setStatus("ok");
          router.replace(next);
          return;
        }
      }

      if (!token_hash) {
        if (cancelled) return;
        setStatus("error");
        router.replace("/login?error=callback");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as "email" | "magiclink" | "recovery",
      });

      if (cancelled) return;
      if (error) {
        setStatus("error");
        router.replace("/login?error=callback");
        return;
      }
      setStatus("ok");
      router.replace(next);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white">
      {status === "loading" && (
        <p className="text-white/70 text-sm">Connexion en cours…</p>
      )}
      {status === "error" && (
        <p className="text-amber-200/90 text-sm">Redirection…</p>
      )}
    </main>
  );
}
