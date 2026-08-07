import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
// URL du webhook "courrier-automatique-v2" du workflow n8n Courrier_Automatique_v2_PII,
// hébergé sur l'instance Hostinger (n8n-pxlk.srv1480638.hstgr.cloud).
const n8nWebhookUrl = Deno.env.get("N8N_COURRIER_PII_DEMO_WEBHOOK_URL")?.trim() ?? "";
const n8nTimeoutMs = Number(Deno.env.get("N8N_COURRIER_PII_DEMO_TIMEOUT_MS") ?? "15000");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type ScenarioId = "diplomatie" | "rh" | "finance" | "marketing" | "education";

interface DemoRequest {
  visitor_name?: string;
  scenario?: string;
}

// 5 scénarios fixes, un par secteur — 100% fictifs, chacun vérifié en conditions réelles
// (Diplomatie le 09-10/07/2026, RH/Finance/Marketing le 12/07/2026, Éducation le 07/08/2026
// pour la démonstration Pigier CI — courrier_id CRR-1786139796434, statut sent_for_validation confirmé).
// Volontairement non paramétrables par le visiteur : évite toute injection de contenu
// arbitraire dans un formulaire public qui appelle un vrai LLM et envoie un vrai email.
// Le champ manager de validation reste toujours interne (Marius clique en direct devant
// l'audience) — jamais une adresse fournie par le visiteur.
const SCENARIOS: Record<ScenarioId, Record<string, string>> = {
  diplomatie: {
    type_courrier: "Note de confirmation",
    destinataire: "Ambassade du Royaume du Maroc à Abidjan",
    destinataire_email: "protocole@ambassade-maroc-ci.example",
    objet: "Confirmation de rendez-vous et accréditation",
    instructions:
      "Merci de rédiger un courrier confirmant à M. Abdellah Benkirane que sa demande a été validée, référence diplomatique : DIP-2026-04471. Il est domicilié à la Résidence de l'Ambassade, Riviera Golf, Abidjan. Le joindre au +225 07 45 12 33 89 ou par email a.benkirane@diplomatie-test.example.",
    expediteur: "Cabinet du Secrétaire Général",
    organisation: "Ministère des Affaires Étrangères de Côte d'Ivoire",
  },
  rh: {
    type_courrier: "Convocation à un entretien",
    destinataire: "M. Serge Yao",
    destinataire_email: "serge.yao@exemple-rh.test",
    objet: "Convocation à un entretien",
    instructions:
      "Merci de convoquer M. Serge Yao pour un entretien disciplinaire. CNI n° CI0045781239. Il est domicilié à Yopougon Selmer, Abidjan. Le joindre au 05 89 23 47 11 ou par email serge.yao@exemple-rh.test.",
    expediteur: "Direction des Ressources Humaines",
    organisation: "Entreprise Test SARL",
  },
  finance: {
    type_courrier: "Confirmation de réception de virement",
    destinataire: "Mme Adjoua Kouassi",
    destinataire_email: "a.kouassi@client-banque-test.example",
    objet: "Confirmation de réception de virement",
    instructions:
      "Merci d'informer Mme Adjoua Kouassi que le virement de 2 500 000 FCFA vers son IBAN CI93CI0080123456789012345 a bien été reçu. Son passeport n° 12AB34567 reste en cours de vérification. Adresse : Cocody 2 Plateaux, Abidjan. La joindre au 07 12 34 56 78.",
    expediteur: "Service Relation Client",
    organisation: "Banque Test CI",
  },
  marketing: {
    type_courrier: "Confirmation de partenariat publicitaire",
    destinataire: "Agence Kaydan Digital",
    destinataire_email: "contact@kaydan-digital-test.example",
    objet: "Confirmation de collaboration campagne Q3 2026",
    instructions:
      "Merci de confirmer à Mme Fatou Diarra que le budget de campagne de 8 500 000 FCFA a été validé, référence contrat : MKT-2026-0092. Elle est joignable au 07 33 22 11 44 ou par email f.diarra@kaydan-digital-test.example.",
    expediteur: "Direction Marketing",
    organisation: "TransferAI Africa",
  },
  education: {
    type_courrier: "Convocation à un entretien disciplinaire",
    destinataire: "Mme Aïcha Traoré",
    destinataire_email: "a.traore@etudiant-pigier-test.example",
    objet: "Convocation - entretien disciplinaire",
    instructions:
      "Merci de convoquer Mme Aïcha Traoré, étudiante, référence dossier : PIG-2026-00734, pour un entretien disciplinaire suite à un incident signalé en salle de cours. Adresse : Cocody Angré, Abidjan. La joindre au 07 65 43 21 09 ou par email a.traore@etudiant-pigier-test.example. Copie à envoyer au tuteur légal, M. Ibrahim Traoré, joignable au 05 12 34 56 78.",
    expediteur: "Direction de la Vie Étudiante",
    organisation: "Pigier Côte d'Ivoire (scénario de démonstration)",
  },
};

function buildPayload(scenario: ScenarioId) {
  return {
    ...SCENARIOS[scenario],
    email_validation: "marius.ayoro70@gmail.com",
    email_secretaire: "contact@transferai.ci",
    langue: "fr",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let payload: DemoRequest;
  try {
    payload = await req.json();
  } catch {
    payload = {};
  }

  const visitorName = (payload.visitor_name ?? "").trim().slice(0, 120);
  const requestedScenario = (payload.scenario ?? "").trim().toLowerCase();
  const scenario: ScenarioId = (Object.keys(SCENARIOS) as ScenarioId[]).includes(
    requestedScenario as ScenarioId,
  )
    ? (requestedScenario as ScenarioId)
    : "diplomatie";

  const { data: inserted, error: insertError } = await supabase
    .from("courrier_pii_demo_submissions")
    .insert({ visitor_name: visitorName || null, status: "processing", scenario })
    .select("id")
    .single();

  if (insertError || !inserted) {
    return new Response(JSON.stringify({ error: "insert_failed", detail: insertError?.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const submissionId = inserted.id as string;

  if (!n8nWebhookUrl) {
    await supabase
      .from("courrier_pii_demo_submissions")
      .update({ status: "error", error_message: "N8N_COURRIER_PII_DEMO_WEBHOOK_URL non configuré" })
      .eq("id", submissionId);
    return new Response(
      JSON.stringify({ error: "webhook_not_configured", submission_id: submissionId }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), n8nTimeoutMs);

    const n8nRes = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(scenario)),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const n8nText = await n8nRes.text();

    if (!n8nRes.ok) {
      throw new Error(`n8n_http_${n8nRes.status}: ${n8nText}`);
    }

    let courrierId: string | null = null;
    try {
      courrierId = JSON.parse(n8nText)?.courrier_id ?? null;
    } catch {
      // réponse non-JSON, on garde n8n_response brut pour diagnostic
    }

    await supabase
      .from("courrier_pii_demo_submissions")
      .update({ status: "sent_for_validation", courrier_id: courrierId, n8n_response: n8nText })
      .eq("id", submissionId);

    return new Response(
      JSON.stringify({ submission_id: submissionId, status: "sent_for_validation", courrier_id: courrierId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    await supabase
      .from("courrier_pii_demo_submissions")
      .update({ status: "error", error_message: message })
      .eq("id", submissionId);
    return new Response(
      JSON.stringify({ error: "n8n_call_failed", detail: message, submission_id: submissionId }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
