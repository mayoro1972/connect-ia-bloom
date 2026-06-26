import { spec, theme, bg, title, body, kicker, footer, card, bulletBlock } from "./shared.mjs";

function trainingRow(slide, ctx, index, label, y) {
  card(slide, ctx, 72, y, 574, 42, { fill: theme.panel });
  card(slide, ctx, 88, y + 8, 34, 26, { fill: theme.accent, border: theme.accent });
  body(slide, ctx, String(index + 1).padStart(2, "0"), 88, y + 14, 34, 12, 9.5, theme.white, {
    bold: true,
    align: "center",
  });
  body(slide, ctx, label, 138, y + 12, 484, 16, 11.2, theme.ink, { bold: true });
}

export async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Formation et standardisation");
  title(slide, ctx, "Le bon catalogue ciblé prépare des gestes métier réels, pas une simple acculturation théorique.", 72, 88, 1040, 68, 25.3);
  body(
    slide,
    ctx,
    "Chaque proposition sectorielle TransferAI combine un noyau de formations activables et des usages de standardisation qui rendent l’adoption plus durable dans le temps.",
    72,
    164,
    920,
    36,
    12,
    theme.soft,
  );

  card(slide, ctx, 72, 222, 574, 380, { fill: theme.panelAlt });
  title(slide, ctx, "Formations prioritaires à activer", 98, 244, 300, 22, 18);
  spec.trainingFocus.slice(0, 6).forEach((training, index) => {
    trainingRow(slide, ctx, index, training, 282 + index * 50);
  });

  card(slide, ctx, 678, 222, 530, 380, { fill: theme.panel });
  title(slide, ctx, "Ce que ce dispositif doit standardiser concrètement", 704, 244, 388, 42, 16.1);
  bulletBlock(slide, ctx, spec.standardization, 704, 292, 464, 112, { size: 12, color: theme.ink });
  body(
    slide,
    ctx,
    "Après la formation, les équipes formées gardent un accès à la communauté TransferAI pour partager leurs cas, leurs difficultés et obtenir des conseils pratiques orientés exécution.",
    704,
    430,
    464,
    56,
    11.2,
    theme.soft,
    { bold: true },
  );
  body(
    slide,
    ctx,
    "Cette logique augmente la probabilité d’usage réel, sécurise les premiers tests et réduit l’effet “formation oubliée” après quelques semaines.",
    704,
    498,
    464,
    42,
    10.8,
    theme.ink,
  );

  footer(slide, ctx, 7, `TransferAI | ${spec.title} | Formation et standardisation`);
  return slide;
}
