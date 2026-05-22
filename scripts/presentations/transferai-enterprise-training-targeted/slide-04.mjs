import { deck, palette, fullBleed, panel, title, body, kicker, bulletList, footer } from "./shared.mjs";

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.paper);

  kicker(slide, ctx, "Porte d'entrée");
  title(slide, ctx, deck.entryPoint.title, 60, 78, 760, 52, 30);

  panel(slide, ctx, 60, 188, 500, 392, { fill: palette.paper, stroke: palette.stone });
  body(slide, ctx, "Offre recommandée", 86, 214, 180, 18, 10.5, { bold: true, color: palette.accent });
  title(slide, ctx, deck.entryPoint.offer, 86, 244, 430, 84, 24);
  bulletList(slide, ctx, deck.entryPoint.bullets, 86, 352, 430, {
    gap: 50,
    size: 14,
    itemHeight: 36,
    color: palette.inkSoft,
  });

  panel(slide, ctx, 610, 188, 570, 178, { fill: palette.dark, stroke: palette.dark });
  body(slide, ctx, "Pourquoi c'est la bonne entrée", 640, 214, 220, 18, 10.5, { bold: true, color: "#D7E2EE" });
  title(slide, ctx, "Commencer par comprendre avant de former ou de déployer.", 640, 244, 480, 62, 28, palette.white);
  body(
    slide,
    ctx,
    "L'audit gratuit rend l'offre plus crédible, évite la dispersion et aide à choisir les bonnes priorités.",
    640,
    314,
    470,
    36,
    13.5,
    { color: "#EDF3FA" },
  );

  panel(slide, ctx, 610, 390, 570, 196, { fill: "#FFF7F1", stroke: "#FFF7F1" });
  body(slide, ctx, "Ce que l'entreprise obtient", 640, 416, 220, 18, 10.5, { bold: true, color: palette.accent });
  bulletList(slide, ctx, deck.entryPoint.outputs, 640, 454, 500, {
    gap: 32,
    size: 13.5,
    itemHeight: 24,
    color: palette.ink,
  });

  panel(slide, ctx, 60, 606, 1120, 34, { fill: palette.paper, stroke: palette.stone });
  body(
    slide,
    ctx,
    "Rendez-vous de 45 minutes  →  Audit gratuit  →  Recommandations  →  Formation ciblée ou pilote",
    84,
    614,
    1070,
    18,
    11.5,
    { bold: true, color: palette.ink, align: "center" },
  );

  footer(slide, ctx, 4, "L'audit gratuit sert d'ouverture commerciale, de filtre de qualité et de point de départ pour la suite la plus adaptée.");
  return slide;
}
