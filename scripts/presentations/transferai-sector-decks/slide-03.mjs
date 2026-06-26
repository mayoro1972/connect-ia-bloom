import { spec, theme, bg, title, body, kicker, footer, priorityCard, card } from "./shared.mjs";

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);

  kicker(slide, ctx, "Contexte et irritants");
  title(slide, ctx, "Le ROI devient visible quand on traite d’abord les frictions déjà coûteuses.", 72, 82, 860, 60, 25.8);
  body(
    slide,
    ctx,
    "La bonne approche n’est pas de vendre l’IA en général. Elle consiste à isoler les flux où le temps perdu, l’hétérogénéité et le défaut de lecture ralentissent déjà l’organisation.",
    72,
    152,
    890,
    36,
    12.1,
    theme.soft,
  );

  priorityCard(slide, ctx, spec.priorities[0], 72, 214, 548, 192);
  priorityCard(slide, ctx, spec.priorities[1], 660, 214, 548, 192, theme.teal);
  priorityCard(slide, ctx, spec.priorities[2], 72, 428, 548, 192, theme.navy);
  priorityCard(slide, ctx, spec.priorities[3], 660, 428, 548, 192, theme.gold);

  card(slide, ctx, 72, 608, 1136, 58, { fill: theme.panelAlt, border: theme.line });
  title(slide, ctx, "Lecture de fond", 94, 620, 180, 18, 13.5);
  body(
    slide,
    ctx,
    "Chaque irritation retenue doit se traduire en hypothèse de gain, en KPI lisible et en séquence de déploiement mesurable.",
    94,
    642,
    1080,
    18,
    10.6,
    theme.soft,
  );

  footer(slide, ctx, 3, `TransferAI | ${spec.title} | Priorités métier`);
  return slide;
}
