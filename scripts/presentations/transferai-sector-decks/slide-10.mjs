import { spec, theme, bg, title, body, kicker, footer, card, bulletBlock, drawPills, addLogo } from "./shared.mjs";

export async function slide10(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, "#F6F0E8");

  card(slide, ctx, 0, 0, 1280, 720, { fill: theme.navy, border: theme.navy });
  await addLogo(slide, ctx, 78, 76, 184, 52);
  kicker(slide, ctx, "Confiance et prochaine étape", 78, 156, "#D8E6F4");
  title(slide, ctx, "Proposer un pilote utile, gouverné et mesurable.", 78, 184, 620, 68, 26.5, theme.white);
  body(
    slide,
    ctx,
    "Le rendez-vous ne sert pas à vendre un outil abstrait. Il sert à confirmer les deux premiers terrains, les équipes à former, les données à protéger et la sortie attendue à 90 jours.",
    78,
    258,
    610,
    48,
    12.6,
    "#D7E5F3",
  );

  card(slide, ctx, 78, 336, 560, 246, { fill: "#20405F", border: "#2B587F" });
  title(slide, ctx, "Le cadre de confiance à présenter", 104, 362, 320, 24, 18, theme.white);
  bulletBlock(slide, ctx, spec.trust, 104, 402, 486, 132, { size: 11.4, color: "#E8F1F8" });

  card(slide, ctx, 684, 116, 520, 466, { fill: theme.panel, border: theme.panel });
  title(slide, ctx, "Sortie attendue du rendez-vous", 714, 148, 300, 34, 18);
  bulletBlock(
    slide,
    ctx,
    [
      "Confirmer les 2 premiers cas d’usage à plus forte valeur visible.",
      "Valider les populations à former et le niveau d’accompagnement requis.",
      "Identifier les KPI prioritaires et la forme du premier pilote.",
      "Décider du bon ordre entre audit détaillé, formation ciblée, pilote et gouvernance.",
    ],
    714,
    188,
    430,
    128,
    { size: 11.6, color: theme.ink },
  );
  title(slide, ctx, "CTA principal", 714, 344, 120, 18, 14);
  body(slide, ctx, spec.cta, 714, 370, 430, 38, 14, theme.navy, { bold: true });
  body(
    slide,
    ctx,
    "Pièces jointes recommandées : ce deck sectoriel + mini-catalogue ciblé + formulaire d’audit pré-rendez-vous.",
    714,
    430,
    430,
    42,
    10.8,
    theme.soft,
  );
  title(slide, ctx, "Contextes proches", 714, 486, 180, 18, 13.5);
  drawPills(slide, ctx, spec.crmSectors.slice(0, 3), 714, 510, 1, 380, 0, 10);

  footer(slide, ctx, 10, `TransferAI | ${spec.title} | Confiance et prochaine étape`);
  return slide;
}
