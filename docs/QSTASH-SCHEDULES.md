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

---

## Vérifier les notifications « Comment te sens-tu ? » (toutes les 2h)

Si `checkin_2h_enabled` est à `true` dans Supabase mais que tu ne reçois pas de notifs toutes les 2h, vérifier dans cet ordre :

### 1. File d’attente dans Supabase

- **Table** : `notification_queue`
- Ouvre **Supabase → Table Editor → notification_queue**
- Vérifie qu’il existe des lignes avec **`type = 'feel_check'`**.
  - Si **aucune ligne** : le cron **daily** n’a pas encore rempli la queue (il ne tourne qu’**une fois par jour**). Soit tu attends le prochain run, soit tu déclenches daily à la main (voir ci-dessous).
  - Si des lignes sont en **`status = 'pending'`** et **`scheduled_at`** est dans le passé : le **tick** devrait les envoyer dans les 15 min. Si après 15 min elles restent `pending`, vérifier les logs du tick (erreur ou secret incorrect).
  - Si des lignes passent en **`status = 'sent'`** : l’envoi a réussi côté serveur. Si tu ne vois pas la notif sur l’appareil, passer au point 2.
  - Si **`status = 'failed'`** : souvent = **aucun abonnement push** pour cet utilisateur (point 2).

### 2. Abonnement push (obligatoire)

Les notifs 2h sont des **Web Push**. Pour les recevoir :

1. Aller dans l’app : **Compte → Paramètres → Rappels planifiés** (ou **Notifications**).
2. S’assurer que **« Activer les notifications »** a été cliqué et que le navigateur a bien **autorisé** les notifications pour le site.
3. Sans ça, la queue peut être remplie et le tick peut « envoyer », mais **0 appareil** n’est enregistré → statut **failed** et rien sur le téléphone/PC.

Vérifier aussi que **Upstash Redis** est configuré sur Vercel (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`), sinon les abonnements ne sont pas conservés entre les appels.

### 3. Déclencher daily à la main (pour tester tout de suite)

Le **daily** ne s’exécute qu’**une fois par jour** (ex. 03:00 UTC). Si tu viens d’activer « Comment te sens-tu ? », la queue sera remplie seulement au **prochain** run.

Pour ne pas attendre 24h :

1. Appeler à la main (avec le même secret que QStash) :
   ```bash
   curl -X POST "https://stop-haram.vercel.app/api/cron/daily?secret=TON_CRON_SECRET"
   ```
2. Réponse attendue : `{ "queued": 16, "users": 2 }` (exemple ; le nombre dépend du nombre d’utilisateurs avec `checkin_2h_enabled` et des créneaux encore à venir).
3. Ensuite, dans **Supabase → notification_queue**, tu dois voir des lignes **`feel_check`** avec **`scheduled_at`** aux heures 08:00, 10:00, …, 22:00 (dans ton fuseau).
4. Quand l’heure d’une ligne est dépassée, le **tick** (toutes les 15 min) l’enverra. Tu peux aussi appeler le tick à la main pour tester :
   ```bash
   curl -X POST "https://stop-haram.vercel.app/api/cron/tick?secret=TON_CRON_SECRET"
   ```
   Réponse : `{ "processed": 2, "sent": 2, "failed": 0 }`. Si **sent = 0** alors que **processed > 0**, c’est en général qu’il n’y a pas d’abonnement push pour cet utilisateur (retour au point 2).

### 4. Récap des causes possibles

| Symptôme | Cause probable |
|----------|----------------|
| Aucune ligne `feel_check` dans `notification_queue` | Daily pas encore repassé depuis l’activation de l’option, ou daily en erreur. Déclencher daily à la main et vérifier la réponse. |
| Lignes `pending` qui ne passent pas à `sent` | Tick en erreur ou pas appelé (vérifier QStash → Schedules → tick). |
| Lignes en `failed` | Pas d’abonnement push pour cet `user_id` : activer les notifs dans l’app (Compte → Rappels) et réessayer. |
| `sent` mais pas de notif sur l’appareil | Permissions navigateur, ou abonnement expiré / autre appareil. Réautoriser les notifs et recharger la page des paramètres. |
