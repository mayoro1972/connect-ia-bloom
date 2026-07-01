import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const WORKSPACE = path.join(
  ROOT,
  "outputs",
  "manual-20260628-secretariat-ia-market-deck",
  "presentations",
  "deck-positionnement-marche",
);
const BUILD_DIR = path.join(WORKSPACE, "build");
const PREVIEW_DIR = path.join(WORKSPACE, "preview");
const LAYOUT_DIR = path.join(WORKSPACE, "layout");
const QA_DIR = path.join(WORKSPACE, "qa");
const FINAL_PPTX = path.join(
  ROOT,
  "docs",
  "transferai-prospection",
  "TransferAI_Deck_Positionnement_Marche_Formation_IA_Secretariat_CI_2026-06-28.pptx",
);

const ASSETS = {
  logo: path.join(ROOT, "src", "assets", "logo-transferai-nettelecom.png"),
  hero: path.join(ROOT, "src", "assets", "hero-bg.jpg"),
  banner: path.join(ROOT, "src", "assets", "ai-tools-banner.jpg"),
};

const COLORS = {
  bg: "F6F1EA",
  paper: "FFFDFC",
  sand: "F1E5D8",
  line: "DDD2C6",
  navy: "17324E",
  navySoft: "5E738A",
  amber: "D86A24",
  amberSoft: "F6DDCC",
  green: "238C6A",
  greenSoft: "DFF2EA",
  blueSoft: "DEEAF6",
  lavenderSoft: "EAE3F5",
  white: "FFFFFF",
  text: "14273D",
  muted: "6A7A8B",
};

const CONTENT = {
  title: "Positionnement marché",
  subtitle:
    "Formation IA pour secrétariats de direction, cabinets, diplomatie et administration en Côte d'Ivoire",
  promise:
    "Un deck de vente pour montrer ce qui se vend déjà, où se situe le vide du marché et pourquoi votre offre est plus premium.",
  soldThemes: [
    {
      title: "Secrétariat, assistanat, protocole, diplomatie",
      source: "CAMPC",
      detail:
        "Le marché vend déjà des séminaires classiques en secrétariat-assistance de direction, protocole, diplomatie, archivage et GED.",
      color: COLORS.amber,
    },
    {
      title: "IA d'initiation et acculturation générale",
      source: "UVCI",
      detail:
        "Des modules comme “L'Intelligence Artificielle pour tous - Niveau 1” montrent que le besoin d'entrée en matière existe déjà.",
      color: COLORS.green,
    },
    {
      title: "IA pour communication et marketing digital",
      source: "UVCI",
      detail:
        "Des offres publiques visibles traitent déjà le community management optimisé avec l'IA et les usages digitaux généraux.",
      color: "2F5E8F",
    },
    {
      title: "IA/data/numérique plus techniques",
      source: "UVCI / CAMPC",
      detail:
        "GeoIA, traitement et analyse des données, réseaux et certifications techniques occupent déjà une partie du terrain.",
      color: "6D5F92",
    },
  ],
  gapBullets: [
    "Très peu d'offres visibles explicitement positionnées “IA pour secrétaires de direction, cabinets, diplomatie et administration sensible”.",
    "Le marché propose surtout soit du secrétariat classique sans couche IA, soit de l'IA généraliste sans ancrage métier administratif.",
    "La confidentialité, l'anonymisation, les prompts professionnels et la validation humaine sont encore peu visibles comme promesse commerciale centrale.",
  ],
  ourThemes: [
    "Correspondance institutionnelle augmentée",
    "Réunions, PV, comptes rendus et agendas",
    "Gestion documentaire, veille et synthèse",
    "IA responsable et données sensibles",
  ],
  comparisonRows: [
    [
      "Angle dominant",
      "IA générale ou secrétariat classique",
      "IA métier pour fonctions de direction",
    ],
    [
      "Public visé",
      "Grand public, étudiants, digital, cadres larges",
      "Secrétaires de direction, cabinets, diplomatie, administration",
    ],
    [
      "Promesse",
      "Découverte, acculturation, outils",
      "Productivité administrative sécurisée",
    ],
    [
      "Cas concrets",
      "Souvent génériques",
      "Courriers, PV, briefings, notes de synthèse",
    ],
    [
      "Données sensibles",
      "Peu visibles dans l'offre publique",
      "Au cœur du programme et du discours de vente",
    ],
    [
      "Valeur perçue",
      "Intermédiaire",
      "Premium et immédiatement applicable",
    ],
  ],
  differentiators: [
    "Vous reliez enfin métier administratif + IA + confidentialité.",
    "Vous vendez des livrables quotidiens, pas des concepts abstraits.",
    "Vous pouvez parler aux ministères, directions générales, cabinets et institutions sans changer l'offre.",
    "Votre discours est crédible parce qu'il inclut règles d'usage, prompts, cas pratiques et validation humaine.",
  ],
  useCases: [
    "Rédiger un courrier officiel délicat avec le bon ton institutionnel",
    "Transformer des notes brutes en procès-verbal exploitable",
    "Préparer l'agenda et le briefing d'une audience sensible",
    "Synthétiser un dossier volumineux en note d'aide à la décision",
  ],
  offerPackages: [
    {
      name: "Standard",
      price: "175 000 à 275 000 FCFA / participant",
      detail: "Inter-entreprises ou petit groupe. Découverte + cas d'usage + prompts.",
      fill: COLORS.amberSoft,
      accent: COLORS.amber,
    },
    {
      name: "Intra",
      price: "3,5 à 5,5 M FCFA",
      detail: "12 à 20 participants. Cas adaptés à l'organisation. Programme 2 jours.",
      fill: COLORS.greenSoft,
      accent: COLORS.green,
    },
    {
      name: "Premium sensible",
      price: "6 à 8,5 M FCFA",
      detail: "Cabinets, diplomatie, direction générale, administration sensible.",
      fill: COLORS.blueSoft,
      accent: "2F5E8F",
    },
  ],
  webinarBullets: [
    "Webinaire gratuit de 45 à 60 minutes",
    "Objectif : rassurer, sensibiliser, faire sentir le risque, convertir",
    "Contenu : usages, limites, données sensibles, 2 démonstrations métier",
    "Sortie : appel découverte ou inscription à la session de 2 jours",
  ],
  sources:
    "Sources visibles au 28 juin 2026 : CAMPC, UVCI Certifications, ARTCI.",
};

function writeBlob(targetPath, blob) {
  return fs.writeFile(targetPath, new Uint8Array(blob));
}

function addRect(slide, left, top, width, height, fill, options = {}) {
  return slide.shapes.add({
    geometry: options.geometry || "rect",
    position: { left, top, width, height },
    fill,
    line: {
      style: "solid",
      fill: options.lineFill || fill,
      width: options.lineWidth ?? 0,
    },
    borderRadius: options.borderRadius,
    shadow: options.shadow || "none",
  });
}

function addText(slide, value, left, top, width, height, options = {}) {
  const box = slide.shapes.add({
    geometry: "textbox",
    position: { left, top, width, height },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  box.text = value;
  box.text.style = {
    fontFace: options.fontFace || "Aptos",
    fontSize: options.fontSize ?? 18,
    bold: options.bold || false,
    color: options.color || COLORS.text,
    align: options.align || "left",
    valign: options.valign || "top",
  };
  if (options.fit === "shrink") box.text.fit = "shrink";
  return box;
}

function addBullets(slide, items, left, top, width, height, options = {}) {
  const text = items.map((item) => `• ${item}`).join("\n");
  return addText(slide, text, left, top, width, height, {
    fontSize: options.fontSize ?? 15,
    color: options.color || COLORS.muted,
    fit: "shrink",
  });
}

function addBackground(slide, fill = COLORS.bg) {
  slide.background.fill = fill;
}

function addFooter(slide, page) {
  addRect(slide, 64, 682, 1150, 1, COLORS.line);
  addText(
    slide,
    "TransferAI Africa | Deck de présentation marché | Formation IA pour secrétariat de direction",
    72,
    689,
    980,
    16,
    { fontSize: 8.5, color: COLORS.muted },
  );
  addText(slide, String(page).padStart(2, "0"), 1140, 687, 48, 18, {
    fontSize: 10,
    bold: true,
    align: "right",
  });
}

function addKicker(slide, label, left = 72, top = 50, color = COLORS.amber) {
  addText(slide, label.toUpperCase(), left, top, 280, 18, {
    fontSize: 10.5,
    bold: true,
    color,
  });
}

function addTitle(slide, value, left, top, width, height, fontSize = 30, color = COLORS.text) {
  return addText(slide, value, left, top, width, height, {
    fontSize,
    bold: true,
    color,
    fontFace: "Aptos Display",
    fit: "shrink",
  });
}

function addCard(slide, left, top, width, height, options = {}) {
  addRect(slide, left, top, width, height, options.fill || COLORS.paper, {
    geometry: "roundRect",
    lineFill: options.border || COLORS.line,
    lineWidth: options.borderWidth ?? 1,
    borderRadius: options.borderRadius || "rounded-2xl",
    shadow: options.shadow || "shadow-sm",
  });
}

async function addImage(slide, imagePath, left, top, width, height, options = {}) {
  const bytes = await fs.readFile(imagePath);
  slide.images.add({
    blob: bytes,
    contentType: imagePath.endsWith(".png") ? "image/png" : "image/jpeg",
    alt: options.alt || "Visual",
    fit: options.fit || "cover",
    geometry: options.geometry || "roundRect",
    borderRadius: options.borderRadius || "rounded-2xl",
    position: { left, top, width, height },
  });
}

function marketCard(slide, left, top, width, height, item) {
  addCard(slide, left, top, width, height);
  addRect(slide, left + 18, top + 20, 6, 24, item.color);
  addText(slide, item.title, left + 36, top + 18, width - 54, 44, {
    fontSize: 16.5,
    bold: true,
    fontFace: "Aptos Display",
    fit: "shrink",
  });
  addText(slide, `Visible chez : ${item.source}`, left + 36, top + 62, width - 54, 18, {
    fontSize: 10,
    bold: true,
    color: item.color,
  });
  addText(slide, item.detail, left + 18, top + 92, width - 36, height - 112, {
    fontSize: 12.8,
    color: COLORS.muted,
    fit: "shrink",
  });
}

function packageCard(slide, left, top, width, height, item) {
  addCard(slide, left, top, width, height, { fill: item.fill, border: item.fill });
  addRect(slide, left + 18, top + 18, 6, 28, item.accent);
  addText(slide, item.name, left + 34, top + 18, width - 50, 28, {
    fontSize: 18,
    bold: true,
    fontFace: "Aptos Display",
  });
  addText(slide, item.price, left + 34, top + 58, width - 50, 30, {
    fontSize: 15.5,
    bold: true,
    color: COLORS.text,
  });
  addText(slide, item.detail, left + 34, top + 98, width - 50, height - 120, {
    fontSize: 12.8,
    color: COLORS.muted,
    fit: "shrink",
  });
}

async function slide01(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide);
  addRect(slide, 0, 0, 760, 720, COLORS.bg);
  addRect(slide, 760, 0, 520, 720, COLORS.sand);
  addCard(slide, 60, 88, 610, 522);
  await addImage(slide, ASSETS.logo, 84, 112, 190, 62, {
    alt: "Logo TransferAI",
    fit: "contain",
    geometry: "rect",
    borderRadius: 0,
  });
  addText(slide, "DECK DE PRÉSENTATION", 84, 194, 220, 18, {
    fontSize: 10.5,
    bold: true,
    color: COLORS.amber,
  });
  addTitle(slide, CONTENT.title, 84, 226, 450, 46, 33);
  addTitle(slide, CONTENT.subtitle, 84, 280, 500, 110, 26);
  addText(slide, CONTENT.promise, 84, 404, 500, 78, {
    fontSize: 15.5,
    color: COLORS.muted,
    fit: "shrink",
  });
  addCard(slide, 84, 510, 500, 74, { fill: COLORS.navy, border: COLORS.navy, shadow: "none" });
  addText(slide, "Objectif : aider le prospect à voir le vide du marché et pourquoi votre offre est plus premium.", 108, 530, 452, 30, {
    fontSize: 12.4,
    bold: true,
    color: COLORS.white,
    fit: "shrink",
  });
  await addImage(slide, ASSETS.hero, 794, 112, 428, 500, {
    alt: "Réunion et IA",
    fit: "cover",
  });
  addFooter(slide, 1);
}

function slide02(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.paper);
  addKicker(slide, "Lecture du marché");
  addTitle(slide, "Ce qui est déjà visible aujourd'hui en Côte d'Ivoire", 72, 78, 820, 52);
  marketCard(slide, 72, 164, 548, 186, CONTENT.soldThemes[0]);
  marketCard(slide, 660, 164, 548, 186, CONTENT.soldThemes[1]);
  marketCard(slide, 72, 386, 548, 186, CONTENT.soldThemes[2]);
  marketCard(slide, 660, 386, 548, 186, CONTENT.soldThemes[3]);
  addFooter(slide, 2);
}

function slide03(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide);
  addKicker(slide, "Opportunité");
  addTitle(slide, "Le vide du marché que votre offre peut prendre", 72, 78, 740, 52);
  addCard(slide, 72, 164, 610, 398, { fill: COLORS.paper });
  addText(slide, "Constat stratégique", 100, 192, 240, 24, {
    fontSize: 19,
    bold: true,
    fontFace: "Aptos Display",
  });
  addBullets(slide, CONTENT.gapBullets, 100, 236, 550, 286, {
    fontSize: 14.8,
    color: COLORS.text,
  });
  addCard(slide, 720, 164, 488, 398, { fill: COLORS.navy, border: COLORS.navy });
  addText(slide, "Conclusion", 748, 192, 160, 18, {
    fontSize: 10.5,
    bold: true,
    color: COLORS.amberSoft,
  });
  addTitle(
    slide,
    "Le marché vend déjà l'IA générale et le secrétariat classique. Il vend encore très peu l'IA appliquée au secrétariat de direction en environnement sensible.",
    748,
    226,
    430,
    168,
    24,
    COLORS.white,
  );
  addText(
    slide,
    "C'est votre fenêtre de différenciation et de premiumisation.",
    748,
    418,
    390,
    30,
    {
      fontSize: 14.5,
      bold: true,
      color: COLORS.white,
      fit: "shrink",
    },
  );
  addCard(slide, 72, 594, 1136, 42, { fill: COLORS.greenSoft, border: COLORS.greenSoft, shadow: "none" });
  addText(slide, "Message à porter : nous ne vendons pas une initiation ChatGPT, nous vendons une productivité administrative sécurisée.", 96, 606, 1088, 18, {
    fontSize: 11.8,
    bold: true,
    color: COLORS.green,
    align: "center",
    fit: "shrink",
  });
  addFooter(slide, 3);
}

function slide04(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.paper);
  addKicker(slide, "Comparaison");
  addTitle(slide, "Ce que les autres vendent vs ce que vous vendez", 72, 78, 820, 52);
  addCard(slide, 72, 164, 1136, 434, { fill: COLORS.paper });
  const col1 = 230;
  const col2 = 430;
  const col3 = 430;
  const startX = 92;
  let y = 188;
  addRect(slide, startX, y, col1, 40, COLORS.sand);
  addRect(slide, startX + col1, y, col2, 40, COLORS.amberSoft);
  addRect(slide, startX + col1 + col2, y, col3, 40, COLORS.greenSoft);
  addText(slide, "Critère", startX + 14, y + 10, col1 - 28, 20, { fontSize: 12, bold: true });
  addText(slide, "Offres visibles sur le marché", startX + col1 + 14, y + 10, col2 - 28, 20, { fontSize: 12, bold: true });
  addText(slide, "Votre offre", startX + col1 + col2 + 14, y + 10, col3 - 28, 20, { fontSize: 12, bold: true });
  y += 46;
  CONTENT.comparisonRows.forEach((row, index) => {
    const fill = index % 2 === 0 ? COLORS.paper : "FAF7F3";
    addRect(slide, startX, y, col1, 52, fill, { lineFill: COLORS.line, lineWidth: 1 });
    addRect(slide, startX + col1, y, col2, 52, fill, { lineFill: COLORS.line, lineWidth: 1 });
    addRect(slide, startX + col1 + col2, y, col3, 52, fill, { lineFill: COLORS.line, lineWidth: 1 });
    addText(slide, row[0], startX + 12, y + 10, col1 - 24, 30, { fontSize: 11.6, bold: true, fit: "shrink" });
    addText(slide, row[1], startX + col1 + 12, y + 8, col2 - 24, 34, { fontSize: 11.3, color: COLORS.muted, fit: "shrink" });
    addText(slide, row[2], startX + col1 + col2 + 12, y + 8, col3 - 24, 34, { fontSize: 11.3, color: COLORS.text, fit: "shrink", bold: index >= 3 });
    y += 52;
  });
  addFooter(slide, 4);
}

function slide05(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide);
  addKicker(slide, "Offre");
  addTitle(slide, "Les 4 thématiques que nous portons à la vente", 72, 78, 760, 52);
  const fills = [COLORS.amberSoft, COLORS.greenSoft, COLORS.blueSoft, COLORS.lavenderSoft];
  CONTENT.ourThemes.forEach((theme, index) => {
    const x = 72 + (index % 2) * 568;
    const y = 170 + Math.floor(index / 2) * 198;
    addCard(slide, x, y, 536, 160, { fill: fills[index], border: fills[index] });
    addText(slide, `0${index + 1}`, x + 22, y + 18, 44, 28, {
      fontSize: 24,
      bold: true,
      color: COLORS.amber,
      fontFace: "Aptos Display",
    });
    addText(slide, theme, x + 86, y + 20, 414, 54, {
      fontSize: 19,
      bold: true,
      fontFace: "Aptos Display",
      fit: "shrink",
    });
    addText(
      slide,
      index === 0
        ? "Courriers, e-mails sensibles, notes, reformulation et traduction."
        : index === 1
          ? "Réunions, procès-verbaux, plans d'action, ordres du jour, notes de briefing."
          : index === 2
            ? "Classement, recherche, synthèse de dossiers, veille et préparation de supports."
            : "Prompts, anonymisation, validation humaine, charte interne et sécurité des données.",
      x + 86,
      y + 80,
      414,
      44,
      { fontSize: 13.5, color: COLORS.muted, fit: "shrink" },
    );
  });
  addCard(slide, 72, 584, 1136, 54, { fill: COLORS.navy, border: COLORS.navy, shadow: "none" });
  addText(slide, "Ces 4 blocs sont simples à comprendre, faciles à vendre et directement reliés aux tâches quotidiennes des participants.", 100, 602, 1080, 18, {
    fontSize: 12,
    bold: true,
    color: COLORS.white,
    align: "center",
    fit: "shrink",
  });
  addFooter(slide, 5);
}

async function slide06(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.paper);
  addKicker(slide, "Cas concrets");
  addTitle(slide, "Ce que le prospect va immédiatement visualiser", 72, 78, 760, 52);
  await addImage(slide, ASSETS.banner, 742, 150, 466, 190, {
    alt: "Outils IA",
    fit: "cover",
  });
  addCard(slide, 72, 164, 620, 430);
  addText(slide, "4 cas d'usage qui parlent tout de suite au client", 98, 192, 360, 24, {
    fontSize: 18.5,
    bold: true,
    fontFace: "Aptos Display",
  });
  addBullets(slide, CONTENT.useCases, 98, 236, 560, 288, {
    fontSize: 16,
    color: COLORS.text,
  });
  addCard(slide, 742, 372, 466, 222, { fill: COLORS.greenSoft, border: COLORS.greenSoft });
  addText(slide, "Pourquoi cela vend bien", 770, 398, 220, 20, {
    fontSize: 10.5,
    bold: true,
    color: COLORS.green,
  });
  addBullets(
    slide,
    [
      "Le client reconnaît immédiatement ses tâches réelles.",
      "La valeur est visible sans explication technique.",
      "Le lien avec la confidentialité est naturel et crédible.",
    ],
    770,
    430,
    400,
    120,
    { fontSize: 13.6, color: COLORS.text },
  );
  addFooter(slide, 6);
}

function slide07(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide);
  addKicker(slide, "Différenciation");
  addTitle(slide, "Pourquoi votre offre peut être perçue comme premium", 72, 78, 820, 52);
  addCard(slide, 72, 164, 1136, 430, { fill: COLORS.paper });
  CONTENT.differentiators.forEach((item, index) => {
    const y = 198 + index * 90;
    addRect(slide, 104, y + 6, 38, 38, COLORS.navy, {
      geometry: "ellipse",
      lineFill: COLORS.navy,
    });
    addText(slide, String(index + 1), 104, y + 16, 38, 14, {
      fontSize: 11,
      bold: true,
      color: COLORS.white,
      align: "center",
    });
    addText(slide, item, 170, y, 960, 46, {
      fontSize: 16,
      bold: true,
      color: COLORS.text,
      fontFace: "Aptos Display",
      fit: "shrink",
    });
  });
  addCard(slide, 72, 614, 1136, 36, { fill: COLORS.amberSoft, border: COLORS.amberSoft, shadow: "none" });
  addText(slide, "Formule courte recommandée : “IA professionnelle pour fonctions de direction en environnement sensible”.", 96, 623, 1088, 14, {
    fontSize: 11.6,
    bold: true,
    color: COLORS.amber,
    align: "center",
    fit: "shrink",
  });
  addFooter(slide, 7);
}

function slide08(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.paper);
  addKicker(slide, "Monétisation");
  addTitle(slide, "Formats d'offre et niveau de prix recommandé", 72, 78, 760, 52);
  packageCard(slide, 72, 172, 352, 216, CONTENT.offerPackages[0]);
  packageCard(slide, 464, 172, 352, 216, CONTENT.offerPackages[1]);
  packageCard(slide, 856, 172, 352, 216, CONTENT.offerPackages[2]);
  addCard(slide, 72, 430, 540, 174, { fill: COLORS.paper });
  addText(slide, "Conseil de vente", 100, 456, 180, 22, {
    fontSize: 18.5,
    bold: true,
    fontFace: "Aptos Display",
  });
  addBullets(
    slide,
    [
      "Ne pas vendre “une formation ChatGPT”.",
      "Vendre une montée en compétences IA adaptée aux environnements sensibles.",
      "Insister sur gains de temps, qualité rédactionnelle, prompts et protection des données.",
    ],
    100,
    494,
    470,
    86,
    { fontSize: 13.6, color: COLORS.text },
  );
  addCard(slide, 648, 430, 560, 174, { fill: COLORS.navy, border: COLORS.navy });
  addText(slide, "Positionnement", 676, 456, 140, 18, {
    fontSize: 10.5,
    bold: true,
    color: COLORS.amberSoft,
  });
  addTitle(
    slide,
    "Productivité administrative sécurisée et maîtrise professionnelle de l'IA",
    676,
    488,
    492,
    64,
    24,
    COLORS.white,
  );
  addFooter(slide, 8);
}

function slide09(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide);
  addKicker(slide, "Conversion");
  addTitle(slide, "Le webinaire gratuit qui prépare la vente", 72, 78, 740, 52);
  addCard(slide, 72, 164, 610, 420);
  addText(slide, "Format et objectif", 98, 190, 220, 24, {
    fontSize: 18.5,
    bold: true,
    fontFace: "Aptos Display",
  });
  addBullets(slide, CONTENT.webinarBullets, 98, 232, 550, 236, {
    fontSize: 15,
    color: COLORS.text,
  });
  addCard(slide, 98, 486, 558, 72, { fill: COLORS.greenSoft, border: COLORS.greenSoft, shadow: "none" });
  addText(slide, "Rôle du webinaire : rassurer, montrer le risque, démontrer l'utilité, puis ouvrir la porte à la formation payante.", 122, 512, 510, 22, {
    fontSize: 12.2,
    bold: true,
    color: COLORS.green,
    align: "center",
    fit: "shrink",
  });
  addCard(slide, 722, 164, 486, 420, { fill: COLORS.paper });
  addText(slide, "Conclusion commerciale", 748, 190, 220, 20, {
    fontSize: 10.5,
    bold: true,
    color: COLORS.amber,
  });
  addTitle(
    slide,
    "Vous êtes mieux placés si vous parlez moins d'outil et plus de tâches, de confidentialité et de résultats métier.",
    748,
    226,
    420,
    118,
    24,
  );
  addText(slide, CONTENT.sources, 748, 370, 410, 40, {
    fontSize: 11.5,
    color: COLORS.muted,
    fit: "shrink",
  });
  addCard(slide, 748, 444, 390, 102, { fill: COLORS.navy, border: COLORS.navy, shadow: "none" });
  addText(slide, "Prochaine étape recommandée", 772, 464, 210, 18, {
    fontSize: 10.5,
    bold: true,
    color: COLORS.amberSoft,
  });
  addText(slide, "1. Webinaire gratuit\n2. Session pilote intra\n3. Déploiement premium", 772, 492, 320, 40, {
    fontSize: 14,
    bold: true,
    color: COLORS.white,
    fit: "shrink",
  });
  addFooter(slide, 9);
}

async function ensureWorkspace() {
  await fs.mkdir(BUILD_DIR, { recursive: true });
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(LAYOUT_DIR, { recursive: true });
  await fs.mkdir(QA_DIR, { recursive: true });
  await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });
  await fs.writeFile(
    path.join(WORKSPACE, "source-notes.txt"),
    [
      "Deck built from current public market positioning notes as of 2026-06-28.",
      "References used in narrative: CAMPC seminars, UVCI certifications, ARTCI missions.",
      "Purpose: sell-side deck for market comparison and differentiation.",
    ].join("\n"),
    "utf8",
  );
}

async function exportDeck(presentation) {
  const qa = [];
  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    const png = await presentation.export({ slide, format: "png", scale: 1 });
    await writeBlob(path.join(PREVIEW_DIR, `${stem}.png`), await png.arrayBuffer());
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(LAYOUT_DIR, `${stem}.layout.json`), await layout.text(), "utf8");
    qa.push(`${stem}: exported`);
  }
  const montage = await presentation.export({ format: "webp", montage: true, scale: 1 });
  await writeBlob(path.join(PREVIEW_DIR, "deck-montage.webp"), await montage.arrayBuffer());
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);
  await fs.writeFile(path.join(QA_DIR, "layout-scorecard.txt"), qa.join("\n"), "utf8");
}

async function main() {
  await ensureWorkspace();
  const presentation = Presentation.create({
    slideSize: { width: 1280, height: 720 },
  });

  await slide01(presentation);
  slide02(presentation);
  slide03(presentation);
  slide04(presentation);
  slide05(presentation);
  await slide06(presentation);
  slide07(presentation);
  slide08(presentation);
  slide09(presentation);

  await exportDeck(presentation);
  console.log(FINAL_PPTX);
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
