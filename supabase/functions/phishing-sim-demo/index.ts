import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
// URL du webhook "phishing-sim-lancer" du workflow n8n Simulateur_Phishing_Sensibilisation_V1,
// hébergé sur l'instance Hostinger (n8n-pxlk.srv1480638.hstgr.cloud).
const n8nWebhookUrl = Deno.env.get("N8N_PHISHING_SIM_DEMO_WEBHOOK_URL")?.trim() ?? "";
const n8nTimeoutMs = Number(Deno.env.get("N8N_PHISHING_SIM_DEMO_TIMEOUT_MS") ?? "15000");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type TemplateId = "support-it" | "colis" | "facture";
const VALID_TEMPLATES: TemplateId[] = ["support-it", "colis", "facture"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface DemoRequest {
  visitor_name?: string;
  visitor_email?: string;
  template?: string;
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
  const visitorEmail = (payload.visitor_email ?? "").trim().slice(0, 200);
  const requestedTemplate = (payload.template ?? "").trim().toLowerCase();

  if (!EMAIL_RE.test(visitorEmail)) {
    return new Response(
      JSON.stringify({ error: "missing_or_invalid_fields", detail: "visitor_email invalide" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const template: TemplateId = VALID_TEMPLATES.includes(requestedTemplate as TemplateId)
    ? (requestedTemplate as TemplateId)
    : "support-it";

  const { data: inserted, error: insertError } = await supabase
    .from("phishing_sim_demo_submissions")
    .insert({ visitor_name: visitorName || null, template, status: "processing" })
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
      .from("phishing_sim_demo_submissions")
      .update({ status: "error", error_message: "N8N_PHISHING_SIM_DEMO_WEBHOOK_URL non configuré" })
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
      body: JSON.stringify({ visitor_name: visitorName, visitor_email: visitorEmail, template }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const n8nText = await n8nRes.text();

    if (!n8nRes.ok) {
      throw new Error(`n8n_http_${n8nRes.status}: ${n8nText}`);
    }

    await supabase
      .from("phishing_sim_demo_submissions")
      .update({ status: "sent", n8n_response: n8nText })
      .eq("id", submissionId);

    return new Response(
      JSON.stringify({ submission_id: submissionId, status: "sent" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    await supabase
      .from("phishing_sim_demo_submissions")
      .update({ status: "error", error_message: message })
      .eq("id", submissionId);
    return new Response(
      JSON.stringify({ error: "n8n_call_failed", detail: message, submission_id: submissionId }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
