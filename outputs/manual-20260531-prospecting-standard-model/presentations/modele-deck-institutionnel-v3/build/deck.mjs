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

const footerLabel = "TransferAI | Hub IA de Nettelecom CI | Modèle deck institutionnel premium";

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
  text(slide, ctx, label, x + 30, y + 44, w - 44, 18, { size: 9.25, color: theme.soft, bold: true });
  text(slide, ctx, note, x + 30, y + 64, w - 44, 20, { size: 8.1, color: theme.soft });
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
  body(slide, ctx, after, x + 22, y + 148, w - 44, h - 164, 11.5, theme.ink);
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
  text(slide, ctx, note, x + 18, y + 82, w - 36, 18, {
    size: 8.1,
    color: valueColor,
    align: "center",
  });
}

function agendaRow(slide, ctx, index, titleText, detail, y, accent, active = false) {
  rect(slide, ctx, 92, y + 4, 36, 36, accent, { geometry: "ellipse", line: ctx.line(accent, 0) });
  text(slide, ctx, String(index).padStart(2, "0"), 92, y + 12, 36, 14, {
    size: 10,
    color: theme.white,
    bold: true,
    align: "center",
  });
  const bgFill = active ? theme.panel : theme.panelAlt;
  card(slide, ctx, 146, y, 470, 48, { fill: bgFill, border: theme.line });
  text(slide, ctx, titleText, 166, y + 10, 188, 16, {
    size: 13,
    color: theme.ink,
    bold: true,
    face: ctx.fonts.title,
  });
  body(slide, ctx, detail, 392, y + 10, 204, 20, 10.5, theme.soft, {
    align: "right",
  });
}

function sectionDivider(slide, ctx, opts) {
  bg(slide, ctx, opts.bgFill ?? theme.bg);
  rect(slide, ctx, 0, 0, 1280, 720, opts.bandFill ?? theme.navy, { line: ctx.line(opts.bandFill ?? theme.navy, 0) });
  rect(slide, ctx, 72, 112, 8, 454, opts.accent ?? theme.orange, { line: ctx.line(opts.accent ?? theme.orange, 0) });
  kicker(slide, ctx, opts.kicker, 104, 122, opts.kickerColor ?? theme.white);
  title(slide, ctx, opts.title, 104, 160, 640, 136, 40, opts.titleColor ?? theme.white);
  body(slide, ctx, opts.copy, 104, 324, 560, 112, 16, opts.copyColor ?? "#D7E5F3");
  card(slide, ctx, 778, 132, 394, 170, { fill: opts.panelFill ?? "#244667", border: opts.panelBorder ?? "#244667" });
  text(slide, ctx, opts.panelLabel, 804, 156, 220, 16, {
    size: 10,
    color: opts.panelLabelColor ?? "#D7E5F3",
    bold: true,
  });
  body(slide, ctx, opts.panelCopy, 804, 182, 342, 88, 13.5, opts.panelCopyColor ?? theme.white, {
    bold: true,
  });
  card(slide, ctx, 778, 336, 394, 178, { fill: opts.quoteFill ?? "#10263F", border: opts.quoteBorder ?? "#2F587F" });
  text(slide, ctx, opts.quoteLabel, 804, 360, 180, 16, {
    size: 10,
    color: opts.quoteLabelColor ?? "#CFE0F0",
    bold: true,
  });
  title(slide, ctx, opts.quoteTitle, 804, 390, 326, 56, 22, opts.quoteTitleColor ?? theme.white);
  body(slide, ctx, opts.quoteCopy, 804, 452, 336, 42, 12, opts.quoteCopyColor ?? "#D7E5F3");
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

  card(slide, ctx, 58, 82, 676, 560, { fill: theme.panel });
  rect(slide, ctx, 774, 82, 448, 560, theme.navy, { line: ctx.line(theme.navy, 0) });
  rect(slide, ctx, 774, 82, 10, 560, theme.teal, { line: ctx.line(theme.teal, 0) });

  kicker(slide, ctx, "Modèle institutionnel | service et gouvernance", 84, 110);
  title(slide, ctx, "Transformer l'IA\nen impact utile et\ngouverné", 84, 148, 560, 154, 42);
  body(
    slide,
    ctx,
    "Une proposition construite à partir du cadre TransferAI, puis traduite dans le contexte du prospect autour de quatre terrains d'impact : qualité de service, coordination, pilotage, diffusion des procédures et renforcement des capacités.",
    84,
    324,
    580,
    82,
    16,
    theme.soft,
  );
  card(slide, ctx, 84, 424, 410, 30, { fill: theme.panelAlt, border: theme.line });
  body(
    slide,
    ctx,
    "TransferAI est le hub IA de Nettelecom CI.",
    100,
    431,
    380,
    16,
    11.5,
    theme.ink,
    { bold: true },
  );
  text(slide, ctx, "Point d'entrée recommandé", 84, 466, 220, 18, {
    size: 10,
    color: theme.orange,
    bold: true,
  });
  body(
    slide,
    ctx,
    "Audit IA gratuit + échange expert de 30 minutes pour qualifier les priorités, les indicateurs de preuve et la bonne séquence de déploiement.",
    84,
    488,
    548,
    46,
    14,
    theme.ink,
    { bold: true },
  );

  statCard(slide, ctx, 84, 540, 138, 100, theme.orange, "J+15", "premier livrable", "lecture claire des gains rapides");
  statCard(slide, ctx, 236, 540, 138, 100, theme.teal, "13", "experts IA", "mobilisés via TransferAI");
  statCard(slide, ctx, 388, 540, 138, 100, theme.navy, "+30 %", "productivité benchmark", "sur des flux répétitifs comparables");
  statCard(slide, ctx, 540, 540, 138, 100, theme.gold, "-45 %", "effort de formation", "benchmark onboarding / diffusion");

  kicker(slide, ctx, "Ce que nous proposons", 812, 122, theme.white);
  title(slide, ctx, "Une offre exécutive,\nmaîtrisée et adaptée\nau cadre institutionnel.", 812, 154, 340, 112, 24, theme.white);
  body(
    slide,
    ctx,
    "• Partir des vrais enjeux de service et de coordination\n• Cadrer des cas d'usage utiles avant tout déploiement\n• Former les bonnes équipes au bon niveau\n• Lancer un pilote avec supervision et mesure des résultats",
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
    "Faire de l'IA un levier de qualité de service, de coordination et de rigueur opérationnelle pour le prospect.",
    834,
    470,
    286,
    52,
    14,
    theme.white,
    { bold: true },
  );
  card(slide, ctx, 812, 546, 330, 86, { fill: "#10263F", border: "#2F587F" });
  body(
    slide,
    ctx,
    "Important : les chiffres de ROI affichés dans ce deck sont des benchmarks de référence TransferAI, à confirmer sur les données du prospect pendant l'audit.",
    832,
    562,
    292,
    54,
    10.5,
    "#D7E5F3",
  );

  footer(slide, ctx, 1);
  return slide;
}

export async function slide01toc(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Sommaire");
  title(slide, ctx, "Le parcours de lecture recommandé pour un deck institutionnel", 72, 86, 920, 84, 34);
  body(
    slide,
    ctx,
    "Le sommaire rassure la direction, structure la lecture en PDF et prépare les deux temps forts du deck : ce que nous avons compris, puis ce que nous recommandons dans un cadre gouverné.",
    72,
    176,
    960,
    48,
    14,
    theme.soft,
  );

  card(slide, ctx, 72, 244, 572, 332, { fill: theme.panel });
  text(slide, ctx, "Chemin de lecture", 96, 268, 160, 16, {
    size: 10,
    color: theme.orange,
    bold: true,
  });
  agendaRow(slide, ctx, 1, "Impact et mission", "ce que l'on cherche à améliorer", 302, theme.orange, true);
  agendaRow(slide, ctx, 2, "Cadre TransferAI", "qui porte l'exécution", 360, theme.teal);
  agendaRow(slide, ctx, 3, "Enjeux de service", "où la valeur devient visible", 418, theme.navy);
  agendaRow(slide, ctx, 4, "Gouvernance et capacités", "ce qu'il faut sécuriser", 476, theme.gold);
  agendaRow(slide, ctx, 5, "Feuille de route", "ce que l'on recommande", 534, theme.orange);

  rect(slide, ctx, 694, 244, 514, 332, theme.navy, { line: ctx.line(theme.navy, 0) });
  kicker(slide, ctx, "Lecture décisionnelle", 724, 272, theme.white);
  title(slide, ctx, "Un deck court,\nmais guidé comme\nun cadre d'action.", 724, 304, 300, 120, 30, theme.white);
  body(
    slide,
    ctx,
    "1. Comprendre les enjeux de service.\n2. Donner des indicateurs de preuve crédibles.\n3. Recommander un premier pilote gouverné.\n4. Finir sur une prochaine étape simple : audit IA + échange expert de 30 minutes.",
    724,
    434,
    306,
    112,
    14,
    "#D7E5F3",
  );
  card(slide, ctx, 1042, 304, 132, 96, { fill: "#244667", border: "#244667" });
  text(slide, ctx, "PDF ready", 1060, 334, 96, 20, {
    size: 18,
    color: theme.white,
    bold: true,
    align: "center",
    face: ctx.fonts.title,
  });
    body(slide, ctx, "lecture rapide direction", 1058, 360, 100, 22, 10.5, theme.white, { align: "center" });
  card(slide, ctx, 1042, 418, 132, 96, { fill: "#244667", border: "#244667" });
  text(slide, ctx, "2 temps", 1060, 448, 96, 20, {
    size: 18,
    color: theme.white,
    bold: true,
    align: "center",
    face: ctx.fonts.title,
  });
    body(slide, ctx, "comprendre puis cadrer", 1052, 474, 112, 26, 10.5, theme.white, { align: "center" });

  footer(slide, ctx, 2);
  return slide;
}

export async function slide01sectionA(presentation, ctx) {
  const slide = presentation.slides.add();
  sectionDivider(slide, ctx, {
    kicker: "Ce que nous avons compris",
    title: "Les slides qui cadrent\nles enjeux de service\navant de parler déploiement.",
    copy: "Cette première partie du deck doit montrer que nous comprenons les priorités institutionnelles, les irritants visibles et les indicateurs de preuve qui feront foi pour la direction.",
    panelLabel: "Cette section doit prouver",
    panelCopy: "Nous ne venons pas avec un catalogue. Nous partons des flux qui coûtent déjà du temps, de la rigueur, de la coordination et de la qualité de service.",
    quoteLabel: "Promesse de lecture",
    quoteTitle: "Comprendre avant de cadrer.",
    quoteCopy: "La crédibilité institutionnelle se joue ici : ancrage local, preuve d'exécution et lecture claire des enjeux de service.",
  });
  footer(slide, ctx, 3);
  return slide;
}

export async function slide02brand(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Qui sommes-nous");
  title(slide, ctx, "TransferAI, le hub IA de Nettelecom CI", 72, 86, 860, 84, 34);
  body(
    slide,
    ctx,
    "La crédibilité de l'offre dépend d'un point simple : qui porte l'exécution, avec quelle profondeur d'expertise et dans quel cadre de confiance.",
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
  title(slide, ctx, "La plateforme\nd'exécution IA de\nNettelecom CI", 98, 286, 290, 132, 28, theme.white);
  body(
    slide,
    ctx,
    "TransferAI relie stratégie, formation, gouvernance et déploiement progressif pour transformer l'IA en résultats utiles.",
    98,
    426,
    286,
    60,
    13.5,
    "#D7E5F3",
  );
  card(slide, ctx, 98, 510, 290, 46, { fill: "#244667", border: "#244667" });
  body(
    slide,
    ctx,
    "Un partenaire structuré pour cadrer, former et déployer.",
    114,
    522,
    258,
    24,
    11,
    theme.white,
    { bold: true },
  );

  card(slide, ctx, 534, 228, 300, 148, { fill: theme.panel });
  await iconBadge(slide, ctx, "Users", 556, 250, theme.orange);
  title(slide, ctx, "13 experts mobilisables", 612, 250, 200, 28, 20);
  body(
    slide,
    ctx,
    "Une équipe mobilisable sur le diagnostic, la formation, la gouvernance et les premiers déploiements.",
    556,
    300,
    236,
    54,
    12.5,
    theme.ink,
  );

  card(slide, ctx, 856, 228, 352, 148, { fill: theme.panel });
  await iconBadge(slide, ctx, "Building2", 878, 250, theme.teal);
  title(slide, ctx, "Expertises multi-secteurs", 934, 250, 230, 28, 20);
  body(
    slide,
    ctx,
    "Des expertises capables d'adapter les usages IA aux réalités opérationnelles de chaque organisation.",
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
    "Nous ne présentons pas seulement l'IA : nous cadrons, priorisons, formons et transformons un besoin flou en trajectoire lisible.",
    556,
    470,
    236,
    56,
    12.5,
    theme.ink,
  );

  card(slide, ctx, 856, 398, 352, 148, { fill: theme.panel });
  await iconBadge(slide, ctx, "ShieldCheck", 878, 420, theme.gold);
  title(slide, ctx, "Cadre de confiance", 934, 420, 220, 28, 20);
  body(
    slide,
    ctx,
    "Une approche sérieuse de la confidentialité, des accès, de la supervision et du passage du pilote à l'échelle.",
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
    "Avant de parler ROI, le prospect doit voir une structure crédible, locale, encadrée et capable d'exécuter.",
    332,
    607,
    838,
    18,
    11.5,
    theme.ink,
    { bold: true },
  );

  footer(slide, ctx, 4);
  return slide;
}

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Enjeux transversaux");
  title(slide, ctx, "Pourquoi cette proposition peut parler à toute organisation", 72, 86, 980, 84, 34);
  body(
    slide,
    ctx,
    "L'objectif n'est pas d'ajouter un outil de plus. Il s'agit de mieux piloter, mieux coordonner et mieux exploiter l'information utile là où l'exécution ralentit.",
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
    titleText: "Coordination et suivi",
    before: "L'information utile circule mal entre les équipes, les validations et les points de contact.",
    after: "Décisions plus lisibles, suivi plus régulier et moins de perte entre acteurs.",
  });
  await useCaseCard(slide, ctx, {
    x: 362, y: 248, w: 270, h: 180,
    icon: "Fuel", accent: theme.teal,
    titleText: "Pilotage et reporting",
    before: "Les données existent, mais restent longues à consolider, commenter et exploiter.",
    after: "Synthèses plus rapides, alertes plus simples et meilleure lecture des priorités.",
  });
  await useCaseCard(slide, ctx, {
    x: 652, y: 248, w: 270, h: 180,
    icon: "Wrench", accent: theme.navy,
    titleText: "Qualité de service",
    before: "Réponses variables, délais inégaux et continuité de service difficile à tenir.",
    after: "Réponses plus homogènes, délais mieux suivis et expérience mieux maîtrisée.",
  });
  await useCaseCard(slide, ctx, {
    x: 942, y: 248, w: 266, h: 180,
    icon: "BookOpen", accent: theme.gold,
    titleText: "Procédures et connaissances",
    before: "Les standards existent, mais restent dispersés dans les documents et les équipes.",
    after: "Accès plus rapide aux bonnes pratiques, onboarding plus fluide et exécution plus cohérente.",
  });

  rect(slide, ctx, 72, 466, 1136, 136, theme.navy, { line: ctx.line(theme.navy, 0) });
  text(slide, ctx, "Le bon angle commercial", 98, 492, 180, 16, {
    size: 10,
    color: "#CFE0F0",
    bold: true,
  });
  title(slide, ctx, "Partir des points de friction qui ralentissent déjà l'exécution.", 98, 520, 580, 62, 26, theme.white);
  body(
    slide,
    ctx,
    "TransferAI ne vend pas un catalogue. TransferAI part des flux où le temps, la coordination et la qualité de service se dégradent déjà.",
    680,
    512,
    500,
    56,
    13.5,
    "#D7E5F3",
  );

  footer(slide, ctx, 5);
  return slide;
}

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  rect(slide, ctx, 0, 0, 1280, 118, theme.navy, { line: ctx.line(theme.navy, 0) });
  kicker(slide, ctx, "ROI de référence", 72, 52, theme.white);
  title(slide, ctx, "Le ROI devient crédible quand il est instrumenté", 72, 76, 920, 34, 28, theme.white);

  metricCard(slide, ctx, 72, 148, 264, 116, theme.teal, "+30 %", "productivité benchmark", "flux répétitifs et préparation");
  metricCard(slide, ctx, 356, 148, 264, 116, theme.navy, "-45 %", "effort de formation", "onboarding et diffusion interne");
  metricCard(slide, ctx, 640, 148, 264, 116, theme.orange, "J+15", "premier livrable", "audit, cadrage et priorisation");
  metricCard(slide, ctx, 924, 148, 284, 116, theme.gold, "3,2x", "potentiel de ROI", "références TransferAI comparables");

  kpiRow(
    slide,
    ctx,
    310,
    theme.orange,
    "Productivité et délai",
    "Réduire le temps passé sur la préparation, la consolidation et la circulation de l'information.",
    "temps de traitement, temps de préparation, délai de réponse",
  );
  kpiRow(
    slide,
    ctx,
    392,
    theme.teal,
    "Qualité de service",
    "Rendre les réponses plus cohérentes, mieux tracées et plus faciles à superviser.",
    "qualité perçue, taux de réouverture, délai de clôture",
  );
  kpiRow(
    slide,
    ctx,
    474,
    theme.navy,
    "Capitalisation et adoption",
    "Accélérer l'accès aux procédures, l'onboarding et l'appropriation des nouveaux usages.",
    "temps d'onboarding, temps de recherche, taux d'usage",
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
    "Les chiffres ci-dessus servent de repères. Les gains réels seront calibrés à partir des volumes, des processus et des données du prospect.",
    188,
    598,
    980,
    18,
    11.5,
    theme.ink,
  );

  footer(slide, ctx, 6);
  return slide;
}

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Cas d'usage prioritaires");
  title(slide, ctx, "Les 4 familles de cas d'usage à prioriser", 72, 86, 900, 84, 34);
  body(
    slide,
    ctx,
    "Le deck doit montrer des familles d'usages adaptables, pas des scénarios déjà figés pour le prospect.",
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
    titleText: "1. Relation usagers / clients",
    before: "Demandes récurrentes, réponses hétérogènes et historique peu exploité.",
    after: "Réponses assistées, suivi continu et meilleure qualité de service.",
  });
  await useCaseCard(slide, ctx, {
    x: 640, y: 228, w: 568, h: 172,
    icon: "Fuel", accent: theme.teal,
    titleText: "2. Back-office et reporting",
    before: "Consolidations, contrôles et synthèses encore très manuels.",
    after: "Préparation plus rapide, reporting mieux structuré et alertes utiles.",
  });
  await useCaseCard(slide, ctx, {
    x: 72, y: 424, w: 540, h: 172,
    icon: "MessageSquareText", accent: theme.navy,
    titleText: "3. Procédures et knowledge base",
    before: "Standards dispersés, transmission lente et onboarding fragile.",
    after: "Référentiel plus accessible, exécution plus homogène et transfert plus fiable.",
  });
  await useCaseCard(slide, ctx, {
    x: 640, y: 424, w: 568, h: 172,
    icon: "BookOpen", accent: theme.gold,
    titleText: "4. Aide à la décision",
    before: "Décisions prises avec une lecture partielle ou tardive des données utiles.",
    after: "Synthèses plus lisibles, signaux utiles et arbitrages mieux préparés.",
  });

  footer(slide, ctx, 7);
  return slide;
}

export async function slide04sectionB(presentation, ctx) {
  const slide = presentation.slides.add();
  sectionDivider(slide, ctx, {
    kicker: "Ce que nous recommandons",
    title: "Transformer les enjeux\nen feuille de route\ngouvernée.",
    copy: "À partir des priorités repérées, le deck doit montrer comment TransferAI cadre, forme, pilote et mesure sans brûler les étapes.",
    panelLabel: "Ce que le prospect doit retenir",
    panelCopy: "TransferAI aide à choisir un point de départ, à cadrer le pilote, à former les bonnes équipes et à mesurer si l'extension est justifiée.",
    quoteLabel: "Fil conducteur",
    quoteTitle: "Recommander sans surpromettre.",
    quoteCopy: "Un pilote utile, encadré et lisible vaut mieux qu'un grand plan trop large dès le départ.",
    accent: theme.teal,
  });
  footer(slide, ctx, 8);
  return slide;
}

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Détail des cas d'usage");
  title(slide, ctx, "Deux portes d'entrée qui rendent la valeur vite visible", 72, 86, 980, 84, 34);
  body(
    slide,
    ctx,
    "Pour un premier pilote, mieux vaut démarrer par des usages simples à démontrer pour la direction et utiles aux équipes.",
    72,
    176,
    920,
    28,
    14,
    theme.soft,
  );

  card(slide, ctx, 72, 228, 540, 326, { fill: theme.panel });
  await iconBadge(slide, ctx, "Briefcase", 94, 248, theme.orange);
  title(slide, ctx, "Productivité interne et reporting", 150, 248, 410, 34, 22);
  text(slide, ctx, "AVANT", 94, 300, 70, 16, { size: 10, color: theme.orange, bold: true });
  body(slide, ctx, "• préparations manuelles\n• synthèses longues à produire\n• informations dispersées entre supports", 94, 324, 470, 74, 12.5, theme.soft);
  text(slide, ctx, "APRÈS", 94, 418, 70, 16, { size: 10, color: theme.teal, bold: true });
  body(slide, ctx, "• brouillons assistés\n• synthèses pré-structurées\n• lecture plus rapide des points critiques", 94, 442, 470, 74, 12.5, theme.ink);
  card(slide, ctx, 94, 514, 490, 40, { fill: theme.panelAlt, border: theme.line });
  body(slide, ctx, "KPI : temps de préparation | temps de consolidation | délai de production", 110, 526, 456, 16, 11.5, theme.ink, { bold: true });

  card(slide, ctx, 640, 228, 568, 326, { fill: theme.panel });
  await iconBadge(slide, ctx, "MessageSquareText", 662, 248, theme.teal);
  title(slide, ctx, "Qualité de service et coordination", 718, 248, 420, 34, 22);
  text(slide, ctx, "AVANT", 662, 300, 70, 16, { size: 10, color: theme.orange, bold: true });
  body(slide, ctx, "• réponses inégales\n• suivi difficile à tracer\n• dépendance aux personnes clés", 662, 324, 498, 74, 12.5, theme.soft);
  text(slide, ctx, "APRÈS", 662, 418, 70, 16, { size: 10, color: theme.teal, bold: true });
  body(slide, ctx, "• canevas de réponse\n• suivi plus homogène\n• continuité de service renforcée", 662, 442, 498, 74, 12.5, theme.ink);
  card(slide, ctx, 662, 514, 498, 40, { fill: theme.panelAlt, border: theme.line });
  body(slide, ctx, "KPI : délai de réponse | qualité perçue | taux de réouverture", 678, 526, 466, 16, 11.5, theme.ink, { bold: true });

  rect(slide, ctx, 72, 590, 1136, 54, theme.navy, { line: ctx.line(theme.navy, 0) });
  body(
    slide,
    ctx,
    "Ces deux portes d'entrée parlent à la direction comme aux équipes : elles permettent de démontrer vite une valeur utile sans enfermer le pilote dans un secteur précis.",
    96,
    606,
    1088,
    20,
    12.5,
    theme.white,
  );

  footer(slide, ctx, 9);
  return slide;
}

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Détail des cas d'usage");
  title(slide, ctx, "Deux familles d'usages qui sécurisent l'adoption", 72, 86, 980, 84, 34);
  body(
    slide,
    ctx,
    "Ces usages rendent l'IA visible dans le quotidien tout en renforçant les standards internes.",
    72,
    176,
    960,
    28,
    14,
    theme.soft,
  );

  card(slide, ctx, 72, 228, 540, 308, { fill: theme.panel });
  await iconBadge(slide, ctx, "MessageSquareText", 94, 248, theme.navy);
  title(slide, ctx, "Support et relation usagers / clients", 150, 248, 390, 34, 20);
  text(slide, ctx, "Usages proposés", 94, 300, 120, 16, { size: 10, color: theme.orange, bold: true });
  body(
    slide,
    ctx,
    "• réponses assistées sur questions récurrentes\n• canevas de réponse ou de rappel\n• historique mieux exploitable\n• synthèses rapides avant traitement",
    94,
    324,
    456,
    90,
    12.5,
    theme.ink,
  );
  card(slide, ctx, 94, 432, 490, 84, { fill: theme.panelAlt, border: theme.line });
  body(slide, ctx, "KPI : délai de réponse | qualité perçue | taux de réouverture | homogénéité des scripts", 112, 458, 450, 36, 11.5, theme.ink, { bold: true });

  card(slide, ctx, 640, 228, 568, 308, { fill: theme.panel });
  await iconBadge(slide, ctx, "BookOpen", 662, 248, theme.gold);
  title(slide, ctx, "Procédures, knowledge base et onboarding", 718, 248, 432, 34, 20);
  text(slide, ctx, "Usages proposés", 662, 300, 120, 16, { size: 10, color: theme.orange, bold: true });
  body(
    slide,
    ctx,
    "• base de procédures consultable rapidement\n• réponses homogènes pour les équipes support et métier\n• onboarding accéléré sur les standards et points de contrôle\n• diffusion plus simple des mises à jour internes",
    662,
    324,
    490,
    90,
    12.5,
    theme.ink,
  );
  card(slide, ctx, 662, 432, 498, 84, { fill: theme.panelAlt, border: theme.line });
  body(slide, ctx, "KPI : temps de recherche | temps d'onboarding | taux d'usage de la base interne", 680, 458, 460, 36, 11.5, theme.ink, { bold: true });

  rect(slide, ctx, 72, 566, 1136, 88, theme.teal, { line: ctx.line(theme.teal, 0) });
  text(slide, ctx, "Pourquoi cette slide compte", 96, 586, 170, 16, {
    size: 10,
    color: "#DDF5EF",
    bold: true,
  });
  title(slide, ctx, "L'adoption devient crédible quand elle prépare des usages visibles.", 96, 604, 560, 34, 18, theme.white);
  body(
    slide,
    ctx,
    "Les équipes comprennent tout de suite sur quels gestes concrets l'IA doit les aider.",
    700,
    602,
    470,
    26,
    12.5,
    theme.white,
  );

  footer(slide, ctx, 10);
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
  text(slide, ctx, "Ce que l'organisation obtient à chaque étape", 96, 542, 290, 16, {
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

  footer(slide, ctx, 11);
  return slide;
}

export async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Offre recommandée");
  title(slide, ctx, "La proposition TransferAI pour votre organisation", 72, 86, 840, 84, 34);
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

  footer(slide, ctx, 12);
  return slide;
}

export async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Confiance et prochaine étape");
  title(slide, ctx, "Ouvrir sur un pilote utile, gouverné et mesurable", 72, 86, 920, 84, 34);

  card(slide, ctx, 72, 180, 520, 390, { fill: theme.panel });
  await iconBadge(slide, ctx, "ShieldCheck", 94, 204, theme.teal);
  title(slide, ctx, "Le cadre de confiance à présenter au prospect", 150, 204, 380, 34, 22);
  body(
    slide,
    ctx,
    "• règles d'usage, rôles et validation avant exposition de données sensibles\n• revue humaine avant toute automatisation critique\n• traçabilité des accès et des sorties\n• périmètre pilote défini avant extension\n• formation intégrée aux exigences de supervision",
    94,
    276,
    448,
    182,
    12.8,
    theme.ink,
  );
  card(slide, ctx, 94, 456, 456, 88, { fill: theme.panelAlt, border: theme.line });
  text(slide, ctx, "Message fort", 114, 474, 100, 16, { size: 10, color: theme.orange, bold: true });
  title(slide, ctx, "Une IA utile, maîtrisée et compatible avec vos exigences de confidentialité.", 114, 496, 392, 40, 17);

  rect(slide, ctx, 640, 180, 568, 390, theme.navy, { line: ctx.line(theme.navy, 0) });
  kicker(slide, ctx, "Prochaine étape", 668, 208, theme.white);
  title(slide, ctx, "Sortie attendue du rendez-vous", 668, 236, 360, 34, 24, theme.white);
  body(
    slide,
    ctx,
    "1. Qualifier les priorités et les irritants\n2. Choisir le bon point d'entrée\n3. Cadrer l'audit, le pilote ou la formation",
    668,
    300,
    360,
    110,
    15,
    theme.white,
  );
  card(slide, ctx, 1040, 252, 128, 102, { fill: "#244667", border: "#244667" });
  text(slide, ctx, "30 min", 1058, 276, 92, 28, { size: 24, color: theme.white, bold: true, align: "center", face: ctx.fonts.title });
  body(slide, ctx, "échange expert", 1058, 308, 92, 24, 10.5, theme.white, { align: "center" });
  card(slide, ctx, 1040, 370, 128, 102, { fill: "#244667", border: "#244667" });
  text(slide, ctx, "J+15", 1058, 394, 92, 28, { size: 24, color: theme.white, bold: true, align: "center", face: ctx.fonts.title });
  body(slide, ctx, "premier livrable", 1058, 426, 92, 24, 10.5, theme.white, { align: "center" });

  card(slide, ctx, 668, 444, 500, 84, { fill: "#244667", border: "#244667" });
  body(
    slide,
    ctx,
    "TransferAI aide votre organisation à identifier les usages utiles, former les bonnes équipes et choisir la bonne suite. Point d'entrée : transferai.ci",
    690,
    470,
    456,
    34,
    11.5,
    "#D7E5F3",
  );

  footer(slide, ctx, 13);
  return slide;
}
