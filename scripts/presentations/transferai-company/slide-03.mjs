import { deck, palette, fullBleed, panel, title, body, kicker, footer, addLogo, addPartnerStrip } from "./shared.mjs";

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  kicker(slide, ctx, "Crédibilité");
  title(slide, ctx, "Une structure ancrée, crédible et mobilisable", 60, 78, 760, 52, 30);

  await addLogo(slide, ctx, 930, 56, 220, 78);
  body(
    slide,
    ctx,
    "TransferAI Africa est né d'une collaboration avec Nettelecom CI et s'appuie sur une équipe fondatrice renforcée par des experts associés.",
    750,
    146,
    430,
    40,
    12.5,
    { color: palette.inkSoft },
  );

  for (let index = 0; index < deck.structure.length; index += 1) {
    const card = deck.structure[index];
    const x = index % 2 === 0 ? 60 : 625;
    const y = index < 2 ? 192 : 404;
    panel(slide, ctx, x, y, 495, 160, { fill: palette.paper, stroke: palette.stone });
    body(slide, ctx, card.title, x + 24, y + 24, 360, 30, 19, {
      bold: true,
      color: palette.ink,
      face: "Aptos Display",
    });
    body(slide, ctx, card.desc, x + 24, y + 70, 432, 58, 13.5);
  }

  body(slide, ctx, "Partenaires visibles sur le site", 60, 572, 220, 18, 10.5, { bold: true, color: palette.inkSoft });
  await addPartnerStrip(slide, ctx, 596);

  footer(slide, ctx, 3, "Repères de confiance visibles : équipe pluridisciplinaire, partenaires académiques et institutionnels, ancrage en Côte d'Ivoire.");
  return slide;
}
