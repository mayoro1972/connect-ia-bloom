import { deck, palette, fullBleed, panel, title, body, kicker, footer } from "./shared.mjs";

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  kicker(slide, ctx, "Cas d'usage");
  title(slide, ctx, "Des usages concrets, métier par métier", 60, 78, 760, 52, 30);
  body(
    slide,
    ctx,
    "L'objectif n'est pas d'ajouter de l'IA partout, mais de l'utiliser là où le bénéfice devient visible, crédible et utile pour les équipes.",
    60,
    140,
    760,
    30,
    14,
  );

  for (let index = 0; index < deck.useCases.length; index += 1) {
    const item = deck.useCases[index];
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 60 + col * 385;
    const y = 206 + row * 172;
    panel(slide, ctx, x, y, 330, 136, { fill: palette.paper, stroke: palette.stone });
    body(slide, ctx, item.title, x + 22, y + 20, 260, 34, 18, {
      bold: true,
      color: palette.ink,
      face: "Aptos Display",
    });
    body(slide, ctx, item.desc, x + 22, y + 66, 282, 48, 13.5);
  }

  panel(slide, ctx, 750, 560, 430, 86, { fill: "#FFF7F1", stroke: "#FFF7F1" });
  body(slide, ctx, "Ce que cela permet", 778, 578, 160, 18, 10.5, { bold: true, color: palette.accent });
  body(
    slide,
    ctx,
    "Réduire les tâches répétitives, mieux organiser l'information, accélérer les décisions et préparer des projets plus crédibles.",
    778,
    598,
    354,
    24,
    12.5,
  );

  footer(slide, ctx, 5, "Le site et le catalogue montrent une logique métier claire : support, croissance, pilotage, conformité, numérique et secteurs ciblés.");
  return slide;
}
