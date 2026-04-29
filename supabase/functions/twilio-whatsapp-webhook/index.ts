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

    const replyBody = autoReply
      ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(autoReply)}</Message></Response>`
      : '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';

    return xml(replyBody);
  } catch (error) {
    console.error("Twilio WhatsApp webhook error", error);
    return xml('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', 500);
  }
});
