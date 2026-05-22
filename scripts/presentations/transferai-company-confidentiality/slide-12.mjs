import { palette, fullBleed, panel, title, body, kicker, footer, chip } from "./shared.mjs";

export async function slide12(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  kicker(slide, ctx, "IA sur mesure");
  title(slide, ctx, "Comment nous concevons une solution d'IA adaptée aux contraintes du client", 60, 78, 900, 74, 28);

  panel(slide, ctx, 60, 156, 760, 464, { fill: palette.paper, stroke: palette.stone });
  panel(slide, ctx, 850, 156, 370, 464, { fill: "#F4EEE8", stroke: "#F4EEE8" });

  const steps = [
    ["01", "Clarification du besoin", "Identifier l'objectif métier, le niveau de sensibilité et les limites à ne pas dépasser."],
    ["02", "Règles sur les données", "Définir ce qui est bloqué, ce qui doit être masqué et ce qui peut être utilisé avec contrôle."],
    ["03", "Configuration sur mesure", "Adapter la solution, l'hébergement, les accès et les connexions au contexte du client."],
    ["04", "Suivi dans la durée", "Contrôler les usages, corriger si nécessaire et garder une revue humaine sur les cas sensibles."],
  ];

  for (let index = 0; index < steps.length; index += 1) {
    const [step, label, desc] = steps[index];
    const y = 190 + index * 106;
    panel(slide, ctx, 92, y, 680, 88, { fill: index % 2 === 0 ? "#FCF7F2" : palette.paper, stroke: palette.stone });
    chip(slide, ctx, 116, y + 26, 58, step, palette.accentSoft, palette.accent);
    body(slide, ctx, label, 198, y + 20, 254, 22, 18, { bold: true, color: palette.ink, face: "Aptos Display" });
    body(slide, ctx, desc, 198, y + 46, 520, 26, 13.6, { color: palette.inkSoft });
  }

  body(slide, ctx, "Ce que le client retient", 882, 186, 180, 18, 10.5, { bold: true, color: palette.accent });
  title(slide, ctx, "Une IA gouvernée, pas improvisée.", 882, 216, 260, 64, 24, palette.dark);
  body(
    slide,
    ctx,
    "Nous concevons une IA utile, maintenable et compatible avec les exigences de confidentialité de l'organisation.",
    882,
    298,
    284,
    72,
    14.2,
    { color: palette.inkSoft },
  );

  const pills = [
    "Nous définissons d'abord ce qui doit rester en dehors du modèle.",
    "Nous adaptons la solution d'IA à votre gouvernance, pas l'inverse.",
    "Nous privilégions filtrage, masquage des identités et supervision avant automatisation.",
  ];
  for (let index = 0; index < pills.length; index += 1) {
    const y = 390 + index * 58;
    panel(slide, ctx, 882, y, 286, 50, { fill: palette.paper, stroke: palette.stone });
    body(slide, ctx, pills[index], 898, y + 8, 254, 34, 11.4, { bold: true, color: palette.ink });
  }

  footer(slide, ctx, 12, "TransferAI Africa | Le bon message : une IA utile, maîtrisable et compatible avec la confidentialité du client");
  return slide;
}
