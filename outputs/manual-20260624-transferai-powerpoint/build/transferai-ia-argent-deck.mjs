import fs from "node:fs/promises";
import path from "node:path";

import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const OUT_DIR = path.join(ROOT, "outputs", "manual-20260624-transferai-powerpoint");
const PREVIEW_DIR = path.join(OUT_DIR, "preview");
const LAYOUT_DIR = path.join(OUT_DIR, "layout");
const QA_DIR = path.join(OUT_DIR, "qa");
const FINAL_PPTX = path.join(
  OUT_DIR,
  "TransferAI_IA_Regenere_Argent_Par_Secteur_2026-06-24.pptx",
);

const COLORS = {
  bg: "#F7F3EE",
  paper: "#FFFDFC",
  ink: "#10213D",
  inkSoft: "#556274",
  accent: "#D66724",
  accentSoft: "#F6D9C9",
  blueSoft: "#D8E5F2",
  tealSoft: "#DCEEE8",
  goldSoft: "#F8EBC5",
  line: "#D8D1C8",
  white: "#FFFFFF",
  teal: "#2F8F7C",
  gold: "#A0781E",
};

const SLIDE = { width: 1280, height: 720 };

async function writeBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

function box(slide, { left, top, width, height, fill = "none", lineFill = "none", lineWidth = 0, radius = undefined, shadow = undefined, name = undefined }) {
  return slide.shapes.add({
    geometry: fill === "none" && lineWidth === 0 ? "textbox" : "roundRect",
    name,
    position: { left, top, width, height },
    fill,
    line: { style: "solid", fill: lineFill, width: lineWidth },
    ...(radius ? { borderRadius: radius } : {}),
    ...(shadow ? { shadow } : {}),
  });
}

function textBox(slide, { text, left, top, width, height, size, color = COLORS.ink, bold = false, align = "left", font = "Aptos", name = undefined }) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name,
    position: { left, top, width, height },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontSize: size,
    color,
    bold,
    alignment: align,
    fontFamily: font,
  };
  return shape;
}

function footer(slide, index, text) {
  slide.shapes.add({
    geometry: "rect",
    position: { left: 60, top: 680, width: 1160, height: 1 },
    fill: COLORS.line,
    line: { style: "solid", fill: COLORS.line, width: 0 },
    name: `footer-rule-${index}`,
  });
  textBox(slide, {
    text,
    left: 60,
    top: 688,
    width: 980,
    height: 18,
    size: 11,
    color: COLORS.inkSoft,
    font: "Aptos",
    name: `footer-text-${index}`,
  });
  textBox(slide, {
    text: String(index).padStart(2, "0"),
    left: 1144,
    top: 684,
    width: 50,
    height: 20,
    size: 12,
    bold: true,
    color: COLORS.ink,
    align: "right",
    font: "Aptos Display",
    name: `footer-page-${index}`,
  });
}

function addCard(slide, { title, lines, left, top, width, height, accentColor, fillColor, titleColor = COLORS.ink, bodyColor = COLORS.ink, centered = false, titleSize = 24, bodySize = 18, titleTop = 24 }) {
  box(slide, {
    left,
    top,
    width,
    height,
    fill: fillColor,
    lineFill: COLORS.line,
    lineWidth: 1,
    radius: "rounded-2xl",
    shadow: "shadow-sm",
    name: `${title}-card`,
  });
  slide.shapes.add({
    geometry: "rect",
    position: { left: left + 18, top: top + 18, width: 6, height: height - 36 },
    fill: accentColor,
    line: { style: "solid", fill: accentColor, width: 0 },
    name: `${title}-accent`,
  });
  textBox(slide, {
    text: title,
    left: left + 36,
    top: top + titleTop,
    width: width - 54,
    height: 36,
    size: titleSize,
    color: titleColor,
    bold: true,
    align: centered ? "center" : "left",
    font: "Aptos Display",
    name: `${title}-title`,
  });
  textBox(slide, {
    text: lines.join("\n"),
    left: left + 36,
    top: top + 74,
    width: width - 56,
    height: height - 90,
    size: bodySize,
    color: bodyColor,
    align: centered ? "center" : "left",
    font: "Aptos",
    name: `${title}-body`,
  });
}

function addCoverSlide(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = COLORS.bg;

  box(slide, {
    left: 54,
    top: 60,
    width: 628,
    height: 600,
    fill: COLORS.paper,
    lineFill: COLORS.paper,
    lineWidth: 0,
    radius: "rounded-3xl",
    shadow: "shadow-sm",
    name: "cover-panel",
  });
  box(slide, {
    left: 732,
    top: 60,
    width: 494,
    height: 600,
    fill: "#EEE6DE",
    lineFill: "#EEE6DE",
    lineWidth: 0,
    radius: "rounded-3xl",
    name: "cover-side",
  });

  textBox(slide, {
    text: "TRANSFERAI | DECK COMMERCIAL",
    left: 90,
    top: 98,
    width: 250,
    height: 22,
    size: 14,
    color: COLORS.accent,
    bold: true,
    font: "Aptos",
    name: "cover-kicker",
  });
  textBox(slide, {
    text: "Comment l’IA régénère\nde l’argent\npar secteur",
    left: 90,
    top: 144,
    width: 520,
    height: 210,
    size: 52,
    color: COLORS.ink,
    bold: true,
    font: "Aptos Display",
    name: "cover-title",
  });
  textBox(slide, {
    text: "Récupérer le revenu perdu, accélérer la conversion, protéger la marge et augmenter la capacité d’exécution.",
    left: 90,
    top: 390,
    width: 510,
    height: 74,
    size: 22,
    color: COLORS.inkSoft,
    font: "Aptos",
    name: "cover-subtitle",
  });
  textBox(slide, {
    text: "Le bon angle TransferAI : relier chaque usage IA à un KPI métier que la direction suit déjà.",
    left: 90,
    top: 500,
    width: 500,
    height: 60,
    size: 20,
    color: COLORS.ink,
    bold: true,
    font: "Aptos",
    name: "cover-callout",
  });

  const pillars = [
    { value: "Revenu", label: "récupéré", y: 114, color: COLORS.accent },
    { value: "Conversion", label: "accélérée", y: 238, color: "#295E99" },
    { value: "Marge", label: "protégée", y: 362, color: COLORS.teal },
    { value: "Capacité", label: "augmentée", y: 486, color: COLORS.gold },
  ];
  for (const pillar of pillars) {
    box(slide, {
      left: 786,
      top: pillar.y,
      width: 388,
      height: 92,
      fill: COLORS.paper,
      lineFill: COLORS.line,
      lineWidth: 1,
      radius: "rounded-2xl",
      name: `${pillar.value}-cover-card`,
    });
    slide.shapes.add({
      geometry: "rect",
      position: { left: 806, top: pillar.y + 18, width: 6, height: 56 },
      fill: pillar.color,
      line: { style: "solid", fill: pillar.color, width: 0 },
    });
    textBox(slide, {
      text: pillar.value,
      left: 832,
      top: pillar.y + 18,
      width: 220,
      height: 28,
      size: 28,
      color: COLORS.ink,
      bold: true,
      font: "Aptos Display",
    });
    textBox(slide, {
      text: pillar.label,
      left: 832,
      top: pillar.y + 50,
      width: 180,
      height: 22,
      size: 18,
      color: COLORS.inkSoft,
      font: "Aptos",
    });
  }

  footer(slide, 1, "TransferAI | L’IA devient précieuse quand elle améliore un KPI métier clair.");
}

function addFrameworkSlide(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = COLORS.paper;

  textBox(slide, {
    text: "Cadre de lecture",
    left: 60,
    top: 42,
    width: 220,
    height: 20,
    size: 14,
    color: COLORS.accent,
    bold: true,
    font: "Aptos",
  });
  textBox(slide, {
    text: "L’IA régénère de l’argent de 4 façons",
    left: 60,
    top: 80,
    width: 760,
    height: 52,
    size: 40,
    color: COLORS.ink,
    bold: true,
    font: "Aptos Display",
  });
  textBox(slide, {
    text: "Chaque usage IA doit être rattaché à un gain visible en moins de 90 jours.",
    left: 60,
    top: 138,
    width: 620,
    height: 36,
    size: 20,
    color: COLORS.inkSoft,
    font: "Aptos",
  });

  const cards = [
    {
      title: "Récupérer du revenu perdu",
      lines: ["Moins de churn", "Moins d’abandon", "Plus de rétention"],
      left: 60,
      top: 218,
      accentColor: COLORS.accent,
      fillColor: COLORS.accentSoft,
    },
    {
      title: "Convertir plus vite",
      lines: ["Segmentation plus utile", "Relances plus rapides", "Messages plus performants"],
      left: 650,
      top: 218,
      accentColor: "#295E99",
      fillColor: COLORS.blueSoft,
    },
    {
      title: "Protéger la marge",
      lines: ["Moins d’erreurs", "Moins de retards", "Moins de rework"],
      left: 60,
      top: 450,
      accentColor: COLORS.teal,
      fillColor: COLORS.tealSoft,
    },
    {
      title: "Traiter plus sans recruter",
      lines: ["Plus de volume", "Même équipe", "Décisions plus rapides"],
      left: 650,
      top: 450,
      accentColor: COLORS.gold,
      fillColor: COLORS.goldSoft,
    },
  ];

  for (const card of cards) {
    addCard(slide, {
      ...card,
      width: 570,
      height: 188,
      titleSize: 24,
      bodySize: 18,
    });
  }

  footer(slide, 2, "Le bon discours n’est pas “l’IA en général” : c’est un cas d’usage précis, un KPI connu et un ROI visible.");
}

function addSectorSlide(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = COLORS.bg;

  textBox(slide, {
    text: "Illustrations sectorielles",
    left: 60,
    top: 42,
    width: 260,
    height: 20,
    size: 14,
    color: COLORS.accent,
    bold: true,
    font: "Aptos",
  });
  textBox(slide, {
    text: "Où l’argent se régénère concrètement",
    left: 60,
    top: 80,
    width: 760,
    height: 52,
    size: 40,
    color: COLORS.ink,
    bold: true,
    font: "Aptos Display",
  });

  const sectors = [
    ["Télécoms", "Churn mieux anticipé\nUpsell mieux ciblé"],
    ["Banque", "Dossiers traités plus vite\nConversion accélérée"],
    ["Assurance", "Réclamations mieux lues\nRétention renforcée"],
    ["Retail", "Campagnes plus ciblées\nVentes mieux activées"],
    ["Industrie", "Moins de pertes cachées\nMarge protégée"],
    ["Logistique", "Retards mieux pilotés\nDécisions plus rapides"],
    ["RH", "Plus de volume traité\nSans surcoût immédiat"],
    ["Administration", "Plus de fluidité\nMême équipe, meilleure exécution"],
  ];

  sectors.forEach(([title, copy], index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    const left = 60 + col * 290;
    const top = 192 + row * 204;
    box(slide, {
      left,
      top,
      width: 260,
      height: 164,
      fill: COLORS.paper,
      lineFill: COLORS.line,
      lineWidth: 1,
      radius: "rounded-2xl",
      shadow: "shadow-sm",
    });
    textBox(slide, {
      text: title,
      left: left + 22,
      top: top + 24,
      width: 210,
      height: 30,
      size: 24,
      color: COLORS.ink,
      bold: true,
      font: "Aptos Display",
    });
    textBox(slide, {
      text: copy,
      left: left + 22,
      top: top + 72,
      width: 216,
      height: 58,
      size: 17,
      color: COLORS.inkSoft,
      font: "Aptos",
    });
  });

  textBox(slide, {
    text: "Télécoms | Banque | Assurance | Retail | Industrie | Logistique | RH | Administration",
    left: 100,
    top: 630,
    width: 1080,
    height: 20,
    size: 14,
    color: COLORS.inkSoft,
    bold: true,
    align: "center",
    font: "Aptos",
  });

  footer(slide, 3, "Les secteurs changent, mais la logique reste la même : revenu récupéré, conversion, marge et capacité.");
}

function addHeroQuadrantSlide(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = COLORS.bg;

  textBox(slide, {
    text: "Comment l’IA régénère\nde l’argent par secteur",
    left: 60,
    top: 42,
    width: 520,
    height: 90,
    size: 44,
    color: COLORS.ink,
    bold: true,
    font: "Aptos Display",
  });
  textBox(slide, {
    text: "Récupérer le revenu perdu, accélérer la conversion, protéger la marge et augmenter la capacité d’exécution.",
    left: 60,
    top: 138,
    width: 500,
    height: 74,
    size: 20,
    color: COLORS.inkSoft,
    font: "Aptos",
  });

  box(slide, {
    left: 760,
    top: 54,
    width: 420,
    height: 126,
    fill: COLORS.accent,
    lineFill: COLORS.accent,
    lineWidth: 0,
    radius: "rounded-3xl",
    shadow: "shadow-sm",
  });
  textBox(slide, {
    text: "L’IA crée de la valeur\nquand elle améliore\nun KPI métier déjà connu",
    left: 790,
    top: 82,
    width: 360,
    height: 78,
    size: 26,
    color: COLORS.white,
    bold: true,
    align: "center",
    font: "Aptos Display",
  });

  const quadrantCards = [
    {
      title: "Revenu récupéré",
      lines: ["Churn réduit", "Réclamations mieux traitées", "Signaux clients mieux détectés"],
      left: 60,
      top: 252,
      accentColor: COLORS.accent,
      fillColor: COLORS.paper,
    },
    {
      title: "Conversion accélérée",
      lines: ["Segmentation plus utile", "Relances plus rapides", "Messages plus performants"],
      left: 650,
      top: 252,
      accentColor: "#295E99",
      fillColor: COLORS.paper,
    },
    {
      title: "Marge protégée",
      lines: ["Moins d’erreurs", "Moins de retards", "Moins de rework"],
      left: 60,
      top: 470,
      accentColor: COLORS.teal,
      fillColor: COLORS.paper,
    },
    {
      title: "Capacité augmentée",
      lines: ["Plus de volume traité", "Même équipe", "Décisions plus rapides"],
      left: 650,
      top: 470,
      accentColor: COLORS.gold,
      fillColor: COLORS.paper,
    },
  ];

  quadrantCards.forEach((card) =>
    addCard(slide, {
      ...card,
      width: 570,
      height: 172,
      titleSize: 24,
      bodySize: 17,
      titleTop: 22,
    }),
  );

  textBox(slide, {
    text: "Télécoms | Banque | Assurance | Retail | Industrie | Logistique | RH | Administration",
    left: 80,
    top: 662,
    width: 1120,
    height: 20,
    size: 14,
    color: COLORS.inkSoft,
    bold: true,
    align: "center",
    font: "Aptos",
  });

  footer(slide, 4, "TransferAI transforme l’IA en résultats mesurables sur les KPI que les directions suivent déjà.");
}

function addClosingSlide(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = COLORS.paper;

  textBox(slide, {
    text: "Synthèse commerciale",
    left: 60,
    top: 42,
    width: 240,
    height: 20,
    size: 14,
    color: COLORS.accent,
    bold: true,
    font: "Aptos",
  });
  textBox(slide, {
    text: "La formule TransferAI",
    left: 60,
    top: 80,
    width: 540,
    height: 52,
    size: 40,
    color: COLORS.ink,
    bold: true,
    font: "Aptos Display",
  });
  textBox(slide, {
    text: "L’IA régénère de l’argent quand elle agit sur un KPI métier clair.",
    left: 60,
    top: 138,
    width: 620,
    height: 34,
    size: 22,
    color: COLORS.inkSoft,
    font: "Aptos",
  });

  const strips = [
    { text: "Revenu récupéré", color: COLORS.accent, top: 226, fill: COLORS.accentSoft },
    { text: "Conversion accélérée", color: "#295E99", top: 306, fill: COLORS.blueSoft },
    { text: "Marge protégée", color: COLORS.teal, top: 386, fill: COLORS.tealSoft },
    { text: "Capacité augmentée", color: COLORS.gold, top: 466, fill: COLORS.goldSoft },
  ];
  strips.forEach((strip) => {
    box(slide, {
      left: 60,
      top: strip.top,
      width: 480,
      height: 58,
      fill: strip.fill,
      lineFill: strip.fill,
      lineWidth: 0,
      radius: "rounded-2xl",
    });
    textBox(slide, {
      text: strip.text,
      left: 84,
      top: strip.top + 14,
      width: 420,
      height: 26,
      size: 26,
      color: COLORS.ink,
      bold: true,
      font: "Aptos Display",
    });
  });

  box(slide, {
    left: 618,
    top: 214,
    width: 602,
    height: 328,
    fill: COLORS.bg,
    lineFill: COLORS.line,
    lineWidth: 1,
    radius: "rounded-3xl",
  });
  textBox(slide, {
    text: "KPI à citer en rendez-vous",
    left: 652,
    top: 248,
    width: 260,
    height: 28,
    size: 26,
    color: COLORS.ink,
    bold: true,
    font: "Aptos Display",
  });
  textBox(slide, {
    text: "Conversion\nChurn\nDélai de traitement\nVolume traité\nCoût par dossier\nMarge protégée",
    left: 652,
    top: 300,
    width: 240,
    height: 190,
    size: 20,
    color: COLORS.inkSoft,
    font: "Aptos",
  });
  textBox(slide, {
    text: "Notre promesse n’est pas l’IA pour l’IA. Notre promesse est simple : récupérer le revenu qui fuit, convertir plus vite, protéger la marge et augmenter la capacité des équipes, secteur par secteur.",
    left: 900,
    top: 300,
    width: 274,
    height: 170,
    size: 18,
    color: COLORS.ink,
    bold: true,
    font: "Aptos",
  });

  textBox(slide, {
    text: "TransferAI transforme l’IA en résultats mesurables sur les KPI que les directions suivent déjà.",
    left: 60,
    top: 610,
    width: 1120,
    height: 28,
    size: 22,
    color: COLORS.ink,
    bold: true,
    align: "center",
    font: "Aptos Display",
  });

  footer(slide, 5, "Clôture | Le discours de vente doit rester simple, mesurable et sectorisé.");
}

async function exportArtifacts(presentation) {
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(LAYOUT_DIR, { recursive: true });
  await fs.mkdir(QA_DIR, { recursive: true });

  const qaLines = [];
  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    const png = await presentation.export({ slide, format: "png", scale: 1 });
    await writeBlob(path.join(PREVIEW_DIR, `${stem}.png`), png);

    const layout = await slide.export({ format: "layout" });
    const layoutText = await layout.text();
    await fs.writeFile(path.join(LAYOUT_DIR, `${stem}.layout.json`), layoutText, "utf8");
    qaLines.push(`${stem}: rendered`);
  }

  const montage = await presentation.export({ format: "webp", montage: true, scale: 1 });
  await writeBlob(path.join(PREVIEW_DIR, "deck-montage.webp"), montage);
  await fs.writeFile(path.join(QA_DIR, "render-log.txt"), qaLines.join("\n"), "utf8");
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const presentation = Presentation.create({ slideSize: SLIDE });

  addCoverSlide(presentation);
  addFrameworkSlide(presentation);
  addSectorSlide(presentation);
  addHeroQuadrantSlide(presentation);
  addClosingSlide(presentation);

  await exportArtifacts(presentation);

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);
  console.log(FINAL_PPTX);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
