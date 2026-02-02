"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getUser,
  ensureUserDefaults,
  saveUser,
  getDayNumber,
  getSinLabel,
  getScoreLabel,
  hasDefiStarted,
} from "@/lib/storage";
import type {
  StopHaramUser,
  SituationFamiliale,
  StatutPro,
  Genre,
  PratiqueJour,
  Voilee,
  TypeLogement,
  Converti,
} from "@/lib/storage";
import { generatePlan, ACTION_1, needsAIActionsForCustomSin } from "@/lib/programEngine";
import { compressImageToBase64 } from "@/lib/profilePhoto";
import { setAuth, setProfile, resetOnboarding } from "@/lib/authState";
import { updateLastRoute } from "@/lib/authState";
import type { SelectedSin } from "@/lib/storage";
import {
  getNotifPriere,
  setNotifPriere,
  getNotifActions,
  setNotifActions,
  getNotifVersetHadith,
  setNotifVersetHadith,
} from "@/lib/notificationPrefs";
import { APP_URL, canShare, shareWithNative, copyToClipboard } from "@/lib/share";
import { useSupabaseAuth } from "@/components/auth/AuthProvider";
import { saveProgress } from "@/lib/progressStorage";

type Tab = "profil" | "objectifs" | "plan";
type View = "list" | Tab;

function CardRow({
  icon,
  label,
  onClick,
  iconColor = "text-emerald-400",
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  iconColor?: string;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3.5 text-left hover:bg-white/10 transition-colors"
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconColor}`}>{icon}</span>
      <span className="flex-1 text-white/90 text-sm font-medium">{label}</span>
      {onClick && (
        <svg className="h-5 w-5 text-white/40 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Wrapper>
  );
}

const GENRES: { value: Genre; label: string }[] = [
  { value: "", label: "Ne pas préciser" },
  { value: "homme", label: "Homme" },
  { value: "femme", label: "Femme" },
];

const SITUATIONS: { value: SituationFamiliale; label: string }[] = [
  { value: "", label: "Ne pas préciser" },
  { value: "celibataire", label: "Célibataire" },
  { value: "marie", label: "Marié(e)" },
  { value: "divorce", label: "Divorcé(e)" },
  { value: "veuf", label: "Veuf(ve)" },
  { value: "autre", label: "Autre" },
];

const STATUTS: { value: StatutPro; label: string }[] = [
  { value: "", label: "Ne pas préciser" },
  { value: "etudiant", label: "Étudiant(e)" },
  { value: "activite", label: "En activité" },
  { value: "sans_emploi", label: "Sans emploi" },
  { value: "retraite", label: "Retraité(e)" },
  { value: "autre", label: "Autre" },
];

const PRIE_OPTIONS: { value: PratiqueJour; label: string }[] = [
  { value: "", label: "Ne pas préciser" },
  { value: "oui", label: "Oui, régulièrement" },
  { value: "parfois", label: "Parfois / irrégulièrement" },
  { value: "non", label: "Non" },
];

const VOILEE_OPTIONS: { value: Voilee; label: string }[] = [
  { value: "", label: "Ne pas préciser" },
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
];

const LOGEMENT_OPTIONS: { value: TypeLogement; label: string }[] = [
  { value: "", label: "Ne pas préciser" },
  { value: "seul", label: "Seul(e)" },
  { value: "famille", label: "En famille" },
  { value: "colocation", label: "En colocation" },
];

const CONVERTI_OPTIONS: { value: Converti; label: string }[] = [
  { value: "", label: "Ne pas préciser" },
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non (musulman de naissance)" },
];

const selectStyle = {
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
};

function NotifToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-white/90 text-sm font-medium">{label}</p>
        {description && (
          <p className="text-white/60 text-xs mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
          checked ? "border-emerald-400/50 bg-emerald-500/30" : "border-white/20 bg-white/10"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: supabaseUser, loading: authLoading, signOut: supabaseSignOut } = useSupabaseAuth();
  const [user, setUser] = useState<StopHaramUser | null>(null);
  const [tab, setTab] = useState<Tab>("profil");
  const [view, setView] = useState<View>("list");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "plan" || t === "objectifs" || t === "profil") {
      setTab(t);
      setView(t);
    }
  }, [searchParams]);
  const [editName, setEditName] = useState("");
  const [editGenre, setEditGenre] = useState<Genre>("");
  const [editSituation, setEditSituation] = useState<SituationFamiliale>("");
  const [editStatut, setEditStatut] = useState<StatutPro>("");
  const [editAge, setEditAge] = useState("");
  const [editVille, setEditVille] = useState("");
  const [editPrie, setEditPrie] = useState<PratiqueJour>("");
  const [editVoilee, setEditVoilee] = useState<Voilee>("");
  const [editLogement, setEditLogement] = useState<TypeLogement>("");
  const [editConverti, setEditConverti] = useState<Converti>("");
  const [editEnfantsFilles, setEditEnfantsFilles] = useState("");
  const [editEnfantsGarcons, setEditEnfantsGarcons] = useState("");
  const [saved, setSaved] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notifPriere, setNotifPriereState] = useState(true);
  const [notifActions, setNotifActionsState] = useState(true);
  const [notifVersetHadith, setNotifVersetHadithState] = useState(true);

  useEffect(() => {
    let u = getUser();
    if (!u || !u.plan?.days?.length) {
      u = ensureUserDefaults(u ? { ...u } : {});
      if (!u.plan?.days?.length) {
        u = { ...u, plan: generatePlan(u) };
        saveUser(u);
      }
    } else if (u.plan && u.selectedSins?.length) {
      u = { ...u, plan: generatePlan(u) };
      saveUser(u);
    }
    
    // S'assurer que actionsPerDay est défini (par défaut 3)
    if (u && !u.profileInfo?.actionsPerDay) {
      u = {
        ...u,
        profileInfo: {
          ...u.profileInfo,
          actionsPerDay: 3,
        },
      };
      saveUser(u);
    }
    
    setUser(u);
    if (u) {
      setEditName(u.name || "");
      setEditGenre((u.profileInfo?.genre as Genre) ?? "");
      setEditSituation((u.profileInfo?.situation as SituationFamiliale) ?? "");
      setEditStatut((u.profileInfo?.statut as StatutPro) ?? "");
      setEditAge(u.profileInfo?.age != null ? String(u.profileInfo.age) : "");
      setEditVille(u.profileInfo?.ville || "");
      setEditPrie((u.profileInfo?.prie as PratiqueJour) ?? "");
      setEditVoilee((u.profileInfo?.voilee as Voilee) ?? "");
      setEditLogement((u.profileInfo?.logement as TypeLogement) ?? "");
      setEditConverti((u.profileInfo?.converti as Converti) ?? "");
      setEditEnfantsFilles(u.profileInfo?.enfantsFilles != null ? String(u.profileInfo.enfantsFilles) : "");
      setEditEnfantsGarcons(u.profileInfo?.enfantsGarcons != null ? String(u.profileInfo.enfantsGarcons) : "");
    }
    setNotifPriereState(getNotifPriere());
    setNotifActionsState(getNotifActions());
    setNotifVersetHadithState(getNotifVersetHadith());
  }, []);

  const handleNotifPriereChange = (v: boolean) => {
    setNotifPriere(v);
    setNotifPriereState(v);
  };
  const handleNotifActionsChange = (v: boolean) => {
    setNotifActions(v);
    setNotifActionsState(v);
  };
  const handleNotifVersetHadithChange = (v: boolean) => {
    setNotifVersetHadith(v);
    setNotifVersetHadithState(v);
  };

  const handleSaveProfil = () => {
    if (!user) return;
    const age = editAge.trim() ? parseInt(editAge, 10) : null;
    const updated: StopHaramUser = {
      ...user,
      name: editName.trim() || user.name,
      profileInfo: {
        ...user.profileInfo,
        genre: editGenre || undefined,
        situation: editSituation || undefined,
        statut: editStatut || undefined,
        age: age != null && !Number.isNaN(age) ? age : undefined,
        ville: editVille.trim() || undefined,
        prie: editPrie || undefined,
        voilee: editGenre === "femme" && editVoilee ? editVoilee : undefined,
        logement: editLogement || undefined,
        converti: editConverti || undefined,
        enfantsFilles: Math.max(0, parseInt(editEnfantsFilles, 10) || 0),
        enfantsGarcons: Math.max(0, parseInt(editEnfantsGarcons, 10) || 0),
      },
    };
    saveUser(updated);
    setUser(updated);
    setProfile({ name: updated.name });
    const userId = supabaseUser?.id ?? null;
    if (userId) {
      saveProgress(
        { profile: { name: updated.name }, storage_user: updated as unknown as Record<string, unknown> },
        userId
      );
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !file.type.startsWith("image/")) return;
    e.target.value = "";
    setPhotoUploading(true);
    try {
      const dataUrl = await compressImageToBase64(file);
      const updated: StopHaramUser = {
        ...user,
        profileInfo: { ...user.profileInfo, profilePhoto: dataUrl },
      };
      saveUser(updated);
      setUser(updated);
      const userId = supabaseUser?.id ?? null;
      if (userId) saveProgress({ storage_user: updated as unknown as Record<string, unknown> }, userId);
    } catch {
      // Silently ignore compression errors
    } finally {
      setPhotoUploading(false);
    }
  };

  const handlePhotoRemove = () => {
    if (!user) return;
    const updated: StopHaramUser = {
      ...user,
      profileInfo: { ...user.profileInfo, profilePhoto: undefined },
    };
    saveUser(updated);
    setUser(updated);
    const userId = supabaseUser?.id ?? null;
    if (userId) saveProgress({ storage_user: updated as unknown as Record<string, unknown> }, userId);
  };

  if (!user || authLoading) {
    return (
      <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white">
        <p className="text-white/70 text-sm">Chargement du profil…</p>
      </div>
    );
  }

  const dayNum = getDayNumber(user.startDateISO);
  const currentDayIndex = Math.min(Math.max(dayNum - 1, 0), user.plan.days.length - 1);
  const dayPlan = user.plan.days[currentDayIndex];

  const handleShareApp = async () => {
    const shareData = {
      title: "StopHaram",
      text: "Je reprends le contrôle avec StopHaram. Rejoins-moi ! " + APP_URL,
      url: APP_URL,
    };
    if (canShare()) {
      await shareWithNative(shareData);
    } else {
      const ok = await copyToClipboard(`${shareData.text}\n${APP_URL}`);
      if (ok) {
        setToast(true);
        setTimeout(() => setToast(false), 2000);
      }
    }
  };

  const handleDeleteData = () => {
    if (typeof window === "undefined" || !confirm("Supprimer toutes tes données locales ? Tu devras repasser par le questionnaire.")) return;
    setAuth({ isLoggedIn: false });
    localStorage.clear();
    window.location.href = "/start";
  };

  const showBackButton = view !== "list";

  return (
    <div className="w-full flex flex-col px-6 pt-6 pb-8 text-white">
      <header className="mb-6 flex items-center gap-4">
        {showBackButton && (
          <button
            type="button"
            onClick={() => setView("list")}
            className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/15 transition-colors"
            aria-label="Retour"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="shrink-0">
          {user.profileInfo?.profilePhoto ? (
            <img
              src={user.profileInfo.profilePhoto}
              alt=""
              className="h-14 w-14 rounded-full object-cover border-2 border-white/20"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 text-xl font-semibold">
              {(user.name || "?")[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">{view === "list" ? "Compte" : view === "profil" ? "Mon profil" : view === "objectifs" ? "Objectifs" : "Plan"}</h1>
          <p className="text-white/90 text-lg mt-0.5">Salam {user.name || "toi"}</p>
        </div>
      </header>

      {view === "list" ? (
        /* === VUE LISTE (cards) === */
        <section className="space-y-8">
          {!supabaseUser && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/30 px-5 py-5">
              <h3 className="text-white font-semibold text-base mb-2">Connecte-toi</h3>
              <p className="text-white/70 text-sm mb-4">
                Connecte-toi pour sauvegarder tes résultats sur tous tes appareils.
              </p>
              <button
                type="button"
                onClick={() => router.push("/login?redirect=/account")}
                className="w-full rounded-xl bg-emerald-500/30 border border-emerald-400/50 py-3 text-emerald-200 font-semibold text-sm hover:bg-emerald-500/40 transition-colors"
              >
                Se connecter (Google ou email)
              </button>
            </div>
          )}
          <div>
            <h2 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">Paramètres</h2>
            <div className="space-y-2">
              {/* Carte "Rappels" supprimée — ne garder que Notifications */}
              <CardRow
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                label="Mon profil"
                onClick={() => { setTab("profil"); setView("profil"); }}
                iconColor="text-cyan-400"
              />
              <CardRow
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
                label="Horaires de prière"
                onClick={() => router.push("/account/prayer-settings")}
                iconColor="text-amber-400"
              />
              <CardRow
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
                label="Objectifs"
                onClick={() => { setTab("objectifs"); setView("objectifs"); }}
                iconColor="text-emerald-400"
              />
              <CardRow
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                label="Plan"
                onClick={() => { setTab("plan"); setView("plan"); }}
                iconColor="text-violet-400"
              />
              <CardRow
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
                label="Notifications"
                onClick={() => { setTab("profil"); setView("profil"); }}
                iconColor="text-indigo-400"
              />
            </div>
          </div>

          <div>
            <h2 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">À propos</h2>
            <div className="space-y-2">
              <CardRow
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                label="Évaluer StopHaram"
                onClick={() => window.open("https://play.google.com/store", "_blank")}
                iconColor="text-amber-400"
              />
              <CardRow
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>}
                label="Partager StopHaram"
                onClick={handleShareApp}
                iconColor="text-emerald-400"
              />
              <CardRow
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                label="Nous contacter"
                onClick={() => window.location.href = "mailto:contact@stop-haram.vercel.app"}
                iconColor="text-blue-400"
              />
              <CardRow
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                label="Conditions d'utilisation"
                onClick={() => window.open(APP_URL + "/cgu", "_blank")}
                iconColor="text-slate-400"
              />
              <CardRow
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                label="Politique de confidentialité"
                onClick={() => window.open(APP_URL + "/confidentialite", "_blank")}
                iconColor="text-slate-400"
              />
              <CardRow
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                label="Supprimer mes données"
                onClick={handleDeleteData}
                iconColor="text-red-400"
              />
              {supabaseUser && (
                <button
                  type="button"
                  onClick={async () => {
                    await supabaseSignOut();
                    setAuth({ isLoggedIn: false });
                    router.replace("/start");
                  }}
                  className="w-full flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3.5 text-left hover:bg-white/10 transition-colors text-white/70 text-sm font-medium"
                >
                  <svg className="h-5 w-5 text-white/50 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Se déconnecter
                </button>
              )}
            </div>
          </div>

          <p className="text-white/40 text-xs text-center">Version 1.0</p>
        </section>
      ) : (
        /* === CONTENU ONDLET (profil, objectifs, plan) === */
        <>
      {tab === "profil" && (
        <section className="space-y-5">
          <h2 className="text-white/80 text-sm font-medium">Tes informations</h2>

          {/* Photo de profil */}
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="relative">
              {user.profileInfo?.profilePhoto ? (
                <img
                  src={user.profileInfo.profilePhoto}
                  alt="Photo de profil"
                  className="h-24 w-24 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-white/40 text-3xl">
                  👤
                </div>
              )}
              {photoUploading && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xs">…</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photoUploading}
                className="rounded-xl bg-emerald-500/25 border border-emerald-400/40 px-4 py-2 text-emerald-200 text-sm font-medium hover:bg-emerald-500/35 disabled:opacity-50 transition-colors"
              >
                {user.profileInfo?.profilePhoto ? "Changer" : "Prendre une photo"}
              </button>
              {user.profileInfo?.profilePhoto && (
                <button
                  type="button"
                  onClick={handlePhotoRemove}
                  disabled={photoUploading}
                  className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white/70 text-sm font-medium hover:bg-white/15 disabled:opacity-50 transition-colors"
                >
                  Supprimer
                </button>
              )}
            </div>
            <p className="text-white/50 text-xs text-center">Stockée localement sur ton appareil</p>
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1.5">Prénom</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Ton prénom"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1.5">Genre</label>
            <select
              value={editGenre}
              onChange={(e) => setEditGenre(e.target.value as Genre)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 appearance-none bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat"
              style={selectStyle}
            >
              {GENRES.map((o) => (
                <option key={o.value || "x"} value={o.value} className="bg-[#0a1f12] text-white">
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Voilée (seulement si femme) */}
          {editGenre === "femme" && (
            <div>
              <label className="block text-white/70 text-xs font-medium mb-1.5">Voilée</label>
              <select
                value={editVoilee}
                onChange={(e) => setEditVoilee(e.target.value as Voilee)}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 appearance-none bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat"
                style={selectStyle}
              >
                {VOILEE_OPTIONS.map((o) => (
                  <option key={o.value || "x"} value={o.value} className="bg-[#0a1f12] text-white">
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Âge */}
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1.5">Âge (optionnel)</label>
            <input
              type="number"
              min={1}
              max={120}
              value={editAge}
              onChange={(e) => setEditAge(e.target.value)}
              placeholder="Ex. 28"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Enfants */}
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1.5">As-tu des enfants ?</label>
            <p className="text-white/50 text-xs mb-2">Indique le nombre (0 si aucun)</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="enfantsFilles" className="sr-only">Filles</label>
                <input
                  type="number"
                  id="enfantsFilles"
                  min={0}
                  max={20}
                  value={editEnfantsFilles}
                  onChange={(e) => setEditEnfantsFilles(e.target.value)}
                  placeholder="Filles"
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="enfantsGarcons" className="sr-only">Garçons</label>
                <input
                  type="number"
                  id="enfantsGarcons"
                  min={0}
                  max={20}
                  value={editEnfantsGarcons}
                  onChange={(e) => setEditEnfantsGarcons(e.target.value)}
                  placeholder="Garçons"
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Situation familiale */}
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1.5">Situation familiale</label>
            <select
              value={editSituation}
              onChange={(e) => setEditSituation(e.target.value as SituationFamiliale)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 appearance-none bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat"
              style={selectStyle}
            >
              {SITUATIONS.map((o) => (
                <option key={o.value || "x"} value={o.value} className="bg-[#0a1f12] text-white">
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Logement */}
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1.5">Logement</label>
            <select
              value={editLogement}
              onChange={(e) => setEditLogement(e.target.value as TypeLogement)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 appearance-none bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat"
              style={selectStyle}
            >
              {LOGEMENT_OPTIONS.map((o) => (
                <option key={o.value || "x"} value={o.value} className="bg-[#0a1f12] text-white">
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1.5">Statut</label>
            <select
              value={editStatut}
              onChange={(e) => setEditStatut(e.target.value as StatutPro)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 appearance-none bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat"
              style={selectStyle}
            >
              {STATUTS.map((o) => (
                <option key={o.value || "x"} value={o.value} className="bg-[#0a1f12] text-white">
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ville */}
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1.5">Ville (optionnel)</label>
            <input
              type="text"
              value={editVille}
              onChange={(e) => setEditVille(e.target.value)}
              placeholder="Ex. Paris"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
          </div>

          {/* Prière */}
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1.5">Tu pries ?</label>
            <select
              value={editPrie}
              onChange={(e) => setEditPrie(e.target.value as PratiqueJour)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 appearance-none bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat"
              style={selectStyle}
            >
              {PRIE_OPTIONS.map((o) => (
                <option key={o.value || "x"} value={o.value} className="bg-[#0a1f12] text-white">
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Converti */}
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1.5">Converti(e) ?</label>
            <select
              value={editConverti}
              onChange={(e) => setEditConverti(e.target.value as Converti)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 appearance-none bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat"
              style={selectStyle}
            >
              {CONVERTI_OPTIONS.map((o) => (
                <option key={o.value || "x"} value={o.value} className="bg-[#0a1f12] text-white">
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSaveProfil}
            className="w-full rounded-xl bg-emerald-500/20 border border-emerald-400/40 py-3.5 text-emerald-200 font-semibold hover:bg-emerald-500/30 transition-colors mt-2"
          >
            {saved ? "Enregistré ✓" : "Enregistrer"}
          </button>

          {/* Notifications — toggles uniquement */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="space-y-3">
              <NotifToggle
                label="Rappel heure de prière"
                description="Vibration et notif 5 min avant l&apos;heure de prière (si ville configurée)."
                checked={notifPriere}
                onChange={handleNotifPriereChange}
              />
              <NotifToggle
                label="Rappel actions du jour"
                description="Rappel pour faire tes actions du jour (matin)."
                checked={notifActions}
                onChange={handleNotifActionsChange}
              />
              <NotifToggle
                label="Rappel du jour (verset / hadith)"
                description="Inclure un verset ou hadith du jour dans la notification du matin."
                checked={notifVersetHadith}
                onChange={handleNotifVersetHadithChange}
              />
            </div>
          </div>
        </section>
      )}

      {tab === "objectifs" && (
        <section className="space-y-6">
          <h2 className="text-white/80 text-sm font-medium">Tes objectifs</h2>
          <div className="flex flex-wrap gap-2">
            {user.selectedSins.map((sin) => (
              <span
                key={sin}
                className="inline-flex rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-sm text-white/90"
              >
                {getSinLabel(sin, user)}
              </span>
            ))}
          </div>

          <h2 className="text-white/80 text-sm font-medium pt-2">Niveau par objectif</h2>
          <ul className="space-y-3">
            {user.selectedSins.map((sin) => {
              const score = user.scores[sin] ?? 50;
              const label = getScoreLabel(score);
              return (
                <li key={sin} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-white/90 text-sm font-medium">{getSinLabel(sin, user)}</span>
                    <span className="text-white/60 text-xs">{label}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-400/80 transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => router.push("/quiz?from=account")}
            className="w-full rounded-xl bg-white/10 py-3.5 text-white/90 font-medium hover:bg-white/15 transition-colors border border-white/10"
          >
            Modifier mes réponses (péchés)
          </button>
        </section>
      )}

      {tab === "plan" && (
        <section className="space-y-6">
          <h2 className="text-white/80 text-sm font-medium">Ton plan</h2>
          
          {/* Sélecteur du nombre d'actions par jour */}
          <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-4 space-y-4">
            <div>
              <p className="text-white/90 text-sm font-medium mb-2">Nombre d'actions par jour</p>
              <p className="text-white/60 text-xs mb-3">Avec le temps et les efforts, on s'améliore. Tu peux augmenter progressivement le nombre d'actions pour renforcer ta discipline.</p>
              <div className="flex gap-2">
                {([3, 5, 10] as const).map((count) => {
                  const isSelected = (user.profileInfo?.actionsPerDay ?? 3) === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => {
                        const updatedUser = {
                          ...user,
                          profileInfo: {
                            ...user.profileInfo,
                            actionsPerDay: count,
                          },
                        };
                        updatedUser.plan = generatePlan(updatedUser);
                        saveUser(updatedUser);
                        setUser(updatedUser);
                      }}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        isSelected
                          ? "bg-emerald-500/30 text-emerald-200 border-2 border-emerald-400/50"
                          : "bg-white/5 text-white/70 border-2 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {count}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/25 px-4 py-4 space-y-3">
            <p className="text-emerald-200/90 text-sm font-medium">Chaque jour = {user.profileInfo?.actionsPerDay ?? 3} actions</p>
            <p className="text-white/80 text-sm">Tu valides ta journée en accomplissant les {user.profileInfo?.actionsPerDay ?? 3}. Si tu rechutes, tu perds la validation du jour.</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-4 space-y-3">
            <p className="text-white/90 text-sm">Plan : 30 jours · Focus : {getSinLabel(user.plan.focusSin, user)}</p>
            {(user.selectedSins.includes("autre") && user.profileInfo?.customSinDescription) ? (
              <button
                type="button"
                onClick={async () => {
                  const updated = { ...user };
                  const customSin = updated.profileInfo?.customSinDescription?.trim();
                  if (customSin && needsAIActionsForCustomSin(customSin)) {
                    try {
                      const res = await fetch("/api/custom-sin-actions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ customSin }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (data.action1?.length >= 5 && data.focus?.length >= 3) {
                        const cacheKey = customSin.toLowerCase();
                        updated.profileInfo = {
                          ...updated.profileInfo,
                          customSinActionsCache: {
                            ...updated.profileInfo?.customSinActionsCache,
                            [cacheKey]: { action1: data.action1, focus: data.focus },
                          },
                        };
                      }
                    } catch {
                      /* utilise les actions génériques en cas d'erreur */
                    }
                  }
                  updated.plan = generatePlan(updated);
                  saveUser(updated);
                  setUser(updated);
                }}
                className="text-emerald-300 hover:text-emerald-200 text-xs underline font-medium"
              >
                Régénérer le plan selon mon péché personnalisé ({user.profileInfo.customSinDescription})
              </button>
            ) : null}
            {!hasDefiStarted(user) ? (
              <p className="text-amber-200/90 text-sm">Défi pas encore commencé — va dans <button type="button" onClick={() => router.push("/parcours")} className="underline font-medium">Parcours</button> et clique sur &quot;Commencer&quot; quand tu es prêt.</p>
            ) : (
              <p className="text-white/80 text-sm">Jour actuel : {Math.min(dayNum, 30)}/30</p>
            )}
            {dayPlan && (() => {
              // Si pas d'intention ou ancienne intention fixe, utiliser ACTION_1 basé sur le numéro du jour
              let intentionTitle = dayPlan.intention?.title;
              if (!intentionTitle || intentionTitle === "Faire mon intention du jour" || intentionTitle.startsWith("Intention :")) {
                const focusSin: SelectedSin = user.plan.focusSin ?? "autre";
                const action1List = ACTION_1[focusSin] ?? ACTION_1.autre;
                const dayNum = dayPlan.day;
                const actionIdx = (dayNum - 1) % action1List.length;
                intentionTitle = action1List[actionIdx]?.title ?? "Faire mon intention du jour";
              }
              
              const actionsPerDay = user.profileInfo?.actionsPerDay ?? 3;
              const allActions = [
                    intentionTitle,
                    dayPlan.focus.title,
                    dayPlan.base.title,
                    ...(dayPlan.additionalActions?.map(a => a.title) ?? [])
                  ].slice(0, actionsPerDay);
              
              return (
                <div className="pt-2 space-y-2 border-t border-white/10">
                  <p className="text-white/60 text-xs font-medium">{actionsPerDay} actions du jour</p>
                  <ol className="space-y-1.5 text-sm font-medium list-decimal list-inside text-white/90">
                    {allActions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ol>
                </div>
              );
            })()}
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => router.push("/parcours")}
              className="w-full rounded-xl bg-white/10 py-3 text-white/90 font-medium hover:bg-white/15 transition-colors border border-white/10"
            >
              Voir tout le plan
            </button>
          </div>
        </section>
      )}
        </>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-full bg-emerald-500/90 text-white text-sm font-medium px-4 py-2 shadow-lg">
          Copié ✅
        </div>
      )}
    </div>
  );
}
