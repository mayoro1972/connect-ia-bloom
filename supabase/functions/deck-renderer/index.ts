import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import PptxGenJS from "npm:pptxgenjs";
import { corsHeaders, json } from "../_shared/editorial.ts";

type RenderStoragePayload = {
  bucket?: string;
  base_path?: string;
  pptx_filename?: string;
  pptx_storage_key?: string;
};

type RecommendedCaseStudy = {
  title?: string;
  before?: string;
  after?: string;
  kpi?: string;
  icon?: string;
  accent?: string;
};

type RoiMetric = {
  value?: string;
  label?: string;
  note?: string;
};

type DeckBrief = {
  deck_profile?: string;
  slide_objective?: string;
  key_messages?: string[];
  sector_pain_points?: string[];
  recommended_case_study?: RecommendedCaseStudy[];
  roi_hypothesis?: Array<RoiMetric | string>;
  delivery_timeline?: string[];
  training_focus?: string[];
  support_90_days?: string[];
  sector_variant?: string;
  single_primary_cta?: string;
};

type DeckRenderPayload = {
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
  signal_tags?: string[];
  roi_clues?: string[];
  probable_needs?: string[];
  probable_problems?: string[];
  probable_quick_wins?: string[];
  roi_hypothesis?: string[];
  delivery_timeline?: string[];
  recommended_training_bundle?: string[];
  expected_time_savings?: string[];
  expected_service_improvements?: string[];
  expected_quick_wins?: string[];
  deck_brief?: DeckBrief;
  storage?: RenderStoragePayload;
  audit_form_url?: string;
  calendly_url?: string;
};

type DeckVariant = "commercial_premium" | "institutional_premium";
type SupportedLocale = "fr" | "en" | "es";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const CONTENT_ADMIN_TOKEN = Deno.env.get("CONTENT_ADMIN_TOKEN") ?? "";
const LOGO_PATH = new URL("../_shared/assets/transferai-africa-nettelecom-co-brand.png", import.meta.url);

const theme = {
  bg: "F5EFE7",
  panel: "FFFDFC",
  panelAlt: "FBF5EE",
  ink: "1A3554",
  soft: "617086",
  orange: "E76F1D",
  navy: "163556",
  teal: "1C8A78",
  mint: "E7F2EE",
  sand: "EFE2D2",
  gold: "C88C3A",
  line: "D7CEC3",
  white: "FFFFFF",
  darkSoft: "C9D4E1",
};

const ShapeType = {
  line: "line",
  rect: "rect",
  ellipse: "ellipse",
  roundRect: "roundRect",
} as const;

const TEAM_SIGNATURES = [
  {
    name: "Casimir Kassi Beda",
    title: "Directeur Général",
    focus: "Vision stratégique et pilotage",
    email: "contact@transferai.ci",
  },
  {
    name: "Marius Ayoro",
    title: "Directeur Développement et Partenariats",
    focus: "Relations prospects et partenariats",
    email: "marius.ayoro@transferai.ci",
  },
  {
    name: "Eric N'Guessan",
    title: "Directeur Audit, Pédagogie et Certification",
    focus: "Pédagogie, audit et certification",
    email: "eric.nguessan@transferai.ci",
  },
];

const accentMap: Record<string, string> = {
  orange: theme.orange,
  teal: theme.teal,
  navy: theme.navy,
  gold: theme.gold,
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
    .replace(/\borganización por confirmar\b/gi, "")
    .replace(/\borganization to be confirmed\b/gi, "")
    .replace(/\bCote d'Ivoire\b/gi, "Côte d’Ivoire")
    .replace(/\bsecteur a confirmer\b/gi, "secteur à confirmer")
    .replace(/\borganisation a qualifier\b/gi, "organisation à qualifier")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .trim();

const compactText = (value: unknown, max = 180) => {
  const normalized = sanitizeProspectText(value).replace(/\s+/g, " ");
  if (!normalized || normalized.length <= max) return normalized;
  const slice = normalized.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 60 ? slice.slice(0, lastSpace) : slice).trim()}…`;
};

const isOrangeProspect = (payload: DeckRenderPayload) => {
  const haystack = `${trimText(payload.organization_name)} ${trimText(payload.website)}`.toLowerCase();
  return haystack.includes("orange");
};

const getOrangeReference = (locale: SupportedLocale) => ({
  summary: localize(
    locale,
    "Orange Côte d’Ivoire opère des flux à fort volume où la qualité de réponse, la coordination entre canaux et la diffusion des procédures impactent directement l’expérience client et l’efficacité opérationnelle.",
    "Orange Côte d’Ivoire runs high-volume workflows where response quality, cross-channel coordination, and procedure distribution directly affect customer experience and operational efficiency.",
    "Orange Côte d’Ivoire opera flujos de alto volumen donde la calidad de respuesta, la coordinación entre canales y la difusión de procedimientos afectan directamente la experiencia del cliente y la eficacia operativa.",
  ),
  entryPoint: localize(
    locale,
    "Audit IA gratuit suivi d’un échange expert de 30 minutes pour confirmer les priorités, les équipes à former et le premier terrain d’exécution.",
    "A free AI audit followed by a 30-minute expert session to confirm priorities, target teams, and the first execution scope.",
    "Una auditoría gratuita de IA seguida de una sesión experta de 30 minutos para confirmar prioridades, equipos objetivo y el primer ámbito de ejecución.",
  ),
  recommendedOffer: localize(
    locale,
    "Audit ciblé, copilote service client, synthèse managériale et accompagnement sur 90 jours.",
    "Targeted audit, customer-service copilot, management summaries, and 90-day implementation support.",
    "Auditoría focalizada, copiloto de atención al cliente, síntesis gerenciales y acompañamiento de 90 días.",
  ),
  useCases: [
    {
      title: localize(locale, "Copilote service client multicanal", "Multichannel customer-service copilot", "Copiloto multicanal de atención al cliente"),
      before: localize(locale, "Demandes récurrentes réparties sur plusieurs canaux avec des réponses hétérogènes.", "Recurring requests spread across multiple channels with inconsistent answers.", "Solicitudes recurrentes repartidas entre varios canales con respuestas heterogéneas."),
      after: localize(locale, "Copilote de réponse, résumés d’interactions et meilleure continuité de traitement.", "Answer copilot, interaction summaries, and stronger treatment continuity.", "Copiloto de respuesta, resúmenes de interacciones y mayor continuidad de tratamiento."),
      kpi: localize(locale, "délai moyen de réponse | taux de résolution au premier contact", "average response time | first-contact resolution rate", "tiempo medio de respuesta | tasa de resolución en el primer contacto"),
      accent: "orange",
    },
    {
      title: localize(locale, "Synthèse tickets et incidents", "Ticket and incident summarization", "Síntesis de tickets e incidentes"),
      before: localize(locale, "Analyse manuelle des tickets et reporting lent pour les managers.", "Manual ticket analysis and slow reporting for managers.", "Análisis manual de tickets y reporting lento para los managers."),
      after: localize(locale, "Synthèses automatiques, regroupement des motifs récurrents et alertes plus lisibles.", "Automatic summaries, recurring-issue clustering, and clearer alerts.", "Síntesis automáticas, agrupación de motivos recurrentes y alertas más legibles."),
      kpi: localize(locale, "temps de préparation du reporting | délai d’escalade", "reporting preparation time | escalation delay", "tiempo de preparación del reporting | plazo de escalado"),
      accent: "teal",
    },
    {
      title: localize(locale, "Base procédures et scripts terrain", "Procedure and field-script knowledge base", "Base de procedimientos y guiones de campo"),
      before: localize(locale, "Réponses et procédures dispersées selon les équipes et les documents.", "Answers and procedures scattered across teams and documents.", "Respuestas y procedimientos dispersos entre equipos y documentos."),
      after: localize(locale, "Base de connaissances assistée pour scripts, contrôles et bonnes réponses.", "Assisted knowledge base for scripts, checks, and approved answers.", "Base de conocimiento asistida para guiones, controles y respuestas validadas."),
      kpi: localize(locale, "temps de recherche d’information | temps d’onboarding", "information retrieval time | onboarding time", "tiempo de búsqueda de información | tiempo de onboarding"),
      accent: "navy",
    },
    {
      title: localize(locale, "Commentaire IA du pilotage qualité", "AI commentary for quality steering", "Comentario de IA para el pilotaje de calidad"),
      before: localize(locale, "Les indicateurs existent mais restent peu commentés et difficiles à exploiter rapidement.", "KPIs exist but remain under-commented and hard to use quickly.", "Los indicadores existen pero siguen poco comentados y difíciles de explotar rápidamente."),
      after: localize(locale, "Commentaires automatiques des écarts, synthèses managers et meilleurs arbitrages.", "Automatic variance commentary, manager summaries, and stronger decisions.", "Comentarios automáticos de desviaciones, síntesis gerenciales y mejores arbitrajes."),
      kpi: localize(locale, "temps de lecture des KPI | réactivité de pilotage", "KPI reading time | steering responsiveness", "tiempo de lectura de KPI | capacidad de reacción del pilotaje"),
      accent: "gold",
    },
  ],
  timeline: [
    localize(locale, "J+0 Audit et cadrage des flux service client et pilotage", "Day 0 audit and scoping of customer-service and steering workflows", "Día 0 auditoría y encuadre de los flujos de atención al cliente y pilotaje"),
    localize(locale, "J+15 Premier copilote ou première synthèse automatisée", "Day 15 first copilot or first automated management summary", "Día 15 primer copiloto o primera síntesis automatizada"),
    localize(locale, "J+45 Formation ciblée et lancement du pilote", "Day 45 targeted training and pilot launch", "Día 45 formación focalizada y lanzamiento del piloto"),
    localize(locale, "J+90 Mesure des résultats et décision d’extension", "Day 90 result measurement and scale-up decision", "Día 90 medición de resultados y decisión de ampliación"),
  ],
  training: [
    localize(locale, "Usage quotidien du copilote de réponse", "Daily use of the response copilot", "Uso diario del copiloto de respuesta"),
    localize(locale, "Lecture et validation des synthèses IA", "Reading and validating AI summaries", "Lectura y validación de síntesis de IA"),
    localize(locale, "Gouvernance des réponses et supervision humaine", "Response governance and human supervision", "Gobernanza de respuestas y supervisión humana"),
    localize(locale, "Mise à jour des scripts et procédures", "Updating scripts and procedures", "Actualización de guiones y procedimientos"),
  ],
  support: [
    localize(locale, "Points de suivi d’usage et de pilotage", "Usage and steering checkpoints", "Puntos de seguimiento de uso y pilotaje"),
    localize(locale, "Revue de cas réels et blocages terrain", "Review of real cases and field blockers", "Revisión de casos reales y bloqueos operativos"),
    localize(locale, "Ajustement des prompts, scripts et procédures", "Adjusting prompts, scripts, and procedures", "Ajuste de prompts, guiones y procedimientos"),
    localize(locale, "Lecture des premiers KPI et arbitrage d’extension", "Reading first KPIs and deciding on expansion", "Lectura de los primeros KPI y arbitraje de ampliación"),
  ],
});

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

const toDataUrl = (bytes: Uint8Array, mimeType: string) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return `data:${mimeType};base64,${btoa(binary)}`;
};

const loadLogoBytes = async () => {
  try {
    return await Deno.readFile(LOGO_PATH);
  } catch {
    return null;
  }
};

const uploadArtifact = async (
  bucket: string,
  storageKey: string,
  bytes: Uint8Array,
  contentType: string,
) => {
  if (!supabase) throw new Error("supabase_not_configured");

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

const inferVariant = (payload: DeckRenderPayload): DeckVariant => {
  const profile = trimText(payload.deck_brief?.deck_profile).toLowerCase();
  const orgType = trimText(payload.organization_type).toLowerCase();
  const orgName = trimText(payload.organization_name).toLowerCase();

  const institutionalSignals = [
    "institution",
    "public",
    "ministere",
    "gouvernement",
    "etat",
    "collectivite",
    "regulation",
    "regulateur",
    "agence",
    "publique",
  ];

  const haystack = [profile, orgType, orgName].join(" ");
  return institutionalSignals.some((signal) => haystack.includes(signal))
    ? "institutional_premium"
    : "commercial_premium";
};

const resolveCaseStudies = (payload: DeckRenderPayload) => {
  const locale = inferLocale(payload.prospect_language);
  const orangeProfile = isOrangeProspect(payload) ? getOrangeReference(locale) : null;
  const explicit = Array.isArray(payload.deck_brief?.recommended_case_study)
    ? payload.deck_brief?.recommended_case_study ?? []
    : [];

  if (explicit.length > 0 && !orangeProfile) {
    return explicit.slice(0, 4).map((item) => ({
      ...item,
      title: compactText(item.title, 64),
      before: compactText(item.before, 120),
      after: compactText(item.after, 120),
      kpi: compactText(item.kpi, 100),
    }));
  }

  const needs = normalizeList(payload.probable_needs);
  const problems = normalizeList(payload.probable_problems);
  const useCase = trimText(payload.recommended_use_case);
  const bestUseCase = trimText(payload.best_selling_use_case);

  const fallbackCases = [
    {
      title: useCase || localize(locale, "Cas d’usage prioritaire", "Priority use case", "Caso de uso prioritario"),
      before: problems[0] || localize(locale, "Processus fragmentés, pilotage lent et forte dépendance aux tâches manuelles.", "Fragmented workflows, slow steering, and high dependence on manual tasks.", "Procesos fragmentados, pilotaje lento y fuerte dependencia de tareas manuales."),
      after: needs[0] || localize(locale, "Dispositif IA ciblé, gains mesurables et meilleure fluidité de coordination.", "Targeted AI setup, measurable gains, and smoother coordination.", "Dispositivo de IA focalizado, ganancias medibles y mejor fluidez de coordinación."),
      kpi: localize(locale, "temps de traitement | qualité de service | appropriation équipes", "processing time | service quality | team adoption", "tiempo de tratamiento | calidad de servicio | adopción de equipos"),
      accent: "orange",
    },
    {
      title: bestUseCase || localize(locale, "Pilotage opérationnel assisté", "Assisted operational steering", "Pilotaje operativo asistido"),
      before: problems[1] || localize(locale, "Arbitrages réalisés avec trop peu de visibilité sur les signaux terrain.", "Decisions made with too little visibility on field signals.", "Arbitrajes realizados con muy poca visibilidad sobre las señales de terreno."),
      after: needs[1] || localize(locale, "Commentaires IA, synthèses exécutives et réduction des pertes de temps manuelles.", "AI commentary, executive summaries, and lower manual time loss.", "Comentarios de IA, síntesis ejecutivas y reducción del tiempo manual perdido."),
      kpi: localize(locale, "temps de reporting | taux d’erreur | vitesse d’arbitrage", "reporting time | error rate | decision speed", "tiempo de reporting | tasa de error | velocidad de arbitraje"),
      accent: "teal",
    },
  ].filter((item) => item.title || item.before || item.after);

  return (orangeProfile?.useCases || fallbackCases).slice(0, 4).map((item) => ({
    ...item,
    title: compactText(item.title, 64),
    before: compactText(item.before, 120),
    after: compactText(item.after, 120),
    kpi: compactText(item.kpi, 100),
  }));
};

const resolveRoiMetrics = (payload: DeckRenderPayload) => {
  const explicit = payload.deck_brief?.roi_hypothesis ?? [];
  const normalized = explicit
    .map((item) => {
      if (typeof item === "string") {
        return { value: "", label: item, note: "" };
      }
      return {
        value: trimText(item.value),
        label: trimText(item.label),
        note: trimText(item.note),
      };
    })
    .filter((item) => item.value || item.label || item.note);

  if (normalized.length > 0) {
    return normalized.slice(0, 4);
  }

  const fallbacks = [
    ...normalizeList(payload.expected_time_savings),
    ...normalizeList(payload.expected_service_improvements),
    ...normalizeList(payload.expected_quick_wins),
    ...normalizeList(payload.roi_hypothesis),
  ].slice(0, 4);

  return fallbacks.map((item, index) => ({
    value: index === 0 ? "-30%" : index === 1 ? "J+15" : index === 2 ? "+20%" : "-25%",
    label: item,
    note: "A confirmer pendant l'audit et le pilote",
  }));
};

const resolveTimeline = (payload: DeckRenderPayload) =>
  isOrangeProspect(payload)
    ? getOrangeReference(inferLocale(payload.prospect_language)).timeline
    : normalizeList(payload.deck_brief?.delivery_timeline).length > 0
    ? normalizeList(payload.deck_brief?.delivery_timeline)
    : normalizeList(payload.delivery_timeline).length > 0
    ? normalizeList(payload.delivery_timeline)
    : [
        "Semaine 1-2 : audit, cadrage et priorisation des cas d’usage",
        "Semaine 3-4 : premier prototype et sécurisation des données",
        "Semaine 5-8 : formation pilote et mise en pratique assistée",
        "Semaine 9-12 : mesure, ajustements et décision d’extension",
      ];

const resolveTraining = (payload: DeckRenderPayload) =>
  isOrangeProspect(payload)
    ? getOrangeReference(inferLocale(payload.prospect_language)).training
    : normalizeList(payload.deck_brief?.training_focus).length > 0
    ? normalizeList(payload.deck_brief?.training_focus)
    : normalizeList(payload.recommended_training_bundle).length > 0
    ? normalizeList(payload.recommended_training_bundle)
    : [
        "usage ciblé des copilotes IA",
        "lecture et validation des synthèses IA",
        "gouvernance et supervision humaine",
        "mise en pratique encadrée sur des cas réels",
      ];

const resolveSupport = (payload: DeckRenderPayload) =>
  isOrangeProspect(payload)
    ? getOrangeReference(inferLocale(payload.prospect_language)).support
    : normalizeList(payload.deck_brief?.support_90_days).length > 0
    ? normalizeList(payload.deck_brief?.support_90_days)
    : [
        "points de suivi d’usage et arbitrage",
        "revue de cas réels et traitement des blocages",
        "ajustement des prompts, scripts et routines",
        "lecture des KPI et décision d’extension",
      ];

const paragraph = (value: string, fallback = "") => sanitizeProspectText(value) || fallback;

const resolvePrimaryCta = (payload: DeckRenderPayload, locale: SupportedLocale) => {
  const candidate = sanitizeProspectText(payload.deck_brief?.single_primary_cta || payload.single_primary_cta);
  if (!candidate || /avec\s+pour\b/i.test(candidate) || /\bto define together with\b/i.test(candidate)) {
    return localize(
      locale,
      "Planifier un audit stratégique gratuit et un rendez-vous expert de 30 minutes",
      "Book a free strategic audit and a 30-minute expert session",
      "Agendar una auditoría estratégica gratuita y una sesión experta de 30 minutos",
    );
  }
  return compactText(candidate, 120);
};

const compactList = (items: string[], maxItems: number, maxChars: number) =>
  items
    .slice(0, maxItems)
    .map((item) => compactText(item, maxChars))
    .filter(Boolean);

const chunkItems = <T>(items: T[], size: number) => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

const addSlideFooter = (slide: PptxGenJS.Slide, page: number, variantLabel: string) => {
  slide.addShape(ShapeType.line, {
    x: 0.55,
    y: 6.86,
    w: 12.0,
    h: 0,
    line: { color: theme.line, pt: 1 },
  });
  slide.addText(`TransferAI | Hub IA de NettelecomCI | ${variantLabel}`, {
    x: 0.6,
    y: 6.9,
    w: 9.2,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 8.5,
    color: theme.soft,
    margin: 0,
  });
  slide.addText(String(page).padStart(2, "0"), {
    x: 11.45,
    y: 6.88,
    w: 0.45,
    h: 0.2,
    align: "right",
    fontFace: "Aptos",
    fontSize: 9.5,
    color: theme.ink,
    bold: true,
    margin: 0,
  });
};

const addCover = (
  pptx: PptxGenJS,
  payload: DeckRenderPayload,
  logoDataUrl: string | null,
  variant: DeckVariant,
) => {
  const locale = inferLocale(payload.prospect_language);
  const orangeProfile = isOrangeProspect(payload) ? getOrangeReference(locale) : null;
  const slide = pptx.addSlide();
  slide.background = { color: theme.bg };
  slide.addShape(ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 7.5,
    fill: { color: theme.bg },
    line: { color: theme.bg, pt: 0 },
  });
  slide.addShape(ShapeType.rect, {
    x: 8.55,
    y: 0,
    w: 4.78,
    h: 7.5,
    fill: { color: theme.navy },
    line: { color: theme.navy, pt: 0 },
  });
  slide.addShape(ShapeType.rect, {
    x: 0.72,
    y: 1.05,
    w: 0.08,
    h: 4.8,
    fill: { color: theme.orange },
    line: { color: theme.orange, pt: 0 },
  });
  if (logoDataUrl) {
    slide.addImage({
      data: logoDataUrl,
      x: 0.72,
      y: 0.45,
      w: 2.5,
      h: 0.7,
    });
  }
  slide.addText(
    variant === "institutional_premium"
      ? localize(locale, "Deck institutionnel premium", "Premium institutional deck", "Deck institucional premium")
      : localize(locale, "Deck commercial premium", "Premium commercial deck", "Deck comercial premium"),
    {
    x: 1.0,
    y: 0.58,
    w: 2.9,
    h: 0.2,
    fontFace: "Aptos",
    fontSize: 10.5,
    color: theme.orange,
    bold: true,
    margin: 0,
  });
  slide.addText(localize(
    locale,
    `Présentation TransferAI pour ${paragraph(payload.organization_name, "Organisation à confirmer")}`,
    `TransferAI presentation for ${paragraph(payload.organization_name, "organization to be confirmed")}`,
    `Presentación de TransferAI para ${paragraph(payload.organization_name, "organización por confirmar")}`,
  ), {
    x: 1.02,
    y: 1.36,
    w: 6.85,
    h: 1.1,
    fontFace: "Aptos Display",
    fontSize: 24,
    color: theme.ink,
    bold: true,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(
    paragraph(
      payload.deck_brief?.slide_objective,
      orangeProfile?.summary || localize(
        locale,
        `Transformer l’IA en gains visibles pour ${paragraph(payload.organization_name, "le prospect")} avec un accompagnement concret, gouverné et activable.`,
        `Turn AI into visible gains for ${paragraph(payload.organization_name, "the prospect")} through concrete, governed, and actionable support.`,
        `Transformar la IA en ganancias visibles para ${paragraph(payload.organization_name, "el prospecto")} con un acompañamiento concreto, gobernado y activable.`,
      ),
    ),
    {
      x: 1.04,
      y: 2.38,
      w: 6.5,
      h: 1.2,
      fontFace: "Aptos",
      fontSize: 15,
      color: theme.soft,
      margin: 0,
      fit: "shrink",
    },
  );
  slide.addText(
    [trimText(payload.sector_guess), trimText(payload.country), trimText(payload.organization_type)]
      .filter(Boolean)
      .join(" · "),
    {
      x: 1.04,
      y: 3.58,
      w: 5.6,
      h: 0.25,
      fontFace: "Aptos",
      fontSize: 10.5,
      color: theme.teal,
      italic: true,
      margin: 0,
    },
  );
  slide.addShape(ShapeType.roundRect, {
    x: 1.02,
    y: 4.14,
    w: 2.15,
    h: 0.54,
    rectRadius: 0.05,
    fill: { color: theme.panel },
    line: { color: theme.line, pt: 1 },
  });
  slide.addText(localize(locale, "Audit + exécution terrain", "Audit + field execution", "Auditoría + ejecución operativa"), {
    x: 1.18,
    y: 4.3,
    w: 1.8,
    h: 0.14,
    fontFace: "Aptos",
    fontSize: 9.25,
    color: theme.ink,
    bold: true,
    margin: 0,
    align: "center",
  });
  slide.addShape(ShapeType.roundRect, {
    x: 3.35,
    y: 4.14,
    w: 2.05,
    h: 0.54,
    rectRadius: 0.05,
    fill: { color: theme.panel },
    line: { color: theme.line, pt: 1 },
  });
  slide.addText(localize(locale, "Formation et gouvernance", "Training and governance", "Formación y gobernanza"), {
    x: 3.5,
    y: 4.3,
    w: 1.75,
    h: 0.14,
    fontFace: "Aptos",
    fontSize: 9.25,
    color: theme.ink,
    bold: true,
    margin: 0,
    align: "center",
  });
  slide.addText(localize(locale, "Positionnement premium TransferAI x NettelecomCI", "Premium positioning TransferAI x NettelecomCI", "Posicionamiento premium TransferAI x NettelecomCI"), {
    x: 8.95,
    y: 1.02,
    w: 3.35,
    h: 0.25,
    fontFace: "Aptos",
    fontSize: 11,
    color: theme.darkSoft,
    bold: true,
    margin: 0,
  });
  slide.addText(
    localize(
      locale,
      "Présence locale forte en Côte d’Ivoire, exécution internationale, méthodologie d’audit, formation ciblée et accompagnement sur 90 jours.",
      "Strong local presence in Côte d’Ivoire, international execution, audit methodology, targeted training, and 90-day support.",
      "Fuerte presencia local en Côte d’Ivoire, ejecución internacional, metodología de auditoría, formación focalizada y acompañamiento de 90 días.",
    ),
    {
      x: 8.95,
      y: 1.42,
      w: 3.3,
      h: 1.05,
      fontFace: "Aptos",
      fontSize: 13,
      color: theme.white,
      bold: true,
      margin: 0,
      fit: "shrink",
    },
  );
  slide.addText(localize(locale, "CTA prioritaire", "Primary CTA", "CTA prioritario"), {
    x: 8.95,
    y: 3.2,
    w: 1.4,
    h: 0.2,
    fontFace: "Aptos",
    fontSize: 10,
    color: theme.darkSoft,
    bold: true,
    margin: 0,
  });
  slide.addText(
    compactText(resolvePrimaryCta(payload, locale), 88),
    {
      x: 8.95,
      y: 3.5,
      w: 3.25,
      h: 0.82,
      fontFace: "Aptos Display",
      fontSize: 15.5,
      color: theme.white,
      bold: true,
      margin: 0,
      fit: "shrink",
    },
  );
  slide.addText(localize(locale, "Lien direct", "Direct link", "Enlace directo"), {
    x: 8.95,
    y: 4.58,
    w: 1.15,
    h: 0.16,
    fontFace: "Aptos",
    fontSize: 9.25,
    color: theme.darkSoft,
    bold: true,
    margin: 0,
  });
  slide.addText(trimText(payload.calendly_url), {
    x: 8.95,
    y: 4.84,
    w: 3.2,
    h: 0.42,
    fontFace: "Aptos",
    fontSize: 8.75,
    color: theme.darkSoft,
    margin: 0,
    fit: "shrink",
  });
  addSlideFooter(slide, 1, variant === "institutional_premium"
    ? localize(locale, "Modèle institutionnel premium", "Premium institutional model", "Modelo institucional premium")
    : localize(locale, "Modèle commercial premium", "Premium commercial model", "Modelo comercial premium"));
};

const addAgenda = (pptx: PptxGenJS, variant: DeckVariant, locale: SupportedLocale) => {
  const slide = pptx.addSlide();
  slide.background = { color: theme.bg };
  slide.addText(localize(locale, "Agenda de la présentation", "Presentation agenda", "Agenda de la presentación"), {
    x: 0.78,
    y: 0.72,
    w: 5.1,
    h: 0.45,
    fontFace: "Aptos Display",
    fontSize: 24,
    color: theme.ink,
    bold: true,
    margin: 0,
  });
  slide.addText(
    variant === "institutional_premium"
      ? localize(locale, "Un fil narratif institutionnel pour relier enjeux publics, gouvernance, usages IA et accompagnement TransferAI.", "An institutional storyline connecting public-service challenges, governance, AI use cases, and TransferAI support.", "Un hilo narrativo institucional para conectar retos públicos, gobernanza, usos de IA y acompañamiento de TransferAI.")
      : localize(locale, "Un fil narratif commercial premium pour relier enjeux métier, cas d’usage, ROI et accompagnement sur 90 jours.", "A premium commercial storyline linking business priorities, use cases, ROI, and 90-day support.", "Un hilo narrativo comercial premium para conectar prioridades operativas, casos de uso, ROI y acompañamiento de 90 días."),
    {
      x: 0.8,
      y: 1.18,
      w: 6.2,
      h: 0.55,
      fontFace: "Aptos",
      fontSize: 14,
      color: theme.soft,
      margin: 0,
      fit: "shrink",
    },
  );
  const agenda = [
    ["01", localize(locale, "Contexte & ambition", "Context & ambition", "Contexto y ambición"), localize(locale, "Positionnement, enjeux et objectif du deck", "Positioning, stakes, and objective of the deck", "Posicionamiento, retos y objetivo del deck")],
    ["02", "TransferAI & NettelecomCI", localize(locale, "Crédibilité, équipe et mode d’intervention", "Credibility, team, and delivery model", "Credibilidad, equipo y modo de intervención")],
    ["03", localize(locale, "Enjeux du prospect", "Prospect priorities", "Prioridades del prospecto"), localize(locale, "Pain points, besoins et signaux pré-audit", "Pain points, needs, and pre-audit signals", "Pain points, necesidades y señales del preauditoría")],
    ["04", localize(locale, "Cas d’usage prioritaires", "Priority use cases", "Casos de uso prioritarios"), localize(locale, "Pistes de transformation IA ciblées", "Targeted AI transformation opportunities", "Oportunidades focalizadas de transformación IA")],
    ["05", localize(locale, "ROI & gouvernance", "ROI & governance", "ROI y gobernanza"), localize(locale, "KPI, gains attendus et cadre de pilotage", "KPIs, expected gains, and steering framework", "KPI, ganancias esperadas y marco de pilotaje")],
    ["06", localize(locale, "Plan 90 jours", "90-day plan", "Plan de 90 días"), localize(locale, "Formation, support et décision d’extension", "Training, support, and scale-up decision", "Formación, soporte y decisión de ampliación")],
  ];
  agenda.forEach(([index, title, detail], i) => {
    const y = 2.0 + i * 0.72;
    slide.addShape(ShapeType.ellipse, {
      x: 0.95,
      y: y,
      w: 0.32,
      h: 0.32,
      fill: { color: i % 2 === 0 ? theme.orange : theme.teal },
      line: { color: i % 2 === 0 ? theme.orange : theme.teal, pt: 0 },
    });
    slide.addText(index, {
      x: 0.95,
      y: y + 0.07,
      w: 0.32,
      h: 0.1,
      fontFace: "Aptos",
      fontSize: 8.5,
      color: theme.white,
      bold: true,
      align: "center",
      margin: 0,
    });
    slide.addShape(ShapeType.roundRect, {
      x: 1.45,
      y: y - 0.04,
      w: 5.25,
      h: 0.45,
      rectRadius: 0.06,
      fill: { color: i === 0 ? theme.panel : theme.panelAlt },
      line: { color: theme.line, pt: 1 },
    });
    slide.addText(title, {
      x: 1.65,
      y: y + 0.03,
      w: 2.2,
      h: 0.15,
      fontFace: "Aptos Display",
      fontSize: 13.5,
      color: theme.ink,
      bold: true,
      margin: 0,
    });
    slide.addText(detail, {
      x: 3.9,
      y: y + 0.05,
      w: 2.45,
      h: 0.13,
      fontFace: "Aptos",
      fontSize: 10,
      color: theme.soft,
      align: "right",
      margin: 0,
    });
  });
  slide.addShape(ShapeType.roundRect, {
    x: 7.55,
    y: 1.95,
    w: 4.85,
    h: 3.55,
    rectRadius: 0.08,
    fill: { color: theme.navy },
    line: { color: theme.navy, pt: 0 },
  });
  slide.addText(localize(locale, "Message central", "Core message", "Mensaje central"), {
    x: 7.85,
    y: 2.2,
    w: 1.8,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 10,
    color: theme.darkSoft,
    bold: true,
    margin: 0,
  });
  slide.addText(
    variant === "institutional_premium"
      ? localize(
          locale,
          "Structurer une trajectoire IA crédible, pilotée et rassurante pour les parties prenantes institutionnelles.",
          "Structure a credible, well-governed AI path that reassures institutional stakeholders.",
          "Estructurar una trayectoria de IA creíble, pilotada y tranquilizadora para las partes interesadas institucionales.",
        )
      : localize(
          locale,
          "Transformer les priorités métier du prospect en gains visibles, mesurés et défendables dès les 90 premiers jours.",
          "Turn the prospect’s business priorities into visible, measurable, and defensible gains within the first 90 days.",
          "Transformar las prioridades operativas del prospecto en ganancias visibles, medibles y defendibles desde los primeros 90 días.",
        ),
    {
      x: 7.85,
      y: 2.55,
      w: 4.0,
      h: 0.85,
      fontFace: "Aptos Display",
      fontSize: 18,
      color: theme.white,
      bold: true,
      margin: 0,
      fit: "shrink",
    },
  );
  slide.addText(
    localize(
      locale,
      "Ce deck est un support commercial premium structuré à partir du pré-audit, du contexte sectoriel et des cas d’usage prioritaires du prospect.",
      "This deck is a premium commercial support structured from the pre-audit, sector context, and the prospect’s priority use cases.",
      "Este deck es un soporte comercial premium estructurado a partir de la preauditoría, del contexto sectorial y de los casos de uso prioritarios del prospecto.",
    ),
    {
      x: 7.85,
      y: 3.7,
      w: 4.0,
      h: 0.8,
      fontFace: "Aptos",
      fontSize: 12.5,
      color: theme.darkSoft,
      margin: 0,
      fit: "shrink",
    },
  );
  addSlideFooter(slide, 2, variant === "institutional_premium"
    ? localize(locale, "Modèle institutionnel premium", "Premium institutional model", "Modelo institucional premium")
    : localize(locale, "Modèle commercial premium", "Premium commercial model", "Modelo comercial premium"));
};

const addCredibility = (
  pptx: PptxGenJS,
  payload: DeckRenderPayload,
  variant: DeckVariant,
) => {
  const locale = inferLocale(payload.prospect_language);
  const orangeProfile = isOrangeProspect(payload) ? getOrangeReference(locale) : null;
  const slide = pptx.addSlide();
  slide.background = { color: theme.bg };
  slide.addShape(ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 7.5,
    fill: { color: theme.navy },
    line: { color: theme.navy, pt: 0 },
  });
  slide.addShape(ShapeType.rect, {
    x: 0.72,
    y: 1.1,
    w: 0.08,
    h: 4.7,
    fill: { color: theme.orange },
    line: { color: theme.orange, pt: 0 },
  });
  slide.addText("TransferAI x NettelecomCI", {
    x: 1.02,
    y: 1.16,
    w: 3.0,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 10.5,
    color: theme.orange,
    bold: true,
    margin: 0,
  });
  slide.addText(
    variant === "institutional_premium"
      ? localize(
          locale,
          "Un cadre de confiance pour porter une feuille de route IA institutionnelle, exigeante et gouvernée.",
          "A trust framework to carry an ambitious, governed institutional AI roadmap.",
          "Un marco de confianza para impulsar una hoja de ruta institucional de IA, exigente y bien gobernada.",
        )
      : localize(
          locale,
          "Une exécution locale et internationale pour transformer l’IA en résultats concrets et mesurables.",
          "Local and international execution to turn AI into concrete, measurable outcomes.",
          "Una ejecución local e internacional para convertir la IA en resultados concretos y medibles.",
        ),
    {
      x: 1.02,
      y: 1.52,
      w: 5.9,
      h: 1.15,
      fontFace: "Aptos Display",
      fontSize: 26,
      color: theme.white,
      bold: true,
      margin: 0,
      fit: "shrink",
    },
  );
  slide.addText(
    localize(
      locale,
      "TransferAI est le hub IA de NettelecomCI en Côte d’Ivoire. Nous combinons présence locale, expertise sectorielle et exécution internationale pour déployer des cas d’usage utiles, gouvernés et activables.",
      "TransferAI is NettelecomCI’s AI hub in Côte d’Ivoire. We combine local presence, sector expertise, and international execution to deploy useful, governed, and actionable use cases.",
      "TransferAI es el hub de IA de NettelecomCI en Côte d’Ivoire. Combinamos presencia local, experiencia sectorial y ejecución internacional para desplegar casos de uso útiles, gobernados y activables.",
    ),
    {
      x: 1.05,
      y: 2.92,
      w: 5.55,
      h: 0.8,
      fontFace: "Aptos",
      fontSize: 14,
      color: "D7E5F3",
      margin: 0,
      fit: "shrink",
    },
  );
  const facts = [
    localize(locale, "Présence locale forte via NettelecomCI", "Strong local presence via NettelecomCI", "Fuerte presencia local a través de NettelecomCI"),
    localize(locale, "13 experts ivoiriens et internationaux", "13 Ivorian and international experts", "13 expertos marfileños e internacionales"),
    localize(locale, "Interventions Côte d’Ivoire, Royaume-Uni, États-Unis, Inde", "Delivery across Côte d’Ivoire, United Kingdom, United States, and India", "Intervenciones en Côte d’Ivoire, Reino Unido, Estados Unidos e India"),
    localize(locale, "Accompagnement formation + implémentation + gouvernance", "Training + implementation + governance support", "Acompañamiento en formación + implementación + gobernanza"),
  ];
  facts.forEach((fact, i) => {
    slide.addShape(ShapeType.roundRect, {
      x: 1.05 + (i % 2) * 2.9,
      y: 4.15 + Math.floor(i / 2) * 0.9,
      w: 2.55,
      h: 0.58,
      rectRadius: 0.06,
      fill: { color: i % 2 === 0 ? "244667" : "10263F" },
      line: { color: "2F587F", pt: 1 },
    });
    slide.addText(fact, {
      x: 1.23 + (i % 2) * 2.9,
      y: 4.34 + Math.floor(i / 2) * 0.9,
      w: 2.1,
      h: 0.15,
      fontFace: "Aptos",
      fontSize: 10.5,
      color: theme.white,
      bold: true,
      margin: 0,
    });
  });
  slide.addShape(ShapeType.roundRect, {
    x: 7.72,
    y: 1.34,
    w: 4.65,
    h: 4.85,
    rectRadius: 0.08,
    fill: { color: "244667" },
    line: { color: "244667", pt: 0 },
  });
  slide.addText(localize(locale, "Positionnement pour ce prospect", "Positioning for this prospect", "Posicionamiento para este prospecto"), {
      x: 8.02,
      y: 1.68,
    w: 2.0,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 10,
    color: "D7E5F3",
    bold: true,
    margin: 0,
  });
  slide.addText(
    paragraph(
      payload.organization_summary,
      orangeProfile?.summary || localize(
        locale,
        `Contexte prioritaire autour de ${paragraph(payload.sector_guess, "la transformation IA")} et d’une exécution pragmatique à forte valeur terrain.`,
        `Priority context around ${paragraph(payload.sector_guess, "AI transformation")} with pragmatic execution grounded in business reality.`,
        `Contexto prioritario alrededor de ${paragraph(payload.sector_guess, "la transformación con IA")} con una ejecución pragmática y orientada al terreno.`,
      ),
    ),
    {
      x: 8.02,
      y: 2.02,
      w: 3.85,
      h: 1.0,
      fontFace: "Aptos",
      fontSize: 10.75,
      color: theme.white,
      margin: 0,
      fit: "shrink",
    },
  );
  slide.addText(localize(locale, "Promesse TransferAI", "TransferAI promise", "Promesa de TransferAI"), {
    x: 8.02,
    y: 3.38,
    w: 1.65,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 10,
    color: "CFE0F0",
    bold: true,
    margin: 0,
  });
  slide.addText(
    paragraph(
      payload.recommended_offer,
      orangeProfile?.recommendedOffer || localize(
        locale,
        "Un dispositif ciblé combinant audit, formation accélérée, mise en pratique et gouvernance des premiers KPI.",
        "A targeted setup combining audit, accelerated training, hands-on rollout, and governance of the first KPIs.",
        "Un dispositivo focalizado que combina auditoría, formación acelerada, puesta en práctica y gobernanza de los primeros KPI.",
      ),
    ),
    {
      x: 8.02,
      y: 3.66,
      w: 3.85,
      h: 0.8,
      fontFace: "Aptos Display",
      fontSize: 14.5,
      color: theme.white,
      bold: true,
      margin: 0,
      fit: "shrink",
    },
  );
  slide.addText(
    paragraph(
      payload.entry_point_niche,
      orangeProfile?.entryPoint || localize(
        locale,
        "Point d’entrée recommandé : priorités métier à forte friction, cas d’usage mesurables et gouvernance sobre.",
        "Recommended entry point: high-friction business priorities, measurable use cases, and lean governance.",
        "Puerta de entrada recomendada: prioridades operativas con fricción alta, casos de uso medibles y gobernanza sobria.",
      ),
    ),
    {
      x: 8.02,
      y: 4.7,
      w: 3.85,
      h: 0.78,
      fontFace: "Aptos",
      fontSize: 10.25,
      color: "D7E5F3",
      margin: 0,
      fit: "shrink",
    },
  );
  addSlideFooter(slide, 3, variant === "institutional_premium"
    ? localize(locale, "Modèle institutionnel premium", "Premium institutional model", "Modelo institucional premium")
    : localize(locale, "Modèle commercial premium", "Premium commercial model", "Modelo comercial premium"));
};

const addPainPoints = (
  pptx: PptxGenJS,
  payload: DeckRenderPayload,
  variant: DeckVariant,
  locale: SupportedLocale,
) => {
  const slide = pptx.addSlide();
  slide.background = { color: theme.bg };
  slide.addText(localize(locale, "Enjeux du prospect et priorités de transformation", "Prospect priorities and transformation stakes", "Prioridades del prospecto y retos de transformación"), {
    x: 0.78,
    y: 0.7,
    w: 6.45,
    h: 0.4,
    fontFace: "Aptos Display",
    fontSize: 24,
    color: theme.ink,
    bold: true,
    margin: 0,
  });
  slide.addText(
    paragraph(
      payload.organization_summary,
      localize(
        locale,
        `Le pré-audit montre des enjeux prioritaires dans ${paragraph(payload.sector_guess, "le secteur cible")} qui appellent une feuille de route IA ciblée, pilotable et visible.`,
        `The pre-audit highlights priority stakes in ${paragraph(payload.sector_guess, "the target sector")} that call for a focused, steerable, and visible AI roadmap.`,
        `La preauditoría muestra retos prioritarios en ${paragraph(payload.sector_guess, "el sector objetivo")} que requieren una hoja de ruta de IA focalizada, pilotable y visible.`,
      ),
    ),
    {
      x: 0.8,
      y: 1.15,
      w: 6.4,
      h: 0.7,
      fontFace: "Aptos",
      fontSize: 14,
      color: theme.soft,
      margin: 0,
      fit: "shrink",
    },
  );
  const problems = normalizeList(payload.deck_brief?.sector_pain_points).length > 0
    ? normalizeList(payload.deck_brief?.sector_pain_points)
    : normalizeList(payload.probable_problems);
  const needs = normalizeList(payload.probable_needs);
  const rows = compactList([...problems, ...needs], 4, 105);
  rows.forEach((row, index) => {
    const y = 2.08 + index * 0.78;
    slide.addShape(ShapeType.rect, {
      x: 0.9,
      y: y + 0.12,
      w: 0.05,
      h: 0.34,
      fill: { color: index % 2 === 0 ? theme.orange : theme.teal },
      line: { color: index % 2 === 0 ? theme.orange : theme.teal, pt: 0 },
    });
    slide.addText(row, {
      x: 1.08,
      y: y,
      w: 5.85,
      h: 0.52,
      fontFace: "Aptos",
      fontSize: 11.25,
      color: theme.ink,
      margin: 0,
      fit: "shrink",
    });
  });
  slide.addShape(ShapeType.roundRect, {
    x: 7.72,
    y: 1.72,
    w: 4.62,
    h: 4.2,
    rectRadius: 0.08,
    fill: { color: theme.panel },
    line: { color: theme.line, pt: 1 },
  });
  slide.addText(localize(locale, "Cadre de réponse TransferAI", "TransferAI response framework", "Marco de respuesta de TransferAI"), {
    x: 8.02,
    y: 2.0,
    w: 2.2,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 10,
    color: theme.orange,
    bold: true,
    margin: 0,
  });
  slide.addText(
    variant === "institutional_premium"
      ? localize(
          locale,
          "Des solutions sobrement gouvernées, pédagogiques et défendables face aux parties prenantes.",
          "Solutions that remain governed, pedagogical, and defensible with institutional stakeholders.",
          "Soluciones sobrias, gobernadas, pedagógicas y defendibles ante las partes interesadas.",
        )
      : localize(
          locale,
          "Des gains visibles, un pilote concret et un cadre d’extension sécurisé dès les 90 premiers jours.",
          "Visible gains, a concrete pilot, and a safe scale-up framework within the first 90 days.",
          "Ganancias visibles, un piloto concreto y un marco seguro de ampliación desde los primeros 90 días.",
        ),
    {
      x: 8.02,
      y: 2.34,
      w: 3.9,
      h: 0.62,
      fontFace: "Aptos Display",
      fontSize: 15.5,
      color: theme.ink,
      bold: true,
      margin: 0,
      fit: "shrink",
    },
  );
  slide.addText(localize(locale, "Signal principal", "Main signal", "Señal principal"), {
    x: 8.02,
    y: 3.38,
    w: 1.25,
    h: 0.16,
    fontFace: "Aptos",
    fontSize: 10,
    color: theme.soft,
    bold: true,
    margin: 0,
  });
  slide.addText(
    paragraph(payload.entry_point_niche, localize(
      locale,
      "Prioriser un point d’entrée concret, mesurable et défendable.",
      "Prioritize a concrete, measurable, and defensible entry point.",
      "Priorizar una puerta de entrada concreta, medible y defendible.",
    )),
    {
      x: 8.02,
      y: 3.66,
      w: 3.85,
      h: 0.46,
      fontFace: "Aptos",
      fontSize: 11.5,
      color: theme.ink,
      margin: 0,
      fit: "shrink",
    },
  );
  slide.addText(localize(locale, "Cas d’usage recommandé", "Recommended use case", "Caso de uso recomendado"), {
    x: 8.02,
    y: 4.45,
    w: 1.55,
    h: 0.16,
    fontFace: "Aptos",
    fontSize: 10,
    color: theme.soft,
    bold: true,
    margin: 0,
  });
  slide.addText(
    compactText(paragraph(payload.recommended_use_case, localize(
      locale,
      "Structurer un premier cas d’usage IA à fort impact opérationnel.",
      "Structure a first AI use case with strong operational impact.",
      "Estructurar un primer caso de uso de IA con alto impacto operativo.",
    )), 90),
    {
      x: 8.02,
      y: 4.72,
      w: 3.85,
      h: 0.56,
      fontFace: "Aptos Display",
      fontSize: 14.5,
      color: theme.ink,
      bold: true,
      margin: 0,
      fit: "shrink",
    },
  );
  addSlideFooter(slide, 4, variant === "institutional_premium"
    ? localize(locale, "Modèle institutionnel premium", "Premium institutional model", "Modelo institucional premium")
    : localize(locale, "Modèle commercial premium", "Premium commercial model", "Modelo comercial premium"));
};

const addUseCasesSlide = (
  pptx: PptxGenJS,
  variant: DeckVariant,
  locale: SupportedLocale,
  cases: ReturnType<typeof resolveCaseStudies>,
  page: number,
) => {
  const slide = pptx.addSlide();
  slide.background = { color: theme.bg };
  slide.addText(localize(locale, "Cas d’usage prioritaires à présenter au prospect", "Priority use cases to present", "Casos de uso prioritarios a presentar"), {
    x: 0.78,
    y: 0.68,
    w: 6.5,
    h: 0.45,
    fontFace: "Aptos Display",
    fontSize: 24,
    color: theme.ink,
    bold: true,
    margin: 0,
  });
  slide.addText(
    variant === "institutional_premium"
      ? localize(
          locale,
          "Une sélection sobre et premium, calibrée pour convaincre des décideurs institutionnels sans sur-vendre la technologie.",
          "A sober premium selection designed to convince institutional decision-makers without overselling the technology.",
          "Una selección sobria y premium, diseñada para convencer a decisores institucionales sin sobredimensionar la tecnología.",
        )
      : localize(
          locale,
          "Une sélection premium de cas d’usage transformant les enjeux du pré-audit en scénarios concrets de performance.",
          "A premium selection of use cases that turns pre-audit priorities into concrete performance scenarios.",
          "Una selección premium de casos de uso que convierte los hallazgos del preauditoría en escenarios concretos de rendimiento.",
        ),
    {
      x: 0.8,
      y: 1.15,
      w: 6.45,
      h: 0.6,
      fontFace: "Aptos",
      fontSize: 13.8,
      color: theme.soft,
      margin: 0,
      fit: "shrink",
    },
  );
  cases.forEach((item, index) => {
    const x = 0.82 + index * 6.0;
    const y = 2.02;
    const accent = accentMap[item.accent || "orange"] || theme.orange;
    slide.addShape(ShapeType.roundRect, {
      x,
      y,
      w: 5.55,
      h: 3.6,
      rectRadius: 0.08,
      fill: { color: theme.panel },
      line: { color: theme.line, pt: 1 },
    });
    slide.addShape(ShapeType.ellipse, {
      x: x + 0.18,
      y: y + 0.18,
      w: 0.42,
      h: 0.42,
      fill: { color: accent },
      line: { color: accent, pt: 0 },
    });
    slide.addText(item.title || "Cas d'usage", {
      x: x + 0.72,
      y: y + 0.22,
      w: 4.35,
      h: 0.32,
      fontFace: "Aptos Display",
      fontSize: 13.5,
      color: theme.ink,
      bold: true,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(localize(locale, "Avant", "Before", "Antes"), {
      x: x + 0.22,
      y: y + 0.62,
      w: 0.55,
      h: 0.15,
      fontFace: "Aptos",
      fontSize: 9,
      color: theme.orange,
      bold: true,
      margin: 0,
    });
    slide.addText(item.before || "", {
      x: x + 0.22,
      y: y + 0.82,
      w: 5.05,
      h: 0.72,
      fontFace: "Aptos",
      fontSize: 10,
      color: theme.soft,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(localize(locale, "Après", "After", "Después"), {
      x: x + 0.22,
      y: y + 1.28,
      w: 0.55,
      h: 0.15,
      fontFace: "Aptos",
      fontSize: 9,
      color: theme.teal,
      bold: true,
      margin: 0,
    });
    slide.addText(item.after || "", {
      x: x + 0.22,
      y: y + 1.7,
      w: 5.05,
      h: 0.78,
      fontFace: "Aptos",
      fontSize: 10,
      color: theme.ink,
      margin: 0,
      fit: "shrink",
    });
    if (item.kpi) {
      slide.addText(localize(locale, "KPI de preuve", "Proof KPI", "KPI de prueba"), {
        x: x + 0.22,
        y: y + 2.72,
        w: 1.0,
        h: 0.16,
        fontFace: "Aptos",
        fontSize: 9,
        color: theme.teal,
        bold: true,
        margin: 0,
      });
      slide.addText(compactText(item.kpi, 90), {
        x: x + 0.22,
        y: y + 2.94,
        w: 5.05,
        h: 0.3,
        fontFace: "Aptos",
        fontSize: 9.5,
        color: theme.ink,
        margin: 0,
        fit: "shrink",
      });
    }
  });
  addSlideFooter(slide, page, variant === "institutional_premium"
    ? localize(locale, "Modèle institutionnel premium", "Premium institutional model", "Modelo institucional premium")
    : localize(locale, "Modèle commercial premium", "Premium commercial model", "Modelo comercial premium"));
};

const addRoiSlide = (
  pptx: PptxGenJS,
  payload: DeckRenderPayload,
  variant: DeckVariant,
  locale: SupportedLocale,
  page: number,
) => {
  const slide = pptx.addSlide();
  slide.background = { color: theme.bg };
  slide.addText(localize(locale, "ROI, gouvernance et indicateurs défendables", "ROI, governance, and defensible indicators", "ROI, gobernanza e indicadores defendibles"), {
    x: 0.78,
    y: 0.7,
    w: 6.45,
    h: 0.42,
    fontFace: "Aptos Display",
    fontSize: 24,
    color: theme.ink,
    bold: true,
    margin: 0,
  });
  slide.addText(
    variant === "institutional_premium"
      ? localize(
          locale,
          "Une lecture institutionnelle des gains : mesure, supervision humaine, trajectoire prudentielle et arbitrage serein.",
          "An institutional reading of gains: measurement, human oversight, prudent rollout, and calm decision-making.",
          "Una lectura institucional de las ganancias: medición, supervisión humana, despliegue prudente y arbitraje sereno.",
        )
      : localize(
          locale,
          "Une lecture business des gains : productivité, qualité de service, accélération du reporting et meilleure exécution terrain.",
          "A business reading of gains: productivity, service quality, faster reporting, and stronger field execution.",
          "Una lectura de negocio de las ganancias: productividad, calidad de servicio, reporting más rápido y mejor ejecución operativa.",
        ),
    {
      x: 0.8,
      y: 1.18,
      w: 6.55,
      h: 0.6,
      fontFace: "Aptos",
      fontSize: 13.8,
      color: theme.soft,
      margin: 0,
      fit: "shrink",
    },
  );
  const metrics = resolveRoiMetrics(payload).slice(0, 4);
  const fills = [theme.orange, theme.teal, theme.navy, theme.gold];
  metrics.forEach((metric, index) => {
    const x = 0.88 + index * 3.03;
    slide.addShape(ShapeType.roundRect, {
      x,
      y: 2.0,
      w: 2.55,
      h: 1.55,
      rectRadius: 0.08,
      fill: { color: fills[index] || theme.orange },
      line: { color: fills[index] || theme.orange, pt: 0 },
    });
    slide.addText(metric.value || "", {
      x: x + 0.2,
      y: 2.18,
      w: 2.15,
      h: 0.35,
      fontFace: "Aptos Display",
      fontSize: 20,
      color: theme.white,
      bold: true,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
    slide.addText(metric.label || "", {
      x: x + 0.18,
      y: 2.62,
      w: 2.18,
      h: 0.22,
      fontFace: "Aptos",
      fontSize: 10.5,
      color: theme.white,
      bold: true,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
    slide.addText(metric.note || "", {
      x: x + 0.18,
      y: 2.93,
      w: 2.18,
      h: 0.25,
      fontFace: "Aptos",
      fontSize: 8.5,
      color: theme.white,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
  });
  const quickWins = compactList(
    [...normalizeList(payload.probable_quick_wins), ...normalizeList(payload.expected_quick_wins)],
    4,
    80,
  );
  slide.addShape(ShapeType.roundRect, {
    x: 0.88,
    y: 4.18,
    w: 5.8,
    h: 1.75,
    rectRadius: 0.08,
    fill: { color: theme.panel },
    line: { color: theme.line, pt: 1 },
  });
  slide.addText(localize(locale, "Quick wins à objectiver dès la phase pilote", "Quick wins to validate from the pilot phase", "Quick wins para objetivar desde la fase piloto"), {
    x: 1.1,
    y: 4.42,
    w: 2.65,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 10,
    color: theme.orange,
    bold: true,
    margin: 0,
  });
  quickWins.forEach((item, index) => {
    slide.addText(`• ${item}`, {
      x: 1.1,
      y: 4.74 + index * 0.26,
      w: 5.1,
      h: 0.18,
      fontFace: "Aptos",
      fontSize: 10.5,
      color: theme.ink,
      margin: 0,
      fit: "shrink",
    });
  });
  slide.addShape(ShapeType.roundRect, {
    x: 7.08,
    y: 4.18,
    w: 5.3,
    h: 1.75,
    rectRadius: 0.08,
    fill: { color: theme.panelAlt },
    line: { color: theme.line, pt: 1 },
  });
  slide.addText(localize(locale, "Principes de gouvernance", "Governance principles", "Principios de gobernanza"), {
    x: 7.3,
    y: 4.42,
    w: 2.25,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 10,
    color: theme.teal,
    bold: true,
    margin: 0,
  });
  [
    localize(locale, "supervision humaine des usages IA", "human supervision of AI uses", "supervisión humana de los usos de IA"),
    localize(locale, "cadre de validation des sorties et KPI", "validation framework for outputs and KPIs", "marco de validación de salidas y KPI"),
    localize(locale, "pilotage simple, sobre et explicable", "simple, lean, and explainable steering", "pilotaje simple, sobrio y explicable"),
    localize(locale, "arbitrage d’extension basé sur les résultats", "scale-up decisions based on results", "arbitraje de ampliación basado en resultados"),
  ].map((item) => compactText(item, 74)).forEach((item, index) => {
    slide.addText(`• ${item}`, {
      x: 7.3,
      y: 4.74 + index * 0.26,
      w: 4.65,
      h: 0.18,
      fontFace: "Aptos",
      fontSize: 10.25,
      color: theme.ink,
      margin: 0,
      fit: "shrink",
    });
  });
  addSlideFooter(slide, page, variant === "institutional_premium"
    ? localize(locale, "Modèle institutionnel premium", "Premium institutional model", "Modelo institucional premium")
    : localize(locale, "Modèle commercial premium", "Premium commercial model", "Modelo comercial premium"));
};

const addRoadmapSlide = (
  pptx: PptxGenJS,
  payload: DeckRenderPayload,
  variant: DeckVariant,
  locale: SupportedLocale,
  page: number,
) => {
  const slide = pptx.addSlide();
  slide.background = { color: theme.bg };
  slide.addText(localize(locale, "Trajectoire 90 jours : audit, formation, accompagnement", "90-day path: audit, training, support", "Trayectoria de 90 días: auditoría, formación y acompañamiento"), {
    x: 0.78,
    y: 0.72,
    w: 6.75,
    h: 0.42,
    fontFace: "Aptos Display",
    fontSize: 24,
    color: theme.ink,
    bold: true,
    margin: 0,
  });
  slide.addText(
    localize(
      locale,
      "Un chemin premium standardisé mais adapté au prospect : cadrer, lancer, former, mesurer et décider l’extension sur des cas réels.",
      "A premium path, standardized yet adapted to the prospect: scope, launch, train, measure, and decide on expansion with real cases.",
      "Un recorrido premium, estandarizado pero adaptado al prospecto: encuadrar, lanzar, formar, medir y decidir la ampliación sobre casos reales.",
    ),
    {
      x: 0.8,
      y: 1.18,
      w: 6.6,
      h: 0.55,
      fontFace: "Aptos",
      fontSize: 13.5,
      color: theme.soft,
      margin: 0,
      fit: "shrink",
    },
  );
  const timeline = resolveTimeline(payload).slice(0, 4);
  timeline.forEach((item, index) => {
    const x = 0.94 + index * 3.0;
    slide.addShape(ShapeType.roundRect, {
      x,
      y: 2.08,
      w: 2.62,
      h: 1.5,
      rectRadius: 0.08,
      fill: { color: theme.panel },
      line: { color: theme.line, pt: 1 },
    });
    slide.addShape(ShapeType.ellipse, {
      x: x + 0.16,
      y: 2.16,
      w: 0.42,
      h: 0.42,
      fill: { color: [theme.orange, theme.teal, theme.navy, theme.gold][index] || theme.orange },
      line: { color: [theme.orange, theme.teal, theme.navy, theme.gold][index] || theme.orange, pt: 0 },
    });
    slide.addText(String(index + 1).padStart(2, "0"), {
      x: x + 0.16,
      y: 2.23,
      w: 0.42,
      h: 0.12,
      fontFace: "Aptos",
      fontSize: 8.5,
      color: theme.white,
      bold: true,
      align: "center",
      margin: 0,
    });
    slide.addText(item, {
      x: x + 0.2,
      y: 2.72,
      w: 2.2,
      h: 0.62,
      fontFace: "Aptos Display",
      fontSize: 11.5,
      color: theme.ink,
      bold: true,
      margin: 0,
      fit: "shrink",
    });
  });
  const training = compactList(resolveTraining(payload), 4, 64);
  slide.addShape(ShapeType.roundRect, {
    x: 0.94,
    y: 4.22,
    w: 5.65,
    h: 1.72,
    rectRadius: 0.08,
    fill: { color: theme.panelAlt },
    line: { color: theme.line, pt: 1 },
  });
  slide.addText(localize(locale, "Focus formation", "Training focus", "Foco de formación"), {
    x: 1.16,
    y: 4.48,
    w: 1.35,
    h: 0.16,
    fontFace: "Aptos",
    fontSize: 10,
    color: theme.orange,
    bold: true,
    margin: 0,
  });
  training.forEach((item, index) => {
    slide.addText(`• ${item}`, {
      x: 1.16,
      y: 4.8 + index * 0.24,
      w: 4.95,
      h: 0.16,
      fontFace: "Aptos",
      fontSize: 10.25,
      color: theme.ink,
      margin: 0,
      fit: "shrink",
    });
  });
  const support = compactList(resolveSupport(payload), 4, 66);
  slide.addShape(ShapeType.roundRect, {
    x: 6.95,
    y: 4.22,
    w: 5.42,
    h: 1.72,
    rectRadius: 0.08,
    fill: { color: theme.panel },
    line: { color: theme.line, pt: 1 },
  });
  slide.addText(localize(locale, "Accompagnement 90 jours", "90-day support", "Acompañamiento de 90 días"), {
    x: 7.17,
    y: 4.48,
    w: 1.95,
    h: 0.16,
    fontFace: "Aptos",
    fontSize: 10,
    color: theme.teal,
    bold: true,
    margin: 0,
  });
  support.forEach((item, index) => {
    slide.addText(`• ${item}`, {
      x: 7.17,
      y: 4.8 + index * 0.24,
      w: 4.65,
      h: 0.18,
      fontFace: "Aptos",
      fontSize: 9.9,
      color: theme.ink,
      margin: 0,
      fit: "shrink",
    });
  });
  addSlideFooter(slide, page, variant === "institutional_premium"
    ? localize(locale, "Modèle institutionnel premium", "Premium institutional model", "Modelo institucional premium")
    : localize(locale, "Modèle commercial premium", "Premium commercial model", "Modelo comercial premium"));
};

const addClosingSlide = (
  pptx: PptxGenJS,
  payload: DeckRenderPayload,
  logoDataUrl: string | null,
  variant: DeckVariant,
  page: number,
) => {
  const locale = inferLocale(payload.prospect_language);
  const slide = pptx.addSlide();
  slide.background = { color: theme.bg };
  slide.addShape(ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 7.5,
    fill: { color: theme.panel },
    line: { color: theme.panel, pt: 0 },
  });
  if (logoDataUrl) {
    slide.addImage({
      data: logoDataUrl,
      x: 0.76,
      y: 0.52,
      w: 2.55,
      h: 0.72,
    });
  }
  slide.addText(localize(locale, "Prochaine étape recommandée", "Recommended next step", "Próxima etapa recomendada"), {
    x: 0.82,
    y: 1.45,
    w: 3.4,
    h: 0.2,
    fontFace: "Aptos",
    fontSize: 10.5,
    color: theme.orange,
    bold: true,
    margin: 0,
  });
  slide.addText(
    compactText(resolvePrimaryCta(payload, locale), 88),
    {
      x: 0.82,
      y: 1.82,
      w: 6.25,
      h: 0.78,
      fontFace: "Aptos Display",
      fontSize: 20,
      color: theme.ink,
      bold: true,
      margin: 0,
      fit: "shrink",
    },
  );
  slide.addText(
    `${localize(locale, "Formulaire d’audit", "Audit form", "Formulario de auditoría")} : ${trimText(payload.audit_form_url)}\n${localize(locale, "Prise de rendez-vous", "Booking link", "Enlace de reserva")} : ${trimText(payload.calendly_url)}`,
    {
      x: 0.84,
      y: 3.0,
      w: 5.75,
      h: 0.88,
      fontFace: "Aptos",
      fontSize: 11.25,
      color: theme.soft,
      margin: 0,
      fit: "shrink",
    },
  );
  slide.addShape(ShapeType.roundRect, {
    x: 7.18,
    y: 1.34,
    w: 5.08,
    h: 4.7,
    rectRadius: 0.08,
    fill: { color: theme.navy },
    line: { color: theme.navy, pt: 0 },
  });
  slide.addText(localize(locale, "Équipe dirigeante mobilisable", "Executive team available", "Equipo directivo movilizable"), {
    x: 7.48,
    y: 1.66,
    w: 2.35,
    h: 0.2,
    fontFace: "Aptos",
    fontSize: 10,
    color: theme.darkSoft,
    bold: true,
    margin: 0,
  });
  TEAM_SIGNATURES.forEach((person, index) => {
    const y = 2.02 + index * 1.0;
    slide.addText(person.name, {
      x: 7.48,
      y,
      w: 2.85,
      h: 0.2,
      fontFace: "Aptos Display",
      fontSize: 14,
      color: theme.white,
      bold: true,
      margin: 0,
    });
    slide.addText(compactText(`${person.title} | ${person.focus}`, 56), {
      x: 7.48,
      y: y + 0.26,
      w: 3.65,
      h: 0.2,
      fontFace: "Aptos",
      fontSize: 8.6,
      color: theme.darkSoft,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(person.email, {
      x: 7.48,
      y: y + 0.52,
      w: 3.0,
      h: 0.18,
      fontFace: "Aptos",
      fontSize: 9.5,
      color: theme.white,
      margin: 0,
    });
  });
  slide.addText(
    variant === "institutional_premium"
      ? localize(
          locale,
          "Un dispositif premium pour rassurer, aligner et transformer avec une gouvernance claire.",
          "A premium setup to reassure, align, and transform with clear governance.",
          "Un dispositivo premium para tranquilizar, alinear y transformar con una gobernanza clara.",
        )
      : localize(
          locale,
          "Un dispositif premium pour convaincre, exécuter vite et mesurer les gains dès les 90 premiers jours.",
          "A premium setup to convince, execute quickly, and measure gains within the first 90 days.",
          "Un dispositivo premium para convencer, ejecutar rápido y medir las ganancias desde los primeros 90 días.",
        ),
    {
      x: 7.48,
      y: 5.18,
      w: 4.0,
      h: 0.5,
      fontFace: "Aptos",
      fontSize: 10,
      color: theme.white,
      bold: true,
      margin: 0,
      fit: "shrink",
    },
  );
  addSlideFooter(slide, page, variant === "institutional_premium"
    ? localize(locale, "Modèle institutionnel premium", "Premium institutional model", "Modelo institucional premium")
    : localize(locale, "Modèle commercial premium", "Premium commercial model", "Modelo comercial premium"));
};

const buildDeck = async (payload: DeckRenderPayload) => {
  const variant = inferVariant(payload);
  const locale = inferLocale(payload.prospect_language);
  const caseStudyGroups = chunkItems(resolveCaseStudies(payload).slice(0, 4), 2);
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "TransferAI Africa";
  pptx.company = "NettelecomCI";
  pptx.subject = `Deck ${variant} - ${trimText(payload.organization_name) || "Prospect"}`;
  pptx.title = `Deck TransferAI ${trimText(payload.organization_name) || "Prospect"}`;
  pptx.lang = locale === "en" ? "en-US" : locale === "es" ? "es-ES" : "fr-FR";
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
    lang: pptx.lang,
  };
  pptx.defineLayout({ name: "TRANSFERAI_WIDE", width: 13.333, height: 7.5 });
  pptx.layout = "TRANSFERAI_WIDE";

  const logoBytes = await loadLogoBytes();
  const logoDataUrl = logoBytes ? toDataUrl(logoBytes, "image/png") : null;

  addCover(pptx, payload, logoDataUrl, variant);
  addAgenda(pptx, variant, locale);
  addCredibility(pptx, payload, variant);
  addPainPoints(pptx, payload, variant, locale);
  caseStudyGroups.forEach((group, index) => {
    addUseCasesSlide(pptx, variant, locale, group, 5 + index);
  });
  const roiPage = 5 + caseStudyGroups.length;
  addRoiSlide(pptx, payload, variant, locale, roiPage);
  addRoadmapSlide(pptx, payload, variant, locale, roiPage + 1);
  addClosingSlide(pptx, payload, logoDataUrl, variant, roiPage + 2);

  const arrayBuffer = await pptx.write({ outputType: "arraybuffer" });
  return {
    bytes: new Uint8Array(arrayBuffer),
    variant,
    diagnostics: {
      variant,
      used_deck_brief: Boolean(payload.deck_brief),
      used_case_studies: caseStudyGroups.flat().length,
      use_case_slide_count: caseStudyGroups.length,
      used_roi_metrics: resolveRoiMetrics(payload).length,
    },
  };
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

  const payload = await request.json().catch(() => null) as DeckRenderPayload | null;

  if (!payload || !trimText(payload.pack_id)) {
    return json(400, { error: "invalid_payload", detail: "Missing pack_id" });
  }

  const bucket = trimText(payload.storage?.bucket) || "prospecting-artifacts";
  const basePath = trimText(payload.storage?.base_path) || `prospecting-packs/${trimText(payload.pack_id)}`;
  const filenamePptx =
    trimText(payload.storage?.pptx_filename) ||
    `Deck_TransferAI_${safeFilenamePart(trimText(payload.organization_name))}.pptx`;
  const storageKey =
    trimText(payload.storage?.pptx_storage_key) ||
    `${basePath}/${filenamePptx}`;

  try {
    const rendered = await buildDeck(payload);
    const pptxUrl = await uploadArtifact(
      bucket,
      storageKey,
      rendered.bytes,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );

    return json(200, {
      success: true,
      pack_id: payload.pack_id,
      deck_artifact: {
        variant: rendered.variant,
        generated_at: new Date().toISOString(),
        pptx_url: pptxUrl,
        pptx_storage_key: storageKey,
        filename_pptx: filenamePptx,
      },
      mail_attachments: [
        {
          filename: filenamePptx,
          path: pptxUrl,
        },
      ],
      diagnostics: rendered.diagnostics,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "deck_render_failed";
    return json(500, { error: "deck_render_failed", detail: message });
  }
});
