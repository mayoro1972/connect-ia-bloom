import { assets, palette, deck, fullBleed, panel, title, body, metricCard, footer, addLogo } from "./shared.mjs";

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  panel(slide, ctx, 0, 0, 740, 720, { fill: palette.bg, stroke: palette.bg });
  panel(slide, ctx, 740, 0, 540, 720, { fill: "#EEE6DE", stroke: "#EEE6DE" });
  await ctx.addImage(slide, {
    path: assets.hero,
    x: 740,
    y: 280,
    width: 540,
    height: 338,
    fit: "cover",
    alt: "Formation et travail d'équipe",
  });

  panel(slide, ctx, 60, 82, 560, 432, { fill: palette.paper, stroke: palette.stone });
  await addLogo(slide, ctx, 86, 108, 180, 64);

  body(slide, ctx, "OFFRE ENTREPRISE CIBLÉE", 86, 190, 240, 18, 10, {
    bold: true,
    color: palette.accent,
  });
  title(slide, ctx, deck.title, 86, 222, 430, 54, 34);
  title(slide, ctx, deck.subtitle, 86, 278, 470, 92, 26);
  body(slide, ctx, deck.tagline, 86, 382, 470, 72, 17, { color: palette.inkSoft });
  body(slide, ctx, "Point d'entrée recommandé : audit IA gratuit, puis échange expert de 45 minutes.", 86, 458, 470, 40, 14, {
    bold: true,
    color: palette.dark,
  });

  metricCard(slide, ctx, 60, 546, 150, 94, deck.credibility[0].value, deck.credibility[0].label, palette.accent);
  metricCard(slide, ctx, 228, 546, 150, 94, deck.credibility[1].value, deck.credibility[1].label, palette.green);
  metricCard(slide, ctx, 396, 546, 150, 94, deck.credibility[2].value, deck.credibility[2].label, palette.dark);
  metricCard(slide, ctx, 564, 546, 150, 94, deck.credibility[3].value, deck.credibility[3].label, "#6E7D8C");

  panel(slide, ctx, 820, 74, 360, 196, { fill: palette.dark, stroke: palette.dark });
  body(slide, ctx, "Promesse", 910, 98, 120, 18, 10.5, { bold: true, color: "#C9D8E8" });
  title(slide, ctx, deck.heroPromise, 850, 128, 300, 92, 20, palette.white);
  body(
    slide,
    ctx,
    "Une approche pensée pour transformer un besoin encore flou en plan d'action simple, formation ciblée et premier cas d'usage utile.",
    850,
    220,
    300,
    32,
    11.4,
    { color: "#E7EEF6" },
  );

  footer(slide, ctx, 1, "TransferAI Africa | Offre entreprise ciblée | Formation, accompagnement et cas d'usage utiles");
  return slide;
}
