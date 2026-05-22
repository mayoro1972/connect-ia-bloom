# n8n Import-Like Blueprint - Prospection modèle Elton V1

Date : 2026-05-22

## 1. Objet

Ce document fournit une version **quasi import-like** du workflow n8n de prospection ciblée inspiré du modèle Elton.

Ce n'est pas un export natif garanti.

En revanche, la structure est volontairement proche de ce qu'il faudra reconstruire dans n8n :

- nœuds ;
- paramètres ;
- connexions ;
- variables ;
- payloads ;
- décisions.

## 2. Variables d'environnement recommandées

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `OUTREACH_FROM_EMAIL`
- `COMPANY_SITE_URL`
- `BOOKING_LINK_45MIN`

## 3. Tables recommandées

- `organizations`
- `people`
- `organization_research`
- `organization_analysis`
- `outreach_assets`
- `outreach_attempts`
- `do_not_contact`

## 3.1 Champs recommandés à ajouter dans l'analyse

- `commercial_priority_tier`
- `best_selling_use_case`
- `offer_sequence`
- `roi_hypothesis`
- `delivery_timeline`
- `sector_variant`
- `single_primary_cta`

## 4. Blueprint JSON

```json
{
  "name": "TransferAI Prospecting Elton Model V1",
  "settings": {
    "executionOrder": "v1"
  },
  "nodes": [
    {
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [200, 240],
      "parameters": {}
    },
    {
      "name": "Set Target",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3,
      "position": [420, 240],
      "parameters": {
        "values": {
          "string": [
            { "name": "organization_name", "value": "ELTON Oil CI" },
            { "name": "website", "value": "https://www.eltonoil.com" },
            { "name": "country", "value": "Côte d'Ivoire" },
            { "name": "organization_type", "value": "entreprise privée" },
            { "name": "sector_guess", "value": "distribution d'énergie et services B2B" },
            { "name": "decision_maker_name", "value": "Directeur Général" },
            { "name": "booking_link_45min", "value": "={{$env.BOOKING_LINK_45MIN}}" }
          ]
        }
      }
    },
    {
      "name": "Build Source URLs",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [660, 240],
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const base = $json.website.replace(/\\/$/, ''); return [{ json: { ...$json, source_urls: [base, base + '/produits-et-services/offres-professionnelles/', base + '/produits-et-services/carte-oasis/', base + '/produits-et-services/espace-auto/', base + '/carrieres/'] } }];"
      }
    },
    {
      "name": "Fetch Public Pages",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [930, 240],
      "parameters": {
        "method": "GET",
        "url": "={{$json.source_urls[0]}}",
        "options": {}
      }
    },
    {
      "name": "Normalize Public Signals",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1180, 240],
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const html = $json.body || $json.data || ''; const text = String(html).replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim(); return [{ json: { ...$items('Build Source URLs', 0, 0)[0].json, public_text: text.slice(0, 30000), visible_services: [], public_signals: [] } }];"
      }
    },
    {
      "name": "AI Pre-Audit",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [1440, 240],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Tu es l'assistant IA de prospection de TransferAI. Analyse uniquement les signaux publics et retourne uniquement un JSON valide avec: organization_summary, probable_strengths, probable_weaknesses, probable_needs, entry_point_niche, confidence_score."
            },
            {
              "role": "user",
              "content": "=Organisation: {{$json.organization_name}}\\nSecteur supposé: {{$json.sector_guess}}\\nContenu public:\\n{{$json.public_text}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "AI Problems And Solutions",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [1700, 240],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Tu es un analyste commercial TransferAI. Retourne uniquement un JSON valide avec: probable_problems, probable_quick_wins, recommended_offer, offer_sequence, recommended_training_bundle, recommended_use_case, best_selling_use_case, commercial_priority_tier, recommended_meeting_angle. Les problèmes doivent être formulés comme hypothèses. Privilégie les cas les plus vendables à court terme: support IT intelligent, service client multicanal, machine à contenu marketing, workflow administratif, assistant documentaire de direction."
            },
            {
              "role": "user",
              "content": "=Pré-audit:\\n{{$json.message?.content || $json.text || $json.response || ''}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "AI ROI Hypothesis",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [1700, 400],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Tu es un analyste de valeur TransferAI. Retourne uniquement un JSON valide avec: roi_hypothesis, expected_time_savings, expected_service_improvements, expected_quick_wins, delivery_timeline. Présente les chiffres comme hypothèses ou benchmarks à valider."
            },
            {
              "role": "user",
              "content": "=Contexte public prospect:\\n{{JSON.stringify($items('Normalize Public Signals', 0, 0)[0].json, null, 2)}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "Assemble Prospect Context",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1960, 240],
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const target = $items('Normalize Public Signals', 0, 0)[0].json; const preAuditRaw = $items('AI Pre-Audit', 0, 0)[0].json.message?.content || $items('AI Pre-Audit', 0, 0)[0].json.text || $items('AI Pre-Audit', 0, 0)[0].json.response || '{}'; const solutionsRaw = $items('AI Problems And Solutions', 0, 0)[0].json.message?.content || $items('AI Problems And Solutions', 0, 0)[0].json.text || $items('AI Problems And Solutions', 0, 0)[0].json.response || '{}'; const roiRaw = $items('AI ROI Hypothesis', 0, 0)[0].json.message?.content || $items('AI ROI Hypothesis', 0, 0)[0].json.text || $items('AI ROI Hypothesis', 0, 0)[0].json.response || '{}'; let preAudit = {}; let solutions = {}; let roi = {}; try { preAudit = JSON.parse(preAuditRaw); } catch (e) {} try { solutions = JSON.parse(solutionsRaw); } catch (e) {} try { roi = JSON.parse(roiRaw); } catch (e) {} return [{ json: { ...target, ...preAudit, ...solutions, ...roi } }];"
      }
    },
    {
      "name": "Generate Executive Letter",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [2220, 120],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Rédige un courrier professionnel en français standard avec accents. Commence par le résultat attendu pour le client. Mets en avant: audit gratuit, rendez-vous gratuit de 45 minutes, service derrière l'IA, accompagnement dans les secteurs opérés par TransferAI. N'affirme jamais un problème comme certain."
            },
            {
              "role": "user",
              "content": "=Contexte prospect:\\n{{JSON.stringify($json, null, 2)}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "Generate Tailored Catalogue",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [2220, 240],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Rédige un mini-catalogue ciblé avec les sections: Message central, Objectifs, Pourquoi cette approche peut intéresser la structure, Notre porte d'entrée, Offres prioritaires, Formations prioritaires, Hypothèse de gains attendus, Proposition immédiate."
            },
            {
              "role": "user",
              "content": "=Contexte prospect:\\n{{JSON.stringify($json, null, 2)}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "Generate Tailored Audit Form",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [2220, 360],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Crée une forme d'audit courte à envoyer avant un appel de 45 minutes. Elle doit être adaptée au secteur et couvrir: priorités métier, irritants, outils actuels, données, attentes de formation, confidentialité, objectifs à 3 mois."
            },
            {
              "role": "user",
              "content": "=Contexte prospect:\\n{{JSON.stringify($json, null, 2)}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "Generate Deck Brief",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [2220, 480],
      "parameters": {
        "resource": "chat",
        "operation": "complete",
        "model": "={{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Retourne uniquement un JSON valide avec: slide_objective, key_messages, sector_pain_points, recommended_case_study, training_focus, roi_hypothesis, delivery_timeline, sector_variant, single_primary_cta. Le deck doit être taillé sur mesure et n'avoir qu'un seul appel à l'action principal."
            },
            {
              "role": "user",
              "content": "=Contexte prospect:\\n{{JSON.stringify($json, null, 2)}}"
            }
          ]
        },
        "simplifyOutput": true,
        "options": {}
      }
    },
    {
      "name": "Compliance Gate",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [2490, 240],
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const ctx = $items('Assemble Prospect Context', 0, 0)[0].json; const approved = Boolean(ctx.organization_name && ctx.entry_point_niche && ctx.recommended_offer && ctx.confidence_score !== undefined); return [{ json: { ...ctx, approved_for_send: approved, review_required: true, reason: approved ? 'qualified_executive_outreach' : 'insufficient_context' } }];"
      }
    },
    {
      "name": "Store Outreach Assets",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [2740, 240],
      "parameters": {
        "method": "POST",
        "url": "={{$env.SUPABASE_URL + '/rest/v1/outreach_assets'}}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "apikey", "value": "={{$env.SUPABASE_SERVICE_ROLE_KEY}}" },
            { "name": "Authorization", "value": "={{'Bearer ' + $env.SUPABASE_SERVICE_ROLE_KEY}}" },
            { "name": "Content-Type", "value": "application/json" },
            { "name": "Prefer", "value": "return=minimal" }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ { organization_id: null, asset_type: 'prospect_pack', asset_title: $json.organization_name + ' Prospect Pack', asset_path: null, version: 'v1', generated_at: new Date().toISOString() } }}"
      }
    },
    {
      "name": "Manual Approval",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [2990, 240],
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{$json.approved_for_send}}",
              "operation": "true"
            }
          ]
        }
      }
    },
    {
      "name": "Send Executive Email",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [3240, 180],
      "parameters": {
        "method": "POST",
        "url": "https://api.resend.com/emails",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "Authorization", "value": "={{'Bearer ' + $env.RESEND_API_KEY}}" },
            { "name": "Content-Type", "value": "application/json" }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ { from: $env.OUTREACH_FROM_EMAIL, to: ['decision-maker@example.com'], subject: 'Proposition d\\'audit gratuit, d\\'accompagnement et de formation', html: '<p>Courrier à injecter après validation humaine.</p>' } }}"
      }
    },
    {
      "name": "Log Attempt",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [3490, 180],
      "parameters": {
        "method": "POST",
        "url": "={{$env.SUPABASE_URL + '/rest/v1/outreach_attempts'}}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "apikey", "value": "={{$env.SUPABASE_SERVICE_ROLE_KEY}}" },
            { "name": "Authorization", "value": "={{'Bearer ' + $env.SUPABASE_SERVICE_ROLE_KEY}}" },
            { "name": "Content-Type", "value": "application/json" },
            { "name": "Prefer", "value": "return=minimal" }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ { organization_id: null, person_id: null, channel: 'email', message_variant: 'executive_elton_model_v1', sent_at: new Date().toISOString(), delivery_status: 'submitted', response_status: 'pending', stop_reason: null } }}"
      }
    }
  ]
}
```

## 5. Règles métier à ne pas perdre

Le workflow doit toujours :

- partir d'informations publiques ;
- produire un pré-audit ;
- formuler des problèmes probables comme hypothèses ;
- produire une hypothèse de ROI ou de gains attendus ;
- proposer des solutions adaptées ;
- mettre l'audit gratuit en première porte d'entrée ;
- proposer un rendez-vous gratuit de 45 minutes ;
- préparer un courrier ciblé ;
- préparer un mini-catalogue ciblé ;
- préparer un deck ciblé ;
- préparer une forme d'audit avant le rendez-vous ;
- préparer une feuille de route `J+0 / J+15 / J+45 / J+90` ;
- garder un appel à l'action principal unique ;
- passer par une validation humaine avant envoi stratégique.
