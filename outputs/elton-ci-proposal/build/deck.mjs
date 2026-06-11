const theme = {
  bg: "#F5EFE7",
  panel: "#FFFDFC",
  panelAlt: "#FBF5EE",
  ink: "#1A3554",
  soft: "#617086",
  orange: "#E76F1D",
  navy: "#163556",
  teal: "#1C8A78",
  mint: "#E7F2EE",
  sand: "#EFE2D2",
  gold: "#C88C3A",
  line: "#D7CEC3",
  white: "#FFFFFF",
  darkSoft: "#C9D4E1",
};

const footerLabel = "TransferAI | Hub AI de Nettelecom CI | Proposition ciblée ELTON CI";

function text(slide, ctx, value, x, y, w, h, opts = {}) {
  return ctx.addText(slide, {
    text: String(value ?? ""),
    left: x,
    top: y,
    width: w,
    height: h,
    fontSize: opts.size ?? 18,
    color: opts.color ?? theme.ink,
    bold: Boolean(opts.bold),
    typeface: opts.face ?? ctx.fonts.body,
    align: opts.align ?? "left",
    valign: opts.valign ?? "top",
    fill: opts.fill ?? "#00000000",
    line: opts.line ?? ctx.line(),
    insets: opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

function rect(slide, ctx, x, y, w, h, fill, opts = {}) {
  return ctx.addShape(slide, {
    left: x,
    top: y,
    width: w,
    height: h,
    geometry: opts.geometry ?? "rect",
    fill,
    line: opts.line ?? ctx.line(),
  });
}

function bg(slide, ctx, fill = theme.bg) {
  rect(slide, ctx, 0, 0, ctx.W, ctx.H, fill);
}

function footer(slide, ctx, page, note = footerLabel) {
  rect(slide, ctx, 68, 682, 1144, 1, theme.line);
  text(slide, ctx, note, 72, 690, 900, 16, { size: 8.5, color: theme.soft });
  text(slide, ctx, String(page).padStart(2, "0"), 1160, 688, 36, 18, {
    size: 10,
    color: theme.ink,
    bold: true,
    align: "right",
  });
}

function kicker(slide, ctx, label, x = 72, y = 52, accent = theme.orange) {
  text(slide, ctx, label.toUpperCase(), x, y, 260, 18, {
    size: 10.5,
    color: accent,
    bold: true,
  });
}

function title(slide, ctx, value, x, y, w, h, size = 32, color = theme.ink) {
  text(slide, ctx, value, x, y, w, h, {
    size,
    color,
    bold: true,
    face: ctx.fonts.title,
  });
}

function body(slide, ctx, value, x, y, w, h, size = 15, color = theme.soft, opts = {}) {
  text(slide, ctx, value, x, y, w, h, {
    size,
    color,
    ...opts,
  });
}

function card(slide, ctx, x, y, w, h, opts = {}) {
  rect(slide, ctx, x, y, w, h, opts.fill ?? theme.panel, {
    line: ctx.line(opts.border ?? theme.line, opts.borderWidth ?? 1),
  });
}

function statCard(slide, ctx, x, y, w, h, accent, value, label, note) {
  card(slide, ctx, x, y, w, h, { fill: theme.panel, border: theme.line });
  rect(slide, ctx, x + 16, y + 18, 3, h - 36, accent);
  text(slide, ctx, value, x + 30, y + 14, w - 44, 30, { size: 22, color: theme.ink, bold: true, face: ctx.fonts.title });
  text(slide, ctx, label, x + 30, y + 46, w - 44, 18, { size: 9.5, color: theme.soft, bold: true });
  text(slide, ctx, note, x + 30, y + 64, w - 44, 26, { size: 8.5, color: theme.soft });
}

async function iconBadge(slide, ctx, icon, x, y, fill, iconColor = theme.white) {
  rect(slide, ctx, x, y, 44, 44, fill, { geometry: "ellipse", line: ctx.line(fill, 0) });
  await ctx.addLucideIcon(slide, {
    icon,
    left: x + 10,
    top: y + 10,
    width: 24,
    height: 24,
    color: iconColor,
  });
}

async function useCaseCard(slide, ctx, opts) {
  const { x, y, w, h, icon, accent, titleText, before, after } = opts;
  card(slide, ctx, x, y, w, h, { fill: theme.panel });
  await iconBadge(slide, ctx, icon, x + 18, y + 18, accent);
  text(slide, ctx, titleText, x + 76, y + 22, w - 96, 28, {
    size: 15.5,
    color: theme.ink,
    bold: true,
    face: ctx.fonts.title,
  });
  text(slide, ctx, "AVANT", x + 22, y + 66, 80, 14, { size: 9, color: theme.orange, bold: true });
  body(slide, ctx, before, x + 22, y + 84, w - 44, 42, 11.5, theme.soft);
  text(slide, ctx, "APRÈS", x + 22, y + 130, 80, 14, { size: 9, color: theme.teal, bold: true });
  body(slide, ctx, after, x + 22, y + 148, w - 44, h - 160, 11.5, theme.ink);
}

function metricCard(slide, ctx, x, y, w, h, fill, value, label, note, valueColor = theme.white) {
  rect(slide, ctx, x, y, w, h, fill, { line: ctx.line(fill, 0) });
  text(slide, ctx, value, x + 18, y + 18, w - 36, 42, {
    size: 32,
    color: valueColor,
    bold: true,
    face: ctx.fonts.title,
    align: "center",
  });
  text(slide, ctx, label, x + 18, y + 64, w - 36, 18, {
    size: 11,
    color: valueColor,
    align: "center",
    bold: true,
  });
  text(slide, ctx, note, x + 18, y + 86, w - 36, 24, {
    size: 8.5,
    color: valueColor,
    align: "center",
  });
}

function kpiRow(slide, ctx, y, accent, label, detail, kpi) {
  rect(slide, ctx, 72, y + 10, 5, 48, accent);
  text(slide, ctx, label, 92, y, 250, 26, {
    size: 15,
    color: theme.ink,
    bold: true,
    face: ctx.fonts.title,
  });
  body(slide, ctx, detail, 92, y + 26, 510, 44, 12, theme.soft);
  card(slide, ctx, 640, y - 2, 560, 70, { fill: theme.panelAlt, border: theme.line });
  text(slide, ctx, "KPI à instrumenter", 662, y + 10, 140, 16, {
    size: 9.5,
    color: theme.orange,
    bold: true,
  });
  body(slide, ctx, kpi, 662, y + 28, 516, 26, 12, theme.ink);
}

function stepCard(slide, ctx, x, y, w, h, step, titleText, copy, accent) {
  card(slide, ctx, x, y, w, h, { fill: theme.panel });
  text(slide, ctx, step, x + 18, y + 16, 60, 28, {
    size: 20,
    color: accent,
    bold: true,
    face: ctx.fonts.title,
  });
  text(slide, ctx, titleText, x + 18, y + 54, w - 36, 52, {
    size: 18,
    color: theme.ink,
    bold: true,
    face: ctx.fonts.title,
  });
  body(slide, ctx, copy, x + 18, y + 114, w - 36, h - 132, 12.5, theme.soft);
}

function offerBrick(slide, ctx, x, y, w, h, accent, titleText, bullets) {
  rect(slide, ctx, x, y, w, h, accent, { line: ctx.line(accent, 0) });
  text(slide, ctx, titleText, x + 18, y + 18, w - 36, 44, {
    size: 18,
    color: theme.white,
    bold: true,
    face: ctx.fonts.title,
  });
  body(slide, ctx, bullets, x + 18, y + 72, w - 36, h - 90, 12.5, theme.white);
}

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  card(slide, ctx, 58, 82, 676, 504, { fill: theme.panel });
  rect(slide, ctx, 774, 82, 448, 504, theme.navy, { line: ctx.line(theme.navy, 0) });
  rect(slide, ctx, 774, 82, 10, 504, theme.teal, { line: ctx.line(theme.teal, 0) });

  kicker(slide, ctx, "Proposition ciblée | ELTON CI", 84, 110);
  title(slide, ctx, "Transformer l'IA\nen gains visibles\npour ELTON CI", 84, 148, 560, 154, 42);
  body(
    slide,
    ctx,
    "Une proposition construite à partir du ROI de référence TransferAI, mais traduite dans le contexte ELTON CI autour de quatre terrains d'impact : comptes professionnels, flotte et cartes carburant, service client, procédures internes.",
    84,
    324,
    580,
    118,
    16,
    theme.soft,
  );
  card(slide, ctx, 84, 418, 410, 30, { fill: theme.panelAlt, border: theme.line });
  body(
    slide,
    ctx,
    "TransferAI est le hub AI de Nettelecom CI.",
    100,
    425,
    380,
    16,
    11.5,
    theme.ink,
    { bold: true },
  );
  text(slide, ctx, "Point d'entrée recommandé", 84, 454, 220, 18, {
    size: 10,
    color: theme.orange,
    bold: true,
  });
  body(
    slide,
    ctx,
    "Audit IA gratuit + atelier métier de 45 minutes pour qualifier les priorités, les KPI et la bonne séquence de déploiement.",
    84,
    476,
    548,
    56,
    14,
    theme.ink,
    { bold: true },
  );

  statCard(slide, ctx, 84, 548, 138, 86, theme.orange, "J+15", "premier livrable", "lecture claire des gains rapides");
  statCard(slide, ctx, 236, 548, 138, 86, theme.teal, "13", "experts IA", "mobilisés via TransferAI");
  statCard(slide, ctx, 388, 548, 138, 86, theme.navy, "+30 %", "productivité benchmark", "sur des flux répétitifs comparables");
  statCard(slide, ctx, 540, 548, 138, 86, theme.gold, "-45 %", "effort de formation", "benchmark onboarding / diffusion");

  kicker(slide, ctx, "Ce que nous proposons", 812, 122, theme.white);
  title(slide, ctx, "Une offre exécutive,\nmétier et mesurable.", 812, 154, 340, 84, 28, theme.white);
  body(
    slide,
    ctx,
    "• Partir des vrais irritants d'ELTON CI\n• Cadrer des cas d'usage utiles avant tout déploiement\n• Former les bonnes équipes au bon niveau\n• Lancer un pilote avec mesure du ROI",
    812,
    276,
    338,
    124,
    15,
    theme.darkSoft,
  );
  card(slide, ctx, 812, 430, 330, 102, { fill: "#244667", border: "#244667" });
  text(slide, ctx, "Promesse", 834, 448, 90, 16, { size: 9.5, color: "#D7E5F3", bold: true });
  body(
    slide,
    ctx,
    "Faire de l'IA un levier de pilotage, de rigueur opérationnelle et de qualité de service pour ELTON CI.",
    834,
    470,
    286,
    44,
    14,
    theme.white,
    { bold: true },
  );
  card(slide, ctx, 812, 548, 330, 86, { fill: "#10263F", border: "#2F587F" });
  body(
    slide,
    ctx,
    "Important : les chiffres de ROI affichés dans ce deck sont des benchmarks de référence TransferAI, à confirmer sur les données d'ELTON CI pendant l'audit.",
    832,
    566,
    292,
    44,
    11.5,
    "#D7E5F3",
  );

  footer(slide, ctx, 1);
  return slide;
}

export async function slide02brand(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Qui sommes-nous");
  title(slide, ctx, "TransferAI, le hub AI de Nettelecom CI", 72, 86, 860, 84, 34);
  body(
    slide,
    ctx,
    "La proposition gagne en crédibilité si nous expliquons clairement qui porte l'offre, avec quelle profondeur d'expertise et dans quel cadre d'exécution.",
    72,
    176,
    970,
    28,
    14,
    theme.soft,
  );

  rect(slide, ctx, 72, 228, 432, 340, theme.navy, { line: ctx.line(theme.navy, 0) });
  text(slide, ctx, "TransferAI", 98, 252, 160, 22, {
    size: 11,
    color: "#D7E5F3",
    bold: true,
  });
  title(slide, ctx, "Le hub AI\nopérationnel de\nNettelecom CI", 98, 286, 270, 132, 30, theme.white);
  body(
    slide,
    ctx,
    "Nous positionnons TransferAI comme la structure qui relie stratégie, automatisation, data, formation et gouvernance pour transformer l'IA en exécution métier.",
    98,
    408,
    286,
    78,
    13.5,
    "#D7E5F3",
  );
  card(slide, ctx, 98, 512, 290, 42, { fill: "#244667", border: "#244667" });
  body(
    slide,
    ctx,
    "Pour ELTON CI : un interlocuteur IA structuré, pas un simple catalogue.",
    114,
    524,
    258,
    18,
    11,
    theme.white,
    { bold: true },
  );

  card(slide, ctx, 534, 228, 300, 148, { fill: theme.panel });
  await iconBadge(slide, ctx, "Users", 556, 250, theme.orange);
  title(slide, ctx, "13 experts en IA", 612, 250, 180, 28, 22);
  body(
    slide,
    ctx,
    "Une équipe de 13 experts en IA, mobilisable sur des enjeux de diagnostic, d'automatisation, de pilotage, de formation et de gouvernance.",
    556,
    300,
    236,
    54,
    12.5,
    theme.ink,
  );

  card(slide, ctx, 856, 228, 352, 148, { fill: theme.panel });
  await iconBadge(slide, ctx, "Building2", 878, 250, theme.teal);
  title(slide, ctx, "Différents secteurs couverts", 934, 250, 230, 28, 22);
  body(
    slide,
    ctx,
    "TransferAI rassemble des expertises IA appliquées dans différents secteurs d'activité, ce qui permet de relier les usages technologiques aux contraintes métier.",
    878,
    300,
    288,
    54,
    12.5,
    theme.ink,
  );

  card(slide, ctx, 534, 398, 300, 148, { fill: theme.panel });
  await iconBadge(slide, ctx, "BrainCircuit", 556, 420, theme.navy);
  title(slide, ctx, "Une logique d'exécution", 612, 420, 190, 28, 22);
  body(
    slide,
    ctx,
    "Notre rôle n'est pas seulement de présenter l'IA. Nous cadrons, priorisons, formons et transformons un besoin flou en pilote métier mesurable.",
    556,
    470,
    236,
    56,
    12.5,
    theme.ink,
  );

  card(slide, ctx, 856, 398, 352, 148, { fill: theme.panel });
  await iconBadge(slide, ctx, "ShieldCheck", 878, 420, theme.gold);
  title(slide, ctx, "Un cadre compatible entreprise", 934, 420, 240, 28, 22);
  body(
    slide,
    ctx,
    "Adossé à Nettelecom CI, TransferAI porte une approche sérieuse de la confidentialité, de la gouvernance des usages et de la supervision des pilotes.",
    878,
    470,
    288,
    56,
    12.5,
    theme.ink,
  );

  rect(slide, ctx, 72, 592, 1136, 50, theme.panelAlt, { line: ctx.line(theme.line, 1) });
  text(slide, ctx, "Pourquoi l'ajouter tôt dans le deck", 94, 610, 220, 16, {
    size: 10,
    color: theme.orange,
    bold: true,
  });
  body(
    slide,
    ctx,
    "Avant de parler ROI et cas d'usage, ELTON CI doit voir que TransferAI est une entité crédible, portée par Nettelecom CI et soutenue par 13 experts IA.",
    310,
    606,
    860,
    18,
    11.5,
    theme.ink,
    { bold: true },
  );

  footer(slide, ctx, 2);
  return slide;
}

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Contexte ELTON CI");
  title(slide, ctx, "Pourquoi cette proposition est adaptée au contexte ELTON CI", 72, 86, 900, 84, 34);
  body(
    slide,
    ctx,
    "L'objectif n'est pas d'ajouter un outil de plus. Il s'agit de mieux piloter, mieux coordonner et mieux diffuser l'information utile dans des flux qui coûtent du temps et de la discipline.",
    72,
    176,
    950,
    48,
    14,
    theme.soft,
  );

  await useCaseCard(slide, ctx, {
    x: 72, y: 248, w: 270, h: 180,
    icon: "Briefcase", accent: theme.orange,
    titleText: "Comptes professionnels",
    before: "Revues de portefeuille, relances et suivi d'encaissement souvent préparés à la main.",
    after: "Portefeuille plus lisible, relances mieux priorisées et synthèses plus rapides pour la direction.",
  });
  await useCaseCard(slide, ctx, {
    x: 362, y: 248, w: 270, h: 180,
    icon: "Fuel", accent: theme.teal,
    titleText: "Flotte et carburant",
    before: "Consommations, cartes et anomalies difficilement consolidées dans un même pilotage.",
    after: "Suivi plus fiable des coûts, alertes sur écarts et comparaison par véhicule, site ou période.",
  });
  await useCaseCard(slide, ctx, {
    x: 652, y: 248, w: 270, h: 180,
    icon: "Wrench", accent: theme.navy,
    titleText: "Service client / auto",
    before: "Rappels, demandes et réponses pas toujours homogènes ni suffisamment tracés.",
    after: "Réponses plus rapides, scripts mieux cadrés et meilleure continuité dans le suivi client.",
  });
  await useCaseCard(slide, ctx, {
    x: 942, y: 248, w: 266, h: 180,
    icon: "BookOpen", accent: theme.gold,
    titleText: "Procédures internes",
    before: "Les bonnes pratiques existent, mais restent dispersées dans les équipes et les documents.",
    after: "Accès plus rapide aux procédures, onboarding plus court et exécution plus cohérente.",
  });

  rect(slide, ctx, 72, 466, 1136, 136, theme.navy, { line: ctx.line(theme.navy, 0) });
  text(slide, ctx, "Le bon angle commercial", 98, 492, 180, 16, {
    size: 10,
    color: "#CFE0F0",
    bold: true,
  });
  title(slide, ctx, "Partir des flux métier qui freinent déjà l'exécution.", 98, 520, 560, 52, 28, theme.white);
  body(
    slide,
    ctx,
    "Pour ELTON CI, la crédibilité ne viendra pas d'un catalogue de formations. Elle viendra d'une proposition qui relie diagnostic, cas d'usage, gouvernance, formation ciblée et premiers gains visibles.",
    680,
    512,
    500,
    56,
    13.5,
    "#D7E5F3",
  );

  footer(slide, ctx, 3);
  return slide;
}

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  rect(slide, ctx, 0, 0, 1280, 118, theme.navy, { line: ctx.line(theme.navy, 0) });
  kicker(slide, ctx, "ROI de référence", 72, 52, theme.white);
  title(slide, ctx, "Le ROI présenté devient utile seulement s'il est traduit dans le contexte ELTON CI", 72, 76, 1036, 34, 28, theme.white);

  metricCard(slide, ctx, 72, 148, 264, 116, theme.teal, "+30 %", "productivité benchmark", "tâches répétitives, reporting, préparation de synthèses");
  metricCard(slide, ctx, 356, 148, 264, 116, theme.navy, "-45 %", "effort de formation", "onboarding, diffusion de pratiques et transfert de savoir");
  metricCard(slide, ctx, 640, 148, 264, 116, theme.orange, "J+15", "premier livrable", "audit, cadrage et priorisation ROI");
  metricCard(slide, ctx, 924, 148, 284, 116, theme.gold, "3,2x", "potentiel de ROI", "référence : projets comparables TransferAI");

  kpiRow(
    slide,
    ctx,
    310,
    theme.orange,
    "Comptes professionnels",
    "Automatiser la préparation des relances, standardiser les revues de portefeuille et mieux signaler les comptes à risque ou en retard.",
    "délai moyen de relance, temps de préparation des revues clients, évolution des encours en retard",
  );
  kpiRow(
    slide,
    ctx,
    392,
    theme.teal,
    "Flotte et cartes carburant",
    "Consolider les consommations, rapprocher les sources et produire des alertes simples sur les anomalies ou les dépassements inhabituels.",
    "temps de production du reporting flotte, nombre d'anomalies détectées, variation des coûts carburant",
  );
  kpiRow(
    slide,
    ctx,
    474,
    theme.navy,
    "Service client et procédures",
    "Rendre les réponses plus cohérentes, accélérer l'accès aux standards et réduire le temps de montée en main des équipes.",
    "délai de réponse, temps d'onboarding, usage de la base procédures / FAQ interne",
  );

  card(slide, ctx, 72, 584, 1136, 54, { fill: theme.panelAlt, border: theme.line });
  text(slide, ctx, "Important", 94, 602, 90, 16, {
    size: 10,
    color: theme.orange,
    bold: true,
  });
  body(
    slide,
    ctx,
    "Les chiffres affichés ci-dessus sont un référentiel ROI TransferAI sur des déploiements comparables. Les gains ELTON CI seront calibrés sur vos volumes, vos processus et vos données pendant l'audit initial.",
    188,
    598,
    980,
    18,
    11.5,
    theme.ink,
  );

  footer(slide, ctx, 4);
  return slide;
}

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Cas d'usage prioritaires");
  title(slide, ctx, "Les 4 cas d'usage à mettre au centre de la proposition ELTON CI", 72, 86, 900, 84, 34);
  body(
    slide,
    ctx,
    "Chaque cas d'usage doit être présenté comme un flux métier visible, avec un avant, un après et des KPI de validation.",
    72,
    176,
    920,
    28,
    14,
    theme.soft,
  );

  await useCaseCard(slide, ctx, {
    x: 72, y: 228, w: 540, h: 172,
    icon: "CircleDollarSign", accent: theme.orange,
    titleText: "1. Comptes professionnels et recouvrement",
    before: "Relances, revues de portefeuille et synthèses commerciales dispersées entre plusieurs supports.",
    after: "Assistant de préparation, synthèse portefeuille, priorisation des comptes à risque et routines de suivi mieux standardisées.",
  });
  await useCaseCard(slide, ctx, {
    x: 640, y: 228, w: 568, h: 172,
    icon: "Fuel", accent: theme.teal,
    titleText: "2. Flotte, cartes carburant et consommation",
    before: "Vision fragmentée des consommations, des écarts et des commentaires d'analyse.",
    after: "Tableau de bord consolidé, alertes simples sur anomalies et meilleure lecture des coûts par véhicule, site ou période.",
  });
  await useCaseCard(slide, ctx, {
    x: 72, y: 424, w: 540, h: 172,
    icon: "MessageSquareText", accent: theme.navy,
    titleText: "3. Service client / service auto",
    before: "Demandes récurrentes, scripts variables et historique pas toujours exploitable pour mieux servir.",
    after: "FAQ assistée, canevas de réponse, suivi plus continu et meilleur niveau de réactivité opérationnelle.",
  });
  await useCaseCard(slide, ctx, {
    x: 640, y: 424, w: 568, h: 172,
    icon: "BookOpen", accent: theme.gold,
    titleText: "4. Procédures internes et base de connaissances",
    before: "Procédures, standards et bonnes réponses éparpillés, donc difficilement réutilisables à grande échelle.",
    after: "Base interne plus accessible, exécution plus homogène et réduction du temps de recherche pour les équipes.",
  });

  footer(slide, ctx, 5);
  return slide;
}

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Détail des cas d'usage");
  title(slide, ctx, "Les deux premiers terrains à lancer rapidement", 72, 86, 840, 84, 34);
  body(
    slide,
    ctx,
    "Nous recommandons de démarrer par deux flux où la valeur est plus facile à rendre visible pour la direction : comptes professionnels et flotte / cartes carburant.",
    72,
    176,
    920,
    28,
    14,
    theme.soft,
  );

  card(slide, ctx, 72, 228, 540, 326, { fill: theme.panel });
  await iconBadge(slide, ctx, "CircleDollarSign", 94, 248, theme.orange);
  title(slide, ctx, "Comptes professionnels et recouvrement", 150, 248, 410, 34, 22);
  text(slide, ctx, "AVANT", 94, 300, 70, 16, { size: 10, color: theme.orange, bold: true });
  body(slide, ctx, "• relances préparées à la main\n• revues de portefeuille longues à consolider\n• informations dispersées entre mails, fichiers et historique commercial", 94, 324, 470, 74, 12.5, theme.soft);
  text(slide, ctx, "APRÈS", 94, 418, 70, 16, { size: 10, color: theme.teal, bold: true });
  body(slide, ctx, "• canevas de relance et brouillons assistés\n• synthèse de portefeuille pré-préparée pour les revues\n• signalement des comptes sensibles ou des échéances critiques", 94, 442, 470, 74, 12.5, theme.ink);
  card(slide, ctx, 94, 522, 490, 40, { fill: theme.panelAlt, border: theme.line });
  body(slide, ctx, "KPI : délai de relance | temps de préparation des revues | visibilité sur les encours en retard", 110, 534, 456, 16, 11.5, theme.ink, { bold: true });

  card(slide, ctx, 640, 228, 568, 326, { fill: theme.panel });
  await iconBadge(slide, ctx, "Fuel", 662, 248, theme.teal);
  title(slide, ctx, "Flotte, cartes carburant et consommation", 718, 248, 420, 34, 22);
  text(slide, ctx, "AVANT", 662, 300, 70, 16, { size: 10, color: theme.orange, bold: true });
  body(slide, ctx, "• reporting flotte et carburant peu harmonisé\n• écarts détectés tardivement\n• lecture difficile des coûts par site, véhicule ou période", 662, 324, 498, 74, 12.5, theme.soft);
  text(slide, ctx, "APRÈS", 662, 418, 70, 16, { size: 10, color: theme.teal, bold: true });
  body(slide, ctx, "• tableau de bord consolidé\n• alertes sur anomalies de consommation\n• comparatifs plus simples pour arbitrer et commenter les écarts", 662, 442, 498, 74, 12.5, theme.ink);
  card(slide, ctx, 662, 522, 498, 40, { fill: theme.panelAlt, border: theme.line });
  body(slide, ctx, "KPI : temps de production du reporting | anomalies détectées | variation du coût carburant", 678, 534, 466, 16, 11.5, theme.ink, { bold: true });

  rect(slide, ctx, 72, 590, 1136, 54, theme.navy, { line: ctx.line(theme.navy, 0) });
  body(
    slide,
    ctx,
    "Ces deux flux ont un avantage : ils parlent à la fois à la direction, aux opérations et aux équipes métier. Ils permettent donc de montrer très vite une valeur concrète, sans promettre une transformation trop large dès le départ.",
    96,
    606,
    1088,
    20,
    12.5,
    theme.white,
  );

  footer(slide, ctx, 6);
  return slide;
}

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Détail des cas d'usage");
  title(slide, ctx, "Les cas d'usage qui renforcent la qualité de service et la standardisation", 72, 86, 980, 84, 34);
  body(
    slide,
    ctx,
    "Ces deux usages rendent aussi la formation plus crédible : on apprend sur des situations réelles, pas sur des exemples génériques.",
    72,
    176,
    960,
    28,
    14,
    theme.soft,
  );

  card(slide, ctx, 72, 228, 540, 308, { fill: theme.panel });
  await iconBadge(slide, ctx, "MessageSquareText", 94, 248, theme.navy);
  title(slide, ctx, "Service client / service auto", 150, 248, 390, 34, 22);
  text(slide, ctx, "Usages proposés", 94, 300, 120, 16, { size: 10, color: theme.orange, bold: true });
  body(
    slide,
    ctx,
    "• FAQ assistée pour les questions récurrentes\n• canevas de réponse ou de rappel\n• historique d'interactions mieux exploitable\n• synthèses rapides avant rappel ou traitement",
    94,
    324,
    456,
    90,
    12.5,
    theme.ink,
  );
  card(slide, ctx, 94, 432, 490, 84, { fill: theme.panelAlt, border: theme.line });
  body(slide, ctx, "KPI : délai de réponse | qualité perçue | taux de réouverture / relance | standardisation des scripts", 112, 458, 450, 36, 11.5, theme.ink, { bold: true });

  card(slide, ctx, 640, 228, 568, 308, { fill: theme.panel });
  await iconBadge(slide, ctx, "BookOpen", 662, 248, theme.gold);
  title(slide, ctx, "Procédures internes et base de connaissances", 718, 248, 432, 34, 22);
  text(slide, ctx, "Usages proposés", 662, 300, 120, 16, { size: 10, color: theme.orange, bold: true });
  body(
    slide,
    ctx,
    "• base de procédures consultable rapidement\n• réponses homogènes pour les équipes support et métier\n• onboarding accéléré sur les standards, scripts et points de contrôle\n• diffusion plus simple des mises à jour internes",
    662,
    324,
    490,
    90,
    12.5,
    theme.ink,
  );
  card(slide, ctx, 662, 432, 498, 84, { fill: theme.panelAlt, border: theme.line });
  body(slide, ctx, "KPI : temps de recherche d'information | temps d'onboarding | taux d'usage de la base interne", 680, 458, 460, 36, 11.5, theme.ink, { bold: true });

  rect(slide, ctx, 72, 566, 1136, 80, theme.teal, { line: ctx.line(theme.teal, 0) });
  text(slide, ctx, "Pourquoi cette slide compte", 96, 586, 170, 16, {
    size: 10,
    color: "#DDF5EF",
    bold: true,
  });
  title(slide, ctx, "La formation devient crédible quand elle prépare des usages visibles.", 96, 608, 560, 24, 22, theme.white);
  body(
    slide,
    ctx,
    "Pour ELTON CI, cela permet d'éviter un discours abstrait : les équipes voient tout de suite sur quels gestes métier l'IA doit les aider.",
    700,
    602,
    470,
    26,
    12.5,
    theme.white,
  );

  footer(slide, ctx, 7);
  return slide;
}

export async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Parcours 90 jours");
  title(slide, ctx, "La séquence recommandée pour passer du cadrage au pilote", 72, 86, 900, 84, 34);
  body(
    slide,
    ctx,
    "Le bon scénario n'est pas de tout vendre d'un bloc, mais d'enchaîner les étapes utiles dans le bon ordre, avec validation à chaque palier.",
    72,
    176,
    940,
    28,
    14,
    theme.soft,
  );

  stepCard(slide, ctx, 72, 236, 256, 248, "01", "J+0 | Audit et cadrage", "Cartographier les irritants, choisir les cas d'usage prioritaires et définir les KPI de preuve.", theme.orange);
  stepCard(slide, ctx, 352, 236, 256, 248, "02", "J+15 | Prototype ciblé", "Produire un premier livrable exploitable : synthèse, tableau de bord, assistant ou routine de pilotage.", theme.teal);
  stepCard(slide, ctx, 632, 236, 256, 248, "03", "J+45 | Formation et pilote", "Former la bonne population et lancer le pilote sur un flux concret, avec supervision et revue métier.", theme.navy);
  stepCard(slide, ctx, 912, 236, 296, 248, "04", "J+90 | ROI et extension", "Mesurer les premiers résultats, documenter les apprentissages et décider ce qui mérite d'être étendu.", theme.gold);

  rect(slide, ctx, 72, 520, 1136, 112, theme.navy, { line: ctx.line(theme.navy, 0) });
  text(slide, ctx, "Ce qu'ELTON CI obtient à chaque étape", 96, 542, 250, 16, {
    size: 10,
    color: "#CFE0F0",
    bold: true,
  });
  body(
    slide,
    ctx,
    "• priorités mieux choisies\n• cas d'usage mieux qualifiés\n• formation plus ciblée\n• décision plus simple sur le passage à l'échelle",
    96,
    566,
    260,
    56,
    11.5,
    theme.white,
  );
  body(
    slide,
    ctx,
    "Principe de gouvernance : aucun passage à l'étape suivante sans validation des livrables, des accès et des usages autorisés.",
    414,
    578,
    736,
    28,
    12.5,
    "#D7E5F3",
    { bold: true },
  );

  footer(slide, ctx, 8);
  return slide;
}

export async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Offre recommandée");
  title(slide, ctx, "La proposition TransferAI pour ELTON CI", 72, 86, 840, 84, 34);
  body(
    slide,
    ctx,
    "Notre valeur ne vient pas d'un outil unique, mais de l'enchaînement entre diagnostic, formation utile, gouvernance et premier terrain d'exécution.",
    72,
    176,
    970,
    28,
    14,
    theme.soft,
  );

  offerBrick(slide, ctx, 72, 236, 544, 140, theme.navy, "1. Audit, cadrage et feuille de route", "• priorités métier\n• cartographie des flux\n• KPI de preuve et conditions de pilotage");
  offerBrick(slide, ctx, 640, 236, 568, 140, theme.orange, "2. Formation dirigeants et managers", "• lecture exécutive des usages IA\n• arbitrage, gouvernance et conduite du changement");
  offerBrick(slide, ctx, 72, 400, 544, 140, theme.teal, "3. Formation équipes métier", "• comptes, flotte, relation client, support\n• outils, scripts et routines liés aux vrais cas d'usage");
  offerBrick(slide, ctx, 640, 400, 568, 140, theme.gold, "4. Pilote métier encadré", "• assistant ciblé, tableau de bord ou base interne\n• supervision, mesure et décision d'extension");

  rect(slide, ctx, 72, 576, 1136, 66, theme.panelAlt, { line: ctx.line(theme.line, 1) });
  text(slide, ctx, "Recommandation de départ", 96, 596, 180, 16, {
    size: 10,
    color: theme.orange,
    bold: true,
  });
  body(
    slide,
    ctx,
    "Commencer par deux flux à forte lisibilité de valeur : comptes professionnels + flotte / cartes carburant. Les autres cas d'usage restent dans la feuille de route, mais n'encombrent pas le pilote initial.",
    296,
    592,
    866,
    24,
    12.5,
    theme.ink,
    { bold: true },
  );

  footer(slide, ctx, 9);
  return slide;
}

export async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Confiance et prochaine étape");
  title(slide, ctx, "Proposer un pilote utile, gouverné et mesurable", 72, 86, 900, 84, 34);

  card(slide, ctx, 72, 180, 520, 390, { fill: theme.panel });
  await iconBadge(slide, ctx, "ShieldCheck", 94, 204, theme.teal);
  title(slide, ctx, "Le cadre de confiance à présenter à ELTON CI", 150, 204, 380, 34, 22);
  body(
    slide,
    ctx,
    "• aucune donnée sensible n'est exposée sans règles d'usage, rôles et validation\n• revue humaine avant toute automatisation critique\n• traçabilité des accès et des sorties\n• périmètre pilote strictement défini avant extension\n• formation intégrée aux exigences de confidentialité et de supervision",
    94,
    262,
    448,
    182,
    12.8,
    theme.ink,
  );
  card(slide, ctx, 94, 456, 456, 88, { fill: theme.panelAlt, border: theme.line });
  text(slide, ctx, "Message fort", 114, 474, 100, 16, { size: 10, color: theme.orange, bold: true });
  title(slide, ctx, "Une IA utile, maîtrisée et compatible avec vos exigences de confidentialité.", 114, 496, 392, 30, 18);

  rect(slide, ctx, 640, 180, 568, 390, theme.navy, { line: ctx.line(theme.navy, 0) });
  kicker(slide, ctx, "Prochaine étape", 668, 208, theme.white);
  title(slide, ctx, "Sortie attendue du rendez-vous", 668, 236, 360, 34, 24, theme.white);
  body(
    slide,
    ctx,
    "1. Tenir un atelier expert de 45 minutes\n2. Lancer l'audit IA gratuit\n3. Recevoir une priorisation claire des cas d'usage\n4. Valider un premier pilote et ses KPI",
    668,
    286,
    360,
    128,
    15,
    theme.white,
  );
  card(slide, ctx, 1040, 252, 128, 102, { fill: "#244667", border: "#244667" });
  text(slide, ctx, "45 min", 1058, 276, 92, 28, { size: 24, color: theme.white, bold: true, align: "center", face: ctx.fonts.title });
  body(slide, ctx, "atelier de cadrage", 1058, 308, 92, 24, 10.5, theme.white, { align: "center" });
  card(slide, ctx, 1040, 370, 128, 102, { fill: "#244667", border: "#244667" });
  text(slide, ctx, "J+15", 1058, 394, 92, 28, { size: 24, color: theme.white, bold: true, align: "center", face: ctx.fonts.title });
  body(slide, ctx, "premier livrable", 1058, 426, 92, 24, 10.5, theme.white, { align: "center" });

  card(slide, ctx, 668, 444, 500, 84, { fill: "#244667", border: "#244667" });
  body(
    slide,
    ctx,
    "Formule courte à utiliser : TransferAI aide ELTON CI à identifier les usages les plus utiles, à former les bonnes équipes et à choisir la bonne suite entre pilote, accompagnement et extension.",
    690,
    466,
    456,
    40,
    11.5,
    "#D7E5F3",
  );

  footer(slide, ctx, 10);
  return slide;
}
