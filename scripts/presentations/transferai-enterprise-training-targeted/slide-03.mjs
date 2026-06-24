import { deck, palette, fullBleed, panel, title, body, kicker, bulletList, footer } from "./shared.mjs";

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  kicker(slide, ctx, "Objectifs");
  title(slide, ctx, "Ce que cette approche cherche à améliorer", 60, 78, 680, 52, 30);
  body(
    slide,
    ctx,
    "Pour une entreprise comme Elton CI, l'enjeu n'est pas d'ajouter un outil de plus, mais de mieux organiser la décision, la formation et l'exécution.",
    60,
    140,
    700,
    36,
    14,
  );

  panel(slide, ctx, 60, 206, 560, 364, { fill: palette.paper, stroke: palette.stone });
  body(slide, ctx, "Objectifs prioritaires", 88, 232, 220, 18, 10.5, { bold: true, color: palette.accent });
  bulletList(slide, ctx, deck.objectives, 88, 272, 500, {
    gap: 58,
    size: 15,
    itemHeight: 40,
    color: palette.ink,
  });

  panel(slide, ctx, 680, 206, 500, 168, { fill: palette.dark, stroke: palette.dark });
  body(slide, ctx, "Résultat attendu", 710, 232, 180, 18, 10.5, { bold: true, color: "#D7E2EE" });
  title(slide, ctx, "Des équipes mieux préparées et des priorités mieux choisies.", 710, 262, 420, 58, 24, palette.white);
  body(
    slide,
    ctx,
    "L'offre formation n'est crédible que si elle est connectée à des besoins réels et à une suite opérationnelle.",
    710,
    324,
    420,
    30,
    12.6,
    { color: "#EDF3FA" },
  );

  panel(slide, ctx, 680, 402, 500, 168, { fill: "#FFF7F1", stroke: "#FFF7F1" });
  body(slide, ctx, "Populations à adresser", 710, 428, 180, 18, 10.5, { bold: true, color: palette.accent });
  body(slide, ctx, "Direction générale", 710, 460, 180, 18, 14, { bold: true, color: palette.ink, face: "Aptos Display" });
  body(slide, ctx, "Managers et responsables de pôle", 710, 488, 240, 18, 14, { bold: true, color: palette.ink, face: "Aptos Display" });
  body(slide, ctx, "Équipes finance, opérations, relation client", 710, 516, 320, 18, 14, { bold: true, color: palette.ink, face: "Aptos Display" });

  footer(slide, ctx, 3, "La formation doit être présentée comme un levier d'exécution et de performance, pas comme un catalogue isolé.");
  return slide;
}
