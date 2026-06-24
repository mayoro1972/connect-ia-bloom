import { deck, palette, fullBleed, panel, title, body, kicker, footer, addLogo } from "./shared.mjs";

export async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  await addLogo(slide, ctx, 60, 58, 200, 72);
  kicker(slide, ctx, "Prochaine étape", 60, 146, 180);
  title(slide, ctx, "Présenter TransferAI, puis ouvrir sur une action simple", 60, 182, 620, 78, 32);
  body(
    slide,
    ctx,
    "Le message commercial le plus simple à faire passer : commençons par un audit IA gratuit et un échange expert de 30 à 45 minutes.",
    60,
    278,
    620,
    54,
    16,
    { color: palette.inkSoft },
  );

  panel(slide, ctx, 60, 370, 620, 202, { fill: palette.dark, stroke: palette.dark });
  title(slide, ctx, "Appel à l'action recommandé", 90, 398, 320, 32, 22, palette.white);
  body(slide, ctx, "1. Réserver un audit IA gratuit", 90, 448, 340, 20, 15, { bold: true, color: "#FFFFFF" });
  body(slide, ctx, "2. Tenir un échange expert de 30 à 45 minutes", 90, 478, 420, 20, 15, { bold: true, color: "#FFFFFF" });
  body(slide, ctx, "3. Recevoir une première orientation : formation, accompagnement ou solution", 90, 508, 470, 40, 15, { bold: true, color: "#FFFFFF" });

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
    "TransferAI Africa vous aide à identifier les usages de l'IA les plus utiles, à former vos équipes sur des cas concrets, puis à choisir la bonne suite.",
    792,
    544,
    290,
    30,
    11.2,
    { color: palette.inkSoft },
  );

  footer(slide, ctx, 9, "Sortie recommandée du rendez-vous : un besoin clarifié, une suite simple et un point de contact évident.");
  return slide;
}
