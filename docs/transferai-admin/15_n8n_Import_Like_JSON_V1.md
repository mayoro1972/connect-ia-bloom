# n8n Import-Like JSON V1

## 1. Objectif

Ce document fournit une version **plus proche du format d'import n8n** pour le workflow V1 de qualification WhatsApp TransferAI.

Important :

- ce JSON n'est pas garanti comme export natif directement importable sans adaptation
- il est en revanche structuré pour être **très proche** de ce que vous allez reconstruire dans n8n
- il sert de **blueprint détaillé** avec noms de nœuds, paramètres, variables et connexions

## 2. Variables d'environnement à préparer

Avant la construction du workflow, vérifier dans n8n :

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `CALENDLY_LINK`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 3. Tables recommandées

Le workflow peut lire ou écrire dans :

- `whatsapp_inbound_messages`
- `whatsapp_email_notification_logs`
- `ai_leads` si vous créez une table dédiée
- `ai_automation_logs` si vous créez une table dédiée pour les traces IA

## 4. Blueprint JSON

```json
{
  "name": "TransferAI WhatsApp Qualification V1",
  "settings": {
    "executionOrder": "v1"
  },
  "nodes": [
    {
      "name": "Twilio Inbound Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [200, 300],
      "parameters": {
        "path": "twilio-whatsapp-qualification-v1",
        "httpMethod": "POST",
        "responseMode": "lastNode",
        "options": {}
      }
    },
    {
      "name": "Normalize Input",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [420, 300],
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "return [{ json: { channel: 'whatsapp', message_text: $json.Body || '', phone: $json.From || '', to_number: $json.To || '', contact_name: $json.ProfileName || 'Inconnu', message_sid: $json.MessageSid || '', wa_id: $json.WaId || '', num_media: Number($json.NumMedia || 0), calendly_link: $env.CALENDLY_LINK || '', raw_payload: $json } }];"
      }
    },
    {
      "name": "Get Message History",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [650, 300],
      "parameters": {
        "method": "GET",
        "url": "={{$env.SUPABASE_URL + '/rest/v1/whatsapp_inbound_messages?select=created_at,body,from_number,profile_name,message_sid&from_number=eq.' + encodeURIComponent($json.phone) + '&order=created_at.desc&limit=10'}}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "apikey",
              "value": "={{$env.SUPABASE_SERVICE_ROLE_KEY}}"
            },
            {
              "name": "Authorization",
              "value": "={{'Bearer ' + $env.SUPABASE_SERVICE_ROLE_KEY}}"
            }
          ]
        },
        "options": {}
      }
    },
    {
      "name": "Build Context",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [900, 300],
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const current = $items('Normalize Input', 0, 0)[0].json; const history = Array.isArray($json) ? $json : []; const historyText = history.map((m) => `${m.created_at} | ${m.profile_name || 'Inconnu'} | ${m.body || ''}`).join('\\n'); return [{ json: { ...current, history: historyText } }];"
      }
    },
    {
      "name": "OpenAI Qualification JSON",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [1160, 300],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Tu es un agent de qualification commerciale pour TransferAI. Analyse le message et retourne uniquement un JSON valide avec: company_name, sector, need_type, intent, lead_seriousness, is_b2b, wants_demo, needs_human_handoff, contact_name, email, phone, summary, next_best_action, missing_fields."
            },
            {
              "role": "user",
              "content": "=Message prospect:\\n{{$json.message_text}}\\n\\nHistorique:\\n{{$json.history}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "Parse Qualification JSON",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1410, 300],
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const base = $items('Build Context', 0, 0)[0].json; const raw = $json.message?.content || $json.text || $json.response || $json.data || ''; let parsed; try { parsed = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) { parsed = { company_name: null, sector: null, need_type: null, intent: 'autre', lead_seriousness: 'faible', is_b2b: null, wants_demo: false, needs_human_handoff: false, contact_name: base.contact_name, email: null, phone: base.phone, summary: 'Qualification non parsée proprement', next_best_action: 'ask_missing_info', missing_fields: ['company_name', 'sector', 'need_type'] }; } return [{ json: { ...base, ...parsed } }];"
      }
    },
    {
      "name": "OpenAI Lead Scoring",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [1670, 300],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Tu es un assistant de qualification pour TransferAI. Retourne uniquement un JSON valide avec: score, qualification_level, should_offer_demo, reason, recommended_route."
            },
            {
              "role": "user",
              "content": "=Données lead:\\n{{JSON.stringify($json, null, 2)}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "Parse Scoring JSON",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1920, 300],
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const base = $items('Parse Qualification JSON', 0, 0)[0].json; const raw = $json.message?.content || $json.text || $json.response || ''; let parsed; try { parsed = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) { parsed = { score: 0, qualification_level: 'faible', should_offer_demo: false, reason: 'fallback', recommended_route: base.intent || 'autre' }; } return [{ json: { ...base, ...parsed } }];"
      }
    },
    {
      "name": "OpenAI Route Service",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [2180, 300],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Tu es un agent de routage pour TransferAI. Retourne uniquement un JSON valide avec: service_route, reason, suggested_page, should_propose_demo."
            },
            {
              "role": "user",
              "content": "=Message: {{$json.message_text}}\\nIntent: {{$json.intent}}\\nNeed type: {{$json.need_type}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "Parse Route JSON",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [2440, 300],
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const base = $items('Parse Scoring JSON', 0, 0)[0].json; const raw = $json.message?.content || $json.text || $json.response || ''; let parsed; try { parsed = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) { parsed = { service_route: base.intent || 'autre', reason: 'fallback', suggested_page: '/contact', should_propose_demo: !!base.should_offer_demo }; } return [{ json: { ...base, ...parsed } }];"
      }
    },
    {
      "name": "OpenAI Internal Note",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [2700, 300],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Tu es un assistant interne TransferAI. Rédige une note interne très courte avec besoin, niveau de maturité et prochaine action. Maximum 2 phrases."
            },
            {
              "role": "user",
              "content": "=Conversation: {{$json.message_text}}\\nQualification: {{JSON.stringify($json, null, 2)}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "Merge Qualification Context",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [2960, 300],
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const base = $items('Parse Route JSON', 0, 0)[0].json; const note = $json.message?.content || $json.text || $json.response || ''; return [{ json: { ...base, internal_note: note } }];"
      }
    },
    {
      "name": "Decision Switch",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [3210, 300],
      "parameters": {
        "dataType": "string",
        "value1": "={{Array.isArray($json.missing_fields) && $json.missing_fields.length > 0 ? 'missing' : ($json.needs_human_handoff ? 'handoff' : ($json.should_offer_demo ? 'demo' : 'standard'))}}",
        "rules": [
          {
            "operation": "equal",
            "value2": "missing"
          },
          {
            "operation": "equal",
            "value2": "handoff"
          },
          {
            "operation": "equal",
            "value2": "demo"
          },
          {
            "operation": "equal",
            "value2": "standard"
          }
        ]
      }
    },
    {
      "name": "Reply Ask Missing Info",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [3480, 120],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Tu es l’assistant de TransferAI. Demande uniquement les informations manquantes parmi: nom de l’entreprise, secteur d’activité, besoin principal. Réponse courte et professionnelle."
            },
            {
              "role": "user",
              "content": "=Informations manquantes: {{JSON.stringify($json.missing_fields)}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "Reply Human Handoff",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [3480, 240],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Tu es l’assistant de TransferAI. Rédige une réponse brève confirmant qu’un membre de l’équipe va reprendre la demande. Ton professionnel, clair et court."
            },
            {
              "role": "user",
              "content": "=Demande: {{$json.message_text}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "Reply Offer Demo",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [3480, 360],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Tu réponds au nom de TransferAI. Le prospect est qualifié et sérieux. Rédige une réponse courte pour proposer une démo avec ce lien Calendly. Maximum 5 lignes."
            },
            {
              "role": "user",
              "content": "=Besoin: {{$json.need_type}}\\nEntreprise: {{$json.company_name}}\\nLien Calendly: {{$json.calendly_link}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "Reply Standard",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [3480, 480],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Tu es l’assistant officiel de TransferAI. Réponds de façon professionnelle, claire et courte. Oriente vers la bonne offre et reprends la qualification si nécessaire."
            },
            {
              "role": "user",
              "content": "=Message: {{$json.message_text}}\\nRoute: {{$json.service_route}}\\nPage suggérée: {{$json.suggested_page}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "Prepare Final Reply",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [3740, 300],
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const ctx = $items('Merge Qualification Context', 0, 0)[0].json; const raw = $json.message?.content || $json.text || $json.response || ''; return [{ json: { ...ctx, reply_text: raw } }];"
      }
    },
    {
      "name": "Upsert Lead",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [3990, 240],
      "parameters": {
        "method": "POST",
        "url": "={{$env.SUPABASE_URL + '/rest/v1/ai_leads'}}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "apikey",
              "value": "={{$env.SUPABASE_SERVICE_ROLE_KEY}}"
            },
            {
              "name": "Authorization",
              "value": "={{'Bearer ' + $env.SUPABASE_SERVICE_ROLE_KEY}}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Prefer",
              "value": "resolution=merge-duplicates"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ { channel: $json.channel, contact_name: $json.contact_name, company_name: $json.company_name, sector: $json.sector, need_type: $json.need_type, intent: $json.intent, lead_seriousness: $json.lead_seriousness, lead_score: $json.score, summary: $json.summary, recommended_route: $json.recommended_route, should_offer_demo: $json.should_offer_demo, needs_human_handoff: $json.needs_human_handoff, internal_note: $json.internal_note, source_message_sid: $json.message_sid, phone: $json.phone } }}"
      }
    },
    {
      "name": "Insert Automation Log",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [3990, 360],
      "parameters": {
        "method": "POST",
        "url": "={{$env.SUPABASE_URL + '/rest/v1/ai_automation_logs'}}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "apikey",
              "value": "={{$env.SUPABASE_SERVICE_ROLE_KEY}}"
            },
            {
              "name": "Authorization",
              "value": "={{'Bearer ' + $env.SUPABASE_SERVICE_ROLE_KEY}}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ { channel: $json.channel, message_sid: $json.message_sid, intent: $json.intent, lead_score: $json.score, recommended_route: $json.recommended_route, decision: ($json.should_offer_demo ? 'offer_demo' : ($json.needs_human_handoff ? 'handoff' : 'standard_reply')) } }}"
      }
    },
    {
      "name": "Send WhatsApp Reply",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [4250, 300],
      "parameters": {
        "method": "POST",
        "url": "=https://api.twilio.com/2010-04-01/Accounts/{{$env.TWILIO_ACCOUNT_SID}}/Messages.json",
        "sendHeaders": true,
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "httpBasicAuth",
        "sendBody": true,
        "contentType": "form-urlencoded",
        "bodyParameters": {
          "parameters": [
            {
              "name": "To",
              "value": "={{$json.phone}}"
            },
            {
              "name": "From",
              "value": "={{$env.TWILIO_WHATSAPP_FROM}}"
            },
            {
              "name": "Body",
              "value": "={{$json.reply_text}}"
            }
          ]
        }
      }
    },
    {
      "name": "Notify Internal Team",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [4510, 300],
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{$json.should_offer_demo === true || $json.needs_human_handoff === true}}",
              "operation": "isTrue"
            }
          ]
        }
      }
    },
    {
      "name": "Send Internal Email",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [4760, 220],
      "parameters": {
        "method": "POST",
        "url": "https://api.resend.com/emails",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "={{'Bearer ' + $env.RESEND_API_KEY}}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ { from: 'TransferAI Africa <contact@transferai.ci>', to: ['contact@transferai.ci', 'marius.ayoro70@gmail.com'], subject: 'Nouveau prospect qualifié TransferAI', html: `<p><strong>Nom:</strong> ${$json.contact_name || 'N/A'}</p><p><strong>Entreprise:</strong> ${$json.company_name || 'N/A'}</p><p><strong>Secteur:</strong> ${$json.sector || 'N/A'}</p><p><strong>Besoin:</strong> ${$json.need_type || 'N/A'}</p><p><strong>Résumé:</strong> ${$json.summary || ''}</p><p><strong>Note interne:</strong> ${$json.internal_note || ''}</p>` } }}"
      }
    }
  ],
  "connections": {
    "Twilio Inbound Webhook": {
      "main": [["Normalize Input"]]
    },
    "Normalize Input": {
      "main": [["Get Message History"]]
    },
    "Get Message History": {
      "main": [["Build Context"]]
    },
    "Build Context": {
      "main": [["OpenAI Qualification JSON"]]
    },
    "OpenAI Qualification JSON": {
      "main": [["Parse Qualification JSON"]]
    },
    "Parse Qualification JSON": {
      "main": [["OpenAI Lead Scoring"]]
    },
    "OpenAI Lead Scoring": {
      "main": [["Parse Scoring JSON"]]
    },
    "Parse Scoring JSON": {
      "main": [["OpenAI Route Service"]]
    },
    "OpenAI Route Service": {
      "main": [["Parse Route JSON"]]
    },
    "Parse Route JSON": {
      "main": [["OpenAI Internal Note"]]
    },
    "OpenAI Internal Note": {
      "main": [["Merge Qualification Context"]]
    },
    "Merge Qualification Context": {
      "main": [["Decision Switch"]]
    },
    "Decision Switch": {
      "main": [
        ["Reply Ask Missing Info"],
        ["Reply Human Handoff"],
        ["Reply Offer Demo"],
        ["Reply Standard"]
      ]
    },
    "Reply Ask Missing Info": {
      "main": [["Prepare Final Reply"]]
    },
    "Reply Human Handoff": {
      "main": [["Prepare Final Reply"]]
    },
    "Reply Offer Demo": {
      "main": [["Prepare Final Reply"]]
    },
    "Reply Standard": {
      "main": [["Prepare Final Reply"]]
    },
    "Prepare Final Reply": {
      "main": [["Upsert Lead", "Insert Automation Log", "Send WhatsApp Reply"]]
    },
    "Send WhatsApp Reply": {
      "main": [["Notify Internal Team"]]
    },
    "Notify Internal Team": {
      "main": [["Send Internal Email"], []]
    }
  }
}
```

## 5. Nœuds à adapter avant usage réel

Vous devrez ajuster au minimum :

- les credentials OpenAI
- les credentials Twilio
- la clé Resend
- les tables Supabase réellement utilisées
- le champ `TWILIO_WHATSAPP_FROM`
- le lien `CALENDLY_LINK`
- le modèle OpenAI

## 6. Choix de design recommandés

### Modèle OpenAI

Pour une V1 :

- `gpt-4.1-mini` si vous voulez coût / vitesse / qualité équilibrés

### Base de stockage

Recommandé :

- conserver `whatsapp_inbound_messages` pour le brut
- créer `ai_leads` pour la qualification
- créer `ai_automation_logs` pour l'observabilité

### Réponse courte WhatsApp

Toujours :

- courte
- claire
- pas plus de 3 à 5 lignes

## 7. Version minimale à construire si le temps manque

Si vous manquez de temps, construisez seulement :

1. `Twilio Inbound Webhook`
2. `Normalize Input`
3. `OpenAI Qualification JSON`
4. `Parse Qualification JSON`
5. `OpenAI Lead Scoring`
6. `Reply Ask Missing Info`
7. `Reply Offer Demo`
8. `Reply Standard`
9. `Send WhatsApp Reply`

Et ajoutez le stockage ensuite.

## 8. Prochaine suite recommandée

Après ce blueprint, la meilleure suite est une **checklist de construction n8n prête à cocher**, pour que vous puissiez construire le workflow sans oublier :

- les credentials
- les variables
- les tests
- les cas limites
