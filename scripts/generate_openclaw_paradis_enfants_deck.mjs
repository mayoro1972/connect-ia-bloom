import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { FileBlob, Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const OUTPUT_DIR = path.join(ROOT, "outputs", "openclaw-paradis-enfants-deck");
const FINAL_PPTX = path.join(OUTPUT_DIR, "OpenClaw_Paradis_Enfants_Deck.pptx");
const PREVIEW_DIR = path.join(OUTPUT_DIR, "preview");
const LAYOUT_DIR = path.join(OUTPUT_DIR, "layout");

const COLORS = {
  navy: "1F2A7A",
  blue: "324CFF",
  pink: "FF5ABF",
  blush: "FFE8F6",
  cream: "FFF9F3",
  gold: "D89C32",
  mint: "EAF7F2",
  slate: "475569",
  text: "172033",
  light: "F8FAFC",
  white: "FFFFFF",
  line: "D7DCE8",
  success: "1F9D72",
};

function writeBuffer(targetPath, bytes) {
  return fs.writeFile(targetPath, new Uint8Array(bytes));
}

function addTextbox(slide, opts) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: opts.position,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = opts.text;
  shape.text.style = {
    fontFace: opts.fontFace || "Aptos",
    fontSize: opts.fontSize,
    bold: opts.bold || false,
    italic: opts.italic || false,
    color: opts.color || COLORS.text,
    align: opts.align || "left",
    valign: opts.valign || "top",
  };
  if (opts.fit === "shrink") {
    shape.text.fit = "shrink";
  }
  return shape;
}

function addPanel(slide, opts) {
  const shapeConfig = {
    geometry: opts.geometry || "roundRect",
    position: opts.position,
    fill: opts.fill,
    line: {
      style: "solid",
      fill: opts.lineFill || opts.fill,
      width: opts.lineWidth ?? 1,
    },
    shadow: opts.shadow || "shadow-sm",
  };
  if ((opts.geometry || "roundRect") === "roundRect" || (opts.geometry || "roundRect") === "rect" || (opts.geometry || "roundRect") === "textbox") {
    shapeConfig.borderRadius = opts.borderRadius || "rounded-2xl";
  }
  return slide.shapes.add(shapeConfig);
}

function addBulletList(slide, opts) {
  const text = opts.items.map((item) => `• ${item}`).join("\n");
  return addTextbox(slide, {
    text,
    position: opts.position,
    fontSize: opts.fontSize || 18,
    color: opts.color || COLORS.text,
    fit: "shrink",
  });
}

function addTag(slide, text, left, top, fill, color = COLORS.text, width = 180) {
  addPanel(slide, {
    position: { left, top, width, height: 34 },
    fill,
    lineFill: fill,
    lineWidth: 0,
    borderRadius: "rounded-3xl",
    shadow: "none",
  });
  addTextbox(slide, {
    text,
    position: { left: left + 12, top: top + 7, width: width - 24, height: 20 },
    fontSize: 14,
    bold: true,
    color,
    align: "center",
  });
}

function addArrowText(slide, text, left, top) {
  addTextbox(slide, {
    text,
    position: { left, top, width: 46, height: 26 },
    fontSize: 24,
    bold: true,
    color: COLORS.pink,
    align: "center",
  });
}

async function ensureDirs() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(LAYOUT_DIR, { recursive: true });
}

function addBaseChrome(slide, title, eyebrow = "LIVE TIKTOK • TRANSFERAI x NETTELECOM CI") {
  slide.background.fill = COLORS.cream;

  addPanel(slide, {
    geometry: "ellipse",
    position: { left: -80, top: -50, width: 300, height: 300 },
    fill: COLORS.blush,
    lineFill: COLORS.blush,
    lineWidth: 0,
    shadow: "none",
  });

  addPanel(slide, {
    geometry: "ellipse",
    position: { left: 1030, top: 520, width: 260, height: 260 },
    fill: "E8ECFF",
    lineFill: "E8ECFF",
    lineWidth: 0,
    shadow: "none",
  });

  addTextbox(slide, {
    text: eyebrow,
    position: { left: 74, top: 42, width: 320, height: 24 },
    fontSize: 13,
    bold: true,
    color: COLORS.pink,
  });

  addTextbox(slide, {
    text: title,
    position: { left: 72, top: 76, width: 1136, height: 84 },
    fontSize: 32,
    bold: true,
    color: COLORS.navy,
    fit: "shrink",
  });

  addTextbox(slide, {
    text: "Projet piloté par TransferAI, notre hub IA, en collaboration avec Nettelecom CI",
    position: { left: 72, top: 664, width: 1090, height: 20 },
    fontSize: 13,
    color: COLORS.slate,
  });
}

function coverSlide(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = COLORS.cream;

  addPanel(slide, {
    geometry: "ellipse",
    position: { left: -40, top: -20, width: 360, height: 360 },
    fill: COLORS.blush,
    lineFill: COLORS.blush,
    lineWidth: 0,
    shadow: "none",
  });
  addPanel(slide, {
    geometry: "ellipse",
    position: { left: 850, top: 40, width: 380, height: 380 },
    fill: "E6EAFF",
    lineFill: "E6EAFF",
    lineWidth: 0,
    shadow: "none",
  });
  addPanel(slide, {
    position: { left: 70, top: 470, width: 1140, height: 160 },
    fill: COLORS.blue,
    lineFill: COLORS.blue,
    lineWidth: 0,
    borderRadius: "rounded-3xl",
    shadow: "shadow-md",
  });

  addTextbox(slide, {
    text: "TRANSFERAI • NETTELECOM CI • PARADIS D'ENFANTS",
    position: { left: 82, top: 72, width: 620, height: 30 },
    fontSize: 16,
    bold: true,
    color: COLORS.pink,
  });
  addTextbox(slide, {
    text: "Comment TikTok, Facebook et WhatsApp deviennent\nune boutique pilotée par l'IA",
    position: { left: 80, top: 120, width: 760, height: 170 },
    fontSize: 40,
    bold: true,
    color: COLORS.navy,
    fit: "shrink",
  });
  addTextbox(slide, {
    text: "Une démonstration concrète du tunnel social commerce : attirer, convertir, enregistrer dans le CRM, relancer, vendre, encaisser et suivre.",
    position: { left: 82, top: 314, width: 650, height: 78 },
    fontSize: 21,
    color: COLORS.slate,
    fit: "shrink",
  });

  addTag(slide, "TikTok attire", 82, 410, "F7D6EB", COLORS.navy, 170);
  addTag(slide, "Facebook rassure", 266, 410, "EDEBFF", COLORS.navy, 190);
  addTag(slide, "WhatsApp convertit", 470, 410, "E5F5EF", COLORS.success, 198);

  addTextbox(slide, {
    text: "1. Les contenus sociaux créent la demande\n2. OpenClaw structure la conversation\n3. Le CRM garde la mémoire client\n4. La boutique relance, encaisse et suit mieux",
    position: { left: 102, top: 500, width: 570, height: 110 },
    fontSize: 21,
    color: COLORS.white,
    fit: "shrink",
  });
  addTextbox(slide, {
    text: "Support de démonstration commerciale\nProjet piloté par TransferAI, notre hub IA, en collaboration avec Nettelecom CI.",
    position: { left: 760, top: 520, width: 390, height: 74 },
    fontSize: 18,
    color: COLORS.white,
    fit: "shrink",
  });
  return slide;
}

function painSlide(presentation) {
  const slide = presentation.slides.add();
  addBaseChrome(slide, "Le vrai problème : les réseaux génèrent l'intérêt, mais la boutique perd encore des ventes");

  const left = { left: 72, top: 150, width: 540, height: 420 };
  const right = { left: 648, top: 150, width: 560, height: 420 };

  addPanel(slide, { position: left, fill: COLORS.white, lineFill: COLORS.line });
  addPanel(slide, { position: right, fill: "EDF1FF", lineFill: "D8DFFD" });

  addTextbox(slide, {
    text: "Sans OpenClaw",
    position: { left: 98, top: 176, width: 200, height: 30 },
    fontSize: 24,
    bold: true,
    color: COLORS.navy,
  });
  addBulletList(slide, {
    position: { left: 98, top: 228, width: 470, height: 270 },
    items: [
      "TikTok et Facebook attirent des clientes, mais les demandes se perdent en DM et sur WhatsApp.",
      "La vendeuse doit se souvenir de qui cherchait quelle taille ou quel article.",
      "Les nouveaux arrivages ne sont pas relancés vers les bonnes clientes.",
      "Les promotions sont diffusées à tout le monde sans priorité.",
      "Le soir, il n'y a pas de vision claire : qui a écrit, qui a acheté, qui doit être relancée.",
    ],
  });
  addTag(slide, "Fuite d'attention", 96, 514, "FFE6E6", "9A2E2E", 166);
  addTag(slide, "Fuite de suivi", 274, 514, "FFF0D8", "8A5612", 150);
  addTag(slide, "Fuite de relance", 436, 514, "FBE1F4", COLORS.navy, 164);

  addTextbox(slide, {
    text: "Ce que l'IA corrige",
    position: { left: 674, top: 176, width: 240, height: 30 },
    fontSize: 24,
    bold: true,
    color: COLORS.blue,
  });
  addBulletList(slide, {
    position: { left: 674, top: 228, width: 486, height: 270 },
    items: [
      "Chaque demande entrante est classée par canal, produit, taille, urgence et statut.",
      "OpenClaw transforme WhatsApp en point de conversion organisé.",
      "Le CRM garde la mémoire des clientes et des besoins en attente.",
      "La boutique sait qui relancer pour un nouvel arrivage, une promotion ou une livraison.",
      "Le pilotage quotidien devient lisible depuis Telegram ou un tableau simple.",
    ],
    color: COLORS.text,
  });
  addTextbox(slide, {
    text: "L'enjeu n'est pas seulement le stock.\nL'enjeu est de transformer le trafic social en conversations tracées, puis en ventes suivies.",
    position: { left: 674, top: 510, width: 470, height: 66 },
    fontSize: 20,
    bold: true,
    color: COLORS.navy,
    fit: "shrink",
  });
}

function funnelSlide(presentation) {
  const slide = presentation.slides.add();
  addBaseChrome(slide, "Le tunnel concret : TikTok et Facebook alimentent WhatsApp, OpenClaw organise, le CRM mémorise");

  const y = 260;
  const widths = [180, 180, 200, 180, 220];
  const labels = [
    ["TikTok / Facebook", "Vidéos, posts, messages et clics entrants"],
    ["WhatsApp", "Questions, tailles, prix, livraison"],
    ["OpenClaw", "Qualification, réponse, étiquetage, routage"],
    ["CRM", "Mémoire client, statut, prochaine action"],
    ["Relance & vente", "Arrivage, promo, commande, Mobile Money, livraison"],
  ];
  const fills = ["F7D6EB", "E5F5EF", "EDEBFF", "FFF5E7", "E8ECFF"];
  let left = 60;

  labels.forEach((pair, index) => {
    addPanel(slide, {
      position: { left, top: y, width: widths[index], height: 168 },
      fill: fills[index],
      lineFill: fills[index],
      lineWidth: 0,
      borderRadius: "rounded-3xl",
      shadow: "shadow-md",
    });
    addTextbox(slide, {
      text: pair[0],
      position: { left: left + 16, top: y + 20, width: widths[index] - 32, height: 40 },
      fontSize: 24,
      bold: true,
      color: index === 1 ? COLORS.success : COLORS.navy,
      align: "center",
    });
    addTextbox(slide, {
      text: pair[1],
      position: { left: left + 16, top: y + 74, width: widths[index] - 32, height: 64 },
      fontSize: 17,
      color: COLORS.text,
      align: "center",
      fit: "shrink",
    });
    if (index < labels.length - 1) {
      addArrowText(slide, "→", left + widths[index] + 8, y + 60);
    }
    left += widths[index] + 28;
  });

  addTextbox(slide, {
    text: "Lecture simple pour le client",
    position: { left: 86, top: 168, width: 360, height: 26 },
    fontSize: 20,
    bold: true,
    color: COLORS.pink,
  });
  addTextbox(slide, {
    text: "1. Les réseaux attirent\n2. WhatsApp convertit\n3. OpenClaw comprend le besoin\n4. Le CRM n'oublie rien\n5. La boutique relance, encaisse et suit mieux",
    position: { left: 84, top: 454, width: 520, height: 130 },
    fontSize: 22,
    color: COLORS.text,
    fit: "shrink",
  });

  addPanel(slide, {
    position: { left: 700, top: 474, width: 430, height: 108 },
    fill: COLORS.white,
    lineFill: COLORS.line,
  });
  addTextbox(slide, {
    text: "Exemple concret",
    position: { left: 724, top: 494, width: 180, height: 24 },
    fontSize: 20,
    bold: true,
    color: COLORS.blue,
  });
  addTextbox(slide, {
    text: "Une cliente voit un contenu TikTok, écrit sur WhatsApp pour un ensemble 6 mois. OpenClaw classe la demande, crée la fiche CRM, puis la boutique la relance, encaisse par Mobile Money et suit la livraison.",
    position: { left: 724, top: 524, width: 380, height: 44 },
    fontSize: 17,
    color: COLORS.text,
    fit: "shrink",
  });
}

function whatsappDemoSlide(presentation) {
  const slide = presentation.slides.add();
  addBaseChrome(slide, "Démonstration : ce qui se passe quand une cliente écrit sur WhatsApp");

  addPanel(slide, {
    position: { left: 82, top: 150, width: 420, height: 456 },
    fill: COLORS.white,
    lineFill: COLORS.line,
  });
  addPanel(slide, {
    position: { left: 540, top: 150, width: 596, height: 456 },
    fill: "EEF2FF",
    lineFill: "D8DFFD",
  });

  addTextbox(slide, {
    text: "Conversation cliente",
    position: { left: 108, top: 176, width: 220, height: 26 },
    fontSize: 24,
    bold: true,
    color: COLORS.navy,
  });

  const bubbles = [
    { text: "Bonjour, je cherche une tenue bébé 6 mois.", fill: "F4F6FA", color: COLORS.text, left: 108, top: 222, width: 300 },
    { text: "Bonjour madame. Est-ce pour fille, garçon ou mixte ?", fill: "E7F4EE", color: COLORS.success, left: 148, top: 294, width: 250 },
    { text: "Pour garçon. Je veux aussi savoir si vous livrez à Cocody.", fill: "F4F6FA", color: COLORS.text, left: 108, top: 368, width: 300 },
    { text: "Oui, livraison possible. Je vous prépare les options et j'enregistre votre besoin.", fill: "E7F4EE", color: COLORS.success, left: 148, top: 452, width: 250 },
  ];
  for (const bubble of bubbles) {
    addPanel(slide, {
      position: { left: bubble.left, top: bubble.top, width: bubble.width, height: 56 },
      fill: bubble.fill,
      lineFill: bubble.fill,
      lineWidth: 0,
      borderRadius: "rounded-2xl",
      shadow: "none",
    });
    addTextbox(slide, {
      text: bubble.text,
      position: { left: bubble.left + 14, top: bubble.top + 11, width: bubble.width - 28, height: 34 },
      fontSize: 16,
      color: bubble.color,
      fit: "shrink",
    });
  }

  addTextbox(slide, {
    text: "Actions OpenClaw en arrière-plan",
    position: { left: 566, top: 176, width: 320, height: 26 },
    fontSize: 24,
    bold: true,
    color: COLORS.blue,
  });
  addBulletList(slide, {
    position: { left: 566, top: 224, width: 520, height: 218 },
    fontSize: 18,
    items: [
      "Détecte la source : WhatsApp, issue d'un trafic social.",
      "Résume la demande : tenue bébé, 6 mois, garçon, livraison à Cocody.",
      "Affecte un statut : demande chaude / à traiter aujourd'hui.",
      "Propose la réponse type puis route vers la vendeuse si besoin.",
      "Prépare déjà la prochaine action : envoyer les visuels, le prix, le mode de paiement et la disponibilité.",
    ],
  });

  addPanel(slide, {
    position: { left: 566, top: 470, width: 520, height: 96 },
    fill: COLORS.white,
    lineFill: COLORS.line,
  });
  addTextbox(slide, {
    text: "Résultat business",
    position: { left: 590, top: 490, width: 220, height: 22 },
    fontSize: 18,
    bold: true,
    color: COLORS.pink,
  });
  addTextbox(slide, {
    text: "La conversation n'est plus juste un message.\nElle devient un lead structuré, une demande exploitable et une vente potentielle suivie.",
    position: { left: 590, top: 526, width: 468, height: 42 },
    fontSize: 16,
    color: COLORS.text,
    fit: "shrink",
  });
}

function crmSlide(presentation) {
  const slide = presentation.slides.add();
  addBaseChrome(slide, "Démonstration CRM : comment OpenClaw transforme une conversation en fiche cliente actionnable");

  addTextbox(slide, {
    text: "Le CRM ne sert pas seulement à stocker des noms.\nIl sert à ne plus oublier qui attend quoi, sur quel canal, et quelle relance doit partir.",
    position: { left: 72, top: 156, width: 960, height: 50 },
    fontSize: 18,
    color: COLORS.slate,
    fit: "shrink",
  });

  const crmValues = [
    ["Source", "Cliente", "Besoin", "Âge/Taille", "Statut CRM", "Prochaine action"],
    ["TikTok -> WhatsApp", "Aminata", "Ensemble bébé", "6 mois", "Lead chaud", "Envoyer 3 options aujourd'hui"],
    ["Facebook -> WhatsApp", "Awa", "Coffret naissance", "0-3 mois", "En attente de stock", "Relancer au prochain arrivage"],
    ["WhatsApp direct", "Mariam", "Pyjama enfant", "4 ans", "Commande à confirmer", "Valider le stock puis la livraison"],
    ["TikTok DM", "Fatou", "Robe fille", "12 mois", "À réactiver", "Promotion week-end à envoyer"],
  ];
  const table = slide.tables.add({
    rows: crmValues.length,
    columns: crmValues[0].length,
    left: 72,
    top: 246,
    width: 1132,
    height: 264,
    values: crmValues,
    columnWidths: [160, 120, 170, 100, 170, 412],
  });
  table.styleOptions = { headerRow: true, bandedRows: true };
  table.borders.assign({ style: "solid", fill: COLORS.line, width: 1 });
  for (let column = 0; column < crmValues[0].length; column += 1) {
    table.getCell(0, column).fill = COLORS.blue;
    table.getCell(0, column).text.style = {
      fontSize: 15,
      bold: true,
      color: COLORS.white,
      align: "center",
    };
  }
  for (let row = 1; row < crmValues.length; row += 1) {
    for (let column = 0; column < crmValues[0].length; column += 1) {
      table.getCell(row, column).text.style = {
        fontSize: 15,
        color: COLORS.text,
        align: column === 5 ? "left" : "center",
      };
    }
  }

  addPanel(slide, {
    position: { left: 72, top: 526, width: 540, height: 84 },
    fill: "E7F4EE",
    lineFill: "CFEBDD",
  });
  addTextbox(slide, {
    text: "Ce que la démonstration doit faire comprendre",
    position: { left: 96, top: 544, width: 420, height: 22 },
    fontSize: 18,
    bold: true,
    color: COLORS.success,
  });
  addTextbox(slide, {
    text: "OpenClaw classe, résume, étiquette et prépare l'action commerciale. Le CRM devient la mémoire vivante de la boutique.",
    position: { left: 96, top: 568, width: 490, height: 34 },
    fontSize: 16,
    color: COLORS.text,
    fit: "shrink",
  });

  addPanel(slide, {
    position: { left: 650, top: 526, width: 554, height: 84 },
    fill: COLORS.white,
    lineFill: COLORS.line,
  });
  addTextbox(slide, {
    text: "Champs CRM à montrer en démo",
    position: { left: 674, top: 544, width: 300, height: 22 },
    fontSize: 18,
    bold: true,
    color: COLORS.pink,
  });
  addTextbox(slide, {
    text: "Prénom, nom, numéro WhatsApp, e-mail si disponible, canal d'origine, besoin, taille/âge, statut, relance, paiement, livraison ou retrait.",
    position: { left: 674, top: 568, width: 500, height: 34 },
    fontSize: 16,
    color: COLORS.text,
    fit: "shrink",
  });
}

function mobileMoneySlide(presentation) {
  const slide = presentation.slides.add();
  addBaseChrome(slide, "Paiement Mobile Money : commande, confirmation et suivi");

  addPanel(slide, {
    position: { left: 72, top: 170, width: 520, height: 392 },
    fill: COLORS.white,
    lineFill: COLORS.line,
  });
  addTextbox(slide, {
    text: "Flux recommandé",
    position: { left: 98, top: 194, width: 220, height: 24 },
    fontSize: 24,
    bold: true,
    color: COLORS.navy,
  });

  const flowBoxes = [
    { top: 242, fill: "EDEBFF", title: "1. Commande créée", body: "La demande WhatsApp devient une commande avec cliente, produit, montant et zone." },
    { top: 322, fill: "FFF5E7", title: "2. Paiement proposé", body: "La boutique envoie son numéro d'encaissement ou un lien de règlement." },
    { top: 402, fill: "E7F4EE", title: "3. Paiement confirmé", body: "Le statut passe à payé, à vérifier ou échoué avec une référence claire." },
    { top: 482, fill: "FBE1F4", title: "4. Livraison déclenchée", body: "La commande bascule en préparation puis en livraison avec suivi dans le tableau." },
  ];
  for (const box of flowBoxes) {
    addPanel(slide, {
      position: { left: 98, top: box.top, width: 466, height: 58 },
      fill: box.fill,
      lineFill: box.fill,
      lineWidth: 0,
      borderRadius: "rounded-2xl",
      shadow: "none",
    });
    addTextbox(slide, {
      text: box.title,
      position: { left: 114, top: box.top + 8, width: 220, height: 18 },
      fontSize: 15,
      bold: true,
      color: COLORS.navy,
    });
    addTextbox(slide, {
      text: box.body,
      position: { left: 114, top: box.top + 28, width: 430, height: 18 },
      fontSize: 11,
      color: COLORS.text,
      fit: "shrink",
    });
  }

  addPanel(slide, {
    position: { left: 632, top: 170, width: 572, height: 392 },
    fill: "EEF2FF",
    lineFill: "D8DFFD",
  });
  addTextbox(slide, {
    text: "Champs du tableau de bord",
    position: { left: 658, top: 194, width: 360, height: 24 },
    fontSize: 22,
    bold: true,
    color: COLORS.blue,
  });
  addBulletList(slide, {
    position: { left: 658, top: 238, width: 492, height: 236 },
    fontSize: 16,
    items: [
      "Nom et prénom de la cliente",
      "Numéro WhatsApp et e-mail si disponible",
      "Numéro de commande et montant total",
      "Mode de paiement choisi et numéro d'encaissement",
      "Référence de transaction Mobile Money",
      "Statut : en attente, payé, à vérifier, échoué",
      "Responsable de validation côté boutique",
      "Statut de préparation et de livraison",
    ],
  });

  addPanel(slide, {
    position: { left: 632, top: 486, width: 572, height: 76 },
    fill: COLORS.white,
    lineFill: COLORS.line,
  });
  addTextbox(slide, {
    text: "Message à faire passer au client",
    position: { left: 658, top: 504, width: 300, height: 20 },
    fontSize: 18,
    bold: true,
    color: COLORS.pink,
  });
  addTextbox(slide, {
    text: "OpenClaw ne s'arrête pas à répondre sur WhatsApp. Il aide la boutique à transformer le message en commande, la commande en paiement, puis le paiement en livraison suivie.",
    position: { left: 658, top: 528, width: 520, height: 26 },
    fontSize: 14,
    color: COLORS.text,
    fit: "shrink",
  });
}

function automationSlide(presentation) {
  const slide = presentation.slides.add();
  addBaseChrome(slide, "Nouveaux arrivages, promotions, commandes : l'IA automatise les bons gestes commerciaux");

  const cards = [
    {
      left: 72,
      title: "Nouveaux arrivages",
      body: "Le CRM sait quelles clientes attendaient une taille, un coffret naissance ou une nouvelle collection. OpenClaw prépare la relance ciblée.",
      fill: "FFF5E7",
      color: COLORS.gold,
    },
    {
      left: 372,
      title: "Promotions",
      body: "Au lieu d'un message unique pour tout le monde, la boutique envoie des offres mieux ciblées : liquidation, week-end, lots, retour école.",
      fill: "FBE1F4",
      color: COLORS.pink,
    },
    {
      left: 672,
      title: "Commandes & livraison",
      body: "OpenClaw aide à suivre confirmation, préparation, expédition, livraison et recontact post-achat sans laisser de conversation dormir.",
      fill: "E7F4EE",
      color: COLORS.success,
    },
    {
      left: 972,
      title: "Pilotage",
      body: "La gérante reçoit les chiffres et alertes utiles : demandes du jour, clientes à relancer, produits critiques et commandes en attente.",
      fill: "EDEBFF",
      color: COLORS.blue,
    },
  ];

  for (const card of cards) {
    addPanel(slide, {
      position: { left: card.left, top: 220, width: 232, height: 290 },
      fill: card.fill,
      lineFill: card.fill,
      lineWidth: 0,
      borderRadius: "rounded-3xl",
      shadow: "shadow-md",
    });
    addTextbox(slide, {
      text: card.title,
      position: { left: card.left + 18, top: 246, width: 196, height: 32 },
      fontSize: 24,
      bold: true,
      color: card.color,
      align: "center",
    });
    addTextbox(slide, {
      text: card.body,
      position: { left: card.left + 18, top: 302, width: 196, height: 144 },
      fontSize: 17,
      color: COLORS.text,
      fit: "shrink",
      align: "center",
    });
  }

  addTextbox(slide, {
    text: "Démonstration commerciale à faire en réunion",
    position: { left: 72, top: 550, width: 360, height: 22 },
    fontSize: 20,
    bold: true,
    color: COLORS.navy,
  });
  addTextbox(slide, {
    text: "Montrer un scénario simple : une cliente demande un ensemble sur WhatsApp, la boutique n'a pas le stock aujourd'hui, la fiche CRM garde l'attente, puis OpenClaw la relance automatiquement au prochain arrivage.",
    position: { left: 72, top: 578, width: 1030, height: 34 },
    fontSize: 18,
    color: COLORS.text,
    fit: "shrink",
  });
}

function telegramSlide(presentation) {
  const slide = presentation.slides.add();
  addBaseChrome(slide, "Le tableau de bord Telegram : la gérante voit sa boutique sans relire toutes les conversations");

  addPanel(slide, {
    position: { left: 106, top: 174, width: 420, height: 380 },
    fill: COLORS.navy,
    lineFill: COLORS.navy,
    lineWidth: 0,
    borderRadius: "rounded-3xl",
    shadow: "shadow-md",
  });
  addTextbox(slide, {
    text: "@openclaw_paradis_bot",
    position: { left: 138, top: 202, width: 240, height: 22 },
    fontSize: 18,
    bold: true,
    color: "C7D2FE",
  });
  addTextbox(slide, {
    text: "BILAN DU SOIR",
    position: { left: 138, top: 234, width: 220, height: 30 },
    fontSize: 24,
    bold: true,
    color: COLORS.white,
  });
  addTextbox(slide, {
    text: "Demandes entrantes : 26\nCommandes confirmées : 9\nPaiements Mobile Money reçus : 6\nPaiements à vérifier : 2\nTop demandes : ensembles 6 mois, coffrets naissance\nStock critique : pyjamas 6 mois, body naissance\nClientes à relancer : 7\nLivraisons à suivre demain : 3",
    position: { left: 138, top: 286, width: 330, height: 186 },
    fontSize: 17,
    color: COLORS.white,
    fit: "shrink",
  });
  addTextbox(slide, {
    text: "20:00 • Africa/Abidjan • généré automatiquement",
    position: { left: 138, top: 500, width: 280, height: 20 },
    fontSize: 12,
    color: "D6DCF7",
  });

  addPanel(slide, {
    position: { left: 586, top: 188, width: 560, height: 160 },
    fill: COLORS.white,
    lineFill: COLORS.line,
  });
  addTextbox(slide, {
    text: "Pourquoi cette slide compte en démonstration",
    position: { left: 612, top: 214, width: 430, height: 24 },
    fontSize: 18,
    bold: true,
    color: COLORS.blue,
  });
  addTextbox(slide, {
    text: "Le client comprend d'un coup qu'il n'achète pas seulement un bot de réponse. Il achète une boutique mieux lisible, mieux suivie et mieux pilotée.",
    position: { left: 612, top: 248, width: 500, height: 70 },
    fontSize: 16,
    color: COLORS.text,
    fit: "shrink",
  });

  addPanel(slide, {
    position: { left: 586, top: 376, width: 560, height: 176 },
    fill: "FFF5E7",
    lineFill: "F6E2B7",
  });
  addTextbox(slide, {
    text: "Éléments à lire à voix haute",
    position: { left: 612, top: 402, width: 300, height: 24 },
    fontSize: 18,
    bold: true,
    color: COLORS.gold,
  });
  addBulletList(slide, {
    position: { left: 612, top: 438, width: 500, height: 104 },
    fontSize: 16,
    items: [
      "Qui a écrit aujourd'hui ?",
      "Qui a acheté ?",
      "Qui faut-il relancer demain ?",
      "Quels produits deviennent critiques ?",
    ],
  });
}

function needsSlide(presentation) {
  const slide = presentation.slides.add();
  addBaseChrome(slide, "Ce qu'il faut du client pour rendre la boutique faisable avec OpenClaw");

  const columns = [
    {
      left: 72,
      fill: COLORS.white,
      title: "Base clients",
      items: [
        "Prénom et nom des clientes",
        "Numéros WhatsApp",
        "Adresses e-mail si disponibles",
        "Commune ou zone de livraison si connue",
      ],
    },
    {
      left: 392,
      fill: "EEF2FF",
      title: "Canaux & catalogue",
      items: [
        "Compte TikTok officiel",
        "Compte Facebook officiel",
        "Numéro WhatsApp principal de vente",
        "Catalogue : produit, taille/âge, prix, stock",
      ],
    },
    {
      left: 712,
      fill: "E7F4EE",
      title: "Paiement & pilotage",
      items: [
        "Moyens Mobile Money acceptés",
        "Numéros d'encaissement",
        "Personne qui confirme les paiements",
        "Compte Telegram et priorités de lancement",
      ],
    },
  ];

  for (const col of columns) {
    addPanel(slide, {
      position: { left: col.left, top: 192, width: 276, height: 332 },
      fill: col.fill,
      lineFill: col.fill,
      lineWidth: 0,
      borderRadius: "rounded-3xl",
      shadow: "shadow-md",
    });
    addTextbox(slide, {
      text: col.title,
      position: { left: col.left + 18, top: 220, width: 240, height: 30 },
      fontSize: 24,
      bold: true,
      color: COLORS.navy,
      align: "center",
    });
    addBulletList(slide, {
      position: { left: col.left + 18, top: 272, width: 240, height: 210 },
      fontSize: 17,
      items: col.items,
    });
  }

  addPanel(slide, {
    position: { left: 72, top: 548, width: 916, height: 82 },
    fill: COLORS.navy,
    lineFill: COLORS.navy,
    lineWidth: 0,
  });
  addTextbox(slide, {
    text: "Message clé : nous ne demandons pas une transformation lourde. Nous demandons les données minimales pour relier réseaux sociaux, WhatsApp, CRM, Mobile Money, relances et pilotage.",
    position: { left: 98, top: 570, width: 860, height: 40 },
    fontSize: 16,
    color: COLORS.white,
    fit: "shrink",
  });
}

function roadmapSlide(presentation) {
  const slide = presentation.slides.add();
  addBaseChrome(slide, "Plan de lancement : ce que la boutique voit dans les 30 premiers jours");

  const stages = [
    { title: "Jours 1-3", body: "Cadrage, récupération du catalogue, scripts WhatsApp, priorités réseaux.", fill: "FBE1F4" },
    { title: "Semaine 1", body: "Mise en place de l'accueil WhatsApp, étiquetage OpenClaw, première fiche CRM.", fill: "EDEBFF" },
    { title: "Semaine 2", body: "Relances simples, nouveaux arrivages, suivi des commandes et premiers rapports Telegram.", fill: "E7F4EE" },
    { title: "Semaine 3-4", body: "Ajustements, statuts CRM, paiement Mobile Money, routines promo et pilotage des produits critiques.", fill: "FFF5E7" },
  ];

  let left = 88;
  stages.forEach((stage, index) => {
    addPanel(slide, {
      position: { left, top: 266, width: 248, height: 212 },
      fill: stage.fill,
      lineFill: stage.fill,
      lineWidth: 0,
      borderRadius: "rounded-3xl",
      shadow: "shadow-md",
    });
    addTextbox(slide, {
      text: stage.title,
      position: { left: left + 18, top: 290, width: 212, height: 30 },
      fontSize: 26,
      bold: true,
      color: COLORS.navy,
      align: "center",
    });
    addTextbox(slide, {
      text: stage.body,
      position: { left: left + 18, top: 338, width: 212, height: 88 },
      fontSize: 18,
      color: COLORS.text,
      fit: "shrink",
      align: "center",
    });
    if (index < stages.length - 1) {
      addArrowText(slide, "→", left + 255, 350);
    }
    left += 286;
  });

  addTextbox(slide, {
    text: "Promesse finale au client",
    position: { left: 72, top: 164, width: 320, height: 24 },
    fontSize: 18,
    bold: true,
    color: COLORS.pink,
  });
  addTextbox(slide, {
    text: "En 30 jours, la boutique peut déjà voir une différence concrète : moins de messages perdus, plus de relances utiles, plus de mémoire client et un pilotage quotidien plus clair.",
    position: { left: 72, top: 194, width: 1030, height: 52 },
    fontSize: 18,
    color: COLORS.text,
    fit: "shrink",
  });

  addTag(slide, "TikTok attire", 72, 540, "F7D6EB", COLORS.navy, 170);
  addTag(slide, "WhatsApp convertit", 254, 540, "E7F4EE", COLORS.success, 180);
  addTag(slide, "OpenClaw structure", 446, 540, "EDEBFF", COLORS.blue, 190);
  addTag(slide, "CRM mémorise", 648, 540, "FFF5E7", COLORS.gold, 160);
  addTag(slide, "Telegram pilote", 820, 540, "E8ECFF", COLORS.navy, 174);
}

async function exportArtifacts(presentation) {
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);

  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    const png = await presentation.export({ slide, format: "png", scale: 1 });
    await writeBuffer(path.join(PREVIEW_DIR, `${stem}.png`), await png.arrayBuffer());
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(LAYOUT_DIR, `${stem}.layout.json`), await layout.text(), "utf8");
  }

  const montage = await presentation.export({ format: "webp", montage: true, scale: 1 });
  await writeBuffer(path.join(PREVIEW_DIR, "deck-montage.webp"), await montage.arrayBuffer());
}

async function main() {
  await ensureDirs();

  const presentation = Presentation.create({
    slideSize: { width: 1280, height: 720 },
  });

  coverSlide(presentation);
  painSlide(presentation);
  funnelSlide(presentation);
  whatsappDemoSlide(presentation);
  crmSlide(presentation);
  mobileMoneySlide(presentation);
  automationSlide(presentation);
  telegramSlide(presentation);
  needsSlide(presentation);
  roadmapSlide(presentation);

  await exportArtifacts(presentation);

  await fs.writeFile(
    path.join(OUTPUT_DIR, "source-notes.txt"),
    [
      "Deck purpose: live-ready presentation in standard French with accents.",
      "Prospect context used: baby/kids boutique, social-first funnel, shared creative direction from screenshot, TikTok link referenced by user, Facebook/WhatsApp requested explicitly.",
      "Project signature: piloted by TransferAI, our AI hub, in collaboration with Nettelecom CI.",
      "No external social metrics asserted; all numbers and fields kept illustrative.",
      `Output: ${FINAL_PPTX}`,
    ].join("\n"),
    "utf8",
  );

  console.log(FINAL_PPTX);
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
