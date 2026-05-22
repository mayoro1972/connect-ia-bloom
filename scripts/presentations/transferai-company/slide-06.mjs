import { deck, palette, fullBleed, panel, title, body, kicker, metricCard, footer } from "./shared.mjs";

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.paper);

  kicker(slide, ctx, "Catalogue");
  title(slide, ctx, "Un catalogue structuré pour accompagner la montée en compétences", 60, 78, 760, 52, 30);

  metricCard(slide, ctx, 860, 84, 140, 88, "130+", "formations", palette.accent);
  metricCard(slide, ctx, 1020, 84, 140, 88, "13", "domaines", palette.green);

  for (let index = 0; index < deck.domainFamilies.length; index += 1) {
    const family = deck.domainFamilies[index];
    const x = 60 + index * 287;
    panel(slide, ctx, x, 188, 250, 390, { fill: palette.bg, stroke: palette.stone });
    panel(slide, ctx, x, 188, 250, 48, { fill: family.color, stroke: family.color });
    body(slide, ctx, family.title, x + 18, 202, 214, 20, 14, {
      bold: true,
      color: palette.white,
      face: "Aptos Display",
      align: "center",
    });

    family.domains.forEach((domain, domainIndex) => {
      panel(slide, ctx, x + 18, 256 + domainIndex * 70, 214, 48, { fill: palette.paper, stroke: palette.stone });
      body(slide, ctx, domain, x + 28, 270 + domainIndex * 70, 194, 24, 11.5, {
        bold: true,
        color: palette.ink,
        face: "Aptos",
        align: "center",
      });
    });
  }

  panel(slide, ctx, 60, 616, 1120, 36, { fill: palette.dark, stroke: palette.dark });
  body(
    slide,
    ctx,
    "Formats disponibles sur le site : présentiel, hybride et en ligne, avec des parcours par métier et, selon les offres, des possibilités de certification.",
    84,
    625,
    1072,
    18,
    11.5,
    { color: palette.white, align: "center" },
  );

  footer(slide, ctx, 6, "Le catalogue renforce la crédibilité commerciale : il montre que TransferAI peut accompagner les équipes dans la durée après la phase de diagnostic.");
  return slide;
}
