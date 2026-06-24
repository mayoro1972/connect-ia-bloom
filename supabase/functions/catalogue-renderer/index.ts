import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  AlignmentType,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "npm:docx@8";
import { jsPDF } from "npm:jspdf@2";
import { corsHeaders, json } from "../_shared/editorial.ts";
import { resolveDomainCatalogueAsset } from "../_shared/domain-catalogues.ts";

type RenderStoragePayload = {
  bucket?: string;
  base_path?: string;
  pdf_filename?: string;
  docx_filename?: string;
  pdf_storage_key?: string;
  docx_storage_key?: string;
};

type CatalogueRenderPayload = {
  pack_id: string;
  organization_name?: string;
  decision_maker_name?: string;
  website?: string;
  country?: string;
  prospect_language?: string;
  sector_guess?: string;
  organization_type?: string;
  organization_summary?: string;
  entry_point_niche?: string;
  recommended_offer?: string;
  recommended_use_case?: string;
  best_selling_use_case?: string;
  single_primary_cta?: string;
  commercial_priority_tier?: string;
  catalogue_domain_slug?: string;
  catalogue_match_score?: number;
  probable_needs?: string[];
  probable_problems?: string[];
  probable_quick_wins?: string[];
  roi_hypothesis?: string[];
  expected_quick_wins?: string[];
  expected_time_savings?: string[];
  expected_service_improvements?: string[];
  delivery_timeline?: string[];
  recommended_training_bundle?: string[];
  signal_tags?: string[];
  roi_clues?: string[];
  sector_pitches?: string[];
  public_text_sanitized_excerpt?: string;
  tailored_catalogue_markdown?: string;
  audit_form_url?: string;
  calendly_url?: string;
  storage?: RenderStoragePayload;
};

type CatalogueSection = {
  title: string;
  body?: string[];
  bullets?: string[];
};

type SupportedLocale = "fr" | "en" | "es";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const CONTENT_ADMIN_TOKEN = Deno.env.get("CONTENT_ADMIN_TOKEN") ?? "";
const PUBLIC_SITE_URL = (Deno.env.get("PUBLIC_SITE_URL") ?? "https://www.transferai.ci").replace(/\/$/, "");
const DEFAULT_AUDIT_ACCESS_URL = `${PUBLIC_SITE_URL}/acces-formulaire-audit`;
const LOGO_PATH = new URL("../_shared/assets/transferai-africa-nettelecom-co-brand.png", import.meta.url);

const BRAND = {
  accent: "#E76F1D",
  ink: "#1A3554",
  soft: "#617086",
  teal: "#1C8A78",
  warm: "#FBF5EE",
  mist: "#F3F7FB",
  white: "#FFFFFF",
};

const inferLocale = (value?: string): SupportedLocale => {
  const normalized = trimText(value).toLowerCase();
  if (normalized.startsWith("en")) return "en";
  if (normalized.startsWith("es")) return "es";
  return "fr";
};

const localize = (locale: SupportedLocale, fr: string, en?: string, es?: string) => {
  if (locale === "en") return en ?? fr;
  if (locale === "es") return es ?? fr;
  return fr;
};

const sanitizeProspectText = (value: unknown) =>
  trimText(value)
    .replace(/\bORG_TARGET\b/gi, "")
    .replace(/\bDECISION_MAKER_TARGET\b/gi, "")
    .replace(/\b(décideur|decideur)\s+(à|a)\s+confirmer\b/gi, "")
    .replace(/\bdecision maker to confirm\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .trim();

const compactText = (value: unknown, max = 220) => {
  const normalized = sanitizeProspectText(value).replace(/\s+/g, " ");
  if (!normalized || normalized.length <= max) return normalized;
  const slice = normalized.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 80 ? slice.slice(0, lastSpace) : slice).trim()}…`;
};

const isOrangeProspect = (payload: CatalogueRenderPayload) => {
  const haystack = `${trimText(payload.organization_name)} ${trimText(payload.website)}`.toLowerCase();
  return haystack.includes("orange");
};

const getOrangeReference = (locale: SupportedLocale) => ({
  overview: localize(
    locale,
    "Orange Côte d’Ivoire opère des flux à fort volume où la qualité de réponse, la coordination entre canaux, la diffusion des procédures et la vitesse de pilotage ont un impact direct sur l’expérience client et l’efficacité opérationnelle.",
    "Orange Côte d’Ivoire runs high-volume workflows where response quality, cross-channel coordination, procedure circulation, and steering speed directly affect customer experience and operational efficiency.",
    "Orange Côte d’Ivoire opera flujos de alto volumen donde la calidad de respuesta, la coordinación entre canales, la difusión de procedimientos y la velocidad de pilotaje afectan directamente la experiencia del cliente y la eficiencia operativa.",
  ),
  primaryMessage: localize(
    locale,
    "La recommandation n’est pas un catalogue large, mais une séquence ciblée entre audit, cas d’usage priorisés, formation utile, accompagnement sur 90 jours et décision d’extension sur la base de KPI concrets.",
    "The recommendation is not a broad catalogue, but a focused sequence combining audit, priority use cases, relevant training, 90-day support, and scale-up decisions grounded in concrete KPIs.",
    "La recomendación no es un catálogo amplio, sino una secuencia focalizada que combina auditoría, casos de uso prioritarios, formación útil, acompañamiento de 90 días y decisión de ampliación basada en KPI concretos.",
  ),
  pains: [
    localize(locale, "Mieux traiter les demandes récurrentes sur plusieurs canaux.", "Handle recurring requests better across multiple channels.", "Tratar mejor las solicitudes recurrentes en varios canales."),
    localize(locale, "Réduire le temps de préparation des synthèses de pilotage.", "Reduce the time needed to prepare management summaries.", "Reducir el tiempo de preparación de las síntesis de pilotaje."),
    localize(locale, "Rendre les procédures et scripts plus accessibles aux équipes front et support.", "Make procedures and scripts easier to access for front and support teams.", "Hacer más accesibles los procedimientos y guiones para los equipos front y soporte."),
    localize(locale, "Améliorer la cohérence des réponses et la continuité de traitement.", "Improve answer consistency and continuity of treatment.", "Mejorar la coherencia de las respuestas y la continuidad del tratamiento."),
  ],
  useCases: [
    localize(locale, "Copilote service client multicanal", "Multichannel customer-service copilot", "Copiloto multicanal de atención al cliente"),
    localize(locale, "Synthèse tickets et incidents", "Ticket and incident summarization", "Síntesis de tickets e incidentes"),
    localize(locale, "Base procédures et scripts terrain", "Procedure and field-script knowledge base", "Base de procedimientos y guiones de campo"),
    localize(locale, "Commentaire IA du pilotage qualité", "AI commentary for quality steering", "Comentario de IA para el pilotaje de calidad"),
  ],
  training: [
    localize(locale, "IA appliquée au service client multicanal", "AI applied to multichannel customer service", "IA aplicada al servicio al cliente multicanal"),
    localize(locale, "IA pour reporting, tickets et synthèses managériales", "AI for reporting, tickets, and management summaries", "IA para reporting, tickets y síntesis gerenciales"),
    localize(locale, "Gouvernance des procédures, scripts et base de connaissances", "Governance for procedures, scripts, and knowledge base", "Gobernanza de procedimientos, guiones y base de conocimiento"),
    localize(locale, "Gouvernance IA, confidentialité et supervision humaine", "AI governance, confidentiality, and human supervision", "Gobernanza de IA, confidencialidad y supervisión humana"),
  ],
  timeline: [
    localize(locale, "J+0 : audit et cadrage des flux service client et pilotage.", "Day 0: audit and scoping of customer-service and steering workflows.", "Día 0: auditoría y encuadre de los flujos de atención al cliente y pilotaje."),
    localize(locale, "J+15 : premier livrable exploitable ou première synthèse automatisée.", "Day 15: first operational deliverable or first automated summary.", "Día 15: primer entregable explotable o primera síntesis automatizada."),
    localize(locale, "J+45 : formation ciblée, gouvernance d’usage et lancement du pilote.", "Day 45: targeted training, usage governance, and pilot launch.", "Día 45: formación focalizada, gobernanza de uso y lanzamiento del piloto."),
    localize(locale, "J+90 : mesure des résultats, lecture de l’adoption et décision d’extension.", "Day 90: measure results, review adoption, and decide on scale-up.", "Día 90: medir resultados, revisar adopción y decidir la ampliación."),
  ],
});

const FOOTER_LINE =
  "TransferAI Africa | Hub IA de NettelecomCI | contact@transferai.ci | www.transferai.ci | +225 07 16 57 39 90";

const TEAM_SIGNATURES = [
  {
    name: "Casimir Kassi Beda",
    title: "Directeur général",
    focus: "Vision stratégique et pilotage",
    email: "contact@transferai.ci",
  },
  {
    name: "Marius Ayoro",
    title: "Directeur Développement et Partenariats",
    focus: "Relations prospects et développement",
    email: "marius.ayoro@transferai.ci",
  },
  {
    name: "Eric N'Guessan",
    title: "Directeur Audit, pédagogie et certification",
    focus: "Formations et expertise sectorielle",
    email: "eric.nguessan@transferai.ci",
  },
];

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

const trimText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const normalizeList = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => trimText(item))
      .filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [] as string[];
};

const safeFilenamePart = (value: string | undefined) =>
  (value || "Prospect")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120) || "Prospect";

const stripMarkdown = (value: string) =>
  sanitizeProspectText(value)
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .replace(/\r/g, "")
    .trim();

const splitMarkdownBlocks = (markdown: string) =>
  stripMarkdown(markdown)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

const loadLogoBytes = async () => {
  try {
    return await Deno.readFile(LOGO_PATH);
  } catch {
    return null;
  }
};

const rgbFromHex = (hex: string) => {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
};

const pdfColor = (pdf: jsPDF, hex: string) => {
  const { r, g, b } = rgbFromHex(hex);
  pdf.setTextColor(r, g, b);
};

const pdfFill = (pdf: jsPDF, hex: string) => {
  const { r, g, b } = rgbFromHex(hex);
  pdf.setFillColor(r, g, b);
};

const toDataUrl = (bytes: Uint8Array, mimeType: string) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return `data:${mimeType};base64,${btoa(binary)}`;
};

const buildHeroSubtitle = (payload: CatalogueRenderPayload, domainLabel: string) => {
  const sector = trimText(payload.sector_guess);
  const country = trimText(payload.country);
  return [domainLabel, sector, country].filter(Boolean).join(" · ");
};

const buildPrimaryMessage = (payload: CatalogueRenderPayload, domainLabel: string) => {
  const locale = inferLocale(payload.prospect_language);
  const orangeRef = isOrangeProspect(payload) ? getOrangeReference(locale) : null;
  const organisation = trimText(payload.organization_name) || "votre organisation";
  const useCase = trimText(payload.recommended_use_case);
  const offer = trimText(payload.recommended_offer);
  const niche = trimText(payload.entry_point_niche);
  const sector = trimText(payload.sector_guess) || domainLabel;

  if (orangeRef) return orangeRef.primaryMessage;

  return [
    localize(locale, `${organisation} présente un potentiel concret de transformation dans ${sector}.`, `${organisation} shows concrete transformation potential in ${sector}.`, `${organisation} presenta un potencial concreto de transformación en ${sector}.`),
    useCase ? localize(locale, `Le cas d’usage prioritaire recommandé est ${useCase}.`, `The recommended priority use case is ${useCase}.`, `El caso de uso prioritario recomendado es ${useCase}.`) : "",
    niche ? localize(locale, `Le point d’entrée identifié est ${niche}.`, `The identified entry point is ${niche}.`, `La puerta de entrada identificada es ${niche}.`) : "",
    offer ? localize(locale, `TransferAI propose un dispositif ciblé autour de ${offer}.`, `TransferAI recommends a targeted setup built around ${offer}.`, `TransferAI propone un dispositivo focalizado alrededor de ${offer}.`) : "",
  ].filter(Boolean).join(" ");
};

const sectionTitle = (index: number, title: string) => `${String(index).padStart(2, "0")} — ${title}`;

const addDocxBullet = (text: string) =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [
      new TextRun({
        text,
        size: 21,
        color: BRAND.ink.replace("#", ""),
      }),
    ],
  });

const buildKpiHighlights = (payload: CatalogueRenderPayload) => {
  const highlights = [
    ...normalizeList(payload.expected_time_savings),
    ...normalizeList(payload.expected_service_improvements),
    ...normalizeList(payload.expected_quick_wins),
    ...normalizeList(payload.roi_hypothesis),
  ].filter(Boolean);

  return highlights.slice(0, 4);
};

const buildOverviewText = (payload: CatalogueRenderPayload, domainLabel: string) => {
  const locale = inferLocale(payload.prospect_language);
  const orangeRef = isOrangeProspect(payload) ? getOrangeReference(locale) : null;
  const summary = trimText(payload.organization_summary);
  if (summary) return summary;
  if (orangeRef) return orangeRef.overview;

  const org = trimText(payload.organization_name) || localize(locale, "Cette organisation", "This organization", "Esta organización");
  const sector = trimText(payload.sector_guess) || domainLabel;
  const useCase = trimText(payload.recommended_use_case);

  return [
    localize(locale, `${org} présente un potentiel de transformation autour du domaine ${domainLabel}.`, `${org} shows transformation potential around the ${domainLabel} domain.`, `${org} presenta potencial de transformación alrededor del dominio ${domainLabel}.`),
    sector ? localize(locale, `Le pré-audit indique un contexte prioritaire autour de ${sector}.`, `The pre-audit highlights a priority context around ${sector}.`, `La preauditoría indica un contexto prioritario alrededor de ${sector}.`) : "",
    useCase ? localize(locale, `Le cas d’usage recommandé est : ${useCase}.`, `The recommended use case is: ${useCase}.`, `El caso de uso recomendado es: ${useCase}.`) : "",
  ].filter(Boolean).join(" ");
};

const buildSections = (payload: CatalogueRenderPayload, domainLabel: string, domainPageUrl: string) => {
  const locale = inferLocale(payload.prospect_language);
  const orangeRef = isOrangeProspect(payload) ? getOrangeReference(locale) : null;
  const sections: CatalogueSection[] = [];
  const organisation = trimText(payload.organization_name) || localize(locale, "Organisation à confirmer", "Organization to be confirmed", "Organización por confirmar");
  const sector = trimText(payload.sector_guess) || domainLabel;
  const recommendedOffer = trimText(payload.recommended_offer);
  const recommendedUseCase = trimText(payload.recommended_use_case);
  const bestSellingUseCase = trimText(payload.best_selling_use_case);
  const cta = trimText(payload.single_primary_cta);
  const markdownBlocks = splitMarkdownBlocks(trimText(payload.tailored_catalogue_markdown));
  const executiveSummaryBlocks = markdownBlocks.slice(0, 3);
  const supplementalMarkdownBlocks = markdownBlocks.slice(3, 7);

  sections.push({
    title: localize(locale, `Synthèse exécutive pour ${organisation}`, `Executive summary for ${organisation}`, `Síntesis ejecutiva para ${organisation}`),
    body: executiveSummaryBlocks.length
      ? executiveSummaryBlocks.map((block) => compactText(block, 420))
      : [buildOverviewText(payload, domainLabel)],
  });

  const pains = orangeRef?.pains || normalizeList(payload.probable_problems);
  const needs = normalizeList(payload.probable_needs);
  const quickWins = normalizeList(payload.probable_quick_wins);
  const roi = normalizeList(payload.roi_hypothesis);
  const timeline = orangeRef?.timeline || normalizeList(payload.delivery_timeline);
  const training = orangeRef?.training || normalizeList(payload.recommended_training_bundle);
  const sectorPitches = normalizeList(payload.sector_pitches);
  const expectedImprovements = normalizeList(payload.expected_service_improvements);
  const expectedSavings = normalizeList(payload.expected_time_savings);
  const expectedQuickWins = normalizeList(payload.expected_quick_wins);

  if (pains.length || needs.length) {
    sections.push({
      title: localize(locale, `Priorités métier pour ${organisation}`, `Business priorities for ${organisation}`, `Prioridades operativas para ${organisation}`),
      body: [
        localize(locale, `Défis identifiés dans le contexte ${sector}.`, `Challenges identified in the ${sector} context.`, `Desafíos identificados en el contexto de ${sector}.`),
        localize(locale, "Résultats visés : plus de fluidité opérationnelle, de visibilité managériale et de fiabilité dans les décisions.", "Target outcomes: smoother operations, stronger managerial visibility, and more reliable decisions.", "Resultados buscados: más fluidez operativa, mayor visibilidad gerencial y decisiones más fiables."),
      ],
      bullets: [...pains, ...needs].slice(0, 8).map((item) => compactText(item, 180)),
    });
  }

  if (recommendedOffer || recommendedUseCase || bestSellingUseCase || sectorPitches.length || supplementalMarkdownBlocks.length) {
    sections.push({
      title: localize(locale, "Cas d’usage, solutions et accompagnement", "Use cases, solutions, and support", "Casos de uso, soluciones y acompañamiento"),
      body: [
        recommendedOffer ? localize(locale, `Offre recommandée : ${recommendedOffer}.`, `Recommended offer: ${recommendedOffer}.`, `Oferta recomendada: ${recommendedOffer}.`) : "",
        recommendedUseCase ? localize(locale, `Cas d’usage recommandé : ${recommendedUseCase}.`, `Recommended use case: ${recommendedUseCase}.`, `Caso de uso recomendado: ${recommendedUseCase}.`) : "",
        bestSellingUseCase ? localize(locale, `Scénario prioritaire commercialement : ${bestSellingUseCase}.`, `Commercially prioritized scenario: ${bestSellingUseCase}.`, `Escenario comercial prioritario: ${bestSellingUseCase}.`) : "",
        ...supplementalMarkdownBlocks.map((block) => compactText(block, 280)),
      ].filter(Boolean),
      bullets: sectorPitches.slice(0, 6).map((item) => compactText(item, 180)),
    });
  }

  if (training.length) {
    sections.push({
      title: localize(locale, "Formations prioritaires", "Priority training tracks", "Formaciones prioritarias"),
      body: [
        localize(
          locale,
          `Le domaine ${domainLabel} sert de base, mais le parcours est ajusté en fonction des signaux collectés sur le site du prospect, des besoins détectés pendant le pré-audit et des équipes à embarquer.`,
          `The ${domainLabel} domain provides the starting point, but the path is adjusted according to the signals collected on the prospect's site, the needs surfaced during the pre-audit, and the teams to be onboarded.`,
          `El dominio ${domainLabel} sirve de base, pero el recorrido se ajusta según las señales recogidas en el sitio del prospecto, las necesidades detectadas durante la preauditoría y los equipos que deben involucrarse.`,
        ),
      ],
      bullets: training.slice(0, 8).map((item) => compactText(item, 180)),
    });
  }

  if (quickWins.length || roi.length || expectedSavings.length || expectedImprovements.length || expectedQuickWins.length) {
    sections.push({
      title: localize(locale, "Quick wins et impact attendu", "Quick wins and expected impact", "Quick wins e impacto esperado"),
      body: [
        localize(
          locale,
          `Le pré-audit permet de formuler une proposition ciblée pour ${organisation}, avec des gains opérationnels et managériaux observables à court terme.`,
          `The pre-audit makes it possible to frame a focused proposal for ${organisation}, with short-term operational and managerial gains.`,
          `La preauditoría permite formular una propuesta focalizada para ${organisation}, con ganancias operativas y gerenciales observables a corto plazo.`,
        ),
      ],
      bullets: [...quickWins, ...expectedQuickWins, ...expectedSavings, ...expectedImprovements, ...roi].slice(0, 10).map((item) => compactText(item, 180)),
    });
  }

  if (timeline.length) {
    sections.push({
      title: localize(locale, "Trajectoire de mise en œuvre sur 90 jours", "90-day implementation path", "Trayectoria de ejecución a 90 días"),
      bullets: timeline.slice(0, 8).map((item) => compactText(item, 180)),
    });
  }

  sections.push({
    title: localize(locale, "Prochaine étape", "Next step", "Próxima etapa"),
    body: [
      cta || localize(locale, "Planifier un audit TransferAI pour confirmer les priorités, cadrer le pilote et enclencher la phase de formation et d’accompagnement.", "Book a TransferAI audit to confirm priorities, scope the pilot, and trigger the training and support phase.", "Agendar una auditoría de TransferAI para confirmar prioridades, encuadrar el piloto y activar la fase de formación y acompañamiento."),
      payload.audit_form_url ? `${localize(locale, "Formulaire d’audit", "Audit form", "Formulario de auditoría")} : ${payload.audit_form_url}` : "",
      payload.calendly_url ? `${localize(locale, "Prise de rendez-vous", "Booking link", "Enlace de reserva")} : ${payload.calendly_url}` : "",
      domainPageUrl ? `${localize(locale, "Page domaine de référence", "Reference domain page", "Página de referencia del dominio")} : ${domainPageUrl}` : "",
    ].filter(Boolean),
  });

  return sections;
};

const buildDocx = async (payload: CatalogueRenderPayload, domainLabel: string, domainPageUrl: string) => {
  const locale = inferLocale(payload.prospect_language);
  const organisation = trimText(payload.organization_name) || localize(locale, "Organisation à confirmer", "Organization to be confirmed", "Organización por confirmar");
  const country = trimText(payload.country);
  const website = trimText(payload.website);
  const issueDate = new Date().toLocaleDateString(locale === "en" ? "en-US" : locale === "es" ? "es-ES" : "fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const logoBytes = await loadLogoBytes();
  const sections = buildSections(payload, domainLabel, domainPageUrl);
  const kpiHighlights = buildKpiHighlights(payload);
  const heroSubtitle = buildHeroSubtitle(payload, domainLabel);
  const primaryMessage = buildPrimaryMessage(payload, domainLabel);

  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      style: "Normal",
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: "MINI-CATALOGUE",
          bold: true,
          size: 20,
          color: BRAND.accent.replace("#", ""),
          allCaps: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: localize(locale, "SOLUTIONS IA ET FORMATIONS STRATÉGIQUES", "AI SOLUTIONS AND STRATEGIC TRAINING", "SOLUCIONES DE IA Y FORMACIÓN ESTRATÉGICA"),
          bold: true,
          size: 32,
          color: BRAND.ink.replace("#", ""),
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: localize(locale, `pour ${organisation}`, `for ${organisation}`, `para ${organisation}`),
          bold: true,
          size: 28,
          color: BRAND.teal.replace("#", ""),
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 220 },
      children: [
        new TextRun({
          text: heroSubtitle,
          italics: true,
          size: 21,
          color: BRAND.soft.replace("#", ""),
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 80, after: 120 },
      children: [
        new TextRun({
          text: localize(locale, "QUI SOMMES-NOUS", "WHO WE ARE", "QUIÉNES SOMOS"),
          bold: true,
          size: 24,
          color: BRAND.ink.replace("#", ""),
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "TransferAI Africa",
          bold: true,
          size: 24,
          color: BRAND.ink.replace("#", ""),
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: localize(locale, "Hub IA de NettelecomCI en Côte d’Ivoire", "NettelecomCI AI hub in Côte d’Ivoire", "Hub de IA de NettelecomCI en Côte d’Ivoire"),
          size: 22,
          color: BRAND.teal.replace("#", ""),
        }),
      ],
    }),
  );

  for (const item of [
    localize(locale, "13 experts ivoiriens et internationaux mobilisables", "13 mobilizable Ivorian and international experts", "13 expertos marfileños e internacionales movilizables"),
    localize(locale, "Bases d’intervention : Côte d’Ivoire, Royaume-Uni, États-Unis et Inde", "Delivery bases: Côte d’Ivoire, United Kingdom, United States, and India", "Bases de intervención: Côte d’Ivoire, Reino Unido, Estados Unidos e India"),
    localize(locale, "Cas d’usage concrets et transposables dans la finance, l’énergie, l’industrie et les services", "Concrete use cases transferable across finance, energy, industry, and services", "Casos de uso concretos y transferibles en finanzas, energía, industria y servicios"),
    localize(locale, "Mobilité internationale sans frein et présence locale forte via NettelecomCI", "Unconstrained international mobility and strong local presence through NettelecomCI", "Movilidad internacional sin fricciones y fuerte presencia local a través de NettelecomCI"),
    localize(locale, "Accompagnement pragmatique combiné à la formation, au pilotage et à la gouvernance", "Pragmatic support combining training, steering, and governance", "Acompañamiento pragmático combinado con formación, pilotaje y gobernanza"),
  ]) {
    children.push(addDocxBullet(item));
  }

  children.push(
    new Paragraph({
      spacing: { before: 120, after: 30 },
      children: [
        new TextRun({
          text: localize(locale, "Notre mission", "Our mission", "Nuestra misión"),
          bold: true,
          size: 21,
          color: BRAND.ink.replace("#", ""),
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 90 },
      children: [
        new TextRun({
          text: localize(locale, "Transformer l’IA en solutions concrètes, utiles et immédiatement activables pour les organisations africaines.", "Turn AI into concrete, useful, and immediately actionable solutions for African organizations.", "Transformar la IA en soluciones concretas, útiles e inmediatamente activables para las organizaciones africanas."),
          size: 20,
          color: BRAND.ink.replace("#", ""),
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: localize(locale, "Notre engagement", "Our commitment", "Nuestro compromiso"),
          bold: true,
          size: 21,
          color: BRAND.ink.replace("#", ""),
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 140 },
      children: [
        new TextRun({
          text: localize(locale, "Pas de l’IA pour l’IA : des solutions de performance, de formation et de transformation adaptées aux réalités terrain de chaque prospect.", "No AI for AI’s sake: performance, training, and transformation solutions adapted to each prospect’s operational reality.", "No IA por la IA: soluciones de rendimiento, formación y transformación adaptadas a la realidad operativa de cada prospecto."),
          size: 20,
          color: BRAND.ink.replace("#", ""),
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 160, after: 100 },
      children: [
        new TextRun({
          text: localize(locale, `MESSAGE CENTRAL POUR ${organisation.toUpperCase()}`, `CORE MESSAGE FOR ${organisation.toUpperCase()}`, `MENSAJE CENTRAL PARA ${organisation.toUpperCase()}`),
          bold: true,
          size: 24,
          color: BRAND.ink.replace("#", ""),
        }),
      ],
    }),
    new Paragraph({
      shading: {
        fill: BRAND.warm.replace("#", ""),
        type: ShadingType.CLEAR,
        color: "auto",
      },
      spacing: { before: 80, after: 180 },
      children: [
        new TextRun({
          text: primaryMessage,
          bold: true,
          size: 22,
          color: BRAND.ink.replace("#", ""),
        }),
      ],
    }),
  );

  if (kpiHighlights.length) {
    const rowCells = kpiHighlights.map((item) =>
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        shading: { fill: BRAND.mist.replace("#", ""), type: ShadingType.CLEAR, color: "auto" },
        margins: { top: 120, bottom: 120, left: 120, right: 120 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: item,
                bold: true,
                size: 20,
                color: BRAND.ink.replace("#", ""),
              }),
            ],
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        spacing: { before: 120, after: 80 },
        children: [
          new TextRun({
            text: localize(locale, "HYPOTHÈSE DE GAINS ATTENDUS", "EXPECTED VALUE HYPOTHESES", "HIPÓTESIS DE GANANCIAS ESPERADAS"),
            bold: true,
            size: 24,
            color: BRAND.ink.replace("#", ""),
          }),
        ],
      }),
    );

    while (rowCells.length < 4) {
      rowCells.push(new TableCell({ children: [new Paragraph("")] }));
    }

    const kpiTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [new TableRow({ children: rowCells })],
    });
    // @ts-ignore docx Table is allowed in section children
    children.push(kpiTable);
  }

  sections.forEach((section, index) => {
    children.push(
      new Paragraph({
        spacing: { before: 180, after: 80 },
        children: [
          new TextRun({
            text: sectionTitle(index + 1, section.title),
            bold: true,
            size: 24,
            color: BRAND.accent.replace("#", ""),
          }),
        ],
      }),
    );

    for (const block of section.body ?? []) {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: block,
              size: 21,
              color: BRAND.ink.replace("#", ""),
            }),
          ],
        }),
      );
    }

    for (const bullet of section.bullets ?? []) {
      children.push(addDocxBullet(bullet));
    }
  });

  children.push(
    new Paragraph({
      spacing: { before: 180, after: 80 },
      children: [
        new TextRun({
          text: localize(locale, "PROPOSITION IMMÉDIATE", "IMMEDIATE PROPOSAL", "PROPUESTA INMEDIATA"),
          bold: true,
          size: 24,
          color: BRAND.ink.replace("#", ""),
        }),
      ],
    }),
    new Paragraph({
      shading: {
        fill: BRAND.warm.replace("#", ""),
        type: ShadingType.CLEAR,
        color: "auto",
      },
      spacing: { before: 100, after: 180 },
      children: [
        new TextRun({
          text: trimText(payload.single_primary_cta) || localize(locale, "Planifier un audit IA gratuit et un rendez-vous expert de 30 minutes.", "Book a free AI audit and a 30-minute expert session.", "Agendar una auditoría gratuita de IA y una sesión experta de 30 minutos."),
          bold: true,
          size: 22,
          color: BRAND.ink.replace("#", ""),
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: payload.calendly_url || "https://calendly.com/contact-transferai/30min", size: 20, color: BRAND.teal.replace("#", "") })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: payload.audit_form_url || DEFAULT_AUDIT_ACCESS_URL, size: 20, color: BRAND.teal.replace("#", "") })],
    }),
    new Paragraph({
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({
          text: localize(locale, "VOTRE ÉQUIPE TRANSFERAI", "YOUR TRANSFERAI TEAM", "SU EQUIPO TRANSFERAI"),
          bold: true,
          size: 24,
          color: BRAND.ink.replace("#", ""),
        }),
      ],
    }),
  );

  TEAM_SIGNATURES.forEach((signer) => {
    children.push(
      new Paragraph({
        spacing: { after: 30 },
        children: [
          new TextRun({
            text: signer.name,
            bold: true,
            size: 21,
            color: BRAND.ink.replace("#", ""),
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 20 },
        children: [new TextRun({ text: signer.title, italics: true, size: 19, color: BRAND.soft.replace("#", "") })],
      }),
      new Paragraph({
        spacing: { after: 20 },
        children: [new TextRun({ text: signer.focus, size: 19, color: BRAND.ink.replace("#", "") })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: signer.email, size: 18, color: BRAND.teal.replace("#", "") })],
      }),
    );
  });

  const headerChildren: Paragraph[] = [];
  if (logoBytes) {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 0 },
        children: [
          new ImageRun({
            data: logoBytes,
            transformation: { width: 190, height: 90 },
          }),
        ],
      }),
    );
  }
  headerChildren.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: localize(locale, "Mini-catalogue automatisé | Formation, accompagnement et gouvernance IA", "Automated mini-catalogue | Training, support, and AI governance", "Mini-catálogo automatizado | Formación, acompañamiento y gobernanza de IA"),
          size: 16,
          color: BRAND.soft.replace("#", ""),
        }),
      ],
    }),
  );

  const footerChildren = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: FOOTER_LINE,
          size: 16,
          color: BRAND.soft.replace("#", ""),
        }),
      ],
    }),
  ];

  const doc = new Document({
    sections: [{
      properties: {},
      headers: { default: new Header({ children: headerChildren }) },
      footers: { default: new Footer({ children: footerChildren }) },
      children,
    }],
  });

  return await Packer.toBuffer(doc);
};

const buildPdf = async (payload: CatalogueRenderPayload, domainLabel: string, domainPageUrl: string) => {
  const locale = inferLocale(payload.prospect_language);
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 46;
  const contentWidth = pageWidth - margin * 2;
  const sections = buildSections(payload, domainLabel, domainPageUrl);
  const logoBytes = await loadLogoBytes();
  const heroSubtitle = buildHeroSubtitle(payload, domainLabel);
  const primaryMessage = buildPrimaryMessage(payload, domainLabel);
  const organisation = trimText(payload.organization_name) || localize(locale, "Organisation à confirmer", "Organization to be confirmed", "Organización por confirmar");
  const issueDate = new Date().toLocaleDateString(locale === "en" ? "en-US" : locale === "es" ? "es-ES" : "fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  let y = 42;

  const ensureSpace = (required: number) => {
    if (y + required <= pageHeight - 54) return;
    pdf.addPage();
    y = 42;
  };

  const drawFooter = () => {
    pdf.setDrawColor(225, 230, 236);
    pdf.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdfColor(pdf, BRAND.soft);
    pdf.text(FOOTER_LINE, pageWidth / 2, pageHeight - 18, { align: "center" });
  };

  const writeParagraph = (text: string, opts: { size?: number; bold?: boolean; color?: string; indent?: number } = {}) => {
    const size = opts.size ?? 11;
    const indent = opts.indent ?? 0;
    const lines = pdf.splitTextToSize(text, contentWidth - indent) as string[];
    const lineHeight = size + 4;
    ensureSpace(lines.length * lineHeight + 8);
    pdf.setFont("helvetica", opts.bold ? "bold" : "normal");
    pdf.setFontSize(size);
    pdfColor(pdf, opts.color ?? BRAND.ink);
    pdf.text(lines, margin + indent, y);
    y += lines.length * lineHeight + 6;
  };

  const writeBullet = (text: string) => {
    ensureSpace(34);
    pdfFill(pdf, BRAND.accent);
    pdf.circle(margin + 4, y - 4, 2.2, "F");
    writeParagraph(text, { indent: 14, size: 10.8 });
  };

  const drawSectionTitle = (title: string) => {
    ensureSpace(30);
    pdfFill(pdf, BRAND.accent);
    pdf.rect(margin, y - 6, 6, 18, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdfColor(pdf, BRAND.ink);
    pdf.text(title, margin + 14, y + 6);
    y += 24;
  };

  const drawCallout = (title: string, text: string) => {
    const lines = pdf.splitTextToSize(text, contentWidth - 28) as string[];
    const height = 28 + lines.length * 14;
    ensureSpace(height + 12);
    pdfFill(pdf, BRAND.warm);
    pdf.setDrawColor(...Object.values(rgbFromHex(BRAND.accent)));
    pdf.roundedRect(margin, y, contentWidth, height, 10, 10, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11.5);
    pdfColor(pdf, BRAND.ink);
    pdf.text(title, margin + 14, y + 18);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10.6);
    pdf.text(lines, margin + 14, y + 36);
    y += height + 14;
  };

  const drawKpiRow = () => {
    const stats = buildKpiHighlights(payload);
    if (!stats.length) return;
    const items = stats.slice(0, 4);
    const boxGap = 10;
    const boxWidth = (contentWidth - boxGap * (items.length - 1)) / items.length;
    ensureSpace(86);
    items.forEach((item, index) => {
      const x = margin + index * (boxWidth + boxGap);
      pdfFill(pdf, BRAND.mist);
      pdf.setDrawColor(...Object.values(rgbFromHex(BRAND.teal)));
      pdf.roundedRect(x, y, boxWidth, 68, 8, 8, "FD");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10.5);
      pdfColor(pdf, BRAND.ink);
      const lines = pdf.splitTextToSize(item, boxWidth - 16) as string[];
      pdf.text(lines, x + 8, y + 24);
    });
    y += 82;
  };

  if (logoBytes) {
    const dataUrl = toDataUrl(logoBytes, "image/png");
    pdf.addImage(dataUrl, "PNG", margin, y, 160, 76);
  }
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdfColor(pdf, BRAND.soft);
  pdf.text(localize(locale, "Mini-catalogue automatisé | Formation, accompagnement et gouvernance IA", "Automated mini-catalogue | Training, support, and AI governance", "Mini-catálogo automatizado | Formación, acompañamiento y gobernanza de IA"), pageWidth - margin, y + 18, {
    align: "right",
  });
  y += 96;

  writeParagraph("MINI-CATALOGUE", { size: 12, bold: true, color: BRAND.accent });
  writeParagraph(localize(locale, "SOLUTIONS IA ET FORMATIONS STRATÉGIQUES", "AI SOLUTIONS AND STRATEGIC TRAINING", "SOLUCIONES DE IA Y FORMACIÓN ESTRATÉGICA"), { size: 21, bold: true, color: BRAND.ink });
  writeParagraph(localize(locale, `pour ${organisation}`, `for ${organisation}`, `para ${organisation}`), { size: 18, bold: true, color: BRAND.teal });
  writeParagraph(heroSubtitle, { size: 11, color: BRAND.soft });
  writeParagraph(`${localize(locale, "Généré le", "Generated on", "Generado el")} ${issueDate}${trimText(payload.website) ? ` · ${trimText(payload.website)}` : ""}`, { size: 10, color: BRAND.soft });
  y += 8;

  drawSectionTitle(localize(locale, "QUI SOMMES-NOUS", "WHO WE ARE", "QUIÉNES SOMOS"));
  writeParagraph("TransferAI Africa", { size: 16, bold: true });
  writeParagraph(localize(locale, "Hub IA de NettelecomCI en Côte d’Ivoire", "NettelecomCI AI hub in Côte d’Ivoire", "Hub de IA de NettelecomCI en Côte d’Ivoire"), { size: 13, color: BRAND.teal });
  [
    localize(locale, "13 experts ivoiriens et internationaux mobilisables", "13 mobilizable Ivorian and international experts", "13 expertos marfileños e internacionales movilizables"),
    localize(locale, "Bases d’intervention : Côte d’Ivoire, Royaume-Uni, États-Unis et Inde", "Delivery bases: Côte d’Ivoire, United Kingdom, United States, and India", "Bases de intervención: Côte d’Ivoire, Reino Unido, Estados Unidos e India"),
    localize(locale, "Cas d’usage concrets et transposables dans la finance, l’énergie, l’industrie et les services", "Concrete use cases transferable across finance, energy, industry, and services", "Casos de uso concretos y transferibles en finanzas, energía, industria y servicios"),
    localize(locale, "Mobilité internationale sans frein et présence locale forte via NettelecomCI", "Unconstrained international mobility and strong local presence through NettelecomCI", "Movilidad internacional sin fricciones y fuerte presencia local a través de NettelecomCI"),
    localize(locale, "Accompagnement pragmatique combiné à la formation, au pilotage et à la gouvernance", "Pragmatic support combining training, steering, and governance", "Acompañamiento pragmático combinado con formación, pilotaje y gobernanza"),
  ].forEach(writeBullet);

  drawSectionTitle(localize(locale, "NOTRE MISSION", "OUR MISSION", "NUESTRA MISIÓN"));
  writeParagraph(
    localize(locale, "Transformer l’IA en solutions concrètes, utiles et immédiatement activables pour les organisations africaines.", "Turn AI into concrete, useful, and immediately actionable solutions for African organizations.", "Transformar la IA en soluciones concretas, útiles e inmediatamente activables para las organizaciones africanas."),
    { size: 11.3 },
  );

  drawSectionTitle(localize(locale, "NOTRE ENGAGEMENT", "OUR COMMITMENT", "NUESTRO COMPROMISO"));
  writeParagraph(
    localize(locale, "Pas de l’IA pour l’IA : des solutions de performance, de formation et de transformation adaptées aux réalités terrain de chaque prospect.", "No AI for AI’s sake: performance, training, and transformation solutions adapted to each prospect’s operational reality.", "No IA por la IA: soluciones de rendimiento, formación y transformación adaptadas a la realidad operativa de cada prospecto."),
    { size: 11.3 },
  );

  drawSectionTitle(localize(locale, `MESSAGE CENTRAL POUR ${organisation.toUpperCase()}`, `CORE MESSAGE FOR ${organisation.toUpperCase()}`, `MENSAJE CENTRAL PARA ${organisation.toUpperCase()}`));
  drawCallout(localize(locale, "Proposition ciblée", "Focused proposal", "Propuesta focalizada"), primaryMessage);

  drawSectionTitle(localize(locale, "HYPOTHÈSE DE GAINS ATTENDUS", "EXPECTED VALUE HYPOTHESES", "HIPÓTESIS DE GANANCIAS ESPERADAS"));
  drawKpiRow();

  sections.forEach((section, index) => {
    drawSectionTitle(sectionTitle(index + 1, section.title));
    for (const block of section.body ?? []) writeParagraph(block, { size: 10.8 });
    for (const bullet of section.bullets ?? []) writeBullet(bullet);
  });

  drawSectionTitle(localize(locale, "PROPOSITION IMMÉDIATE", "IMMEDIATE PROPOSAL", "PROPUESTA INMEDIATA"));
  drawCallout(
    localize(locale, "Audit IA gratuit et rendez-vous expert", "Free AI audit and expert session", "Auditoría gratuita de IA y sesión experta"),
    trimText(payload.single_primary_cta) || localize(locale, "Planifier un audit stratégique gratuit et un rendez-vous expert de 30 minutes.", "Book a free strategic audit and a 30-minute expert session.", "Agendar una auditoría estratégica gratuita y una sesión experta de 30 minutos.")
  );
  writeParagraph(payload.calendly_url || "https://calendly.com/contact-transferai/30min", { size: 11, bold: true, color: BRAND.teal });
  writeParagraph(payload.audit_form_url || DEFAULT_AUDIT_ACCESS_URL, { size: 11, bold: true, color: BRAND.teal });

  drawSectionTitle(localize(locale, "VOTRE ÉQUIPE TRANSFERAI", "YOUR TRANSFERAI TEAM", "SU EQUIPO TRANSFERAI"));
  TEAM_SIGNATURES.forEach((signer) => {
    writeParagraph(signer.name, { size: 11.5, bold: true });
    writeParagraph(`${signer.title} — ${signer.focus}`, { size: 10.3, color: BRAND.soft });
    writeParagraph(signer.email, { size: 10.3, color: BRAND.teal });
    y += 4;
  });

  drawFooter();
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    pdf.setPage(i);
    drawFooter();
  }

  return new Uint8Array(pdf.output("arraybuffer"));
};

const uploadArtifact = async (
  bucket: string,
  storageKey: string,
  bytes: Uint8Array,
  contentType: string,
) => {
  if (!supabase) {
    throw new Error("supabase_not_configured");
  }

  const { error } = await supabase.storage.from(bucket).upload(storageKey, bytes, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw new Error(`storage_upload_failed:${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storageKey);
  return data.publicUrl;
};

const requireAuthorizedRequest = (request: Request) => {
  const adminToken = request.headers.get("x-admin-token") ?? "";
  if (CONTENT_ADMIN_TOKEN.length > 0 && adminToken === CONTENT_ADMIN_TOKEN) {
    return true;
  }

  const authHeader = request.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7).trim();
  return token.length > 0 && token === SUPABASE_SERVICE_ROLE_KEY;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !supabase) {
    return json(500, { error: "supabase_not_configured" });
  }

  if (!requireAuthorizedRequest(request)) {
    return json(401, { error: "unauthorized" });
  }

  const payload = await request.json().catch(() => null) as CatalogueRenderPayload | null;

  if (!payload || !trimText(payload.pack_id)) {
    return json(400, { error: "invalid_payload", detail: "Missing pack_id" });
  }

  const domainAsset = resolveDomainCatalogueAsset(
    payload.catalogue_domain_slug,
    payload.sector_guess,
    payload.recommended_use_case,
    payload.best_selling_use_case,
  );

  const domainSlug = domainAsset?.slug || trimText(payload.catalogue_domain_slug) || "catalogue-general";
  const locale = inferLocale(payload.prospect_language);
  const domainLabel = locale === "en"
    ? domainAsset?.domainLabelEn || domainAsset?.domainLabelFr || trimText(payload.catalogue_domain_slug) || "TransferAI catalogue"
    : locale === "es"
    ? domainAsset?.domainLabelEs || domainAsset?.domainLabelFr || trimText(payload.catalogue_domain_slug) || "Catálogo TransferAI"
    : domainAsset?.domainLabelFr || trimText(payload.catalogue_domain_slug) || "Catalogue TransferAI";
  const domainPageUrl = domainAsset?.pageUrl ?? `${PUBLIC_SITE_URL}/catalogue`;

  const bucket = trimText(payload.storage?.bucket) || "prospecting-artifacts";
  const basePath = trimText(payload.storage?.base_path) || `prospecting-packs/${payload.pack_id}`;
  const pdfFilename = trimText(payload.storage?.pdf_filename) || `Mini_Catalogue_TransferAI_${safeFilenamePart(payload.organization_name)}.pdf`;
  const docxFilename = trimText(payload.storage?.docx_filename) || `Mini_Catalogue_TransferAI_${safeFilenamePart(payload.organization_name)}.docx`;
  const pdfStorageKey = trimText(payload.storage?.pdf_storage_key) || `${basePath}/${pdfFilename}`;
  const docxStorageKey = trimText(payload.storage?.docx_storage_key) || `${basePath}/${docxFilename}`;

  try {
    const [docxBytes, pdfBytes] = await Promise.all([
      buildDocx(payload, domainLabel, domainPageUrl),
      buildPdf(payload, domainLabel, domainPageUrl),
    ]);

    const [docxUrl, pdfUrl] = await Promise.all([
      uploadArtifact(bucket, docxStorageKey, docxBytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
      uploadArtifact(bucket, pdfStorageKey, pdfBytes, "application/pdf"),
    ]);

    return json(200, {
      success: true,
      pack_id: payload.pack_id,
      catalogue_artifact: {
        domain_slug: domainSlug,
        generated_at: new Date().toISOString(),
        pdf_url: pdfUrl,
        docx_url: docxUrl,
        pdf_storage_key: pdfStorageKey,
        docx_storage_key: docxStorageKey,
        filename_pdf: pdfFilename,
        filename_docx: docxFilename,
      },
      mail_attachments: [
        {
          filename: pdfFilename,
          path: pdfUrl,
        },
      ],
      diagnostics: {
        template_domain: domainSlug,
        used_tailored_markdown: Boolean(trimText(payload.tailored_catalogue_markdown)),
        docx_generated: true,
        pdf_generated: true,
      },
    });
  } catch (error) {
    return json(500, {
      error: "catalogue_render_failed",
      detail: error instanceof Error ? error.message : String(error),
      pack_id: payload.pack_id,
    });
  }
});
