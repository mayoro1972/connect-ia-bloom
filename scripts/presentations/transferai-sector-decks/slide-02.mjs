import { spec, theme, bg, card, title, body, kicker, footer, drawPills, addLogo, bulletBlock } from "./shared.mjs";

const proofs = [
  "Audit IA gratuit pour qualifier les priorités avant toute dépense lourde.",
  "Formation ciblée des décideurs et des équipes, pensée pour les usages du terrain.",
  "Accompagnement de mise en pratique sur 90 jours avec relecture des premiers KPI.",
  "Cadre de gouvernance, confidentialité et progression par pilote avant extension.",
];

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  const titleContext = spec.titleSentence ?? spec.title.toLowerCase();

  kicker(slide, ctx, "Pourquoi TransferAI sur ce terrain");
  title(slide, ctx, `Une proposition conçue pour ${titleContext} plutôt qu’un catalogue générique.`, 72, 88, 840, 72, 25.4);
  body(slide, ctx, spec.contextNarrative, 72, 166, 860, 42, 12.6, theme.soft);

  card(slide, ctx, 72, 226, 534, 354, { fill: theme.panel });
  await addLogo(slide, ctx, 98, 248, 188, 50);
  title(slide, ctx, "TransferAI : de la pédagogie à l’exécution", 98, 320, 360, 26, 18);
  bulletBlock(slide, ctx, proofs, 98, 360, 462, 166, { size: 12, color: theme.ink });
  body(
    slide,
    ctx,
    "La différence clé : une structure de formation classique transmet un contenu. TransferAI forme, puis accompagne l’usage réel, les ajustements et les décisions d’extension.",
    98,
    526,
    462,
    38,
    10.7,
    theme.soft,
    { bold: true },
  );

  card(slide, ctx, 634, 226, 574, 354, { fill: theme.panelAlt });
  title(slide, ctx, "Types d'organisations et contextes proches", 660, 252, 430, 34, 17.5);
  body(
    slide,
    ctx,
    "Les repères ci-dessous montrent des environnements où cette proposition garde la même pertinence métier et la même lisibilité commerciale.",
    660,
    298,
    486,
    42,
    11.1,
    theme.soft,
  );
  drawPills(slide, ctx, spec.crmSectors, 660, 352, 2, 250, 14, 12);

  card(slide, ctx, 660, 482, 486, 76, { fill: theme.panel, border: theme.line });
  title(slide, ctx, "Entrée recommandée", 682, 498, 180, 18, 13.5);
  body(
    slide,
    ctx,
    "Audit IA gratuit, puis échange expert de 45 minutes pour confirmer les deux premiers cas d’usage, les équipes à former et le cadre de déploiement.",
    682,
    518,
    442,
    30,
    10.4,
    theme.ink,
  );

  footer(slide, ctx, 2, `TransferAI | ${spec.title} | Positionnement et preuve`);
  return slide;
}
