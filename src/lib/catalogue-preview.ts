import { formations, type Formation } from "@/data/formations";
import { slugifySiteValue } from "@/lib/site-links";
import type { Language } from "@/i18n/LanguageContext";

export type DomainPreview = {
  slug: string;
  domain: string;
  headline: string;
  summary: string;
  audience: string[];
  outcomes: string[];
  deliverables: string[];
  requestFocus: string[];
};

const domainPreviewContent: Omit<DomainPreview, "slug">[] = [
  {
    domain: "Assistanat & Secrétariat",
    headline: "Des parcours pratiques pour digitaliser l'assistanat de direction et les fonctions support.",
    summary:
      "Ce catalogue regroupe des formations courtes et opérationnelles pour améliorer la productivité, la rédaction, l'organisation et l'automatisation des tâches administratives avec l'IA.",
    audience: ["Assistants de direction", "Office managers", "Secrétaires exécutifs", "Assistants administratifs"],
    outcomes: ["Réduire le temps de traitement documentaire", "Mieux préparer les réunions et les comptes rendus", "Structurer un poste d'assistanat augmenté par l'IA"],
    deliverables: ["Programme détaillé par formation", "Modalités d'animation", "Prérequis", "Compétences visées"],
    requestFocus: ["Catalogue du domaine", "Parcours débutant à avancé", "Session intra-entreprise", "Accompagnement d'équipe"],
  },
  {
    domain: "Ressources Humaines",
    headline: "Former les équipes RH à une IA utile, conforme et orientée performance.",
    summary:
      "Le domaine RH couvre le sourcing, l'onboarding, la formation, la paie, l'analyse des données RH et la conformité, avec une approche pragmatique et responsable.",
    audience: ["DRH", "Responsables recrutement", "Responsables formation", "HR business partners"],
    outcomes: ["Accélérer les processus RH", "Industrialiser l'analyse RH", "Déployer des cas d'usage compatibles avec la conformité"],
    deliverables: ["Catalogue RH complet", "Cas d'usage RH prioritaires", "Recommandations de déploiement", "Formats intra et inter"],
    requestFocus: ["Recrutement", "People analytics", "Formation des managers", "Conformite RH"],
  },
  {
    domain: "Marketing & Communication",
    headline: "Un portefeuille de formations orienté visibilité, contenu et performance marketing.",
    summary:
      "Ce domaine aide les équipes marketing à produire plus vite, à personnaliser les campagnes, à automatiser la veille et à structurer une création de contenu pilotée par l'IA.",
    audience: ["Responsables marketing", "Chargés de communication", "Social media managers", "Brand managers"],
    outcomes: ["Créer plus de contenus à forte valeur", "Améliorer la performance des campagnes", "Professionnaliser l'usage des outils génératifs"],
    deliverables: ["Parcours par niveau", "Exemples d'outils recommandés", "Formats possibles", "Résultats attendus"],
    requestFocus: ["Content marketing", "SEO", "Emailing", "Génération visuelle"],
  },
  {
    domain: "Finance & Comptabilite",
    headline: "Des parcours pour sécuriser, automatiser et fiabiliser les fonctions finance.",
    summary:
      "Les formations finance abordent l'analyse, la trésorerie, l'audit, le reporting, les risques et l'automatisation comptable avec des cas concrets adaptés aux équipes financières.",
    audience: ["Directeurs financiers", "Chefs comptables", "Contrôleurs de gestion", "Auditeurs internes"],
    outcomes: ["Réduire le temps de reporting", "Fiabiliser les analyses et les contrôles", "Identifier les cas d'usage à fort ROI"],
    deliverables: ["Catalogue finance détaillé", "Focus conformité et audit", "Compétences développées", "Approche par métier"],
    requestFocus: ["Audit augmenté", "Reporting automatisé", "Prévisionnel", "Gestion des risques"],
  },
  {
    domain: "Juridique & Conformite",
    headline: "Des formations pour les juristes, compliance officers et fonctions réglementaires.",
    summary:
      "Le catalogue juridique et conformité couvre la recherche, l'analyse contractuelle, la veille réglementaire, la rédaction et la gouvernance de l'information sensible.",
    audience: ["Juristes", "Compliance officers", "Responsables risques", "Responsables protection des données"],
    outcomes: ["Structurer une veille juridique augmentée", "Gagner du temps sur l'analyse documentaire", "Mieux encadrer l'usage de l'IA en contexte sensible"],
    deliverables: ["Formations par cas d'usage", "Compétences clés", "Livrables de fin de session", "Modalités d'intervention"],
    requestFocus: ["Contrats", "Veille", "RGPD", "Conformité sectorielle"],
  },
  {
    domain: "Service Client",
    headline: "Des parcours pour transformer la relation client avec des outils IA utiles et mesurables.",
    summary:
      "Le domaine service client couvre les chatbots, l'analyse de sentiment, la qualité de réponse, la fidélisation et l'automatisation du support.",
    audience: ["Responsables service client", "Superviseurs de centre de contact", "CX managers", "Responsables support"],
    outcomes: ["Réduire les délais de réponse", "Améliorer la satisfaction client", "Outiller les équipes avec des workflows IA"],
    deliverables: ["Catalogue par niveau", "Cas d'usage service client", "Compétences visées", "Scénarios de déploiement"],
    requestFocus: ["Support omnicanal", "Chatbots", "Analyse de feedback", "Fidélisation"],
  },
  {
    domain: "Data & Analyse",
    headline: "Un catalogue centré sur la donnée, l'analyse décisionnelle et l'automatisation analytique.",
    summary:
      "Ces formations aident les équipes à collecter, structurer, analyser et valoriser les données métier avec l'appui de l'IA et d'outils de visualisation.",
    audience: ["Analystes", "Responsables data", "Contrôleurs de gestion", "Managers métiers"],
    outcomes: ["Accélérer la production d'analyses", "Créer des tableaux de bord plus utiles", "Monter en maturité sur l'exploitation de la donnée"],
    deliverables: ["Cartographie des formations data", "Compétences par niveau", "Formats d'apprentissage", "Bénéfices opérationnels"],
    requestFocus: ["Dashboards", "Visualisation", "Analyse prédictive", "Data literacy"],
  },
  {
    domain: "Administration & Gestion",
    headline: "Des formations orientées gestion opérationnelle, processus et efficacité administrative.",
    summary:
      "Le domaine administration et gestion regroupe des formations pour moderniser les processus internes, automatiser le suivi et fluidifier l'organisation quotidienne.",
    audience: ["Responsables administratifs", "Coordinateurs d'activité", "Gestionnaires opérationnels", "Fonctions support"],
    outcomes: ["Standardiser les tâches répétitives", "Gagner en traçabilité", "Mieux piloter les opérations"],
    deliverables: ["Catalogue structuré par besoin", "Formats de déploiement", "Parcours de montée en compétence", "Modalités d'accompagnement"],
    requestFocus: ["Automatisation administrative", "Courriers", "Dashboards", "Processus internes"],
  },
  {
    domain: "Management & Leadership",
    headline: "Des parcours pour dirigeants et managers qui veulent piloter l'IA avec méthode.",
    summary:
      "Le catalogue management accompagne les décideurs sur la stratégie, la conduite du changement, la performance, l'innovation et la culture IA en entreprise.",
    audience: ["Directeurs généraux", "Managers", "Comités de direction", "Chefs de projet transformation"],
    outcomes: ["Mieux décider avec la donnée et l'IA", "Aligner les équipes sur une trajectoire claire", "Piloter la transformation sans effet gadget"],
    deliverables: ["Catalogue leadership", "Bénéfices par typologie de manager", "Résultats attendus", "Formats dirigeants"],
    requestFocus: ["Vision stratégique", "Conduite du changement", "Culture IA", "Performance managériale"],
  },
  {
    domain: "IT & Transformation Digitale",
    headline: "Des formations pour les équipes techniques, projets digitaux et fonctions d'intégration.",
    summary:
      "Le domaine IT couvre les API, l'automatisation, les architectures IA, la cybersécurité, le no-code et la gouvernance technologique.",
    audience: ["DSI", "Responsables IT", "Chefs de projet digitaux", "Architectes solutions"],
    outcomes: ["Identifier les bons chantiers techniques", "Raccourcir les cycles de déploiement", "Renforcer la maîtrise des environnements IA"],
    deliverables: ["Catalogue digital et IT", "Parcours techniques", "Prérequis", "Formats adaptés à l'entreprise"],
    requestFocus: ["Intégration", "Cybersécurité", "No-code", "Architecture IA"],
  },
  {
    domain: "Formation & Pedagogie",
    headline: "Des formations pour moderniser la conception pédagogique et l'expérience apprenant.",
    summary:
      "Ce domaine accompagne les équipes formation sur la conception, la personnalisation, l'évaluation, les LMS, les contenus et les analytics d'apprentissage.",
    audience: ["Responsables formation", "Ingénieurs pédagogiques", "Formateurs", "Responsables académiques"],
    outcomes: ["Créer des dispositifs plus engageants", "Industrialiser la production pédagogique", "Améliorer le suivi apprenant"],
    deliverables: ["Catalogue formation et pédagogie", "Parcours pour formateurs", "Cas d'usage IA éducative", "Formats présentiel et distanciel"],
    requestFocus: ["Ingénierie pédagogique", "E-learning", "Évaluation", "LMS"],
  },
  {
    domain: "Sante & Bien-etre",
    headline: "Des formations métiers pour la qualité de vie au travail, la prévention et les programmes santé.",
    summary:
      "Le domaine santé et bien-être propose des contenus autour de la prévention, de l'ergonomie, de la QVT, de la conformité HSE et de l'accompagnement des équipes.",
    audience: ["Responsables HSE", "Responsables QVT", "Médecine du travail", "Fonctions RH et prévention"],
    outcomes: ["Mieux outiller la prévention", "Structurer les programmes de bien-être", "Renforcer la culture sécurité et conformité"],
    deliverables: ["Catalogue sectoriel", "Cas d'usage santé au travail", "Bénéfices opérationnels", "Compétences visées"],
    requestFocus: ["Prévention", "QVT", "Ergonomie", "Conformité HSE"],
  },
  {
    domain: "Diplomatie & Affaires Internationales",
    headline: "Un catalogue premium pour institutions, diplomates et organisations internationales.",
    summary:
      "Ce domaine couvre les usages stratégiques de l'IA pour la diplomatie numérique, la géopolitique, la cybersécurité, la gouvernance et les négociations internationales.",
    audience: ["Diplomates", "Institutions publiques", "Organisations internationales", "Cellules de prospective"],
    outcomes: ["Renforcer la lecture stratégique des enjeux IA", "Développer des capacités d'analyse et de négociation", "Acculturer les décideurs institutionnels"],
    deliverables: ["Catalogue institutionnel", "Parcours par niveau", "Formats executives", "Notes de cadrage"],
    requestFocus: ["Diplomatie numérique", "Gouvernance IA", "Analyse géopolitique", "Leadership public"],
  },
];

export const domainPreviews: DomainPreview[] = domainPreviewContent.map((item) => ({
  ...item,
  slug: slugifySiteValue(item.domain),
}));

export const domainPreviewMap = new Map(domainPreviews.map((item) => [item.domain, item]));
export const domainPreviewSlugMap = new Map(domainPreviews.map((item) => [item.slug, item]));

type LocalizedDomainContent = {
  domain: string;
  headline: string;
  summary: string;
  audience: string[];
  outcomes: string[];
  deliverables: string[];
  requestFocus: string[];
};

const englishDomainPreviewContent: Record<string, LocalizedDomainContent> = {
  "assistanat-et-secretariat": {
    domain: "Executive Assistance & Secretariat",
    headline: "Practical pathways to digitize executive support and administrative roles.",
    summary:
      "This catalogue brings together short, operational courses to improve productivity, writing, organization and administrative task automation with AI.",
    audience: ["Executive assistants", "Office managers", "Executive secretaries", "Administrative assistants"],
    outcomes: ["Reduce document processing time", "Prepare meetings and reports more effectively", "Structure an AI-augmented support role"],
    deliverables: ["Detailed program by course", "Delivery formats", "Prerequisites", "Target skills"],
    requestFocus: ["Domain catalogue", "Beginner to advanced pathway", "In-house training", "Team support"],
  },
  "ressources-humaines": {
    domain: "Human Resources",
    headline: "Train HR teams on useful, compliant and performance-oriented AI.",
    summary:
      "The HR domain covers sourcing, onboarding, training, payroll, HR analytics and compliance, with a practical and responsible approach.",
    audience: ["HR directors", "Recruitment managers", "Training managers", "HR business partners"],
    outcomes: ["Accelerate HR processes", "Industrialize HR analytics", "Deploy compliant AI use cases"],
    deliverables: ["Full HR catalogue", "Priority HR use cases", "Deployment recommendations", "In-house and open-enrollment formats"],
    requestFocus: ["Recruitment", "People analytics", "Manager training", "HR compliance"],
  },
  "marketing-et-communication": {
    domain: "Marketing & Communication",
    headline: "A training portfolio focused on visibility, content and marketing performance.",
    summary:
      "This domain helps marketing teams produce faster, personalize campaigns, automate monitoring and structure AI-driven content creation.",
    audience: ["Marketing managers", "Communication officers", "Social media managers", "Brand managers"],
    outcomes: ["Create more high-value content", "Improve campaign performance", "Professionalize the use of generative tools"],
    deliverables: ["Level-based learning paths", "Recommended tool examples", "Available formats", "Expected results"],
    requestFocus: ["Content marketing", "SEO", "Email marketing", "Visual generation"],
  },
  "finance-et-comptabilite": {
    domain: "Finance & Accounting",
    headline: "Pathways to secure, automate and strengthen finance functions.",
    summary:
      "Finance courses cover analysis, treasury, audit, reporting, risk and accounting automation through concrete cases tailored to finance teams.",
    audience: ["Finance directors", "Chief accountants", "Controllers", "Internal auditors"],
    outcomes: ["Reduce reporting time", "Improve analytical accuracy and control", "Identify high-ROI AI use cases"],
    deliverables: ["Detailed finance catalogue", "Audit and compliance focus", "Skills developed", "Role-based approach"],
    requestFocus: ["Augmented audit", "Automated reporting", "Forecasting", "Risk management"],
  },
  "juridique-et-conformite": {
    domain: "Legal & Compliance",
    headline: "Training for legal teams, compliance officers and regulatory functions.",
    summary:
      "The legal and compliance catalogue covers research, contract analysis, regulatory monitoring, drafting and governance of sensitive information.",
    audience: ["Legal counsels", "Compliance officers", "Risk managers", "Data protection leads"],
    outcomes: ["Structure augmented legal monitoring", "Save time on document analysis", "Better frame AI use in sensitive contexts"],
    deliverables: ["Use-case-based courses", "Key skills", "End-of-session deliverables", "Delivery methods"],
    requestFocus: ["Contracts", "Monitoring", "GDPR", "Sector compliance"],
  },
  "service-client": {
    domain: "Customer Service",
    headline: "Training pathways to transform customer relationships with useful, measurable AI.",
    summary:
      "The customer service domain covers chatbots, sentiment analysis, response quality, loyalty and support automation.",
    audience: ["Customer service managers", "Contact center supervisors", "CX managers", "Support leads"],
    outcomes: ["Reduce response times", "Improve customer satisfaction", "Equip teams with AI workflows"],
    deliverables: ["Level-based catalogue", "Customer service use cases", "Target skills", "Deployment scenarios"],
    requestFocus: ["Omnichannel support", "Chatbots", "Feedback analysis", "Retention"],
  },
  "data-analyse": {
    domain: "Data & Analytics",
    headline: "A catalogue centered on data, decision-making and analytics automation.",
    summary:
      "These courses help teams collect, structure, analyze and leverage business data using AI and visualization tools.",
    audience: ["Analysts", "Data leads", "Controllers", "Business managers"],
    outcomes: ["Speed up analysis production", "Create more useful dashboards", "Increase data maturity"],
    deliverables: ["Data course mapping", "Skills by level", "Learning formats", "Operational benefits"],
    requestFocus: ["Dashboards", "Visualization", "Predictive analytics", "Data literacy"],
  },
  "administration-et-gestion": {
    domain: "Administration & Operations",
    headline: "Training focused on operational management, processes and administrative efficiency.",
    summary:
      "The administration and operations domain brings together courses to modernize internal processes, automate follow-up and streamline daily organization.",
    audience: ["Administrative managers", "Activity coordinators", "Operations managers", "Support functions"],
    outcomes: ["Standardize repetitive work", "Improve traceability", "Better manage operations"],
    deliverables: ["Need-based catalogue", "Deployment formats", "Upskilling paths", "Support options"],
    requestFocus: ["Administrative automation", "Business correspondence", "Dashboards", "Internal processes"],
  },
  "management-et-leadership": {
    domain: "Management & Leadership",
    headline: "Pathways for executives and managers who want to lead AI with structure.",
    summary:
      "The management catalogue supports decision-makers on strategy, change management, performance, innovation and AI culture in business.",
    audience: ["CEOs", "Managers", "Executive committees", "Transformation project leads"],
    outcomes: ["Make better decisions with data and AI", "Align teams on a clear roadmap", "Lead transformation without gimmicks"],
    deliverables: ["Leadership catalogue", "Benefits by manager profile", "Expected outcomes", "Executive formats"],
    requestFocus: ["Strategic vision", "Change management", "AI culture", "Managerial performance"],
  },
  "it-et-transformation-digitale": {
    domain: "IT & Digital Transformation",
    headline: "Training for technical teams, digital projects and integration functions.",
    summary:
      "The IT domain covers APIs, automation, AI architectures, cybersecurity, no-code and technology governance.",
    audience: ["CIOs", "IT managers", "Digital project managers", "Solution architects"],
    outcomes: ["Identify the right technical initiatives", "Shorten deployment cycles", "Strengthen mastery of AI environments"],
    deliverables: ["Digital and IT catalogue", "Technical pathways", "Prerequisites", "Enterprise-ready formats"],
    requestFocus: ["Integration", "Cybersecurity", "No-code", "AI architecture"],
  },
  "formation-et-pedagogie": {
    domain: "Learning & Instructional Design",
    headline: "Training to modernize instructional design and learner experience.",
    summary:
      "This domain supports learning teams on design, personalization, assessment, LMS, content creation and learning analytics.",
    audience: ["Learning managers", "Instructional designers", "Trainers", "Academic leaders"],
    outcomes: ["Create more engaging programs", "Industrialize content production", "Improve learner follow-up"],
    deliverables: ["Learning and pedagogy catalogue", "Trainer pathways", "Educational AI use cases", "On-site and online formats"],
    requestFocus: ["Instructional design", "E-learning", "Assessment", "LMS"],
  },
  "sante-bien-etre": {
    domain: "Health & Workplace Well-being",
    headline: "Role-based training for well-being, prevention and workplace health programs.",
    summary:
      "The health and well-being domain offers content around prevention, ergonomics, workplace quality of life, HSE compliance and workforce support.",
    audience: ["HSE managers", "Workplace well-being leads", "Occupational health teams", "HR and prevention functions"],
    outcomes: ["Better equip prevention initiatives", "Structure well-being programs", "Strengthen safety and compliance culture"],
    deliverables: ["Sector catalogue", "Workplace health use cases", "Operational benefits", "Target skills"],
    requestFocus: ["Prevention", "Well-being", "Ergonomics", "HSE compliance"],
  },
  "diplomatie-affaires-internationales": {
    domain: "Diplomacy & International Affairs",
    headline: "A premium catalogue for institutions, diplomats and international organizations.",
    summary:
      "This domain covers strategic uses of AI for digital diplomacy, geopolitics, cybersecurity, governance and international negotiations.",
    audience: ["Diplomats", "Public institutions", "International organizations", "Foresight units"],
    outcomes: ["Strengthen strategic understanding of AI issues", "Develop analysis and negotiation capabilities", "Upskill institutional decision-makers"],
    deliverables: ["Institutional catalogue", "Level-based pathways", "Executive formats", "Scoping notes"],
    requestFocus: ["Digital diplomacy", "AI governance", "Geopolitical analysis", "Public leadership"],
  },
};

export const getLocalizedDomainPreview = (preview: DomainPreview, language: Language) => {
  if (language === "fr") {
    return preview;
  }

  const localized = englishDomainPreviewContent[preview.slug];
  return localized ? { ...preview, ...localized } : preview;
};

export const getLocalizedDomainLabel = (domain: string, language: Language) => {
  const preview = domainPreviewMap.get(domain);
  if (!preview) return domain;

  return getLocalizedDomainPreview(preview, language).domain;
};

export const getDomainPreviewBySlug = (slug: string) => domainPreviewSlugMap.get(slug);

export const getFormationsByDomain = (domain: string): Formation[] =>
  formations.filter((formation) => slugifySiteValue(formation.metier) === slugifySiteValue(domain));

export const catalogueStats = {
  totalDomains: domainPreviews.length,
  totalFormations: formations.length,
  totalFormats: [...new Set(formations.map((formation) => formation.format))].length,
};
