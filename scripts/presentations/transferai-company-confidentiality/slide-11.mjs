import { palette, fullBleed, panel, title, body, kicker, footer } from "./shared.mjs";

export async function slide11(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.paper);

  kicker(slide, ctx, "Gouvernance des données");
  title(slide, ctx, "Les garde-fous que nous défendons avant tout usage d'un modèle d'IA", 60, 78, 900, 72, 28);
  body(
    slide,
    ctx,
    "Nous cherchons d'abord à réduire le risque. Chaque usage est encadré par des règles claires sur les données, les accès et les contrôles de supervision.",
    60,
    150,
    920,
    42,
    14.5,
  );

  const items = [
    ["Protection par défaut", "Aucune donnée sensible ne part vers un outil d'IA sans autorisation explicite.", palette.dark, "shield"],
    ["Limitation des données", "Seules les informations strictement utiles au besoin traité sont autorisées.", palette.accent, "filter"],
    ["Masquage des identités", "Les informations qui permettent d'identifier une personne sont retirées avant traitement.", "#2F6F6A", "eye-off"],
    ["Accès contrôlés", "Les droits sont organisés selon les équipes, les rôles et le niveau de sensibilité.", "#6E7D8C", "lock"],
    ["Traçabilité", "Les données utilisées et les réponses produites doivent pouvoir être retracées.", palette.dark, "file-text"],
    ["Revue humaine", "Les cas les plus sensibles gardent une validation humaine et des contrôles renforcés.", palette.accent, "users"],
  ];

  for (let index = 0; index < items.length; index += 1) {
    const [label, desc, color, icon] = items[index];
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 60 + col * 378;
    const y = 222 + row * 186;
    panel(slide, ctx, x, y, 332, 152, { fill: row === 0 ? palette.paper : "#FBF7F3", stroke: palette.stone });
    ctx.addShape(slide, {
      x: x + 22,
      y: y + 22,
      width: 42,
      height: 42,
      fill: `${color}18`,
      line: ctx.line(`${color}18`, 0),
      radius: 10,
    });
    await ctx.addLucideIcon(slide, {
      icon,
      x: x + 31,
      y: y + 31,
      width: 24,
      height: 24,
      color,
    });
    body(slide, ctx, label, x + 82, y + 24, 210, 22, 18, {
      bold: true,
      color: palette.ink,
      face: "Aptos Display",
    });
    body(slide, ctx, desc, x + 24, y + 80, 280, 50, 13.6, { color: palette.inkSoft });
  }

  panel(slide, ctx, 60, 614, 1160, 40, { fill: "#FFF5EE", stroke: "#FFF5EE" });
  body(
    slide,
    ctx,
    "Notre promesse n'est pas seulement une IA performante, mais une IA gouvernée, maîtrisable et compatible avec la confidentialité.",
    84,
    626,
    1100,
    16,
    11.8,
    { bold: true, color: palette.accent },
  );

  footer(slide, ctx, 11, "TransferAI Africa | Filtrage, masquage des identités, contrôle d'accès, traçabilité, revue humaine");
  return slide;
}
