import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { resolveAuditDomainAccess } from "../_shared/audit-domain-access.ts";

type ProspectFollowupRow = {
  id: string;
  full_name: string;
  email: string;
  company: string;
  profession: string | null;
  country: string | null;
  sector: string | null;
  language: string;
  wants_expert_appointment: boolean;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const MAIL_FROM = Deno.env.get("MAIL_FROM") ?? "TransferAI Africa <contact@transferai.ci>";
const MAIL_TO = Deno.env.get("MAIL_TO") ?? "contact@transferai.ci";
const SITE_URL = (Deno.env.get("PUBLIC_SITE_URL") ?? "https://www.transferai.ci").replace(/\/$/, "");
const AUDIT_FORM_URL =
  (Deno.env.get("PUBLIC_AUDIT_FORM_URL") ?? `${SITE_URL}/formulaire-audit-ia/index.html`).trim();
const AUDIT_LOGIN_URL =
  (Deno.env.get("PUBLIC_AUDIT_LOGIN_URL") ?? `${SITE_URL}/acces-formulaire-audit`).trim();
const AUDIT_BOOKING_URL =
  (
    Deno.env.get("PUBLIC_AUDIT_BOOKING_URL") ??
    "https://calendly.com/marius-ayoro70/devis-quote-preparation-call"
  ).trim();
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const batchSize = Number.parseInt(Deno.env.get("AUDIT_FOLLOWUP_BATCH_SIZE") ?? "25", 10);

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildAppointmentUrl = (_row: ProspectFollowupRow) => AUDIT_BOOKING_URL;

const buildMessage = (row: ProspectFollowupRow) => {
  const isEnglish = row.language?.toLowerCase().startsWith("en");
  const appointmentUrl = buildAppointmentUrl(row);
  const subject = isEnglish
    ? `Your ${row.sector?.trim() || "AI"} audit questionnaire is ready - TransferAI Africa`
    : `Votre formulaire d'audit ${row.sector?.trim() || "IA"} est prêt - TransferAI Africa`;
  const intro = isEnglish ? `Hello ${row.full_name},` : `Bonjour ${row.full_name},`;
  const body = isEnglish
    ? `A new audit questionnaire request${row.sector?.trim() ? ` tailored to the ${row.sector.trim()} sector` : ""} has been prepared for follow-up.`
    : `Votre formulaire d'audit${row.sector?.trim() ? ` personnalisé pour le secteur ${row.sector.trim()}` : " IA"} est prêt.`;
  const { domainTitle } = resolveAuditDomainAccess(row.sector);
  const guidance = isEnglish
    ? "Use the secure portal below with the username and password you created in your request."
    : "Utilisez le portail sécurisé ci-dessous avec le username et le mot de passe créés lors de votre demande.";
  const appointmentLine = row.wants_expert_appointment
    ? isEnglish
      ? "Because you asked to discuss the questionnaire with an expert, you can also book a conversation after reviewing it."
      : "Comme vous avez demandé un échange avec un expert, vous pourrez également réserver un rendez-vous après avoir pris connaissance du formulaire."
    : null;
  const closing = isEnglish
    ? "Best regards,\nTransferAI Africa"
    : "Bien cordialement,\nTransferAI Africa";

  const html = `
    <div style="font-family:Arial,sans-serif;background:#f7f8fa;padding:24px;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e4e7ec;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#f28c28;">TransferAI Africa</p>
        <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2;color:#101828;">${escapeHtml(subject)}</h1>
        <p style="margin:0 0 14px;color:#101828;">${escapeHtml(intro)}</p>
        <p style="margin:0 0 14px;color:#475467;">${escapeHtml(body)}</p>
        <p style="margin:0 0 18px;color:#475467;">${escapeHtml(isEnglish ? "Click the button below to open the audit questionnaire. It takes about 15 minutes to complete." : "Cliquez sur le bouton ci-dessous pour ouvrir le questionnaire d'audit. Comptez environ 15 minutes pour le remplir.")}</p>
        <p style="margin:0 0 14px;color:#475467;">${escapeHtml(isEnglish ? `Sector prepared: ${domainTitle}` : `Secteur préparé : ${domainTitle}`)}</p>
        <p style="margin:0 0 18px;">
          <a href="${escapeHtml(AUDIT_FORM_URL)}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#f28c28;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;">
            ${escapeHtml(isEnglish ? "Open the audit questionnaire" : "Ouvrir le questionnaire d'audit")}
          </a>
        </p>
        <p style="margin:18px 0 0;color:#98a2b3;font-size:13px;">${escapeHtml(isEnglish ? "Tip: complete the form in one sitting. Your responses are saved as you type." : "Astuce : remplissez le formulaire en une seule fois. Vos réponses sont sauvegardées au fur et à mesure.")}</p>
        ${
          appointmentLine
            ? `<div style="margin-top:24px;padding:20px;border-radius:12px;background:#f9fafb;border:1px solid #eaecf0;">
                <p style="margin:0 0 14px;color:#475467;">${escapeHtml(appointmentLine)}</p>
                <a href="${escapeHtml(appointmentUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:700;">
                  ${escapeHtml(isEnglish ? "Book the discussion" : "Réserver l'échange")}
                </a>
              </div>`
            : ""
        }
        <p style="margin:24px 0 0;color:#475467;white-space:pre-line;">${escapeHtml(closing)}</p>
      </div>
    </div>
  `;

  const text = [
    intro,
    "",
    body,
    isEnglish ? `Prospect email: ${row.email}` : `Adresse e-mail du prospect : ${row.email}`,
    guidance,
    AUDIT_LOGIN_URL,
    "",
    appointmentLine ?? "",
    appointmentLine ? appointmentUrl : "",
    "",
    closing,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    html,
    text,
  };
};

const sendEmail = async (to: string, message: { subject: string; html: string; text: string }) => {
  if (!RESEND_API_KEY) {
    throw new Error("email_provider_not_configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [to],
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`email_send_failed:${response.status}:${errorText}`);
  }

  return response.json();
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!supabase) {
    return new Response(JSON.stringify({ error: "supabase_not_configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data, error } = await supabase
    .from("contact_requests")
    .select("id, full_name, email, company, profession, country, sector, language, wants_expert_appointment")
    .eq("request_intent", "demande-audit")
    .eq("audit_followup_status", "pending")
    .lte("audit_followup_scheduled_at", new Date().toISOString())
    .order("audit_followup_scheduled_at", { ascending: true })
    .limit(Number.isFinite(batchSize) && batchSize > 0 ? batchSize : 25);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const rows = (data ?? []) as ProspectFollowupRow[];
  let sent = 0;
  const failures: Array<{ id: string; error: string }> = [];

  for (const row of rows) {
    try {
      const message = buildMessage(row);
      const emailResult = await sendEmail(row.email, message);

      await supabase.from("prospect_email_delivery_logs").insert({
        contact_request_id: row.id,
        recipient_email: row.email,
        delivery_type: "audit_form_access",
        provider: "resend",
        provider_message_id: emailResult?.id ?? null,
        status: "sent",
        subject: message.subject,
        sent_at: new Date().toISOString(),
        metadata: {
          audit_form_url: AUDIT_FORM_URL,
          audit_login_url: AUDIT_LOGIN_URL,
        },
      });

      const { error: updateError } = await supabase
        .from("contact_requests")
        .update({
          audit_followup_status: "sent",
          audit_followup_sent_at: new Date().toISOString(),
          audit_followup_error: null,
        })
        .eq("id", row.id);

      if (updateError) {
        throw updateError;
      }

      sent += 1;
    } catch (followupError) {
      const errorMessage = followupError instanceof Error ? followupError.message : "unknown_followup_error";
      failures.push({ id: row.id, error: errorMessage });

      await supabase
        .from("contact_requests")
        .update({
          audit_followup_status: "failed",
          audit_followup_error: errorMessage,
        })
        .eq("id", row.id);
    }
  }

  return new Response(
    JSON.stringify({
      ok: true,
      scanned: rows.length,
      sent,
      failed: failures.length,
      failures,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
