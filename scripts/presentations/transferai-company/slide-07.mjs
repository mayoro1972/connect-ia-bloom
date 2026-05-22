import { deck, palette, fullBleed, panel, title, body, kicker, bulletList, footer } from "./shared.mjs";

export async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  kicker(slide, ctx, "Audit gratuit");
  title(slide, ctx, deck.audit.title, 60, 78, 760, 80, 30);

  panel(slide, ctx, 60, 188, 500, 380, { fill: palette.paper, stroke: palette.stone });
  body(slide, ctx, "Ce que l'entreprise obtient", 86, 214, 220, 18, 10.5, { bold: true, color: palette.accent });
  bulletList(slide, ctx, deck.audit.deliverables, 86, 252, 440, {
    gap: 56,
    size: 14,
    itemHeight: 42,
  });

  panel(slide, ctx, 610, 188, 570, 178, { fill: palette.dark, stroke: palette.dark });
  body(slide, ctx, "Message fort à faire ressortir", 640, 214, 220, 18, 10.5, { bold: true, color: "#D7E2EE" });
  title(slide, ctx, deck.audit.meeting, 640, 244, 480, 62, 28, palette.white);
  body(
    slide,
    ctx,
    "Un échange pour clarifier le besoin, repérer les gains rapides et choisir la meilleure suite sans perdre de temps.",
    640,
    314,
    470,
    36,
    13.5,
    { color: "#EDF3FA" },
  );

  panel(slide, ctx, 610, 390, 570, 196, { fill: "#FFF7F1", stroke: "#FFF7F1" });
  body(slide, ctx, "Preuves visibles sur le site", 640, 416, 220, 18, 10.5, { bold: true, color: palette.accent });
  bulletList(slide, ctx, deck.audit.proof, 640, 454, 500, {
    gap: 32,
    size: 13.5,
    itemHeight: 24,
  });

  panel(slide, ctx, 60, 596, 1120, 42, { fill: palette.paper, stroke: palette.stone });
  body(
    slide,
    ctx,
    deck.audit.steps.join("  →  "),
    84,
    608,
    1070,
    18,
    11.5,
    { bold: true, color: palette.ink, align: "center" },
  );

  footer(slide, ctx, 7, "L'audit gratuit sert d'ouverture commerciale, de filtre de qualité et de point de départ pour la suite la plus adaptée.");
  return slide;
}
