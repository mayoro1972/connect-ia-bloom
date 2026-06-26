# Standard retenu — deck de presentation et mini-catalogue

## Source

Ce standard est extrait du workflow :

- `docs/transferai-admin/62_n8n_Prospection_V3_CRM_final.json`
- `docs/transferai-admin/73_TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed.json`

Il reprend les regles du noeud `Generate Deck Brief`, du noeud `Generate Tailored Catalogue`, ainsi que les meilleurs exemples deja produits dans le repo.

## Decision

Le standard a adopter est le suivant :

- `deck de presentation` : standard editorial issu de `docs/transferai-prospection/Modele_Deck_Standard_Prospection_V3.md`
- `mini-catalogue` : standard editorial issu de `docs/transferai-prospection/Modele_Mini_Catalogue_Formation_Accompagnement_Entreprise_V3.md`

Les references d'execution les plus utiles a conserver sont :

- `deck reference` : `outputs/elton-ci-proposal/output/Proposition_ELTON_CI_ROI_Cas_Usage.pptx`
- `deck sectoriel propre` : `docs/transferai-prospection/decks-sectoriels-commerciaux-2026-06-13/pdf/TransferAI_Deck_Telecommunications.pdf`
- `mini-catalogue reference automation` : `outputs/manual-20260531-context-driven-catalogue/Orange_CI_Mini_Catalogue_Automatise_V3.md`
- `mini-catalogue reference mise en page propre` : `outputs/manual-20260612-telecom-reference-pdf/Mini_Catalogue_TransferAI_Telecommunications_Standard_Clean_2026-06-12.pdf`

## Modele du deck a adopter

Le workflow impose un deck executive de `10 slides`, decisionnel, sobre, cible prospect, avec un seul CTA principal.

### Profils de deck

Le workflow choisit entre deux profils :

- `commercial_enterprise`
- `institutional`

### Structure standard — commercial_enterprise

1. Couverture orientee resultat
2. Identite et credibilite TransferAI
3. Contexte et irritants metier
4. ROI de reference et KPI a instrumenter
5. Cas d'usage prioritaires
6. Detail des deux premiers cas d'usage
7. Standardisation et qualite de service
8. Parcours 90 jours
9. Offre recommandee en 4 briques
10. Confiance et prochaine etape

### Structure standard — institutional

1. Couverture orientee impact et mission
2. Identite et credibilite TransferAI
3. Contexte institutionnel et enjeux de service
4. Resultats attendus et indicateurs de preuve
5. Cas d'usage prioritaires
6. Gouvernance, confidentialite et supervision
7. Renforcement des capacites et conduite du changement
8. Feuille de route 90 jours
9. Dispositif d'accompagnement recommande
10. Confiance et prochaine etape

### Contrat de donnees du deck

Le JSON du noeud `Generate Deck Brief` doit fournir :

- `deck_profile`
- `slide_objective`
- `key_messages`
- `sector_pain_points`
- `recommended_case_study`
- `training_focus`
- `roi_hypothesis`
- `delivery_timeline`
- `sector_variant`
- `single_primary_cta`

### Regles non negociables du deck

- une slide = une conclusion claire
- aucun catalogue generique
- gains formules comme hypotheses ou benchmarks a confirmer
- difference TransferAI visible : formation + accompagnement 90 jours
- cas d'usage relies a des flux metier reels
- ton executif, rassurant, mesurable, sans surpromesse

## Modele du mini-catalogue a adopter

Le workflow impose un mini-catalogue cible, a mi-chemin entre :

- note d'orientation commerciale
- mini-catalogue de formation cible
- support de lecture du deck executive

### Structure standard du mini-catalogue

1. Titre
2. Synthese executive
3. Lecture du contexte du prospect
4. Priorites metier et irritants visibles
5. Cas d'usage et quick wins recommandes
6. Porte d'entree recommandee
7. Parcours recommande
8. Formations prioritaires
9. Livrables attendus
10. Gouvernance, confidentialite et conduite du changement
11. Accompagnement post-formation
12. Accompagnement 90 jours
13. Proposition immediate

### Regles non negociables du mini-catalogue

- document court, cible, sans logique de catalogue de masse
- maximum `6 formations prioritaires` dans le prompt V3 CRM final
- formations regroupees si utile en `3 ou 4 familles metier`
- pour chaque formation : intitule, public concerne, objectifs, prerequis, livrables, format/duree, utilite pour le prospect
- articulation obligatoire avec le deck : cas d'usage, KPI, ROI, feuille de route 90 jours
- bloc gouvernance obligatoire quand le contexte l'exige
- bloc accompagnement post-formation obligatoire
- bloc accompagnement 90 jours obligatoire
- aucun prix, aucun cas client non verifie, aucune surpromesse

## Choix standard recommande

Si l'objectif est d'avoir un standard simple, exploitable et durable, il faut retenir :

- `standard du deck` : la structure de `Modele_Deck_Standard_Prospection_V3.md`
- `exemple deck le plus inspirant` : `Proposition_ELTON_CI_ROI_Cas_Usage.pptx`
- `standard du mini-catalogue` : la structure de `Modele_Mini_Catalogue_Formation_Accompagnement_Entreprise_V3.md`
- `exemple mini-catalogue le plus propre pour l'automatisation` : `Orange_CI_Mini_Catalogue_Automatise_V3.md`
- `exemple mini-catalogue le plus propre pour la mise en page finale` : `Mini_Catalogue_TransferAI_Telecommunications_Standard_Clean_2026-06-12.pdf`

## Recommendation finale

Le meilleur cadrage standard pour la V3 CRM Enhanced est donc :

- `deck standard` = deck executive 10 slides, avec bifurcation `commercial_enterprise` / `institutional`
- `mini-catalogue standard` = mini-catalogue en 13 sections, oriente priorites, cas d'usage, formations, gouvernance et accompagnement 90 jours

Autrement dit :

- le `deck` vend la narration executive et la decision
- le `mini-catalogue` vend la profondeur de l'offre ciblee et la trajectoire d'execution

Les deux doivent rester strictement alignes sur :

- la meme porte d'entree
- les memes cas d'usage
- les memes hypotheses de ROI
- la meme feuille de route 90 jours
- le meme CTA final
