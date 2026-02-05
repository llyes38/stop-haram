"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

/**
 * Callback Magic Link : Supabase redirige ici après clic sur le lien dans l’email.
 * La session est établie côté client via le hash ; on redirige vers /home.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted && session) {
        setStatus("ok");
        router.replace("/home");
        return;
      }
      // Donner un instant au client pour traiter le hash (magic link)
      const t = window.setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session: s } }) => {
          if (mounted && s) {
            setStatus("ok");
            router.replace("/home");
          } else if (mounted) {
            setStatus("error");
            router.replace("/login");
          }
        });
      }, 500);
      return () => clearTimeout(t);
    };

    run();
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white">
      <p className="text-white/70 text-sm">
        {status === "loading" && "Connexion…"}
        {status === "ok" && "Redirection…"}
        {status === "error" && "Redirection vers la connexion…"}
      </p>
    </main>
  );
}
