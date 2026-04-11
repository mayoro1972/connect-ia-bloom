type ProspectEmailIntent =
  | "demande-catalogue"
  | "demande-renseignement"
  | "contact-devis"
  | "demande-referencement"
  | "inscription"
  | "prise-rdv";

type ProspectEmailPayload = {
  intent: ProspectEmailIntent;
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  website?: string | null;
  role?: string | null;
  city?: string | null;
  domain?: string | null;
  formationTitle?: string | null;
  participants?: number | null;
  format?: string | null;
  timeline?: string | null;
  message?: string | null;
  sourcePage?: string | null;
  language?: string | null;
  appointmentUrl?: string | null;
};

type EmailMessage = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

type TranslationCopy = {
  missingValue: string;
  noExtraMessage: string;
  websiteRequest: string;
  requestLabel: string;
  fieldLabels: {
    name: string;
    email: string;
    phone: string;
    company: string;
    website: string;
    role: string;
    city: string;
    domain: string;
    formation: string;
    participants: string;
    format: string;
    timeline: string;
    source: string;
    type: string;
  };
  prospectMessage: string;
  appointmentCta: string;
  acknowledgementSubject: string;
  greeting: (fullName: string) => string;
  acknowledgementBody: (intentLabel: string) => string;
  acknowledgementNextStep: string;
  listingAcknowledgementBody: string;
  listingReviewTitle: string;
  listingReviewItems: string[];
  listingFormatsTitle: string;
  listingFormatsItems: string[];
  listingResponseDelay: string;
  summaryTitle: string;
  reviewAppointment: string;
  closing: string;
  intentLabels: Record<ProspectEmailIntent, string>;
  defaultTrainingLabel: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const MAIL_FROM = Deno.env.get("MAIL_FROM") ?? "TransferAI Africa <contact@transferai.ci>";
const MAIL_TO = Deno.env.get("MAIL_TO") ?? "contact@transferai.ci";

const translations: Record<"fr" | "en", TranslationCopy> = {
  fr: {
    missingValue: "Non precise",
    noExtraMessage: "Aucun message complementaire.",
    websiteRequest: "Nouvelle demande site web",
    requestLabel: "Nouvelle demande",
    fieldLabels: {
      name: "Nom",
      email: "Email",
      phone: "Telephone",
      company: "Organisation",
      website: "Site web",
      role: "Fonction",
      city: "Ville / Pays",
      domain: "Domaine",
      formation: "Formation",
      participants: "Participants",
      format: "Format",
      timeline: "Echeance",
      source: "Source",
      type: "Type",
    },
    prospectMessage: "Message du prospect",
    appointmentCta: "Ouvrir le lien de RDV",
    acknowledgementSubject: "Nous avons bien recu votre demande - TransferAI Africa",
    greeting: (fullName: string) => `Bonjour ${fullName},`,
    acknowledgementBody: (intentLabel: string) =>
      `Nous confirmons la bonne reception de votre ${intentLabel.toLowerCase()}. Notre equipe va l'etudier et vous repondra depuis contact@transferai.ci dans les meilleurs delais.`,
    acknowledgementNextStep:
      "Si votre demande concerne un rendez-vous, un devis ou une orientation formation, nous pourrons vous recontacter afin de preciser votre besoin avant l'etape suivante.",
    listingAcknowledgementBody:
      "Nous confirmons la bonne reception de votre demande de référencement. Votre dossier va être relu par notre équipe afin d'évaluer la cohérence éditoriale, la forme de présence la plus adaptée et les prochaines modalités à vous proposer.",
    listingReviewTitle: "Ce que nous allons étudier",
    listingReviewItems: [
      "L'alignement de votre activité avec l'audience TransferAI Africa",
      "Le niveau de présence le plus pertinent pour votre organisation",
      "Les éléments à mettre en avant pour une publication utile et crédible",
    ],
    listingFormatsTitle: "Ce qu'une présence peut inclure",
    listingFormatsItems: [
      "Une présentation courte avec logo, texte et lien utile",
      "Une présentation enrichie avec angle sectoriel et proposition de valeur",
      "Une mise en avant plus éditoriale pour les profils les plus alignés",
    ],
    listingResponseDelay:
      "Notre retour intervient en général sous 7 à 10 jours ouvrés après réception d'un dossier exploitable. Les modalités précises et la proposition associée sont communiquées ensuite par email.",
    summaryTitle: "Recapitulatif de votre demande",
    reviewAppointment: "Verifier mon lien de RDV",
    closing: "Merci pour votre confiance,\nTransferAI Africa",
    intentLabels: {
      "demande-catalogue": "Demande de catalogue",
      "demande-renseignement": "Demande de renseignement",
      "contact-devis": "Demande de devis",
      "demande-referencement": "Demande de referencement",
      inscription: "Inscription a une formation",
      "prise-rdv": "Demande de prise de rendez-vous",
    } satisfies Record<ProspectEmailIntent, string>,
    defaultTrainingLabel: "Formation",
  },
  en: {
    missingValue: "Not specified",
    noExtraMessage: "No additional message.",
    websiteRequest: "New website request",
    requestLabel: "New request",
    fieldLabels: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      company: "Organization",
      website: "Website",
      role: "Role",
      city: "City / Country",
      domain: "Domain",
      formation: "Training",
      participants: "Participants",
      format: "Format",
      timeline: "Timeline",
      source: "Source",
      type: "Type",
    },
    prospectMessage: "Prospect message",
    appointmentCta: "Open booking link",
    acknowledgementSubject: "We received your request - TransferAI Africa",
    greeting: (fullName: string) => `Hello ${fullName},`,
    acknowledgementBody: (intentLabel: string) =>
      `We confirm that we received your ${intentLabel.toLowerCase()}. Our team will review it and reply from contact@transferai.ci as soon as possible.`,
    acknowledgementNextStep:
      "If your request concerns a meeting, quote or training recommendation, we may contact you to refine your need before sending the next step.",
    listingAcknowledgementBody:
      "We confirm that we received your listing request. Our team will review your file to assess editorial fit, the most relevant visibility format, and the next steps we can propose.",
    listingReviewTitle: "What we will review",
    listingReviewItems: [
      "How your activity fits the TransferAI Africa audience",
      "The most relevant visibility level for your organization",
      "Which elements should be highlighted for a useful and credible publication",
    ],
    listingFormatsTitle: "What a presence may include",
    listingFormatsItems: [
      "A short presentation with logo, text, and useful link",
      "An enriched presentation with sector angle and value proposition",
      "A more editorialized feature for the most aligned profiles",
    ],
    listingResponseDelay:
      "We usually reply within 7 to 10 business days after receiving a workable file. Exact terms and the related proposal are then shared by email.",
    summaryTitle: "Summary of your request",
    reviewAppointment: "Review my meeting link",
    closing: "Thank you for your trust,\nTransferAI Africa",
    intentLabels: {
      "demande-catalogue": "Catalogue request",
      "demande-renseignement": "Information request",
      "contact-devis": "Quote request",
      "demande-referencement": "Listing request",
      inscription: "Training registration",
      "prise-rdv": "Meeting request",
    } satisfies Record<ProspectEmailIntent, string>,
    defaultTrainingLabel: "Training",
  },
} as const;

const getCopy = (language?: string | null) => {
  return language === "en" ? translations.en : translations.fr;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const asHtmlParagraphs = (copy: TranslationCopy, value?: string | null) => {
  if (!value) return `<p style="margin:0;color:#667085;">${escapeHtml(copy.noExtraMessage)}</p>`;
  return value
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => `<p style="margin:0 0 10px;color:#101828;">${escapeHtml(line)}</p>`)
    .join("");
};

const asTextValue = (copy: TranslationCopy, value?: string | number | null) =>
  value === null || value === undefined || value === "" ? copy.missingValue : String(value);

const asHtmlList = (items: string[]) =>
  `<ul style="margin:0;padding-left:18px;color:#475467;">${items
    .map((item) => `<li style="margin:0 0 8px;">${escapeHtml(item)}</li>`)
    .join("")}</ul>`;

const buildInternalNotification = (payload: ProspectEmailPayload): EmailMessage => {
  const copy = getCopy(payload.language);
  const topic =
    payload.intent === "inscription"
      ? payload.formationTitle || copy.defaultTrainingLabel
      : payload.domain || payload.company || payload.fullName;

  const intentLabel = copy.intentLabels[payload.intent];
  const subject = `[TransferAI] ${intentLabel} - ${topic}`;
  const html = `
    <div style="font-family:Arial,sans-serif;background:#f7f8fa;padding:24px;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e4e7ec;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#f28c28;">${escapeHtml(copy.websiteRequest)}</p>
        <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2;color:#101828;">${escapeHtml(intentLabel)}</h1>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(copy.fieldLabels.name)}</td><td style="padding:10px 0;color:#101828;font-weight:600;">${escapeHtml(asTextValue(copy, payload.fullName))}</td></tr>
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(copy.fieldLabels.email)}</td><td style="padding:10px 0;color:#101828;">${escapeHtml(asTextValue(copy, payload.email))}</td></tr>
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(copy.fieldLabels.phone)}</td><td style="padding:10px 0;color:#101828;">${escapeHtml(asTextValue(copy, payload.phone))}</td></tr>
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(copy.fieldLabels.company)}</td><td style="padding:10px 0;color:#101828;">${escapeHtml(asTextValue(copy, payload.company))}</td></tr>
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(copy.fieldLabels.website)}</td><td style="padding:10px 0;color:#101828;">${escapeHtml(asTextValue(copy, payload.website))}</td></tr>
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(copy.fieldLabels.role)}</td><td style="padding:10px 0;color:#101828;">${escapeHtml(asTextValue(copy, payload.role))}</td></tr>
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(copy.fieldLabels.city)}</td><td style="padding:10px 0;color:#101828;">${escapeHtml(asTextValue(copy, payload.city))}</td></tr>
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(copy.fieldLabels.domain)}</td><td style="padding:10px 0;color:#101828;">${escapeHtml(asTextValue(copy, payload.domain))}</td></tr>
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(copy.fieldLabels.formation)}</td><td style="padding:10px 0;color:#101828;">${escapeHtml(asTextValue(copy, payload.formationTitle))}</td></tr>
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(copy.fieldLabels.participants)}</td><td style="padding:10px 0;color:#101828;">${escapeHtml(asTextValue(copy, payload.participants))}</td></tr>
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(copy.fieldLabels.format)}</td><td style="padding:10px 0;color:#101828;">${escapeHtml(asTextValue(copy, payload.format))}</td></tr>
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(copy.fieldLabels.timeline)}</td><td style="padding:10px 0;color:#101828;">${escapeHtml(asTextValue(copy, payload.timeline))}</td></tr>
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(copy.fieldLabels.source)}</td><td style="padding:10px 0;color:#101828;">${escapeHtml(asTextValue(copy, payload.sourcePage))}</td></tr>
        </table>
        <div style="margin-top:24px;padding:20px;border-radius:12px;background:#f9fafb;border:1px solid #eaecf0;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#101828;">${escapeHtml(copy.prospectMessage)}</p>
          ${asHtmlParagraphs(copy, payload.message)}
        </div>
        ${
          payload.appointmentUrl
            ? `<p style="margin:24px 0 0;"><a href="${escapeHtml(payload.appointmentUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#f28c28;color:#ffffff;text-decoration:none;font-weight:700;">${escapeHtml(copy.appointmentCta)}</a></p>`
            : ""
        }
      </div>
    </div>
  `;

  const text = [
    `${copy.requestLabel} : ${intentLabel}`,
    `${copy.fieldLabels.name} : ${asTextValue(copy, payload.fullName)}`,
    `${copy.fieldLabels.email} : ${asTextValue(copy, payload.email)}`,
    `${copy.fieldLabels.phone} : ${asTextValue(copy, payload.phone)}`,
    `${copy.fieldLabels.company} : ${asTextValue(copy, payload.company)}`,
    `${copy.fieldLabels.website} : ${asTextValue(copy, payload.website)}`,
    `${copy.fieldLabels.role} : ${asTextValue(copy, payload.role)}`,
    `${copy.fieldLabels.city} : ${asTextValue(copy, payload.city)}`,
    `${copy.fieldLabels.domain} : ${asTextValue(copy, payload.domain)}`,
    `${copy.fieldLabels.formation} : ${asTextValue(copy, payload.formationTitle)}`,
    `${copy.fieldLabels.participants} : ${asTextValue(copy, payload.participants)}`,
    `${copy.fieldLabels.format} : ${asTextValue(copy, payload.format)}`,
    `${copy.fieldLabels.timeline} : ${asTextValue(copy, payload.timeline)}`,
    `${copy.fieldLabels.source} : ${asTextValue(copy, payload.sourcePage)}`,
    "",
    `${copy.prospectMessage} :`,
    payload.message?.trim() || copy.noExtraMessage,
    "",
    payload.appointmentUrl ? `${copy.appointmentCta} : ${payload.appointmentUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    html,
    text,
    replyTo: payload.email,
  };
};

const buildAcknowledgement = (payload: ProspectEmailPayload): EmailMessage => {
  const copy = getCopy(payload.language);
  const intentLabel = copy.intentLabels[payload.intent];
  const subject = copy.acknowledgementSubject;
  const intro = copy.greeting(payload.fullName);
  const isListingRequest = payload.intent === "demande-referencement";
  const body = isListingRequest ? copy.listingAcknowledgementBody : copy.acknowledgementBody(intentLabel);
  const nextStep = isListingRequest ? copy.listingResponseDelay : copy.acknowledgementNextStep;
  const detailsTitle = copy.summaryTitle;
  const closing = copy.closing;
  const listingReviewBlock = isListingRequest
    ? `
        <div style="margin-top:18px;padding:20px;border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#101828;">${escapeHtml(copy.listingReviewTitle)}</p>
          ${asHtmlList(copy.listingReviewItems)}
        </div>
        <div style="margin-top:18px;padding:20px;border-radius:12px;background:#f9fafb;border:1px solid #eaecf0;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#101828;">${escapeHtml(copy.listingFormatsTitle)}</p>
          ${asHtmlList(copy.listingFormatsItems)}
        </div>
      `
    : "";
  const listingReviewText = isListingRequest
    ? [
        "",
        `${copy.listingReviewTitle} :`,
        ...copy.listingReviewItems.map((item) => `- ${item}`),
        "",
        `${copy.listingFormatsTitle} :`,
        ...copy.listingFormatsItems.map((item) => `- ${item}`),
      ].join("\n")
    : "";

  const html = `
    <div style="font-family:Arial,sans-serif;background:#f7f8fa;padding:24px;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e4e7ec;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#f28c28;">TransferAI Africa</p>
        <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2;color:#101828;">${escapeHtml(subject)}</h1>
        <p style="margin:0 0 14px;color:#101828;">${escapeHtml(intro)}</p>
        <p style="margin:0 0 14px;color:#475467;">${escapeHtml(body)}</p>
        <p style="margin:0 0 18px;color:#475467;">${escapeHtml(nextStep)}</p>
        <div style="padding:20px;border-radius:12px;background:#f9fafb;border:1px solid #eaecf0;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#101828;">${escapeHtml(detailsTitle)}</p>
          <p style="margin:0 0 8px;color:#475467;"><strong>${escapeHtml(copy.fieldLabels.type)} :</strong> ${escapeHtml(intentLabel)}</p>
          <p style="margin:0 0 8px;color:#475467;"><strong>${escapeHtml(copy.fieldLabels.domain)} :</strong> ${escapeHtml(asTextValue(copy, payload.domain))}</p>
          <p style="margin:0 0 8px;color:#475467;"><strong>${escapeHtml(copy.fieldLabels.formation)} :</strong> ${escapeHtml(asTextValue(copy, payload.formationTitle))}</p>
          <p style="margin:0;color:#475467;"><strong>${escapeHtml(copy.fieldLabels.company)} :</strong> ${escapeHtml(asTextValue(copy, payload.company))}</p>
        </div>
        ${listingReviewBlock}
        ${
          payload.appointmentUrl
            ? `<p style="margin:24px 0 0;"><a href="${escapeHtml(payload.appointmentUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:700;">${escapeHtml(copy.reviewAppointment)}</a></p>`
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
    nextStep,
    "",
    `${detailsTitle} :`,
    `${copy.fieldLabels.type} : ${intentLabel}`,
    `${copy.fieldLabels.domain} : ${asTextValue(copy, payload.domain)}`,
    `${copy.fieldLabels.formation} : ${asTextValue(copy, payload.formationTitle)}`,
    `${copy.fieldLabels.company} : ${asTextValue(copy, payload.company)}`,
    listingReviewText,
    payload.appointmentUrl ? `${copy.reviewAppointment} : ${payload.appointmentUrl}` : "",
    "",
    closing,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    html,
    text,
    replyTo: MAIL_TO,
  };
};

const sendEmail = async (to: string, message: EmailMessage) => {
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
      replyTo: message.replyTo,
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

  try {
    const payload = (await request.json()) as ProspectEmailPayload;

    if (!payload?.intent || !payload?.fullName || !payload?.email) {
      return new Response(JSON.stringify({ error: "invalid_payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const internalMessage = buildInternalNotification(payload);
    const acknowledgement = buildAcknowledgement(payload);

    const [internalResult, acknowledgementResult] = await Promise.all([
      sendEmail(MAIL_TO, internalMessage),
      sendEmail(payload.email, acknowledgement),
    ]);

    return new Response(
      JSON.stringify({
        ok: true,
        internal: internalResult,
        acknowledgement: acknowledgementResult,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "unknown_error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
