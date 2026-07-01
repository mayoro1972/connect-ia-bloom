import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const WORKSPACE = path.join(
  ROOT,
  "outputs",
  "manual-20260628-secretariat-ia-formation",
  "presentations",
  "programme-ia-secretariat-direction",
);
const PREVIEW_DIR = path.join(WORKSPACE, "preview");
const LAYOUT_DIR = path.join(WORKSPACE, "layout");
const QA_DIR = path.join(WORKSPACE, "qa");
const BUILD_DIR = path.join(WORKSPACE, "build");
const FINAL_PPTX = path.join(
  ROOT,
  "docs",
  "transferai-prospection",
  "TransferAI_Programme_Formation_IA_Secretariat_Direction_2026-06-28.pptx",
);

const ASSETS = {
  logo: path.join(ROOT, "src", "assets", "logo-transferai-nettelecom.png"),
  hero: path.join(ROOT, "src", "assets", "hero-bg.jpg"),
  banner: path.join(ROOT, "src", "assets", "ai-tools-banner.jpg"),
};

const COLORS = {
  bg: "F6F1EA",
  paper: "FFFDFC",
  sand: "F3E8DB",
  sandDeep: "E5D2BE",
  navy: "142C46",
  navySoft: "4D6175",
  amber: "D96B27",
  amberSoft: "F8E0D0",
  green: "2E9B76",
  greenSoft: "E6F5EF",
  sky: "E8F0F8",
  line: "D9D0C6",
  white: "FFFFFF",
  text: "13263C",
  muted: "68798B",
  redSoft: "F8E2DE",
};

const DECK = {
  title: "Programme de formation IA pour secrétariats de direction et fonctions institutionnelles",
  subtitle:
    "Secrétaires de direction, assistants de direction, diplomates, secrétaires particuliers de ministre, administrateurs civils",
  promise:
    "Deux journées intensives pour gagner du temps, améliorer la qualité rédactionnelle et utiliser l'IA de façon sûre face aux données sensibles.",
  audience: [
    "Secrétaires de direction et assistants de direction",
    "Cabinets ministériels et secrétariats particuliers",
    "Diplomates, cellules protocole et relations institutionnelles",
    "Administrateurs civils et fonctions support à forte confidentialité",
  ],
  themes: [
    {
      title: "Correspondance institutionnelle augmentée",
      detail:
        "Courriers officiels, e-mails sensibles, notes de transmission, réponses protocolaires, reformulation et traduction.",
      accent: COLORS.amber,
    },
    {
      title: "Réunions, PV, comptes rendus et agendas",
      detail:
        "Ordres du jour, comptes rendus exploitables, plans d'action, notes de briefing et suivi des décisions.",
      accent: COLORS.green,
    },
    {
      title: "Gestion documentaire, veille et synthèse",
      detail:
        "Classement intelligent, recherche d'information, notes de synthèse, résumés exécutifs et préparation de présentations.",
      accent: "335E8A",
    },
    {
      title: "IA responsable et données sensibles",
      detail:
        "Anonymisation, validation humaine, règles de confidentialité, bonnes pratiques de prompts et charte interne d'usage.",
      accent: "6D5B93",
    },
  ],
  useCases: [
    {
      title: "Rédiger un courrier officiel délicat",
      before: "Notes brutes, ton hésitant, risque d'oubli ou de maladresse formelle.",
      after:
        "Projet de courrier institutionnel structuré, ton diplomatique, points sensibles signalés et validation finale facilitée.",
    },
    {
      title: "Transformer une réunion en PV exploitable",
      before: "Notes dispersées, décisions mal tracées, responsabilités peu claires.",
      after:
        "Compte rendu net avec décisions, actions, responsables, échéances et points à suivre.",
    },
    {
      title: "Préparer l'agenda et le briefing d'une audience",
      before: "Informations éparses dans plusieurs e-mails et dossiers.",
      after:
        "Briefing synthétique : contexte, participants, enjeux, questions à poser, vigilance protocolaire.",
    },
    {
      title: "Synthétiser un dossier volumineux",
      before: "Lecture chronophage, messages clés noyés dans les annexes.",
      after:
        "Note de synthèse décisionnelle avec contexte, enjeux, risques, options et recommandation.",
    },
  ],
  rules: [
    "Ne jamais copier dans une IA ouverte : pièces d'identité, données RH, dossiers disciplinaires, marchés non publics, notes confidentielles, agendas sensibles, données de santé, informations diplomatiques ou de cabinet.",
    "Toujours anonymiser les noms, numéros, montants critiques, références de dossiers et tout élément permettant d'identifier une personne ou une affaire.",
    "Utiliser des prompts cadrés : contexte, objectif, format, ton, interdictions, niveau de prudence et validation humaine attendue.",
    "Relire systématiquement avant envoi ou diffusion : l'IA assiste, mais ne décide ni ne valide seule.",
  ],
  promptMethod: [
    "1. Rôle : “Agis comme un assistant de direction en environnement institutionnel.”",
    "2. Contexte : “Voici une situation anonymisée et le niveau de sensibilité.”",
    "3. Tâche : “Rédige / résume / structure / reformule sans inventer.”",
    "4. Contraintes : ton, longueur, niveau hiérarchique, éléments interdits.",
    "5. Format : courrier, note, tableau d'actions, briefing, mail, PV.",
    "6. Sécurité : signaler les données à masquer et les informations manquantes.",
  ],
  prompts: [
    "Courrier : “Rédige un courrier officiel à partir de ces éléments. Ton sobre, institutionnel, sans invention. Signale les informations manquantes.”",
    "PV : “À partir de ces notes anonymisées, produis un compte rendu avec décisions, actions, responsables, délais et points sensibles.”",
    "Synthèse : “Analyse ces documents anonymisés et produis une note d'une page : contexte, enjeux, risques, points à arbitrer, recommandation.”",
  ],
  webinar: [
    "Format conseillé : 45 à 60 minutes",
    "Objectif : rassurer, sensibiliser et convertir vers la formation complète",
    "Contenu : ce que l'IA peut faire, limites, 5 erreurs à éviter, données sensibles, 2 démonstrations métier",
    "CTA final : inscription à la formation de 2 jours ou demande de session intra",
  ],
  pricing: [
    "Inter-entreprises : 175 000 à 275 000 FCFA par participant",
    "Intra standard 12 à 20 participants : 3,5 à 5,5 millions FCFA",
    "Version premium administration, cabinet, diplomatie : 6 à 8,5 millions FCFA",
    "Pilote de lancement recommandé : 3,2 à 3,8 millions FCFA pour la première cohorte vitrine",
  ],
  deliverables: [
    "Support PowerPoint et version PDF",
    "Bibliothèque de prompts métier prête à l'emploi",
    "Check-list de protection des données sensibles",
    "Mini-charte interne d'usage de l'IA",
    "Études de cas corrigées et attestation de participation",
  ],
};

function writeBlob(targetPath, blob) {
  return fs.writeFile(targetPath, new Uint8Array(blob));
}

function shape(slide, options) {
  return slide.shapes.add(options);
}

function rect(slide, left, top, width, height, fill, options = {}) {
  return shape(slide, {
    geometry: options.geometry || "rect",
    position: { left, top, width, height },
    fill,
    line: {
      style: "solid",
      fill: options.lineFill || fill,
      width: options.lineWidth ?? 0,
    },
    shadow: options.shadow || "none",
    borderRadius: options.borderRadius,
  });
}

function text(slide, value, left, top, width, height, options = {}) {
  const box = shape(slide, {
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
    italic: options.italic || false,
    color: options.color || COLORS.text,
    align: options.align || "left",
    valign: options.valign || "top",
  };
  if (options.fit === "shrink") {
    box.text.fit = "shrink";
  }
  return box;
}

function bulletList(slide, items, left, top, width, height, options = {}) {
  const bulletText = items.map((item) => `• ${item}`).join("\n");
  return text(slide, bulletText, left, top, width, height, {
    fontSize: options.fontSize ?? 16,
    color: options.color || COLORS.muted,
    fit: "shrink",
    fontFace: options.fontFace || "Aptos",
    bold: options.bold || false,
  });
}

function addBackground(slide, fill = COLORS.bg) {
  slide.background.fill = fill;
}

function addFooter(slide, page, note = "TransferAI Africa | Formation IA pour secrétariats de direction et fonctions institutionnelles") {
  rect(slide, 62, 681, 1158, 1, COLORS.line, { lineWidth: 0 });
  text(slide, note, 72, 689, 930, 16, {
    fontSize: 8.5,
    color: COLORS.muted,
  });
  text(slide, String(page).padStart(2, "0"), 1146, 687, 46, 18, {
    fontSize: 10,
    color: COLORS.text,
    bold: true,
    align: "right",
  });
}

function addKicker(slide, label, left = 72, top = 50, color = COLORS.amber) {
  text(slide, label.toUpperCase(), left, top, 300, 18, {
    fontSize: 10.5,
    bold: true,
    color,
  });
}

function addTitle(slide, value, left, top, width, height, fontSize = 31, color = COLORS.text) {
  return text(slide, value, left, top, width, height, {
    fontSize,
    bold: true,
    color,
    fontFace: "Aptos Display",
    fit: "shrink",
  });
}

function card(slide, left, top, width, height, options = {}) {
  rect(slide, left, top, width, height, options.fill || COLORS.paper, {
    geometry: options.geometry || "roundRect",
    lineFill: options.border || COLORS.line,
    lineWidth: options.borderWidth ?? 1,
    borderRadius: options.borderRadius || "rounded-2xl",
    shadow: options.shadow || "shadow-sm",
  });
}

function pill(slide, value, left, top, fill, color, width = 180) {
  rect(slide, left, top, width, 30, fill, {
    geometry: "roundRect",
    lineFill: fill,
    lineWidth: 0,
    borderRadius: "rounded-3xl",
  });
  text(slide, value, left + 10, top + 7, width - 20, 16, {
    fontSize: 10.5,
    bold: true,
    color,
    align: "center",
  });
}

async function addImage(slide, imagePath, left, top, width, height, options = {}) {
  const bytes = await fs.readFile(imagePath);
  slide.images.add({
    blob: bytes,
    contentType: options.contentType || (imagePath.endsWith(".png") ? "image/png" : "image/jpeg"),
    alt: options.alt || "Visual",
    fit: options.fit || "cover",
    geometry: options.geometry || "roundRect",
    borderRadius: options.borderRadius || "rounded-2xl",
    position: { left, top, width, height },
  });
}

function statCard(slide, left, top, width, height, value, label, accent) {
  card(slide, left, top, width, height, { fill: COLORS.paper, border: COLORS.line });
  rect(slide, left + 16, top + 16, 4, height - 32, accent, { lineWidth: 0 });
  text(slide, value, left + 34, top + 16, width - 50, 28, {
    fontSize: 24,
    bold: true,
    color: COLORS.text,
    fontFace: "Aptos Display",
  });
  text(slide, label, left + 34, top + 50, width - 50, 28, {
    fontSize: 10.2,
    bold: true,
    color: COLORS.muted,
  });
}

function themeCard(slide, left, top, width, height, theme) {
  card(slide, left, top, width, height, { fill: COLORS.paper, border: COLORS.line });
  rect(slide, left, top, width, 10, theme.accent, {
    geometry: "roundRect",
    lineFill: theme.accent,
    borderRadius: "rounded-2xl",
    lineWidth: 0,
  });
  text(slide, theme.title, left + 20, top + 28, width - 40, 54, {
    fontSize: 18,
    bold: true,
    color: COLORS.text,
    fontFace: "Aptos Display",
    fit: "shrink",
  });
  text(slide, theme.detail, left + 20, top + 90, width - 40, height - 108, {
    fontSize: 13.6,
    color: COLORS.muted,
    fit: "shrink",
  });
}

function useCaseCard(slide, left, top, width, height, item, accent) {
  card(slide, left, top, width, height, { fill: COLORS.paper, border: COLORS.line });
  pill(slide, "CAS D'USAGE", left + 18, top + 18, COLORS.amberSoft, COLORS.amber, 116);
  text(slide, item.title, left + 18, top + 58, width - 36, 48, {
    fontSize: 16,
    bold: true,
    color: COLORS.text,
    fontFace: "Aptos Display",
    fit: "shrink",
  });
  text(slide, "Avant", left + 18, top + 114, 90, 18, {
    fontSize: 10,
    bold: true,
    color: COLORS.amber,
  });
  text(slide, item.before, left + 18, top + 136, width - 36, 52, {
    fontSize: 12.5,
    color: COLORS.muted,
    fit: "shrink",
  });
  rect(slide, left + 18, top + 198, width - 36, 1, COLORS.line, { lineWidth: 0 });
  text(slide, "Après", left + 18, top + 212, 90, 18, {
    fontSize: 10,
    bold: true,
    color: accent,
  });
  text(slide, item.after, left + 18, top + 236, width - 36, height - 254, {
    fontSize: 12.5,
    color: COLORS.text,
    fit: "shrink",
  });
}

function scheduleCard(slide, left, top, width, height, titleValue, items, accent, fill = COLORS.paper) {
  card(slide, left, top, width, height, { fill, border: COLORS.line });
  rect(slide, left, top, width, 10, accent, {
    geometry: "roundRect",
    lineFill: accent,
    borderRadius: "rounded-2xl",
    lineWidth: 0,
  });
  text(slide, titleValue, left + 18, top + 24, width - 36, 28, {
    fontSize: 18,
    bold: true,
    color: COLORS.text,
    fontFace: "Aptos Display",
  });
  let currentTop = top + 68;
  items.forEach((entry) => {
    text(slide, entry.time, left + 18, currentTop, 90, 18, {
      fontSize: 10,
      bold: true,
      color: accent,
    });
    text(slide, entry.title, left + 118, currentTop - 1, width - 136, 24, {
      fontSize: 13.5,
      bold: true,
      color: COLORS.text,
      fontFace: "Aptos Display",
      fit: "shrink",
    });
    text(slide, entry.detail, left + 118, currentTop + 18, width - 136, 40, {
      fontSize: 11.5,
      color: COLORS.muted,
      fit: "shrink",
    });
    currentTop += 64;
  });
}

function pricingCard(slide, left, top, width, height, titleValue, items, fill, accent) {
  card(slide, left, top, width, height, { fill, border: fill });
  text(slide, titleValue, left + 18, top + 20, width - 36, 26, {
    fontSize: 19,
    bold: true,
    color: COLORS.text,
    fontFace: "Aptos Display",
  });
  bulletList(slide, items, left + 18, top + 62, width - 36, height - 80, {
    fontSize: 12.6,
    color: COLORS.text,
  });
  rect(slide, left + 18, top + 20, 6, 28, accent, { lineWidth: 0 });
}

async function slide01(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.bg);
  rect(slide, 0, 0, 730, 720, COLORS.bg, { lineWidth: 0 });
  rect(slide, 730, 0, 550, 720, COLORS.sand, { lineWidth: 0 });
  await addImage(slide, ASSETS.hero, 760, 132, 470, 456, {
    alt: "Equipe en formation",
    fit: "cover",
  });
  card(slide, 60, 82, 580, 470, { fill: COLORS.paper, border: COLORS.line });
  await addImage(slide, ASSETS.logo, 84, 108, 180, 62, {
    alt: "Logo TransferAI",
    fit: "contain",
    geometry: "rect",
    borderRadius: 0,
  });
  text(slide, "FORMATION PROFESSIONNELLE IA", 84, 188, 260, 18, {
    fontSize: 10.5,
    bold: true,
    color: COLORS.amber,
  });
  addTitle(slide, DECK.title, 84, 220, 500, 92, 30);
  text(slide, DECK.subtitle, 84, 322, 490, 74, {
    fontSize: 17,
    color: COLORS.text,
    fit: "shrink",
  });
  text(slide, DECK.promise, 84, 406, 490, 78, {
    fontSize: 15.5,
    color: COLORS.muted,
    fit: "shrink",
  });
  pill(slide, "Webinaire gratuit en prélude", 84, 500, COLORS.greenSoft, COLORS.green, 212);
  pill(slide, "Programme détaillé sur 2 jours", 310, 500, COLORS.amberSoft, COLORS.amber, 220);
  statCard(slide, 60, 574, 158, 84, "2 jours", "formation intensive", COLORS.amber);
  statCard(slide, 234, 574, 158, 84, "4", "thématiques vendables", COLORS.green);
  statCard(slide, 408, 574, 158, 84, "4", "cas d'usage concrets", "335E8A");
  card(slide, 812, 74, 352, 202, { fill: COLORS.navy, border: COLORS.navy });
  text(slide, "Promesse commerciale", 840, 98, 160, 16, {
    fontSize: 10,
    bold: true,
    color: COLORS.sandDeep,
  });
  addTitle(slide, "Productivité administrative sécurisée", 840, 126, 292, 70, 22, COLORS.white);
  text(
    slide,
    "Vendre l'offre non comme une simple initiation ChatGPT, mais comme une montée en compétences IA adaptée aux environnements sensibles.",
    840,
    206,
    292,
    54,
    {
      fontSize: 11.6,
      color: COLORS.white,
      fit: "shrink",
    },
  );
  addFooter(slide, 1);
}

function slide02(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.paper);
  addKicker(slide, "Contexte et opportunité");
  addTitle(slide, "Pourquoi cette formation répond à un besoin immédiat", 72, 78, 760, 54, 29);
  card(slide, 72, 164, 530, 418, { fill: COLORS.paper, border: COLORS.line });
  text(slide, "Les attentes métier remontées sur le terrain", 98, 190, 360, 24, {
    fontSize: 18,
    bold: true,
    color: COLORS.text,
    fontFace: "Aptos Display",
  });
  bulletList(
    slide,
    [
      "Rédaction de courriers et e-mails plus rapide, sans perte de qualité formelle.",
      "Production de comptes rendus, procès-verbaux et notes de synthèse plus fiable.",
      "Organisation d'agendas, préparation de réunions et suivi administratif allégés.",
      "Recherche d'informations, classement documentaire et préparation de présentations accélérés.",
      "Traduction, reformulation et amélioration du ton institutionnel ou diplomatique.",
    ],
    98,
    232,
    470,
    300,
    { fontSize: 13.8, color: COLORS.muted },
  );
  card(slide, 634, 164, 574, 180, { fill: COLORS.sky, border: COLORS.sky });
  text(slide, "Ce que la formation doit démontrer", 662, 190, 280, 18, {
    fontSize: 10.5,
    bold: true,
    color: COLORS.amber,
  });
  addTitle(slide, "Des gains concrets sans exposer les données sensibles", 662, 218, 500, 58, 24);
  text(
    slide,
    "Le différenciateur clé sur ce public n'est pas l'outil. C'est la capacité à montrer des usages utiles, cadrés et compatibles avec les exigences de confidentialité.",
    662,
    282,
    500,
    44,
    {
      fontSize: 13.4,
      color: COLORS.text,
      fit: "shrink",
    },
  );
  card(slide, 634, 366, 574, 216, { fill: COLORS.sand, border: COLORS.sand });
  text(slide, "Publics prioritaires", 662, 392, 200, 18, {
    fontSize: 10.5,
    bold: true,
    color: COLORS.amber,
  });
  bulletList(slide, DECK.audience, 662, 422, 500, 132, {
    fontSize: 13.8,
    color: COLORS.text,
  });
  addFooter(slide, 2);
}

function slide03(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.bg);
  addKicker(slide, "Offre");
  addTitle(slide, "Les 4 thématiques que nous pouvons commercialiser", 72, 78, 800, 54, 29);
  themeCard(slide, 72, 166, 548, 190, DECK.themes[0]);
  themeCard(slide, 660, 166, 548, 190, DECK.themes[1]);
  themeCard(slide, 72, 390, 548, 190, DECK.themes[2]);
  themeCard(slide, 660, 390, 548, 190, DECK.themes[3]);
  card(slide, 72, 606, 1136, 42, { fill: COLORS.paper, border: COLORS.line, shadow: "none" });
  text(
    slide,
    "Positionnement recommandé : une offre premium de productivité administrative sécurisée et de maîtrise professionnelle de l'IA en environnement sensible.",
    94,
    618,
    1092,
    20,
    {
      fontSize: 11.8,
      color: COLORS.text,
      bold: true,
      align: "center",
      fit: "shrink",
    },
  );
  addFooter(slide, 3);
}

function slide04(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.paper);
  addKicker(slide, "Cas pratiques");
  addTitle(slide, "Les 4 usages concrets à démontrer pendant la formation", 72, 78, 850, 54, 29);
  useCaseCard(slide, 72, 164, 548, 212, DECK.useCases[0], COLORS.green);
  useCaseCard(slide, 660, 164, 548, 212, DECK.useCases[1], "335E8A");
  useCaseCard(slide, 72, 402, 548, 212, DECK.useCases[2], COLORS.green);
  useCaseCard(slide, 660, 402, 548, 212, DECK.useCases[3], "335E8A");
  addFooter(slide, 4);
}

async function slide05(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.bg);
  rect(slide, 0, 0, 1280, 720, COLORS.navy, { lineWidth: 0 });
  await addImage(slide, ASSETS.banner, 710, 84, 500, 270, {
    alt: "Outils IA",
    fit: "cover",
  });
  addKicker(slide, "Protection des données", 74, 58, COLORS.amberSoft);
  addTitle(slide, "Ce qu'il faut absolument cadrer avant tout usage de l'IA", 74, 92, 560, 110, 34, COLORS.white);
  text(
    slide,
    "Cette séquence fait la différence sur des profils exposés à des informations sensibles : ministère, diplomatie, direction générale, RH, marchés, dossiers administratifs.",
    74,
    220,
    560,
    72,
    {
      fontSize: 16,
      color: "DCE7F2",
      fit: "shrink",
    },
  );
  card(slide, 74, 332, 560, 280, { fill: "21415F", border: "21415F" });
  bulletList(slide, DECK.rules, 98, 356, 512, 230, {
    fontSize: 13.6,
    color: COLORS.white,
  });
  card(slide, 710, 384, 500, 228, { fill: COLORS.paper, border: COLORS.line });
  text(slide, "Message pédagogique à marteler", 736, 410, 220, 18, {
    fontSize: 10.5,
    bold: true,
    color: COLORS.amber,
  });
  addTitle(slide, "L'IA assiste, mais ne remplace ni le secret professionnel, ni la validation humaine.", 736, 438, 430, 74, 22);
  text(
    slide,
    "Chaque démonstration doit montrer une version risquée, puis une version sécurisée et anonymisée du même prompt.",
    736,
    522,
    430,
    48,
    {
      fontSize: 13.6,
      color: COLORS.muted,
      fit: "shrink",
    },
  );
  addFooter(slide, 5, "Séquence essentielle : usages utiles, mais cadre de confidentialité non négociable.");
}

function slide06(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.paper);
  addKicker(slide, "Prompts professionnels");
  addTitle(slide, "La méthode de prompt à enseigner aux participants", 72, 78, 760, 54, 29);
  card(slide, 72, 164, 516, 430, { fill: COLORS.paper, border: COLORS.line });
  text(slide, "Structure simple à mémoriser", 98, 190, 250, 24, {
    fontSize: 18,
    bold: true,
    color: COLORS.text,
    fontFace: "Aptos Display",
  });
  bulletList(slide, DECK.promptMethod, 98, 232, 462, 324, {
    fontSize: 14.2,
    color: COLORS.text,
  });
  card(slide, 622, 164, 586, 430, { fill: COLORS.sky, border: COLORS.sky });
  text(slide, "Exemples de prompts à remettre dans le support", 648, 190, 300, 24, {
    fontSize: 18,
    bold: true,
    color: COLORS.text,
    fontFace: "Aptos Display",
  });
  bulletList(slide, DECK.prompts, 648, 232, 520, 300, {
    fontSize: 13.6,
    color: COLORS.text,
  });
  card(slide, 648, 500, 520, 70, { fill: COLORS.paper, border: COLORS.line, shadow: "none" });
  text(
    slide,
    "Réflexe à transmettre : demander à l'IA d'indiquer ce qui manque, ce qui est ambigu et ce qui doit être validé avant envoi.",
    672,
    518,
    472,
    30,
    {
      fontSize: 12.6,
      color: COLORS.muted,
      align: "center",
      fit: "shrink",
    },
  );
  addFooter(slide, 6);
}

function slide07(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.bg);
  addKicker(slide, "Jour 1");
  addTitle(slide, "Programme détaillé | matinée", 72, 78, 620, 54, 29);
  scheduleCard(
    slide,
    72,
    164,
    1136,
    452,
    "Jour 1 - Matin",
    [
      {
        time: "08h30 - 09h00",
        title: "Accueil, cadrage et attentes",
        detail: "Positionnement de la session, recueil des besoins, diagnostic rapide des usages actuels.",
      },
      {
        time: "09h00 - 10h00",
        title: "Panorama des outils IA utiles à l'assistanat de direction",
        detail: "Ce que l'IA sait faire aujourd'hui, limites, erreurs fréquentes, points de vigilance.",
      },
      {
        time: "10h15 - 11h15",
        title: "Principes de confidentialité et données sensibles",
        detail: "Typologie des données à risque, anonymisation, validation humaine, réflexes à adopter.",
      },
      {
        time: "11h15 - 12h30",
        title: "Atelier 1 : courriers, e-mails, reformulation et traduction",
        detail: "Démonstrations guidées, prompts sûrs, ton institutionnel et cas sensibles.",
      },
    ],
    COLORS.amber,
  );
  pill(slide, "Objectif pédagogique : sécuriser les fondamentaux dès le premier demi-jour.", 236, 634, COLORS.amberSoft, COLORS.amber, 808);
  addFooter(slide, 7);
}

function slide08(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.paper);
  addKicker(slide, "Jour 1");
  addTitle(slide, "Programme détaillé | après-midi", 72, 78, 650, 54, 29);
  scheduleCard(
    slide,
    72,
    164,
    1136,
    452,
    "Jour 1 - Après-midi",
    [
      {
        time: "13h30 - 14h30",
        title: "Atelier 2 : réunions, agendas, ordres du jour et briefings",
        detail: "Préparer une audience, structurer un agenda, bâtir une note de préparation.",
      },
      {
        time: "14h30 - 15h45",
        title: "Atelier 3 : comptes rendus et procès-verbaux",
        detail: "Passer de notes brutes à un document exploitable avec décisions, actions et échéances.",
      },
      {
        time: "16h00 - 17h00",
        title: "Mise en situation encadrée",
        detail: "Exercice fil rouge à partir d'une réunion fictive de direction ou d'un cabinet.",
      },
      {
        time: "17h00 - 17h30",
        title: "Debrief et capitalisation",
        detail: "Erreurs observées, bonnes formulations, check-list de relecture avant validation.",
      },
    ],
    COLORS.green,
    COLORS.greenSoft,
  );
  pill(slide, "Objectif pédagogique : produire des livrables administratifs immédiatement réutilisables.", 202, 634, COLORS.greenSoft, COLORS.green, 876);
  addFooter(slide, 8);
}

function slide09(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.bg);
  addKicker(slide, "Jour 2");
  addTitle(slide, "Programme détaillé | matinée", 72, 78, 620, 54, 29);
  scheduleCard(
    slide,
    72,
    164,
    1136,
    452,
    "Jour 2 - Matin",
    [
      {
        time: "08h30 - 09h30",
        title: "Atelier 4 : classement, gestion documentaire et recherche",
        detail: "Structurer les dossiers, résumer des documents longs, retrouver l'information utile.",
      },
      {
        time: "09h30 - 10h45",
        title: "Atelier 5 : notes de synthèse et supports de présentation",
        detail: "Produire une note d'aide à la décision et un plan de présentation à partir d'un dossier.",
      },
      {
        time: "11h00 - 12h30",
        title: "Travaux pratiques croisés",
        detail: "Courrier + synthèse + briefing + présentation sur un même cas institutionnel.",
      },
    ],
    "335E8A",
    COLORS.sky,
  );
  pill(slide, "Objectif pédagogique : apprendre à faire parler les documents sans noyer la décision.", 226, 634, COLORS.sky, "335E8A", 828);
  addFooter(slide, 9);
}

function slide10(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.paper);
  addKicker(slide, "Jour 2");
  addTitle(slide, "Programme détaillé | après-midi et clôture", 72, 78, 750, 54, 29);
  scheduleCard(
    slide,
    72,
    164,
    724,
    452,
    "Jour 2 - Après-midi",
    [
      {
        time: "13h30 - 14h30",
        title: "Bibliothèque de prompts métier",
        detail: "Construire les prompts types par situation : courrier, PV, note, briefing, synthèse.",
      },
      {
        time: "14h30 - 15h45",
        title: "Charte interne et protocole de validation",
        detail: "Règles minimales d'usage, rôles, niveaux de sensibilité, étapes de contrôle.",
      },
      {
        time: "16h00 - 17h00",
        title: "Évaluation finale et restitution",
        detail: "Cas pratique final, corrections, engagements d'application dans le poste.",
      },
    ],
    COLORS.amber,
    COLORS.sand,
  );
  pricingCard(
    slide,
    830,
    164,
    378,
    218,
    "Livrables remis",
    DECK.deliverables,
    COLORS.paper,
    COLORS.green,
  );
  pricingCard(
    slide,
    830,
    398,
    378,
    218,
    "Résultat attendu",
    [
      "Des participants capables d'utiliser l'IA sans mettre l'organisation en risque.",
      "Des gains de temps visibles dès les premiers usages.",
      "Une base commune de prompts et de réflexes de confidentialité.",
    ],
    COLORS.greenSoft,
    COLORS.amber,
  );
  addFooter(slide, 10);
}

async function slide11(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.bg);
  rect(slide, 0, 0, 1280, 720, COLORS.sand, { lineWidth: 0 });
  card(slide, 60, 72, 626, 576, { fill: COLORS.paper, border: COLORS.line });
  addKicker(slide, "Prélude commercial", 88, 98);
  addTitle(slide, "Le webinaire gratuit qui prépare la vente", 88, 130, 520, 72, 28);
  text(
    slide,
    "Titre conseillé : “IA au service des secrétariats de direction : gains rapides, limites et protection des données sensibles”.",
    88,
    214,
    520,
    64,
    {
      fontSize: 15.2,
      color: COLORS.text,
      fit: "shrink",
    },
  );
  bulletList(slide, DECK.webinar, 88, 294, 520, 186, {
    fontSize: 14,
    color: COLORS.muted,
  });
  card(slide, 88, 500, 570, 118, { fill: COLORS.sky, border: COLORS.sky });
  text(slide, "Objectif commercial", 112, 522, 180, 18, {
    fontSize: 10.5,
    bold: true,
    color: COLORS.amber,
  });
  text(
    slide,
    "Rassurer, éveiller le besoin, faire sentir le risque sur les données et convertir vers la session complète de 2 jours.",
    112,
    550,
    520,
    42,
    {
      fontSize: 13.4,
      color: COLORS.text,
      fit: "shrink",
    },
  );
  await addImage(slide, ASSETS.banner, 730, 86, 480, 256, {
    alt: "Webinaire IA",
    fit: "cover",
  });
  pricingCard(
    slide,
    730,
    374,
    480,
    244,
    "Script simple du webinaire",
    [
      "1. Ce que l'IA peut faire pour ces métiers",
      "2. Ce que l'IA ne doit jamais recevoir comme données",
      "3. Deux démonstrations métier sécurisées",
      "4. Questions-réponses",
      "5. Invitation à la formation complète",
    ],
    COLORS.paper,
    COLORS.green,
  );
  addFooter(slide, 11);
}

function slide12(presentation) {
  const slide = presentation.slides.add();
  addBackground(slide, COLORS.paper);
  addKicker(slide, "Commercialisation");
  addTitle(slide, "Prix conseillé et formats de vente sur le marché ivoirien", 72, 78, 900, 54, 29);
  pricingCard(slide, 72, 164, 352, 224, "Fourchette inter-entreprises", [DECK.pricing[0]], COLORS.amberSoft, COLORS.amber);
  pricingCard(slide, 464, 164, 352, 224, "Fourchette intra standard", [DECK.pricing[1]], COLORS.greenSoft, COLORS.green);
  pricingCard(slide, 856, 164, 352, 224, "Offre premium sensible", [DECK.pricing[2]], COLORS.sky, "335E8A");
  pricingCard(slide, 72, 416, 520, 180, "Lancement recommandé", [DECK.pricing[3]], COLORS.paper, COLORS.amber);
  pricingCard(
    slide,
    624,
    416,
    584,
    180,
    "Conseil de vente",
    [
      "Ne pas vendre “une formation ChatGPT”.",
      "Vendre une montée en compétence IA adaptée à l'administration, au cabinet et aux environnements sensibles.",
      "Mettre en avant : productivité, qualité rédactionnelle, sécurité des données, bibliothèque de prompts et cas métier.",
    ],
    COLORS.paper,
    COLORS.green,
  );
  card(slide, 72, 620, 1136, 42, { fill: COLORS.navy, border: COLORS.navy, shadow: "none" });
  text(
    slide,
    "Sortie recommandée : proposer un webinaire gratuit, puis une session pilote intra avant déploiement plus large.",
    94,
    632,
    1092,
    18,
    {
      fontSize: 11.8,
      color: COLORS.white,
      bold: true,
      align: "center",
      fit: "shrink",
    },
  );
  addFooter(slide, 12);
}

async function ensureWorkspace() {
  await fs.mkdir(BUILD_DIR, { recursive: true });
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(LAYOUT_DIR, { recursive: true });
  await fs.mkdir(QA_DIR, { recursive: true });
  await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });

  await fs.writeFile(
    path.join(WORKSPACE, "profile-plan.txt"),
    [
      "task mode: create",
      "primary deck-profile: executive training offer",
      "audience: secretariat de direction, diplomatie, administration civile, cabinet ministeriel",
      "priority theme: protection des donnees sensibles face a l'IA",
      "required outputs: detailed 2-day program, concrete use cases, webinar, pricing",
    ].join("\n"),
    "utf8",
  );

  await fs.writeFile(
    path.join(WORKSPACE, "claim-spine.txt"),
    [
      "1. The deck must make the offer feel premium and immediately sellable.",
      "2. Data sensitivity and human validation are the strongest differentiators.",
      "3. The program must be concrete enough to run without major rewriting.",
      "4. The webinar is the warm-up mechanism that feeds the paid cohort.",
    ].join("\n"),
    "utf8",
  );

  await fs.writeFile(
    path.join(WORKSPACE, "design-system.txt"),
    [
      "palette: paper, navy, amber, green, sand",
      "tone: executive, institutional, warm and premium",
      "typography: Aptos Display headlines, Aptos body",
      "layout: editorial panels with strong spacing and minimal noise",
    ].join("\n"),
    "utf8",
  );

  await fs.writeFile(
    path.join(WORKSPACE, "source-notes.txt"),
    [
      "Inputs used:",
      "- User brief in French about IA training for secretariat, diplomacy and administration",
      "- User emphasis on sensitive data protection, prompts and 4 concrete use cases",
      "- Existing TransferAI visual assets in src/assets",
      "- Prior pricing guidance estimated for the Ivorian market",
    ].join("\n"),
    "utf8",
  );
}

async function exportArtifacts(presentation) {
  const qaLines = [];
  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    const png = await presentation.export({ slide, format: "png", scale: 1 });
    await writeBlob(path.join(PREVIEW_DIR, `${stem}.png`), await png.arrayBuffer());

    const layout = await slide.export({ format: "layout" });
    const layoutText = await layout.text();
    await fs.writeFile(path.join(LAYOUT_DIR, `${stem}.layout.json`), layoutText, "utf8");
    qaLines.push(`${stem}: exported preview + layout`);
  }

  const montage = await presentation.export({ format: "webp", montage: true, scale: 1 });
  await writeBlob(path.join(PREVIEW_DIR, "deck-montage.webp"), await montage.arrayBuffer());

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);

  await fs.writeFile(path.join(QA_DIR, "layout-scorecard.txt"), qaLines.join("\n"), "utf8");
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
  await slide05(presentation);
  slide06(presentation);
  slide07(presentation);
  slide08(presentation);
  slide09(presentation);
  slide10(presentation);
  await slide11(presentation);
  slide12(presentation);

  await exportArtifacts(presentation);
  console.log(FINAL_PPTX);
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
