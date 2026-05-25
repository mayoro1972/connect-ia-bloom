import { THEME, bg, card, footer, kicker, paragraph, rect, text, title } from "./deck_helpers.mjs";

const USE_CASES = [
  {
    title: "Comptes pro et recouvrement",
    challenge: "données dispersées, relances irrégulières, faible lisibilité portefeuille",
    action: "assistant de suivi, synthèse des comptes, aide à la priorisation des relances",
    kpi: "KPI à suivre : délai de relance, encours à risque, temps de revue portefeuille",
    color: THEME.accent,
  },
  {
    title: "Flotte et cartes carburant",
    challenge: "lecture manuelle des consommations, anomalies difficiles à consolider",
    action: "analyse assistée des écarts, alertes sur cas atypiques, tableau de bord lisible",
    kpi: "KPI à suivre : temps d'analyse, anomalies remontées, fréquence des écarts",
    color: THEME.accent2,
  },
  {
    title: "Relation client et service auto",
    challenge: "suivi d'interactions hétérogène, réponses lentes, rappels non homogènes",
    action: "support à la rédaction, structuration des réponses, journal simple des interactions",
    kpi: "KPI à suivre : délai de réponse, volume en attente, satisfaction client",
    color: THEME.ink,
  },
  {
    title: "Procédures et knowledge base interne",
    challenge: "information utile difficile à retrouver, dépendance à quelques personnes-clés",
    action: "base interne de réponses, diffusion guidée des procédures et bonnes pratiques",
    kpi: "KPI à suivre : temps de recherche, taux de conformité, qualité de l'onboarding",
    color: THEME.accent,
  },
];

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "Cas d'usage");
  title(slide, ctx, "Quatre cas d'usage où l'IA peut aider ELTON sans perturber l'exploitation.", 58, 84, 980, 86, 33);
  paragraph(
    slide,
    ctx,
    "La bonne logique n'est pas de tout automatiser. Elle consiste à choisir quelques terrains où la donnée existe déjà, où le besoin métier est clair, et où la valeur peut être mesurée.",
    58,
    176,
    980,
    50,
    { size: 14, color: THEME.muted },
  );

  USE_CASES.forEach((item, index) => {
    const x = 58 + index * 294;
    card(slide, ctx, x, 260, 266, 330, { fill: THEME.surface, lineColor: THEME.accent3 });
    rect(slide, ctx, x, 260, 266, 10, item.color, { line: ctx.line(item.color, 1) });
    text(slide, ctx, item.title, x + 18, 288, 220, 54, {
      size: 18,
      color: THEME.ink,
      face: THEME.serif,
      bold: true,
    });
    paragraph(slide, ctx, "Point de friction", x + 18, 356, 120, 16, {
      size: 9.5,
      color: item.color,
      bold: true,
    });
    paragraph(slide, ctx, item.challenge, x + 18, 378, 224, 56, {
      size: 11.5,
      color: THEME.muted,
    });
    paragraph(slide, ctx, "Réponse possible", x + 18, 448, 140, 16, {
      size: 9.5,
      color: item.color,
      bold: true,
    });
    paragraph(slide, ctx, item.action, x + 18, 470, 224, 60, {
      size: 11.5,
      color: THEME.ink,
    });
    paragraph(slide, ctx, item.kpi, x + 18, 548, 224, 34, {
      size: 9.5,
      color: THEME.muted,
      bold: true,
    });
  });

  footer(slide, ctx, 3, "TransferAI Africa | Offre ciblée ELTON Oil CI | Cas d'usage");
  return slide;
}
