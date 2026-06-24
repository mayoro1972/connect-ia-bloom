import { deck, palette, fullBleed, panel, title, body, kicker, bulletList, footer } from "./shared.mjs";

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  kicker(slide, ctx, "Offre");
  title(slide, ctx, "Les 4 briques de l'offre entreprise", 60, 78, 680, 52, 30);
  body(
    slide,
    ctx,
    "Notre valeur vient de la combinaison entre diagnostic, formation et mise en œuvre, et non d'un seul outil.",
    60,
    138,
    700,
    30,
    14,
  );

  for (let index = 0; index < deck.offerBlocks.length; index += 1) {
    const block = deck.offerBlocks[index];
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 60 + col * 560;
    const y = 198 + row * 198;
    panel(slide, ctx, x, y, 520, 164, {
      fill: index === 1 ? block.color : palette.paper,
      stroke: index === 1 ? block.color : palette.stone,
    });
    await ctx.addLucideIcon(slide, {
      icon: block.icon,
      x: x + 22,
      y: y + 22,
      width: 26,
      height: 26,
      color: index === 1 ? "#FFE4D2" : block.color,
    });
    body(slide, ctx, block.title, x + 60, y + 20, 250, 30, 18, {
      bold: true,
      color: index === 1 ? palette.white : palette.ink,
      face: "Aptos Display",
    });
    body(slide, ctx, block.promise, x + 22, y + 58, 470, 34, 13.5, {
      color: index === 1 ? "#EDF3FA" : palette.inkSoft,
    });
    bulletList(slide, ctx, block.items, x + 22, y + 102, 470, {
      gap: 22,
      size: 11.8,
      itemHeight: 18,
      bulletColor: index === 1 ? "#FFE4D2" : block.color,
      color: index === 1 ? "#FFFFFF" : palette.inkSoft,
    });
  }

  footer(slide, ctx, 5, "Une offre entreprise crédible articule clairement l'audit, la formation, l'accompagnement et un premier terrain d'exécution.");
  return slide;
}
