const DEFAULT_BOOKING_LINK = "https://calendly.com/contact-transferai/30min";
const DEFAULT_FOLLOWUP_DELAY_HOURS = 20;

export const ACTIVE_WHATSAPP_SEQUENCE_STATUSES = [
  "pending_second_followup",
  "second_followup_sent",
] as const;

export const normalizeWhatsappAddress = (value: string | null | undefined) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  return raw.toLowerCase().startsWith("whatsapp:") ? raw : `whatsapp:${raw}`;
};

export const normalizePhoneForDisplay = (value: string | null | undefined) =>
  normalizeWhatsappAddress(value).replace(/^whatsapp:/i, "");

export const isOptOutMessage = (value: string | null | undefined) => {
  const body = String(value ?? "").trim().toLowerCase();
  if (!body) return false;
  return ["stop", "unsubscribe", "arrete", "arrêt", "no", "quit"].includes(body);
};

const interpolateTemplate = (template: string, replacements: Record<string, string>) =>
  Object.entries(replacements).reduce(
    (current, [key, value]) => current.replaceAll(`{{${key}}}`, value),
    template,
  );

export const getWhatsappBookingLink = () =>
  Deno.env.get("WHATSAPP_BOOKING_LINK")?.trim() ||
  Deno.env.get("BOOKING_LINK_45MIN")?.trim() ||
  DEFAULT_BOOKING_LINK;

export const getWhatsappFollowupDelayHours = () => {
  const parsed = Number.parseInt(Deno.env.get("WHATSAPP_FOLLOWUP_DELAY_HOURS") ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 23) return DEFAULT_FOLLOWUP_DELAY_HOURS;
  return parsed;
};

export const buildFirstAutoReply = (profileName?: string | null) => {
  const bookingLink = getWhatsappBookingLink();
  const firstTemplate =
    Deno.env.get("WHATSAPP_AUTO_REPLY_FIRST")?.trim() ||
    "Bonjour{{PROFILE_SUFFIX}}, merci pour votre message et votre intérêt pour TransferAI. Nous avons bien reçu votre demande. Pouvez-vous nous préciser en une phrase votre besoin principal afin que nous vous orientions rapidement ?";

  return interpolateTemplate(firstTemplate, {
    PROFILE_NAME: profileName?.trim() || "",
    PROFILE_SUFFIX: profileName?.trim() ? ` ${profileName.trim()}` : "",
    BOOKING_LINK: bookingLink,
  }).trim();
};

export const buildSecondFollowupReply = (
  profileName?: string | null,
  bookingLinkOverride?: string | null,
) => {
  const bookingLink = bookingLinkOverride?.trim() || getWhatsappBookingLink();
  const secondTemplate =
    Deno.env.get("WHATSAPP_AUTO_REPLY_SECOND")?.trim() ||
    "Bonjour{{PROFILE_SUFFIX}}, je me permets de vous relancer. Si vous le souhaitez, vous pouvez déjà réserver un créneau d’échange avec notre équipe ici : {{BOOKING_LINK}}. Si vous préférez, répondez simplement à ce message avec votre besoin principal.";

  return interpolateTemplate(secondTemplate, {
    PROFILE_NAME: profileName?.trim() || "",
    PROFILE_SUFFIX: profileName?.trim() ? ` ${profileName.trim()}` : "",
    BOOKING_LINK: bookingLink,
  }).trim();
};

export const sendTwilioWhatsappMessage = async (payload: {
  accountSid?: string | null;
  authToken?: string | null;
  from: string;
  to: string;
  body: string;
}) => {
  const accountSid = payload.accountSid?.trim() || Deno.env.get("TWILIO_ACCOUNT_SID")?.trim() || "";
  const authToken = payload.authToken?.trim() || Deno.env.get("TWILIO_AUTH_TOKEN")?.trim() || "";
  const from = normalizeWhatsappAddress(payload.from);
  const to = normalizeWhatsappAddress(payload.to);

  if (!accountSid || !authToken || !from || !to || !payload.body.trim()) {
    throw new Error("twilio_whatsapp_missing_configuration");
  }

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      To: to,
      From: from,
      Body: payload.body,
    }),
  });

  const data = await response.json().catch(() => null) as { sid?: string; message?: string } | null;

  if (!response.ok) {
    const errorText = data?.message || `HTTP ${response.status}`;
    throw new Error(`twilio_whatsapp_send_failed:${errorText}`);
  }

  return data;
};
