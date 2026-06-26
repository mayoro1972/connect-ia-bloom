import { spec, theme, bg, title, body, kicker, footer, roiCard, card } from "./shared.mjs";

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "ROI de référence");
  title(slide, ctx, "Le ROI n’a de valeur que s’il est relié à des KPI simples, lisibles et discutables.", 72, 88, 970, 64, 25.2);
  body(
    slide,
    ctx,
    "Les repères ci-dessous sont des hypothèses prudentes ou des benchmarks à confirmer pendant l’audit. TransferAI ne vend pas des chiffres abstraits ; nous proposons une mesure utile du premier terrain.",
    72,
    160,
    940,
    36,
    12.1,
    theme.soft,
  );

  roiCard(slide, ctx, spec.roiMetrics[0], 72, 230, 250, 128);
  roiCard(slide, ctx, spec.roiMetrics[1], 350, 230, 250, 128);
  roiCard(slide, ctx, spec.roiMetrics[2], 628, 230, 250, 128);
  roiCard(slide, ctx, spec.roiMetrics[3], 906, 230, 250, 128);

  card(slide, ctx, 72, 398, 1136, 208, { fill: theme.panel });
  title(slide, ctx, "Comment rendre ce ROI crédible dès le premier rendez-vous", 98, 422, 492, 42, 16.8);
  body(
    slide,
    ctx,
    "1. Partir d’un flux métier concret et visible.\n2. Nommer le ou les KPI que la direction lit déjà.\n3. Limiter le premier pilote à un terrain mesurable.\n4. Revoir les résultats avec les responsables métier avant toute extension.",
    98,
    474,
    450,
    92,
    12,
    theme.ink,
  );
  body(
    slide,
    ctx,
    "Exemples de KPI souvent retenus : temps de cycle, délai de réponse, temps de préparation d’un comité, nombre d’étapes manuelles, volume d’anomalies détectées plus tôt, homogénéité des livrables, taux de résolution au premier niveau, vitesse d’onboarding.",
    610,
    448,
    552,
    114,
    11.6,
    theme.soft,
  );

  footer(slide, ctx, 4, `TransferAI | ${spec.title} | ROI et KPI`);
  return slide;
}
