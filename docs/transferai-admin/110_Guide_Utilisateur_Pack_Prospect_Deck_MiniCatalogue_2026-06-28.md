# Guide Utilisateur — Pack Prospect Complet : Deck + Mini-Catalogue PDF
**Session du 28 juin 2026 — TransferAI Africa**

---

## Objectif

Ce guide couvre la génération automatique du **pack prospect complet** envoyé à chaque entreprise ciblée via le pipeline V3. Le pack contient désormais trois livrables :

| Livrable | Format | Générateur |
|---|---|---|
| Lettre exécutive personnalisée | HTML inline (email) | GPT + n8n (existant) |
| Mini-catalogue formations ciblées | PDF natif | `mini_catalogue_cli.py` + ReportLab |
| Deck de présentation TransferAI | PPTX + PDF | `deck_generator_cli.py` + python-pptx |

---

## 1. Architecture des scripts

```
scripts/
├── generate_mini_catalogue_pdf.py   ← moteur PDF ReportLab (importé par CLI)
├── mini_catalogue_cli.py            ← CLI n8n → génère PDF → upload Supabase
├── deck_template_transferai.py      ← template de référence deck (édition manuelle)
├── deck_generator_cli.py            ← CLI n8n → génère PPTX+PDF → upload Supabase
└── polish_deck_orange_ci.py         ← deck spécifique Orange CI (référence visuelle)
```

---

## 2. Mini-catalogue PDF (`mini_catalogue_cli.py`)

### Ce qu'il génère

Un PDF **4 à 6 pages**, personnalisé par prospect, construit à partir des données du pré-audit :

- **Page 1 — Couverture** : fond bleu foncé pleine page, nom du prospect en orange, 3 enjeux identifiés
- **Section 00** : introduction personnalisée (pourquoi ce document vous est adressé)
- **Section 01** : enjeux détectés lors du pré-audit (carte par enjeu avec constat + signaux)
- **Section 02** : 3 formations prioritaires (avant/après, objectifs, livrables, gain attendu)
- **Section 03** : livrables globaux remis à l'issue du dispositif
- **Section 04** : parcours 90 jours (J+0 / J+15 / J+45 / J+90)
- **Section 05** : prochaine étape (lien Calendly + formulaire audit)
- **Pied de page** : sur chaque page — ligne orange + contact + numéro de page

### Layout et palette

| Élément | Valeur |
|---|---|
| Fond couverture | `#10263F` (bleu foncé) |
| Accent | `#E76F1D` (orange) |
| Titre couverture | Helvetica-Bold 20pt, blanc |
| Marges | 2.2 cm gauche/droite |
| Footer | `BaseDocTemplate` + `PageTemplate` + callback `onPage` |

### Appel CLI (test local)

```bash
python3 scripts/mini_catalogue_cli.py '<JSON>' 
```

**JSON minimal requis :**
```json
{
  "prospect": "Orange Côte d'Ivoire",
  "secteur": "Télécommunications",
  "pays": "Côte d'Ivoire",
  "date_doc": "Juin 2026",
  "pack_id": "pack-xxx",
  "enjeux_audit": [
    {"num": "01", "titre": "...", "constat": "...", "signal": "..."}
  ],
  "formations": [
    {
      "num": "F1", "intitule": "...", "public": "...", "duree": "...", "niveau": "...",
      "probleme": "...", "apres": "...",
      "objectifs": ["..."], "livrables": ["..."], "gain": "..."
    }
  ],
  "livrables_globaux": ["..."],
  "plan_90j": [["J+0","Titre","Description"]],
  "supabase_url": "https://xxx.supabase.co",
  "supabase_service_key": "eyJ..."
}
```

**Dry-run (sans upload) :** passer `"supabase_url": "SKIP"` et `"supabase_service_key": "SKIP"`

**Sortie JSON :**
```json
{
  "ok": true,
  "pdf_url": "https://xxx.supabase.co/storage/v1/object/public/prospect-decks/MiniCatalogue_xxx.pdf",
  "filename_pdf": "MiniCatalogue_TransferAI_OrangeCI_pack-xxx.pdf",
  "catalogue_artifact": { "pdf_url": "...", "filename_pdf": "..." }
}
```

---

## 3. Deck de présentation (`deck_generator_cli.py`)

### Ce qu'il génère

Un fichier **PPTX 8 slides** + **PDF** (via LibreOffice sur VPS), personnalisé par prospect et secteur :

| Slide | Contenu |
|---|---|
| 1 | Couverture — nom prospect + accroche |
| 2 | Enjeux secteur (3 points) |
| 3 | Pourquoi TransferAI (3 piliers) |
| 4 | Cas d'usage phares (3 cartes) |
| 5 | Chiffres clés / gains attendus |
| 6 | Plan d'action 90 jours |
| 7 | Équipe dirigeante (5 membres) |
| 8 | CTA + coordonnées |

### Équipe dirigeante (5 membres)

| Nom | Fonction |
|---|---|
| Casimir Kassi Beda | Directeur Général |
| Franck Diomandé | Directeur Commercial |
| Yves Kouamé | Directeur Technique |
| Soulemane Konaté | Responsable IA & Données |
| Médard Séry | Responsable Formations & Déploiement |

### Appel CLI (test local)

```bash
python3 scripts/deck_generator_cli.py '<JSON>'
```

**JSON minimal requis :**
```json
{
  "prospect": "Orange Côte d'Ivoire",
  "secteur": "Télécommunications",
  "pays": "Côte d'Ivoire",
  "pack_id": "pack-xxx",
  "accroche": "Transformer vos flux clients avec l'IA",
  "enjeux": ["Enjeu 1", "Enjeu 2", "Enjeu 3"],
  "cas_usage": [["💬","Titre","Gain"], ["📋","Titre","Gain"], ["📖","Titre","Gain"]],
  "gains": [["Label","Valeur","teal"], ["Label","Valeur","orange"], ["Label","Valeur","blue"]],
  "supabase_url": "https://xxx.supabase.co",
  "supabase_service_key": "eyJ..."
}
```

**Dry-run :** même principe que le catalogue — passer `"SKIP"` pour les deux clés Supabase.

**Sortie JSON :**
```json
{
  "ok": true,
  "pptx_url": "https://xxx.supabase.co/.../Deck_TransferAI_xxx.pptx",
  "pdf_url":  "https://xxx.supabase.co/.../Deck_TransferAI_xxx.pdf",
  "filename_pptx": "Deck_TransferAI_OrangeCI_pack-xxx.pptx",
  "filename_pdf":  "Deck_TransferAI_OrangeCI_pack-xxx.pdf",
  "deck_artifact": { "pptx_url": "...", "pdf_url": "...", ... }
}
```

---

## 4. Bucket Supabase Storage

**Bucket :** `prospect-decks`
- Accès public en lecture (URL directe sans token)
- Écriture : `service_role` uniquement
- Types autorisés : `application/pdf`, `application/vnd.openxmlformats-officedocument.presentationml.presentation`
- Taille max : 20 MB

**Migration SQL :** `supabase/migrations/20260628120000_prospect_decks_storage.sql`

---

## 5. Intégration pipeline V3 n8n

Voir le guide dédié : **[109_Guide_Integration_Deck_V3_n8n.md](./109_Guide_Integration_Deck_V3_n8n.md)**

**Résumé du flux :**

```
V3 Assemble Pack
    ↓
Build Catalogue Payload   (Code node — prépare JSON prospect)
    ↓
Generate Catalogue        (Execute Command → mini_catalogue_cli.py)
    ↓
Build Deck Payload        (Code node — prépare JSON deck)
    ↓
Generate Deck             (Execute Command → deck_generator_cli.py)
    ↓
Merge Artifacts           (fusionne pptx_url, pdf_url, catalogue_url)
    ↓
Build Send Context → Send Email (Resend, 3 pièces jointes)
```

**Gate de validation avant envoi :**
```javascript
hasPdf && hasPptx && hasCatalogue
```

---

## 6. Setup VPS (n8n)

```bash
# Dépendances
pip3 install python-pptx reportlab

# Dossier scripts
mkdir -p /opt/transferai/scripts

# Copier les 4 scripts depuis le repo
scp scripts/generate_mini_catalogue_pdf.py user@vps:/opt/transferai/scripts/
scp scripts/mini_catalogue_cli.py          user@vps:/opt/transferai/scripts/
scp scripts/deck_generator_cli.py          user@vps:/opt/transferai/scripts/
scp scripts/deck_template_transferai.py    user@vps:/opt/transferai/scripts/

chmod +x /opt/transferai/scripts/*.py
```

**LibreOffice requis** pour la conversion PPTX → PDF du deck (déjà présent sur la plupart des VPS Ubuntu) :
```bash
apt-get install libreoffice --no-install-recommends
```

---

## 7. Test complet (dry-run)

```bash
# Mini-catalogue
python3 scripts/mini_catalogue_cli.py '{"prospect":"Test","secteur":"Tech","pays":"CI","pack_id":"test-001","enjeux_audit":[{"num":"01","titre":"Enjeu test","constat":"Constat test","signal":"Signal test"}],"formations":[{"num":"F1","intitule":"Formation test","public":"Managers","duree":"1 jour","niveau":"Débutant","probleme":"Avant","apres":"Après","objectifs":["Obj 1"],"livrables":["Livrable 1"],"gain":"−30%"}],"livrables_globaux":["Note de cadrage"],"plan_90j":[["J+0","Audit","Cadrage."]],"supabase_url":"SKIP","supabase_service_key":"SKIP"}'

# Deck
python3 scripts/deck_generator_cli.py '{"prospect":"Test","secteur":"Tech","pays":"CI","pack_id":"test-001","accroche":"Tester l'\''IA","enjeux":["E1","E2","E3"],"cas_usage":[["💬","C1","G1"],["📋","C2","G2"],["📖","C3","G3"]],"gains":[["KPI 1","−30%","teal"],["KPI 2","−60%","orange"],["KPI 3","+homog.","blue"]],"supabase_url":"SKIP","supabase_service_key":"SKIP"}'
```

**Résultat attendu :** `"ok": true, "dry_run": true` pour les deux.
