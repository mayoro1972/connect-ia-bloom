# Guide Troubleshooting — Pack Prospect : Deck + Mini-Catalogue PDF
**Session du 28 juin 2026 — TransferAI Africa**

---

## Erreurs connues et corrections

---

### 1. `KeyError: "Style 'Bullet' already defined in stylesheet"`

**Contexte :** ReportLab `generate_mini_catalogue_pdf.py` — lors de l'appel à `getSampleStyleSheet()` + ajout de styles personnalisés.

**Cause :** Le stylesheet par défaut de ReportLab contient déjà un style nommé `"Bullet"`. Appeler `styles.add(ParagraphStyle("Bullet", ...))` lève une erreur.

**Correction appliquée :** Utiliser un helper qui met à jour le style existant au lieu de l'ajouter :
```python
def st(name, **kw):
    s[name] = ParagraphStyle(name, **kw)
```
On crée chaque style dans un dict local `s` — pas d'appel à `styles.add()`.

---

### 2. `ValueError` lors de l'upload Supabase avec `supabase_url="SKIP"`

**Contexte :** `deck_generator_cli.py` ou `mini_catalogue_cli.py` — `urllib.request.Request` lève un `ValueError` si l'URL n'est pas valide.

**Cause :** La fonction `upload()` construisait une URL invalide (`SKIP/storage/v1/...`) et passait cette URL à `urllib.request.Request` avant le check dry-run.

**Correction appliquée :** Vérifier le flag `dry_run` **avant** d'appeler `upload()` :
```python
dry_run = (not supabase_url or supabase_url == "SKIP" or
           not service_key or service_key == "SKIP")
if dry_run:
    print(json.dumps({"ok": True, "dry_run": True, ...}))
    return
pdf_url = upload(pdf_path, fn_pdf, supabase_url, service_key)
```

---

### 3. Titre de couverture qui déborde sur la zone blanche droite

**Contexte :** Mini-catalogue PDF — page de couverture, le texte "Formations IA prioritaires" à 24pt débordait dans la colonne droite (bleue-moyen).

**Cause :** La zone gauche fait `W × 0.62 = 12.4 cm`. À 24pt, une ligne de 26 caractères dépasse cette largeur.

**Correction appliquée :** Réduction à 20pt et repositionnement de `x0` à `ML + 0.7*cm` :
```python
canvas.setFont("Helvetica-Bold", 20)
canvas.drawString(x0, H - 3.8*cm, "Formations IA prioritaires")
canvas.drawString(x0, H - 4.55*cm, "recommandées pour")
```

---

### 4. J+15 / J+45 / J+90 reviennent à la ligne dans le tableau plan 90 jours

**Contexte :** Section 04 "Parcours recommandé sur 90 jours" — la colonne délai était trop étroite.

**Cause :** `colWidths=[1.8*cm, TW - 1.8*cm]` — 1.8 cm est insuffisant pour `J+15` en 20pt bold.

**Correction appliquée :** Passer la colonne à `2.4*cm` :
```python
t = Table(rows, colWidths=[2.4*cm, TW - 2.4*cm])
```

---

### 5. Titre "Parcours recommandé sur 90 jours" seul sur une page

**Contexte :** ReportLab coupait le contenu entre l'`AccentBar` du titre (section 04) et le tableau `plan_table`, laissant le titre seul en bas de page 5.

**Cause :** Le titre et le tableau n'étaient pas liés — ReportLab les traitait comme deux flowables indépendants.

**Correction appliquée :** Envelopper les deux dans un `KeepTogether` :
```python
story.append(KeepTogether([
    AccentBar("04", "Parcours recommandé sur 90 jours", ST),
    Spacer(1, 10),
    plan_table(etapes, ST),
]))
```

---

### 6. En-tête répété en haut de chaque page du PDF

**Contexte :** Ancienne version du mini-catalogue — une ligne `Paragraph` "TransferAI Africa · www.transferai.ci…" + `HRFlowable` était insérée en début de story, ce qui la faisait apparaître sur chaque page (ou plusieurs fois par page).

**Cause :** `SimpleDocTemplate` ne gère pas les en-têtes/pieds de page nativement. Le texte était dans le flux principal.

**Correction appliquée :** Migration vers `BaseDocTemplate` + `PageTemplate` avec callback `onPage` :
```python
def draw_footer(canvas, doc):
    canvas.saveState()
    y = MB - 0.6 * cm
    canvas.setStrokeColor(C_ORANGE)
    canvas.line(ML, y + 0.45*cm, W - MR, y + 0.45*cm)
    canvas.setFont("Helvetica", 7)
    canvas.drawString(ML, y + 0.12*cm,
        "TransferAI Africa  ·  Hub IA de NettelecomCI  ·  www.transferai.ci  ·  contact@transferai.ci")
    canvas.setFillColor(C_ORANGE)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawRightString(W - MR, y + 0.12*cm, f"{doc.page}")
    canvas.restoreState()

PageTemplate(id="Content", frames=[frame_content], onPage=draw_footer)
```
La suppression du `Paragraph` header dans la `story[]` a éliminé la répétition.

---

### 7. Couverture pleine page non rendue (frame vide)

**Contexte :** Lors de la migration vers `BaseDocTemplate`, la page de couverture restait blanche.

**Cause :** Le template `Cover` utilisait un `Frame` couvrant toute la page (`Frame(0, 0, W, H)`), mais le contenu de la couverture était dessiné via `onPage` (canvas direct) et non via des flowables. La frame était vide mais le callback `onPage=page_cover` dessinait bien le contenu.

**Solution :** Le `PageBreak` initial déclenche la transition vers le template `Content`, et `draw_cover()` s'exécute dans le callback `onPage` du template `Cover` :
```python
story.append(NextPageTemplate("Content"))  # après la couverture → passer en Content
story.append(PageBreak())                  # force le rendu de la page Cover
```

---

### 8. AppleScript Word/Pages — conversion PDF échouée (Mac local)

**Contexte :** Tentative de conversion du fichier `.docx` du mini-catalogue en PDF via AppleScript + Pages.

**Cause :** Pages renvoie une erreur "connection invalid" intermittente. Le scope des variables AppleScript causait aussi des erreurs dans certaines constructions.

**Solution adoptée :** Passage à **ReportLab natif** (génération PDF directe, sans conversion) — élimine toute dépendance à LibreOffice ou AppleScript pour le mini-catalogue.
> LibreOffice reste utilisé sur le VPS uniquement pour la conversion PPTX → PDF du deck.

---

### 9. `publish-main` divergé de `main` — conflit sur `00_INDEX.md`

**Contexte :** Tentative de `git merge main` puis `git rebase main` sur `publish-main` — conflit de contenu sur `docs/transferai-admin/00_INDEX.md`.

**Cause :** `publish-main` avait 7 commits de docs (V2/V3/V4 Chatwoot) jamais intégrés dans `main`, et `main` avait 110 commits en avance.

**Correction appliquée :** Reset hard de `publish-main` sur `main` (les 7 commits de docs étaient déjà présents dans `main` sous forme enrichie) :
```bash
git checkout publish-main
git reset --hard main
git push origin publish-main --force
```

---

## Checklist de validation avant déploiement VPS

- [ ] `pip3 install python-pptx reportlab` sur le VPS
- [ ] Scripts copiés dans `/opt/transferai/scripts/`
- [ ] `libreoffice --headless` disponible (pour PDF deck)
- [ ] Bucket `prospect-decks` créé dans Supabase (migration SQL appliquée)
- [ ] Variables d'environnement n8n : `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Dry-run des deux CLI : résultat `"ok": true, "dry_run": true`
- [ ] Nœuds n8n câblés selon le guide 109
- [ ] Email test envoyé — vérifier les 3 pièces jointes reçues

---

## Logs utiles à surveiller dans n8n

| Nœud | Erreur fréquente | Vérification |
|---|---|---|
| Generate Catalogue | `generate_mini_catalogue_pdf.py introuvable` | Vérifier le chemin `/opt/transferai/scripts/` |
| Generate Catalogue | `JSON invalide` | Vérifier que le Code node précédent retourne un JSON sérialisable |
| Generate Deck | `libreoffice: command not found` | `apt-get install libreoffice` sur le VPS |
| Merge Artifacts | `catalogue_artifact null` | Le CLI a renvoyé `dry_run: true` — vérifier les credentials Supabase |
| Send Email | Pièce jointe absente | Vérifier que `mail_attachments` contient bien le `path` (URL publique Supabase) |

---

## Fichiers de référence

| Fichier | Rôle |
|---|---|
| `scripts/generate_mini_catalogue_pdf.py` | Moteur PDF ReportLab — layout, styles, données Orange CI |
| `scripts/mini_catalogue_cli.py` | CLI → JSON → PDF → Supabase |
| `scripts/deck_generator_cli.py` | CLI → JSON → PPTX+PDF → Supabase |
| `scripts/deck_template_transferai.py` | Template deck de référence (édition manuelle par secteur) |
| `scripts/polish_deck_orange_ci.py` | Deck polished Orange CI — référence visuelle |
| `supabase/migrations/20260628120000_prospect_decks_storage.sql` | Bucket + policies Supabase |
| `docs/transferai-admin/109_Guide_Integration_Deck_V3_n8n.md` | Guide câblage n8n V3 |
| `docs/transferai-admin/110_Guide_Utilisateur_Pack_Prospect_Deck_MiniCatalogue_2026-06-28.md` | Guide utilisateur complet |
