import { THEME, bg, card, footer, kicker, paragraph, rect, text, title } from "./deck_helpers.mjs";

const STEPS = [
  {
    label: "Semaine 1",
    title: "Cadrage et sélection des priorités",
    body: "échange de 45 minutes, clarification du périmètre et choix de 2 à 3 sujets à creuser",
  },
  {
    label: "Semaine 2",
    title: "Diagnostic ciblé",
    body: "cartographie légère des flux, identification des frictions, lecture des données et contraintes",
  },
  {
    label: "Semaine 3",
    title: "Restitution et orientation",
    body: "note de recommandations, quick wins, besoins de formation et trajectoire de mise en œuvre",
  },
];

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "Audit recommandé");
  title(slide, ctx, "La bonne porte d'entrée est un audit court avec des livrables précis.", 58, 84, 900, 86, 33);
  paragraph(
    slide,
    ctx,
    "Le rôle de cet audit n'est pas de vendre plus. Il est de qualifier la bonne suite : formation ciblée, accompagnement de déploiement, pilote restreint, ou simple feuille de route à reprendre plus tard.",
    58,
    176,
    1000,
    54,
    { size: 14, color: THEME.muted },
  );

  rect(slide, ctx, 118, 374, 1020, 2, THEME.accent3);
  STEPS.forEach((step, index) => {
    const x = 78 + index * 374;
    rect(slide, ctx, x + 100, 362, 26, 26, index === 1 ? THEME.accent2 : THEME.accent, {
      line: ctx.line(index === 1 ? THEME.accent2 : THEME.accent, 1),
    });
    text(slide, ctx, String(index + 1), x + 107, 366, 12, 12, {
      size: 10,
      color: THEME.white,
      bold: true,
      align: "center",
      valign: "middle",
    });
    paragraph(slide, ctx, step.label, x, 270, 180, 18, {
      size: 10,
      color: index === 1 ? THEME.accent2 : THEME.accent,
      bold: true,
    });
    text(slide, ctx, step.title, x, 298, 240, 48, {
      size: 20,
      color: THEME.ink,
      face: THEME.serif,
      bold: true,
    });
    paragraph(slide, ctx, step.body, x, 406, 248, 60, {
      size: 12.5,
      color: THEME.muted,
    });
  });

  card(slide, ctx, 58, 560, 1140, 88, { fill: THEME.dark, lineColor: THEME.dark });
  paragraph(slide, ctx, "Livrables remis à la direction", 86, 582, 240, 18, {
    size: 10,
    color: THEME.darkSoft,
    bold: true,
  });
  paragraph(
    slide,
    ctx,
    "1. une lecture claire des priorités ; 2. des cas d'usage à arbitrer ; 3. les populations à former en premier ; 4. les conditions minimales de gouvernance et de déploiement.",
    86,
    606,
    1020,
    24,
    { size: 13, color: THEME.white, bold: true },
  );

  footer(slide, ctx, 4, "TransferAI Africa | Offre ciblée ELTON Oil CI | Audit");
  return slide;
}
