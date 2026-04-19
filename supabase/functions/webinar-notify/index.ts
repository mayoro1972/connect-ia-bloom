import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Payload {
  full_name: string;
  email: string;
  language?: string;
  domain_label?: string;
  formation_label?: string;
  scheduled_date?: string; // YYYY-MM-DD
}

const FROM = Deno.env.get("MAIL_FROM") || Deno.env.get("FROM_EMAIL") || "TransferAI Africa <contact@transferai.ci>";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "contact@transferai.ci";

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return { ok: false, error: "RESEND_API_KEY missing" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: replyTo, subject, html }),
  });
  const data = await res.json().catch(() => ({}));
  return res.ok ? { ok: true, id: data.id } : { ok: false, error: data.message || "send_failed" };
}

const fmtDate = (iso: string | undefined, lang: string) => {
  if (!iso) return "";
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(lang === "en" ? "en-US" : "fr-FR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  } catch { return iso; }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const p: Payload = await req.json();
    if (!p.email || !p.full_name) {
      return new Response(JSON.stringify({ error: "missing_fields" }), { status: 400, headers: corsHeaders });
    }
    const lang = (p.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
    const dateLabel = fmtDate(p.scheduled_date, lang);

    const subjectUser = lang === "en"
      ? "Your free webinar registration has been received"
      : "Votre inscription au webinaire gratuit a bien été reçue";

    const htmlUser = lang === "en" ? `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a">
        <h2 style="color:#0d9488">Hello ${p.full_name},</h2>
        <p>Thank you for registering for our <strong>free TransferAI Africa webinar</strong>.</p>
        <p>We have received your request${p.domain_label ? ` for the area <strong>${p.domain_label}</strong>` : ""}${p.formation_label ? ` (training: <em>${p.formation_label}</em>)` : ""}.</p>
        ${dateLabel ? `<p><strong>Provisional date:</strong> ${dateLabel}<br/><small>(may be adjusted — final confirmation by email)</small></p>` : ""}
        <p>You will receive a confirmation email with the connection link a few days before the session.</p>
        <p style="margin-top:32px">Best regards,<br/><strong>The TransferAI Africa team</strong></p>
        <hr/><p style="font-size:12px;color:#666">contact@transferai.ci · transfer-ai.com</p>
      </div>` : `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a">
        <h2 style="color:#0d9488">Bonjour ${p.full_name},</h2>
        <p>Merci pour votre inscription à notre <strong>webinaire gratuit TransferAI Africa</strong>.</p>
        <p>Nous avons bien reçu votre demande${p.domain_label ? ` pour le domaine <strong>${p.domain_label}</strong>` : ""}${p.formation_label ? ` (formation : <em>${p.formation_label}</em>)` : ""}.</p>
        ${dateLabel ? `<p><strong>Date prévisionnelle :</strong> ${dateLabel}<br/><small>(susceptible d'ajustement — confirmation finale par email)</small></p>` : ""}
        <p>Vous recevrez un email de confirmation avec le lien de connexion quelques jours avant la session.</p>
        <p style="margin-top:32px">Cordialement,<br/><strong>L'équipe TransferAI Africa</strong></p>
        <hr/><p style="font-size:12px;color:#666">contact@transferai.ci · transfer-ai.com</p>
      </div>`;

    const userRes = await sendEmail(p.email, subjectUser, htmlUser);

    // Notif admin instantanée
    const htmlAdmin = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h3>Nouvelle inscription webinaire</h3>
        <ul>
          <li><strong>Nom :</strong> ${p.full_name}</li>
          <li><strong>Email :</strong> ${p.email}</li>
          <li><strong>Domaine :</strong> ${p.domain_label || "—"}</li>
          <li><strong>Formation :</strong> ${p.formation_label || "—"}</li>
          <li><strong>Langue :</strong> ${lang.toUpperCase()}</li>
          <li><strong>Date prévue :</strong> ${dateLabel || "—"}</li>
        </ul>
        <p><a href="https://transfer-ai.com/backoffice">Ouvrir le BackOffice → Webinaires</a></p>
      </div>`;
    await sendEmail(ADMIN_EMAIL, `[Webinaire] Nouvelle inscription — ${p.full_name}`, htmlAdmin, p.email);

    return new Response(JSON.stringify({ ok: true, user: userRes }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
