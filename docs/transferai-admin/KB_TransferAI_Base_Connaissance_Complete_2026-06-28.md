# TransferAI Africa — Base de Connaissance Complète du Projet
**Version consolidée · Mise à jour 2026-06-28**

---

## 1. IDENTITÉ DU PROJET

### Nom & Positionnement
**TransferAI Africa** est une plateforme de formation, conseil, contenus et solutions IA conçue pour les professionnels, entreprises et institutions qui veulent intégrer l'intelligence artificielle avec méthode et impact concret, avec ancrage Côte d'Ivoire / Afrique de l'Ouest.

### URL de production
- Site principal : `https://www.transferai.ci`
- Formulaire audit : `https://www.transferai.ci/questionnaire-audit`
- Back-office admin : `https://www.transferai.ci/admin`

### Stack technique
| Composant | Technologie |
|---|---|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Backend / BDD | Supabase (PostgreSQL + Edge Functions Deno) |
| Déploiement | Cloudflare Pages (site) + Cloudflare Workers |
| Automatisation | n8n (self-hosted ou cloud) |
| IA | GPT-4 / GPT-4.1-mini via OpenAI API |
| Email | Resend API |
| Chat web | Chatwoot |
| RDV | Calendly |
| CRM email | Zoho Mail |
| Repo GitHub | `mayoro1972/connect-ia-bloom` |
| Branch principale | `main` |

### Contact administrateur
- Email : `marius.ayoro70@gmail.com`
- Email projet : `contact@transferai.ci`

---

## 2. HISTORIQUE CHRONOLOGIQUE DU PROJET

### Phase 0 — Genèse (avant mai 2026)
Le projet a démarré comme un site vitrine institutionnel orienté formation pour le marché Côte d'Ivoire. Les premières phases (1 à 20) ont construit :
- Vitrine : accueil, catalogue formation, parcours, certification, blog, newsletter
- Pipeline éditorial IA (blog dynamique, veille, brouillons IA)
- Back-office administrateur (newsletter, partenaires, WhatsApp, Chatwoot)
- Pipeline WhatsApp (Twilio → Supabase → email interne)
- Pipeline Chatwoot (chat web → n8n → GPT-4 réponse auto)
- Maturité atteinte au 2 mai 2026 : "plus un site vitrine, une plateforme opérationnelle"

### Phase 21 — Pipeline de Prospection IA (mai 2026)
**Démarrage : 17-22 mai 2026**

Objectif : construire un pipeline de prospection B2B automatisée avec n8n + GPT-4 pour générer des packs commerciaux personnalisés.

**V1 (22 mai 2026)** — Prospect unique, manuel :
- `Set Target` → scraping 5 URLs → anonymisation (`ORG_TARGET`) → GPT-4 → pack commercial
- Produits : Executive Letter, Mini-Catalogue, Formulaire Audit, Deck Brief
- Testé et validé

**V2 (22 mai 2026)** — Prospect unique + Supabase + email d'approbation :
- Ajout validation humaine avant envoi
- Stockage dans `ai_prospecting_packs`

**V3 (22-29 mai 2026)** — CRM Enhanced :
- Pipeline complet 51 nœuds
- Triggers : Manual + Execute Workflow
- Intégration CRM Supabase (commercial_priority_tier, statuts, scores)
- Génération 4 assets : Executive Letter, Catalogue, Audit Form URL, Deck Brief
- 2 variantes actives : `[FINAL]` et `[V20-FIXED]`

**V4 (22-29 mai 2026)** — Batch Orchestrator :
- Traitement quotidien multi-prospects (3–5/jour)
- Sources : Supabase + Airtable + Google Sheets
- Routage dynamique vers V3 ou V3 Follow-Up

### Phase 22 — Consolidation CRM (fin mai – début juin 2026)

**29 mai – 1er juin 2026** :
- Debug intensif V3 : fix scraping, fix champs Supabase, fix format conditions n8n
- Résolution erreur `delivery_status = submitted` vs champ réel dans CRM
- Export et documentation nœud-par-nœud (guide 56, 63, 68, 69)

**2 juin 2026** :
- Génération guides Word complets V4/V5
- Audio m4a → workflow Zoho Reply transcrit et configuré

**8 juin 2026** :
- V6 Post-Audit Expert Routing configuré et branché
- Guide import V6 + Google Sheets Dashboard (75)
- Guide V4 Batch nœud-par-nœud (76/77)
- Schéma architecture fonctionnelle V1→V6 (78)
- Plan BackOffice dashboard web (79–82)

**13 juin 2026** :
- Audit complet CRM : identification de 4 écarts majeurs
- Correction V4 (filtre quota) + V5 (normalisation CRM) + ajout V89 Follow-Up
- Document d'audit (90)

### Phase 23 — Canaux entrants & Social (15–23 juin 2026)

**15 juin 2026** :
- Google Forms Social Lead Sequence V1 → guide 92/94

**17 juin 2026** :
- Admin Controller V1 configuré (77 nœuds, webhook sécurisé)
- Debug whiteboard n8n : correction conditions If, format booléen v2
- Export guides Admin Controller (session 17/06)

**18 juin 2026** :
- Session troubleshooting TransferAI : fix Edge Functions, fix Cloudflare
- WhatsApp Chatwoot IA live V1 (guide 96)

**19 juin 2026** :
- Plan intégration Zoho Inbound + BackOffice (97)

**20 juin 2026** :
- Google Forms Social Lead Sequence améliorée V2 (98/99)

**23 juin 2026** :
- Google Forms V2 : séquence sociale complète, chronologie nœud/nœud (100/101/102)
- Recueil Markdown complet exporté (TransferAI_Recueil_Guides_Markdown_2026-06-23)

### Phase 24 — Pipeline CRM complet & Audit Form (24–26 juin 2026)

**24 juin 2026** :
- Guide utilisateur pipeline prospection automatisé V1 (103)
- Checklist mise en production CRM (104)
- SQL tables manquantes CRM (103_SQL)
- Guides troubleshooting pipeline (104)

**24–26 juin 2026** :
- Session 3011 entrées : intégration complète Edge Functions + formulaire audit
- Fix `resolve-invitation` : suppression colonne `organization_type` inexistante
- Ajout `deAnonymize()` dans `prospect-audit-context.ts` (fix ORG_TARGET)
- Robustesse formulaire audit : timeout AbortController 12s, erreurs 404/410, fix textarea
- Debug V6 step-by-step : 8 nœuds débogués, 2 emails reçus validés

**26 juin 2026** :
- Fix V3 `Assemble Prospect Pack` : propagation `commercial_priority_tier` depuis `commercial_priority_default`
- Fix V6 `Build Expert Routing` : support `tier1`/`tier2` (en plus de l'ancien `A`/`B`)
- Fix V6 `If Expert Notification Enabled` : envoi aussi pour priorité `medium`
- Fix conditions If en ancien format n8n → nouveau format v2

### Phase 25 — Documentation master & commit global (27–28 juin 2026)

**27–28 juin 2026** :
- Guides session 28/06 : utilisateur + troubleshooting Audit V6 (105/106)
- Guide Maître 12 workflows TransferAI (107)
- Commit et push main + codex/newsletter-bilingual-editorial
- Reconstitution base de connaissance complète (ce document)

---

## 3. ARCHITECTURE SYSTÈME ACTUELLE

### 3.1 Pipeline de Prospection — Vue globale

```
ENTRÉES PROSPECTS
├── V4 Batch Orchestrator (daily) ← Supabase / Airtable / Google Sheets
├── Google Forms Social V2 (webhook) ← campagnes réseaux sociaux
└── Manuel (Admin Controller)

       ↓
[V3 CRM Enhanced FINAL]
  Scraping → Anonymisation → GPT-4 → Pack commercial
  Outputs : Executive Letter + Mini-Catalogue + Audit Form URL + Deck Brief
  Stockage : ai_prospecting_packs

       ↓
[Admin Controller V1] ← validation humaine (approve / reject / send)

       ↓ (approved)
Email prospect via Resend
       ↓ (si pas de réponse)
[V3 Follow-Up Sequence] — J+1, J+3, J+7

       ↓ (prospect remplit formulaire)
[Edge Function resolve-invitation] + [Formulaire audit transferai.ci/questionnaire-audit]

       ↓ (soumission)
[V6 Post-Audit Expert Routing] — schedule 30 min
  → Fiche pré-RDV GPT-4
  → Email expert [PRIORITÉ HAUTE] si HIGH ou MEDIUM
  → Email brief pré-RDV à contact@transferai.ci
  → Mise à jour CRM

CANAUX ENTRANTS PARALLÈLES
├── [Chatwoot V5.5.2] — messages web → réponse GPT-4
├── [Zoho Reply V1] — emails → classification GPT-4
└── [Calendly Webhook] — RDV pris → CRM + alerte équipe
```

### 3.2 Supabase — Tables principales

| Table | Rôle |
|---|---|
| `ai_prospecting_packs` | Packs commerciaux générés par V3 |
| `prospect_targets` | CRM prospects (statuts, scores, tiers) |
| `form_invitations` | Invitations formulaire audit (token, expiry, draft) |
| `form_responses` | Réponses au formulaire d'audit |
| `contact_requests` | Leads entrants (formulaire contact, audit) |
| `outreach_attempts` | Journal des tentatives d'envoi |
| `follow_up_tracking` | Suivi des relances |
| `newsletter_subscribers` | Abonnés newsletter |
| `newsletter_issues` | Numéros de newsletter |
| `newsletter_delivery_logs` | Logs d'envoi newsletter |
| `social_prospects` | Leads issus des réseaux sociaux |
| `whatsapp_inbound_messages` | Messages WhatsApp entrants |
| `whatsapp_email_notification_logs` | Logs notifications WhatsApp |

### 3.3 Edge Functions Supabase actives

| Fonction | URL | Rôle |
|---|---|---|
| `resolve-invitation` | `/functions/v1/resolve-invitation` | Résout ou crée une invitation formulaire audit |
| `save-form-response` | `/functions/v1/save-form-response` | Sauvegarde les réponses du formulaire |
| `newsletter-drafter` | `/functions/v1/newsletter-drafter` | Génère les brouillons newsletter |
| `newsletter-send` | `/functions/v1/newsletter-send` | Envoie la newsletter |
| `newsletter-scheduler` | `/functions/v1/newsletter-scheduler` | Planifie les envois |
| `chatwoot-inbound` | `/functions/v1/chatwoot-inbound` | Reçoit les webhooks Chatwoot |
| `twilio-whatsapp-webhook` | `/functions/v1/twilio-whatsapp-webhook` | Reçoit les messages WhatsApp |

---

## 4. WORKFLOWS N8N — INVENTAIRE COMPLET

### Actifs en production

| # | Nom | Nœuds | Trigger | Fréquence | Statut |
|---|---|---|---|---|---|
| 1 | Admin Prospection Controller V1 | 77 | Webhook + Manual | À la demande | ✅ Actif |
| 2 | V3 CRM Enhanced [FINAL] | 51 | Manual + Execute Workflow | À la demande | ✅ Actif |
| 3 | V3 CRM Enhanced [V20-FIXED] | 52 | Manual + Execute Workflow | À la demande | ✅ Actif (backup) |
| 4 | Post-Audit Expert Routing V6 MVP | 37 | Schedule 30min + Webhook | Toutes les 30 min | ✅ Actif PRODUCTION |
| 5 | Post-Audit Expert Routing V2 | 33 | Schedule 30min + Webhook | Toutes les 30 min | ⚠️ Actif — À DÉSACTIVER |
| 6 | Google Forms Social Lead Seq V2 | 19 | Webhook + Schedule horaire | 1x/heure | ✅ Actif |
| 7 | Multi-Prospect V4 Batch Orchestrator | 23 | Daily Schedule + Manual | 1x/jour | ✅ Actif |
| 8 | Zoho Reply Intelligence V1 | 15 | Schedule 15min | Toutes les 15 min | ✅ Actif |
| 9 | Chatwoot Auto Reply V5.5 | 12 | Chatwoot Webhook | Temps réel | ⚠️ Actif — À DÉSACTIVER |
| 10 | Chatwoot Auto Reply V5.5.2 | 12 | Chatwoot Webhook | Temps réel | ✅ Actif PRODUCTION |
| 11 | V3 Follow-Up Sequence V1 | 12 | Daily Schedule + Manual | 1x/jour | ✅ Actif |
| 12 | Calendly Meeting Booked Webhook V1 | 6 | Webhook Calendly | Temps réel | ✅ Actif |

### ⚠️ Actions requises immédiatement

1. **Désactiver Post-Audit V2** → même trigger que V6, double traitement des soumissions
2. **Désactiver Chatwoot V5.5** → même webhook que V5.5.2, double réponse aux messages
3. **Vérifier et activer V4 Batch Orchestrator** → 53 prospects tier1 jamais contactés

---

## 5. FORMULAIRE D'AUDIT — FONCTIONNEMENT DÉTAILLÉ

### URL : `https://www.transferai.ci/questionnaire-audit`

### Composant React : `ProspectAuditFormPage.tsx`

### Flux complet
1. Prospect reçoit email avec lien `?token=xxx` ou `?pack_id=yyy`
2. Page React charge → appelle `resolve-invitation` (timeout 12s)
3. Edge Function résout le token → retourne `draft_form_data` pré-rempli
4. Prospect remplit le formulaire → sauvegarde auto via `save-form-response`
5. À la soumission : `is_completed = true` dans `form_responses`
6. V6 détecte la soumission dans les 30 min → génère fiche pré-RDV → envoie emails

### Champs clés du formulaire
- `c_nom`, `c_email`, `c_entite`, `c_poste`, `c_domaine`
- `maturity_level` (decouverte / experimentation / premiers-cas / echelle)
- `prospect_context` (texte pré-rempli depuis le pack, dé-anonymisé)
- `suggested_quick_wins`, `suggested_use_cases`, `suggested_constraints`
- `recommended_offer`, `recommended_use_case`
- `completion_percentage`, `audit_completed`

### Corrections appliquées (session 24–28 juin 2026)
- **ORG_TARGET dans le texte** → `deAnonymize()` dans `prospect-audit-context.ts`
- **Timeout réseau** → `AbortController` 12s sur fetch `resolve-invitation`
- **Erreurs 404/410** → messages spécifiques "invitation expirée"
- **Sauvegarde silencieuse** → message d'erreur si token manquant
- **Textarea blanc** → fix `typeof formData.prospect_context === "string"`

---

## 6. DONNÉES COMMERCIALES

### Tiering prospects (commercial_priority_tier)
| Tier | Critère | Traitement |
|---|---|---|
| `tier1` | Lead très qualifié, intention forte, email valide | Priorité absolue V4, routing HIGH V6 |
| `tier2` | Lead exploitable, moins qualifié | V4 normal, routing MEDIUM V6 |
| `tier3` | Lead incomplet | Reste en `draft`, pas envoyé |

### Statuts prospect (prospect_targets.status)
- `draft` → lead reçu, incomplet
- `ready` → prêt à envoyer (email valide)
- `sent` → pack envoyé
- `completed` → formulaire audit complété
- `rejected` → rejeté par admin
- `do_not_contact` → liste noire

### Logique de priorité V6 (routing_priority)
| Condition | Priorité |
|---|---|
| completion >= 95% OU maturity = avancé | HIGH |
| tier = tier1 ou A | HIGH |
| tier = tier2 ou B | MEDIUM |
| Autre | NORMAL |
| Email expert envoyé si | HIGH ou MEDIUM |

---

## 7. INFRASTRUCTURE & DÉPLOIEMENT

### Branches Git actives
| Branche | Rôle |
|---|---|
| `main` | Production — déployée sur Cloudflare Pages |
| `codex/newsletter-bilingual-editorial` | Branche de travail principale actuelle |
| `codex/prepare-main-newsletter-merge` | Préparation merge newsletter |
| `publish-main` | Publication Cloudflare |

### Déploiement Cloudflare Pages
- Chaque push sur `main` déclenche un build Cloudflare
- Site visible sur `www.transferai.ci` après ~2 min de build

### Edge Functions Supabase
- Déployées via `supabase functions deploy <nom>`
- Code source : `supabase/functions/<nom>/index.ts`
- Fichiers partagés : `supabase/functions/_shared/`

---

## 8. PROBLÈMES CONNUS & FIXES DOCUMENTÉS

### Bugs résolus (sessions mai–juin 2026)

| Problème | Cause | Fix appliqué |
|---|---|---|
| ORG_TARGET visible dans le formulaire | V3 anonymise pour LLM, résultat stocké avec placeholder | `deAnonymize()` dans `prospect-audit-context.ts` |
| `If Pack Found` toujours false | Ancien format booléen n8n v1 cassé | Condition `$json.found is true` format v2 |
| `Get Latest Form Response` vide | URL filtre sur `pack_id` inexistant dans `form_responses` | Filtre sur `id=eq.{response_id}` |
| `commercial_priority_tier` absent | `Assemble Prospect Pack` ne propagait pas la valeur | Fallback `ctx.commercial_priority_default` |
| Double traitement post-audit | V2 et V6 ont le même schedule 30min | À corriger : désactiver V2 |
| Lien Calendly doublé dans email | Format Markdown `[url](url)` dans champ HTML | Fix manuel : remplacer par `<a href="...">Calendly</a>` |
| `resolve-invitation` erreur 500 | SELECT incluait `organization_type` (colonne inexistante) | Suppression du champ du SELECT |
| Timeout formulaire sans message | Aucune gestion du signal AbortController | AbortController 12s + message d'erreur |

### Points d'attention permanents
- **V6 schedule 30 min** → délai max 30 min entre soumission et traitement
- **V4 quota** → filtre quota regardait `delivery_status = submitted` (V3 n'écrit pas ce champ) → corrigé en juin 2026
- **Ancien format If n8n** → les conditions `value1 equals value2` sont cassées dans la version actuelle de n8n → utiliser format `Options {version:2}` avec `operator.type`
- **53 prospects tier1** → jamais contactés dans Supabase → lancer V4 manuellement

---

## 9. OFFRE COMMERCIALE TRANSFERAI

### Services principaux
- **Audit IA** (gratuit, formulaire en ligne) → 45 min RDV post-audit
- **Formation & Certification** (catalogue sectoriel)
- **Accompagnement entreprise** (adoption IA, automatisation, conseil)
- **Solutions sur mesure** (LLM privé, workflows, CRM IA)

### Secteurs cibles prioritaires
Assistanat, RH, Marketing, Finance, Juridique, Service Client, Data, IT, Management, Formation, Santé, Diplomatie

### Géographie
Côte d'Ivoire (priorité) → Afrique de l'Ouest → Afrique

### Positionnement tarifaire
- Audit gratuit (porte d'entrée)
- Formations : tarif présenté dans TABLEAU DE PRIX UCP-FM
- Accompagnement : devis sur mesure

---

## 10. DOCUMENTS DE RÉFÉRENCE CLÉS

### Index complet : `00_INDEX.md`
### Documents fondateurs
- `01_Guide_Administrateur_No1.md` — Guide admin principal
- `02_Base_Connaissance_Site.md` — Base de connaissance site
- `03_FAQ_Site_Assistant_IA.md` — FAQ opérationnelle
- `04_Plan_Deploiement_Exploitation.md` — Plan d'exploitation
- `05_Roadmap_Historique_Projet.md` — Historique phases 1-20

### Documents pipeline prospection
- `57_Presentation_Pipeline_Prospection_V1_V2_V3_V4.md` — Vue d'ensemble pipeline
- `68/69` — Guides V3 CRM utilisateur + troubleshooting
- `76/77` — Guides V4 Batch nœud-par-nœud + troubleshooting
- `78` — Schéma architecture fonctionnelle V1→V6
- `90` — Audit expert CRM juin 2026
- `103/104` — Guides pipeline V1 Word
- `107_Guide_Maitre_Workflows_TransferAI_V1.docx` — **Document de référence principal 12 workflows**

### Documents sessions récentes (juin 2026)
- `100/101/102` — Google Forms Social V2
- `103/104` — Pipeline prospection V1
- `105/106` — Session 28/06 Audit V6 (utilisateur + troubleshooting)
- `107` — Guide Maître 12 workflows (DOCX)

---

## 11. MÉMOIRE OPÉRATIONNELLE — CE QUI MARCHE

### Validé en production (28 juin 2026)
- ✅ V3 génère des packs complets avec Executive Letter + Catalogue + Deck Brief + URL audit
- ✅ Admin Controller route correctement les actions approve/reject/send
- ✅ Formulaire audit accessible et robuste (timeout, messages d'erreur, sauvegarde)
- ✅ V6 détecte les soumissions et envoie les 2 emails (expert + brief pré-RDV)
- ✅ Email expert reçu à `marius.ayoro70@gmail.com` — validé le 27 juin 2026
- ✅ Chatwoot V5.5.2 répond automatiquement aux messages entrants
- ✅ Zoho Reply V1 classe les réponses email toutes les 15 min
- ✅ Calendly Webhook met à jour le CRM à chaque RDV pris

### En attente / À faire
- ⬜ Désactiver Post-Audit V2 (conflit avec V6)
- ⬜ Désactiver Chatwoot V5.5 (conflit avec V5.5.2)
- ⬜ Lancer V4 sur les 53 prospects tier1 en attente
- ⬜ Tester V3 avec un nouveau prospect réel (valider Executive Letter + Deck + Catalogue)
- ⬜ Fix lien Calendly doublé dans email `Send Internal Brief Email` (nœud n8n V6)
- ⬜ BackOffice dashboard web prospection (plan docs 79-82, prompt Lovable docs 80-81)
- ⬜ Webinaire juillet 2026 (branche `codex/webinar-july-2026`)
- ⬜ Newsletter bilingue (branche `codex/newsletter-bilingual-editorial`)
