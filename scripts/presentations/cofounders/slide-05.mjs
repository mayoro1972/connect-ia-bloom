import { loadData, palette, fullBleed, title, kicker, footer, domainCard } from "./shared.mjs";

export async function slide05(presentation, ctx) {
  const data = await loadData();
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  kicker(slide, ctx, "Top domaines");
  title(slide, ctx, "Les 5 domaines à pousser immédiatement", 60, 78, 760, 60, 30);

  const items = data.topPriorities;
  domainCard(slide, ctx, 60, 170, 350, 220, items[0]);
  domainCard(slide, ctx, 435, 170, 350, 220, items[1]);
  domainCard(slide, ctx, 810, 170, 350, 220, items[2]);
  domainCard(slide, ctx, 245, 396, 350, 220, items[3]);
  domainCard(slide, ctx, 620, 396, 350, 220, items[4]);

  footer(slide, ctx, 5, "Ces 5 domaines combinent transversalité, facilité de démonstration et potentiel de conversion rapide.");
  return slide;
}
