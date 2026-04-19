import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle2, Mail, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";
import AppointmentBooking from "@/components/AppointmentBooking";
import { Link, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { isSupabaseConfigured, supabase, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import { buildAbsoluteAppointmentUrl, contactDetails, directLinks } from "@/lib/site-links";
import { resolveOutboundLanguage, sendProspectEmailNotifications } from "@/lib/prospect-emails";
import { trackAnalyticsEvent } from "@/lib/analytics";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  city: string;
  participants: string;
  formations: string;
  message: string;
  aiMaturity: string;
  useCases: string[];
  scopingHorizon: string;
  engagementFormat: string[];
  budgetRange: string;
  // Brief Solution IA
  solutionTypes: string[];
  processFrequency: string;
  existingTools: string[];
  dataAvailability: string[];
  hasTechReferent: string;
  privacyAccepted: boolean;
  botField: string;
};

const emptyForm: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  sector: "",
  city: "",
  participants: "",
  formations: "",
  message: "",
  aiMaturity: "",
  useCases: [],
  scopingHorizon: "",
  engagementFormat: [],
  budgetRange: "",
  solutionTypes: [],
  processFrequency: "",
  existingTools: [],
  dataAvailability: [],
  hasTechReferent: "",
  privacyAccepted: false,
  botField: "",
};

const scopingOptions = {
  fr: {
    sectionTitle: "Cadrage IA",
    sectionDesc: "Aidez-nous à préparer un échange utile : maturité, cas d'usage envisagés, horizon et format d'accompagnement souhaité.",
    maturityLabel: "Maturité IA actuelle",
    maturityOptions: [
      { value: "decouverte", label: "Découverte — premières réflexions" },
      { value: "experimentation", label: "Expérimentations en cours" },
      { value: "premiers-cas", label: "Premiers cas d'usage en production" },
      { value: "echelle", label: "Déploiement à l'échelle" },
    ],
    useCasesLabel: "Cas d'usage envisagés (plusieurs choix possibles)",
    useCasesOptions: [
      "Automatisation de processus",
      "Assistant IA interne (RH, juridique, support…)",
      "Relation client / chatbot",
      "Analyse de données & reporting",
      "Génération de contenu",
      "Aide à la décision",
      "Autre",
    ],
    horizonLabel: "Horizon souhaité pour les premiers résultats",
    horizonOptions: [
      { value: "moins-30j", label: "Moins de 30 jours" },
      { value: "30-60-90", label: "30 / 60 / 90 jours" },
      { value: "3-6-mois", label: "3 à 6 mois" },
      { value: "6-12-mois", label: "6 à 12 mois" },
      { value: "non-defini", label: "Pas encore défini" },
    ],
    formatLabel: "Format d'accompagnement souhaité (plusieurs choix possibles)",
    formatOptions: [
      "Diagnostic de maturité IA",
      "Cartographie des cas d'usage",
      "Feuille de route 30 / 60 / 90 jours",
      "Cadre d'adoption & gouvernance",
      "Construction d'automatisations / assistants IA",
      "Formation & montée en compétence des équipes",
    ],
    budgetLabel: "Budget indicatif (optionnel)",
    budgetOptions: [
      { value: "", label: "Préfère ne pas préciser" },
      { value: "<5k", label: "Moins de 5 000 €" },
      { value: "5-15k", label: "5 000 – 15 000 €" },
      { value: "15-50k", label: "15 000 – 50 000 €" },
      { value: ">50k", label: "Plus de 50 000 €" },
      { value: "a-definir", label: "À définir avec vous" },
    ],
  },
  en: {
    sectionTitle: "AI scoping",
    sectionDesc: "Help us prepare a useful conversation: maturity, use cases, horizon, and preferred engagement format.",
    maturityLabel: "Current AI maturity",
    maturityOptions: [
      { value: "decouverte", label: "Discovery — first reflections" },
      { value: "experimentation", label: "Experimentations underway" },
      { value: "premiers-cas", label: "First use cases in production" },
      { value: "echelle", label: "Scaling deployment" },
    ],
    useCasesLabel: "Use cases considered (multiple choices)",
    useCasesOptions: [
      "Process automation",
      "Internal AI assistant (HR, legal, support…)",
      "Customer relationship / chatbot",
      "Data analysis & reporting",
      "Content generation",
      "Decision support",
      "Other",
    ],
    horizonLabel: "Expected horizon for first results",
    horizonOptions: [
      { value: "moins-30j", label: "Less than 30 days" },
      { value: "30-60-90", label: "30 / 60 / 90 days" },
      { value: "3-6-mois", label: "3 to 6 months" },
      { value: "6-12-mois", label: "6 to 12 months" },
      { value: "non-defini", label: "Not defined yet" },
    ],
    formatLabel: "Preferred engagement format (multiple choices)",
    formatOptions: [
      "AI maturity diagnostic",
      "Use case mapping",
      "30 / 60 / 90 day roadmap",
      "Adoption framework & governance",
      "Build of AI automations / assistants",
      "Team training & upskilling",
    ],
    budgetLabel: "Indicative budget (optional)",
    budgetOptions: [
      { value: "", label: "Prefer not to say" },
      { value: "<5k", label: "Under €5,000" },
      { value: "5-15k", label: "€5,000 – 15,000" },
      { value: "15-50k", label: "€15,000 – 50,000" },
      { value: ">50k", label: "Over €50,000" },
      { value: "a-definir", label: "To be defined together" },
    ],
  },
} as const;

const toOptionalValue = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const catalogueDomainOptions = [
  "Catalogue complet (13 domaines)",
  "Assistanat & Secrétariat",
  "Ressources Humaines",
  "Marketing & Communication",
  "Finance & Comptabilité",
  "Juridique & Conformité",
  "Service Client",
  "Data & Analyse",
  "Administration & Gestion",
  "Management & Leadership",
  "IT & Transformation Digitale",
  "Formation & Pédagogie",
  "Santé & Bien-être",
  "Diplomatie & Affaires Internationales",
] as const;

const normalizeIntentLabel = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const supportedIntents = new Set([
  "demande-catalogue",
  "demande-renseignement",
  "contact-devis",
  "demande-referencement",
  "brief-solution-ia",
]);

const briefSolutionOptions = {
  fr: {
    sectionTitle: "Brief projet — Solution IA",
    sectionDesc:
      "Décrivez le projet à construire : type de solution, processus à transformer, écosystème existant, données disponibles et contraintes. Plus c'est précis, plus la proposition sera juste.",
    solutionTypesLabel: "Type de solution recherchée (plusieurs choix possibles)",
    solutionTypesOptions: [
      "Automatisation de workflow / processus",
      "Assistant IA / chatbot métier",
      "Outil interne sur mesure",
      "Dashboard & reporting intelligent",
      "Intégration IA dans un outil existant",
      "Document / contrat / rapport automatisé",
    ],
    frequencyLabel: "Fréquence du processus à automatiser",
    frequencyOptions: [
      { value: "temps-reel", label: "Temps réel / continu" },
      { value: "quotidien", label: "Quotidien" },
      { value: "hebdomadaire", label: "Hebdomadaire" },
      { value: "mensuel", label: "Mensuel" },
      { value: "ponctuel", label: "Ponctuel / à la demande" },
    ],
    toolsLabel: "Outils & systèmes déjà utilisés (plusieurs choix possibles)",
    toolsOptions: [
      "Google Workspace",
      "Microsoft 365",
      "Notion",
      "HubSpot",
      "Salesforce",
      "WhatsApp Business",
      "Excel / tableurs",
      "ERP / outil métier interne",
      "Site web / e-commerce",
      "Autre",
    ],
    dataLabel: "Données disponibles aujourd'hui",
    dataOptions: [
      "Documents (PDF, Word…)",
      "Base de données structurée",
      "API / services connectés",
      "Tableurs Excel / Google Sheets",
      "Pas encore structurées",
    ],
    techReferentLabel: "Avez-vous un référent technique en interne ?",
    techReferentOptions: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
      { value: "partiel", label: "Partiellement" },
    ],
    horizonLabel: "Délai souhaité pour une première version",
    horizonOptions: [
      { value: "urgent", label: "Urgent (moins de 30 jours)" },
      { value: "1-3-mois", label: "1 à 3 mois" },
      { value: "3-6-mois", label: "3 à 6 mois" },
      { value: "non-defini", label: "Pas encore défini" },
    ],
    budgetLabel: "Budget indicatif (optionnel)",
    budgetOptions: [
      { value: "", label: "Préfère ne pas préciser" },
      { value: "<5k", label: "Moins de 5 000 €" },
      { value: "5-15k", label: "5 000 – 15 000 €" },
      { value: "15-50k", label: "15 000 – 50 000 €" },
      { value: ">50k", label: "Plus de 50 000 €" },
      { value: "a-definir", label: "À définir avec vous" },
    ],
  },
  en: {
    sectionTitle: "Project brief — AI solution",
    sectionDesc:
      "Describe the project to build: solution type, process to transform, existing ecosystem, available data, and constraints. The more precise, the better our proposal.",
    solutionTypesLabel: "Type of solution you are looking for (multiple choices)",
    solutionTypesOptions: [
      "Workflow / process automation",
      "AI assistant / business chatbot",
      "Custom internal tool",
      "Smart dashboard & reporting",
      "AI integration into an existing tool",
      "Automated document / contract / report",
    ],
    frequencyLabel: "Frequency of the process to automate",
    frequencyOptions: [
      { value: "temps-reel", label: "Real-time / continuous" },
      { value: "quotidien", label: "Daily" },
      { value: "hebdomadaire", label: "Weekly" },
      { value: "mensuel", label: "Monthly" },
      { value: "ponctuel", label: "On-demand / occasional" },
    ],
    toolsLabel: "Tools & systems already in use (multiple choices)",
    toolsOptions: [
      "Google Workspace",
      "Microsoft 365",
      "Notion",
      "HubSpot",
      "Salesforce",
      "WhatsApp Business",
      "Excel / spreadsheets",
      "ERP / internal business tool",
      "Website / e-commerce",
      "Other",
    ],
    dataLabel: "Data available today",
    dataOptions: [
      "Documents (PDF, Word…)",
      "Structured database",
      "API / connected services",
      "Excel / Google Sheets",
      "Not structured yet",
    ],
    techReferentLabel: "Do you have an internal technical referent?",
    techReferentOptions: [
      { value: "oui", label: "Yes" },
      { value: "non", label: "No" },
      { value: "partiel", label: "Partially" },
    ],
    horizonLabel: "Expected timeline for a first version",
    horizonOptions: [
      { value: "urgent", label: "Urgent (less than 30 days)" },
      { value: "1-3-mois", label: "1 to 3 months" },
      { value: "3-6-mois", label: "3 to 6 months" },
      { value: "non-defini", label: "Not defined yet" },
    ],
    budgetLabel: "Indicative budget (optional)",
    budgetOptions: [
      { value: "", label: "Prefer not to say" },
      { value: "<5k", label: "Under €5,000" },
      { value: "5-15k", label: "€5,000 – 15,000" },
      { value: "15-50k", label: "€15,000 – 50,000" },
      { value: ">50k", label: "Over €50,000" },
      { value: "a-definir", label: "To be defined together" },
    ],
  },
} as const;

const contactPageModel = {
  fr: {
    quickStartBadge: "Choisissez l'entrée la plus simple",
    quickStartTitle: "Parler à la bonne porte d'entrée",
    quickStartDesc:
      "Commencez par l'action la plus utile selon votre situation : parlez à un expert en prenant un RDV ou nous écrire IA ou écrivez-nous directement pour exprimer votre besoin.",
    pathways: [
      {
        title: "Parler à un expert IA",
        desc: "Pour expliquer votre besoin, obtenir une orientation claire et être dirigé vers la bonne suite.",
        cta: "Décrire mon besoin",
      },
      {
        title: "WhatsApp",
        desc: "Pour une question courte, un premier contact ou une orientation rapide.",
        cta: "Écrire sur WhatsApp",
        href: directLinks.whatsapp,
      },
    ],
    formIntroBadge: "Demande structurée",
    formIntroTitle: "Décrivez votre besoin",
    formIntroDesc:
      "Commencez par l'essentiel. Nous utilisons ensuite votre contexte pour reformuler le besoin et préparer la bonne réponse.",
    coreFieldsTitle: "Informations essentielles",
    optionalFieldsTitle: "Contexte complémentaire",
    optionalFieldsDesc:
      "Ajoutez ces informations si vous souhaitez une proposition plus ciblée. Elles ne sont pas obligatoires.",
    responseCardTitle: "Ce que vous obtenez ensuite",
    responsePoints: [
      "Un accusé de réception automatique",
      "Une qualification plus rapide du besoin",
      "Une réponse ou une proposition sous 24h à 48h ouvrées",
    ],
    contactCardTitle: "Contacts directs",
    helperTitle: "Pour aller plus vite",
    helperPoints: [
      "Indiquez le domaine ou la formation visée si vous le connaissez déjà",
      "Précisez le nombre estimé de participants pour une demande équipe",
      "Expliquez en une phrase le besoin principal ou le problème à résoudre",
    ],
  },
  en: {
    quickStartBadge: "Choose the simplest entry point",
    quickStartTitle: "Reach the right door first",
    quickStartDesc:
      "Start with the most useful action for your situation: speak with an AI expert, or message us directly to share your need.",
    pathways: [
      {
        title: "Speak with an AI expert",
        desc: "Explain your need, get clear orientation, and be guided to the right next step.",
        cta: "Describe my need",
      },
      {
        title: "WhatsApp",
        desc: "For a short question, a first contact, or quick orientation.",
        cta: "Write on WhatsApp",
        href: directLinks.whatsapp,
      },
    ],
    formIntroBadge: "Structured request",
    formIntroTitle: "Describe your need",
    formIntroDesc:
      "Start with the essentials. We then use your context to restate the need and prepare the right response.",
    coreFieldsTitle: "Essential information",
    optionalFieldsTitle: "Additional context",
    optionalFieldsDesc:
      "Add these details if you want a more tailored proposal. They remain optional.",
    responseCardTitle: "What happens next",
    responsePoints: [
      "An automatic acknowledgement email",
      "Faster qualification of your request",
      "A response or proposal within 24 to 48 business hours",
    ],
    contactCardTitle: "Direct contacts",
    helperTitle: "To speed things up",
    helperPoints: [
      "Mention the domain or training track if you already know it",
      "Add the estimated number of participants for a team request",
      "Explain in one sentence the main need or problem to solve",
    ],
  },
} as const;

const ContactPage = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const trans = language === "fr" ? fr : en;
  const sectors = trans.contact.sectors;
  const pageModel = contactPageModel[language === "en" ? "en" : "fr"];
  const requestedDomain = searchParams.get("domain") ?? "";
  const requestedIntent = searchParams.get("intent") ?? "contact-devis";
  const resolvedIntent = supportedIntents.has(requestedIntent) ? requestedIntent : "contact-devis";
  const isCompactMode = searchParams.get("compact") === "1";
  const isCatalogIntent = resolvedIntent === "demande-catalogue";
  const isGuidanceIntent = resolvedIntent === "demande-renseignement";
  const isListingIntent = resolvedIntent === "demande-referencement";
  const isBriefSolutionIntent = resolvedIntent === "brief-solution-ia";
  const normalizedRequestedDomain = normalizeIntentLabel(requestedDomain);
  const isStrategicPartnershipIntent =
    isGuidanceIntent &&
    (normalizedRequestedDomain.includes("partenariat strategique") ||
      normalizedRequestedDomain === "partenariats");
  const isEnterpriseScopingFlow =
    (isGuidanceIntent && !isStrategicPartnershipIntent) || resolvedIntent === "contact-devis";
  const scoping = scopingOptions[language === "en" ? "en" : "fr"];
  const briefSolution = briefSolutionOptions[language === "en" ? "en" : "fr"];
  // Default contact landing (no special intent) → ultra-épuré : juste "porte d'entrée" + form essentiel + RDV
  const isDefaultContactLanding =
    !isCompactMode &&
    resolvedIntent === "contact-devis" &&
    !isCatalogIntent &&
    !isGuidanceIntent &&
    !isListingIntent &&
    !isBriefSolutionIntent;

  const [form, setForm] = useState<ContactFormState>({
    ...emptyForm,
    formations: requestedDomain,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      formations: current.formations || requestedDomain,
    }));
  }, [requestedDomain]);

  const resolvedHeaderTitle = isBriefSolutionIntent
    ? language === "en"
      ? "Brief your AI solution project"
      : "Brief de votre projet — Solution IA"
    : isListingIntent
    ? language === "en"
      ? "Request visibility on TransferAI Africa"
      : "Demander un référencement"
    : isStrategicPartnershipIntent
      ? language === "en"
        ? "Discuss a strategic partnership"
        : "Parler partenariat stratégique"
    : t("contact.title");

  const resolvedHeaderSubtitle = isBriefSolutionIntent
    ? language === "en"
      ? "Tell us about the AI solution you want to build (workflow, assistant, internal tool, dashboard…) and book a call to align on it."
      : "Présentez la solution IA à construire (workflow, assistant, outil interne, dashboard…) et réservez un échange pour la cadrer ensemble."
    : isListingIntent
    ? language === "en"
      ? "Present your organization for an editorial and commercial review of a listing or featured presence."
      : "Présentez votre organisation pour une étude éditoriale et commerciale de présence sur TransferAI Africa."
    : isStrategicPartnershipIntent
      ? language === "en"
        ? "Describe your institution or company so we can review a possible collaboration, program support, certification, or joint initiative."
        : "Présentez votre institution ou votre entreprise afin que nous puissions étudier une collaboration, un soutien de programme, une certification ou une action commune."
    : t("contact.subtitle");

  const resolvedQuickStartBadge = isListingIntent
    ? language === "en"
      ? "Partner listing"
      : "Référencement partenaire"
    : isStrategicPartnershipIntent
      ? language === "en"
        ? "Strategic partnership"
        : "Partenariat stratégique"
    : pageModel.quickStartBadge;

  const resolvedQuickStartTitle = isListingIntent
    ? language === "en"
      ? "Submit the right listing request"
      : "Soumettre la bonne demande de référencement"
    : isStrategicPartnershipIntent
      ? language === "en"
        ? "Present your partnership project"
        : "Présenter votre projet de partenariat"
    : pageModel.quickStartTitle;

  const resolvedQuickStartDesc = isListingIntent
    ? language === "en"
      ? "Start with the most useful action: review the partners page, describe your organization, or contact us directly if you need a quick clarification."
      : "Commencez par l'action la plus utile : relire la page partenaires, présenter votre organisation ou nous écrire directement pour une clarification rapide."
    : isStrategicPartnershipIntent
      ? language === "en"
        ? "Start by presenting the collaboration you have in mind: academic partnership, institutional support, co-branded program, certification, or shared event."
        : "Commencez par présenter le type de collaboration envisagé : partenariat académique, soutien institutionnel, programme co-construit, certification ou événement commun."
    : pageModel.quickStartDesc;

  const resolvedPathways = isListingIntent
    ? [
        {
          title: language === "en" ? "Review the partners page" : "Relire la page partenaires",
          desc:
            language === "en"
              ? "Revisit the public positioning before submitting your request."
              : "Revoir le positionnement public avant d'envoyer votre demande.",
          cta: language === "en" ? "Open partners page" : "Ouvrir la page partenaires",
          href: "/partenaires",
        },
        {
          title: language === "en" ? "Present your organization" : "Présenter votre organisation",
          desc:
            language === "en"
              ? "Explain your activity, audience fit, and the type of visibility you are looking for."
              : "Expliquez votre activité, votre alignement avec notre audience et la présence recherchée.",
          cta: language === "en" ? "Present my organization" : "Présenter mon organisation",
        },
        {
          title: "WhatsApp",
          desc:
            language === "en"
              ? "For a quick clarification before submitting the request."
              : "Pour une clarification rapide avant d'envoyer la demande.",
          cta: language === "en" ? "Write on WhatsApp" : "Écrire sur WhatsApp",
          href: directLinks.whatsapp,
        },
      ]
    : isStrategicPartnershipIntent
      ? [
          {
            title: language === "en" ? "Review partnership page" : "Relire la page partenaires",
            desc:
              language === "en"
                ? "Review our positioning before proposing a strategic collaboration."
                : "Relisez notre positionnement avant de proposer une collaboration stratégique.",
            cta: language === "en" ? "Open partners page" : "Ouvrir la page partenaires",
            href: "/partenaires",
          },
          {
            title: language === "en" ? "Present the partnership" : "Présenter le partenariat",
            desc:
              language === "en"
                ? "Explain the institution, the expected collaboration model, and the objective you would like to pursue with us."
                : "Expliquez la structure, le modèle de collaboration attendu et l'objectif que vous souhaitez poursuivre avec nous.",
            cta: language === "en" ? "Present the partnership" : "Présenter le partenariat",
          },
          {
            title: "WhatsApp",
            desc:
              language === "en"
                ? "For a quick qualification before you submit the full request."
                : "Pour une première qualification rapide avant d'envoyer la demande complète.",
            cta: language === "en" ? "Write on WhatsApp" : "Écrire sur WhatsApp",
            href: directLinks.whatsapp,
          },
        ]
    : pageModel.pathways;

  const resolvedIntroBadge = isBriefSolutionIntent
    ? language === "en"
      ? "AI solution brief"
      : "Brief solution IA"
    : isListingIntent
    ? language === "en"
      ? "Listing request"
      : "Demande de référencement"
    : isStrategicPartnershipIntent
      ? language === "en"
        ? "Strategic partnership request"
        : "Demande de partenariat stratégique"
    : pageModel.formIntroBadge;

  const resolvedIntroTitle = isBriefSolutionIntent
    ? language === "en"
      ? "Brief your AI solution project"
      : "Brief de votre projet IA"
    : isCatalogIntent
    ? language === "en"
      ? "Request a domain catalogue"
      : "Demander un catalogue de domaine"
    : isGuidanceIntent
      ? isStrategicPartnershipIntent
        ? language === "en"
          ? "Present your partnership project"
          : "Présentez votre projet de partenariat"
        : language === "en"
          ? "Speak with an AI expert"
          : "Parler à un expert IA"
      : isListingIntent
        ? language === "en"
          ? "Present your organization"
          : "Présentez votre organisation"
        : pageModel.formIntroTitle;

  const resolvedIntroDesc = isBriefSolutionIntent
    ? language === "en"
      ? "Describe the solution to build, the process to transform, the tools you already use, and the data available. Then book a 30-min call to align on the approach."
      : "Décrivez la solution à construire, le processus à transformer, les outils déjà utilisés et les données disponibles. Réservez ensuite un échange de 30 min pour cadrer l'approche."
    : isCatalogIntent
    ? language === "en"
      ? "Use this form to receive the right catalogue and give us just enough context to guide you well."
      : "Utilisez ce formulaire pour recevoir le bon catalogue et nous donner juste assez de contexte pour bien vous orienter."
    : isGuidanceIntent
      ? isStrategicPartnershipIntent
        ? language === "en"
          ? "Tell us who you are, what kind of collaboration you are considering, and what result you would like to achieve together with TransferAI Africa."
          : "Dites-nous qui vous êtes, le type de collaboration envisagé et le résultat que vous souhaitez construire avec TransferAI Africa."
        : language === "en"
          ? "Present your company and the AI scoping need. Our experts review your context and come back with a clear orientation — and you can also book a 30-min call directly below."
          : "Présentez votre entreprise et le besoin de cadrage IA. Nos experts étudient votre contexte et reviennent vers vous avec une orientation claire — vous pouvez aussi réserver un échange de 30 min directement ci-dessous."
      : isListingIntent
        ? language === "en"
          ? "Describe your activity, positioning, and the type of visibility you would like us to review."
          : "Décrivez votre activité, votre positionnement et le type de présence que vous souhaitez nous voir étudier."
        : pageModel.formIntroDesc;

  const resolvedSubmitLabel = isBriefSolutionIntent
    ? language === "en"
      ? "Send my AI project brief"
      : "Envoyer mon brief projet"
    : isCatalogIntent
    ? language === "en"
      ? "Send my catalogue request"
      : "Envoyer ma demande de Catalogue"
    : isStrategicPartnershipIntent
      ? language === "en"
        ? "Send my partnership request"
        : "Envoyer ma demande de partenariat"
      : isGuidanceIntent
        ? language === "en"
          ? "Send my scoping request"
          : "Envoyer ma demande de cadrage"
      : isListingIntent
        ? language === "en"
          ? "Send my listing request"
          : "Envoyer ma demande de référencement"
        : t("contact.submit");

  const resolvedCoreFieldLabel = isBriefSolutionIntent
    ? language === "en"
      ? "Project name or process to transform (e.g. invoice processing, customer support…)"
      : "Nom du projet ou processus à transformer (ex : traitement factures, support client…)"
    : isStrategicPartnershipIntent
    ? language === "en"
      ? "Partnership type, program, or collaboration angle"
      : "Type de partenariat, programme ou angle de collaboration"
    : isGuidanceIntent
    ? language === "en"
      ? "Topic, project or business area to scope (e.g. customer service, finance, HR...)"
      : "Sujet, projet ou domaine métier à cadrer (ex : relation client, finance, RH...)"
    : isListingIntent
    ? language === "en"
      ? "Organization, activity or positioning angle"
      : "Organisation, activité ou angle de présence"
    : t("contact.formations");

  const resolvedResponseCardTitle = isListingIntent
    ? language === "en"
      ? "What happens after submission"
      : "Ce que vous obtenez ensuite"
    : pageModel.responseCardTitle;

  const resolvedResponsePoints = isStrategicPartnershipIntent
    ? language === "en"
      ? [
          "An automatic acknowledgement email",
          "A review of the collaboration scope and strategic fit",
          "A response by email with the most relevant next step",
        ]
      : [
          "Un accusé de réception automatique",
          "Une étude du périmètre de collaboration et de l'alignement stratégique",
          "Un retour par email avec la prochaine étape la plus pertinente",
        ]
    : isListingIntent
    ? language === "en"
      ? [
          "An automatic acknowledgement email",
          "An editorial and commercial review of your request",
          "An email response with the possible listing format after review",
        ]
      : [
          "Un accusé de réception automatique",
          "Une revue éditoriale et commerciale de votre demande",
          "Un retour par email avec le format de présence possible après étude",
        ]
    : pageModel.responsePoints;

  const resolvedHelperTitle = isListingIntent
    ? language === "en"
      ? "To help us review faster"
      : "Pour faciliter la revue du dossier"
    : pageModel.helperTitle;

  const resolvedHelperPoints = isStrategicPartnershipIntent
    ? language === "en"
      ? [
          "Mention the institution or company and the partnership you are considering",
          "State the expected result: training, certification, event, deployment, or sponsorship",
          "Add any useful context on timing, audience, and geographic scope",
        ]
      : [
          "Indiquez la structure et le partenariat envisagé",
          "Précisez le résultat attendu : formation, certification, événement, déploiement ou sponsoring",
          "Ajoutez les éléments utiles sur le calendrier, le public visé et le périmètre géographique",
        ]
    : isListingIntent
    ? language === "en"
      ? [
          "State clearly what your organization does and who it serves",
          "Mention the sector, positioning, or visibility angle you want us to review",
          "Add your website or key public link when available",
        ]
      : [
          "Présentez clairement votre activité et le public que vous adressez",
          "Indiquez le secteur, le positionnement ou l'angle de présence souhaité",
          "Ajoutez votre site web ou votre lien public principal si disponible",
        ]
    : pageModel.helperPoints;

  const update = <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const activeLanguage = resolveOutboundLanguage(language);

    if (!form.privacyAccepted) {
      toast({
        title: t("contact.toastErrorTitle"),
        description: t("contact.privacyConsentError"),
        variant: "destructive",
      });
      return;
    }

    if (isCatalogIntent) {
      if (!form.formations.trim()) {
        toast({
          title: t("contact.toastErrorTitle"),
          description:
            language === "en"
              ? "Please select the domain of expertise for your catalogue request."
              : "Veuillez sélectionner le domaine du catalogue souhaité.",
          variant: "destructive",
        });
        return;
      }
      if (form.message.trim().length < 10) {
        toast({
          title: t("contact.toastErrorTitle"),
          description:
            language === "en"
              ? "Please describe in a few words your specific catalogue need."
              : "Merci de préciser en quelques mots votre besoin de catalogue.",
          variant: "destructive",
        });
        return;
      }
    }

    if (!isSupabaseConfigured) {
      toast({
        title: t("contact.toastErrorTitle"),
        description: supabaseUnavailableMessage,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Enrich message body with brief details so admins see them in /contact-requests
    const buildEnrichedMessage = () => {
      if (!isBriefSolutionIntent) return toOptionalValue(form.message);
      const lines: string[] = [];
      if (form.message.trim()) lines.push(form.message.trim());
      lines.push("");
      lines.push("--- Brief Solution IA ---");
      if (form.solutionTypes.length) lines.push(`Type(s) de solution : ${form.solutionTypes.join(", ")}`);
      if (form.processFrequency) lines.push(`Fréquence : ${form.processFrequency}`);
      if (form.existingTools.length) lines.push(`Outils existants : ${form.existingTools.join(", ")}`);
      if (form.dataAvailability.length) lines.push(`Données disponibles : ${form.dataAvailability.join(", ")}`);
      if (form.hasTechReferent) lines.push(`Référent technique interne : ${form.hasTechReferent}`);
      if (form.scopingHorizon) lines.push(`Délai souhaité : ${form.scopingHorizon}`);
      if (form.budgetRange) lines.push(`Budget indicatif : ${form.budgetRange}`);
      return lines.join("\n");
    };

    const { data: requestId, error } = await supabase.rpc("submit_contact_request", {
      full_name_input: form.name.trim(),
      email_input: form.email.trim(),
      phone_input: form.phone.trim(),
      company_input: form.company.trim(),
      sector_input: toOptionalValue(form.sector),
      city_input: toOptionalValue(form.city),
      participants_input: form.participants.trim() || null,
      requested_formations_input: toOptionalValue(form.formations),
      message_input: buildEnrichedMessage(),
      source_page_input: "/contact",
      language_input: activeLanguage,
      request_intent_input: resolvedIntent,
      requested_domain_input: toOptionalValue(form.formations || requestedDomain),
      privacy_consent_input: form.privacyAccepted,
      honeypot_input: form.botField.trim() || null,
      ai_maturity_input: isEnterpriseScopingFlow ? toOptionalValue(form.aiMaturity) : null,
      use_cases_input:
        isBriefSolutionIntent && form.solutionTypes.length > 0
          ? form.solutionTypes
          : isEnterpriseScopingFlow && form.useCases.length > 0
            ? form.useCases
            : null,
      scoping_horizon_input:
        isBriefSolutionIntent
          ? toOptionalValue(form.scopingHorizon)
          : isEnterpriseScopingFlow
            ? toOptionalValue(form.scopingHorizon)
            : null,
      engagement_format_input:
        isBriefSolutionIntent && form.existingTools.length > 0
          ? form.existingTools
          : isEnterpriseScopingFlow && form.engagementFormat.length > 0
            ? form.engagementFormat
            : null,
      budget_range_input:
        isBriefSolutionIntent
          ? toOptionalValue(form.budgetRange)
          : isEnterpriseScopingFlow
            ? toOptionalValue(form.budgetRange)
            : null,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: t("contact.toastErrorTitle"),
        description: t("contact.toastErrorDesc"),
        variant: "destructive",
      });
      return;
    }

    const participantsCount = (() => {
      const parsed = Number.parseInt(form.participants, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    })();

    const { error: notificationError } = await sendProspectEmailNotifications({
      requestId,
      intent: resolvedIntent as
        | "demande-catalogue"
        | "demande-renseignement"
        | "contact-devis"
        | "demande-referencement"
        | "brief-solution-ia",
      fullName: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      role: form.sector.trim() || null,
      city: form.city.trim() || null,
      domain: form.formations.trim() || null,
      participants: participantsCount,
      message: form.message.trim() || null,
      sourcePage: "/contact",
      language: activeLanguage,
      appointmentUrl: buildAbsoluteAppointmentUrl(resolvedIntent, form.formations.trim(), {
        company: form.company.trim(),
        fullName: form.name.trim(),
      }),
      aiMaturity: isEnterpriseScopingFlow ? form.aiMaturity || null : null,
      useCases:
        isBriefSolutionIntent && form.solutionTypes.length > 0
          ? form.solutionTypes
          : isEnterpriseScopingFlow && form.useCases.length > 0
            ? form.useCases
            : null,
      scopingHorizon:
        isBriefSolutionIntent
          ? form.scopingHorizon || null
          : isEnterpriseScopingFlow
            ? form.scopingHorizon || null
            : null,
      engagementFormat:
        isBriefSolutionIntent && form.existingTools.length > 0
          ? form.existingTools
          : isEnterpriseScopingFlow && form.engagementFormat.length > 0
            ? form.engagementFormat
            : null,
      budgetRange:
        isBriefSolutionIntent
          ? form.budgetRange || null
          : isEnterpriseScopingFlow
            ? form.budgetRange || null
            : null,
    });

    toast({
      title: t("contact.toastTitle"),
      description: notificationError
        ? "Votre demande a bien ete enregistree. L'accuse de reception email sera active des que la messagerie sera configuree."
        : t("contact.toastDesc"),
    });

    trackAnalyticsEvent("lead_request_submitted", {
      intent: resolvedIntent,
      language: activeLanguage,
      requested_domain: form.formations.trim() || null,
      participants: participantsCount,
      source_page: "/contact",
    });

    setForm(emptyForm);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        {!isCompactMode && <PageHeader title={resolvedHeaderTitle} subtitle={resolvedHeaderSubtitle} />}

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {!isCompactMode && !isBriefSolutionIntent && !isDefaultContactLanding && (
            <div className="mx-auto mb-12 max-w-6xl rounded-[28px] border border-border bg-card p-8 md:p-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <Sparkles size={14} />
                {resolvedQuickStartBadge}
              </div>
              <div className="mb-8 max-w-3xl">
                <h2 className="mb-3 font-heading text-2xl font-bold text-card-foreground md:text-3xl">{resolvedQuickStartTitle}</h2>
                <p className="text-sm leading-7 text-muted-foreground md:text-base md:leading-8">{resolvedQuickStartDesc}</p>
              </div>

              <div className={`grid gap-5 ${resolvedPathways.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
                {resolvedPathways.map((pathway, index) => (
                  <motion.div
                    key={pathway.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex h-full flex-col rounded-3xl border border-border bg-background p-6"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {pathway.href?.includes("wa.me") || pathway.title.toLowerCase().includes("whatsapp") ? <MessageCircle size={20} /> : pathway.href?.startsWith("/") ? <Calendar size={20} /> : <Mail size={20} />}
                    </div>
                    <h3 className="mb-3 font-heading text-xl font-bold text-card-foreground">{pathway.title}</h3>
                    <p className="mb-6 flex-1 text-sm leading-7 text-muted-foreground">{pathway.desc}</p>
                    {pathway.href ? (
                      pathway.href.startsWith("/") ? (
                        <Link to={pathway.href} className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80">
                          {pathway.cta}
                          <ArrowRight size={15} />
                        </Link>
                      ) : (
                      <a
                        href={pathway.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                      >
                        {pathway.cta}
                        <ArrowRight size={15} />
                      </a>
                      )
                    ) : (
                      <a href="#contact-form" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80">
                        {pathway.cta}
                        <ArrowRight size={15} />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            )}

            <div className={`grid gap-10 max-w-6xl mx-auto ${isCompactMode ? (isGuidanceIntent ? "lg:grid-cols-[1.05fr_0.95fr]" : "") : "lg:grid-cols-[1.35fr_0.65fr]"}`}>
              <div id="contact-form" className="rounded-[28px] border border-border bg-card p-8 md:p-10">
                {isDefaultContactLanding ? (
                  <div className="mb-6">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      <Mail size={14} />
                      {language === "en" ? "Write to us" : "Nous écrire"}
                    </div>
                    <h2 className="mb-3 font-heading text-2xl font-bold text-card-foreground md:text-3xl">
                      {language === "en" ? "Tell us about your need" : "Parlez-nous de votre besoin"}
                    </h2>
                    <p className="text-sm leading-7 text-muted-foreground md:text-base">
                      {language === "en"
                        ? "Share the essentials below — we'll come back to you within 24–48 business hours with a clear next step."
                        : "Partagez l'essentiel ci-dessous — nous revenons vers vous sous 24 à 48h ouvrées avec une orientation claire."}
                    </p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      <Mail size={14} />
                      {resolvedIntroBadge}
                    </div>
                    <h2 className="mb-3 font-heading text-2xl font-bold text-card-foreground">{resolvedIntroTitle}</h2>
                    <p className="text-sm leading-7 text-muted-foreground">{resolvedIntroDesc}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="rounded-3xl border border-border bg-background p-5 md:p-6">
                    <h3 className="mb-4 font-heading text-lg font-semibold text-card-foreground">{pageModel.coreFieldsTitle}</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input placeholder={t("contact.name")} required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
                      <input placeholder={t("contact.email")} type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                      <input placeholder={t("contact.phone")} required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
                      <input placeholder={t("contact.company")} required value={form.company} onChange={(e) => update("company", e.target.value)} className={inputClass} />
                      {isCatalogIntent ? (
                        <select
                          required
                          value={form.formations}
                          onChange={(e) => update("formations", e.target.value)}
                          className={inputClass + " sm:col-span-2"}
                        >
                          <option value="">
                            {language === "en"
                              ? "Select the catalogue domain *"
                              : "Sélectionnez le domaine du catalogue *"}
                          </option>
                          {catalogueDomainOptions.map((domain) => (
                            <option key={domain} value={domain}>
                              {domain}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input placeholder={resolvedCoreFieldLabel} value={form.formations} onChange={(e) => update("formations", e.target.value)} className={inputClass + " sm:col-span-2"} />
                      )}
                    </div>
                  </div>

                  {isEnterpriseScopingFlow && !isDefaultContactLanding && (
                    <div className="rounded-3xl border border-primary/30 bg-primary/[0.03] p-5 md:p-6">
                      <div className="mb-5">
                        <h3 className="font-heading text-lg font-semibold text-card-foreground">{scoping.sectionTitle}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{scoping.sectionDesc}</p>
                      </div>
                      <div className="space-y-5">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-card-foreground">{scoping.maturityLabel}</label>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {scoping.maturityOptions.map((opt) => (
                              <label key={opt.value} className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground hover:border-primary/40">
                                <input type="radio" name="aiMaturity" value={opt.value} checked={form.aiMaturity === opt.value} onChange={(e) => update("aiMaturity", e.target.value)} className="mt-1 h-4 w-4 text-primary focus:ring-primary/30" />
                                <span>{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-card-foreground">{scoping.useCasesLabel}</label>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {scoping.useCasesOptions.map((opt) => {
                              const checked = form.useCases.includes(opt);
                              return (
                                <label key={opt} className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground hover:border-primary/40">
                                  <input type="checkbox" checked={checked} onChange={(e) => update("useCases", e.target.checked ? [...form.useCases, opt] : form.useCases.filter((x) => x !== opt))} className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-card-foreground">{scoping.horizonLabel}</label>
                            <select value={form.scopingHorizon} onChange={(e) => update("scopingHorizon", e.target.value)} className={inputClass}>
                              <option value="">—</option>
                              {scoping.horizonOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-medium text-card-foreground">{scoping.budgetLabel}</label>
                            <select value={form.budgetRange} onChange={(e) => update("budgetRange", e.target.value)} className={inputClass}>
                              {scoping.budgetOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-card-foreground">{scoping.formatLabel}</label>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {scoping.formatOptions.map((opt) => {
                              const checked = form.engagementFormat.includes(opt);
                              return (
                                <label key={opt} className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground hover:border-primary/40">
                                  <input type="checkbox" checked={checked} onChange={(e) => update("engagementFormat", e.target.checked ? [...form.engagementFormat, opt] : form.engagementFormat.filter((x) => x !== opt))} className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isBriefSolutionIntent && (
                    <div className="rounded-3xl border border-primary/30 bg-primary/[0.03] p-5 md:p-6">
                      <div className="mb-5">
                        <h3 className="font-heading text-lg font-semibold text-card-foreground">{briefSolution.sectionTitle}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{briefSolution.sectionDesc}</p>
                      </div>
                      <div className="space-y-5">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-card-foreground">{briefSolution.solutionTypesLabel}</label>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {briefSolution.solutionTypesOptions.map((opt) => {
                              const checked = form.solutionTypes.includes(opt);
                              return (
                                <label key={opt} className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground hover:border-primary/40">
                                  <input type="checkbox" checked={checked} onChange={(e) => update("solutionTypes", e.target.checked ? [...form.solutionTypes, opt] : form.solutionTypes.filter((x) => x !== opt))} className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-card-foreground">{briefSolution.frequencyLabel}</label>
                            <select value={form.processFrequency} onChange={(e) => update("processFrequency", e.target.value)} className={inputClass}>
                              <option value="">—</option>
                              {briefSolution.frequencyOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-medium text-card-foreground">{briefSolution.techReferentLabel}</label>
                            <select value={form.hasTechReferent} onChange={(e) => update("hasTechReferent", e.target.value)} className={inputClass}>
                              <option value="">—</option>
                              {briefSolution.techReferentOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-card-foreground">{briefSolution.toolsLabel}</label>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {briefSolution.toolsOptions.map((opt) => {
                              const checked = form.existingTools.includes(opt);
                              return (
                                <label key={opt} className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground hover:border-primary/40">
                                  <input type="checkbox" checked={checked} onChange={(e) => update("existingTools", e.target.checked ? [...form.existingTools, opt] : form.existingTools.filter((x) => x !== opt))} className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-card-foreground">{briefSolution.dataLabel}</label>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {briefSolution.dataOptions.map((opt) => {
                              const checked = form.dataAvailability.includes(opt);
                              return (
                                <label key={opt} className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground hover:border-primary/40">
                                  <input type="checkbox" checked={checked} onChange={(e) => update("dataAvailability", e.target.checked ? [...form.dataAvailability, opt] : form.dataAvailability.filter((x) => x !== opt))} className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-card-foreground">{briefSolution.horizonLabel}</label>
                            <select value={form.scopingHorizon} onChange={(e) => update("scopingHorizon", e.target.value)} className={inputClass}>
                              <option value="">—</option>
                              {briefSolution.horizonOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-medium text-card-foreground">{briefSolution.budgetLabel}</label>
                            <select value={form.budgetRange} onChange={(e) => update("budgetRange", e.target.value)} className={inputClass}>
                              {briefSolution.budgetOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-3xl border border-border bg-background p-5 md:p-6">
                    <div className="mb-4">

                      <h3 className="font-heading text-lg font-semibold text-card-foreground">{pageModel.optionalFieldsTitle}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{pageModel.optionalFieldsDesc}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <select value={form.sector} onChange={(e) => update("sector", e.target.value)} className={inputClass}>
                        <option value="">{t("contact.sector")}</option>
                        {sectors.map((sector) => (
                          <option key={sector} value={sector}>
                            {sector}
                          </option>
                        ))}
                      </select>
                      <input placeholder={t("contact.city")} value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
                      <input type="number" min="1" placeholder={t("contact.participants")} value={form.participants} onChange={(e) => update("participants", e.target.value)} className={inputClass} />
                      <div className="hidden sm:block" />
                      <textarea
                        placeholder={
                          isCatalogIntent
                            ? language === "en"
                              ? "Describe your catalogue need: target audience, intended use, deadline... *"
                              : "Précisez votre besoin de catalogue : public visé, usage prévu, échéance... *"
                            : isGuidanceIntent
                            ? language === "en"
                              ? "Describe your context (company, sector, current situation), the result you want, the expected timeline and any constraint we should know..."
                              : "Décrivez votre contexte (entreprise, secteur, situation actuelle), le résultat attendu, l'échéance souhaitée et les contraintes éventuelles..."
                            : t("contact.message")
                        }
                        required={isCatalogIntent}
                        rows={4}
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        className={inputClass + " resize-none sm:col-span-2"}
                      />
                    </div>
                  </div>

                  <input tabIndex={-1} autoComplete="off" value={form.botField} onChange={(e) => update("botField", e.target.value)} className="hidden" aria-hidden="true" />
                  <label className="flex items-start gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={form.privacyAccepted}
                      onChange={(e) => update("privacyAccepted", e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                    />
                    <span>
                      {t("contact.privacyConsent")}{" "}
                      <a href="/confidentialite" className="font-semibold text-primary underline-offset-4 hover:underline">
                        {t("contact.privacyLink")}
                      </a>
                      .
                    </span>
                  </label>
                  <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-coral-gradient px-6 py-3 font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70" style={{ color: "hsl(0 0% 100%)" }}>
                    {isSubmitting ? t("contact.submitPending") : resolvedSubmitLabel}
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>

              {isCompactMode && isGuidanceIntent && (
                <div className="space-y-5">
                  <div className="rounded-[28px] border border-border bg-card p-6 md:p-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      <Calendar size={14} />
                      {language === "en" ? "Book a 30-min expert call" : "Réserver un échange expert (30 min)"}
                    </div>
                    <h3 className="mb-2 font-heading text-xl font-bold text-card-foreground">
                      {language === "en" ? "Prefer a direct conversation?" : "Vous préférez un échange direct ?"}
                    </h3>
                    <p className="mb-4 text-sm leading-7 text-muted-foreground">
                      {language === "en"
                        ? "Pick a time that suits you. One of our AI experts will join the call to scope your need and recommend the right next step."
                        : "Choisissez un créneau qui vous convient. Un expert IA vous rejoint pour cadrer votre besoin et vous orienter vers la bonne suite."}
                    </p>
                    <AppointmentBooking
                      prefill={{ name: form.name, email: form.email, company: form.company, domain: form.formations }}
                      analyticsLocation="contact_compact_guidance"
                    />
                  </div>
                </div>
              )}


              {!isCompactMode && (
              <div className="space-y-5">
                {isBriefSolutionIntent && (
                  <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[28px] border border-primary/30 bg-primary/[0.03] p-6">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      <Calendar size={14} />
                      {language === "en" ? "Book a 30-min project call" : "Réserver un échange projet (30 min)"}
                    </div>
                    <h3 className="mb-2 font-heading text-xl font-bold text-card-foreground">
                      {language === "en" ? "Talk directly to an AI builder" : "Parlez directement à un expert IA"}
                    </h3>
                    <p className="mb-4 text-sm leading-7 text-muted-foreground">
                      {language === "en"
                        ? "Pick a time that suits you. We will align on your project, the right approach, and the next concrete steps."
                        : "Choisissez un créneau qui vous convient. Nous cadrerons votre projet, la bonne approche et les prochaines étapes concrètes."}
                    </p>
                    <AppointmentBooking
                      prefill={{ name: form.name, email: form.email, company: form.company, domain: form.formations }}
                      analyticsLocation="contact_brief_solution"
                    />
                  </motion.div>
                )}
                {!isDefaultContactLanding && (
                <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-heading text-lg font-semibold text-card-foreground">{resolvedResponseCardTitle}</h3>
                  <div className="space-y-3">
                    {resolvedResponsePoints.map((point) => (
                      <div key={point} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                        <CheckCircle2 size={16} className="mt-1 shrink-0 text-primary" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                )}

                {!isBriefSolutionIntent && (
                <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="rounded-3xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-heading text-lg font-semibold text-card-foreground">
                    {isDefaultContactLanding
                      ? language === "en" ? "Key information" : "Informations clés"
                      : pageModel.contactCardTitle}
                  </h3>
                  <div className="space-y-4 text-sm">
                    <a href={directLinks.phone} className="flex items-start gap-3 text-card-foreground hover:text-primary transition-colors group">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Phone size={16} />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{language === "en" ? "Phone" : "Téléphone"}</span>
                        <span className="font-medium">{contactDetails.phoneDisplay}</span>
                      </span>
                    </a>
                    <a href={directLinks.email} className="flex items-start gap-3 text-card-foreground hover:text-primary transition-colors">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Mail size={16} />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</span>
                        <span className="font-medium break-all">{contactDetails.email}</span>
                      </span>
                    </a>
                    <a href={directLinks.map} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-card-foreground hover:text-primary transition-colors">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <MapPin size={16} />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{language === "en" ? "Address" : "Adresse"}</span>
                        <span className="font-medium leading-6">{contactDetails.addressShort}</span>
                      </span>
                    </a>
                    {isDefaultContactLanding && (
                      <div className="flex items-start gap-3 text-card-foreground">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <CheckCircle2 size={16} />
                        </span>
                        <span className="flex flex-col">
                          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{language === "en" ? "Response time" : "Délai de réponse"}</span>
                          <span className="font-medium">{language === "en" ? "Within 24–48 business hours" : "Sous 24 à 48h ouvrées"}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
                )}

                <motion.a href={directLinks.whatsapp} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-3xl border border-border bg-card p-6 flex items-center gap-4 hover-lift block">
                  <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center">
                    <MessageCircle size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-card-foreground">{t("contact.whatsapp")}</p>
                    <p className="text-xs text-muted-foreground">{contactDetails.whatsappDisplay}</p>
                  </div>
                </motion.a>

                {!isBriefSolutionIntent && !isDefaultContactLanding && (
                <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="rounded-3xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-heading text-lg font-semibold text-card-foreground">{resolvedHelperTitle}</h3>
                  <div className="space-y-3">
                    {resolvedHelperPoints.map((point) => (
                      <div key={point} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                        <CheckCircle2 size={16} className="mt-1 shrink-0 text-primary" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                )}

              </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <Calendar size={14} />
                {language === "en" ? "Book a free 30-min diagnostic" : "Réserver un diagnostic gratuit (30 min)"}
              </div>
              <h2 className="mt-4 font-heading text-3xl md:text-4xl font-bold text-card-foreground">
                {language === "en" ? "Pick a slot that suits you" : "Choisissez un créneau qui vous convient"}
              </h2>
              <p className="mt-3 text-base text-muted-foreground max-w-2xl mx-auto">
                {language === "en"
                  ? "An AI expert from TransferAI Africa will join the call to scope your need and recommend the right next step."
                  : "Un expert IA de TransferAI Africa vous rejoint pour cadrer votre besoin et orienter la suite."}
              </p>
            </div>
            <AppointmentBooking
              prefill={{ name: form.name, email: form.email, company: form.company, domain: form.formations }}
              analyticsLocation="contact_page_bottom"
            />
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ContactPage;
