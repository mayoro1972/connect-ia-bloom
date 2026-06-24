import { THEME, bg, bulletLines, card, footer, kicker, paragraph, title } from "./deck_helpers.mjs";

const CHALLENGES = [
  {
    heading: "Comptes professionnels",
    body: [
      "mieux suivre les échéances, relances et revues de portefeuille",
      "fiabiliser la circulation de l'information commerciale et administrative",
    ],
    note: "enjeu DG : visibilité et qualité de pilotage",
    color: THEME.accent,
  },
  {
    heading: "Flotte et cartes carburant",
    body: [
      "mieux exploiter les données de consommation, d'usage et d'écarts",
      "préparer des alertes et tableaux de bord réellement lisibles",
    ],
    note: "enjeu DG : contrôle et lecture des anomalies",
    color: THEME.accent2,
  },
  {
    heading: "Service client et service auto",
    body: [
      "réduire le temps de réponse et améliorer le suivi des demandes",
      "mieux structurer les rappels, comptes rendus et historiques",
    ],
    note: "enjeu DG : qualité de service et cohérence de traitement",
    color: THEME.ink,
  },
  {
    heading: "Procédures et reporting",
    body: [
      "diffuser plus vite les bonnes pratiques et informations utiles",
      "réduire la dépendance à la mémoire individuelle pour exécuter et reporter",
    ],
    note: "enjeu DG : standardisation et montée en compétence",
    color: THEME.accent,
  },
];

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "Enjeux prioritaires");
  title(slide, ctx, "Les enjeux à traiter chez ELTON sont d'abord opérationnels, pas technologiques.", 58, 84, 900, 90, 33);
  paragraph(
    slide,
    ctx,
    "Le bon discours commercial n'est donc pas “voici notre IA”, mais “voici où nous pouvons vous aider à mieux décider, mieux exécuter et mieux former vos équipes”.",
    58,
    176,
    840,
    52,
    { size: 14, color: THEME.muted },
  );

  const positions = [
    [58, 260],
    [646, 260],
    [58, 472],
    [646, 472],
  ];

  CHALLENGES.forEach((item, index) => {
    const [x, y] = positions[index];
    card(slide, ctx, x, y, 536, 170, { fill: THEME.surface, lineColor: THEME.accent3, barColor: item.color });
    paragraph(slide, ctx, item.heading, x + 28, y + 22, 330, 32, {
      size: 22,
      color: THEME.ink,
      face: THEME.serif,
      bold: true,
    });
    paragraph(slide, ctx, bulletLines(item.body), x + 28, y + 66, 452, 62, {
      size: 12.5,
      color: THEME.muted,
    });
    paragraph(slide, ctx, item.note, x + 28, y + 132, 400, 18, {
      size: 9.5,
      color: item.color,
      bold: true,
    });
  });

  footer(slide, ctx, 2, "TransferAI Africa | Offre ciblée ELTON Oil CI | Enjeux");
  return slide;
}
