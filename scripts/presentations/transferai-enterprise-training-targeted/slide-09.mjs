import { deck, palette, fullBleed, panel, title, body, kicker, bulletList, footer } from "./shared.mjs";

export async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  kicker(slide, ctx, "Confiance");
  title(slide, ctx, "Former et déployer avec un cadre de confiance", 60, 78, 760, 52, 30);

  panel(slide, ctx, 60, 188, 520, 372, { fill: palette.paper, stroke: palette.stone });
  body(slide, ctx, "Ce que nous défendons", 86, 214, 180, 18, 10.5, { bold: true, color: palette.accent });
  bulletList(slide, ctx, deck.trust, 86, 254, 456, {
    gap: 72,
    size: 14.5,
    itemHeight: 50,
    color: palette.ink,
  });

  panel(slide, ctx, 630, 188, 550, 164, { fill: palette.dark, stroke: palette.dark });
  body(slide, ctx, "Message fort", 660, 214, 160, 18, 10.5, { bold: true, color: "#D7E2EE" });
  title(slide, ctx, "Une IA utile, gouvernée et maîtrisable.", 660, 244, 470, 52, 23, palette.white);
  body(
    slide,
    ctx,
    "La formation gagne en crédibilité quand elle intègre confidentialité, règles d'usage et supervision.",
    660,
    300,
    470,
    28,
    12.4,
    { color: "#EDF3FA" },
  );

  panel(slide, ctx, 630, 392, 550, 168, { fill: "#FFF7F1", stroke: "#FFF7F1" });
  body(slide, ctx, "Pourquoi cette slide compte", 660, 418, 220, 18, 10.5, { bold: true, color: palette.accent });
  body(slide, ctx, "Elle montre que TransferAI ne vend pas uniquement des usages attractifs, mais une démarche compatible avec les exigences de l'entreprise.", 660, 452, 470, 52, 13.5, {
    color: palette.ink,
  });

  footer(slide, ctx, 9, "Le bon message : une offre formation et IA utile, encadrée et compatible avec la confidentialité de l'organisation.");
  return slide;
}
