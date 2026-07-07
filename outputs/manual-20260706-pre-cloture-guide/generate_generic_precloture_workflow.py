import json
from pathlib import Path

SOURCE = Path("/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/127_n8n_Demo_Pre_Cloture_Bancaire_Validation_Humaine_05juillet2026.json")
OUTPUT_DIR = Path("/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/outputs/manual-20260706-pre-cloture-guide")
TARGETS = [
    OUTPUT_DIR / "128_n8n_Pre_Cloture_Bancaire_Multi_Banques_Exportable_06juillet2026.json",
    OUTPUT_DIR / "workflow_precloture_bancaire_multibanques_n8n.json",
]


def update_demo_code(js_code: str) -> str:
    replacements = {
        "SIB - Direction financiere": "Banque participante - Direction financiere",
        "controle.financier@sib.ci": "controle.financier@banque.com",
        "comptabilite@sib.ci": "comptabilite@banque.com",
        "audit.interne@sib.ci": "audit.interne@banque.com",
    }
    for old, new in replacements.items():
        js_code = js_code.replace(old, new)
    return js_code


def update_webhook_defaults(js_code: str) -> str:
    replacements = {
        "controle.financier@sib.ci": "controle.financier@banque.com",
        "Banque - Direction financiere": "Banque participante - Direction financiere",
        "['controle.financier@sib.ci']": "['controle.financier@banque.com']",
    }
    for old, new in replacements.items():
        js_code = js_code.replace(old, new)
    return js_code


def update_text_defaults(js_code: str) -> str:
    replacements = {
        "controle.financier@sib.ci": "controle.financier@banque.com",
        "['controle.financier@sib.ci']": "['controle.financier@banque.com']",
    }
    for old, new in replacements.items():
        js_code = js_code.replace(old, new)
    return js_code


def pseudonymization_node() -> dict:
    return {
        "id": "pcb-005b",
        "name": "Masquer donnees sensibles pour IA",
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [840, 280],
        "parameters": {
            "jsCode": (
                "const data = $input.first().json;\n"
                "const anomalies = Array.isArray(data.anomalies) ? data.anomalies : [];\n"
                "\n"
                "function sanitizeText(value) {\n"
                "  return String(value || '')\n"
                "    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/gi, '[email masque]')\n"
                "    .replace(/\\+?\\d[\\d\\s().-]{7,}\\d/g, '[telephone masque]')\n"
                "    .replace(/\\b\\d{8,}\\b/g, '[identifiant masque]')\n"
                "    .trim();\n"
                "}\n"
                "\n"
                "const anomaliesForAi = anomalies.map((item, index) => ({\n"
                "  anomaly_ref: `ANOM-${String(index + 1).padStart(3, '0')}`,\n"
                "  account_family: item.account_code ? `${String(item.account_code).slice(0, 3)}***` : 'N/A',\n"
                "  account_label_sanitized: sanitizeText(item.account_label),\n"
                "  current_amount: Number(item.current_amount || 0),\n"
                "  previous_amount: Number(item.previous_amount || 0),\n"
                "  absolute_variation: Number(item.absolute_variation || 0),\n"
                "  relative_variation: Number(item.relative_variation || 0),\n"
                "  missing_support: Boolean(item.missing_support),\n"
                "  threshold_breach: Boolean(item.threshold_breach),\n"
                "  severity: item.severity || 'moyenne',\n"
                "  owner_team: sanitizeText(item.owner),\n"
                "  observation: sanitizeText(item.observation)\n"
                "}));\n"
                "\n"
                "return [{\n"
                "  json: {\n"
                "    ...data,\n"
                "    entity_for_ai: 'Banque operant en Cote d Ivoire - direction financiere',\n"
                "    anomalies_for_ai: anomaliesForAi,\n"
                "    pii_protection: {\n"
                "      mode: 'pseudonymisation',\n"
                "      masked_fields: ['entity', 'account_code', 'account_label', 'owner', 'emails', 'telephones', 'identifiants longs'],\n"
                "      note: 'Seules les donnees strictement necessaires a l analyse des ecarts sont transmises au modele IA.'\n"
                "    }\n"
                "  }\n"
                "}];"
            )
        },
    }


def update_ai_node(node: dict) -> None:
    node["parameters"]["jsonBody"] = """={{ JSON.stringify({
  model: 'gpt-4o-mini',
  temperature: 0.2,
  response_format: { type: 'json_object' },
  messages: [
    {
      role: 'system',
      content: 'Tu es un assistant de direction financiere. Tu rediges en francais professionnel, sobre et actionnable. Tu reponds uniquement en JSON valide avec les cles: executive_summary, what_moved, review_now, can_wait, escalate_to_manager, managerial_comment.'
    },
    {
      role: 'user',
      content: 'Contexte: pre-cloture bancaire pour ' + $json.entity_for_ai + ' sur la periode ' + $json.report_period + '. Les donnees sensibles ont deja ete pseudonymisees avant traitement IA.\\n\\nKPI: ' + JSON.stringify($json.kpi) + '\\n\\nAnomalies pseudonymisees: ' + JSON.stringify($json.anomalies_for_ai) + '\\n\\nConsignes: 1) prioriser les ecarts vraiment utiles au management ; 2) rester prudent ; 3) mentionner explicitement qu une validation humaine reste obligatoire ; 4) produire des puces courtes et exploitables ; 5) ne pas reconstituer ni supposer des donnees personnelles.'
    }
  ]
}) }}"""


def update_parser_node(node: dict) -> None:
    js_code = node["parameters"]["jsCode"]
    old = "  <p style=\"font-size:12px;color:#6b7280\">Synthese preparee automatiquement. Validation humaine obligatoire avant tout usage officiel.</p>"
    new = "  <p style=\"font-size:12px;color:#6b7280\">Synthese preparee automatiquement a partir de donnees pseudonymisees. Validation humaine obligatoire avant tout usage officiel.</p>"
    node["parameters"]["jsCode"] = js_code.replace(old, new)


def insert_pii_step(data: dict) -> dict:
    nodes = data.get("nodes", [])
    if not any(node.get("name") == "Masquer donnees sensibles pour IA" for node in nodes):
        for index, node in enumerate(nodes):
            if node.get("name") == "Generer synthese IA":
                nodes.insert(index, pseudonymization_node())
                break

    for node in nodes:
        if node.get("name") == "Generer synthese IA":
            update_ai_node(node)
        elif node.get("name") in {"Parser synthese et HTML", "Recomposer HTML final"}:
            update_parser_node(node)

    connections = data.setdefault("connections", {})
    connections["Detecter ecarts et priorites"] = {
        "main": [[{"node": "Masquer donnees sensibles pour IA", "type": "main", "index": 0}]]
    }
    connections["Masquer donnees sensibles pour IA"] = {
        "main": [[{"node": "Generer synthese IA", "type": "main", "index": 0}]]
    }
    return data


def main() -> None:
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    data["name"] = "Pre_Cloture_Bancaire_Multi_Banques_Validation_Humaine"
    data["meta"]["description"] = (
        "Workflow exportable n8n - pre-cloture bancaire multi-banques avec "
        "detection d ecarts, pseudonymisation des donnees sensibles, synthese IA et "
        "validation humaine avant diffusion."
    )

    for node in data.get("nodes", []):
        if node.get("name") == "Jeu de donnees demo":
            node["parameters"]["jsCode"] = update_demo_code(node["parameters"]["jsCode"])
        elif node.get("name") == "Normaliser entree webhook":
            node["parameters"]["jsCode"] = update_webhook_defaults(node["parameters"]["jsCode"])
        elif node.get("name") in {
            "Construire email validation",
            "Envoyer email validation",
            "Envoyer synthese finale",
        }:
            for key, value in list(node.get("parameters", {}).items()):
                if isinstance(value, str):
                    node["parameters"][key] = update_text_defaults(value)

    data = insert_pii_step(data)

    for target in TARGETS:
        target.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
