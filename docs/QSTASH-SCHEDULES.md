# QStash Schedules — Notifications planifiées StopHaram

Pour contourner la limite Vercel Hobby (1 cron par jour), les rappels planifiés utilisent **Upstash QStash** pour appeler les endpoints de planification et d’envoi.

## Prérequis

- Variables d’environnement :
  - `CRON_SECRET` : chaîne secrète (ex. mot de passe aléatoire) pour sécuriser les appels.
  - `NEXT_PUBLIC_SITE_URL` : URL du site (ex. `https://stop-haram.vercel.app`).
- Tables Supabase : `notification_prefs`, `notification_queue` (voir `supabase-notification-tables.sql`).
- Supabase : `SUPABASE_SERVICE_ROLE_KEY` pour que les crons puissent lire/écrire sans RLS.

## Endpoints

| Endpoint | Méthode | Rôle |
|----------|---------|------|
| `/api/cron/daily` | POST | Planifie les notifications du jour pour chaque utilisateur (check-in, matin, soir, rappel optionnel). À appeler **1 fois par jour** (ex. 03:00 UTC). |
| `/api/cron/tick` | POST | Récupère les notifications dues (`scheduled_at <= now`, `status = 'pending'`), envoie les push et met à jour `status` / `sent_at`. À appeler **toutes les 15 minutes**. |

Sécurisation : passer le secret en query :

- `POST {SITE_URL}/api/cron/daily?secret={CRON_SECRET}`
- `POST {SITE_URL}/api/cron/tick?secret={CRON_SECRET}`

Sans `secret` correct (ou si `CRON_SECRET` est défini et différent), réponse **401**.

## Créer les 2 schedules QStash

1. Va sur [Upstash Console](https://console.upstash.com) → **QStash**.
2. Crée deux **Schedules** :

### 1) Tick — toutes les 15 minutes

- **Destination** : `https://stop-haram.vercel.app/api/cron/tick?secret=VOTRE_CRON_SECRET`
- **Méthode** : POST
- **Fréquence** : cron `*/15 * * * *` (toutes les 15 min) ou équivalent QStash (ex. « Every 15 minutes »).

### 2) Daily — une fois par jour (ex. 03:00 UTC)

- **Destination** : `https://stop-haram.vercel.app/api/cron/daily?secret=VOTRE_CRON_SECRET`
- **Méthode** : POST
- **Fréquence** : 1 fois par jour, ex. `0 3 * * *` (03:00 UTC).

Remplace `VOTRE_CRON_SECRET` par la valeur réelle de `CRON_SECRET` (et l’URL par ton `NEXT_PUBLIC_SITE_URL` si différente).

## Résumé

| Schedule | URL | Fréquence |
|----------|-----|------------|
| Tick | `/api/cron/tick?secret=...` | Toutes les 15 min |
| Daily | `/api/cron/daily?secret=...` | 1 fois par jour (ex. 03:00 UTC) |

Avec ces deux schedules, les utilisateurs reçoivent les rappels aux heures configurées dans **Paramètres → Rappels planifiés** (`/settings/notifications`).
