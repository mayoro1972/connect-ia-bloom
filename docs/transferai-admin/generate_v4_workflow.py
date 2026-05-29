#!/usr/bin/env python3
"""
TransferAI — Générateur V4 : Batch journalier 5 prospects/jour
Produit : 65_n8n_V4_Daily_Batch_5perDay.json
"""
import json, os

OUT = os.path.join(os.path.dirname(__file__), "65_n8n_V4_Daily_Batch_5perDay.json")

SUPABASE_URL   = "https://wlhznciwuofueffyoflo.supabase.co"
SUPABASE_KEY   = "SUPABASE_SERVICE_ROLE_KEY_ICI"
RESEND_KEY     = "re_9CWoT2CUTfKHuMMaQAeEBhkZJCpyY4v"
FROM_EMAIL     = "onboarding@resend.dev"
REVIEWER_EMAIL = "marius.ayoro70@gmail.com"
V3_WORKFLOW_ID = "V3_WORKFLOW_ID_ICI"

# ── Helpers ───────────────────────────────────────────────────────────────────
def supabase_headers():
    return {"parameters": [
        {"name": "apikey",        "value": SUPABASE_KEY},
        {"name": "Authorization", "value": "Bearer " + SUPABASE_KEY},
        {"name": "Content-Type",  "value": "application/json"},
        {"name": "Prefer",        "value": "return=representation"},
    ]}

def resend_headers():
    return {"parameters": [
        {"name": "Authorization", "value": "Bearer " + RESEND_KEY},
        {"name": "Content-Type",  "value": "application/json"},
    ]}

def http_options_never_error():
    return {"response": {"response": {"neverError": True}}}

# ── Corps des emails (n8n expression JS) ─────────────────────────────────────
SUMMARY_BODY = (
    "={{JSON.stringify({"
    "  from: '" + FROM_EMAIL + "',"
    "  to: ['" + REVIEWER_EMAIL + "'],"
    "  subject: '\\ud83d\\ude80 TransferAI \\u2014 Batch lanc\\u00e9 (' + new Date().toLocaleDateString('fr-FR') + ')',"
    "  html: '<h2>Batch V4 \\u2014 Prospection journ\\u00e9e ' + new Date().toLocaleDateString('fr-FR') + '</h2>'"
    "    + '<p>5 prospects s\\u00e9lectionn\\u00e9s depuis votre CRM (status: <strong>ready</strong>).</p>'"
    "    + '<p>Les workflows V3 ont \\u00e9t\\u00e9 lanc\\u00e9s en arri\\u00e8re-plan.</p>'"
    "    + '<p>Vous allez recevoir les emails d\\'approbation individuels sous peu.</p>'"
    "    + '<hr/><p style=\"font-size:12px;color:#999;\">TransferAI Batch V4 \\u2014 Lun-Ven 09h00</p>'"
    "})}}"
)

NO_PROSPECTS_BODY = (
    "={{JSON.stringify({"
    "  from: '" + FROM_EMAIL + "',"
    "  to: ['" + REVIEWER_EMAIL + "'],"
    "  subject: '\\u26a0\\ufe0f TransferAI \\u2014 Aucun prospect disponible (' + new Date().toLocaleDateString('fr-FR') + ')',"
    "  html: '<h2>Batch V4 \\u2014 Aucun prospect pr\\u00eat</h2>'"
    "    + '<p>Aucun prospect avec status=<strong>ready</strong> n\\'a \\u00e9t\\u00e9 trouv\\u00e9 aujourd\\'hui.</p>'"
    "    + '<p><strong>Actions :</strong></p>'"
    "    + '<ul><li>V\\u00e9rifier la table <code>prospect_targets</code> dans Supabase</li>'"
    "    + '<li>S\\'assurer que des prospects ont le statut <code>ready</code></li>'"
    "    + '<li>Importer de nouveaux prospects via le fichier CSV</li></ul>'"
    "    + '<hr/><p style=\"font-size:12px;color:#999;\">TransferAI Batch V4</p>'"
    "})}}"
)

# ── Nodes ────────────────────────────────────────────────────────────────────
nodes = [

  # 1 — Test manuel
  {
    "id": "v4-n01",
    "name": "Manual Trigger",
    "type": "n8n-nodes-base.manualTrigger",
    "typeVersion": 1,
    "position": [200, 300],
    "parameters": {}
  },

  # 2 — Cron Lun-Ven 09h00
  {
    "id": "v4-n02",
    "name": "Cron 9h Lun-Ven",
    "type": "n8n-nodes-base.scheduleTrigger",
    "typeVersion": 1.1,
    "position": [200, 500],
    "parameters": {
      "rule": {
        "interval": [{"field": "cronExpression", "expression": "0 9 * * 1-5"}]
      }
    }
  },

  # 3 — Fetch 5 prospects (status=ready, par priorité)
  {
    "id": "v4-n03",
    "name": "Fetch 5 Ready Prospects",
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 4.2,
    "position": [460, 400],
    "parameters": {
      "method": "GET",
      "url": (SUPABASE_URL
              + "/rest/v1/prospect_targets"
              + "?select=*"
              + "&status=eq.ready"
              + "&order=commercial_priority_default.asc%2Cnext_action_at.asc"
              + "&limit=5"),
      "authentication": "none",
      "sendHeaders": True,
      "headerParameters": supabase_headers(),
      "options": http_options_never_error()
    }
  },

  # 4 — Y a-t-il des prospects ?
  {
    "id": "v4-n04",
    "name": "Has Ready Prospects?",
    "type": "n8n-nodes-base.if",
    "typeVersion": 1,
    "position": [700, 400],
    "parameters": {
      "conditions": {
        "number": [{
          "value1": "={{ Array.isArray($json) ? $json.length : 0 }}",
          "operation": "larger",
          "value2": 0
        }]
      }
    }
  },

  # 5 — Parser le tableau Supabase → items individuels
  {
    "id": "v4-n05",
    "name": "Parse Prospects List",
    "type": "n8n-nodes-base.code",
    "typeVersion": 2,
    "position": [940, 280],
    "parameters": {
      "mode": "runOnceForAllItems",
      "jsCode": (
        "var raw = JSON.parse(JSON.stringify($input.first().json));\n"
        "var prospects = Array.isArray(raw) ? raw : [];\n"
        "if (prospects.length === 0) return [];\n"
        "return prospects.map(function(p) { return { json: p }; });"
      )
    }
  },

  # 6 — Traiter 1 prospect à la fois
  {
    "id": "v4-n06",
    "name": "Process One By One",
    "type": "n8n-nodes-base.splitInBatches",
    "typeVersion": 3,
    "position": [1180, 280],
    "parameters": {
      "batchSize": 1,
      "options": {}
    }
  },

  # 7 — Marquer en 'processing'
  {
    "id": "v4-n07",
    "name": "Mark As Processing",
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 4.2,
    "position": [1420, 140],
    "parameters": {
      "method": "PATCH",
      "url": ("={{'https://wlhznciwuofueffyoflo.supabase.co"
              + "/rest/v1/prospect_targets?prospect_id=eq.'"
              + " + encodeURIComponent($json.prospect_id)}}"),
      "authentication": "none",
      "sendHeaders": True,
      "headerParameters": supabase_headers(),
      "sendBody": True,
      "specifyBody": "json",
      "jsonBody": "={{JSON.stringify({ status: 'processing', updated_at: new Date().toISOString() })}}",
      "options": http_options_never_error()
    }
  },

  # 8 — Restaurer les données du prospect pour V3
  {
    "id": "v4-n08",
    "name": "Restore Prospect Data",
    "type": "n8n-nodes-base.code",
    "typeVersion": 2,
    "position": [1660, 140],
    "parameters": {
      "mode": "runOnceForAllItems",
      "jsCode": (
        "// Récupère le prospect courant depuis le nœud Split\n"
        "var p = JSON.parse(JSON.stringify($('Process One By One').first().json));\n"
        "return [{ json: p }];"
      )
    }
  },

  # 9 — Lancer V3 en arrière-plan pour ce prospect
  {
    "id": "v4-n09",
    "name": "Execute V3 For This Prospect",
    "type": "n8n-nodes-base.executeWorkflow",
    "typeVersion": 1,
    "position": [1900, 140],
    "parameters": {
      "workflowId": V3_WORKFLOW_ID,
      "options": {
        "waitForSubWorkflow": False
      }
    }
  },

  # 10 — NoOp pour boucle retour
  {
    "id": "v4-n10",
    "name": "Continue Batch Loop",
    "type": "n8n-nodes-base.noOp",
    "typeVersion": 1,
    "position": [2140, 140],
    "parameters": {}
  },

  # 11 — Récap journalier (tout lancé)
  {
    "id": "v4-n11",
    "name": "Send Daily Batch Summary",
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 4.2,
    "position": [1420, 420],
    "parameters": {
      "method": "POST",
      "url": "https://api.resend.com/emails",
      "authentication": "none",
      "sendHeaders": True,
      "headerParameters": resend_headers(),
      "sendBody": True,
      "specifyBody": "json",
      "jsonBody": SUMMARY_BODY,
      "options": http_options_never_error()
    }
  },

  # 12 — Alerte : aucun prospect disponible
  {
    "id": "v4-n12",
    "name": "Send No-Prospects Alert",
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 4.2,
    "position": [940, 540],
    "parameters": {
      "method": "POST",
      "url": "https://api.resend.com/emails",
      "authentication": "none",
      "sendHeaders": True,
      "headerParameters": resend_headers(),
      "sendBody": True,
      "specifyBody": "json",
      "jsonBody": NO_PROSPECTS_BODY,
      "options": http_options_never_error()
    }
  },

]

# ── Connexions ────────────────────────────────────────────────────────────────
connections = {
  "Manual Trigger": {
    "main": [[{"node": "Fetch 5 Ready Prospects", "type": "main", "index": 0}]]
  },
  "Cron 9h Lun-Ven": {
    "main": [[{"node": "Fetch 5 Ready Prospects", "type": "main", "index": 0}]]
  },
  "Fetch 5 Ready Prospects": {
    "main": [[{"node": "Has Ready Prospects?", "type": "main", "index": 0}]]
  },
  "Has Ready Prospects?": {
    "main": [
      [{"node": "Parse Prospects List",     "type": "main", "index": 0}],
      [{"node": "Send No-Prospects Alert",  "type": "main", "index": 0}]
    ]
  },
  "Parse Prospects List": {
    "main": [[{"node": "Process One By One", "type": "main", "index": 0}]]
  },
  "Process One By One": {
    "main": [
      [{"node": "Mark As Processing",        "type": "main", "index": 0}],
      [{"node": "Send Daily Batch Summary",  "type": "main", "index": 0}]
    ]
  },
  "Mark As Processing": {
    "main": [[{"node": "Restore Prospect Data", "type": "main", "index": 0}]]
  },
  "Restore Prospect Data": {
    "main": [[{"node": "Execute V3 For This Prospect", "type": "main", "index": 0}]]
  },
  "Execute V3 For This Prospect": {
    "main": [[{"node": "Continue Batch Loop", "type": "main", "index": 0}]]
  },
  "Continue Batch Loop": {
    "main": [[{"node": "Process One By One", "type": "main", "index": 0}]]
  },
}

# ── Workflow ──────────────────────────────────────────────────────────────────
workflow = {
  "name": "TransferAI — V4 Batch Journalier (5 prospects/jour + Approbation)",
  "nodes": nodes,
  "connections": connections,
  "active": False,
  "settings": {
    "executionOrder": "v1",
    "saveManualExecutions": True,
    "callerPolicy": "workflowsFromSameOwner",
    "errorWorkflow": ""
  },
  "tags": [
    {"name": "TransferAI"},
    {"name": "V4"},
    {"name": "Prospection"},
    {"name": "CRM"}
  ]
}

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(workflow, f, ensure_ascii=False, indent=2)

print(f"Nodes  : {len(nodes)}")
print(f"Fichier: {OUT}")
print()
print("Checklist apres import dans n8n :")
print("  1. Importer d'abord 62_n8n_Prospection_V3_CRM_final.json")
print("     → noter l'ID du workflow V3 (dans l'URL : /workflow/XXXXXX)")
print("  2. Dans V4 → noeud 'Execute V3 For This Prospect'")
print("     → Workflow ID : remplacer V3_WORKFLOW_ID_ICI par l'ID reel")
print("  3. Remplacer SUPABASE_SERVICE_ROLE_KEY_ICI dans V3 et V4")
print("  4. Activer V4 (toggle ON) → test depuis Manual Trigger")
