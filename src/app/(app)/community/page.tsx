"use client";

import { useState, useEffect, useCallback } from "react";
import { getDeviceId } from "@/lib/deviceId";
import {
  getChallengeProgress,
  computeCommunityScore,
  type ChallengeProgress,
} from "@/lib/challengeProgress";
import { updateLastRoute } from "@/lib/authState";

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "https://www.instagram.com/stopharam.app/";
const CHALLENGE_ID = "challenge_30d_v1";
const LEADERBOARD_LIMIT = 50;

type MainTab = "communaute" | "partenaires";

/** Partenaires de confiance par domaine — bien-être du musulman. À compléter avec tes liens. */
const PARTENAIRES_PAR_DOMAINE: Array<{
  id: string;
  label: string;
  emoji: string;
  description: string;
  liens: Array<{ nom: string; url: string; description?: string; logo?: string }>;
}> = [
  {
    id: "librairies",
    label: "Librairies",
    emoji: "📚",
    description: "Sites de confiance pour livres islamiques, Coran, ouvrages de référence.",
    liens: [
      {
        nom: "Maktaba Tawhid",
        url: "https://maktaba-tawhid.com/fr/",
        description: "Boutique islamique en ligne — livres, Coran, vêtements, médecine prophétique.",
        logo: "/partners/maktaba-tawhid.png",
      },
    ],
  },
  {
    id: "sante",
    label: "Santé",
    emoji: "🩺",
    description: "Ressources santé, bien-être physique et mental, conseils fiables.",
    liens: [
      {
        nom: "La Médecine Prophétique",
        url: "https://www.medecine-prophetique.com/",
        description: "Un mode de vie sain — médecine prophétique, formations, consultations.",
        logo: "/partners/medecine-prophetique.png",
      },
    ],
  },
  {
    id: "vetements",
    label: "Vêtements & mode modeste",
    emoji: "👔",
    description: "Boutiques et marques pour une tenue pudente et élégante.",
    liens: [
      { nom: "Exemple mode", url: "#", description: "À remplacer par un partenaire de confiance" },
    ],
  },
  {
    id: "nourriture",
    label: "Nourriture halal",
    emoji: "🥗",
    description: "Restaurants, épiceries et produits halal de confiance.",
    liens: [
      { nom: "Exemple halal", url: "#", description: "À remplacer par un partenaire de confiance" },
    ],
  },
  {
    id: "education",
    label: "Éducation & spiritualité",
    emoji: "📖",
    description: "Cours en ligne, rappels, accompagnement spirituel.",
    liens: [
      { nom: "Exemple formation", url: "#", description: "À remplacer par un site de confiance" },
    ],
  },
];

type LeaderboardEntry = {
  device_key: string;
  display_name: string;
  instagram_handle: string | null;
  score: number;
  streak_days: number;
  completed_at: string | null;
  created_at?: string;
  updated_at?: string;
};

type MyEntry = {
  device_key: string;
  display_name: string;
  instagram_handle: string | null;
  score: number;
  streak_days: number;
  completed_at: string | null;
  consent_public: boolean;
  eligible_for_draw: boolean;
  draw_month: string | null;
  updated_at?: string;
} | null;

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="h-12 rounded-xl bg-white/5 border border-white/10 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function CommunityPage() {
  const [mainTab, setMainTab] = useState<MainTab>("communaute");
  const [progress, setProgress] = useState<ChallengeProgress | null>(null);
  const [myEntry, setMyEntry] = useState<MyEntry>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [tab, setTab] = useState<"30j" | "semaine">("30j");

  const [displayName, setDisplayName] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [consentPublic, setConsentPublic] = useState(false);

  const [saving, setSaving] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [joiningDraw, setJoiningDraw] = useState(false);
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);

  const deviceKey = typeof window !== "undefined" ? getDeviceId() : "";

  const refreshProgress = useCallback(() => {
    const p = getChallengeProgress();
    setProgress(p);
  }, []);

  useEffect(() => {
    updateLastRoute("/community");
    refreshProgress();
  }, [refreshProgress]);

  useEffect(() => {
    if (!deviceKey) return;
    fetch(`/api/community/me?device_key=${encodeURIComponent(deviceKey)}`)
      .then((r) => r.json())
      .then((data) => {
        const entry = data?.entry ?? null;
        setMyEntry(entry);
        if (entry) {
          setDisplayName(entry.display_name || "");
          setInstagramHandle(entry.instagram_handle ? `@${entry.instagram_handle}` : "");
          setConsentPublic(!!entry.consent_public);
        }
      })
      .catch(() => {});
  }, [deviceKey]);

  useEffect(() => {
    setLeaderboardLoading(true);
    setLeaderboardError(null);
    fetch(
      `/api/community/leaderboard?challenge_id=${CHALLENGE_ID}&limit=${LEADERBOARD_LIMIT}`
    )
      .then((r) => {
        if (!r.ok) throw new Error("Erreur réseau");
        return r.json();
      })
      .then((data) => {
        setEntries(Array.isArray(data?.entries) ? data.entries : []);
      })
      .catch(() => {
        setLeaderboardError("Impossible de charger le classement — réessaie.");
        setEntries([]);
      })
      .finally(() => setLeaderboardLoading(false));
  }, [myEntry?.updated_at]);

  const showToast = (message: string, error?: boolean) => {
    setToast({ message, error });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = async () => {
    const name = displayName.trim();
    if (name.length < 3 || name.length > 20) {
      showToast("Le pseudo doit faire entre 3 et 20 caractères.", true);
      return;
    }
    setSaving(true);
    try {
      const score = progress ? computeCommunityScore(progress) : 0;
      const streakDays = progress?.streakDays ?? 0;
      const completedAt =
        progress?.isCompleted && progress?.lastDayCompletedAt
          ? progress.lastDayCompletedAt
          : null;
      const res = await fetch("/api/community/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_key: deviceKey,
          display_name: name,
          instagram_handle: instagramHandle.replace(/^@/, "").trim() || null,
          score,
          streak_days: streakDays,
          completed_at: completedAt,
          consent_public: consentPublic,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(data?.error || "Erreur lors de l'enregistrement", true);
        return;
      }
      showToast("Profil enregistré.");
      setMyEntry((prev) =>
        prev
          ? {
              ...prev,
              display_name: name,
              instagram_handle: instagramHandle.replace(/^@/, "").trim() || null,
              score,
              streak_days: streakDays,
              completed_at: completedAt,
              consent_public: consentPublic,
            }
          : null
      );
      if (consentPublic && streakDays > 0) {
        setEntries((prev) => {
          const next = [...prev];
          const idx = next.findIndex((e) => e.device_key === deviceKey);
          const newEntry = {
            device_key: deviceKey,
            display_name: name,
            instagram_handle: instagramHandle.replace(/^@/, "").trim() || null,
            score,
            streak_days: streakDays,
            completed_at: completedAt,
          };
          if (idx >= 0) next[idx] = { ...next[idx], ...newEntry };
          else next.push(newEntry);
          next.sort((a, b) => b.score - a.score);
          return next.slice(0, LEADERBOARD_LIMIT);
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      const res = await fetch("/api/community/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_key: deviceKey }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(data?.error || "Erreur", true);
        return;
      }
      showToast("Tu as été retiré du classement.");
      setConsentPublic(false);
      setInstagramHandle("");
      setMyEntry((prev) =>
        prev
          ? {
              ...prev,
              consent_public: false,
              instagram_handle: null,
              eligible_for_draw: false,
              draw_month: null,
            }
          : null
      );
      setEntries((prev) => prev.filter((e) => e.device_key !== deviceKey));
    } finally {
      setWithdrawing(false);
    }
  };

  const handlePublishScore = async () => {
    if (!progress || progress.streakDays <= 0 || !consentPublic) return;
    setPublishing(true);
    try {
      const score = computeCommunityScore(progress);
      const completedAt = progress.isCompleted && progress.lastDayCompletedAt ? progress.lastDayCompletedAt : null;
      const res = await fetch("/api/community/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_key: deviceKey,
          display_name: (() => {
            const n = (displayName.trim() || myEntry?.display_name || "Anon").slice(0, 20);
            return n.length >= 3 ? n : "Anon";
          })(),
          instagram_handle: instagramHandle.replace(/^@/, "").trim() || null,
          score,
          streak_days: progress.streakDays,
          completed_at: completedAt,
          consent_public: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(data?.error || "Erreur", true);
        return;
      }
      showToast("Score publié.");
      refreshProgress();
      setMyEntry((prev) =>
        prev
          ? {
              ...prev,
              score,
              streak_days: progress.streakDays,
              completed_at: completedAt,
              consent_public: true,
            }
          : null
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleJoinDraw = async () => {
    setJoiningDraw(true);
    try {
      const res = await fetch("/api/community/join-draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_key: deviceKey }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(data?.error || "Erreur", true);
        return;
      }
      showToast("Tu participes au tirage ce mois.");
      setMyEntry((prev) =>
        prev ? { ...prev, eligible_for_draw: true, draw_month: data?.draw_month ?? null } : null
      );
    } finally {
      setJoiningDraw(false);
    }
  };

  const score = progress ? computeCommunityScore(progress) : 0;
  const canPublishScore =
    progress && progress.streakDays > 0 && consentPublic;
  const canJoinDraw =
    progress &&
    progress.streakDays >= 30 &&
    consentPublic &&
    (instagramHandle.replace(/^@/, "").trim() || "").length > 0 &&
    !myEntry?.eligible_for_draw;

  return (
    <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white max-w-[420px] mx-auto">
      {/* Onglets Communauté / Partenaires (comme Parcours / Progrès) */}
      <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 mb-6">
        <button
          type="button"
          onClick={() => setMainTab("communaute")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
            mainTab === "communaute" ? "bg-white/15 text-white" : "text-white/60 hover:text-white/80"
          }`}
        >
          Communauté
        </button>
        <button
          type="button"
          onClick={() => setMainTab("partenaires")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
            mainTab === "partenaires" ? "bg-white/15 text-white" : "text-white/60 hover:text-white/80"
          }`}
        >
          Partenaires
        </button>
      </div>

      {mainTab === "partenaires" ? (
        /* === CONTENU PARTENAIRES === */
        <section className="flex-1 space-y-6">
          <header className="mb-4">
            <h1 className="text-lg font-bold text-white">Partenaires de confiance</h1>
            <p className="text-white/60 text-sm mt-0.5">
              Librairies, santé, mode modeste, halal… des sites en phase avec ton bien-être.
            </p>
          </header>
          {PARTENAIRES_PAR_DOMAINE.map((domaine) => (
            <div
              key={domaine.id}
              className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl" aria-hidden>{domaine.emoji}</span>
                <h2 className="text-white font-semibold text-base">{domaine.label}</h2>
              </div>
              <p className="text-white/60 text-xs mb-4">{domaine.description}</p>
              <ul className="space-y-2">
                {domaine.liens.map((lien, i) => (
                  <li key={i}>
                    <a
                      href={lien.url}
                      target={lien.url.startsWith("http") ? "_blank" : undefined}
                      rel={lien.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3 hover:bg-white/10 transition-colors"
                    >
                      {lien.logo && (
                        <img
                          src={lien.logo}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg object-contain bg-emerald-950/50"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-emerald-200 font-medium text-sm">{lien.nom}</span>
                        {lien.description && (
                          <span className="text-white/50 text-xs mt-0.5 block">{lien.description}</span>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-white/40 text-xs text-center">
            Ces liens sont des suggestions. Tu peux les compléter dans le code (PARTENAIRES_PAR_DOMAINE).
          </p>
        </section>
      ) : (
        <>
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white">Communauté</h1>
        <p className="text-white/60 text-sm mt-1">
          Classement 30 jours — motive-toi avec les autres
        </p>
      </header>

      {/* A) Cadeaux + Instagram */}
      <section className="mb-6 rounded-2xl bg-amber-500/10 border border-amber-400/25 px-5 py-5">
        <h2 className="text-amber-200 font-semibold text-base mb-2">🎁 Cadeaux</h2>
        <p className="text-white/85 text-sm leading-relaxed mb-4">
          Chaque mois, tirage au sort parmi les meilleurs. Lots : vêtements islamiques, Coran, sadaqa, etc.
        </p>
        {INSTAGRAM_URL ? (
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 border border-white/20 py-2.5 px-4 text-white font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <InstagramIcon className="w-5 h-5" />
            Voir sur Instagram
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 py-2.5 px-4 text-white/60 text-sm">
            <InstagramIcon className="w-5 h-5" />
            Instagram bientôt disponible
          </span>
        )}
      </section>

      {/* B) Mon profil communauté */}
      <section className="mb-6 rounded-2xl bg-white/5 border border-white/10 px-5 py-5">
        <h2 className="text-white font-semibold text-base mb-4">Mon profil communauté</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-1">Pseudo (3–20 caractères)</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="ex: AbdErrahman"
              maxLength={20}
              className="w-full rounded-xl bg-black/30 border border-white/20 px-4 py-2.5 text-white placeholder-white/40 text-sm"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-1">Instagram (optionnel, avec ou sans @)</label>
            <input
              type="text"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              placeholder="@pseudo"
              className="w-full rounded-xl bg-black/30 border border-white/20 px-4 py-2.5 text-white placeholder-white/40 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={consentPublic}
              onChange={(e) => setConsentPublic(e.target.checked)}
              className="rounded border-white/30 bg-black/30 text-amber-500 focus:ring-amber-500/50"
            />
            <span className="text-white/85 text-sm">J&apos;accepte d&apos;apparaître dans le classement</span>
          </label>
          <p className="text-white/50 text-xs">
            Tu peux changer ton pseudo quand tu veux. Aucun email n&apos;est affiché.
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving || displayName.trim().length < 3 || displayName.trim().length > 20}
              className="w-full rounded-xl bg-amber-500/40 border border-amber-400/50 py-3 text-amber-100 font-semibold text-sm hover:bg-amber-500/50 disabled:opacity-50 transition-colors"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={withdrawing || !myEntry?.consent_public}
              className="w-full rounded-xl border border-white/20 bg-white/5 py-2.5 text-white/80 text-sm font-medium hover:bg-white/10 disabled:opacity-50 transition-colors"
            >
              {withdrawing ? "…" : "Me retirer du classement"}
            </button>
          </div>
        </div>
      </section>

      {/* C) Mon score */}
      <section className="mb-6 rounded-2xl bg-white/5 border border-white/10 px-5 py-5">
        <h2 className="text-white font-semibold text-base mb-4">Mon score</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <span className="text-white/50 text-xs block">Score</span>
            <span className="text-white font-bold text-lg">{score}</span>
          </div>
          <div>
            <span className="text-white/50 text-xs block">Jours complétés</span>
            <span className="text-white font-bold text-lg">{progress?.completedDays ?? 0} / 30</span>
          </div>
          <div>
            <span className="text-white/50 text-xs block">Statut</span>
            <span className="text-white font-medium">
              {(progress?.streakDays ?? 0) >= 30 ? "Terminé ✅" : "En cours"}
            </span>
          </div>
        </div>
        {canPublishScore && (
          <button
            type="button"
            onClick={handlePublishScore}
            disabled={publishing}
            className="w-full rounded-xl bg-emerald-500/40 border border-emerald-400/50 py-2.5 text-emerald-100 font-medium text-sm hover:bg-emerald-500/50 disabled:opacity-50 transition-colors"
          >
            {publishing ? "Publication…" : "Publier mon score"}
          </button>
        )}
      </section>

      {/* D) Classement */}
      <section className="mb-6 rounded-2xl bg-white/5 border border-white/10 px-5 py-5">
        <h2 className="text-white font-semibold text-base mb-4">Classement</h2>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setTab("30j")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "30j" ? "bg-amber-500/30 text-amber-200" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            Défi 30 jours
          </button>
          <button
            type="button"
            onClick={() => setTab("semaine")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "semaine" ? "bg-amber-500/30 text-amber-200" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            Cette semaine
          </button>
        </div>
        {tab === "semaine" && (
          <p className="text-white/50 text-sm mb-4">Bientôt disponible.</p>
        )}
        {tab === "30j" && (
          <>
            {leaderboardLoading && <LeaderboardSkeleton />}
            {!leaderboardLoading && leaderboardError && (
              <p className="text-amber-200/90 text-sm py-4">{leaderboardError}</p>
            )}
            {!leaderboardLoading && !leaderboardError && entries.length === 0 && (
              <p className="text-white/50 text-sm py-4">Aucun participant pour l&apos;instant.</p>
            )}
            {!leaderboardLoading && !leaderboardError && entries.length > 0 && (
              <ul className="space-y-2">
                {entries.map((e, i) => (
                  <li
                    key={e.device_key}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                      e.device_key === deviceKey ? "bg-amber-500/20 border border-amber-400/40" : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <span className="w-6 text-white/70 text-sm font-medium">
                      {i + 1 === 1 ? "🥇" : i + 1 === 2 ? "🥈" : i + 1 === 3 ? "🥉" : i + 1}
                    </span>
                    <span className="flex-1 text-white font-medium truncate">{e.display_name}</span>
                    <span className="text-amber-200/90 text-sm font-semibold">{e.score}</span>
                    {e.completed_at && (
                      <span className="text-emerald-400/90 text-xs">Terminé</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      {/* E) Tirage cadeaux */}
      <section className="mb-6 rounded-2xl bg-amber-500/10 border border-amber-400/25 px-5 py-5">
        <h2 className="text-amber-200 font-semibold text-base mb-2">Tirage cadeaux</h2>
        <p className="text-white/85 text-sm leading-relaxed mb-4">
          Fin de mois : tirage parmi le TOP 20 ayant terminé le défi. Renseigne ton Instagram et participe.
        </p>
        {myEntry?.eligible_for_draw ? (
          <p className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 py-3 px-4 text-emerald-200 text-sm font-medium text-center">
            Tu participes au tirage ce mois ✅
          </p>
        ) : canJoinDraw ? (
          <button
            type="button"
            onClick={handleJoinDraw}
            disabled={joiningDraw}
            className="w-full rounded-xl bg-amber-500/40 border border-amber-400/50 py-3 text-amber-100 font-semibold text-sm hover:bg-amber-500/50 disabled:opacity-50 transition-colors"
          >
            {joiningDraw ? "…" : "Participer au tirage"}
          </button>
        ) : (
          <p className="text-white/60 text-sm">
            Pour participer : termine les 30 jours, accepte d&apos;apparaître dans le classement et renseigne ton Instagram.
          </p>
        )}
      </section>

      {toast && (
        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-full px-4 py-2 shadow-lg text-sm font-medium ${
            toast.error ? "bg-red-500/90 text-white" : "bg-emerald-500/90 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
        </>
      )}
    </div>
  );
}
