import { deck, palette, fullBleed, panel, title, body, kicker, footer } from "./shared.mjs";

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.paper);

  kicker(slide, ctx, "Garde-fous");
  title(slide, ctx, "Nos principes de protection avant toute exposition au modele", 60, 76, 840, 72, 29);
  body(
    slide,
    ctx,
    "Notre approche vise a reduire le risque avant de chercher la performance. Chaque usage LLM est encadre par des regles de donnees et de gouvernance explicites.",
    60,
    148,
    920,
    42,
    14.5,
  );

  for (let index = 0; index < deck.pillars.length; index += 1) {
    const item = deck.pillars[index];
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 60 + col * 378;
    const y = 214 + row * 194;
    panel(slide, ctx, x, y, 332, 156, {
      fill: row === 0 ? palette.paper : "#FBF7F3",
      stroke: palette.stone,
    });
    ctx.addShape(slide, {
      x: x + 22,
      y: y + 22,
      width: 42,
      height: 42,
      fill: `${item.color}18`,
      line: ctx.line(`${item.color}18`, 0),
      radius: 10,
    });
    await ctx.addLucideIcon(slide, {
      icon: item.icon,
      x: x + 31,
      y: y + 31,
      width: 24,
      height: 24,
      color: item.color,
    });
    body(slide, ctx, item.title, x + 82, y + 24, 200, 22, 18, {
      bold: true,
      color: palette.ink,
      face: "Aptos Display",
    });
    body(slide, ctx, item.desc, x + 24, y + 80, 280, 54, 13.6, {
      color: palette.inkSoft,
    });
  }

  panel(slide, ctx, 60, 618, 1160, 36, { fill: "#FFF5EE", stroke: "#FFF5EE" });
  body(
    slide,
    ctx,
    "Resultat attendu : une architecture IA qui reste utile sans exposer inutilement les informations sensibles, nominatives ou strategiques du client.",
    84,
    628,
    1100,
    16,
    11.8,
    { bold: true, color: palette.accent },
  );

  footer(slide, ctx, 2, "TransferAI Africa | Minimisation, pseudonymisation, acces controles, tracabilite, revue humaine");
  return slide;
}
