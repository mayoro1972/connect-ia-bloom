import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getEmailGreeting } from "../_shared/email-greetings.ts";
import { resolveDomainCatalogueAsset } from "../_shared/domain-catalogues.ts";

type ProspectEmailIntent =
  | "demande-catalogue"
  | "demande-renseignement"
  | "contact-devis"
  | "demande-referencement"
  | "inscription"
  | "prise-rdv";

type ProspectEmailPayload = {
  requestId?: string | null;
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
  listingSectorLabel: string;
  qualifiedResponseSubject: string;
  qualifiedResponseIntro: (topic: string) => string;
  qualifiedResponseBridge: string;
  qualifiedResponseQualificationLine: string;
  qualifiedResponseRecapTitle: string;
  qualifiedResponseRecapItems: {
    domain: string;
    participants: string;
    format: string;
    timeline: string;
  };
  qualifiedResponseNextStepsTitle: string;
  qualifiedResponseNextSteps: Record<"contact-devis" | "demande-renseignement" | "prise-rdv", string[]>;
  qualifiedResponseCta: string;
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
  acknowledgementBody: (intentLabel: string) => string;
  acknowledgementNextStep: string;
  registrationAcknowledgementSubject: string;
  registrationAcknowledgementBody: (formationLabel: string, participantsLabel?: string | null) => string;
  registrationAcknowledgementNextStep: string;
  listingAcknowledgementBody: string;
  listingReviewTitle: string;
  listingReviewItems: string[];
  listingFormatsTitle: string;
  listingFormatsItems: string[];
  listingResponseDelay: string;
  summaryTitle: string;
  reviewAppointment: string;
  catalogueReadySubject: (domainLabel: string) => string;
  catalogueReadyBody: (domainLabel: string) => string;
  catalogueReadyNextStep: string;
  catalogueDownloadTitle: string;
  catalogueButtons: {
    pdf: string;
    web: string;
    audit: string;
  };
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
const SITE_URL = (Deno.env.get("PUBLIC_SITE_URL") ?? "https://www.transferai.ci").replace(/\/$/, "");
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

const translations: Record<"fr" | "en", TranslationCopy> = {
  fr: {
    missingValue: "Non precise",
    noExtraMessage: "Aucun message complementaire.",
    websiteRequest: "Nouvelle demande site web",
    requestLabel: "Nouvelle demande",
    listingSectorLabel: "Secteur / activite",
    qualifiedResponseSubject: "Votre demande a été qualifiée | TransferAI Africa",
    qualifiedResponseIntro: (topic: string) =>
      `Nous avons analysé votre demande concernant ${topic} et elle est suffisamment claire pour vous proposer une suite immédiate.`,
    qualifiedResponseBridge:
      "Autrement dit, votre besoin est déjà assez structuré pour éviter un échange exploratoire long et passer à une réponse utile rapidement.",
    qualifiedResponseQualificationLine:
      "Vous pouvez donc recevoir automatiquement une première orientation opérationnelle, puis confirmer la suite avec notre équipe si nécessaire.",
    qualifiedResponseRecapTitle: "Éléments déjà compris dans votre demande",
    qualifiedResponseRecapItems: {
      domain: "Domaine / sujet",
      participants: "Volume / participants",
      format: "Format souhaité",
      timeline: "Échéance",
    },
    qualifiedResponseNextStepsTitle: "Prochaine étape recommandée",
    qualifiedResponseNextSteps: {
      "contact-devis": [
        "Préparer une proposition ciblée à partir du domaine demandé et du volume indiqué",
        "Valider le bon format, le niveau attendu et les contraintes terrain lors d’un audit IA gratuit",
        "Accélérer ensuite l’émission du devis final",
      ],
      "demande-renseignement": [
        "Confirmer le bon domaine et les priorités de montée en compétence",
        "Identifier 2 à 3 formats de formation réellement adaptés à votre contexte",
        "Transformer votre besoin en recommandation claire et actionnable",
      ],
      "prise-rdv": [
        "Confirmer votre créneau de cadrage",
        "Arriver à l’échange avec un besoin déjà synthétisé par notre système",
        "Décider rapidement de la meilleure suite : audit, catalogue, devis ou parcours",
      ],
    },
    qualifiedResponseCta: "Réserver l’audit IA gratuit",
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
    acknowledgementBody: (intentLabel: string) =>
      `Nous confirmons la bonne reception de votre ${intentLabel.toLowerCase()}. Notre equipe va l'etudier et vous repondra depuis contact@transferai.ci dans les meilleurs delais.`,
    acknowledgementNextStep:
      "Si votre demande concerne un rendez-vous, un devis ou une orientation formation, nous pourrons vous recontacter afin de preciser votre besoin avant l'etape suivante.",
    registrationAcknowledgementSubject: "Nous avons bien reçu votre demande d'inscription - TransferAI Africa",
    registrationAcknowledgementBody: (formationLabel: string, participantsLabel?: string | null) =>
      `Nous confirmons la bonne réception de votre demande d'inscription pour ${formationLabel}${participantsLabel ? `, avec ${participantsLabel}` : ""}. Notre équipe va vérifier les éléments transmis et revenir vers vous avec une réponse claire et adaptée à votre contexte.`,
    registrationAcknowledgementNextStep:
      "Nous reviendrons vers vous pour confirmer la formation, le format le plus pertinent, les modalités pratiques et la prochaine étape de finalisation de l'inscription.",
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
    catalogueReadySubject: (domainLabel: string) => `Votre catalogue ${domainLabel} est prêt | TransferAI Africa`,
    catalogueReadyBody: (domainLabel: string) =>
      `Nous avons bien pris en compte votre demande. Le catalogue du domaine ${domainLabel} est prêt et peut être consulté immédiatement en version PDF ou web.`,
    catalogueReadyNextStep:
      "Si vous le souhaitez, nous pouvons ensuite vous aider à identifier les formations prioritaires pour votre équipe et vous proposer un audit IA gratuit pour cadrer la suite.",
    catalogueDownloadTitle: "Accès direct au catalogue demandé",
    catalogueButtons: {
      pdf: "Télécharger le PDF",
      web: "Voir la version web",
      audit: "Réserver un audit IA gratuit",
    },
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
    listingSectorLabel: "Sector / activity",
    qualifiedResponseSubject: "Your request has been qualified | TransferAI Africa",
    qualifiedResponseIntro: (topic: string) =>
      `We reviewed your request regarding ${topic} and it is already clear enough for us to suggest an immediate next step.`,
    qualifiedResponseBridge:
      "In other words, your need is structured enough to avoid a long exploratory exchange and move toward a useful response quickly.",
    qualifiedResponseQualificationLine:
      "You can therefore receive an initial operational orientation automatically, then confirm the next step with our team if needed.",
    qualifiedResponseRecapTitle: "What we already understand from your request",
    qualifiedResponseRecapItems: {
      domain: "Domain / topic",
      participants: "Volume / participants",
      format: "Preferred format",
      timeline: "Timeline",
    },
    qualifiedResponseNextStepsTitle: "Recommended next step",
    qualifiedResponseNextSteps: {
      "contact-devis": [
        "Prepare a targeted proposal based on the requested domain and expected volume",
        "Confirm the right format, expected level, and delivery constraints through a free AI audit",
        "Then accelerate the final quote preparation",
      ],
      "demande-renseignement": [
        "Confirm the right domain and the most relevant upskilling priorities",
        "Identify 2 to 3 realistic training formats for your context",
        "Turn your need into a clear and actionable recommendation",
      ],
      "prise-rdv": [
        "Confirm your scoping slot",
        "Start the conversation with a need already summarized by our system",
        "Quickly decide the best next step: audit, catalogue, quote, or pathway",
      ],
    },
    qualifiedResponseCta: "Book the free AI audit",
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
    acknowledgementBody: (intentLabel: string) =>
      `We confirm that we received your ${intentLabel.toLowerCase()}. Our team will review it and reply from contact@transferai.ci as soon as possible.`,
    acknowledgementNextStep:
      "If your request concerns a meeting, quote or training recommendation, we may contact you to refine your need before sending the next step.",
    registrationAcknowledgementSubject: "We received your registration request - TransferAI Africa",
    registrationAcknowledgementBody: (formationLabel: string, participantsLabel?: string | null) =>
      `We confirm that we received your registration request for ${formationLabel}${participantsLabel ? `, with ${participantsLabel}` : ""}. Our team will review the submitted details and come back with a clear response adapted to your context.`,
    registrationAcknowledgementNextStep:
      "We will get back to you to confirm the course, the most relevant format, the practical arrangements, and the next step to finalize the registration.",
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
    catalogueReadySubject: (domainLabel: string) => `Your ${domainLabel} catalogue is ready | TransferAI Africa`,
    catalogueReadyBody: (domainLabel: string) =>
      `We have received your request. The catalogue for ${domainLabel} is ready and can now be accessed immediately in PDF or web format.`,
    catalogueReadyNextStep:
      "If useful, we can then help you prioritize the most relevant courses for your team and start with a free AI audit based on your context.",
    catalogueDownloadTitle: "Direct access to the requested catalogue",
    catalogueButtons: {
      pdf: "Download PDF",
      web: "View web version",
      audit: "Book a free AI audit",
    },
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

const isLocalHost = (hostname: string) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "0.0.0.0" ||
  hostname.endsWith(".local");

const sanitizeAppointmentUrl = (rawUrl?: string | null) => {
  if (!rawUrl?.trim()) {
    return null;
  }

  const trimmed = rawUrl.trim();

  try {
    const parsed = new URL(trimmed, SITE_URL);

    if (isLocalHost(parsed.hostname)) {
      return `${SITE_URL}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }

    if (!/^https?:$/i.test(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    if (trimmed.startsWith("/")) {
      return `${SITE_URL}${trimmed}`;
    }

    return null;
  }
};

const sentenceCase = (value?: string | null) => {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const buildContactNeedTopic = (copy: TranslationCopy, payload: ProspectEmailPayload) =>
  sentenceCase(payload.domain) ||
  sentenceCase(payload.formationTitle) ||
  sentenceCase(payload.message?.split(/[.!?\n]/)[0]) ||
  copy.missingValue;

const isTrainingSupportRequest = (payload: ProspectEmailPayload) =>
  (payload.intent === "contact-devis" || payload.intent === "demande-renseignement") &&
  Boolean(payload.domain?.trim() || payload.formationTitle?.trim() || payload.message?.trim());

const buildSmartAcknowledgementSubject = (copy: TranslationCopy, payload: ProspectEmailPayload) => {
  if (payload.intent === "inscription") {
    return copy.registrationAcknowledgementSubject;
  }

  if (payload.intent === "demande-catalogue") {
    return copy.acknowledgementSubject;
  }

  if (payload.intent === "demande-referencement") {
    return copy.acknowledgementSubject;
  }

  if (payload.intent === "prise-rdv") {
    return copy === translations.fr
      ? "Nous avons bien reçu votre demande de rendez-vous - TransferAI Africa"
      : "We received your meeting request - TransferAI Africa";
  }

  if (isTrainingSupportRequest(payload)) {
    return copy === translations.fr
      ? "Nous avons bien reçu votre demande de formation - TransferAI Africa"
      : "We received your training request - TransferAI Africa";
  }

  return copy.acknowledgementSubject;
};

const buildSmartAcknowledgementNextStep = (copy: TranslationCopy, payload: ProspectEmailPayload) => {
  if (payload.intent === "inscription") {
    return copy.registrationAcknowledgementNextStep;
  }

  if (payload.intent === "demande-catalogue") {
    return copy.catalogueReadyNextStep;
  }

  if (payload.intent === "demande-referencement") {
    return copy.listingResponseDelay;
  }

  if (payload.intent === "prise-rdv") {
    return copy.acknowledgementNextStep;
  }

  if (isTrainingSupportRequest(payload)) {
    return copy === translations.fr
      ? "Notre équipe reviendra vers vous avec une réponse claire sur le programme, le format recommandé, les modalités pratiques et la suite la plus pertinente pour votre besoin."
      : "Our team will come back to you with a clear response covering the programme, recommended format, delivery details, and the most relevant next step for your need.";
  }

  return copy.acknowledgementNextStep;
};

const buildSmartAcknowledgementBody = (copy: TranslationCopy, payload: ProspectEmailPayload) => {
  if (payload.intent === "inscription") {
    const formationLabel = payload.formationTitle?.trim() || copy.defaultTrainingLabel;
    const participantsLabel =
      payload.participants && payload.participants > 0
        ? copy === translations.fr
          ? `${payload.participants} participant${payload.participants > 1 ? "s" : ""}`
          : `${payload.participants} participant${payload.participants > 1 ? "s" : ""}`
        : null;

    return copy.registrationAcknowledgementBody(formationLabel, participantsLabel);
  }

  if (payload.intent === "demande-referencement") {
    return copy.listingAcknowledgementBody;
  }

  if (payload.intent === "demande-catalogue") {
    return copy.acknowledgementBody(intentLabel);
  }

  const topic = buildContactNeedTopic(copy, payload);
  const participantsLine = payload.participants && payload.participants > 0
    ? copy === translations.fr
      ? ` pour ${payload.participants} participant${payload.participants > 1 ? "s" : ""}`
      : ` for ${payload.participants} participant${payload.participants > 1 ? "s" : ""}`
    : "";
  const timelineLine = payload.timeline?.trim()
    ? copy === translations.fr
      ? ` avec une échéance indiquée à ${payload.timeline.trim()}`
      : ` with a timeline set for ${payload.timeline.trim()}`
    : "";

  if (copy === translations.fr) {
    return `Nous avons bien reçu votre besoin concernant ${topic}${participantsLine}${timelineLine}. Notre équipe va analyser votre demande et vous revenir avec une réponse utile, structurée et adaptée à votre contexte.`;
  }

  return `We have received your need regarding ${topic}${participantsLine}${timelineLine}. Our team will review your request and come back with a useful, structured response adapted to your context.`;
};

const isFastTrackIntent = (intent: ProspectEmailIntent): intent is "contact-devis" | "demande-renseignement" | "prise-rdv" =>
  intent === "contact-devis" || intent === "demande-renseignement" || intent === "prise-rdv";

const getFastTrackScore = (payload: ProspectEmailPayload) => {
  let score = 0;

  if (payload.company?.trim()) score += 1;
  if (payload.domain?.trim() || payload.formationTitle?.trim()) score += 1;
  if ((payload.message?.trim().length ?? 0) >= 24) score += 1;
  if (payload.participants && payload.participants > 0) score += 1;
  if (payload.format?.trim() || payload.timeline?.trim()) score += 1;

  return score;
};

const shouldSendQualifiedResponse = (payload: ProspectEmailPayload) =>
  payload.intent === "prise-rdv" && getFastTrackScore(payload) >= 3;

const buildQualifiedResponse = (payload: ProspectEmailPayload): EmailMessage | null => {
  if (!shouldSendQualifiedResponse(payload) || !isFastTrackIntent(payload.intent)) {
    return null;
  }

  const copy = getCopy(payload.language);
  const intro = getEmailGreeting(payload.language === "en" ? "en" : "fr", payload.fullName);
  const topic = payload.domain?.trim() || payload.formationTitle?.trim() || copy.missingValue;
  const recapLines = [
    `${copy.qualifiedResponseRecapItems.domain} : ${asTextValue(copy, payload.domain || payload.formationTitle)}`,
    `${copy.qualifiedResponseRecapItems.participants} : ${asTextValue(copy, payload.participants)}`,
    `${copy.qualifiedResponseRecapItems.format} : ${asTextValue(copy, payload.format)}`,
    `${copy.qualifiedResponseRecapItems.timeline} : ${asTextValue(copy, payload.timeline)}`,
  ];
  const nextSteps = copy.qualifiedResponseNextSteps[payload.intent];
  const ctaUrl = sanitizeAppointmentUrl(payload.appointmentUrl) || `${SITE_URL}/audit-ia-gratuit`;

  const html = `
    <div style="font-family:Arial,sans-serif;background:#f7f8fa;padding:24px;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e4e7ec;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#f28c28;">TransferAI Africa</p>
        <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2;color:#101828;">${escapeHtml(copy.qualifiedResponseSubject)}</h1>
        <p style="margin:0 0 14px;color:#101828;">${escapeHtml(intro)}</p>
        <p style="margin:0 0 14px;color:#475467;">${escapeHtml(copy.qualifiedResponseIntro(topic))}</p>
        <p style="margin:0 0 14px;color:#475467;">${escapeHtml(copy.qualifiedResponseBridge)}</p>
        <p style="margin:0 0 18px;color:#475467;">${escapeHtml(copy.qualifiedResponseQualificationLine)}</p>

        <div style="padding:20px;border-radius:12px;background:#f9fafb;border:1px solid #eaecf0;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#101828;">${escapeHtml(copy.qualifiedResponseRecapTitle)}</p>
          ${recapLines
            .map((line) => {
              const [label, ...rest] = line.split(" : ");
              return `<p style="margin:0 0 8px;color:#475467;"><strong>${escapeHtml(label)} :</strong> ${escapeHtml(rest.join(" : "))}</p>`;
            })
            .join("")}
        </div>

        <div style="margin-top:18px;padding:20px;border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#101828;">${escapeHtml(copy.qualifiedResponseNextStepsTitle)}</p>
          ${asHtmlList(nextSteps)}
        </div>

        <p style="margin:24px 0 0;">
          <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:700;">${escapeHtml(copy.qualifiedResponseCta)}</a>
        </p>
        <p style="margin:24px 0 0;color:#475467;white-space:pre-line;">${escapeHtml(copy.closing)}</p>
      </div>
    </div>
  `;

  const text = [
    intro,
    "",
    copy.qualifiedResponseIntro(topic),
    copy.qualifiedResponseBridge,
    copy.qualifiedResponseQualificationLine,
    "",
    `${copy.qualifiedResponseRecapTitle} :`,
    ...recapLines,
    "",
    `${copy.qualifiedResponseNextStepsTitle} :`,
    ...nextSteps.map((item) => `- ${item}`),
    "",
    `${copy.qualifiedResponseCta} : ${ctaUrl}`,
    "",
    copy.closing,
  ].join("\n");

  return {
    subject: copy.qualifiedResponseSubject,
    html,
    text,
    replyTo: MAIL_TO,
  };
};

const buildInternalNotification = (payload: ProspectEmailPayload): EmailMessage => {
  const copy = getCopy(payload.language);
  const isListingRequest = payload.intent === "demande-referencement";
  const appointmentUrl = sanitizeAppointmentUrl(payload.appointmentUrl);
  const domainLabel = isListingRequest ? copy.listingSectorLabel : copy.fieldLabels.domain;
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
          <tr><td style="padding:10px 0;color:#667085;">${escapeHtml(domainLabel)}</td><td style="padding:10px 0;color:#101828;">${escapeHtml(asTextValue(copy, payload.domain))}</td></tr>
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
          appointmentUrl
            ? `<p style="margin:24px 0 0;"><a href="${escapeHtml(appointmentUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#f28c28;color:#ffffff;text-decoration:none;font-weight:700;">${escapeHtml(copy.appointmentCta)}</a></p>`
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
    `${domainLabel} : ${asTextValue(copy, payload.domain)}`,
    `${copy.fieldLabels.formation} : ${asTextValue(copy, payload.formationTitle)}`,
    `${copy.fieldLabels.participants} : ${asTextValue(copy, payload.participants)}`,
    `${copy.fieldLabels.format} : ${asTextValue(copy, payload.format)}`,
    `${copy.fieldLabels.timeline} : ${asTextValue(copy, payload.timeline)}`,
    `${copy.fieldLabels.source} : ${asTextValue(copy, payload.sourcePage)}`,
    "",
    `${copy.prospectMessage} :`,
    payload.message?.trim() || copy.noExtraMessage,
    "",
    appointmentUrl ? `${copy.appointmentCta} : ${appointmentUrl}` : "",
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
  const intro = getEmailGreeting(payload.language === "en" ? "en" : "fr", payload.fullName);
  const appointmentUrl = sanitizeAppointmentUrl(payload.appointmentUrl);
  const isListingRequest = payload.intent === "demande-referencement";
  const isCatalogueRequest = payload.intent === "demande-catalogue";
  const catalogueAsset = isCatalogueRequest
    ? resolveDomainCatalogueAsset(payload.domain, payload.formationTitle, payload.message)
    : null;
  const domainLabel = isListingRequest ? copy.listingSectorLabel : copy.fieldLabels.domain;
  const shouldShowAppointmentCta = payload.intent === "prise-rdv";
  const subject = catalogueAsset
    ? copy.catalogueReadySubject(payload.language === "en" ? catalogueAsset.domainLabelEn : catalogueAsset.domainLabelFr)
    : buildSmartAcknowledgementSubject(copy, payload);
  const body = catalogueAsset
    ? copy.catalogueReadyBody(payload.language === "en" ? catalogueAsset.domainLabelEn : catalogueAsset.domainLabelFr)
    : buildSmartAcknowledgementBody(copy, payload);
  const nextStep = buildSmartAcknowledgementNextStep(copy, payload);
  const detailsTitle = copy.summaryTitle;
  const closing = copy.closing;
  const catalogueAccessBlock = catalogueAsset
    ? `
        <div style="margin-top:18px;padding:20px;border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;">
          <p style="margin:0 0 14px;font-size:14px;font-weight:700;color:#101828;">${escapeHtml(copy.catalogueDownloadTitle)}</p>
          <div style="display:flex;flex-wrap:wrap;gap:10px;">
            <a href="${escapeHtml(catalogueAsset.pdfUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#f28c28;color:#ffffff;text-decoration:none;font-weight:700;">${escapeHtml(copy.catalogueButtons.pdf)}</a>
            <a href="${escapeHtml(catalogueAsset.htmlUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#ffffff;color:#101828;text-decoration:none;font-weight:700;border:1px solid #e4e7ec;">${escapeHtml(copy.catalogueButtons.web)}</a>
            <a href="${escapeHtml(`${SITE_URL}/audit-ia-gratuit`)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:700;">${escapeHtml(copy.catalogueButtons.audit)}</a>
          </div>
        </div>
      `
    : "";
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
  const summaryLines = [
    `${copy.fieldLabels.type} : ${intentLabel}`,
    payload.intent !== "inscription" && payload.domain
      ? `${domainLabel} : ${asTextValue(copy, payload.domain)}`
      : "",
    payload.formationTitle ? `${copy.fieldLabels.formation} : ${asTextValue(copy, payload.formationTitle)}` : "",
    `${copy.fieldLabels.company} : ${asTextValue(copy, payload.company)}`,
    payload.participants ? `${copy.fieldLabels.participants} : ${asTextValue(copy, payload.participants)}` : "",
    payload.timeline ? `${copy.fieldLabels.timeline} : ${asTextValue(copy, payload.timeline)}` : "",
  ].filter(Boolean);

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
          ${summaryLines.map((line, index) => {
            const [label, ...rest] = line.split(" : ");
            return `<p style="margin:0 0 ${index === summaryLines.length - 1 ? "0" : "8px"};color:#475467;"><strong>${escapeHtml(label)} :</strong> ${escapeHtml(rest.join(" : "))}</p>`;
          }).join("")}
        </div>
        ${catalogueAccessBlock}
        ${listingReviewBlock}
        ${
          shouldShowAppointmentCta && appointmentUrl
            ? `<p style="margin:24px 0 0;"><a href="${escapeHtml(appointmentUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:700;">${escapeHtml(copy.reviewAppointment)}</a></p>`
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
    ...summaryLines,
    catalogueAsset ? `${copy.catalogueButtons.pdf} : ${catalogueAsset.pdfUrl}` : "",
    catalogueAsset ? `${copy.catalogueButtons.web} : ${catalogueAsset.htmlUrl}` : "",
    catalogueAsset ? `${copy.catalogueButtons.audit} : ${SITE_URL}/audit-ia-gratuit` : "",
    listingReviewText,
    shouldShowAppointmentCta && appointmentUrl ? `${copy.reviewAppointment} : ${appointmentUrl}` : "",
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

const logCatalogueDelivery = async (payload: ProspectEmailPayload) => {
  if (!supabase || payload.intent !== "demande-catalogue") {
    return;
  }

  const catalogueAsset = resolveDomainCatalogueAsset(payload.domain, payload.formationTitle, payload.message);

  if (!catalogueAsset) {
    return;
  }

  let assetId: string | null = null;

  const assetResult = await supabase
    .from("domain_catalogue_assets")
    .select("id")
    .eq("domain_key", catalogueAsset.domainKey)
    .maybeSingle();

  if (assetResult.error) {
    throw assetResult.error;
  }

  assetId = assetResult.data?.id ?? null;

  const insertResult = await supabase.from("catalogue_delivery_logs").insert({
    contact_request_id: payload.requestId ?? null,
    domain_key: catalogueAsset.domainKey,
    recipient_email: payload.email.trim().toLowerCase(),
    delivery_channel: "email",
    asset_id: assetId,
    status: "sent",
    sent_at: new Date().toISOString(),
    delivery_context: {
      company: payload.company ?? null,
      full_name: payload.fullName,
      source_page: payload.sourcePage ?? null,
      requested_domain: payload.domain ?? null,
      language: payload.language ?? "fr",
      catalogue_urls: {
        html: catalogueAsset.htmlUrl,
        pdf: catalogueAsset.pdfUrl,
        page: catalogueAsset.pageUrl,
      },
    },
  });

  if (insertResult.error) {
    throw insertResult.error;
  }
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
    const qualifiedResponse = buildQualifiedResponse(payload);

    const deliveries = await Promise.all([
      sendEmail(MAIL_TO, internalMessage),
      sendEmail(payload.email, acknowledgement),
      qualifiedResponse ? sendEmail(payload.email, qualifiedResponse) : Promise.resolve(null),
    ]);

    const [internalResult, acknowledgementResult, qualifiedResponseResult] = deliveries;
    let catalogueDeliveryLogError: string | null = null;

    try {
      await logCatalogueDelivery(payload);
    } catch (logError) {
      catalogueDeliveryLogError = logError instanceof Error ? logError.message : "catalogue_delivery_log_failed";
    }

    return new Response(
      JSON.stringify({
        ok: true,
        internal: internalResult,
        acknowledgement: acknowledgementResult,
        qualifiedResponse: qualifiedResponseResult,
        qualifiedResponseTriggered: Boolean(qualifiedResponse),
        catalogueDeliveryLogError,
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
