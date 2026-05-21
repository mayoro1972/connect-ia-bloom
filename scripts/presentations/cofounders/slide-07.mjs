import { loadData, palette, fullBleed, title, body, kicker, footer, panel } from "./shared.mjs";

export async function slide07(presentation, ctx) {
  const data = await loadData();
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  kicker(slide, ctx, "Offres commerciales");
  title(slide, ctx, "La séquence commerciale recommandée", 60, 78, 760, 60, 30);

  const cards = data.offers;
  cards.forEach((offer, index) => {
    const x = 60 + index * 385;
    panel(slide, ctx, x, 200, 330, 260, {
      fill: index === 1 ? palette.dark : palette.paper,
      stroke: index === 1 ? palette.dark : palette.line
    });
    body(slide, ctx, `0${index + 1}`, x + 26, 222, 40, 20, 18, {
      bold: true,
      color: index === 1 ? "#F6CBB2" : palette.accent,
      face: "Aptos Display"
    });
    body(slide, ctx, offer.name, x + 26, 252, 250, 58, 22, {
      bold: true,
      color: index === 1 ? "#FFFFFF" : palette.ink,
      face: "Aptos Display"
    });
    body(slide, ctx, offer.promise, x + 26, 320, 278, 72, 14, {
      color: index === 1 ? "#FFFFFF" : palette.inkSoft
    });
    body(slide, ctx, offer.value, x + 26, 398, 278, 40, 11.5, {
      bold: true,
      color: index === 1 ? "#D6E0EA" : palette.ink
    });
  });

  panel(slide, ctx, 60, 520, 1100, 90, { fill: "#FFF7F1", stroke: "#FFF7F1" });
  title(slide, ctx, "Logique de conversion", 86, 542, 240, 24, 18);
  body(
    slide,
    ctx,
    "Audit pour ouvrir la porte, bootcamp pour créer l'adoption, pilote pour matérialiser le ROI et déclencher un déploiement plus large.",
    86,
    570,
    980,
    22,
    13,
    { color: palette.inkSoft }
  );

  footer(slide, ctx, 7, "Les offres doivent être simples à comprendre, simples à signer et faciles à convertir en mission plus profonde.");
  return slide;
}
