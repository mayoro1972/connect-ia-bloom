# Guide d'intégration du Deck dans le pipeline V3

## Objectif

Générer automatiquement un deck PPTX + PDF personnalisé pour chaque prospect et l'attacher à l'email d'envoi via Resend.

## Architecture

```
V3 Assemble Pack
      ↓
Render Catalogue  (déjà en place)
      ↓
[NOUVEAU] Build Deck Payload   ← prépare le JSON prospect pour le générateur
      ↓
[NOUVEAU] Generate Deck        ← Execute Command → deck_generator_cli.py → Supabase Storage
      ↓
Merge Deck Artifact            (déjà en place, attend deck_artifact.pptx_url)
      ↓
Build Send Context → Send Email + PJ
```

---

## Étape 1 — Installer le script sur le VPS n8n

Se connecter au VPS n8n (SSH) et exécuter :

```bash
# Installer les dépendances Python
pip3 install python-pptx

# Créer le dossier scripts
mkdir -p /opt/transferai/scripts

# Copier deck_generator_cli.py depuis le repo
# (ou copier le contenu manuellement)
nano /opt/transferai/scripts/deck_generator_cli.py
# → coller le contenu du fichier scripts/deck_generator_cli.py du repo

chmod +x /opt/transferai/scripts/deck_generator_cli.py

# Tester
python3 /opt/transferai/scripts/deck_generator_cli.py '{"prospect":"Test","secteur":"Tech","pays":"CI","pack_id":"test-001","accroche":"Test IA","enjeux":["e1","e2","e3"],"cas_usage":[["💬","CAS 1","gain 1"],["📋","CAS 2","gain 2"],["📖","CAS 3","gain 3"]],"gains":[["KPI 1","−30%","teal"],["KPI 2","−60%","orange"],["KPI 3","+homog.","blue"]],"supabase_url":"https://wlhznciwuofueffyoflo.supabase.co","supabase_service_key":"VOTRE_SERVICE_KEY"}'
```

---

## Étape 2 — Appliquer la migration Supabase

Dans le dashboard Supabase → SQL Editor, exécuter :

```sql
-- Contenu de supabase/migrations/20260628120000_prospect_decks_storage.sql
```

Ou via CLI :
```bash
supabase db push
```

---

## Étape 3 — Ajouter les nœuds dans V3

### Nœud A — "Build Deck Payload" (type: Code)

Insérer **avant** le nœud `Render Deck Artifact` existant.

```javascript
// Build Deck Payload — prépare le JSON pour deck_generator_cli.py
var pack = JSON.parse(JSON.stringify($input.first().json || {}));
var payload = pack.payload || {};

// Extraire enjeux depuis le payload GPT
var enjeux = [];
if (payload.key_challenges && Array.isArray(payload.key_challenges)) {
  enjeux = payload.key_challenges.slice(0, 3);
} else if (payload.pain_points) {
  enjeux = String(payload.pain_points).split('\n').filter(Boolean).slice(0, 3);
} else {
  enjeux = ["Améliorer les processus internes", "Accélérer le reporting", "Structurer les procédures"];
}

// Cas d'usage depuis best_selling_use_case ou niche_status
var nicheMap = {
  "service_client_multicanal":    [["💬","Copilote service client","Réponses homogènes, délai réduit"],["📋","Synthèse tickets","Reporting automatisé, alertes lisibles"],["📖","Base procédures terrain","Scripts unifiés, onboarding accéléré"]],
  "reporting_data_analytics":     [["📊","Commentaire IA des KPI","Synthèses managers, meilleur arbitrage"],["📋","Consolidation reporting","Rapport automatisé, gain de temps"],["🔍","Analyse d'écarts","Détection rapide des anomalies"]],
  "formation_montee_competences": [["🎓","Parcours IA sur mesure","Formation ciblée, opérationnelle"],["📖","Base de connaissances","Scripts unifiés, onboarding accéléré"],["✅","Évaluation et certification","Validation des acquis terrain"]],
  "automatisation_processus_rh":  [["👥","Copilote RH","Réponses homogènes, gestion accélérée"],["📋","Synthèse entretiens","Reporting automatisé, gain de temps"],["📖","Procédures RH","Onboarding structuré, scripts clairs"]],
  "logistique_supply_chain":      [["🚚","Planification assistée IA","Optimisation des flux, moins d'erreurs"],["📊","Pilotage opérationnel","KPI lisibles, alertes automatiques"],["📖","Procédures terrain","Scripts unifiés, onboarding accéléré"]],
};
var defaultCasUsage = [
  ["💡", "Cas d'usage prioritaire 1", payload.best_selling_use_case || "Gain principal attendu"],
  ["📋", "Synthèse et pilotage", "Reporting accéléré, vision plus claire"],
  ["📖", "Base de connaissances", "Procédures unifiées, onboarding réduit"],
];
var niche = pack.niche_status || payload.niche_status || "default";
var casUsage = nicheMap[niche] || defaultCasUsage;

// Gains selon secteur
var gains = [
  ["Délai de réponse",   "− 30 à 50 %", "teal"],
  ["Temps de reporting", "− 60 %",       "orange"],
  ["Qualité réponses",   "+ homogénéité","blue"],
];

var deckInput = {
  prospect:            pack.organization_name || "Votre organisation",
  secteur:             pack.sector_guess || payload.sector || "Entreprise",
  pays:                pack.country || "Côte d'Ivoire",
  pack_id:             pack.pack_id || "",
  accroche:            payload.single_primary_cta || "Transformer vos processus avec l'IA",
  enjeux:              enjeux,
  cas_usage:           casUsage,
  gains:               gains,
  supabase_url:        $env.SUPABASE_URL || "https://wlhznciwuofueffyoflo.supabase.co",
  supabase_service_key: $env.SUPABASE_SERVICE_ROLE_KEY || "",
};

return [{ json: Object.assign({}, pack, { deck_input: deckInput }) }];
```

---

### Nœud B — "Generate Deck" (type: Execute Command)

Remplace (ou modifie) le nœud `Render Deck Artifact`.

**Commande :**
```
python3 /opt/transferai/scripts/deck_generator_cli.py '{{ JSON.stringify($json.deck_input) }}'
```

**Nœud suivant — parser la sortie (type: Code) :**
```javascript
// Parse Generate Deck Output
var pack = JSON.parse(JSON.stringify($('Build Deck Payload').first().json || {}));
var stdout = $input.first().json.stdout || $input.first().json || "";

var result = {};
try {
  result = JSON.parse(typeof stdout === "string" ? stdout : JSON.stringify(stdout));
} catch(e) {
  result = { ok: false, error: "Parse error: " + e.message };
}

var deckArtifact = result.ok ? result.deck_artifact : null;
var mailAttachments = [];

if (deckArtifact) {
  if (deckArtifact.pdf_url) {
    mailAttachments.push({
      filename: deckArtifact.filename_pdf || "Deck_TransferAI.pdf",
      path:     deckArtifact.pdf_url
    });
  }
  if (deckArtifact.pptx_url) {
    mailAttachments.push({
      filename: deckArtifact.filename_pptx || "Deck_TransferAI.pptx",
      path:     deckArtifact.pptx_url
    });
  }
}

return [{ json: Object.assign({}, pack, {
  deck_artifact:   deckArtifact,
  mail_attachments: (pack.mail_attachments || []).concat(mailAttachments),
  deck_render_ok:  result.ok,
  deck_render_error: result.error || null,
}) }];
```

---

## Étape 4 — Variable d'environnement n8n

Dans n8n → Settings → Variables d'environnement, ajouter :

| Clé | Valeur |
|-----|--------|
| `SUPABASE_URL` | `https://wlhznciwuofueffyoflo.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (clé service_role depuis Supabase → Project Settings → API) |

---

## Résultat final

Chaque email envoyé au prospect contiendra :
- ✉ Courrier exécutif (HTML inline)
- 📄 Mini-catalogue PDF (pièce jointe existante)
- 📊 **Deck TransferAI PDF** (pièce jointe — nouveau)
- 📎 **Deck TransferAI PPTX** (pièce jointe — nouveau)
- 🔗 Lien formulaire audit dans le corps de l'email

## Noms de fichiers générés

```
Deck_TransferAI_Orange_Cote_dIvoire_pack-xxx.pptx
Deck_TransferAI_Orange_Cote_dIvoire_pack-xxx.pdf
```

Stockés dans :
```
https://wlhznciwuofueffyoflo.supabase.co/storage/v1/object/public/prospect-decks/
```
