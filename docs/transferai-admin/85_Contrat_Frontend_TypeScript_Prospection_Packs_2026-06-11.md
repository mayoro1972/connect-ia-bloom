# Contrat Frontend TypeScript - Prospection Packs

Date : 11 juin 2026

## 1. Objet

Ce document formalise le contrat TypeScript a utiliser dans le futur module `Prospection Packs` du back-office.

L'objectif est de donner au frontend :

- des `types metier` stables
- des `types de requete` pour les boutons d'action
- des `types de reponse` pour les endpoints backend
- une `couche service` prete a brancher

Les fichiers prepares dans `src` sont :

- [types.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/src/components/backoffice/prospecting/types.ts)
- [prospecting-admin.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/src/lib/prospecting-admin.ts)

---

## 2. Ce que contient le contrat

## 2.1 Types de reference metier

Le fichier [types.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/src/components/backoffice/prospecting/types.ts) contient :

- `ProspectTargetItem`
- `ProspectingPackItem`
- `OutreachAttemptItem`
- `ProspectPackPayload`
- `PackAttachment`
- `PackDiagnostics`
- `PackDetailViewModel`
- `ProspectionSnapshot`
- `ProviderConfigSummary`

Ces types servent a afficher :

- la liste des prospects
- la liste des packs
- le detail d'un pack
- le journal d'envoi
- les connecteurs email actifs

## 2.2 Types des actions frontend

Le contrat contient aussi les payloads prets pour les boutons :

- `GeneratePackRequest`
- `RegeneratePackRequest`
- `ApprovePackRequest`
- `RejectPackRequest`
- `SendPackRequest`
- `TestProviderRequest`

## 2.3 Types des reponses backend

Les reponses frontend attendues sont normalisees par :

- `AdminActionResponse<T>`
- `GeneratePackResponse`
- `RegeneratePackResponse`
- `ApprovePackResponse`
- `RejectPackResponse`
- `SendPackResponse`
- `TestProviderResponse`
- `ListProvidersResponse`
- `HealthCheckResponse`

---

## 3. Couche service prete a brancher

Le fichier [prospecting-admin.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/src/lib/prospecting-admin.ts) expose deja les signatures frontend suivantes :

- `generateProspectPack(token, payload)`
- `regenerateProspectPack(token, payload)`
- `approveProspectPack(token, payload)`
- `rejectProspectPack(token, payload)`
- `sendProspectPack(token, payload)`
- `testProspectingProvider(token, payload)`
- `listProspectingProviders(token)`
- `getProspectingHealth(token)`

Ces fonctions utilisent deja le pattern du projet via :

- `invokeAdminEdgeFunction`

avec une fonction backend cible nommee :

- `prospecting-admin`

Cela vous donne un point d'entree stable, meme si le backend n'est pas encore deploye.

---

## 4. Comment le front doit l'utiliser

## 4.1 Liste des packs

La vue `Packs` doit consommer :

- `ProspectingPackItem[]`

Colonnes recommandees :

- `pack_id`
- `organization_name`
- `target_email`
- `status`
- `created_at`
- `approved_at`
- `sent_at`

## 4.2 Detail d'un pack

La vue `Detail Pack` doit consommer :

- `PackDetailViewModel`

Ce type contient deja :

- le pack
- le prospect associe
- les pieces jointes
- les diagnostics
- la timeline
- les tentatives d'envoi

## 4.3 Actions utilisateur

Le front doit mapper ses boutons ainsi :

- `Generer pack` -> `generateProspectPack`
- `Regenerer` -> `regenerateProspectPack`
- `Approuver` -> `approveProspectPack`
- `Rejeter` -> `rejectProspectPack`
- `Envoyer` -> `sendProspectPack`
- `Tester connecteur` -> `testProspectingProvider`

---

## 5. Convention de donnees recommandee

## 5.1 Lecture

Le frontend doit lire directement dans Supabase :

- `prospect_targets`
- `ai_prospecting_packs`
- `outreach_attempts`

## 5.2 Actions

Le frontend doit appeler le backend admin via :

- [prospecting-admin.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/src/lib/prospecting-admin.ts)

## 5.3 Filtrage

Le type `ProspectingAdminFilters` est deja prevu pour la couche UI.

Il supporte :

- recherche texte
- statut pack
- statut prospect
- priorite
- fournisseur
- envoyable ou non

---

## 6. Ce que vous pouvez coder ensuite sans refaire le contrat

Avec ces deux fichiers, l'equipe frontend peut maintenant coder :

1. `ProspectionStatusBadge.tsx`
2. `ProspectTargetsTable.tsx`
3. `ProspectingPacksTable.tsx`
4. `PackLetterPreview.tsx`
5. `PackAttachmentsPanel.tsx`
6. `PackDiagnosticsPanel.tsx`
7. `ProspectingPackDetail.tsx`
8. `OutreachAttemptsTable.tsx`
9. `ProspectionPacksAdminPanel.tsx`

et ensuite brancher ce panel dans :

- [BackOffice.tsx](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/src/pages/BackOffice.tsx)

---

## 7. Prochaine etape logique

La suite la plus utile est d'implementer maintenant le squelette frontend du module, en commencant par :

1. le dossier `src/components/backoffice/prospecting/`
2. la table `Packs`
3. la vue `Detail Pack`
4. les boutons relies a [prospecting-admin.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/src/lib/prospecting-admin.ts)

Autrement dit :

- le `contrat TypeScript` est pose
- la `couche service frontend` est posee
- il reste a construire les composants React par-dessus

---

## 8. Recommandation finale

Ne faites pas porter la logique metier directement sur les composants.

Gardez cette separation :

- `types.ts` pour le contrat
- `prospecting-admin.ts` pour les actions backend
- composants React pour l'affichage
- Supabase pour la lecture
- n8n pour l'execution

Cette separation vous donnera un back-office plus stable, plus testable et plus simple a faire evoluer.
