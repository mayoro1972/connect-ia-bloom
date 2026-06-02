# Guide utilisateur de référence

**Programme :** écosystème de prospection, qualification, validation et envoi TransferAI

**Version consolidée :** 2 juin 2026

**Portée :** ce document fusionne les guides utilisateur, administrateur, batch CRM et exploitation n8n créés depuis le début du projet jusqu’à la stabilisation actuelle.

**Finalité :** donner un document unique pour comprendre le dispositif, l’utiliser au quotidien, préparer un envoi prospect, maintenir les bons secrets et savoir quel workflow joue quel rôle.

## 1. Objet et perimetre

Le systeme TransferAI ne se limite pas a un simple workflow n8n. Il s agit d une chaine complete qui couvre :

- la collecte de signaux publics sur les prospects,
- la protection des donnees avant appel LLM,
- la generation de livrables commerciaux,
- la validation interne par email,
- l envoi prospect apres approbation,
- la croissance CRM,
- le back-office de contenu et d operations,
- les integrations Supabase, Resend, Twilio, Chatwoot et Cloudflare.

Ce guide couvre les usages reels et les decisions structurelles valides a date. Il sert de reference utilisateur pour la V3, mais aussi de point d entree pour comprendre la logique V1, V2, V4 et V5.

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

## 4. Composants, outils et responsabilites

### 4.1 n8n

n8n orchestre la generation du pack, les appels OpenAI, le rendu catalogue, la validation interne, le webhook d approbation et l envoi prospect.

### 4.2 Supabase

Supabase joue plusieurs roles :

- base de donnees pour les packs et le CRM,
- storage pour les catalogues PDF/DOCX,
- edge functions pour les traitements backend comme `catalogue-renderer`.

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

## 6. Cles, valeurs et comportements a remplacer pour la stabilite

- Supprimer l ancien schema d auth du renderer par `Authorization: Bearer ...` si le schema `x-admin-token` est adopte partout.
- Retirer toute cible Gmail de test avant production.
- Ne plus utiliser les anciens PDF statiques du site `transferai.ci/catalogues-domaines-assets/...` comme source finale de piece jointe.
- Ne plus attacher le formulaire d audit en fichier ; conserver uniquement le lien web.
- Ne plus dependre d un chemin disque local Mac pour les livrables ; toute generation doit passer par service backend + storage.

## 7. Workflow V3 de référence

### 7.1 Nœuds clés

- **Generate Executive Letter** : courrier exécutif.
- **Generate Tailored Catalogue** : source de personnalisation commerciale.
- **Generate Tailored Audit Form** : source métier pour le formulaire d’audit.
- **Generate Deck Brief** : structure et argumentaire du deck.
- **Assemble Prospect Pack** : assemble les sorties LLM et le contexte prospect.
- **Resolve Domain Catalogue** : détecte le domaine de base du catalogue.
- **Build Catalogue Render Payload** : fabrique le payload complet pour `catalogue-renderer`.
- **Render Catalogue Artifact** : génère le PDF et le DOCX par `pack_id`.
- **Merge Catalogue Artifact** : injecte les URLs réelles du catalogue dans le pack.
- **Build Deck Render Payload** : prépare le payload PPTX à partir du pack enrichi catalogue.
- **Render Deck Artifact** : appelle `deck-renderer` pour produire le fichier `.pptx`.
- **Merge Deck Artifact** : fusionne le deck avec le pack et concatène les pièces jointes catalogue + deck.
- **Store Pack In Supabase** : stocke le pack final avec `catalogue_artifact`, `deck_artifact`, `mail_attachments` et `attachments_count`.
- **Build Approval Email** et **Send Internal Approval Email** : validation interne.
- **Approval Webhook**, **Extract Pack Payload**, **Build Send Context**, **Send External Prospect Email** : envoi prospect.

### 7.2 Chaîne principale de référence

La chaîne principale V3 validée pour la phase 1 deck PPTX est la suivante :

`Assemble Prospect Pack -> Resolve Domain Catalogue -> Build Catalogue Render Payload -> Render Catalogue Artifact -> Merge Catalogue Artifact -> Build Deck Render Payload -> Render Deck Artifact -> Merge Deck Artifact -> Store Pack In Supabase -> Build Approval Email -> Send Internal Approval Email`

### 7.3 Procédure normale d’utilisation

1. Vérifier le prospect cible dans **Set Target** ou dans sa source CRM.
2. Lancer le workflow de génération.
3. Vérifier que **Render Catalogue Artifact** retourne `success = true` et `used_tailored_markdown = true`.
4. Vérifier que **Render Deck Artifact** retourne `success = true` avec un `deck_artifact` contenant `filename_pptx` et `pptx_url`.
5. Vérifier dans les diagnostics du deck que la variante, la langue et le nombre de slides de cas d’usage sont cohérents avec le prospect. Le rendu cible doit rester dans une fourchette de 8 à 10 slides selon la densité du contenu.
6. Vérifier dans **Merge Deck Artifact** que `mail_attachments` contient exactement deux fichiers : un `.pdf` et un `.pptx`.
7. Vérifier que **Store Pack In Supabase** stocke bien `catalogue_artifact`, `deck_artifact`, `mail_attachments` et `attachments_count = 2`.
8. Recevoir et relire l’email interne de validation. La ligne `Pièces jointes préparées` doit afficher `2` et la ligne `Fichiers` doit mentionner le PDF puis le PPTX.
9. Approuver uniquement le dernier email reçu.
10. Vérifier la nouvelle exécution webhook dans **Executions**.
11. Vérifier que **Build Send Context** retourne `attachments_count = 2` et `can_send = true`.
12. Vérifier la réponse de **Send External Prospect Email**.

### 7.4 Règles de qualité du deck premium

- Le deck V3 doit être lisible à la première lecture, sans chevauchement de texte ni zones saturées.
- La structure cible est dynamique : couverture, agenda, crédibilité, enjeux, une ou deux slides de cas d’usage, ROI, trajectoire 90 jours, clôture. Le total attendu est de 8 à 10 slides selon la matière disponible.
- Pour un prospect francophone, les accents doivent apparaître dans tous les textes statiques et dynamiques visibles du deck.
- Pour un prospect anglophone ou hispanophone, le renderer doit basculer vers un anglais standard ou un espagnol standard avec accents, sans mélange de langues.
- Le deck doit reprendre les fallbacks sectoriels premium, en particulier le fallback Orange quand l’organisation cible correspond à Orange.
- Quand le contenu est trop dense, le renderer doit raccourcir les blocs, limiter les listes et répartir les cas d’usage sur une slide supplémentaire au lieu de tasser le texte.

## 8. Procedure de lecture des executions

Les validations les plus fiables se font dans **Executions**, pas seulement dans l editeur de noeuds.

1. Ouvrir la derniere execution du workflow principal apres generation.
2. Ouvrir la derniere execution webhook apres clic sur *Approuver et envoyer*.
3. Verifier la branche `true` dans **If Approved** et **If Ready To Send**.
4. Verifier le nombre de pieces jointes dans **Build Send Context**.

## 9. État actuellement validé

- Le catalogue est généré dynamiquement par pack.
- Le PDF et le DOCX sont stockés dans le bucket public `prospecting-artifacts`.
- Le renderer catalogue utilise bien `tailored_catalogue_markdown`.
- Le deck est généré en `.pptx` par `deck-renderer`, stocké dans le même bucket et renvoyé comme seconde pièce jointe finale du pack.
- Le formulaire d’audit est en ligne et n’est plus joint.
- Le circuit approbation interne puis envoi prospect est stable en test avec deux pièces jointes finales.
- Le résumé d’approbation interne reflète désormais `attachments_count`, le nom des fichiers joints et les meilleurs fallbacks commerciaux disponibles.
- Quand le décideur n’est pas encore connu, le courrier prospect évite autant que possible d’exposer brut le placeholder `Décideur à confirmer`.
- Le renderer deck premium gère désormais la localisation FR / EN / ES, les accents visibles, la réduction intelligente des CTA et la répartition dynamique des cas d’usage pour limiter les chevauchements.

## 10. Pièces jointes actuellement envoyées

- `Mini_Catalogue_TransferAI_[Prospect].pdf` : livrable généré par pack via `catalogue-renderer`.
- `Deck_TransferAI_[Prospect].pptx` : livrable généré par pack via `deck-renderer`.

Le formulaire d’audit ne doit plus apparaître en pièce jointe. Le flux d’envoi cible ne doit plus produire `Deck_Brief_[Prospect].json`.

## 11. Regles commerciales et d exploitation

- La V4 pilote les quotas quotidiens et les regles d arret.
- La V5 grossit la base CRM sans envoyer elle-meme les courriers.
- Le flux V3 doit rester reserve aux prospects valides et eligibles.
- Ne pas augmenter les volumes tant que les boucles de reponse et les signaux de niche ne sont pas stabilises.

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
| Rendre le formulaire d audit reellement dynamique via `pack_id` | Urgent |
| Valider le rendu `.pptx` premium sur plusieurs profils de prospect et plusieurs langues, avec contrôle visuel slide par slide | Urgent |
| Verifier le domaine Resend et migrer vers `noreply@transferai.ci` | Important |
| Retirer le Gmail de test et la cible de demonstration | Important |
| Tester francais, anglais et espagnol sur des cas reels distincts | Important |
| Vérifier régulièrement le fallback Orange et les autres fallbacks sectoriels premium après chaque évolution du renderer | Important |
| Verifier le CRM growth loop V5 et les quotas V4 en conditions reelles | Normal |

## 14. Resume de reference

Le système TransferAI est maintenant composé d’une couche amont CRM, d’une couche de batch et d’une couche de prospection personnalisée avec validation humaine. La génération du catalogue par pack est validée. Le deck PPTX premium dynamique est désormais actif côté backend, avec stockage Supabase, localisation par langue, gestion des accents et mécanismes de réduction de densité pour tenir dans 8 à 10 slides lisibles. Le chantier structurant qui reste ouvert en priorité est la finalisation d’un audit web dynamique réellement exploité par `pack_id` ainsi que la validation continue du rendu premium sur plusieurs secteurs réels.

Document consolide a partir des guides V1, V2, V4, V5, des guides admin/back-office et des guides de stabilisation V3.
