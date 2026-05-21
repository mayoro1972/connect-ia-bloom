import { loadData, palette, fullBleed, panel, title, body, kicker, metricCard, footer } from "./shared.mjs";

export async function slide01(presentation, ctx) {
  const data = await loadData();
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  panel(slide, ctx, 900, 0, 380, 720, { fill: palette.dark, stroke: palette.dark });
  kicker(slide, ctx, "Réunion stratégique", 60, 48, 220);
  title(slide, ctx, data.meta.title, 60, 110, 720, 110, 36);
  body(slide, ctx, data.meta.subtitle, 60, 238, 700, 54, 18, { color: palette.inkSoft });
  body(slide, ctx, `Date : ${data.meta.date}`, 60, 308, 220, 20, 12, { bold: true, color: palette.accent });

  body(slide, ctx, "Objet de la séance", 944, 92, 240, 24, 20, { bold: true, color: "#FFFFFF", face: "Aptos Display" });
  body(slide, ctx, data.meta.meetingPurpose, 944, 134, 260, 128, 16, { color: "#DCE5EF" });
  body(
    slide,
    ctx,
    "Question centrale : sur quels domaines concentrer la prospection et quelles offres pousser en priorité ?",
    944,
    304,
    256,
    140,
    17,
    { face: "Aptos Display", bold: true, color: "#FFFFFF" }
  );

  metricCard(slide, ctx, 60, 510, 250, 120, "13", "domaines structurés", "base déjà présente sur le site et dans le catalogue", palette.accent);
  metricCard(slide, ctx, 330, 510, 250, 120, "05", "priorités court terme", "domaines à pousser sans attendre", palette.tier2);
  metricCard(slide, ctx, 600, 510, 250, 120, "90j", "fenêtre d'exécution", "pour convertir l'offre en pipeline concret", palette.tier3);

  footer(slide, ctx, 1, "TransferAI Africa | Réunion des cofondateurs | Synthèse stratégique Côte d'Ivoire");
  return slide;
}
