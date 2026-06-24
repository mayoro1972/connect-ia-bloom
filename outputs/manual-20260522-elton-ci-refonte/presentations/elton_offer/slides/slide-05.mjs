import { THEME, bg, bulletLines, card, footer, kicker, paragraph, title } from "./deck_helpers.mjs";

const BLOCKS = [
  {
    title: "Audit, cadrage et feuille de route",
    bullets: ["diagnostic des points de friction critiques", "lecture simple des gains rapides et des prérequis"],
    fill: THEME.surface,
    bar: THEME.accent,
    x: 58,
    y: 258,
    w: 540,
    h: 156,
  },
  {
    title: "Formation dirigeants et managers",
    bullets: ["vision, arbitrage et gouvernance de l'IA", "conduite du changement et lecture des risques"],
    fill: THEME.accent,
    bar: THEME.accent,
    textColor: THEME.white,
    bodyColor: "#F8E7D8",
    x: 642,
    y: 258,
    w: 496,
    h: 156,
  },
  {
    title: "Formation équipes métier",
    bullets: ["reporting, rédaction, synthèse et exploitation de l'information", "service client, flotte, opérations, fonctions support"],
    fill: THEME.surface,
    bar: THEME.accent2,
    x: 58,
    y: 436,
    w: 540,
    h: 156,
  },
  {
    title: "Pilote et accompagnement de mise en œuvre",
    bullets: ["assistant métier ciblé, tableau de bord ou base interne", "mise en place progressive avec validation humaine"],
    fill: THEME.surface,
    bar: THEME.ink,
    x: 642,
    y: 436,
    w: 496,
    h: 156,
  },
];

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "Architecture d'offre");
  title(slide, ctx, "L'offre complète relie diagnostic, compétences et mise en œuvre.", 58, 84, 900, 86, 33);
  paragraph(
    slide,
    ctx,
    "La proposition gagne en crédibilité quand elle montre clairement que la valeur ne vient pas d'un outil isolé, mais de la combinaison entre priorisation, formation utile, cadre de confiance et premier terrain d'exécution.",
    58,
    176,
    980,
    54,
    { size: 14, color: THEME.muted },
  );

  BLOCKS.forEach((block) => {
    card(slide, ctx, block.x, block.y, block.w, block.h, {
      fill: block.fill,
      lineColor: block.fill === THEME.accent ? block.fill : THEME.accent3,
      barColor: block.bar,
    });
    paragraph(slide, ctx, block.title, block.x + 28, block.y + 24, block.w - 44, 48, {
      size: 22,
      color: block.textColor ?? THEME.ink,
      face: THEME.serif,
      bold: true,
    });
    paragraph(slide, ctx, bulletLines(block.bullets), block.x + 28, block.y + 84, block.w - 52, 56, {
      size: 12.5,
      color: block.bodyColor ?? THEME.muted,
    });
  });

  footer(slide, ctx, 5, "TransferAI Africa | Offre ciblée ELTON Oil CI | Architecture d'offre");
  return slide;
}
