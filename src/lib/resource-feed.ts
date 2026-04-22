export type ResourceCategoryKey = "expertise-ai" | "guides" | "case-studies" | "veille";

export type ResourceSource = {
  label: string;
  url: string;
  publisher?: string | null;
  publishedAt?: string | null;
};

export type ResourceFeedItem = {
  id: string;
  slug: string;
  categoryKey: ResourceCategoryKey;
  sectorKey: string | null;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  readTimeMinutes: number | null;
  publishedAt: string;
  sourceName: string | null;
  sourceUrl: string | null;
  tags: string[];
  isFeatured: boolean;
  isNewManual: boolean;
};

export type ResourcePost = ResourceFeedItem & {
  contentFr: string | null;
  contentEn: string | null;
  sources: ResourceSource[];
  seoTitleFr: string | null;
  seoTitleEn: string | null;
  seoDescriptionFr: string | null;
  seoDescriptionEn: string | null;
  coverImageUrl: string | null;
};

export const RESOURCE_NEW_WINDOW_DAYS = 14;

type EditorialSeed = {
  id: string;
  slug: string;
  categoryKey: ResourceCategoryKey;
  sectorKey: string;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  readTimeMinutes: number;
  publishedAt: string;
  tags: string[];
  isFeatured?: boolean;
  isNewManual?: boolean;
  challengeFr: string;
  challengeEn: string;
  interventionFr: string;
  interventionEn: string;
  impactFr: string;
  impactEn: string;
  nextStepFr: string;
  nextStepEn: string;
};

const aiStackFr =
  "OpenAI pour la production et l'analyse, Claude pour la synthèse longue et la qualité rédactionnelle, Gemini pour l'ancrage documentaire et Google Workspace, Copilot pour l'intégration Microsoft 365.";

const aiStackEn =
  "OpenAI for production and analysis, Claude for long-form synthesis and editorial quality, Gemini for document grounding and Google Workspace, Copilot for Microsoft 365 integration.";

const caseStudySeeds: EditorialSeed[] = [
  {
    id: "case-ci-assistanat-comex",
    slug: "cas-assistanat-comex-abidjan-ia",
    categoryKey: "case-studies",
    sectorKey: "Assistanat & Secrétariat",
    titleFr: "Cas d'étude : une direction générale à Abidjan gagne 6 heures par semaine avec l'IA",
    titleEn: "Case study: an Abidjan executive office saves 6 hours per week with AI",
    excerptFr: "Comment une équipe d'assistanat structure comptes rendus, agendas et relances sans perdre le contrôle humain.",
    excerptEn: "How an executive support team structures minutes, agendas and follow-ups without losing human control.",
    readTimeMinutes: 7,
    publishedAt: "2026-04-22T09:00:00.000Z",
    tags: ["assistanat", "abidjan", "productivite", "prompt"],
    isFeatured: true,
    isNewManual: true,
    challengeFr: "Les réunions s'enchaînaient, les comptes rendus arrivaient tard et les décisions se perdaient entre WhatsApp, email et documents Word.",
    challengeEn: "Meetings piled up, minutes arrived late, and decisions were scattered across WhatsApp, email and Word documents.",
    interventionFr: "TransferAI propose un workflow simple : modèle de compte rendu, prompt de synthèse, tableau de décisions et relances hebdomadaires validées par l'assistante.",
    interventionEn: "TransferAI recommends a simple workflow: minutes template, synthesis prompt, decision tracker and weekly follow-ups validated by the assistant.",
    impactFr: "Le gain attendu est immédiat : moins de reprise manuelle, meilleure traçabilité et une assistante repositionnée comme coordinatrice de l'exécution.",
    impactEn: "The expected gain is immediate: less manual rework, better traceability and an assistant repositioned as an execution coordinator.",
    nextStepFr: "Former les assistantes au prompt de compte rendu, puis connecter progressivement agenda, email et suivi des actions.",
    nextStepEn: "Train assistants on meeting-minutes prompts, then progressively connect calendar, email and action tracking.",
  },
  {
    id: "case-ci-rh-recrutement",
    slug: "cas-rh-recrutement-ia-cote-divoire",
    categoryKey: "case-studies",
    sectorKey: "RH & Gestion des talents",
    titleFr: "Cas d'étude : un service RH ivoirien accélère le tri des candidatures sans automatiser la décision",
    titleEn: "Case study: an Ivorian HR team accelerates screening without automating decisions",
    excerptFr: "Un modèle responsable pour analyser CV, fiches de poste et grilles d'entretien tout en gardant la décision côté RH.",
    excerptEn: "A responsible model for analysing resumes, job descriptions and interview grids while keeping decisions with HR.",
    readTimeMinutes: 7,
    publishedAt: "2026-04-22T09:05:00.000Z",
    tags: ["rh", "recrutement", "cote-divoire", "gouvernance"],
    isFeatured: true,
    isNewManual: true,
    challengeFr: "Les recruteurs perdaient du temps sur le tri initial et manquaient d'une grille homogène pour comparer les profils.",
    challengeEn: "Recruiters were losing time on initial screening and lacked a consistent grid for comparing profiles.",
    interventionFr: "L'IA est utilisée pour résumer les CV, repérer les écarts avec le poste, préparer les questions et signaler les points à vérifier, jamais pour choisir à la place du recruteur.",
    interventionEn: "AI is used to summarize resumes, identify gaps with the role, prepare questions and flag points to verify, never to choose instead of the recruiter.",
    impactFr: "La fonction RH gagne en vitesse et en qualité de préparation, avec une méthode plus traçable et plus défendable.",
    impactEn: "HR gains speed and preparation quality, with a more traceable and defensible method.",
    nextStepFr: "Installer une charte d'usage IA RH, standardiser les prompts et former les managers aux limites de l'outil.",
    nextStepEn: "Set up an HR AI usage charter, standardize prompts and train managers on tool limitations.",
  },
  {
    id: "case-ci-marketing-lancement",
    slug: "cas-marketing-lancement-produit-ia-abidjan",
    categoryKey: "case-studies",
    sectorKey: "Marketing & Communication IA",
    titleFr: "Cas d'étude : lancer une campagne locale en 72 heures avec IA, sans sacrifier la marque",
    titleEn: "Case study: launching a local campaign in 72 hours with AI without weakening the brand",
    excerptFr: "Une méthode pour passer du brief à Facebook, Reels, TikTok et email avec une ligne éditoriale cohérente.",
    excerptEn: "A method to move from brief to Facebook, Reels, TikTok and email with a consistent editorial line.",
    readTimeMinutes: 6,
    publishedAt: "2026-04-22T09:10:00.000Z",
    tags: ["marketing", "reels", "tiktok", "abidjan"],
    isFeatured: true,
    isNewManual: true,
    challengeFr: "Les équipes produisaient beaucoup de contenus, mais les messages étaient dispersés et rarement reliés à une logique de conversion.",
    challengeEn: "Teams produced many assets, but messages were scattered and rarely connected to conversion logic.",
    interventionFr: "Le workflow combine persona, promesse, calendrier éditorial, scripts courts, variantes visuelles et tableau de suivi des performances.",
    interventionEn: "The workflow combines persona, promise, editorial calendar, short scripts, visual variants and a performance tracking board.",
    impactFr: "L'équipe publie plus vite, teste mieux les messages et relie chaque contenu à une action : inscription, demande d'audit ou prise de contact.",
    impactEn: "The team publishes faster, tests messages better and connects each asset to an action: registration, audit request or contact.",
    nextStepFr: "Créer une bibliothèque de prompts de marque et une grille de validation avant publication.",
    nextStepEn: "Create a brand prompt library and a validation checklist before publication.",
  },
  {
    id: "case-ci-finance-reporting",
    slug: "cas-finance-reporting-pme-ia-afrique-ouest",
    categoryKey: "case-studies",
    sectorKey: "Finance & Fintech",
    titleFr: "Cas d'étude : une PME réduit le temps de reporting financier avec un copilote IA",
    titleEn: "Case study: an SME reduces financial reporting time with an AI copilot",
    excerptFr: "De la consolidation Excel à la note de gestion : comment structurer un reporting plus rapide et plus lisible.",
    excerptEn: "From Excel consolidation to management memo: how to structure faster and clearer reporting.",
    readTimeMinutes: 7,
    publishedAt: "2026-04-22T09:15:00.000Z",
    tags: ["finance", "reporting", "pme", "copilot"],
    isNewManual: true,
    challengeFr: "Le reporting dépendait de fichiers multiples, de commentaires manuels et d'analyses produites trop tard pour guider les décisions.",
    challengeEn: "Reporting depended on multiple files, manual comments and analyses produced too late to guide decisions.",
    interventionFr: "L'équipe standardise les tableaux, automatise les commentaires de variation et transforme les chiffres en note de pilotage validée par le responsable financier.",
    interventionEn: "The team standardizes tables, automates variance commentary and turns numbers into a management note validated by the finance lead.",
    impactFr: "La direction lit plus vite les écarts, les risques et les décisions à prendre, sans abandonner le contrôle comptable.",
    impactEn: "Leadership reads variances, risks and decisions faster without abandoning accounting control.",
    nextStepFr: "Identifier trois rapports récurrents et créer un modèle de commentaire financier vérifiable.",
    nextStepEn: "Identify three recurring reports and create a verifiable financial commentary template.",
  },
  {
    id: "case-ci-agrotech-cooperative",
    slug: "cas-agrotech-cooperative-cacao-ia",
    categoryKey: "case-studies",
    sectorKey: "Agriculture & AgroTech IA",
    titleFr: "Cas d'étude : une coopérative cacao structure sa donnée terrain avant l'IA",
    titleEn: "Case study: a cocoa cooperative structures field data before AI",
    excerptFr: "Pourquoi la vraie transformation commence par les fiches producteurs, la traçabilité et les alertes simples.",
    excerptEn: "Why real transformation starts with producer records, traceability and simple alerts.",
    readTimeMinutes: 6,
    publishedAt: "2026-04-22T09:20:00.000Z",
    tags: ["agriculture", "cacao", "tracabilite", "cooperative"],
    isNewManual: true,
    challengeFr: "La coopérative voulait de la prédiction, mais ses données producteurs, parcelles et livraisons restaient incomplètes.",
    challengeEn: "The cooperative wanted prediction, but producer, plot and delivery data remained incomplete.",
    interventionFr: "Le premier chantier consiste à harmoniser les données, produire des alertes simples et former les agents terrain à la saisie utile.",
    interventionEn: "The first step is to harmonize data, produce simple alerts and train field agents on useful data capture.",
    impactFr: "Avant même les modèles avancés, la coopérative gagne en traçabilité, en crédibilité commerciale et en pilotage terrain.",
    impactEn: "Before advanced models, the cooperative gains traceability, commercial credibility and field steering.",
    nextStepFr: "Cartographier les données critiques puis tester un tableau de bord de suivi des livraisons.",
    nextStepEn: "Map critical data, then test a delivery tracking dashboard.",
  },
  {
    id: "case-africa-education-centre",
    slug: "cas-edtech-centre-formation-abidjan-ia",
    categoryKey: "case-studies",
    sectorKey: "Éducation & EdTech IA",
    titleFr: "Cas d'étude : un centre de formation transforme ses cours en parcours IA personnalisés",
    titleEn: "Case study: a training centre turns courses into personalized AI learning paths",
    excerptFr: "Une approche pragmatique pour créer quiz, cas pratiques et supports adaptés aux niveaux des apprenants.",
    excerptEn: "A pragmatic approach to create quizzes, practical cases and materials adapted to learner levels.",
    readTimeMinutes: 6,
    publishedAt: "2026-04-22T09:25:00.000Z",
    tags: ["edtech", "formation", "pedagogie", "abidjan"],
    isNewManual: true,
    challengeFr: "Les formateurs répétaient les mêmes explications et manquaient de temps pour adapter les supports aux écarts de niveau.",
    challengeEn: "Trainers repeated the same explanations and lacked time to adapt materials to level gaps.",
    interventionFr: "L'IA sert à générer variantes d'exercices, quiz de diagnostic, études de cas locales et feedbacks structurés.",
    interventionEn: "AI generates exercise variants, diagnostic quizzes, local case studies and structured feedback.",
    impactFr: "Le centre augmente la qualité perçue et peut mieux accompagner les apprenants en reconversion.",
    impactEn: "The centre improves perceived quality and better supports career-transition learners.",
    nextStepFr: "Créer une matrice objectifs-compétences-prompts pour chaque module prioritaire.",
    nextStepEn: "Create an objectives-skills-prompts matrix for each priority module.",
  },
  {
    id: "case-africa-sante-triage",
    slug: "cas-sante-documentation-clinique-ia",
    categoryKey: "case-studies",
    sectorKey: "Santé & IA médicale",
    titleFr: "Cas d'étude : améliorer la documentation clinique sans remplacer le professionnel de santé",
    titleEn: "Case study: improving clinical documentation without replacing health professionals",
    excerptFr: "Un usage prudent de l'IA pour résumer, classer et préparer les informations sous validation humaine.",
    excerptEn: "A careful AI use case to summarize, classify and prepare information under human validation.",
    readTimeMinutes: 7,
    publishedAt: "2026-04-22T09:30:00.000Z",
    tags: ["sante", "documentation", "triage", "garde-fous"],
    isNewManual: true,
    challengeFr: "Les équipes médicales manquaient de temps pour produire des notes complètes et homogènes après les interactions patients.",
    challengeEn: "Medical teams lacked time to produce complete and consistent notes after patient interactions.",
    interventionFr: "L'IA est limitée à la structuration documentaire : résumé, éléments manquants, questions de clarification et formatage standard.",
    interventionEn: "AI is limited to documentation structuring: summary, missing elements, clarification questions and standard formatting.",
    impactFr: "La qualité administrative progresse, tout en maintenant la validation clinique et les obligations de confidentialité.",
    impactEn: "Administrative quality improves while preserving clinical validation and confidentiality duties.",
    nextStepFr: "Définir les données interdites, les règles de validation et les cas où l'IA ne doit pas être utilisée.",
    nextStepEn: "Define prohibited data, validation rules and cases where AI must not be used.",
  },
  {
    id: "case-ci-logistique-distribution",
    slug: "cas-logistique-distribution-abidjan-ia",
    categoryKey: "case-studies",
    sectorKey: "Logistique & Supply Chain",
    titleFr: "Cas d'étude : optimiser les tournées de distribution entre Abidjan et l'intérieur du pays",
    titleEn: "Case study: optimizing distribution routes from Abidjan to inland cities",
    excerptFr: "Un cas concret pour prioriser les livraisons, réduire les retards et mieux prévoir les ruptures.",
    excerptEn: "A concrete case to prioritize deliveries, reduce delays and better anticipate stockouts.",
    readTimeMinutes: 6,
    publishedAt: "2026-04-22T09:35:00.000Z",
    tags: ["logistique", "supply-chain", "distribution", "abidjan"],
    isNewManual: true,
    challengeFr: "Les retards venaient moins du transport que d'une mauvaise visibilité sur priorités, stocks et contraintes terrain.",
    challengeEn: "Delays came less from transport itself than from poor visibility on priorities, stocks and field constraints.",
    interventionFr: "Un assistant IA exploite commandes, historique, contraintes et incidents pour proposer des priorités de tournée compréhensibles.",
    interventionEn: "An AI assistant uses orders, history, constraints and incidents to propose understandable route priorities.",
    impactFr: "La supply chain gagne en anticipation et les commerciaux disposent d'explications plus claires face aux clients.",
    impactEn: "Supply chain gains anticipation and sales teams have clearer explanations for customers.",
    nextStepFr: "Démarrer par les dix tournées les plus critiques avant toute automatisation avancée.",
    nextStepEn: "Start with the ten most critical routes before any advanced automation.",
  },
  {
    id: "case-africa-energie-maintenance",
    slug: "cas-energie-maintenance-predictive-ia-afrique",
    categoryKey: "case-studies",
    sectorKey: "Énergie & Transition énergétique",
    titleFr: "Cas d'étude : passer d'une maintenance réactive à une maintenance assistée par IA",
    titleEn: "Case study: moving from reactive maintenance to AI-assisted maintenance",
    excerptFr: "Comment exploiter incidents, capteurs et rapports techniques pour réduire les interruptions.",
    excerptEn: "How to use incidents, sensors and technical reports to reduce interruptions.",
    readTimeMinutes: 6,
    publishedAt: "2026-04-22T09:40:00.000Z",
    tags: ["energie", "maintenance", "transition", "predictif"],
    isNewManual: true,
    challengeFr: "Les interventions étaient documentées, mais l'information restait dispersée et peu utilisée pour anticiper les pannes.",
    challengeEn: "Interventions were documented, but information remained scattered and underused for anticipating failures.",
    interventionFr: "L'IA classe les incidents, détecte les répétitions et prépare une liste de risques à vérifier par les techniciens.",
    interventionEn: "AI classifies incidents, detects repetition and prepares a risk list for technicians to verify.",
    impactFr: "Les équipes passent d'un reporting passif à une logique de prévention mesurable.",
    impactEn: "Teams move from passive reporting to measurable prevention.",
    nextStepFr: "Nettoyer l'historique d'interventions et construire une taxonomie simple des incidents.",
    nextStepEn: "Clean intervention history and build a simple incident taxonomy.",
  },
  {
    id: "case-ci-legal-contrats",
    slug: "cas-legaltech-revue-contrats-ia-cote-divoire",
    categoryKey: "case-studies",
    sectorKey: "Droit & LegalTech IA",
    titleFr: "Cas d'étude : accélérer la revue de contrats commerciaux avec une IA contrôlée",
    titleEn: "Case study: accelerating commercial contract review with controlled AI",
    excerptFr: "Une méthode pour extraire clauses, risques et questions à poser sans déléguer l'avis juridique.",
    excerptEn: "A method to extract clauses, risks and questions without delegating legal advice.",
    readTimeMinutes: 7,
    publishedAt: "2026-04-22T09:45:00.000Z",
    tags: ["legaltech", "contrats", "conformite", "cote-divoire"],
    isNewManual: true,
    challengeFr: "Les juristes traitaient des volumes croissants de documents avec un risque de fatigue et d'incohérence.",
    challengeEn: "Legal teams handled growing document volumes with fatigue and consistency risks.",
    interventionFr: "L'IA prépare une fiche de revue : parties, obligations, dates, clauses sensibles, manques et questions à valider.",
    interventionEn: "AI prepares a review sheet: parties, obligations, dates, sensitive clauses, gaps and questions to validate.",
    impactFr: "Le juriste gagne du temps sur l'extraction et se concentre sur l'analyse, la négociation et la responsabilité finale.",
    impactEn: "The lawyer saves extraction time and focuses on analysis, negotiation and final responsibility.",
    nextStepFr: "Constituer une bibliothèque de clauses types et une liste de risques récurrents.",
    nextStepEn: "Build a clause library and a list of recurring risks.",
  },
  {
    id: "case-ci-immobilier-leads",
    slug: "cas-immobilier-leads-annonces-ia-abidjan",
    categoryKey: "case-studies",
    sectorKey: "Immobilier & Smart City",
    titleFr: "Cas d'étude : qualifier les leads immobiliers et produire des annonces plus performantes",
    titleEn: "Case study: qualifying real estate leads and producing stronger listings",
    excerptFr: "Comment une agence peut utiliser l'IA pour mieux répondre, classer les demandes et améliorer ses annonces.",
    excerptEn: "How an agency can use AI to respond better, classify requests and improve listings.",
    readTimeMinutes: 6,
    publishedAt: "2026-04-22T09:50:00.000Z",
    tags: ["immobilier", "leads", "annonces", "abidjan"],
    isNewManual: true,
    challengeFr: "Les demandes entraient par plusieurs canaux et les annonces ne répondaient pas toujours aux questions réelles des prospects.",
    challengeEn: "Requests came through several channels and listings did not always answer prospects' real questions.",
    interventionFr: "L'IA trie les prospects, propose des réponses, transforme les caractéristiques en annonces claires et signale les informations manquantes.",
    interventionEn: "AI sorts prospects, suggests responses, turns features into clear listings and flags missing information.",
    impactFr: "L'agence répond plus vite, améliore la qualité des annonces et réduit les échanges inutiles.",
    impactEn: "The agency responds faster, improves listing quality and reduces unnecessary back-and-forth.",
    nextStepFr: "Créer un formulaire de qualification et un modèle d'annonce adapté aux quartiers ciblés.",
    nextStepEn: "Create a qualification form and a listing template adapted to target neighborhoods.",
  },
  {
    id: "case-ci-tourisme-hospitalite",
    slug: "cas-tourisme-hospitalite-service-client-ia",
    categoryKey: "case-studies",
    sectorKey: "Tourisme & Hospitalité",
    titleFr: "Cas d'étude : améliorer l'expérience client hôtel avec un assistant IA multicanal",
    titleEn: "Case study: improving hotel guest experience with a multichannel AI assistant",
    excerptFr: "Un modèle simple pour traiter FAQ, recommandations locales et demandes répétitives avec validation humaine.",
    excerptEn: "A simple model for FAQs, local recommendations and repetitive requests with human validation.",
    readTimeMinutes: 6,
    publishedAt: "2026-04-22T09:55:00.000Z",
    tags: ["tourisme", "hotel", "experience-client", "hospitalite"],
    isNewManual: true,
    challengeFr: "Les équipes d'accueil répondaient aux mêmes questions sur horaires, services, transport et recommandations locales.",
    challengeEn: "Front-desk teams answered the same questions about hours, services, transport and local recommendations.",
    interventionFr: "Un assistant IA documenté sur les services de l'établissement prépare réponses, messages WhatsApp et suggestions, avec escalade vers l'humain.",
    interventionEn: "An AI assistant grounded in hotel services prepares answers, WhatsApp messages and suggestions, with escalation to humans.",
    impactFr: "Le service devient plus réactif et les équipes se concentrent sur les situations à forte valeur relationnelle.",
    impactEn: "Service becomes more responsive and teams focus on high-value relationship moments.",
    nextStepFr: "Créer une base FAQ validée et mesurer les demandes réellement répétitives.",
    nextStepEn: "Create a validated FAQ base and measure truly repetitive requests.",
  },
  {
    id: "case-africa-media-newsroom",
    slug: "cas-medias-redaction-ia-afrique-francophone",
    categoryKey: "case-studies",
    sectorKey: "Médias & Création de contenu",
    titleFr: "Cas d'étude : une rédaction produit plus vite sans automatiser l'opinion",
    titleEn: "Case study: a newsroom produces faster without automating judgment",
    excerptFr: "Recherche, angles, scripts courts et republication : où l'IA aide vraiment les médias africains.",
    excerptEn: "Research, angles, short scripts and republishing: where AI truly helps African media.",
    readTimeMinutes: 6,
    publishedAt: "2026-04-22T10:00:00.000Z",
    tags: ["medias", "contenu", "redaction", "afrique"],
    isNewManual: true,
    challengeFr: "Les équipes de contenu devaient publier vite sur plusieurs formats sans diluer la qualité éditoriale.",
    challengeEn: "Content teams had to publish fast across formats without diluting editorial quality.",
    interventionFr: "L'IA soutient la recherche, la structuration, les variantes de titres et l'adaptation multi-format, mais la ligne éditoriale reste humaine.",
    interventionEn: "AI supports research, structuring, headline variants and multi-format adaptation, while editorial judgment stays human.",
    impactFr: "La rédaction augmente sa cadence tout en gardant une validation claire des sources, angles et messages sensibles.",
    impactEn: "The newsroom increases cadence while keeping clear validation of sources, angles and sensitive messages.",
    nextStepFr: "Formaliser une charte IA média : sources, vérification, droits, transparence et responsabilité.",
    nextStepEn: "Formalize a media AI charter: sources, verification, rights, transparency and responsibility.",
  },
  {
    id: "case-ci-administration-dossiers",
    slug: "cas-administration-dossiers-ia-cote-divoire",
    categoryKey: "case-studies",
    sectorKey: "Administration & Gestion",
    titleFr: "Cas d'étude : fluidifier le traitement des dossiers administratifs avec l'IA",
    titleEn: "Case study: streamlining administrative file processing with AI",
    excerptFr: "Une méthode pour classer, résumer et suivre les dossiers sans perdre la rigueur documentaire.",
    excerptEn: "A method to classify, summarize and track files without losing documentary rigor.",
    readTimeMinutes: 6,
    publishedAt: "2026-04-22T10:05:00.000Z",
    tags: ["administration", "gestion", "dossiers", "cote-divoire"],
    isNewManual: true,
    challengeFr: "Les dossiers circulaient lentement, avec des pièces manquantes repérées tardivement et peu de visibilité sur les blocages.",
    challengeEn: "Files moved slowly, with missing documents identified late and little visibility on bottlenecks.",
    interventionFr: "L'IA prépare une fiche dossier, signale les manques, propose une synthèse et alimente un suivi d'avancement.",
    interventionEn: "AI prepares a file sheet, flags gaps, proposes a summary and feeds progress tracking.",
    impactFr: "Les équipes réduisent les reprises et donnent aux responsables une vision plus claire des décisions en attente.",
    impactEn: "Teams reduce rework and give managers clearer visibility on pending decisions.",
    nextStepFr: "Choisir un processus prioritaire et créer une checklist numérique unique.",
    nextStepEn: "Choose one priority process and create a single digital checklist.",
  },
  {
    id: "case-africa-management-comex",
    slug: "cas-management-comex-roadmap-ia-afrique",
    categoryKey: "case-studies",
    sectorKey: "Management & Leadership",
    titleFr: "Cas d'étude : un comité de direction transforme la veille IA en feuille de route",
    titleEn: "Case study: an executive committee turns AI watch into a roadmap",
    excerptFr: "Comment prioriser trois cas d'usage, éviter la dispersion et mesurer les gains attendus.",
    excerptEn: "How to prioritize three use cases, avoid dispersion and measure expected gains.",
    readTimeMinutes: 7,
    publishedAt: "2026-04-22T10:10:00.000Z",
    tags: ["management", "leadership", "roadmap", "gouvernance"],
    isNewManual: true,
    challengeFr: "La direction voulait lancer l'IA partout, mais sans arbitrage clair entre productivité, risque et capacité interne.",
    challengeEn: "Leadership wanted to launch AI everywhere, but without clear trade-offs between productivity, risk and internal capacity.",
    interventionFr: "TransferAI recommande une matrice impact-effort-risque, trois pilotes de 30 jours et un référent IA par direction.",
    interventionEn: "TransferAI recommends an impact-effort-risk matrix, three 30-day pilots and one AI referent per department.",
    impactFr: "La décision devient plus lisible : l'organisation apprend vite sans multiplier les outils inutiles.",
    impactEn: "Decision-making becomes clearer: the organization learns fast without multiplying useless tools.",
    nextStepFr: "Organiser un atelier de cadrage avec les managers et choisir les trois pilotes les plus mesurables.",
    nextStepEn: "Run a framing workshop with managers and choose the three most measurable pilots.",
  },
];

const expertiseSeeds: EditorialSeed[] = [
  {
    id: "expertise-ci-prompt-systeme-metier",
    slug: "expertise-prompt-systeme-metier-cote-divoire",
    categoryKey: "expertise-ai",
    sectorKey: "IT & Transformation Digitale",
    titleFr: "Expertise IA : pourquoi les entreprises ivoiriennes doivent passer du prompt isolé au système métier",
    titleEn: "AI expertise: why Ivorian companies must move from isolated prompts to business systems",
    excerptFr: "La valeur ne vient plus du prompt magique, mais du processus, des données, des validations et des outils connectés.",
    excerptEn: "Value no longer comes from magic prompts, but from process, data, validation and connected tools.",
    readTimeMinutes: 8,
    publishedAt: "2026-04-22T10:15:00.000Z",
    tags: ["expertise", "transformation-digitale", "openai", "claude", "gemini", "copilot"],
    isFeatured: true,
    isNewManual: true,
    challengeFr: "Beaucoup d'équipes testent ChatGPT ou Copilot individuellement, mais les gains restent invisibles parce que rien n'est relié aux processus métiers.",
    challengeEn: "Many teams test ChatGPT or Copilot individually, but gains remain invisible because nothing is connected to business processes.",
    interventionFr: "La bonne approche consiste à définir les cas d'usage, choisir le modèle adapté, préparer les données, documenter les prompts et organiser la validation humaine.",
    interventionEn: "The right approach is to define use cases, choose the right model, prepare data, document prompts and organize human validation.",
    impactFr: "L'entreprise passe d'une expérimentation dispersée à une capacité IA mesurable, gouvernée et transmissible.",
    impactEn: "The company moves from scattered experimentation to measurable, governed and transferable AI capability.",
    nextStepFr: `Comparer les usages entre ${aiStackFr}`,
    nextStepEn: `Compare uses across ${aiStackEn}`,
  },
  {
    id: "expertise-ci-secretariat-augmentee",
    slug: "expertise-secretariat-augmente-ia-cote-divoire",
    categoryKey: "expertise-ai",
    sectorKey: "Assistanat & Secrétariat",
    titleFr: "Expertise IA : le secrétariat augmenté devient un poste stratégique",
    titleEn: "AI expertise: augmented executive support becomes a strategic role",
    excerptFr: "Compte rendu, relance, agenda, synthèse : les assistantes peuvent devenir les gardiennes de l'exécution.",
    excerptEn: "Minutes, follow-ups, calendar, synthesis: assistants can become guardians of execution.",
    readTimeMinutes: 7,
    publishedAt: "2026-04-22T10:20:00.000Z",
    tags: ["assistanat", "secretariat", "productivite", "ia-metier"],
    isFeatured: true,
    isNewManual: true,
    challengeFr: "Le poste reste souvent perçu comme administratif alors qu'il concentre agenda, information, décisions et coordination.",
    challengeEn: "The role is often seen as administrative although it concentrates calendar, information, decisions and coordination.",
    interventionFr: "L'IA permet de standardiser les livrables récurrents : notes, comptes rendus, courriers, relances, briefs et synthèses.",
    interventionEn: "AI helps standardize recurring deliverables: notes, minutes, letters, follow-ups, briefs and summaries.",
    impactFr: "L'assistante ne fait pas seulement plus vite : elle sécurise la mémoire opérationnelle de la direction.",
    impactEn: "The assistant does not only work faster: she secures the operational memory of leadership.",
    nextStepFr: "Former sur trois prompts critiques : compte rendu, agenda priorisé et email professionnel.",
    nextStepEn: "Train on three critical prompts: minutes, prioritized agenda and professional email.",
  },
  {
    id: "expertise-africa-rh-responsable",
    slug: "expertise-rh-ia-responsable-afrique-francophone",
    categoryKey: "expertise-ai",
    sectorKey: "RH & Gestion des talents",
    titleFr: "Expertise IA : les RH africaines doivent adopter l'IA sans créer de boîte noire",
    titleEn: "AI expertise: African HR must adopt AI without creating a black box",
    excerptFr: "Recruter, former et cartographier les compétences avec l'IA exige méthode, transparence et supervision humaine.",
    excerptEn: "Recruiting, training and skills mapping with AI requires method, transparency and human supervision.",
    readTimeMinutes: 8,
    publishedAt: "2026-04-22T10:25:00.000Z",
    tags: ["rh", "gouvernance", "competences", "afrique"],
    isFeatured: true,
    isNewManual: true,
    challengeFr: "L'IA peut accélérer le sourcing et la formation, mais elle peut aussi amplifier des biais si les règles ne sont pas explicites.",
    challengeEn: "AI can accelerate sourcing and training, but it can also amplify bias if rules are not explicit.",
    interventionFr: "La méthode TransferAI sépare assistance, recommandation et décision. Les critères restent documentés et la validation finale reste humaine.",
    interventionEn: "TransferAI's method separates assistance, recommendation and decision. Criteria remain documented and final validation stays human.",
    impactFr: "Les RH gagnent en vitesse sans perdre la confiance, élément central du marché du travail africain.",
    impactEn: "HR gains speed without losing trust, a central issue in African labor markets.",
    nextStepFr: "Construire une charte IA RH avant de déployer les outils.",
    nextStepEn: "Build an HR AI charter before deploying tools.",
  },
];

const generatedExpertiseSeeds: EditorialSeed[] = caseStudySeeds
  .filter((caseSeed) => !expertiseSeeds.some((expertiseSeed) => expertiseSeed.sectorKey === caseSeed.sectorKey))
  .map((caseSeed, index) => ({
    ...caseSeed,
    id: caseSeed.id.replace("case-", "expertise-"),
    slug: caseSeed.slug.replace("cas-", "expertise-"),
    categoryKey: "expertise-ai",
    titleFr: `Expertise IA : ce que ${caseSeed.sectorKey} doit automatiser en priorité en Côte d'Ivoire`,
    titleEn: `AI expertise: what ${caseSeed.sectorKey} should automate first in Côte d'Ivoire`,
    excerptFr: `Une lecture métier pour transformer les usages IA de ${caseSeed.sectorKey} en gains concrets, mesurables et gouvernés.`,
    excerptEn: `A business-focused view to turn AI use cases in ${caseSeed.sectorKey} into concrete, measurable and governed gains.`,
    publishedAt: `2026-04-22T10:${String(30 + index).padStart(2, "0")}:00.000Z`,
    tags: [...new Set(["expertise", "ia-metier", ...caseSeed.tags])],
    isFeatured: index < 3,
    challengeFr: `Dans ${caseSeed.sectorKey}, le risque principal n'est pas de manquer d'outils IA. Le vrai risque est d'automatiser sans méthode, sans données fiables et sans validation humaine.`,
    challengeEn: `In ${caseSeed.sectorKey}, the main risk is not lacking AI tools. The real risk is automating without method, reliable data and human validation.`,
    interventionFr: `L'approche recommandée consiste à partir d'un processus répétitif, formaliser le livrable attendu, choisir entre ${aiStackFr}, puis tester sur un cas réel avant de déployer.`,
    interventionEn: `The recommended approach starts from one repetitive process, formalizes the expected deliverable, chooses between ${aiStackEn}, then tests on a real case before deployment.`,
    impactFr: "Les gains deviennent visibles lorsque l'IA est reliée à un indicateur simple : temps gagné, erreurs évitées, délai réduit, qualité documentaire ou taux de conversion.",
    impactEn: "Gains become visible when AI is connected to a simple indicator: time saved, errors avoided, shorter delays, documentation quality or conversion rate.",
    nextStepFr: "Choisir un cas d'usage en 30 minutes, écrire le prompt de référence, produire un premier livrable et documenter les règles de validation.",
    nextStepEn: "Choose one use case in 30 minutes, write the reference prompt, produce a first deliverable and document validation rules.",
  }));

const buildEditorialContent = (seed: EditorialSeed, language: "fr" | "en") => {
  if (language === "en") {
    const isCaseStudy = seed.categoryKey === "case-studies";

    return [
      seed.excerptEn,
      isCaseStudy ? "Context" : "Why this matters",
      seed.challengeEn,
      isCaseStudy ? "TransferAI approach" : "Recommended operating model",
      seed.interventionEn,
      "Expected impact",
      seed.impactEn,
      "What to do next",
      seed.nextStepEn,
    ].join("\n\n");
  }

  const isCaseStudy = seed.categoryKey === "case-studies";

  return [
    seed.excerptFr,
    isCaseStudy ? "Contexte" : "Pourquoi ce sujet compte",
    seed.challengeFr,
    isCaseStudy ? "Approche TransferAI" : "Modèle opérationnel recommandé",
    seed.interventionFr,
    "Impact attendu",
    seed.impactFr,
    "Prochaine action",
    seed.nextStepFr,
  ].join("\n\n");
};

const editorialSeedItems: ResourcePost[] = [...caseStudySeeds, ...expertiseSeeds, ...generatedExpertiseSeeds].map((seed) => ({
  id: seed.id,
  slug: seed.slug,
  categoryKey: seed.categoryKey,
  sectorKey: seed.sectorKey,
  titleFr: seed.titleFr,
  titleEn: seed.titleEn,
  excerptFr: seed.excerptFr,
  excerptEn: seed.excerptEn,
  contentFr: buildEditorialContent(seed, "fr"),
  contentEn: buildEditorialContent(seed, "en"),
  readTimeMinutes: seed.readTimeMinutes,
  publishedAt: seed.publishedAt,
  sourceName: "TransferAI Africa",
  sourceUrl: null,
  tags: seed.tags,
  isFeatured: Boolean(seed.isFeatured),
  isNewManual: Boolean(seed.isNewManual),
  sources: [],
  seoTitleFr: `${seed.titleFr} | TransferAI Africa`,
  seoTitleEn: `${seed.titleEn} | TransferAI Africa`,
  seoDescriptionFr: seed.excerptFr,
  seoDescriptionEn: seed.excerptEn,
  coverImageUrl: null,
}));

export const resourceFeedFallback: ResourceFeedItem[] = [
  ...editorialSeedItems,
  {
    id: "resource-assistant-africa",
    slug: "ia-assistants-direction-afrique",
    categoryKey: "expertise-ai",
    sectorKey: "Assistanat & Secrétariat",
    titleFr: "Comment l'IA révolutionne le métier d'assistant de direction en Afrique",
    titleEn: "How AI is transforming executive assistant roles across Africa",
    excerptFr: "Découvrez comment les outils d'IA transforment les tâches quotidiennes des assistants et secrétaires de direction.",
    excerptEn: "See how AI tools are reshaping the daily work of executive assistants and administrative professionals.",
    readTimeMinutes: 5,
    publishedAt: "2026-03-02T09:00:00.000Z",
    sourceName: "TransferAI Africa",
    sourceUrl: null,
    tags: ["chatgpt", "productivite", "assistanat"],
    isFeatured: true,
    isNewManual: false,
  },
  {
    id: "resource-chatgpt-sme",
    slug: "chatgpt-entreprise-guide-pme-africaines",
    categoryKey: "guides",
    sectorKey: "Administration & Gestion",
    titleFr: "ChatGPT en entreprise : guide pratique pour les PME africaines",
    titleEn: "ChatGPT in business: a practical guide for African SMEs",
    excerptFr: "Un guide étape par étape pour intégrer ChatGPT dans vos processus d'entreprise, avec des cas d'usage concrets.",
    excerptEn: "A step-by-step guide to integrating ChatGPT into your business processes with concrete business use cases.",
    readTimeMinutes: 8,
    publishedAt: "2026-02-25T09:00:00.000Z",
    sourceName: "TransferAI Africa",
    sourceUrl: null,
    tags: ["chatgpt", "pme", "processus"],
    isFeatured: true,
    isNewManual: false,
  },
  {
    id: "resource-recruitment-ci",
    slug: "recrutement-ia-drh-africains",
    categoryKey: "case-studies",
    sectorKey: "Ressources Humaines",
    titleFr: "Recrutement et IA : comment les DRH africains s'adaptent",
    titleEn: "Recruitment and AI: how African HR leaders are adapting",
    excerptFr: "Étude de cas sur l'utilisation de l'IA dans le recrutement au sein de grandes entreprises ivoiriennes.",
    excerptEn: "A case study on how major Ivorian companies are using AI in recruitment workflows.",
    readTimeMinutes: 6,
    publishedAt: "2026-02-18T09:00:00.000Z",
    sourceName: "TransferAI Africa",
    sourceUrl: null,
    tags: ["rh", "recrutement", "cote-divoire"],
    isFeatured: false,
    isNewManual: false,
  },
  {
    id: "resource-roi-training",
    slug: "mesurer-roi-formation-ia-entreprise",
    categoryKey: "guides",
    sectorKey: "Management & Leadership",
    titleFr: "Mesurer le ROI de la formation IA en entreprise",
    titleEn: "Measuring the ROI of AI training in business",
    excerptFr: "Méthodologie et indicateurs clés pour évaluer l'impact de vos investissements en formation IA.",
    excerptEn: "Methodology and key indicators to assess the impact of your AI training investments.",
    readTimeMinutes: 7,
    publishedAt: "2026-02-10T09:00:00.000Z",
    sourceName: "TransferAI Africa",
    sourceUrl: null,
    tags: ["roi", "formation", "management"],
    isFeatured: false,
    isNewManual: false,
  },
  {
    id: "resource-watch-africa",
    slug: "veille-ia-afrique-cote-divoire",
    categoryKey: "veille",
    sectorKey: "IT & Transformation Digitale",
    titleFr: "Veille IA Afrique : les signaux à suivre pour la Côte d'Ivoire",
    titleEn: "AI watch in Africa: signals worth tracking for Côte d'Ivoire",
    excerptFr: "Une veille éditoriale ciblée pour identifier les annonces, outils et usages IA qui peuvent avoir un impact concret sur les organisations ivoiriennes.",
    excerptEn: "A focused editorial watch to identify AI announcements, tools and use cases with concrete relevance for Ivorian organizations.",
    readTimeMinutes: 4,
    publishedAt: "2026-04-05T09:00:00.000Z",
    sourceName: "TransferAI Africa",
    sourceUrl: null,
    tags: ["veille", "afrique", "cote-divoire"],
    isFeatured: true,
    isNewManual: true,
  },
];

const buildFallbackContent = (item: ResourceFeedItem, language: "fr" | "en") => {
  if (language === "en") {
    return [
      item.excerptEn,
      `Why this matters now`,
      `TransferAI Africa curates this article to help professionals and organizations understand how AI changes ${item.sectorKey ?? "their sector"} in Côte d'Ivoire and across Africa.`,
      `What to do next`,
      `Use this resource as a starting point, then explore the related training paths, certification options, and consulting support available on the platform.`,
    ].join("\n\n");
  }

  return [
    item.excerptFr,
    `Pourquoi ce sujet compte maintenant`,
    `TransferAI Africa publie cette ressource pour aider les professionnels et les organisations à comprendre comment l'IA transforme ${item.sectorKey ?? "leur secteur"} en Côte d'Ivoire et en Afrique.`,
    `Quelle est la prochaine étape`,
    `Utilisez cet article comme point d'entrée, puis explorez les formations, la certification et les services liés à ce domaine sur la plateforme.`,
  ].join("\n\n");
};

export const resourcePostFallback: ResourcePost[] = resourceFeedFallback.map((item) => {
  const seededPost = item as Partial<ResourcePost>;

  return {
    ...item,
    contentFr: seededPost.contentFr ?? buildFallbackContent(item, "fr"),
    contentEn: seededPost.contentEn ?? buildFallbackContent(item, "en"),
    sources:
      seededPost.sources ??
      (item.sourceUrl && item.sourceName
        ? [
            {
              label: item.sourceName,
              url: item.sourceUrl,
              publisher: item.sourceName,
            },
          ]
        : []),
    seoTitleFr: seededPost.seoTitleFr ?? null,
    seoTitleEn: seededPost.seoTitleEn ?? null,
    seoDescriptionFr: seededPost.seoDescriptionFr ?? null,
    seoDescriptionEn: seededPost.seoDescriptionEn ?? null,
    coverImageUrl: seededPost.coverImageUrl ?? null,
  };
});

export const sortResourceFeed = (items: ResourceFeedItem[]) =>
  [...items].sort((left, right) => {
    const featuredDelta = Number(right.isFeatured) - Number(left.isFeatured);

    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });

export const isResourceNew = (publishedAt: string, isNewManual = false) => {
  if (isNewManual) {
    return true;
  }

  const publishedTime = new Date(publishedAt).getTime();

  if (Number.isNaN(publishedTime)) {
    return false;
  }

  const now = Date.now();
  const diffInDays = (now - publishedTime) / (1000 * 60 * 60 * 24);

  return diffInDays >= 0 && diffInDays <= RESOURCE_NEW_WINDOW_DAYS;
};

export const getFallbackResourcePostBySlug = (slug?: string | null) =>
  resourcePostFallback.find((item) => item.slug === slug) ?? null;
