# Guide de troubleshooting de référence

**Workflow :** TransferAI Prospecting V3 CRM Enhanced [FINAL]

**Date de mise à jour :** 2 juin 2026

**Objet :** référentiel consolidé de diagnostic et de correction après les incidents réels rencontrés jusqu’à la stabilisation de la V3 avec catalogue généré par pack, deck PPTX généré par service backend, validation interne et envoi prospect.

## 1. Principe general de diagnostic

Le point le plus important est de debugger la branche d approbation via **Executions** dans n8n. Quand un utilisateur clique sur **Approuver et envoyer**, cela declenche une nouvelle execution via webhook. Les noeuds ouverts dans l editeur peuvent afficher *No input data* alors que le webhook a bel et bien tourne.

## 2. Check-list de controle dans l ordre

1. **Parse Approval Query** : verifier que `decision = approved`.
2. **Get Pack From Supabase** : verifier que le pack est bien retrouve.
3. **Extract Pack Payload** : vérifier la présence de la lettre, du catalogue rendu, du deck rendu et des pièces jointes finales.
4. **If Approved** : verifier que la branche `true` est prise.
5. **Build Send Context** : vérifier `attachments_count = 2`, la présence d’un `.pdf` et d’un `.pptx`, puis `can_send = true`.
6. **If Ready To Send** : verifier que la branche `true` est prise.
7. **Send External Prospect Email** : verifier la reponse Resend.

## 3. Incidents rencontres et correctifs appliques

- **Deux courriers differents selon les tests** : cause = d anciens packs etaient encore stockes dans Supabase ; correctif = regenerer un nouveau pack et n approuver que le dernier email interne.
- **Ancien lien Calendly dans le courrier** : cause = ancienne version du prompt dans Generate Executive Letter ; correctif = remplacement par `https://calendly.com/contact-transferai/30min`.
- **Send External Prospect Email renvoie 422 Missing html or text field** : cause = le noeud lisait la mauvaise source ; correctif = forcer le jsonBody a relire explicitement la sortie de Build Send Context.
- **If Ready To Send ne laissait pas passer l envoi** : cause = noeud non configure ; correctif = condition booleenne sur `{{$json.can_send}}` egale a `true`.
- **Store Pack In Supabase casse avec des erreurs de colonnes manquantes** : cause = schema Supabase plus minimal ; correctif = reduire le jsonBody aux colonnes minimales et laisser le reste dans `payload`.
- **Build Approval Email casse avec acces aux variables d environnement** : cause = le Code node n avait pas acces a `$env` ; correctif = utiliser une URL en dur puis revenir a une version stable sans override Gmail dans le flux normal.
- **Le mail prospect n arrivait pas sur la bonne boite** : cause = le pack stockait encore `contact@transferai.ci` ; correctif = affichage de la cible reelle, suppression progressive du Gmail de test et verification de `target_email` dans Build Send Context.
- **Pieces jointes locales impossibles a lire** : cause = tentative de lecture de fichiers Mac ou de `fs` dans un n8n distant ; correctif = abandon du montage disque local et bascule vers service backend + storage public.
- **Le formulaire d audit restait en piece jointe** : cause = ancien fallback dans Build Send Context ; correctif = suppression du bloc `tailored_audit_form` en attachment et maintien du formulaire uniquement en ligne via lien web.
- **Le catalogue restait statique et issu du site** : cause = ancien flux `Resolve Domain Catalogue -> Download Catalogue PDF` ; correctif = ajout de `Build Catalogue Render Payload`, `catalogue-renderer`, `Merge Catalogue Artifact` et stockage des artefacts PDF/DOCX par `pack_id`.
- **Render Catalogue Artifact renvoie 404 NOT_FOUND** : cause = fonction Supabase non deployee ; correctif = deploy de `catalogue-renderer` sur le projet `wlhznciwuofueffyoflo`.
- **Render Catalogue Artifact renvoie 401 unauthorized** : cause = mismatch d auth entre la nouvelle fonction et les autres fonctions admin ; correctif = aligner `catalogue-renderer` sur le schema `x-admin-token` / `CONTENT_ADMIN_TOKEN` deja utilise par le back-office.
- **Le deck etait genere mais jamais envoye** : cause = `Build Send Context` n acceptait que les pieces jointes avec `filename + content`, alors que `deck-renderer` renvoie `filename + path` ; correctif = normaliser les attachments avec `content` ou `path`.
- **Le flux stockait encore un fallback JSON de deck** : cause = ancien fonctionnement transitoire autour de `Deck_Brief_[Prospect].json` ; correctif = insertion de `Build Deck Render Payload`, `Render Deck Artifact` et `Merge Deck Artifact`, puis suppression du fallback dans `Build Send Context`.
- **Le pack etait stocke sans le deck final** : cause = `Store Pack In Supabase` recevait encore la sortie de `Merge Catalogue Artifact` ; correctif = rebrancher le stockage sur la sortie de `Merge Deck Artifact`.
- **Render Deck Artifact renvoyait `deck_render_failed` avec `Cannot read properties of undefined (reading 'rect')`** : cause = bug du backend `deck-renderer` dans la construction des formes PPTX ; correctif = corriger la fonction Supabase puis la redéployer avant de relancer le noeud.
- **L email interne affichait encore `Pièces jointes préparées : 1` apres correction du deck** : cause = ancien pack stocke ou relance incomplete ; correctif = réexécuter dans l ordre `Merge Deck Artifact -> Store Pack In Supabase -> Build Approval Email -> Send Internal Approval Email`, puis n approuver que le dernier email interne.
- **Le deck etait généré mais restait visuellement peu premium** : cause = blocs trop longs, CTA trop verboses et densité excessive sur certaines zones droites ; correctif = compacter les textes dans le renderer, réduire les blocs de fermeture et répartir les cas d’usage sur une slide supplémentaire si nécessaire.
- **Les accents français n apparaissaient pas partout dans le deck** : cause = prompts et libellés statiques encore partiellement non accentués ; correctif = corriger les prompts LLM, nettoyer les placeholders et redéployer le renderer avec des libellés FR accentués.
- **Le deck Orange n héritait pas du bon niveau de personnalisation premium** : cause = fallback sectoriel trop générique ; correctif = enrichir le fallback Orange dans le renderer pour reprendre un message, des cas d’usage et une trajectoire plus fidèles au contexte Orange.
- **Les slides 4 et 8 devenaient illisibles** : cause = saturation de la colonne droite et encombrement de la slide de clôture ; correctif = raccourcir les blocs, limiter le nombre de lignes et réduire la taille des CTA et signatures dans le renderer.
- **Le résumé interne montrait `Cas d usage : a confirmer` ou `Tier : n/a` alors que le pack etait exploitable** : cause = fallbacks insuffisants dans `Build Approval Email` ; correctif = relire d abord `best_selling_use_case`, puis `recommended_use_case`, puis `entry_point_niche`, et utiliser `commercial_priority_default` si le tier n est pas encore fourni par l analyse.
- **Bucket rendu public mais aucune URL visible** : cause = confusion normale Supabase ; correctif = comprendre que l URL publique apparait seulement pour les objets uploades, et qu elle est retournee directement par la fonction renderer.
- **Store Pack In Supabase renvoyait une erreur de doublon pack_id** : cause = insertion simple sur une ligne deja existante ; correctif = passer le noeud en upsert avec `?on_conflict=pack_id` et le header `Prefer: resolution=merge-duplicates,return=representation`.
- **Le renderer generait un PDF sans personnalisation** : cause = ancien run ou payload stale, avec `tailored_catalogue_markdown` vide ; correctif = verifier la propagation `Generate Tailored Catalogue -> Assemble Prospect Pack -> Build Catalogue Render Payload` puis reexecuter le renderer. Etat final valide : `used_tailored_markdown = true`.
- **Send Internal Sent Confirmation casse avec JSON invalide** : cause = jsonBody mal forme ; correctif = reconstruire un JSON strict et simple avec `from`, `to`, `subject` et `html`.

## 4. Valeurs de reference aujourd hui

**Lien de RDV valide :** `https://calendly.com/contact-transferai/30min`

**Sender de test encore utilise :** `onboarding@resend.dev`

**Destinataire de test courant :** `marius.ayoro70@gmail.com`

**Pièces jointes attendues aujourd’hui :** 2 fichiers par pack, soit 1 catalogue PDF généré et 1 deck PPTX généré

**Fonction catalogue :** `https://wlhznciwuofueffyoflo.supabase.co/functions/v1/catalogue-renderer`

**Fonction deck :** `https://wlhznciwuofueffyoflo.supabase.co/functions/v1/deck-renderer`

**Bucket public :** `prospecting-artifacts`

**Header renderer valide :** `x-admin-token: CONTENT_ADMIN_TOKEN`

## 5. Diagnostic rapide par symptome

### 5.1 L email interne de validation arrive, mais pas l email prospect

1. Verifier la derniere execution du webhook dans Executions.
2. Verifier que `If Ready To Send` est vrai.
3. Verifier la reponse de `Send External Prospect Email`.
4. Verifier que la cible effective est bien celle attendue.

### 5.2 Le noeud affiche No input data

C est normal si tu regardes le noeud hors execution. Ouvrir la derniere execution du webhook au lieu de l editeur seul.

### 5.3 Le prospect recoit le mauvais courrier

1. Verifier que le bon noeud **Generate Executive Letter** a ete mis a jour.
2. Verifier que le dernier pack seulement a ete approuve.
3. Verifier qu un ancien lien d approbation n a pas ete reutilise.

### 5.4 Les pieces jointes ne partent pas

1. Vérifier dans **Build Send Context** que `attachments_count = 2`.
2. Vérifier que les deux fichiers sont bien un `.pdf` et un `.pptx`.
3. Vérifier que chaque fichier a un `filename` et soit un `content`, soit un `path`.
4. Verifier le jsonBody de **Send External Prospect Email**.

### 5.5 Le deck est genere, mais l email interne reste a 1 piece jointe

1. Verifier que **Render Deck Artifact** retourne bien `success = true`.
2. Verifier que **Merge Deck Artifact** retourne `attachments_count = 2`.
3. Relancer ensuite **Store Pack In Supabase**.
4. Relancer **Build Approval Email** puis **Send Internal Approval Email**.
5. Confirmer que le dernier email interne affiche `Pièces jointes préparées : 2` avant de cliquer sur l approbation.

### 5.6 Le deck est généré, mais il reste peu lisible ou trop dense

1. Vérifier le dernier fichier `.pptx` réellement régénéré, et non une ancienne version exportée.
2. Contrôler en priorité la couverture, la slide des enjeux, la slide ROI et la slide de clôture, car ce sont les zones les plus sensibles au chevauchement.
3. Vérifier dans le renderer que les CTA, les signatures et les listes sont bien compactés.
4. Si le prospect contient trop de cas d’usage, vérifier que le deck répartit automatiquement ces cas sur deux slides au lieu de les comprimer sur une seule.
5. Après correction de la source, redéployer `deck-renderer` puis relancer `Render Deck Artifact`.

### 5.7 Les accents français ne s affichent pas dans le deck ou le mini-catalogue

1. Vérifier que les prompts des nœuds **Generate Executive Letter**, **Generate Tailored Catalogue**, **Generate Tailored Audit Form** et **Generate Deck Brief** demandent explicitement un français professionnel avec accents.
2. Vérifier que le renderer deck et le renderer catalogue ont bien été redéployés après correction.
3. Vérifier que le prospect est bien détecté comme francophone via `prospect_language` ou via la logique de fallback.
4. Régénérer les artefacts au lieu d’utiliser une ancienne sortie déjà téléchargée.

### 5.8 Render Deck Artifact renvoie 404

1. Vérifier que la fonction `deck-renderer` est bien déployée.
2. Vérifier l’URL exacte de la fonction.
3. Vérifier que le projet Supabase cible est bien `wlhznciwuofueffyoflo`.

### 5.9 Render Deck Artifact renvoie 401 unauthorized

1. Vérifier que le nœud utilise `Authentication = None`.
2. Vérifier que le header actif est bien `x-admin-token`.
3. Vérifier que la valeur utilisée correspond bien au secret `CONTENT_ADMIN_TOKEN`.
4. Vérifier qu’aucun ancien header `Authorization: Bearer ...` n’est encore présent sur le nœud.

### 5.10 Render Catalogue Artifact renvoie 404

1. Verifier que la fonction `catalogue-renderer` est bien deployee.
2. Verifier l URL exacte de la fonction.
3. Verifier que le projet Supabase cible est bien `wlhznciwuofueffyoflo`.

### 5.11 Render Catalogue Artifact renvoie 401 unauthorized

1. Verifier que le noeud utilise `Authentication = None`.
2. Verifier que le header actif est bien `x-admin-token` et qu aucun vieux header `Authorization: Bearer ...` ne parasite le noeud.
3. Verifier que la valeur utilisee est bien le secret `CONTENT_ADMIN_TOKEN` du projet.
4. Verifier que le secret a ete redeploye / pris en compte cote fonction Supabase.

### 5.12 Le bucket est public mais l URL ne se voit pas dans Supabase

C est normal. Le bucket public ne fournit pas une page publique par lui-meme. L URL utile est celle de chaque objet uploade, par exemple :

`https://wlhznciwuofueffyoflo.supabase.co/storage/v1/object/public/prospecting-artifacts/prospecting-packs/<pack_id>/Mini_Catalogue_TransferAI_....pdf`

Cette URL est renvoyee directement par `catalogue-renderer`.

### 5.13 Render Catalogue Artifact reussit mais diagnostics.used_tailored_markdown vaut false

1. Verifier dans **Generate Tailored Catalogue** que `choices[0].message.content` contient bien du texte.
2. Verifier dans **Assemble Prospect Pack** que `tailored_catalogue` est bien rempli.
3. Verifier dans **Build Catalogue Render Payload** que `catalogue_render_payload.tailored_catalogue_markdown` contient ce texte.
4. Relancer **Render Catalogue Artifact** avec **Execute previous nodes** pour eviter un ancien run stale.
5. Etat final attendu : `used_tailored_markdown = true`.

### 5.14 Build Send Context retourne can_send = false

1. Vérifier que `payload.catalogue_artifact.pdf_url` est présent.
2. Vérifier que `payload.deck_artifact.pptx_url` est présent.
3. Vérifier que `payload.mail_attachments` contient exactement deux entrées finales.
4. Vérifier que le code du nœud accepte les attachments avec `content` ou `path`.
5. Vérifier qu’aucun fallback `Deck_Brief_[Prospect].json` n’a été réintroduit.

### 5.15 Store Pack In Supabase renvoie duplicate key value violates unique constraint ai_prospecting_packs_pack_id_key

1. Verifier que l URL contient bien `?on_conflict=pack_id`.
2. Verifier qu un seul header `Prefer` est present.
3. Verifier que sa valeur est exactement `resolution=merge-duplicates,return=representation`.
4. Relancer le noeud et verifier que la ligne est mise a jour au lieu d etre re-inseree.

## 6. Cles, secrets et headers de reference

| Element | Usage | Statut recommande |
| --- | --- | --- |
| `CONTENT_ADMIN_TOKEN` | Header `x-admin-token` pour `catalogue-renderer`, `deck-renderer` et fonctions back-office | À conserver ; token prioritaire pour n8n |
| `SUPABASE_SERVICE_ROLE_KEY` | Execution server-side / secours backend | A conserver cote backend uniquement ; ne pas privilegier dans n8n si `x-admin-token` est disponible |
| `SUPABASE_URL` | URL du projet Supabase | A conserver |
| `RESEND_API_KEY` | Envoi email via Resend | A conserver |
| `MAIL_FROM` / sender | Adresse d envoi | Remplacer `onboarding@resend.dev` par `noreply@transferai.ci` apres verification domaine |
| Header `Authorization: Bearer ...` dans `Render Catalogue Artifact` | Ancien montage renderer | A supprimer ou laisser vide ; le schema stable valide est maintenant `x-admin-token` |
| Gmail de test force | Validation temporaire | A retirer avant production |
| Ancienne logique audit attache | Legacy V3 | A laisser supprimee ; audit uniquement en ligne |
| Ancien PDF catalogue statique `transferai.ci/catalogues-domaines-assets/...` | Fallback de transition | Deja remplace dans la chaine cible ; ne pas le remettre en production |

## 7. Noeuds sensibles a verifier en priorite

- **Generate Executive Letter**
- **Generate Tailored Catalogue**
- **Generate Tailored Audit Form**
- **Generate Deck Brief**
- **Assemble Prospect Pack**
- **Resolve Domain Catalogue**
- **Build Catalogue Render Payload**
- **Render Catalogue Artifact**
- **Build Deck Render Payload**
- **Render Deck Artifact**
- **Merge Deck Artifact**
- **Store Pack In Supabase**
- **Extract Pack Payload**
- **Build Send Context**
- **If Ready To Send**
- **Send External Prospect Email**
- **Send Internal Sent Confirmation**

## 8. Prochaines corrections a finaliser

| Tache | Priorite |
| --- | --- |
| Rendre le formulaire d audit réellement dynamique via `pack_id` | Urgent |
| Valider le rendu `.pptx` premium sur plusieurs profils, secteurs et langues, avec revue visuelle systématique des zones denses | Urgent |
| Verifier le domaine `transferai.ci` dans Resend | Important |
| Changer le sender vers `noreply@transferai.ci` | Important |
| Retirer la cible Gmail de test et revenir au prospect reel | Important |
| Tester francais, anglais et espagnol sur des prospects differents | Normal |

## 9. Conclusion

Le circuit d envoi prospect apres approbation est maintenant valide en mode test avec catalogue genere par pack, rendu DOCX/PDF via fonction Supabase, deck PPTX premium via `deck-renderer` et stockage public dans `prospecting-artifacts`. Les erreurs majeures ont ete identifiees, reproduites et corrigees. La suite consiste a fiabiliser l environnement de production, finaliser l audit web dynamique par `pack_id`, maintenir la qualité visuelle premium du deck sur plusieurs secteurs et verrouiller l envoi depuis le domaine TransferAI.

Guide de troubleshooting de reference mis a jour apres resolution du rendu catalogue dynamique, du deck PPTX premium, de l auth renderer via `x-admin-token`, de l upsert Supabase et de la stabilisation de la V3.
