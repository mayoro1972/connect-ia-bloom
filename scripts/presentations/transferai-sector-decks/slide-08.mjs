import { spec, theme, bg, title, body, kicker, footer, timelineCard, card } from "./shared.mjs";

export async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Parcours 90 jours");
  title(slide, ctx, "La séquence recommandée va du cadrage à la mesure, avec validation à chaque palier.", 72, 84, 960, 64, 26);
  body(
    slide,
    ctx,
    "L’objectif n’est pas de “déployer de l’IA” d’un bloc, mais de passer par des étapes courtes, visibles et gouvernées, avec un point de décision clair à chaque jalon.",
    72,
    152,
    930,
    36,
    12,
    theme.soft,
  );

  timelineCard(slide, ctx, spec.timeline[0], 72, 224, 254, 274);
  timelineCard(slide, ctx, spec.timeline[1], 350, 224, 254, 274, theme.teal);
  timelineCard(slide, ctx, spec.timeline[2], 628, 224, 254, 274, theme.navy);
  timelineCard(slide, ctx, spec.timeline[3], 906, 224, 302, 274, theme.gold);

  card(slide, ctx, 72, 544, 1136, 72, { fill: theme.panelAlt, border: theme.line });
  title(slide, ctx, "Différentiel TransferAI", 98, 564, 180, 20, 14);
  body(
    slide,
    ctx,
    "Une structure de formation classique s’arrête au contenu. TransferAI forme, puis accompagne la mise en pratique, la relecture des premiers KPI, les ajustements et la décision d’extension pendant 90 jours.",
    98,
    590,
    1068,
    18,
    10.8,
    theme.ink,
  );

  footer(slide, ctx, 8, `TransferAI | ${spec.title} | Parcours 90 jours`);
  return slide;
}
