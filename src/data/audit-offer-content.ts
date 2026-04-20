export type LocalizedText = {
  fr: string;
  en: string;
};

export type AuditDomainMessage = {
  key: string;
  domain: LocalizedText;
  audience: LocalizedText;
  whyAuditMatters: LocalizedText;
  auditFocus: LocalizedText[];
  businessBenefits: LocalizedText[];
  cta: LocalizedText;
  emailSubject: LocalizedText;
  emailPreheader: LocalizedText;
  emailBody: {
    intro: LocalizedText;
    diagnostic: LocalizedText;
    benefitsLead: LocalizedText;
    benefits: LocalizedText[];
    close: LocalizedText;
  };
};

const text = (fr: string, en: string): LocalizedText => ({ fr, en });

export const auditOfferContent = {
  heroBadge: text("Audit IA Gratuit", "Free AI Audit"),
  heroTitle: text(
    "Identifiez vos priorités IA avant d'investir",
    "Identify your AI priorities before you invest"
  ),
  heroLead: text(
    "TransferAI Africa aide les entreprises à comprendre où l'IA peut produire un gain concret, rapidement et sans dispersion. Vous commencez par une demande courte, puis nous vous envoyons un formulaire d'audit multi-sectoriel et un accès sécurisé pour préparer un échange utile avec notre équipe.",
    "TransferAI Africa helps companies understand where AI can create concrete value quickly and without noise. You start with a short request, then we send you a multi-sector audit questionnaire and secure access so you can prepare a useful conversation with our team."
  ),
  proofPoints: {
    fr: [
      "100% gratuit et sans engagement",
      "Pensé pour les entreprises en Côte d'Ivoire et en Afrique",
      "Accusé de réception immédiat puis accès au formulaire sous environ 30 minutes",
    ],
    en: [
      "100% free and no commitment",
      "Built for companies in Côte d'Ivoire and across Africa",
      "Immediate acknowledgement, then questionnaire access in about 30 minutes",
    ],
  },
  whyTitle: text("Pourquoi commencer par un audit IA", "Why start with an AI audit"),
  whyItems: [
    {
      title: text("Voir clair avant d'acheter", "Gain clarity before buying"),
      desc: text(
        "L'audit évite les investissements dispersés, les outils choisis trop tôt et les projets flous.",
        "The audit prevents scattered spending, premature tool choices, and vague AI projects."
      ),
    },
    {
      title: text("Identifier les gains rapides", "Identify quick wins"),
      desc: text(
        "Nous repérons les tâches, workflows et points de friction où l'IA peut produire un effet visible rapidement.",
        "We identify the tasks, workflows, and friction points where AI can create visible impact quickly."
      ),
    },
    {
      title: text("Aligner direction, métiers et équipes", "Align leaders, business teams, and operations"),
      desc: text(
        "L'audit sert à parler business, usages et résultats attendus avant de parler outils.",
        "The audit helps teams discuss business value, use cases, and expected outcomes before tools."
      ),
    },
  ],
  deliverablesTitle: text("Ce que l'entreprise reçoit", "What the company receives"),
  deliverables: {
    fr: [
      "Un diagnostic synthétique des priorités IA",
      "Les irritants et opportunités les plus pertinents",
      "Des cas d'usage concrets par métier ou par équipe",
      "Une première feuille de route 30 / 60 / 90 jours",
      "Une orientation vers la bonne suite : formation, accompagnement ou solution",
    ],
    en: [
      "A concise AI priority diagnosis",
      "The most relevant friction points and opportunities",
      "Concrete use cases by role or team",
      "An initial 30 / 60 / 90-day roadmap",
      "Guidance toward the right next step: training, advisory, or solution deployment",
    ],
  },
  processTitle: text("Comment se déroule l'audit", "How the audit works"),
  processSteps: [
    {
      step: "01",
      title: text("Demande rapide", "Short request"),
      desc: text(
        "Vous partagez votre contexte, votre secteur et votre besoin dans une demande courte pensée pour le mobile.",
        "You share your context, sector, and need through a short mobile-friendly request."
      ),
    },
    {
      step: "02",
      title: text("Accusé de réception", "Acknowledgement"),
      desc: text(
        "Notre équipe confirme la bonne réception de votre demande et prépare le bon angle d'audit selon votre secteur.",
        "Our team confirms your request and prepares the right audit angle based on your sector."
      ),
    },
    {
      step: "03",
      title: text("Accès sécurisé au formulaire", "Secure questionnaire access"),
      desc: text(
        "Vous recevez sous environ 30 minutes l'accès sécurisé au formulaire d'audit à remplir.",
        "Within about 30 minutes, you receive secure access to the audit questionnaire."
      ),
    },
    {
      step: "04",
      title: text("Questionnaire et échange expert", "Questionnaire and expert discussion"),
      desc: text(
        "Vous remplissez le questionnaire puis nous préparons avec vous la meilleure suite : cadrage, formation, accompagnement ou automatisation.",
        "You complete the questionnaire, then we prepare the best next step with you: scoping, training, advisory, or automation."
      ),
    },
  ],
  sectorsTitle: text("Un angle métier pour chaque domaine", "A business angle for each domain"),
  sectorsLead: text(
    "Chaque secteur n'entre pas dans l'IA pour les mêmes raisons. Voici l'angle d'audit que TransferAI Africa utilise pour parler à chaque métier avec pertinence.",
    "Not every sector enters AI for the same reasons. Here is the audit angle TransferAI Africa uses to speak to each function with relevance."
  ),
  ctaTitle: text("Prêt à cadrer votre besoin ?", "Ready to scope your need?"),
  ctaDesc: text(
    "Commencez par un audit IA gratuit pour clarifier les priorités, les gains rapides et la bonne trajectoire pour votre organisation.",
    "Start with a free AI audit to clarify priorities, quick wins, and the right direction for your organization."
  ),
};

export const auditDomainMessages: AuditDomainMessage[] = [
  {
    key: "executive-support",
    domain: text("Assistanat & Secrétariat", "Executive Support & Administration"),
    audience: text("Assistants de direction, office managers, support exécutif", "Executive assistants, office managers, executive support"),
    whyAuditMatters: text(
      "Dans ce domaine, l'audit sert à repérer où l'IA peut faire gagner du temps sur les e-mails, comptes rendus, agendas, notes et coordination sans dégrader la fiabilité.",
      "In this domain, the audit identifies where AI can save time on email, minutes, agendas, notes, and coordination without reducing reliability."
    ),
    auditFocus: [
      text("Flux documentaires et rédactionnels répétitifs", "Repetitive document and writing workflows"),
      text("Préparation des réunions et synthèses de direction", "Meeting preparation and executive summaries"),
      text("Coordination, relances et organisation du quotidien", "Coordination, follow-ups, and day-to-day organization"),
    ],
    businessBenefits: [
      text("Réduire le temps administratif à faible valeur", "Reduce low-value administrative time"),
      text("Mieux structurer les livrables de direction", "Better structure executive deliverables"),
      text("Fiabiliser la circulation d'information", "Improve information flow reliability"),
    ],
    cta: text("Réserver un audit IA pour les fonctions support", "Book an AI audit for support functions"),
    emailSubject: text(
      "Audit IA gratuit - Structurer un support exécutif plus efficace",
      "Free AI audit - Build a more efficient executive support function"
    ),
    emailPreheader: text(
      "Un premier diagnostic pour accélérer coordination, rédaction et préparation de livrables.",
      "A first diagnosis to accelerate coordination, writing, and executive support deliverables."
    ),
    emailBody: {
      intro: text(
        "Beaucoup d'équipes support savent qu'elles pourraient gagner du temps avec l'IA, mais ne savent pas encore quels usages prioriser sans perdre en qualité.",
        "Many support teams know they could save time with AI, but do not yet know which use cases to prioritize without losing quality."
      ),
      diagnostic: text(
        "Notre audit IA gratuit sert à repérer les tâches répétitives, les points de friction et les livrables qui peuvent être améliorés rapidement dans l'assistanat et la coordination exécutive.",
        "Our free AI audit is designed to identify repetitive tasks, friction points, and deliverables that can be improved quickly in executive support and coordination."
      ),
      benefitsLead: text("L'audit permet notamment de :", "The audit helps you:"),
      benefits: [
        text("réduire le temps passé sur les e-mails, comptes rendus et notes", "reduce time spent on emails, minutes, and notes"),
        text("mieux structurer la préparation des réunions et suivis d'actions", "better structure meetings and action follow-up"),
        text("définir une première méthode de travail augmentée par l'IA", "define a first AI-augmented working method"),
      ],
      close: text(
        "Si vous voulez, nous pouvons démarrer par un échange court pour identifier les gains rapides les plus utiles à votre équipe.",
        "If you wish, we can start with a short conversation to identify the most useful quick wins for your team."
      ),
    },
  },
  {
    key: "human-resources",
    domain: text("Ressources Humaines", "Human Resources"),
    audience: text("DRH, recrutement, formation, people operations", "HR leaders, recruiters, learning teams, people operations"),
    whyAuditMatters: text(
      "Dans les RH, l'audit sert à cadrer des usages responsables de l'IA sur le recrutement, l'onboarding, la communication RH et la montée en compétences.",
      "In HR, the audit frames responsible AI use across recruitment, onboarding, HR communication, and upskilling."
    ),
    auditFocus: [
      text("Tri, présélection et préparation des entretiens", "Screening, shortlisting, and interview preparation"),
      text("Communication RH et accompagnement des managers", "HR communication and manager support"),
      text("Plans de formation et structuration des compétences", "Learning plans and skills structuring"),
    ],
    businessBenefits: [
      text("Réduire le temps de recrutement", "Reduce recruitment cycle time"),
      text("Mieux personnaliser les parcours de développement", "Better personalize development pathways"),
      text("Concilier efficacité, équité et conformité", "Balance efficiency, fairness, and compliance"),
    ],
    cta: text("Réserver un audit IA RH", "Book an HR AI audit"),
    emailSubject: text(
      "Audit IA gratuit - Clarifier vos priorités RH avant déploiement",
      "Free AI audit - Clarify your HR AI priorities before deployment"
    ),
    emailPreheader: text(
      "Recrutement, onboarding, communication RH et montée en compétences : où commencer ?",
      "Recruitment, onboarding, HR communication, and upskilling: where should you start?"
    ),
    emailBody: {
      intro: text(
        "L'IA peut accélérer les processus RH, mais seulement si les bons cas d'usage sont choisis avec méthode, équité et traçabilité.",
        "AI can accelerate HR processes, but only if the right use cases are selected with discipline, fairness, and traceability."
      ),
      diagnostic: text(
        "L'audit IA gratuit permet d'identifier les usages RH où un gain rapide est possible sans fragiliser la qualité de décision ou la conformité.",
        "The free AI audit helps identify HR use cases where quick wins are possible without weakening decision quality or compliance."
      ),
      benefitsLead: text("Nous regardons en priorité :", "We focus first on:"),
      benefits: [
        text("les étapes du recrutement qui peuvent être fluidifiées", "recruitment steps that can be streamlined"),
        text("les messages et supports RH à industrialiser intelligemment", "HR messages and materials that can be industrialized intelligently"),
        text("les parcours de formation ou d'onboarding à personnaliser", "learning and onboarding paths that can be better personalized"),
      ],
      close: text(
        "Si votre organisation veut intégrer l'IA en RH avec sérieux, cet audit est le bon point d'entrée.",
        "If your organization wants to integrate AI into HR seriously, this audit is the right entry point."
      ),
    },
  },
  {
    key: "marketing-communication",
    domain: text("Marketing & Communication", "Marketing & Communication"),
    audience: text("Marketing, communication, contenu, growth", "Marketing, communication, content, growth"),
    whyAuditMatters: text(
      "Ici, l'audit sert à prioriser les usages IA entre production de contenu, segmentation, analyse d'audience et pilotage des campagnes.",
      "Here, the audit helps prioritize AI use cases across content production, segmentation, audience analysis, and campaign management."
    ),
    auditFocus: [
      text("Création de contenu et adaptation multiformat", "Content creation and multi-format adaptation"),
      text("Segmentation, personnalisation et campagnes", "Segmentation, personalization, and campaigns"),
      text("Veille, insights et analyse d'audience", "Monitoring, insights, and audience analysis"),
    ],
    businessBenefits: [
      text("Produire plus vite sans dégrader la cohérence de marque", "Produce faster without losing brand consistency"),
      text("Mieux piloter les campagnes et les messages", "Better manage campaigns and messages"),
      text("Transformer la veille en décisions marketing", "Turn monitoring into marketing decisions"),
    ],
    cta: text("Réserver un audit IA Marketing", "Book a Marketing AI audit"),
    emailSubject: text(
      "Audit IA gratuit - Accélérer contenus, campagnes et performance marketing",
      "Free AI audit - Accelerate content, campaigns, and marketing performance"
    ),
    emailPreheader: text(
      "Identifiez les gains rapides sur la création, la segmentation et l'analyse d'audience.",
      "Identify quick wins across creation, segmentation, and audience analysis."
    ),
    emailBody: {
      intro: text(
        "Les équipes marketing voient le potentiel de l'IA partout, mais ont souvent besoin d'un cadrage clair pour éviter la dispersion.",
        "Marketing teams see AI potential everywhere, but often need clear framing to avoid scattering efforts."
      ),
      diagnostic: text(
        "Notre audit IA gratuit aide à hiérarchiser les bons usages selon vos objectifs : visibilité, acquisition, contenu, conversion ou fidélisation.",
        "Our free AI audit helps prioritize the right use cases according to your goals: visibility, acquisition, content, conversion, or retention."
      ),
      benefitsLead: text("L'audit permet de clarifier :", "The audit helps clarify:"),
      benefits: [
        text("où automatiser sans perdre la qualité éditoriale", "where to automate without losing editorial quality"),
        text("quels contenus ou workflows standardiser", "which content and workflows to standardize"),
        text("comment transformer la veille en décisions plus rapides", "how to turn monitoring into faster decisions"),
      ],
      close: text(
        "C'est le meilleur point d'entrée avant de lancer une formation ou un accompagnement marketing IA plus large.",
        "It is the best entry point before launching broader AI training or advisory for marketing."
      ),
    },
  },
  {
    key: "finance-accounting",
    domain: text("Finance & Comptabilité", "Finance & Accounting"),
    audience: text("Finance, comptabilité, contrôle, audit interne", "Finance, accounting, control, internal audit"),
    whyAuditMatters: text(
      "L'audit aide à choisir les usages IA les plus pertinents entre reporting, analyse, conformité, fraude et automatisation comptable.",
      "The audit helps select the most relevant AI use cases across reporting, analysis, compliance, fraud, and accounting automation."
    ),
    auditFocus: [
      text("Reporting, consolidation et production d'analyses", "Reporting, consolidation, and analytical production"),
      text("Détection d'anomalies, audit et conformité", "Anomaly detection, audit, and compliance"),
      text("Automatisation des workflows comptables et financiers", "Automation of accounting and finance workflows"),
    ],
    businessBenefits: [
      text("Fiabiliser les analyses et contrôles", "Increase the reliability of analysis and control"),
      text("Réduire le temps de production des livrables", "Reduce the time required to produce finance deliverables"),
      text("Identifier les cas d'usage à ROI rapide", "Identify quick-win, high-ROI use cases"),
    ],
    cta: text("Réserver un audit IA Finance", "Book a Finance AI audit"),
    emailSubject: text(
      "Audit IA gratuit - Identifier vos priorités en finance et comptabilité",
      "Free AI audit - Identify your finance and accounting priorities"
    ),
    emailPreheader: text(
      "Reporting, audit, conformité, trésorerie : où l'IA peut-elle créer de la valeur ?",
      "Reporting, audit, compliance, treasury: where can AI create the most value?"
    ),
    emailBody: {
      intro: text(
        "Dans les fonctions finance, l'IA ne doit pas être un effet de mode. Elle doit aider à produire plus vite, mieux contrôler et mieux décider.",
        "In finance functions, AI should not be a gimmick. It should help teams produce faster, control better, and decide better."
      ),
      diagnostic: text(
        "L'audit IA gratuit permet d'identifier les workflows et livrables où l'automatisation, la détection d'anomalies ou l'assistance analytique peuvent produire un impact concret.",
        "The free AI audit identifies workflows and deliverables where automation, anomaly detection, or analytical assistance can create concrete impact."
      ),
      benefitsLead: text("Nous analysons notamment :", "We review in particular:"),
      benefits: [
        text("le reporting et la consolidation", "reporting and consolidation"),
        text("les contrôles, risques et audits internes", "controls, risks, and internal audit"),
        text("les tâches répétitives comptables ou de trésorerie", "repetitive accounting or treasury tasks"),
      ],
      close: text(
        "Cet audit vous aide à avancer avec méthode avant tout investissement plus large.",
        "This audit helps you move forward with structure before any broader investment."
      ),
    },
  },
  {
    key: "legal-compliance",
    domain: text("Juridique & Conformité", "Legal & Compliance"),
    audience: text("Juristes, compliance, risques, DPO", "Legal teams, compliance, risk, DPO"),
    whyAuditMatters: text(
      "Dans ce domaine, l'audit sert à cadrer des usages IA responsables sur la recherche, la revue documentaire, la conformité et la rédaction sensible.",
      "In this domain, the audit frames responsible AI use across research, document review, compliance, and sensitive drafting."
    ),
    auditFocus: [
      text("Recherche documentaire et veille réglementaire", "Research and regulatory watch"),
      text("Analyse contractuelle et revue de clauses", "Contract analysis and clause review"),
      text("Gouvernance, confidentialité et validation humaine", "Governance, confidentiality, and human validation"),
    ],
    businessBenefits: [
      text("Réduire le temps de recherche et de revue", "Reduce research and review time"),
      text("Fiabiliser les processus documentaires", "Strengthen document process reliability"),
      text("Encadrer l'usage de l'IA sur les sujets sensibles", "Properly frame AI use on sensitive matters"),
    ],
    cta: text("Réserver un audit IA Juridique", "Book a Legal AI audit"),
    emailSubject: text(
      "Audit IA gratuit - Cadrer des usages IA fiables en juridique et conformité",
      "Free AI audit - Frame reliable AI use in legal and compliance teams"
    ),
    emailPreheader: text(
      "Recherche, conformité, revue documentaire : commençons par les bons usages.",
      "Research, compliance, document review: let’s start with the right use cases."
    ),
    emailBody: {
      intro: text(
        "Les équipes juridiques et conformité peuvent gagner du temps avec l'IA, à condition de bien cadrer les limites, les validations et les risques.",
        "Legal and compliance teams can save time with AI, provided that limits, validations, and risks are well framed."
      ),
      diagnostic: text(
        "L'audit IA gratuit permet d'identifier où l'IA peut accélérer la recherche et la revue, tout en maintenant un haut niveau de rigueur.",
        "The free AI audit identifies where AI can accelerate research and review while maintaining a high level of rigor."
      ),
      benefitsLead: text("L'objectif est de clarifier :", "The goal is to clarify:"),
      benefits: [
        text("ce qui peut être assisté ou préparé par l'IA", "what can be assisted or pre-drafted by AI"),
        text("ce qui doit rester intégralement validé par l'humain", "what must remain fully human-validated"),
        text("comment outiller la fonction sans fragiliser la conformité", "how to equip the function without weakening compliance"),
      ],
      close: text(
        "Cet audit est le bon point d'entrée pour installer une pratique IA crédible et responsable.",
        "This audit is the right entry point to install a credible and responsible AI practice."
      ),
    },
  },
  {
    key: "customer-service",
    domain: text("Service client & relation client", "Customer Service & Customer Experience"),
    audience: text("Support client, CX, centres de contact", "Support teams, CX, contact centers"),
    whyAuditMatters: text(
      "Ici, l'audit sert à voir où l'IA peut améliorer la qualité de réponse, la vitesse de traitement et la structuration du support.",
      "Here, the audit identifies where AI can improve response quality, processing speed, and support structuring."
    ),
    auditFocus: [
      text("Demandes entrantes et priorisation", "Inbound request prioritization"),
      text("Réponses, scripts, base de connaissance et FAQ", "Responses, scripts, knowledge base, and FAQ"),
      text("Chatbots, relais humains et qualité de service", "Chatbots, human handoff, and service quality"),
    ],
    businessBenefits: [
      text("Réduire les délais de réponse", "Reduce response times"),
      text("Améliorer la qualité et la cohérence", "Improve quality and consistency"),
      text("Mieux structurer les escalades et la FAQ", "Better structure escalations and FAQ flows"),
    ],
    cta: text("Réserver un audit IA Service client", "Book a Customer Service AI audit"),
    emailSubject: text(
      "Audit IA gratuit - Accélérer et fiabiliser votre service client",
      "Free AI audit - Accelerate and strengthen your customer service"
    ),
    emailPreheader: text(
      "Réponses plus rapides, support mieux structuré, FAQ et chatbot plus utiles.",
      "Faster responses, stronger support structure, more useful FAQ and chatbot experiences."
    ),
    emailBody: {
      intro: text(
        "Dans le service client, l'enjeu n'est pas seulement d'automatiser. Il faut surtout mieux orienter, mieux répondre et mieux capitaliser les demandes.",
        "In customer service, the challenge is not just automation. It is about guiding better, answering better, and capitalizing better on requests."
      ),
      diagnostic: text(
        "L'audit IA gratuit aide à identifier où un copilote, une base de connaissance ou un chatbot peuvent réellement améliorer l'expérience client et la productivité des équipes.",
        "The free AI audit helps identify where a copilot, knowledge base, or chatbot can truly improve customer experience and team productivity."
      ),
      benefitsLead: text("Nous regardons notamment :", "We focus in particular on:"),
      benefits: [
        text("les demandes récurrentes et les réponses standardisables", "recurring requests and responses that can be standardized"),
        text("les délais de traitement et la qualité de réponse", "processing delays and response quality"),
        text("la bonne articulation entre IA et intervention humaine", "the right balance between AI and human intervention"),
      ],
      close: text(
        "Cet audit permet d'entrer dans l'IA par la qualité de service, pas par l'effet gadget.",
        "This audit lets you enter AI through service quality, not through gimmicks."
      ),
    },
  },
  {
    key: "data-analytics",
    domain: text("Données & Analyse", "Data & Analytics"),
    audience: text("Analystes, responsables data, managers métier", "Analysts, data leads, business managers"),
    whyAuditMatters: text(
      "L'audit sert à identifier les zones où l'IA peut renforcer l'analyse, la visualisation, la synthèse et l'aide à la décision.",
      "The audit identifies where AI can strengthen analysis, visualization, synthesis, and decision support."
    ),
    auditFocus: [
      text("Sources de données, reporting et dashboards", "Data sources, reporting, and dashboards"),
      text("Synthèse, interprétation et aide à la décision", "Synthesis, interpretation, and decision support"),
      text("Automatisation analytique et culture data", "Analytics automation and data culture"),
    ],
    businessBenefits: [
      text("Réduire le temps passé à consolider les données", "Reduce time spent consolidating data"),
      text("Créer des analyses plus utiles aux décideurs", "Create more useful analyses for decision-makers"),
      text("Monter en maturité analytique avec méthode", "Improve analytics maturity with structure"),
    ],
    cta: text("Réserver un audit IA Data", "Book a Data AI audit"),
    emailSubject: text(
      "Audit IA gratuit - Transformer vos données en décisions plus rapides",
      "Free AI audit - Turn your data into faster decisions"
    ),
    emailPreheader: text(
      "Reporting, visualisation, synthèse et aide à la décision : où sont les gains rapides ?",
      "Reporting, visualization, synthesis, and decision support: where are the quick wins?"
    ),
    emailBody: {
      intro: text(
        "Beaucoup d'organisations ont des données, mais peinent encore à les transformer rapidement en lecture utile et en décisions actionnables.",
        "Many organizations have data, but still struggle to turn it quickly into useful insight and actionable decisions."
      ),
      diagnostic: text(
        "L'audit IA gratuit permet de repérer les goulots d'étranglement entre collecte, consolidation, analyse et restitution.",
        "The free AI audit identifies bottlenecks between collection, consolidation, analysis, and reporting."
      ),
      benefitsLead: text("Il aide à clarifier :", "It helps clarify:"),
      benefits: [
        text("quelles analyses gagneraient à être assistées", "which analyses would benefit from AI assistance"),
        text("où la synthèse peut être accélérée sans perdre la qualité", "where synthesis can be accelerated without losing quality"),
        text("quels tableaux de bord et livrables doivent être priorisés", "which dashboards and deliverables should be prioritized"),
      ],
      close: text(
        "C'est un excellent point d'entrée pour renforcer votre pratique data avant tout projet plus large.",
        "It is an excellent entry point to strengthen your data practice before any broader project."
      ),
    },
  },
  {
    key: "administration-operations",
    domain: text("Administration & Gestion", "Administration & Operations"),
    audience: text("Administration, coordination, gestion opérationnelle", "Administration, coordination, operations"),
    whyAuditMatters: text(
      "L'audit sert à repérer les tâches administratives, validations, suivis et reporting qui peuvent être fluidifiés rapidement.",
      "The audit identifies administrative tasks, validations, follow-up routines, and reporting that can be streamlined quickly."
    ),
    auditFocus: [
      text("Processus répétitifs et gestion documentaire", "Repetitive processes and document management"),
      text("Suivi des demandes et coordination interne", "Request tracking and internal coordination"),
      text("Reporting, tableaux de bord et traçabilité", "Reporting, dashboards, and traceability"),
    ],
    businessBenefits: [
      text("Réduire la charge de ressaisie et de suivi", "Reduce re-entry and follow-up workload"),
      text("Mieux structurer les processus internes", "Better structure internal processes"),
      text("Améliorer la traçabilité et la visibilité", "Improve traceability and visibility"),
    ],
    cta: text("Réserver un audit IA Administration", "Book an Administration AI audit"),
    emailSubject: text(
      "Audit IA gratuit - Fluidifier vos opérations administratives",
      "Free AI audit - Streamline your administrative operations"
    ),
    emailPreheader: text(
      "Processus, suivis, reporting et coordination : faisons émerger les bons gains.",
      "Processes, tracking, reporting, and coordination: let’s surface the right gains."
    ),
    emailBody: {
      intro: text(
        "Les équipes administratives ont souvent des gains rapides à aller chercher, à condition de bien choisir les tâches à fluidifier en premier.",
        "Administrative teams often have quick wins to capture, provided the first tasks to streamline are chosen correctly."
      ),
      diagnostic: text(
        "L'audit IA gratuit permet d'identifier où un copilote, un workflow ou une automatisation légère peuvent améliorer la qualité et la vitesse d'exécution.",
        "The free AI audit identifies where a copilot, workflow, or light automation can improve quality and speed of execution."
      ),
      benefitsLead: text("Nous regardons notamment :", "We look in particular at:"),
      benefits: [
        text("les validations et suivis répétitifs", "repetitive validations and follow-ups"),
        text("les documents et tableaux à produire régulièrement", "documents and tables produced regularly"),
        text("les irritants qui ralentissent les équipes au quotidien", "friction points that slow teams down daily"),
      ],
      close: text(
        "Cet audit est utile pour entrer dans l'IA par les opérations concrètes et les gains visibles.",
        "This audit is useful for entering AI through concrete operations and visible gains."
      ),
    },
  },
  {
    key: "management-leadership",
    domain: text("Management & Leadership", "Management & Leadership"),
    audience: text("Direction générale, managers, transformation", "Executive leaders, managers, transformation teams"),
    whyAuditMatters: text(
      "Dans ce domaine, l'audit sert à clarifier la bonne trajectoire d'adoption, les priorités d'équipe et la gouvernance des usages IA.",
      "In this domain, the audit clarifies the right adoption path, team priorities, and AI governance."
    ),
    auditFocus: [
      text("Vision, cas d'usage et priorités stratégiques", "Vision, use cases, and strategic priorities"),
      text("Conduite du changement et alignement des équipes", "Change management and team alignment"),
      text("Gouvernance, qualité et pilotage de l'adoption", "Governance, quality, and adoption management"),
    ],
    businessBenefits: [
      text("Éviter les projets IA dispersés", "Avoid scattered AI projects"),
      text("Installer une trajectoire claire pour les équipes", "Install a clear path for teams"),
      text("Faire de l'IA un levier managérial concret", "Turn AI into a concrete managerial lever"),
    ],
    cta: text("Réserver un audit IA Leadership", "Book a Leadership AI audit"),
    emailSubject: text(
      "Audit IA gratuit - Clarifier votre trajectoire d'adoption IA",
      "Free AI audit - Clarify your AI adoption trajectory"
    ),
    emailPreheader: text(
      "Direction, managers, transformation : par où commencer avec méthode ?",
      "Executives, managers, transformation teams: where should you start with structure?"
    ),
    emailBody: {
      intro: text(
        "Pour les dirigeants et managers, l'enjeu principal n'est pas d'utiliser l'IA partout. C'est de savoir où elle peut produire un effet business réel.",
        "For leaders and managers, the main challenge is not to use AI everywhere. It is to know where it can create real business impact."
      ),
      diagnostic: text(
        "L'audit IA gratuit aide à cadrer les priorités, la gouvernance et la montée en compétence nécessaires pour avancer sans effet de mode.",
        "The free AI audit helps frame priorities, governance, and the upskilling required to move forward without hype."
      ),
      benefitsLead: text("Il permet notamment de :", "It helps you:"),
      benefits: [
        text("clarifier les cas d'usage à impact pour les équipes", "clarify high-impact use cases for teams"),
        text("prioriser les premières actions réalistes", "prioritize the first realistic actions"),
        text("installer une logique d'adoption plus lisible", "install a clearer adoption logic"),
      ],
      close: text(
        "C'est le bon point d'entrée pour transformer l'IA en feuille de route plutôt qu'en sujet flou.",
        "It is the right entry point to turn AI into a roadmap rather than a vague topic."
      ),
    },
  },
  {
    key: "it-digital-transformation",
    domain: text("Systèmes d'information & Transformation digitale", "Information Systems & Digital Transformation"),
    audience: text("DSI, projets digitaux, IT, intégration", "CIOs, digital projects, IT, integration teams"),
    whyAuditMatters: text(
      "C'est le domaine où l'audit est le plus utile pour choisir les bons copilotes, workflows, outils no-code et cas d'automatisation sans créer de dette inutile.",
      "This is the domain where the audit is most useful to choose the right copilots, workflows, no-code tools, and automation use cases without creating unnecessary debt."
    ),
    auditFocus: [
      text("Copilotes, outils IA et stacks à prioriser", "Copilots, AI tools, and stacks to prioritize"),
      text("Workflows, no-code, low-code et automatisation", "Workflows, no-code, low-code, and automation"),
      text("Architecture d'usage, gouvernance et sécurité", "Usage architecture, governance, and security"),
    ],
    businessBenefits: [
      text("Choisir les bons outils avant d'empiler les solutions", "Choose the right tools before stacking solutions"),
      text("Réduire les cycles de test et d'intégration", "Reduce testing and integration cycles"),
      text("Installer une logique d'adoption plus maintenable", "Install a more maintainable adoption logic"),
    ],
    cta: text("Réserver un audit IA IT", "Book an IT AI audit"),
    emailSubject: text(
      "Audit IA gratuit - Cadrer copilotes, workflows et transformation digitale",
      "Free AI audit - Frame copilots, workflows, and digital transformation"
    ),
    emailPreheader: text(
      "ChatGPT, Claude, Gemini, workflows, no-code : quel stack choisir pour un vrai impact ?",
      "ChatGPT, Claude, Gemini, workflows, no-code: which stack should you choose for real impact?"
    ),
    emailBody: {
      intro: text(
        "En IT et transformation digitale, la vraie difficulté n'est pas de trouver des outils IA. C'est de choisir les bons, dans le bon ordre et pour les bons usages.",
        "In IT and digital transformation, the real challenge is not finding AI tools. It is choosing the right ones, in the right order, for the right use cases."
      ),
      diagnostic: text(
        "L'audit IA gratuit permet de clarifier les priorités entre copilotes, automatisation, no-code, workflows, sécurité et gouvernance.",
        "The free AI audit helps clarify priorities across copilots, automation, no-code, workflows, security, and governance."
      ),
      benefitsLead: text("Nous regardons en priorité :", "We focus first on:"),
      benefits: [
        text("les cas d'usage où l'impact est visible rapidement", "use cases where impact becomes visible quickly"),
        text("les outils et stacks qui évitent la dispersion", "tools and stacks that avoid scattering efforts"),
        text("la trajectoire de déploiement la plus crédible pour l'organisation", "the most credible deployment path for the organization"),
      ],
      close: text(
        "Si vous voulez enseigner, tester ou déployer l'IA avec méthode, cet audit est le bon point de départ.",
        "If you want to teach, test, or deploy AI with discipline, this audit is the right starting point."
      ),
    },
  },
  {
    key: "learning-pedagogy",
    domain: text("Formation & Pédagogie", "Learning & Instructional Design"),
    audience: text("Responsables formation, pédagogie, académies", "Learning leaders, instructional design teams, academies"),
    whyAuditMatters: text(
      "L'audit sert à identifier où l'IA peut moderniser la conception, la personnalisation, la production de contenus et le suivi apprenant.",
      "The audit identifies where AI can modernize design, personalization, content production, and learner follow-up."
    ),
    auditFocus: [
      text("Conception de parcours et supports pédagogiques", "Pathway design and learning materials"),
      text("Tutorat, assistants IA et personnalisation", "Tutoring, AI assistants, and personalization"),
      text("Évaluation, LMS et analytics de formation", "Assessment, LMS, and learning analytics"),
    ],
    businessBenefits: [
      text("Produire plus vite des contenus pédagogiques utiles", "Produce useful learning content faster"),
      text("Améliorer l'expérience apprenant", "Improve the learner experience"),
      text("Structurer une pédagogie augmentée et mesurable", "Structure an augmented and measurable pedagogy"),
    ],
    cta: text("Réserver un audit IA Formation", "Book a Learning AI audit"),
    emailSubject: text(
      "Audit IA gratuit - Moderniser vos parcours de formation avec méthode",
      "Free AI audit - Modernize your learning pathways with structure"
    ),
    emailPreheader: text(
      "Conception, contenus, personnalisation, LMS : où l'IA peut-elle créer de la valeur ?",
      "Design, content, personalization, LMS: where can AI create value?"
    ),
    emailBody: {
      intro: text(
        "Les structures de formation ont beaucoup à gagner avec l'IA, mais l'enjeu est de bien choisir où elle renforce la pédagogie au lieu de simplement accélérer la production.",
        "Learning organizations have much to gain from AI, but the challenge is choosing where it strengthens pedagogy rather than simply speeding up production."
      ),
      diagnostic: text(
        "L'audit IA gratuit permet de repérer les usages pédagogiques à fort impact et les points où l'ingénierie de formation peut être modernisée rapidement.",
        "The free AI audit identifies high-impact learning use cases and where training engineering can be modernized quickly."
      ),
      benefitsLead: text("Il aide à clarifier :", "It helps clarify:"),
      benefits: [
        text("les contenus à produire plus intelligemment", "which materials should be produced more intelligently"),
        text("les assistants ou copilotes utiles aux formateurs et apprenants", "which assistants or copilots are useful for trainers and learners"),
        text("la meilleure trajectoire entre pédagogie, outils et résultats", "the best path between pedagogy, tools, and outcomes"),
      ],
      close: text(
        "C'est un point d'entrée très utile pour une académie ou une direction formation qui veut monter en gamme.",
        "It is a very useful entry point for an academy or learning department that wants to step up."
      ),
    },
  },
  {
    key: "health-wellbeing",
    domain: text("Santé, social & bien-être", "Health, Social Care & Well-being"),
    audience: text("Prévention, HSE, bien-être, RH", "Prevention, HSE, well-being, HR"),
    whyAuditMatters: text(
      "L'audit sert à voir où l'IA peut aider à la prévention, au suivi, à la documentation et aux programmes santé en entreprise.",
      "The audit identifies where AI can support prevention, monitoring, documentation, and workplace health programs."
    ),
    auditFocus: [
      text("Prévention des risques et conformité HSE", "Risk prevention and HSE compliance"),
      text("Suivi, reporting et documentation", "Monitoring, reporting, and documentation"),
      text("Programmes bien-être, QVT et vigilance terrain", "Well-being programs, quality of work life, and field vigilance"),
    ],
    businessBenefits: [
      text("Mieux structurer la prévention", "Better structure prevention efforts"),
      text("Rendre le suivi plus visible et traçable", "Make monitoring more visible and traceable"),
      text("Identifier les gains rapides sans complexifier les équipes", "Identify quick wins without overcomplicating the teams"),
    ],
    cta: text("Réserver un audit IA Santé, social & bien-être", "Book a Health & Well-being AI audit"),
    emailSubject: text(
      "Audit IA gratuit - Structurer vos priorités en santé, prévention et HSE",
      "Free AI audit - Structure your health, prevention, and HSE priorities"
    ),
    emailPreheader: text(
      "Prévention, documentation, suivi et programmes santé : où l'IA peut-elle aider concrètement ?",
      "Prevention, documentation, monitoring, and health programs: where can AI help concretely?"
    ),
    emailBody: {
      intro: text(
        "Dans les fonctions santé, bien-être et HSE, l'IA peut soutenir l'analyse, la documentation et la coordination, à condition d'être cadrée sur les besoins réels.",
        "In health, well-being, and HSE functions, AI can support analysis, documentation, and coordination, provided it is framed around real needs."
      ),
      diagnostic: text(
        "L'audit IA gratuit permet de repérer les usages les plus utiles pour mieux suivre, mieux documenter et mieux piloter certains programmes ou obligations.",
        "The free AI audit identifies the most useful use cases for better monitoring, documentation, and management of programs and obligations."
      ),
      benefitsLead: text("L'objectif est de clarifier :", "The goal is to clarify:"),
      benefits: [
        text("où un copilote peut aider les équipes support", "where a copilot can support operational teams"),
        text("quels livrables peuvent être mieux préparés", "which deliverables can be better prepared"),
        text("comment entrer dans l'IA par des cas d'usage sobres mais utiles", "how to enter AI through sober but useful use cases"),
      ],
      close: text(
        "Cet audit permet d'avancer de façon pragmatique sur des enjeux sensibles.",
        "This audit helps you move pragmatically on sensitive topics."
      ),
    },
  },
  {
    key: "diplomacy-international-affairs",
    domain: text("Diplomatie & Affaires Internationales", "Diplomacy & International Affairs"),
    audience: text("Institutions, diplomatie, affaires publiques, international", "Institutions, diplomacy, public affairs, international functions"),
    whyAuditMatters: text(
      "L'audit aide à repérer comment l'IA peut renforcer la veille, la préparation de notes, l'analyse et les communications multilingues.",
      "The audit helps identify how AI can strengthen monitoring, note preparation, analysis, and multilingual communication."
    ),
    auditFocus: [
      text("Veille géopolitique, pays et secteurs", "Geopolitical, country, and sector monitoring"),
      text("Notes, briefings et préparation décisionnelle", "Notes, briefings, and decision preparation"),
      text("Communication multilingue et contexte international", "Multilingual communication and international context"),
    ],
    businessBenefits: [
      text("Accélérer les notes et synthèses", "Accelerate notes and syntheses"),
      text("Mieux structurer l'analyse stratégique", "Better structure strategic analysis"),
      text("Renforcer la préparation des messages et positions", "Strengthen message and position preparation"),
    ],
    cta: text("Réserver un audit IA Institutions", "Book an Institutional AI audit"),
    emailSubject: text(
      "Audit IA gratuit - Clarifier les usages IA pour les fonctions internationales",
      "Free AI audit - Clarify AI use cases for international functions"
    ),
    emailPreheader: text(
      "Veille, notes, analyse, communication multilingue : des gains concrets sont possibles.",
      "Monitoring, notes, analysis, and multilingual communication: concrete gains are possible."
    ),
    emailBody: {
      intro: text(
        "Dans les fonctions diplomatiques, institutionnelles et internationales, l'IA peut renforcer la qualité de préparation et la vitesse de synthèse si elle est bien cadrée.",
        "In diplomatic, institutional, and international roles, AI can strengthen preparation quality and synthesis speed if it is well framed."
      ),
      diagnostic: text(
        "L'audit IA gratuit permet de repérer les usages les plus crédibles pour la veille, les notes, l'analyse et la communication, sans fragiliser la rigueur attendue.",
        "The free AI audit identifies the most credible use cases for monitoring, notes, analysis, and communication without weakening the rigor expected."
      ),
      benefitsLead: text("Nous pouvons notamment clarifier :", "We can help clarify:"),
      benefits: [
        text("où accélérer la production de synthèses", "where to accelerate synthesis production"),
        text("quels workflows documentaires renforcer", "which document workflows to strengthen"),
        text("comment intégrer l'IA dans un cadre institutionnel exigeant", "how to integrate AI within a demanding institutional environment"),
      ],
      close: text(
        "Cet audit est utile pour entrer dans l'IA avec méthode, sérieux et maîtrise du contexte.",
        "This audit is useful for entering AI with structure, seriousness, and contextual awareness."
      ),
    },
  },
];

export const auditMessagesByDomain = new Map(auditDomainMessages.map((item) => [item.key, item]));
