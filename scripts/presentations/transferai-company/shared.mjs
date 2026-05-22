const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";

export const assets = {
  hero: `${ROOT}/src/assets/hero-bg.jpg`,
  logo: `${ROOT}/src/assets/logo-transferai-nettelecom.png`,
  partners: [
    `${ROOT}/src/assets/logo-middlesex.png`,
    `${ROOT}/src/assets/logo-nettelecom.png`,
    `${ROOT}/src/assets/logo-fdfp.png`,
    `${ROOT}/src/assets/logo-iads.png`,
    `${ROOT}/src/assets/logo-sndi.png`,
    `${ROOT}/src/assets/logo-pigier.png`,
  ],
};

export const palette = {
  bg: "#F7F3EE",
  paper: "#FFFDFC",
  ink: "#10213D",
  inkSoft: "#516072",
  accent: "#D66724",
  accentSoft: "#F4D8C6",
  dark: "#16324F",
  green: "#2FB67E",
  stone: "#D9D3CC",
  mist: "#E9EEF3",
  sand: "#F6EEE6",
  white: "#FFFFFF",
};

export const deck = {
  title: "TransferAI Africa",
  subtitle: "Présentation de la structure et de l'offre",
  tagline:
    "Accompagner les entreprises, les institutions et les talents avec une intelligence artificielle utile, concrète et bien encadrée.",
  summary: [
    "TransferAI Africa aide les organisations à identifier les usages de l'IA qui apportent un bénéfice concret avant d'investir.",
    "Notre approche combine conseil, montée en compétences et mise en œuvre progressive de solutions utiles.",
    "Le point d'entrée le plus simple est l'audit IA gratuit, suivi d'un échange expert de 30 à 45 minutes.",
  ],
  credibility: [
    { value: "130+", label: "formations au catalogue" },
    { value: "13", label: "domaines couverts" },
    { value: "15", label: "experts visibles" },
    { value: "6", label: "partenaires affichés" },
  ],
  needs: [
    {
      title: "Clarifier avant d'acheter",
      desc: "Beaucoup d'entreprises veulent avancer sur l'IA, mais n'ont pas encore identifié les usages les plus utiles.",
      icon: "search",
    },
    {
      title: "Former sans perdre les équipes",
      desc: "Les dirigeants veulent associer les équipes à des usages simples à comprendre et faciles à adopter.",
      icon: "graduation-cap",
    },
    {
      title: "Déployer sans dispersion",
      desc: "Les besoins portent sur des gains concrets, des assistants utiles et des processus mieux organisés, pas sur des effets de mode.",
      icon: "bot",
    },
  ],
  structure: [
    {
      title: "Ancrage local, ambition Afrique",
      desc: "Structure portée depuis Abidjan, pensée pour la Côte d'Ivoire et les réalités des organisations africaines.",
    },
    {
      title: "Équipe fondatrice + consultants experts",
      desc: "Une équipe qui réunit vision stratégique, pédagogie, audit, conformité, organisation et mise en œuvre opérationnelle.",
    },
    {
      title: "Adossée à des partenaires crédibles",
      desc: "Des partenaires académiques, institutionnels et opérationnels renforcent la crédibilité de l'écosystème TransferAI.",
    },
    {
      title: "Du conseil au passage à l'action",
      desc: "La valeur ne réside pas seulement dans le discours, mais dans la capacité à produire des résultats clairs, utiles et durables.",
    },
  ],
  pillars: [
    {
      title: "Conseil et adoption de l'IA",
      promise: "Clarifier les priorités, choisir les bons usages et préparer les équipes avant de lancer un projet.",
      items: [
        "Évaluation de la maturité face à l'IA",
        "Cartographie des besoins et des freins",
        "Plan d'action à 30, 60 et 90 jours",
        "Gouvernance et accompagnement du changement",
      ],
      color: "#16324F",
      icon: "compass",
    },
    {
      title: "Automatisation et solutions d'IA",
      promise: "Mettre en place des assistants, des automatisations et des outils utiles sur des besoins déjà identifiés.",
      items: [
        "Automatisation de tâches répétitives",
        "Assistants numériques et réponses guidées",
        "Suivi d'activité et tableaux de bord",
        "Production de contenus et de documents",
      ],
      color: "#D66724",
      icon: "settings-2",
    },
    {
      title: "Veille, contenus et opportunités",
      promise: "Faire vivre la dynamique dans la durée avec des contenus utiles, des signaux de marché et des formats d'activation.",
      items: [
        "Newsletter et veille de direction",
        "Guides pratiques et contenus courts",
        "Webinaires et capsules",
        "Opportunités et mises en relation",
      ],
      color: "#2F6F6A",
      icon: "radar",
    },
  ],
  useCases: [
    {
      title: "Soutien administratif et coordination",
      desc: "Courriels, comptes rendus, agendas, notes, coordination et circulation des documents.",
    },
    {
      title: "Ressources humaines et formation",
      desc: "Recrutement, intégration, communication interne, plans de formation et usages responsables de l'IA.",
    },
    {
      title: "Marketing & communication",
      desc: "Création de contenus, adaptation de formats, segmentation et suivi de campagnes.",
    },
    {
      title: "Service client & relation commerciale",
      desc: "Questions fréquentes, qualification des prospects, prise de rendez-vous et réponses plus rapides.",
    },
    {
      title: "Données, pilotage et finance",
      desc: "Synthèses, tableaux de bord, suivi régulier, gain de temps et aide à la décision.",
    },
    {
      title: "Juridique, conformité, direction",
      desc: "Documents sensibles, veille, notes d'aide à la décision, gouvernance et cadre d'usage.",
    },
  ],
  domainFamilies: [
    {
      title: "Fonctions support",
      color: "#16324F",
      domains: ["Assistanat & Secrétariat", "Administration & Gestion", "Ressources Humaines", "Finance & Comptabilité"],
    },
    {
      title: "Croissance & relation client",
      color: "#D66724",
      domains: ["Marketing & Communication", "Service client", "Formation & Pédagogie"],
    },
    {
      title: "Pilotage & expertise",
      color: "#2F6F6A",
      domains: ["Données & Analyse", "Management & Leadership", "Juridique & Conformité"],
    },
    {
      title: "Tech & secteurs ciblés",
      color: "#6E7D8C",
      domains: ["IT & Transformation digitale", "Santé & Bien-être", "Diplomatie & Affaires Internationales"],
    },
  ],
  audit: {
    title: "L'entrée idéale pour démarrer : l'audit IA gratuit",
    proof: [
      "100% gratuit et sans engagement",
      "Pensé pour les entreprises en Côte d'Ivoire et en Afrique",
      "Accusé de réception immédiat",
      "Accès au formulaire d'audit sous environ 30 minutes",
    ],
    deliverables: [
      "Diagnostic synthétique des priorités liées à l'IA",
      "Points de blocage et opportunités les plus utiles",
      "Usages concrets par équipe ou par métier",
      "Première feuille de route à 30, 60 et 90 jours",
      "Orientation vers la bonne suite : formation, accompagnement ou solution",
    ],
    meeting: "Échange expert gratuit de 30 à 45 minutes",
    steps: ["Demande rapide", "Questionnaire d'audit", "Échange expert", "Plan d'action proposé"],
  },
  sequence: [
    {
      title: "1. Écoute & audit",
      desc: "Comprendre le contexte, les difficultés rencontrées, les outils déjà en place et les objectifs.",
    },
    {
      title: "2. Priorisation",
      desc: "Choisir les usages qui peuvent apporter un résultat visible, réaliste et rapide à tester.",
    },
    {
      title: "3. Exécution adaptée",
      desc: "Former les équipes, lancer un premier cas concret ou déployer une solution selon le besoin.",
    },
    {
      title: "4. Suivi & montée en puissance",
      desc: "Mesurer les résultats, ajuster l'approche et étendre ce qui fonctionne.",
    },
  ],
  outcomes: [
    "Réduction du temps passé sur les tâches répétitives",
    "Montée en compétences des équipes et des managers",
    "Décisions mieux structurées et plus rapides",
    "Résultats plus visibles grâce à des usages bien ciblés",
  ],
  contacts: {
    website: "www.transferai.ci",
    email: "contact@transferai.ci",
    phone: "+225 07 16 57 39 90",
    whatsapp: "WhatsApp : +225 07 16 57 39 90",
    linkedin: "linkedin.com/company/transfert-ai-africa",
    address: "Riviera 3, carrefour Sainte Famille, Abidjan, Côte d'Ivoire",
  },
};

export function fullBleed(slide, ctx, fill = palette.bg) {
  ctx.addShape(slide, {
    x: 0,
    y: 0,
    width: ctx.W,
    height: ctx.H,
    fill,
    line: ctx.line(fill, 0),
  });
}

export function panel(slide, ctx, x, y, width, height, options = {}) {
  const fill = options.fill ?? palette.paper;
  const stroke = options.stroke ?? fill;
  return ctx.addShape(slide, {
    x,
    y,
    width,
    height,
    fill,
    line: ctx.line(stroke, options.lineWidth ?? 1),
  });
}

export function rule(slide, ctx, x, y, width, fill = palette.stone, height = 2) {
  ctx.addShape(slide, {
    x,
    y,
    width,
    height,
    fill,
    line: ctx.line(fill, 0),
  });
}

export function kicker(slide, ctx, text, x = 60, y = 40, width = 280, color = palette.accent) {
  ctx.addText(slide, {
    text: text.toUpperCase(),
    x,
    y,
    width,
    height: 18,
    size: 10,
    bold: true,
    color,
    typeface: "Aptos",
  });
}

export function title(slide, ctx, text, x, y, width, height, size = 30, color = palette.ink) {
  return ctx.addText(slide, {
    text,
    x,
    y,
    width,
    height,
    size,
    bold: true,
    color,
    typeface: "Aptos Display",
  });
}

export function body(slide, ctx, text, x, y, width, height, size = 14, options = {}) {
  return ctx.addText(slide, {
    text,
    x,
    y,
    width,
    height,
    size,
    color: options.color ?? palette.inkSoft,
    bold: options.bold ?? false,
    typeface: options.face ?? "Aptos",
    align: options.align ?? "left",
  });
}

export function bulletList(slide, ctx, items, x, y, width, options = {}) {
  const gap = options.gap ?? 34;
  const size = options.size ?? 15;
  items.forEach((item, index) => {
    ctx.addText(slide, {
      text: "•",
      x,
      y: y + index * gap,
      width: 16,
      height: 18,
      size,
      bold: true,
      color: options.bulletColor ?? palette.accent,
      typeface: "Aptos",
    });
    ctx.addText(slide, {
      text: item,
      x: x + 20,
      y: y + index * gap - 2,
      width: width - 20,
      height: options.itemHeight ?? 28,
      size,
      color: options.color ?? palette.inkSoft,
      typeface: "Aptos",
      bold: options.bold ?? false,
    });
  });
}

export function metricCard(slide, ctx, x, y, width, height, value, label, color = palette.accent) {
  panel(slide, ctx, x, y, width, height, { fill: palette.paper, stroke: palette.stone });
  ctx.addShape(slide, {
    x: x + 18,
    y: y + 18,
    width: 4,
    height: height - 36,
    fill: color,
    line: ctx.line(color, 0),
  });
  ctx.addText(slide, {
    text: value,
    x: x + 38,
    y: y + 16,
    width: width - 52,
    height: 34,
    size: 28,
    bold: true,
    color: palette.ink,
    typeface: "Aptos Display",
  });
  ctx.addText(slide, {
    text: label,
    x: x + 38,
    y: y + 54,
    width: width - 52,
    height: 28,
    size: 11,
    color: palette.inkSoft,
    bold: true,
    typeface: "Aptos",
  });
}

export function chip(slide, ctx, x, y, width, text, fill = palette.accentSoft, textColor = palette.ink) {
  panel(slide, ctx, x, y, width, 28, { fill, stroke: fill });
  ctx.addText(slide, {
    text,
    x,
    y: y + 6,
    width,
    height: 16,
    size: 10.5,
    bold: true,
    color: textColor,
    align: "center",
    typeface: "Aptos",
  });
}

export async function addLogo(slide, ctx, x, y, width = 150, height = 60) {
  await ctx.addImage(slide, {
    path: assets.logo,
    x,
    y,
    width,
    height,
    fit: "contain",
    alt: "TransferAI Africa logo",
  });
}

export async function addPartnerStrip(slide, ctx, y = 570) {
  for (let index = 0; index < assets.partners.length; index += 1) {
    const x = 60 + index * 190;
    panel(slide, ctx, x, y, 162, 60, { fill: palette.paper, stroke: palette.stone });
    await ctx.addImage(slide, {
      path: assets.partners[index],
      x: x + 14,
      y: y + 12,
      width: 134,
      height: 36,
      fit: "contain",
      alt: `Partner logo ${index + 1}`,
    });
  }
}

export function footer(slide, ctx, slideNo, text) {
  rule(slide, ctx, 60, 680, 1160, palette.stone, 1);
  ctx.addText(slide, {
    text,
    x: 60,
    y: 688,
    width: 980,
    height: 16,
    size: 9,
    color: palette.inkSoft,
    typeface: "Aptos",
  });
  ctx.addText(slide, {
    text: String(slideNo).padStart(2, "0"),
    x: 1140,
    y: 686,
    width: 60,
    height: 18,
    size: 11,
    bold: true,
    color: palette.ink,
    align: "right",
    typeface: "Aptos",
  });
}
