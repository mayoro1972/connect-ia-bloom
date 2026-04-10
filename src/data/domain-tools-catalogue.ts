export type LocalizedText = {
  fr: string;
  en: string;
};

export type ToolCategory = "copilot" | "workflow" | "low-code" | "no-code" | "research" | "builder";
export type ToolLevel = "essential" | "operational" | "advanced";

export type ToolDefinition = {
  id: string;
  name: string;
  vendor: string;
  officialUrl: string;
  category: ToolCategory;
  level: ToolLevel;
  positioning: LocalizedText;
};

export type TrainingFormatDefinition = {
  title: LocalizedText;
  duration: LocalizedText;
  audience: LocalizedText;
  promise: LocalizedText;
};

export type DomainToolPlan = {
  slug: string;
  domainKey: string;
  label: LocalizedText;
  trendLabel: LocalizedText;
  summary: LocalizedText;
  sectorPitch: LocalizedText;
  topUseCases: LocalizedText[];
  recommendedToolIds: string[];
  trainingFormats: TrainingFormatDefinition[];
  catalogueHighlights: LocalizedText[];
};

const text = (fr: string, en?: string): LocalizedText => ({ fr, en: en ?? fr });

export const toolCategoryLabels: Record<ToolCategory, LocalizedText> = {
  copilot: text("Copilote", "Copilot"),
  workflow: text("Workflow", "Workflow"),
  "low-code": text("Low-code", "Low-code"),
  "no-code": text("No-code", "No-code"),
  research: text("Recherche", "Research"),
  builder: text("Builder", "Builder"),
};

export const toolLevelLabels: Record<ToolLevel, LocalizedText> = {
  essential: text("Essentiel", "Essential"),
  operational: text("Opérationnel", "Operational"),
  advanced: text("Avancé", "Advanced"),
};

export const aiToolMethodology = {
  title: text("Cadre de sélection des outils", "Tool selection framework"),
  description: text(
    "La sélection TransferAI Africa privilégie les outils réellement utilisés en entreprise pour produire, chercher, automatiser, documenter et déployer des workflows. Elle s'appuie sur les signaux les plus visibles du marché francophone de la formation IA et sur les capacités publiquement mises en avant par OpenAI, Anthropic Claude, Google Gemini, Microsoft Copilot et les leaders no-code/workflow.",
    "TransferAI Africa prioritizes tools that are actually used in organizations to produce, search, automate, document, and deploy workflows. The selection is informed by the strongest signals in the francophone AI training market and the capabilities publicly highlighted by OpenAI, Anthropic Claude, Google Gemini, Microsoft Copilot, and leading no-code/workflow platforms."
  ),
  evidence: [
    {
      label: "OpenAI Business",
      url: "https://openai.com/business/",
    },
    {
      label: "ChatGPT Business Help Center",
      url: "https://help.openai.com/en/articles/8792828-what-is-chatgpt-business",
    },
    {
      label: "Anthropic Claude for Enterprise",
      url: "https://www.anthropic.com/enterprise",
    },
    {
      label: "Google Workspace with Gemini",
      url: "https://workspace.google.com/intl/en_gb_all/solutions/ai/",
    },
    {
      label: "Gemini for Google Workspace",
      url: "https://workspace.google.com/blog/product-announcements/gemini-for-google-workspace",
    },
    {
      label: "Microsoft 365 Copilot",
      url: "https://www.microsoft.com/en-us/microsoft-365/copilot/copilot-for-work",
    },
    {
      label: "n8n",
      url: "https://n8n.io/",
    },
    {
      label: "Make AI Agents",
      url: "https://www.make.com/en/ai-agents",
    },
    {
      label: "Zapier AI",
      url: "https://zapier.com/ai",
    },
    {
      label: "Notion AI",
      url: "https://www.notion.com/product/ai",
    },
    {
      label: "Airtable",
      url: "https://www.airtable.com/",
    },
    {
      label: "Bubble AI",
      url: "https://bubble.io/ai",
    },
    {
      label: "Glide AI",
      url: "https://www.glideapps.com/ai",
    },
    {
      label: "IApreneur Academy",
      url: "https://www.iapreneurs.com/",
    },
    {
      label: "Elliott Pierret",
      url: "https://elliottpierret.com/",
    },
    {
      label: "Aurélien Fagioli",
      url: "https://aurelienfagioli.podia.com/",
    },
  ],
};

export const aiTools: ToolDefinition[] = [
  {
    id: "chatgpt",
    name: "ChatGPT Business",
    vendor: "OpenAI",
    officialUrl: "https://help.openai.com/en/articles/8792828-what-is-chatgpt-business",
    category: "copilot",
    level: "essential",
    positioning: text("Copilote de rédaction, synthèse, analyse et préparation métier.", "Copilot for drafting, synthesis, analysis, and business preparation."),
  },
  {
    id: "claude",
    name: "Claude for Enterprise",
    vendor: "Anthropic",
    officialUrl: "https://www.anthropic.com/enterprise",
    category: "copilot",
    level: "essential",
    positioning: text("Excellent pour documents longs, politiques internes, recherche et raisonnement structuré.", "Excellent for long documents, internal policies, research, and structured reasoning."),
  },
  {
    id: "gemini",
    name: "Gemini for Google Workspace",
    vendor: "Google",
    officialUrl: "https://workspace.google.com/intl/en_gb_all/solutions/ai/",
    category: "copilot",
    level: "essential",
    positioning: text("Copilote intégré à Gmail, Docs, Sheets, Meet et NotebookLM.", "Copilot embedded in Gmail, Docs, Sheets, Meet, and NotebookLM."),
  },
  {
    id: "copilot",
    name: "Microsoft 365 Copilot",
    vendor: "Microsoft",
    officialUrl: "https://www.microsoft.com/en-us/microsoft-365/copilot/copilot-for-work",
    category: "copilot",
    level: "essential",
    positioning: text("Référence entreprise pour Word, Excel, Outlook, Teams et Copilot Studio.", "Enterprise reference for Word, Excel, Outlook, Teams, and Copilot Studio."),
  },
  {
    id: "perplexity",
    name: "Perplexity",
    vendor: "Perplexity",
    officialUrl: "https://www.perplexity.ai/",
    category: "research",
    level: "essential",
    positioning: text("Recherche rapide, veille, exploration de sources et cadrage de sujets.", "Fast research, source exploration, and subject framing."),
  },
  {
    id: "notebooklm",
    name: "NotebookLM",
    vendor: "Google",
    officialUrl: "https://notebooklm.google/",
    category: "research",
    level: "operational",
    positioning: text("Synthèse de corpus documentaires, notes audio et dossiers métier.", "Synthesis of document sets, audio notes, and business dossiers."),
  },
  {
    id: "n8n",
    name: "n8n",
    vendor: "n8n",
    officialUrl: "https://n8n.io/",
    category: "workflow",
    level: "advanced",
    positioning: text("Outil de référence pour workflows IA, agents, intégrations et human-in-the-loop.", "Reference tool for AI workflows, agents, integrations, and human-in-the-loop."),
  },
  {
    id: "make",
    name: "Make",
    vendor: "Make",
    officialUrl: "https://www.make.com/en/ai-agents",
    category: "workflow",
    level: "operational",
    positioning: text("Très bon pour scénarios visuels, automatisations et agents sans code lourd.", "Strong for visual scenarios, automations, and agents without heavy code."),
  },
  {
    id: "zapier",
    name: "Zapier",
    vendor: "Zapier",
    officialUrl: "https://zapier.com/ai",
    category: "workflow",
    level: "operational",
    positioning: text("Très accessible pour connecter rapidement les outils SaaS du quotidien.", "Highly accessible for quickly connecting day-to-day SaaS tools."),
  },
  {
    id: "power-automate",
    name: "Power Automate",
    vendor: "Microsoft",
    officialUrl: "https://www.microsoft.com/en-us/power-platform/products/power-automate",
    category: "workflow",
    level: "operational",
    positioning: text("Workflow entreprise pertinent pour les environnements Microsoft déjà en place.", "A strong enterprise workflow option for Microsoft-first environments."),
  },
  {
    id: "airtable",
    name: "Airtable",
    vendor: "Airtable",
    officialUrl: "https://www.airtable.com/",
    category: "low-code",
    level: "operational",
    positioning: text("Base métier pour CRM, opérations, contenus, suivi et mini-apps internes.", "Business data layer for CRM, operations, content, tracking, and internal mini-apps."),
  },
  {
    id: "notion",
    name: "Notion AI",
    vendor: "Notion",
    officialUrl: "https://www.notion.com/product/ai",
    category: "no-code",
    level: "operational",
    positioning: text("Knowledge base, documentation, wiki interne et travail collaboratif augmenté.", "Knowledge base, internal wiki, documentation, and augmented collaboration."),
  },
  {
    id: "softr",
    name: "Softr",
    vendor: "Softr",
    officialUrl: "https://www.softr.io/",
    category: "no-code",
    level: "operational",
    positioning: text("Portails internes, extranets, CRM légers et apps métier connectées aux données.", "Internal portals, extranets, lightweight CRMs, and business apps connected to data."),
  },
  {
    id: "bubble",
    name: "Bubble AI",
    vendor: "Bubble",
    officialUrl: "https://bubble.io/ai",
    category: "builder",
    level: "advanced",
    positioning: text("Construction d'applications IA plus avancées sans repartir d'un code complet.", "Build more advanced AI applications without starting from a full codebase."),
  },
  {
    id: "glide",
    name: "Glide AI",
    vendor: "Glide",
    officialUrl: "https://www.glideapps.com/ai",
    category: "no-code",
    level: "operational",
    positioning: text("Apps internes simples, mobiles et rapides à déployer pour les équipes métier.", "Simple internal apps, mobile-first and fast to deploy for business teams."),
  },
];

const formats = {
  discovery: (focusFr: string, focusEn: string): TrainingFormatDefinition => ({
    title: text("Découverte métier IA", "AI discovery workshop"),
    duration: text("1 jour", "1 day"),
    audience: text("Managers, responsables métier, fonctions support", "Managers, business leads, support teams"),
    promise: text(focusFr, focusEn),
  }),
  bootcamp: (focusFr: string, focusEn: string): TrainingFormatDefinition => ({
    title: text("Bootcamp opérationnel", "Operational bootcamp"),
    duration: text("2 jours", "2 days"),
    audience: text("Équipes métier, équipes projet, relais opérationnels", "Business teams, project teams, operational champions"),
    promise: text(focusFr, focusEn),
  }),
  certification: (focusFr: string, focusEn: string): TrainingFormatDefinition => ({
    title: text("Certification sectorielle", "Sector certification"),
    duration: text("5 jours", "5 days"),
    audience: text("Profils à forte exposition métier, champions IA, équipes clés", "High-exposure business roles, AI champions, key teams"),
    promise: text(focusFr, focusEn),
  }),
};

export const domainToolPlans: DomainToolPlan[] = [
  {
    slug: "assistanat-secretariat",
    domainKey: "Assistanat & Secrétariat",
    label: text("Assistanat & Secrétariat", "Executive Support & Administration"),
    trendLabel: text("Très forte demande sur productivité et documentation", "Strong demand on productivity and documentation"),
    summary: text("Stack idéale pour assistants de direction, office managers et fonctions support qui produisent, résument, coordonnent et relancent.", "Ideal stack for executive assistants, office managers, and support roles that produce, summarize, coordinate, and follow up."),
    sectorPitch: text("L'objectif n'est pas de remplacer l'assistanat, mais d'en augmenter la vitesse, la fiabilité et la valeur perçue.", "The goal is not to replace executive support, but to increase its speed, reliability, and perceived value."),
    topUseCases: [
      text("Préparation d'e-mails, notes, comptes rendus et dossiers de réunion."),
      text("Organisation d'agendas, relances et coordination multi-acteurs."),
      text("Création de modèles de documents et de workflows administratifs légers."),
    ],
    recommendedToolIds: ["chatgpt", "claude", "gemini", "notion", "n8n"],
    trainingFormats: [
      formats.discovery("Découvrir les copilotes réellement utiles au support exécutif.", "Discover the copilots that truly improve executive support."),
      formats.bootcamp("Mettre en place des workflows concrets pour réunions, notes et suivi.", "Build concrete workflows for meetings, notes, and follow-up."),
      formats.certification("Structurer une pratique IA complète et transférable dans l'assistanat.", "Build a complete, transferable AI practice for executive support."),
    ],
    catalogueHighlights: [
      text("Copilotes de rédaction et de synthèse."),
      text("Workflows de réunion et de coordination."),
      text("Knowledge base et modèles de documents."),
    ],
  },
  {
    slug: "ressources-humaines",
    domainKey: "Ressources Humaines",
    label: text("Ressources Humaines", "Human Resources"),
    trendLabel: text("Demande forte : recrutement, formation, people ops", "Strong demand: recruiting, learning, people ops"),
    summary: text("Stack orientée recrutement, montée en compétences, communication RH et pilotage de la fonction people.", "Stack focused on recruitment, upskilling, HR communication, and people operations."),
    sectorPitch: text("Les RH adoptent l'IA quand elle aide à mieux recruter, mieux former et mieux communiquer sans dégrader l'équité.", "HR adopts AI when it helps recruit better, train better, and communicate better without harming fairness."),
    topUseCases: [
      text("Rédaction d'offres, grilles d'entretien, synthèses de candidature."),
      text("Onboarding, contenus de formation et documentation RH."),
      text("Automatisation de tâches people ops et reporting social."),
    ],
    recommendedToolIds: ["chatgpt", "claude", "copilot", "notion", "airtable", "make"],
    trainingFormats: [
      formats.discovery("Identifier les cas RH les plus utiles et les garde-fous nécessaires.", "Identify the most useful HR use cases and the required guardrails."),
      formats.bootcamp("Outiller recrutement, onboarding et communication RH avec des workflows simples.", "Equip recruitment, onboarding, and HR communication with simple workflows."),
      formats.certification("Construire une pratique RH augmentée, responsable et démontrable.", "Build a responsible, demonstrable augmented HR practice."),
    ],
    catalogueHighlights: [
      text("Recrutement augmenté."),
      text("Formation et onboarding IA."),
      text("People ops et reporting RH."),
    ],
  },
  {
    slug: "marketing-communication",
    domainKey: "Marketing & Communication",
    label: text("Marketing & Communication", "Marketing & Communication"),
    trendLabel: text("Très forte traction : contenu, campagnes, growth", "Very strong traction: content, campaigns, growth"),
    summary: text("Stack centrée sur la création de contenu, la segmentation, l'automatisation marketing et la performance de campagne.", "Stack centered on content creation, segmentation, marketing automation, and campaign performance."),
    sectorPitch: text("Le marketing adopte rapidement les copilotes et workflows dès qu'ils augmentent la cadence de production et la qualité de ciblage.", "Marketing adopts copilots and workflows quickly as soon as they increase content velocity and targeting quality."),
    topUseCases: [
      text("Création de contenus multiformats et messages de campagne."),
      text("Veille concurrentielle, analyse d'insights et reporting marketing."),
      text("Automatisation de nurturing, CRM et scénarios d'acquisition."),
    ],
    recommendedToolIds: ["chatgpt", "claude", "gemini", "perplexity", "make", "airtable", "notion"],
    trainingFormats: [
      formats.discovery("Choisir les meilleurs copilotes pour créer, tester et analyser plus vite.", "Choose the best copilots to create, test, and analyze faster."),
      formats.bootcamp("Monter une machine éditoriale et campagne assistée par l'IA.", "Build an AI-assisted editorial and campaign machine."),
      formats.certification("Installer une méthode marketing IA mesurable et industrialisable.", "Install a measurable, scalable AI marketing method."),
    ],
    catalogueHighlights: [
      text("Contenus, campagnes et growth."),
      text("Veille et analyse d'audience."),
      text("CRM et automatisation marketing."),
    ],
  },
  {
    slug: "finance-comptabilite",
    domainKey: "Finance & Comptabilité",
    label: text("Finance & Comptabilité", "Finance & Accounting"),
    trendLabel: text("Demande structurée : reporting, contrôle, clôture", "Structured demand: reporting, controls, closing"),
    summary: text("Stack adaptée aux fonctions finance pour analyser, commenter, documenter et sécuriser les décisions et reportings.", "Stack tailored to finance functions to analyze, comment, document, and secure decisions and reporting."),
    sectorPitch: text("La finance adopte l'IA lorsqu'elle reste sous contrôle, traçable et utile à l'analyse, au commentaire et à la préparation décisionnelle.", "Finance adopts AI when it remains controlled, traceable, and useful for analysis, commentary, and decision preparation."),
    topUseCases: [
      text("Commentaires de performance, budgets, forecast et packs de pilotage."),
      text("Structuration de contrôles, check-lists et justifications."),
      text("Notes de décision, synthèses financières et analyse d'écarts."),
    ],
    recommendedToolIds: ["chatgpt", "claude", "copilot", "gemini", "airtable", "power-automate"],
    trainingFormats: [
      formats.discovery("Comprendre où l'IA accélère vraiment les fonctions finance.", "Understand where AI truly accelerates finance functions."),
      formats.bootcamp("Outiller reporting, budget et contrôle avec une méthode sécurisée.", "Tool reporting, budgeting, and control with a secure method."),
      formats.certification("Installer une pratique finance augmentée et responsable.", "Install a responsible augmented finance practice."),
    ],
    catalogueHighlights: [
      text("Reporting et commentaire de gestion."),
      text("Budget, forecast et clôture."),
      text("Contrôle, conformité et note de décision."),
    ],
  },
  {
    slug: "juridique-conformite",
    domainKey: "Juridique & Conformité",
    label: text("Juridique & Conformité", "Legal & Compliance"),
    trendLabel: text("Demande croissante : recherche, contrats, conformité", "Growing demand: research, contracts, compliance"),
    summary: text("Stack pour accélérer recherche, revue, veille réglementaire et production de notes sans déléguer le jugement juridique.", "Stack to accelerate research, review, regulatory watch, and memo production without outsourcing legal judgment."),
    sectorPitch: text("Le secteur juridique a besoin d'IA utile, mais encadrée par des exigences de confidentialité, de preuve et de validation humaine.", "Legal teams need useful AI, but framed by confidentiality, evidence, and human validation requirements."),
    topUseCases: [
      text("Recherche documentaire, synthèse de textes et revue de clauses."),
      text("Préparation de notes de conformité et de veille réglementaire."),
      text("Structuration de politiques, procédures et check-lists de contrôle."),
    ],
    recommendedToolIds: ["claude", "chatgpt", "perplexity", "notion", "airtable"],
    trainingFormats: [
      formats.discovery("Cadrer les usages juridiques et conformité à fort gain de temps.", "Frame high-time-saving legal and compliance uses."),
      formats.bootcamp("Industrialiser les tâches documentaires sans perdre la rigueur.", "Industrialize document tasks without losing rigor."),
      formats.certification("Faire monter la fonction juridique sur des usages IA responsables.", "Raise the legal function on responsible AI use."),
    ],
    catalogueHighlights: [
      text("Recherche, synthèse et revue documentaire."),
      text("Contrats, procédures et conformité."),
      text("Veille réglementaire et notes de décision."),
    ],
  },
  {
    slug: "service-client",
    domainKey: "Service Client",
    label: text("Service Client", "Customer Service"),
    trendLabel: text("Forte demande : réponses, tickets, WhatsApp, support", "Strong demand: responses, tickets, WhatsApp, support"),
    summary: text("Stack pour structurer les réponses, trier les demandes, enrichir la base de connaissance et automatiser le support.", "Stack to structure responses, triage requests, enrich the knowledge base, and automate support."),
    sectorPitch: text("Le service client gagne vite avec l'IA quand les réponses fréquentes, la qualification et le suivi deviennent plus cohérents.", "Customer service sees quick wins with AI when frequent answers, qualification, and follow-up become more consistent."),
    topUseCases: [
      text("Réponses assistées, FAQ, scripts et base de connaissance."),
      text("Qualification et routage de tickets ou messages entrants."),
      text("Analyse de verbatims et amélioration continue du service."),
    ],
    recommendedToolIds: ["chatgpt", "claude", "gemini", "make", "zapier", "notion"],
    trainingFormats: [
      formats.discovery("Repérer les quick wins IA sur la relation client.", "Identify AI quick wins in customer service."),
      formats.bootcamp("Construire un support plus rapide et plus cohérent multicanal.", "Build faster, more consistent multi-channel support."),
      formats.certification("Installer une pratique de service client augmentée et mesurable.", "Install a measurable augmented customer service practice."),
    ],
    catalogueHighlights: [
      text("FAQ, réponses et scripts."),
      text("Triage et routage."),
      text("Voix du client et amélioration continue."),
    ],
  },
  {
    slug: "data-analyse",
    domainKey: "Data & Analyse",
    label: text("Data & Analyse", "Data & Analytics"),
    trendLabel: text("Très demandée : BI, reporting, analyse augmentée", "High demand: BI, reporting, augmented analytics"),
    summary: text("Stack pour passer plus vite de la donnée brute à la synthèse, au dashboard et à la recommandation.", "Stack to move faster from raw data to synthesis, dashboarding, and recommendation."),
    sectorPitch: text("La vraie tendance n'est pas seulement d'analyser plus vite, mais de rendre l'analyse intelligible et actionnable pour les métiers.", "The real trend is not just faster analysis, but making analysis understandable and actionable for business teams."),
    topUseCases: [
      text("Exploration de données, synthèse d'insights et reporting managérial."),
      text("Commentaires de tableaux de bord et notes d'analyse."),
      text("Automatisation de préparations de fichiers et workflows analytiques."),
    ],
    recommendedToolIds: ["chatgpt", "claude", "gemini", "copilot", "airtable", "power-automate"],
    trainingFormats: [
      formats.discovery("Comprendre la place des copilotes dans les métiers data et BI.", "Understand the role of copilots in data and BI work."),
      formats.bootcamp("Structurer un reporting augmenté, du fichier au dashboard.", "Structure an augmented reporting flow from file to dashboard."),
      formats.certification("Faire émerger des analystes capables de transformer les chiffres en décisions.", "Develop analysts who can turn numbers into decisions."),
    ],
    catalogueHighlights: [
      text("Exploration et nettoyage."),
      text("Synthèse et storytelling data."),
      text("Dashboards et reporting assisté."),
    ],
  },
  {
    slug: "administration-gestion",
    domainKey: "Administration & Gestion",
    label: text("Administration & Gestion", "Administration & Operations"),
    trendLabel: text("Demande élevée sur productivité, procédures et reporting", "High demand around productivity, procedures, and reporting"),
    summary: text("Stack pour moderniser les procédures, les dossiers, les suivis et les reportings d'administration et gestion.", "Stack to modernize procedures, files, tracking, and reporting across administration and operations."),
    sectorPitch: text("L'administration gagne rapidement avec des copilotes documentaires et de petits workflows fiables, plus qu'avec des outils trop complexes.", "Administration improves quickly with document copilots and simple reliable workflows rather than overly complex tools."),
    topUseCases: [
      text("Structuration de procédures, notes, dossiers et modèles."),
      text("Suivi d'activités, relances et coordination interservices."),
      text("Reporting administratif et synthèse d'information dispersée."),
    ],
    recommendedToolIds: ["chatgpt", "gemini", "copilot", "notion", "airtable", "zapier"],
    trainingFormats: [
      formats.discovery("Identifier les gains rapides dans l'administration et la gestion.", "Identify quick wins in administration and operations."),
      formats.bootcamp("Outiller procédures, reporting et coordination.", "Equip procedures, reporting, and coordination workflows."),
      formats.certification("Installer une pratique administrative moderne et transférable.", "Install a modern, transferable administrative practice."),
    ],
    catalogueHighlights: [
      text("Procédures et documents."),
      text("Suivi d'activités et reporting."),
      text("Coordination et fiabilisation opérationnelle."),
    ],
  },
  {
    slug: "management-leadership",
    domainKey: "Management & Leadership",
    label: text("Management & Leadership", "Management & Leadership"),
    trendLabel: text("Demande en hausse : pilotage, décision, conduite du changement", "Rising demand: steering, decision-making, change"),
    summary: text("Stack pour managers et dirigeants qui veulent utiliser l'IA comme copilote de préparation, de pilotage et de transformation.", "Stack for managers and leaders who want to use AI as a copilot for preparation, steering, and transformation."),
    sectorPitch: text("Les managers ont besoin d'outils d'aide à la décision, de synthèse et de cadrage, pas d'une surcouche gadget.", "Managers need decision support, synthesis, and framing tools, not gimmicky overlays."),
    topUseCases: [
      text("Préparation de réunions, notes d'arbitrage et synthèses décisionnelles."),
      text("Pilotage de plans d'action, reporting et communication d'équipe."),
      text("Cadrage des projets de transformation et adoption de l'IA."),
    ],
    recommendedToolIds: ["chatgpt", "claude", "copilot", "gemini", "notion", "perplexity"],
    trainingFormats: [
      formats.discovery("Montrer aux managers où l'IA améliore vraiment la vitesse de préparation.", "Show managers where AI truly improves preparation speed."),
      formats.bootcamp("Outiller pilotage, réunions et arbitrage avec une méthode claire.", "Equip steering, meetings, and trade-offs with a clear method."),
      formats.certification("Faire émerger des leaders capables de cadrer l'adoption IA dans leur périmètre.", "Develop leaders who can frame AI adoption in their scope."),
    ],
    catalogueHighlights: [
      text("Décision et arbitrage."),
      text("Pilotage d'équipe et reporting."),
      text("Conduite du changement IA."),
    ],
  },
  {
    slug: "it-transformation-digitale",
    domainKey: "IT & Transformation Digitale",
    label: text("IT & Transformation Digitale", "IT & Digital Transformation"),
    trendLabel: text("Trend majeure : workflows, low-code, copilots, agents", "Major trend: workflows, low-code, copilots, agents"),
    summary: text("La stack la plus demandée pour IT et transformation combine copilotes de travail, workflows n8n/Make, bases métier, apps internes et logique d'orchestration.", "The most requested stack for IT and transformation combines work copilots, n8n/Make workflows, business data layers, internal apps, and orchestration logic."),
    sectorPitch: text("C'est aujourd'hui le domaine le plus naturel pour enseigner low-code, no-code, workflows et assistants métier dans un langage entreprise.", "This is currently the most natural domain to teach low-code, no-code, workflows, and business assistants in an enterprise language."),
    topUseCases: [
      text("Documentation, support interne, knowledge management et copilotes de projet."),
      text("Automatisation de workflows métiers et inter-applications avec validation humaine."),
      text("Construction d'outils internes, portails et mini-apps sans repartir de zéro."),
    ],
    recommendedToolIds: ["chatgpt", "claude", "gemini", "copilot", "n8n", "make", "airtable", "softr", "bubble"],
    trainingFormats: [
      formats.discovery("Cadrer les familles d'outils et les scénarios prioritaires pour l'entreprise.", "Frame tool families and priority scenarios for the organization."),
      formats.bootcamp("Construire des workflows, assistants et apps internes à forte valeur.", "Build workflows, assistants, and internal apps with strong value."),
      formats.certification("Former des profils capables d'orchestrer copilotes, workflows et no-code métier.", "Train profiles able to orchestrate copilots, workflows, and business no-code stacks."),
    ],
    catalogueHighlights: [
      text("Copilotes, RAG léger et documentation."),
      text("Workflows IA avec n8n / Make / Zapier."),
      text("Low-code / no-code apps et portails métier."),
    ],
  },
  {
    slug: "formation-pedagogie",
    domainKey: "Formation & Pédagogie",
    label: text("Formation & Pédagogie", "Learning & Pedagogy"),
    trendLabel: text("Demande croissante : contenus, feedback, personnalisation", "Growing demand: content, feedback, personalization"),
    summary: text("Stack idéale pour produire des contenus plus vite, personnaliser les parcours et mieux suivre les apprentissages.", "Ideal stack to produce content faster, personalize pathways, and monitor learning more effectively."),
    sectorPitch: text("Dans la formation, les outils utiles sont ceux qui accélèrent la conception sans appauvrir la pédagogie.", "In learning, the most useful tools are those that accelerate design without weakening pedagogy."),
    topUseCases: [
      text("Création de contenus, études de cas, quiz et supports pédagogiques."),
      text("Personnalisation de parcours et feedback aux apprenants."),
      text("Synthèse de cohortes, reporting et amélioration continue."),
    ],
    recommendedToolIds: ["chatgpt", "claude", "gemini", "notebooklm", "notion", "airtable"],
    trainingFormats: [
      formats.discovery("Identifier les usages IA qui font gagner du temps aux formateurs.", "Identify the AI uses that save time for trainers."),
      formats.bootcamp("Concevoir plus vite des séquences et évaluations contextualisées.", "Design contextualized sequences and assessments faster."),
      formats.certification("Structurer une ingénierie pédagogique augmentée et démontrable.", "Structure an augmented and demonstrable learning design practice."),
    ],
    catalogueHighlights: [
      text("Contenus et évaluations."),
      text("Personnalisation et suivi."),
      text("Reporting pédagogique."),
    ],
  },
  {
    slug: "sante-bien-etre",
    domainKey: "Santé & Bien-être",
    label: text("Santé & Bien-être", "Health & Wellbeing"),
    trendLabel: text("Demande encadrée : documentation, reporting, prévention", "Framed demand: documentation, reporting, prevention"),
    summary: text("Stack prudente pour améliorer documentation, prévention, synthèse et reporting sans toucher au jugement clinique.", "A cautious stack to improve documentation, prevention, synthesis, and reporting without touching clinical judgment."),
    sectorPitch: text("Le bon positionnement ici n'est pas l'automatisation clinique, mais l'efficacité documentaire, la qualité et le pilotage.", "The right position here is not clinical automation but documentary efficiency, quality, and operational steering."),
    topUseCases: [
      text("Supports d'information, prévention et communication sensible."),
      text("Documentation, comptes rendus, reporting d'activité et qualité."),
      text("Synthèse de verbatims ou retours terrain non cliniques."),
    ],
    recommendedToolIds: ["claude", "chatgpt", "gemini", "notion", "airtable", "power-automate"],
    trainingFormats: [
      formats.discovery("Cadrer les usages IA autorisés et utiles dans le secteur.", "Frame the useful and acceptable AI uses in the sector."),
      formats.bootcamp("Outiller prévention, reporting et documentation santé.", "Equip prevention, reporting, and health documentation workflows."),
      formats.certification("Professionnaliser une pratique IA éthique et contrôlée.", "Professionalize an ethical and controlled AI practice."),
    ],
    catalogueHighlights: [
      text("Documentation et synthèse."),
      text("Prévention et communication."),
      text("Reporting qualité et suivi."),
    ],
  },
  {
    slug: "diplomatie-affaires-internationales",
    domainKey: "Diplomatie & Affaires Internationales",
    label: text("Diplomatie & Affaires Internationales", "Diplomacy & International Affairs"),
    trendLabel: text("Demande ciblée : veille, notes, synthèses multilingues", "Targeted demand: watch, notes, multilingual syntheses"),
    summary: text("Stack adaptée à la veille, aux notes diplomatiques, aux briefings, au contexte pays et à la communication internationale.", "Stack adapted to strategic watch, diplomatic notes, briefings, country context, and international communication."),
    sectorPitch: text("Le vrai gain ici est la vitesse de synthèse et la préparation des dossiers, pas la délégation du jugement diplomatique.", "The real gain here is synthesis speed and dossier preparation, not delegating diplomatic judgment."),
    topUseCases: [
      text("Veille géopolitique, institutionnelle et sectorielle."),
      text("Notes, briefings, éléments de langage et dossiers de mission."),
      text("Synthèses multilingues et préparation de réunions internationales."),
    ],
    recommendedToolIds: ["claude", "chatgpt", "gemini", "perplexity", "notebooklm", "notion"],
    trainingFormats: [
      formats.discovery("Identifier les outils de veille et de synthèse les plus utiles aux institutions.", "Identify the most useful watch and synthesis tools for institutions."),
      formats.bootcamp("Construire une méthode de note diplomatique et de dossier augmentés.", "Build an augmented method for diplomatic notes and dossiers."),
      formats.certification("Structurer une pratique IA fiable pour les affaires internationales.", "Structure a reliable AI practice for international affairs."),
    ],
    catalogueHighlights: [
      text("Veille et analyse pays."),
      text("Notes diplomatiques et briefings."),
      text("Communication multilingue et préparation de mission."),
    ],
  },
];

export const defaultDomainToolPlan = domainToolPlans.find((plan) => plan.slug === "it-transformation-digitale") ?? domainToolPlans[0];

export const getDomainToolPlan = (slug?: string | null) =>
  domainToolPlans.find((plan) => plan.slug === slug) ?? defaultDomainToolPlan;

export const getToolById = (id: string) => aiTools.find((tool) => tool.id === id);

