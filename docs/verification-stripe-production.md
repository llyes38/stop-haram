# Vérifier Stripe en production

## 1. Vérifier les variables d'environnement (Vercel)

Sur Vercel → Project → Settings → Environment Variables, vérifier que tu as bien en **Production** :

- `STRIPE_SECRET_KEY` = `sk_live_...`
- `STRIPE_WEBHOOK_SECRET` = `whsec_...`
- `STRIPE_PRICE_ID_MONTHLY`
- `STRIPE_PRICE_ID_ANNUAL`
- `STRIPE_PRICE_ID_OFFRIR_MONTHLY`
- `STRIPE_PRICE_ID_OFFRIR_ANNUAL`

Redéploie après toute modification des variables.

---

## 2. Tester le webhook (sans payer)

1. Va sur **Stripe Dashboard** → [Developers → Webhooks](https://dashboard.stripe.com/webhooks).
2. Ouvre ton endpoint de **production** (URL : `https://ton-domaine.com/api/stripe/webhook`).
3. Clique sur **« Send test webhook »**.
4. Choisis par exemple **`checkout.session.completed`** (ou un autre événement).
5. Clique sur **« Send test webhook »**.

**Succès** : statut **200** et réponse `{ "received": true }`.  
**Échec** : 400 (signature invalide) ou 500 → revérifier `STRIPE_WEBHOOK_SECRET` et l’URL de l’endpoint.

---

## 3. Tester le parcours checkout (redirection Stripe)

Sans payer, tu peux vérifier que la création de session fonctionne :

1. Ouvre ton site en prod (ex. `https://stop-haram.vercel.app`).
2. Va sur la page qui mène au paiement : **Offre** ou **Plan** → bouton pour s’abonner (mensuel ou annuel).
3. Clique sur le bouton (ex. « Choisir l’offre annuelle »).

**Succès** : redirection vers **Stripe Checkout** avec les bons montants (ex. 9,99 € / 59,94 €).  
**Échec** : erreur sur la page ou redirection vers `/paywall` → vérifier les logs Vercel et que `STRIPE_SECRET_KEY` + `STRIPE_PRICE_ID_*` sont bien en prod.

Tu peux annuler sur la page Stripe (fermer ou « Back ») sans payer.

---

## 4. Tester un paiement réel (optionnel mais recommandé)

Pour valider toute la chaîne (checkout → webhook → page succès) :

1. Fais un **vrai** paiement avec une carte (tu pourras le rembourser dans le Dashboard Stripe).
2. Après paiement, Stripe te redirige vers :  
   `https://ton-domaine.com/success?session_id=cs_...`
3. Vérifier :
   - La page **Success** s’affiche (« Paiement confirmé », redirection vers l’app).
   - Dans **Stripe Dashboard** → Webhooks → ton endpoint : l’événement `checkout.session.completed` apparaît avec statut **200**.
   - Si tu as un compte connecté et un flux « lier abonnement » : après création de compte, l’abonnement est bien lié (table `subscriptions` dans Supabase si tu l’utilises).

Pour **« Offrir à un proche »** : refaire un paiement en mode « Offrir » et vérifier que la page success affiche bien le lien cadeau (ou la redirection prévue).

---

## 5. Vérifier l’API verify-session (optionnel)

Après un paiement réussi, tu as une URL du type :

`https://ton-domaine.com/success?session_id=cs_xxxxx`

Tu peux tester l’API manuellement :

```text
GET https://ton-domaine.com/api/verify-session?session_id=cs_xxxxx
```

**Succès** : réponse JSON `{ "ok": true }` (ou `{ "ok": true, "gift": true }` pour un cadeau).  
**Échec** : `{ "ok": false }` ou 400 → vérifier que `session_id` est bien celui d’une session payée et que `STRIPE_SECRET_KEY` est la clé Live.

---

## Checklist rapide

| Étape | Action | OK ? |
|-------|--------|------|
| 1 | Variables d’env en prod (Vercel) | ☐ |
| 2 | Webhook : « Send test webhook » → 200 | ☐ |
| 3 | Clic « S’abonner » → redirection Stripe Checkout avec bons prix | ☐ |
| 4 | Un paiement test réel → page Success + webhook 200 | ☐ |
| 5 | (Optionnel) GET verify-session avec un vrai `session_id` → `ok: true` | ☐ |

Si tout est coché, Stripe production est correctement branché.
