"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function GoogleSetupPage() {
  const [data, setData] = useState<{ redirectUri?: string; error?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/google-redirect-uri")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: "Impossible de charger l’URI" }));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white p-6 pb-12">
      <div className="max-w-lg mx-auto space-y-8">
        <h1 className="text-xl font-bold">Connexion Google — config à zéro</h1>
        <p className="text-white/80 text-sm">
          Suis les étapes dans l’ordre. Guide détaillé dans le repo : <code className="text-white/60 bg-black/30 px-1 rounded">docs/CONNEXION-GOOGLE-ETAPE-PAR-ETAPE.md</code>
        </p>

        {/* Étape 1 — Google : écran de consentement */}
        <section className="space-y-2">
          <h2 className="font-semibold text-emerald-300">Étape 1 — Google Cloud : écran de consentement</h2>
          <ol className="text-sm text-white/70 space-y-1 list-decimal list-inside">
            <li><a href="https://console.cloud.google.com/apis/credentials/consent" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">OAuth consent screen</a> → External → App name, emails → Save.</li>
          </ol>
        </section>

        {/* Étape 2 — Google : créer client OAuth + redirect URI */}
        <section className="space-y-2">
          <h2 className="font-semibold text-emerald-300">Étape 2 — Google Cloud : client OAuth (Web)</h2>
          <ol className="text-sm text-white/70 space-y-1 list-decimal list-inside">
            <li><a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">Credentials</a> → Create Credentials → OAuth client ID.</li>
            <li>Application type : <strong>Web application</strong>.</li>
            <li>Authorized JavaScript origins : <code className="bg-black/30 px-1 rounded">https://stop-haram.vercel.app</code> (et <code className="bg-black/30 px-1 rounded">http://localhost:3000</code> si tu testes en local).</li>
            <li>Authorized redirect URIs : ajoute <strong>exactement</strong> l’URI ci-dessous (c’est l’URL Supabase, pas ton site).</li>
          </ol>
          {data?.error && <p className="text-red-300 text-sm">{data.error}</p>}
          {data?.redirectUri && (
            <div className="rounded-xl bg-black/30 p-4 mt-2">
              <p className="text-white/60 text-xs mb-1">URI à copier dans Google (Authorized redirect URIs) :</p>
              <p className="break-all font-mono text-sm text-emerald-200 select-all">{data.redirectUri}</p>
            </div>
          )}
          <p className="text-white/50 text-xs">Copie cette URI, colle-la dans Google → Authorized redirect URIs → Create. Note le Client ID et le Client Secret.</p>
        </section>

        {/* Étape 3 — Supabase : provider Google */}
        <section className="space-y-2">
          <h2 className="font-semibold text-emerald-300">Étape 3 — Supabase : activer Google</h2>
          <ol className="text-sm text-white/70 space-y-1 list-decimal list-inside">
            <li><a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">Supabase Dashboard</a> → ton projet → Authentication → Providers.</li>
            <li>Google → Enable → colle le Client ID et le Client Secret (étape 2) → Save.</li>
          </ol>
        </section>

        {/* Étape 4 — Supabase : URLs */}
        <section className="space-y-2">
          <h2 className="font-semibold text-emerald-300">Étape 4 — Supabase : URL Configuration</h2>
          <ol className="text-sm text-white/70 space-y-1 list-decimal list-inside">
            <li>Authentication → URL Configuration.</li>
            <li>Site URL : <code className="bg-black/30 px-1 rounded">https://stop-haram.vercel.app</code></li>
            <li>Redirect URLs : ajoute <code className="bg-black/30 px-1 rounded">https://stop-haram.vercel.app/api/auth/callback</code> (et <code className="bg-black/30 px-1 rounded">http://localhost:3000/api/auth/callback</code> si besoin).</li>
            <li>Save.</li>
          </ol>
        </section>

        {/* Étape 5 — Env + test */}
        <section className="space-y-2">
          <h2 className="font-semibold text-emerald-300">Étape 5 — Variables d’environnement</h2>
          <p className="text-sm text-white/70">
            .env.local et Vercel : <code className="bg-black/30 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>, <code className="bg-black/30 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, <code className="bg-black/30 px-1 rounded">NEXT_PUBLIC_APP_URL</code>. Puis redéploie sur Vercel et redémarre le serveur en local.
          </p>
        </section>

        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            href="/login"
            className="rounded-xl bg-white/10 px-4 py-2 text-white text-sm font-medium hover:bg-white/20"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </main>
  );
}
