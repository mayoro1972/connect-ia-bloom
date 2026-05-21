import { palette, fullBleed, panel, title, body, kicker, footer, smallDomainPill } from "./shared.mjs";

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  fullBleed(slide, ctx, palette.bg);

  kicker(slide, ctx, "Portefeuille");
  title(slide, ctx, "Les 13 domaines peuvent être lus en 4 familles commerciales", 60, 78, 860, 60, 30);

  const families = [
    {
      title: "Back-office & fonctions support",
      color: palette.dark,
      x: 60,
      domains: ["Assistanat & Secrétariat", "Administration & Gestion", "Ressources Humaines", "Finance & Comptabilité"]
    },
    {
      title: "Revenu & relation client",
      color: palette.accent,
      x: 350,
      domains: ["Marketing & Communication", "Service Client", "Formation & Pédagogie"]
    },
    {
      title: "Pilotage & expertise",
      color: palette.tier2,
      x: 640,
      domains: ["Data & Analyse", "Management & Leadership", "Juridique & Conformité"]
    },
    {
      title: "Tech & secteurs ciblés",
      color: palette.tier3,
      x: 930,
      domains: ["IT & Transformation Digitale", "Santé & Bien-être", "Diplomatie & Affaires Internationales"]
    }
  ];

  families.forEach((family) => {
    panel(slide, ctx, family.x, 178, 250, 418, { fill: palette.paper, stroke: palette.line });
    body(slide, ctx, family.title, family.x + 20, 204, 210, 44, 15, { bold: true, color: palette.ink });
    family.domains.forEach((domain, index) => {
      smallDomainPill(slide, ctx, family.x + 20, 270 + index * 52, domain, family.color);
    });
  });

  body(
    slide,
    ctx,
    "Lecture recommandée : les familles revenue et support donnent les victoires rapides ; la famille tech donne les projets structurants ; les secteurs ciblés se vendent mieux avec un point d'entrée métier déjà gagné.",
    60,
    620,
    1120,
    36,
    13,
    { color: palette.inkSoft }
  );

  footer(slide, ctx, 3, "Le catalogue est large ; la stratégie commerciale doit le rendre lisible et séquencé.");
  return slide;
}
