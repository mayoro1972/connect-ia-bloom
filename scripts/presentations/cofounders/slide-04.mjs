import { loadData, palette, fullBleed, title, body, kicker, footer, panel, tierColor } from "./shared.mjs";

function domainDot(slide, ctx, x, y, label, color) {
  panel(slide, ctx, x - 8, y - 8, 16, 16, { fill: color, stroke: color });
  body(slide, ctx, label, x + 16, y - 10, 118, 20, 10.5, { bold: true, color: palette.ink });
}

export async function slide04(presentation, ctx) {
  const data = await loadData();
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, "#FFFDFC");

  kicker(slide, ctx, "Matrice de priorité");
  title(slide, ctx, "La priorité doit croiser facilité de vente et vitesse de ROI", 60, 78, 860, 60, 30);

  const axisX = 180;
  const axisY = 570;
  const chartW = 700;
  const chartH = 310;

  body(slide, ctx, "ROI rapide", 86, 206, 80, 18, 11, { bold: true, color: palette.accent });
  body(slide, ctx, "ROI plus lent", 86, 540, 90, 18, 11, { bold: true, color: palette.tier3 });
  body(slide, ctx, "Vente plus difficile", 198, 592, 120, 18, 11, { bold: true, color: palette.tier3 });
  body(slide, ctx, "Vente plus facile", 730, 592, 110, 18, 11, { bold: true, color: palette.accent });

  panel(slide, ctx, axisX, axisY - chartH, chartW, chartH, { fill: "#FCFAF7", stroke: palette.line });
  panel(slide, ctx, axisX + chartW / 2 - 1, axisY - chartH, 2, chartH, { fill: palette.line, stroke: palette.line });
  panel(slide, ctx, axisX, axisY - chartH / 2 - 1, chartW, 2, { fill: palette.line, stroke: palette.line });

  const points = [
    [645, 305, "IT & Transfo", "Tier 1"],
    [610, 345, "Service Client", "Tier 1"],
    [555, 380, "Marketing", "Tier 1"],
    [505, 425, "Administration", "Tier 1"],
    [635, 470, "Assistanat", "Tier 1"],
    [420, 390, "RH", "Tier 2"],
    [360, 470, "Data", "Tier 2"],
    [330, 435, "Finance", "Tier 2"],
    [660, 528, "Formation", "Tier 2"],
    [255, 495, "Juridique", "Tier 3"],
    [470, 502, "Management", "Tier 3"],
    [390, 536, "Santé", "Tier 3"],
    [240, 545, "Diplomatie", "Tier 3"]
  ];

  points.forEach(([x, y, label, tier]) => domainDot(slide, ctx, x, y, label, tierColor(tier)));

  panel(slide, ctx, 945, 210, 255, 410, { fill: palette.dark, stroke: palette.dark });
  body(slide, ctx, "Lecture stratégique", 975, 236, 180, 18, 11, { bold: true, color: "#D6E0EA" });
  body(slide, ctx, "Le quadrant en haut à droite doit absorber l'essentiel du temps commercial.", 975, 266, 190, 160, 22, { bold: true, color: "#FFFFFF", face: "Aptos Display" });
  body(
    slide,
    ctx,
    `Top 5 retenus : ${data.topPriorities.map((item) => item.domain).join(", ")}.`,
    975,
    428,
    190,
    96,
    13,
    { color: "#FFFFFF" }
  );
  body(
    slide,
    ctx,
    "Les autres domaines restent utiles, mais plutôt comme extension ou réponse à une demande entrante qualifiée.",
    975,
    552,
    190,
    50,
    11,
    { color: "#D6E0EA" }
  );

  footer(slide, ctx, 4, "Priorité commerciale : là où la démonstration est simple et la valeur visible rapidement.");
  return slide;
}
