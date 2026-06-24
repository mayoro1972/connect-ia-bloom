# Guide utilisateur de référence

**Programme :** écosystème de prospection, qualification, validation et envoi TransferAI

**Version consolidée :** 2 juin 2026

**Workflow de référence pour cette mise à jour :** `TransferAI Prospecting V3 CRM Enhanced [FINAL]-10.json` exporté depuis n8n, 53 nœuds.

**Portée :** ce document fusionne les guides utilisateur, administrateur, batch CRM et exploitation n8n créés depuis le début du projet jusqu’à la stabilisation actuelle, puis les aligne sur l’export `FINAL-10`.

**Finalité :** donner un document unique pour comprendre le dispositif, l’utiliser au quotidien, préparer un envoi prospect, maintenir les bons secrets et savoir quel workflow joue quel rôle, y compris quand un export n8n conserve encore des nœuds de compatibilité.

## 1. Objet et périmètre

Le système TransferAI ne se limite pas à un simple workflow n8n. Il s’agit d’une chaîne complète qui couvre :

- la collecte de signaux publics sur les prospects,
- la protection des données avant appel LLM,
- la génération de livrables commerciaux,
- la validation interne par email,
- l’envoi prospect après approbation,
- la croissance CRM,
- le back-office de contenu et d’opérations,
- les integrations Supabase, Resend, Twilio, Chatwoot et Cloudflare.

Ce guide couvre les usages réels et les décisions structurelles validées à date. Il sert de référence utilisateur pour la V3, mais aussi de point d’entrée pour comprendre la logique V1, V2, V4 et V5. Cette version documente l’état concret de l’export `FINAL-10`, y compris les écarts restant à corriger avant un passage complet en production.

## 2. Evolution du dispositif de prospection

| Version | Role principal | Statut conceptuel |
| --- | --- | --- |
| V1 | Generation manuelle d un pack prospect a partir du scraping public et des appels LLM | Base fondatrice |
| V2 | Sauvegarde Supabase, email d approbation interne, webhook d approbation, envoi prospect | Premiere boucle complete de validation |
| V3 | Version CRM enhanced avec livrables plus riches, audit en ligne, catalogue genere par pack et stabilisation des noeuds critiques | Flux operable de reference |
| V4 | Batch et quotas d envoi, regles d arret, arbitrage du volume journalier | Couche de gouvernance commerciale |
| V5 | Growth loop CRM, ingestion continue des leads publics et alimentation de `prospect_targets` | Couche amont de croissance |

## 3. Architecture cible actuellement validée

- **Audit :** formulaire en ligne via `audit.transferai.ci`, sans pièce jointe.
- **Catalogue :** génération dynamique par pack via `catalogue-renderer`, stockage dans Supabase Storage, PDF et DOCX produits par `pack_id`.
- **Deck :** phase 1 PPTX active via `deck-renderer`, génération d’un fichier `.pptx` par pack, stockage dans Supabase Storage et réinjection de l’artefact dans le payload V3.
- **Validation :** approbation interne par email avec liens *Approuver* / *Rejeter*.
- **Envoi :** Resend pour les emails sortants.
- **Stockage :** Supabase pour les packs, le CRM et les artefacts.

> **Point important pour le workflow `FINAL-10` :** l’export conserve encore des nœuds de compatibilité hérités de l’ancienne logique catalogue statique, notamment `Resolve Domain Catalogue`, `Download Catalogue PDF` et `Assemble Mail Attachments`. Ils sont toujours présents dans le canvas, mais la chaîne cible pour les pièces jointes finales est désormais la chaîne dynamique `Build Catalogue Render Payload -> render Catalogue Artifact -> Merge Catalogue Artifact -> Build Deck Render Payload -> Render Deck Artifact -> Merge Deck Artifact`.

## 4. Composants, outils et responsabilites

### 4.1 n8n

n8n orchestre la generation du pack, les appels OpenAI, le rendu catalogue, la validation interne, le webhook d approbation et l envoi prospect.

### 4.2 Supabase

Supabase joue plusieurs roles :

- base de données pour les packs et le CRM,
- storage pour les catalogues PDF/DOCX,
- edge functions pour les traitements backend comme `catalogue-renderer` et `deck-renderer`.

### 4.3 Resend

Resend sert a l envoi des emails internes et externes. La base de test reste `onboarding@resend.dev` tant que le domaine de production n est pas pleinement verrouille.

### 4.4 Back-office et admin

Le back-office TransferAI couvre les ressources, la newsletter, les brouillons IA, les partenariats, les opportunites, WhatsApp et l exploitation du futur assistant IA.

### 4.5 Chatwoot, Twilio et WhatsApp

Ces briques servent a capter les messages entrants, orienter les utilisateurs, journaliser les interactions et alimenter la relation client multicanale.

## 5. Niveaux de secrets et valeurs de reference

| Element | Usage | Regle de stabilite |
| --- | --- | --- |
| `CONTENT_ADMIN_TOKEN` | Authentification des fonctions back-office et des renderers via le header `x-admin-token` | À conserver et utiliser en priorité dans n8n pour `catalogue-renderer` et `deck-renderer` |
| `SUPABASE_SERVICE_ROLE_KEY` | Execution backend privilegiee | A conserver cote serveur ; eviter de la privilegier dans n8n si `x-admin-token` suffit |
| `SUPABASE_URL` | URL du projet Supabase | A conserver |
| `RESEND_API_KEY` | Envoi email | A conserver |
| `OPENAI_API_KEY` | Generation pre-audit, lettre, catalogue, audit form, deck brief | A conserver |
| `BOOKING_LINK_45MIN` / lien direct | CTA de prise de rendez-vous | La valeur valide de reference est `https://calendly.com/contact-transferai/30min` |
| `MAIL_FROM` / sender | Adresse expediteur Resend | Remplacer le sender de test `onboarding@resend.dev` par `noreply@transferai.ci` une fois le domaine valide |

> **Constat sur l’export `FINAL-10` :** plusieurs secrets restent encore écrits en dur dans le fichier exporté, notamment des tokens Supabase, des valeurs `x-admin-token` et une clé Resend. Le guide utilisateur doit donc être lu avec une vigilance particulière : le workflow fonctionne en test, mais ces valeurs doivent être externalisées avant toute généralisation.

## 6. Clés, valeurs et comportements à remplacer pour la stabilité

- Remplacer les valeurs `x-admin-token` écrites en dur dans `render Catalogue Artifact` et `Render Deck Artifact` par `{{$env.CONTENT_ADMIN_TOKEN}}` ou par une credential équivalente.
- Externaliser les clés Supabase et Resend encore écrites en dur dans l’export `FINAL-10`.
- Supprimer l ancien schema d auth du renderer par `Authorization: Bearer ...` si le schema `x-admin-token` est adopte partout.
- Retirer toute cible Gmail de test avant production.
- Ne plus utiliser les anciens PDF statiques du site `transferai.ci/catalogues-domaines-assets/...` comme source finale de pièce jointe, même si `Download Catalogue PDF` et `Assemble Mail Attachments` restent visibles dans l’export.
- Ne plus attacher le formulaire d audit en fichier ; conserver uniquement le lien web.
- Ne plus dépendre d un chemin disque local Mac pour les livrables ; toute génération doit passer par service backend + storage.

## 7. Workflow V3 de référence

### 7.1 État réel du workflow `FINAL-10`

Le workflow exporté `TransferAI Prospecting V3 CRM Enhanced [FINAL]-10.json` contient **53 nœuds**. Il reflète un état de transition avancé :

- la chaîne dynamique catalogue + deck est bien en place et fonctionne,
- la branche d’approbation / envoi impose bien `attachments_count = 2`,
- mais quelques nœuds plus anciens restent dans le canvas à des fins de compatibilité ou d’historique opérationnel.

### 7.2 Nœuds clés

- **Generate Executive Letter** : courrier exécutif.
- **Generate Tailored Catalogue** : source de personnalisation commerciale.
- **Generate Tailored Audit Form** : source métier pour le formulaire d’audit.
- **Generate Deck Brief** : structure et argumentaire du deck.
- **Assemble Prospect Pack** : assemble les sorties LLM et le contexte prospect.
- **Resolve Domain Catalogue** : détecte le domaine de base du catalogue statique historique ; ce nœud reste présent dans `FINAL-10`.
- **Download Catalogue PDF** : télécharge le PDF catalogue côté site public ; présent dans l’export mais non retenu comme source finale cible des pièces jointes phase 1 deck.
- **Assemble Mail Attachments** : ancienne logique d’assemblage PDF + `Deck_Brief` ; visible dans l’export, mais ne correspond plus au flux d’envoi cible.
- **Build Catalogue Render Payload** : fabrique le payload complet pour `catalogue-renderer`.
- **render Catalogue Artifact** : génère le PDF et le DOCX par `pack_id`. Dans `FINAL-10`, le nom du nœud commence bien par un `r` minuscule.
- **Merge Catalogue Artifact** : injecte les URLs réelles du catalogue dans le pack.
- **Build Deck Render Payload** : prépare le payload PPTX à partir du pack enrichi catalogue.
- **Render Deck Artifact** : appelle `deck-renderer` pour produire le fichier `.pptx`.
- **Merge Deck Artifact** : fusionne le deck avec le pack et concatène les pièces jointes catalogue + deck.
- **Store Pack In Supabase** : stocke le pack final avec `catalogue_artifact`, `deck_artifact`, `mail_attachments` et `attachments_count`.
- **Build Approval Email** et **Send Internal Approval Email** : validation interne.
- **Approval Webhook**, **Extract Pack Payload**, **Build Send Context**, **Send External Prospect Email** : envoi prospect.

### 7.3 Chaîne principale de référence

Dans l’export `FINAL-10`, la chaîne fonctionnelle à suivre pour la phase 1 deck PPTX est la suivante :

`Assemble Prospect Pack -> Resolve Domain Catalogue -> Build Catalogue Render Payload -> render Catalogue Artifact -> Merge Catalogue Artifact -> Build Deck Render Payload -> Render Deck Artifact -> Merge Deck Artifact -> Store Pack In Supabase -> Build Approval Email -> Send Internal Approval Email`

Le nœud `Resolve Domain Catalogue` reste en amont dans le workflow exporté. En revanche, la source finale d’attachments utilisée pour l’envoi prospect doit bien venir de `Merge Deck Artifact`, et non de l’ancienne paire `Download Catalogue PDF` / `Assemble Mail Attachments`.

### 7.4 Procédure normale d’utilisation

1. Vérifier le prospect cible dans **Set Target** ou dans sa source CRM.
2. Lancer le workflow de génération.
3. Vérifier que **render Catalogue Artifact** retourne `success = true` et `used_tailored_markdown = true`.
4. Vérifier que **Render Deck Artifact** retourne `success = true` avec un `deck_artifact` contenant `filename_pptx` et `pptx_url`.
5. Vérifier dans les diagnostics du deck que la variante, la langue et le nombre de slides de cas d’usage sont cohérents avec le prospect. Le rendu cible doit rester dans une fourchette de 8 à 10 slides selon la densité du contenu.
6. Vérifier dans **Merge Deck Artifact** que `mail_attachments` contient exactement deux fichiers : un `.pdf` et un `.pptx`.
7. Vérifier que **Store Pack In Supabase** stocke bien `catalogue_artifact`, `deck_artifact`, `mail_attachments` et `attachments_count = 2`.
8. Recevoir et relire l’email interne de validation. Dans l’export actuel, la ligne visible peut encore s’afficher sous la forme `Pieces jointes preparees` sans accents. La valeur attendue reste néanmoins `2`.
9. Approuver uniquement le dernier email reçu.
10. Vérifier la nouvelle exécution webhook dans **Executions**.
11. Vérifier que **Build Send Context** retourne `attachments_count = 2` et `can_send = true`.
12. Vérifier la réponse de **Send External Prospect Email**.

### 7.5 Règles de qualité du deck premium

- Le deck V3 doit être lisible à la première lecture, sans chevauchement de texte ni zones saturées.
- La structure cible est dynamique : couverture, agenda, crédibilité, enjeux, une ou deux slides de cas d’usage, ROI, trajectoire 90 jours, clôture. Le total attendu est de 8 à 10 slides selon la matière disponible.
- Pour un prospect francophone, les accents doivent apparaître dans tous les textes statiques et dynamiques visibles du deck.
- Pour un prospect anglophone ou hispanophone, le renderer doit basculer vers un anglais standard ou un espagnol standard avec accents, sans mélange de langues.
- Le deck doit reprendre les fallbacks sectoriels premium, en particulier le fallback Orange quand l’organisation cible correspond à Orange.
- Quand le contenu est trop dense, le renderer doit raccourcir les blocs, limiter les listes et répartir les cas d’usage sur une slide supplémentaire au lieu de tasser le texte.

## 8. Procédure de lecture des exécutions

Les validations les plus fiables se font dans **Executions**, pas seulement dans l’éditeur de nœuds.

1. Ouvrir la dernière exécution du workflow principal après génération.
2. Ouvrir la dernière exécution webhook après clic sur *Approuver et envoyer*.
3. Vérifier la branche `true` dans **If Approved** et **If Ready To Send**.
4. Vérifier le nombre de pièces jointes dans **Build Send Context**.

## 9. État actuellement validé

- Le catalogue est généré dynamiquement par pack.
- Le PDF et le DOCX sont stockés dans le bucket public `prospecting-artifacts`.
- Le renderer catalogue utilise bien `tailored_catalogue_markdown`.
- Le deck est généré en `.pptx` par `deck-renderer`, stocké dans le même bucket et renvoyé comme seconde pièce jointe finale du pack.
- Le formulaire d’audit est en ligne et n’est plus joint.
- Le circuit approbation interne puis envoi prospect est stable en test avec deux pièces jointes finales.
- Dans `FINAL-10`, la branche d’envoi prospect se base bien sur `Build Send Context`, qui accepte des attachments avec `content` ou `path` et exige un PDF plus un PPTX.
- Le résumé d’approbation interne reflète désormais `attachments_count` et le nombre attendu de pièces jointes, même si certains libellés visibles dans l’export restent encore écrits sans accents.
- Quand le décideur n’est pas encore connu, le courrier prospect évite autant que possible d’exposer brut le placeholder `Décideur à confirmer`.
- Le renderer deck premium gère désormais la localisation FR / EN / ES, les accents visibles, la réduction intelligente des CTA et la répartition dynamique des cas d’usage pour limiter les chevauchements.
- Le workflow exporté conserve encore des nœuds historiques catalogue statique, mais ils ne définissent plus la cible fonctionnelle du flux V3 phase 1 deck PPTX.

## 10. Pièces jointes actuellement envoyées

- `Mini_Catalogue_TransferAI_[Prospect].pdf` : livrable généré par pack via `catalogue-renderer`.
- `Deck_TransferAI_[Prospect].pptx` : livrable généré par pack via `deck-renderer`.

Le formulaire d’audit ne doit plus apparaître en pièce jointe. Le flux d’envoi cible ne doit plus produire `Deck_Brief_[Prospect].json`.

## 11. Règles commerciales et d’exploitation

- La V4 pilote les quotas quotidiens et les règles d’arrêt.
- La V5 grossit la base CRM sans envoyer elle-même les courriers.
- Le flux V3 doit rester réservé aux prospects validés et éligibles.
- Ne pas augmenter les volumes tant que les boucles de réponse et les signaux de niche ne sont pas stabilisés.

## 12. Guide d exploitation du back-office

L administrateur No1 garantit la coherence operationnelle. Les zones cle du back-office et de l ecosysteme sont :

- **Ressources**, **Brouillons IA**, **Capsules video**, **Newsletter IA**, **Partenaires IA**, **Emplois IA**, **WhatsApp**
- Supabase : Table Editor, Edge Functions, Secrets, SQL Editor
- Twilio : messages WhatsApp et journalisation
- Chatwoot : inbox web et orchestration support / assistant IA
- GitHub + Cloudflare : diffusion front public

## 13. Checklist avant production

| Tache | Priorite |
| --- | --- |
| Externaliser toutes les clés encore écrites en dur dans l’export `FINAL-10` : Supabase, Resend et `x-admin-token` | Urgent |
| Rendre le formulaire d audit reellement dynamique via `pack_id` | Urgent |
| Valider le rendu `.pptx` premium sur plusieurs profils de prospect et plusieurs langues, avec contrôle visuel slide par slide | Urgent |
| Verifier le domaine Resend et migrer vers `noreply@transferai.ci` | Important |
| Retirer le Gmail de test et la cible de demonstration | Important |
| Tester français, anglais et espagnol sur des cas réels distincts | Important |
| Vérifier régulièrement le fallback Orange et les autres fallbacks sectoriels premium après chaque évolution du renderer | Important |
| Verifier le CRM growth loop V5 et les quotas V4 en conditions reelles | Normal |

## 14. Resume de reference

Le système TransferAI est maintenant composé d’une couche amont CRM, d’une couche de batch et d’une couche de prospection personnalisée avec validation humaine. Dans l’export `FINAL-10`, la génération du catalogue par pack et du deck PPTX premium dynamique est opérationnelle, avec stockage Supabase, localisation par langue, gestion des accents et mécanismes de réduction de densité pour tenir dans 8 à 10 slides lisibles. Les deux chantiers prioritaires qui restent ouverts sont l’externalisation des secrets encore écrits en dur et la finalisation d’un audit web dynamique réellement exploité par `pack_id`, tout en poursuivant la validation visuelle du rendu premium sur plusieurs secteurs réels.

Document consolide a partir des guides V1, V2, V4, V5, des guides admin/back-office et des guides de stabilisation V3.
