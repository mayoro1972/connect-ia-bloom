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
17. [Checklist préparation Chatwoot](./17_Checklist_Chatwoot_Preparation.md)
18. [Mapping Chatwoot vers n8n](./18_Mapping_Chatwoot_Vers_n8n.md)
19. [Prompts opérationnels Chatwoot + n8n V1](./19_Prompts_Operationnels_Chatwoot_n8n_V1.md)
20. [Workflow n8n Chatwoot Auto Reply V1 JSON](./20_n8n_Chatwoot_Auto_Reply_V1.json)
21. [Workflow n8n Chatwoot Auto Reply V1 JSON Import Strict](./21_n8n_Chatwoot_Auto_Reply_V1_Import_Strict.json)
22. [Configuration Finale Chatwoot + n8n V2](./22_Configuration_Finale_Chatwoot_n8n_V2.md)
23. [Workflow n8n Chatwoot Auto Reply V3 OpenAI](./23_n8n_Chatwoot_Auto_Reply_V3_OpenAI.json)
24. [Configuration Finale Chatwoot + n8n V3](./24_Configuration_Finale_Chatwoot_n8n_V3.md)
25. [Configuration Cible Chatwoot + n8n V4 Memoire](./25_Configuration_Cible_Chatwoot_n8n_V4_Memoire.md)
26. [Guide Administrateur n8n V3 Export Word Friendly](./26_Export_Word_Guide_Administrateur_n8n_V3.html)
27. [Guide Administrateur n8n V4 Memoire Export Word Friendly](./27_Export_Word_Guide_Administrateur_n8n_V4_Memoire.html)
28. [Workflow n8n Chatwoot Auto Reply V4 Memoire](./28_n8n_Chatwoot_Auto_Reply_V4_Memoire.json)
29. [Workflow n8n Chatwoot Auto Reply V5 Qualification](./29_n8n_Chatwoot_Auto_Reply_V5_Qualification.json)
30. [Configuration Cible Chatwoot + n8n V5 Qualification](./30_Configuration_Cible_Chatwoot_n8n_V5_Qualification.md)
31. [Workflow n8n Chatwoot Auto Reply V5.5 Calendly Conditionnel](./31_n8n_Chatwoot_Auto_Reply_V5_5_Calendly_Conditionnel.json)
32. [Configuration Cible Chatwoot + n8n V5.5 Calendly Conditionnel](./32_Configuration_Cible_Chatwoot_n8n_V5_5_Calendly_Conditionnel.md)
33. [Guide Administrateur n8n V5 Qualification Export Word Friendly](./33_Export_Word_Guide_Administrateur_n8n_V5.html)
34. [Guide Administrateur n8n V5.5 Calendly Conditionnel Export Word Friendly](./34_Export_Word_Guide_Administrateur_n8n_V5_5_Calendly.html)

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

## Mise à jour importante au 2 mai 2026

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
- le widget **Chatwoot Website** désormais visible en local et prêt pour validation publique
- les `Labels`, `Custom Attributes`, `Canned Responses` et macros Chatwoot de qualification
- le webhook **Chatwoot -> n8n** validé en réception sur `chatwoot-inbound`
- la préparation opérationnelle de l’assistant IA TransferAI orchestré avec `n8n`

## Mise à jour importante au 5 mai 2026

Cette version du pack inclut désormais explicitement :

- la stabilisation de la **V2 Chatwoot + n8n** sur le path `chatwoot-inbound-v2`
- la validation de la **V3 OpenAI** avec réponse IA contextualisée
- le remplacement du noeud `If` instable par un noeud `Code`
- la séparation nette entre :
  - `V2` fallback statique
  - `V3` assistant IA OpenAI
  - `V4` cible mémoire conversationnelle
- la documentation de rollback V3 -> V2 en moins de 10 secondes
- la préparation du guide administrateur V3 partageable
- la feuille de route documentaire pour la future **V4 Memoire**
- le guide administrateur **V4 Memoire** exportable en HTML Word-friendly et `.docx`
- le workflow exportable **V4 Memoire** pret pour import dans n8n

## Mise à jour importante au 7 mai 2026

Cette version du pack inclut désormais explicitement :

- la preparation repo de la **V5 Qualification**
- le workflow exportable `29_n8n_Chatwoot_Auto_Reply_V5_Qualification.json`
- la documentation cible `30_Configuration_Cible_Chatwoot_n8n_V5_Qualification.md`
- la logique de qualification JSON OpenAI avec :
  - `custom_attributes` Chatwoot
  - labels automatiques
  - capture `lead_email` / `lead_phone`
- l'option B de collecte de contact :
  - formulaire pre-chat recommande
  - demande d'email dans le flux conversationnel si necessaire avant proposition de demo

## Mise à jour importante au 8 mai 2026

Cette version du pack inclut désormais explicitement :

- la validation fonctionnelle de la **V5 Qualification**
- la confirmation de l'Option B en production controlee :
  - `Pre Chat Form` actif
  - `lead_email` et `lead_phone` mappes vers Chatwoot
  - recuperation / demande d'email avant proposition de demo si necessaire
- la preparation repo de la **V5.5 Calendly conditionnel**
- le workflow exportable `31_n8n_Chatwoot_Auto_Reply_V5_5_Calendly_Conditionnel.json`
- la documentation cible `32_Configuration_Cible_Chatwoot_n8n_V5_5_Calendly_Conditionnel.md`
- les guides administrateur Word-friendly de la **V5 Qualification** et de la **V5.5 Calendly conditionnel**

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
- Chatwoot pour le chat web
- n8n pour l’orchestration assistant IA
- Resend pour les emails
- GitHub pour le dépôt source
- Cloudflare pour la diffusion du site public

## Export vers Word

Les exports Word sont produits dans :

- `docs/transferai-admin/word/`

Les fichiers HTML Word-friendly peuvent être ouverts directement dans Microsoft Word puis convertis en `.docx`.

## Livrables Word régénérés au 2 mai 2026

Les principaux livrables Word régénérés sont :

- `TransferAI_Africa_Admin_Master_Pack_2026-05-02.docx`
- `TransferAI_Africa_Executive_Brief_2026-05-02.docx`
- `TransferAI_Africa_Admin_Guide_No1_2026-05-02.docx`
- `TransferAI_Africa_Site_Knowledge_Base_2026-05-02.docx`
- `TransferAI_Africa_FAQ_Assistant_Support_2026-05-02.docx`
- `TransferAI_Africa_Deployment_Operations_Plan_2026-05-02.docx`
- `TransferAI_Africa_Project_Roadmap_2026-05-02.docx`
- `TransferAI_Africa_Admin_Index_2026-05-02.docx`

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
