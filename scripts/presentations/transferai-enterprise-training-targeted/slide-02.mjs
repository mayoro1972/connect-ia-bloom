import { deck, palette, fullBleed, panel, title, body, kicker, footer } from "./shared.mjs";

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.paper);

  kicker(slide, ctx, "Contexte");
  title(slide, ctx, "Pourquoi cette offre est plus pertinente qu'un catalogue générique", 60, 78, 760, 64, 28);

  for (let index = 0; index < deck.reasons.length; index += 1) {
    const item = deck.reasons[index];
    const x = 60 + index * 385;
    panel(slide, ctx, x, 182, 330, 232, {
      fill: index === 1 ? palette.dark : palette.paper,
      stroke: index === 1 ? palette.dark : palette.stone,
    });
    await ctx.addLucideIcon(slide, {
      icon: item.icon,
      x: x + 24,
      y: 206,
      width: 30,
      height: 30,
      color: index === 1 ? "#F7D9C8" : palette.accent,
    });
    body(slide, ctx, item.title, x + 66, 204, 230, 48, 18, {
      bold: true,
      color: index === 1 ? palette.white : palette.ink,
      face: "Aptos Display",
    });
    body(slide, ctx, item.desc, x + 24, 270, 282, 104, 14, {
      color: index === 1 ? "#E4EDF7" : palette.inkSoft,
    });
  }

  panel(slide, ctx, 60, 458, 1120, 158, { fill: "#FFF7F1", stroke: "#FFF7F1" });
  body(slide, ctx, "Lecture commerciale recommandée", 88, 486, 220, 18, 10.5, { bold: true, color: palette.accent });
  title(slide, ctx, "Mettre en avant le service derrière l'IA.", 88, 516, 560, 36, 24);
  body(
    slide,
    ctx,
    "L'entrée ne doit pas être “nous avons 130 formations”. Elle doit être “nous vous aidons à identifier vos priorités, à former les bonnes équipes et à déployer les bons usages au bon rythme”.",
    88,
    558,
    640,
    42,
    14,
  );

  panel(slide, ctx, 780, 484, 352, 128, { fill: palette.paper, stroke: palette.stone });
  body(slide, ctx, "À retenir", 808, 506, 120, 16, 10.5, { bold: true, color: palette.inkSoft });
  body(slide, ctx, "Moins de générique", 808, 536, 220, 18, 13.5, { bold: true, color: palette.ink, face: "Aptos Display" });
  body(slide, ctx, "Plus d'offres métier ciblées", 808, 560, 240, 18, 13.5, { bold: true, color: palette.ink, face: "Aptos Display" });
  body(slide, ctx, "Et une porte d'entrée claire", 808, 578, 240, 18, 13.5, { bold: true, color: palette.ink, face: "Aptos Display" });

  footer(slide, ctx, 2, "Le bon angle n'est pas la quantité de formations, mais la capacité à relier diagnostic, formation, gouvernance et mise en œuvre.");
  return slide;
}
