import { palette, deck, fullBleed, panel, title, body, metricCard, footer, addLogo } from "./shared.mjs";

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  panel(slide, ctx, 44, 52, 724, 616, { fill: palette.paper, stroke: palette.stone });
  panel(slide, ctx, 802, 52, 434, 616, { fill: palette.dark, stroke: palette.dark });

  await addLogo(slide, ctx, 76, 82, 178, 62);
  body(slide, ctx, "MESSAGE CLIENT", 76, 170, 180, 18, 10, { bold: true, color: palette.accent });
  title(slide, ctx, deck.title, 76, 204, 560, 88, 31);
  body(slide, ctx, deck.subtitle, 76, 296, 560, 40, 18.5, {
    bold: true,
    color: palette.inkSoft,
    face: "Aptos Display",
  });
  body(slide, ctx, deck.headline, 76, 354, 574, 54, 20, { bold: true, color: palette.dark, face: "Aptos Display" });
  body(
    slide,
    ctx,
    deck.promise,
    76,
    428,
    590,
    84,
    16,
    { color: palette.inkSoft },
  );

  metricCard(slide, ctx, 76, 546, 176, 84, "01", "deny-by-default", palette.dark);
  metricCard(slide, ctx, 274, 546, 176, 84, "02", "minimisation", palette.accent);
  metricCard(slide, ctx, 472, 546, 176, 84, "03", "sur mesure", palette.green);

  body(slide, ctx, "Ce que nous garantissons", 836, 94, 180, 18, 10.5, { bold: true, color: "#C9D8E8" });
  title(slide, ctx, "Une IA utile sans banaliser la confidentialite.", 836, 126, 320, 108, 26, palette.white);
  body(
    slide,
    ctx,
    "Nous ne partons pas du principe que toutes les donnees peuvent etre donnees a un modele. Nous etablissons d'abord les regles de protection, puis seulement les usages autorises.",
    836,
    248,
    330,
    104,
    15,
    { color: "#E7EEF6" },
  );

  panel(slide, ctx, 836, 392, 330, 150, { fill: "#27496A", stroke: "#27496A" });
  body(slide, ctx, "Positionnement", 864, 420, 120, 16, 10, { bold: true, color: "#BFD0E2" });
  body(
    slide,
    ctx,
    "Le LLM s'adapte a votre gouvernance, a vos contraintes de conformite et a votre niveau d'acceptation du risque.",
    864,
    452,
    274,
    64,
    14.5,
    { bold: true, color: palette.white, face: "Aptos Display" },
  );

  footer(slide, ctx, 1, "TransferAI Africa | Confidentialite des informations clients | Support commercial");
  return slide;
}
