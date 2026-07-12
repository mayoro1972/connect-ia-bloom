import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
// URL du workflow n8n "Demo_Pre_Cloture_Bancaire_Validation_Humaine" (webhook "pre-cloture-bancaire-upload").
const n8nWebhookUrl = Deno.env.get("N8N_PRE_CLOTURE_DEMO_WEBHOOK_URL")?.trim() ?? "";
const n8nTimeoutMs = Number(Deno.env.get("N8N_PRE_CLOTURE_DEMO_TIMEOUT_MS") ?? "15000");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

interface RowPayload {
  account_code?: string;
  account_label?: string;
  current_amount?: number;
  previous_amount?: number;
  support_required?: boolean;
  support_received?: boolean;
  owner?: string;
}

interface SubmissionPayload {
  entity?: string;
  report_period?: string;
  currency?: string;
  manager_email?: string;
  recipients?: string[];
  absolute_variation_threshold?: number;
  relative_variation_threshold?: number;
  rows?: RowPayload[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  let payload: SubmissionPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const entity = (payload.entity ?? "").trim();
  const reportPeriod = (payload.report_period ?? "").trim();
  const currency = (payload.currency ?? "FCFA").trim();
  const managerEmail = (payload.manager_email ?? "").trim();
  const recipients = Array.isArray(payload.recipients) ? payload.recipients.filter(Boolean) : [];
  const rows = Array.isArray(payload.rows) ? payload.rows : [];

  // Sans entité, période, email valide et au moins un compte, la revue n'a pas de sens et le
  // workflow n8n ne pourrait de toute façon rien détecter ni envoyer.
  if (!entity || !reportPeriod || !EMAIL_RE.test(managerEmail) || rows.length === 0) {
    return new Response(
      JSON.stringify({
        error: "missing_or_invalid_fields",
        detail: "entity, report_period, manager_email (valide) et au moins un compte sont requis",
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const { data: inserted, error: insertError } = await supabase
    .from("pre_cloture_bancaire_demo_submissions")
    .insert({
      entity,
      report_period: reportPeriod,
      currency,
      manager_email: managerEmail,
      recipients,
      absolute_variation_threshold: payload.absolute_variation_threshold ?? null,
      relative_variation_threshold: payload.relative_variation_threshold ?? null,
      rows_count: rows.length,
      rows_payload: rows,
      status: "processing",
    })
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
      .from("pre_cloture_bancaire_demo_submissions")
      .update({ status: "error", error_message: "N8N_PRE_CLOTURE_DEMO_WEBHOOK_URL non configuré" })
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
      // Champs attendus par le nœud "Normaliser entree webhook" du workflow n8n réel.
      body: JSON.stringify({
        entity,
        report_period: reportPeriod,
        currency,
        manager_email: managerEmail,
        recipients: recipients.length ? recipients : [managerEmail],
        absolute_variation_threshold: payload.absolute_variation_threshold,
        relative_variation_threshold: payload.relative_variation_threshold,
        rows,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const n8nText = await n8nRes.text();

    if (!n8nRes.ok) {
      throw new Error(`n8n_http_${n8nRes.status}: ${n8nText}`);
    }

    // Le webhook n8n répond immédiatement ("Workflow was started") sans attendre l'issue de la
    // validation humaine par email : le statut "sent_for_validation" reflète uniquement le
    // déclenchement réussi du workflow, pas la décision finale du responsable.
    await supabase
      .from("pre_cloture_bancaire_demo_submissions")
      .update({ status: "sent_for_validation", n8n_response: n8nText })
      .eq("id", submissionId);

    return new Response(
      JSON.stringify({ submission_id: submissionId, status: "sent_for_validation", manager_email: managerEmail }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    await supabase
      .from("pre_cloture_bancaire_demo_submissions")
      .update({ status: "error", error_message: message })
      .eq("id", submissionId);
    return new Response(
      JSON.stringify({ error: "n8n_call_failed", detail: message, submission_id: submissionId }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
