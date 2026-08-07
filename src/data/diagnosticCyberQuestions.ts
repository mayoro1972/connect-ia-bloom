import type { AssessmentQuestion } from "@/components/demos/ScoredAssessment";

// Auto-diagnostic indicatif inspiré des thématiques ISO 27001 (Annexe A) — ne constitue pas un audit de
// certification. Les 3 options par question (Oui/Partiellement/Non) sont volontairement génériques pour
// rester applicables à toute organisation, quel que soit son secteur.
const OPTIONS = [
  { label: "Oui", points: 2 },
  { label: "Partiellement", points: 1 },
  { label: "Non / je ne sais pas", points: 0 },
];

export const diagnosticCyberCategories = [
  "Politique & gouvernance",
  "Contrôle d'accès",
  "Sensibilisation du personnel",
  "Sauvegardes",
  "Gestion des incidents",
  "Sécurité physique",
  "Tiers & fournisseurs",
] as const;

export const diagnosticCyberQuestions: AssessmentQuestion[] = [
  {
    id: "gov-1",
    category: "Politique & gouvernance",
    text: "Une politique de sécurité de l'information écrite existe-t-elle et est-elle connue des équipes ?",
    options: OPTIONS,
  },
  {
    id: "gov-2",
    category: "Politique & gouvernance",
    text: "Une personne ou une équipe est-elle clairement responsable de la sécurité de l'information ?",
    options: OPTIONS,
  },
  {
    id: "access-1",
    category: "Contrôle d'accès",
    text: "Chaque collaborateur dispose-t-il d'un compte individuel (pas de comptes partagés génériques) ?",
    options: OPTIONS,
  },
  {
    id: "access-2",
    category: "Contrôle d'accès",
    text: "L'authentification à deux facteurs (2FA/MFA) est-elle activée sur les comptes sensibles (email, administration) ?",
    options: OPTIONS,
  },
  {
    id: "access-3",
    category: "Contrôle d'accès",
    text: "Les accès d'un collaborateur qui quitte l'organisation sont-ils désactivés rapidement et systématiquement ?",
    options: OPTIONS,
  },
  {
    id: "awareness-1",
    category: "Sensibilisation du personnel",
    text: "Le personnel a-t-il déjà reçu une formation ou une sensibilisation à la reconnaissance du phishing ?",
    options: OPTIONS,
  },
  {
    id: "awareness-2",
    category: "Sensibilisation du personnel",
    text: "Existe-t-il une règle claire sur la manipulation des données sensibles (étudiants, RH, clients) dans les outils numériques, y compris l'IA générative ?",
    options: OPTIONS,
  },
  {
    id: "backup-1",
    category: "Sauvegardes",
    text: "Les données critiques sont-elles sauvegardées régulièrement, avec au moins une copie hors ligne ou hors site ?",
    options: OPTIONS,
  },
  {
    id: "backup-2",
    category: "Sauvegardes",
    text: "Une restauration de sauvegarde a-t-elle déjà été testée pour vérifier qu'elle fonctionne réellement ?",
    options: OPTIONS,
  },
  {
    id: "incident-1",
    category: "Gestion des incidents",
    text: "Une procédure existe-t-elle pour signaler et traiter un incident de sécurité suspecté (email suspect, accès non autorisé) ?",
    options: OPTIONS,
  },
  {
    id: "incident-2",
    category: "Gestion des incidents",
    text: "Les postes de travail disposent-ils d'un antivirus/anti-malware à jour et de mises à jour de sécurité automatiques ?",
    options: OPTIONS,
  },
  {
    id: "physical-1",
    category: "Sécurité physique",
    text: "L'accès aux salles serveurs, locaux réseau ou postes contenant des données sensibles est-il restreint physiquement ?",
    options: OPTIONS,
  },
  {
    id: "physical-2",
    category: "Sécurité physique",
    text: "Les documents papier contenant des données sensibles sont-ils stockés sous clé et détruits de façon sécurisée ?",
    options: OPTIONS,
  },
  {
    id: "third-party-1",
    category: "Tiers & fournisseurs",
    text: "Les prestataires ou outils tiers qui accèdent à vos données sont-ils identifiés et évalués avant d'être autorisés ?",
    options: OPTIONS,
  },
  {
    id: "third-party-2",
    category: "Tiers & fournisseurs",
    text: "Existe-t-il un contrat ou un engagement écrit de confidentialité avec vos principaux prestataires IT ?",
    options: OPTIONS,
  },
];
