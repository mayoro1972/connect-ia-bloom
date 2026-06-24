import { THEME, bg, card, footer, kicker, paragraph, rect, text, title } from "./deck_helpers.mjs";

export async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "Prochaine étape");
  title(slide, ctx, "La suite la plus crédible est simple : cadrer, auditer, décider.", 58, 84, 900, 86, 33);
  paragraph(
    slide,
    ctx,
    "L'appel à l'action doit rester unique et clair. L'objectif du premier échange n'est pas de vendre un programme complet, mais de vérifier si un audit ciblé a du sens pour ELTON et sur quels sujets.",
    58,
    176,
    980,
    54,
    { size: 14, color: THEME.muted },
  );

  const steps = [
    ["01", "Échange de cadrage", "45 minutes avec la direction ou la personne mandatée"],
    ["02", "Audit d'entrée", "lecture rapide des priorités, frictions, données et risques"],
    ["03", "Orientation", "note de recommandations et arbitrage sur la bonne suite"],
  ];

  steps.forEach((step, index) => {
    const x = 58 + index * 252;
    rect(slide, ctx, x, 286, 54, 54, index === 1 ? THEME.accent2 : THEME.accent);
    text(slide, ctx, step[0], x, 298, 54, 24, {
      size: 20,
      color: THEME.white,
      face: THEME.serif,
      bold: true,
      align: "center",
      valign: "middle",
    });
    text(slide, ctx, step[1], x + 78, 288, 166, 28, {
      size: 19,
      color: THEME.ink,
      face: THEME.serif,
      bold: true,
    });
    paragraph(slide, ctx, step[2], x + 78, 326, 170, 42, {
      size: 12.5,
      color: THEME.muted,
    });
  });

  card(slide, ctx, 828, 266, 370, 312, { fill: THEME.dark, lineColor: THEME.dark });
  text(slide, ctx, "Coordonnées à partager", 862, 304, 220, 24, {
    size: 18,
    color: THEME.white,
    face: THEME.serif,
    bold: true,
  });
  paragraph(
    slide,
    ctx,
    "www.transferai.ci\ncontact@transferai.ci\n+225 07 16 57 39 90\nRiviera 3, carrefour Sainte Famille, Abidjan",
    862,
    348,
    250,
    112,
    { size: 12.5, color: THEME.darkSoft },
  );
  rect(slide, ctx, 862, 484, 238, 2, THEME.accent2);
  paragraph(
    slide,
    ctx,
    "Formule courte recommandée : nous vous aidons à identifier les usages les plus utiles, à former les bonnes équipes et à choisir la bonne suite pour l'entreprise.",
    862,
    504,
    272,
    60,
    { size: 11.5, color: THEME.white, bold: true },
  );

  footer(slide, ctx, 9, "TransferAI Africa | Offre ciblée ELTON Oil CI | Clôture");
  return slide;
}
