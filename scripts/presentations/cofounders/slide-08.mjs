import { loadData, palette, fullBleed, title, body, kicker, footer, panel } from "./shared.mjs";

export async function slide08(presentation, ctx) {
  const data = await loadData();
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, "#FFFDFC");

  kicker(slide, ctx, "Plan 90 jours");
  title(slide, ctx, "Ce que nous devons exécuter dans les 90 prochains jours", 60, 78, 860, 60, 30);

  data.actionPlan90Days.forEach((step, index) => {
    const x = 70 + index * 285;
    panel(slide, ctx, x, 230, 240, 260, {
      fill: index % 2 === 0 ? palette.paper : "#F3F6F8",
      stroke: palette.line
    });
    body(slide, ctx, step.phase, x + 18, 252, 180, 18, 11, { bold: true, color: palette.accent });
    title(slide, ctx, step.goal, x + 18, 286, 200, 102, 20);
    body(slide, ctx, step.ownerHint, x + 18, 412, 180, 24, 11, { color: palette.inkSoft, bold: true });
  });

  panel(slide, ctx, 60, 550, 1120, 72, { fill: palette.dark, stroke: palette.dark });
  body(
    slide,
    ctx,
    "Livrable attendu à la fin du trimestre : un argumentaire stabilisé, trois démos fortes, une prospection ciblée et les premiers audits convertis en pilotes.",
    90,
    575,
    1040,
    24,
    14,
    { color: "#FFFFFF", face: "Aptos Display", bold: true, align: "center" }
  );

  footer(slide, ctx, 8, "Le point clé n'est pas d'avoir plus d'idées. C'est d'avoir plus de répétabilité commerciale.");
  return slide;
}
