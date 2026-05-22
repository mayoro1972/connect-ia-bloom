import { deck, palette, fullBleed, panel, title, body, kicker, footer } from "./shared.mjs";

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.paper);

  kicker(slide, ctx, "Formation");
  title(slide, ctx, "Un mini-catalogue de formation beaucoup plus ciblé", 60, 78, 760, 52, 30);
  body(
    slide,
    ctx,
    "Au lieu de présenter 13 domaines génériques, nous recommandons de mettre en avant quelques familles directement utiles pour l'entreprise.",
    60,
    138,
    760,
    30,
    14,
  );

  for (let index = 0; index < deck.trainingFamilies.length; index += 1) {
    const family = deck.trainingFamilies[index];
    const x = 60 + index * 287;
    panel(slide, ctx, x, 198, 250, 346, { fill: palette.bg, stroke: palette.stone });
    panel(slide, ctx, x, 198, 250, 48, { fill: family.color, stroke: family.color });
    body(slide, ctx, family.title, x + 18, 210, 214, 22, 13, {
      bold: true,
      color: palette.white,
      face: "Aptos Display",
      align: "center",
    });
    panel(slide, ctx, x + 18, 276, 214, 92, { fill: palette.paper, stroke: palette.stone });
    body(slide, ctx, family.programs[0], x + 30, 292, 190, 56, 12.5, {
      bold: true,
      color: palette.ink,
      face: "Aptos",
      align: "center",
    });
    panel(slide, ctx, x + 18, 392, 214, 92, { fill: palette.paper, stroke: palette.stone });
    body(slide, ctx, family.programs[1], x + 30, 408, 190, 56, 12.5, {
      bold: true,
      color: palette.ink,
      face: "Aptos",
      align: "center",
    });
  }

  panel(slide, ctx, 60, 586, 1120, 54, { fill: palette.dark, stroke: palette.dark });
  body(
    slide,
    ctx,
    "Message à faire passer : la formation n'est pas un catalogue séparé, mais une réponse ciblée aux priorités métier révélées par l'audit.",
    84,
    603,
    1050,
    20,
    13,
    { color: palette.white, align: "center", bold: true },
  );

  footer(slide, ctx, 6, "Le catalogue doit devenir un outil de ciblage commercial et non une liste trop large à présenter d'un bloc.");
  return slide;
}
