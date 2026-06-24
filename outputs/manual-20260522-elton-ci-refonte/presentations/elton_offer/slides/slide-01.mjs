import { THEME, bg, rect, card, footer, kicker, metricRail, paragraph, text, title } from "./deck_helpers.mjs";

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  rect(slide, ctx, 58, 64, 6, 58, THEME.accent);
  text(slide, ctx, "PROPOSITION CIBLÉE | DOCUMENT DE TRAVAIL", 82, 66, 360, 18, {
    size: 10,
    color: THEME.muted,
    bold: true,
  });
  text(slide, ctx, "TransferAI Africa x ELTON Oil CI", 82, 92, 340, 18, {
    size: 10,
    color: THEME.muted,
  });

  title(
    slide,
    ctx,
    "Faire de l'IA un levier opérationnel utile pour ELTON Oil CI, sans effet d'annonce ni déploiement prématuré.",
    58,
    156,
    670,
    170,
    28,
  );

  paragraph(
    slide,
    ctx,
    "Notre recommandation : commencer par un audit ciblé, former les bonnes populations, puis lancer un premier pilote sur des sujets directement liés aux comptes professionnels, à la flotte, à la relation client et au reporting.",
    58,
    346,
    610,
    96,
    { size: 15, color: THEME.muted },
  );

  paragraph(
    slide,
    ctx,
    "Ce que la direction doit obtenir rapidement : des priorités claires, des cas d'usage crédibles, une trajectoire de déploiement maîtrisée et des critères simples pour décider de la suite.",
    58,
    452,
    610,
    78,
    { size: 13.5, color: THEME.ink, bold: true },
  );

  card(slide, ctx, 764, 84, 430, 450, { fill: THEME.dark, lineColor: THEME.dark });
  text(slide, ctx, "THÈSE", 802, 120, 120, 18, { size: 10, color: THEME.darkSoft, bold: true });
  text(
    slide,
    ctx,
    "L'offre la plus crédible pour ELTON n'est pas un catalogue de formations. C'est une démarche courte, cadrée et utile qui relie diagnostic, compétences, gouvernance et premier terrain d'exécution.",
    802,
    160,
    340,
    142,
    { size: 21, color: THEME.white, face: THEME.serif, bold: true },
  );
  paragraph(
    slide,
    ctx,
    "Pourquoi cette approche tient mieux face à un DG : elle évite les promesses vagues, part des priorités métier, et prépare une décision d'investissement sur des bases observables.",
    802,
    330,
    340,
    94,
    { size: 13, color: THEME.darkSoft },
  );
  rect(slide, ctx, 802, 442, 300, 2, THEME.accent2);
  paragraph(
    slide,
    ctx,
    "Audit d'entrée, formation ciblée, cadre de confiance, puis pilote seulement si le terrain le justifie.",
    802,
    458,
    320,
    52,
    { size: 12.5, color: THEME.white, bold: true },
  );

  metricRail(slide, ctx, 58, 572, [
    { value: "0 FCFA", label: "Audit d'entrée", note: "point de départ recommandé" },
    { value: "45 min", label: "Échange de cadrage", note: "avec la direction ou son représentant" },
    { value: "4", label: "Chantiers prioritaires", note: "comptes pro, flotte, service, reporting" },
    { value: "1", label: "Feuille de route", note: "orientée décision et exécution" },
  ]);

  footer(slide, ctx, 1, "TransferAI Africa | Offre ciblée ELTON Oil CI | Couverture");
  return slide;
}
