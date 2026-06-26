import { spec, theme, bg, title, body, kicker, footer, offerCard } from "./shared.mjs";

export async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  const titleContext = spec.titleSentence ?? spec.title.toLowerCase();

  kicker(slide, ctx, "Offre recommandée");
  title(slide, ctx, `La proposition TransferAI pour ${titleContext} s’organise en 4 briques simples à activer.`, 72, 88, 1040, 68, 25.3);
  body(
    slide,
    ctx,
    "Cette architecture permet de relier audit, formation, accompagnement, gouvernance et premier terrain d’exécution dans une seule logique commerciale compréhensible par le prospect.",
    72,
    164,
    940,
    36,
    12,
    theme.soft,
  );

  offerCard(slide, ctx, spec.offerBlocks[0], 72, 236, 548, 160);
  offerCard(slide, ctx, spec.offerBlocks[1], 660, 236, 548, 160, theme.teal);
  offerCard(slide, ctx, spec.offerBlocks[2], 72, 416, 548, 160, theme.navy);
  offerCard(slide, ctx, spec.offerBlocks[3], 660, 416, 548, 160, theme.gold);

  footer(slide, ctx, 9, `TransferAI | ${spec.title} | Offre recommandée`);
  return slide;
}
