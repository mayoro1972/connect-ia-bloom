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

function priority(title, before, after) {
  return { title, before, after };
}

function roi(value, label, note) {
  return { value, label, note };
}

function useCase(title, before, after, kpi) {
  return { title, before, after, kpi };
}

function spec({
  slug,
  commercialStem,
  title,
  subtitle,
  tagline,
  accent = "orange",
  manualCourses = [],
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
    commercialStem,
    title,
    subtitle,
    tagline,
    accent,
    accentColor: accentMap[accent] ?? accentMap.orange,
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
    slug: "banque-services-financiers",
    commercialStem: "Banque_Services_Financiers",
    title: "Banque & Services Financiers",
    subtitle: "Accélérer le reporting, les contrôles et la relation client sans affaiblir la maîtrise du risque.",
    tagline:
      "Pour les banques, institutions financières et directions support qui veulent transformer l’IA en productivité mesurable, conformité renforcée et qualité de service plus stable.",
    accent: "navy",
    manualCourses: [
      "Reporting Financier Automatisé",
      "Audit Interne Augmenté par l'IA",
      "Conformité Anti-Blanchiment et IA",
      "Analyse de Contrats avec l'IA",
      "Relation Client Augmentée par l'IA",
      "Leadership Data-Driven avec l'IA",
    ],
    crmSectors: ["Banque / Finance", "Banque / Habitat", "Finance / Bourse", "Microfinance", "Fintech / Banque"],
    contextNarrative:
      "Dans ce secteur, la valeur de l’IA se mesure dans la vitesse de lecture, la fiabilité des contrôles, la qualité des notes de décision et la cohérence des interactions client.",
    priorities: [
      priority("Reporting encore lourd", "Les équipes consacrent trop de temps à commenter, reformater et consolider les mêmes chiffres.", "Les synthèses et notes financières se préparent plus vite avec une meilleure lisibilité managériale."),
      priority("Contrôles dispersés", "Les revues d’écarts, d’anomalies et de conformité mobilisent beaucoup d’efforts manuels.", "Les points de vigilance ressortent plus tôt pour concentrer les expertises sur les vrais arbitrages."),
      priority("Relation client à harmoniser", "Les réponses sur produits, pièces et délais varient selon les canaux et les équipes.", "Les scripts et bases de réponse rendent le service plus homogène sans rigidifier les conseillers."),
      priority("Décisions lentes", "Les comités reçoivent une information utile mais souvent trop brute ou trop tardive.", "Les décideurs gagnent des notes plus courtes, plus commentées et plus directement actionnables."),
    ],
    roiMetrics: [
      roi("25 à 45 %", "sur le temps de reporting", "commentaires, consolidations, notes de comité"),
      roi("Contrôles plus homogènes", "sur plusieurs équipes", "finance, conformité, audit, opérations"),
      roi("Réponse plus cohérente", "dans la relation client", "scripts, FAQ, réclamations, suivi"),
      roi("Décision plus rapide", "pour les managers", "écarts, risques, arbitrages, priorités"),
    ],
    useCases: [
      useCase("Reporting et commentaires de performance", "Les tableaux existent mais prennent du temps à expliquer et à reformuler.", "L’IA accélère les synthèses, commentaires et supports destinés à la direction.", "Temps de production ; délai avant diffusion"),
      useCase("Conformité, KYC et vigilance", "Les contrôles documentaires et signalements restent chronophages.", "Les équipes repèrent plus vite les écarts, pièces manquantes et points sensibles.", "Temps de revue ; nombre d’anomalies détectées tôt"),
      useCase("Analyse contractuelle et comité crédit", "Les dossiers demandent une lecture longue avant arbitrage humain.", "Les éléments de synthèse ressortent mieux pour préparer la décision.", "Temps de préparation dossier ; délai d’arbitrage"),
      useCase("Service client bancaire augmenté", "Les demandes récurrentes saturent les équipes et créent des réponses hétérogènes.", "Les conseillers gagnent un assistant de réponse encadré pour les cas récurrents.", "Temps moyen de réponse ; taux de résolution premier niveau"),
    ],
    standardization: [
      "Réduire le temps passé à relire des chiffres déjà disponibles.",
      "Rendre la conformité et les contrôles plus réguliers et plus traçables.",
      "Mieux outiller la relation client sans perdre la supervision humaine.",
      "Donner à la direction une lecture plus rapide des risques et arbitrages.",
    ],
    trust: ["Les usages sensibles restent encadrés par validation humaine, règles de conformité et supervision des accès."],
  }),
  spec({
    slug: "telecommunications",
    commercialStem: "Telecommunications",
    title: "Télécommunications",
    subtitle: "Mieux coordonner service client, opérations, réseau et pilotage dans des environnements à fort volume.",
    tagline:
      "Pour les opérateurs télécoms et directions support qui veulent transformer l’IA en meilleure réactivité, meilleure qualité de service et meilleure lecture des incidents.",
    accent: "orange",
    manualCourses: [
      "Chatbots Intelligents pour le Service Client",
      "Expérience Client Omnicanale avec l'IA",
      "Support Prédictif et Maintenance Anticipée",
      "Power BI et Tableaux de Bord IA",
      "Automatisation Administrative avec l'IA",
      "Conduite du Changement IA en Entreprise",
    ],
    crmSectors: ["Télécommunications", "Régulation / Télécoms", "Médias / Télécoms", "Administration / Numérique"],
    contextNarrative:
      "Le ROI se lit ici dans la réduction des temps de réponse, la coordination entre réseau et service client, la synthèse des incidents et la vitesse de pilotage managérial.",
    priorities: [
      priority("Flux clients massifs", "Les demandes récurrentes arrivent sur plusieurs canaux avec des niveaux de qualité variables.", "Les équipes gagnent des réponses plus homogènes et une meilleure continuité de traitement."),
      priority("Incidents réseau difficiles à relire", "Les informations utiles sont nombreuses mais difficiles à consolider rapidement.", "Les managers disposent de synthèses plus lisibles pour arbitrer plus tôt."),
      priority("Scripts et procédures dispersés", "Les conseillers et équipes terrain cherchent souvent l’information utile dans plusieurs sources.", "Une base structurée améliore la cohérence et réduit les hésitations au quotidien."),
      priority("Pilotage lent", "Les KPI existent mais restent peu commentés pour l’action rapide.", "Les tableaux de bord gagnent en commentaires, alertes et priorités visibles."),
    ],
    roiMetrics: [
      roi("20 à 40 %", "sur les délais de réponse", "demandes simples, FAQ, suivi de premier niveau"),
      roi("Service plus homogène", "sur plusieurs canaux", "voix, mail, chat, terrain, agences"),
      roi("Réactivité accrue", "sur incidents et qualité", "alertes, escalades, priorisation"),
      roi("Managers mieux servis", "par les KPI", "commentaires automatiques et lecture plus rapide"),
    ],
    useCases: [
      useCase("Copilote service client multicanal", "Les conseillers reformulent sans cesse les mêmes réponses.", "Un assistant encadré accélère la réponse et la qualité rédactionnelle.", "Temps moyen de réponse ; taux de validation premier jet"),
      useCase("Synthèse tickets et incidents", "Les tickets et incidents restent longs à analyser à l’échelle.", "Les motifs récurrents et signaux faibles remontent plus vite.", "Temps d’analyse ; délai d’escalade"),
      useCase("Base procédures réseau et front office", "Les règles et scripts se diffusent inégalement entre équipes.", "Les bonnes consignes deviennent plus faciles à retrouver et à partager.", "Temps de recherche ; temps d’onboarding"),
      useCase("Commentaire IA du pilotage qualité", "Les dashboards sont visibles mais peu actionnables pour les managers.", "Les écarts et priorités sont commentés plus vite pour soutenir l’arbitrage.", "Temps de lecture des KPI ; réactivité de pilotage"),
    ],
    standardization: [
      "Relier plus clairement service client, opérations et pilotage.",
      "Réduire la charge répétitive sur les demandes récurrentes.",
      "Mieux diffuser procédures, scripts et consignes réseau.",
      "Rendre les incidents et KPI plus faciles à commenter et à piloter.",
    ],
  }),
  spec({
    slug: "assurance",
    commercialStem: "Assurance",
    title: "Assurance",
    subtitle: "Réduire les délais de traitement, mieux fiabiliser la conformité et mieux exploiter les dossiers clients.",
    tagline:
      "Pour les compagnies d’assurance et directions métiers qui veulent transformer l’IA en gains de cycle, qualité documentaire et meilleure lecture des sinistres, contrats et contrôles.",
    accent: "gold",
    manualCourses: [
      "Analyse de Contrats avec l'IA",
      "Conformité Anti-Blanchiment et IA",
      "Reporting Financier Automatisé",
      "Analyse de Sentiment et Feedback Client",
      "Gestion des Réclamations Automatisée",
      "People Analytics : Données RH et IA",
    ],
    crmSectors: ["Assurance", "Retraite / Protection sociale", "Santé / Protection sociale"],
    contextNarrative:
      "Dans l’assurance, l’IA devient utile quand elle réduit les délais de lecture, d’analyse et de réponse tout en renforçant la traçabilité et le contrôle humain.",
    priorities: [
      priority("Dossiers lourds à relire", "Sinistres, contrats, pièces et relances mobilisent beaucoup de temps administratif.", "Les premières synthèses et points de vigilance ressortent plus vite avant validation experte."),
      priority("Réclamations peu capitalisées", "Les retours clients sont traités sans toujours nourrir les améliorations de parcours.", "Les motifs récurrents deviennent plus visibles pour corriger le service et les scripts."),
      priority("Conformité exigeante", "Les équipes doivent concilier vitesse, précision et discipline documentaire.", "Les routines de contrôle et de revue gagnent en cohérence et en régularité."),
      priority("Pilotage multi-équipes", "Gestion, conformité, finance et relation client travaillent avec des visions trop séparées.", "Les managers gagnent une lecture plus partagée des priorités et risques."),
    ],
    roiMetrics: [
      roi("25 à 45 %", "sur la préparation des dossiers", "contrats, sinistres, synthèses, relances"),
      roi("Réclamations mieux lues", "pour le pilotage", "verbatims, motifs, points d’amélioration"),
      roi("Conformité plus homogène", "sur plusieurs entités", "pièces, vigilance, traçabilité"),
      roi("Décision plus fluide", "pour les responsables", "notes, alertes, priorités visibles"),
    ],
    useCases: [
      useCase("Synthèse de dossiers et sinistres", "Les équipes relisent beaucoup de pièces avant de traiter ou arbitrer.", "Les éléments utiles sont résumés plus vite pour accélérer la décision.", "Temps de revue ; délai de traitement"),
      useCase("Analyse contractuelle et conformité", "Les clauses, écarts et pièces sensibles sont longs à recouper.", "Les points de vigilance remontent plus tôt pour contrôle humain.", "Temps de revue ; nombre d’écarts identifiés"),
      useCase("Réclamations et qualité de service", "Les retours client sont nombreux mais peu consolidés.", "Les motifs et irritants sont regroupés pour nourrir les actions correctives.", "Temps d’analyse ; délai de correction"),
      useCase("Reporting managérial et pilotage de portefeuille", "Les managers reçoivent des chiffres encore trop bruts.", "Les tableaux gagnent en commentaires et en lecture métier.", "Temps de reporting ; délai d’arbitrage"),
    ],
    standardization: [
      "Rendre les revues de dossiers plus rapides et plus cohérentes.",
      "Mieux relier conformité, relation client et pilotage.",
      "Réduire les cycles sur les tâches répétitives à forte volumétrie.",
      "Créer des standards documentaires plus stables pour les équipes.",
    ],
    trust: ["Les décisions sensibles sur contrats, sinistres et conformité restent validées par des responsables habilités."],
  }),
  spec({
    slug: "hotellerie-tourisme",
    commercialStem: "Hotellerie_Tourisme",
    title: "Hôtellerie & Tourisme",
    subtitle: "Renforcer l’expérience client, la coordination terrain et la qualité de service dans les parcours d’accueil.",
    tagline:
      "Pour les groupes hôteliers, résidences, sites touristiques et fonctions support qui veulent transformer l’IA en réactivité, standard de service et meilleure coordination des équipes.",
    accent: "orange",
    manualCourses: [
      "Expérience Client Omnicanale avec l'IA",
      "Création de Contenu Marketing avec l'IA",
      "Gestion de Projets Augmentée par l'IA",
      "Analyse de Sentiment et Feedback Client",
      "Organisation Digitale et IA",
      "Communication Professionnelle & IA",
    ],
    crmSectors: ["Hôtellerie / Tourisme", "Hôtellerie", "Restauration rapide"],
    contextNarrative:
      "Le secteur attend surtout des gains visibles sur la relation client, la coordination interne, la qualité de réponse et l’exploitation rapide des retours clients.",
    priorities: [
      priority("Qualité de service inégale", "Les réponses et standards varient selon les équipes, les horaires et la pression terrain.", "Les scripts, bases de réponses et routines rendent le service plus constant."),
      priority("Feedback client sous-exploité", "Les avis, réclamations et commentaires remontent sans toujours être transformés en actions.", "Les managers lisent plus vite les irritants et priorisent mieux les corrections."),
      priority("Coordination front / back laborieuse", "Accueil, réservation, restauration et opérations partagent difficilement la bonne information au bon moment.", "Les briefs et synthèses améliorent la fluidité entre équipes."),
      priority("Communication commerciale lente", "Les contenus promotionnels et messages clients prennent du temps à produire.", "Les équipes marketing et opérationnelles gagnent en cadence sans diluer la marque."),
    ],
    roiMetrics: [
      roi("Réponse plus rapide", "sur les demandes client", "avant séjour, pendant séjour, après séjour"),
      roi("Service plus homogène", "entre équipes et sites", "scripts, consignes, réponses types"),
      roi("Feedback plus utile", "pour les managers", "avis, réclamations, causes récurrentes"),
      roi("Production plus fluide", "des contenus", "messages clients, offres, supports"),
    ],
    useCases: [
      useCase("Assistant de réponse accueil et réservation", "Les équipes réécrivent souvent les mêmes réponses aux mêmes demandes.", "Un assistant encadré accélère la réponse avec le bon ton de service.", "Temps moyen de réponse ; satisfaction client"),
      useCase("Synthèse des avis et réclamations", "Les retours clients sont nombreux mais longs à lire globalement.", "Les motifs récurrents ressortent plus vite pour action corrective.", "Temps d’analyse ; délai de correction"),
      useCase("Briefs d’exploitation et coordination de service", "Les consignes circulent mal entre équipes et shifts.", "Les briefs deviennent plus clairs pour l’accueil, l’hébergement et les opérations.", "Temps de transmission ; nombre d’erreurs évitées"),
      useCase("Contenus marketing et offres saisonnières", "Les messages commerciaux prennent du temps à concevoir et à adapter.", "Les équipes produisent plus vite des variantes cohérentes avec la marque.", "Temps de production ; rythme de campagne"),
    ],
    standardization: [
      "Stabiliser les standards de service sur plusieurs équipes.",
      "Mieux exploiter la voix du client pour corriger rapidement.",
      "Fluidifier la coordination entre accueil, opérations et communication.",
      "Donner aux managers une lecture plus rapide des irritants service.",
    ],
  }),
  spec({
    slug: "agro-industrie-cacao",
    commercialStem: "Agro_Industrie_Cacao",
    title: "Agro-industrie & Cacao",
    subtitle: "Mieux piloter les flux, la qualité, les partenaires terrain et la performance dans des chaînes étendues.",
    tagline:
      "Pour les groupes agro-industriels, acteurs cacao et fonctions support qui veulent transformer l’IA en coordination opérationnelle, qualité documentaire et meilleure lecture des données terrain.",
    accent: "teal",
    manualCourses: [
      "Optimisation des Processus Métier avec l'IA",
      "Planification et Suivi des Indicateurs avec l'IA",
      "Gestion des Achats et Approvisionnement IA",
      "Business Intelligence et IA",
      "Gestion Documentaire Intelligente",
      "Leadership Data-Driven avec l'IA",
    ],
    crmSectors: ["Agro-industrie / Cacao", "Agro-industrie / Hévéa", "Agro-industrie / Palmier", "Fédération agro-industrielle"],
    contextNarrative:
      "Le ROI se lit ici dans la lecture plus rapide des opérations, la meilleure circulation de l’information entre terrain et siège et la standardisation des suivis qualité, achats et logistique.",
    priorities: [
      priority("Flux terrain difficiles à consolider", "Les remontées plantations, usines, achats et qualité restent dispersées.", "Les responsables gagnent des synthèses plus nettes pour arbitrer plus vite."),
      priority("Documents et contrôles hétérogènes", "Les fiches, comptes rendus et suivis changent selon les équipes ou les sites.", "Des formats plus stables améliorent la comparaison et la continuité."),
      priority("Pilotage qualité lent", "Les incidents, écarts et tendances sont visibles trop tard.", "Les signaux utiles ressortent plus tôt pour limiter les dérives."),
      priority("Coordination siège / terrain fragile", "Les équipes opérationnelles et support travaillent avec des rythmes d’information différents.", "Les routines de brief et de synthèse améliorent la coordination."),
    ],
    roiMetrics: [
      roi("Lecture plus rapide", "des opérations terrain", "qualité, achats, flux, incidents"),
      roi("Contrôles plus homogènes", "sur plusieurs sites", "fiches, audits, reporting"),
      roi("Coordination renforcée", "entre terrain et siège", "briefs, relances, décisions"),
      roi("Décisions mieux étayées", "pour les managers", "synthèses KPI et alertes"),
    ],
    useCases: [
      useCase("Commentaires des KPI industriels et terrain", "Les données existent mais demandent un effort important de lecture.", "Les écarts, tendances et alertes sont mieux expliqués aux responsables.", "Temps de reporting ; délai d’arbitrage"),
      useCase("Suivi qualité et incidents", "Les non-conformités et signaux faibles se perdent dans des fichiers multiples.", "Les points critiques deviennent plus visibles avant impact plus lourd.", "Temps de détection ; nombre d’incidents qualifiés"),
      useCase("Achats, approvisionnements et partenaires", "Les suivis fournisseurs et terrain restent manuels et peu harmonisés.", "Les équipes disposent de synthèses plus fiables pour leurs relances et arbitrages.", "Temps de suivi ; délai de traitement"),
      useCase("Base documentaire d’exploitation", "Les standards et procédures sont difficiles à retrouver ou transmettre.", "Une base simple rend les documents plus accessibles et plus durables.", "Temps de recherche ; homogénéité documentaire"),
    ],
    standardization: [
      "Mieux relier opérations, qualité et fonctions support.",
      "Réduire les délais de lecture des indicateurs terrain.",
      "Rendre les contrôles et documents plus homogènes entre sites.",
      "Créer un pilotage plus lisible des incidents et des priorités.",
    ],
  }),
  spec({
    slug: "fintech-mobile-money",
    commercialStem: "Fintech_Mobile_Money",
    title: "Fintech & Mobile Money",
    subtitle: "Accélérer l’assistance client, la conformité et le pilotage produit dans des environnements très transactionnels.",
    tagline:
      "Pour les fintechs, acteurs mobile money et plateformes de paiement qui veulent transformer l’IA en meilleure réactivité, contrôle renforcé et meilleure lecture des flux clients.",
    accent: "navy",
    manualCourses: [
      "Conformité Anti-Blanchiment et IA",
      "Chatbots Intelligents pour le Service Client",
      "SQL et Bases de Données pour l'Analyse IA",
      "Mesurer la Satisfaction Client avec l'IA",
      "Prévisions Budgétaires Assistées par IA",
      "Gouvernance des Données et IA",
    ],
    crmSectors: ["Fintech / Mobile Money", "Fintech / Banque", "E-commerce"],
    contextNarrative:
      "Dans cet univers, la valeur de l’IA repose sur la qualité de réponse, la vitesse de lecture des incidents, la conformité et la capacité à mieux commenter les données d’usage.",
    priorities: [
      priority("Support client sous pression", "Les demandes récurrentes sur comptes, paiements et incidents s’accumulent vite.", "Les équipes gagnent un premier niveau de réponse plus rapide et plus cohérent."),
      priority("Conformité et vigilance exigeantes", "Les revues liées aux risques, anomalies et pièces consomment du temps.", "Les points critiques ressortent plus tôt pour contrôle humain et action ciblée."),
      priority("Données nombreuses mais peu commentées", "Les flux transactionnels existent mais restent difficiles à raconter aux managers.", "Les KPI produit et service gagnent en commentaire et en lisibilité."),
      priority("Coordination produit / opérations / support", "Les équipes avancent parfois avec des signaux partiels et tardifs.", "Les synthèses améliorent l’alignement entre support, conformité et management."),
    ],
    roiMetrics: [
      roi("Temps de réponse réduit", "sur les demandes simples", "support, guidance, suivi d’incident"),
      roi("Vigilance renforcée", "sur anomalies et conformité", "détection et revue plus rapides"),
      roi("KPI plus lisibles", "pour les managers", "usage, incidents, qualité de service"),
      roi("Équipes mieux alignées", "sur les priorités", "produit, support, opérations, conformité"),
    ],
    useCases: [
      useCase("Assistant support mobile money", "Les agents répondent souvent aux mêmes questions dans l’urgence.", "Les réponses sont guidées plus vite avec une meilleure cohérence.", "Temps moyen de réponse ; taux de résolution premier niveau"),
      useCase("Analyse d’anomalies et contrôle renforcé", "Les signaux d’exception demandent trop de temps de tri et de lecture.", "Les revues se concentrent plus tôt sur les cas à traiter en priorité.", "Temps de revue ; volume d’anomalies qualifiées"),
      useCase("Commentaire des KPI d’usage", "Les tableaux de bord restent trop bruts pour soutenir les arbitrages.", "Les managers gagnent des synthèses plus pédagogiques et plus rapides.", "Temps de lecture ; délai de décision"),
      useCase("Voix du client et irritants produit", "Les retours utilisateur sont nombreux mais difficiles à consolider.", "Les motifs prioritaires ressortent plus vite pour corriger parcours et messages.", "Temps d’analyse ; délai de correction"),
    ],
    standardization: [
      "Fluidifier l’assistance client dans les flux à fort volume.",
      "Renforcer les routines de conformité et de vigilance documentaire.",
      "Rendre les KPI produit et service plus actionnables pour la direction.",
      "Mieux relier support, produit, opérations et conformité.",
    ],
    trust: ["Les usages liés au risque et à la conformité restent encadrés par validation humaine et règles d’accès strictes."],
  }),
  spec({
    slug: "energie-petrole-gaz",
    commercialStem: "Energie_Petrole_Gaz",
    title: "Énergie, Pétrole & Gaz",
    subtitle: "Mieux piloter les comptes, les opérations, la maintenance et la qualité de service dans des environnements sensibles.",
    tagline:
      "Pour les acteurs du pétrole, du gaz et des réseaux associés qui veulent transformer l’IA en coordination, rigueur documentaire et meilleure lecture des incidents et KPI.",
    accent: "gold",
    manualCourses: [
      "Support Prédictif et Maintenance Anticipée",
      "Reporting Financier Automatisé",
      "Optimisation des Processus Métier avec l'IA",
      "Conformité HSE et IA",
      "Gestion de Flotte et Logistique IA",
      "Leadership Data-Driven avec l'IA",
    ],
    crmSectors: ["Énergie / Pétrole & Gaz", "Mines / Or", "Industrie / Raffinage"],
    contextNarrative:
      "Le bon angle n’est pas l’effet gadget. Il est dans la lecture plus rapide des flux critiques, la préparation des arbitrages et la discipline de gouvernance autour d’environnements sensibles.",
    priorities: [
      priority("Flux critiques dispersés", "Comptes, distribution, maintenance et incidents sont suivis dans des circuits séparés.", "Les responsables gagnent une lecture plus consolidée pour arbitrer plus tôt."),
      priority("Maintenance coûteuse", "Les signaux faibles sont visibles trop tard ou peu commentés.", "Les alertes et historiques sont mieux exploités pour orienter la réaction humaine."),
      priority("Service et distribution variables", "Les demandes liées aux cartes, opérations ou incidents reçoivent des réponses inégales.", "Les équipes disposent d’une information plus homogène et plus fraîche."),
      priority("Cadre HSE lourd à maintenir", "La production documentaire et les contrôles prennent du temps et se dispersent.", "Les standards gagnent en traçabilité et en facilité de mise à jour."),
    ],
    roiMetrics: [
      roi("Lecture plus rapide", "des opérations", "portefeuille, incidents, maintenance, support"),
      roi("Réactivité accrue", "sur les anomalies", "alertes, synthèses, priorisation"),
      roi("Service plus homogène", "dans les réseaux", "scripts, information, réponses types"),
      roi("Conformité mieux tenue", "sur les documents", "HSE, standards, reporting"),
    ],
    useCases: [
      useCase("Pilotage des comptes et de la performance", "Les éléments utiles au suivi restent éparpillés entre plusieurs acteurs.", "Les responsables gagnent des synthèses plus rapides pour suivre relances et arbitrages.", "Temps de préparation comité ; délai de décision"),
      useCase("Maintenance et support prédictif", "Les incidents et historiques sont longs à consolider.", "Les alertes et points d’attention deviennent plus lisibles avant action humaine.", "Temps de détection ; temps de réaction"),
      useCase("Service client et réseau de distribution", "Les demandes sont traitées avec des niveaux de clarté variables.", "Les équipes gagnent des réponses plus homogènes et mieux documentées.", "Temps moyen de réponse ; taux de résolution premier niveau"),
      useCase("Conformité HSE et standardisation documentaire", "La documentation critique est lourde à produire et à maintenir.", "Les équipes mettent à jour plus vite les supports et contrôles utiles.", "Temps de préparation documentaire ; couverture de contrôle"),
    ],
    standardization: [
      "Relier plus clairement opérations, maintenance et service.",
      "Réduire la charge de reporting et de synthèse des flux critiques.",
      "Renforcer la gouvernance documentaire dans des environnements sensibles.",
      "Créer des KPI plus lisibles pour la direction et l’exploitation.",
    ],
    trust: ["Les usages critiques restent pilotés avec validation humaine, règles d’accès strictes et progression par pilote."],
  }),
  spec({
    slug: "electricite-utilities-eau",
    commercialStem: "Electricite_Utilities_Eau",
    title: "Électricité, Utilities & Eau",
    subtitle: "Améliorer la qualité de service, la coordination d’exploitation et la lecture des incidents à grande échelle.",
    tagline:
      "Pour les acteurs de l’électricité, de l’eau et des utilities qui veulent transformer l’IA en meilleure continuité d’information, meilleurs commentaires KPI et meilleure réactivité terrain.",
    accent: "teal",
    manualCourses: [
      "Planification et Suivi des Indicateurs avec l'IA",
      "Relation Client Augmentée par l'IA",
      "Support Prédictif et Maintenance Anticipée",
      "Gestion Documentaire Intelligente",
      "Tableaux de Bord Administratifs avec l'IA",
      "Optimisation des Processus Métier avec l'IA",
    ],
    crmSectors: ["Énergie / Électricité", "Eau / Utilities", "Énergie / Stockage", "Énergie / Production"],
    contextNarrative:
      "Le ROI s’observe dans la fluidité entre exploitation, relation usager et pilotage, avec une meilleure capacité à commenter incidents, réclamations et performance.",
    priorities: [
      priority("Incidents difficiles à commenter", "Les équipes accumulent des données d’exploitation mais les relient difficilement à une lecture managériale claire.", "Les responsables disposent de synthèses plus utiles pour arbitrer et communiquer."),
      priority("Relation usager sous tension", "Les demandes et réclamations reviennent en volume avec des réponses variables.", "Les scripts et bases de réponse rendent le service plus cohérent."),
      priority("Documents et procédures dispersés", "Les consignes, modèles et supports circulent sans référentiel simple.", "Les équipes accèdent plus vite aux bonnes procédures et messages."),
      priority("Coordination terrain / siège lente", "Les priorités ne remontent pas toujours à temps entre exploitation et management.", "Les routines de synthèse et de brief facilitent l’action rapide."),
    ],
    roiMetrics: [
      roi("Réactivité accrue", "sur incidents et réclamations", "lecture, synthèse, priorisation"),
      roi("Service plus homogène", "côté usager", "réponses, guidance, information de base"),
      roi("KPI plus utiles", "pour l’exploitation", "commentaires automatiques et alertes"),
      roi("Procédures mieux diffusées", "dans les équipes", "consignes, modèles, supports"),
    ],
    useCases: [
      useCase("Synthèse incidents et exploitation", "Les signaux et événements prennent du temps à transformer en décisions.", "Les responsables gagnent des vues consolidées plus lisibles.", "Temps de lecture ; délai d’arbitrage"),
      useCase("Assistant de réponse usager", "Les agents reformulent sans cesse les mêmes réponses.", "Les équipes gagnent un copilote de réponse cohérent et gouverné.", "Temps moyen de réponse ; taux de résolution premier niveau"),
      useCase("Base procédures et consignes réseau", "Les documents utiles sont dispersés dans plusieurs dossiers.", "Les procédures deviennent plus faciles à retrouver et à actualiser.", "Temps de recherche ; homogénéité de diffusion"),
      useCase("Commentaire KPI qualité de service", "Les tableaux de bord restent trop bruts pour le management.", "Les écarts et alertes sont commentés plus vite pour soutenir les décisions.", "Temps de reporting ; réactivité de pilotage"),
    ],
    standardization: [
      "Mieux relier exploitation, service usager et pilotage.",
      "Rendre les incidents et KPI plus lisibles pour les responsables.",
      "Réduire les redites sur les demandes récurrentes côté usager.",
      "Diffuser plus proprement les procédures et supports d’exploitation.",
    ],
  }),
  spec({
    slug: "transport-logistique",
    commercialStem: "Transport_Logistique",
    title: "Transport & Logistique",
    subtitle: "Mieux piloter les opérations terrain, les retards et la qualité de service en environnement distribué.",
    tagline:
      "Pour les acteurs du transport, de la mobilité et des chaînes logistiques qui veulent transformer l’IA en meilleure coordination, meilleurs KPI et meilleur service.",
    accent: "teal",
    manualCourses: [
      "Gestion de Flotte et Logistique IA",
      "Planification et Suivi des Indicateurs avec l'IA",
      "Optimisation des Processus Métier avec l'IA",
      "Relation Client Augmentée par l'IA",
      "Support Prédictif et Maintenance Anticipée",
      "Gestion des Achats et Approvisionnement IA",
    ],
    crmSectors: ["Logistique / Transport", "Transport / Mobilité", "Transport urbain", "Transport aérien", "Transport en commun"],
    contextNarrative:
      "La valeur se joue ici sur la coordination terrain, la réduction des retards, la lecture des anomalies et la capacité à mieux commenter les opérations.",
    priorities: [
      priority("Informations terrain dispersées", "Les opérations, incidents, tournées et retards remontent par plusieurs canaux.", "Les équipes gagnent des synthèses plus rapides et une meilleure visibilité d’action."),
      priority("Pilotage peu commenté", "Les KPI existent mais restent peu reliés à des analyses exploitables.", "Les indicateurs gagnent en contexte, en commentaire et en capacité d’alerte."),
      priority("Service client et opérations trop séparés", "Le client vit les perturbations avant que les équipes disposent d’un message homogène.", "L’information circule mieux entre terrain, exploitation et relation client."),
      priority("Maintenance réactive", "Les signaux utiles sont peu capitalisés avant hausse des coûts terrain.", "Les écarts et incidents deviennent plus visibles pour une réaction plus rapide."),
    ],
    roiMetrics: [
      roi("Moins de retards subis", "dans les opérations", "meilleure lecture des points de friction"),
      roi("Coordination plus rapide", "entre terrain et managers", "synthèses, alertes, relances"),
      roi("Service plus homogène", "côté client", "information plus claire en cas d’incident"),
      roi("KPI plus actionnables", "pour l’exploitation", "commentaires et priorités visibles"),
    ],
    useCases: [
      useCase("Cockpit synthétique des opérations", "Les responsables reçoivent beaucoup d’informations mais peinent à voir quoi arbitrer.", "Les flux et incidents sont résumés de façon plus lisible pour l’exploitation.", "Temps de lecture des incidents ; réactivité de coordination"),
      useCase("Gestion de flotte et anomalies", "Les données de flotte et de trajets sont difficiles à transformer en décisions rapides.", "Les anomalies et exceptions ressortent plus tôt pour les équipes concernées.", "Temps de détection ; nombre d’anomalies qualifiées"),
      useCase("Interface opérations / service client", "Les équipes relation client manquent d’un message cohérent et actualisé en cas de perturbation.", "Les réponses client s’appuient sur une information plus consolidée.", "Temps de réponse client ; taux de résolution premier contact"),
      useCase("Maintenance et support prédictif", "Les signaux précurseurs sont traités trop tard ou mal commentés.", "L’IA aide à structurer alertes, historiques et points d’attention.", "Délai d’escalade ; temps d’immobilisation évité"),
    ],
    standardization: [
      "Aider l’exploitation à voir plus vite exceptions et retards.",
      "Mieux relier le terrain, les managers et le service client.",
      "Structurer des routines de suivi plus homogènes entre sites.",
      "Créer des KPI commentés qui servent réellement aux arbitrages.",
    ],
  }),
  spec({
    slug: "logistique-portuaire-fret",
    commercialStem: "Logistique_Portuaire_Fret",
    title: "Logistique Portuaire & Fret",
    subtitle: "Fluidifier la coordination portuaire, documentaire et opérationnelle dans des chaînes de flux complexes.",
    tagline:
      "Pour les terminaux, acteurs portuaires et opérateurs fret qui veulent transformer l’IA en meilleure lecture des flux, meilleure discipline documentaire et meilleure coordination interéquipes.",
    accent: "navy",
    manualCourses: [
      "Gestion de Flotte et Logistique IA",
      "Gestion Documentaire Intelligente",
      "Planification et Suivi des Indicateurs avec l'IA",
      "Optimisation des Processus Métier avec l'IA",
      "Support Prédictif et Maintenance Anticipée",
      "Tableaux de Bord Administratifs avec l'IA",
    ],
    crmSectors: ["Logistique portuaire", "Logistique / Fret", "Port / Logistique", "Transport aérien / Aéroport"],
    contextNarrative:
      "Le secteur attend des gains visibles sur la lecture des flux, la traçabilité documentaire, la coordination des incidents et la rapidité des synthèses d’exploitation.",
    priorities: [
      priority("Documentation dense", "Bordereaux, mouvements, incidents et validations circulent dans des séquences lourdes.", "Les pièces et synthèses deviennent plus faciles à relire, retrouver et partager."),
      priority("Coordination multi-acteurs", "Terminaux, transit, sûreté, exploitation et support avancent avec des rythmes d’information différents.", "Les briefs et synthèses améliorent l’alignement opérationnel."),
      priority("Anomalies peu visibles", "Les écarts remontent sans hiérarchisation claire.", "Les responsables lisent mieux les exceptions et priorisent plus vite."),
      priority("Pilotage exigeant", "Les KPI opérationnels restent trop bruts pour la décision rapide.", "Les indicateurs gagnent en commentaires et en contexte métier."),
    ],
    roiMetrics: [
      roi("Traçabilité renforcée", "sur les flux documentaires", "classement, synthèse, récupération"),
      roi("Coordination plus nette", "entre les acteurs", "briefs, incidents, priorités"),
      roi("Exceptions mieux lues", "par l’exploitation", "alertes, écarts, arbitrages"),
      roi("KPI plus utilisables", "pour les managers", "commentaires et rythme de pilotage"),
    ],
    useCases: [
      useCase("Base documentaire d’exploitation portuaire", "Les documents critiques sont dispersés et difficiles à consolider.", "Une base structurée rend l’information plus accessible et mieux rangée.", "Temps de recherche ; qualité de classement"),
      useCase("Synthèse mouvements et incidents", "Les managers reçoivent une masse d’informations peu hiérarchisée.", "Les mouvements, retards et incidents sont résumés pour action rapide.", "Temps de lecture ; réactivité de coordination"),
      useCase("Pilotage d’exceptions et alertes", "Les écarts sont visibles tardivement ou sans priorisation claire.", "Les exceptions ressortent plus tôt pour traitement ciblé.", "Temps de détection ; délai d’escalade"),
      useCase("Commentaire des KPI de terminal ou fret", "Les tableaux de bord restent techniques et peu pédagogiques.", "Les responsables disposent d’une lecture plus managériale des indicateurs.", "Temps de reporting ; délai d’arbitrage"),
    ],
    standardization: [
      "Mieux structurer la discipline documentaire autour des flux.",
      "Réduire le temps de lecture des incidents et exceptions.",
      "Relier plus proprement exploitation, support et management.",
      "Donner aux KPI un commentaire plus directement exploitable.",
    ],
  }),
  spec({
    slug: "sante-protection-sociale",
    commercialStem: "Sante_Protection_Sociale",
    title: "Santé & Protection Sociale",
    subtitle: "Améliorer la qualité documentaire, la relation usager et le pilotage non clinique avec une IA responsable.",
    tagline:
      "Pour les hôpitaux, cliniques, caisses et structures de protection sociale qui veulent transformer l’IA en meilleure documentation, meilleure prévention et meilleure qualité de service.",
    accent: "teal",
    manualCourses: [
      "Programmes de Santé au Travail avec l'IA",
      "QVT et IA : Qualité de Vie au Travail",
      "Gestion des Réclamations Automatisée",
      "Analyse de Sentiment et Feedback Client",
      "Gestion Documentaire Intelligente",
      "Conformité HSE et IA",
    ],
    crmSectors: ["Santé / Hôpital", "Santé / Clinique", "Santé / Polyclinique", "Santé / Protection sociale", "Santé / International"],
    contextNarrative:
      "Le bon positionnement ne porte pas sur l’acte clinique automatisé. Il porte sur la documentation, la prévention, la relation usager et le pilotage des programmes.",
    priorities: [
      priority("Charge documentaire élevée", "Rapports, fiches, notes et supports absorbent beaucoup de temps utile.", "La documentation non clinique gagne en vitesse et en homogénéité."),
      priority("Relation usager perfectible", "Les questions et réclamations sont nombreuses et peu capitalisées.", "Les équipes gagnent des réponses plus cohérentes et un meilleur suivi des motifs."),
      priority("Retours terrain sous-exploités", "Incidents, questionnaires et verbatims remontent lentement dans les décisions.", "Les responsables lisent plus vite les signaux faibles et les priorités d’amélioration."),
      priority("Programmes difficiles à piloter", "QVT, HSE, prévention et qualité manquent parfois de supports de suivi clairs.", "Les indicateurs et plans d’action gagnent en continuité documentaire."),
    ],
    roiMetrics: [
      roi("25 à 45 %", "sur la documentation", "rapports, supports, synthèses, fiches"),
      roi("Réponse plus cohérente", "côté usager", "guidance, réclamations, information"),
      roi("Signaux mieux lus", "pour les responsables", "incidents, retours, questionnaires"),
      roi("Programmes plus stables", "dans la durée", "QVT, prévention, qualité, HSE"),
    ],
    useCases: [
      useCase("Documentation qualité et rapports non cliniques", "Les équipes rédigent de nombreux documents répétitifs à forte contrainte de forme.", "Les rapports et supports gagnent en vitesse de préparation.", "Temps de rédaction ; taux de conformité documentaire"),
      useCase("Assistant de réponse usager ou assuré", "Les demandes simples consomment beaucoup de temps répétitif.", "Un assistant encadré fluidifie les réponses récurrentes.", "Temps moyen de réponse ; satisfaction usager"),
      useCase("Analyse des retours et incidents", "Les signaux terrain remontent difficilement dans les décisions.", "Les responsables relisent plus vite motifs récurrents et points de vigilance.", "Temps d’analyse ; nombre d’actions correctives"),
      useCase("Pilotage QVT / HSE / prévention", "Les programmes existent mais restent difficiles à suivre dans le temps.", "Les plans d’action et indicateurs gagnent en visibilité.", "Rythme de mise à jour ; visibilité des plans d’action"),
    ],
    standardization: [
      "Accélérer la documentation sans s’aventurer sur des décisions cliniques automatisées.",
      "Mieux structurer la relation usager et l’analyse des retours.",
      "Donner aux responsables qualité et prévention une lecture plus rapide des signaux.",
      "Créer un cadre documentaire plus stable pour les programmes transverses.",
    ],
    trust: ["Les usages proposés excluent toute décision clinique automatisée et restent centrés sur documentation, prévention et pilotage."],
  }),
  spec({
    slug: "administration-publique",
    commercialStem: "Administration_Publique",
    title: "Administration Publique",
    subtitle: "Accélérer la qualité de service, la production documentaire et le pilotage administratif sans perdre en rigueur.",
    tagline:
      "Pour les ministères, agences, directions générales et structures parapubliques qui veulent transformer l’IA en meilleure qualité de réponse, meilleure coordination et meilleure lisibilité des priorités.",
    accent: "gold",
    manualCourses: [
      "Automatisation Administrative avec l'IA",
      "Gestion Documentaire Intelligente",
      "Rédaction Professionnelle Assistée par IA",
      "Tableaux de Bord Administratifs avec l'IA",
      "Conduite du Changement IA en Entreprise",
      "Gouvernance des Données et IA",
    ],
    crmSectors: ["Administration publique", "Administration / Numérique", "Régulation / Marchés publics", "Technologie / Géomatique", "PME / Développement"],
    contextNarrative:
      "Ici, la bonne promesse est une administration plus fluide, plus lisible et mieux outillée pour produire, coordonner, répondre et piloter sans effet gadget.",
    priorities: [
      priority("Production documentaire lourde", "Notes, courriers, synthèses et supports prennent beaucoup de temps dispersé.", "Les équipes gagnent des modèles plus stables et une rédaction plus rapide."),
      priority("Qualité de service inégale", "Les réponses aux usagers et partenaires varient selon les services et les personnes.", "Les standards de réponse deviennent plus homogènes et plus faciles à diffuser."),
      priority("Coordination transversale lente", "Les arbitrages et contributions remontent difficilement entre directions.", "Les briefs et synthèses facilitent la circulation des décisions."),
      priority("Pilotage administratif peu commenté", "Les indicateurs existent mais restent peu exploités pour agir rapidement.", "Les responsables disposent de commentaires KPI plus lisibles et plus actionnables."),
    ],
    roiMetrics: [
      roi("Temps de rédaction réduit", "sur notes et courriers", "supports, synthèses, correspondances"),
      roi("Service plus homogène", "entre directions", "réponses, modèles, scripts"),
      roi("Coordination améliorée", "sur les dossiers transverses", "briefs, relances, arbitrages"),
      roi("Pilotage plus utile", "pour les responsables", "KPI administratifs commentés"),
    ],
    useCases: [
      useCase("Rédaction administrative premium", "Les équipes repartent souvent de zéro sur des documents comparables.", "Des cadres guidés accélèrent la rédaction avec meilleure qualité de forme.", "Temps de rédaction ; taux de validation premier jet"),
      useCase("Base documentaire et procédures", "Les modèles et règles utiles sont dispersés.", "Une base simple facilite la recherche, la diffusion et la mise à jour.", "Temps de recherche ; homogénéité documentaire"),
      useCase("Synthèse de réunions et arbitrages", "Les décisions circulent mal après comités et séances de travail.", "Les comptes rendus et plans d’action deviennent plus nets.", "Délai d’envoi du compte rendu ; taux d’actions suivies"),
      useCase("Commentaire des KPI administratifs", "Les tableaux restent bruts et peu utiles à l’action rapide.", "Les écarts et priorités ressortent mieux pour le management.", "Temps de reporting ; délai d’arbitrage"),
    ],
    standardization: [
      "Rendre l’administration plus fluide sans affaiblir la rigueur.",
      "Mieux harmoniser les réponses et documents entre services.",
      "Réduire la dépendance à quelques personnes clés sur les routines documentaires.",
      "Créer un pilotage plus lisible des priorités administratives.",
    ],
    trust: ["Les usages restent encadrés par validation hiérarchique, confidentialité documentaire et supervision humaine finale."],
  }),
  spec({
    slug: "institutions-regionales-cooperation",
    commercialStem: "Institutions_Regionales_Cooperation",
    title: "Institutions Régionales & Coopération",
    subtitle: "Réduire le temps de veille, de briefing et de coordination documentaire autour de dossiers complexes.",
    tagline:
      "Pour les institutions régionales, organisations de coopération et structures de développement qui veulent transformer l’IA en meilleure préparation, meilleure synthèse et meilleure coordination.",
    accent: "gold",
    manualCourses: [
      "Diplomatie Digitale et Intelligence Artificielle",
      "Intelligence Artificielle et Analyse Géopolitique",
      "Communication Diplomatique à l'ère de l'IA",
      "Négociation Internationale et IA",
      "Leadership Diplomatique à l'ère de l'IA",
      "Gouvernance Mondiale de l'Intelligence Artificielle",
    ],
    crmSectors: ["Institution régionale", "Finance / Développement", "Développement durable", "Coopération / Développement", "Coopération / Culture"],
    contextNarrative:
      "La vraie valeur est dans la préparation, la veille, la coordination multilingue et la rapidité de diffusion de notes exploitables pour les décideurs.",
    priorities: [
      priority("Veille consommatrice de temps", "Suivre plusieurs pays, secteurs et partenaires demande un effort documentaire important.", "Les notes de veille et de synthèse se préparent plus vite et plus régulièrement."),
      priority("Briefings difficiles à produire", "Les missions, forums et rendez-vous demandent des fiches et éléments de langage lourds à assembler.", "La préparation devient plus structurée, plus rapide et plus partageable."),
      priority("Contenus multilingues dispersés", "Les documents circulent en plusieurs langues sans synthèse stable entre équipes.", "Les résumés et reformulations facilitent la coopération documentaire."),
      priority("Coordination lente", "Les arbitrages et contributions remontent difficilement entre directions ou partenaires.", "Les notes de convergence deviennent plus lisibles et plus rapides à diffuser."),
    ],
    roiMetrics: [
      roi("Veille beaucoup plus rapide", "sur plusieurs zones", "pays, secteurs, partenaires, risques"),
      roi("Briefings prêts plus tôt", "avant missions", "fiches, notes, éléments de langage"),
      roi("Coordination facilitée", "entre équipes", "synthèses et documents multilingues"),
      roi("Temps administratif réduit", "sur la préparation", "collecte, lecture, reformulation"),
    ],
    useCases: [
      useCase("Veille pays et sectorielle", "La veille est fragmentée entre sources, langues et notes peu harmonisées.", "Les équipes disposent plus vite d’une lecture consolidée.", "Temps de production d’une note ; fréquence de veille"),
      useCase("Briefings et missions", "Chaque mission redemande une forte préparation manuelle.", "Les fiches, synthèses et éléments de langage sont préparés plus vite.", "Temps de préparation ; délai de diffusion"),
      useCase("Synthèse multilingue et coopération", "Les contenus multilingues ralentissent la circulation des informations.", "Les notes circulent plus vite grâce à des résumés mieux structurés.", "Délai de diffusion ; nombre de documents traités"),
      useCase("Gouvernance et positions institutionnelles", "Les structures doivent suivre des sujets complexes sans toujours disposer d’un cadre opérationnel.", "Les décideurs disposent d’une lecture plus claire des enjeux et options.", "Temps de cadrage ; nombre de positions préparées"),
    ],
    standardization: [
      "Réduire le temps consommé par la veille et la préparation documentaire.",
      "Mieux préparer les missions et rendez-vous à fort enjeu.",
      "Structurer les contenus multilingues et la coopération documentaire.",
      "Créer un cadre plus lisible entre gouvernance, mission et exécution.",
    ],
    trust: ["Les positions sensibles restent validées par les responsables institutionnels et diplomatiques compétents."],
  }),
  spec({
    slug: "audit-conseil-certification",
    commercialStem: "Audit_Conseil_Certification",
    title: "Audit, Conseil & Certification",
    subtitle: "Réduire le temps de préparation, standardiser les livrables et mieux capitaliser les missions.",
    tagline:
      "Pour les cabinets d’audit, de conseil et d’inspection qui veulent transformer l’IA en meilleure productivité, meilleure qualité documentaire et meilleur partage des méthodes.",
    accent: "navy",
    manualCourses: [
      "Audit Interne Augmenté par l'IA",
      "Due Diligence Augmentée par l'IA",
      "Rédaction Professionnelle Assistée par IA",
      "Power BI et Tableaux de Bord IA",
      "Gestion de Projets Augmentée par l'IA",
      "Recherche Juridique Assistée par IA",
    ],
    crmSectors: ["Audit / Conseil", "Inspection / Certification", "BTP / Ingénierie"],
    contextNarrative:
      "La bonne promesse ici est claire : mieux préparer, mieux documenter, mieux synthétiser et mieux transmettre, sans dégrader la qualité des missions ni la responsabilité des experts.",
    priorities: [
      priority("Préparation mission lourde", "Collecte, cadrage, note de lancement et préparation d’entretiens prennent beaucoup de temps.", "Les équipes gagnent des bases plus structurées pour démarrer plus vite."),
      priority("Livrables hétérogènes", "Synthèses, rapports et présentations varient selon les consultants et les équipes.", "Les formats deviennent plus stables et plus faciles à relire."),
      priority("Capitalisation faible", "Les missions produisent beaucoup de matière mais peu de mémoire réutilisable.", "Les enseignements et standards deviennent mieux transmissibles."),
      priority("Lecture KPI peu pédagogique", "Les tableaux et constats techniques restent difficiles à raconter aux clients.", "Les commentaires et narrations managériales deviennent plus solides."),
    ],
    roiMetrics: [
      roi("30 à 50 %", "sur la préparation mission", "collecte, synthèse, cadrage, support"),
      roi("Livrables plus homogènes", "sur plusieurs équipes", "rapports, notes, présentations"),
      roi("Capitalisation renforcée", "entre missions", "méthodes, clauses, matrices, exemples"),
      roi("Restitution plus claire", "pour les clients", "KPI, constats, recommandations"),
    ],
    useCases: [
      useCase("Préparation de mission et checklists", "Les équipes repartent souvent de zéro malgré des schémas récurrents.", "Les livrables de cadrage se préparent plus vite avec des trames plus robustes.", "Temps de préparation ; délai de lancement"),
      useCase("Rédaction de rapports et synthèses", "Les rapports sont longs à assembler et à harmoniser.", "Les consultants gagnent du temps sur la mise en forme et la structure.", "Temps de production ; taux de relecture"),
      useCase("Capitalisation et base de connaissance", "Les savoir-faire restent dispersés entre dossiers, mails et mémoires individuelles.", "Les équipes retrouvent plus vite clauses, matrices et exemples utiles.", "Temps de recherche ; réutilisation documentaire"),
      useCase("Commentaires KPI et restitutions", "Les données sont disponibles mais difficiles à raconter clairement.", "Les synthèses deviennent plus pédagogiques pour les clients et directions.", "Temps de restitution ; satisfaction client"),
    ],
    standardization: [
      "Réduire les tâches répétitives qui ralentissent la mission.",
      "Mieux harmoniser les livrables entre consultants et bureaux.",
      "Créer une vraie mémoire réutilisable des pratiques et rapports.",
      "Renforcer la lisibilité managériale des conclusions et KPI.",
    ],
  }),
  spec({
    slug: "education-formation-professionnelle",
    commercialStem: "Education_Formation_Professionnelle",
    title: "Éducation & Formation Professionnelle",
    subtitle: "Produire plus vite des contenus pédagogiques solides et mieux piloter les parcours d’apprentissage.",
    tagline:
      "Pour les universités, grandes écoles, centres de formation et académies internes qui veulent transformer l’IA en meilleure conception, meilleure adaptation et meilleur suivi pédagogique.",
    accent: "teal",
    manualCourses: [
      "Conception Pédagogique Assistée par IA",
      "Création de Supports de Formation avec l'IA",
      "E-learning Adaptatif avec l'IA",
      "Tutorat Virtuel et Assistants IA",
      "LMS et Plateformes de Formation IA",
      "Accessibilité et Inclusion avec l'IA",
    ],
    crmSectors: ["Éducation / Recherche", "Éducation / Management", "Éducation / Numérique", "Formation professionnelle", "Développement / Formation"],
    contextNarrative:
      "La promesse n’est pas de produire plus de slides. Elle est de concevoir plus vite des parcours utiles, adaptés et mieux suivis pour des cohortes différentes.",
    priorities: [
      priority("Conception pédagogique lente", "Créer modules, quiz, cas et supports demande beaucoup de temps expert.", "Les plans de cours et séquences se préparent plus vite avec une meilleure base de travail."),
      priority("Parcours peu adaptés", "Les contenus s’adressent à tous de la même façon malgré des besoins différents.", "Les parcours gagnent en adaptation selon profils, niveaux et objectifs."),
      priority("Analyse de cohortes fastidieuse", "Les résultats existent mais restent longs à relire et à interpréter.", "Les responsables pédagogiques reçoivent des synthèses plus actionnables."),
      priority("Production multimédia morcelée", "Texte, quiz, fiches et vidéos avancent dans des cycles séparés et lents.", "Les équipes accélèrent la déclinaison multi-format des contenus."),
    ],
    roiMetrics: [
      roi("40 à 70 %", "sur la conception", "modules, exercices, supports, quiz"),
      roi("Parcours plus adaptés", "selon les profils", "niveaux, fonctions, cohortes"),
      roi("Reporting plus rapide", "des cohortes", "résultats, points faibles, ajustements"),
      roi("Production plus fluide", "des formats pédagogiques", "texte, quiz, fiches, médias"),
    ],
    useCases: [
      useCase("Conception de modules et cas pratiques", "Chaque nouveau parcours repart d’une page presque blanche.", "Les équipes gagnent une base mieux structurée pour construire plus vite.", "Temps de création ; délai de mise en cohorte"),
      useCase("Personnalisation des parcours", "Les contenus restent trop génériques pour des publics hétérogènes.", "Les variantes et exercices se déclinent plus finement selon les besoins.", "Taux de complétion ; taux de réussite"),
      useCase("Tutorat virtuel et assistant apprenant", "Les questions simples mobilisent beaucoup de temps formateur.", "Un assistant encadré répond au premier niveau et oriente vers les bons supports.", "Temps de réponse ; satisfaction apprenants"),
      useCase("Reporting pédagogique de cohorte", "La lecture des résultats reste lente et peu homogène.", "Les responsables relisent plus vite les points faibles et actions d’amélioration.", "Temps de reporting ; nombre d’actions correctives"),
    ],
    standardization: [
      "Accélérer la conception sans sacrifier la qualité pédagogique.",
      "Rendre les parcours plus adaptables à plusieurs publics.",
      "Mieux piloter les cohortes avec des synthèses plus rapides.",
      "Structurer la production de supports, quiz et assistants d’apprentissage.",
    ],
  }),
  spec({
    slug: "ressources-humaines-recrutement",
    commercialStem: "Ressources_Humaines_Recrutement",
    title: "Ressources Humaines & Recrutement",
    subtitle: "Structurer le recrutement, l’onboarding et les supports managériaux avec une IA gouvernée.",
    tagline:
      "Pour les cabinets RH, directions talent et acteurs de l’emploi qui veulent transformer l’IA en meilleurs cycles de recrutement, meilleure intégration et meilleure visibilité des signaux RH.",
    accent: "teal",
    manualCourses: [
      "IA et Recrutement : Sourcing & Sélection",
      "Onboarding Automatisé avec l'IA",
      "People Analytics : Données RH et IA",
      "Marque Employeur et IA",
      "Droit Social et IA : Conformité Automatisée",
      "Formation Personnalisée des Talents avec l'IA",
    ],
    crmSectors: ["RH / Recrutement", "RH / Emploi temporaire", "Formation professionnelle"],
    contextNarrative:
      "Le bon angle RH n’est pas de remplacer le jugement humain. Il consiste à réduire les délais, sécuriser les processus et mieux accompagner équipes et managers.",
    priorities: [
      priority("Recrutement chronophage", "Candidatures, synthèses et comptes rendus d’entretien consomment beaucoup de temps dispersé.", "Le tri et la préparation d’entretiens deviennent plus rapides et comparables."),
      priority("Onboarding inégal", "L’intégration dépend fortement du manager, du site ou de la disponibilité des référents.", "Des kits et parcours mieux structurés homogénéisent les premières semaines."),
      priority("Documents RH peu standardisés", "Fiches de poste, comptes rendus et communications internes sont produits sans méthode stable.", "Des modèles et workflows assistés améliorent la cohérence."),
      priority("Faible visibilité sur les signaux RH", "Les besoins de formation et irritants managériaux sont repérés tardivement.", "L’analyse assistée met plus tôt en lumière les signaux faibles et priorités RH."),
    ],
    roiMetrics: [
      roi("25 à 40 %", "sur le cycle de recrutement", "tri, synthèses, préparation d’entretien"),
      roi("Onboarding plus homogène", "sur plusieurs sites", "kits, réponses types, parcours"),
      roi("Moins de redites", "pour RH et managers", "demandes fréquentes, documents, guidance"),
      roi("Décisions mieux documentées", "sur talents et performance", "synthèses et indicateurs RH"),
    ],
    useCases: [
      useCase("Sourcing, tri et synthèse de candidatures", "Le traitement initial manque de vitesse et de comparabilité.", "Les premières analyses et questions d’entretien se préparent plus proprement.", "Temps de présélection ; délai avant premier entretien"),
      useCase("Onboarding structuré et assistant RH", "Les nouveaux entrants dépendent trop des réponses ad hoc.", "Un assistant encadré redonne les bonnes réponses, procédures et documents.", "Temps d’intégration ; satisfaction à 30 jours"),
      useCase("People analytics et signaux RH", "Les données utiles sont dispersées et difficiles à relire rapidement.", "Les synthèses assistées aident à piloter départs, besoins et irritants.", "Temps de reporting RH ; nombre de signaux détectés tôt"),
      useCase("Communication RH et marque employeur", "Les messages internes et externes manquent parfois de rythme et de cohérence.", "Les contenus RH gagnent en clarté, fréquence et qualité éditoriale.", "Temps de production ; taux d’engagement"),
    ],
    standardization: [
      "Industrialiser les premiers gestes RH sans déshumaniser les décisions.",
      "Rendre l’onboarding plus homogène entre équipes et managers.",
      "Donner aux RH des outils de synthèse plus utiles au pilotage.",
      "Créer une base de réponses, procédures et documents plus accessible.",
    ],
  }),
  spec({
    slug: "medias-communication",
    commercialStem: "Medias_Communication",
    title: "Médias & Communication",
    subtitle: "Accélérer la production éditoriale, la veille et l’analyse d’audience sans banaliser la ligne de marque.",
    tagline:
      "Pour les groupes médias, régies, chaînes et directions communication qui veulent transformer l’IA en meilleure cadence, meilleure cohérence et meilleure lecture des performances.",
    accent: "orange",
    manualCourses: [
      "Création de Contenu Marketing avec l'IA",
      "Copywriting IA : Rédiger des Textes qui Convertissent",
      "Social Media Management avec l'IA",
      "Analyse d'Audience et Segmentation IA",
      "Visualisation de Données avec IA",
      "Communication Professionnelle & IA",
    ],
    crmSectors: ["Médias audiovisuels", "Médias digitaux", "Médias / Télécoms", "Distribution / Presse"],
    contextNarrative:
      "L’IA doit ici servir la vitesse éditoriale, la cohérence de marque et la lecture des résultats, pas seulement la génération de texte en masse.",
    priorities: [
      priority("Production éditoriale coûteuse", "Créer, adapter et décliner les contenus demande beaucoup d’allers-retours.", "Les équipes disposent de cadres qui accélèrent la production sans perdre la ligne."),
      priority("Veille et revue d’audience lentes", "Les audiences et tendances sont connues mais restent longues à relire et à commenter.", "Les analyses deviennent plus rapides et plus actionnables pour les responsables."),
      priority("Cohérence multicanale fragile", "Chaque canal avance à son rythme et le message se dilue.", "Les assets et messages sont harmonisés plus facilement entre médias et supports."),
      priority("Reporting peu pédagogique", "Les performances existent mais restent difficiles à traduire en arbitrages clairs.", "Les managers gagnent des commentaires plus lisibles sur les écarts et leviers."),
    ],
    roiMetrics: [
      roi("40 à 70 %", "sur le temps de production", "briefs, variantes, déclinaisons"),
      roi("Meilleure cohérence", "entre canaux", "promesse, ton, priorités éditoriales"),
      roi("Lecture plus rapide", "des audiences et campagnes", "commentaires et arbitrages"),
      roi("Segmentation plus utile", "pour les équipes", "messages plus ciblés et mieux calibrés"),
    ],
    useCases: [
      useCase("Machine à contenus multiformats", "Les campagnes ralentissent dès qu’il faut décliner un message sur plusieurs supports.", "Un cadre outillé permet de produire plus vite des contenus cohérents.", "Temps de mise en campagne ; volume d’assets produits"),
      useCase("Veille audience et segmentation", "Les données d’audience existent mais servent peu à adapter les messages.", "L’IA aide à reformuler les segments et à relier audiences, arguments et formats.", "Taux d’engagement ; coût d’acquisition par segment"),
      useCase("Copywriting et déclinaisons éditoriales", "Les textes prennent du temps à écrire, tester et affiner.", "Les équipes gagnent des variantes plus rapides à tester sur plusieurs supports.", "Temps de rédaction ; taux de clic ou conversion"),
      useCase("Synthèse de performances", "L’analyse des résultats reste artisanale et peu pédagogique.", "Les performances sont résumées avec recommandations plus lisibles pour arbitrer.", "Temps de reporting ; délai de décision"),
    ],
    standardization: [
      "Créer un cadre éditorial IA qui protège la ligne de marque.",
      "Outiller les équipes pour produire et corriger plus vite les contenus.",
      "Relier segmentation, production et reporting dans une logique de performance.",
      "Faire de l’IA un levier de vitesse et de pilotage, pas un simple gadget.",
    ],
  }),
  spec({
    slug: "industrie-manufacturier",
    commercialStem: "Industrie_Manufacturier",
    title: "Industrie & Manufacturier",
    subtitle: "Mieux commenter la performance, les opérations et la qualité dans des environnements industriels exigeants.",
    tagline:
      "Pour les industriels, sites de production et fonctions support qui veulent transformer l’IA en meilleure lecture des flux, meilleure discipline documentaire et meilleure coordination opérationnelle.",
    accent: "navy",
    manualCourses: [
      "Optimisation des Processus Métier avec l'IA",
      "Support Prédictif et Maintenance Anticipée",
      "Business Intelligence et IA",
      "Gestion Documentaire Intelligente",
      "Gestion des Achats et Approvisionnement IA",
      "Leadership Data-Driven avec l'IA",
    ],
    crmSectors: ["Industrie alimentaire", "Industrie / Textile", "Industrie / Emballage", "Industrie / Aluminium", "Industrie / Câblage"],
    contextNarrative:
      "La valeur de l’IA se voit ici quand la performance, la qualité, la maintenance et la coordination support sont plus lisibles, plus commentées et mieux documentées.",
    priorities: [
      priority("KPI industriels peu racontés", "Les chiffres existent mais restent techniques et difficiles à transformer en décisions rapides.", "Les managers gagnent des commentaires plus utiles sur écarts et tendances."),
      priority("Qualité et incidents dispersés", "Les remontées terrain et points de vigilance sont suivis dans des circuits différents.", "Les signaux utiles ressortent plus tôt pour correction ciblée."),
      priority("Maintenance réactive", "Les historiques et alertes sont longs à relire avant décision.", "Les points d’attention sont mieux structurés pour accélérer la réaction humaine."),
      priority("Procédures et supports hétérogènes", "Les documents de poste et standards de travail sont difficiles à mettre à jour partout.", "Les pratiques documentaires gagnent en cohérence et en diffusion."),
    ],
    roiMetrics: [
      roi("Lecture plus rapide", "des performances", "écarts, production, qualité, incidents"),
      roi("Réactivité accrue", "sur maintenance et qualité", "alertes, historiques, priorités"),
      roi("Documents plus homogènes", "entre sites et équipes", "procédures, standards, supports"),
      roi("Support mieux aligné", "avec l’exploitation", "achats, qualité, management, opérations"),
    ],
    useCases: [
      useCase("Commentaires KPI production et qualité", "Les tableaux restent trop bruts pour une lecture managériale rapide.", "Les écarts et tendances sont mieux expliqués pour l’action.", "Temps de reporting ; délai d’arbitrage"),
      useCase("Synthèse incidents et non-conformités", "Les signaux terrain remontent mais restent longs à consolider.", "Les motifs et points critiques ressortent plus tôt.", "Temps de détection ; nombre d’actions correctives"),
      useCase("Maintenance et assistance documentaire", "Les historiques de maintenance et consignes sont difficiles à exploiter rapidement.", "Les équipes disposent d’une lecture plus claire avant intervention.", "Temps de revue ; délai de réaction"),
      useCase("Base procédures et standards", "Les documents utiles sont dispersés et peu transmissibles.", "Les standards deviennent plus faciles à retrouver et à mettre à jour.", "Temps de recherche ; conformité documentaire"),
    ],
    standardization: [
      "Rendre la performance industrielle plus lisible pour les managers.",
      "Mieux relier qualité, maintenance et exploitation.",
      "Réduire la dispersion documentaire entre sites ou équipes.",
      "Créer des commentaires KPI plus rapides et plus utiles.",
    ],
  }),
  spec({
    slug: "btp-infrastructures-immobilier",
    commercialStem: "BTP_Infrastructures_Immobilier",
    title: "BTP, Infrastructures & Immobilier",
    subtitle: "Fluidifier la coordination projet, la documentation et le suivi terrain sans perdre la maîtrise d’exécution.",
    tagline:
      "Pour les acteurs du BTP, des infrastructures et de l’immobilier qui veulent transformer l’IA en meilleure préparation, meilleure coordination et meilleure lecture des chantiers et dossiers.",
    accent: "gold",
    manualCourses: [
      "Gestion de Projets Augmentée par l'IA",
      "Optimisation des Processus Métier avec l'IA",
      "Gestion Documentaire Intelligente",
      "Planification et Suivi des Indicateurs avec l'IA",
      "Automatisation Administrative avec l'IA",
      "Support Prédictif et Maintenance Anticipée",
    ],
    crmSectors: ["BTP / Routes", "BTP / Concessions", "BTP / TP", "Immobilier / Construction", "Immobilier / Promotion"],
    contextNarrative:
      "Le secteur gagne lorsque la documentation, les suivis, les comptes rendus et la coordination de chantier deviennent plus lisibles et plus rapides à faire circuler.",
    priorities: [
      priority("Coordination chantier complexe", "Les informations utiles sont dispersées entre site, bureau d’études, direction projet et support.", "Les briefs et synthèses améliorent la circulation des décisions et points de vigilance."),
      priority("Documentation lourde", "Rapports, comptes rendus, visas, supports et dossiers consomment beaucoup de temps.", "Les documents se préparent plus vite avec des formats plus homogènes."),
      priority("Pilotage délais / coûts peu commenté", "Les indicateurs existent mais restent difficiles à raconter aux décideurs.", "Les tableaux gagnent en commentaires et en capacité d’alerte."),
      priority("Transfert de connaissances fragile", "Les bonnes pratiques restent dans quelques équipes ou chefs de projet.", "Les méthodes et standards deviennent plus partageables et plus durables."),
    ],
    roiMetrics: [
      roi("Temps de coordination réduit", "sur les dossiers et chantiers", "briefs, comptes rendus, arbitrages"),
      roi("Documents plus homogènes", "sur plusieurs projets", "rapports, supports, suivis"),
      roi("Pilotage plus lisible", "pour les directions", "délais, coûts, incidents, priorités"),
      roi("Capitalisation renforcée", "entre projets", "méthodes, modèles, retours d’expérience"),
    ],
    useCases: [
      useCase("Synthèse de chantier et coordination projet", "Les responsables reçoivent beaucoup d’informations peu hiérarchisées.", "Les points critiques et arbitrages sont résumés plus clairement.", "Temps de lecture ; réactivité de coordination"),
      useCase("Rédaction de comptes rendus et dossiers", "Les équipes repartent souvent de zéro sur des documents comparables.", "Les trames assistées accélèrent la production des livrables.", "Temps de rédaction ; taux de validation premier jet"),
      useCase("Commentaire des KPI délais / coûts", "Les tableaux de suivi restent bruts pour les décideurs.", "Les écarts et tendances sont mieux expliqués pour arbitrage rapide.", "Temps de reporting ; délai de décision"),
      useCase("Base de standards et retours d’expérience", "Les bonnes pratiques sont peu capitalisées entre chantiers.", "Les équipes retrouvent plus vite modèles, procédures et leçons utiles.", "Temps de recherche ; réutilisation documentaire"),
    ],
    standardization: [
      "Fluidifier la circulation de l’information projet et chantier.",
      "Réduire la charge documentaire sur des livrables récurrents.",
      "Rendre les KPI plus lisibles pour les décideurs non techniques.",
      "Mieux capitaliser les standards et retours d’expérience.",
    ],
  }),
  spec({
    slug: "distribution-retail-fmcg",
    commercialStem: "Distribution_Retail_FMCG",
    title: "Distribution, Retail & FMCG",
    subtitle: "Améliorer la relation client, le pilotage réseau et la coordination commerciale dans des environnements à fort volume.",
    tagline:
      "Pour les groupes de distribution, enseignes retail et FMCG qui veulent transformer l’IA en meilleure réactivité, meilleure cohérence commerciale et meilleure lecture des performances.",
    accent: "orange",
    manualCourses: [
      "Relation Client Augmentée par l'IA",
      "Création de Contenu Marketing avec l'IA",
      "Analyse d'Audience et Segmentation IA",
      "Planification et Suivi des Indicateurs avec l'IA",
      "Gestion des Achats et Approvisionnement IA",
      "Mesurer la Satisfaction Client avec l'IA",
    ],
    crmSectors: ["Grande distribution", "Distribution automobile", "Distribution / Équipements", "Agroalimentaire / Distribution", "Distribution pharmaceutique"],
    contextNarrative:
      "Le ROI se voit ici sur la qualité de réponse, la coordination réseau, la lecture des ventes et l’exploitation plus utile des retours clients.",
    priorities: [
      priority("Relation client hétérogène", "Les réponses et prises en charge varient selon les points de contact.", "Les scripts et bases de réponse rendent le service plus homogène."),
      priority("Pilotage commercial trop brut", "Les managers voient les chiffres mais peinent à les traduire vite en actions.", "Les KPI gagnent en commentaires et en priorisation."),
      priority("Segmentation peu activée", "Les audiences et catégories client sont connues mais peu transformées en actions ciblées.", "Les équipes relient mieux données clients, messages et offres."),
      priority("Coordination approvisionnement / réseau lente", "Les relances et priorités terrain remontent difficilement entre magasin, siège et support.", "Les synthèses facilitent la gestion des urgences et arbitrages."),
    ],
    roiMetrics: [
      roi("Réponse plus cohérente", "sur les interactions client", "scripts, FAQ, guidance, réclamations"),
      roi("Pilotage plus rapide", "des ventes et performances", "commentaires KPI et alertes"),
      roi("Segmentation plus utile", "pour les équipes", "ciblage, contenus, parcours"),
      roi("Meilleure coordination", "entre réseau et siège", "priorités, relances, incidents"),
    ],
    useCases: [
      useCase("Assistant de réponse client ou magasin", "Les équipes réécrivent souvent les mêmes réponses dans l’urgence.", "Un copilote encadré homogénéise les réponses et accélère la prise en charge.", "Temps moyen de réponse ; taux de résolution"),
      useCase("Commentaire des ventes et KPI réseau", "Les dashboards sont visibles mais peu actionnables pour les responsables.", "Les écarts et tendances sont commentés pour soutenir la décision rapide.", "Temps de reporting ; délai d’arbitrage"),
      useCase("Segmentation et contenus commerciaux", "Les campagnes restent trop génériques malgré des clientèles différentes.", "Les segments sont traduits plus vite en messages et offres utiles.", "Taux d’engagement ; conversion"),
      useCase("Approvisionnement et coordination terrain", "Les urgences terrain sont difficiles à relayer proprement au siège.", "Les équipes gagnent des synthèses de priorités et de relances plus nettes.", "Temps de traitement ; délai de réaction"),
    ],
    standardization: [
      "Harmoniser la qualité de réponse sur plusieurs points de contact.",
      "Rendre les KPI commerciaux plus utiles à l’action rapide.",
      "Mieux relier segmentation, contenus et exploitation réseau.",
      "Fluidifier la coordination entre terrain, siège et fonctions support.",
    ],
  }),
  spec({
    slug: "agriculture-developpement-rural",
    commercialStem: "Agriculture_Developpement_Rural",
    title: "Agriculture & Développement Rural",
    subtitle: "Mieux organiser la veille filière, la coordination terrain et la production documentaire autour des programmes ruraux.",
    tagline:
      "Pour les institutions agricoles, filières et structures de développement rural qui veulent transformer l’IA en meilleure coordination, meilleure synthèse et meilleur pilotage des actions terrain.",
    accent: "teal",
    manualCourses: [
      "Gestion Documentaire Intelligente",
      "Planification et Suivi des Indicateurs avec l'IA",
      "Optimisation des Processus Métier avec l'IA",
      "Conception Pédagogique Assistée par IA",
      "Visualisation de Données avec IA",
      "Communication Professionnelle & IA",
    ],
    crmSectors: ["Agriculture / Filière", "Agriculture / Coton", "Agriculture / Cacao", "Recherche / Agriculture", "Agriculture / Rural"],
    contextNarrative:
      "Le retour sur investissement se trouve dans la qualité des suivis terrain, la rapidité des synthèses filière et la capacité à mieux préparer les actions de coordination, de sensibilisation et de pilotage.",
    priorities: [
      priority("Remontées terrain dispersées", "Les informations programmes, filières et partenaires remontent de façon hétérogène.", "Les équipes gagnent des synthèses plus claires pour piloter plus tôt."),
      priority("Documentation de programme lourde", "Rapports, supports, notes et comptes rendus prennent beaucoup de temps.", "Les documents se préparent plus vite avec des formats plus homogènes."),
      priority("Veille filière difficile", "Les signaux marché, terrain et partenaires sont longs à relire globalement.", "Les responsables disposent d’une vue mieux structurée des enjeux prioritaires."),
      priority("Actions de sensibilisation morcelées", "Les contenus et messages terrain sont produits lentement et peu réutilisés.", "Les équipes déclinent plus vite des supports adaptés aux publics ciblés."),
    ],
    roiMetrics: [
      roi("Lecture plus rapide", "des programmes et filières", "synthèses, incidents, points d’attention"),
      roi("Temps documentaire réduit", "sur les rapports et notes", "comptes rendus, supports, fiches"),
      roi("Veille plus exploitable", "pour les responsables", "marché, terrain, partenaires"),
      roi("Sensibilisation plus fluide", "auprès des publics", "supports et messages réutilisables"),
    ],
    useCases: [
      useCase("Synthèse de programmes et suivis terrain", "Les responsables reçoivent des informations peu harmonisées.", "Les synthèses ressortent plus vite pour cadrer les priorités.", "Temps de lecture ; délai de coordination"),
      useCase("Production de rapports et notes filière", "Les documents prennent du temps à assembler et à reformuler.", "Les équipes accélèrent la production avec une meilleure homogénéité.", "Temps de rédaction ; taux de validation"),
      useCase("Veille filière et marché", "Les signaux utiles sont difficiles à consolider entre sources.", "La veille gagne en clarté et en rythme de diffusion.", "Fréquence de veille ; délai de diffusion"),
      useCase("Supports de sensibilisation et formation terrain", "Les messages et supports sont longs à produire pour plusieurs publics.", "Les contenus se déclinent plus vite selon les besoins terrain.", "Temps de production ; nombre de supports réutilisables"),
    ],
    standardization: [
      "Mieux harmoniser les remontées et synthèses de terrain.",
      "Réduire la charge de production documentaire sur les programmes.",
      "Rendre la veille filière plus utile au pilotage.",
      "Créer des supports de sensibilisation plus faciles à adapter et diffuser.",
    ],
  }),
];

export async function getMarketSectorDeckSpecs() {
  const coursePools = await readCoursePools();
  const masterCourses = coursePools.get("master").courses;

  return rawSpecs.map((entry) => {
    const trainingFocus = entry.manualCourses?.length ? entry.manualCourses : masterCourses.slice(0, 6);
    const courseCount = trainingFocus.length;

    return {
      ...entry,
      trainingFocus,
      courseCount,
      coverMetrics: buildCoverMetrics(courseCount),
      offerBlocks: buildOfferBlocks(entry.title),
      cta: "Planifier un audit IA gratuit suivi d’un échange expert de 45 minutes",
      fileName: `TransferAI_Deck_${entry.commercialStem}.pptx`,
      pdfName: `TransferAI_Deck_${entry.commercialStem}.pdf`,
    };
  });
}
