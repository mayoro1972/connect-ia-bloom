from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs" / "transferai-admin"
OUTPUT = DOCS_DIR / "60_n8n_Prospection_CRM_V5_Growth_Loop.json"


def node(name, type_, position, parameters=None, type_version=1):
    return {
        "name": name,
        "type": type_,
        "typeVersion": type_version,
        "position": position,
        "parameters": parameters or {},
    }


workflow = {
    "name": "TransferAI Prospecting CRM V5 Growth Loop",
    "settings": {"executionOrder": "v1"},
    "active": False,
    "versionId": "transferai-prospecting-crm-v5-growth-loop",
    "meta": {"templateCredsSetupCompleted": False},
    "pinData": {},
    "tags": [
        {"name": "transferai"},
        {"name": "prospection"},
        {"name": "crm"},
        {"name": "n8n"},
        {"name": "v5"},
    ],
    "nodes": [
        node("Manual Trigger", "n8n-nodes-base.manualTrigger", [200, 120]),
        node(
            "Daily CRM Growth Schedule",
            "n8n-nodes-base.scheduleTrigger",
            [200, 300],
            {"rule": {"interval": [{"field": "cronExpression", "expression": "0 7 * * 1-5"}]}},
        ),
        node(
            "Scraped Leads Webhook",
            "n8n-nodes-base.webhook",
            [200, 480],
            {"httpMethod": "POST", "path": "crm-public-leads-ingest", "responseMode": "lastNode", "options": {}},
        ),
        node(
            "Set CRM Growth Config",
            "n8n-nodes-base.set",
            [470, 300],
            {
                "mode": "manual",
                "duplicateItem": False,
                "includeOtherFields": True,
                "fields": {
                    "values": [
                        {"name": "crm_backend", "type": "string", "stringValue": "={{$json.crm_backend || 'supabase'}}"},
                        {
                            "name": "scraped_csv_url",
                            "type": "string",
                            "stringValue": "={{$json.scraped_csv_url || $env.SCRAPED_PUBLIC_LEADS_CSV_URL || ''}}",
                        },
                        {
                            "name": "dispatch_to_v4",
                            "type": "boolean",
                            "booleanValue": "={{$json.dispatch_to_v4 !== undefined ? $json.dispatch_to_v4 : true}}",
                        },
                        {
                            "name": "child_workflow_id_v4",
                            "type": "string",
                            "stringValue": "={{$json.child_workflow_id_v4 || $env.N8N_CHILD_WORKFLOW_ID_V4 || 'REPLACE_WITH_V4_WORKFLOW_ID'}}",
                        },
                        {
                            "name": "default_country",
                            "type": "string",
                            "stringValue": "={{$json.default_country || \"Côte d'Ivoire\"}}",
                        },
                        {
                            "name": "default_organization_type",
                            "type": "string",
                            "stringValue": "={{$json.default_organization_type || 'organisation à qualifier'}}",
                        },
                        {
                            "name": "default_sector_guess",
                            "type": "string",
                            "stringValue": "={{$json.default_sector_guess || 'secteur à confirmer'}}",
                        },
                        {
                            "name": "default_priority",
                            "type": "string",
                            "stringValue": "={{$json.default_priority || 'tier1'}}",
                        },
                        {
                            "name": "default_research_scope",
                            "type": "string",
                            "stringValue": "={{$json.default_research_scope || 'public_web_only'}}",
                        },
                        {
                            "name": "next_action_delay_days",
                            "type": "string",
                            "stringValue": "={{$json.next_action_delay_days || '1'}}",
                        },
                        {
                            "name": "ingest_label",
                            "type": "string",
                            "stringValue": "={{$json.ingest_label || 'daily-public-scrape-ingest'}}",
                        },
                    ]
                },
            },
            3,
        ),
        node(
            "If Direct Lead Payload",
            "n8n-nodes-base.if",
            [720, 300],
            {
                "conditions": {
                    "boolean": [
                        {
                            "value1": "={{Boolean($json.leads || ($json.body && typeof $json.body === 'object') || $json.organization_name || $json.company_name)}}",
                            "operation": "true",
                        }
                    ]
                }
            },
            2,
        ),
        node(
            "Fetch Scraped Leads CSV",
            "n8n-nodes-base.httpRequest",
            [970, 180],
            {"method": "GET", "url": "={{$json.scraped_csv_url}}", "authentication": "none", "options": {}},
            4,
        ),
        node(
            "Normalize Inbound Leads",
            "n8n-nodes-base.code",
            [1220, 300],
            {
                "mode": "runOnceForEachItem",
                "jsCode": """const source = $json;
function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
function domainFromWebsite(website) {
  return String(website || '').replace(/^https?:\\/\\//i, '').replace(/^www\\./i, '').split('/')[0].trim();
}
function canonicalize(row, index) {
  const website = row.website || row.domain || '';
  const domain = domainFromWebsite(website);
  return {
    prospect_id: row.prospect_id || `crm-${slugify(domain || row.organization_name || row.company_name || 'lead')}-${index + 1}`,
    organization_name: row.organization_name || row.company_name || row.name || '',
    website,
    country: row.country || source.default_country || "Côte d'Ivoire",
    organization_type: row.organization_type || source.default_organization_type || 'organisation à qualifier',
    sector_guess: row.sector_guess || row.industry || source.default_sector_guess || 'secteur à confirmer',
    decision_maker_name: row.decision_maker_name || row.contact_name || 'Décideur à confirmer',
    target_email: row.target_email || row.email || '',
    custom_page_paths_csv: row.custom_page_paths_csv || '',
    booking_link_45min: row.booking_link_45min || $env.BOOKING_LINK_45MIN || '',
    commercial_priority_default: row.commercial_priority_default || source.default_priority || 'tier1',
    research_scope: row.research_scope || source.default_research_scope || 'public_web_only',
    lead_origin: row.lead_origin || source.ingest_label || 'public_scrape',
    source_backend: source.crm_backend || 'supabase',
    raw_source_id: row.raw_source_id || row.id || domain || null
  };
}
if (Array.isArray(source.leads)) {
  return source.leads.map((row, index) => ({ json: canonicalize(row || {}, index) }));
}
if (typeof source.body === 'string' || typeof source.data === 'string') {
  const raw = String(source.body || source.data || '');
  const lines = raw.split(/\\r?\\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = lines.shift().split(',').map((h) => h.trim());
  return lines.map((line, index) => {
    const values = line.split(',');
    const row = {};
    headers.forEach((header, idx) => row[header] = (values[idx] || '').trim());
    return { json: canonicalize(row, index) };
  });
}
if (source.body && typeof source.body === 'object' && Array.isArray(source.body.leads)) {
  return source.body.leads.map((row, index) => ({ json: canonicalize(row || {}, index) }));
}
return [{ json: canonicalize(source, 0) }];""",
            },
            2,
        ),
        node(
            "Filter Valid Leads",
            "n8n-nodes-base.code",
            [1460, 300],
            {
                "mode": "runOnceForAllItems",
                "jsCode": """return items
  .map((item) => item.json)
  .filter((lead) => lead.organization_name && lead.website)
  .map((lead) => ({ json: lead }));""",
            },
            2,
        ),
        node(
            "Prepare CRM Upserts",
            "n8n-nodes-base.code",
            [1700, 300],
            {
                "mode": "runOnceForEachItem",
                "jsCode": """const lead = $json;
const delayDays = Number($('Set CRM Growth Config').first().json.next_action_delay_days || 1);
const nextActionAt = new Date(Date.now() + delayDays * 86400000).toISOString();
return [{
  json: {
    ...lead,
    status: 'ready',
    paused: false,
    do_not_contact: false,
    outreach_attempt_count: Number(lead.outreach_attempt_count || 0),
    last_response_status: lead.last_response_status || '',
    last_sequence_result: lead.last_sequence_result || '',
    stop_reason: '',
    niche_status: lead.niche_status || 'not_assessed',
    next_action_at: lead.next_action_at || nextActionAt,
    updated_at: new Date().toISOString()
  }
}];""",
            },
            2,
        ),
        node(
            "Upsert Prospects Into CRM",
            "n8n-nodes-base.httpRequest",
            [1940, 300],
            {
                "method": "POST",
                "url": "={{$env.SUPABASE_URL + '/rest/v1/prospect_targets?on_conflict=prospect_id'}}",
                "authentication": "none",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        {"name": "apikey", "value": "={{$env.SUPABASE_SERVICE_ROLE_KEY}}"},
                        {"name": "Authorization", "value": "={{'Bearer ' + $env.SUPABASE_SERVICE_ROLE_KEY}}"},
                        {"name": "Content-Type", "value": "application/json"},
                        {"name": "Prefer", "value": "resolution=merge-duplicates,return=representation"},
                    ]
                },
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{JSON.stringify($json)}}",
                "options": {},
            },
            4,
        ),
        node(
            "Build CRM Import Summary",
            "n8n-nodes-base.code",
            [2190, 300],
            {
                "mode": "runOnceForAllItems",
                "jsCode": """const imported = items.map((item) => item.json);
return [{
  json: {
    imported_count: imported.length,
    imported_prospect_ids: imported.map((row) => row.prospect_id || row[0]?.prospect_id).filter(Boolean),
    dispatch_to_v4: $('Set CRM Growth Config').first().json.dispatch_to_v4,
    child_workflow_id_v4: $('Set CRM Growth Config').first().json.child_workflow_id_v4,
    ingest_label: $('Set CRM Growth Config').first().json.ingest_label
  }
}];""",
            },
            2,
        ),
        node(
            "If Dispatch To V4",
            "n8n-nodes-base.if",
            [2430, 300],
            {"conditions": {"boolean": [{"value1": "={{$json.dispatch_to_v4}}", "operation": "true"}]}},
            2,
        ),
        node(
            "Execute V4 Batch Workflow",
            "n8n-nodes-base.executeWorkflow",
            [2670, 220],
            {
                "workflowId": "={{$json.child_workflow_id_v4 || $env.N8N_CHILD_WORKFLOW_ID_V4 || 'REPLACE_WITH_V4_WORKFLOW_ID'}}",
                "mode": "each",
                "options": {},
            },
        ),
        node(
            "Fetch CRM Ready Snapshot",
            "n8n-nodes-base.httpRequest",
            [2670, 420],
            {
                "method": "GET",
                "url": "={{$env.SUPABASE_URL + '/rest/v1/prospect_targets?select=prospect_id&status=in.(ready,active)&paused=eq.false'}}",
                "authentication": "none",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        {"name": "apikey", "value": "={{$env.SUPABASE_SERVICE_ROLE_KEY}}"},
                        {"name": "Authorization", "value": "={{'Bearer ' + $env.SUPABASE_SERVICE_ROLE_KEY}}"},
                    ]
                },
                "options": {},
            },
            4,
        ),
        node(
            "Fetch Today Outreach Snapshot",
            "n8n-nodes-base.httpRequest",
            [2910, 420],
            {
                "method": "GET",
                "url": "={{$env.SUPABASE_URL + '/rest/v1/outreach_attempts?select=id&sent_at=gte.' + new Date().toISOString().slice(0,10)}}",
                "authentication": "none",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        {"name": "apikey", "value": "={{$env.SUPABASE_SERVICE_ROLE_KEY}}"},
                        {"name": "Authorization", "value": "={{'Bearer ' + $env.SUPABASE_SERVICE_ROLE_KEY}}"},
                    ]
                },
                "options": {},
            },
            4,
        ),
        node(
            "Build End Of Run Summary",
            "n8n-nodes-base.code",
            [3150, 420],
            {
                "mode": "runOnceForAllItems",
                "jsCode": """const crmRows = Array.isArray($json) ? $json : Array.isArray($json.data) ? $json.data : [];
let outreachRows = [];
try {
  const snap = $('Fetch Today Outreach Snapshot').first().json;
  outreachRows = Array.isArray(snap) ? snap : Array.isArray(snap.data) ? snap.data : [];
} catch (e) {}
const importSummary = $('Build CRM Import Summary').first().json;
return [{
  json: {
    crm_stage: 'v5_growth_loop_completed',
    imported_count: importSummary.imported_count || 0,
    crm_ready_count: crmRows.length,
    outreach_today_count: outreachRows.length,
    dispatch_to_v4: importSummary.dispatch_to_v4,
    next_step: importSummary.dispatch_to_v4 ? 'V4 batch can now process the CRM queue.' : 'CRM queue updated without dispatch.',
    generated_at: new Date().toISOString()
  }
}];""",
            },
            2,
        ),
    ],
    "connections": {
        "Manual Trigger": {"main": [[{"node": "Set CRM Growth Config", "type": "main", "index": 0}]]},
        "Daily CRM Growth Schedule": {"main": [[{"node": "Set CRM Growth Config", "type": "main", "index": 0}]]},
        "Scraped Leads Webhook": {"main": [[{"node": "Set CRM Growth Config", "type": "main", "index": 0}]]},
        "Set CRM Growth Config": {"main": [[{"node": "If Direct Lead Payload", "type": "main", "index": 0}]]},
        "If Direct Lead Payload": {
            "main": [
                [{"node": "Normalize Inbound Leads", "type": "main", "index": 0}],
                [{"node": "Fetch Scraped Leads CSV", "type": "main", "index": 0}],
            ]
        },
        "Fetch Scraped Leads CSV": {"main": [[{"node": "Normalize Inbound Leads", "type": "main", "index": 0}]]},
        "Normalize Inbound Leads": {"main": [[{"node": "Filter Valid Leads", "type": "main", "index": 0}]]},
        "Filter Valid Leads": {"main": [[{"node": "Prepare CRM Upserts", "type": "main", "index": 0}]]},
        "Prepare CRM Upserts": {"main": [[{"node": "Upsert Prospects Into CRM", "type": "main", "index": 0}]]},
        "Upsert Prospects Into CRM": {"main": [[{"node": "Build CRM Import Summary", "type": "main", "index": 0}]]},
        "Build CRM Import Summary": {"main": [[{"node": "If Dispatch To V4", "type": "main", "index": 0}]]},
        "If Dispatch To V4": {
            "main": [
                [{"node": "Execute V4 Batch Workflow", "type": "main", "index": 0}],
                [{"node": "Fetch CRM Ready Snapshot", "type": "main", "index": 0}],
            ]
        },
        "Execute V4 Batch Workflow": {"main": [[{"node": "Fetch CRM Ready Snapshot", "type": "main", "index": 0}]]},
        "Fetch CRM Ready Snapshot": {"main": [[{"node": "Fetch Today Outreach Snapshot", "type": "main", "index": 0}]]},
        "Fetch Today Outreach Snapshot": {"main": [[{"node": "Build End Of Run Summary", "type": "main", "index": 0}]]},
    },
}


OUTPUT.write_text(json.dumps(workflow, ensure_ascii=False, indent=2), encoding="utf-8")
print(OUTPUT)
