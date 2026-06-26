import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { getSectorDeckSpecs } from "./presentations/transferai-sector-decks/domain-specs.mjs";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const PYTHON_BIN = "/Users/marius_ayoro/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const EXPORT_SCRIPT = path.join(ROOT, "scripts", "export_markdown_to_docx.py");
const OUTPUT_DIR = path.join(ROOT, "docs", "transferai-prospection", "catalogues-sectoriels-premium-2026-06-12");
const WORD_DIR = path.join(OUTPUT_DIR, "word");
const SECTOR_DIR = path.join(OUTPUT_DIR, "secteurs");

function slugify(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function run(command, args, label) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error([label, result.stdout, result.stderr].filter(Boolean).join("\n"));
  }
  return result.stdout;
}

function dedupe(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function titleCaseSector(value) {
  return String(value ?? "").replace(/\b&\b/g, "&");
}

function cleanNarrative(value) {
  return String(value ?? "")
    .replace(/^Ce deck s’adresse aux structures où/i, "Ce contexte concerne les structures où")
    .replace(/^Ce deck s’adresse aux/i, "Ce contexte concerne les")
    .replace(/^Ce deck s’adresse/i, "Ce contexte concerne");
}

function sectorLabelForSentence(spec) {
  const labels = {
    "assistanat-et-secretariat": "l’assistanat et le secrétariat",
    "ressources-humaines": "les ressources humaines",
    "marketing-et-communication": "le marketing et la communication",
    "finance-et-comptabilite": "la finance et la comptabilité",
    "juridique-et-conformite": "le juridique et la conformité",
    "service-client": "le service client",
    "data-analyse": "la data et l’analyse",
    "administration-et-gestion": "l’administration et la gestion",
    "management-et-leadership": "le management et le leadership",
    "it-et-transformation-digitale": "l’IT et la transformation digitale",
    "formation-et-pedagogie": "la formation et la pédagogie",
    "sante-et-bien-etre": "la santé et le bien-être",
    "diplomatie-et-affaires-internationales": "la diplomatie et les affaires internationales",
    "transport-et-logistique": "le transport et la logistique",
    "energie-et-petrole": "l’énergie et le pétrole",
    telecommunications: "les télécommunications",
  };

  return labels[spec.slug] ?? spec.title.toLowerCase();
}

function polishFrenchText(value) {
  const replacements = [
    [/\b[Pp]resentiel\b/g, (match) => (match[0] === "P" ? "Présentiel" : "présentiel")],
    [/\b[Cc]omptabilite\b/g, (match) => (match[0] === "C" ? "Comptabilité" : "comptabilité")],
    [/\b[Cc]ontrole\b/g, (match) => (match[0] === "C" ? "Contrôle" : "contrôle")],
    [/\b[Tt]resorerie\b/g, (match) => (match[0] === "T" ? "Trésorerie" : "trésorerie")],
    [/\b[Qq]ualite\b/g, (match) => (match[0] === "Q" ? "Qualité" : "qualité")],
    [/\b[Rr]eclamations\b/g, (match) => (match[0] === "R" ? "Réclamations" : "réclamations")],
    [/\b[Ii]ntegration\b/g, (match) => (match[0] === "I" ? "Intégration" : "intégration")],
    [/\b[Cc]ompetences\b/g, (match) => (match[0] === "C" ? "Compétences" : "compétences")],
    [/\b[Dd]uree\b/g, (match) => (match[0] === "D" ? "Durée" : "durée")],
    [/\b[Rr]esultats\b/g, (match) => (match[0] === "R" ? "Résultats" : "résultats")],
    [/\b[Pp]edagogiques\b/g, (match) => (match[0] === "P" ? "Pédagogiques" : "pédagogiques")],
  ];

  let output = String(value ?? "").replace(/'/g, "’");

  for (const [pattern, replacement] of replacements) {
    output = output.replace(pattern, replacement);
  }

  return output
    .replace(/\s+:/g, " :")
    .replace(/\s+;/g, " ;")
    .replace(/\s+\?/g, " ?")
    .replace(/\s+!/g, " !");
}

function buildTelecomSpec() {
  return {
    slug: "telecommunications",
    title: "Télécommunications",
    subtitle: "Mieux coordonner la relation client, les opérations réseau et la performance commerciale dans un environnement multi-canaux.",
    tagline:
      "Pour les opérateurs télécoms, fournisseurs d’accès, structures data, mobile money et directions B2B/B2C qui veulent rendre l’IA utile aux équipes client, réseau, marketing et pilotage.",
    crmSectors: [
      "Opérateur mobile intégré",
      "Internet / Fibre",
      "Service client multi-canaux",
      "Distribution télécom",
      "Mobile money / services digitaux",
    ],
    contextNarrative:
      "Dans les télécommunications, la valeur de l’IA se lit rapidement dans la stabilité du service, la vitesse de réponse client, la lisibilité des incidents, la qualité commerciale et la coordination entre les équipes réseau, relation client et management.",
    priorities: [
      {
        title: "Incidents réseau mal relayés",
        before: "Les informations techniques circulent, mais les impacts client et les arbitrages opérationnels sont parfois relayés trop tard.",
        after: "Les incidents sont synthétisés plus tôt, mieux qualifiés et plus facilement traduits en messages utiles pour les équipes concernées.",
      },
      {
        title: "Relation client sous pression",
        before: "Les demandes récurrentes, réclamations et retours d’expérience saturent les équipes de front et compliquent l’homogénéité du service.",
        after: "Les réponses, scripts, synthèses et parcours de traitement deviennent plus cohérents, plus rapides et plus pilotables.",
      },
      {
        title: "Lecture commerciale dispersée",
        before: "Les signaux sur churn, upsell, satisfaction ou qualité de service existent mais restent difficiles à prioriser rapidement.",
        after: "Les managers accèdent à une lecture plus claire des signaux prioritaires et des actions à déclencher.",
      },
      {
        title: "Coordination interéquipes perfectible",
        before: "Réseau, service client, marketing et direction ne partagent pas toujours la même lecture du terrain au même moment.",
        after: "Les équipes gagnent une base commune de synthèse, de langage et de pilotage orientée résultats.",
      },
    ],
    roiMetrics: [
      { value: "Réponses plus rapides", label: "sur les canaux clients", note: "scripts, synthèses et qualification initiale" },
      { value: "Incidents mieux pilotés", label: "côté réseau et exploitation", note: "lecture commune des impacts et priorités" },
      { value: "Churn mieux anticipé", label: "dans les signaux faibles", note: "verbatims, usages, motifs d’insatisfaction" },
      { value: "Managers mieux alignés", label: "sur les arbitrages", note: "KPI, alertes et messages homogènes" },
    ],
    useCases: [
      {
        title: "Centre de contact augmenté par l’IA",
        before: "Les agents gèrent un volume élevé de demandes répétitives avec des réponses parfois inégales selon les canaux ou les équipes.",
        after: "Les scripts, réponses assistées, résumés et routages deviennent plus homogènes et plus rapides.",
        kpi: "Temps moyen de réponse ; taux de résolution au premier contact",
      },
      {
        title: "Synthèse d’incidents réseau et communication interne",
        before: "Les incidents sont connus des équipes techniques mais leur traduction opérationnelle et managériale manque parfois de clarté.",
        after: "Une synthèse plus lisible aide à coordonner exploitation, service client, direction et communication de crise.",
        kpi: "Temps de diffusion d’une synthèse fiable ; délai de coordination",
      },
      {
        title: "Lecture des verbatims clients et signaux de churn",
        before: "Les retours clients sont nombreux mais insuffisamment consolidés pour aider les managers à agir vite.",
        after: "L’IA aide à regrouper les motifs, signaux faibles et tendances d’insatisfaction de façon plus exploitable.",
        kpi: "Délai d’analyse ; nombre de signaux priorisés",
      },
      {
        title: "Pilotage commercial et qualité de service",
        before: "Les KPI commerciaux, satisfaction et qualité de service restent parfois cloisonnés entre plusieurs équipes.",
        after: "Les managers disposent de commentaires plus utiles et d’une lecture plus actionnable des arbitrages.",
        kpi: "Temps de préparation d’un comité ; vitesse de décision",
      },
    ],
    trainingFocus: [
      "Service Client Augmenté par l'IA",
      "Analyse de Sentiment et Feedback Client",
      "Relation Client Augmentée par l'IA",
      "Pilotage Réseau et Qualité de Service avec l'IA",
      "Marketing Télécom et Personnalisation IA",
      "Leadership Data-Driven avec l'IA",
    ],
    courseCount: 6,
    companyExamples: ["Orange Côte d’Ivoire", "opérateurs télécoms intégrés", "acteurs mobile money et data"],
  };
}

function withCompanyExamples(spec) {
  const examplesBySlug = {
    "energie-et-petrole": ["ELTON Oil CI", "distributeurs énergie et hydrocarbures", "sociétés de services techniques et logistiques"],
    "service-client": ["structures à forte volumétrie de demandes", "réseaux multi-sites", "environnements de support et de relation client"],
    "transport-et-logistique": ["opérateurs de mobilité", "acteurs portuaires", "entreprises de fret et d’express"],
  };
  return {
    ...spec,
    companyExamples: examplesBySlug[spec.slug] ?? spec.crmSectors,
  };
}

function buildPublics(spec) {
  const mapping = {
    "assistanat-et-secretariat": "Directions générales, assistantes de direction, secrétariats exécutifs, coordinations administratives",
    "ressources-humaines": "Directions RH, talent acquisition, formation, HRBP, managers de proximité",
    "marketing-et-communication": "Directions marketing, communication, brand, digital, contenu et acquisition",
    "finance-et-comptabilite": "Directions financières, contrôle de gestion, comptabilité, audit interne, trésorerie",
    "juridique-et-conformite": "Directions juridiques, conformité, secrétariat général, audit, risques",
    "service-client": "Directions relation client, centres de contact, support, qualité de service, supervision",
    "data-analyse": "Directions data, BI, performance, contrôle, équipes d’analystes et managers utilisateurs",
    "administration-et-gestion": "Directions administratives, opérations support, back office, coordination multi-sites",
    "management-et-leadership": "Comités de direction, top management, managers de BU, responsables de transformation",
    "it-et-transformation-digitale": "DSI, transformation digitale, PMO, équipes produit, support et gouvernance",
    "formation-et-pedagogie": "Directions pédagogiques, responsables académiques, formateurs, ingénierie de formation",
    "sante-et-bien-etre": "Directions d’établissements, coordination soignante, accueil, patient experience, support",
    "diplomatie-et-affaires-internationales":
      "Affaires publiques, coopération internationale, organisations régionales, cellules diplomatiques, direction pays",
    "transport-et-logistique": "Exploitation, supply chain, flotte, hubs, service client, direction opérations",
    "energie-et-petrole": "Opérations, maintenance, HSE, finance, direction de site, coordination réseau et distribution",
    telecommunications:
      "Direction générale, service client, opérations réseau, marketing, vente B2B/B2C, qualité de service, mobile money",
  };
  return mapping[spec.slug] ?? `Directions, managers et équipes clés du domaine ${spec.title}`;
}

function buildContextToConfirm(spec) {
  const sectorLabel = sectorLabelForSentence(spec);
  const bullets = [
    `Les enjeux confirmés au cadrage doivent être reliés à des priorités visibles pour ${sectorLabel}.`,
    `Le périmètre à confirmer peut concerner un site pilote, une direction donnée, une équipe support ou un processus transverse.`,
    `Les cas d’usage retenus doivent être validés selon les données disponibles, les règles de confidentialité et la capacité de supervision humaine.`,
  ];
  if (spec.companyExamples?.length) {
    bullets.unshift(`Exemples de contextes proches : ${spec.companyExamples.join(" ; ")}.`);
  }
  return bullets;
}

function buildResults(spec) {
  const sectorLabel = sectorLabelForSentence(spec);
  return dedupe([
    ...spec.roiMetrics.map((item) => `${item.value} ${item.label}${item.note ? ` (${item.note})` : ""}.`),
    `Une feuille de route claire sur les deux premiers cas d’usage à lancer dans ${sectorLabel}.`,
    "Une meilleure capacité à relier formation, gouvernance, pilote et retour sur investissement visible.",
  ]);
}

function buildObjectives(spec) {
  const sectorLabel = sectorLabelForSentence(spec);
  return dedupe([
    `Identifier les priorités métier les plus crédibles à traiter par l’IA dans ${sectorLabel}.`,
    ...spec.useCases.slice(0, 3).map((item) => `Savoir structurer et piloter le cas d’usage « ${item.title} ».`),
    "Distinguer les usages immédiatement activables, les usages à encadrer et les usages à piloter dans le temps.",
    "Définir des KPI simples, un cadre de confiance et un premier plan d’action à 90 jours.",
  ]).map((item) => item.replace(/\s+\.$/, "."));
}

function buildProgrammeDay1(spec) {
  const anchors = spec.trainingFocus.slice(0, 3);
  return [
    `Lecture des enjeux sectoriels : ${cleanNarrative(spec.contextNarrative)}`,
    `Cartographie des priorités métier confirmées : ${spec.priorities.slice(0, 3).map((item) => item.title).join(" ; ")}.`,
    `Études de cas guidées autour de « ${spec.useCases[0].title} » et « ${spec.useCases[1].title} ».`,
    `Méthodes, outils et gestes professionnels à partir des ancrages pédagogiques suivants : ${anchors.join(" ; ")}.`,
    "Cadre de confiance : confidentialité, supervision humaine, validation managériale et critères d’extension.",
  ];
}

function buildProgrammeDay2(spec) {
  const anchors = spec.trainingFocus.slice(3, 6);
  return [
    `Ateliers de conception sur « ${spec.useCases[2].title} » et « ${spec.useCases[3].title} ».`,
    "Construction de prompts, trames, routines et scénarios d’usage adaptés au terrain.",
    `Approfondissements recommandés : ${anchors.join(" ; ")}.`,
    "Définition du premier pilote, des livrables attendus et des KPI de suivi.",
    "Plan d’action à 90 jours : séquencement, populations à former, gouvernance et arbitrages de déploiement.",
  ];
}

function buildDeliverables(spec) {
  const sectorLabel = sectorLabelForSentence(spec);
  return [
    `Une note de cadrage sectorielle pour ${sectorLabel} avec priorités confirmées, risques et premières décisions.`,
    `Une matrice des cas d’usage prioritaires incluant ${spec.useCases.slice(0, 4).map((item) => `« ${item.title} »`).join(" ; ")}.`,
    "Un canevas de pilote à 90 jours avec KPI, rôles, supervision et critères de succès.",
    `Une recommandation de parcours de montée en compétences à partir de : ${spec.trainingFocus.slice(0, 4).join(" ; ")}.`,
  ];
}

function buildReferenceDomain(spec) {
  return `${titleCaseSector(spec.title)} | Contextes proches : ${spec.crmSectors.join(" ; ")}`;
}

function buildSectorMarkdown(spec, index, total, options = {}) {
  const headingLevel = options.headingLevel ?? 1;
  const headingPrefix = "#".repeat(headingLevel);
  const heading = `${headingPrefix} TransferAI - Mini catalogue premium ${spec.title}`;
  const intro = `Catalogue ciblé par secteur | Formule prioritaire sur mesure | Édition du 2026-06-12`;
  const note = `Ce document est conçu pour des prospects de même univers métier. Il peut être adapté à une organisation précise après audit IA gratuit et échange expert de qualification.`;
  const results = buildResults(spec);
  const objectives = buildObjectives(spec);
  const day1 = buildProgrammeDay1(spec);
  const day2 = buildProgrammeDay2(spec);
  const deliverables = buildDeliverables(spec);
  const context = buildContextToConfirm(spec);

  return polishFrenchText([
    heading,
    intro,
    note,
    "",
    `## Fiche sectorielle ${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
    "",
    `### Domaine de référence`,
    `- ${buildReferenceDomain(spec)}`,
    "",
    `### Enjeux sectoriels`,
    `- ${cleanNarrative(spec.contextNarrative)}`,
    ...spec.priorities.map((item) => `- ${item.title} : ${item.before} ${item.after}`),
    "",
    `### Contexte secteur à confirmer`,
    ...context.map((item) => `- ${item}`),
    "",
    `### Cas d’usage TransferAI mis en avant`,
    ...spec.useCases.map((item) => `- **${item.title}** : ${item.after} KPI de référence : ${item.kpi}.`),
    "",
    `## Formule prioritaire recommandée`,
    "",
    `### Intitulé`,
    `- Bootcamp IA sectoriel ${spec.title} : de l’acculturation utile au premier pilote mesurable`,
    "",
    `### Public cible`,
    `- ${buildPublics(spec)}`,
    "",
    `### Formats possibles`,
    `- Présentiel`,
    `- Hybride`,
    `- En ligne (style webinaire)`,
    "",
    `### Niveaux`,
    `- Débutant`,
    `- Intermédiaire`,
    `- Avancé`,
    "",
    `### Durée`,
    `- 1 jour : version décideurs et managers`,
    `- 2 jours : version équipes, managers et mise en pratique`,
    "",
    `### Tarif`,
    `- Prix sur demande`,
    "",
    `### Résultats attendus`,
    ...results.map((item) => `- ${item}`),
    "",
    `### Objectifs pédagogiques`,
    ...objectives.map((item) => `- ${item}`),
    "",
    `### Programme`,
    "",
    `#### Jour 1`,
    ...day1.map((item) => `- ${item}`),
    "",
    `#### Jour 2`,
    `- Cette journée s’active lorsque la formule 2 jours est retenue.`,
    ...day2.map((item) => `- ${item}`),
    "",
    `### Livrables / attendus`,
    ...deliverables.map((item) => `- ${item}`),
    "",
    `### Ancrages pédagogiques recommandés`,
    ...spec.trainingFocus.map((item) => `- ${item}`),
    "",
    `### Mention de personnalisation`,
    `- Le contenu final est ajusté après qualification du contexte, des outils déjà utilisés, des données disponibles et des arbitrages de confidentialité propres au prospect.`,
    "",
  ].join("\n"));
}

function buildMasterMarkdown(specs) {
  const lines = [
    "# TransferAI - Catalogue premium des formules sectorielles prioritaires",
    "Mini catalogue ciblé par secteur pour les entreprises, institutions et organisations | Édition du 2026-06-12",
    "Ce catalogue regroupe des formules ciblées par secteur à partir des cas d’usage prioritaires identifiés dans les decks sectoriels TransferAI.",
    "",
    "## Positionnement",
    "- Ce catalogue n’est pas générique : chaque fiche sectorielle est construite autour d’enjeux métier, de cas d’usage et de livrables cohérents avec le secteur visé.",
    "- Les programmes peuvent être activés en format présentiel, hybride ou en ligne (style webinaire).",
    "- Trois niveaux peuvent être proposés selon le besoin : Débutant, Intermédiaire, Avancé.",
    "- Les tarifs sont communiqués sur demande après qualification du contexte et du périmètre.",
    "",
    "## Secteurs couverts",
    ...specs.map((spec) => `- ${spec.title}`),
    "",
  ];

  specs.forEach((spec, index) => {
    lines.push(buildSectorMarkdown(spec, index, specs.length, { headingLevel: 2 }));
  });

  return polishFrenchText(lines.join("\n"));
}

async function exportDocx(markdownPath, docxPath) {
  run(PYTHON_BIN, [EXPORT_SCRIPT, markdownPath, docxPath], `DOCX export failed for ${path.basename(markdownPath)}`);
}

async function main() {
  const sectorSpecs = (await getSectorDeckSpecs()).map(withCompanyExamples);
  const telecomSpec = buildTelecomSpec();
  const specs = [...sectorSpecs, telecomSpec];

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(WORD_DIR, { recursive: true });
  await fs.mkdir(SECTOR_DIR, { recursive: true });

  const indexLines = [
    "# Index - Catalogues sectoriels premium TransferAI",
    "",
    "Exports générés le 2026-06-12.",
    "",
    "## Livrables",
    "- 1 catalogue master premium multi-secteurs",
    "- 1 mini catalogue Word par secteur",
    "- 1 index prêt pour usage commercial ou pièce jointe",
    "",
    "## Fichiers secteur",
    "",
  ];

  for (const [index, spec] of specs.entries()) {
    const slug = slugify(spec.title);
    const sectorFolder = path.join(SECTOR_DIR, slug);
    await fs.mkdir(sectorFolder, { recursive: true });

    const markdownName = `TransferAI_Mini_Catalogue_Premium_${slug}_2026-06-12.md`;
    const docxName = `TransferAI_Mini_Catalogue_Premium_${slug}_2026-06-12.docx`;
    const markdownPath = path.join(sectorFolder, markdownName);
    const docxPath = path.join(sectorFolder, docxName);

    await fs.writeFile(markdownPath, buildSectorMarkdown(spec, index, specs.length), "utf8");
    await exportDocx(markdownPath, docxPath);

    indexLines.push(`### ${spec.title}`);
    indexLines.push(`- Markdown : \`secteurs/${slug}/${markdownName}\``);
    indexLines.push(`- Word : \`secteurs/${slug}/${docxName}\``);
    indexLines.push(`- Contextes proches : ${spec.crmSectors.join(" ; ")}`);
    indexLines.push("");
  }

  const masterMarkdownName = "TransferAI_Catalogue_Premium_Formules_Sectorielles_2026-06-12.md";
  const masterDocxName = "TransferAI_Catalogue_Premium_Formules_Sectorielles_2026-06-12.docx";
  const masterMarkdownPath = path.join(OUTPUT_DIR, masterMarkdownName);
  const masterDocxPath = path.join(WORD_DIR, masterDocxName);

  await fs.writeFile(masterMarkdownPath, buildMasterMarkdown(specs), "utf8");
  await exportDocx(masterMarkdownPath, masterDocxPath);

  await fs.writeFile(path.join(OUTPUT_DIR, "00_INDEX.md"), indexLines.join("\n"), "utf8");

  console.log(
    JSON.stringify(
      {
        outputDir: OUTPUT_DIR,
        masterMarkdown: masterMarkdownPath,
        masterDocx: masterDocxPath,
        sectorCount: specs.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
