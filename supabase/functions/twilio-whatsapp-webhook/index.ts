import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const autoReply = Deno.env.get("TWILIO_WHATSAPP_AUTO_REPLY")?.trim() ?? "";
const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";
const backofficeUrl = Deno.env.get("BACKOFFICE_URL")?.trim() || "https://www.transferai.ci/back-office?tab=whatsapp";
const mailFrom =
  Deno.env.get("MAIL_FROM") ||
  Deno.env.get("FROM_EMAIL") ||
  "TransferAI Africa <contact@transferai.ci>";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const xml = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/xml; charset=utf-8",
    },
  });

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getInternalGreeting = () => {
  const hour = Number(
    new Intl.DateTimeFormat("fr-FR", {
      hour: "numeric",
      hour12: false,
      timeZone: "Africa/Abidjan",
    }).format(new Date()),
  );

  return hour >= 18 ? "Bonsoir" : "Bonjour";
};

const sendInternalNotificationEmail = async (payload: {
  fromNumber: string;
  toNumber: string;
  profileName: string;
  body: string;
  messageSid: string;
  createdAt: string;
  numMedia: number;
}) => {
  if (!resendApiKey) {
    console.warn("[twilio-whatsapp-webhook] RESEND_API_KEY missing; skipping admin notification email");
    return;
  }

  const { data: adminSettings } = await supabase
    .from("admin_settings")
    .select("admin_email, notification_enabled")
    .limit(1)
    .maybeSingle();

  if (adminSettings?.notification_enabled === false) {
    return;
  }

  const adminEmail =
    adminSettings?.admin_email?.trim() ||
    Deno.env.get("ADMIN_EMAIL")?.trim() ||
    Deno.env.get("MAIL_TO")?.trim() ||
    "contact@transferai.ci";

  if (!adminEmail) {
    console.warn("[twilio-whatsapp-webhook] admin email missing; skipping admin notification email");
    return;
  }

  const greeting = getInternalGreeting();
  const subject = `[TransferAI] Nouveau message WhatsApp - ${payload.profileName || payload.fromNumber}`;
  const bodyPreview = payload.body?.trim() || "(message vide)";

  const text = `${greeting},

Un nouveau message WhatsApp a été reçu sur TransferAI.

Nom / profil : ${payload.profileName || "Non renseigné"}
Numéro expéditeur : ${payload.fromNumber}
Numéro destinataire : ${payload.toNumber || "Non renseigné"}
Date de réception : ${payload.createdAt}
Médias : ${payload.numMedia}
SID message : ${payload.messageSid}

Message :
${bodyPreview}

Accéder au BackOffice :
${backofficeUrl}
`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f7f4ee;padding:24px;color:#101828;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #eadfce;border-radius:18px;overflow:hidden;">
        <div style="background:#12233f;padding:24px 28px;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#f59e0b;margin-bottom:10px;">Notification interne</div>
          <h1 style="margin:0;font-size:28px;line-height:1.2;">Nouveau message WhatsApp</h1>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">${escapeHtml(greeting)}, un nouveau message WhatsApp a été reçu sur TransferAI.</p>
          <table style="width:100%;border-collapse:collapse;margin:0 0 20px;">
            <tr><td style="padding:8px 0;color:#667085;width:210px;">Nom / profil</td><td style="padding:8px 0;color:#101828;">${escapeHtml(payload.profileName || "Non renseigné")}</td></tr>
            <tr><td style="padding:8px 0;color:#667085;">Numéro expéditeur</td><td style="padding:8px 0;color:#101828;">${escapeHtml(payload.fromNumber)}</td></tr>
            <tr><td style="padding:8px 0;color:#667085;">Numéro destinataire</td><td style="padding:8px 0;color:#101828;">${escapeHtml(payload.toNumber || "Non renseigné")}</td></tr>
            <tr><td style="padding:8px 0;color:#667085;">Date de réception</td><td style="padding:8px 0;color:#101828;">${escapeHtml(payload.createdAt)}</td></tr>
            <tr><td style="padding:8px 0;color:#667085;">Médias</td><td style="padding:8px 0;color:#101828;">${payload.numMedia}</td></tr>
            <tr><td style="padding:8px 0;color:#667085;">SID message</td><td style="padding:8px 0;color:#101828;">${escapeHtml(payload.messageSid)}</td></tr>
          </table>
          <div style="margin:0 0 22px;padding:18px;border-radius:14px;background:#f8fafc;border:1px solid #e5e7eb;">
            <div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#667085;margin-bottom:10px;">Message</div>
            <div style="font-size:16px;line-height:1.7;color:#101828;white-space:pre-wrap;">${escapeHtml(bodyPreview)}</div>
          </div>
          <a href="${escapeHtml(backofficeUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#f97316;color:#ffffff;text-decoration:none;font-weight:600;">Ouvrir le BackOffice WhatsApp</a>
        </div>
      </div>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: mailFrom,
      to: [adminEmail],
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[twilio-whatsapp-webhook] failed to send admin notification email", response.status, errorText);
  }
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return xml('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', 405);
  }

  try {
    const form = await req.formData();
    const rawPayload = Object.fromEntries(form.entries());

    const messageSid = String(form.get("MessageSid") ?? "").trim();
    const accountSid = String(form.get("AccountSid") ?? "").trim();
    const fromNumber = String(form.get("From") ?? "").trim();
    const toNumber = String(form.get("To") ?? "").trim();
    const profileName = String(form.get("ProfileName") ?? "").trim();
    const body = String(form.get("Body") ?? "").trim();
    const messageStatus = String(form.get("MessageStatus") ?? "").trim();
    const waId = String(form.get("WaId") ?? "").trim();
    const numMedia = Number.parseInt(String(form.get("NumMedia") ?? "0"), 10) || 0;

    if (!messageSid || !fromNumber) {
      return xml('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', 400);
    }

    const { data: existingMessage, error: existingMessageError } = await supabase
      .from("whatsapp_inbound_messages")
      .select("id")
      .eq("message_sid", messageSid)
      .maybeSingle();

    if (existingMessageError) {
      console.error("Failed to check existing WhatsApp message", existingMessageError);
      return xml('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', 500);
    }

    const { error } = await supabase
      .from("whatsapp_inbound_messages")
      .upsert(
        {
          message_sid: messageSid,
          account_sid: accountSid || null,
          from_number: fromNumber,
          to_number: toNumber || null,
          profile_name: profileName || null,
          body: body || null,
          num_media: numMedia,
          message_status: messageStatus || null,
          wa_id: waId || null,
          raw_payload: rawPayload,
        },
        { onConflict: "message_sid" },
      );

    if (error) {
      console.error("Failed to persist WhatsApp message", error);
      return xml('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', 500);
    }

    if (!existingMessage) {
      await sendInternalNotificationEmail({
        fromNumber,
        toNumber,
        profileName,
        body,
        messageSid,
        createdAt: new Intl.DateTimeFormat("fr-FR", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Africa/Abidjan",
        }).format(new Date()),
        numMedia,
      });
    }

    const replyBody = autoReply
      ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(autoReply)}</Message></Response>`
      : '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';

    return xml(replyBody);
  } catch (error) {
    console.error("Twilio WhatsApp webhook error", error);
    return xml('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', 500);
  }
});
