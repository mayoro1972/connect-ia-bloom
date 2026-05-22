import { deck, palette, fullBleed, panel, title, body, kicker, footer } from "./shared.mjs";

export async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  kicker(slide, ctx, "Cas d'usage");
  title(slide, ctx, "Ce que cette offre peut adresser concrètement", 60, 78, 760, 52, 30);
  body(
    slide,
    ctx,
    "Pour une entreprise comme Elton CI, l'offre formation prend de la valeur si elle prépare des usages utiles sur des terrains bien identifiés.",
    60,
    140,
    780,
    30,
    14,
  );

  for (let index = 0; index < deck.useCases.length; index += 1) {
    const item = deck.useCases[index];
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 60 + col * 560;
    const y = 210 + row * 172;
    panel(slide, ctx, x, y, 520, 136, { fill: palette.paper, stroke: palette.stone });
    body(slide, ctx, item.title, x + 22, y + 20, 300, 34, 18, {
      bold: true,
      color: palette.ink,
      face: "Aptos Display",
    });
    body(slide, ctx, item.desc, x + 22, y + 66, 470, 48, 13.5);
  }

  panel(slide, ctx, 60, 594, 1120, 44, { fill: "#FFF7F1", stroke: "#FFF7F1" });
  body(
    slide,
    ctx,
    "La formation prépare ici des usages métier précis : elle rend les équipes plus prêtes, plus rapides et plus cohérentes avant le déploiement d'un pilote.",
    84,
    607,
    1070,
    18,
    11.8,
    { color: palette.ink, align: "center", bold: true },
  );

  footer(slide, ctx, 7, "L'objectif n'est pas d'ajouter de l'IA partout, mais de relier la formation à des cas d'usage visibles et crédibles.");
  return slide;
}
