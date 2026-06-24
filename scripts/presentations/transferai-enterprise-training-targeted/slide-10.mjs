import { deck, palette, fullBleed, panel, title, body, kicker, footer, addLogo } from "./shared.mjs";

export async function slide10(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  await addLogo(slide, ctx, 60, 58, 200, 72);
  kicker(slide, ctx, "Prochaine étape", 60, 146, 180);
  title(slide, ctx, "Ouvrir sur une action simple, crédible et utile", 60, 182, 620, 78, 32);
  body(
    slide,
    ctx,
    "Le message le plus simple à faire passer : commençons par un échange de 45 minutes et un audit gratuit pour identifier la bonne combinaison entre formation, accompagnement et cas d'usage.",
    60,
    278,
    620,
    64,
    16,
    { color: palette.inkSoft },
  );

  panel(slide, ctx, 60, 370, 620, 202, { fill: palette.dark, stroke: palette.dark });
  title(slide, ctx, "Appel à l'action recommandé", 90, 398, 320, 32, 22, palette.white);
  body(slide, ctx, "1. Tenir un échange expert de 45 minutes", 90, 448, 400, 20, 15, { bold: true, color: "#FFFFFF" });
  body(slide, ctx, "2. Lancer un audit IA gratuit", 90, 478, 400, 20, 15, { bold: true, color: "#FFFFFF" });
  body(slide, ctx, "3. Recevoir une orientation ciblée : formation, accompagnement ou pilote", 90, 508, 470, 40, 15, { bold: true, color: "#FFFFFF" });

  panel(slide, ctx, 742, 140, 438, 474, { fill: palette.paper, stroke: palette.stone });
  title(slide, ctx, "Coordonnées à partager", 770, 170, 280, 28, 22);
  body(slide, ctx, deck.contacts.website, 770, 230, 320, 24, 15, { bold: true, color: palette.ink, face: "Aptos Display" });
  body(slide, ctx, deck.contacts.email, 770, 272, 320, 24, 14);
  body(slide, ctx, deck.contacts.phone, 770, 308, 320, 24, 14);
  body(slide, ctx, deck.contacts.whatsapp, 770, 344, 320, 24, 14);
  body(slide, ctx, deck.contacts.linkedin, 770, 380, 320, 24, 14);
  body(slide, ctx, deck.contacts.address, 770, 428, 350, 48, 13.5);
  panel(slide, ctx, 770, 500, 340, 98, { fill: "#FFF7F1", stroke: "#FFF7F1" });
  body(slide, ctx, "Formule courte à utiliser", 792, 520, 180, 16, 10.5, { bold: true, color: palette.accent });
  body(
    slide,
    ctx,
    "TransferAI Africa vous aide à identifier les usages les plus utiles, à former les bonnes équipes et à choisir la bonne suite pour l'entreprise.",
    792,
    544,
    290,
    34,
    11.2,
    { color: palette.inkSoft },
  );

  footer(slide, ctx, 10, "Sortie recommandée du rendez-vous : un besoin clarifié, une proposition de formation ciblée et un premier terrain d'action.");
  return slide;
}
