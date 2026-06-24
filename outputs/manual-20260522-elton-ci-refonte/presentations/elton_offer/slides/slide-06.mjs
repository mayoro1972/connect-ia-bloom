import { THEME, bg, bulletLines, card, footer, kicker, paragraph, title } from "./deck_helpers.mjs";

const AUDIENCES = [
  {
    title: "Direction générale et CODIR",
    modules: ["vision et stratégie IA", "gouvernance des usages", "décision assistée et priorisation"],
    color: THEME.accent,
    x: 58,
    y: 258,
  },
  {
    title: "Finance, administratif et commercial",
    modules: ["reporting assisté", "analyse documentaire", "rédaction et synthèse opérationnelles"],
    color: THEME.accent2,
    x: 646,
    y: 258,
  },
  {
    title: "Opérations, flotte et relation client",
    modules: ["procédures et FAQ internes", "qualité de réponse", "suivi des demandes et exploitation des données"],
    color: THEME.ink,
    x: 58,
    y: 446,
  },
  {
    title: "IT, data et transformation",
    modules: ["intégration des outils", "sécurité et rôles", "pilotage et gouvernance du dispositif"],
    color: THEME.accent,
    x: 646,
    y: 446,
  },
];

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "Formation ciblée");
  title(slide, ctx, "La formation n'a de valeur que si elle correspond à chaque population.", 58, 84, 920, 86, 33);
  paragraph(
    slide,
    ctx,
    "Le catalogue doit être présenté comme un outil de ciblage commercial. Pour ELTON, l'important n'est pas le nombre de modules disponibles, mais le bon module pour la bonne équipe au bon moment.",
    58,
    176,
    980,
    54,
    { size: 14, color: THEME.muted },
  );

  AUDIENCES.forEach((item) => {
    card(slide, ctx, item.x, item.y, 492, 154, {
      fill: THEME.surface,
      lineColor: THEME.accent3,
      barColor: item.color,
    });
    paragraph(slide, ctx, item.title, item.x + 28, item.y + 24, 398, 32, {
      size: 21,
      color: THEME.ink,
      face: THEME.serif,
      bold: true,
    });
    paragraph(slide, ctx, bulletLines(item.modules), item.x + 28, item.y + 72, 420, 62, {
      size: 12.5,
      color: THEME.muted,
    });
  });

  footer(slide, ctx, 6, "TransferAI Africa | Offre ciblée ELTON Oil CI | Formation");
  return slide;
}
