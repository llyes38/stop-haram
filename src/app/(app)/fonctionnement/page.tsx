"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FonctionnementPage() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white min-h-screen">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold tracking-tight text-white">Comment ça marche ?</h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Retour"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <p className="text-white/70 text-sm">Tout ce que tu dois savoir sur StopHaram</p>
      </header>

      <div className="flex-1 space-y-6 pb-24">
        {/* Section : Installer l'app */}
        <section className="rounded-xl bg-white/5 border border-white/10 px-5 py-4 overflow-hidden">
          <h2 className="text-emerald-200 font-semibold text-base mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold">📲</span>
            Installer l&apos;application
          </h2>
          <p className="text-sm text-white/90 mb-4 pl-8">
            StopHaram fonctionne comme une vraie application. Ajoute-la à ton écran d&apos;accueil pour y accéder rapidement.
          </p>
          <div className="rounded-lg overflow-hidden border border-white/10 bg-black/30">
            <video
              src="/vid%C3%A9o/story%20installation%20app.mp4"
              controls
              playsInline
              className="w-full aspect-video"
              aria-label="Vidéo expliquant comment installer l'application"
            >
              Ton navigateur ne prend pas en charge la lecture vidéo.
            </video>
          </div>
        </section>

        {/* Section 1 : Création du profil */}
        <section className="rounded-xl bg-white/5 border border-white/10 px-5 py-4">
          <h2 className="text-emerald-200 font-semibold text-base mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold">1</span>
            Création de ton profil
          </h2>
          <div className="space-y-2 text-sm text-white/90 pl-8">
            <p>Quand tu commences, tu dois :</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Donner ton prénom et ton âge</li>
              <li>Remplir un questionnaire pour mieux te connaître</li>
              <li>Répondre à des questions sur tes habitudes et tes objectifs</li>
            </ul>
            <p className="text-white/70 text-xs mt-3">Ces informations permettent de créer un plan personnalisé adapté à ta situation.</p>
          </div>
        </section>

        {/* Section 2 : Sélection des péchés */}
        <section className="rounded-xl bg-white/5 border border-white/10 px-5 py-4">
          <h2 className="text-emerald-200 font-semibold text-base mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold">2</span>
            Choix de tes péchés
          </h2>
          <div className="space-y-2 text-sm text-white/90 pl-8">
            <p>Tu sélectionnes les domaines sur lesquels tu veux travailler :</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Relations illicites (fréquentation, fornication)</li>
              <li>Musique / Temps perdu</li>
              <li>Prière / Retard / Négligence</li>
              <li>Regards / Contenu explicite</li>
              <li>Colère / Insultes</li>
              <li>Mensonge / Double vie</li>
              <li>Alcool / Drogues</li>
              <li>Réseaux sociaux / Addiction téléphone</li>
              <li>Et d&apos;autres...</li>
            </ul>
            <p className="text-white/70 text-xs mt-3">
              Tu peux en choisir un ou plusieurs. Le système identifie automatiquement ton péché principal (focus) et secondaire (base) pour créer un plan adapté.
            </p>
            <p className="text-emerald-200/90 text-xs font-medium mt-2">
              💡 Tu peux modifier tes péchés à tout moment depuis l&apos;onglet Parcours.
            </p>
          </div>
        </section>

        {/* Section 3 : Nombre d'actions */}
        <section className="rounded-xl bg-white/5 border border-white/10 px-5 py-4">
          <h2 className="text-emerald-200 font-semibold text-base mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold">3</span>
            Nombre d&apos;actions par jour
          </h2>
          <div className="space-y-2 text-sm text-white/90 pl-8">
            <p>Tu choisis combien d&apos;actions tu veux accomplir chaque jour :</p>
            <div className="flex gap-2 mt-2">
              <span className="rounded-lg bg-emerald-500/20 text-emerald-200 px-3 py-1 text-xs font-semibold">3 actions</span>
              <span className="rounded-lg bg-emerald-500/20 text-emerald-200 px-3 py-1 text-xs font-semibold">5 actions</span>
              <span className="rounded-lg bg-emerald-500/20 text-emerald-200 px-3 py-1 text-xs font-semibold">10 actions</span>
            </div>
            <p className="text-white/80 text-xs mt-3">
              Le minimum est 3 actions. Tu peux augmenter progressivement pour renforcer ta discipline.
            </p>
            <p className="text-emerald-200/90 text-xs font-medium mt-2">
              💡 Tu peux modifier ce nombre depuis l&apos;onglet Compte → Plan.
            </p>
          </div>
        </section>

        {/* Section 4 : Génération du plan */}
        <section className="rounded-xl bg-white/5 border border-white/10 px-5 py-4">
          <h2 className="text-emerald-200 font-semibold text-base mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold">4</span>
            Génération de ton plan personnalisé
          </h2>
          <div className="space-y-2 text-sm text-white/90 pl-8">
            <p>Une fois tes informations collectées, StopHaram génère automatiquement :</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Un plan de <strong className="text-white">30 jours</strong> adapté à tes péchés</li>
              <li>Des actions concrètes et variées pour chaque jour</li>
              <li>Des actions islamiques basées sur le Coran et la Sunna</li>
              <li>Un focus sur ton péché principal avec des actions ciblées</li>
            </ul>
            <p className="text-white/70 text-xs mt-3">
              Chaque jour, tu auras des actions différentes pour éviter la monotonie et maintenir ta motivation.
            </p>
          </div>
        </section>

        {/* Section 5 : Validation quotidienne */}
        <section className="rounded-xl bg-emerald-500/10 border border-emerald-400/25 px-5 py-4">
          <h2 className="text-emerald-200 font-semibold text-base mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/30 text-emerald-300 text-sm font-bold">5</span>
            Validation de ta journée
          </h2>
          <div className="space-y-2 text-sm text-white/90 pl-8">
            <p className="font-medium text-emerald-200/90">Comment valider ta journée ?</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Tu dois accomplir <strong className="text-white">toutes</strong> les actions du jour (3, 5 ou 10 selon ton choix)</li>
              <li>Clique sur chaque action pour la marquer comme complétée</li>
              <li>Tu peux ajouter une action de toi-même, par ex. <strong className="text-white">Faire une sadaqa</strong> (voir section Dons)</li>
              <li>Quand toutes les actions sont faites, ta journée est validée ✓</li>
            </ul>
            <div className="rounded-lg bg-emerald-500/20 border border-emerald-400/30 px-3 py-2 mt-3">
              <p className="text-emerald-200/90 text-xs font-medium">⚠️ Important</p>
              <p className="text-white/80 text-xs mt-1">
                Si tu rechutes, tu perds la validation du jour. Les actions sont réinitialisées et tu dois recommencer.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5b : Compagnon IA — Se confier */}
        <section className="rounded-xl bg-violet-500/10 border border-violet-400/25 px-5 py-4">
          <h2 className="text-violet-200 font-semibold text-base mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/30 text-violet-300 text-sm font-bold">IA</span>
            Compagnon IA — Se confier
          </h2>
          <div className="space-y-2 text-sm text-white/90 pl-8">
            <p>Un assistant IA bienveillant, pensé pour t&apos;aider au quotidien&nbsp;:</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Accès via le <strong className="text-white">bouton central du menu</strong> (Se confier)</li>
              <li>Tu peux lui parler librement, te confier sur ta journée, tes péchés ou tes tentations</li>
              <li>Réponses en lien avec l&apos;Islam, conseils doux, rappels — sans jugement, sans fatwa</li>
              <li>Il peut t&apos;orienter pour améliorer ton plan personnalisé</li>
            </ul>
            <p className="text-white/70 text-xs mt-3">
              L&apos;IA ne remplace pas un savant ni un suivi humain. On est là pour t&apos;accompagner, pas pour donner des avis juridiques.
            </p>
          </div>
        </section>

        {/* Section 6 : Défi 30 jours */}
        <section className="rounded-xl bg-white/5 border border-white/10 px-5 py-4">
          <h2 className="text-emerald-200 font-semibold text-base mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold">6</span>
            Le défi 30 jours
          </h2>
          <div className="space-y-2 text-sm text-white/90 pl-8">
            <div className="rounded-lg bg-amber-500/15 border border-amber-400/25 px-3 py-2 mb-3">
              <p className="text-amber-200/95 text-xs font-medium">⚠️ Important</p>
              <p className="text-white/90 text-xs mt-1">
                Le défi <strong className="text-white">ne démarre pas automatiquement</strong>. Va dans l&apos;onglet <strong className="text-white">Parcours</strong> et clique sur <strong className="text-white">&quot;Commencer mon défi&quot;</strong> quand tu es prêt. Le jour 1 sera compté à partir de ce moment.
              </p>
            </div>
            <p>Ton parcours dure <strong className="text-white">30 jours</strong>, qu&apos;il y ait des réussites ou des rechutes.</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Le parcours continue jusqu&apos;au bout, même en cas de rechute</li>
              <li>Allah regarde l&apos;effort sincère, pas la perfection</li>
              <li>Chaque jour compte, chaque intention compte</li>
              <li>Avance avec honnêteté, sans te juger</li>
            </ul>
            <p className="text-white/70 text-xs mt-3">
              L&apos;objectif est de progresser, pas d&apos;être parfait dès le premier jour.
            </p>
          </div>
        </section>

        {/* Section 7 : Statuts et progression */}
        <section className="rounded-xl bg-white/5 border border-white/10 px-5 py-4">
          <h2 className="text-emerald-200 font-semibold text-base mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold">7</span>
            Statuts et progression
          </h2>
          <div className="space-y-2 text-sm text-white/90 pl-8">
            <p>Tu débloques des statuts selon ta progression :</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Nouveau-né (0-1 jour)</li>
              <li>Débutant (2-7 jours)</li>
              <li>Persévérant (8-14 jours)</li>
              <li>Et d&apos;autres jusqu&apos;à 90 jours...</li>
            </ul>
            <p className="text-white/70 text-xs mt-3">
              Ces statuts te motivent et montrent ta progression dans ta lutte contre tes péchés.
            </p>
          </div>
        </section>

        {/* Section 8 : Aide d'urgence */}
        <section className="rounded-xl bg-amber-500/10 border border-amber-400/25 px-5 py-4">
          <h2 className="text-amber-200 font-semibold text-base mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/30 text-amber-300 text-sm font-bold">8</span>
            Aide d&apos;urgence
          </h2>
          <div className="space-y-2 text-sm text-white/90 pl-8">
            <p>Si tu sens que tu vas craquer :</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Clique sur le bouton <strong className="text-white">&quot;😰 Je vais craquer&quot;</strong> sur la page d&apos;accueil</li>
              <li>Tu accèdes à des conseils adaptés à ton péché, invocations et rappels</li>
              <li>Tu peux aussi ouvrir <strong className="text-white">Se confier</strong> (menu central) pour parler à l&apos;IA et te calmer</li>
              <li>Possibilité de déclarer une rechute si nécessaire</li>
            </ul>
            <p className="text-white/70 text-xs mt-3">
              N&apos;hésite pas à utiliser ces outils dès que tu ressens une tentation.
            </p>
          </div>
        </section>

        {/* Section 8b : Sadaqa (dons) */}
        <section className="rounded-xl bg-amber-500/10 border border-amber-400/25 px-5 py-4">
          <h2 className="text-amber-200 font-semibold text-base mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/30 text-amber-300 text-sm font-bold">🤲</span>
            Sadaqa (dons)
          </h2>
          <div className="space-y-2 text-sm text-white/90 pl-8">
            <p>Tu peux ajouter <strong className="text-white">Faire une sadaqa</strong> comme action du jour (Accueil → Ajouter une action).</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Puits, orphelins, nourriture, santé, éducation, mosquée, urgences…</li>
              <li>Les projets sont <strong className="text-white">tracés</strong> et <strong className="text-white">mis en ligne</strong></li>
              <li>En partenariat avec des <strong className="text-white">sponsors authentiques</strong></li>
            </ul>
            <p className="text-white/70 text-xs mt-3">
              Les dons se font directement sur le site de chaque association partenaire (lien sécurisé).
            </p>
          </div>
        </section>

        {/* Section 9 : Modifier ton plan */}
        <section className="rounded-xl bg-white/5 border border-white/10 px-5 py-4">
          <h2 className="text-emerald-200 font-semibold text-base mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold">9</span>
            Modifier ton plan
          </h2>
          <div className="space-y-2 text-sm text-white/90 pl-8">
            <p>Tu peux modifier ton plan à tout moment :</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li><strong className="text-white">Modifier tes péchés</strong> : depuis l&apos;onglet Parcours, clique sur &quot;Modifier&quot; dans le cadre des péchés</li>
              <li><strong className="text-white">Changer le nombre d&apos;actions</strong> : depuis l&apos;onglet Compte → Plan</li>
              <li><strong className="text-white">Modifier tes réponses au quiz</strong> : depuis l&apos;onglet Compte → Objectifs</li>
            </ul>
            <p className="text-white/70 text-xs mt-3">
              Le plan sera automatiquement régénéré avec tes nouvelles préférences.
            </p>
          </div>
        </section>

        {/* Message final */}
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/25 px-5 py-4 text-center">
          <p className="text-emerald-200 font-semibold text-sm mb-2">💚 Tu es sur le bon chemin</p>
          <p className="text-white/80 text-xs">
            StopHaram est là pour t&apos;accompagner dans ta lutte contre tes péchés. 
            Chaque effort compte, chaque intention compte. Allah voit ce que personne ne voit.
          </p>
        </div>
      </div>
    </div>
  );
}
