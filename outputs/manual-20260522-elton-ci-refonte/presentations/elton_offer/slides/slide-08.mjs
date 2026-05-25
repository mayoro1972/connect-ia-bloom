import { THEME, bg, card, footer, kicker, metricRail, paragraph, rect, text, title } from "./deck_helpers.mjs";

export async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "Mesure de la valeur");
  title(slide, ctx, "Le pilote doit être jugé sur quelques indicateurs business simples.", 58, 84, 900, 86, 33);
  paragraph(
    slide,
    ctx,
    "Le feedback demandait du ROI et des résultats mesurables. La meilleure réponse, sans inventer de chiffres, est de montrer dès maintenant ce que la direction pourra mesurer pendant le pilote.",
    58,
    176,
    980,
    54,
    { size: 14, color: THEME.muted },
  );

  metricRail(slide, ctx, 58, 286, [
    { value: "Temps", label: "Heures récupérées", note: "reporting, relances, recherche d'information" },
    { value: "Qualité", label: "Erreurs et re-saisies", note: "cohérence, conformité, fiabilité" },
    { value: "Service", label: "Délais de réponse", note: "clients internes et externes" },
    { value: "Adoption", label: "Usage réel par équipe", note: "taux d'utilisation, récurrence, utilité perçue" },
  ]);

  card(slide, ctx, 58, 416, 640, 160, { fill: THEME.surface, lineColor: THEME.accent3, barColor: THEME.accent2 });
  text(slide, ctx, "Lecture DG attendue", 86, 444, 200, 24, {
    size: 18,
    color: THEME.ink,
    face: THEME.serif,
    bold: true,
  });
  paragraph(
    slide,
    ctx,
    "À la fin du pilote, la question n'est pas “l'IA est-elle intéressante ?”, mais “quels gains ont été observés, sur quels processus, à quelles conditions, et faut-il étendre ou non ?”.",
    86,
    486,
    560,
    52,
    { size: 12.5, color: THEME.muted },
  );

  card(slide, ctx, 736, 416, 462, 192, { fill: THEME.dark, lineColor: THEME.dark });
  text(slide, ctx, "FORMULE DE LECTURE ROI", 772, 446, 220, 18, {
    size: 10,
    color: THEME.darkSoft,
    bold: true,
  });
  text(
    slide,
    ctx,
    "heures récupérées\n+ erreurs évitées\n+ meilleure qualité de service\n- coût de mise en œuvre",
    772,
    484,
    232,
    118,
    { size: 17, color: THEME.white, face: THEME.serif, bold: true },
  );
  paragraph(
    slide,
    ctx,
    "Cette quantification doit être objectivée dans l'audit, puis suivie sur le pilote.",
    1026,
    488,
    136,
    74,
    { size: 10.5, color: THEME.darkSoft },
  );

  footer(slide, ctx, 8, "TransferAI Africa | Offre ciblée ELTON Oil CI | Mesure de la valeur");
  return slide;
}
