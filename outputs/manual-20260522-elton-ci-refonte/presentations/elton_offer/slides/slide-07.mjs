import { THEME, bg, card, footer, kicker, paragraph, rect, text, title } from "./deck_helpers.mjs";

const PILLARS = [
  {
    title: "Confidentialité",
    body: "aucune donnée sensible exposée sans règles claires, périmètre défini et validation de l'entreprise",
  },
  {
    title: "Rôles et accès",
    body: "les usages sont cadrés par les responsabilités, les droits d'accès et le niveau de sensibilité",
  },
  {
    title: "Validation humaine",
    body: "les automatisations critiques restent revues et supervisées, surtout lorsqu'elles touchent au client ou à la décision",
  },
  {
    title: "Déploiement progressif",
    body: "on commence restreint, on mesure, on sécurise, puis on élargit seulement ce qui fonctionne réellement",
  },
];

export async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, THEME.dark);
  kicker(slide, ctx, "Cadre de confiance", 58, 48, THEME.accent2);
  title(slide, ctx, "La confiance doit être pensée dès le départ, pas ajoutée après coup.", 58, 84, 860, 86, 33, THEME.white);
  paragraph(
    slide,
    ctx,
    "Sur ce type d'offre, la crédibilité vient autant du cadre de déploiement que des cas d'usage eux-mêmes. C'est un vrai différenciateur vis-à-vis d'une IA générique ou mal gouvernée.",
    58,
    176,
    900,
    54,
    { size: 14, color: THEME.darkSoft },
  );

  PILLARS.forEach((pillar, index) => {
    const x = 58 + index * 290;
    card(slide, ctx, x, 286, 262, 248, {
      fill: index === 1 ? "#16324B" : "#173049",
      lineColor: index === 1 ? THEME.accent2 : "#2B4C66",
    });
    rect(slide, ctx, x + 24, 314, 38, 2, index % 2 ? THEME.accent2 : THEME.accent);
    text(slide, ctx, pillar.title, x + 24, 334, 182, 30, {
      size: 20,
      color: THEME.white,
      face: THEME.serif,
      bold: true,
    });
    paragraph(slide, ctx, pillar.body, x + 24, 382, 206, 102, {
      size: 12.5,
      color: THEME.darkSoft,
    });
  });

  paragraph(
    slide,
    ctx,
    "Message à faire passer : une IA utile, maîtrisable, compatible avec les exigences de confidentialité, de contrôle et de performance d'une entreprise comme ELTON.",
    58,
    586,
    1080,
    40,
    { size: 13, color: THEME.white, bold: true },
  );

  footer(slide, ctx, 7, "TransferAI Africa | Offre ciblée ELTON Oil CI | Gouvernance");
  return slide;
}
