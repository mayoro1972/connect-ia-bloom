# Inventaire local exporte vers Drive - Cas d'usage TransferAI

Genere le 2026-07-05 a partir d'un scan local du Mac.

## Dossiers scannes

- `/Users/marius_ayoro/Desktop/Mini Catalogue sectoriel`
- `/Users/marius_ayoro/Desktop/Deck_presentation_sectoriel/PDF`
- `/Users/marius_ayoro/Desktop/Deck_presentation_sectoriel/PPTX`
- `/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom`
- `/Users/marius_ayoro/Downloads`

## Corpus local principal retenu pour export

### Mini catalogues sectoriels PDF

- 16 fichiers identifies
- source principale : `/Users/marius_ayoro/Desktop/Mini Catalogue sectoriel`

### Decks sectoriels PDF

- 21 fichiers identifies
- source principale : `/Users/marius_ayoro/Desktop/Deck_presentation_sectoriel/PDF`

### Decks sectoriels PPTX

- 21 fichiers identifies
- source principale : `/Users/marius_ayoro/Desktop/Deck_presentation_sectoriel/PPTX`

## Logique de rangement Drive

- racine cible : `Base documentaire RAG/TransferAI/Cas_d_usage`
- 1 dossier par secteur ou variante sectorielle
- conservation des variantes locales quand elles portent une nuance metier reelle :
  - `Banque_Services_Financiers`
  - `Fintech_Mobile_Money`
  - `Ressources_Humaines_Recrutement`
  - `Sante_Protection_Sociale`
  - `Energie_Petrole_Gaz`

## Remarque

Le scan a aussi retrouve des fichiers de workflow, de prospection et de detection automatique de secteurs dans `Downloads` et dans le depot GitHub. Ils documentent la logique de routage des cas d'usage, mais le present export priorise les artefacts metier les plus directement exploitables pour le RAG : mini catalogues et decks sectoriels.
