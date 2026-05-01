# Pack Administration TransferAI Africa

Ce dossier regroupe la documentation de référence du site **TransferAI Africa**, de son back-office et de ses workflows de production.

Le pack a 4 objectifs :

- donner à l’administrateur principal une vue claire du système réel
- permettre à d’autres administrateurs de prendre le relais rapidement
- servir de base documentaire pour les automatisations et assistants IA
- conserver une mémoire opérationnelle fiable du projet

## Contenu du pack

1. [Guide Administrateur No1](./01_Guide_Administrateur_No1.md)
2. [Base de Connaissance du Site](./02_Base_Connaissance_Site.md)
3. [FAQ Site, Back-office et Support](./03_FAQ_Site_Assistant_IA.md)
4. [Plan de Déploiement et d'Exploitation](./04_Plan_Deploiement_Exploitation.md)
5. [Roadmap Historique du Projet](./05_Roadmap_Historique_Projet.md)
6. [Base de Connaissance Chatbot JSON](./06_knowledge_base_chatbot.json)
7. [Export Word Friendly HTML](./07_Export_Word_TransferAI_Admin_Pack.html)
8. [Note Direction / Partage Externe](./08_Note_Direction_Partage_Externe.md)
9. [Export Word Friendly Direction / Externe](./09_Export_Word_Direction_Externe.html)
10. [BackOffice Admin User Guide (EN)](./10_BackOffice_Admin_User_Guide_EN.md)
11. [Prompt Pack n8n + Chatwoot](./11_Prompt_Pack_n8n_Chatwoot.md)
12. [Workflow n8n nœud par nœud](./12_Workflow_n8n_Node_Par_Node.md)
13. [Plan de travail binôme V1 sur une journée](./13_Plan_Travail_Binome_V1_Journee.md)
14. [Tableau de suivi de journée binôme](./14_Tableau_Suivi_Journee_Binome_Checklist.md)
15. [Blueprint n8n import-like JSON V1](./15_n8n_Import_Like_JSON_V1.md)
16. [Checklist de construction n8n](./16_Checklist_Construction_n8n.md)

## Ordre de lecture recommandé

Pour l’administrateur principal :

- commencer par le guide administrateur
- lire ensuite le plan d’exploitation et la roadmap
- garder la FAQ à portée de main

Pour les administrateurs relais :

- commencer par le guide administrateur
- relire ensuite la base de connaissance du site
- utiliser la FAQ pour les cas récurrents

Pour les futurs assistants IA :

- charger d’abord la base de connaissance du site
- compléter avec la FAQ
- utiliser ensuite le JSON structuré

## Périmètre actuel du site

Le système couvre aujourd’hui :

- vitrine institutionnelle et commerciale
- hub éducation
- catalogue de formation
- parcours guidés
- certification sectorielle
- page entreprises / services
- blog / ressources dynamiques
- matrice des outils IA
- formulaires de contact et d’audit
- pipeline partenaires
- newsletter par domaine
- capsules vidéo sociales
- intake WhatsApp connecté à Twilio
- back-office public d’administration

## Mise à jour importante au 1er mai 2026

Cette version du pack inclut désormais explicitement :

- la simplification éditoriale des pages denses du site
- la mise en avant de l’audit IA gratuit
- le pipeline partenaires avec back-office et emails de suivi
- la règle `Bonjour` / `Bonsoir` dans les emails
- la clarification du rôle réel de la page `Contact`
- la montée en charge du flux catalogue par domaine
- la logique `Parler emploi & mise en relation`
- la carte TikTok / capsules vidéo pilotée par backend
- le module **BackOffice WhatsApp V1**
- le webhook **Twilio WhatsApp** en production
- les notifications email internes sur nouveau message WhatsApp
- la table de logs `whatsapp_email_notification_logs`
- la validation bout-en-bout WhatsApp -> Twilio -> Supabase -> BackOffice -> Resend -> boîtes mail
- le guide administrateur BackOffice en anglais

## Architecture résumée

Front :

- React
- TypeScript
- Vite
- React Router

Backend :

- Supabase base de données
- Supabase Edge Functions
- Supabase cron / scheduler

Canaux opérationnels :

- Twilio pour WhatsApp
- Resend pour les emails
- GitHub pour le dépôt source
- Cloudflare pour la diffusion du site public

## Export vers Word

Les exports Word sont produits dans :

- `docs/transferai-admin/word/`

Les fichiers HTML Word-friendly peuvent être ouverts directement dans Microsoft Word puis convertis en `.docx`.

## Livrables Word régénérés au 1er mai 2026

Les principaux livrables Word régénérés sont :

- `TransferAI_Africa_Admin_Master_Pack_2026-05-01.docx`
- `TransferAI_Africa_Executive_Brief_2026-05-01.docx`
- `TransferAI_Africa_Admin_Guide_No1_2026-05-01.docx`
- `TransferAI_Africa_Site_Knowledge_Base_2026-05-01.docx`
- `TransferAI_Africa_FAQ_Assistant_Support_2026-05-01.docx`
- `TransferAI_Africa_Deployment_Operations_Plan_2026-05-01.docx`
- `TransferAI_Africa_Project_Roadmap_2026-05-01.docx`

## Nomenclature des livrables Word

La nomenclature suivie dans `word/` reste :

- `TransferAI_Africa_Admin_Index_<date>`
- `TransferAI_Africa_Admin_Guide_No1_<date>`
- `TransferAI_Africa_Site_Knowledge_Base_<date>`
- `TransferAI_Africa_FAQ_Assistant_Support_<date>`
- `TransferAI_Africa_Deployment_Operations_Plan_<date>`
- `TransferAI_Africa_Project_Roadmap_<date>`
- `TransferAI_Africa_Admin_Master_Pack_<date>`
- `TransferAI_Africa_Executive_Brief_<date>`

## Règle de gouvernance

Le pack documentaire doit toujours rester aligné avec :

- l’état réel du site public
- l’état réel du back-office
- les tables réellement en production
- les edge functions réellement déployées
- les workflows réellement testés

Si un flux change, la documentation doit suivre.
