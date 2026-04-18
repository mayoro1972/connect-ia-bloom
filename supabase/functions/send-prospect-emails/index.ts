import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getEmailGreeting } from "../_shared/email-greetings.ts";
import { resolveDomainCatalogueAsset } from "../_shared/domain-catalogues.ts";

type ProspectEmailIntent =
  | "demande-catalogue"
  | "demande-renseignement"
  | "contact-devis"
  | "demande-referencement"
  | "demande-audit"
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
  wantsExpertAppointment?: boolean | null;
};

type EmailMessage = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

type AuditDomainGuide = {
  keywords: string[];
  title: string;
  intro: string;
  focusTitle: string;
  focusItems: string[];
  benefitsTitle: string;
  benefitItems: string[];
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
  auditExplainerSubject: (domainLabel: string) => string;
  auditExplainerIntro: (domainLabel: string) => string;
  auditExplainerGenericDomain: string;
  auditExplainerObjectiveTitle: string;
  auditExplainerWhatYouReceiveTitle: string;
  auditExplainerWhatYouReceiveItems: string[];
  auditExplainerProcessTitle: string;
  auditExplainerProcessItems: string[];
  auditExplainerMeetingNote: string;
  auditExplainerFormDelayNote: string;
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
    missingValue: "Non précisé",
    noExtraMessage: "Aucun message complémentaire.",
    websiteRequest: "Nouvelle demande depuis le site",
    requestLabel: "Nouvelle demande",
    listingSectorLabel: "Secteur / activité",
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
      email: "E-mail",
      phone: "Téléphone",
      company: "Organisation",
      website: "Site web",
      role: "Fonction",
      city: "Ville / Pays",
      domain: "Domaine",
      formation: "Formation",
      participants: "Participants",
      format: "Format",
      timeline: "Échéance",
      source: "Source",
      type: "Type",
    },
    prospectMessage: "Message du prospect",
    appointmentCta: "Ouvrir le lien de rendez-vous",
    acknowledgementSubject: "Nous avons bien reçu votre demande - TransferAI Africa",
    acknowledgementBody: (intentLabel: string) =>
      `Nous confirmons la bonne réception de votre ${intentLabel.toLowerCase()}. Notre équipe l’examinera et vous répondra depuis contact@transferai.ci dans les meilleurs délais.`,
    acknowledgementNextStep:
      "Si votre demande concerne un rendez-vous, un devis ou une orientation de formation, nous pourrons vous recontacter afin de préciser votre besoin avant l’étape suivante.",
    registrationAcknowledgementSubject: "Nous avons bien reçu votre demande d'inscription - TransferAI Africa",
    registrationAcknowledgementBody: (formationLabel: string, participantsLabel?: string | null) =>
      `Nous confirmons la bonne réception de votre demande d'inscription pour ${formationLabel}${participantsLabel ? `, avec ${participantsLabel}` : ""}. Notre équipe va vérifier les éléments transmis et revenir vers vous avec une réponse claire et adaptée à votre contexte.`,
    registrationAcknowledgementNextStep:
      "Nous reviendrons vers vous pour confirmer la formation, le format le plus pertinent, les modalités pratiques et la prochaine étape de finalisation de l'inscription.",
    listingAcknowledgementBody:
      "Nous confirmons la bonne réception de votre demande de référencement. Votre dossier sera relu par notre équipe afin d’évaluer sa cohérence éditoriale, le format de présence le plus adapté et les prochaines modalités à vous proposer.",
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
      "Notre retour intervient en général sous 7 à 10 jours ouvrés après réception d’un dossier exploitable. Les modalités précises et la proposition associée vous seront ensuite communiquées par e-mail.",
    summaryTitle: "Récapitulatif de votre demande",
    reviewAppointment: "Vérifier mon lien de rendez-vous",
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
    auditExplainerSubject: (domainLabel: string) =>
      `Ce que notre audit IA examinera pour ${domainLabel} - TransferAI Africa`,
    auditExplainerIntro: (domainLabel: string) =>
      `Avant l’envoi de votre formulaire d’audit, nous vous partageons le cadrage que nous utilisons le plus souvent pour analyser les besoins du domaine ${domainLabel}. Ce repère vous permet d’aborder le questionnaire avec une vision plus claire des priorités, des points d’attention et des résultats attendus.`,
    auditExplainerGenericDomain: "votre domaine",
    auditExplainerObjectiveTitle: "Objectif de l'audit",
    auditExplainerWhatYouReceiveTitle: "Ce que votre entreprise obtient",
    auditExplainerWhatYouReceiveItems: [
      "Un diagnostic synthétique des priorités IA",
      "Les irritants et opportunités les plus pertinents",
      "Des cas d'usage concrets par métier ou par équipe",
      "Une première feuille de route 30 / 60 / 90 jours",
      "Une orientation vers la bonne suite : formation, accompagnement ou solution",
    ],
    auditExplainerProcessTitle: "Comment se déroule l'audit",
    auditExplainerProcessItems: [
      "Prise de contact pour comprendre votre contexte, vos enjeux et votre secteur",
      "Audit ciblé sur les irritants, tâches critiques et zones de gains potentiels",
      "Restitution claire des priorités, risques et opportunités",
      "Orientation vers la bonne suite : formation, accompagnement, automatisation ou déploiement métier",
    ],
    auditExplainerMeetingNote:
      "Si vous avez demandé un rendez-vous, cet échange servira à clarifier vos priorités avant de compléter la fiche d’audit.",
    auditExplainerFormDelayNote:
      "Le formulaire d’audit personnalisé vous sera ensuite envoyé séparément sous environ 30 minutes.",
    closing: "Merci pour votre confiance,\nTransferAI Africa",
    intentLabels: {
      "demande-catalogue": "Demande de catalogue",
      "demande-renseignement": "Demande de renseignement",
      "contact-devis": "Demande de devis",
      "demande-referencement": "Demande de référencement",
      "demande-audit": "Demande d'audit gratuit",
      inscription: "Inscription à une formation",
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
    auditExplainerSubject: (domainLabel: string) =>
      `What our AI audit will focus on for ${domainLabel} - TransferAI Africa`,
    auditExplainerIntro: (domainLabel: string) =>
      `Before sending your audit questionnaire, we are sharing the framing we most often use to assess needs in ${domainLabel}. This gives you a clearer view of the priorities, watchpoints, and expected outcomes before the questionnaire and before any discussion with our AI expert.`,
    auditExplainerGenericDomain: "your domain",
    auditExplainerObjectiveTitle: "Audit objective",
    auditExplainerWhatYouReceiveTitle: "What your organization receives",
    auditExplainerWhatYouReceiveItems: [
      "A concise diagnosis of AI priorities",
      "The most relevant frictions and opportunities",
      "Concrete use cases by function or team",
      "An initial 30 / 60 / 90 day roadmap",
      "Guidance toward the right next step: training, support, or solution",
    ],
    auditExplainerProcessTitle: "How the audit works",
    auditExplainerProcessItems: [
      "Initial contact to understand your context, challenges, and sector",
      "Targeted audit of friction points, critical tasks, and quick-win areas",
      "Clear restitution of priorities, risks, and opportunities",
      "Guidance toward the right next step: training, support, automation, or deployment",
    ],
    auditExplainerMeetingNote:
      "If you requested a meeting, that conversation will help clarify your priorities before you fully complete the audit questionnaire.",
    auditExplainerFormDelayNote:
      "Your personalized audit questionnaire will then be sent separately in about 30 minutes.",
    closing: "Thank you for your trust,\nTransferAI Africa",
    intentLabels: {
      "demande-catalogue": "Catalogue request",
      "demande-renseignement": "Information request",
      "contact-devis": "Quote request",
      "demande-referencement": "Listing request",
      "demande-audit": "Free audit request",
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

const normalizeForMatch = (value?: string | null) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const auditDomainGuides: Record<"fr" | "en", AuditDomainGuide[]> = {
  fr: [
    {
      keywords: ["assistanat", "secretariat", "assistant", "office manager", "support executif"],
      title: "Assistanat & Secrétariat",
      intro:
        "Dans ce domaine, l'audit sert à repérer où l'IA peut faire gagner du temps sur les e-mails, comptes rendus, agendas, notes et coordination sans dégrader la fiabilité.",
      focusTitle: "Ce que l'audit regarde",
      focusItems: [
        "Flux documentaires et rédactionnels répétitifs",
        "Préparation des réunions et synthèses de direction",
        "Coordination, relances et organisation du quotidien",
      ],
      benefitsTitle: "Bénéfices attendus",
      benefitItems: [
        "Réduire le temps administratif à faible valeur",
        "Mieux structurer les livrables de direction",
        "Fiabiliser la circulation d'information",
      ],
    },
    {
      keywords: ["ressources humaines", "rh", "drh", "recrutement", "people", "human resources"],
      title: "Ressources Humaines",
      intro:
        "Dans les RH, l'audit sert à cadrer des usages responsables de l'IA sur le recrutement, l'onboarding, la communication RH et la montée en compétences.",
      focusTitle: "Ce que l'audit regarde",
      focusItems: [
        "Tri, présélection et préparation des entretiens",
        "Communication RH et accompagnement des managers",
        "Plans de formation et structuration des compétences",
      ],
      benefitsTitle: "Bénéfices attendus",
      benefitItems: [
        "Réduire le temps de recrutement",
        "Mieux personnaliser les parcours de développement",
        "Concilier efficacité, équité et conformité",
      ],
    },
    {
      keywords: ["marketing", "communication", "contenu", "growth", "marcom"],
      title: "Marketing & Communication",
      intro:
        "Ici, l'audit sert à prioriser les usages IA entre production de contenu, segmentation, analyse d'audience et pilotage des campagnes.",
      focusTitle: "Ce que l'audit regarde",
      focusItems: [
        "Création de contenu et adaptation multiformat",
        "Segmentation, personnalisation et campagnes",
        "Veille, insights et analyse d'audience",
      ],
      benefitsTitle: "Bénéfices attendus",
      benefitItems: [
        "Produire plus vite sans dégrader la cohérence de marque",
        "Mieux piloter les campagnes et les messages",
        "Transformer la veille en décisions marketing",
      ],
    },
    {
      keywords: ["finance", "comptabilite", "comptable", "controle", "audit interne"],
      title: "Finance & Comptabilité",
      intro:
        "L'audit aide à choisir les usages IA les plus pertinents entre reporting, analyse, conformité, fraude et automatisation comptable.",
      focusTitle: "Ce que l'audit regarde",
      focusItems: [
        "Reporting, consolidation et production d'analyses",
        "Détection d'anomalies, audit et conformité",
        "Automatisation des workflows comptables et financiers",
      ],
      benefitsTitle: "Bénéfices attendus",
      benefitItems: [
        "Fiabiliser les analyses et contrôles",
        "Réduire le temps de production des livrables",
        "Identifier les cas d'usage à ROI rapide",
      ],
    },
    {
      keywords: ["juridique", "compliance", "conformite", "dpo", "risques", "legal"],
      title: "Juridique & Conformité",
      intro:
        "Dans ce domaine, l'audit sert à cadrer des usages IA responsables sur la recherche, la revue documentaire, la conformité et la rédaction sensible.",
      focusTitle: "Ce que l'audit regarde",
      focusItems: [
        "Recherche documentaire et veille réglementaire",
        "Analyse contractuelle et revue de clauses",
        "Gouvernance, confidentialité et validation humaine",
      ],
      benefitsTitle: "Bénéfices attendus",
      benefitItems: [
        "Réduire le temps de recherche et de revue",
        "Fiabiliser les processus documentaires",
        "Encadrer l'usage de l'IA sur les sujets sensibles",
      ],
    },
    {
      keywords: ["service client", "support client", "cx", "centre de contact", "customer support"],
      title: "Service Client",
      intro:
        "Ici, l'audit sert à voir où l'IA peut améliorer la qualité de réponse, la vitesse de traitement et la structuration du support.",
      focusTitle: "Ce que l'audit regarde",
      focusItems: [
        "Demandes entrantes et priorisation",
        "Réponses, scripts, base de connaissance et FAQ",
        "Chatbots, relais humains et qualité de service",
      ],
      benefitsTitle: "Bénéfices attendus",
      benefitItems: [
        "Réduire les délais de réponse",
        "Améliorer la qualité et la cohérence",
        "Mieux structurer les escalades et la FAQ",
      ],
    },
    {
      keywords: ["data", "analyse", "analytique", "business intelligence", "dashboard", "bi"],
      title: "Data & Analyse",
      intro:
        "L'audit sert à identifier les zones où l'IA peut renforcer l'analyse, la visualisation, la synthèse et l'aide à la décision.",
      focusTitle: "Ce que l'audit regarde",
      focusItems: [
        "Sources de données, reporting et dashboards",
        "Synthèse, interprétation et aide à la décision",
        "Automatisation analytique et culture data",
      ],
      benefitsTitle: "Bénéfices attendus",
      benefitItems: [
        "Réduire le temps passé à consolider les données",
        "Créer des analyses plus utiles aux décideurs",
        "Monter en maturité analytique avec méthode",
      ],
    },
    {
      keywords: ["administration", "gestion", "coordination", "operations", "operatoire", "operational"],
      title: "Administration & Gestion",
      intro:
        "L'audit sert à repérer les tâches administratives, validations, suivis et reporting qui peuvent être fluidifiés rapidement.",
      focusTitle: "Ce que l'audit regarde",
      focusItems: [
        "Processus répétitifs et gestion documentaire",
        "Suivi des demandes et coordination interne",
        "Reporting, tableaux de bord et traçabilité",
      ],
      benefitsTitle: "Bénéfices attendus",
      benefitItems: [
        "Réduire la charge de ressaisie et de suivi",
        "Mieux structurer les processus internes",
        "Améliorer la traçabilité et la visibilité",
      ],
    },
    {
      keywords: ["management", "leadership", "direction generale", "manager", "transformation", "direction"],
      title: "Management & Leadership",
      intro:
        "Dans ce domaine, l'audit sert à clarifier la bonne trajectoire d'adoption, les priorités d'équipe et la gouvernance des usages IA.",
      focusTitle: "Ce que l'audit regarde",
      focusItems: [
        "Vision, cas d'usage et priorités stratégiques",
        "Conduite du changement et alignement des équipes",
        "Gouvernance, qualité et pilotage de l'adoption",
      ],
      benefitsTitle: "Bénéfices attendus",
      benefitItems: [
        "Éviter les projets IA dispersés",
        "Installer une trajectoire claire pour les équipes",
        "Faire de l'IA un levier managérial concret",
      ],
    },
    {
      keywords: ["it", "informatique", "transformation digitale", "dsi", "integration", "digitale", "digital"],
      title: "IT & Transformation Digitale",
      intro:
        "C'est le domaine où l'audit est le plus utile pour choisir les bons copilotes, workflows, outils no-code et cas d'automatisation sans créer de dette inutile.",
      focusTitle: "Ce que l'audit regarde",
      focusItems: [
        "Copilotes, outils IA et stacks à prioriser",
        "Workflows, no-code, low-code et automatisation",
        "Architecture d'usage, gouvernance et sécurité",
      ],
      benefitsTitle: "Bénéfices attendus",
      benefitItems: [
        "Choisir les bons outils avant d'empiler les solutions",
        "Réduire les cycles de test et d'intégration",
        "Installer une logique d'adoption plus maintenable",
      ],
    },
    {
      keywords: ["formation", "pedagogie", "academie", "lms", "apprenant", "teaching", "education"],
      title: "Formation & Pédagogie",
      intro:
        "L'audit sert à identifier où l'IA peut moderniser la conception, la personnalisation, la production de contenus et le suivi apprenant.",
      focusTitle: "Ce que l'audit regarde",
      focusItems: [
        "Conception de parcours et supports pédagogiques",
        "Tutorat, assistants IA et personnalisation",
        "Évaluation, LMS et analytics de formation",
      ],
      benefitsTitle: "Bénéfices attendus",
      benefitItems: [
        "Produire plus vite des contenus pédagogiques utiles",
        "Améliorer l'expérience apprenant",
        "Structurer une pédagogie augmentée et mesurable",
      ],
    },
    {
      keywords: ["sante", "bien-etre", "hse", "qvt", "prevention", "wellness", "health"],
      title: "Santé & Bien-être",
      intro:
        "L'audit sert à voir où l'IA peut aider à la prévention, au suivi, à la documentation et aux programmes santé en entreprise.",
      focusTitle: "Ce que l'audit regarde",
      focusItems: [
        "Prévention des risques et conformité HSE",
        "Suivi, reporting et documentation",
        "Programmes bien-être, QVT et vigilance terrain",
      ],
      benefitsTitle: "Bénéfices attendus",
      benefitItems: [
        "Mieux structurer la prévention",
        "Rendre le suivi plus visible et traçable",
        "Identifier les gains rapides sans complexifier les équipes",
      ],
    },
    {
      keywords: ["diplomatie", "affaires internationales", "affaires publiques", "institutions", "international"],
      title: "Diplomatie & Affaires Internationales",
      intro:
        "L'audit aide à repérer comment l'IA peut renforcer la veille, la préparation de notes, l'analyse et les communications multilingues.",
      focusTitle: "Ce que l'audit regarde",
      focusItems: [
        "Veille géopolitique, pays et secteurs",
        "Notes, briefings et préparation décisionnelle",
        "Communication multilingue et contexte international",
      ],
      benefitsTitle: "Bénéfices attendus",
      benefitItems: [
        "Accélérer les notes et synthèses",
        "Mieux structurer l'analyse stratégique",
        "Renforcer la préparation des messages et positions",
      ],
    },
  ],
  en: [
    {
      keywords: ["assistanat", "secretariat", "assistant", "office manager", "executive support"],
      title: "Executive Assistance & Administration",
      intro:
        "In this area, the audit helps identify where AI can save time on emails, meeting notes, calendars, internal coordination, and executive support without reducing reliability.",
      focusTitle: "What the audit looks at",
      focusItems: [
        "Repetitive documentation and writing flows",
        "Meeting preparation and executive summaries",
        "Coordination, follow-ups, and day-to-day organization",
      ],
      benefitsTitle: "Expected benefits",
      benefitItems: [
        "Reduce low-value administrative time",
        "Structure executive deliverables more clearly",
        "Improve information flow reliability",
      ],
    },
    {
      keywords: ["human resources", "hr", "recruitment", "people", "drh", "ressources humaines"],
      title: "Human Resources",
      intro:
        "In HR, the audit helps frame responsible AI use cases for recruitment, onboarding, HR communication, and capability building.",
      focusTitle: "What the audit looks at",
      focusItems: [
        "Screening, pre-selection, and interview preparation",
        "HR communication and manager support",
        "Training plans and skills structuring",
      ],
      benefitsTitle: "Expected benefits",
      benefitItems: [
        "Reduce recruitment cycle time",
        "Personalize development paths more effectively",
        "Balance efficiency, fairness, and compliance",
      ],
    },
    {
      keywords: ["marketing", "communication", "content", "growth", "brand"],
      title: "Marketing & Communication",
      intro:
        "Here, the audit helps prioritize AI use cases across content production, segmentation, audience analysis, and campaign steering.",
      focusTitle: "What the audit looks at",
      focusItems: [
        "Content creation and multi-format adaptation",
        "Segmentation, personalization, and campaigns",
        "Monitoring, insights, and audience analysis",
      ],
      benefitsTitle: "Expected benefits",
      benefitItems: [
        "Produce faster without weakening brand consistency",
        "Pilot campaigns and messaging more effectively",
        "Turn monitoring into marketing decisions",
      ],
    },
    {
      keywords: ["finance", "accounting", "comptabilite", "controller", "internal audit"],
      title: "Finance & Accounting",
      intro:
        "The audit helps select the most relevant AI use cases across reporting, analysis, compliance, fraud detection, and accounting automation.",
      focusTitle: "What the audit looks at",
      focusItems: [
        "Reporting, consolidation, and analytical production",
        "Anomaly detection, audit, and compliance",
        "Automation of accounting and financial workflows",
      ],
      benefitsTitle: "Expected benefits",
      benefitItems: [
        "Strengthen analysis and control reliability",
        "Reduce time spent producing deliverables",
        "Identify fast-ROI use cases",
      ],
    },
    {
      keywords: ["legal", "compliance", "risk", "dpo", "juridique", "conformite"],
      title: "Legal & Compliance",
      intro:
        "In this domain, the audit frames responsible AI use for research, document review, compliance, and sensitive drafting.",
      focusTitle: "What the audit looks at",
      focusItems: [
        "Document research and regulatory monitoring",
        "Contract analysis and clause review",
        "Governance, confidentiality, and human validation",
      ],
      benefitsTitle: "Expected benefits",
      benefitItems: [
        "Reduce research and review time",
        "Improve documentary process reliability",
        "Set clear guardrails for sensitive AI use",
      ],
    },
    {
      keywords: ["customer service", "support", "cx", "contact center", "service client"],
      title: "Customer Service",
      intro:
        "Here, the audit helps identify where AI can improve response quality, treatment speed, and support structuring.",
      focusTitle: "What the audit looks at",
      focusItems: [
        "Incoming requests and prioritization",
        "Responses, scripts, knowledge base, and FAQ",
        "Chatbots, human escalation, and service quality",
      ],
      benefitsTitle: "Expected benefits",
      benefitItems: [
        "Reduce response times",
        "Improve quality and consistency",
        "Structure escalations and FAQ more effectively",
      ],
    },
    {
      keywords: ["data", "analytics", "analysis", "bi", "dashboard", "business intelligence"],
      title: "Data & Analytics",
      intro:
        "The audit identifies where AI can strengthen analysis, visualization, synthesis, and decision support.",
      focusTitle: "What the audit looks at",
      focusItems: [
        "Data sources, reporting, and dashboards",
        "Synthesis, interpretation, and decision support",
        "Analytical automation and data culture",
      ],
      benefitsTitle: "Expected benefits",
      benefitItems: [
        "Reduce time spent consolidating data",
        "Create analysis that is more useful for decision-makers",
        "Raise analytical maturity with method",
      ],
    },
    {
      keywords: ["administration", "operations", "coordination", "management support", "gestion"],
      title: "Administration & Operations",
      intro:
        "The audit helps spot administrative tasks, validations, follow-ups, and reporting that can be streamlined quickly.",
      focusTitle: "What the audit looks at",
      focusItems: [
        "Repetitive processes and document handling",
        "Request tracking and internal coordination",
        "Reporting, dashboards, and traceability",
      ],
      benefitsTitle: "Expected benefits",
      benefitItems: [
        "Reduce re-entry and tracking workload",
        "Structure internal processes more clearly",
        "Improve traceability and visibility",
      ],
    },
    {
      keywords: ["management", "leadership", "general management", "manager", "transformation", "direction"],
      title: "Management & Leadership",
      intro:
        "In this area, the audit clarifies the right adoption path, team priorities, and governance for AI use.",
      focusTitle: "What the audit looks at",
      focusItems: [
        "Vision, strategic use cases, and priorities",
        "Change management and team alignment",
        "Governance, quality, and adoption steering",
      ],
      benefitsTitle: "Expected benefits",
      benefitItems: [
        "Avoid scattered AI initiatives",
        "Set a clear path for teams",
        "Turn AI into a concrete management lever",
      ],
    },
    {
      keywords: ["it", "digital transformation", "cio", "integration", "dsi", "informatique"],
      title: "IT & Digital Transformation",
      intro:
        "This is where the audit is especially useful to choose the right copilots, workflows, no-code tools, and automation cases without creating unnecessary debt.",
      focusTitle: "What the audit looks at",
      focusItems: [
        "Copilots, AI tools, and stacks to prioritize",
        "Workflows, no-code, low-code, and automation",
        "Usage architecture, governance, and security",
      ],
      benefitsTitle: "Expected benefits",
      benefitItems: [
        "Choose the right tools before stacking solutions",
        "Reduce test and integration cycles",
        "Install a more maintainable adoption logic",
      ],
    },
    {
      keywords: ["training", "learning", "pedagogy", "lms", "education", "formation"],
      title: "Training & Learning Design",
      intro:
        "The audit helps identify where AI can modernize instructional design, personalization, content production, and learner follow-up.",
      focusTitle: "What the audit looks at",
      focusItems: [
        "Learning journey design and teaching materials",
        "Tutoring, AI assistants, and personalization",
        "Assessment, LMS, and training analytics",
      ],
      benefitsTitle: "Expected benefits",
      benefitItems: [
        "Produce useful learning content faster",
        "Improve the learner experience",
        "Structure a measurable augmented pedagogy",
      ],
    },
    {
      keywords: ["health", "well-being", "wellbeing", "hse", "prevention", "sante"],
      title: "Health & Well-being",
      intro:
        "The audit helps identify where AI can support prevention, follow-up, documentation, and workplace health programmes.",
      focusTitle: "What the audit looks at",
      focusItems: [
        "Risk prevention and HSE compliance",
        "Follow-up, reporting, and documentation",
        "Well-being programmes and field vigilance",
      ],
      benefitsTitle: "Expected benefits",
      benefitItems: [
        "Structure prevention more clearly",
        "Make follow-up more visible and traceable",
        "Identify quick wins without overcomplicating team work",
      ],
    },
    {
      keywords: ["diplomacy", "international affairs", "public affairs", "institutions", "international"],
      title: "Diplomacy & International Affairs",
      intro:
        "The audit helps identify how AI can strengthen monitoring, briefing preparation, analysis, and multilingual communication.",
      focusTitle: "What the audit looks at",
      focusItems: [
        "Geopolitical, country, and sector monitoring",
        "Notes, briefings, and decision preparation",
        "Multilingual communication and international context",
      ],
      benefitsTitle: "Expected benefits",
      benefitItems: [
        "Accelerate notes and synthesis work",
        "Structure strategic analysis more clearly",
        "Improve preparation of messages and positions",
      ],
    },
  ],
};

const resolveAuditDomainGuide = (payload: ProspectEmailPayload) => {
  const language = payload.language === "en" ? "en" : "fr";
  const haystack = normalizeForMatch(
    [payload.domain, payload.role, payload.company, payload.message].filter(Boolean).join(" "),
  );

  const matchedGuide =
    auditDomainGuides[language].find((guide) =>
      guide.keywords.some((keyword) => haystack.includes(normalizeForMatch(keyword))),
    ) ?? null;

  return {
    copyLanguage: language,
    guide: matchedGuide,
    domainLabel:
      matchedGuide?.title ||
      sentenceCase(payload.domain) ||
      sentenceCase(payload.role) ||
      getCopy(payload.language).auditExplainerGenericDomain,
  };
};

const buildContactNeedTopic = (copy: TranslationCopy, payload: ProspectEmailPayload) =>
  sentenceCase(payload.domain) ||
  sentenceCase(payload.formationTitle) ||
  sentenceCase(payload.message?.split(/[.!?\n]/)[0]) ||
  copy.missingValue;

const buildAuditSectorPhrase = (copy: TranslationCopy, payload: ProspectEmailPayload) => {
  const domain = payload.domain?.trim();

  if (!domain || normalizeForMatch(domain) === "autres" || normalizeForMatch(domain) === "other") {
    return copy === translations.fr
      ? " dans votre secteur d'activité"
      : " in your business sector";
  }

  return copy === translations.fr
    ? ` en ${domain}`
    : ` in ${domain}`;
};

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

  if (payload.intent === "demande-audit") {
    return copy === translations.fr
      ? "Nous avons bien reçu votre demande d'audit - TransferAI Africa"
      : "We received your audit request - TransferAI Africa";
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

  if (payload.intent === "demande-audit") {
    return copy === translations.fr
      ? `${payload.wantsExpertAppointment
        ? "Si vous avez souhaité échanger avec un expert, une option de prise de rendez-vous vous sera proposée après réception et étude de votre formulaire. "
        : ""}Nous vous remercions pour votre confiance et restons à votre disposition pour toute information complémentaire.`
      : `${payload.wantsExpertAppointment
        ? "If you asked to speak with an expert, a meeting option will be offered after we receive and review your questionnaire. "
        : ""}Thank you for your trust. We remain available should you need any additional information.`;
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
  const intentLabel = copy.intentLabels[payload.intent];

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

  if (payload.intent === "demande-audit") {
    const sectorPhrase = buildAuditSectorPhrase(copy, payload);

    if (copy === translations.fr) {
      return `Nous vous confirmons la bonne réception de votre demande d’audit gratuit${sectorPhrase}. Notre équipe vous fera parvenir le formulaire d’audit dans les plus brefs délais, généralement sous environ 30 minutes. Celui-ci nous permettra de mieux comprendre vos besoins et de vous proposer une analyse adaptée.`;
    }

    return `We confirm receipt of your free audit request${sectorPhrase}. Our team will send you the audit questionnaire as soon as possible, usually within about 30 minutes. It will help us better understand your needs and provide an assessment adapted to your context.`;
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
    return `Nous avons bien reçu votre besoin concernant ${topic}${participantsLine}${timelineLine}. Notre équipe analysera votre demande et reviendra vers vous avec une réponse utile, structurée et adaptée à votre contexte.`;
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
  const shouldShowAppointmentCta =
    payload.intent === "prise-rdv" || (payload.intent === "demande-audit" && Boolean(payload.wantsExpertAppointment));
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

const buildAuditExplainer = (payload: ProspectEmailPayload): EmailMessage | null => {
  if (payload.intent !== "demande-audit") {
    return null;
  }

  const copy = getCopy(payload.language);
  const intro = getEmailGreeting(payload.language === "en" ? "en" : "fr", payload.fullName);
  const { guide, domainLabel } = resolveAuditDomainGuide(payload);
  const focusItems = guide?.focusItems ?? copy.auditExplainerWhatYouReceiveItems;
  const benefitItems = guide?.benefitItems ?? copy.auditExplainerProcessItems;
  const focusTitle = guide?.focusTitle ?? copy.auditExplainerWhatYouReceiveTitle;
  const benefitsTitle = guide?.benefitsTitle ?? copy.auditExplainerProcessTitle;
  const objectiveText = guide?.intro ?? copy.auditExplainerIntro(domainLabel);

  const html = `
    <div style="font-family:Arial,sans-serif;background:#f7f8fa;padding:24px;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e4e7ec;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#f28c28;">TransferAI Africa</p>
        <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2;color:#101828;">${escapeHtml(copy.auditExplainerSubject(domainLabel))}</h1>
        <p style="margin:0 0 14px;color:#101828;">${escapeHtml(intro)}</p>
        <p style="margin:0 0 14px;color:#475467;">${escapeHtml(copy.auditExplainerIntro(domainLabel))}</p>
        <div style="margin-top:18px;padding:20px;border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;">
          <p style="margin:0;font-size:14px;font-weight:700;color:#101828;">${escapeHtml(domainLabel)}</p>
        </div>
        <div style="margin-top:18px;padding:20px;border-radius:12px;background:#f9fafb;border:1px solid #eaecf0;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#101828;">${escapeHtml(copy.auditExplainerObjectiveTitle)}</p>
          <p style="margin:0;color:#475467;">${escapeHtml(objectiveText)}</p>
        </div>
        <div style="margin-top:18px;padding:20px;border-radius:12px;background:#f9fafb;border:1px solid #eaecf0;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#101828;">${escapeHtml(focusTitle)}</p>
          ${asHtmlList(focusItems)}
        </div>
        <div style="margin-top:18px;padding:20px;border-radius:12px;background:#f9fafb;border:1px solid #eaecf0;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#101828;">${escapeHtml(benefitsTitle)}</p>
          ${asHtmlList(benefitItems)}
        </div>
        <div style="margin-top:18px;padding:20px;border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#101828;">${escapeHtml(copy.auditExplainerWhatYouReceiveTitle)}</p>
          ${asHtmlList(copy.auditExplainerWhatYouReceiveItems)}
        </div>
        <div style="margin-top:18px;padding:20px;border-radius:12px;background:#f9fafb;border:1px solid #eaecf0;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#101828;">${escapeHtml(copy.auditExplainerProcessTitle)}</p>
          ${asHtmlList(copy.auditExplainerProcessItems)}
        </div>
        <p style="margin:24px 0 0;color:#475467;">${escapeHtml(copy.auditExplainerFormDelayNote)}</p>
        ${
          payload.wantsExpertAppointment
            ? `<p style="margin:14px 0 0;color:#475467;">${escapeHtml(copy.auditExplainerMeetingNote)}</p>`
            : ""
        }
        <p style="margin:24px 0 0;color:#475467;white-space:pre-line;">${escapeHtml(copy.closing)}</p>
      </div>
    </div>
  `;

  const text = [
    intro,
    "",
    copy.auditExplainerIntro(domainLabel),
    "",
    `${domainLabel}`,
    "",
    `${copy.auditExplainerObjectiveTitle} :`,
    objectiveText,
    "",
    `${focusTitle} :`,
    ...focusItems.map((item) => `- ${item}`),
    "",
    `${benefitsTitle} :`,
    ...benefitItems.map((item) => `- ${item}`),
    "",
    `${copy.auditExplainerWhatYouReceiveTitle} :`,
    ...copy.auditExplainerWhatYouReceiveItems.map((item) => `- ${item}`),
    "",
    `${copy.auditExplainerProcessTitle} :`,
    ...copy.auditExplainerProcessItems.map((item) => `- ${item}`),
    "",
    copy.auditExplainerFormDelayNote,
    payload.wantsExpertAppointment ? copy.auditExplainerMeetingNote : "",
    "",
    copy.closing,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: copy.auditExplainerSubject(domainLabel),
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

const logProspectDelivery = async (payload: {
  requestId?: string | null;
  recipientEmail: string;
  deliveryType: "internal_notification" | "acknowledgement" | "audit_explainer" | "qualified_response";
  subject: string;
  providerMessageId?: string | null;
  status: "sent" | "failed";
  errorMessage?: string | null;
}) => {
  if (!supabase) {
    return;
  }

  await supabase.from("prospect_email_delivery_logs").insert({
    contact_request_id: payload.requestId ?? null,
    recipient_email: payload.recipientEmail,
    delivery_type: payload.deliveryType,
    provider: "resend",
    provider_message_id: payload.providerMessageId ?? null,
    status: payload.status,
    subject: payload.subject,
    error_message: payload.errorMessage ?? null,
    sent_at: payload.status === "sent" ? new Date().toISOString() : null,
  });
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
    const auditExplainer = buildAuditExplainer(payload);

    const deliveries = await Promise.all([
      sendEmail(MAIL_TO, internalMessage),
      sendEmail(payload.email, acknowledgement),
      auditExplainer ? sendEmail(payload.email, auditExplainer) : Promise.resolve(null),
      qualifiedResponse ? sendEmail(payload.email, qualifiedResponse) : Promise.resolve(null),
    ]);

    const [internalResult, acknowledgementResult, auditExplainerResult, qualifiedResponseResult] = deliveries;
    let catalogueDeliveryLogError: string | null = null;

    try {
      await logProspectDelivery({
        requestId: payload.requestId,
        recipientEmail: MAIL_TO,
        deliveryType: "internal_notification",
        subject: internalMessage.subject,
        providerMessageId: internalResult?.id ?? null,
        status: "sent",
      });
      await logProspectDelivery({
        requestId: payload.requestId,
        recipientEmail: payload.email,
        deliveryType: "acknowledgement",
        subject: acknowledgement.subject,
        providerMessageId: acknowledgementResult?.id ?? null,
        status: "sent",
      });
      if (auditExplainer && auditExplainerResult) {
        await logProspectDelivery({
          requestId: payload.requestId,
          recipientEmail: payload.email,
          deliveryType: "audit_explainer",
          subject: auditExplainer.subject,
          providerMessageId: auditExplainerResult?.id ?? null,
          status: "sent",
        });
      }
      if (qualifiedResponse && qualifiedResponseResult) {
        await logProspectDelivery({
          requestId: payload.requestId,
          recipientEmail: payload.email,
          deliveryType: "qualified_response",
          subject: qualifiedResponse.subject,
          providerMessageId: qualifiedResponseResult?.id ?? null,
          status: "sent",
        });
      }
      await logCatalogueDelivery(payload);
    } catch (logError) {
      catalogueDeliveryLogError = logError instanceof Error ? logError.message : "catalogue_delivery_log_failed";
    }

    return new Response(
      JSON.stringify({
        ok: true,
        internal: internalResult,
        acknowledgement: acknowledgementResult,
        auditExplainer: auditExplainerResult,
        auditExplainerTriggered: Boolean(auditExplainer),
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
