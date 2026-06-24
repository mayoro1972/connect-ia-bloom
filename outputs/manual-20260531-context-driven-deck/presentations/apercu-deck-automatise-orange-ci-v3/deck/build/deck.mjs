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

const footerLabel = "TransferAI | Hub IA de Nettelecom CI | Aperçu deck automatisé depuis Assemble Prospect Context";

const samplePack = {
  organization_name: "Orange Côte d'Ivoire",
  organization_type: "Entreprise de télécommunications",
  sector_guess: "Télécommunications",
  organization_summary:
    "Orange Côte d'Ivoire opère des flux à fort volume où la qualité de réponse, la coordination entre canaux et la diffusion des procédures impactent directement l'expérience client et l'efficacité opérationnelle.",
  probable_needs: [
    "Mieux traiter les demandes récurrentes sur plusieurs canaux",
    "Réduire le temps de préparation des synthèses de pilotage",
    "Rendre les procédures plus accessibles aux équipes front et support",
    "Mieux instrumenter la qualité de service et les délais de traitement",
  ],
  single_primary_cta: "Planifier un audit IA gratuit suivi d'un échange de 30 minutes",
  deck_brief: {
    deck_profile: "commercial_enterprise",
    slide_objective: "Transformer l'IA en gains visibles pour Orange Côte d'Ivoire",
    key_messages: [
      "Partir des flux client à fort volume plutôt que d'un catalogue de solutions",
      "Créer rapidement des gains visibles pour la direction et les équipes front",
      "Structurer un premier pilote simple, mesurable et gouverné",
      "Former les équipes sur les cas d'usage réellement utiles au quotidien",
    ],
    sector_pain_points: [
      "demandes clients répétitives réparties sur plusieurs canaux",
      "temps élevé de préparation des synthèses de pilotage",
      "procédures et scripts dispersés entre équipes",
      "visibilité incomplète sur la qualité de service et les SLA",
    ],
    recommended_case_study: [
      {
        title: "Copilote service client multicanal",
        before: "Demandes récurrentes réparties entre plusieurs canaux avec réponses hétérogènes.",
        after: "Copilote de réponse, résumés d'interactions et meilleure continuité de traitement.",
        kpi: "délai moyen de réponse | taux de résolution au premier contact",
        icon: "MessageSquareText",
        accent: "orange",
      },
      {
        title: "Synthèse tickets et incidents",
        before: "Analyse manuelle des tickets et reporting lent pour les managers.",
        after: "Synthèses automatiques, regroupement des motifs récurrents et alertes plus lisibles.",
        kpi: "temps de préparation du reporting | délai d'escalade",
        icon: "ShieldAlert",
        accent: "teal",
      },
      {
        title: "Base procédures et scripts terrain",
        before: "Réponses et procédures dispersées selon les équipes et les documents.",
        after: "Base de connaissances assistée pour scripts, contrôles et bonnes réponses.",
        kpi: "temps de recherche d'information | temps d'onboarding",
        icon: "BookOpen",
        accent: "navy",
      },
      {
        title: "Commentaire IA du pilotage qualité",
        before: "Les indicateurs existent mais sont peu commentés et difficiles à exploiter rapidement.",
        after: "Commentaires automatiques des écarts, synthèses managers et meilleurs arbitrages.",
        kpi: "temps de lecture des KPI | réactivité de pilotage",
        icon: "BarChart3",
        accent: "gold",
      },
    ],
    roi_hypothesis: [
      { value: "-35 %", label: "temps de réponse", note: "sur demandes récurrentes et qualification simple" },
      { value: "-50 %", label: "temps de reporting", note: "sur synthèses service client et incidents" },
      { value: "J+15", label: "premier livrable", note: "assistant ou synthèse managériale pilote" },
      { value: "+20 %", label: "cohérence des réponses", note: "benchmark à confirmer sur pilote ciblé" },
    ],
    delivery_timeline: [
      "J+0 Audit et cadrage des flux service client et pilotage",
      "J+15 Premier copilote ou première synthèse automatisée",
      "J+45 Formation ciblée et lancement du pilote",
      "J+90 Mesure des résultats et décision d'extension",
    ],
    training_focus: [
      "usage quotidien du copilote de réponse",
      "lecture et validation des synthèses IA",
      "gouvernance des réponses et supervision humaine",
      "mise à jour des scripts et procédures",
    ],
    support_90_days: [
      "points de suivi d'usage et de pilotage",
      "revue de cas réels et blocages terrain",
      "ajustement des prompts, scripts et procédures",
      "lecture des premiers KPI et arbitrage d'extension",
    ],
  },
};

const accentMap = {
  orange: theme.orange,
  teal: theme.teal,
  navy: theme.navy,
  gold: theme.gold,
};

function useCase(index) {
  return samplePack.deck_brief.recommended_case_study[index] || samplePack.deck_brief.recommended_case_study[0];
}

function roi(index) {
  return samplePack.deck_brief.roi_hypothesis[index] || samplePack.deck_brief.roi_hypothesis[0];
}

function lines(items, prefix = "• ") {
  return items.map((item) => `${prefix}${item}`).join("\n");
}

function sentence(value) {
  if (!value) return "";
  const trimmed = String(value).trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

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

  const roi0 = roi(0);
  const roi1 = roi(1);
  const roi2 = roi(2);
  const roi3 = roi(3);

  card(slide, ctx, 58, 82, 676, 560, { fill: theme.panel });
  rect(slide, ctx, 774, 82, 448, 560, theme.navy, { line: ctx.line(theme.navy, 0) });
  rect(slide, ctx, 774, 82, 10, 560, theme.teal, { line: ctx.line(theme.teal, 0) });

  kicker(slide, ctx, `${samplePack.deck_brief.deck_profile === "commercial_enterprise" ? "Deck automatisé | entreprise" : "Deck automatisé | institution"} | ${samplePack.sector_guess}`, 84, 110);
  title(slide, ctx, `Transformer l'IA\nen gains visibles\npour ${samplePack.organization_name}`, 84, 148, 560, 154, 39);
  body(
    slide,
    ctx,
    samplePack.organization_summary,
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
    `TransferAI est le hub IA de Nettelecom CI. Ce preview montre comment le deck se nourrit des données agrégées dans "Assemble Prospect Context".`,
    100,
    428,
    388,
    20,
    10.5,
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
    samplePack.single_primary_cta,
    84,
    488,
    548,
    46,
    14,
    theme.ink,
    { bold: true },
  );

  statCard(slide, ctx, 84, 540, 138, 100, theme.orange, roi2.value, roi2.label, roi2.note);
  statCard(slide, ctx, 236, 540, 138, 100, theme.teal, "13", "experts IA", "mobilisés via TransferAI");
  statCard(slide, ctx, 388, 540, 138, 100, theme.navy, roi0.value, roi0.label, roi0.note);
  statCard(slide, ctx, 540, 540, 138, 100, theme.gold, roi1.value, roi1.label, roi1.note);

  kicker(slide, ctx, "Ce que nous proposons", 812, 122, theme.white);
  title(slide, ctx, "Une lecture prospect,\nmétier et mesurable.", 812, 154, 340, 84, 28, theme.white);
  body(
    slide,
    ctx,
    lines(samplePack.deck_brief.key_messages),
    812,
    276,
    338,
    144,
    14,
    theme.darkSoft,
  );
  card(slide, ctx, 812, 430, 330, 102, { fill: "#244667", border: "#244667" });
  text(slide, ctx, "Promesse", 834, 448, 90, 16, { size: 9.5, color: "#D7E5F3", bold: true });
  body(
    slide,
    ctx,
    sentence(samplePack.deck_brief.slide_objective),
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
  title(slide, ctx, `Le parcours de lecture recommandé pour un deck automatisé ${samplePack.sector_guess.toLowerCase()}`, 72, 86, 980, 84, 34);
  body(
    slide,
    ctx,
    `Le sommaire rassure la direction, structure la lecture en PDF et prépare les deux temps forts du deck : ce que nous avons compris chez ${samplePack.organization_name}, puis ce que nous recommandons à partir des signaux collectés.`,
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
  agendaRow(slide, ctx, 1, "Contexte et promesse", "ce que l'on cherche à débloquer", 302, theme.orange, true);
  agendaRow(slide, ctx, 2, "Crédibilité TransferAI", "qui porte l'exécution", 360, theme.teal);
  agendaRow(slide, ctx, 3, "Priorités métier et ROI", "où la valeur devient visible", 418, theme.navy);
  agendaRow(slide, ctx, 4, "Cas d'usage prioritaires", "ce qu'il faut mesurer", 476, theme.gold);
  agendaRow(slide, ctx, 5, "Parcours et prochaine étape", "ce que l'on recommande", 534, theme.orange);

  rect(slide, ctx, 694, 244, 514, 332, theme.navy, { line: ctx.line(theme.navy, 0) });
  kicker(slide, ctx, "Lecture décisionnelle", 724, 272, theme.white);
  title(slide, ctx, "Un deck court,\nmais guidé comme\nune décision.", 724, 304, 300, 120, 30, theme.white);
  body(
    slide,
    ctx,
    "1. Comprendre les irritants métier.\n2. Donner un benchmark ROI crédible.\n3. Recommander un premier pilote mesurable.\n4. Finir sur une prochaine étape simple : audit IA + échange expert de 30 minutes.",
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
  body(slide, ctx, "lecture rapide DG", 1058, 360, 100, 22, 10.5, theme.white, { align: "center" });
  card(slide, ctx, 1042, 418, 132, 96, { fill: "#244667", border: "#244667" });
  text(slide, ctx, "2 temps", 1060, 448, 96, 20, {
    size: 18,
    color: theme.white,
    bold: true,
    align: "center",
    face: ctx.fonts.title,
  });
  body(slide, ctx, "comprendre puis recommander", 1052, 474, 112, 26, 10.5, theme.white, { align: "center" });

  footer(slide, ctx, 2);
  return slide;
}

export async function slide01sectionA(presentation, ctx) {
  const slide = presentation.slides.add();
  sectionDivider(slide, ctx, {
    kicker: "Ce que nous avons compris",
    title: "Les slides qui cadrent\nles enjeux business\navant de parler solution.",
    copy: "Cette première partie du deck doit montrer que nous comprenons les priorités métier, les irritants business visibles et les KPI qui feront foi pour la direction.",
    panelLabel: "Cette section doit prouver",
    panelCopy: "Nous ne venons pas avec un catalogue. Nous partons des flux qui coûtent déjà du temps, de la rigueur et de la qualité de service.",
    quoteLabel: "Promesse de lecture",
    quoteTitle: "Comprendre avant de recommander.",
    quoteCopy: "La crédibilité commerciale se joue ici : ancrage local, preuve d'exécution et lecture métier nette.",
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
  title(slide, ctx, "Le hub IA\nopérationnel de\nNettelecom CI", 98, 286, 270, 132, 30, theme.white);
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
    "Pour le prospect : un interlocuteur IA structuré, pas un simple catalogue.",
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
    "Avant de parler ROI et cas d'usage, le prospect doit voir que TransferAI est une entité crédible, portée par Nettelecom CI et soutenue par 13 experts IA.",
    310,
    606,
    860,
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

  const case0 = useCase(0);
  const case1 = useCase(1);
  const case2 = useCase(2);
  const case3 = useCase(3);

  kicker(slide, ctx, "Contexte prospect");
  title(slide, ctx, `Pourquoi cette proposition est adaptée au contexte de ${samplePack.organization_name}`, 72, 86, 980, 84, 34);
  body(
    slide,
    ctx,
    `L'objectif n'est pas d'ajouter un outil de plus. Il s'agit de mieux piloter, mieux coordonner et mieux diffuser l'information utile dans des flux ${samplePack.sector_guess.toLowerCase()} qui coûtent déjà du temps, de la discipline et de la qualité de service.`,
    72,
    176,
    950,
    48,
    14,
    theme.soft,
  );

  await useCaseCard(slide, ctx, {
    x: 72, y: 248, w: 270, h: 180,
    icon: case0.icon, accent: accentMap[case0.accent],
    titleText: case0.title,
    before: case0.before,
    after: case0.after,
  });
  await useCaseCard(slide, ctx, {
    x: 362, y: 248, w: 270, h: 180,
    icon: case1.icon, accent: accentMap[case1.accent],
    titleText: case1.title,
    before: case1.before,
    after: case1.after,
  });
  await useCaseCard(slide, ctx, {
    x: 652, y: 248, w: 270, h: 180,
    icon: case2.icon, accent: accentMap[case2.accent],
    titleText: case2.title,
    before: case2.before,
    after: case2.after,
  });
  await useCaseCard(slide, ctx, {
    x: 942, y: 248, w: 266, h: 180,
    icon: case3.icon, accent: accentMap[case3.accent],
    titleText: case3.title,
    before: case3.before,
    after: case3.after,
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
    `La crédibilité ne viendra pas d'un catalogue. Elle viendra d'une proposition qui relie ${samplePack.probable_needs.slice(0, 2).join(" et ")}, puis les convertit en cas d'usage, gouvernance, formation ciblée et premiers gains visibles.`,
    680,
    506,
    500,
    72,
    13,
    "#D7E5F3",
  );

  footer(slide, ctx, 5);
  return slide;
}

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  const case0 = useCase(0);
  const case1 = useCase(1);
  const case2 = useCase(2);
  const roi0 = roi(0);
  const roi1 = roi(1);
  const roi2 = roi(2);
  const roi3 = roi(3);

  rect(slide, ctx, 0, 0, 1280, 118, theme.navy, { line: ctx.line(theme.navy, 0) });
  kicker(slide, ctx, "ROI de référence", 72, 52, theme.white);
  title(slide, ctx, `Le ROI devient utile seulement s'il est traduit dans le contexte de ${samplePack.organization_name}`, 72, 76, 1090, 34, 28, theme.white);

  metricCard(slide, ctx, 72, 148, 264, 116, theme.teal, roi0.value, roi0.label, roi0.note);
  metricCard(slide, ctx, 356, 148, 264, 116, theme.navy, roi1.value, roi1.label, roi1.note);
  metricCard(slide, ctx, 640, 148, 264, 116, theme.orange, roi2.value, roi2.label, roi2.note);
  metricCard(slide, ctx, 924, 148, 284, 116, theme.gold, roi3.value, roi3.label, roi3.note);

  kpiRow(
    slide,
    ctx,
    310,
    theme.orange,
    case0.title,
    case0.after,
    case0.kpi,
  );
  kpiRow(
    slide,
    ctx,
    392,
    theme.teal,
    case1.title,
    case1.after,
    case1.kpi,
  );
  kpiRow(
    slide,
    ctx,
    474,
    theme.navy,
    case2.title,
    case2.after,
    case2.kpi,
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
    "Les chiffres affichés ci-dessus sont un référentiel ROI TransferAI sur des déploiements comparables. Les gains réels seront calibrés sur les volumes, les processus et les données du prospect pendant l'audit initial.",
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

  const case0 = useCase(0);
  const case1 = useCase(1);
  const case2 = useCase(2);
  const case3 = useCase(3);

  kicker(slide, ctx, "Cas d'usage prioritaires");
  title(slide, ctx, `Les 4 cas d'usage à mettre au centre de la proposition pour ${samplePack.organization_name}`, 72, 86, 1060, 84, 34);
  body(
    slide,
    ctx,
    `Chaque cas d'usage est alimenté ici par le contexte prospect, puis présenté comme un flux métier visible avec un avant, un après et des KPI de validation.`,
    72,
    176,
    920,
    28,
    14,
    theme.soft,
  );

  await useCaseCard(slide, ctx, {
    x: 72, y: 228, w: 540, h: 172,
    icon: case0.icon, accent: accentMap[case0.accent],
    titleText: `1. ${case0.title}`,
    before: case0.before,
    after: case0.after,
  });
  await useCaseCard(slide, ctx, {
    x: 640, y: 228, w: 568, h: 172,
    icon: case1.icon, accent: accentMap[case1.accent],
    titleText: `2. ${case1.title}`,
    before: case1.before,
    after: case1.after,
  });
  await useCaseCard(slide, ctx, {
    x: 72, y: 424, w: 540, h: 172,
    icon: case2.icon, accent: accentMap[case2.accent],
    titleText: `3. ${case2.title}`,
    before: case2.before,
    after: case2.after,
  });
  await useCaseCard(slide, ctx, {
    x: 640, y: 424, w: 568, h: 172,
    icon: case3.icon, accent: accentMap[case3.accent],
    titleText: `4. ${case3.title}`,
    before: case3.before,
    after: case3.after,
  });

  footer(slide, ctx, 7);
  return slide;
}

export async function slide04sectionB(presentation, ctx) {
  const slide = presentation.slides.add();
  sectionDivider(slide, ctx, {
    kicker: "Ce que nous recommandons",
    title: "Les slides qui transforment\nles irritants en valeur\nmesurable.",
    copy: "Cette deuxième partie du deck convertit les cas d'usage en feuille de route, en gouvernance et en prochaine étape commerciale simple.",
    panelLabel: "Ce que le prospect doit retenir",
    panelCopy: "TransferAI aide à choisir un premier terrain, à cadrer le pilote, à former les bonnes équipes et à mesurer si l'extension est justifiée.",
    quoteLabel: "Fil conducteur",
    quoteTitle: "Recommander sans surpromettre.",
    quoteCopy: "Un pilote utile, encadré et lisible vaut mieux qu'un grand plan flou ou trop large dès le départ.",
    accent: theme.teal,
  });
  footer(slide, ctx, 8);
  return slide;
}

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  const case0 = useCase(0);
  const case1 = useCase(1);

  kicker(slide, ctx, "Détail des cas d'usage");
  title(slide, ctx, "Les deux premiers terrains à lancer rapidement", 72, 86, 840, 84, 34);
  body(
    slide,
    ctx,
    `Nous recommandons de démarrer par deux flux où la valeur est plus facile à rendre visible pour la direction : ${case0.title.toLowerCase()} et ${case1.title.toLowerCase()}.`,
    72,
    176,
    920,
    28,
    14,
    theme.soft,
  );

  card(slide, ctx, 72, 228, 540, 326, { fill: theme.panel });
  await iconBadge(slide, ctx, case0.icon, 94, 248, accentMap[case0.accent]);
  title(slide, ctx, case0.title, 150, 248, 410, 34, 22);
  text(slide, ctx, "AVANT", 94, 300, 70, 16, { size: 10, color: theme.orange, bold: true });
  body(slide, ctx, lines(case0.before.split(". ").filter(Boolean).map((item) => sentence(item))), 94, 324, 470, 74, 12.5, theme.soft);
  text(slide, ctx, "APRÈS", 94, 418, 70, 16, { size: 10, color: theme.teal, bold: true });
  body(slide, ctx, lines(case0.after.split(". ").filter(Boolean).map((item) => sentence(item))), 94, 442, 470, 74, 12.5, theme.ink);
  card(slide, ctx, 94, 522, 490, 40, { fill: theme.panelAlt, border: theme.line });
  body(slide, ctx, `KPI : ${case0.kpi}`, 110, 534, 456, 16, 11.5, theme.ink, { bold: true });

  card(slide, ctx, 640, 228, 568, 326, { fill: theme.panel });
  await iconBadge(slide, ctx, case1.icon, 662, 248, accentMap[case1.accent]);
  title(slide, ctx, case1.title, 718, 248, 420, 34, 22);
  text(slide, ctx, "AVANT", 662, 300, 70, 16, { size: 10, color: theme.orange, bold: true });
  body(slide, ctx, lines(case1.before.split(". ").filter(Boolean).map((item) => sentence(item))), 662, 324, 498, 74, 12.5, theme.soft);
  text(slide, ctx, "APRÈS", 662, 418, 70, 16, { size: 10, color: theme.teal, bold: true });
  body(slide, ctx, lines(case1.after.split(". ").filter(Boolean).map((item) => sentence(item))), 662, 442, 498, 74, 12.5, theme.ink);
  card(slide, ctx, 662, 522, 498, 40, { fill: theme.panelAlt, border: theme.line });
  body(slide, ctx, `KPI : ${case1.kpi}`, 678, 534, 466, 16, 11.5, theme.ink, { bold: true });

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

  footer(slide, ctx, 9);
  return slide;
}

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  const case2 = useCase(2);
  const case3 = useCase(3);

  kicker(slide, ctx, "Détail des cas d'usage");
  title(slide, ctx, "Les cas d'usage qui renforcent la qualité de service et la standardisation", 72, 86, 980, 84, 34);
  body(
    slide,
    ctx,
    `Ces deux usages rendent aussi la formation plus crédible : on apprend sur des situations réelles chez ${samplePack.organization_name}, pas sur des exemples génériques.`,
    72,
    176,
    960,
    28,
    14,
    theme.soft,
  );

  card(slide, ctx, 72, 228, 540, 308, { fill: theme.panel });
  await iconBadge(slide, ctx, case2.icon, 94, 248, accentMap[case2.accent]);
  title(slide, ctx, case2.title, 150, 248, 390, 34, 22);
  text(slide, ctx, "Usages proposés", 94, 300, 120, 16, { size: 10, color: theme.orange, bold: true });
  body(slide, ctx, lines([case2.after, `KPI cible : ${case2.kpi}`]), 94, 324, 456, 106, 12.5, theme.ink);
  card(slide, ctx, 94, 432, 490, 84, { fill: theme.panelAlt, border: theme.line });
  body(slide, ctx, `KPI : ${case2.kpi}`, 112, 458, 450, 36, 11.5, theme.ink, { bold: true });

  card(slide, ctx, 640, 228, 568, 308, { fill: theme.panel });
  await iconBadge(slide, ctx, case3.icon, 662, 248, accentMap[case3.accent]);
  title(slide, ctx, case3.title, 718, 248, 432, 34, 22);
  text(slide, ctx, "Usages proposés", 662, 300, 120, 16, { size: 10, color: theme.orange, bold: true });
  body(slide, ctx, lines([case3.after, `KPI cible : ${case3.kpi}`]), 662, 324, 490, 106, 12.5, theme.ink);
  card(slide, ctx, 662, 432, 498, 84, { fill: theme.panelAlt, border: theme.line });
  body(slide, ctx, `KPI : ${case3.kpi}`, 680, 458, 460, 36, 11.5, theme.ink, { bold: true });

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
    `Cela permet d'éviter un discours abstrait : les équipes voient tout de suite sur quels gestes métier l'IA doit les aider, ici ${lines(samplePack.deck_brief.training_focus.slice(0, 2), "").toLowerCase()}.`,
    700,
    594,
    470,
    40,
    12,
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

  stepCard(slide, ctx, 72, 236, 256, 248, "01", "J+0 | Audit et cadrage", samplePack.deck_brief.delivery_timeline[0], theme.orange);
  stepCard(slide, ctx, 352, 236, 256, 248, "02", "J+15 | Prototype ciblé", samplePack.deck_brief.delivery_timeline[1], theme.teal);
  stepCard(slide, ctx, 632, 236, 256, 248, "03", "J+45 | Formation et pilote", samplePack.deck_brief.delivery_timeline[2], theme.navy);
  stepCard(slide, ctx, 912, 236, 296, 248, "04", "J+90 | ROI et extension", samplePack.deck_brief.delivery_timeline[3], theme.gold);

  rect(slide, ctx, 72, 520, 1136, 112, theme.navy, { line: ctx.line(theme.navy, 0) });
  text(slide, ctx, "Ce que l'organisation obtient à chaque étape", 96, 542, 290, 16, {
    size: 10,
    color: "#CFE0F0",
    bold: true,
  });
  body(
    slide,
    ctx,
    "• priorités mieux choisies\n• cas d'usage mieux qualifiés\n• formation plus ciblée\n• accompagnement post-formation visible\n• décision plus simple sur le passage à l'échelle",
    96,
    566,
    260,
    68,
    11,
    theme.white,
  );
  body(
    slide,
    ctx,
    "Principe de gouvernance : aucun passage à l'étape suivante sans validation des livrables, des accès, des usages autorisés et du plan d'accompagnement sur 90 jours.",
    414,
    572,
    736,
    40,
    12,
    "#D7E5F3",
    { bold: true },
  );

  footer(slide, ctx, 11);
  return slide;
}

export async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  const case0 = useCase(0);
  const case1 = useCase(1);
  const case2 = useCase(2);
  const case3 = useCase(3);

  kicker(slide, ctx, "Offre recommandée");
  title(slide, ctx, `La proposition TransferAI pour ${samplePack.organization_name}`, 72, 86, 900, 84, 34);
  body(
    slide,
    ctx,
    "Notre valeur ne vient pas d'un outil unique, mais de l'enchaînement entre diagnostic, formation utile, accompagnement 90 jours, gouvernance et premier terrain d'exécution.",
    72,
    176,
    970,
    28,
    14,
    theme.soft,
  );

  offerBrick(slide, ctx, 72, 236, 544, 140, theme.navy, "1. Audit, cadrage et feuille de route", "• priorités métier\n• cartographie des flux\n• KPI de preuve et conditions de pilotage");
  offerBrick(slide, ctx, 640, 236, 568, 140, theme.orange, "2. Formation dirigeants et managers", "• lecture exécutive des usages IA\n• arbitrage, gouvernance et conduite du changement");
  offerBrick(slide, ctx, 72, 400, 544, 140, theme.teal, "3. Formation équipes métier", lines(samplePack.deck_brief.training_focus));
  offerBrick(slide, ctx, 640, 400, 568, 140, theme.gold, "4. Accompagnement 90 jours et pilote", lines(samplePack.deck_brief.support_90_days));

  rect(slide, ctx, 72, 576, 1136, 66, theme.panelAlt, { line: ctx.line(theme.line, 1) });
  text(slide, ctx, "Recommandation de départ", 96, 596, 180, 16, {
    size: 10,
    color: theme.orange,
    bold: true,
  });
  body(
    slide,
    ctx,
    `Commencer par deux flux à forte lisibilité de valeur : ${case0.title.toLowerCase()} + ${case1.title.toLowerCase()}. La différence TransferAI n'est pas seulement la formation : c'est l'accompagnement structuré sur 90 jours pour transformer les acquis en usage durable.`,
    296,
    588,
    866,
    30,
    12,
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
  title(slide, ctx, "Proposer un pilote utile, gouverné et mesurable", 72, 86, 900, 84, 34);

  card(slide, ctx, 72, 180, 520, 390, { fill: theme.panel });
  await iconBadge(slide, ctx, "ShieldCheck", 94, 204, theme.teal);
  title(slide, ctx, "Le cadre de confiance à présenter au prospect", 150, 204, 380, 34, 22);
  body(
    slide,
    ctx,
    "• aucune donnée sensible n'est exposée sans règles d'usage, rôles et validation\n• revue humaine avant toute automatisation critique\n• traçabilité des accès et des sorties\n• périmètre pilote strictement défini avant extension\n• formation intégrée aux exigences de confidentialité et de supervision\n• accompagnement 90 jours pour sécuriser l'adoption réelle",
    94,
    262,
    448,
    204,
    12.4,
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
    `1. Tenir un échange expert de 30 minutes\n2. Remplir ou envoyer le formulaire d'audit IA\n3. Recevoir une priorisation claire des cas d'usage ${samplePack.sector_guess.toLowerCase()}\n4. Valider un premier pilote, sa formation associée et son accompagnement 90 jours`,
    668,
    286,
    360,
    128,
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
    `Formule courte à utiliser : TransferAI aide ${samplePack.organization_name} à identifier les usages les plus utiles, à former les bonnes équipes, puis à accompagner leur mise en pratique sur 90 jours avant toute extension. Formulaire d'audit : www.transferai.ci/formulaire-audit-ia/index.html`,
    690,
    466,
    456,
    40,
    11.5,
    "#D7E5F3",
  );

  footer(slide, ctx, 13);
  return slide;
}
