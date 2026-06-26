import { spec, theme, bg, title, body, kicker, footer, card, text } from "./shared.mjs";

function detailCase(slide, ctx, item, x, y, w, h, accent) {
  card(slide, ctx, x, y, w, h, { fill: theme.panel });
  text(slide, ctx, "Terrain prioritaire", x + 22, y + 20, 140, 14, { size: 9.4, color: accent, bold: true });
  title(slide, ctx, item.title, x + 22, y + 44, w - 44, 28, 19);
  text(slide, ctx, "AVANT", x + 22, y + 92, 64, 12, { size: 8.8, color: theme.orange, bold: true });
  body(slide, ctx, item.before, x + 22, y + 110, w - 44, 58, 11.5, theme.soft);
  text(slide, ctx, "APRÈS", x + 22, y + 180, 64, 12, { size: 8.8, color: theme.teal, bold: true });
  body(slide, ctx, item.after, x + 22, y + 198, w - 44, 54, 11.5, theme.ink);
  card(slide, ctx, x + 22, y + h - 58, w - 44, 36, { fill: theme.panelAlt, border: theme.line });
  body(slide, ctx, `KPI clé : ${item.kpi}`, x + 36, y + h - 48, w - 72, 16, 10.2, theme.ink, { bold: true });
}

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Premiers terrains à lancer");
  title(slide, ctx, "Les deux premiers terrains doivent créer une valeur visible pour la direction et les équipes.", 72, 88, 1020, 68, 25.3);
  body(
    slide,
    ctx,
    "C’est souvent à ce niveau que le prospect décide si la démarche mérite d’aller plus loin. Le choix du premier terrain compte donc plus que la quantité d’idées disponibles.",
    72,
    164,
    900,
    36,
    12,
    theme.soft,
  );

  detailCase(slide, ctx, spec.useCases[0], 72, 230, 548, 330, theme.accent);
  detailCase(slide, ctx, spec.useCases[1], 660, 230, 548, 330, theme.teal);

  card(slide, ctx, 72, 586, 1136, 50, { fill: theme.panelAlt, border: theme.line });
  body(
    slide,
    ctx,
    "Règle simple : premier terrain = usage visible, responsable identifié, KPI lisible, données accessibles et supervision humaine facile à organiser.",
    96,
    602,
    1088,
    18,
    11,
    theme.ink,
    { bold: true, align: "center" },
  );

  footer(slide, ctx, 6, `TransferAI | ${spec.title} | Deux premiers terrains`);
  return slide;
}
