# Démo live "Support IT Intelligent" — Guide technique de mise en route

Page : `/demo/support-it-intelligent` (composant `src/pages/SupportITDemoPage.tsx`)

## Historique

- **16/05/2026** : pitch one-pager HTML reçu par WhatsApp, jamais branché à un vrai workflow.
- **17/05/2026** : Marius avait en réalité déjà construit et activé le vrai workflow n8n
  `TransferAI — Support IT Intelligent` (tags "Demo Live", "Support IT", "TransferAI"), sans
  page web associée.
- **08/07/2026 (session 1)** : construction d'une page web + Edge Function + workflow n8n
  *inventés* à partir du seul pitch HTML — sans connaître l'existence du vrai workflow ci-dessus.
- **08/07/2026 (session 2, ce document)** : le vrai workflow a été retrouvé et fourni. La page
  web et l'Edge Function ont été **adaptées pour consommer le vrai workflow**, et 4 corrections
  y ont été appliquées. Le workflow inventé en session 1 a été supprimé.

## Fichiers du projet

- `src/pages/SupportITDemoPage.tsx` — page de démo (route ajoutée dans `src/App.tsx`).
- `supabase/functions/it-support-demo-ticket/index.ts` — relais : enregistre le ticket dans
  Supabase, appelle le webhook n8n en synchrone, met à jour et renvoie le résultat.
- `supabase/migrations/20260708120000_create_it_support_demo_tickets.sql` — table de base.
- `supabase/migrations/20260708130000_add_requester_fields_it_support_demo_tickets.sql` —
  ajout des colonnes `full_name`, `requester_email`, `department`, `n8n_ticket_id`.
- `docs/transferai-admin/150_n8n_Support_IT_Intelligent_REEL_Corrige_08juillet2026.json` —
  version corrigée du **vrai** workflow (même `id`, mêmes credentials, mêmes node IDs que
  l'original de Marius — diff minimal, voir "Corrections appliquées" ci-dessous).

## Corrections appliquées au workflow réel

Toutes les corrections ont été faites en préservant à l'identique les nœuds non concernés
(webhook, normalisation, routage, les 3 emails, le nœud IA) — diff vérifié nœud par nœud contre
l'original.

1. **Temps de triage réel au lieu d'une valeur aléatoire.** Le nœud `📊 Log SLA & Dashboard`
   calculait `temps_triage_secondes: Math.floor(Math.random() * 10) + 5` — un chiffre inventé.
   Remplacé par un calcul réel : différence entre l'horodatage de réception du ticket et celui
   du diagnostic IA parsé. Risque évité : présenter un chiffre "ROI mesurable" fictif à un client.

2. **`sla_target_minutes` calculé une seule fois.** Ajouté dans `⚙️ Parse & Enrich Diagnostic`
   (à côté de `sla_deadline`, déjà calculé là) plutôt que recalculé ailleurs — une seule source
   de vérité pour la correspondance criticité → durée (P1=1h, P2=4h, P3=8h, P4=24h).

3. **Réponse API robuste (nouveau nœud `🧾 Construire réponse API`).** L'ancien nœud
   `✅ Réponse API` construisait le JSON de réponse à la main, en concaténant des chaînes avec
   des guillemets manuels (`"champ": "{{ ... }}"`). Si le texte généré par l'IA
   (`reponse_utilisateur`) contenait un guillemet ou un retour à la ligne, le JSON produit était
   invalide et le webhook renvoyait une réponse cassée. Le nouveau nœud construit l'objet en
   JavaScript puis `✅ Réponse API` fait simplement `JSON.stringify($json)` — échappement
   correct garanti, y compris pour du texte libre généré par GPT-4o.

4. **Champs ajoutés à la réponse API pour la page web** (absents de l'originale — elle ne
   renvoyait que `status, ticket_id, mode_traitement, criticite, categorie, sla_deadline,
   equipe, message`, et le texte de réponse IA n'existait que dans l'email) : `category`,
   `confidence`, `decision` (`auto_resolved`/`escalated`), `response_text`, `escalated_to`,
   `sla_target_minutes`. Les champs originaux sont conservés pour compatibilité.

Le nœud `🔀 Routage Intelligent` (If, `options.version: 1`) n'a **pas** été modifié : sa
condition (`routing.auto_resolvable` booléen `equals true`) est une syntaxe valide, différente
du format historiquement cassé documenté ailleurs ([[feedback-n8n-patterns]], qui concernait
l'ancien format `{"boolean": [{"value1":..., "operation":"true"}]}`, une structure différente).
Aucune preuve qu'elle soit défaillante ici — non touchée par prudence.

## Champs attendus par le workflow (webhook `POST /webhook/ticket-it`)

| Champ n8n | Origine page web | Requis |
|---|---|---|
| `nom` | Nom complet | oui |
| `email` | Email | oui — un email de résolution/accusé y est envoyé directement |
| `departement` | Département (optionnel) | non |
| `sujet` | Sujet du ticket | oui |
| `description` | Description | oui |
| `urgence` | Urgence déclarée (texte libre, ignoré par la logique — la criticité P1–P4 est décidée par l'IA) | non |
| `source` | Canal | non |

**Important** : contrairement à la première version (session 1), `nom` et `email` sont
obligatoires côté page web et Edge Function — sans email valide, le nœud d'envoi SMTP du
workflow échoue et bloque toute l'exécution avant que l'API ne réponde.

## Mise en route

1. **Réimporter le workflow corrigé.** Dans `https://n8n-pxlk.srv1480638.hstgr.cloud`, ouvrir le
   workflow actif `TransferAI — Support IT Intelligent`, et reporter manuellement les 4
   corrections ci-dessus (ou importer `150_...json` en écrasant l'existant — vérifier que
   l'import conserve bien les credentials `OpenAi API` et `SMTP TransferAI` déjà configurés).
   URL de production du webhook : `https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/ticket-it`.

2. **Déployer les migrations Supabase**
   ```
   supabase db push
   ```

3. **Déployer l'Edge Function et configurer le secret**
   ```
   supabase functions deploy it-support-demo-ticket
   supabase secrets set N8N_SUPPORT_IT_DEMO_WEBHOOK_URL=https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/ticket-it
   ```
   Aucun secret OpenAI à configurer côté Supabase : le workflow utilise déjà le credential natif
   n8n `OpenAi API`, pas une variable d'environnement.

4. **Tester end-to-end** — `npm run dev`, ouvrir `/demo/support-it-intelligent`, soumettre un
   ticket avec une **vraie adresse email que tu contrôles** (un email réel sera envoyé). Vérifier :
   - l'écran affiche catégorie, confiance, décision, SLA et le texte de réponse IA
   - l'email de résolution/accusé arrive bien dans la boîte indiquée
   - si escalade : l'email brief technicien arrive à `support-ia@transferai.ci`
   - la ligne dans la table `it_support_demo_tickets` est bien mise à jour

## Ce qui a été testé dans cette session (sans toucher à l'infra de production)

- Logique JS des 3 nœuds corrigés validée hors n8n (Node.js local) : calcul SLA, temps de
  triage réel, et `JSON.stringify` sur un texte de test contenant guillemets + retour à la ligne
  — ré-analysable sans erreur.
- Page web testée en local (dev server + navigateur) : formulaire, validation des champs
  requis (nom/email/sujet/description), requête envoyée à l'Edge Function avec le nouveau
  format de payload (`nom/email/departement/sujet/...`), état d'erreur correct (l'Edge Function
  n'étant pas encore déployée en prod, échec attendu avec message clair).
- **Pas de test contre le vrai webhook n8n de production** : cela enverrait un vrai email via
  le SMTP de Marius. À faire par Marius lui-même à l'étape 4 ci-dessus, ou sur demande explicite.
