export type LocalizedText = {
  fr: string;
  en: string;
};

export type CertificationModule = {
  day: number;
  title: LocalizedText;
  summary: LocalizedText;
};

export type CertificationDomainProfile = {
  slug: string;
  domainKey: string;
  label: LocalizedText;
  shortPitch: LocalizedText;
  companyPitch: LocalizedText;
  targetProfiles: {
    fr: string[];
    en: string[];
  };
  objectives: {
    fr: string[];
    en: string[];
  };
  businessOutcomes: {
    fr: string[];
    en: string[];
  };
  deliverables: {
    fr: string[];
    en: string[];
  };
  program: CertificationModule[];
};

const text = (fr: string, en: string): LocalizedText => ({ fr, en });
const list = (fr: string[], en: string[]) => ({ fr, en });

export const certificationMethodology = {
  title: text("Cadre pédagogique & inspiration IA", "Pedagogical framework & AI inspiration"),
  description: text(
    "Cette certification s'inspire des usages professionnels documentés par OpenAI, Anthropic Claude et Google Gemini : recherche assistée, synthèse fiable, copilotes métier, assistants documentaires, automatisation de workflows et prise de décision augmentée. TransferAI Africa adapte ensuite ces pratiques aux réalités métiers des entreprises ivoiriennes et africaines.",
    "This certification is informed by professional AI patterns documented by OpenAI, Anthropic Claude, and Google Gemini: assisted research, reliable synthesis, domain copilots, document assistants, workflow automation, and augmented decision support. TransferAI Africa then adapts those patterns to the realities of Ivorian and African organizations."
  ),
  points: list(
    [
      "Un socle commun sur la méthode, la qualité, la vérification et la confidentialité.",
      "Des cas d'usage métiers alignés sur les tâches, livrables et décisions propres à chaque secteur.",
      "Un format intensif de 5 jours conçu pour aller de la compréhension à la production réelle.",
      "Une évaluation finale fondée sur un cas terrain, un livrable concret et une grille simple de validation."
    ],
    [
      "A common core focused on method, quality, verification, and confidentiality.",
      "Domain use cases aligned with the tasks, deliverables, and decisions specific to each sector.",
      "An intensive 5-day format designed to move from understanding to real production.",
      "A final assessment based on a field case, a tangible deliverable, and a simple validation rubric."
    ]
  ),
};

export const certificationDomainProfiles: CertificationDomainProfile[] = [
  {
    slug: "executive-support",
    domainKey: "Assistanat & Secrétariat",
    label: text("Assistanat & Secrétariat", "Executive Support & Administration"),
    shortPitch: text(
      "Utiliser l'IA pour gagner du temps sur les e-mails, comptes rendus, agendas, notes et coordination de direction.",
      "Use AI to save time on emails, meeting notes, agendas, executive briefs, and coordination."
    ),
    companyPitch: text(
      "Cette version de la certification aide les assistants de direction, office managers et équipes administratives à structurer l'information, produire des supports plus vite et fiabiliser la coordination exécutive.",
      "This version of the certification helps executive assistants, office managers, and admin teams structure information, produce deliverables faster, and strengthen executive coordination."
    ),
    targetProfiles: list(
      [
        "Assistants de direction, secrétaires et office managers.",
        "Profils support qui gèrent réunions, documents, mails et coordination.",
        "Entreprises qui veulent professionnaliser leur support exécutif avec l'IA."
      ],
      [
        "Executive assistants, secretaries, and office managers.",
        "Support roles managing meetings, documents, email, and coordination.",
        "Organizations that want to modernize executive support with AI."
      ]
    ),
    objectives: list(
      [
        "Maîtriser les copilotes IA pour la rédaction, la synthèse et la préparation des réunions.",
        "Réduire le temps passé sur les tâches administratives répétitives à faible valeur.",
        "Produire des notes, comptes rendus et supports de direction plus clairs et plus fiables.",
        "Mettre en place une méthode de coordination augmentée par l'IA sans perdre le contrôle humain."
      ],
      [
        "Master AI copilots for drafting, synthesis, and meeting preparation.",
        "Reduce time spent on repetitive low-value administrative tasks.",
        "Produce clearer, more reliable briefs, minutes, and executive support materials.",
        "Build an AI-augmented coordination method without losing human control."
      ]
    ),
    businessOutcomes: list(
      [
        "Comptes rendus, courriels et supports préparés plus vite.",
        "Meilleure circulation de l'information entre direction, équipes et partenaires.",
        "Coordination plus rigoureuse des échéances, réunions et relances.",
        "Professionnalisation visible du support administratif et exécutif."
      ],
      [
        "Faster production of meeting notes, emails, and support materials.",
        "Better information flow between leadership, teams, and partners.",
        "Stronger coordination of deadlines, meetings, and follow-ups.",
        "A visibly more professional executive support function."
      ]
    ),
    deliverables: list(
      [
        "Une bibliothèque de prompts et modèles de documents de direction.",
        "Un workflow de préparation et suivi de réunion assisté par IA.",
        "Un cas pratique final : dossier exécutif, note et compte rendu complet."
      ],
      [
        "A library of prompts and executive document templates.",
        "An AI-assisted workflow for meeting preparation and follow-up.",
        "A final practical case: executive brief, note, and full meeting record."
      ]
    ),
    program: [
      { day: 1, title: text("Jour 1 - IA au service du support exécutif", "Day 1 - AI for executive support"), summary: text("Comprendre les usages utiles de l'IA dans l'assistanat, cadrer les bons cas d'usage, définir les règles de qualité, confidentialité et validation humaine.", "Understand the most useful AI applications in executive support, frame the right use cases, and define quality, confidentiality, and human-review rules.") },
      { day: 2, title: text("Jour 2 - Courriels, comptes rendus et documents", "Day 2 - Email, minutes, and documents"), summary: text("Utiliser les outils IA pour rédiger, résumer, reformuler et structurer des e-mails, notes, PV et supports administratifs à partir d'informations brutes.", "Use AI tools to draft, summarize, rewrite, and structure emails, notes, minutes, and admin materials from raw information.") },
      { day: 3, title: text("Jour 3 - Agenda, coordination et relances", "Day 3 - Agenda, coordination, and follow-ups"), summary: text("Construire des workflows de préparation de réunions, d'organisation d'agendas, de relances et de suivi d'actions avec une logique simple et robuste.", "Build simple and reliable workflows for meeting prep, agenda management, follow-ups, and action tracking.") },
      { day: 4, title: text("Jour 4 - Communication de direction augmentée", "Day 4 - AI-enhanced executive communication"), summary: text("Préparer des notes de synthèse, éléments de langage, briefings et dossiers d'aide à la décision adaptés aux attentes d'une direction.", "Prepare executive summaries, talking points, briefings, and decision-support packs aligned with leadership expectations.") },
      { day: 5, title: text("Jour 5 - Cas final & évaluation pratique", "Day 5 - Final case & practical assessment"), summary: text("Traiter un cas complet de support exécutif, produire les livrables attendus et valider les acquis à partir d'une grille d'évaluation simple.", "Solve a full executive-support case, produce the expected deliverables, and validate learning with a simple assessment rubric.") },
    ],
  },
  {
    slug: "human-resources",
    domainKey: "Ressources Humaines",
    label: text("Ressources Humaines", "Human Resources"),
    shortPitch: text(
      "Déployer l'IA pour le recrutement, la montée en compétences, l'expérience collaborateur et la performance RH.",
      "Deploy AI for recruitment, upskilling, employee experience, and HR performance."
    ),
    companyPitch: text(
      "Cette spécialisation aide les DRH, recruteurs et responsables formation à structurer un usage responsable de l'IA sur le sourcing, les entretiens, les parcours de développement et la communication RH.",
      "This specialization helps HR leaders, recruiters, and learning managers structure responsible AI use across sourcing, interviews, development paths, and HR communication."
    ),
    targetProfiles: list(
      [
        "DRH, responsables RH, recruteurs et HR business partners.",
        "Responsables formation, talent development et people operations.",
        "Entreprises qui veulent accélérer leurs processus RH sans dégrader l'équité."
      ],
      [
        "HR directors, HR managers, recruiters, and HR business partners.",
        "Learning, talent development, and people operations leaders.",
        "Organizations that want faster HR processes without reducing fairness."
      ]
    ),
    objectives: list(
      [
        "Utiliser l'IA pour présélectionner, analyser et structurer des candidatures avec méthode.",
        "Concevoir des parcours de formation et de montée en compétences plus personnalisés.",
        "Améliorer la communication RH, l'onboarding et l'accompagnement managérial.",
        "Mettre en place des usages IA conformes aux exigences d'équité, de confidentialité et de traçabilité."
      ],
      [
        "Use AI to pre-screen, analyze, and structure applications with discipline.",
        "Design more personalized learning and upskilling paths.",
        "Improve HR communication, onboarding, and manager support.",
        "Implement AI use cases aligned with fairness, confidentiality, and traceability requirements."
      ]
    ),
    businessOutcomes: list(
      [
        "Réduction du temps de recrutement et meilleure qualité de présélection.",
        "Plans de formation plus ciblés et mieux suivis.",
        "Communication RH plus claire, plus cohérente et plus réactive.",
        "Meilleure préparation de l'organisation aux évolutions des métiers."
      ],
      [
        "Reduced recruitment cycle time and higher-quality screening.",
        "More targeted and better-tracked learning plans.",
        "Clearer, more consistent, and more responsive HR communication.",
        "Better organizational readiness for role transformation."
      ]
    ),
    deliverables: list(
      [
        "Une grille de prompts RH pour recrutement, onboarding et communication.",
        "Un mini-référentiel de cas d'usage IA RH responsables.",
        "Un projet final : parcours de recrutement ou de formation augmenté par l'IA."
      ],
      [
        "An HR prompt library for recruitment, onboarding, and communication.",
        "A mini-reference of responsible HR AI use cases.",
        "A final project: an AI-augmented recruitment or learning pathway."
      ]
    ),
    program: [
      { day: 1, title: text("Jour 1 - Fondamentaux IA pour les RH", "Day 1 - AI fundamentals for HR"), summary: text("Cartographier les usages RH à fort impact, poser les règles de gouvernance, et distinguer ce que l'IA peut accélérer de ce qui doit rester strictement humain.", "Map high-impact HR use cases, define governance rules, and distinguish what AI can accelerate from what must remain strictly human.") },
      { day: 2, title: text("Jour 2 - Recrutement, tri et entretiens", "Day 2 - Recruitment, screening, and interviews"), summary: text("Utiliser l'IA pour structurer les offres, analyser des CV, préparer des entretiens et produire des synthèses utiles aux décideurs RH.", "Use AI to structure job posts, analyze CVs, prepare interviews, and produce useful summaries for HR decision-makers.") },
      { day: 3, title: text("Jour 3 - Formation, onboarding et compétences", "Day 3 - Learning, onboarding, and skills"), summary: text("Créer des parcours d'onboarding, des plans de développement et des supports d'apprentissage plus personnalisés et plus rapides à produire.", "Create onboarding paths, development plans, and learning materials that are more personalized and faster to produce.") },
      { day: 4, title: text("Jour 4 - Communication RH & reporting social", "Day 4 - HR communication & reporting"), summary: text("Structurer des notes RH, messages managériaux, politiques internes et reporting d'indicateurs avec l'appui des copilotes IA.", "Structure HR notes, manager communications, internal policies, and KPI reporting with AI copilots.") },
      { day: 5, title: text("Jour 5 - Cas final RH & certification", "Day 5 - Final HR case & certification"), summary: text("Construire un cas complet RH, produire les livrables et défendre une approche IA responsable applicable dans l'entreprise.", "Build a complete HR case, produce the deliverables, and defend a responsible AI approach that can be implemented in the organization.") },
    ],
  },
  {
    slug: "marketing-communication",
    domainKey: "Marketing & Communication",
    label: text("Marketing & Communication", "Marketing & Communication"),
    shortPitch: text(
      "Accélérer la création de contenu, les campagnes, l'analyse d'audience et la communication de marque avec l'IA.",
      "Accelerate content creation, campaigns, audience analysis, and brand communication with AI."
    ),
    companyPitch: text(
      "Cette spécialisation aide les équipes marketing, communication et growth à produire plus vite, mieux segmenter, mieux tester et mieux piloter leurs messages et campagnes.",
      "This specialization helps marketing, communication, and growth teams produce faster, segment better, test more effectively, and manage messages and campaigns with more precision."
    ),
    targetProfiles: list(
      [
        "Responsables marketing, communication, contenu et brand.",
        "Community managers, traffic managers et équipes growth.",
        "Entreprises qui veulent industrialiser la production et l'analyse marketing."
      ],
      [
        "Marketing, communication, content, and brand leaders.",
        "Community managers, traffic managers, and growth teams.",
        "Organizations that want to industrialize marketing production and analysis."
      ]
    ),
    objectives: list(
      [
        "Utiliser l'IA pour concevoir des contenus et campagnes plus rapidement sans perdre la cohérence de marque.",
        "Mieux segmenter audiences, messages et formats selon les objectifs business.",
        "Exploiter les outils IA pour synthétiser insights, retours clients et tendances.",
        "Mettre en place une méthode marketing augmentée, mesurable et réutilisable."
      ],
      [
        "Use AI to design content and campaigns faster without losing brand consistency.",
        "Segment audiences, messages, and formats more effectively around business goals.",
        "Use AI tools to synthesize insights, customer feedback, and market signals.",
        "Build an augmented marketing method that is measurable and reusable."
      ]
    ),
    businessOutcomes: list(
      [
        "Production multiformat plus rapide pour social, email, web et supports internes.",
        "Campagnes mieux ciblées et mieux analysées.",
        "Meilleure capacité à transformer données et feedbacks en actions marketing.",
        "Renforcement de la cohérence éditoriale et de la vitesse d'exécution."
      ],
      [
        "Faster multi-format production for social, email, web, and internal materials.",
        "Better targeted and better analyzed campaigns.",
        "Stronger ability to turn data and feedback into marketing action.",
        "Greater editorial consistency and execution speed."
      ]
    ),
    deliverables: list(
      [
        "Une boîte à outils de prompts marketing et communication.",
        "Un workflow de production éditoriale et de campagne assisté par IA.",
        "Un projet final : mini-campagne sectorielle avec contenu, message et reporting."
      ],
      [
        "A marketing and communication prompt toolkit.",
        "An AI-assisted editorial and campaign production workflow.",
        "A final project: a sector-specific mini-campaign with content, messaging, and reporting."
      ]
    ),
    program: [
      { day: 1, title: text("Jour 1 - IA, stratégie marketing et cadre éditorial", "Day 1 - AI, marketing strategy, and editorial framework"), summary: text("Poser les bases d'un usage marketing responsable de l'IA, définir la voix de marque, les objectifs, les audiences et les cas d'usage prioritaires.", "Set the foundations for responsible AI use in marketing, define brand voice, objectives, audiences, and priority use cases.") },
      { day: 2, title: text("Jour 2 - Création de contenu multiformat", "Day 2 - Multi-format content creation"), summary: text("Produire avec l'IA des textes, scripts, accroches, plans, e-mails et contenus sociaux alignés sur la marque et adaptés aux canaux.", "Use AI to produce texts, scripts, hooks, outlines, emails, and social content aligned with the brand and tailored to channels.") },
      { day: 3, title: text("Jour 3 - Campagnes, offres et segmentation", "Day 3 - Campaigns, offers, and segmentation"), summary: text("Construire des messages par segment, préparer des campagnes d'acquisition ou de fidélisation et structurer des tests de contenu ou d'offres.", "Build segment-based messaging, prepare acquisition or loyalty campaigns, and structure content or offer tests.") },
      { day: 4, title: text("Jour 4 - Analyse, reporting et optimisation", "Day 4 - Analysis, reporting, and optimization"), summary: text("Transformer des données, retours clients et indicateurs marketing en recommandations claires, tableaux de bord et plans d'ajustement.", "Turn data, customer feedback, and marketing KPIs into clear recommendations, dashboards, and optimization plans.") },
      { day: 5, title: text("Jour 5 - Cas final marketing & évaluation pratique", "Day 5 - Final marketing case & practical assessment"), summary: text("Produire un dispositif marketing complet, du brief au reporting, et valider les acquis à partir des livrables remis.", "Produce a complete marketing setup from brief to reporting and validate learning through the submitted deliverables.") },
    ],
  },
  {
    slug: "finance-accounting",
    domainKey: "Finance & Comptabilité",
    label: text("Finance & Comptabilité", "Finance & Accounting"),
    shortPitch: text(
      "Renforcer l'analyse, le reporting, les contrôles et la préparation des décisions financières avec l'IA.",
      "Strengthen analysis, reporting, controls, and financial decision preparation with AI."
    ),
    companyPitch: text(
      "Cette spécialisation aide les directions financières et comptables à accélérer l'analyse, fiabiliser les synthèses, mieux préparer les clôtures et mieux documenter les décisions.",
      "This specialization helps finance and accounting teams accelerate analysis, improve synthesis quality, prepare closings more effectively, and document decisions more clearly."
    ),
    targetProfiles: list(
      [
        "Comptables, contrôleurs de gestion, responsables financiers et CFO office.",
        "Équipes en charge du reporting, des budgets et du pilotage de performance.",
        "Entreprises qui veulent moderniser leurs fonctions finance sans dégrader le contrôle."
      ],
      [
        "Accountants, controllers, finance managers, and CFO office teams.",
        "Teams responsible for reporting, budgeting, and performance steering.",
        "Organizations that want to modernize finance without weakening controls."
      ]
    ),
    objectives: list(
      [
        "Utiliser l'IA pour accélérer l'analyse de données financières et la préparation des reportings.",
        "Automatiser les premières couches de synthèse, commentaires et supports de pilotage.",
        "Renforcer la qualité des contrôles, justifications et alertes sur les écarts.",
        "Mettre en place une méthode IA adaptée à des environnements sensibles et structurés."
      ],
      [
        "Use AI to accelerate financial data analysis and reporting preparation.",
        "Automate first-level synthesis, commentary, and management materials.",
        "Strengthen controls, justification quality, and variance alerting.",
        "Build an AI method suited to sensitive, highly structured environments."
      ]
    ),
    businessOutcomes: list(
      [
        "Reportings produits plus vite et plus clairement.",
        "Meilleure capacité à expliquer les écarts, risques et tendances.",
        "Préparation plus fluide des budgets, forecasts et clôtures.",
        "Directions financières plus disponibles pour la décision que pour la mise en forme."
      ],
      [
        "Reporting produced faster and with greater clarity.",
        "Better ability to explain variances, risks, and trends.",
        "Smoother preparation of budgets, forecasts, and closings.",
        "Finance leaders freed up for decision-making instead of formatting work."
      ]
    ),
    deliverables: list(
      [
        "Une bibliothèque de prompts pour analyse et reporting financier.",
        "Un modèle de pack de pilotage commenté assisté par IA.",
        "Un projet final : dossier d'analyse financière et note de décision."
      ],
      [
        "A prompt library for financial analysis and reporting.",
        "A template for an AI-assisted management pack with commentary.",
        "A final project: a financial analysis pack and decision memo."
      ]
    ),
    program: [
      { day: 1, title: text("Jour 1 - IA pour finance, contrôle et gouvernance", "Day 1 - AI for finance, control, and governance"), summary: text("Comprendre où l'IA apporte de la vitesse dans les fonctions finance, tout en posant des règles strictes de validation, sécurité et contrôle interne.", "Understand where AI brings speed to finance functions while setting strict rules for validation, security, and internal control.") },
      { day: 2, title: text("Jour 2 - Analyse de données et commentaire de performance", "Day 2 - Data analysis and performance commentary"), summary: text("Utiliser l'IA pour préparer des analyses, structurer des commentaires de gestion et transformer des tableaux en messages décisionnels.", "Use AI to prepare analyses, structure management commentary, and turn tables into decision-ready messages.") },
      { day: 3, title: text("Jour 3 - Budget, forecast et clôture", "Day 3 - Budgeting, forecasting, and closing"), summary: text("Accélérer les travaux de prévision, de justification d'écarts, de préparation de clôture et de consolidation documentaire.", "Accelerate forecasting work, variance explanation, closing preparation, and documentation consolidation.") },
      { day: 4, title: text("Jour 4 - Contrôle, conformité et alertes", "Day 4 - Control, compliance, and alerts"), summary: text("Structurer des contrôles, des check-lists, des notes de risque et des synthèses de conformité à partir d'informations dispersées.", "Structure controls, checklists, risk notes, and compliance summaries from scattered information.") },
      { day: 5, title: text("Jour 5 - Cas final finance & évaluation pratique", "Day 5 - Final finance case & practical assessment"), summary: text("Traiter un cas complet de pilotage financier, produire le pack attendu et valider les acquis sur la qualité des analyses et recommandations.", "Solve a full finance steering case, produce the expected pack, and validate learning through the quality of the analyses and recommendations.") },
    ],
  },
  {
    slug: "legal-compliance",
    domainKey: "Juridique & Conformité",
    label: text("Juridique & Conformité", "Legal & Compliance"),
    shortPitch: text(
      "Accélérer la recherche, la revue documentaire, la conformité et la synthèse juridique sans sacrifier la rigueur.",
      "Accelerate research, document review, compliance, and legal synthesis without sacrificing rigor."
    ),
    companyPitch: text(
      "Cette spécialisation aide les juristes, compliance officers et responsables risques à exploiter l'IA pour préparer, comparer, documenter et surveiller des sujets juridiques sensibles avec méthode.",
      "This specialization helps legal, compliance, and risk teams use AI to prepare, compare, document, and monitor sensitive matters with rigor."
    ),
    targetProfiles: list(
      [
        "Juristes d'entreprise, avocats, responsables conformité et risques.",
        "Équipes en charge des politiques, procédures et contrôles réglementaires.",
        "Organisations qui veulent améliorer la productivité juridique tout en gardant la traçabilité."
      ],
      [
        "In-house counsel, lawyers, compliance officers, and risk leads.",
        "Teams responsible for policies, procedures, and regulatory controls.",
        "Organizations that want better legal productivity while preserving traceability."
      ]
    ),
    objectives: list(
      [
        "Utiliser l'IA pour accélérer la recherche, la synthèse et la première structuration documentaire.",
        "Améliorer la comparaison de clauses, de textes et de risques sans déléguer le jugement juridique.",
        "Produire des notes claires pour la direction, les métiers et les organes de conformité.",
        "Encadrer les usages IA dans un cadre strict de responsabilité, preuve et confidentialité."
      ],
      [
        "Use AI to accelerate research, synthesis, and first-level document structuring.",
        "Improve comparison of clauses, texts, and risks without outsourcing legal judgment.",
        "Produce clear notes for leadership, business teams, and compliance bodies.",
        "Frame AI use inside a strict model of responsibility, evidence, and confidentiality."
      ]
    ),
    businessOutcomes: list(
      [
        "Préparation documentaire plus rapide sur les dossiers récurrents.",
        "Notes et synthèses plus lisibles pour les décideurs non juristes.",
        "Veille réglementaire et conformité mieux structurées.",
        "Temps libéré pour l'analyse stratégique et les arbitrages."
      ],
      [
        "Faster document preparation on recurring matters.",
        "More readable notes and syntheses for non-legal decision-makers.",
        "Better-structured regulatory watch and compliance work.",
        "More time freed for strategic analysis and judgment."
      ]
    ),
    deliverables: list(
      [
        "Une bibliothèque de prompts juridiques et conformité.",
        "Un cadre d'usage responsable de l'IA pour la fonction juridique.",
        "Un projet final : note juridique / conformité complète à partir d'un cas réel."
      ],
      [
        "A legal and compliance prompt library.",
        "A responsible AI usage framework for the legal function.",
        "A final project: a complete legal/compliance memo based on a real case."
      ]
    ),
    program: [
      { day: 1, title: text("Jour 1 - IA, cadre juridique et limites", "Day 1 - AI, legal framework, and limits"), summary: text("Poser les bonnes pratiques d'usage de l'IA dans un environnement juridique et conformité : confidentialité, preuve, biais, validation et responsabilité.", "Establish good practices for AI use in legal and compliance settings: confidentiality, evidence, bias, validation, and responsibility.") },
      { day: 2, title: text("Jour 2 - Recherche, synthèse et revue documentaire", "Day 2 - Research, synthesis, and document review"), summary: text("Accélérer la recherche et la comparaison de textes, préparer des synthèses et structurer des revues de documents ou de clauses.", "Accelerate research and text comparison, prepare syntheses, and structure document or clause reviews.") },
      { day: 3, title: text("Jour 3 - Contrats, politiques et notes de conformité", "Day 3 - Contracts, policies, and compliance notes"), summary: text("Utiliser l'IA pour préparer des trames, check-lists, notes de conformité et documents de cadrage à forte exigence de rigueur.", "Use AI to prepare templates, checklists, compliance notes, and framing documents with high rigor requirements.") },
      { day: 4, title: text("Jour 4 - Veille réglementaire & support à la décision", "Day 4 - Regulatory watch & decision support"), summary: text("Transformer une veille dense en alertes utiles, messages pour les métiers et recommandations présentables à la direction.", "Turn dense regulatory watch into useful alerts, business-facing messages, and leadership-ready recommendations.") },
      { day: 5, title: text("Jour 5 - Cas final juridique & évaluation pratique", "Day 5 - Final legal case & practical assessment"), summary: text("Résoudre un cas complet de conformité ou d'analyse juridique, produire les livrables et valider la méthode de vérification retenue.", "Solve a full compliance or legal-analysis case, produce the deliverables, and validate the verification method used.") },
    ],
  },
  {
    slug: "customer-service",
    domainKey: "Service Client",
    label: text("Service Client", "Customer Service"),
    shortPitch: text(
      "Utiliser l'IA pour mieux répondre, mieux orienter, mieux capitaliser les demandes clients et réduire les délais de traitement.",
      "Use AI to respond better, route better, retain customer knowledge, and reduce handling times."
    ),
    companyPitch: text(
      "Cette spécialisation aide les équipes service client, support et relation usagers à structurer une assistance augmentée, multicanale et plus réactive, sans déshumaniser la relation.",
      "This specialization helps customer service, support, and citizen service teams structure faster, multi-channel, AI-augmented assistance without dehumanizing the relationship."
    ),
    targetProfiles: list(
      [
        "Managers de service client, superviseurs, agents support et relation usagers.",
        "Équipes qui gèrent mails, tickets, WhatsApp, téléphone ou accueil.",
        "Organisations qui veulent améliorer qualité et vitesse de réponse."
      ],
      [
        "Customer service managers, supervisors, support agents, and citizen service teams.",
        "Teams handling email, tickets, WhatsApp, phone, or front-desk support.",
        "Organizations that want better response quality and speed."
      ]
    ),
    objectives: list(
      [
        "Structurer des réponses, scripts et bases de connaissance assistés par l'IA.",
        "Améliorer le tri, la qualification et l'orientation des demandes entrantes.",
        "Mieux exploiter les retours clients pour améliorer la qualité de service.",
        "Installer un cadre d'usage qui garde l'humain au centre sur les cas sensibles."
      ],
      [
        "Structure AI-assisted responses, scripts, and knowledge bases.",
        "Improve triage, qualification, and routing of incoming requests.",
        "Use customer feedback more effectively to improve service quality.",
        "Implement an AI usage model that keeps humans at the center for sensitive cases."
      ]
    ),
    businessOutcomes: list(
      [
        "Réponses plus rapides et plus cohérentes sur plusieurs canaux.",
        "Meilleure capitalisation des questions fréquentes et cas récurrents.",
        "Vision plus claire des irritants clients et des volumes de demandes.",
        "Service plus réactif sans explosion des charges de support."
      ],
      [
        "Faster and more consistent responses across channels.",
        "Better reuse of FAQs and recurring cases.",
        "Clearer visibility into customer pain points and request volumes.",
        "More responsive service without a support-cost explosion."
      ]
    ),
    deliverables: list(
      [
        "Une bibliothèque de réponses assistées et d'arbres de décision.",
        "Un mini-référentiel de prompts service client et support.",
        "Un projet final : parcours de traitement d'une demande complexe."
      ],
      [
        "A library of assisted responses and decision trees.",
        "A mini-reference of customer service and support prompts.",
        "A final project: an end-to-end workflow for handling a complex request."
      ]
    ),
    program: [
      { day: 1, title: text("Jour 1 - IA et expérience de service", "Day 1 - AI and service experience"), summary: text("Identifier les usages à fort ROI pour le service client, cadrer les niveaux d'automatisation et définir les garde-fous relationnels.", "Identify high-ROI customer service use cases, frame automation levels, and define relational guardrails.") },
      { day: 2, title: text("Jour 2 - Réponses, scripts et base de connaissance", "Day 2 - Responses, scripts, and knowledge base"), summary: text("Préparer des réponses assistées, des scripts d'agents et des bases de connaissance mieux structurées pour gagner en cohérence.", "Prepare assisted responses, agent scripts, and better-structured knowledge bases to improve consistency.") },
      { day: 3, title: text("Jour 3 - Triage, qualification et routage", "Day 3 - Triage, qualification, and routing"), summary: text("Utiliser l'IA pour classer les demandes, orienter les cas, résumer les échanges et fluidifier la prise en charge.", "Use AI to classify requests, route cases, summarize interactions, and streamline handling.") },
      { day: 4, title: text("Jour 4 - Voix du client, qualité et pilotage", "Day 4 - Voice of customer, quality, and steering"), summary: text("Transformer réclamations, verbatims et historiques en indicateurs utiles, plans d'action et recommandations opérationnelles.", "Turn complaints, verbatims, and histories into useful indicators, action plans, and operational recommendations.") },
      { day: 5, title: text("Jour 5 - Cas final service client", "Day 5 - Final customer service case"), summary: text("Concevoir un dispositif service client augmenté par l'IA, produire les livrables et soutenir les choix d'organisation retenus.", "Design an AI-augmented customer service setup, produce the deliverables, and defend the organizational choices made.") },
    ],
  },
  {
    slug: "data-analytics",
    domainKey: "Data & Analyse",
    label: text("Data & Analyse", "Data & Analytics"),
    shortPitch: text(
      "Exploiter l'IA pour analyser plus vite, mieux interpréter les données et transformer les chiffres en décisions actionnables.",
      "Use AI to analyze faster, interpret data better, and turn numbers into actionable decisions."
    ),
    companyPitch: text(
      "Cette spécialisation aide les analystes, responsables BI et équipes pilotage à accélérer l'exploration, la préparation, la synthèse et la restitution de données métier.",
      "This specialization helps analysts, BI leads, and steering teams accelerate data exploration, preparation, synthesis, and business reporting."
    ),
    targetProfiles: list(
      [
        "Analystes, responsables BI, reporting et pilotage.",
        "Profils métiers qui manipulent données, tableaux et indicateurs.",
        "Entreprises qui veulent démocratiser une analyse assistée mais rigoureuse."
      ],
      [
        "Analysts, BI leads, and reporting teams.",
        "Business roles working with data, tables, and KPIs.",
        "Organizations that want to democratize assisted yet rigorous analysis."
      ]
    ),
    objectives: list(
      [
        "Utiliser l'IA pour accélérer l'exploration, la préparation et la lecture des données.",
        "Construire des synthèses et visualisations plus claires pour les décideurs.",
        "Mieux détecter tendances, anomalies et signaux faibles dans les données métier.",
        "Créer une méthode d'analyse augmentée, vérifiable et réutilisable."
      ],
      [
        "Use AI to accelerate data exploration, preparation, and interpretation.",
        "Build clearer syntheses and visualizations for decision-makers.",
        "Better detect trends, anomalies, and weak signals in business data.",
        "Create an augmented analytics method that is verifiable and reusable."
      ]
    ),
    businessOutcomes: list(
      [
        "Temps réduit entre la donnée brute et la recommandation utile.",
        "Meilleure qualité des synthèses managériales et tableaux de bord.",
        "Lecture plus rapide des tendances et alertes.",
        "Capacité accrue des équipes non techniques à exploiter les données."
      ],
      [
        "Reduced time between raw data and useful recommendations.",
        "Higher quality management syntheses and dashboards.",
        "Faster reading of trends and alerts.",
        "Greater ability for non-technical teams to use data effectively."
      ]
    ),
    deliverables: list(
      [
        "Une boîte à outils de prompts d'analyse et de restitution.",
        "Un modèle de dashboard commenté et note d'analyse.",
        "Un projet final : diagnostic métier piloté par la donnée."
      ],
      [
        "A toolkit of analytics and reporting prompts.",
        "A dashboard template with commentary and analysis memo.",
        "A final project: a business diagnosis powered by data."
      ]
    ),
    program: [
      { day: 1, title: text("Jour 1 - IA, data literacy et gouvernance", "Day 1 - AI, data literacy, and governance"), summary: text("Comprendre les apports et limites de l'IA en analyse, cadrer la qualité des données et définir une posture de vérification robuste.", "Understand the benefits and limits of AI in analytics, frame data quality, and define a robust verification posture.") },
      { day: 2, title: text("Jour 2 - Préparation, exploration et nettoyage", "Day 2 - Preparation, exploration, and cleanup"), summary: text("Utiliser l'IA pour explorer des fichiers, préparer des structures d'analyse et clarifier des jeux de données imparfaits.", "Use AI to explore files, prepare analysis structures, and clarify imperfect datasets.") },
      { day: 3, title: text("Jour 3 - Analyse, insight et storytelling", "Day 3 - Analysis, insight, and storytelling"), summary: text("Transformer des chiffres et tableaux en messages clés, hypothèses, tendances et supports de restitution compréhensibles.", "Turn tables and metrics into key messages, hypotheses, trends, and clear reporting materials.") },
      { day: 4, title: text("Jour 4 - Tableaux de bord et pilotage", "Day 4 - Dashboards and steering"), summary: text("Construire des restitutions prêtes pour les métiers ou la direction, avec une logique d'alerte, de synthèse et de recommandation.", "Build outputs ready for business teams or leadership with a logic of alerting, synthesis, and recommendation.") },
      { day: 5, title: text("Jour 5 - Cas final data & évaluation pratique", "Day 5 - Final data case & practical assessment"), summary: text("Traiter un cas complet d'analyse métier, produire le tableau de bord et valider les recommandations sur la base des livrables.", "Solve a full business analytics case, produce the dashboard, and validate the recommendations through the deliverables.") },
    ],
  },
  {
    slug: "administration-operations",
    domainKey: "Administration & Gestion",
    label: text("Administration & Gestion", "Administration & Operations"),
    shortPitch: text(
      "Moderniser les processus administratifs, les reportings, les suivis et la coordination opérationnelle avec l'IA.",
      "Modernize administrative processes, reporting, tracking, and operational coordination with AI."
    ),
    companyPitch: text(
      "Cette spécialisation aide les fonctions administration et gestion à mieux organiser, documenter, suivre et standardiser leurs opérations grâce à des outils IA pratiques.",
      "This specialization helps administration and operations teams organize, document, track, and standardize their work through practical AI tools."
    ),
    targetProfiles: list(
      [
        "Responsables administratifs, gestionnaires, coordinateurs et office operations.",
        "Équipes qui pilotent procédures, dossiers, reporting et suivi d'activités.",
        "Structures qui veulent gagner en rigueur, vitesse et traçabilité."
      ],
      [
        "Admin managers, coordinators, operations officers, and office operations teams.",
        "Teams steering procedures, files, reporting, and activity tracking.",
        "Organizations that want more rigor, speed, and traceability."
      ]
    ),
    objectives: list(
      [
        "Utiliser l'IA pour structurer dossiers, procédures, comptes rendus et reportings.",
        "Réduire les tâches répétitives de mise en forme, de consolidation et de suivi.",
        "Mieux coordonner les activités et les relances entre services.",
        "Installer des pratiques administratives augmentées, fiables et réplicables."
      ],
      [
        "Use AI to structure files, procedures, minutes, and reporting.",
        "Reduce repetitive formatting, consolidation, and follow-up work.",
        "Improve coordination and follow-ups across departments.",
        "Install augmented administrative practices that are reliable and repeatable."
      ]
    ),
    businessOutcomes: list(
      [
        "Processus administratifs plus fluides et plus documentés.",
        "Meilleure qualité de reporting et de suivi d'activité.",
        "Réduction du temps perdu sur la consolidation manuelle.",
        "Plus grande continuité de service et meilleure traçabilité."
      ],
      [
        "Smoother, better-documented administrative processes.",
        "Higher-quality reporting and activity tracking.",
        "Less time lost to manual consolidation.",
        "Greater service continuity and stronger traceability."
      ]
    ),
    deliverables: list(
      [
        "Un kit de modèles administratifs assistés par IA.",
        "Une logique de suivi opérationnel et reporting augmentée.",
        "Un projet final : procédure ou dispositif de gestion refondu avec l'IA."
      ],
      [
        "A kit of AI-assisted administrative templates.",
        "An augmented operational tracking and reporting framework.",
        "A final project: a procedure or management workflow redesigned with AI."
      ]
    ),
    program: [
      { day: 1, title: text("Jour 1 - IA pour administration et gestion", "Day 1 - AI for administration and operations"), summary: text("Identifier les tâches administratives à fort potentiel d'amélioration, poser des standards de qualité et définir les limites d'automatisation.", "Identify administrative tasks with the highest improvement potential, set quality standards, and define automation boundaries.") },
      { day: 2, title: text("Jour 2 - Dossiers, procédures et documents", "Day 2 - Files, procedures, and documents"), summary: text("Structurer dossiers, procédures, synthèses et supports administratifs grâce à des copilotes documentaires bien paramétrés.", "Structure files, procedures, syntheses, and admin materials with well-configured document copilots.") },
      { day: 3, title: text("Jour 3 - Suivi, relances et coordination", "Day 3 - Tracking, follow-up, and coordination"), summary: text("Construire des logiques simples de suivi d'actions, relances, préparation de réunions et coordination multi-acteurs.", "Build simple logic for action tracking, follow-ups, meeting prep, and multi-stakeholder coordination.") },
      { day: 4, title: text("Jour 4 - Reporting et aide à la décision", "Day 4 - Reporting and decision support"), summary: text("Transformer les informations opérationnelles en reporting lisible, messages clés et notes utiles à la direction ou aux responsables.", "Turn operational information into readable reporting, key messages, and useful notes for leadership and managers.") },
      { day: 5, title: text("Jour 5 - Cas final administration & gestion", "Day 5 - Final administration case"), summary: text("Refondre un processus administratif réel, produire les modèles attendus et défendre une méthode augmentée applicable sur le terrain.", "Redesign a real administrative process, produce the expected templates, and defend an augmented method that can be applied in practice.") },
    ],
  },
  {
    slug: "management-leadership",
    domainKey: "Management & Leadership",
    label: text("Management & Leadership", "Management & Leadership"),
    shortPitch: text(
      "Aider les managers et dirigeants à décider, piloter, prioriser et transformer leurs équipes avec l'IA.",
      "Help managers and leaders decide, steer, prioritize, and transform their teams with AI."
    ),
    companyPitch: text(
      "Cette spécialisation aide les managers à utiliser l'IA comme copilote de préparation, de pilotage, de communication et de conduite du changement, sans perdre la responsabilité du management.",
      "This specialization helps managers use AI as a copilot for preparation, steering, communication, and change management without surrendering managerial responsibility."
    ),
    targetProfiles: list(
      [
        "Managers, chefs de département, directeurs d'unité et dirigeants.",
        "Profils qui pilotent équipes, objectifs, arbitrages et plans d'action.",
        "Entreprises qui veulent accélérer l'adoption IA avec des managers mieux équipés."
      ],
      [
        "Managers, department heads, unit directors, and executives.",
        "Roles steering teams, objectives, trade-offs, and action plans.",
        "Organizations that want faster AI adoption through better-equipped managers."
      ]
    ),
    objectives: list(
      [
        "Utiliser l'IA pour préparer des décisions, scénarios et arbitrages mieux informés.",
        "Gagner du temps sur la préparation des réunions, plans et points de pilotage.",
        "Mieux structurer la communication managériale et la conduite du changement.",
        "Construire une posture de management augmentée, responsable et orientée résultat."
      ],
      [
        "Use AI to prepare better-informed decisions, scenarios, and trade-offs.",
        "Save time on preparing meetings, plans, and steering rituals.",
        "Structure managerial communication and change management more effectively.",
        "Build an augmented, responsible, results-oriented leadership posture."
      ]
    ),
    businessOutcomes: list(
      [
        "Managers plus rapides dans la préparation et plus clairs dans l'exécution.",
        "Réunions et arbitrages mieux préparés.",
        "Transformation plus structurée des équipes et des priorités.",
        "Leadership plus crédible sur les sujets IA et productivité."
      ],
      [
        "Managers who prepare faster and execute more clearly.",
        "Better-prepared meetings and trade-off decisions.",
        "More structured team and priority transformation.",
        "Stronger leadership credibility on AI and productivity topics."
      ]
    ),
    deliverables: list(
      [
        "Un kit managérial de prompts, templates et notes stratégiques.",
        "Un mini-plan de conduite du changement assisté par l'IA.",
        "Un projet final : feuille de route IA d'équipe ou de département."
      ],
      [
        "A managerial kit of prompts, templates, and strategic notes.",
        "A mini AI-assisted change management plan.",
        "A final project: an AI roadmap for a team or department."
      ]
    ),
    program: [
      { day: 1, title: text("Jour 1 - Leadership, IA et gouvernance", "Day 1 - Leadership, AI, and governance"), summary: text("Comprendre les transformations managériales liées à l'IA, les risques de mauvaise adoption et le rôle du manager dans le cadrage des usages.", "Understand the managerial transformation brought by AI, the risks of poor adoption, and the manager’s role in framing use cases.") },
      { day: 2, title: text("Jour 2 - Décision, scénarios et arbitrage", "Day 2 - Decision-making, scenarios, and trade-offs"), summary: text("Utiliser l'IA pour préparer des options, notes d'arbitrage, synthèses et scénarios de décision plus solides.", "Use AI to prepare options, decision notes, syntheses, and stronger decision scenarios.") },
      { day: 3, title: text("Jour 3 - Pilotage, réunions et performance", "Day 3 - Steering, meetings, and performance"), summary: text("Accélérer la préparation des réunions, plans d'action, suivis de performance et revues d'activité avec des copilotes utiles.", "Accelerate the preparation of meetings, action plans, performance follow-up, and business reviews with useful copilots.") },
      { day: 4, title: text("Jour 4 - Communication & conduite du changement", "Day 4 - Communication & change management"), summary: text("Structurer messages managériaux, feuilles de route, plans de transformation et supports d'adhésion autour des usages IA.", "Structure managerial messages, roadmaps, transformation plans, and engagement materials around AI use.") },
      { day: 5, title: text("Jour 5 - Cas final leadership & évaluation pratique", "Day 5 - Final leadership case & practical assessment"), summary: text("Construire une feuille de route IA appliquée à une équipe ou un département, avec impacts, priorités, risques et plan d'adoption.", "Build an AI roadmap for a team or department with impacts, priorities, risks, and an adoption plan.") },
    ],
  },
  {
    slug: "it-digital-transformation",
    domainKey: "IT & Transformation Digitale",
    label: text("IT & Transformation Digitale", "IT & Digital Transformation"),
    shortPitch: text(
      "Structurer l'usage de l'IA dans les systèmes, le support, la documentation, l'automatisation et les projets de transformation.",
      "Structure AI across systems, support, documentation, automation, and transformation projects."
    ),
    companyPitch: text(
      "Cette spécialisation aide les équipes IT et transformation à cadrer des cas d'usage IA réalistes, sécurisés et maintenables, depuis les copilotes internes jusqu'aux workflows métier.",
      "This specialization helps IT and transformation teams frame realistic, secure, and maintainable AI use cases, from internal copilots to business workflows."
    ),
    targetProfiles: list(
      [
        "Responsables IT, chefs de projet digital, support, PMO et transformation.",
        "Profils qui documentent, intègrent ou supervisent des outils et workflows.",
        "Organisations qui veulent passer de l'exploration IA à un déploiement utile."
      ],
      [
        "IT leads, digital project managers, support teams, PMOs, and transformation teams.",
        "Roles documenting, integrating, or supervising tools and workflows.",
        "Organizations that want to move from AI exploration to useful deployment."
      ]
    ),
    objectives: list(
      [
        "Cadrer des cas d'usage IA alignés avec les priorités métiers et les contraintes IT.",
        "Utiliser l'IA pour améliorer support, documentation, assistance interne et automatisation.",
        "Renforcer la gouvernance, la sécurité et la qualité des déploiements IA.",
        "Construire une feuille de route pragmatique de transformation augmentée."
      ],
      [
        "Frame AI use cases aligned with business priorities and IT constraints.",
        "Use AI to improve support, documentation, internal assistance, and automation.",
        "Strengthen governance, security, and quality around AI deployments.",
        "Build a pragmatic roadmap for augmented transformation."
      ]
    ),
    businessOutcomes: list(
      [
        "Moins de dispersion dans les expérimentations IA.",
        "Documentation et support interne mieux structurés.",
        "Cas d'usage mieux priorisés et plus faciles à déployer.",
        "Transformation digitale mieux reliée aux usages réels."
      ],
      [
        "Less fragmentation in AI experimentation.",
        "Better structured documentation and internal support.",
        "Use cases that are better prioritized and easier to deploy.",
        "Digital transformation more tightly connected to real business needs."
      ]
    ),
    deliverables: list(
      [
        "Un référentiel de cas d'usage IA IT / transformation.",
        "Un cadre de gouvernance et de priorisation des projets IA.",
        "Un projet final : blueprint de copilote ou workflow assisté par IA."
      ],
      [
        "A reference set of AI use cases for IT and transformation.",
        "A governance and prioritization framework for AI projects.",
        "A final project: a blueprint for an AI copilot or assisted workflow."
      ]
    ),
    program: [
      { day: 1, title: text("Jour 1 - IA, architecture d'usage et gouvernance", "Day 1 - AI, usage architecture, and governance"), summary: text("Identifier les familles de cas d'usage, cadrer sécurité, confidentialité et priorité métier, et clarifier où l'IA crée réellement de la valeur.", "Identify major AI use-case families, frame security, confidentiality, and business priority, and clarify where AI truly creates value.") },
      { day: 2, title: text("Jour 2 - Documentation, support et copilotes internes", "Day 2 - Documentation, support, and internal copilots"), summary: text("Structurer des assistants pour la documentation, le support de premier niveau, le knowledge management et la préparation des livrables IT.", "Structure assistants for documentation, first-level support, knowledge management, and IT deliverable preparation.") },
      { day: 3, title: text("Jour 3 - Automatisation de workflows et processus", "Day 3 - Workflow and process automation"), summary: text("Concevoir des enchaînements simples entre IA, formulaires, documents et validation humaine pour accélérer des processus utiles.", "Design simple flows between AI, forms, documents, and human validation to accelerate useful processes.") },
      { day: 4, title: text("Jour 4 - Pilotage du changement et adoption", "Day 4 - Change steering and adoption"), summary: text("Préparer la documentation de déploiement, les notes de gouvernance, les messages d'adoption et les plans d'accompagnement des équipes.", "Prepare deployment documentation, governance notes, adoption messaging, and support plans for teams.") },
      { day: 5, title: text("Jour 5 - Cas final IT & transformation", "Day 5 - Final IT & transformation case"), summary: text("Présenter un cas d'usage priorisé, sa logique de déploiement, les garde-fous associés et les livrables attendus pour l'organisation.", "Present a prioritized use case, its deployment logic, the related safeguards, and the expected deliverables for the organization.") },
    ],
  },
  {
    slug: "learning-pedagogy",
    domainKey: "Formation & Pédagogie",
    label: text("Formation & Pédagogie", "Learning & Education"),
    shortPitch: text(
      "Concevoir plus vite des contenus pédagogiques, évaluations et parcours d'apprentissage contextualisés grâce à l'IA.",
      "Design contextualized learning content, assessments, and learning paths faster with AI."
    ),
    companyPitch: text(
      "Cette spécialisation aide les formateurs, responsables pédagogiques et institutions à utiliser l'IA pour produire, adapter et suivre des dispositifs d'apprentissage plus efficaces.",
      "This specialization helps trainers, learning leads, and institutions use AI to produce, adapt, and monitor more effective learning experiences."
    ),
    targetProfiles: list(
      [
        "Formateurs, responsables pédagogiques, instructional designers et coaches.",
        "Institutions, centres de formation et équipes L&D.",
        "Organisations qui veulent produire des parcours plus personnalisés et plus rapides."
      ],
      [
        "Trainers, pedagogy leads, instructional designers, and coaches.",
        "Institutions, training centers, and L&D teams.",
        "Organizations that want faster, more personalized learning paths."
      ]
    ),
    objectives: list(
      [
        "Utiliser l'IA pour concevoir contenus, exercices, cas et évaluations plus vite.",
        "Personnaliser davantage les parcours selon le niveau et les besoins des apprenants.",
        "Améliorer le suivi, le feedback et la restitution pédagogique.",
        "Construire une pédagogie assistée par l'IA mais centrée sur l'apprenant."
      ],
      [
        "Use AI to design content, exercises, cases, and assessments faster.",
        "Personalize learning paths more effectively around learner level and needs.",
        "Improve monitoring, feedback, and pedagogical reporting.",
        "Build an AI-assisted pedagogy that remains learner-centered."
      ]
    ),
    businessOutcomes: list(
      [
        "Temps réduit de production pédagogique.",
        "Contenus plus contextualisés aux réalités métiers.",
        "Meilleure qualité d'évaluation et de feedback.",
        "Montée en compétences plus visible et plus mesurable."
      ],
      [
        "Reduced pedagogical production time.",
        "Content more contextualized to real job situations.",
        "Better quality assessment and feedback.",
        "More visible and measurable upskilling."
      ]
    ),
    deliverables: list(
      [
        "Un kit de prompts pédagogiques et canevas d'évaluation.",
        "Un mini-référentiel de design pédagogique assisté par IA.",
        "Un projet final : module ou séquence de formation complète."
      ],
      [
        "A pedagogical prompt kit and assessment templates.",
        "A mini-reference for AI-assisted learning design.",
        "A final project: a complete training module or learning sequence."
      ]
    ),
    program: [
      { day: 1, title: text("Jour 1 - IA et ingénierie pédagogique", "Day 1 - AI and instructional design"), summary: text("Comprendre comment l'IA transforme la conception pédagogique, cadrer les bons usages et protéger la qualité des apprentissages.", "Understand how AI transforms learning design, frame the right use cases, and protect learning quality.") },
      { day: 2, title: text("Jour 2 - Contenus, exercices et évaluations", "Day 2 - Content, exercises, and assessments"), summary: text("Produire des séquences, cas, quiz, études et évaluations alignés sur des objectifs pédagogiques clairs.", "Produce sequences, cases, quizzes, studies, and assessments aligned with clear learning objectives.") },
      { day: 3, title: text("Jour 3 - Personnalisation et accompagnement", "Day 3 - Personalization and learner support"), summary: text("Adapter contenus et accompagnement à différents profils d'apprenants et mieux préparer les feedbacks et remédiations.", "Adapt content and support to different learner profiles and improve feedback and remediation planning.") },
      { day: 4, title: text("Jour 4 - Suivi, reporting et amélioration continue", "Day 4 - Tracking, reporting, and continuous improvement"), summary: text("Exploiter les données et retours d'apprentissage pour améliorer les parcours, les évaluations et la progression des apprenants.", "Use learning data and feedback to improve paths, assessments, and learner progression.") },
      { day: 5, title: text("Jour 5 - Cas final formation & certification", "Day 5 - Final learning case & certification"), summary: text("Concevoir et défendre un module complet assisté par l'IA, prêt à être utilisé dans un contexte réel de formation.", "Design and defend a full AI-assisted module ready to be used in a real training context.") },
    ],
  },
  {
    slug: "health-wellbeing",
    domainKey: "Santé & Bien-être",
    label: text("Santé & Bien-être", "Health & Wellbeing"),
    shortPitch: text(
      "Utiliser l'IA pour mieux organiser, documenter, informer et piloter des activités santé ou bien-être sans sortir du cadre éthique.",
      "Use AI to organize, document, inform, and steer health or wellbeing activities while staying inside an ethical framework."
    ),
    companyPitch: text(
      "Cette spécialisation s'adresse aux fonctions santé, prévention, qualité ou coordination qui veulent gagner en efficacité documentaire, en reporting et en suivi d'activité sans déléguer le jugement clinique à l'IA.",
      "This specialization is designed for health, prevention, quality, and coordination functions that want more efficiency in documentation, reporting, and activity tracking without delegating clinical judgment to AI."
    ),
    targetProfiles: list(
      [
        "Responsables santé, prévention, qualité, coordination ou bien-être.",
        "Professionnels de structures de santé, mutuelles, ONG ou entreprises.",
        "Organisations qui veulent encadrer des usages IA non cliniques mais utiles."
      ],
      [
        "Health, prevention, quality, coordination, or wellbeing leads.",
        "Professionals in care organizations, mutuals, NGOs, or companies.",
        "Organizations that want to frame useful non-clinical AI uses."
      ]
    ),
    objectives: list(
      [
        "Utiliser l'IA pour améliorer la documentation, la synthèse et la communication santé.",
        "Mieux préparer les reportings, plans de prévention et supports d'information.",
        "Accélérer le traitement de données ou retours terrain non cliniques.",
        "Déployer une méthode d'usage éthique, prudente et contrôlée dans un secteur sensible."
      ],
      [
        "Use AI to improve health documentation, synthesis, and communication.",
        "Prepare reporting, prevention plans, and information materials more effectively.",
        "Accelerate treatment of non-clinical data and field feedback.",
        "Deploy an ethical, cautious, and controlled AI method in a sensitive sector."
      ]
    ),
    businessOutcomes: list(
      [
        "Meilleure qualité documentaire et plus grande réactivité d'équipe.",
        "Plans de prévention et messages santé plus clairs.",
        "Temps réduit sur les synthèses et reportings opérationnels.",
        "Meilleur cadrage des usages IA dans un environnement sensible."
      ],
      [
        "Better documentation quality and stronger team responsiveness.",
        "Clearer prevention plans and health messaging.",
        "Less time spent on syntheses and operational reporting.",
        "Better framing of AI use in a sensitive environment."
      ]
    ),
    deliverables: list(
      [
        "Un référentiel d'usages IA autorisés, sensibles et interdits.",
        "Un kit de supports santé / prévention assistés par IA.",
        "Un projet final : workflow documentaire ou reporting santé."
      ],
      [
        "A reference of allowed, sensitive, and prohibited AI uses.",
        "A kit of AI-assisted health and prevention materials.",
        "A final project: a health documentation or reporting workflow."
      ]
    ),
    program: [
      { day: 1, title: text("Jour 1 - IA, santé et cadre éthique", "Day 1 - AI, health, and ethical framing"), summary: text("Définir les usages légitimes de l'IA dans la santé et le bien-être, distinguer appui opérationnel et décision clinique, et poser les limites indispensables.", "Define legitimate AI uses in health and wellbeing, distinguish operational support from clinical decision-making, and set essential limits.") },
      { day: 2, title: text("Jour 2 - Documentation, synthèse et information", "Day 2 - Documentation, synthesis, and information"), summary: text("Améliorer la qualité des comptes rendus, notes, supports patients/usagers et documents de coordination grâce à l'IA.", "Improve the quality of reports, notes, patient/user materials, and coordination documents through AI.") },
      { day: 3, title: text("Jour 3 - Prévention, qualité et suivi d'activité", "Day 3 - Prevention, quality, and activity tracking"), summary: text("Utiliser l'IA pour structurer plans de prévention, indicateurs, historiques d'activité et tableaux de suivi non cliniques.", "Use AI to structure prevention plans, indicators, activity histories, and non-clinical tracking dashboards.") },
      { day: 4, title: text("Jour 4 - Communication sensible et reporting", "Day 4 - Sensitive communication and reporting"), summary: text("Produire des messages de sensibilisation, synthèses qualité et reportings santé adaptés à différents publics et niveaux hiérarchiques.", "Produce awareness messages, quality syntheses, and health reporting tailored to different audiences and management levels.") },
      { day: 5, title: text("Jour 5 - Cas final santé & évaluation pratique", "Day 5 - Final health case & practical assessment"), summary: text("Construire un dispositif documentaire ou opérationnel assisté par l'IA, avec validation des garde-fous, bénéfices et limites de l'approche.", "Build an AI-assisted operational or documentation setup, validating safeguards, benefits, and limits of the approach.") },
    ],
  },
  {
    slug: "diplomacy-international-affairs",
    domainKey: "Diplomatie & Affaires Internationales",
    label: text("Diplomatie & Affaires Internationales", "Diplomacy & International Affairs"),
    shortPitch: text(
      "Utiliser l'IA pour la veille, les notes diplomatiques, les briefings, l'analyse pays et la communication internationale.",
      "Use AI for strategic watch, diplomatic notes, briefings, country analysis, and international communication."
    ),
    companyPitch: text(
      "Cette spécialisation aide les professionnels des affaires internationales à mieux préparer analyses, notes, dossiers, synthèses multilingues et éléments de décision dans des environnements complexes.",
      "This specialization helps international affairs professionals better prepare analyses, notes, dossiers, multilingual syntheses, and decision materials in complex environments."
    ),
    targetProfiles: list(
      [
        "Diplomates, chargés d'affaires internationales, cabinets et institutions.",
        "Profils en charge de la veille, du protocole, des notes et des relations extérieures.",
        "Organisations qui ont besoin de synthèses rapides et fiables sur des enjeux internationaux."
      ],
      [
        "Diplomats, international affairs officers, cabinets, and institutions.",
        "Roles in charge of watch, protocol, briefs, and external relations.",
        "Organizations needing fast, reliable syntheses on international topics."
      ]
    ),
    objectives: list(
      [
        "Utiliser l'IA pour préparer des notes, briefings et synthèses plus vite et plus clairement.",
        "Structurer une veille internationale continue et exploitable par les décideurs.",
        "Améliorer la préparation de réunions, missions et éléments de langage multilingues.",
        "Installer une méthode de travail rigoureuse face à des sujets sensibles et complexes."
      ],
      [
        "Use AI to prepare notes, briefings, and syntheses faster and more clearly.",
        "Structure continuous international watch that decision-makers can actually use.",
        "Improve preparation for meetings, missions, and multilingual talking points.",
        "Install a rigorous work method for sensitive, complex topics."
      ]
    ),
    businessOutcomes: list(
      [
        "Notes plus rapides à produire pour les décideurs et les missions.",
        "Veille géopolitique et sectorielle mieux organisée.",
        "Capacité renforcée à travailler en environnement multilingue.",
        "Meilleure préparation des messages, positions et éléments de contexte."
      ],
      [
        "Faster note production for leaders and missions.",
        "Better organized geopolitical and sector watch.",
        "Stronger ability to operate in multilingual environments.",
        "Better preparation of messages, positions, and contextual elements."
      ]
    ),
    deliverables: list(
      [
        "Un kit de prompts pour notes diplomatiques et veille internationale.",
        "Un modèle de briefing et de synthèse pays / secteur.",
        "Un projet final : dossier diplomatique ou international complet."
      ],
      [
        "A prompt kit for diplomatic notes and international watch.",
        "A template for country or sector briefings and syntheses.",
        "A final project: a complete diplomatic or international affairs dossier."
      ]
    ),
    program: [
      { day: 1, title: text("Jour 1 - IA et pratiques diplomatiques", "Day 1 - AI and diplomatic practice"), summary: text("Comprendre comment l'IA peut accélérer recherche, synthèse, préparation de notes et veille dans un cadre exigeant de rigueur et de discrétion.", "Understand how AI can accelerate research, synthesis, note preparation, and strategic watch under strict expectations of rigor and discretion.") },
      { day: 2, title: text("Jour 2 - Notes, briefings et synthèses", "Day 2 - Notes, briefings, and syntheses"), summary: text("Préparer des notes de contexte, éléments de langage, synthèses de dossiers et supports de réunion mieux structurés.", "Prepare context notes, talking points, dossier syntheses, and better-structured meeting materials.") },
      { day: 3, title: text("Jour 3 - Veille internationale et analyse pays", "Day 3 - International watch and country analysis"), summary: text("Organiser une veille fiable, trier les signaux, synthétiser des documents externes et produire des analyses pays ou sectorielles utiles.", "Organize reliable watch, sort signals, synthesize external documents, and produce useful country or sector analyses.") },
      { day: 4, title: text("Jour 4 - Communication multilingue et protocoles", "Day 4 - Multilingual communication and protocol"), summary: text("Utiliser l'IA pour préparer messages, supports, résumés et variantes linguistiques adaptés à des interlocuteurs internationaux.", "Use AI to prepare messages, materials, summaries, and language variants tailored to international stakeholders.") },
      { day: 5, title: text("Jour 5 - Cas final diplomatie & évaluation pratique", "Day 5 - Final diplomacy case & practical assessment"), summary: text("Construire un dossier complet de veille, note et recommandation, puis valider la méthode employée à partir des livrables produits.", "Build a complete dossier combining watch, notes, and recommendations, then validate the method used through the deliverables produced.") },
    ],
  },
];

export const certificationDomainSlugs = certificationDomainProfiles.map((profile) => profile.slug);

export const getCertificationDomainProfile = (slug?: string | null) =>
  certificationDomainProfiles.find((profile) => profile.slug === slug) ?? certificationDomainProfiles[0];
