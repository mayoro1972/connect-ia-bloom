import { palette, fullBleed, panel, title, body, kicker, footer, addLogo, metricCard } from "./shared.mjs";

export async function slide10(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  await addLogo(slide, ctx, 60, 58, 200, 72);
  kicker(slide, ctx, "Confiance et confidentialité", 60, 146, 300);
  title(slide, ctx, "Pourquoi nos clients peuvent nous confier des sujets sensibles", 60, 182, 620, 78, 31);
  body(
    slide,
    ctx,
    "Notre position est simple : nous ne traitons pas les données sensibles comme une matière à envoyer automatiquement vers un outil d'intelligence artificielle. Nous définissons d'abord ce qui doit rester protégé, puis seulement les usages autorisés.",
    60,
    278,
    620,
    90,
    15,
    { color: palette.inkSoft },
  );

  metricCard(slide, ctx, 60, 408, 188, 92, "01", "protection par défaut", palette.dark);
  metricCard(slide, ctx, 270, 408, 188, 92, "02", "données limitées", palette.accent);
  metricCard(slide, ctx, 480, 408, 188, 92, "03", "solution sur mesure", palette.green);

  panel(slide, ctx, 60, 534, 620, 110, { fill: palette.paper, stroke: palette.stone });
  body(slide, ctx, "Message à retenir", 88, 558, 150, 18, 10.5, { bold: true, color: palette.accent });
  body(
    slide,
    ctx,
    "Vos données sensibles ne sont pas exposées à un modèle d'IA sans règles claires, filtrage préalable et cadre de gouvernance explicite.",
    88,
    588,
    552,
    34,
    13.6,
    { bold: true, color: palette.ink, face: "Aptos Display" },
  );

  panel(slide, ctx, 742, 140, 438, 492, { fill: palette.dark, stroke: palette.dark });
  body(slide, ctx, "Ce que nous mettons en place", 774, 170, 180, 18, 10.5, { bold: true, color: "#C9D8E8" });
  title(slide, ctx, "Une IA utile sans banaliser la confidentialité.", 774, 202, 320, 96, 26, palette.white);
  body(
    slide,
    ctx,
    "Nous filtrons les données, nous écartons les informations nominatives et nous adaptons les usages au niveau de sensibilité du client.",
    774,
    324,
    330,
    78,
    15,
    { color: "#E7EEF6" },
  );
  body(slide, ctx, "• Limitation des données au strict nécessaire", 774, 442, 320, 22, 14.2, { bold: true, color: palette.white });
  body(slide, ctx, "• Masquage des identités avant traitement", 774, 474, 320, 22, 14.2, { bold: true, color: palette.white });
  body(slide, ctx, "• Accès contrôlés et suivi des usages", 774, 506, 320, 22, 14.2, { bold: true, color: palette.white });
  body(slide, ctx, "• Revue humaine sur les cas critiques", 774, 538, 300, 22, 14.5, { bold: true, color: palette.white });

  footer(slide, ctx, 10, "TransferAI Africa | Confidentialité, gouvernance et IA utile");
  return slide;
}
