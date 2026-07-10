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

interface DemoRequest {
  visitor_name?: string;
}

// Scénario fixe (Diplomatie) — 100% fictif, vérifié en conditions réelles le 09-10/07/2026.
// Volontairement non paramétrable par le visiteur : évite toute injection de contenu
// arbitraire dans un formulaire public qui appelle un vrai LLM et envoie un vrai email.
const DEMO_PAYLOAD = {
  type_courrier: "Note de confirmation",
  destinataire: "Ambassade du Royaume du Maroc à Abidjan",
  destinataire_email: "protocole@ambassade-maroc-ci.example",
  objet: "Confirmation de rendez-vous et accréditation",
  instructions:
    "Merci de rédiger un courrier confirmant à M. Abdellah Benkirane que sa demande a été validée, référence diplomatique : DIP-2026-04471. Il est domicilié à la Résidence de l'Ambassade, Riviera Golf, Abidjan. Le joindre au +225 07 45 12 33 89 ou par email a.benkirane@diplomatie-test.example.",
  expediteur: "Cabinet du Secrétaire Général",
  organisation: "Ministère des Affaires Étrangères de Côte d'Ivoire",
  email_validation: "marius.ayoro70@gmail.com",
  email_secretaire: "contact@transferai.ci",
  langue: "fr",
};

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

  const { data: inserted, error: insertError } = await supabase
    .from("courrier_pii_demo_submissions")
    .insert({ visitor_name: visitorName || null, status: "processing" })
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
      body: JSON.stringify(DEMO_PAYLOAD),
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
