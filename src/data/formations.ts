export type Formation = {
  id: string;
  title: string;
  metier: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  format: "Présentiel" | "Hybride" | "En ligne";
  duration: string;
  price: string;
  tags: string[];
};

export const formations: Formation[] = [
  // ═══════════════════════════════════════════════
  // ASSISTANAT & SECRÉTARIAT DE DIRECTION (10)
  // ═══════════════════════════════════════════════
  { id: "assist-01", title: "ChatGPT pour Assistants de Direction", metier: "Assistanat & Secrétariat", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["ChatGPT", "Productivité"] },
  { id: "assist-02", title: "Gestion Intelligente de l'Agenda avec l'IA", metier: "Assistanat & Secrétariat", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Agenda", "Automatisation"] },
  { id: "assist-03", title: "Rédaction Professionnelle Assistée par IA", metier: "Assistanat & Secrétariat", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Rédaction", "ChatGPT"] },
  { id: "assist-04", title: "Synthèse de Réunions avec l'IA", metier: "Assistanat & Secrétariat", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Réunions", "Synthèse"] },
  { id: "assist-05", title: "Automatisation des Tâches Administratives", metier: "Assistanat & Secrétariat", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Automatisation", "Zapier"] },
  { id: "assist-06", title: "Gestion de Projets Augmentée par l'IA", metier: "Assistanat & Secrétariat", level: "Intermédiaire", format: "Hybride", duration: "3 jours", price: "500 000 FCFA", tags: ["Gestion de projet", "IA"] },
  { id: "assist-07", title: "Excel & Power BI avec IA pour Assistants", metier: "Assistanat & Secrétariat", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Excel", "Power BI"] },
  { id: "assist-08", title: "Communication Professionnelle & IA", metier: "Assistanat & Secrétariat", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Communication", "IA"] },
  { id: "assist-09", title: "Organisation Digitale et IA", metier: "Assistanat & Secrétariat", level: "Avancé", format: "Présentiel", duration: "2 jours", price: "750 000 FCFA", tags: ["Organisation", "Digital"] },
  { id: "assist-10", title: "Certification Assistant de Direction Augmenté", metier: "Assistanat & Secrétariat", level: "Avancé", format: "Présentiel", duration: "5 jours", price: "1 500 000 FCFA", tags: ["Certification", "Complet"] },

  // ═══════════════════════════════════════════════
  // RESSOURCES HUMAINES (10)
  // ═══════════════════════════════════════════════
  { id: "rh-01", title: "IA et Recrutement : Sourcing & Sélection", metier: "Ressources Humaines", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["Recrutement", "IA"] },
  { id: "rh-02", title: "Gestion Prévisionnelle des Emplois avec l'IA", metier: "Ressources Humaines", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["GPEC", "Prédictif"] },
  { id: "rh-03", title: "Onboarding Automatisé avec l'IA", metier: "Ressources Humaines", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Onboarding", "Automatisation"] },
  { id: "rh-04", title: "Analyse du Climat Social par l'IA", metier: "Ressources Humaines", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Climat social", "Analyse"] },
  { id: "rh-05", title: "Formation Personnalisée des Talents avec l'IA", metier: "Ressources Humaines", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["Talents", "Formation"] },
  { id: "rh-06", title: "Paie et Administration RH Augmentée", metier: "Ressources Humaines", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["Paie", "Administration"] },
  { id: "rh-07", title: "Entretiens Annuels et IA : Évaluation Intelligente", metier: "Ressources Humaines", level: "Intermédiaire", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Évaluation", "Entretiens"] },
  { id: "rh-08", title: "Marque Employeur et IA", metier: "Ressources Humaines", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Marque employeur", "Communication"] },
  { id: "rh-09", title: "People Analytics : Données RH et IA", metier: "Ressources Humaines", level: "Avancé", format: "Présentiel", duration: "3 jours", price: "750 000 FCFA", tags: ["Analytics", "Data RH"] },
  { id: "rh-10", title: "Droit Social et IA : Conformité Automatisée", metier: "Ressources Humaines", level: "Avancé", format: "Présentiel", duration: "2 jours", price: "750 000 FCFA", tags: ["Droit social", "Conformité"] },

  // ═══════════════════════════════════════════════
  // MARKETING & COMMUNICATION (10)
  // ═══════════════════════════════════════════════
  { id: "mkt-01", title: "Création de Contenu Marketing avec l'IA", metier: "Marketing & Communication", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["Contenu", "ChatGPT"] },
  { id: "mkt-02", title: "SEO Automatisé et IA", metier: "Marketing & Communication", level: "Intermédiaire", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["SEO", "Automatisation"] },
  { id: "mkt-03", title: "Social Media Management avec l'IA", metier: "Marketing & Communication", level: "Débutant", format: "Hybride", duration: "2 jours", price: "350 000 FCFA", tags: ["Réseaux sociaux", "Planification"] },
  { id: "mkt-04", title: "Email Marketing Intelligent et Personnalisé", metier: "Marketing & Communication", level: "Intermédiaire", format: "Présentiel", duration: "1 jour", price: "350 000 FCFA", tags: ["Email", "Personnalisation"] },
  { id: "mkt-05", title: "Analyse d'Audience et Segmentation IA", metier: "Marketing & Communication", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Audience", "Segmentation"] },
  { id: "mkt-06", title: "Génération d'Images et Vidéos avec l'IA", metier: "Marketing & Communication", level: "Débutant", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["Midjourney", "Vidéo IA"] },
  { id: "mkt-07", title: "Copywriting IA : Rédiger des Textes qui Convertissent", metier: "Marketing & Communication", level: "Intermédiaire", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Copywriting", "Conversion"] },
  { id: "mkt-08", title: "Publicité Digitale Optimisée par l'IA", metier: "Marketing & Communication", level: "Avancé", format: "Présentiel", duration: "2 jours", price: "750 000 FCFA", tags: ["Ads", "Optimisation"] },
  { id: "mkt-09", title: "Veille Concurrentielle Automatisée", metier: "Marketing & Communication", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Veille", "Concurrence"] },
  { id: "mkt-10", title: "Stratégie Marketing Data-Driven avec l'IA", metier: "Marketing & Communication", level: "Avancé", format: "Présentiel", duration: "3 jours", price: "750 000 FCFA", tags: ["Stratégie", "Data"] },

  // ═══════════════════════════════════════════════
  // FINANCE & COMPTABILITÉ (10)
  // ═══════════════════════════════════════════════
  { id: "fin-01", title: "IA et Analyse Financière Avancée", metier: "Finance & Comptabilité", level: "Avancé", format: "Présentiel", duration: "3 jours", price: "750 000 FCFA", tags: ["Finance", "Analyse"] },
  { id: "fin-02", title: "Détection de Fraudes avec l'IA", metier: "Finance & Comptabilité", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["Fraude", "Machine Learning"] },
  { id: "fin-03", title: "Prévisions Budgétaires Assistées par IA", metier: "Finance & Comptabilité", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Budget", "Prévisions"] },
  { id: "fin-04", title: "Reporting Financier Automatisé", metier: "Finance & Comptabilité", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Reporting", "Automatisation"] },
  { id: "fin-05", title: "Comptabilité Automatisée avec l'IA", metier: "Finance & Comptabilité", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["Comptabilité", "IA"] },
  { id: "fin-06", title: "Gestion de Trésorerie Intelligente", metier: "Finance & Comptabilité", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Trésorerie", "Prédictif"] },
  { id: "fin-07", title: "Audit Interne Augmenté par l'IA", metier: "Finance & Comptabilité", level: "Avancé", format: "Présentiel", duration: "3 jours", price: "750 000 FCFA", tags: ["Audit", "Conformité"] },
  { id: "fin-08", title: "Excel Financier Avancé avec IA", metier: "Finance & Comptabilité", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Excel", "Finance"] },
  { id: "fin-09", title: "Risques Financiers et Modèles Prédictifs", metier: "Finance & Comptabilité", level: "Avancé", format: "Hybride", duration: "2 jours", price: "750 000 FCFA", tags: ["Risques", "Prédictif"] },
  { id: "fin-10", title: "Normes IFRS et Automatisation avec l'IA", metier: "Finance & Comptabilité", level: "Intermédiaire", format: "En ligne", duration: "1 jour", price: "500 000 FCFA", tags: ["IFRS", "Normes"] },

  // ═══════════════════════════════════════════════
  // JURIDIQUE & CONFORMITÉ (10)
  // ═══════════════════════════════════════════════
  { id: "jur-01", title: "Recherche Juridique Assistée par IA", metier: "Juridique & Conformité", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Juridique", "Recherche"] },
  { id: "jur-02", title: "Analyse de Contrats avec l'IA", metier: "Juridique & Conformité", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Contrats", "Analyse"] },
  { id: "jur-03", title: "Veille Réglementaire Automatisée", metier: "Juridique & Conformité", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Veille", "Réglementation"] },
  { id: "jur-04", title: "Rédaction Juridique Assistée par l'IA", metier: "Juridique & Conformité", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Rédaction", "Juridique"] },
  { id: "jur-05", title: "RGPD et Protection des Données avec l'IA", metier: "Juridique & Conformité", level: "Intermédiaire", format: "En ligne", duration: "1 jour", price: "500 000 FCFA", tags: ["RGPD", "Données"] },
  { id: "jur-06", title: "Due Diligence Augmentée par l'IA", metier: "Juridique & Conformité", level: "Avancé", format: "Présentiel", duration: "2 jours", price: "750 000 FCFA", tags: ["Due diligence", "M&A"] },
  { id: "jur-07", title: "Gestion du Contentieux avec l'IA", metier: "Juridique & Conformité", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["Contentieux", "Gestion"] },
  { id: "jur-08", title: "Conformité Anti-Blanchiment et IA", metier: "Juridique & Conformité", level: "Avancé", format: "Présentiel", duration: "2 jours", price: "750 000 FCFA", tags: ["LCB-FT", "Conformité"] },
  { id: "jur-09", title: "Propriété Intellectuelle et IA", metier: "Juridique & Conformité", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["PI", "Brevets"] },
  { id: "jur-10", title: "Legal Tech : Outils IA pour Juristes", metier: "Juridique & Conformité", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Legal Tech", "Outils"] },

  // ═══════════════════════════════════════════════
  // SERVICE CLIENT & RELATION CLIENT (10)
  // ═══════════════════════════════════════════════
  { id: "sc-01", title: "Chatbots Intelligents pour le Service Client", metier: "Service Client", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Chatbot", "IA"] },
  { id: "sc-02", title: "Analyse de Sentiment et Feedback Client", metier: "Service Client", level: "Intermédiaire", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Sentiment", "NLP"] },
  { id: "sc-03", title: "Personnalisation du Parcours Client avec l'IA", metier: "Service Client", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Parcours client", "Personnalisation"] },
  { id: "sc-04", title: "Support Prédictif et Maintenance Anticipée", metier: "Service Client", level: "Avancé", format: "Hybride", duration: "2 jours", price: "750 000 FCFA", tags: ["Prédictif", "Maintenance"] },
  { id: "sc-05", title: "CRM Intelligent et IA", metier: "Service Client", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["CRM", "IA"] },
  { id: "sc-06", title: "Gestion des Réclamations Automatisée", metier: "Service Client", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Réclamations", "Automatisation"] },
  { id: "sc-07", title: "Expérience Client Omnicanale avec l'IA", metier: "Service Client", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Omnicanal", "UX"] },
  { id: "sc-08", title: "Voicebots et Assistants Vocaux IA", metier: "Service Client", level: "Avancé", format: "Présentiel", duration: "3 jours", price: "750 000 FCFA", tags: ["Voicebot", "Vocal"] },
  { id: "sc-09", title: "Fidélisation Client par l'IA", metier: "Service Client", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Fidélisation", "Rétention"] },
  { id: "sc-10", title: "Mesurer la Satisfaction Client avec l'IA", metier: "Service Client", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["NPS", "Satisfaction"] },

  // ═══════════════════════════════════════════════
  // DATA & ANALYSE DE DONNÉES (10)
  // ═══════════════════════════════════════════════
  { id: "data-01", title: "Visualisation de Données avec IA", metier: "Data & Analyse", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["Data Viz", "IA"] },
  { id: "data-02", title: "Analyse Prédictive pour les Entreprises", metier: "Data & Analyse", level: "Intermédiaire", format: "Présentiel", duration: "3 jours", price: "500 000 FCFA", tags: ["Prédictif", "Modélisation"] },
  { id: "data-03", title: "Machine Learning Appliqué aux Métiers", metier: "Data & Analyse", level: "Avancé", format: "Présentiel", duration: "5 jours", price: "1 200 000 FCFA", tags: ["Machine Learning", "Python"] },
  { id: "data-04", title: "Power BI et Tableaux de Bord IA", metier: "Data & Analyse", level: "Débutant", format: "Hybride", duration: "2 jours", price: "350 000 FCFA", tags: ["Power BI", "Dashboard"] },
  { id: "data-05", title: "Business Intelligence et IA", metier: "Data & Analyse", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["BI", "Analyse"] },
  { id: "data-06", title: "Nettoyage et Préparation de Données avec l'IA", metier: "Data & Analyse", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Data Prep", "Qualité"] },
  { id: "data-07", title: "SQL et Bases de Données pour l'Analyse IA", metier: "Data & Analyse", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["SQL", "Base de données"] },
  { id: "data-08", title: "Data Storytelling : Raconter avec les Données", metier: "Data & Analyse", level: "Intermédiaire", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Storytelling", "Présentation"] },
  { id: "data-09", title: "NLP et Analyse de Texte en Entreprise", metier: "Data & Analyse", level: "Avancé", format: "Présentiel", duration: "3 jours", price: "750 000 FCFA", tags: ["NLP", "Texte"] },
  { id: "data-10", title: "Gouvernance des Données et IA", metier: "Data & Analyse", level: "Avancé", format: "Hybride", duration: "2 jours", price: "750 000 FCFA", tags: ["Gouvernance", "Qualité"] },

  // ═══════════════════════════════════════════════
  // ADMINISTRATION & GESTION (10)
  // ═══════════════════════════════════════════════
  { id: "admin-01", title: "Automatisation Administrative avec l'IA", metier: "Administration & Gestion", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Automatisation", "Admin"] },
  { id: "admin-02", title: "Gestion Documentaire Intelligente", metier: "Administration & Gestion", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["Documents", "GED"] },
  { id: "admin-03", title: "Planification et Suivi des Indicateurs avec l'IA", metier: "Administration & Gestion", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["KPI", "Planification"] },
  { id: "admin-04", title: "Gestion des Achats et Approvisionnement IA", metier: "Administration & Gestion", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["Achats", "Supply Chain"] },
  { id: "admin-05", title: "Archivage et Classement Intelligent", metier: "Administration & Gestion", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Archivage", "IA"] },
  { id: "admin-06", title: "Gestion des Stocks Prédictive", metier: "Administration & Gestion", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Stocks", "Prédictif"] },
  { id: "admin-07", title: "Optimisation des Processus Métier avec l'IA", metier: "Administration & Gestion", level: "Avancé", format: "Présentiel", duration: "3 jours", price: "750 000 FCFA", tags: ["BPM", "Optimisation"] },
  { id: "admin-08", title: "Gestion de Flotte et Logistique IA", metier: "Administration & Gestion", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["Logistique", "Flotte"] },
  { id: "admin-09", title: "Courriers et Correspondances avec l'IA", metier: "Administration & Gestion", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Courrier", "Rédaction"] },
  { id: "admin-10", title: "Tableaux de Bord Administratifs avec l'IA", metier: "Administration & Gestion", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Dashboard", "Suivi"] },

  // ═══════════════════════════════════════════════
  // MANAGEMENT & LEADERSHIP (10)
  // ═══════════════════════════════════════════════
  { id: "mgmt-01", title: "Leadership Data-Driven avec l'IA", metier: "Management & Leadership", level: "Avancé", format: "Présentiel", duration: "2 jours", price: "750 000 FCFA", tags: ["Leadership", "Data"] },
  { id: "mgmt-02", title: "Prise de Décision Stratégique avec l'IA", metier: "Management & Leadership", level: "Avancé", format: "Présentiel", duration: "2 jours", price: "750 000 FCFA", tags: ["Stratégie", "Décision"] },
  { id: "mgmt-03", title: "Conduite du Changement IA en Entreprise", metier: "Management & Leadership", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["Changement", "Transformation"] },
  { id: "mgmt-04", title: "Gestion d'Équipe Augmentée par l'IA", metier: "Management & Leadership", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Équipe", "Management"] },
  { id: "mgmt-05", title: "IA pour Dirigeants : Vision et Stratégie", metier: "Management & Leadership", level: "Avancé", format: "Présentiel", duration: "1 jour", price: "750 000 FCFA", tags: ["Dirigeants", "Vision"] },
  { id: "mgmt-06", title: "Innovation et IA : Créer de Nouveaux Modèles", metier: "Management & Leadership", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["Innovation", "Business Model"] },
  { id: "mgmt-07", title: "Gestion de la Performance avec l'IA", metier: "Management & Leadership", level: "Intermédiaire", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Performance", "KPI"] },
  { id: "mgmt-08", title: "Communication Managériale et IA", metier: "Management & Leadership", level: "Débutant", format: "Présentiel", duration: "1 jour", price: "350 000 FCFA", tags: ["Communication", "Management"] },
  { id: "mgmt-09", title: "Planification Stratégique Assistée par l'IA", metier: "Management & Leadership", level: "Avancé", format: "Présentiel", duration: "3 jours", price: "750 000 FCFA", tags: ["Planification", "Stratégie"] },
  { id: "mgmt-10", title: "Culture IA : Transformer les Mentalités", metier: "Management & Leadership", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Culture", "Mindset"] },

  // ═══════════════════════════════════════════════
  // IT & TRANSFORMATION DIGITALE (10)
  // ═══════════════════════════════════════════════
  { id: "it-01", title: "Intégration d'Outils IA en Entreprise", metier: "IT & Transformation Digitale", level: "Intermédiaire", format: "Présentiel", duration: "3 jours", price: "500 000 FCFA", tags: ["IT", "Intégration"] },
  { id: "it-02", title: "Cybersécurité et IA : Détection des Menaces", metier: "IT & Transformation Digitale", level: "Avancé", format: "Présentiel", duration: "3 jours", price: "750 000 FCFA", tags: ["Cybersécurité", "Détection"] },
  { id: "it-03", title: "Automatisation IT avec l'IA (DevOps)", metier: "IT & Transformation Digitale", level: "Avancé", format: "Présentiel", duration: "3 jours", price: "750 000 FCFA", tags: ["DevOps", "Automatisation"] },
  { id: "it-04", title: "Gestion de Projets Technologiques et IA", metier: "IT & Transformation Digitale", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["Projet", "Agile"] },
  { id: "it-05", title: "APIs et Intégration de Services IA", metier: "IT & Transformation Digitale", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["API", "Services"] },
  { id: "it-06", title: "Cloud Computing et IA pour l'Entreprise", metier: "IT & Transformation Digitale", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["Cloud", "Infrastructure"] },
  { id: "it-07", title: "No-Code et IA : Développer sans Coder", metier: "IT & Transformation Digitale", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["No-Code", "IA"] },
  { id: "it-08", title: "Architecture de Solutions IA", metier: "IT & Transformation Digitale", level: "Avancé", format: "Présentiel", duration: "3 jours", price: "750 000 FCFA", tags: ["Architecture", "Solutions"] },
  { id: "it-09", title: "Testing et Qualité Logicielle avec l'IA", metier: "IT & Transformation Digitale", level: "Intermédiaire", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Testing", "QA"] },
  { id: "it-10", title: "Gouvernance IT et Stratégie IA", metier: "IT & Transformation Digitale", level: "Avancé", format: "Hybride", duration: "2 jours", price: "750 000 FCFA", tags: ["Gouvernance", "Stratégie IT"] },

  // ═══════════════════════════════════════════════
  // FORMATION & PÉDAGOGIE (10)
  // ═══════════════════════════════════════════════
  { id: "form-01", title: "E-learning Adaptatif avec l'IA", metier: "Formation & Pédagogie", level: "Intermédiaire", format: "En ligne", duration: "2 jours", price: "500 000 FCFA", tags: ["E-learning", "Pédagogie"] },
  { id: "form-02", title: "Conception Pédagogique Assistée par IA", metier: "Formation & Pédagogie", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Conception", "Ingénierie"] },
  { id: "form-03", title: "Évaluation Intelligente des Apprenants", metier: "Formation & Pédagogie", level: "Intermédiaire", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Évaluation", "Quiz IA"] },
  { id: "form-04", title: "Création de Supports de Formation avec l'IA", metier: "Formation & Pédagogie", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["Supports", "ChatGPT"] },
  { id: "form-05", title: "Gamification et IA dans la Formation", metier: "Formation & Pédagogie", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Gamification", "Engagement"] },
  { id: "form-06", title: "Suivi et Analytics des Apprenants", metier: "Formation & Pédagogie", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Analytics", "Suivi"] },
  { id: "form-07", title: "Vidéo Pédagogique Générée par IA", metier: "Formation & Pédagogie", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Vidéo", "Génération"] },
  { id: "form-08", title: "Tutorat Virtuel et Assistants IA", metier: "Formation & Pédagogie", level: "Avancé", format: "Présentiel", duration: "2 jours", price: "750 000 FCFA", tags: ["Tutorat", "Assistant IA"] },
  { id: "form-09", title: "Accessibilité et Inclusion avec l'IA", metier: "Formation & Pédagogie", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Accessibilité", "Inclusion"] },
  { id: "form-10", title: "LMS et Plateformes de Formation IA", metier: "Formation & Pédagogie", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["LMS", "Plateforme"] },

  // ═══════════════════════════════════════════════
  // SANTÉ & BIEN-ÊTRE AU TRAVAIL (10)
  // ═══════════════════════════════════════════════
  { id: "sante-01", title: "Prévention des Risques Professionnels avec l'IA", metier: "Santé & Bien-être", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["Prévention", "Risques"] },
  { id: "sante-02", title: "Analyse Ergonomique des Postes avec l'IA", metier: "Santé & Bien-être", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Ergonomie", "Analyse"] },
  { id: "sante-03", title: "Suivi du Bien-être au Travail par l'IA", metier: "Santé & Bien-être", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Bien-être", "Suivi"] },
  { id: "sante-04", title: "Programmes de Santé au Travail avec l'IA", metier: "Santé & Bien-être", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Santé", "Programme"] },
  { id: "sante-05", title: "Détection du Stress et Burn-out par l'IA", metier: "Santé & Bien-être", level: "Intermédiaire", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Stress", "Burn-out"] },
  { id: "sante-06", title: "QVT et IA : Qualité de Vie au Travail", metier: "Santé & Bien-être", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["QVT", "Qualité de vie"] },
  { id: "sante-07", title: "Gestion des Accidents du Travail avec l'IA", metier: "Santé & Bien-être", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Accidents", "Gestion"] },
  { id: "sante-08", title: "Télémédecine et IA en Entreprise", metier: "Santé & Bien-être", level: "Avancé", format: "Présentiel", duration: "2 jours", price: "750 000 FCFA", tags: ["Télémédecine", "Digital"] },
  { id: "sante-09", title: "Nutrition et Bien-être Assistés par l'IA", metier: "Santé & Bien-être", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Nutrition", "Bien-être"] },
  { id: "sante-10", title: "Conformité HSE et IA", metier: "Santé & Bien-être", level: "Avancé", format: "Hybride", duration: "2 jours", price: "750 000 FCFA", tags: ["HSE", "Conformité"] },

  // ═══════════════════════════════════════════════
  // DIPLOMATIE & AFFAIRES INTERNATIONALES (10)
  // ═══════════════════════════════════════════════
  { id: "diplo-01", title: "Diplomatie Digitale et Intelligence Artificielle", metier: "Diplomatie & Affaires Internationales", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "2 500 000 FCFA", tags: ["Diplomatie numérique", "Relations internationales"] },
  { id: "diplo-02", title: "Intelligence Artificielle et Analyse Géopolitique", metier: "Diplomatie & Affaires Internationales", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "3 000 000 FCFA", tags: ["Géopolitique", "Analyse stratégique"] },
  { id: "diplo-03", title: "Diplomatie des Données (Data Diplomacy)", metier: "Diplomatie & Affaires Internationales", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "3 000 000 FCFA", tags: ["Data Diplomacy", "Gouvernance des données"] },
  { id: "diplo-04", title: "Cybersécurité et Diplomatie Internationale", metier: "Diplomatie & Affaires Internationales", level: "Avancé", format: "Présentiel", duration: "2 jours", price: "3 500 000 FCFA", tags: ["Cybersécurité", "Cyber diplomatie"] },
  { id: "diplo-05", title: "Diplomatie des Technologies Émergentes", metier: "Diplomatie & Affaires Internationales", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "3 000 000 FCFA", tags: ["Technologies émergentes", "Régulation IA"] },
  { id: "diplo-06", title: "Communication Diplomatique à l'ère de l'IA", metier: "Diplomatie & Affaires Internationales", level: "Débutant", format: "Hybride", duration: "2 jours", price: "2 500 000 FCFA", tags: ["Communication", "Rédaction diplomatique"] },
  { id: "diplo-07", title: "Négociation Internationale et IA", metier: "Diplomatie & Affaires Internationales", level: "Avancé", format: "Présentiel", duration: "2 jours", price: "3 500 000 FCFA", tags: ["Négociation", "Simulation IA"] },
  { id: "diplo-08", title: "Diplomatie Économique et Intelligence Artificielle", metier: "Diplomatie & Affaires Internationales", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "3 000 000 FCFA", tags: ["Commerce international", "Diplomatie économique"] },
  { id: "diplo-09", title: "Gouvernance Mondiale de l'Intelligence Artificielle", metier: "Diplomatie & Affaires Internationales", level: "Avancé", format: "Hybride", duration: "2 jours", price: "3 500 000 FCFA", tags: ["Gouvernance IA", "ONU & UNESCO"] },
  { id: "diplo-10", title: "Leadership Diplomatique à l'ère de l'IA", metier: "Diplomatie & Affaires Internationales", level: "Avancé", format: "Présentiel", duration: "2 jours", price: "5 000 000 FCFA", tags: ["Leadership", "Transformation numérique"] },
];
