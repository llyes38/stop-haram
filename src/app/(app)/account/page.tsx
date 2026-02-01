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
import { setAuth, resetOnboarding } from "@/lib/authState";
import { updateLastRoute } from "@/lib/authState";
import type { SelectedSin } from "@/lib/storage";
import { usePushNotifications } from "@/lib/usePushNotifications";
import {
  getNotifPriere,
  setNotifPriere,
  getNotifActions,
  setNotifActions,
} from "@/lib/notificationPrefs";

type Tab = "profil" | "objectifs" | "plan";

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

function PushNotificationsBlock() {
  const { status, error, requestPermissionAndSubscribe } = usePushNotifications();

  if (status === "unsupported") {
    return (
      <p className="text-white/50 text-xs rounded-xl bg-white/5 px-4 py-3">
        Les notifications ne sont pas supportées sur ce navigateur.
      </p>
    );
  }
  if (status === "subscribed") {
    return (
      <div className="space-y-2">
        <p className="text-emerald-200/90 text-sm rounded-xl bg-emerald-500/15 px-4 py-3">
          ✓ Notifications activées. Tu recevras des rappels.
        </p>
        <button
          type="button"
          onClick={async () => {
            try {
              const res = await fetch("/api/push/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: "StopHaram",
                  body: "Ceci est une notif de test. Si tu la vois, tout fonctionne !",
                }),
              });
              const data = await res.json().catch(() => ({}));
              if (res.ok) {
                if ((data.sent ?? 0) > 0) alert(`Notif envoyée (${data.sent} destinataire(s)).`);
                else alert(data.error || "Aucun destinataire. Réactive les notifications puis réessaie.");
              } else {
                alert(data.error || "Erreur lors de l'envoi.");
              }
            } catch (e) {
              alert("Erreur : " + (e instanceof Error ? e.message : "inconnue"));
            }
          }}
          className="w-full rounded-xl bg-white/10 border border-white/20 py-2.5 px-4 text-white/80 text-sm font-medium hover:bg-white/15 transition-colors"
        >
          Envoyer une notif de test
        </button>
      </div>
    );
  }
  if (status === "denied") {
    return (
      <p className="text-amber-200/80 text-xs rounded-xl bg-amber-500/15 px-4 py-3">
        Autorisation refusée. Tu peux l&apos;activer dans les paramètres du navigateur.
      </p>
    );
  }
  return (
    <div>
      <button
        type="button"
        onClick={requestPermissionAndSubscribe}
        className="w-full rounded-xl bg-white/10 border border-white/20 py-3 px-4 text-white/90 font-medium hover:bg-white/15 transition-colors"
      >
        Activer les notifications
      </button>
      {error && <p className="text-red-200/80 text-xs mt-2">{error}</p>}
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<StopHaramUser | null>(null);
  const [tab, setTab] = useState<Tab>("profil");

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "plan" || t === "objectifs" || t === "profil") setTab(t);
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
  }, []);

  const handleNotifPriereChange = (v: boolean) => {
    setNotifPriere(v);
    setNotifPriereState(v);
  };
  const handleNotifActionsChange = (v: boolean) => {
    setNotifActions(v);
    setNotifActionsState(v);
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
  };

  if (!user) {
    return (
      <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white">
        <p className="text-white/70 text-sm">Chargement du profil…</p>
      </div>
    );
  }

  const dayNum = getDayNumber(user.startDateISO);
  const currentDayIndex = Math.min(Math.max(dayNum - 1, 0), user.plan.days.length - 1);
  const dayPlan = user.plan.days[currentDayIndex];

  const tabs: { id: Tab; label: string }[] = [
    { id: "profil", label: "Profil" },
    { id: "objectifs", label: "Objectifs" },
    { id: "plan", label: "Plan" },
  ];

  return (
    <div className="w-full flex flex-col px-6 pt-6 pb-8 text-white">
      <header className="mb-6 flex items-center gap-4">
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
          <h1 className="text-xl font-bold tracking-tight text-white">Compte</h1>
          <p className="text-white/90 text-lg mt-0.5">Salam {user.name || "toi"}</p>
        </div>
      </header>

      {/* Onglets */}
      <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 mb-6">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
              tab === id ? "bg-white/15 text-white" : "text-white/60 hover:text-white/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contenu selon onglet */}
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

          {/* Section Forfait */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h2 className="text-white/80 text-sm font-medium mb-4">Ton forfait</h2>
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/25 px-4 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-emerald-200 font-semibold text-sm">
                      {user.profileInfo?.forfait === "annuel"
                        ? "Forfait Annuel"
                        : user.profileInfo?.forfait === "mensuel"
                        ? "Forfait Mensuel"
                        : "—"}
                    </p>
                    <p className="text-white/60 text-xs">
                      {user.profileInfo?.forfait === "annuel"
                        ? "12 mois · renouvelé chaque année"
                        : user.profileInfo?.forfait === "mensuel"
                        ? "Résiliable à tout moment"
                        : "Choisi au checkout (mensuel ou annuel)"}
                    </p>
                  </div>
                </div>
                {user.profileInfo?.forfait && (
                  <span className="rounded-full bg-emerald-500/30 px-2.5 py-1 text-emerald-200 text-xs font-semibold">Actif</span>
                )}
              </div>
              {user.profileInfo?.forfait && (
                <div className="mt-3 pt-3 border-t border-emerald-400/20">
                  <ul className="space-y-1.5 text-white/80 text-xs">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> Plan personnalisé de 30 jours
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> 3, 5 ou 10 actions par jour
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> Suivi de progression
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> Aide d&apos;urgence
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> Statuts et récompenses
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Préférences de rappels (on/off) */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h2 className="text-white/80 text-sm font-medium mb-2">Rappels</h2>
            <p className="text-white/60 text-xs mb-4">
              Active ou désactive les rappels selon tes préférences.
            </p>
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
            </div>
          </div>

          {/* Notifications push */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h2 className="text-white/80 text-sm font-medium mb-2">Notifications</h2>
            <p className="text-white/60 text-xs mb-3">
              Reçois des rappels même quand l&apos;app est fermée. Clique « Activer les notifications » et accepte quand le navigateur le demande.
            </p>
            <PushNotificationsBlock />
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

          <button
            type="button"
            onClick={() => {
              setAuth({ isLoggedIn: false });
              router.replace("/start");
            }}
            className="w-full rounded-xl bg-white/10 py-3.5 text-white/70 text-sm font-medium hover:bg-white/15 transition-colors border border-white/10 mt-4"
          >
            Se déconnecter
          </button>
        </section>
      )}
    </div>
  );
}
