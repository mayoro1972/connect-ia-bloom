import { deck, palette, fullBleed, panel, title, body, kicker, footer } from "./shared.mjs";

export async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.paper);

  kicker(slide, ctx, "Parcours");
  title(slide, ctx, "Notre séquence d'accompagnement", 60, 78, 680, 52, 30);
  body(
    slide,
    ctx,
    "L'objectif n'est pas de tout vendre en même temps, mais d'enchaîner les étapes utiles dans le bon ordre.",
    60,
    140,
    640,
    30,
    14,
  );

  for (let index = 0; index < deck.sequence.length; index += 1) {
    const item = deck.sequence[index];
    const x = 60 + index * 280;
    panel(slide, ctx, x, 214, 240, 220, {
      fill: index === 1 ? "#FFF7F1" : palette.bg,
      stroke: index === 1 ? "#FFF7F1" : palette.stone,
    });
    body(slide, ctx, `0${index + 1}`, x + 24, 236, 44, 20, 18, {
      bold: true,
      color: index === 1 ? palette.accent : palette.green,
      face: "Aptos Display",
    });
    body(slide, ctx, item.title, x + 24, 270, 190, 38, 18, {
      bold: true,
      color: palette.ink,
      face: "Aptos Display",
    });
    body(slide, ctx, item.desc, x + 24, 324, 190, 60, 13.5);
  }

  panel(slide, ctx, 60, 492, 1120, 120, { fill: palette.dark, stroke: palette.dark });
  body(slide, ctx, "Résultats recherchés", 88, 516, 160, 18, 10.5, { bold: true, color: "#D7E2EE" });
  for (let index = 0; index < deck.outcomes.length; index += 1) {
    const x = 88 + (index % 2) * 510;
    const y = 548 + Math.floor(index / 2) * 28;
    body(slide, ctx, "•", x, y, 14, 18, 13, { bold: true, color: "#F7D9C8" });
    body(slide, ctx, deck.outcomes[index], x + 18, y - 2, 460, 18, 12.5, { color: palette.white });
  }

  footer(slide, ctx, 8, "Séquence recommandée : diagnostic, priorisation, mise en œuvre adaptée, puis montée en puissance si les premiers résultats sont convaincants.");
  return slide;
}
