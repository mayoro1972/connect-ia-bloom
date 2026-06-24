from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs" / "transferai-admin"
SOURCE = DOCS_DIR / "44_n8n_Prospection_Modele_Elton_V3_Approval_AutoSend.json"
TARGET = DOCS_DIR / "62_n8n_Prospection_Multi_Prospect_V3_CRM_Ready_Export.json"


def find_node(nodes: list[dict], name: str) -> dict:
    for node in nodes:
        if node["name"] == name:
            return node
    raise KeyError(name)


def replace_strings(value, replacements: list[tuple[str, str]]):
    if isinstance(value, str):
        updated = value
        for before, after in replacements:
            updated = updated.replace(before, after)
        return updated
    if isinstance(value, list):
        return [replace_strings(item, replacements) for item in value]
    if isinstance(value, dict):
        return {key: replace_strings(item, replacements) for key, item in value.items()}
    return value


def main() -> None:
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    nodes = data["nodes"]
    connections = data["connections"]

    audit_form_expr = (
        "(($json.audit_form_base_url || $env.AUDIT_FORM_BASE_URL || "
        "'http://127.0.0.1:4177/questionnaire-audit') + "
        "'?pack_id=' + encodeURIComponent($json.pack_id || '') + "
        "(($json.audit_form_query_suffix || $env.AUDIT_FORM_QUERY_SUFFIX || '_reload=7') "
        "? '&' + String($json.audit_form_query_suffix || $env.AUDIT_FORM_QUERY_SUFFIX || '_reload=7').replace(/^[?&]+/, '') "
        ": ''))"
    )

    data["name"] = "TransferAI Prospecting Multi-Prospect V3 CRM Ready Export"
    data["versionId"] = "transferai-prospecting-multi-prospect-v3-crm-ready-export"
    data["tags"] = [
        {"name": "transferai"},
        {"name": "prospection"},
        {"name": "n8n"},
        {"name": "multi-prospect"},
        {"name": "v3"},
        {"name": "crm"},
        {"name": "ready"},
    ]

    set_target = find_node(nodes, "Set Target")
    set_target["parameters"]["includeOtherFields"] = True
    values = set_target["parameters"]["fields"]["values"]
    existing_names = {item["name"] for item in values}
    for field in [
        ("source_backend", "={{$json.source_backend || 'manual'}}"),
        ("source_label", "={{$json.source_label || ''}}"),
        ("raw_source_id", "={{$json.raw_source_id || ''}}"),
        ("niche_status", "={{$json.niche_status || ''}}"),
        ("last_response_status", "={{$json.last_response_status || ''}}"),
        ("last_sequence_result", "={{$json.last_sequence_result || ''}}"),
        ("audit_form_base_url", "={{$json.audit_form_base_url || $env.AUDIT_FORM_BASE_URL || 'http://127.0.0.1:4177/questionnaire-audit'}}"),
        ("audit_form_query_suffix", "={{$json.audit_form_query_suffix || $env.AUDIT_FORM_QUERY_SUFFIX || '_reload=7'}}"),
    ]:
        if field[0] not in existing_names:
            values.append({"name": field[0], "type": "string", "stringValue": field[1]})

    assemble_pack = find_node(nodes, "Assemble Prospect Pack")
    assemble_pack["parameters"]["jsCode"] = (
        "function textFrom(nodeName) {\n"
        "  return $(nodeName).first().json?.choices?.[0]?.message?.content || '';\n"
        "}\n\n"
        "function jsonFrom(nodeName) {\n"
        "  const raw = textFrom(nodeName) || '{}';\n"
        "  try {\n"
        "    return JSON.parse(raw);\n"
        "  } catch (e) {\n"
        "    return { parse_error: `${nodeName}: ${e.message}`, raw };\n"
        "  }\n"
        "}\n\n"
        "function hydrateString(value, ctx) {\n"
        "  return String(value)\n"
        "    .replace(/\\{\\{ORGANIZATION_NAME\\}\\}/g, ctx.organization_name || '')\n"
        "    .replace(/\\{\\{DECISION_MAKER_NAME\\}\\}/g, ctx.decision_maker_name || '')\n"
        "    .replace(/\\{\\{WEBSITE\\}\\}/g, ctx.website || '');\n"
        "}\n\n"
        "function hydrateValue(value, ctx) {\n"
        "  if (typeof value === 'string') return hydrateString(value, ctx);\n"
        "  if (Array.isArray(value)) return value.map((item) => hydrateValue(item, ctx));\n"
        "  if (value && typeof value === 'object') {\n"
        "    const out = {};\n"
        "    for (const [key, inner] of Object.entries(value)) out[key] = hydrateValue(inner, ctx);\n"
        "    return out;\n"
        "  }\n"
        "  return value;\n"
        "}\n\n"
        "const ctx = $('Assemble Prospect Context').first().json;\n"
        "const executiveLetter = hydrateString(textFrom('Generate Executive Letter'), ctx);\n"
        "const tailoredCatalogue = hydrateString(textFrom('Generate Tailored Catalogue'), ctx);\n"
        "const tailoredAuditForm = hydrateString(textFrom('Generate Tailored Audit Form'), ctx);\n"
        "const deckBrief = hydrateValue(jsonFrom('Generate Deck Brief'), ctx);\n"
        "const requiresEmail = Object.prototype.hasOwnProperty.call(ctx, 'target_email');\n"
        "const approvedForSend = Boolean(ctx.organization_name && ctx.entry_point_niche && ctx.recommended_offer && (!requiresEmail || ctx.target_email));\n"
        "const packId = ctx.pack_id || `pack-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;\n"
        "const auditBaseUrl = (ctx.audit_form_base_url || $env.AUDIT_FORM_BASE_URL || 'http://127.0.0.1:4177/questionnaire-audit').trim();\n"
        "const rawAuditSuffix = String(ctx.audit_form_query_suffix || $env.AUDIT_FORM_QUERY_SUFFIX || '_reload=7').trim();\n"
        "const cleanAuditSuffix = rawAuditSuffix.replace(/^[?&]+/, '');\n"
        "let auditFormUrl = String(ctx.audit_form_url || '').trim();\n"
        "if (!auditFormUrl) {\n"
        "  auditFormUrl = `${auditBaseUrl}${auditBaseUrl.includes('?') ? '&' : '?'}pack_id=${encodeURIComponent(packId)}`;\n"
        "  if (cleanAuditSuffix) auditFormUrl += `&${cleanAuditSuffix}`;\n"
        "}\n"
        "const executiveLetterHtml = executiveLetter.replace(/\\n/g, '<br>');\n\n"
        "return [{\n"
        "  json: {\n"
        "    ...ctx,\n"
        "    pack_id: packId,\n"
        "    audit_form_base_url: auditBaseUrl,\n"
        "    audit_form_query_suffix: rawAuditSuffix,\n"
        "    audit_form_url: auditFormUrl,\n"
        "    executive_letter: executiveLetter,\n"
        "    executive_letter_html: executiveLetterHtml,\n"
        "    tailored_catalogue: tailoredCatalogue,\n"
        "    tailored_audit_form: tailoredAuditForm,\n"
        "    deck_brief: deckBrief,\n"
        "    approved_for_send: approvedForSend,\n"
        "    llm_redaction_summary: ctx.llm_redaction_summary,\n"
        "    llm_allowed_payload: ctx.llm_allowed_payload,\n"
        "    llm_generation_payload: ctx.llm_generation_payload\n"
        "  }\n"
        "}];"
    )

    build_approval = find_node(nodes, "Build Approval Email")
    build_approval["parameters"]["jsCode"] = (
        "const pack = $('Assemble Prospect Pack').first().json;\n"
        "const baseUrl = $env.N8N_BASE_URL || 'https://your-n8n.example.com';\n"
        "const approveUrl = `${baseUrl}/webhook/approve-prospect-pack-v3?pack_id=${encodeURIComponent(pack.pack_id)}&decision=approved`;\n"
        "const rejectUrl = `${baseUrl}/webhook/approve-prospect-pack-v3?pack_id=${encodeURIComponent(pack.pack_id)}&decision=rejected`;\n"
        "const auditFormUrl = pack.audit_form_url || pack.payload?.audit_form_url || 'a confirmer';\n"
        "const summary = [\n"
        "  `Organisation: ${pack.organization_name}`,\n"
        "  `Cas d'usage: ${pack.best_selling_use_case || pack.recommended_use_case || 'à confirmer'}`,\n"
        "  `Tier: ${pack.commercial_priority_tier || 'n/a'}`,\n"
        "  `Lien formulaire: ${auditFormUrl}`,\n"
        "  `CTA: ${pack.single_primary_cta}`\n"
        "].join('<br>');\n"
        "return [{ json: { ...pack, approve_url: approveUrl, reject_url: rejectUrl, internal_review_html: `<p>Un nouveau prospect pack est prêt à valider.</p><p>${summary}</p><p><a href=\"${approveUrl}\">Approuver et envoyer</a></p><p><a href=\"${rejectUrl}\">Rejeter</a></p>` } }];"
    )

    store_pack = find_node(nodes, "Store Pack In Supabase")
    store_pack["parameters"]["jsonBody"] = (
        "={{JSON.stringify({ "
        "pack_id: $json.pack_id, "
        "prospect_id: $json.prospect_id || null, "
        "organization_name: $json.organization_name, "
        "decision_maker_name: $json.decision_maker_name, "
        "target_email: $json.target_email, "
        "website: $json.website, "
        "status: 'pending_approval', "
        "payload: $json, "
        "llm_redaction_summary: $json.llm_redaction_summary || null, "
        "reviewer_email: null, "
        "error_reason: null, "
        "created_at: new Date().toISOString() "
        "})}}"
    )

    extract_pack = find_node(nodes, "Extract Pack Payload")
    extract_pack["parameters"]["jsCode"] = (
        "const rows = Array.isArray($json) ? $json : Array.isArray($json.data) ? $json.data : Array.isArray($json.body) ? $json.body : [];\n"
        "const row = rows[0] || {};\n"
        "const payload = row.payload || {};\n"
        "const decision = $('Parse Approval Query').first().json.decision;\n"
        "const executiveLetterHtml = String(payload.executive_letter_html || payload.executive_letter || '').replace(/\\n/g, '<br>');\n"
        "return [{ json: { "
        "row_id: row.id || null, "
        "pack_id: row.pack_id || payload.pack_id, "
        "prospect_id: row.prospect_id || payload.prospect_id || null, "
        "decision, "
        "target_email: row.target_email || payload.target_email, "
        "organization_name: row.organization_name || payload.organization_name, "
        "website: row.website || payload.website || '', "
        "decision_maker_name: row.decision_maker_name || payload.decision_maker_name || '', "
        "source_backend: payload.source_backend || 'supabase', "
        "source_label: payload.source_label || '', "
        "raw_source_id: payload.raw_source_id || null, "
        "audit_form_url: row.audit_form_url || payload.audit_form_url || '', "
        "executive_letter: payload.executive_letter || '', "
        "executive_letter_html: executiveLetterHtml, "
        "payload "
        "} }];"
    )

    build_send_context = find_node(nodes, "Build Send Context")
    build_send_context["parameters"]["jsCode"] = (
        "const canSend = Boolean($json.target_email && $json.executive_letter && $json.executive_letter.trim().length > 0);\n"
        "const reason = canSend ? null : 'Email cible ou contenu du courrier manquant.';\n"
        "const auditFormUrl = $json.audit_form_url || $json.payload?.audit_form_url || '';\n"
        "const auditBlock = auditFormUrl\n"
        "  ? `<br><br><p><strong>Formulaire d'audit pre-RDV :</strong> <a href=\"${auditFormUrl}\">${auditFormUrl}</a></p><p>Merci de le remplir avant le rendez-vous afin que nos experts preparent un audit sur mesure.</p>`\n"
        "  : '';\n"
        "return [{ json: { ...$json, can_send: canSend, send_failure_reason: reason, external_email_html: ($json.executive_letter_html || String($json.executive_letter || '').replace(/\\n/g, '<br>')) + auditBlock } }];"
    )

    send_external = find_node(nodes, "Send External Prospect Email")
    send_external["parameters"]["jsonBody"] = (
        "={{JSON.stringify({ "
        "from: $env.OUTREACH_FROM_EMAIL || 'prospection@transferai.africa', "
        "to: [$json.target_email], "
        "subject: 'Proposition d\\'audit gratuit, d\\'accompagnement et de formation', "
        "html: $json.external_email_html || $json.executive_letter_html "
        "})}}"
    )

    log_outreach = find_node(nodes, "Log Outreach Attempt")
    log_outreach["parameters"]["jsonBody"] = (
        "={{JSON.stringify({ "
        "organization_id: null, "
        "person_id: null, "
        "prospect_id: $json.prospect_id || null, "
        "pack_id: $json.pack_id || null, "
        "target_email: $json.target_email || null, "
        "organization_name: $json.organization_name || null, "
        "channel: 'email', "
        "message_variant: 'executive_multi_prospect_model_v3_crm_ready', "
        "sent_at: $json.sent_at || new Date().toISOString(), "
        "delivery_status: 'submitted', "
        "response_status: 'pending', "
        "stop_reason: null, "
        "metadata: { "
        "source_backend: $json.source_backend || null, "
        "source_label: $json.source_label || null, "
        "raw_source_id: $json.raw_source_id || null, "
        "website: $json.website || null, "
        "decision_maker_name: $json.decision_maker_name || null, "
        "commercial_priority_tier: $json.payload?.commercial_priority_tier || null, "
        "best_selling_use_case: $json.payload?.best_selling_use_case || null "
        "} "
        "})}}"
    )

    mark_pack_sent = find_node(nodes, "Mark Pack Sent")
    mark_pack_sent["parameters"]["jsonBody"] = (
        "={{JSON.stringify({ "
        "status: 'sent', "
        "approved_at: new Date().toISOString(), "
        "sent_at: $json.sent_at, "
        "resend_message_id: $json.resend_id "
        "})}}"
    )

    update_sent = {
        "parameters": {
            "method": "PATCH",
            "url": "={{$env.SUPABASE_URL + '/rest/v1/prospect_targets?prospect_id=eq.' + encodeURIComponent($json.prospect_id)}}",
            "authentication": "none",
            "sendHeaders": True,
            "headerParameters": {
                "parameters": [
                    {"name": "apikey", "value": "={{$env.SUPABASE_SERVICE_ROLE_KEY}}"},
                    {"name": "Authorization", "value": "={{'Bearer ' + $env.SUPABASE_SERVICE_ROLE_KEY}}"},
                    {"name": "Content-Type", "value": "application/json"},
                ]
            },
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={{JSON.stringify({ status: 'active', last_sequence_result: 'sent_v3', last_response_status: 'pending', stop_reason: null, niche_status: 'outreach_started', next_action_at: new Date(Date.now() + 5 * 86400000).toISOString() })}}",
            "options": {},
        },
        "id": "node-042",
        "name": "Update Prospect Target Sent",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [4040, 260],
    }

    update_error = {
        "parameters": {
            "method": "PATCH",
            "url": "={{$env.SUPABASE_URL + '/rest/v1/prospect_targets?prospect_id=eq.' + encodeURIComponent($json.prospect_id)}}",
            "authentication": "none",
            "sendHeaders": True,
            "headerParameters": {
                "parameters": [
                    {"name": "apikey", "value": "={{$env.SUPABASE_SERVICE_ROLE_KEY}}"},
                    {"name": "Authorization", "value": "={{'Bearer ' + $env.SUPABASE_SERVICE_ROLE_KEY}}"},
                    {"name": "Content-Type", "value": "application/json"},
                ]
            },
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={{JSON.stringify({ status: 'paused', paused: true, last_sequence_result: 'approval_error_v3', stop_reason: $json.send_failure_reason || 'approval_error', niche_status: 'internal_fix_required' })}}",
            "options": {},
        },
        "id": "node-043",
        "name": "Update Prospect Target Approval Error",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [3540, 500],
    }

    update_rejected = {
        "parameters": {
            "method": "PATCH",
            "url": "={{$env.SUPABASE_URL + '/rest/v1/prospect_targets?prospect_id=eq.' + encodeURIComponent($json.prospect_id)}}",
            "authentication": "none",
            "sendHeaders": True,
            "headerParameters": {
                "parameters": [
                    {"name": "apikey", "value": "={{$env.SUPABASE_SERVICE_ROLE_KEY}}"},
                    {"name": "Authorization", "value": "={{'Bearer ' + $env.SUPABASE_SERVICE_ROLE_KEY}}"},
                    {"name": "Content-Type", "value": "application/json"},
                ]
            },
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": "={{JSON.stringify({ status: 'ready', last_sequence_result: 'rejected_internal_v3', stop_reason: 'internal_review_rejected', niche_status: 'needs_manual_revision' })}}",
            "options": {},
        },
        "id": "node-044",
        "name": "Update Prospect Target Rejected",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [3300, 700],
    }

    nodes.extend([update_sent, update_error, update_rejected])

    replacements = [
        (
            "var auditFormUrl = safeString(src.audit_form_url || 'https://audit.transferai.ci/');",
            "var auditFormUrl = safeString(src.audit_form_url || (($json.audit_form_base_url || $env.AUDIT_FORM_BASE_URL || 'http://127.0.0.1:4177/questionnaire-audit') + '?pack_id=' + encodeURIComponent(packId) + (($json.audit_form_query_suffix || $env.AUDIT_FORM_QUERY_SUFFIX || '_reload=7') ? '&' + String($json.audit_form_query_suffix || $env.AUDIT_FORM_QUERY_SUFFIX || '_reload=7').replace(/^[?&]+/, '') : '')));",
        ),
        (
            "un Formulaire d audit pre-RDV a completer via ce lien : https://audit.transferai.ci/ ;",
            "un Formulaire d audit pre-RDV a completer via le lien audit_form_url fourni dans le contexte prospect ;",
        ),
        (
            "public_text_sanitized_excerpt: $json.llm_allowed_payload?.public_text_sanitized_excerpt || '' }, null, 2)}`",
            "public_text_sanitized_excerpt: $json.llm_allowed_payload?.public_text_sanitized_excerpt || '', audit_form_url: $json.audit_form_url || " + audit_form_expr + " }, null, 2)}`",
        ),
    ]

    data = replace_strings(data, replacements)
    connections = data["connections"]

    connections["Mark Pack Sent"] = {"main": [[{"node": "Log Outreach Attempt", "type": "main", "index": 0}]]}
    connections["Log Outreach Attempt"] = {"main": [[{"node": "Update Prospect Target Sent", "type": "main", "index": 0}]]}
    connections["Update Prospect Target Sent"] = {"main": [[{"node": "Send Internal Sent Confirmation", "type": "main", "index": 0}]]}
    connections["Mark Pack Approval Error"] = {"main": [[{"node": "Update Prospect Target Approval Error", "type": "main", "index": 0}]]}
    connections["Update Prospect Target Approval Error"] = {"main": [[{"node": "Approval Error Response", "type": "main", "index": 0}]]}
    connections["Mark Pack Rejected"] = {"main": [[{"node": "Update Prospect Target Rejected", "type": "main", "index": 0}]]}
    connections["Update Prospect Target Rejected"] = {"main": [[{"node": "Rejection Response", "type": "main", "index": 0}]]}

    TARGET.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(TARGET)


if __name__ == "__main__":
    main()
