import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
// URL de production du workflow n8n "TransferAI — Support IT Intelligent" (webhook "ticket-it").
const n8nWebhookUrl = Deno.env.get("N8N_SUPPORT_IT_DEMO_WEBHOOK_URL")?.trim() ?? "";
const n8nTimeoutMs = Number(Deno.env.get("N8N_SUPPORT_IT_DEMO_TIMEOUT_MS") ?? "20000");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const VALID_CHANNEL = new Set(["web", "email", "teams", "whatsapp"]);

interface TicketPayload {
  full_name?: string;
  email?: string;
  department?: string;
  subject?: string;
  description?: string;
  urgency?: string;
  channel?: string;
}

// Forme retournée par le nœud "🧾 Construire réponse API" du workflow n8n réel.
interface N8nDecision {
  ticket_id?: string;
  category?: string;
  confidence?: number;
  decision?: "auto_resolved" | "escalated";
  response_text?: string;
  escalated_to?: string;
  sla_target_minutes?: number;
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

  let payload: TicketPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const fullName = (payload.full_name ?? "").trim();
  const email = (payload.email ?? "").trim();
  const department = (payload.department ?? "").trim();
  const subject = (payload.subject ?? "").trim();
  const description = (payload.description ?? "").trim();
  const urgency = (payload.urgency ?? "normal").trim();
  const channel = VALID_CHANNEL.has(payload.channel ?? "") ? (payload.channel as string) : "web";

  // Le workflow n8n envoie un email de résolution/accusé directement à `email` : sans nom ni
  // email valides, le nœud d'envoi échoue et bloque toute l'exécution avant la réponse API.
  if (!fullName || !EMAIL_RE.test(email) || !subject || !description) {
    return new Response(
      JSON.stringify({ error: "missing_or_invalid_fields", detail: "full_name, email, subject et description sont requis" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const { data: inserted, error: insertError } = await supabase
    .from("it_support_demo_tickets")
    .insert({
      full_name: fullName,
      requester_email: email,
      department: department || null,
      title: subject,
      description,
      urgency,
      channel,
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

  const ticketId = inserted.id as string;

  if (!n8nWebhookUrl) {
    await supabase
      .from("it_support_demo_tickets")
      .update({ status: "error", error_message: "N8N_SUPPORT_IT_DEMO_WEBHOOK_URL non configuré" })
      .eq("id", ticketId);
    return new Response(
      JSON.stringify({ error: "webhook_not_configured", ticket_id: ticketId }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const startedAt = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), n8nTimeoutMs);

    const n8nRes = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Champs attendus par le nœud "🔧 Normalisation Ticket" du workflow réel.
      body: JSON.stringify({
        nom: fullName,
        email,
        departement: department,
        sujet: subject,
        description,
        urgence: urgency,
        source: channel,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!n8nRes.ok) {
      throw new Error(`n8n_http_${n8nRes.status}`);
    }

    const decision = (await n8nRes.json()) as N8nDecision;
    const executionMs = Date.now() - startedAt;
    const finalStatus = decision.decision === "escalated" ? "escalated" : "auto_resolved";

    await supabase
      .from("it_support_demo_tickets")
      .update({
        status: finalStatus,
        ai_category: decision.category ?? null,
        ai_confidence: decision.confidence ?? null,
        ai_response: decision.response_text ?? null,
        escalated_to: decision.escalated_to || null,
        sla_target_minutes: decision.sla_target_minutes ?? null,
        n8n_ticket_id: decision.ticket_id ?? null,
        n8n_execution_ms: executionMs,
      })
      .eq("id", ticketId);

    return new Response(
      JSON.stringify({ ticket_id: ticketId, status: finalStatus, execution_ms: executionMs, ...decision }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    await supabase
      .from("it_support_demo_tickets")
      .update({ status: "error", error_message: message })
      .eq("id", ticketId);
    return new Response(
      JSON.stringify({ error: "n8n_call_failed", detail: message, ticket_id: ticketId }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
