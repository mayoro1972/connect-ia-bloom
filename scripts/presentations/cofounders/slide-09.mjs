import { loadData, palette, fullBleed, title, body, kicker, footer, panel } from "./shared.mjs";

export async function slide09(presentation, ctx) {
  const data = await loadData();
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  kicker(slide, ctx, "Décisions");
  title(slide, ctx, "Ce que la réunion doit valider aujourd'hui", 60, 78, 820, 60, 30);

  data.decisionPoints.forEach((point, index) => {
    const x = index % 2 === 0 ? 60 : 640;
    const y = 194 + Math.floor(index / 2) * 150;
    panel(slide, ctx, x, y, 540, 116, {
      fill: index === 0 ? "#FFF4EC" : palette.paper,
      stroke: index === 0 ? "#FFF4EC" : palette.line
    });
    body(slide, ctx, `0${index + 1}`, x + 24, y + 20, 44, 24, 20, { bold: true, color: palette.accent, face: "Aptos Display" });
    body(slide, ctx, point, x + 82, y + 20, 420, 58, 17, { bold: true, color: palette.ink });
  });

  panel(slide, ctx, 60, 560, 1120, 64, { fill: palette.dark, stroke: palette.dark });
  body(
    slide,
    ctx,
    "Décision recommandée : concentrer l'effort commercial sur 5 domaines, outiller 3 offres d'entrée et industrialiser 3 démonstrations fortes avant d'élargir.",
    90,
    582,
    1040,
    22,
    14,
    { color: "#FFFFFF", face: "Aptos Display", bold: true, align: "center" }
  );

  footer(slide, ctx, 9, "Clôture : priorité, séquence commerciale et discipline d'exécution.");
  return slide;
}
