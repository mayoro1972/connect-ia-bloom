import { deck, palette, fullBleed, panel, title, body, kicker, footer } from "./shared.mjs";

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.paper);

  kicker(slide, ctx, "Constat");
  title(slide, ctx, "Pourquoi les organisations nous sollicitent", 60, 78, 760, 52, 30);

  for (let index = 0; index < deck.needs.length; index += 1) {
    const item = deck.needs[index];
    const x = 60 + index * 385;
    panel(slide, ctx, x, 182, 330, 220, {
      fill: index === 1 ? palette.dark : palette.paper,
      stroke: index === 1 ? palette.dark : palette.stone,
    });
    await ctx.addLucideIcon(slide, {
      icon: item.icon,
      x: x + 24,
      y: 204,
      width: 30,
      height: 30,
      color: index === 1 ? "#F7D9C8" : palette.accent,
    });
    body(slide, ctx, item.title, x + 66, 204, 220, 40, 20, {
      bold: true,
      color: index === 1 ? palette.white : palette.ink,
      face: "Aptos Display",
    });
    body(slide, ctx, item.desc, x + 24, 258, 282, 92, 14, {
      color: index === 1 ? "#E4EDF7" : palette.inkSoft,
    });
  }

  panel(slide, ctx, 60, 458, 1120, 158, { fill: "#FFF7F1", stroke: "#FFF7F1" });
  body(slide, ctx, "Réponse TransferAI", 88, 486, 180, 18, 10.5, { bold: true, color: palette.accent });
  title(slide, ctx, "Transformer l'intérêt pour l'IA en plan d'action clair.", 88, 516, 560, 36, 24);
  body(
    slide,
    ctx,
    "Notre rôle est de faire passer l'organisation d'une envie encore floue à une suite simple : diagnostic, priorités, montée en compétences, premier projet puis déploiement.",
    88,
    558,
    560,
    42,
    14,
  );

  panel(slide, ctx, 760, 482, 372, 134, { fill: palette.paper, stroke: palette.stone });
  body(slide, ctx, "Ce que cela change", 788, 504, 140, 16, 10.5, { bold: true, color: palette.inkSoft });
  body(slide, ctx, "Moins de dispersion", 788, 534, 180, 18, 13.5, { bold: true, color: palette.ink, face: "Aptos Display" });
  body(slide, ctx, "Des cas d'usage plus concrets", 788, 558, 250, 18, 13.5, { bold: true, color: palette.ink, face: "Aptos Display" });
  body(slide, ctx, "Une meilleure adhésion des équipes", 788, 582, 260, 18, 13.5, { bold: true, color: palette.ink, face: "Aptos Display" });

  footer(slide, ctx, 2, "TransferAI ne vend pas un effet de mode : la promesse repose sur des priorités claires, des usages concrets et un passage à l'action.");
  return slide;
}
