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
  subtitle: "Offre entreprise ciblée : formation, accompagnement et cas d'usage utiles",
  tagline:
    "Pour une structure comme Elton Oil CI, nous mettons en avant le service derrière l'IA : audit, formation, cadrage, gouvernance et mise en œuvre progressive.",
  heroPromise: "Faire de l'IA un levier concret de performance, de montée en compétences et de qualité de service.",
  credibility: [
    { value: "8", label: "formations prioritaires" },
    { value: "4", label: "blocs d'offre" },
    { value: "45 min", label: "échange gratuit" },
    { value: "0 FCFA", label: "audit d'entrée" },
  ],
  reasons: [
    {
      title: "Mieux piloter les comptes et les opérations",
      desc: "Aider la direction et les équipes à mieux exploiter les informations utiles au suivi commercial, administratif et décisionnel.",
      icon: "briefcase-business",
    },
    {
      title: "Former sans perturber l'exploitation",
      desc: "Structurer une montée en compétences concrète pour les dirigeants, managers, équipes métier et fonctions support.",
      icon: "graduation-cap",
    },
    {
      title: "Déployer avec méthode et confidentialité",
      desc: "Prioriser les usages utiles, protéger les données sensibles et avancer avec une feuille de route progressive.",
      icon: "shield-check",
    },
  ],
  objectives: [
    "Identifier les priorités réellement utiles pour l'entreprise",
    "Fluidifier les processus qui consomment du temps et de la coordination",
    "Renforcer la qualité de service et le suivi client",
    "Faire monter les équipes en compétences sur des usages concrets",
  ],
  entryPoint: {
    title: "Notre porte d'entrée recommandée",
    offer: "Audit IA gratuit - Comptes professionnels, flotte et performance commerciale",
    bullets: [
      "Repérer les points de friction les plus coûteux",
      "Prioriser les gains rapides",
      "Choisir le bon équilibre entre formation, accompagnement et solution",
      "Préparer un premier plan d'action crédible",
    ],
    outputs: [
      "Lecture claire des priorités",
      "Cas d'usage utiles à tester",
      "Besoins de formation par population",
      "Première trajectoire de mise en œuvre",
    ],
  },
  offerBlocks: [
    {
      title: "Audit, cadrage et feuille de route",
      promise: "Clarifier les priorités avant toute dépense importante.",
      items: [
        "Diagnostic des processus critiques",
        "Feuille de route simple et progressive",
      ],
      color: "#16324F",
      icon: "compass",
    },
    {
      title: "Formation dirigeants et managers",
      promise: "Donner aux décideurs une lecture claire des usages, des limites et des choix à faire.",
      items: [
        "Vision et stratégie IA",
        "Conduite du changement",
      ],
      color: "#D66724",
      icon: "briefcase",
    },
    {
      title: "Formation équipes métier",
      promise: "Faire gagner du temps, de la rigueur et de la fluidité aux équipes au quotidien.",
      items: [
        "Finance et reporting",
        "Service client, flotte et opérations",
      ],
      color: "#2F6F6A",
      icon: "users",
    },
    {
      title: "Pilote et mise en œuvre",
      promise: "Passer d'un besoin identifié à un premier cas d'usage visible et mesurable.",
      items: [
        "Assistant métier ciblé",
        "Tableau de bord, base interne et gouvernance",
      ],
      color: "#6E7D8C",
      icon: "settings-2",
    },
  ],
  trainingFamilies: [
    {
      title: "Direction et management",
      color: "#16324F",
      programs: [
        "IA pour Dirigeants : Vision et Stratégie",
        "Prise de Décision Stratégique avec l'IA",
      ],
    },
    {
      title: "Finance et pilotage",
      color: "#D66724",
      programs: [
        "Reporting Financier Automatisé",
        "Comptabilité Automatisée avec l'IA",
      ],
    },
    {
      title: "Opérations et relation client",
      color: "#2F6F6A",
      programs: [
        "Gestion de Flotte et Logistique IA",
        "CRM Intelligent et IA",
      ],
    },
    {
      title: "Transformation et conformité",
      color: "#6E7D8C",
      programs: [
        "Optimisation des Processus Métier avec l'IA",
        "RGPD et Protection des Données avec l'IA",
      ],
    },
  ],
  useCases: [
    {
      title: "Comptes professionnels et recouvrement",
      desc: "Mieux suivre les comptes clients, les échéances, les relances et les revues de portefeuille.",
    },
    {
      title: "Flotte, carte carburant et pilotage",
      desc: "Mieux exploiter les données de consommation, les cartes et les tableaux de bord de suivi.",
    },
    {
      title: "Service auto et relation client",
      desc: "Renforcer les rappels, la qualité de service, la réactivité et le suivi des interactions clients.",
    },
    {
      title: "Procédures, standards et diffusion interne",
      desc: "Aider les équipes à accéder plus vite aux bonnes pratiques, réponses et informations utiles.",
    },
  ],
  sequence: [
    {
      title: "1. Rendez-vous de cadrage",
      desc: "Comprendre les priorités, le contexte et les points de friction les plus sensibles.",
    },
    {
      title: "2. Audit gratuit",
      desc: "Identifier les quick wins, les besoins de formation et les premiers cas d'usage utiles.",
    },
    {
      title: "3. Formation ciblée",
      desc: "Former la bonne population au bon niveau : direction, managers, équipes métier ou support.",
    },
    {
      title: "4. Pilote puis extension",
      desc: "Lancer un premier usage mesurable, puis élargir seulement ce qui fonctionne réellement.",
    },
  ],
  trust: [
    "Aucune donnée sensible n'est exposée à un modèle sans règles claires",
    "Les usages sont cadrés par les rôles, les accès et le niveau de sensibilité",
    "Le filtrage et la revue humaine précèdent toute automatisation critique",
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
