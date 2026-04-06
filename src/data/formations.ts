import { deepFixMojibake } from "@/lib/fixMojibake";

export type Formation = {
  id: string;
  title: string;
  titleEn: string;
  metier: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  format: "Présentiel" | "Hybride" | "En ligne";
  duration: string;
  durationEn: string;
  price: string;
  tags: string[];
};

const rawFormations: Formation[] = [
  // ═══════════════════════════════════════════════
  // ASSISTANAT & SECRÉTARIAT DE DIRECTION (10)
  // ═══════════════════════════════════════════════
  { id: "assist-01", title: "ChatGPT pour Assistants de Direction", titleEn: "ChatGPT for Executive Assistants", metier: "Assistanat & Secrétariat", level: "Débutant", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["ChatGPT", "Productivité"] },
  { id: "assist-02", title: "Gestion Intelligente de l'Agenda avec l'IA", titleEn: "Smart Calendar Management with AI", metier: "Assistanat & Secrétariat", level: "Débutant", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Agenda", "Automatisation"] },
  { id: "assist-03", title: "Rédaction Professionnelle Assistée par IA", titleEn: "AI-Assisted Professional Writing", metier: "Assistanat & Secrétariat", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Rédaction", "ChatGPT"] },
  { id: "assist-04", title: "Synthèse de Réunions avec l'IA", titleEn: "AI-Powered Meeting Summaries", metier: "Assistanat & Secrétariat", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Réunions", "Synthèse"] },
  { id: "assist-05", title: "Automatisation des Tâches Administratives", titleEn: "Administrative Task Automation", metier: "Assistanat & Secrétariat", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Automatisation", "Zapier"] },
  { id: "assist-06", title: "Gestion de Projets Augmentée par l'IA", titleEn: "AI-Augmented Project Management", metier: "Assistanat & Secrétariat", level: "Intermédiaire", format: "Hybride", duration: "3 jours", durationEn: "3 days", price: "500 000 FCFA", tags: ["Gestion de projet", "IA"] },
  { id: "assist-07", title: "Excel & Power BI avec IA pour Assistants", titleEn: "Excel & Power BI with AI for Assistants", metier: "Assistanat & Secrétariat", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Excel", "Power BI"] },
  { id: "assist-08", title: "Communication Professionnelle & IA", titleEn: "Professional Communication & AI", metier: "Assistanat & Secrétariat", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Communication", "IA"] },
  { id: "assist-09", title: "Organisation Digitale et IA", titleEn: "Digital Organization and AI", metier: "Assistanat & Secrétariat", level: "Avancé", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["Organisation", "Digital"] },
  { id: "assist-10", title: "Certification Assistant de Direction Augmenté", titleEn: "AI-Augmented Executive Assistant Certification", metier: "Assistanat & Secrétariat", level: "Avancé", format: "Présentiel", duration: "5 jours", durationEn: "5 days", price: "1 500 000 FCFA", tags: ["Certification", "Complet"] },

  // ═══════════════════════════════════════════════
  // RESSOURCES HUMAINES (10)
  // ═══════════════════════════════════════════════
  { id: "rh-01", title: "IA et Recrutement : Sourcing & Sélection", titleEn: "AI & Recruitment: Sourcing & Selection", metier: "Ressources Humaines", level: "Débutant", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["Recrutement", "IA"] },
  { id: "rh-02", title: "Gestion Prévisionnelle des Emplois avec l'IA", titleEn: "AI-Powered Workforce Planning", metier: "Ressources Humaines", level: "Intermédiaire", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["GPEC", "Prédictif"] },
  { id: "rh-03", title: "Onboarding Automatisé avec l'IA", titleEn: "Automated Onboarding with AI", metier: "Ressources Humaines", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Onboarding", "Automatisation"] },
  { id: "rh-04", title: "Analyse du Climat Social par l'IA", titleEn: "AI-Driven Workplace Climate Analysis", metier: "Ressources Humaines", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Climat social", "Analyse"] },
  { id: "rh-05", title: "Formation Personnalisée des Talents avec l'IA", titleEn: "Personalized Talent Training with AI", metier: "Ressources Humaines", level: "Intermédiaire", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Talents", "Formation"] },
  { id: "rh-06", title: "Paie et Administration RH Augmentée", titleEn: "AI-Enhanced Payroll & HR Administration", metier: "Ressources Humaines", level: "Débutant", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["Paie", "Administration"] },
  { id: "rh-07", title: "Entretiens Annuels et IA : Évaluation Intelligente", titleEn: "Annual Reviews & AI: Smart Evaluation", metier: "Ressources Humaines", level: "Intermédiaire", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Évaluation", "Entretiens"] },
  { id: "rh-08", title: "Marque Employeur et IA", titleEn: "Employer Branding & AI", metier: "Ressources Humaines", level: "Débutant", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Marque employeur", "Communication"] },
  { id: "rh-09", title: "People Analytics : Données RH et IA", titleEn: "People Analytics: HR Data & AI", metier: "Ressources Humaines", level: "Avancé", format: "Présentiel", duration: "3 jours", durationEn: "3 days", price: "750 000 FCFA", tags: ["Analytics", "Data RH"] },
  { id: "rh-10", title: "Droit Social et IA : Conformité Automatisée", titleEn: "Labor Law & AI: Automated Compliance", metier: "Ressources Humaines", level: "Avancé", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["Droit social", "Conformité"] },

  // ═══════════════════════════════════════════════
  // MARKETING & COMMUNICATION (10)
  // ═══════════════════════════════════════════════
  { id: "mkt-01", title: "Création de Contenu Marketing avec l'IA", titleEn: "AI-Powered Marketing Content Creation", metier: "Marketing & Communication", level: "Débutant", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["Contenu", "ChatGPT"] },
  { id: "mkt-02", title: "SEO Automatisé et IA", titleEn: "Automated SEO & AI", metier: "Marketing & Communication", level: "Intermédiaire", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["SEO", "Automatisation"] },
  { id: "mkt-03", title: "Social Media Management avec l'IA", titleEn: "Social Media Management with AI", metier: "Marketing & Communication", level: "Débutant", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["Réseaux sociaux", "Planification"] },
  { id: "mkt-04", title: "Email Marketing Intelligent et Personnalisé", titleEn: "Smart & Personalized Email Marketing", metier: "Marketing & Communication", level: "Intermédiaire", format: "Présentiel", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Email", "Personnalisation"] },
  { id: "mkt-05", title: "Analyse d'Audience et Segmentation IA", titleEn: "AI Audience Analysis & Segmentation", metier: "Marketing & Communication", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Audience", "Segmentation"] },
  { id: "mkt-06", title: "Génération d'Images et Vidéos avec l'IA", titleEn: "AI Image & Video Generation", metier: "Marketing & Communication", level: "Débutant", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Midjourney", "Vidéo IA"] },
  { id: "mkt-07", title: "Copywriting IA : Rédiger des Textes qui Convertissent", titleEn: "AI Copywriting: Writing Copy that Converts", metier: "Marketing & Communication", level: "Intermédiaire", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Copywriting", "Conversion"] },
  { id: "mkt-08", title: "Publicité Digitale Optimisée par l'IA", titleEn: "AI-Optimized Digital Advertising", metier: "Marketing & Communication", level: "Avancé", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["Ads", "Optimisation"] },
  { id: "mkt-09", title: "Veille Concurrentielle Automatisée", titleEn: "Automated Competitive Intelligence", metier: "Marketing & Communication", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Veille", "Concurrence"] },
  { id: "mkt-10", title: "Stratégie Marketing Data-Driven avec l'IA", titleEn: "Data-Driven Marketing Strategy with AI", metier: "Marketing & Communication", level: "Avancé", format: "Présentiel", duration: "3 jours", durationEn: "3 days", price: "750 000 FCFA", tags: ["Stratégie", "Data"] },

  // ═══════════════════════════════════════════════
  // FINANCE & COMPTABILITÉ (10)
  // ═══════════════════════════════════════════════
  { id: "fin-01", title: "IA et Analyse Financière Avancée", titleEn: "AI & Advanced Financial Analysis", metier: "Finance & Comptabilité", level: "Avancé", format: "Présentiel", duration: "3 jours", durationEn: "3 days", price: "750 000 FCFA", tags: ["Finance", "Analyse"] },
  { id: "fin-02", title: "Détection de Fraudes avec l'IA", titleEn: "AI-Powered Fraud Detection", metier: "Finance & Comptabilité", level: "Intermédiaire", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Fraude", "Machine Learning"] },
  { id: "fin-03", title: "Prévisions Budgétaires Assistées par IA", titleEn: "AI-Assisted Budget Forecasting", metier: "Finance & Comptabilité", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Budget", "Prévisions"] },
  { id: "fin-04", title: "Reporting Financier Automatisé", titleEn: "Automated Financial Reporting", metier: "Finance & Comptabilité", level: "Débutant", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Reporting", "Automatisation"] },
  { id: "fin-05", title: "Comptabilité Automatisée avec l'IA", titleEn: "AI-Automated Accounting", metier: "Finance & Comptabilité", level: "Débutant", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["Comptabilité", "IA"] },
  { id: "fin-06", title: "Gestion de Trésorerie Intelligente", titleEn: "Smart Treasury Management", metier: "Finance & Comptabilité", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Trésorerie", "Prédictif"] },
  { id: "fin-07", title: "Audit Interne Augmenté par l'IA", titleEn: "AI-Augmented Internal Audit", metier: "Finance & Comptabilité", level: "Avancé", format: "Présentiel", duration: "3 jours", durationEn: "3 days", price: "750 000 FCFA", tags: ["Audit", "Conformité"] },
  { id: "fin-08", title: "Excel Financier Avancé avec IA", titleEn: "Advanced Financial Excel with AI", metier: "Finance & Comptabilité", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Excel", "Finance"] },
  { id: "fin-09", title: "Risques Financiers et Modèles Prédictifs", titleEn: "Financial Risks & Predictive Models", metier: "Finance & Comptabilité", level: "Avancé", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["Risques", "Prédictif"] },
  { id: "fin-10", title: "Normes IFRS et Automatisation avec l'IA", titleEn: "IFRS Standards & AI Automation", metier: "Finance & Comptabilité", level: "Intermédiaire", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "500 000 FCFA", tags: ["IFRS", "Normes"] },

  // ═══════════════════════════════════════════════
  // JURIDIQUE & CONFORMITÉ (10)
  // ═══════════════════════════════════════════════
  { id: "jur-01", title: "Recherche Juridique Assistée par IA", titleEn: "AI-Assisted Legal Research", metier: "Juridique & Conformité", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Juridique", "Recherche"] },
  { id: "jur-02", title: "Analyse de Contrats avec l'IA", titleEn: "AI Contract Analysis", metier: "Juridique & Conformité", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Contrats", "Analyse"] },
  { id: "jur-03", title: "Veille Réglementaire Automatisée", titleEn: "Automated Regulatory Monitoring", metier: "Juridique & Conformité", level: "Débutant", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Veille", "Réglementation"] },
  { id: "jur-04", title: "Rédaction Juridique Assistée par l'IA", titleEn: "AI-Assisted Legal Drafting", metier: "Juridique & Conformité", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Rédaction", "Juridique"] },
  { id: "jur-05", title: "RGPD et Protection des Données avec l'IA", titleEn: "GDPR & Data Protection with AI", metier: "Juridique & Conformité", level: "Intermédiaire", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "500 000 FCFA", tags: ["RGPD", "Données"] },
  { id: "jur-06", title: "Due Diligence Augmentée par l'IA", titleEn: "AI-Augmented Due Diligence", metier: "Juridique & Conformité", level: "Avancé", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["Due diligence", "M&A"] },
  { id: "jur-07", title: "Gestion du Contentieux avec l'IA", titleEn: "AI-Powered Litigation Management", metier: "Juridique & Conformité", level: "Intermédiaire", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Contentieux", "Gestion"] },
  { id: "jur-08", title: "Conformité Anti-Blanchiment et IA", titleEn: "Anti-Money Laundering Compliance & AI", metier: "Juridique & Conformité", level: "Avancé", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["LCB-FT", "Conformité"] },
  { id: "jur-09", title: "Propriété Intellectuelle et IA", titleEn: "Intellectual Property & AI", metier: "Juridique & Conformité", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["PI", "Brevets"] },
  { id: "jur-10", title: "Legal Tech : Outils IA pour Juristes", titleEn: "Legal Tech: AI Tools for Lawyers", metier: "Juridique & Conformité", level: "Débutant", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Legal Tech", "Outils"] },

  // ═══════════════════════════════════════════════
  // SERVICE CLIENT & RELATION CLIENT (10)
  // ═══════════════════════════════════════════════
  { id: "sc-01", title: "Chatbots Intelligents pour le Service Client", titleEn: "Smart Chatbots for Customer Service", metier: "Service Client", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Chatbot", "IA"] },
  { id: "sc-02", title: "Analyse de Sentiment et Feedback Client", titleEn: "Sentiment Analysis & Customer Feedback", metier: "Service Client", level: "Intermédiaire", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Sentiment", "NLP"] },
  { id: "sc-03", title: "Personnalisation du Parcours Client avec l'IA", titleEn: "AI-Powered Customer Journey Personalization", metier: "Service Client", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Parcours client", "Personnalisation"] },
  { id: "sc-04", title: "Support Prédictif et Maintenance Anticipée", titleEn: "Predictive Support & Preventive Maintenance", metier: "Service Client", level: "Avancé", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["Prédictif", "Maintenance"] },
  { id: "sc-05", title: "CRM Intelligent et IA", titleEn: "Intelligent CRM & AI", metier: "Service Client", level: "Débutant", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["CRM", "IA"] },
  { id: "sc-06", title: "Gestion des Réclamations Automatisée", titleEn: "Automated Complaint Management", metier: "Service Client", level: "Débutant", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Réclamations", "Automatisation"] },
  { id: "sc-07", title: "Expérience Client Omnicanale avec l'IA", titleEn: "Omnichannel Customer Experience with AI", metier: "Service Client", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Omnicanal", "UX"] },
  { id: "sc-08", title: "Voicebots et Assistants Vocaux IA", titleEn: "AI Voicebots & Voice Assistants", metier: "Service Client", level: "Avancé", format: "Présentiel", duration: "3 jours", durationEn: "3 days", price: "750 000 FCFA", tags: ["Voicebot", "Vocal"] },
  { id: "sc-09", title: "Fidélisation Client par l'IA", titleEn: "AI-Driven Customer Retention", metier: "Service Client", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Fidélisation", "Rétention"] },
  { id: "sc-10", title: "Mesurer la Satisfaction Client avec l'IA", titleEn: "Measuring Customer Satisfaction with AI", metier: "Service Client", level: "Débutant", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["NPS", "Satisfaction"] },

  // ═══════════════════════════════════════════════
  // DATA & ANALYSE DE DONNÉES (10)
  // ═══════════════════════════════════════════════
  { id: "data-01", title: "Visualisation de Données avec IA", titleEn: "AI-Powered Data Visualization", metier: "Data & Analyse", level: "Débutant", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["Data Viz", "IA"] },
  { id: "data-02", title: "Analyse Prédictive pour les Entreprises", titleEn: "Predictive Analytics for Businesses", metier: "Data & Analyse", level: "Intermédiaire", format: "Présentiel", duration: "3 jours", durationEn: "3 days", price: "500 000 FCFA", tags: ["Prédictif", "Modélisation"] },
  { id: "data-03", title: "Machine Learning Appliqué aux Métiers", titleEn: "Applied Machine Learning for Business", metier: "Data & Analyse", level: "Avancé", format: "Présentiel", duration: "5 jours", durationEn: "5 days", price: "1 200 000 FCFA", tags: ["Machine Learning", "Python"] },
  { id: "data-04", title: "Power BI et Tableaux de Bord IA", titleEn: "Power BI & AI Dashboards", metier: "Data & Analyse", level: "Débutant", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["Power BI", "Dashboard"] },
  { id: "data-05", title: "Business Intelligence et IA", titleEn: "Business Intelligence & AI", metier: "Data & Analyse", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["BI", "Analyse"] },
  { id: "data-06", title: "Nettoyage et Préparation de Données avec l'IA", titleEn: "AI Data Cleaning & Preparation", metier: "Data & Analyse", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Data Prep", "Qualité"] },
  { id: "data-07", title: "SQL et Bases de Données pour l'Analyse IA", titleEn: "SQL & Databases for AI Analytics", metier: "Data & Analyse", level: "Débutant", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["SQL", "Base de données"] },
  { id: "data-08", title: "Data Storytelling : Raconter avec les Données", titleEn: "Data Storytelling: Narrating with Data", metier: "Data & Analyse", level: "Intermédiaire", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Storytelling", "Présentation"] },
  { id: "data-09", title: "NLP et Analyse de Texte en Entreprise", titleEn: "NLP & Text Analysis for Business", metier: "Data & Analyse", level: "Avancé", format: "Présentiel", duration: "3 jours", durationEn: "3 days", price: "750 000 FCFA", tags: ["NLP", "Texte"] },
  { id: "data-10", title: "Gouvernance des Données et IA", titleEn: "Data Governance & AI", metier: "Data & Analyse", level: "Avancé", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["Gouvernance", "Qualité"] },

  // ═══════════════════════════════════════════════
  // ADMINISTRATION & GESTION (10)
  // ═══════════════════════════════════════════════
  { id: "admin-01", title: "Automatisation Administrative avec l'IA", titleEn: "AI Administrative Automation", metier: "Administration & Gestion", level: "Débutant", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Automatisation", "Admin"] },
  { id: "admin-02", title: "Gestion Documentaire Intelligente", titleEn: "Intelligent Document Management", metier: "Administration & Gestion", level: "Débutant", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["Documents", "GED"] },
  { id: "admin-03", title: "Planification et Suivi des Indicateurs avec l'IA", titleEn: "AI-Powered KPI Planning & Monitoring", metier: "Administration & Gestion", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["KPI", "Planification"] },
  { id: "admin-04", title: "Gestion des Achats et Approvisionnement IA", titleEn: "AI Procurement & Supply Management", metier: "Administration & Gestion", level: "Intermédiaire", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Achats", "Supply Chain"] },
  { id: "admin-05", title: "Archivage et Classement Intelligent", titleEn: "Smart Archiving & Classification", metier: "Administration & Gestion", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Archivage", "IA"] },
  { id: "admin-06", title: "Gestion des Stocks Prédictive", titleEn: "Predictive Inventory Management", metier: "Administration & Gestion", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Stocks", "Prédictif"] },
  { id: "admin-07", title: "Optimisation des Processus Métier avec l'IA", titleEn: "AI Business Process Optimization", metier: "Administration & Gestion", level: "Avancé", format: "Présentiel", duration: "3 jours", durationEn: "3 days", price: "750 000 FCFA", tags: ["BPM", "Optimisation"] },
  { id: "admin-08", title: "Gestion de Flotte et Logistique IA", titleEn: "AI Fleet & Logistics Management", metier: "Administration & Gestion", level: "Intermédiaire", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Logistique", "Flotte"] },
  { id: "admin-09", title: "Courriers et Correspondances avec l'IA", titleEn: "AI-Assisted Correspondence & Mail", metier: "Administration & Gestion", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Courrier", "Rédaction"] },
  { id: "admin-10", title: "Tableaux de Bord Administratifs avec l'IA", titleEn: "AI Administrative Dashboards", metier: "Administration & Gestion", level: "Débutant", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Dashboard", "Suivi"] },

  // ═══════════════════════════════════════════════
  // MANAGEMENT & LEADERSHIP (10)
  // ═══════════════════════════════════════════════
  { id: "mgmt-01", title: "Leadership Data-Driven avec l'IA", titleEn: "Data-Driven Leadership with AI", metier: "Management & Leadership", level: "Avancé", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["Leadership", "Data"] },
  { id: "mgmt-02", title: "Prise de Décision Stratégique avec l'IA", titleEn: "Strategic Decision-Making with AI", metier: "Management & Leadership", level: "Avancé", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["Stratégie", "Décision"] },
  { id: "mgmt-03", title: "Conduite du Changement IA en Entreprise", titleEn: "AI Change Management in Business", metier: "Management & Leadership", level: "Intermédiaire", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Changement", "Transformation"] },
  { id: "mgmt-04", title: "Gestion d'Équipe Augmentée par l'IA", titleEn: "AI-Augmented Team Management", metier: "Management & Leadership", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Équipe", "Management"] },
  { id: "mgmt-05", title: "IA pour Dirigeants : Vision et Stratégie", titleEn: "AI for Executives: Vision & Strategy", metier: "Management & Leadership", level: "Avancé", format: "Présentiel", duration: "1 jour", durationEn: "1 day", price: "750 000 FCFA", tags: ["Dirigeants", "Vision"] },
  { id: "mgmt-06", title: "Innovation et IA : Créer de Nouveaux Modèles", titleEn: "Innovation & AI: Creating New Models", metier: "Management & Leadership", level: "Intermédiaire", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Innovation", "Business Model"] },
  { id: "mgmt-07", title: "Gestion de la Performance avec l'IA", titleEn: "Performance Management with AI", metier: "Management & Leadership", level: "Intermédiaire", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Performance", "KPI"] },
  { id: "mgmt-08", title: "Communication Managériale et IA", titleEn: "Managerial Communication & AI", metier: "Management & Leadership", level: "Débutant", format: "Présentiel", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Communication", "Management"] },
  { id: "mgmt-09", title: "Planification Stratégique Assistée par l'IA", titleEn: "AI-Assisted Strategic Planning", metier: "Management & Leadership", level: "Avancé", format: "Présentiel", duration: "3 jours", durationEn: "3 days", price: "750 000 FCFA", tags: ["Planification", "Stratégie"] },
  { id: "mgmt-10", title: "Culture IA : Transformer les Mentalités", titleEn: "AI Culture: Transforming Mindsets", metier: "Management & Leadership", level: "Débutant", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Culture", "Mindset"] },

  // ═══════════════════════════════════════════════
  // IT & TRANSFORMATION DIGITALE (10)
  // ═══════════════════════════════════════════════
  { id: "it-01", title: "Intégration d'Outils IA en Entreprise", titleEn: "AI Tool Integration in Business", metier: "IT & Transformation Digitale", level: "Intermédiaire", format: "Présentiel", duration: "3 jours", durationEn: "3 days", price: "500 000 FCFA", tags: ["IT", "Intégration"] },
  { id: "it-02", title: "Cybersécurité et IA : Détection des Menaces", titleEn: "Cybersecurity & AI: Threat Detection", metier: "IT & Transformation Digitale", level: "Avancé", format: "Présentiel", duration: "3 jours", durationEn: "3 days", price: "750 000 FCFA", tags: ["Cybersécurité", "Détection"] },
  { id: "it-03", title: "Automatisation IT avec l'IA (DevOps)", titleEn: "IT Automation with AI (DevOps)", metier: "IT & Transformation Digitale", level: "Avancé", format: "Présentiel", duration: "3 jours", durationEn: "3 days", price: "750 000 FCFA", tags: ["DevOps", "Automatisation"] },
  { id: "it-04", title: "Gestion de Projets Technologiques et IA", titleEn: "Technology Project Management & AI", metier: "IT & Transformation Digitale", level: "Intermédiaire", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Projet", "Agile"] },
  { id: "it-05", title: "APIs et Intégration de Services IA", titleEn: "APIs & AI Service Integration", metier: "IT & Transformation Digitale", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["API", "Services"] },
  { id: "it-06", title: "Cloud Computing et IA pour l'Entreprise", titleEn: "Cloud Computing & AI for Business", metier: "IT & Transformation Digitale", level: "Intermédiaire", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Cloud", "Infrastructure"] },
  { id: "it-07", title: "No-Code et IA : Développer sans Coder", titleEn: "No-Code & AI: Build Without Coding", metier: "IT & Transformation Digitale", level: "Débutant", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["No-Code", "IA"] },
  { id: "it-08", title: "Architecture de Solutions IA", titleEn: "AI Solutions Architecture", metier: "IT & Transformation Digitale", level: "Avancé", format: "Présentiel", duration: "3 jours", durationEn: "3 days", price: "750 000 FCFA", tags: ["Architecture", "Solutions"] },
  { id: "it-09", title: "Testing et Qualité Logicielle avec l'IA", titleEn: "AI-Powered Software Testing & QA", metier: "IT & Transformation Digitale", level: "Intermédiaire", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Testing", "QA"] },
  { id: "it-10", title: "Gouvernance IT et Stratégie IA", titleEn: "IT Governance & AI Strategy", metier: "IT & Transformation Digitale", level: "Avancé", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["Gouvernance", "Stratégie IT"] },

  // ═══════════════════════════════════════════════
  // FORMATION & PÉDAGOGIE (10)
  // ═══════════════════════════════════════════════
  { id: "form-01", title: "E-learning Adaptatif avec l'IA", titleEn: "Adaptive E-Learning with AI", metier: "Formation & Pédagogie", level: "Intermédiaire", format: "En ligne", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["E-learning", "Pédagogie"] },
  { id: "form-02", title: "Conception Pédagogique Assistée par IA", titleEn: "AI-Assisted Instructional Design", metier: "Formation & Pédagogie", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Conception", "Ingénierie"] },
  { id: "form-03", title: "Évaluation Intelligente des Apprenants", titleEn: "Intelligent Learner Assessment", metier: "Formation & Pédagogie", level: "Intermédiaire", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Évaluation", "Quiz IA"] },
  { id: "form-04", title: "Création de Supports de Formation avec l'IA", titleEn: "AI-Powered Training Materials Creation", metier: "Formation & Pédagogie", level: "Débutant", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["Supports", "ChatGPT"] },
  { id: "form-05", title: "Gamification et IA dans la Formation", titleEn: "Gamification & AI in Training", metier: "Formation & Pédagogie", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Gamification", "Engagement"] },
  { id: "form-06", title: "Suivi et Analytics des Apprenants", titleEn: "Learner Tracking & Analytics", metier: "Formation & Pédagogie", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Analytics", "Suivi"] },
  { id: "form-07", title: "Vidéo Pédagogique Générée par IA", titleEn: "AI-Generated Training Videos", metier: "Formation & Pédagogie", level: "Débutant", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Vidéo", "Génération"] },
  { id: "form-08", title: "Tutorat Virtuel et Assistants IA", titleEn: "Virtual Tutoring & AI Assistants", metier: "Formation & Pédagogie", level: "Avancé", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["Tutorat", "Assistant IA"] },
  { id: "form-09", title: "Accessibilité et Inclusion avec l'IA", titleEn: "Accessibility & Inclusion with AI", metier: "Formation & Pédagogie", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Accessibilité", "Inclusion"] },
  { id: "form-10", title: "LMS et Plateformes de Formation IA", titleEn: "LMS & AI Training Platforms", metier: "Formation & Pédagogie", level: "Intermédiaire", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["LMS", "Plateforme"] },

  // ═══════════════════════════════════════════════
  // SANTÉ & BIEN-ÊTRE AU TRAVAIL (10)
  // ═══════════════════════════════════════════════
  { id: "sante-01", title: "Prévention des Risques Professionnels avec l'IA", titleEn: "AI-Powered Occupational Risk Prevention", metier: "Santé & Bien-être", level: "Débutant", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "350 000 FCFA", tags: ["Prévention", "Risques"] },
  { id: "sante-02", title: "Analyse Ergonomique des Postes avec l'IA", titleEn: "AI Ergonomic Workstation Analysis", metier: "Santé & Bien-être", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Ergonomie", "Analyse"] },
  { id: "sante-03", title: "Suivi du Bien-être au Travail par l'IA", titleEn: "AI Workplace Wellness Monitoring", metier: "Santé & Bien-être", level: "Débutant", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Bien-être", "Suivi"] },
  { id: "sante-04", title: "Programmes de Santé au Travail avec l'IA", titleEn: "AI Workplace Health Programs", metier: "Santé & Bien-être", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Santé", "Programme"] },
  { id: "sante-05", title: "Détection du Stress et Burn-out par l'IA", titleEn: "AI Stress & Burnout Detection", metier: "Santé & Bien-être", level: "Intermédiaire", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Stress", "Burn-out"] },
  { id: "sante-06", title: "QVT et IA : Qualité de Vie au Travail", titleEn: "Quality of Work Life & AI", metier: "Santé & Bien-être", level: "Débutant", format: "Hybride", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["QVT", "Qualité de vie"] },
  { id: "sante-07", title: "Gestion des Accidents du Travail avec l'IA", titleEn: "AI Workplace Accident Management", metier: "Santé & Bien-être", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "500 000 FCFA", tags: ["Accidents", "Gestion"] },
  { id: "sante-08", title: "Télémédecine et IA en Entreprise", titleEn: "Telemedicine & AI in the Workplace", metier: "Santé & Bien-être", level: "Avancé", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["Télémédecine", "Digital"] },
  { id: "sante-09", title: "Nutrition et Bien-être Assistés par l'IA", titleEn: "AI-Assisted Nutrition & Wellness", metier: "Santé & Bien-être", level: "Débutant", format: "En ligne", duration: "1 jour", durationEn: "1 day", price: "350 000 FCFA", tags: ["Nutrition", "Bien-être"] },
  { id: "sante-10", title: "Conformité HSE et IA", titleEn: "HSE Compliance & AI", metier: "Santé & Bien-être", level: "Avancé", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "750 000 FCFA", tags: ["HSE", "Conformité"] },

  // ═══════════════════════════════════════════════
  // DIPLOMATIE & AFFAIRES INTERNATIONALES (10)
  // ═══════════════════════════════════════════════
  { id: "diplo-01", title: "Diplomatie Digitale et Intelligence Artificielle", titleEn: "Digital Diplomacy & Artificial Intelligence", metier: "Diplomatie & Affaires Internationales", level: "Débutant", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "2 500 000 FCFA", tags: ["Diplomatie numérique", "Relations internationales"] },
  { id: "diplo-02", title: "Intelligence Artificielle et Analyse Géopolitique", titleEn: "AI & Geopolitical Analysis", metier: "Diplomatie & Affaires Internationales", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "3 000 000 FCFA", tags: ["Géopolitique", "Analyse stratégique"] },
  { id: "diplo-03", title: "Diplomatie des Données (Data Diplomacy)", titleEn: "Data Diplomacy", metier: "Diplomatie & Affaires Internationales", level: "Intermédiaire", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "3 000 000 FCFA", tags: ["Data Diplomacy", "Gouvernance des données"] },
  { id: "diplo-04", title: "Cybersécurité et Diplomatie Internationale", titleEn: "Cybersecurity & International Diplomacy", metier: "Diplomatie & Affaires Internationales", level: "Avancé", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "3 500 000 FCFA", tags: ["Cybersécurité", "Cyber diplomatie"] },
  { id: "diplo-05", title: "Diplomatie des Technologies Émergentes", titleEn: "Emerging Technology Diplomacy", metier: "Diplomatie & Affaires Internationales", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "3 000 000 FCFA", tags: ["Technologies émergentes", "Régulation IA"] },
  { id: "diplo-06", title: "Communication Diplomatique à l'ère de l'IA", titleEn: "Diplomatic Communication in the AI Era", metier: "Diplomatie & Affaires Internationales", level: "Débutant", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "2 500 000 FCFA", tags: ["Communication", "Rédaction diplomatique"] },
  { id: "diplo-07", title: "Négociation Internationale et IA", titleEn: "International Negotiation & AI", metier: "Diplomatie & Affaires Internationales", level: "Avancé", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "3 500 000 FCFA", tags: ["Négociation", "Simulation IA"] },
  { id: "diplo-08", title: "Diplomatie Économique et Intelligence Artificielle", titleEn: "Economic Diplomacy & AI", metier: "Diplomatie & Affaires Internationales", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "3 000 000 FCFA", tags: ["Commerce international", "Diplomatie économique"] },
  { id: "diplo-09", title: "Gouvernance Mondiale de l'Intelligence Artificielle", titleEn: "Global AI Governance", metier: "Diplomatie & Affaires Internationales", level: "Avancé", format: "Hybride", duration: "2 jours", durationEn: "2 days", price: "3 500 000 FCFA", tags: ["Gouvernance IA", "ONU & UNESCO"] },
  { id: "diplo-10", title: "Leadership Diplomatique à l'ère de l'IA", titleEn: "Diplomatic Leadership in the AI Era", metier: "Diplomatie & Affaires Internationales", level: "Avancé", format: "Présentiel", duration: "2 jours", durationEn: "2 days", price: "5 000 000 FCFA", tags: ["Leadership", "Transformation numérique"] },
];

export const formations = deepFixMojibake(rawFormations) as Formation[];
