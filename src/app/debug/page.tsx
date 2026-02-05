"use client";

import { useState, useEffect, useCallback } from "react";

const BUILD_ID = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_BUILD_ID ?? "local";

export default function DebugPage() {
  const [navStart] = useState(() => (typeof performance !== "undefined" ? performance.timing?.navigationStart ?? Date.now() : Date.now()));
  const [now, setNow] = useState(Date.now());
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [health, setHealth] = useState<{ ok?: boolean; ts?: number; err?: string } | null>(null);
  const [supabasePing, setSupabasePing] = useState<{ ok?: boolean; err?: string } | null>(null);
  const [errors, setErrors] = useState<Array<{ type: string; message: string; time: number }>>([]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onOffline = () => setOnline(false);
    const onOnline = () => setOnline(true);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      setErrors((prev) => [...prev, { type: "error", message: `${e.message} (${e.filename}:${e.lineno})`, time: Date.now() }]);
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const msg = e.reason?.message ?? String(e.reason);
      setErrors((prev) => [...prev, { type: "unhandledrejection", message: msg, time: Date.now() }]);
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  const runHealth = useCallback(async () => {
    setHealth(null);
    try {
      const start = Date.now();
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth({ ok: data.ok, ts: Date.now() - start, err: res.ok ? undefined : `HTTP ${res.status}` });
    } catch (e) {
      setHealth({ err: e instanceof Error ? e.message : String(e) });
    }
  }, []);

  const runSupabasePing = useCallback(async () => {
    setSupabasePing(null);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const start = Date.now();
      const { error } = await supabase.auth.getSession();
      setSupabasePing({ ok: !error, err: error?.message });
    } catch (e) {
      setSupabasePing({ err: e instanceof Error ? e.message : String(e) });
    }
  }, []);

  useEffect(() => {
    runHealth();
  }, [runHealth]);

  const clearStorage = useCallback(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      setErrors([]);
    } catch (_e) {}
  }, []);

  const hardReload = useCallback(() => {
    window.location.reload();
  }, []);

  const elapsed = Math.round((now - navStart) / 1000);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 font-mono text-sm">
      <h1 className="text-lg font-bold mb-4">Debug — chargement</h1>

      <section className="space-y-2 mb-6">
        <p><strong>Build:</strong> {BUILD_ID}</p>
        <p><strong>userAgent:</strong> {typeof navigator !== "undefined" ? navigator.userAgent : "—"}</p>
        <p><strong>Status:</strong> {online ? "online" : "offline"}</p>
        <p><strong>Temps depuis navigationStart:</strong> {elapsed}s</p>
      </section>

      <section className="space-y-2 mb-6">
        <h2 className="font-bold">Fetch /api/health</h2>
        {health === null && <p>En attente…</p>}
        {health?.ok && <p className="text-green-400">OK — {health.ts}ms</p>}
        {health?.err && <p className="text-red-400">Erreur: {health.err}</p>}
        <button type="button" onClick={runHealth} className="mr-2 px-2 py-1 bg-gray-700 rounded">Rafraîchir</button>
      </section>

      <section className="space-y-2 mb-6">
        <h2 className="font-bold">Supabase ping</h2>
        {supabasePing === null && <p>Non testé</p>}
        {supabasePing?.ok && <p className="text-green-400">OK</p>}
        {supabasePing?.err && <p className="text-red-400">Erreur: {supabasePing.err}</p>}
        <button type="button" onClick={runSupabasePing} className="px-2 py-1 bg-gray-700 rounded">Tester Supabase</button>
      </section>

      <section className="mb-6">
        <h2 className="font-bold mb-2">Erreurs capturées (window.onerror + unhandledrejection)</h2>
        {errors.length === 0 && <p className="text-gray-500">Aucune</p>}
        <ul className="list-disc pl-5 space-y-1 text-red-300">
          {errors.map((e, i) => (
            <li key={i}><span className="text-gray-500">[{e.type}]</span> {e.message}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-wrap gap-2">
        <button type="button" onClick={clearStorage} className="px-3 py-2 bg-amber-600 rounded font-medium">
          Clear localStorage + sessionStorage
        </button>
        <button type="button" onClick={hardReload} className="px-3 py-2 bg-blue-600 rounded font-medium">
          Hard reload
        </button>
      </section>
    </main>
  );
}
