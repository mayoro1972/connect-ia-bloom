export {
  assets,
  palette,
  fullBleed,
  panel,
  rule,
  kicker,
  title,
  body,
  bulletList,
  metricCard,
  chip,
  addLogo,
  addPartnerStrip,
  footer,
} from "../transferai-company/shared.mjs";

export const deck = {
  title: "Confidentialite des informations clients",
  subtitle: "Protection des donnees sensibles et LLM sur mesure",
  promise:
    "Nous concevons des solutions IA qui s'adaptent aux contraintes de confidentialite, de conformite et de gouvernance de chaque organisation.",
  headline:
    "Vos donnees sensibles ne sont pas un carburant IA par defaut.",
  pillars: [
    {
      title: "Deny-by-default",
      desc: "Aucune donnee sensible ne part vers un LLM sans regle explicite.",
      icon: "shield",
      color: "#16324F",
    },
    {
      title: "Minimisation",
      desc: "Seules les donnees strictement utiles au cas d'usage sont autorisees.",
      icon: "filter",
      color: "#D66724",
    },
    {
      title: "Pseudonymisation",
      desc: "Les identifiants directs sont remplaces avant exposition au modele.",
      icon: "eye-off",
      color: "#2F6F6A",
    },
    {
      title: "Acces controles",
      desc: "Les droits sont cloisonnes selon les equipes, les roles et la criticite.",
      icon: "lock",
      color: "#6E7D8C",
    },
    {
      title: "Tracabilite",
      desc: "Les flux sensibles, champs autorises et sorties IA doivent rester auditables.",
      icon: "file-text",
      color: "#16324F",
    },
    {
      title: "Revue humaine",
      desc: "Les usages critiques gardent une validation humaine et des garde-fous explicites.",
      icon: "users",
      color: "#D66724",
    },
  ],
  llmFlow: [
    {
      step: "01",
      title: "Cadrage du cas d'usage",
      desc: "Identifier le besoin metier, le niveau de sensibilite et les limites d'exposition.",
    },
    {
      step: "02",
      title: "Regles de donnees",
      desc: "Definir ce qui est bloque, pseudonymise, agrege ou autorise sous controle.",
    },
    {
      step: "03",
      title: "Architecture sur mesure",
      desc: "Adapter le modele, l'hebergement, les acces et les integrations au contexte client.",
    },
    {
      step: "04",
      title: "Supervision continue",
      desc: "Journaliser, tester, corriger et maintenir une revue humaine sur les cas sensibles.",
    },
  ],
  reassurance: [
    "Nous definissons d'abord ce qui doit rester hors modele.",
    "Nous adaptons le LLM a votre gouvernance, pas l'inverse.",
    "Nous privilegions filtrage, pseudonymisation et supervision avant automatisation.",
  ],
};
