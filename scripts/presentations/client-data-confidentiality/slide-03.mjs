import { deck, palette, fullBleed, panel, title, body, kicker, footer, chip } from "./shared.mjs";

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  kicker(slide, ctx, "LLM sur mesure");
  title(slide, ctx, "Comment nous concevons un LLM adapte a l'organisation cliente", 60, 78, 860, 74, 29);

  panel(slide, ctx, 60, 156, 760, 464, { fill: palette.paper, stroke: palette.stone });
  panel(slide, ctx, 850, 156, 370, 464, { fill: "#F4EEE8", stroke: "#F4EEE8" });

  for (let index = 0; index < deck.llmFlow.length; index += 1) {
    const item = deck.llmFlow[index];
    const y = 190 + index * 106;
    panel(slide, ctx, 92, y, 680, 84, { fill: index % 2 === 0 ? "#FCF7F2" : palette.paper, stroke: palette.stone });
    chip(slide, ctx, 116, y + 26, 58, item.step, palette.accentSoft, palette.accent);
    body(slide, ctx, item.title, 198, y + 20, 254, 22, 18, {
      bold: true,
      color: palette.ink,
      face: "Aptos Display",
    });
    body(slide, ctx, item.desc, 198, y + 46, 520, 26, 13.6, {
      color: palette.inkSoft,
    });
  }

  body(slide, ctx, "Ce que le client retient", 882, 186, 180, 18, 10.5, { bold: true, color: palette.accent });
  title(slide, ctx, "Une IA gouvernee, pas improvisée.", 882, 216, 260, 64, 24, palette.dark);
  body(
    slide,
    ctx,
    "Nous cherchons a fournir une IA utile, maintenable et compatible avec les obligations de confidentialite de l'organisation.",
    882,
    298,
    284,
    80,
    14.2,
    { color: palette.inkSoft },
  );

  for (let index = 0; index < deck.reassurance.length; index += 1) {
    const y = 390 + index * 58;
    panel(slide, ctx, 882, y, 286, 50, { fill: palette.paper, stroke: palette.stone });
    body(slide, ctx, deck.reassurance[index], 898, y + 8, 254, 30, 11.8, {
      bold: true,
      color: palette.ink,
    });
  }

  footer(slide, ctx, 3, "TransferAI Africa | Le bon message : une IA utile, maitrisable et compatible avec la confidentialite client");
  return slide;
}
