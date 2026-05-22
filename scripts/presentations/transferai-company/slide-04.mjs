import { deck, palette, fullBleed, panel, title, body, kicker, bulletList, footer } from "./shared.mjs";

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.paper);

  kicker(slide, ctx, "Offre");
  title(slide, ctx, "Ce que nous faisons concrètement", 60, 78, 680, 52, 30);
  body(
    slide,
    ctx,
    "Trois portes d'entrée simples pour préparer, déployer et faire vivre une démarche IA utile dans l'organisation.",
    60,
    130,
    620,
    36,
    14,
  );

  for (let index = 0; index < deck.pillars.length; index += 1) {
    const pillar = deck.pillars[index];
    const x = 60 + index * 385;
    panel(slide, ctx, x, 198, 330, 350, {
      fill: index === 1 ? pillar.color : palette.paper,
      stroke: index === 1 ? pillar.color : palette.stone,
    });
    await ctx.addLucideIcon(slide, {
      icon: pillar.icon,
      x: x + 24,
      y: 222,
      width: 28,
      height: 28,
      color: index === 1 ? "#FFE4D2" : pillar.color,
    });
    body(slide, ctx, pillar.title, x + 66, 220, 220, 34, 19, {
      bold: true,
      color: index === 1 ? palette.white : palette.ink,
      face: "Aptos Display",
    });
    body(slide, ctx, pillar.promise, x + 24, 272, 282, 74, 13.5, {
      color: index === 1 ? "#EDF3FA" : palette.inkSoft,
    });
    bulletList(slide, ctx, pillar.items, x + 24, 372, 282, {
      gap: 34,
      size: 13,
      bulletColor: index === 1 ? "#FFE4D2" : pillar.color,
      color: index === 1 ? "#FFFFFF" : palette.inkSoft,
      itemHeight: 24,
    });
  }

  panel(slide, ctx, 60, 586, 1120, 54, { fill: palette.dark, stroke: palette.dark });
  body(
    slide,
    ctx,
    "TransferAI peut intervenir sur une mission courte de diagnostic, un plan de formation, un premier projet ou un déploiement plus opérationnel selon le besoin.",
    84,
    603,
    1050,
    20,
    13,
    { color: palette.white, align: "center", bold: true },
  );

  footer(slide, ctx, 4, "Lecture recommandée : commencer par le bon levier, puis avancer avec un plan simple et progressif.");
  return slide;
}
