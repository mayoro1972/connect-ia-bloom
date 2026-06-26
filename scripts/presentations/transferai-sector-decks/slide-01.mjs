import { spec, theme, bg, card, title, body, kicker, footer, metricCard, drawPills, addLogo, rect } from "./shared.mjs";

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, theme.bg);
  const longTitle = spec.title.length >= 26;
  const titleHeight = longTitle ? 96 : 62;
  const titleSize = longTitle ? 27.2 : 31;
  const subtitleY = longTitle ? 320 : 282;
  const subtitleHeight = longTitle ? 84 : 86;
  const bodyY = longTitle ? 412 : 370;
  const bodyHeight = longTitle ? 62 : 86;

  rect(slide, ctx, 0, 0, 1280, 720, "#F8F2EA", { line: ctx.line("#F8F2EA", 0) });
  rect(slide, ctx, 826, 0, 454, 720, theme.navy, { line: ctx.line(theme.navy, 0) });
  rect(slide, ctx, 826, 440, 454, 280, theme.accent, { line: ctx.line(theme.accent, 0) });

  card(slide, ctx, 70, 74, 704, 432, { fill: theme.panel, border: theme.line });
  await addLogo(slide, ctx, 98, 102, 202, 58);
  kicker(slide, ctx, "Deck sectoriel premium", 98, 188, theme.accent);
  title(slide, ctx, spec.title, 98, 220, 432, titleHeight, titleSize);
  title(slide, ctx, spec.subtitle, 98, subtitleY, 548, subtitleHeight, 23.5, theme.ink);
  body(slide, ctx, spec.tagline, 98, bodyY, 564, bodyHeight, 16, theme.soft);

  card(slide, ctx, 870, 82, 330, 248, { fill: "#214260", border: "#214260" });
  body(slide, ctx, "Contextes d'application proches", 896, 108, 220, 18, 10.5, "#D8E6F4", { bold: true });
  title(slide, ctx, "Ce deck peut être partagé avec plusieurs organisations du même univers métier.", 896, 138, 272, 88, 19, theme.white);
  body(
    slide,
    ctx,
    "La proposition met en avant des enjeux récurrents, des cas d’usage crédibles et un parcours d’accompagnement progressif pour des structures aux besoins proches.",
    896,
    228,
    272,
    72,
    11.2,
    "#E6EEF6",
  );

  drawPills(slide, ctx, spec.crmSectors.slice(0, 4), 866, 366, 1, 294, 0, 12);

  metricCard(slide, ctx, 70, 544, 160, 86, theme.accent, spec.coverMetrics[0].value, spec.coverMetrics[0].label);
  metricCard(slide, ctx, 248, 544, 160, 86, theme.teal, spec.coverMetrics[1].value, spec.coverMetrics[1].label);
  metricCard(slide, ctx, 426, 544, 160, 86, theme.navy, spec.coverMetrics[2].value, spec.coverMetrics[2].label);
  metricCard(slide, ctx, 604, 544, 170, 86, theme.gold, spec.coverMetrics[3].value, spec.coverMetrics[3].label);

  card(slide, ctx, 836, 544, 392, 84, { fill: theme.panel, border: theme.line });
  title(slide, ctx, "Promesse centrale", 860, 560, 150, 20, 13.5);
  body(
    slide,
    ctx,
    "Transformer l’IA en gains visibles de productivité, de coordination, de qualité de service et de lisibilité managériale.",
    860,
    582,
    338,
    28,
    10.3,
    theme.soft,
  );

  footer(slide, ctx, 1, `TransferAI | ${spec.title} | Deck sectoriel premium`);
  return slide;
}
