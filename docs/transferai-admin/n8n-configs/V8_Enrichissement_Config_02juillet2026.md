# V8 — Enrichissement Quotidien Base Prospects CI
**ID workflow n8n :** `8nvZg1PDZbrb7INd`  
**Mis à jour :** 02 juillet 2026  
**Déclenchement :** Chaque jour à 6h00 Abidjan (UTC+0)

## Corrections appliquées le 02/07/2026
- Suppression des 2 nœuds `splitInBatches` (bug silencieux : traitement limité au 1er item)
- n8n itère nativement sur chaque item — pas besoin de splitInBatches
- Requêtes doublées : 8 → 28

## Sources de prospection (28 requêtes)
### Google Search — Niches CI (18)
- Secrétariat & Assistanat (2), Banque & Finance (2), PME & Dirigeants (3)
- Santé (2), RH & Formation (2), Marketing (1), Institutions (2)
- Éducation (1), ONG (2), BTP (1)

### abidjan.net — Annuaire entreprises (6)
- Général, Dirigeants, Finance, BTP, Santé, Éducation

### RCCM + Presse CI (4)
- Nouvelles immatriculations, Presse CI (fratmat.info, linfodrome.com)

## Architecture
`Cron 6h` → `Définir 28 Requêtes` → `Serper API` → `GPT-4o-mini` → `Parser` → `Vérifier Doublon` → `IF Nouveau` → `Insérer Supabase` → `Email Rapport`

## Projection
28 requêtes × 10 résultats × ~20% conversion = **40-55 prospects bruts/jour**  
Après déduplication (~35%) = **20-30 nouveaux insérés/jour**
