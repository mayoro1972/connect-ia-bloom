import { loadData, palette, fullBleed, panel, title, body, kicker, bulletList, chip, footer } from "./shared.mjs";

export async function slide02(presentation, ctx) {
  const data = await loadData();
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, "#FFFDFC");

  kicker(slide, ctx, "Vue d'ensemble");
  title(slide, ctx, "Ce que les cofondateurs doivent retenir", 60, 78, 760, 60, 30);

  panel(slide, ctx, 60, 170, 640, 360, { fill: palette.paper, stroke: palette.line });
  bulletList(slide, ctx, data.executiveSummary, 84, 206, 592, { gap: 62, size: 16, itemHeight: 56 });

  panel(slide, ctx, 750, 170, 430, 260, { fill: palette.accent, stroke: palette.accent });
  body(slide, ctx, "Pourquoi agir maintenant", 782, 196, 160, 20, 11, { bold: true, color: "#FFE9DB" });
  title(slide, ctx, "5 domaines peuvent porter l'effort commercial des 90 prochains jours.", 782, 226, 340, 94, 26);
  body(
    slide,
    ctx,
    "Le but n'est pas d'élargir le catalogue. Le but est de concentrer la vente sur ce qui est démontrable, répétable et transformable en mission.",
    782,
    330,
    340,
    72,
    13,
    { color: "#FFF5EE" }
  );

  const criteria = data.selectionCriteria;
  chip(slide, ctx, 60, 576, 250, criteria[0].label, palette.accentSoft, palette.ink);
  chip(slide, ctx, 330, 576, 250, criteria[1].label, "#DCEAE8", palette.ink);
  chip(slide, ctx, 600, 576, 250, criteria[2].label, "#E3E8EE", palette.ink);
  chip(slide, ctx, 870, 576, 250, criteria[3].label, "#F0E9DF", palette.ink);

  body(slide, ctx, criteria[0].detail, 60, 614, 250, 48, 10.5);
  body(slide, ctx, criteria[1].detail, 330, 614, 250, 48, 10.5);
  body(slide, ctx, criteria[2].detail, 600, 614, 250, 48, 10.5);
  body(slide, ctx, criteria[3].detail, 870, 614, 250, 48, 10.5);

  footer(slide, ctx, 2, "Thèse : la prochaine croissance commerciale viendra des domaines à ROI court terme, pas d'un discours IA générique.");
  return slide;
}
