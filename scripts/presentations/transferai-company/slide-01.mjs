import { assets, palette, deck, fullBleed, panel, title, body, metricCard, footer, addLogo } from "./shared.mjs";

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  panel(slide, ctx, 0, 0, 740, 720, { fill: palette.bg, stroke: palette.bg });
  panel(slide, ctx, 740, 0, 540, 720, { fill: "#EEE6DE", stroke: "#EEE6DE" });
  await ctx.addImage(slide, {
    path: assets.hero,
    x: 740,
    y: 282,
    width: 540,
    height: 336,
    fit: "cover",
    alt: "Hero TransferAI",
  });
  panel(slide, ctx, 60, 82, 560, 430, { fill: palette.paper, stroke: palette.stone });
  await addLogo(slide, ctx, 86, 108, 180, 64);

  body(slide, ctx, "PRÉSENTATION ENTREPRISE", 86, 190, 220, 18, 10, {
    bold: true,
    color: palette.accent,
  });
  title(slide, ctx, deck.title, 86, 222, 420, 54, 34);
  title(slide, ctx, deck.subtitle, 86, 278, 470, 74, 28);
  body(slide, ctx, deck.tagline, 86, 370, 470, 72, 18, { color: palette.inkSoft });
  body(
    slide,
    ctx,
    "Point d'entrée conseillé : audit IA gratuit, puis échange expert de 30 à 45 minutes.",
    86,
    448,
    470,
    40,
    14,
    { bold: true, color: palette.dark },
  );

  metricCard(slide, ctx, 60, 546, 150, 94, "130+", "formations", palette.accent);
  metricCard(slide, ctx, 228, 546, 150, 94, "13", "domaines", palette.green);
  metricCard(slide, ctx, 396, 546, 150, 94, "15", "experts", palette.dark);
  metricCard(slide, ctx, 564, 546, 150, 94, "6", "partenaires", "#6E7D8C");

  panel(slide, ctx, 820, 74, 360, 184, { fill: palette.dark, stroke: palette.dark });
  body(slide, ctx, "Promesse", 910, 98, 120, 18, 10.5, { bold: true, color: "#C9D8E8" });
  title(slide, ctx, "Rendre l'IA utile, claire et facile à mettre en œuvre.", 850, 126, 300, 54, 22, palette.white);
  body(
    slide,
    ctx,
    "TransferAI Africa relie conseil, formation et mise en œuvre pour transformer l'intérêt pour l'IA en plan d'action concret.",
    850,
    194,
    300,
    36,
    11.8,
    { color: "#E7EEF6" },
  );

  footer(slide, ctx, 1, "TransferAI Africa | Présentation de structure et d'offre | Version commerciale");
  return slide;
}
