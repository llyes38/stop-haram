# Notifications StopHaram

## Ce qui fonctionne

### 1. Rappel « Actions du jour » + Verset du jour (9h Paris)

- **Quand** : tous les jours à 9h (heure de Paris, via cron Vercel à 8h UTC).
- **Comment** : notification **Web Push** envoyée par le serveur à tous les abonnés.
- **Fonctionne** même si l’app est fermée ou le navigateur fermé (tant que l’utilisateur a autorisé les notifications et que l’abonnement push est enregistré).

**Configuration requise (voir section « Mise en place Vercel » ci-dessous) :**

- Sur Vercel : `CRON_SECRET`, clés VAPID, et **Upstash Redis** pour stocker les abonnements.
- Le cron est défini dans `vercel.json` : `/api/cron/daily-reminder` à 8h UTC.

Le message inclut un rappel pour les actions du jour et le **verset du jour** (rotation parmi une liste de versets).

---

### 1b. Rappel horaire (verset/hadith + bienveillance)

- **Quand** : **chaque heure** (cron Vercel `0 * * * *` = à :00 chaque heure UTC).
- **Alternance** :
  - **Heures paires** (0h, 2h, 4h, … UTC) : notification avec un **verset ou hadith** (liste variée).
  - **Heures impaires** (1h, 3h, 5h, … UTC) : notification **« Comment vas-tu ? On est là pour toi »** (messages de soutien).
- Même mécanisme que le rappel du matin : Web Push à tous les abonnés. Aucune config supplémentaire (même `CRON_SECRET`, VAPID, Redis).

---

### 2. Rappel heure de prière (5 min avant)

- **Quand** : 5 minutes avant chaque prière (Fajr, Dhuhr, Asr, Maghrib, Isha), selon la ville configurée dans l’app.
- **Comment** : **notifications navigateur** + vibration, déclenchées par le composant `PrayerTimeReminder` dans l’app (client-side, `setInterval` toutes les 30 s).

**Limitation importante :**  
Ces rappels ne fonctionnent **que si l’utilisateur a l’app ouverte** dans un onglet (même en arrière-plan). Dès que l’onglet est fermé ou le navigateur fermé, il n’y a plus de vérification des horaires ni d’envoi de notification.

Pour avoir des rappels prière **même app fermée**, il faudrait par exemple :
- stocker ville + abonnement push par utilisateur ;
- un cron serveur qui récupère les horaires de prière (API externe) et envoie une Web Push à chaque utilisateur à l’heure voulue.

---

### 3. Rappel « Actions du jour » côté client (9h)

- Le composant `PrayerTimeReminder` envoie aussi une notification à 9h **si l’app est ouverte** (pour éviter de rater le rappel si le cron n’a pas encore tourné ou en dev).
- En production, le **cron + Web Push** reste la source principale ; le client ne fait qu’un doublon quand l’app est ouverte.

---

## Résumé

| Type de notification        | App ouverte | App fermée        |
|----------------------------|------------|--------------------|
| Actions du jour + verset    | Oui        | Oui (cron + push)  |
| Heure de prière (5 min avant) | Oui      | Non (client only)  |

Pour que tout fonctionne côté serveur (y compris rappels prière app fermée), il faudrait étendre le cron et le stockage des préférences (ville, fuseau) par abonnement push.

---

## Mise en place Vercel (notifications push)

Rien à faire sur **Supabase** pour les notifications push : les abonnements sont stockés dans **Upstash Redis** (ou en mémoire si Redis n’est pas configuré — non persistant en prod).

### 1. Générer les clés VAPID

En local :

```bash
npx web-push generate-vapid-keys
```

Tu obtiens une paire **publicKey** et **privateKey**. Ne partage jamais la clé privée.

### 2. Variables d’environnement sur Vercel

Dans **Vercel** → ton projet → **Settings** → **Environment Variables**, ajoute :

| Variable | Valeur | Remarque |
|----------|--------|----------|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | La **publicKey** générée | Exposée au client |
| `VAPID_PRIVATE_KEY` | La **privateKey** générée | Secrète, ne pas exposer |
| `VAPID_MAILTO` | `mailto:contact@stopharam.com` | Optionnel |
| `CRON_SECRET` | Une chaîne secrète (ex. mot de passe aléatoire) | Utilisée par Vercel pour appeler le cron |
| `UPSTASH_REDIS_REST_URL` | URL REST de ton Redis Upstash | Voir ci-dessous |
| `UPSTASH_REDIS_REST_TOKEN` | Token REST de ton Redis Upstash | Voir ci-dessous |

Sans **Upstash Redis**, les abonnements push ne sont **pas persistés** en production (mémoire serveur vide à chaque invocation). Le cron enverrait alors à 0 destinataire.

### 3. Upstash Redis (recommandé)

1. Va sur [upstash.com](https://upstash.com), crée un compte si besoin.
2. Crée une base **Redis** (gratuit en petit usage).
3. Dans le dashboard, récupère **REST URL** et **REST Token**.
4. Ajoute-les sur Vercel comme `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN`.

(Le code accepte aussi `KV_REST_API_URL` / `KV_REST_API_TOKEN` si tu utilises le produit KV d’Upstash.)

### 4. Cron Vercel

Le cron est déjà défini dans `vercel.json` (`/api/cron/daily-reminder` à 8h UTC). Vercel envoie automatiquement `Authorization: Bearer <CRON_SECRET>`. Aucune action supplémentaire si `CRON_SECRET` est bien défini.

### 5. Redéploier

Après avoir ajouté les variables, redéploie le projet (push sur Git ou **Redeploy** dans Vercel).

---

## Paramétrer le nombre et la fréquence des notifications

Tout se règle dans **`vercel.json`** (crons) et éventuellement de nouvelles routes API.

### Fréquence : à quelle heure envoyer ?

Le cron utilise une **expression cron** : `minute heure jour mois jour-semaine`.

- **Actuel** : `"0 8 * * *"` = tous les jours à **8h UTC** (= 9h Paris en hiver, 10h en été).
- **Changer l’heure** : modifie le 2ᵉ nombre (heure en UTC) :
  - `0 7 * * *` → 7h UTC (8h Paris hiver)
  - `0 8 * * *` → 8h UTC (9h Paris hiver)
  - `0 9 * * *` → 9h UTC (10h Paris hiver)
  - `0 17 * * *` → 17h UTC (18h Paris hiver)

Exemple dans `vercel.json` pour envoyer à **10h Paris** (9h UTC en hiver) :

```json
"schedule": "0 9 * * *"
```

Puis redéploie.

### Nombre de notifications par jour

Aujourd’hui : **1 notification** par jour (rappel matin + verset).

Pour **2 notifications** par jour (matin + soir) :

1. Créer une 2ᵉ route API (ex. `/api/cron/evening-reminder/route.ts`) avec un message différent (ex. « Pense à clôturer tes actions du jour »).
2. Ajouter un 2ᵉ cron dans `vercel.json` :

```json
{
  "crons": [
    { "path": "/api/cron/daily-reminder", "schedule": "0 8 * * *" },
    { "path": "/api/cron/evening-reminder", "schedule": "0 17 * * *" }
  ]
}
```

`0 17 * * *` = tous les jours à 17h UTC (18h Paris en hiver). Redéploie après modification.

### Récap

| Objectif              | Où modifier                    | Exemple                          |
|-----------------------|--------------------------------|----------------------------------|
| Changer l’heure du rappel | `vercel.json` → `schedule`     | `"0 9 * * *"` = 10h Paris (hiver) |
| Ajouter un 2ᵉ rappel (soir) | Nouvelle route + 2ᵉ entrée dans `crons` | Rappel soir à 18h Paris          |

Pour que **chaque utilisateur** choisisse son heure (ex. 8h, 9h ou 10h), il faudrait en plus stocker l’heure préférée par abonnement (Redis/DB) et adapter le cron (ex. un cron qui tourne toutes les heures et n’envoie qu’aux users dont l’heure préférée est maintenant).
