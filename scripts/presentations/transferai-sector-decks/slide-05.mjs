import { spec, theme, bg, title, body, kicker, footer, useCaseCard } from "./shared.mjs";

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Cas d’usage prioritaires");
  title(slide, ctx, "Le bon deck rend visibles 3 à 4 usages que le prospect peut immédiatement se représenter.", 72, 82, 980, 64, 25.5);
  body(
    slide,
    ctx,
    "Chaque cas d’usage ci-dessous a été formulé pour rester crédible, visible et relié à un flux métier réel. Le but n’est pas de tout lancer, mais de prioriser ce qui crée une première valeur lisible.",
    72,
    150,
    930,
    38,
    12.2,
    theme.soft,
  );

  useCaseCard(slide, ctx, spec.useCases[0], 72, 216, 548, 214, theme.accent);
  useCaseCard(slide, ctx, spec.useCases[1], 660, 216, 548, 214, theme.teal);
  useCaseCard(slide, ctx, spec.useCases[2], 72, 438, 548, 214, theme.navy);
  useCaseCard(slide, ctx, spec.useCases[3], 660, 438, 548, 214, theme.gold);

  footer(slide, ctx, 5, `TransferAI | ${spec.title} | Cas d’usage`);
  return slide;
}
