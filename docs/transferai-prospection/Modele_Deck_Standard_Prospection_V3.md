# Modele Standard Deck Prospection V3

## Objectif

Ce modele sert de standard PowerPoint pour la sortie du noeud `Generate Deck Brief`.
Il est derive :

- du prompt JSON retourne par `Generate Deck Brief`
- du deck PDF de reference ELTON CI
- de la logique commerciale TransferAI : audit, cadrage, formation, gouvernance, pilote

Le standard doit produire un deck de **10 slides**, editorial, decisionnel, visuellement propre, utilisable pour un DG, un responsable de pole ou un sponsor projet.

## Ce que le PDF ELTON ajoute en termes de polish

Le PDF `Proposition_ELTON_CI_ROI_Cas_Usage.pdf` montre un niveau de finition superieur au premier standard.
Les points de polish a conserver sont :

- couverture claim-first avec promesse, benchmarks et clause de prudence
- slide identite TransferAI / Nettelecom CI tres claire
- logique `AVANT / APRES` pour rendre les gains visibles sans surpromesse
- slide ROI de reference avec KPI a instrumenter
- une slide cas d'usage prioritaires, puis deux slides detail cas d'usage
- parcours `J+0 / J+15 / J+45 / J+90`
- slide offre recommandee structuree en 4 briques
- slide finale combinee `Confiance + Prochaine etape`
- francais standard avec accents, ton executif, sans langage faible ni slogans vagues

## Champs attendus depuis `Generate Deck Brief`

Le noeud doit retourner un JSON avec :

- `slide_objective`
- `key_messages`
- `sector_pain_points`
- `recommended_case_study`
- `training_focus`
- `roi_hypothesis`
- `delivery_timeline`
- `sector_variant`
- `single_primary_cta`

## Regles de construction

- Une slide = une conclusion claire.
- Pas de catalogue generique.
- Le deck vend une demarche, pas seulement des formations.
- Le deck doit montrer clairement que la valeur TransferAI ne s'arrete pas a la formation, mais se prolonge par un accompagnement 90 jours.
- Le CTA est unique et reste visible dans la narration.
- Les chiffres sont formules comme hypotheses, benchmarks ou referentiels tant que l'audit n'est pas fait.
- Le contenu doit relier audit, formation, gouvernance et premier terrain d'execution.
- Le ton doit etre executif, rassurant, mesurable et sobre.
- Le texte doit etre en francais standard avec accents si la langue du prospect est le francais.
- Si la langue du prospect est l'anglais ou l'espagnol, le deck entier doit etre adapte dans cette langue, sans melange.

## Deux variantes a brancher dans le workflow

Le workflow doit maintenant choisir entre **2 profils de deck** :

- `commercial_enterprise`
- `institutional`

### Quand utiliser `commercial_enterprise`

Pour :

- entreprises privees
- PME et ETI
- groupes industriels
- telecoms
- retail et distribution
- energie et operations
- services B2B ou B2C

Logique dominante :

- performance metier
- gains rapides
- ROI visible
- acceleration commerciale
- pilotage operationnel

### Quand utiliser `institutional`

Pour :

- institutions publiques
- ministeres, agences, collectivites, structures parapubliques
- banques, assurances, IMF et institutions financieres
- ONG, fondations, bailleurs
- organisations internationales et multilaterales

Logique dominante :

- qualite de service
- gouvernance
- conformite
- supervision
- renforcement des capacites
- feuille de route credible et maitrisee

## Structure recommandee par profil

### Variante 1 - Deck commercial entreprise

1. Couverture orientee resultat
2. Credibilite TransferAI
3. Priorites metier du prospect
4. ROI de reference et KPI
5. Cas d'usage prioritaires
6. Detail des deux premiers terrains
7. Standardisation et qualite de service
8. Parcours 90 jours
9. Offre recommandee
10. Confiance et prochaine etape

### Variante 2 - Deck institutionnel

1. Couverture orientee impact et mission
2. Credibilite TransferAI et cadre d'intervention
3. Contexte institutionnel et enjeux de service
4. Resultats attendus et indicateurs de preuve
5. Cas d'usage prioritaires
6. Gouvernance, confidentialite et supervision
7. Renforcement des capacites et conduite du changement
8. Feuille de route 90 jours
9. Dispositif d'accompagnement recommande
10. Confiance et prochaine etape

## Signaux de ton a respecter

### Pour `commercial_enterprise`

- ton plus direct
- vocabulaire de pilotage, flux, productivite, delai, arbitrage, recouvrement, portefeuille, operations
- accent sur gains visibles, execution, mesure, pilote

### Pour `institutional`

- ton plus sobre et plus institutionnel
- vocabulaire de mission, usager, service, gouvernance, confidentialite, conformite, capacitation, feuille de route, cadre de supervision
- accent sur adoption, fiabilite, coordination, qualite de service, maitrise du risque

## Structure standard recommandee

### Slide 1 - Couverture orientee resultat

- Titre : transformer l'IA en gains visibles pour `{{ORGANIZATION_NAME}}`
- Sous-titre : proposition ciblee, executive et metier
- Preuve : promesse, 3 ou 4 indicateurs d'entree, CTA principal
- Bloc utile : note de prudence sur les benchmarks ou ROI de reference
- Source JSON : `slide_objective`, `single_primary_cta`, `roi_hypothesis`

### Slide 2 - Qui sommes-nous

- Titre : TransferAI, hub IA operationnel de Nettelecom CI
- Preuve : ancrage local, 13 experts, secteurs couverts, logique d'execution, cadre entreprise
- Message : interlocuteur structure, pas simple catalogue
- Source JSON : `key_messages`

### Slide 3 - Pourquoi cette proposition est adaptee au contexte

- Titre : pourquoi cette proposition est adaptee au contexte de l'organisation
- Preuve : 3 ou 4 flux metier avec logique `AVANT / APRES`
- Message : partir des flux qui freinent deja l'execution
- Source JSON : `sector_pain_points`, `key_messages`

### Slide 4 - ROI de reference

- Titre : le ROI devient utile seulement s'il est traduit dans le contexte du prospect
- Preuve : quelques benchmarks prudents + KPI a instrumenter
- Message : TransferAI ne promet pas des chiffres abstraits, il propose une mesure
- Source JSON : `roi_hypothesis`, `sector_pain_points`

### Slide 5 - Cas d'usage prioritaires

- Titre : les 3 ou 4 cas d'usage a mettre au centre de la proposition
- Preuve : format `AVANT / APRES` par cas d'usage
- Message : il faut prioriser les usages les plus vendables et les plus visibles
- Source JSON : `recommended_case_study`, `sector_pain_points`

### Slide 6 - Detail des deux premiers terrains

- Titre : les deux premiers terrains a lancer rapidement
- Preuve : deux flux prioritaires avec `AVANT / APRES / KPI`
- Message : rendre la premiere valeur visible pour la direction
- Source JSON : `recommended_case_study`, `roi_hypothesis`

### Slide 7 - Usages qui renforcent service et standardisation

- Titre : les usages qui renforcent la qualite de service et la standardisation
- Preuve : deux cas d'usage secondaires avec usages proposes et KPI
- Message : la formation gagne en credibilite quand elle prepare des gestes metier reels
- Source JSON : `recommended_case_study`, `training_focus`

### Slide 8 - Parcours 90 jours

- Titre : la sequence recommandee pour passer du cadrage au pilote
- Preuve : `J+0 / J+15 / J+45 / J+90`
- Message : vendre l'ordre des etapes, avec validation a chaque palier et accompagnement post-formation visible
- Source JSON : `delivery_timeline`, `single_primary_cta`

### Slide 9 - Offre recommandee

- Titre : la proposition TransferAI pour `{{ORGANIZATION_NAME}}`
- Preuve : 4 briques d'offre
- Message : la valeur vient de l'enchainement entre diagnostic, formation, accompagnement 90 jours, gouvernance et pilote
- Source JSON : `training_focus`, `key_messages`

### Slide 10 - Confiance et prochaine etape

- Titre : proposer un pilote utile, gouverne et mesurable
- Preuve : cadre de confiance + CTA + sortie attendue du rendez-vous + rappel de l'accompagnement 90 jours
- Message : une IA utile, maitrisee et compatible avec les exigences de l'organisation
- Source JSON : `single_primary_cta`, `slide_objective`, `roi_hypothesis`

## Message cle a imposer sur l'accompagnement

Le deck doit permettre de comprendre en une lecture une difference simple :

- une structure de formation classique transmet un contenu ;
- TransferAI forme, puis accompagne pendant 90 jours la mise en pratique, la gouvernance, la lecture des premiers KPI et la decision d'extension.

Cette logique doit apparaitre au minimum :

- dans le parcours 90 jours ;
- dans la slide offre recommandee ;
- dans la slide finale de prochaine etape.

## Micro-style a reproduire

- Titres sous forme de conclusion, jamais de libelle vague.
- Sous-titres courts, utiles, sans remplissage.
- Bullets limites et orientes action.
- Encadres `Important` pour les clauses de prudence.
- Mentions `AVANT / APRES` pour rendre les gains concrets.
- KPI visibles quand on parle de ROI.
- Footer discret avec marque et numero de slide.
- Une seule couleur accent principale par idee de slide.

## Politique de langue

### Francais

- Toujours en francais standard avec accents.
- Pas de franglais inutile.
- Pas de formulations faibles du type `nous pensons peut-etre`.
- Si une hypothese n'est pas certaine, l'ecrire clairement comme hypothese.

### Anglais

- Standard business English.
- Concise executive tone.
- Keep the same slide architecture, but adapt idioms, proof labels and CTA naturally.
- Avoid literal translation from French when it sounds stiff.

### Espagnol

- Espanol profesional estandar con acentos.
- Tono ejecutivo, claro y sobrio.
- Mantener la misma arquitectura de deck, pero adaptar conectores, CTA y formulacion de ROI de manera natural.

## Prompt ameliore pour `Generate Deck Brief`

Le prompt ci-dessous remplace le prompt systeme du noeud `Generate Deck Brief` et route automatiquement vers la bonne variante.

```text
Retourne uniquement un JSON valide avec les clés suivantes :
deck_profile, slide_objective, key_messages, sector_pain_points, recommended_case_study, training_focus, roi_hypothesis, delivery_timeline, sector_variant, single_primary_cta.

Tu produis le brief d'un deck PowerPoint executive TransferAI, taillé sur mesure pour un prospect.

IDENTITE TRANSFERAI :
TransferAI est la branche IA de NettelecomCI en Côte d'Ivoire.
Le hub s'appuie sur 13 experts ivoiriens basés en Côte d'Ivoire, au Royaume-Uni, aux États-Unis et en Inde.
TransferAI ne vend pas seulement des outils : il relie audit, cadrage, formation, gouvernance et premier pilote métier.

OBJECTIF DU DECK :
Construire un deck de 10 slides, très propre, décisionnel, executive, qui aide un DG, un secrétaire général, un sponsor projet ou un décideur institutionnel à comprendre :
1. pourquoi l'offre est adaptée à son contexte,
2. quels usages métier sont les plus utiles,
3. quels KPI pourraient être suivis,
4. quelle séquence de déploiement est recommandée,
5. quelle prochaine étape simple doit être proposée.

REGLE DE ROUTAGE :
Choisis d'abord `deck_profile`.
- Utilise `commercial_enterprise` pour les entreprises privées et les contextes où le langage dominant doit être business, performance, ROI, gains rapides et pilotage opérationnel.
- Utilise `institutional` pour les institutions publiques, les structures parapubliques, les banques, assurances, institutions financières, ONG, bailleurs, fondations et organisations internationales, avec un langage dominant de mission, qualité de service, gouvernance, conformité, supervision et renforcement des capacités.
- Le type d'organisation, le secteur, les signaux métier visibles et la nature des irritants doivent guider ce choix.

REGLES DE FOND :
1. Le deck ne doit jamais ressembler à un catalogue générique.
2. Chaque slide doit porter une conclusion claire.
3. Si `deck_profile = commercial_enterprise`, le deck doit suivre cette logique :
   - couverture orientée résultat,
   - identité / crédibilité TransferAI,
   - contexte et irritants métier,
   - ROI de référence et KPI,
   - cas d'usage prioritaires,
   - détail des deux premiers cas d'usage,
   - cas d'usage de standardisation / qualité de service,
   - parcours 90 jours,
   - offre recommandée en 4 briques,
   - confiance + prochaine étape.
4. Si `deck_profile = institutional`, le deck doit suivre cette logique :
   - couverture orientée impact et mission,
   - identité / crédibilité TransferAI,
   - contexte institutionnel et enjeux de service,
   - résultats attendus et indicateurs de preuve,
   - cas d'usage prioritaires,
   - gouvernance, confidentialité et supervision,
   - renforcement des capacités et conduite du changement,
   - feuille de route 90 jours,
   - dispositif d'accompagnement recommandé,
   - confiance + prochaine étape.
4. Quand tu parles de ROI, de gains, de productivité ou de délais, formule cela comme benchmark, hypothèse ou référentiel à confirmer pendant l'audit.
5. Les cas d'usage doivent être crédibles, visibles et reliés à des flux métier réels.
6. Le CTA doit être unique, simple et cohérent avec la stratégie commerciale.
7. Utilise les tokens {{ORGANIZATION_NAME}}, {{DECISION_MAKER_NAME}} et {{WEBSITE}} au lieu des identifiants réels.

REGLES DE LANGUE :
1. Si le contexte indique une langue française, rédige tout en français standard avec accents.
2. Si le contexte indique une langue anglaise, rédige tout en anglais professionnel standard.
3. Si le contexte indique une langue espagnole, rédige tout en espagnol professionnel standard avec accents.
4. Ne mélange jamais plusieurs langues dans une même sortie.
5. Adapte naturellement les titres, CTA, formulations ROI et transitions à la langue du prospect.

FORMAT ATTENDU :
- deck_profile : `commercial_enterprise` ou `institutional`
- slide_objective : une phrase forte de couverture
- key_messages : tableau de 4 à 6 messages clés exécutifs
- sector_pain_points : tableau de 3 à 5 irritants métier concrets
- recommended_case_study : tableau de 3 à 4 cas d'usage prioritaires avec une logique avant/après
- training_focus : tableau de 4 à 8 axes de formation réellement utiles pour ce prospect
- roi_hypothesis : tableau de 3 à 5 hypothèses de gains ou KPI à instrumenter
- delivery_timeline : tableau de 4 étapes maximum, au format audit -> premier livrable -> formation/pilote -> mesure/extension
- sector_variant : variante métier courte et claire
- single_primary_cta : un seul appel à l'action principal

N'ajoute aucun commentaire hors JSON.
```

## Decision table simple a utiliser dans le workflow

- `organization_type` contient `ministère`, `agence`, `public`, `mairie`, `collectivité`, `banque`, `assurance`, `microfinance`, `fondation`, `ONG`, `ONU`, `international`, `development`, `institution` :
  choisir `institutional`
- `sector_guess` contient `banque`, `finance`, `assurance`, `secteur public`, `administration`, `ONG`, `organisation internationale` :
  choisir `institutional`
- sinon :
  choisir `commercial_enterprise`

## Variante plus stricte par langue

### Pour un prospect francophone

Ajout utile dans le system prompt :

```text
Rédige exclusivement en français standard avec accents. Utilise un ton exécutif, sobre, précis et crédible. Évite les slogans, le franglais inutile et les formulations bancales.
```

### Pour un prospect anglophone

Ajout utile dans le system prompt :

```text
Write exclusively in standard business English. Use an executive, clear and credible tone. Avoid literal French-style phrasing, generic marketing filler and exaggerated claims.
```

### Pour un prospect hispanophone

Ajout utile dans le system prompt :

```text
Redacta exclusivamente en español profesional estándar con acentos. Usa un tono ejecutivo, claro y creíble. Evita traducciones literales, frases promocionales vacías y afirmaciones exageradas.
```

## Modele ELTON comme reference

Le deck ELTON deja produit reste la meilleure reference narrative actuelle pour ce standard.

- PDF de reference : `/Users/marius_ayoro/Downloads/Proposition_ELTON_CI_ROI_Cas_Usage.pdf`
- Deck PPTX : `/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/outputs/elton-ci-proposal/output/Proposition_ELTON_CI_ROI_Cas_Usage_corrigee.pptx`
- Previews PNG : `/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/outputs/elton-ci-proposal/build/preview-corrected/`
- Contact sheet : `/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/outputs/elton-ci-proposal/build/contact-sheet-v3.png`

## Sortie attendue du workflow

Le workflow doit produire a terme :

- un `deck_brief` JSON propre
- un deck PowerPoint de 10 slides
- un preview PNG slide par slide
- un contact sheet de validation rapide
