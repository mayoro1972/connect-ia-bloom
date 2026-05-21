import { palette, fullBleed, title, body, kicker, footer, panel, metricCard } from "./shared.mjs";

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, "#FFFDFC");

  kicker(slide, ctx, "Narratif ROI");
  title(slide, ctx, "Comment vendre le ROI en rendez-vous", 60, 78, 760, 60, 30);

  metricCard(slide, ctx, 60, 180, 330, 126, "Temps", "réduction du délai de traitement", "ex. comptes rendus, reporting, réponses client", palette.accent);
  metricCard(slide, ctx, 420, 180, 330, 126, "Volume", "plus de dossiers sans recruter", "ex. contenus, tickets, relances, analyses", palette.tier2);
  metricCard(slide, ctx, 780, 180, 330, 126, "Marge", "meilleure conversion ou moins d'erreurs", "ex. campagnes, encaissement, conformité", palette.tier3);

  panel(slide, ctx, 60, 354, 510, 260, { fill: palette.paper, stroke: palette.line });
  body(slide, ctx, "Formule simple à utiliser face au prospect", 88, 382, 280, 18, 11, { bold: true, color: palette.accent });
  title(slide, ctx, "Gain mensuel = personnes concernées x heures gagnées par semaine x 4,3 x coût horaire moyen", 88, 412, 430, 92, 22);
  body(slide, ctx, "Payback = coût du projet / gain mensuel estimé", 88, 516, 350, 26, 14, { bold: true, color: palette.ink });
  body(slide, ctx, "Le rôle commercial n'est pas de promettre un chiffre parfait. Il est de cadrer un ordre de grandeur crédible à partir des volumes du client.", 88, 548, 430, 34, 11);

  panel(slide, ctx, 620, 354, 560, 260, { fill: palette.dark, stroke: palette.dark });
  body(slide, ctx, "Phrases à porter", 648, 382, 160, 18, 11, { bold: true, color: "#D6E0EA" });
  body(slide, ctx, "“Nous ne vendons pas l'IA en général. Nous ciblons 2 ou 3 tâches où vous perdez du temps ou de la marge.”", 648, 418, 490, 54, 16, { face: "Aptos Display", bold: true, color: "#FFFFFF" });
  body(slide, ctx, "“Notre promesse est un usage métier mesurable, pas une démonstration gadget.”", 648, 490, 470, 44, 14, { color: "#D6E0EA" });
  body(slide, ctx, "“Si le gain n'est pas visible en moins de 90 jours, ce n'est pas le bon premier cas d'usage.”", 648, 538, 470, 34, 12, { color: "#D6E0EA" });

  footer(slide, ctx, 6, "Le meilleur closing repose sur un problème métier simple, un cas d'usage précis et un ROI lisible.");
  return slide;
}
