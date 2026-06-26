import fs from "node:fs/promises";
import path from "node:path";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const CATALOGUE_INDEX = path.join(ROOT, "public", "catalogues-domaines-assets", "catalogue-assets.json");
const MASTER_CATALOGUE = path.join(
  ROOT,
  "docs",
  "transferai-catalogues",
  "TransferAI_Africa_Catalogue_Master_2026-04-12.html",
);

const commonTimeline = [
  {
    step: "J+0",
    title: "Audit, cadrage et priorisation",
    desc: "Identifier les flux à plus forte valeur, les risques à encadrer et les équipes à mobiliser.",
  },
  {
    step: "J+15",
    title: "Premier livrable utile",
    desc: "Produire un kit de travail, un assistant pilote ou une première base documentaire prête à l’usage.",
  },
  {
    step: "J+45",
    title: "Formation ciblée et pilote",
    desc: "Former les bonnes populations, lancer le premier terrain d’exécution et sécuriser les pratiques.",
  },
  {
    step: "J+90",
    title: "Mesure, gouvernance et extension",
    desc: "Relire les premiers KPI, ajuster les usages et décider l’extension, le recentrage ou la montée en charge.",
  },
];

const commonTrust = [
  "Les usages proposés restent gouvernés, progressifs et validés par des responsables métier identifiés.",
  "Les données sensibles, documents internes et arbitrages critiques restent sous supervision humaine.",
  "TransferAI ne s’arrête pas à la formation : nous accompagnons aussi la mise en pratique, les premiers KPI et la décision d’extension.",
];

const accentMap = {
  orange: "#E76F1D",
  navy: "#163556",
  teal: "#1C8A78",
  gold: "#C88C3A",
};

function slugify(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unique(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

async function readCatalogueIndex() {
  return JSON.parse(await fs.readFile(CATALOGUE_INDEX, "utf8"));
}

async function extractCoursesFromHtml(filePath) {
  const html = await fs.readFile(filePath, "utf8");
  const matches = [...html.matchAll(/<td><strong>(.*?)<\/strong><\/td>/g)];
  return unique(
    matches.map((match) =>
      match[1]
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .trim(),
    ),
  );
}

async function readCoursePools() {
  const catalogueIndex = await readCatalogueIndex();
  const pools = new Map();

  for (const entry of catalogueIndex) {
    const htmlPath = path.join(ROOT, "public", entry.storage_paths.html);
    pools.set(entry.domain_key, {
      domainKey: entry.domain_key,
      label: entry.domain_label_fr,
      courseCount: entry.course_count,
      courses: await extractCoursesFromHtml(htmlPath),
    });
  }

  pools.set("master", {
    domainKey: "master",
    label: "Catalogue master",
    courseCount: null,
    courses: await extractCoursesFromHtml(MASTER_CATALOGUE),
  });

  return pools;
}

function pickCoursesFromPool(pool, preferred = [], limit = 6) {
  const preferredOrdered = preferred.filter((title) => pool.includes(title));
  const remaining = pool.filter((title) => !preferredOrdered.includes(title));
  return [...preferredOrdered, ...remaining].slice(0, limit);
}

function buildCoverMetrics(courseCount) {
  return [
    { value: courseCount ? `${courseCount}` : "6+", label: "formations activables" },
    { value: "4", label: "usages prioritaires" },
    { value: "J+90", label: "pilotage d’extension" },
    { value: "0 FCFA", label: "audit d’entrée" },
  ];
}

function buildOfferBlocks(domain) {
  return [
    {
      title: "Audit métier ciblé",
      promise: `Qualifier les flux, documents et points de friction les plus critiques pour ${domain}.`,
      items: ["Cartographie des irritants", "Hypothèses de gains rapides"],
    },
    {
      title: "Formation des décideurs",
      promise: "Aligner la direction, les managers et les sponsors sur les usages, limites et conditions de réussite.",
      items: ["Vision, gouvernance et arbitrages", "Lecture des premiers KPI"],
    },
    {
      title: "Formation des équipes opérationnelles",
      promise: "Mettre les bonnes méthodes et les bons assistants dans les mains des équipes qui exécutent.",
      items: ["Gestes métier augmentés", "Standardisation utile"],
    },
    {
      title: "Pilote, accompagnement et extension",
      promise: "Passer d’une intention IA à un premier terrain visible, mesurable et gouverné.",
      items: ["Pilotage sur 90 jours", "Décision d’extension ou de recentrage"],
    },
  ];
}

function spec({
  slug,
  title,
  subtitle,
  tagline,
  accent = "orange",
  catalogueKey = null,
  preferredCourses = [],
  manualCourses = null,
  crmSectors = [],
  contextNarrative,
  priorities,
  roiMetrics,
  useCases,
  standardization,
  trust = [],
}) {
  return {
    slug,
    title,
    subtitle,
    tagline,
    accent,
    accentColor: accentMap[accent] ?? accentMap.orange,
    catalogueKey,
    preferredCourses,
    manualCourses,
    crmSectors,
    contextNarrative,
    priorities,
    roiMetrics,
    useCases,
    standardization,
    timeline: commonTimeline,
    trust: [...commonTrust, ...trust].slice(0, 4),
  };
}

const rawSpecs = [
  spec({
    slug: "assistanat-et-secretariat",
    title: "Assistanat & Secrétariat",
    subtitle: "Fluidifier la rédaction, la coordination et le suivi exécutif sans perdre en rigueur.",
    tagline:
      "Pour les directions générales, secrétariats exécutifs et fonctions d’appui qui veulent transformer l’IA en temps utile, documents plus propres et meilleure continuité d’action.",
    accent: "orange",
    catalogueKey: "assistanat-et-secretariat",
    preferredCourses: [
      "Gestion Intelligente de l'Agenda avec l'IA",
      "Rédaction Professionnelle Assistée par IA",
      "Synthèse de Réunions avec l'IA",
      "Gestion de Projets Augmentée par l'IA",
      "Communication Professionnelle & IA",
      "Organisation Digitale et IA",
    ],
    crmSectors: [
      "Administration publique",
      "Institution régionale",
      "Hôtellerie / Tourisme",
      "Audit / Conseil",
      "Administration / Numérique",
    ],
    contextNarrative:
      "Ce deck s’adresse aux structures où la direction, l’assistanat ou la coordination administrative absorbent un volume élevé de courriers, réunions, validations et suivis transverses.",
    priorities: [
      {
        title: "Rédaction lente et dispersée",
        before: "Courriers, notes, synthèses et messages importants sont produits de façon hétérogène.",
        after: "Des modèles guidés, prompts validés et relectures plus rapides rendent la production plus nette et plus homogène.",
      },
      {
        title: "Réunions nombreuses, mémoire faible",
        before: "Les décisions, actions et arbitrages se perdent entre comptes rendus, messages et relances.",
        after: "Les réunions sont synthétisées plus vite avec une sortie claire : décisions, responsables, échéances et points en attente.",
      },
      {
        title: "Agenda et priorités mal arbitré",
        before: "Les urgences dominent et les tâches à forte valeur sont noyées dans le flux quotidien.",
        after: "La préparation des journées, des rendez-vous et des arbitrages devient plus structurée et plus visible.",
      },
      {
        title: "Dépendance à quelques personnes",
        before: "L’information utile reste souvent dans les mails, la mémoire ou les habitudes de quelques assistants clés.",
        after: "Les bonnes pratiques, formats et réponses types deviennent partageables, transmissibles et réutilisables.",
      },
    ],
    roiMetrics: [
      { value: "30 à 50 %", label: "sur le temps de rédaction", note: "courriers, notes et synthèses" },
      { value: "2x plus vite", label: "pour préparer un rendez-vous", note: "brief, ordre du jour, pièces clés" },
      { value: "Meilleure traçabilité", label: "des décisions et relances", note: "après réunions et arbitrages" },
      { value: "Onboarding accéléré", label: "des assistants et coordinations", note: "méthodes et formats plus stables" },
    ],
    useCases: [
      {
        title: "Courriers et correspondances premium",
        before: "Les réponses importantes prennent du temps et varient selon les personnes.",
        after: "Des trames guidées permettent de rédiger plus vite, avec le bon ton et les bonnes pièces.",
        kpi: "Temps moyen de rédaction ; taux de validation du premier jet",
      },
      {
        title: "Synthèse de réunions et plan d’action",
        before: "Les réunions produisent beaucoup de matière mais peu de capitalisation exploitable.",
        after: "Chaque réunion débouche sur un résumé clair, des décisions, des responsables et un suivi prêt à partir.",
        kpi: "Délai d’envoi du compte rendu ; taux d’actions clôturées",
      },
      {
        title: "Agenda, relances et préparation exécutive",
        before: "Les priorités changent vite et la préparation des rendez-vous reste artisanale.",
        after: "L’IA prépare les briefs, rappels, points d’attention et dossiers de séance de façon plus régulière.",
        kpi: "Temps de préparation ; nombre d’oublis ou reports critiques",
      },
      {
        title: "Base documentaire d’assistanat",
        before: "Les modèles, standards et habitudes sont éparpillés dans plusieurs boîtes et dossiers.",
        after: "Une base simple consolide réponses types, formats et bonnes pratiques réutilisables.",
        kpi: "Temps de recherche documentaire ; homogénéité des livrables",
      },
    ],
    standardization: [
      "Créer une bibliothèque de modèles validés pour courriers, notes, synthèses et briefs.",
      "Réduire la dépendance à quelques personnes en documentant les bons gestes métier.",
      "Mieux préparer les rendez-vous, réunions et visites avec des briefs standardisés.",
      "Donner à la direction une assistance plus rapide, plus nette et plus pilotable.",
    ],
  }),
  spec({
    slug: "ressources-humaines",
    title: "Ressources Humaines",
    subtitle: "Structurer le recrutement, l’onboarding et la diffusion des pratiques RH avec une IA gouvernée.",
    tagline:
      "Pour les directions RH et talent qui veulent gagner en réactivité, en cohérence documentaire et en capacité d’accompagnement des managers.",
    accent: "teal",
    catalogueKey: "ressources-humaines",
    preferredCourses: [
      "IA et Recrutement : Sourcing & Sélection",
      "Onboarding Automatisé avec l'IA",
      "Formation Personnalisée des Talents avec l'IA",
      "People Analytics : Données RH et IA",
      "Marque Employeur et IA",
      "Droit Social et IA : Conformité Automatisée",
    ],
    crmSectors: ["RH / Recrutement", "Banque / Finance", "Assurance", "Télécommunications", "Formation professionnelle"],
    contextNarrative:
      "Le bon angle RH n’est pas de remplacer le jugement humain. Il consiste à réduire les délais, sécuriser les processus et mieux accompagner les équipes et les managers.",
    priorities: [
      {
        title: "Recrutement chronophage",
        before: "Les candidatures, présélections et comptes rendus d’entretien consomment beaucoup de temps dispersé.",
        after: "Le tri, la préparation d’entretiens et les synthèses deviennent plus rapides et plus comparables.",
      },
      {
        title: "Onboarding inégal selon les équipes",
        before: "L’intégration dépend fortement du manager, du site ou de la disponibilité des référents.",
        after: "Des parcours et kits d’accueil mieux structurés homogénéisent les premières semaines.",
      },
      {
        title: "Documents RH peu standardisés",
        before: "Comptes rendus, communications internes, fiches de poste et notes RH sont produits sans méthode stable.",
        after: "Des modèles et workflows assistés améliorent la cohérence sans alourdir l’exécution.",
      },
      {
        title: "Faible visibilité sur les signaux RH",
        before: "Le climat social, les retards d’intégration ou les besoins de formation sont repérés tardivement.",
        after: "L’analyse assistée met en lumière les signaux faibles et les priorités managériales plus tôt.",
      },
    ],
    roiMetrics: [
      { value: "25 à 40 %", label: "sur le cycle de recrutement", note: "tri, synthèses et préparation" },
      { value: "Onboarding plus homogène", label: "sur plusieurs sites", note: "kit, parcours et réponses types" },
      { value: "Moins de redites", label: "pour les managers et RH", note: "questions fréquentes et documents" },
      { value: "Décisions mieux documentées", label: "sur talents et performance", note: "synthèses et indicateurs RH" },
    ],
    useCases: [
      {
        title: "Sourcing, tri et synthèse de candidatures",
        before: "Le traitement initial des candidatures manque de vitesse et de comparabilité.",
        after: "Les premières analyses, résumés et questions d’entretien se préparent plus vite et plus proprement.",
        kpi: "Temps de présélection ; délai avant premier entretien",
      },
      {
        title: "Onboarding structuré et assistant RH interne",
        before: "Les nouveaux entrants dépendent trop des réponses ad hoc et de la disponibilité des référents.",
        after: "Un assistant encadré redonne les bonnes réponses, procédures et documents d’intégration.",
        kpi: "Temps d’intégration ; satisfaction à 30 jours",
      },
      {
        title: "People analytics et suivi des signaux RH",
        before: "Les données utiles sont dispersées et difficiles à relire rapidement.",
        after: "Des synthèses assistées aident à piloter départs, besoins de formation et irritants récurrents.",
        kpi: "Temps de reporting RH ; nombre de signaux détectés tôt",
      },
      {
        title: "Communication RH et marque employeur",
        before: "Les messages internes et externes manquent parfois de rythme, de cohérence ou d’adaptation.",
        after: "Les contenus RH gagnent en clarté, fréquence et qualité éditoriale.",
        kpi: "Temps de production ; taux d’engagement interne",
      },
    ],
    standardization: [
      "Industrialiser le premier niveau de préparation RH sans déshumaniser les décisions.",
      "Rendre l’onboarding plus homogène entre sites, métiers et managers.",
      "Donner aux RH des outils de synthèse pour piloter le climat, la formation et l’intégration.",
      "Créer une base de réponses, procédures et documents RH plus accessible au quotidien.",
    ],
  }),
  spec({
    slug: "marketing-et-communication",
    title: "Marketing & Communication",
    subtitle: "Accélérer la production de contenus, la segmentation et le pilotage de campagnes sans diluer la marque.",
    tagline:
      "Pour les équipes marketing, communication et acquisition qui veulent produire plus vite, mieux personnaliser et mieux relire ce qui fonctionne.",
    accent: "orange",
    catalogueKey: "marketing-et-communication",
    preferredCourses: [
      "Création de Contenu Marketing avec l'IA",
      "Stratégie Marketing Data-Driven avec l'IA",
      "Analyse d'Audience et Segmentation IA",
      "Copywriting IA : Rédiger des Textes qui Convertissent",
      "Social Media Management avec l'IA",
      "Publicité Digitale Optimisée par l'IA",
    ],
    crmSectors: [
      "Télécommunications",
      "Médias digitaux",
      "Médias audiovisuels",
      "Hôtellerie / Tourisme",
      "Agroalimentaire / Distribution",
    ],
    contextNarrative:
      "Dans ce domaine, l’IA doit servir la vitesse éditoriale, la cohérence de marque et la lecture des résultats, pas seulement la production de texte en masse.",
    priorities: [
      {
        title: "Production de contenu trop coûteuse",
        before: "Les campagnes dépendent d’allers-retours longs pour créer, adapter et décliner les messages.",
        after: "Les équipes disposent de cadres éditoriaux, variantes et assistants qui accélèrent la production sans perdre le cap de la marque.",
      },
      {
        title: "Segmentation peu exploitée",
        before: "Les audiences sont connues mais insuffisamment traduites en messages, offres ou parcours différenciés.",
        after: "Les segments deviennent plus actionnables grâce à des analyses et suggestions de contenus plus ciblés.",
      },
      {
        title: "Peu de lecture rapide des résultats",
        before: "Les reporting de campagne existent mais restent longs à relire, commenter et arbitrer.",
        after: "Les résultats sont synthétisés plus vite pour mieux décider : quoi arrêter, amplifier ou corriger.",
      },
      {
        title: "Hétérogénéité multicanale",
        before: "Chaque canal avance à son rythme et la cohérence du message se dégrade.",
        after: "Les assets et messages sont harmonisés plus facilement entre social, email, site et sales enablement.",
      },
    ],
    roiMetrics: [
      { value: "40 à 70 %", label: "sur le temps de production", note: "brief, variantes, déclinaisons" },
      { value: "Meilleure cohérence", label: "entre canaux", note: "promesse, ton et priorités" },
      { value: "Lecture plus rapide", label: "des campagnes", note: "commentaires et arbitrages" },
      { value: "Segmentation plus utile", label: "pour les équipes growth", note: "messages plus ciblés" },
    ],
    useCases: [
      {
        title: "Machine à contenus multiformats",
        before: "Les campagnes ralentissent dès qu’il faut décliner un message en plusieurs formats.",
        after: "Un cadre outillé permet de produire plus vite des contenus cohérents pour plusieurs canaux.",
        kpi: "Temps de mise en campagne ; volume d’assets produits",
      },
      {
        title: "Segmentation et lecture des audiences",
        before: "Les données d’audience existent mais servent peu à adapter les messages.",
        after: "L’IA aide à reformuler les segments et à relier audiences, arguments et formats.",
        kpi: "Taux d’engagement par segment ; coût d’acquisition par cohorte",
      },
      {
        title: "Copywriting et conversion",
        before: "Les textes prennent du temps à écrire, tester et affiner selon les supports.",
        after: "Les équipes gagnent des variantes plus rapides à tester pour landing pages, emails et posts.",
        kpi: "Temps de rédaction ; taux de clic ou conversion",
      },
      {
        title: "Synthèse de campagnes et recommandations",
        before: "L’analyse des performances reste artisanale et peu pédagogique pour les décideurs.",
        after: "Les résultats sont résumés avec recommandations plus lisibles pour arbitrer rapidement.",
        kpi: "Temps de reporting ; délai de décision après campagne",
      },
    ],
    standardization: [
      "Créer un cadre éditorial IA qui protège la marque au lieu de la banaliser.",
      "Outiller les équipes pour produire, adapter et corriger plus vite les contenus.",
      "Relier segmentation, production et reporting dans une même logique de performance.",
      "Faire du marketing IA un levier de vitesse et de pilotage, pas un simple gadget de génération.",
    ],
  }),
  spec({
    slug: "finance-et-comptabilite",
    title: "Finance & Comptabilité",
    subtitle: "Accélérer le reporting, la revue des comptes et les arbitrages sans affaiblir le contrôle.",
    tagline:
      "Pour les directions financières, contrôles de gestion, audit interne et comptabilités qui veulent transformer l’IA en lisibilité, rigueur et gains de cycle.",
    accent: "navy",
    catalogueKey: "finance-et-comptabilite",
    preferredCourses: [
      "Reporting Financier Automatisé",
      "Comptabilité Automatisée avec l'IA",
      "Audit Interne Augmenté par l'IA",
      "Prévisions Budgétaires Assistées par IA",
      "Gestion de Trésorerie Intelligente",
      "Normes IFRS et Automatisation avec l'IA",
    ],
    crmSectors: ["Banque / Finance", "Microfinance", "Fintech / Mobile Money", "Assurance", "Finance / Développement"],
    contextNarrative:
      "Dans les fonctions finance, l’IA devient utile quand elle réduit les délais de lecture, de consolidation et de préparation des arbitrages sans compromettre la fiabilité.",
    priorities: [
      {
        title: "Reporting lourd et répétitif",
        before: "Les équipes passent beaucoup de temps à préparer, commenter et reformater l’information financière.",
        after: "Les synthèses, commentaires et formats de restitution se préparent plus vite et plus proprement.",
      },
      {
        title: "Contrôles encore trop artisanaux",
        before: "Les revues de cohérence, détections d’anomalies et analyses d’écarts reposent sur beaucoup d’efforts manuels.",
        after: "Des routines d’assistance accélèrent les revues et font mieux ressortir les points à investiguer.",
      },
      {
        title: "Décision tardive faute de lecture claire",
        before: "Les comités reçoivent l’information, mais trop tard ou trop brute pour arbitrer vite.",
        after: "Les décideurs disposent de notes plus synthétiques, plus lisibles et mieux reliées aux KPI.",
      },
      {
        title: "Multiplication des demandes ad hoc",
        before: "Chaque demande de tableau, analyse ou note perturbe la cadence des équipes comptables et contrôle.",
        after: "Des kits réutilisables réduisent les reprises et sécurisent les formats attendus.",
      },
    ],
    roiMetrics: [
      { value: "25 à 45 %", label: "sur le temps de reporting", note: "collecte, commentaire, mise en forme" },
      { value: "Revue plus rapide", label: "des écarts et anomalies", note: "avant comité ou clôture" },
      { value: "Décisions mieux documentées", label: "pour la direction", note: "notes synthétiques et KPI" },
      { value: "Contrôles plus homogènes", label: "sur plusieurs équipes", note: "formats et méthodes alignés" },
    ],
    useCases: [
      {
        title: "Reporting financier automatisé",
        before: "La production des tableaux et notes de synthèse reste très consommatrice de temps.",
        after: "L’IA accélère la production des commentaires, résumés et supports de lecture pour les décideurs.",
        kpi: "Temps de production mensuel ; délai avant diffusion",
      },
      {
        title: "Pré-clôture et détection d’anomalies",
        before: "Les contrôles de cohérence dépendent de vérifications longues et fragmentées.",
        after: "Les écarts et exceptions sont mieux repérés avant arbitrage humain et investigation détaillée.",
        kpi: "Temps de revue ; nombre d’anomalies détectées plus tôt",
      },
      {
        title: "Audit interne augmenté",
        before: "La préparation des missions et des tests reste lourde en collecte et synthèse.",
        after: "Les auditeurs gagnent du temps sur les notes, checklists, synthèses et points d’attention.",
        kpi: "Temps de préparation mission ; couverture documentaire",
      },
      {
        title: "Prévisions et trésorerie mieux relues",
        before: "Les hypothèses budgétaires et cash nécessitent des itérations longues avec plusieurs parties prenantes.",
        after: "Les scénarios deviennent plus lisibles et les hypothèses plus faciles à challenger.",
        kpi: "Temps de préparation budgétaire ; délai d’arbitrage",
      },
    ],
    standardization: [
      "Réduire le temps passé à commenter des chiffres déjà disponibles.",
      "Améliorer la lecture managériale du reporting, des écarts et des arbitrages.",
      "Aider audit, contrôle et comptabilité à travailler sur des formats plus stables et réutilisables.",
      "Faire de l’IA un copilote de rigueur et de vitesse, pas un substitut au jugement financier.",
    ],
  }),
  spec({
    slug: "juridique-et-conformite",
    title: "Juridique & Conformité",
    subtitle: "Accélérer la recherche, la revue documentaire et la conformité sans fragiliser le contrôle humain.",
    tagline:
      "Pour les directions juridiques, conformité, contentieux et contrôle interne qui veulent gagner du temps de préparation, de revue et de sécurisation documentaire.",
    accent: "gold",
    catalogueKey: "juridique-et-conformite",
    preferredCourses: [
      "Recherche Juridique Assistée par IA",
      "Analyse de Contrats avec l'IA",
      "Rédaction Juridique Assistée par l'IA",
      "RGPD et Protection des Données avec l'IA",
      "Conformité Anti-Blanchiment et IA",
      "Due Diligence Augmentée par l'IA",
    ],
    crmSectors: ["Banque / Finance", "Assurance", "Inspection / Certification", "Administration publique", "Énergie / Pétrole & Gaz"],
    contextNarrative:
      "Dans ce domaine, la bonne promesse n’est pas l’automatisation aveugle du jugement juridique. La vraie valeur est dans la préparation, la revue, la veille et la traçabilité.",
    priorities: [
      {
        title: "Recherche et veille trop lentes",
        before: "Les équipes passent du temps à consolider jurisprudence, textes, clauses et repères sectoriels.",
        after: "La recherche préparatoire devient plus rapide, plus structurée et plus facile à partager avant revue experte.",
      },
      {
        title: "Analyse contractuelle répétitive",
        before: "La revue de contrats ou pièces comparables mobilise des efforts importants sur des points récurrents.",
        after: "Les premières synthèses et repérages d’écarts accélèrent le travail des juristes et compliance officers.",
      },
      {
        title: "Conformité documentaire diffuse",
        before: "Les équipes peinent à maintenir des réponses homogènes sur données, KYC, AML ou procédures.",
        after: "Des bases de référence et routines de contrôle rendent le cadre plus lisible et plus stable.",
      },
      {
        title: "Pression sur les délais de préparation",
        before: "Comités, dossiers, contentieux et due diligence demandent des synthèses rapides mais exigeantes.",
        after: "L’IA prépare une première matière mieux structurée, relue ensuite par les responsables compétents.",
      },
    ],
    roiMetrics: [
      { value: "30 à 50 %", label: "sur la préparation documentaire", note: "veille, revue, synthèse" },
      { value: "Revue plus homogène", label: "des contrats et pièces", note: "checklists et écarts" },
      { value: "Réactivité accrue", label: "sur conformité et comité", note: "notes plus rapides à préparer" },
      { value: "Moins de dispersion", label: "sur les standards", note: "données, AML, clauses, procédures" },
    ],
    useCases: [
      {
        title: "Recherche juridique assistée",
        before: "La consolidation des sources prend du temps avant d’arriver à la vraie analyse.",
        after: "Les juristes reçoivent une base de lecture plus structurée pour accélérer la phase de préparation.",
        kpi: "Temps de préparation d’une note ; délai de réponse interne",
      },
      {
        title: "Analyse de contrats et écarts",
        before: "Chaque revue contractuelle repart souvent de zéro malgré des motifs récurrents.",
        after: "Les clauses sensibles, incohérences et points de vigilance ressortent plus vite avant arbitrage humain.",
        kpi: "Temps de revue ; nombre d’écarts repérés tôt",
      },
      {
        title: "Conformité en matière de données et de procédures",
        before: "Les réponses en matière de données, conformité et obligations internes restent peu capitalisées.",
        after: "Une base de référence et des checklists outillent mieux les équipes au quotidien.",
        kpi: "Temps de réponse ; homogénéité des avis et procédures",
      },
      {
        title: "Due diligence et comités",
        before: "Les synthèses préparatoires demandent beaucoup de collecte et de reformulation.",
        after: "Les dossiers deviennent plus lisibles, plus rapides à assembler et plus simples à challenger.",
        kpi: "Temps de préparation dossier ; délai avant comité",
      },
    ],
    standardization: [
      "Mieux préparer sans affaiblir la revue experte et la responsabilité juridique.",
      "Structurer des bases de référence sur clauses, procédures et exigences de conformité.",
      "Réduire le temps consommé par les revues répétitives et les synthèses documentaires.",
      "Créer un cadre de confiance robuste autour des données, validations et usages autorisés.",
    ],
    trust: ["Les cas d’usage critiques restent encadrés par revue juridique, règles d’accès et validation finale humaine."],
  }),
  spec({
    slug: "service-client",
    title: "Service Client",
    subtitle: "Réduire les délais de réponse, mieux capitaliser les interactions et homogénéiser le service.",
    tagline:
      "Pour les équipes relation client, support, réseau et centres de contact qui veulent rendre le service plus rapide, plus cohérent et plus pilotable.",
    accent: "orange",
    catalogueKey: "service-client",
    preferredCourses: [
      "Chatbots Intelligents pour le Service Client",
      "Relation Client Augmentée par l'IA",
      "Expérience Client Omnicanale avec l'IA",
      "Analyse de Sentiment et Feedback Client",
      "Gestion des Réclamations Automatisée",
      "Mesurer la Satisfaction Client avec l'IA",
    ],
    crmSectors: ["Télécommunications", "Hôtellerie / Tourisme", "Logistique / Express", "Fintech / Mobile Money", "Santé / Clinique"],
    contextNarrative:
      "Ici, l’IA doit d’abord rendre le service plus stable, plus rapide et mieux piloté. Le ROI se lit dans les temps de réponse, la résolution et la qualité de traitement.",
    priorities: [
      {
        title: "Réponses hétérogènes",
        before: "Les réponses varient selon les canaux, les personnes ou le niveau de pression opérationnelle.",
        after: "Des scripts, bases de réponse et assistants encadrés améliorent la cohérence sans rigidifier le service.",
      },
      {
        title: "Traitement lent des demandes récurrentes",
        before: "Les équipes passent trop de temps sur des requêtes simples mais nombreuses.",
        after: "Le premier niveau de réponse et de qualification s’accélère, ce qui libère du temps pour les cas sensibles.",
      },
      {
        title: "Feedback client peu exploité",
        before: "Les réclamations, verbatims et signaux faibles restent sous-analysés ou tardivement consolidés.",
        after: "Les retours clients deviennent plus exploitables pour corriger les parcours et les scripts.",
      },
      {
        title: "Pilotage difficile",
        before: "Les indicateurs existent mais les managers manquent de lecture rapide et actionnable.",
        after: "Les KPI de service sont mieux commentés et reliés à des actions concrètes d’amélioration.",
      },
    ],
    roiMetrics: [
      { value: "20 à 40 %", label: "sur les délais de réponse", note: "demandes simples et récurrentes" },
      { value: "Plus de cohérence", label: "sur plusieurs canaux", note: "scripts, FAQ, réponses types" },
      { value: "Feedback plus lisible", label: "pour les managers", note: "réclamations et verbatims" },
      { value: "Meilleure résolution", label: "au premier niveau", note: "qualification et orientation" },
    ],
    useCases: [
      {
        title: "Assistant de réponse et FAQ métier",
        before: "Les conseillers réécrivent souvent les mêmes réponses avec des variations de qualité.",
        after: "Une assistance encadrée facilite la réponse, la reformulation et le rappel des bonnes consignes.",
        kpi: "Temps moyen de réponse ; taux de validation premier jet",
      },
      {
        title: "Qualification et tri des demandes",
        before: "Les flux entrants manquent d’orientation rapide entre urgence, complexité et bon destinataire.",
        after: "Les demandes sont mieux triées, résumées et routées avant traitement complet.",
        kpi: "Temps de qualification ; délai d’escalade",
      },
      {
        title: "Analyse des réclamations et verbatims",
        before: "Les retours client sont nombreux mais difficiles à exploiter à grande échelle.",
        after: "Les motifs, irritants et signaux faibles sont mieux regroupés et commentés pour les managers.",
        kpi: "Temps d’analyse ; volume de motifs consolidés",
      },
      {
        title: "Pilotage omnicanal et satisfaction",
        before: "Les KPI sont dispersés entre plusieurs outils et peu reliés à des actions d’amélioration.",
        after: "Le pilotage gagne en lisibilité avec des commentaires automatiques et des plans d’action plus nets.",
        kpi: "CSAT / NPS ; réactivité de pilotage",
      },
    ],
    standardization: [
      "Standardiser le premier niveau de service sans déshumaniser la relation.",
      "Aider les superviseurs à mieux lire réclamations, motifs et irritants.",
      "Donner aux équipes un socle de réponses, FAQ et consignes plus homogène.",
      "Rendre les KPI de service plus utiles pour arbitrer les corrections prioritaires.",
    ],
  }),
  spec({
    slug: "data-analyse",
    title: "Data & Analyse",
    subtitle: "Transformer les données en lecture métier, commentaires KPI et décisions plus rapides.",
    tagline:
      "Pour les équipes data, BI, performance et pilotage qui veulent faire parler les chiffres plus vite et plus clairement.",
    accent: "navy",
    catalogueKey: "data-analyse",
    preferredCourses: [
      "Power BI et Tableaux de Bord IA",
      "Business Intelligence et IA",
      "Visualisation de Données avec IA",
      "SQL et Bases de Données pour l'Analyse IA",
      "Nettoyage et Préparation de Données avec l'IA",
      "Gouvernance des Données et IA",
    ],
    crmSectors: ["Banque / Finance", "Assurance", "Télécommunications", "Énergie / Électricité", "Agro-industrie / Cacao"],
    contextNarrative:
      "Dans ce domaine, l’IA est surtout utile pour commenter, résumer, structurer et démocratiser la lecture des données sans affaiblir la qualité des modèles ni la gouvernance.",
    priorities: [
      {
        title: "Données présentes, lecture insuffisante",
        before: "Les tableaux existent mais demandent encore beaucoup d’efforts pour être compris et actionnés.",
        after: "Les synthèses et commentaires automatiques aident à relire les écarts, signaux et tendances plus vite.",
      },
      {
        title: "Préparation de données chronophage",
        before: "Le nettoyage, la documentation et les requêtes récurrentes consomment trop de bande passante experte.",
        after: "Les routines de préparation et d’explication deviennent plus rapides et plus transmissibles.",
      },
      {
        title: "Décideurs peu autonomes",
        before: "Les métiers dépendent fortement de quelques profils data pour répondre aux questions simples.",
        after: "Des sorties plus pédagogiques et mieux formulées élargissent l’usage business des données.",
      },
      {
        title: "Gouvernance parfois faible",
        before: "Les sources, définitions et usages ne sont pas toujours suffisamment cadrés.",
        after: "Les règles de qualité, dictionnaires et usages pilotés sont mieux structurés autour de la donnée utile.",
      },
    ],
    roiMetrics: [
      { value: "25 à 45 %", label: "sur le temps de reporting", note: "commentaires, synthèses, notes" },
      { value: "Lecture plus rapide", label: "des écarts KPI", note: "pour managers et direction" },
      { value: "Plus d’autonomie métier", label: "sur les demandes simples", note: "questions et relances récurrentes" },
      { value: "Gouvernance renforcée", label: "sur les sources et définitions", note: "qualité des indicateurs" },
    ],
    useCases: [
      {
        title: "Commentaires automatiques de tableaux de bord",
        before: "Les KPI sont visibles mais peu commentés, donc peu actionnés.",
        after: "Des synthèses claires aident à comprendre rapidement les écarts, alertes et priorités.",
        kpi: "Temps de lecture des KPI ; délai d’arbitrage",
      },
      {
        title: "Préparation et nettoyage assistés",
        before: "Beaucoup d’énergie experte est absorbée par des tâches de préparation répétitives.",
        after: "Les équipes accélèrent la documentation, le nettoyage et les requêtes récurrentes.",
        kpi: "Temps de préparation ; nombre d’itérations évitées",
      },
      {
        title: "BI plus pédagogique pour les métiers",
        before: "Les métiers reçoivent des dashboards sans toujours savoir quoi en faire.",
        after: "Les sorties deviennent plus pédagogiques avec des recommandations de lecture mieux formulées.",
        kpi: "Taux d’usage des dashboards ; nombre de décisions soutenues",
      },
      {
        title: "Gouvernance des données et dictionnaires",
        before: "Les définitions d’indicateurs et sources de vérité sont parfois fragiles ou implicites.",
        after: "Les référentiels deviennent plus faciles à documenter, relire et partager.",
        kpi: "Temps de documentation ; cohérence des définitions",
      },
    ],
    standardization: [
      "Faire de l’IA un levier de lecture métier des données, pas un simple effet de mode analytique.",
      "Réduire la charge de préparation et de commentaire qui pèse sur les profils data.",
      "Rendre les tableaux de bord plus lisibles pour les décideurs non spécialistes.",
      "Renforcer la gouvernance des définitions, sources et règles de qualité.",
    ],
  }),
  spec({
    slug: "administration-et-gestion",
    title: "Administration & Gestion",
    subtitle: "Rendre les processus administratifs, achats, stocks et suivis plus fluides et plus traçables.",
    tagline:
      "Pour les directions administratives, opérations, approvisionnement et coordination qui veulent réduire les tâches répétitives et mieux piloter l’exécution.",
    accent: "teal",
    catalogueKey: "administration-et-gestion",
    preferredCourses: [
      "Automatisation Administrative avec l'IA",
      "Gestion Documentaire Intelligente",
      "Planification et Suivi des Indicateurs avec l'IA",
      "Gestion des Achats et Approvisionnement IA",
      "Optimisation des Processus Métier avec l'IA",
      "Tableaux de Bord Administratifs avec l'IA",
    ],
    crmSectors: [
      "Administration publique",
      "Administration / Numérique",
      "Industrie alimentaire",
      "Audit / Conseil",
      "Distribution automobile",
    ],
    contextNarrative:
      "La valeur ici se voit quand les processus administratifs deviennent plus rapides, plus lisibles et moins dépendants de manipulations manuelles ou de chaînes d’e-mails.",
    priorities: [
      {
        title: "Tâches répétitives omniprésentes",
        before: "Courriers, validations, suivis, tableaux et consolidations créent des goulots d’étranglement quotidiens.",
        after: "Les workflows critiques gagnent en fluidité, en cadence et en qualité documentaire.",
      },
      {
        title: "Achats et approvisionnements peu lisibles",
        before: "Les relances, priorités et points de blocage sont difficilement visibles à temps.",
        after: "Les équipes disposent de suivis mieux structurés et de rappels plus cohérents.",
      },
      {
        title: "Documents mal classés",
        before: "Les pièces utiles se cherchent longtemps et les versions circulent sans repère stable.",
        after: "La gestion documentaire devient plus simple, mieux rangée et plus exploitable.",
      },
      {
        title: "Pilotage administratif fragile",
        before: "Les managers disposent de peu de lecture rapide sur les délais, suspens et points de friction.",
        after: "Les indicateurs administratifs gagnent en visibilité et servent davantage à arbitrer.",
      },
    ],
    roiMetrics: [
      { value: "25 à 45 %", label: "sur le temps administratif", note: "saisie, suivi, relance, synthèse" },
      { value: "Plus de traçabilité", label: "sur les processus", note: "validation, dossier, archivage" },
      { value: "Meilleure coordination", label: "entre équipes", note: "achats, opérations, administration" },
      { value: "Lecture plus claire", label: "pour les managers", note: "délais, suspens, points critiques" },
    ],
    useCases: [
      {
        title: "Automatisation administrative ciblée",
        before: "Les équipes multiplient les manipulations manuelles pour des flux très répétitifs.",
        after: "Les séquences documentaires et de suivi gagnent en vitesse et en cohérence.",
        kpi: "Temps de cycle ; nombre d’étapes manuelles éliminées",
      },
      {
        title: "Gestion documentaire intelligente",
        before: "Le temps de recherche, classement et reformulation reste trop élevé.",
        after: "Les documents sont mieux rangés, plus faciles à retrouver et plus simples à exploiter.",
        kpi: "Temps de recherche ; qualité de classement",
      },
      {
        title: "Achats, stocks et approvisionnements",
        before: "Les points de blocage remontent tard et les suivis manquent de visibilité partagée.",
        after: "Les équipes lisent mieux les priorités, relances et besoins critiques.",
        kpi: "Temps de traitement ; nombre de ruptures ou retards détectés tôt",
      },
      {
        title: "Tableaux de bord administratifs",
        before: "Les managers reçoivent les chiffres sans commentaire ni hiérarchisation claire.",
        after: "Les KPI administratifs sont mieux commentés et plus actionnables.",
        kpi: "Temps de reporting ; réactivité de pilotage",
      },
    ],
    standardization: [
      "Fluidifier les workflows sans lancer des projets complexes dès le départ.",
      "Mieux ranger, retrouver et partager les documents utiles au quotidien.",
      "Donner aux managers une lecture plus nette des suspens, retards et anomalies.",
      "Réduire la charge répétitive qui ralentit les fonctions support et opérations.",
    ],
  }),
  spec({
    slug: "management-et-leadership",
    title: "Management & Leadership",
    subtitle: "Donner aux dirigeants et managers une lecture claire de l’IA, des arbitrages et des premiers terrains utiles.",
    tagline:
      "Pour les comités de direction, secrétaires généraux, sponsors projet et managers qui veulent conduire l’adoption de l’IA avec méthode, sans effet gadget.",
    accent: "gold",
    catalogueKey: "management-et-leadership",
    preferredCourses: [
      "IA pour Dirigeants : Vision et Stratégie",
      "Prise de Décision Stratégique avec l'IA",
      "Leadership Data-Driven avec l'IA",
      "Conduite du Changement IA en Entreprise",
      "Planification Stratégique Assistée par l'IA",
      "Culture IA : Transformer les Mentalités",
    ],
    crmSectors: ["Banque / Finance", "Télécommunications", "Assurance", "Agro-industrie / Cacao", "Institution régionale"],
    contextNarrative:
      "Le point central ici n’est pas la technologie seule. C’est la capacité du management à choisir les bons terrains, à cadrer les usages et à transformer l’intention en exécution.",
    priorities: [
      {
        title: "Décideurs exposés mais peu outillés",
        before: "Les dirigeants voient l’IA partout sans toujours disposer d’une grille claire pour arbitrer.",
        after: "La direction gagne un cadre de lecture concret : priorités, risques, équipes, gouvernance et séquencement.",
      },
      {
        title: "Transformation mal ordonnée",
        before: "Les idées d’usage se multiplient mais sans ordre clair entre quick wins, pilotes et chantiers plus lourds.",
        after: "Les sponsors hiérarchisent mieux les décisions et évitent la dispersion.",
      },
      {
        title: "Culture et conduite du changement insuffisantes",
        before: "Les équipes oscillent entre peur, surpromesse et expérimentations isolées.",
        after: "Le discours managérial devient plus crédible, plus rassurant et plus orienté résultat.",
      },
      {
        title: "Peu de lecture des KPI d’adoption",
        before: "Les projets avancent sans véritable mesure de l’usage réel ni des gains observables.",
        after: "Les décideurs relisent plus tôt les premiers signaux pour ajuster la suite.",
      },
    ],
    roiMetrics: [
      { value: "Décisions plus rapides", label: "sur les priorités IA", note: "moins de dispersion, plus d’ordre" },
      { value: "Adoption mieux pilotée", label: "sur les équipes", note: "cadre, gouvernance, séquencement" },
      { value: "Moins de risque projet", label: "sur les premiers pilotes", note: "règles, rôles, validation" },
      { value: "Lecture plus nette", label: "des premiers KPI", note: "usage réel, valeur, extension" },
    ],
    useCases: [
      {
        title: "Briefing dirigeant et grille d’arbitrage",
        before: "L’IA reste un sujet vaste, difficile à ordonner au niveau du comité de direction.",
        after: "Les sponsors disposent d’une grille de décision plus concrète pour choisir où démarrer et comment gouverner.",
        kpi: "Délai de décision ; nombre de priorités clarifiées",
      },
      {
        title: "Conduite du changement et culture IA",
        before: "Les équipes avancent avec des représentations hétérogènes de l’IA et de ses limites.",
        after: "Le management pose un langage commun, des règles simples et des gestes utiles.",
        kpi: "Taux de participation ; niveau d’adhésion des managers",
      },
      {
        title: "Leadership data-driven",
        before: "Les managers reçoivent des chiffres mais peinent à en tirer une lecture rapide et partagée.",
        after: "Les décisions s’appuient davantage sur des synthèses et commentaires plus actionnables.",
        kpi: "Temps de lecture des KPI ; délai avant arbitrage",
      },
      {
        title: "Planification stratégique assistée",
        before: "Les exercices de planification prennent du temps et restent difficiles à reformuler en scénarios clairs.",
        after: "Les hypothèses, scénarios et plans d’action se structurent plus vite pour faciliter la décision.",
        kpi: "Temps de préparation stratégique ; nombre de scénarios comparés",
      },
    ],
    standardization: [
      "Donner au management un langage commun et une méthode de priorisation.",
      "Faire comprendre la différence entre curiosité technologique et déploiement gouverné.",
      "Créer une séquence claire entre audit, formation, pilote et décision d’extension.",
      "Relire les premiers KPI d’adoption pour piloter la suite avec lucidité.",
    ],
  }),
  spec({
    slug: "it-et-transformation-digitale",
    title: "IT & Transformation Digitale",
    subtitle: "Réduire les tickets simples, accélérer les workflows et lancer des mini-solutions utiles avec méthode.",
    tagline:
      "Pour les DSI, responsables transformation, PMO et équipes projet qui veulent passer plus vite d’un besoin métier à un premier livrable opérationnel.",
    accent: "navy",
    catalogueKey: "it-et-transformation-digitale",
    preferredCourses: [
      "Intégration d'Outils IA en Entreprise",
      "APIs et Intégration de Services IA",
      "Automatisation IT avec l'IA (DevOps)",
      "No-Code et IA : Développer sans Coder",
      "Architecture de Solutions IA",
      "Gouvernance IT et Stratégie IA",
    ],
    crmSectors: ["Télécommunications", "Fintech / Mobile Money", "Médias digitaux", "Administration / Numérique", "Inspection / Certification"],
    contextNarrative:
      "Le ROI IT est souvent le plus visible lorsqu’on touche aux tickets simples, aux cycles de développement, aux workflows et au support interne.",
    priorities: [
      {
        title: "Support interne surchargé",
        before: "Les équipes IT absorbent beaucoup de tickets simples et de demandes documentaires.",
        after: "Une base de connaissances ou un assistant support réduit la charge répétitive et améliore la réactivité.",
      },
      {
        title: "Workflows métiers encore manuels",
        before: "Formulaires, validations, notifications et suivis restent dispersés entre outils et mails.",
        after: "L’automatisation progressive fluidifie les cycles et améliore la traçabilité.",
      },
      {
        title: "Développement trop lourd pour de petits besoins",
        before: "Des mini-portails ou apps internes attendent alors qu’ils pourraient être lancés plus vite.",
        after: "Les approches no-code et IA réduisent le délai entre besoin et premier livrable.",
      },
      {
        title: "Gouvernance et architecture floues",
        before: "Les équipes testent des outils sans toujours cadrer architecture, accès, sécurité et valeur métier.",
        after: "Les usages sont mieux ordonnés entre expérimentation, intégration et gouvernance.",
      },
    ],
    roiMetrics: [
      { value: "Moins de tickets simples", label: "pour le support interne", note: "FAQ, documentation, incidents récurrents" },
      { value: "Cycles plus courts", label: "sur les workflows", note: "validation, reporting, notifications" },
      { value: "Déploiement plus rapide", label: "de mini-apps utiles", note: "sans projet lourd" },
      { value: "Gouvernance plus nette", label: "sur les usages IA", note: "architecture, accès, sécurité" },
    ],
    useCases: [
      {
        title: "Base de connaissance et support IT interne",
        before: "Le support passe du temps à répéter des réponses et procédures simples.",
        after: "Les utilisateurs accèdent plus vite aux bonnes réponses et le support se concentre sur les cas plus complexes.",
        kpi: "Volume de tickets évités ; temps moyen de résolution",
      },
      {
        title: "Automatisation de workflows métiers",
        before: "Les séquences de validation et de suivi manquent de fluidité et de visibilité.",
        after: "Les flux critiques sont reliés, traçables et moins dépendants des relances manuelles.",
        kpi: "Temps de cycle ; nombre d’étapes automatisées",
      },
      {
        title: "Mini-portails et outils internes",
        before: "Les petits besoins métier attendent trop longtemps faute de bande passante de développement.",
        after: "Des interfaces utiles sont mises en circulation plus vite pour les équipes métier.",
        kpi: "Délai de déploiement ; adoption utilisateur",
      },
      {
        title: "Architecture et gouvernance IA",
        before: "Les expérimentations s’accumulent sans cadre clair sur sécurité, rôles et intégration.",
        after: "La DSI pose un cadre plus lisible pour les usages autorisés et les priorités d’intégration.",
        kpi: "Temps de cadrage ; nombre d’usages gouvernés",
      },
    ],
    standardization: [
      "Faire gagner du temps au support et aux équipes projet sur les tâches les plus répétitives.",
      "Réduire l’écart entre besoin métier simple et premier livrable exploitable.",
      "Outiller les workflows internes avec une logique progressive et traçable.",
      "Mettre en place un cadre de gouvernance IA crédible du point de vue de la DSI.",
    ],
  }),
  spec({
    slug: "formation-et-pedagogie",
    title: "Formation & Pédagogie",
    subtitle: "Produire plus vite des contenus pédagogiques solides et mieux piloter les parcours d’apprentissage.",
    tagline:
      "Pour les écoles, universités, centres de formation et académies internes qui veulent accélérer la conception sans sacrifier la qualité pédagogique.",
    accent: "teal",
    catalogueKey: "formation-et-pedagogie",
    preferredCourses: [
      "Conception Pédagogique Assistée par IA",
      "Création de Supports de Formation avec l'IA",
      "E-learning Adaptatif avec l'IA",
      "Tutorat Virtuel et Assistants IA",
      "LMS et Plateformes de Formation IA",
      "Accessibilité et Inclusion avec l'IA",
    ],
    crmSectors: ["Formation professionnelle", "Éducation / Management", "Institution régionale", "Finance / Développement", "Aide humanitaire / Éducation"],
    contextNarrative:
      "La vraie promesse ici n’est pas de produire plus de slides. C’est de concevoir plus vite des parcours utiles, mieux adaptés et mieux suivis.",
    priorities: [
      {
        title: "Conception pédagogique trop lente",
        before: "Créer modules, quiz, études de cas et supports demande beaucoup de temps expert.",
        after: "Les ingénieries, plans de cours et variations de supports se préparent plus vite.",
      },
      {
        title: "Peu de personnalisation des parcours",
        before: "Les contenus s’adressent à tout le monde de la même manière malgré des besoins très différents.",
        after: "Les parcours gagnent en adaptation selon profils, niveaux et objectifs de cohorte.",
      },
      {
        title: "Analyse de cohortes fastidieuse",
        before: "Les résultats d’apprentissage existent mais restent longs à relire et à interpréter.",
        after: "Les responsables pédagogiques reçoivent des synthèses plus rapides et plus actionnables.",
      },
      {
        title: "Production multimédia morcelée",
        before: "Vidéo, texte, quiz et animation sont produits dans des cycles séparés et lents.",
        after: "Les équipes accélèrent la déclinaison multi-format des contenus pédagogiques.",
      },
    ],
    roiMetrics: [
      { value: "40 à 70 %", label: "sur la conception", note: "modules, exercices, supports" },
      { value: "Parcours plus adaptés", label: "selon les profils", note: "niveaux, fonctions, cohortes" },
      { value: "Reporting plus rapide", label: "des cohortes", note: "résultats et points faibles" },
      { value: "Production plus fluide", label: "des formats pédagogiques", note: "texte, quiz, vidéo, fiches" },
    ],
    useCases: [
      {
        title: "Conception de modules et cas pratiques",
        before: "Chaque nouveau parcours repart d’une page presque blanche.",
        after: "Les équipes gagnent une base mieux structurée pour construire modules, séquences et évaluations.",
        kpi: "Temps de création d’un module ; délai de mise en cohorte",
      },
      {
        title: "Personnalisation des parcours",
        before: "Les contenus sont trop génériques pour des publics hétérogènes.",
        after: "Les exercices, variantes et feedbacks se déclinent plus finement selon les besoins.",
        kpi: "Taux de complétion ; taux de réussite",
      },
      {
        title: "Tutorat virtuel et assistant apprenant",
        before: "Les questions simples mobilisent beaucoup de temps formateur.",
        after: "Un assistant encadré répond au premier niveau et oriente vers les bons supports.",
        kpi: "Temps de réponse ; satisfaction apprenants",
      },
      {
        title: "Reporting pédagogique de cohorte",
        before: "La lecture des résultats reste lente et peu homogène entre programmes.",
        after: "Les responsables pédagogiques relisent plus vite les points faibles, écarts et actions d’amélioration.",
        kpi: "Temps de reporting ; nombre d’actions correctives décidées",
      },
    ],
    standardization: [
      "Accélérer la conception sans sacrifier l’intention pédagogique et la qualité des parcours.",
      "Rendre les contenus plus adaptables à plusieurs publics et niveaux.",
      "Mieux piloter les cohortes grâce à des synthèses pédagogiques plus rapides.",
      "Structurer la production de supports, quiz, évaluations et assistants d’apprentissage.",
    ],
  }),
  spec({
    slug: "sante-et-bien-etre",
    title: "Santé & Bien-être",
    subtitle: "Améliorer la qualité documentaire, la prévention et le pilotage non clinique avec une IA responsable.",
    tagline:
      "Pour les structures santé, prévention, HSE et qualité de vie au travail qui veulent réduire la charge administrative et mieux diffuser les messages utiles.",
    accent: "teal",
    catalogueKey: "sante-et-bien-etre",
    preferredCourses: [
      "Prévention des Risques Professionnels avec l'IA",
      "Programmes de Santé au Travail avec l'IA",
      "QVT et IA : Qualité de Vie au Travail",
      "Conformité HSE et IA",
      "Gestion des Accidents du Travail avec l'IA",
      "Télémédecine et IA en Entreprise",
    ],
    crmSectors: ["Santé / Clinique", "Santé / Hôpital", "Assurance", "Aide humanitaire / Éducation", "Développement durable"],
    contextNarrative:
      "Le bon positionnement ici ne porte pas sur l’acte clinique lui-même. Il porte sur la qualité documentaire, la prévention, la communication et le pilotage des programmes.",
    priorities: [
      {
        title: "Charge administrative élevée",
        before: "Rapports, comptes rendus, supports d’information et documents qualité consomment beaucoup de temps.",
        after: "La documentation non clinique gagne en vitesse, en propreté et en homogénéité.",
      },
      {
        title: "Prévention et communication peu industrialisées",
        before: "Les messages de sensibilisation, supports patients ou QVT sont produits lentement et de façon irrégulière.",
        after: "Les campagnes de prévention et fiches d’information sont plus faciles à produire et à adapter.",
      },
      {
        title: "Retours terrain sous-exploités",
        before: "Les verbatims, incidents, questionnaires et remontées terrain sont peu consolidés.",
        after: "Les équipes lisent mieux les signaux faibles et agissent plus tôt sur les irritants récurrents.",
      },
      {
        title: "Gouvernance HSE ou QVT diffuse",
        before: "Les responsables peinent à structurer les pratiques et à diffuser les standards.",
        after: "Les programmes gagnent en cohérence, en traçabilité et en cadre documentaire.",
      },
    ],
    roiMetrics: [
      { value: "25 à 45 %", label: "sur la documentation", note: "rapports, fiches, supports, synthèses" },
      { value: "Campagnes plus rapides", label: "de prévention", note: "supports, scripts, messages" },
      { value: "Lecture plus utile", label: "des retours terrain", note: "incidents, satisfaction, signaux faibles" },
      { value: "Cadre plus homogène", label: "sur HSE et QVT", note: "pratiques, messages, standards" },
    ],
    useCases: [
      {
        title: "Documentation qualité et rapports non cliniques",
        before: "Les équipes rédigent de nombreux documents répétitifs à forte contrainte de forme.",
        after: "Les rapports et supports gagnent en vitesse de préparation et en cohérence documentaire.",
        kpi: "Temps de rédaction ; nombre de documents conformes",
      },
      {
        title: "Prévention, sensibilisation et messages patients",
        before: "Les campagnes de prévention sont trop lourdes à produire et à actualiser.",
        after: "Les supports éducatifs et messages de sensibilisation se déclinent plus vite selon les publics.",
        kpi: "Temps de production ; portée ou engagement",
      },
      {
        title: "Analyse des retours et incidents",
        before: "Les retours terrain et signaux faibles remontent difficilement dans les décisions d’amélioration.",
        after: "Les responsables relisent plus vite les motifs récurrents et les points de vigilance.",
        kpi: "Temps d’analyse ; nombre d’actions correctives",
      },
      {
        title: "Pilotage QVT / HSE",
        before: "Les programmes existent mais sont parfois difficiles à documenter et suivre dans le temps.",
        after: "Les indicateurs, plans d’action et pratiques gagnent en continuité et en visibilité.",
        kpi: "Rythme de mise à jour ; visibilité des plans d’action",
      },
    ],
    standardization: [
      "Accélérer la documentation et la prévention sans s’aventurer sur des terrains cliniques sensibles.",
      "Mieux diffuser les messages utiles aux patients, collaborateurs ou publics cibles.",
      "Aider les responsables HSE, QVT ou qualité à relire plus vite les signaux terrain.",
      "Structurer des programmes plus cohérents sur plusieurs sites ou équipes.",
    ],
    trust: ["Les usages proposés excluent toute décision clinique automatisée et restent concentrés sur documentation, prévention et pilotage."],
  }),
  spec({
    slug: "diplomatie-et-affaires-internationales",
    title: "Diplomatie & Affaires Internationales",
    subtitle: "Réduire radicalement le temps de veille, de briefing et de préparation des missions.",
    tagline:
      "Pour les institutions publiques, organisations internationales, affaires publiques et structures exportatrices qui veulent mieux préparer, mieux synthétiser et mieux coordonner.",
    accent: "gold",
    catalogueKey: "diplomatie-et-affaires-internationales",
    preferredCourses: [
      "Diplomatie Digitale et Intelligence Artificielle",
      "Intelligence Artificielle et Analyse Géopolitique",
      "Communication Diplomatique à l'ère de l'IA",
      "Négociation Internationale et IA",
      "Gouvernance Mondiale de l'Intelligence Artificielle",
      "Leadership Diplomatique à l'ère de l'IA",
    ],
    crmSectors: [
      "Institution régionale",
      "Finance / Développement",
      "Développement durable",
      "Administration publique",
      "Aide humanitaire / Éducation",
    ],
    contextNarrative:
      "La vraie promesse ici n’est pas de déléguer le jugement diplomatique. C’est de réduire le temps de préparation, de veille et de coordination documentaire autour de dossiers complexes.",
    priorities: [
      {
        title: "Veille trop gourmande en temps",
        before: "Suivre plusieurs pays, secteurs, régulations et partenaires demande beaucoup de collecte et de tri.",
        after: "Les notes de veille et résumés préparatoires sont produits plus vite et plus régulièrement.",
      },
      {
        title: "Briefings et missions difficiles à préparer",
        before: "Les fiches pays, éléments de langage et synthèses de rendez-vous prennent du temps avant chaque déplacement ou forum.",
        after: "La préparation devient plus structurée, plus rapide et plus partageable.",
      },
      {
        title: "Travail multilingue dispersé",
        before: "Les contenus circulent en plusieurs langues sans synthèse stable entre équipes.",
        after: "Les documents sont plus faciles à résumer, traduire et diffuser avec méthode.",
      },
      {
        title: "Coordination institutionnelle lente",
        before: "Les contributions et arbitrages se consolident difficilement entre directions ou partenaires.",
        after: "Les synthèses et notes de convergence deviennent plus lisibles et plus rapides à partager.",
      },
    ],
    roiMetrics: [
      { value: "Veille beaucoup plus rapide", label: "sur plusieurs zones", note: "pays, secteurs, risques, opportunités" },
      { value: "Briefings prêts plus tôt", label: "avant missions", note: "fiches, notes, éléments de langage" },
      { value: "Coordination facilitée", label: "entre équipes", note: "synthèses et documents multilingues" },
      { value: "Temps administratif réduit", label: "sur la préparation", note: "collecte, lecture, reformulation" },
    ],
    useCases: [
      {
        title: "Veille pays et sectorielle",
        before: "La veille est fragmentée entre sources, langues et notes peu harmonisées.",
        after: "Les équipes disposent plus vite d’une lecture consolidée des signaux, partenaires et risques.",
        kpi: "Temps de production d’une note ; fréquence de veille",
      },
      {
        title: "Briefings, missions et rendez-vous",
        before: "Chaque mission redemande une forte préparation manuelle.",
        after: "Les fiches, synthèses et éléments de langage sont préparés plus vite et plus proprement.",
        kpi: "Temps de préparation ; délai de diffusion du briefing",
      },
      {
        title: "Synthèse multilingue et coopération",
        before: "Les contenus multilingues ralentissent la circulation et la coordination des informations.",
        after: "Les notes circulent plus vite grâce à des résumés et reformulations mieux structurés.",
        kpi: "Délai de diffusion ; nombre de documents traités",
      },
      {
        title: "Gouvernance et technologies émergentes",
        before: "Les structures doivent suivre des sujets IA et data complexes sans toujours disposer d’un cadre opérationnel.",
        after: "Les décideurs disposent d’une lecture plus claire des enjeux, positions et options d’action.",
        kpi: "Temps de cadrage ; nombre de notes ou positions préparées",
      },
    ],
    standardization: [
      "Réduire le temps consommé par la veille, la préparation et la coordination documentaire.",
      "Mieux préparer les missions, forums et rendez-vous à fort enjeu.",
      "Structurer les contenus multilingues et les synthèses de coopération.",
      "Créer un cadre crédible entre gouvernance, préparation documentaire et conduite des positions.",
    ],
  }),
  spec({
    slug: "transport-et-logistique",
    title: "Transport & Logistique",
    subtitle: "Mieux piloter les opérations terrain, les flux, les retards et la qualité de service en environnement distribué.",
    tagline:
      "Pour les acteurs du transport, de la mobilité, du fret, du portuaire et de l’express qui veulent faire gagner du temps aux opérations et rendre les KPI plus actionnables.",
    accent: "teal",
    manualCourses: [
      "Gestion de Flotte et Logistique IA",
      "Planification et Suivi des Indicateurs avec l'IA",
      "Gestion des Achats et Approvisionnement IA",
      "Relation Client Augmentée par l'IA",
      "Optimisation des Processus Métier avec l'IA",
      "Support Prédictif et Maintenance Anticipée",
    ],
    crmSectors: [
      "Logistique / Express",
      "Logistique portuaire",
      "Transport en commun",
      "Transport ferroviaire",
      "Transport / Mobilité",
    ],
    contextNarrative:
      "Le retour sur investissement se joue ici sur la coordination terrain, la réduction des retards, la lecture des anomalies, la fluidité du service et la capacité à mieux commenter les opérations.",
    priorities: [
      {
        title: "Informations terrain dispersées",
        before: "Les opérations, incidents, tournées et retards remontent par plusieurs canaux et sont difficiles à consolider.",
        after: "Les équipes gagnent des synthèses plus rapides et une meilleure visibilité sur les priorités d’action.",
      },
      {
        title: "Pilotage des flux peu commenté",
        before: "Les KPI existent mais restent peu reliés à des analyses exploitables pour les responsables opérationnels.",
        after: "Les indicateurs gagnent en contexte, en commentaire et en capacité d’alerte.",
      },
      {
        title: "Service client et opérations trop séparés",
        before: "Le client vit les effets des retards ou incidents avant que les équipes ne disposent d’une réponse homogène.",
        after: "Les opérations et la relation client se coordonnent mieux autour d’une information plus fraîche.",
      },
      {
        title: "Maintenance et anomalies traitées tard",
        before: "Les signaux utiles existent mais sont peu capitalisés avant que le coût terrain n’augmente.",
        after: "Les écarts et incidents deviennent plus visibles pour permettre une réaction plus rapide.",
      },
    ],
    roiMetrics: [
      { value: "Moins de retards subis", label: "dans les opérations", note: "meilleure lecture des points de friction" },
      { value: "Coordination plus rapide", label: "entre le terrain et les managers", note: "synthèses, alertes, relances" },
      { value: "Service plus homogène", label: "côté client", note: "information plus claire en cas d’incident" },
      { value: "KPI plus actionnables", label: "pour l’exploitation", note: "commentaires et priorités visibles" },
    ],
    useCases: [
      {
        title: "Cockpit synthétique des opérations terrain",
        before: "Les responsables reçoivent beaucoup d’informations mais peinent à voir rapidement quoi arbitrer.",
        after: "Les flux et incidents sont résumés de façon plus lisible pour l’exploitation et le management.",
        kpi: "Temps de lecture des incidents ; réactivité de coordination",
      },
      {
        title: "Gestion de flotte et suivi d’anomalies",
        before: "Les données de flotte, trajets ou mouvements sont difficiles à transformer en décisions rapides.",
        after: "Les anomalies, exceptions et priorités ressortent plus tôt pour les équipes concernées.",
        kpi: "Temps de détection ; nombre d’anomalies qualifiées",
      },
      {
        title: "Interface opérations / service client",
        before: "Les équipes relation client manquent souvent d’un message cohérent et actualisé en cas de perturbation.",
        after: "Les réponses client s’appuient sur une information plus consolidée, plus rapide et mieux formulée.",
        kpi: "Temps de réponse client ; taux de résolution premier contact",
      },
      {
        title: "Maintenance et support prédictif",
        before: "Les signaux précurseurs sont traités trop tard ou mal commentés.",
        after: "L’IA aide à structurer les alertes, historiques et points d’attention avant action humaine.",
        kpi: "Délai d’escalade ; temps d’immobilisation évité",
      },
    ],
    standardization: [
      "Aider l’exploitation à voir plus vite les exceptions, retards et points de friction.",
      "Mieux relier les équipes terrain, managers et service client autour d’une même lecture opérationnelle.",
      "Structurer des routines de suivi plus homogènes sur plusieurs sites ou réseaux.",
      "Mettre en place des KPI commentés qui servent réellement aux arbitrages quotidiens.",
    ],
    trust: ["Les recommandations restent validées par les responsables d’exploitation, avec des règles explicites sur incidents, sécurité et supervision humaine."],
  }),
  spec({
    slug: "energie-et-petrole",
    title: "Énergie & Pétrole",
    subtitle: "Mieux piloter les opérations, les comptes, la maintenance et la qualité de service dans des environnements sensibles.",
    tagline:
      "Pour les acteurs de l’énergie, du pétrole, du gaz, de la distribution et des services associés qui veulent transformer l’IA en coordination, rigueur et performance visible.",
    accent: "gold",
    manualCourses: [
      "Gestion de Flotte et Logistique IA",
      "Reporting Financier Automatisé",
      "Support Prédictif et Maintenance Anticipée",
      "Leadership Data-Driven avec l'IA",
      "Optimisation des Processus Métier avec l'IA",
      "Conformité HSE et IA",
    ],
    crmSectors: [
      "Énergie / Pétrole & Gaz",
      "Énergie / Électricité",
      "Énergie / Production",
      "Énergie / Stockage",
      "Mines / Or",
    ],
    contextNarrative:
      "Dans ces contextes, l’IA doit rester très concrète : mieux commenter les opérations, réduire les délais de lecture, outiller le service et sécuriser la gouvernance autour de flux critiques.",
    priorities: [
      {
        title: "Multi-activités difficiles à relier",
        before: "Comptes clients, distribution, maintenance, réseau, service et pilotage remontent dans des circuits séparés.",
        after: "Les équipes gagnent une lecture plus consolidée des flux, incidents et priorités d’action.",
      },
      {
        title: "Pilotage des comptes et opérations trop lent",
        before: "Les responsables doivent assembler eux-mêmes les éléments utiles pour suivre portefeuille, recouvrement ou performance terrain.",
        after: "Les synthèses et alertes deviennent plus rapides et plus lisibles pour la direction et l’exploitation.",
      },
      {
        title: "Maintenance et anomalies coûteuses",
        before: "Les incidents, signaux faibles et points de vigilance ne sont pas toujours visibles à temps.",
        after: "Les historiques, alertes et retours terrain sont mieux exploités avant arbitrage humain.",
      },
      {
        title: "Cadre HSE et conformité à structurer",
        before: "Les équipes doivent concilier vitesse d’exécution, qualité documentaire et exigences de sécurité.",
        after: "Le dispositif gagne en traçabilité, en standardisation et en discipline documentaire.",
      },
    ],
    roiMetrics: [
      { value: "Lecture plus rapide", label: "des comptes et opérations", note: "synthèses, alertes, portefeuille" },
      { value: "Moins de dispersion", label: "entre terrain et direction", note: "reporting plus commenté" },
      { value: "Réactivité accrue", label: "sur anomalies et maintenance", note: "signaux utiles mieux consolidés" },
      { value: "Cadre mieux maîtrisé", label: "sur HSE et conformité", note: "documents, standards, pilotage" },
    ],
    useCases: [
      {
        title: "Pilotage des comptes professionnels et de la performance",
        before: "Les informations utiles au suivi commercial et administratif sont éparpillées entre plusieurs acteurs.",
        after: "Les responsables gagnent des synthèses plus rapides pour suivre portefeuilles, relances et arbitrages.",
        kpi: "Temps de préparation comité ; délai de relance ou décision",
      },
      {
        title: "Maintenance, support prédictif et incidents",
        before: "Les points de vigilance remontent tard ou restent peu lisibles pour l’exploitation.",
        after: "Les alertes et historiques sont mieux commentés pour agir plus tôt sur les écarts critiques.",
        kpi: "Temps de détection ; temps de réaction",
      },
      {
        title: "Service client et réseau de distribution",
        before: "Les demandes liées aux cartes, services, opérations ou incidents sont traitées de façon variable.",
        after: "Les équipes disposent de réponses plus homogènes et d’un meilleur accès à l’information utile.",
        kpi: "Temps moyen de réponse ; taux de résolution au premier niveau",
      },
      {
        title: "Conformité HSE et gouvernance documentaire",
        before: "La documentation utile à la sécurité, aux standards et aux audits reste chronophage à produire et maintenir.",
        after: "Les pratiques documentaires gagnent en cohérence, en traçabilité et en vitesse de mise à jour.",
        kpi: "Temps de préparation documentaire ; nombre de points de contrôle couverts",
      },
    ],
    standardization: [
      "Relier plus clairement performance commerciale, opérations terrain et qualité de service.",
      "Mieux commenter les flux critiques avant arbitrage par la direction ou l’exploitation.",
      "Réduire la charge documentaire et de reporting qui ralentit les fonctions support et pilotage.",
      "Créer un cadre gouverné entre maintenance, HSE, relation client et lecture des KPI.",
    ],
    trust: ["Les terrains critiques restent pilotés avec validation humaine, règles d’accès strictes et progression par pilote avant toute extension."],
  }),
];

export async function getSectorDeckSpecs() {
  const coursePools = await readCoursePools();

  return rawSpecs.map((entry) => {
    const pool = entry.catalogueKey ? coursePools.get(entry.catalogueKey) : null;
    const trainingFocus = entry.manualCourses
      ? entry.manualCourses
      : pickCoursesFromPool(pool?.courses ?? coursePools.get("master").courses, entry.preferredCourses, 6);

    const courseCount = pool?.courseCount ?? trainingFocus.length;

    return {
      ...entry,
      trainingFocus,
      courseCount,
      coverMetrics: buildCoverMetrics(courseCount),
      offerBlocks: buildOfferBlocks(entry.title),
      cta: "Planifier un audit IA gratuit suivi d’un échange expert de 45 minutes",
      fileName: `TransferAI_Deck_Sectoriel_${slugify(entry.title)}_2026-06-12.pptx`,
    };
  });
}
