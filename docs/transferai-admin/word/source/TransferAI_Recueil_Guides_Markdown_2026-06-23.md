# Recueil des guides Markdown TransferAI

Date d'export : 2026-06-23

Ce document regroupe tous les guides disponibles en format Markdown dans `docs/transferai-admin` au moment de l'export.

## Index des guides inclus

- `docs/transferai-admin/01_Guide_Administrateur_No1.md`
- `docs/transferai-admin/100_Guide_Utilisateur_Workflow_Google_Forms_Prospects_Chronologie_2026-06-23.md`
- `docs/transferai-admin/101_Guide_Troubleshooting_Workflow_Google_Forms_Prospects_Chronologie_2026-06-23.md`
- `docs/transferai-admin/10_BackOffice_Admin_User_Guide_EN.md`
- `docs/transferai-admin/31_Guide_Operatoire_Veille_Reglementaire_IA_Banque_CI.md`
- `docs/transferai-admin/46_Guide_Reconstruction_n8n_V1.md`
- `docs/transferai-admin/49_Guide_V4_Batch_Quotas_Stop_Rules.md`
- `docs/transferai-admin/56_Guide_Copier_Coller_Blocs_Code_n8n_V1.md`
- `docs/transferai-admin/58_Guide_Step_By_Step_V2_Supabase_Approval_Email.md`
- `docs/transferai-admin/61_Guide_V5_CRM_Growth_Loop.md`
- `docs/transferai-admin/68_Guide_Utilisateur_Prospection_V3_CRM_Audit_Dynamique.md`
- `docs/transferai-admin/69_Guide_Troubleshooting_Prospection_V3_CRM_Audit_Dynamique.md`
- `docs/transferai-admin/71_Guide_Utilisateur_Workflow_Post_Audit_CRM_Aware.md`
- `docs/transferai-admin/75_Guide_Import_V6_Google_Sheets_Dashboard.md`
- `docs/transferai-admin/76_Guide_Utilisateur_V4_Batch_Node_Par_Node_2026-06-08.md`
- `docs/transferai-admin/77_Guide_Troubleshooting_V4_V3_Audit_Links_2026-06-08.md`
- `docs/transferai-admin/83_Guide_Administrateur_Connexion_Pack_Prospect_Interfaces_Email_CRM_2026-06-11.md`
- `docs/transferai-admin/92_Guide_Activation_Google_Forms_Social_Lead_Sequence_V1.md`
- `docs/transferai-admin/95_Guide_Activation_WhatsApp_Auto_Reply_And_Followup.md`
- `docs/transferai-admin/96_Guide_Utilisateur_WhatsApp_Live_Chatwoot_IA_2026-06-18.md`
- `docs/transferai-admin/98_Guide_Utilisateur_Workflow_Google_Forms_Prospects_Ameliore_2026-06-20.md`
- `docs/transferai-admin/99_Guide_Troubleshooting_Workflow_Google_Forms_Prospects_Ameliore_2026-06-20.md`
- `docs/transferai-admin/TransferAI_V3_V4_User_Troubleshooting_Guide.md`
- `docs/transferai-admin/word/source/63_Guide_Installation_V3_Noeud_par_Noeud_2026-06-02.md`
- `docs/transferai-admin/word/source/94_Guide_Utilisateur_Troubleshooting_Google_Forms_Social_Lead_Sequence_2026-06-15.md`

---

## 01_Guide_Administrateur_No1

Source : `docs/transferai-admin/01_Guide_Administrateur_No1.md`

# Guide Administrateur No1

## 1. Objet du guide

Ce guide décrit le fonctionnement réel du **BackOffice TransferAI Africa** au 2 mai 2026.

Il répond à 4 questions :

1. comment accéder au back-office et au backend
2. à quoi sert chaque rubrique
3. quels rôles opérationnels doivent être couverts
4. comment exploiter la plateforme sans casser les flux déjà en production

---

## 2. Mission de l’administrateur No1

L’administrateur No1 ne se limite pas à publier.

Il garantit que la plateforme reste :

- cohérente éditorialement
- crédible commercialement
- exploitable opérationnellement
- fiable techniquement
- traçable côté back-office

Responsabilités principales :

1. gouvernance du contenu et des CTA
2. supervision du BackOffice
3. suivi des leads, messages entrants et demandes
4. contrôle léger des déploiements et accès
5. coordination avec les administrateurs métiers
6. documentation et transmission des procédures

---

## 3. Accès au BackOffice et au backend

### 3.1. BackOffice public

URL de production :

- [https://www.transferai.ci/back-office](https://www.transferai.ci/back-office)

Exemples de liens directs :

- [https://www.transferai.ci/back-office?tab=whatsapp](https://www.transferai.ci/back-office?tab=whatsapp)
- [https://www.transferai.ci/back-office?tab=newsletters](https://www.transferai.ci/back-office?tab=newsletters)
- [https://www.transferai.ci/back-office?tab=partners](https://www.transferai.ci/back-office?tab=partners)

### 3.2. BackOffice local

Usage :

- développement
- tests UI
- validation avant commit

Format :

- `http://127.0.0.1:<port>/back-office`

### 3.3. Token administrateur

Le back-office public repose sur le secret backend :

- `CONTENT_ADMIN_TOKEN`

Ce token est vérifié par :

- [`/Users/marius_ayoro/.codex/worktrees/4df6/connect-ia-bloom/supabase/functions/content-admin/index.ts`](/Users/marius_ayoro/.codex/worktrees/4df6/connect-ia-bloom/supabase/functions/content-admin/index.ts)

Règles :

- ne jamais diffuser le token en clair dans un canal non sécurisé
- le remplacer en cas de doute
- retester immédiatement le back-office après rotation

### 3.4. Accès Supabase

Supabase sert de backend principal.

Zones critiques à connaître :

- `Table Editor`
- `Edge Functions`
- `Secrets`
- `SQL Editor`

### 3.5. Accès Twilio

Twilio sert à :

- recevoir les messages WhatsApp
- journaliser les messages entrants
- appeler le webhook Supabase

Sender validé :

- `+2250716573990`

### 3.6. Accès Resend

Resend sert à :

- envoyer les emails transactionnels
- envoyer la newsletter
- envoyer les notifications internes sur messages WhatsApp

### 3.7. Accès Cloudflare / GitHub

GitHub :

- dépôt source
- source des commits et des branches

Cloudflare :

- diffusion du front public `transferai.ci`

Point clé :

- un commit GitHub ne suffit pas à lui seul si `main` n’est pas la version réellement servie

### 3.8. Accès Chatwoot et n8n

Le chantier assistant IA s’appuie désormais sur :

- Chatwoot pour le chat web
- n8n pour l’orchestration des événements, de la qualification et des réponses

Éléments déjà en place :

- inbox website `TransferAI`
- labels de qualification
- custom attributes de conversation
- canned responses et premières macros d’exploitation
- webhook Chatwoot vers `chatwoot-inbound` validé en réception dans n8n

---

## 4. Rôles opérationnels

Le système n’a pas encore de séparation fine des rôles par utilisateur dans le BackOffice.  
Les rôles sont donc **opérationnels**.

### 4.1. Administrateur No1

Responsable de :

- accès au back-office
- supervision globale
- validation finale avant mise en production
- suivi des incidents

### 4.2. Responsable contenus

Responsable de :

- `Ressources`
- `Brouillons IA`
- `Capsules vidéo`

### 4.3. Responsable newsletter

Responsable de :

- `Newsletter IA`
- relecture
- test
- approbation
- suivi des rappels du jeudi

### 4.4. Responsable prospects / audit

Responsable de :

- `Prospects Audit`
- qualification des demandes
- suivi du portail prospect

### 4.5. Responsable partenaires

Responsable de :

- `Partenaires IA`
- revue des demandes
- recommandation de formule
- suivi des réponses

### 4.6. Responsable WhatsApp

Responsable de :

- `WhatsApp`
- lecture des messages entrants
- classement
- notes internes
- réponse manuelle via WhatsApp

### 4.7. Responsable webinaires / live

Responsable de :

- `Webinaires`
- `Formats live IA`

### 4.8. Responsable opportunités

Responsable de :

- `Emplois IA`
- publication et statut des opportunités

---

## 5. Rubriques du BackOffice

Onglets actuellement visibles :

- `Analytics`
- `Prospects Audit`
- `Ressources`
- `Brouillons IA`
- `Partenaires IA`
- `Newsletter IA`
- `Capsules vidéo`
- `WhatsApp`
- `Emplois IA`
- `Webinaires`
- `Formats live IA`
- `Mode d'emploi`

### 5.1. Analytics

Suivre :

- trafic
- pages vues
- tendances
- formulaires et inscriptions

### 5.2. Prospects Audit

Suivre :

- demandes audit IA
- qualification
- suivi prospect

### 5.3. Ressources

Gérer :

- articles
- résumés
- statuts
- domaines

### 5.4. Brouillons IA

Gérer :

- sources suivies
- signaux
- brouillons proposés
- publication ou archivage

### 5.5. Partenaires IA

Gérer :

- demandes de référencement
- partenariats stratégiques
- revue
- recommandation IA
- suivi de réponse

### 5.6. Newsletter IA

Gérer :

- éditions
- objet
- préheader
- éditorial
- prompt
- CTA
- tests
- statuts

### 5.7. Capsules vidéo

Gérer :

- flux vidéo court
- capsule mise en avant
- fallback éditorial

### 5.8. WhatsApp

Le module WhatsApp V1 permet :

- liste + filtres
- fiche détail
- changement de statut
- changement de catégorie
- note interne
- ouverture directe de la réponse WhatsApp

### 5.9. Emplois IA

Gérer :

- opportunités
- statuts
- visibilité

### 5.10. Webinaires

Gérer :

- webinaires
- statuts et mises à jour

### 5.11. Formats live IA

Gérer :

- formats live
- structuration de l’offre live

### 5.12. Mode d’emploi

Rôle :

- rappeler à l’équipe comment utiliser correctement le système

---

## 6. Tables importantes

- `contact_requests`
- `registration_requests`
- `form_responses`
- `page_views`
- `resource_posts`
- `job_opportunities`
- `source_feeds`
- `source_signals`
- `editorial_jobs`
- `newsletter_subscriptions`
- `newsletter_issues`
- `newsletter_delivery_logs`
- `partner_offer_catalog`
- `partner_email_templates`
- `partner_listing_reviews`
- `partner_followup_jobs`
- `social_video_posts`
- `whatsapp_inbound_messages`
- `whatsapp_email_notification_logs`
- `webinar_registrations`

---

## 7. Edge functions importantes

- `content-admin`
- `content-discovery`
- `content-classifier`
- `content-drafter`
- `newsletter-subscribe`
- `newsletter-drafter`
- `newsletter-send`
- `newsletter-scheduler`
- `send-prospect-emails`
- `partner-review-drafter`
- `partner-followup-send`
- `twilio-whatsapp-webhook`

---

## 8. Workflows clés

### 8.1. WhatsApp

Chaîne complète :

1. visiteur clique le bouton WhatsApp du site
2. message envoyé vers `+2250716573990`
3. Twilio reçoit
4. Twilio appelle le webhook Supabase
5. le message est enregistré dans `whatsapp_inbound_messages`
6. les notifications internes sont envoyées
7. le message devient visible dans `BackOffice > WhatsApp`

### 8.2. Newsletter

Modèle réel :

- IA prépare
- humain valide
- système envoie

Cadence :

- mercredi : génération
- jeudi : rappel si nécessaire
- vendredi : envoi si édition approuvée

### 8.3. Partenaires

Flux :

1. demande publique
2. revue
3. recommandation
4. réponse

### 8.4. Capsules vidéo

Flux :

1. enregistrement ou mise à jour d’une capsule
2. lecture par le front
3. affichage d’une vidéo ou d’une carte fallback brandée

---

## 9. Routine d’exploitation

### Quotidienne

- vérifier les demandes contact / audit
- vérifier les messages WhatsApp
- vérifier que le back-office charge correctement
- vérifier qu’aucune page commerciale critique ne casse

### Hebdomadaire

- relire les brouillons IA
- vérifier l’édition newsletter
- envoyer un test
- vérifier les demandes partenaires
- vérifier la capsule vidéo mise en avant

### Mensuelle

- revoir les pages les plus vues
- revoir les CTA critiques
- revoir les accès et secrets
- mettre à jour la documentation

---

## 10. Incidents fréquents

### Si le BackOffice ne charge pas

Vérifier :

- token admin
- variables Supabase du front
- fonction `content-admin`

### Si WhatsApp ne remonte pas

Vérifier :

- logs Twilio
- invocations `twilio-whatsapp-webhook`
- table `whatsapp_inbound_messages`

### Si l’email WhatsApp n’est pas visible

Vérifier :

- `whatsapp_email_notification_logs`
- logs Resend
- Inbox / Spam / Promotions

### Si une page front semble ancienne

Vérifier :

- que le correctif est sur `main`
- que la prod sert bien la bonne version
- qu’un hard refresh a été fait

---

## 11. Règle finale

Le BackOffice doit être exploité comme un **poste de pilotage opérationnel**, pas comme un simple écran de publication.

Les règles les plus sûres restent :

- validation humaine sur les contenus sensibles
- responsabilité claire par rubrique
- contrôle post-déploiement réel
- journalisation des workflows critiques

---

## 100_Guide_Utilisateur_Workflow_Google_Forms_Prospects_Chronologie_2026-06-23

Source : `docs/transferai-admin/100_Guide_Utilisateur_Workflow_Google_Forms_Prospects_Chronologie_2026-06-23.md`

# Guide utilisateur - Workflow Google Forms prospects TransferAI

Workflow de référence :

- `TransferAI Google Forms Social Lead Sequence V2 Clean Importable`
- Fichier : [93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json)

Date de mise à jour :

- `23 juin 2026`

## 1. Objet du guide

Ce guide présente, dans l’ordre chronologique, tout ce qui a été mis en place entre le jeudi `19/06/2026` et le lundi `23/06/2026` pour rendre opérationnel le traitement automatique des prospects issus de Google Forms chez TransferAI.

Il sert à :

- comprendre ce qui a été construit ;
- savoir quelle est l’architecture finale en production ;
- utiliser correctement le workflow au quotidien ;
- distinguer les emails prospect des emails d’alerte interne ;
- vérifier rapidement si le système fonctionne normalement.

## 2. Résultat final obtenu au 23/06/2026

À la date du `23/06/2026`, le système permet de :

1. recevoir une réponse Google Forms dans Google Sheets ;
2. pousser automatiquement cette réponse vers n8n via Apps Script ;
3. normaliser les données du prospect ;
4. créer ou mettre à jour le prospect dans Supabase ;
5. envoyer automatiquement le premier email commercial au prospect ;
6. envoyer une alerte interne à `contact@transferai.ci` ;
7. enregistrer en base les dates d’envoi afin d’éviter les doublons ;
8. préparer les futures relances email 2 puis email 3 ;
9. bloquer un renvoi prospect ou admin quand il a déjà été effectué.

## 3. Chronologie des travaux réalisés

## 3.1 Jeudi 19/06/2026 - Mise en place du flux Google Forms vers n8n

Les éléments suivants ont été mis en place :

- liaison du Google Form avec une feuille Google Sheets de réponses ;
- création d’un projet Apps Script connecté à la feuille ;
- ajout d’un script pour transmettre les nouvelles réponses à n8n ;
- configuration du webhook n8n côté test puis côté production ;
- premiers tests de réception du payload dans le nœud `Google Forms Social Lead Webhook`.

Décision importante :

- la vraie source d’entrée retenue en production est la feuille Google Sheets, pas un déclencheur direct depuis le formulaire.

## 3.2 Jeudi 19/06/2026 - Stabilisation du script Apps Script

Le script Apps Script a été corrigé pour :

- utiliser le bon événement de type `On form submit` ;
- éviter l’erreur `Événement de formulaire introuvable` ;
- ne plus être lancé manuellement avec `Run` ;
- envoyer les réponses vers l’URL de production n8n ;
- conserver proprement les réponses contenant des virgules.

La version de travail retenue repose sur :

- un projet principal Apps Script lié à la feuille de réponses ;
- une fonction `onFormSubmitToN8n(e)` ;
- un déclencheur `From spreadsheet - On form submit`.

## 3.3 Jeudi 19/06/2026 - Premier fonctionnement du workflow V2

Le workflow `TransferAI Google Forms Social Lead Sequence V2 Clean Importable` a été validé sur les points suivants :

- réception du webhook ;
- normalisation du lead ;
- création ou mise à jour du prospect dans le CRM ;
- génération du premier email ;
- envoi effectif du premier email au prospect.

## 3.4 Vendredi 20/06/2026 - Création des premiers guides d’exploitation

Une première documentation a été produite pour :

- expliquer l’activation du workflow ;
- documenter les premiers points de contrôle ;
- permettre la reprise rapide du système sans relire tout le workflow.

## 3.5 Samedi 21/06/2026 - Correction du double envoi prospect

Une anomalie a été identifiée :

- un prospect pouvait recevoir le même email deux fois.

La cause principale a été trouvée :

- un ancien projet Apps Script lié directement au Google Form existait encore ;
- un ancien déclencheur `From form - On form submit` déclenchait un second envoi ;
- un ancien code `onFormSubmit(e)` continuait à pousser vers n8n en parallèle.

Les corrections appliquées :

- suppression du déclencheur historique côté projet `TransferAI Google Forms Bridge - Form 2` ;
- neutralisation des anciennes fonctions `onFormSubmit(e)` et `setupTrigger()` ;
- conservation d’un seul point d’entrée actif :
  - projet `TransferAI Google Forms to n8n`
  - fonction `onFormSubmitToN8n`
  - déclencheur `From spreadsheet - On form submit`

Résultat :

- le double envoi prospect lié au double webhook a été supprimé.

## 3.6 Samedi 21/06/2026 - Amélioration commerciale du mail 1

Le contenu du premier email prospect a été revu pour :

- être plus commercial ;
- rester simple et professionnel ;
- intégrer le bon lien de rendez-vous :
  - `https://calendly.com/contact-transferai/30min`

Deux variantes ont été consolidées :

- `assistant_training_interest` ;
- `enterprise_ai_interest`.

## 3.7 Dimanche 22/06/2026 - Mise en place de l’alerte admin

La branche d’alerte interne a été finalisée.

Nœuds concernés :

1. `Build Admin Lead Alert Context`
2. `If Admin Alert Eligible`
3. `Build Admin Lead Alert Email`
4. `Send Admin Lead Alert`

Décision de routage :

- l’alerte interne doit partir vers `contact@transferai.ci` ;
- le mail prospect doit continuer à partir vers l’email du prospect (`target_email`).

Règle simple retenue :

- sujet commençant par `Merci pour votre intérêt...` = email prospect ;
- sujet commençant par `[Nouveau prospect ...]` = alerte admin.

## 3.8 Dimanche 22/06/2026 - Protection anti-doublon admin

Une nouvelle sécurité a été ajoutée pour empêcher plusieurs alertes internes sur le même prospect.

Éléments créés :

- colonne Supabase `admin_alert_sent_at` ;
- nœud `Build Admin Alert Guard` ;
- nœud `If Admin Alert Allowed` ;
- nœud `Build Admin Alert Send Result` ;
- mise à jour du nœud `Update Prospect After Admin Alert`.

Résultat :

- une fois l’alerte admin envoyée ;
- la date est enregistrée dans Supabase ;
- le workflow bloque ensuite toute nouvelle alerte pour le même prospect.

## 3.9 Dimanche 22/06/2026 - Protection anti-doublon prospect

La même logique a ensuite été appliquée aux emails prospect.

Colonnes Supabase ajoutées :

- `social_email_1_sent_at`
- `social_email_2_sent_at`
- `social_email_3_sent_at`

Nouveaux nœuds ou corrections associées :

- `Build Social Sent Guard`
- `If Social Send Allowed`
- `Build Social Send Result`
- `Update Prospect After Social Send`

Objectif :

- empêcher qu’un même prospect reçoive deux fois le même email d’étape ;
- enregistrer la date exacte d’envoi de chaque étape.

## 3.10 Dimanche 22/06/2026 - Résolution des erreurs techniques n8n

Plusieurs erreurs ont été corrigées pendant les tests :

- erreur `.first()` dans un nœud `Code` en mode `Run Once for Each Item` ;
- erreur `JSON parameter needs to be valid JSON` dans des nœuds `PATCH` Supabase ;
- incohérence entre la branche prospect et la branche admin ;
- perte de contexte entre `Parse Social Send Result` et `Build Social Send Result`.

Résultat :

- les nœuds d’écriture Supabase sont maintenant stables ;
- les mises à jour CRM se font correctement après envoi ;
- les dates d’envoi sont exploitables pour les protections anti-doublon.

## 3.11 Lundi 23/06/2026 - Validation visuelle des deux flux email

Les vérifications finales ont confirmé :

- réception du mail prospect dans la boîte du prospect de test ;
- réception de l’alerte admin dans la boîte `contact@transferai.ci` ;
- blocage d’une alerte admin déjà envoyée ;
- compréhension claire de la séparation des deux circuits email.

## 4. Architecture finale en production

## 4.1 Entrée Google Forms

Le flux d’entrée actuellement retenu est :

1. Google Form rempli ;
2. réponse enregistrée dans Google Sheets ;
3. Apps Script côté feuille déclenché ;
4. envoi vers le webhook n8n de production.

Projet Apps Script actif :

- `TransferAI Google Forms to n8n`

Fonction active :

- `onFormSubmitToN8n`

Déclencheur actif :

- `From spreadsheet - On form submit`

## 4.2 Branche prospect

Ordre fonctionnel principal :

1. `Google Forms Social Lead Webhook`
2. `Set Social Sequence Config`
3. `If New Lead Payload`
4. `Normalize Google Forms Lead`
5. `Prepare Social Prospect Record`
6. `Upsert Social Prospect Into CRM`
7. `Build Immediate Social Send Context`
8. `If Social Lead Ready To Send`
9. `Build Social Sequence Email`
10. `Build Social Sent Guard`
11. `If Social Send Allowed`
12. `Send Social Sequence Email`
13. `Parse Social Send Result`
14. `Build Social Send Result`
15. `If Social Email Sent`
16. `Log Social Outreach Attempt`
17. `Update Prospect After Social Send`

## 4.3 Branche admin

Ordre fonctionnel principal :

1. `Build Admin Lead Alert Context`
2. `If Admin Alert Eligible`
3. `Build Admin Lead Alert Email`
4. `Build Admin Alert Guard`
5. `If Admin Alert Allowed`
6. `Send Admin Lead Alert`
7. `Build Admin Alert Send Result`
8. `Update Prospect After Admin Alert`

## 5. Configuration métier de référence

Valeurs métier actuellement utilisées :

- lien de rendez-vous : `https://calendly.com/contact-transferai/30min`
- délai avant relance 2 : `4 jours`
- délai avant relance 3 : `7 jours`
- pays par défaut : `Côte d’Ivoire`

## 6. Différence entre email prospect et alerte admin

## 6.1 Email prospect

Nœud :

- `Send Social Sequence Email`

Destinataire :

- `{{$json.target_email}}`

Sujet attendu :

- `Merci pour votre intérêt pour la formation IA dédiée au secrétariat`
- ou `Merci pour votre intérêt pour nos solutions et services IA`

## 6.2 Alerte admin

Nœud :

- `Send Admin Lead Alert`

Destinataire :

- `contact@transferai.ci`

Sujet attendu :

- `[Nouveau prospect HAUTE] Nom - Organisation`
- ou variante équivalente selon la température commerciale

## 7. Vérification standard après chaque test

Après un test, vérifier toujours dans cet ordre :

1. la ligne apparaît bien dans Google Sheets ;
2. une exécution apparaît dans n8n ;
3. le workflow termine en `Success` ;
4. le prospect est créé ou mis à jour dans Supabase ;
5. le mail prospect arrive dans la bonne boîte ;
6. l’alerte admin arrive dans `contact@transferai.ci` ;
7. `admin_alert_sent_at` est rempli ;
8. `social_email_1_sent_at` est rempli.

## 8. Procédure d’exploitation quotidienne

## 8.1 Pour tester un nouveau formulaire

1. remplir le formulaire ;
2. attendre la création de la ligne dans Google Sheets ;
3. ouvrir `Executions` dans n8n ;
4. contrôler la dernière exécution ;
5. ouvrir Gmail ou la boîte du prospect de test ;
6. ouvrir Zoho `contact@transferai.ci`.

## 8.2 Pour vérifier qu’un prospect a déjà été traité

Dans Supabase, contrôler :

- `prospect_id`
- `status`
- `paused`
- `last_sequence_result`
- `admin_alert_sent_at`
- `social_email_1_sent_at`
- `social_email_2_sent_at`
- `social_email_3_sent_at`

## 9. État fonctionnel au 23/06/2026

Le système est désormais utilisable en exploitation pour :

- les formulaires de formation secrétariat ;
- les formulaires de services et solutions IA ;
- la création CRM ;
- l’envoi du mail 1 ;
- l’alerte admin ;
- la prévention des doublons admin ;
- la prévention des doublons prospect sur la première étape, avec base technique prête pour les étapes suivantes.

## 10. Étape suivante recommandée

La prochaine évolution fonctionnelle logique est :

1. finaliser complètement le contrôle anti-doublon pour chaque relance ;
2. ajouter proprement l’email 2 ;
3. ajouter ensuite l’email 3 ;
4. mettre en place un tableau de suivi simple des prospects et des rendez-vous.

---

## 101_Guide_Troubleshooting_Workflow_Google_Forms_Prospects_Chronologie_2026-06-23

Source : `docs/transferai-admin/101_Guide_Troubleshooting_Workflow_Google_Forms_Prospects_Chronologie_2026-06-23.md`

# Guide de dépannage - Workflow Google Forms prospects TransferAI

Workflow de référence :

- `TransferAI Google Forms Social Lead Sequence V2 Clean Importable`
- Fichier : [93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json)

Date de mise à jour :

- `23 juin 2026`

## 1. Objet du guide

Ce guide recense, dans l’ordre où ils ont été rencontrés puis résolus entre le `19/06/2026` et le `23/06/2026`, les principaux incidents techniques et fonctionnels liés au workflow Google Forms prospects de TransferAI.

Il sert à :

- diagnostiquer un problème plus vite ;
- retrouver la cause déjà rencontrée ;
- appliquer le correctif validé ;
- contrôler que le workflow est revenu à un état sain.

## 2. Méthode de diagnostic recommandée

Toujours vérifier dans cet ordre :

1. la réponse est-elle bien entrée dans Google Sheets ;
2. le projet Apps Script actif est-il le bon ;
3. le déclencheur Apps Script est-il bien `From spreadsheet - On form submit` ;
4. le workflow n8n est-il `Published` ;
5. une exécution apparaît-elle dans `Executions` ;
6. quel est le premier nœud en erreur ou le premier nœud qui ne transmet plus rien ;
7. le problème touche-t-il la branche prospect, la branche admin ou l’écriture Supabase.

## 3. Historique des problèmes rencontrés et correctifs validés

## 3.1 19/06/2026 - Aucune exécution visible dans n8n après soumission

### Symptôme

- le formulaire est soumis ;
- la ligne arrive bien dans Google Sheets ;
- aucune exécution n’apparaît dans n8n.

### Causes identifiées

- Apps Script pointait encore vers `webhook-test` ;
- le workflow n8n n’était pas `Published` ;
- le déclencheur Apps Script n’était pas correctement installé ;
- la fonction était testée avec `Run` au lieu d’une vraie soumission.

### Correctif retenu

Vérifier que le script utilise bien :

```javascript
WEBHOOK_URL: 'https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/google-forms-social-leads'
```

Puis vérifier :

- `Published` dans n8n ;
- déclencheur `From spreadsheet - On form submit` ;
- vraie soumission Google Form.

## 3.2 19/06/2026 - Erreur `Événement de formulaire introuvable`

### Symptôme

Dans Apps Script :

- `Événement de formulaire introuvable. Utilise un déclencheur "On form submit".`

### Cause identifiée

La fonction `onFormSubmitToN8n(e)` était lancée manuellement avec `Run`.

### Correctif retenu

- ne jamais lancer cette fonction avec le bouton `Run` ;
- passer uniquement par une soumission réelle du formulaire.

## 3.3 19/06/2026 - Réponses texte coupées à cause des virgules

### Symptôme

Une réponse comme :

- `Oui, assez bien`

remontait parfois sous forme de liste.

### Cause identifiée

Une ancienne logique de normalisation Apps Script essayait de découper les valeurs contenant une virgule.

### Correctif retenu

Conserver une version simple de `normalizeValue(rawValue)` qui :

- garde les chaînes simples telles quelles ;
- ne découpe pas les réponses uniques contenant des virgules.

## 3.4 21/06/2026 - Le prospect reçoit le même email deux fois

### Symptôme

- un même prospect reçoit deux fois le premier email ;
- deux exécutions ou deux sources semblent agir en parallèle.

### Causes identifiées

Présence d’un ancien projet Apps Script :

- `TransferAI Google Forms Bridge - Form 2`

avec :

- un ancien déclencheur `From form - On form submit` ;
- une ancienne fonction `onFormSubmit(e)` ;
- un ancien `setupTrigger()`.

### Correctif retenu

- suppression du déclencheur historique ;
- neutralisation des anciennes fonctions ;
- conservation d’une seule source active :
  - projet `TransferAI Google Forms to n8n`
  - fonction `onFormSubmitToN8n`
  - déclencheur `From spreadsheet - On form submit`

### Vérification

Après correction :

- une seule ligne Google Sheets ;
- une seule exécution n8n ;
- un seul email prospect.

## 3.5 21/06/2026 - Mauvais lien de rendez-vous dans le mail

### Symptôme

Le lien inséré dans l’email n’était pas le bon.

### Correctif retenu

Le lien officiel retenu a été :

- `https://calendly.com/contact-transferai/30min`

### Point de contrôle

Vérifier ce lien dans :

- `Set Social Sequence Config`
- `Build Social Sequence Email`
- `Build Admin Lead Alert Context`

## 3.6 22/06/2026 - Le mail admin part au mauvais destinataire

### Symptôme

Confusion entre :

- l’email prospect reçu sur l’adresse de test ;
- et l’alerte admin attendue dans Zoho.

### Cause identifiée

Le mail prospect et le mail admin ont deux logiques différentes :

- prospect : `to = $json.target_email`
- admin : `to = contact@transferai.ci`

### Correctif retenu

Dans `Send Admin Lead Alert`, utiliser :

```javascript
={{
{
  from: 'TransferAI <contact@transferai.ci>',
  to: 'contact@transferai.ci',
  subject: $json.admin_email_subject,
  html: $json.admin_email_html
}
}}
```

### Vérification

- sujet `Merci pour votre intérêt...` = prospect ;
- sujet `[Nouveau prospect ...]` = admin.

## 3.7 22/06/2026 - Erreur `.first()` dans un nœud `Code`

### Symptôme

Dans `Build Admin Alert Send Result` :

- `Can't use .first() here`

### Cause identifiée

Le nœud était en mode :

- `Run Once for Each Item`

et la méthode `.first()` n’y était pas supportée.

### Correctif retenu

Remplacer les accès de type `.first()` par une récupération compatible avec le mode courant, par exemple via :

```javascript
$items('Nom du nœud')[0]?.json
```

## 3.8 22/06/2026 - Erreur `JSON parameter needs to be valid JSON`

### Symptôme

Dans un nœud HTTP `PATCH` :

- `JSON parameter needs to be valid JSON`

### Cause identifiée

Le body JSON était mal formé dans le champ `Using JSON`.

### Correctif retenu

Utiliser une expression unique propre, par exemple :

```javascript
={{
{
  "admin_alert_sent_at": $json.admin_alert_sent_at
}
}}
```

et, pour la branche prospect :

```javascript
={{
{
  "last_sequence_result": $json.expected_sequence_result || $json.last_sequence_result,
  "social_email_1_sent_at": $json.social_email_1_sent_at,
  "social_email_2_sent_at": $json.social_email_2_sent_at,
  "social_email_3_sent_at": $json.social_email_3_sent_at
}
}}
```

## 3.9 22/06/2026 - `admin_alert_sent_at` reste à `NULL`

### Symptôme

- le mail admin est bien reçu ;
- mais la colonne `admin_alert_sent_at` reste vide dans Supabase.

### Causes identifiées

- absence de la colonne dans Supabase au début ;
- ou récupération incomplète du contexte après l’envoi admin ;
- ou body `PATCH` incorrect.

### Correctif retenu

1. créer la colonne :

```sql
alter table public.prospect_targets
add column if not exists admin_alert_sent_at timestamptz;
```

2. construire `admin_alert_sent_at` dans `Build Admin Alert Send Result` ;
3. pousser cette valeur via `Update Prospect After Admin Alert`.

### Vérification

- `admin_alert_sent_at` doit être rempli après un envoi admin réussi ;
- l’alerte admin suivante doit être bloquée.

## 3.10 22/06/2026 - L’alerte admin repart une deuxième fois

### Symptôme

- un même prospect déclenche une seconde alerte admin.

### Cause identifiée

Il manquait une garde métier fondée sur la date déjà enregistrée.

### Correctif retenu

Utiliser :

- `Build Admin Alert Guard`
- `If Admin Alert Allowed`

en s’appuyant sur :

- `admin_alert_sent_at`

### Vérification

Quand `admin_alert_sent_at` est déjà rempli :

- `can_send_admin_alert = false`
- `If Admin Alert Allowed` passe en `False Branch`
- aucun nouvel email admin ne part.

## 3.11 22/06/2026 - `social_email_1_sent_at` reste à `NULL`

### Symptôme

- le mail prospect part bien ;
- mais `social_email_1_sent_at` reste vide en base.

### Cause identifiée

Le contexte de garde n’arrivait pas correctement jusqu’au nœud `Build Social Send Result`. Le nœud travaillait uniquement avec le retour Resend, sans récupérer `sent_at_field`.

### Correctif retenu

Dans `Build Social Send Result`, récupérer explicitement le contexte du nœud :

- `Build Social Sent Guard`

et recalculer les timestamps à partir de cette source.

### Vérification

Après correction :

- `social_email_1_sent_at` doit être rempli ;
- le prospect ne doit plus recevoir deux fois le mail 1.

## 3.12 22/06/2026 - Le prospect ne reçoit pas d’email alors que l’admin reçoit une alerte

### Symptôme

- le mail admin arrive ;
- pas de mail prospect.

### Causes possibles identifiées

- `paused = true`
- `status = paused`
- `If Social Lead Ready To Send` ou `If Social Send Allowed` bloque la branche.

### Correctif retenu

Vérifier les champs du prospect :

- `status`
- `paused`
- `do_not_contact`
- `social_email_1_sent_at`

Puis contrôler le résultat des nœuds :

- `If Social Lead Ready To Send`
- `Build Social Sent Guard`
- `If Social Send Allowed`

## 3.13 23/06/2026 - Confusion entre le mail admin et le mail prospect

### Symptôme

L’utilisateur pense que le mail admin n’arrive pas parce qu’il voit un mail sur `marius.ayoro70@gmail.com`.

### Cause identifiée

Le mail visible dans Gmail est le mail prospect de test, pas l’alerte admin.

### Correctif retenu

Retenir cette règle :

- `Merci pour votre intérêt...` = mail prospect ;
- `[Nouveau prospect ...]` = mail admin.

Et contrôler séparément :

- Gmail du prospect ;
- Zoho `contact@transferai.ci`.

## 4. Check-list de diagnostic rapide

## 4.1 Si rien n’arrive dans n8n

Vérifier :

1. Google Sheets reçoit-il la ligne ;
2. Apps Script pointe-t-il vers `webhook` et non `webhook-test` ;
3. le déclencheur Apps Script est-il actif ;
4. le workflow n8n est-il `Published`.

## 4.2 Si le prospect ne reçoit pas d’email

Vérifier :

1. `If Social Lead Ready To Send`
2. `Build Social Sent Guard`
3. `If Social Send Allowed`
4. `Send Social Sequence Email`
5. `social_email_1_sent_at`

## 4.3 Si l’admin ne reçoit pas d’alerte

Vérifier :

1. `If Admin Alert Eligible`
2. `Build Admin Alert Guard`
3. `If Admin Alert Allowed`
4. `Send Admin Lead Alert`
5. `admin_alert_sent_at`

## 4.4 Si un doublon apparaît

Vérifier :

1. qu’il n’existe qu’un seul projet Apps Script actif ;
2. qu’il n’existe qu’un seul déclencheur utile ;
3. `admin_alert_sent_at`
4. `social_email_1_sent_at`
5. `social_email_2_sent_at`
6. `social_email_3_sent_at`

## 5. Nœuds les plus sensibles

Les nœuds à contrôler en priorité sont :

- `Google Forms Social Lead Webhook`
- `Normalize Google Forms Lead`
- `Prepare Social Prospect Record`
- `Upsert Social Prospect Into CRM`
- `Build Social Sequence Email`
- `Build Social Sent Guard`
- `Send Social Sequence Email`
- `Build Social Send Result`
- `Update Prospect After Social Send`
- `Build Admin Alert Guard`
- `Send Admin Lead Alert`
- `Build Admin Alert Send Result`
- `Update Prospect After Admin Alert`

## 6. État de stabilité au 23/06/2026

Le système est désormais stabilisé sur les points suivants :

- entrée Google Forms vers n8n ;
- création CRM ;
- premier email prospect ;
- alerte admin ;
- blocage des doublons admin ;
- base technique de blocage des doublons prospect ;
- distinction claire entre circuit prospect et circuit admin.

## 7. Prochaine zone à surveiller

La prochaine vigilance opérationnelle porte sur :

1. la validation complète des dates `social_email_1_sent_at`, `social_email_2_sent_at`, `social_email_3_sent_at` ;
2. l’ajout propre des relances `mail 2` et `mail 3` ;
3. la vérification du comportement du scheduler une fois les étapes 2 et 3 activées.

---

## 10_BackOffice_Admin_User_Guide_EN

Source : `docs/transferai-admin/10_BackOffice_Admin_User_Guide_EN.md`

# TransferAI Africa BackOffice Administrator Guide

## 1. Purpose of this guide

This guide explains the real operating model of the **TransferAI Africa BackOffice** as it exists today across the public site, the Supabase backend, and the connected operational tools.

It answers four practical questions:

1. **How to access the back-office and backend**
2. **What each section is used for**
3. **Which operational roles are expected**
4. **How to manage the platform safely without breaking live workflows**

This document is intended for the **primary administrator** and the team members responsible for:

- content publishing
- audit and lead intake
- partner requests
- newsletter operations
- webinar and live format operations
- video capsules
- incoming WhatsApp conversations

---

## 2. Mission of the primary administrator

The primary administrator is not just the person who publishes.

This role ensures that the platform remains:

- editorially coherent
- commercially credible
- clear for visitors
- technically reliable
- traceable from the back-office side

Primary responsibilities:

1. content and CTA governance
2. back-office supervision
3. incoming lead and conversation tracking
4. lightweight deployment and access control
5. coordination with the other operational admins
6. documentation and transmission of procedures

---

## 3. How to access the back-office and backend

### 3.1. Public back-office access

Production URL:

- [https://www.transferai.ci/back-office](https://www.transferai.ci/back-office)

Specific tabs can be opened directly with `?tab=...`, for example:

- [https://www.transferai.ci/back-office?tab=whatsapp](https://www.transferai.ci/back-office?tab=whatsapp)
- [https://www.transferai.ci/back-office?tab=newsletters](https://www.transferai.ci/back-office?tab=newsletters)
- [https://www.transferai.ci/back-office?tab=partners](https://www.transferai.ci/back-office?tab=partners)

### 3.2. Local access for the technical team

During development or validation, the back-office can also be opened locally:

- `http://127.0.0.1:<port>/back-office`

### 3.3. Administrator token

The public back-office relies on an **administrator token**.

The backend secret currently used to validate this token is:

- `CONTENT_ADMIN_TOKEN`

This token is verified by the edge function:

- [`/Users/marius_ayoro/.codex/worktrees/4df6/connect-ia-bloom/supabase/functions/content-admin/index.ts`](/Users/marius_ayoro/.codex/worktrees/4df6/connect-ia-bloom/supabase/functions/content-admin/index.ts)

Good practice:

- never share the token in an unsecured email
- avoid keeping it in open documents
- rotate it if there is any doubt about exposure

### 3.4. Backend and database access

The main backend is hosted on **Supabase**.

Key areas used by administrators:

- `Table Editor`
- `Edge Functions`
- `Secrets`
- `SQL Editor`

Supabase is used to store and operate:

- contact and audit requests
- WhatsApp inbound messages
- newsletter editions and deliveries
- partner review workflows
- video capsule feed records
- webinar registrations and follow-up flows

### 3.5. Twilio / WhatsApp access

Twilio is used to:

- receive incoming WhatsApp messages
- forward them to the webhook
- expose message logs for validation

The validated WhatsApp sender in use is:

- `+2250716573990`

### 3.6. Resend / email access

Resend is used for:

- admin notifications
- prospect and catalog responses
- partner follow-up emails
- newsletter delivery
- internal WhatsApp notification emails

### 3.7. Public site and Cloudflare

The public site is served on:

- [https://www.transferai.ci](https://www.transferai.ci)

Important reminder:

- a change can be committed in GitHub and still not be visible if `main` is not the version served in production
- always verify the actual public page after deployment

---

## 4. Operational roles

The current system does not yet expose formal role-based access control by individual user inside the back-office.

At this stage, roles are **operational responsibilities**.

### 4.1. Primary administrator

Responsible for:

- access to the back-office
- global supervision
- final validation before production
- incident follow-up
- production publishing decisions

### 4.2. Content administrator

Responsible for:

- `Resources`
- `AI Drafts`
- `Video Capsules`
- visible text review and publishing quality

### 4.3. Newsletter administrator

Responsible for:

- `AI Newsletter`
- editorial review
- test sends
- approval before dispatch
- Thursday reminder follow-up

### 4.4. Audit / prospect administrator

Responsible for:

- `Audit Prospects`
- request qualification
- prospect portal tracking
- follow-up actions

### 4.5. Partner administrator

Responsible for:

- `AI Partners`
- request review
- plan recommendation
- partner follow-up responses

### 4.6. WhatsApp administrator

Responsible for:

- `WhatsApp`
- incoming message review
- categorization
- internal notes
- manual reply on WhatsApp

### 4.7. Webinar / live administrator

Responsible for:

- `Webinars`
- `AI Live Formats`
- registrations and operational tracking

### 4.8. Opportunity administrator

Responsible for:

- `AI Jobs`
- opportunity publication
- status changes
- job-oriented follow-up logic

---

## 5. BackOffice sections and what each one does

Current visible tabs in the BackOffice:

- `Analytics`
- `Audit Prospects`
- `Resources`
- `AI Drafts`
- `AI Partners`
- `AI Newsletter`
- `Video Capsules`
- `WhatsApp`
- `AI Jobs`
- `Webinars`
- `AI Live Formats`
- `How to Use`

### 5.1. Analytics

Purpose:

- track traffic
- track requests and registrations
- identify the pages and domains that generate the most value

Typical usage:

- check the most visited pages weekly
- identify the CTAs that drive requests
- monitor demand trends

### 5.2. Audit Prospects

Purpose:

- review AI audit requests
- follow intake and qualification
- support lead follow-up and next actions

### 5.3. Resources

Purpose:

- create and manage articles and resource content
- publish or keep content in draft
- control metadata, summaries, domains, and visibility

### 5.4. AI Drafts

Purpose:

- review AI-generated draft proposals
- decide which signals become publishable content
- validate, refine, publish, or archive

### 5.5. AI Partners

Purpose:

- review partner submissions
- classify demand type
- recommend an offer or partnership path
- track partner follow-up

### 5.6. AI Newsletter

Purpose:

- edit newsletter issues
- review subject line, preheader, editorial block, prompt block, and CTA
- save, test, approve, or schedule

### 5.7. Video Capsules

Purpose:

- manage short-form media entries
- control featured and secondary items
- support TikTok/social video feed logic

### 5.8. WhatsApp

Purpose:

- read incoming WhatsApp messages
- classify requests quickly
- add internal notes
- open a direct reply flow in WhatsApp

This module currently supports:

- list + filters
- detail panel
- status updates
- category updates
- internal notes
- direct WhatsApp reply link

### 5.9. AI Jobs

Purpose:

- manage AI and digital opportunity posts
- track publication status
- support job-related visitor flows

### 5.10. Webinars

Purpose:

- manage webinar-related records
- update visibility and operational details

### 5.11. AI Live Formats

Purpose:

- manage live learning or media format records
- keep live offers aligned with public messaging

### 5.12. How to Use

Purpose:

- give operators a built-in explanation of how the back-office should be used
- reduce operational errors

---

## 6. Key backend tables

Important tables used by administrators include:

- `contact_requests`
- `registration_requests`
- `form_responses`
- `page_views`
- `resource_posts`
- `job_opportunities`
- `source_feeds`
- `source_signals`
- `editorial_jobs`
- `newsletter_subscriptions`
- `newsletter_issues`
- `newsletter_delivery_logs`
- `partner_offer_catalog`
- `partner_email_templates`
- `partner_listing_reviews`
- `partner_followup_jobs`
- `social_video_posts`
- `whatsapp_inbound_messages`
- `whatsapp_email_notification_logs`
- `webinar_registrations`

---

## 7. Important edge functions

Key operational edge functions currently include:

- `content-admin`
- `content-discovery`
- `content-classifier`
- `content-drafter`
- `newsletter-subscribe`
- `newsletter-drafter`
- `newsletter-send`
- `newsletter-scheduler`
- `send-prospect-emails`
- `partner-review-drafter`
- `partner-followup-send`
- `twilio-whatsapp-webhook`

These functions power the live workflows used by the site and the back-office.

---

## 8. Core operational workflows

### 8.1. WhatsApp workflow

Flow:

1. visitor clicks the WhatsApp CTA on the site
2. WhatsApp message is sent to `+2250716573990`
3. Twilio receives the message
4. Twilio calls the Supabase webhook
5. the webhook stores the message in `whatsapp_inbound_messages`
6. internal email notifications are sent
7. the message appears in BackOffice > `WhatsApp`

### 8.2. Newsletter workflow

Current model:

- AI prepares
- human validates
- system sends

Typical weekly logic:

- Wednesday: draft generation
- Thursday: reminder if approval is still pending
- Friday: approved issue can be sent

### 8.3. Partner workflow

Flow:

1. partner submits a request
2. the request is reviewed
3. a plan or recommendation is assigned
4. follow-up is prepared and sent
5. the outcome is tracked in the back-office

### 8.4. Video capsule workflow

Flow:

1. a social/video entry is added or updated
2. the site reads the feed data
3. the public page displays the selected capsule or branded fallback

---

## 9. Recommended operating routine

### Daily

- check contact and audit requests
- check WhatsApp incoming messages
- verify the back-office loads properly
- verify no critical front-end error is visible on the main commercial pages

### Weekly

- review AI drafts
- review the newsletter issue
- send a test before approval
- check partner requests and follow-up state
- verify the current featured video capsule

### Monthly

- review top pages and top CTAs
- review operational wording on key pages
- review secrets and access handling
- update documentation and operating priorities

---

## 10. Common issues and first checks

### If the back-office does not load

Check:

- the admin token
- Supabase frontend environment variables
- the `content-admin` function status

### If WhatsApp messages do not appear

Check:

- Twilio logs
- `twilio-whatsapp-webhook` recent invocations
- `whatsapp_inbound_messages`

### If WhatsApp emails are not seen

Check:

- `whatsapp_email_notification_logs`
- Resend logs
- inbox, spam, and promotions folders

### If a front-end page looks outdated

Check:

- whether the change was merged to `main`
- whether production is serving the latest build
- whether the browser is still showing cached content

---

## 11. Final recommendation

The platform is now strong enough to be operated reliably, but the safest model remains:

- human review for editorially sensitive content
- clear ownership by operational area
- disciplined deployment checks
- logging for every important workflow

The BackOffice should be treated as a **live operations cockpit**, not just a publishing screen.

---

## 31_Guide_Operatoire_Veille_Reglementaire_IA_Banque_CI

Source : `docs/transferai-admin/31_Guide_Operatoire_Veille_Reglementaire_IA_Banque_CI.md`

# Guide opératoire

## Veille réglementaire IA

### Banque - Côte d'Ivoire

Ce guide explique comment alimenter la veille réglementaire IA en moins de 5 minutes par signal.

## Objectif

Transformer rapidement une nouvelle information réglementaire ou institutionnelle en:

- signal enregistré
- brouillon exploitable
- note publiée dans le feed de veille

## Quand utiliser ce process

Utilisez ce process dès qu'un nouveau contenu apparaît sur:

- BCEAO
- UEMOA
- ARTCI
- une autorité de protection des données
- une institution bancaire ou un régulateur utile
- une source sectorielle crédible sur IA, conformité, gouvernance ou données

## Accès

Ouvrir:

- `/back-office?tab=editorial` pour injecter et traiter les signaux
- `/back-office?tab=resources` pour publier ou enrichir une note
- `/veille-reglementaire-ia` pour vérifier le rendu public

## Process en 5 minutes

### 1. Repérer le signal

Dès qu'un texte utile est détecté, relever:

- le titre exact
- l'URL source
- la date
- un résumé court ou l'extrait important

Exemples:

- note BCEAO
- décision ARTCI
- annonce UEMOA
- publication sur données personnelles
- cadre de gouvernance IA

### 2. Injecter le signal

Dans `/back-office?tab=editorial`:

- aller à `Injecter un signal réglementaire`
- coller le `Titre du signal`
- coller l'`URL source`
- renseigner la `date/heure`
- coller un `Résumé ou extrait important`
- cliquer sur `Ajouter à la file`

Résultat attendu:

- le signal apparaît dans la file éditoriale

### 3. Lancer le pipeline

Toujours dans l'onglet `editorial`:

- cliquer sur `1. Lancer la collecte des sources`
- cliquer sur `2. Classer les nouveaux signaux`
- cliquer sur `3. Générer les brouillons FR`

Résultat attendu:

- le signal devient un brouillon FR relisible

### 4. Vérifier le brouillon

Dans `Brouillons IA à relire`:

- ouvrir la source d'origine
- vérifier le titre
- vérifier le résumé
- vérifier l'angle métier banque / conformité
- corriger si nécessaire

À contrôler en priorité:

- pas d'affirmation non sourcée
- pas de conclusion juridique trop forte
- pas de confusion entre Côte d'Ivoire, UEMOA et international

### 5. Publier la note

Dans `/back-office?tab=resources`:

- vérifier ou compléter le contenu
- ajouter les tags métier
- vérifier la source
- publier la ressource

Résultat attendu:

- la note apparaît dans `/veille-reglementaire-ia`

## Tags à utiliser

Toujours mettre:

- 1 tag `jurisdiction`
- 1 tag `authority`
- 1 ou 2 tags `theme`
- 1 tag `impact`

### Tags recommandés

- `jurisdiction:cote-divoire`
- `jurisdiction:uemoa-bceao`
- `jurisdiction:international`
- `authority:bceao`
- `authority:uemoa`
- `authority:artci`
- `theme:gouvernance-ia`
- `theme:donnees-personnelles`
- `theme:conformite-bancaire`
- `impact:high`

## Exemples rapides

### Cas 1 - Note BCEAO

Tags:

- `jurisdiction:uemoa-bceao`
- `authority:bceao`
- `theme:conformite-bancaire`
- `theme:gouvernance-ia`
- `impact:high`

### Cas 2 - Décision locale données personnelles

Tags:

- `jurisdiction:cote-divoire`
- `authority:artci`
- `theme:donnees-personnelles`
- `impact:high`

### Cas 3 - Référence internationale à surveiller

Tags:

- `jurisdiction:international`
- `theme:gouvernance-ia`
- `impact:monitor`

## Règle éditoriale

La note doit répondre à cette question:

Qu'est-ce que ce signal change concrètement pour une banque ou une fonction conformité en Côte d'Ivoire ?

Le texte final doit rester:

- factuel
- court
- utile
- orienté décision

## Checklist finale

Avant publication, vérifier:

- la source est officielle ou crédible
- le titre est clair
- le résumé est compréhensible
- les tags sont cohérents
- la juridiction est correcte
- l'impact est correctement estimé
- la note apporte une lecture métier

## Temps cible

Temps moyen recommandé par signal:

- 1 minute pour repérer et résumer
- 1 minute pour injecter
- 1 minute pour lancer le pipeline
- 1 à 2 minutes pour relire et publier

Objectif:

- moins de 5 minutes par signal standard

---

## 46_Guide_Reconstruction_n8n_V1

Source : `docs/transferai-admin/46_Guide_Reconstruction_n8n_V1.md`

# Workflow V1 n8n - Guide de reconstruction pas à pas

Ce document explique comment reconstruire dans n8n le workflow **V1 de prospection multi-prospects**.

Le nom du fichier JSON conserve une trace historique, mais la logique décrite ici est désormais pensée pour une **CRM de 100 prospects et plus**, avec personnalisation par cible.

Fichier source du workflow :

- [42_n8n_Prospection_Modele_Elton_V1.json](./42_n8n_Prospection_Modele_Elton_V1.json)

## Objectif

Reconstruire un workflow qui :

- scrape des pages publiques ciblées
- assainit les données avant tout appel au LLM
- produit un pré-audit commercial
- génère un courrier, un mini-catalogue, une forme d’audit et un brief de deck
- s’arrête en validation manuelle

## Pré-requis

Avant de commencer, définir dans n8n :

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `BOOKING_LINK_45MIN`

## Architecture générale

Le workflow suit 6 blocs :

1. initialisation de la cible
2. construction et collecte des sources publiques
3. normalisation et protection des données
4. analyse LLM
5. génération des livrables
6. assemblage final et revue manuelle

## Étape 1 - Créer le déclencheur

### Nœud 1

- Type : `Manual Trigger`
- Nom : `Manual Trigger`

Rôle :

- lancer le workflow à la demande

## Étape 2 - Définir la cible commerciale

### Nœud 2

- Type : `Set`
- Nom : `Set Target`

Configurer les champs suivants :

- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `booking_link_45min`
- `commercial_priority_default`

Exemple de valeurs :

- `prospect_id = manual-prospect-001`
- `organization_name = Organisation cible à qualifier`
- `website = https://www.example.org`
- `country = Côte d'Ivoire`
- `organization_type = organisation à qualifier`
- `sector_guess = secteur à confirmer`
- `decision_maker_name = Décideur à confirmer`
- `custom_page_paths_csv = `
- `booking_link_45min = {{$env.BOOKING_LINK_45MIN || 'https://calendly.com/your-link'}}`
- `commercial_priority_default = tier1`
- `research_scope = public_web_only`

Connexion :

- `Manual Trigger` -> `Set Target`

## Étape 3 - Construire les URLs à scraper

### Nœud 3

- Type : `Code`
- Nom : `Build Source URLs`

Coller une logique qui :

- prend `website`
- enlève le slash final si nécessaire
- fabrique les pages à explorer

Sorties à produire :

- `source_pages`
- `page_1_url`
- `page_2_url`
- `page_3_url`
- `page_4_url`
- `page_5_url`

Le nœud doit :

- prendre les chemins personnalisés si `custom_page_paths_csv` est renseigné
- sinon utiliser des chemins publics fréquents comme `/`, `/services/`, `/solutions/`, `/contact/`, `/blog/`, `/products/`, `/careers/`
- garder les pages de présentation non standard via `custom_page_paths_csv` si le site utilise un slug spécifique comme `/la-smb/`
- limiter la première passe à 5 pages pour garder un workflow stable et peu coûteux

Connexion :

- `Set Target` -> `Build Source URLs`

## Étape 4 - Créer les requêtes HTTP de collecte

Créer 5 nœuds `HTTP Request`.

### Nœud 4

- Nom : `Fetch Public Page 1`
- URL : `{{$('Build Source URLs').first().json.page_1_url}}`

### Nœud 5

- Nom : `Fetch Public Page 2`
- URL : `{{$('Build Source URLs').first().json.page_2_url}}`

### Nœud 6

- Nom : `Fetch Public Page 3`
- URL : `{{$('Build Source URLs').first().json.page_3_url}}`

### Nœud 7

- Nom : `Fetch Public Page 4`
- URL : `{{$('Build Source URLs').first().json.page_4_url}}`

### Nœud 8

- Nom : `Fetch Public Page 5`
- URL : `{{$('Build Source URLs').first().json.page_5_url}}`

Recommandations de configuration :

- méthode `GET`
- activer `On Error -> Continue (regular output)` sur les 5 nœuds HTTP pour qu'une boucle de redirection sur une page ne bloque pas tout le workflow
- format de réponse texte ou HTML
- tolérance raisonnable aux erreurs si une page renvoie un contenu partiel

Chaînage :

- `Build Source URLs` -> `Fetch Public Page 1`
- `Fetch Public Page 1` -> `Fetch Public Page 2`
- `Fetch Public Page 2` -> `Fetch Public Page 3`
- `Fetch Public Page 3` -> `Fetch Public Page 4`
- `Fetch Public Page 4` -> `Fetch Public Page 5`

## Étape 5 - Normaliser les signaux publics

### Nœud 9

- Type : `Code`
- Nom : `Normalize Public Signals`

Ce nœud doit :

- relire les 5 pages publiques récupérées
- extraire leur contenu textuel utile
- rattacher une clé à chaque page
- consolider un grand texte public synthétique
- produire des signaux métier exploitables

Sorties à viser :

- `page_texts`
- `public_text`
- `roi_clues`
- métadonnées prospect conservées

Connexion :

- `Fetch Public Page 5` -> `Normalize Public Signals`

## Étape 6 - Ajouter la protection RGPD avant LLM

### Nœud 10

- Type : `Code`
- Nom : `Sanitize Prospect Data For LLM`

C’est l’étape critique du workflow.

Le code doit :

- retirer les URLs du texte
- retirer les e-mails
- retirer les numéros de téléphone
- pseudonymiser le nom de l’organisation en `ORG_TARGET`
- pseudonymiser le décideur en `DECISION_MAKER_TARGET`
- créer un extrait assaini du texte public
- produire une allowlist
- produire une blocked list

Sorties à créer :

- `public_text_sanitized`
- `llm_allowed_payload`
- `llm_generation_payload`
- `llm_redaction_summary`

Bonnes pratiques à respecter :

- politique `deny-by-default`
- ne jamais transmettre `organization_name`, `website`, `decision_maker_name` ni `public_text` brut au LLM
- limiter le texte envoyé à un extrait utile

Connexion :

- `Normalize Public Signals` -> `Sanitize Prospect Data For LLM`

## Étape 7 - Créer les 3 appels d’analyse OpenAI

Créer 3 nœuds `HTTP Request` vers :

- `https://api.openai.com/v1/chat/completions`

Configuration commune :

- méthode `POST`
- headers :
  - `Authorization = Bearer {{$env.OPENAI_API_KEY}}`
  - `Content-Type = application/json`
- modèle :
  - `{{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}`

### Nœud 11

- Nom : `Call OpenAI Pre-Audit`

Utiliser `llm_allowed_payload` dans le message utilisateur.

Sortie attendue :

- résumé prospect
- forces probables
- faiblesses probables
- besoins probables
- niche d’entrée
- score de confiance

### Nœud 12

- Nom : `Call OpenAI Problems Solutions`

Utiliser `llm_allowed_payload`.

Sortie attendue :

- problèmes probables
- quick wins
- offre recommandée
- séquence d’offre
- bundle de formation
- cas d’usage recommandé
- meilleur cas d’usage commercial
- niveau de priorité commerciale
- angle de rendez-vous

### Nœud 13

- Nom : `Call OpenAI ROI`

Utiliser `llm_allowed_payload`.

Sortie attendue :

- hypothèse de ROI
- gains de temps attendus
- améliorations de service attendues
- quick wins attendus
- chronologie de déploiement

Connexions :

- `Sanitize Prospect Data For LLM` -> `Call OpenAI Pre-Audit`
- `Sanitize Prospect Data For LLM` -> `Call OpenAI Problems Solutions`
- `Sanitize Prospect Data For LLM` -> `Call OpenAI ROI`

## Étape 8 - Consolider le contexte prospect

### Nœud 14

- Type : `Code`
- Nom : `Assemble Prospect Context`

Ce nœud doit :

- parser les 3 réponses OpenAI
- fusionner ces résultats avec les signaux publics normalisés
- produire un contexte unique pour la génération documentaire

Sorties utiles :

- `entry_point_niche`
- `recommended_offer`
- `offer_sequence`
- `best_selling_use_case`
- `commercial_priority_tier`
- `roi_hypothesis`

Connexion :

- `Call OpenAI Pre-Audit` -> `Assemble Prospect Context`

Le code peut relire les autres nœuds OpenAI avec `$('Node Name').first().json`.

## Étape 9 - Générer les 4 livrables

Créer 4 nœuds `HTTP Request` OpenAI supplémentaires.

Ils utilisent tous :

- le modèle OpenAI
- les headers API
- `llm_generation_payload`

### Nœud 15

- Nom : `Generate Executive Letter`

Objectif :

- produire un courrier professionnel en français standard avec accents
- mettre en avant l’audit gratuit
- proposer un rendez-vous gratuit de 45 minutes
- insister sur le service derrière l’IA

### Nœud 16

- Nom : `Generate Tailored Catalogue`

Objectif :

- produire un mini-catalogue ciblé

Sections attendues :

- message central
- objectifs
- pourquoi cette approche peut intéresser la structure
- notre porte d’entrée
- offres prioritaires
- formations prioritaires
- hypothèse de gains attendus
- proposition immédiate

### Nœud 17

- Nom : `Generate Tailored Audit Form`

Objectif :

- produire une forme d’audit pré-appel adaptée au secteur

Champs attendus :

- priorités métier
- irritants
- outils actuels
- données
- attentes de formation
- confidentialité
- objectifs à 3 mois
- volumes
- délais
- objectifs de performance

### Nœud 18

- Nom : `Generate Deck Brief`

Objectif :

- produire un JSON pour la future présentation

Champs attendus :

- `slide_objective`
- `key_messages`
- `sector_pain_points`
- `recommended_case_study`
- `training_focus`
- `roi_hypothesis`
- `delivery_timeline`
- `sector_variant`
- `single_primary_cta`

Connexion :

- `Assemble Prospect Context` -> les 4 nœuds de génération

## Étape 10 - Assembler le pack prospect

### Nœud 19

- Type : `Code`
- Nom : `Assemble Prospect Pack`

Ce nœud doit :

- récupérer les sorties des 4 livrables
- parser le JSON du deck brief
- réinjecter localement les vraies valeurs dans les placeholders
- calculer `approved_for_send`
- inclure le résumé de redaction LLM

Les placeholders à hydrater localement sont par exemple :

- `{{ORGANIZATION_NAME}}`
- `{{DECISION_MAKER_NAME}}`
- `{{WEBSITE}}`

Sortie finale à produire :

- `executive_letter`
- `tailored_catalogue`
- `tailored_audit_form`
- `deck_brief`
- `llm_redaction_summary`
- `approved_for_send`

Connexion :

- `Generate Executive Letter` -> `Assemble Prospect Pack`

Le code peut relire les autres nœuds génératifs directement.

## Étape 11 - Mettre le pack en revue manuelle

### Nœud 20

- Type : `Set`
- Nom : `Mark For Review`

Ajouter :

- `workflow_status = ready_for_manual_review`

Connexion :

- `Assemble Prospect Pack` -> `Mark For Review`

## Résultat final attendu

Une fois exécuté, le workflow V1 doit fournir un pack prospect prêt à validation humaine comprenant :

- l’angle commercial
- la niche d’entrée
- les problèmes probables
- le courrier
- le mini-catalogue
- la forme d’audit
- le brief de présentation
- le résumé de protection LLM

## Ordre logique de test

Pour valider le workflow dans n8n, tester dans cet ordre :

1. `Set Target`
2. `Build Source URLs`
3. les 5 requêtes HTTP
4. `Normalize Public Signals`
5. `Sanitize Prospect Data For LLM`
6. les 3 appels d’analyse OpenAI
7. `Assemble Prospect Context`
8. les 4 livrables
9. `Assemble Prospect Pack`
10. `Mark For Review`

## Conseil d’exploitation

Pour un usage réel, garder le V1 comme workflow de production documentaire assistée, avec :

- une revue humaine avant contact
- une vérification des hypothèses avant envoi
- une adaptation finale du message selon la relation existante avec le prospect
- une alimentation depuis une CRM, une feuille ou Supabase pour enchaîner plusieurs prospects sans dupliquer le workflow

---

## 49_Guide_V4_Batch_Quotas_Stop_Rules

Source : `docs/transferai-admin/49_Guide_V4_Batch_Quotas_Stop_Rules.md`

# V4 Batch - Quotas d'envoi et règles d'arrêt

Ce document décrit la logique commerciale et opérationnelle de la **V4 batch**.

Fichier concerné :

- [47_n8n_Prospection_Multi_Prospect_V4_Batch.json](./47_n8n_Prospection_Multi_Prospect_V4_Batch.json)

## Rôle de la V4

La V4 ne remplace pas le workflow prospect.

Son rôle est de :

- charger une liste de prospects
- décider qui peut être traité aujourd’hui
- bloquer ce qui ne doit pas partir
- router les prospects éligibles vers le bon sous-workflow
- produire un résumé de batch

## Variables d’environnement recommandées

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME`
- `AIRTABLE_READY_VIEW`
- `GOOGLE_SHEETS_CSV_URL`
- `BOOKING_LINK_45MIN`
- `N8N_CHILD_WORKFLOW_ID_V3`
- `N8N_CHILD_WORKFLOW_ID_FOLLOW_UP`

Le `N8N_CHILD_WORKFLOW_ID_V3` doit maintenant idéalement pointer vers la version enrichie du workflow prospect, c’est-à-dire la variante qui génère aussi le mini-catalogue et le deck avant stockage / envoi.

## Paramètres batch recommandés

Dans `Set Batch Config` :

- `source_backend`
- `batch_fetch_limit`
- `daily_send_limit`
- `max_attempts_per_prospect`
- `min_confidence_score`
- `batch_run_label`
- `child_workflow_label_v3`

### Valeurs de départ recommandées

- `source_backend = supabase`
- `batch_fetch_limit = 25`
- `daily_send_limit = 5`
- `max_attempts_per_prospect = 3`
- `min_confidence_score = 0.45`
- `child_workflow_label_v3 = TransferAI Prospecting V3 CRM Enhanced [FINAL]-11`

## Règles d'arrêt implémentées

La V4 doit arrêter un prospect avant exécution si :

- `organization_name` est absent
- `website` est absent
- `target_email` est absent
- `do_not_contact = true`
- `paused = true`
- `stop_reason` est déjà renseigné
- `outreach_attempt_count >= max_attempts_per_prospect`
- `last_response_status` indique une séquence déjà close
- `last_sequence_result = no_niche`
- `next_action_at` est dans le futur
- `confidence_score < min_confidence_score` quand ce score existe sur le prospect
- le quota quotidien est déjà atteint

## Statuts de réponse considérés comme séquence close

La V4 traite comme “séquence close” :

- `interested`
- `meeting_booked`
- `not_interested`
- `unsubscribed`

## Logique de quota quotidien

La V4 :

1. lit les envois du jour dans `outreach_attempts`
2. calcule `sent_today`
3. calcule `remaining_capacity = daily_send_limit - sent_today`
4. ne laisse passer que les premiers prospects jusqu’à épuisement de la capacité

## Conséquence métier

Si `daily_send_limit = 5` et que 2 e-mails ont déjà été envoyés aujourd’hui, la V4 ne doit pousser que 3 nouveaux prospects au workflow V3.

## Règle commerciale recommandée

Pour une campagne B2B ciblée, je recommande :

- 3 à 5 prises de contact qualifiées par jour
- jamais de volume massif sans revue des réponses
- arrêt de la séquence si la niche est jugée faible
- arrêt après 3 tentatives sans signal positif

## Articulation avec les sous-workflows

La V4 ne pousse que les prospects marqués :

- `process_decision = process_now`

Puis elle choisit automatiquement :

- `initial_pack_v3` pour un premier contact
- `follow_up_v1` pour une relance sur prospect déjà contacté

Le V3 se charge ensuite de :

- scrapper
- protéger les données avant LLM
- produire le pack prospect
- générer le mini-catalogue rendu
- générer le deck rendu
- lancer la validation
- envoyer après approbation

Le workflow de follow-up se charge de :

- récupérer le dernier pack
- générer un email de relance personnalisé
- envoyer la relance
- journaliser `outreach_attempts`
- mettre à jour `prospect_targets`

## Sorties de la V4

La V4 produit en fin de run :

- `processed_count`
- `skipped_count`
- `rendered_catalogues_count`
- `rendered_decks_count`
- `rendered_attachments_total`
- `render_error_count`
- `skip_reasons`
- `child_workflow_id_v3`
- `child_workflow_label_v3`
- `generated_at`

Et, dans la version actuelle, elle peut aussi journaliser :

- une ligne dans `prospecting_batch_runs`
- une ligne par prospect dans `prospecting_batch_run_items`

## Recommandation d’exploitation

Pour un démarrage sérieux :

1. activer la V4 en `Supabase` comme backend principal
2. garder le quota à `3` ou `5` envois / jour
3. revoir les taux de réponse chaque semaine
4. n’augmenter le volume qu’après validation des niches les plus réactives

---

## 56_Guide_Copier_Coller_Blocs_Code_n8n_V1

Source : `docs/transferai-admin/56_Guide_Copier_Coller_Blocs_Code_n8n_V1.md`

# Guide copier-coller - blocs de code exacts pour n8n V1

Ce document regroupe les blocs exacts à copier dans les nœuds `Code` du workflow **V1 multi-prospects**.

Workflow source :

- [42_n8n_Prospection_Modele_Elton_V1.json](./42_n8n_Prospection_Modele_Elton_V1.json)

## Nœud `Build Source URLs`

Type :

- `Code`

Nom :

- `Build Source URLs`

```javascript
const base = String($json.website || '').trim().replace(/\/$/, '');
const customPaths = String($json.custom_page_paths_csv || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const defaultPaths = [
  '/',
  '/services/',
  '/solutions/',
  '/contact/',
  '/blog/',
  '/products/',
  '/expertise/',
  '/produits-et-services/',
  '/carrieres/',
  '/careers/',
  '/a-propos/',
  '/about/'
];

function normalizePath(path) {
  if (!path) return '/';
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

const selectedPaths = [...new Set([...customPaths, ...defaultPaths].map(normalizePath))].slice(0, 5);
const sourcePages = selectedPaths.map((path, index) => {
  const isAbsolute = /^https?:\/\//i.test(path);
  const normalizedPath = isAbsolute ? path : path.replace(/^\/+/, '/');
  const url = isAbsolute ? path : `${base}${normalizedPath === '/' ? '' : normalizedPath}`;
  return {
    key: `page_${index + 1}`,
    path: isAbsolute ? null : normalizedPath,
    label: isAbsolute ? `public_source_${index + 1}` : normalizedPath,
    url,
  };
});

const output = { ...$json, source_pages: sourcePages };
sourcePages.forEach((page, index) => {
  output[`page_${index + 1}_url`] = page.url;
  output[`page_${index + 1}_label`] = page.label;
});

return [{ json: output }];
```

## Nœud `Normalize Public Signals`

Type :

- `Code`

Nom :

- `Normalize Public Signals`

```javascript
const target = $('Build Source URLs').first().json;
const configuredPages = Array.isArray(target.source_pages) ? target.source_pages : [];
const pages = [
  { meta: configuredPages[0] || { key: 'page_1', label: '/' }, raw: $('Fetch Public Page 1').first().json },
  { meta: configuredPages[1] || { key: 'page_2', label: '/services/' }, raw: $('Fetch Public Page 2').first().json },
  { meta: configuredPages[2] || { key: 'page_3', label: '/solutions/' }, raw: $('Fetch Public Page 3').first().json },
  { meta: configuredPages[3] || { key: 'page_4', label: '/contact/' }, raw: $('Fetch Public Page 4').first().json },
  { meta: configuredPages[4] || { key: 'page_5', label: '/blog/' }, raw: $('Fetch Public Page 5').first().json }
];

function toText(raw) {
  const html = raw?.body || raw?.data || raw || '';
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const pageTexts = pages
  .map((page) => ({
    key: page.meta.key,
    label: page.meta.label,
    text: toText(page.raw).slice(0, 12000)
  }))
  .filter((page) => page.text);

const combinedPublicText = pageTexts.map((page) => `[${page.key.toUpperCase()} - ${page.label}]\n${page.text}`).join('\n\n');
const normalizedText = combinedPublicText.toLowerCase();

const clueTaxonomy = {
  support_it_intelligent: ['support', 'helpdesk', 'incident', 'ticket', 'sla', 'maintenance'],
  service_client_multicanal: ['service client', 'relation client', 'support client', 'contact', 'crm'],
  machine_contenu_marketing: ['marketing', 'communication', 'campagne', 'contenu', 'réseaux sociaux', 'reseaux sociaux'],
  workflow_administratif: ['procédure', 'procedure', 'validation', 'reporting', 'back-office', 'administratif'],
  assistant_direction_documentaire: ['direction', 'rapport', 'compte rendu', 'documentation', 'pilotage'],
  reporting_financier_assiste: ['finance', 'facturation', 'comptabilité', 'comptabilite', 'recouvrement', 'paiement'],
  recrutement_onboarding_augmente: ['recrutement', 'talent', 'carrière', 'carriere', 'onboarding', 'rh'],
  telemedecine_triage_orientation: ['santé', 'sante', 'patient', 'clinique', 'hôpital', 'hopital', 'télémédecine', 'telemedecine'],
  banque_kyc_reporting: ['banque', 'kyc', 'conformité', 'conformite', 'compliance', 'risque'],
  operations_terrain_coordination: ['terrain', 'flotte', 'logistique', 'livraison', 'intervention', 'opérations', 'operations']
};

const roiClues = Object.entries(clueTaxonomy)
  .filter(([, keywords]) => keywords.some((keyword) => normalizedText.includes(keyword.toLowerCase())))
  .map(([key]) => key);

return [{
  json: {
    ...target,
    page_texts: pageTexts,
    public_text: combinedPublicText.slice(0, 45000),
    roi_clues: roiClues.length ? roiClues : [
      'workflow_administratif',
      'service_client_multicanal',
      'assistant_direction_documentaire'
    ]
  }
}];
```

## Nœud `Sanitize Prospect Data For LLM`

Type :

- `Code`

Nom :

- `Sanitize Prospect Data For LLM`

```javascript
const source = $json;
const orgName = (source.organization_name || '').trim();
const decisionMaker = (source.decision_maker_name || '').trim();
const website = (source.website || '').trim();
const domain = website.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let sanitizedText = String(source.public_text || '');

const genericPatterns = [
  [/https?:\/\/\S+/gi, '[URL_REDACTED]'],
  [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[EMAIL_REDACTED]'],
  [/\+?\d[\d\s().-]{7,}\d/g, '[PHONE_REDACTED]']
];

for (const [pattern, replacement] of genericPatterns) {
  sanitizedText = sanitizedText.replace(pattern, replacement);
}

const sensitiveTokens = [
  { value: orgName, replacement: 'ORG_TARGET' },
  { value: decisionMaker, replacement: 'DECISION_MAKER_TARGET' },
  { value: domain, replacement: '[URL_REDACTED]' }
].filter((item) => item.value && item.value.length > 2);

for (const token of sensitiveTokens) {
  const pattern = new RegExp(escapeRegex(token.value), 'gi');
  sanitizedText = sanitizedText.replace(pattern, token.replacement);
}

const normalized = sanitizedText.toLowerCase();
const signalTaxonomy = {
  support_it_intelligent: ['support', 'helpdesk', 'incident', 'ticket', 'sla', 'maintenance'],
  service_client_multicanal: ['service client', 'relation client', 'support client', 'contact center', 'crm'],
  machine_contenu_marketing: ['marketing', 'communication', 'campagne', 'contenu', 'marque', 'réseaux sociaux', 'reseaux sociaux'],
  workflow_administratif: ['procédure', 'procedure', 'validation', 'reporting', 'back-office', 'administratif'],
  assistant_direction_documentaire: ['direction', 'pilotage', 'rapport', 'documentation', 'compte rendu'],
  reporting_financier_assiste: ['facturation', 'finance', 'comptabilité', 'comptabilite', 'paiement', 'recouvrement'],
  recrutement_onboarding_augmente: ['recrutement', 'carrière', 'carriere', 'rh', 'talent', 'onboarding'],
  commentaire_donnees_reporting: ['données', 'donnees', 'dashboard', 'analytics', 'indicateurs', 'tableau de bord'],
  telemedecine_triage_orientation: ['santé', 'sante', 'patient', 'clinique', 'hôpital', 'hopital', 'telemedecine'],
  banque_kyc_reporting: ['banque', 'kyc', 'compliance', 'conformité', 'conformite', 'risque'],
  operations_terrain_coordination: ['flotte', 'terrain', 'logistique', 'livraison', 'intervention', 'opérations', 'operations'],
  energie_industrie_services: ['énergie', 'energie', 'oil', 'gas', 'station', 'industrie', 'industriel'],
  formation_montee_en_competence: ['formation', 'certification', 'academy', 'apprentissage', 'compétence', 'competence']
};

const signalTags = Object.entries(signalTaxonomy)
  .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword.toLowerCase())))
  .map(([key]) => key);

const allowedFields = [
  'organization_type',
  'sector_guess',
  'country',
  'signal_tags',
  'roi_clues',
  'page_keys',
  'public_text_sanitized_excerpt'
];

const blockedFields = [
  'organization_name',
  'website',
  'decision_maker_name',
  'target_email',
  'page_texts',
  'public_text'
];

const sanitizedExcerpt = sanitizedText.slice(0, 12000);

const llmAllowedPayload = {
  llm_policy: 'deny-by-default',
  organization_ref: 'ORG_TARGET',
  decision_maker_ref: decisionMaker ? 'DECISION_MAKER_TARGET' : null,
  organization_type: source.organization_type || null,
  sector_guess: source.sector_guess || null,
  country: source.country || null,
  signal_tags: signalTags,
  roi_clues: Array.isArray(source.roi_clues) ? source.roi_clues : [],
  page_keys: Array.isArray(source.page_texts) ? source.page_texts.map((p) => p.key) : [],
  public_text_sanitized_excerpt: sanitizedExcerpt,
  allowed_fields: allowedFields,
  blocked_fields: blockedFields
};

const llmGenerationPayload = {
  ...llmAllowedPayload,
  organization_display: '{{ORGANIZATION_NAME}}',
  decision_maker_display: '{{DECISION_MAKER_NAME}}',
  website_display: '{{WEBSITE}}'
};

return [{
  json: {
    ...source,
    public_text_sanitized: sanitizedExcerpt,
    llm_allowed_payload: llmAllowedPayload,
    llm_generation_payload: llmGenerationPayload,
    llm_redaction_summary: {
      policy: 'deny-by-default',
      blocked_fields: blockedFields,
      allowed_fields: allowedFields,
      pseudonymized_identifiers: ['organization_name', 'decision_maker_name', 'website'],
      text_sent_to_llm: 'sanitized_public_text_excerpt_only'
    }
  }
}];
```

## Nœud `Assemble Prospect Context`

Type :

- `Code`

Nom :

- `Assemble Prospect Context`

```javascript
const base = $('Normalize Public Signals').first().json;

function parseOpenAI(nodeName) {
  const raw = $(nodeName).first().json?.choices?.[0]?.message?.content || '{}';
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { parse_error: `${nodeName}: ${e.message}` };
  }
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

const preAudit = parseOpenAI('Call OpenAI Pre-Audit');
const problems = parseOpenAI('Call OpenAI Problems Solutions');
const roi = parseOpenAI('Call OpenAI ROI');
const sectorVariant = problems.sector_variant || slugify(base.sector_guess) || 'multi_sector_operations';

return [{
  json: {
    ...base,
    ...preAudit,
    ...problems,
    ...roi,
    single_primary_cta: 'Planifier un audit stratégique gratuit suivi d\'un échange de 45 minutes',
    sector_variant: sectorVariant
  }
}];
```

## Nœud `Assemble Prospect Pack`

Type :

- `Code`

Nom :

- `Assemble Prospect Pack`

```javascript
function textFrom(nodeName) {
  return $(nodeName).first().json?.choices?.[0]?.message?.content || '';
}

function jsonFrom(nodeName) {
  const raw = textFrom(nodeName) || '{}';
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { parse_error: `${nodeName}: ${e.message}`, raw };
  }
}

function hydrateString(value, ctx) {
  return String(value)
    .replace(/\{\{ORGANIZATION_NAME\}\}/g, ctx.organization_name || '')
    .replace(/\{\{DECISION_MAKER_NAME\}\}/g, ctx.decision_maker_name || '')
    .replace(/\{\{WEBSITE\}\}/g, ctx.website || '');
}

function hydrateValue(value, ctx) {
  if (typeof value === 'string') return hydrateString(value, ctx);
  if (Array.isArray(value)) return value.map((item) => hydrateValue(item, ctx));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, inner] of Object.entries(value)) out[key] = hydrateValue(inner, ctx);
    return out;
  }
  return value;
}

const ctx = $('Assemble Prospect Context').first().json;
const executiveLetter = hydrateString(textFrom('Generate Executive Letter'), ctx);
const tailoredCatalogue = hydrateString(textFrom('Generate Tailored Catalogue'), ctx);
const tailoredAuditForm = hydrateString(textFrom('Generate Tailored Audit Form'), ctx);
const deckBrief = hydrateValue(jsonFrom('Generate Deck Brief'), ctx);
const requiresEmail = Object.prototype.hasOwnProperty.call(ctx, 'target_email');
const approvedForSend = Boolean(ctx.organization_name && ctx.entry_point_niche && ctx.recommended_offer && (!requiresEmail || ctx.target_email));
const packId = ctx.pack_id || `pack-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

return [{
  json: {
    ...ctx,
    pack_id: packId,
    executive_letter: executiveLetter,
    tailored_catalogue: tailoredCatalogue,
    tailored_audit_form: tailoredAuditForm,
    deck_brief: deckBrief,
    approved_for_send: approvedForSend,
    llm_redaction_summary: ctx.llm_redaction_summary,
    llm_allowed_payload: ctx.llm_allowed_payload,
    llm_generation_payload: ctx.llm_generation_payload
  }
}];
```

## Conseils de collage dans n8n

- créer d’abord le nœud `Code`
- lui donner exactement le bon nom
- remplacer entièrement le contenu par le bloc ci-dessus
- enregistrer le nœud avant de passer au suivant

## Ordre conseillé de test

1. `Build Source URLs`
2. `Normalize Public Signals`
3. `Sanitize Prospect Data For LLM`
4. `Assemble Prospect Context`
5. `Assemble Prospect Pack`

---

## 58_Guide_Step_By_Step_V2_Supabase_Approval_Email

Source : `docs/transferai-admin/58_Guide_Step_By_Step_V2_Supabase_Approval_Email.md`

# Guide Step-by-Step — Workflow V2
## Supabase + Email d'approbation interne + Envoi prospect

**Fichier workflow :** `43_n8n_Prospection_Modele_Elton_V2_Supabase_Approval_Email.json`  
**Prérequis :** V1 fonctionnel ✅

---

## Ce que la V2 fait en plus de la V1

```
[V1 : génération du pack]
         ↓
Store Pack In Supabase       ← sauvegarde le pack dans la BDD
         ↓
Build Approval Email         ← construit l'email avec liens Approuver/Rejeter
         ↓
Send Internal Approval Email ← envoie cet email à l'équipe TransferAI

[Sur clic du lien dans l'email]
         ↓
Approval Webhook             ← reçoit la décision (approuvé ou rejeté)
         ↓
Get Pack From Supabase       ← récupère le pack complet
         ↓
If Approved ?
   OUI → Mark Pack Approved → Send External Prospect Email → Log Outreach Attempt
   NON → Mark Pack Rejected
```

---

## ÉTAPE 0 — Prérequis à créer AVANT de toucher n8n

### 0.1 Créer un compte Supabase

1. Aller sur [https://supabase.com](https://supabase.com) → **Start your project**
2. Créer un projet (nom : `transferai-prospection`, région : la plus proche)
3. Noter les informations suivantes (Settings → API) :
   - **Project URL** → ex : `https://xxxxxxxxxxxx.supabase.co`
   - **service_role (secret)** → ex : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 0.2 Créer les tables Supabase

Dans Supabase → **SQL Editor** → coller et exécuter le SQL suivant :

```sql
-- Table des packs générés
CREATE TABLE IF NOT EXISTS ai_prospecting_packs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_id text UNIQUE NOT NULL,
  prospect_id text,
  organization_name text,
  target_email text,
  status text DEFAULT 'pending_approval',
  payload jsonb,
  llm_redaction_summary jsonb,
  approved_at timestamptz,
  rejected_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Table des tentatives de contact
CREATE TABLE IF NOT EXISTS outreach_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_id text,
  pack_id text,
  channel text DEFAULT 'email',
  sent_at timestamptz DEFAULT now(),
  status text DEFAULT 'sent'
);
```

Cliquer **Run** → vérifier que les deux tables apparaissent dans **Table Editor**.

### 0.3 Créer un compte Resend (envoi d'emails)

1. Aller sur [https://resend.com](https://resend.com) → **Sign up** (gratuit)
2. Dans **API Keys** → **Create API Key** → noter la clé : `re_xxxxxxxxxxxx`
3. Dans **Domains** → ajouter votre domaine email OU utiliser le domaine de test Resend
   - Pour les tests : utiliser `onboarding@resend.dev` comme adresse d'envoi
   - Pour la production : ajouter `transferai.africa` et vérifier le domaine

### 0.4 Avoir votre URL n8n publique

L'email d'approbation contient des liens qui pointent vers votre n8n. Ces liens doivent être **accessibles depuis internet**.

- Si n8n est hébergé (ex : `https://n8n-pxlk.srv1480638.hstgr.cloud`) → utiliser cette URL
- Si n8n est en local → utiliser **ngrok** pour exposer un tunnel public

Votre URL n8n (visible dans le navigateur) : **noter cette URL maintenant**

---

## ÉTAPE 1 — Générer le JSON V2 corrigé

Avant d'importer dans n8n, il faut appliquer les mêmes corrections que V1 (Proxy, $env, spreads) sur la V2. Ouvrir un terminal et exécuter :

> **Note :** La valeur de votre clé API OpenAI est déjà connue :  
> `{{$env.OPENAI_API_KEY}}` via variable d'environnement, comme pour la V1

Remplacer dans le script ci-dessous les 5 valeurs marquées `← MODIFIER` :

```python
# Exécuter dans Terminal :
# python3 /chemin/vers/ce/script.py
```

Les corrections sont appliquées automatiquement par le fichier  
`43_n8n_Prospection_Modele_Elton_V2_corrected.json` (généré après la section ÉTAPE 1).

---

## ÉTAPE 2 — Importer le workflow V2 dans n8n

1. Dans n8n, ouvrir un **nouveau workflow** (icône `+` en haut à gauche)
2. Cliquer `...` → **Import from file...**
3. Sélectionner `43_n8n_Prospection_Modele_Elton_V2_corrected.json`
4. Vérifier que les nœuds sont présents (34 nœuds au total)

---

## ÉTAPE 3 — Configurer nœud par nœud

### Nœuds identiques à V1 (mêmes corrections déjà appliquées)

Les nœuds suivants fonctionnent exactement comme en V1. Pas d'action requise si vous utilisez le fichier corrigé :

| Nœud | Action |
|---|---|
| Manual Trigger | ✅ Rien à faire |
| Execute Workflow Trigger | ✅ Rien à faire |
| Set Target | ✅ Valeurs hardcodées (changer le prospect ici) |
| Build Source URLs | ✅ Code corrigé |
| Fetch Public Page 1 à 5 | ✅ neverError activé |
| Normalize Public Signals | ✅ Code corrigé |
| Sanitize Prospect Data For LLM | ✅ Code corrigé |
| Call OpenAI Pre-Audit / Problems Solutions / ROI | ✅ Clé API hardcodée |
| Assemble Prospect Context | ✅ Code corrigé |
| Generate Executive Letter / Catalogue / Audit Form / Deck Brief | ✅ Clé hardcodée + placeholders échappés |
| Assemble Prospect Pack | ✅ Code corrigé |

---

### Nœud 21 — `Store Pack In Supabase`

**Rôle :** Enregistre le pack dans la table `ai_prospecting_packs`.

**Ce qu'il faut configurer :**

1. Cliquer sur le nœud `Store Pack In Supabase`
2. Onglet **Parameters** → section **URL**
3. Remplacer l'URL par :
   ```
   https://VOTRE_URL_SUPABASE.supabase.co/rest/v1/ai_prospecting_packs
   ```
   *(remplacer `VOTRE_URL_SUPABASE` par votre Project URL)*

4. Section **Headers** → modifier les deux headers :
   - `apikey` → valeur : `VOTRE_SERVICE_ROLE_KEY`
   - `Authorization` → valeur : `Bearer VOTRE_SERVICE_ROLE_KEY`

5. Vérifier que `Method = POST` et `Prefer: return=representation` est présent

**Aucune modification du Body** — il est déjà correct.

---

### Nœud 22 — `Build Approval Email`

**Rôle :** Construit l'email HTML avec les boutons Approuver/Rejeter.

**Ce qu'il faut configurer :**

1. Cliquer sur le nœud `Build Approval Email`
2. Localiser dans le code la ligne :
   ```javascript
   const baseUrl = $env.N8N_BASE_URL || 'https://your-n8n.example.com';
   ```
3. Remplacer par votre URL n8n réelle, ex :
   ```javascript
   const baseUrl = 'https://n8n-pxlk.srv1480638.hstgr.cloud';
   ```
4. Sauvegarder

**Les liens générés seront :**
```
https://VOTRE_N8N/webhook/approve-prospect-pack?pack_id=XXX&decision=approved
https://VOTRE_N8N/webhook/approve-prospect-pack?pack_id=XXX&decision=rejected
```

---

### Nœud 23 — `Send Internal Approval Email`

**Rôle :** Envoie l'email d'approbation à l'équipe TransferAI.

**Ce qu'il faut configurer :**

1. Cliquer sur le nœud `Send Internal Approval Email`
2. Section **Headers** → modifier :
   - `Authorization` → valeur : `Bearer re_VOTRE_CLE_RESEND`

3. Section **Body** → localiser et remplacer dans le JSON :
   - `from` : remplacer par votre email Resend vérifié (ex : `prospection@transferai.africa`)
   - `to` : remplacer par votre email interne (ex : `marius@transferai.africa`)
   ```
   from: "prospection@transferai.africa"
   to: ["marius@transferai.africa"]
   ```

**Pour les tests :** utiliser `onboarding@resend.dev` en `from` et votre propre email en `to`.

---

### Nœud 24 — `Approval Webhook`

**Rôle :** Reçoit le clic sur Approuver ou Rejeter depuis l'email.

**Ce qu'il faut configurer :**

1. Cliquer sur le nœud `Approval Webhook`
2. Le chemin est déjà configuré : `/approve-prospect-pack`
3. **Activer le workflow** (toggle en haut) pour que le webhook devienne actif
4. L'URL complète du webhook sera :
   ```
   https://VOTRE_N8N/webhook/approve-prospect-pack
   ```
5. Vérifier que `HTTP Method = GET` et `Response Mode = Last Node`

> ⚠️ **Important :** Le webhook ne fonctionne que si le workflow est **activé** (toggle bleu en haut). En test, utiliser **Execute workflow** depuis le canvas pour déclencher la partie génération, puis activer le workflow pour que le webhook réponde aux clics email.

---

### Nœud 26 — `Get Pack From Supabase`

**Rôle :** Récupère le pack depuis Supabase quand le webhook reçoit une décision.

**Ce qu'il faut configurer :**

1. Cliquer sur le nœud `Get Pack From Supabase`
2. Section **URL** → remplacer `$env.SUPABASE_URL` par votre URL :
   ```
   https://VOTRE_URL.supabase.co/rest/v1/ai_prospecting_packs?select=*&pack_id=eq.{{pack_id}}
   ```
3. Section **Headers** :
   - `apikey` → `VOTRE_SERVICE_ROLE_KEY`
   - `Authorization` → `Bearer VOTRE_SERVICE_ROLE_KEY`

---

### Nœuds 29 — `Mark Pack Approved` et 33 — `Mark Pack Rejected`

**Rôle :** Met à jour le statut du pack dans Supabase.

**Configurer les deux nœuds de la même façon :**

1. Section **URL** → remplacer `$env.SUPABASE_URL` :
   ```
   https://VOTRE_URL.supabase.co/rest/v1/ai_prospecting_packs?pack_id=eq.{{pack_id}}
   ```
2. Section **Headers** :
   - `apikey` → `VOTRE_SERVICE_ROLE_KEY`
   - `Authorization` → `Bearer VOTRE_SERVICE_ROLE_KEY`
3. Vérifier `Method = PATCH`

---

### Nœud 30 — `Send External Prospect Email`

**Rôle :** Envoie le courrier exécutif au prospect si approuvé.

**Ce qu'il faut configurer :**

1. Cliquer sur le nœud `Send External Prospect Email`
2. Section **Headers** :
   - `Authorization` → `Bearer re_VOTRE_CLE_RESEND`
3. Section **Body** → remplacer `from` :
   ```
   "from": "prospection@transferai.africa"
   ```
   *(doit être un domaine vérifié dans Resend)*

> Le champ `to` utilise `$json.target_email` — il prend automatiquement l'email saisi dans `Set Target`. Pas de modification nécessaire.

---

### Nœud 31 — `Log Outreach Attempt`

**Rôle :** Journalise l'envoi dans `outreach_attempts`.

**Ce qu'il faut configurer :**

1. Section **URL** → remplacer `$env.SUPABASE_URL` :
   ```
   https://VOTRE_URL.supabase.co/rest/v1/outreach_attempts
   ```
2. Section **Headers** :
   - `apikey` → `VOTRE_SERVICE_ROLE_KEY`
   - `Authorization` → `Bearer VOTRE_SERVICE_ROLE_KEY`

---

## ÉTAPE 4 — Ajouter `target_email` dans Set Target

Le nœud `Set Target` doit avoir un champ `target_email` avec l'email du décideur.

1. Ouvrir `Set Target`
2. Vérifier que le champ `target_email` existe et contient une vraie adresse :
   ```
   target_email = contact@orange.ci
   ```
3. Pour les tests → utiliser **votre propre email** pour recevoir le courrier test

---

## ÉTAPE 5 — Activer le workflow

1. Dans n8n, cliquer le **toggle** en haut à droite du canvas
2. Le workflow doit passer en bleu (**Active**)
3. Cela active le `Approval Webhook` pour qu'il réponde aux clics email

---

## ÉTAPE 6 — Tester le workflow V2

### Test complet

1. Modifier `Set Target` avec un prospect test :
   - `website = https://www.mtn.ci`
   - `organization_name = MTN Côte d'Ivoire`
   - `target_email = VOTRE_PROPRE_EMAIL` (pour recevoir le courrier test)
2. Cliquer **Execute workflow** (depuis le Manual Trigger)
3. Attendre la fin de l'exécution (environ 30 secondes)
4. **Vérifier votre boîte email** → vous devriez recevoir l'email d'approbation interne
5. Cliquer **Approuver l'envoi** dans l'email
6. Vérifier votre boîte email → le courrier prospect doit arriver
7. Dans Supabase → Table Editor → `ai_prospecting_packs` → vérifier le statut `sent`

### Vérifications dans Supabase

| Table | Ce qu'on doit voir après test |
|---|---|
| `ai_prospecting_packs` | 1 ligne avec `status = sent` et `sent_at` renseigné |
| `outreach_attempts` | 1 ligne avec `channel = email` et `sent_at` |

---

## Récapitulatif des informations à collecter

Avant de commencer, préparer ce tableau :

| Information | Valeur | Où la trouver |
|---|---|---|
| Supabase Project URL | `https://xxxx.supabase.co` | Supabase → Settings → API |
| Supabase service_role key | `eyJhbGci...` | Supabase → Settings → API |
| Resend API Key | `re_xxxxxxxx` | Resend → API Keys |
| Email d'envoi vérifié | `prospection@transferai.africa` | Resend → Domains |
| Email interne approbation | `marius@transferai.africa` | Votre email |
| URL n8n publique | `https://n8n-pxlk.srv...` | Barre d'adresse n8n |
| Clé API OpenAI | `{{$env.OPENAI_API_KEY}}` | Déjà utilisée en V1 via variable d'environnement |

---

## Ordre de configuration recommandé

```
1. Créer Supabase + exécuter le SQL des tables
2. Créer compte Resend + noter la clé API
3. Générer le JSON V2 corrigé
4. Importer dans n8n
5. Configurer Store Pack In Supabase (URL + clés)
6. Configurer Build Approval Email (URL n8n)
7. Configurer Send Internal Approval Email (Resend + emails)
8. Configurer Get Pack / Mark Approved / Mark Rejected (URL Supabase)
9. Configurer Send External Prospect Email (Resend)
10. Configurer Log Outreach Attempt (URL Supabase)
11. Ajouter target_email dans Set Target
12. Activer le workflow
13. Tester de bout en bout
```

---

## 61_Guide_V5_CRM_Growth_Loop

Source : `docs/transferai-admin/61_Guide_V5_CRM_Growth_Loop.md`

# Workflow V5 - Boucle de croissance CRM

## Fichier

- [60_n8n_Prospection_CRM_V5_Growth_Loop.json](./60_n8n_Prospection_CRM_V5_Growth_Loop.json)

## Objectif

La V5 a pour rôle de faire grandir la base CRM en continu.

Elle permet de :

- recevoir des leads publics scrappés
- les normaliser
- les injecter dans `prospect_targets`
- les pré-scorrer par priorité commerciale
- préparer le terrain pour la V4

## Ce que fait la V5

La V5 n’envoie pas elle-même les courriers de prospection.

Elle s’occupe de la couche amont :

1. ingestion des leads
2. normalisation
3. validation minimale
4. upsert dans le CRM
5. déclenchement optionnel de la V4
6. synthèse du run

## Déclencheurs

La V5 peut démarrer de trois façons :

- `Manual Trigger`
- `Daily CRM Growth Schedule`
- `Scraped Leads Webhook`

## Variables recommandées

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SCRAPED_PUBLIC_LEADS_CSV_URL`
- `N8N_CHILD_WORKFLOW_ID_V4`
- `N8N_CHILD_WORKFLOW_ID_V3`
- `BOOKING_LINK_45MIN`

## Nœuds principaux

### 1. `Set CRM Growth Config`

Définit :

- le backend CRM
- l’URL du flux scrappé
- l’option de dispatch vers la V4
- l’identifiant de la V3 enrichie à relayer vers la V4
- les paramètres batch à transmettre à la V4
- les valeurs par défaut métier

### 2. `If Direct Lead Payload`

Décide si la V5 reçoit :

- des leads directement via webhook
- ou un flux CSV à aller chercher

### 3. `Fetch Scraped Leads CSV`

Charge un export CSV de leads publics si aucun payload direct n’est fourni.

### 4. `Normalize Inbound Leads`

Transforme les leads entrants vers le format prospect canonique :

- `prospect_id`
- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `target_email`
- `custom_page_paths_csv`
- `commercial_priority_default`
- `research_scope`

### 5. `Filter Valid Leads`

Ne laisse passer que les leads qui ont au minimum :

- `organization_name`
- `website`

### 6. `Prepare CRM Upserts`

Ajoute les champs CRM de pilotage :

- `status = ready` si `target_email` est disponible
- `status = draft` si `target_email` manque
- `paused = false`
- `do_not_contact = false`
- `outreach_attempt_count`
- `last_response_status`
- `last_sequence_result`
- `niche_status`
- `next_action_at`

La V5 calcule désormais aussi une priorité simple :

- `tier1` : lead inbound ou très complet
- `tier2` : lead exploitable mais moins qualifié
- `tier3` : lead incomplet

### 7. `Upsert Prospects Into CRM`

Insère ou met à jour les leads dans :

- `prospect_targets`

La V5 fait donc apparaître le CRM ici de manière explicite.

### 8. `Build CRM Import Summary`

Construit un résumé du lot importé :

- nombre de leads importés
- ids importés
- option de dispatch
- `child_workflow_id_v4`
- `child_workflow_id_v3`
- `child_workflow_label_v3`
- `batch_fetch_limit`
- `daily_send_limit`
- `max_attempts_per_prospect`
- `min_confidence_score`
- `batch_run_label`

### 9. `If Dispatch To V4`

Si activé, la V5 déclenche la V4 à la fin.

### 10. `Execute V4 Batch Workflow`

Lance l’orchestrateur V4 après mise à jour du CRM.

La V5 lui transmet désormais aussi les paramètres utiles pour la suite :

- le workflow V3 enfant à appeler
- le label de cette V3 enrichie
- les quotas batch
- le lien de réservation

### 11. `Fetch CRM Ready Snapshot`

Compte les prospects actuellement prêts dans la file CRM.

### 12. `Fetch Today Outreach Snapshot`

Compte les tentatives d’envoi du jour.

### 13. `Build End Of Run Summary`

Produit :

- `imported_count`
- `crm_ready_count`
- `outreach_today_count`
- `dispatch_to_v4`
- `child_workflow_id_v4`
- `child_workflow_id_v3`
- `child_workflow_label_v3`
- `batch_fetch_limit`
- `daily_send_limit`
- `next_step`

## Où le CRM apparaît dans la V5

Le CRM apparaît à trois endroits clés :

1. dans la table cible `prospect_targets`
2. dans les champs CRM enrichis avant l’upsert
3. dans la lecture de l’état CRM en fin de run

Donc la V5 ne traite pas seulement des leads.
Elle construit un CRM exploitable.

Elle évite aussi qu’un lead sans `target_email` parte dans la file d’envoi.

## Logique d’échelle 100 sociétés

Pour atteindre 100 sociétés et plus :

1. le scraping quotidien remplit la V5
2. la V5 remplit `prospect_targets`
3. la V4 lit `prospect_targets`
4. la V3 traite les prospects retenus

Ainsi :

- le CRM grossit chaque jour
- le batch reste contrôlé
- la prospection reste limitée par quotas

## Recommandation d’exploitation

Pour démarrer proprement :

1. utiliser `Supabase` comme CRM maître
2. faire entrer tous les leads scrappés via V5
3. garder `V4` comme filtre de volume
4. garder `V3` comme moteur de prospection sortante

## Résumé simple

- `V5` fait entrer les sociétés dans le CRM
- `V4` choisit lesquelles traiter
- `V3` prépare et envoie l’approche commerciale

---

## 68_Guide_Utilisateur_Prospection_V3_CRM_Audit_Dynamique

Source : `docs/transferai-admin/68_Guide_Utilisateur_Prospection_V3_CRM_Audit_Dynamique.md`

# Guide Utilisateur - Workflow Prospection V3 CRM + Audit Dynamique

## 1. Objet du document

Ce guide est la référence opérationnelle du workflow :

- [73_TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/73_TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed.json)

Il explique, en français standard, ce que fait chaque nœud, comment le configurer, ce qui a évolué depuis les premières versions, et dans quel ordre exécuter le projet.

Ce guide couvre :

1. l’historique fonctionnel V1 à aujourd’hui
2. l’architecture générale
3. les prérequis
4. le rôle et la configuration de chaque nœud
5. les changements récents autour du formulaire d’audit dynamique
6. l’ordre d’exécution recommandé

---

## 2. Historique utile du projet

### V1

La V1 permettait surtout de :

- qualifier un prospect
- générer des contenus commerciaux
- envoyer une proposition simple

Limites de la V1 :

- pas de stockage structuré complet dans Supabase
- pas de parcours d’approbation robuste
- pas de lien d’audit dynamique par prospect

### V2

La V2 a ajouté :

- la persistance en base
- l’approbation avant envoi
- un meilleur contrôle commercial

Limites de la V2 :

- le formulaire d’audit restait générique
- le lien du formulaire n’était pas individualisé

### V3 CRM Enhanced

La V3 actuelle ajoute :

- une logique CRM plus cohérente
- la génération d’un `pack_id`
- la construction d’un `audit_form_url`
- un pack prospect complet stocké dans Supabase
- un parcours d’approbation avant envoi
- une base prête pour le formulaire d’audit dynamique

### Version actuelle enrichie audit dynamique

Les évolutions récentes portent sur :

- le remplacement du lien générique du formulaire par un lien dynamique
- la préparation du nouveau formulaire premium côté frontend
- la remontée d’une recommandation de service TransferAI après soumission
- le déclenchement automatique du workflow post-audit

### Position actuelle du projet

À date :

- la `V3` est considérée comme terminée pour la phase **avant audit**
- le formulaire d’audit dynamique est branché de bout en bout
- le post-audit est désormais pris en charge par le workflow :
  [74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json)

---

## 3. Vue d’ensemble du workflow

Le workflow complet comporte quatre grandes phases :

1. qualification et lecture du prospect
2. génération des contenus du pack
3. stockage et validation interne
4. approbation puis envoi au prospect

Le formulaire d’audit dynamique intervient ensuite comme couche complémentaire :

1. le prospect clique sur un lien d’audit personnalisé
2. il remplit le formulaire
3. Supabase enregistre les réponses
4. une recommandation de service TransferAI est calculée
5. `save-form-response` déclenche automatiquement le webhook post-audit quand la complétion atteint `80%` ou plus
6. le workflow post-audit produit la fiche pré-RDV et alimente la table de suivi

---

## 4. Pré-requis de configuration

Avant d’utiliser le workflow, les éléments suivants doivent être prêts.

### 4.1 Services nécessaires

- n8n
- Supabase
- OpenAI
- Resend
- frontend du site `audit.transferai.ci`

### 4.2 Variables d’environnement clés

Pour la chaîne complète V3 + post-audit, les variables suivantes doivent être prêtes :

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `N8N_POST_AUDIT_WEBHOOK_URL`
- `POST_AUDIT_INTERNAL_EMAIL`
- `BOOKING_LINK_45MIN`

Variables optionnelles utiles :

- `POST_AUDIT_ROUTING_MAP_JSON`
- `POST_AUDIT_SLACK_WEBHOOK_URL`
- `POST_AUDIT_N8N_WEBHOOK_BEARER_TOKEN`
- `POST_AUDIT_NEXT_ACTION_DELAY_DAYS`

### 4.3 Variables métier minimales attendues

Le workflow manipule au minimum :

- `prospect_id`
- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `target_email`
- `custom_page_paths_csv`
- `booking_link_45min`
- `commercial_priority_default`
- `research_scope`
- `source_backend`
- `source_label`
- `raw_source_id`
- `niche_status`
- `last_response_status`
- `last_sequence_result`
- `prospect_language`

### 4.4 Recommandation de sécurité

Ne laissez pas en production les secrets en clair dans les nœuds :

- OpenAI API key
- Supabase service role key
- Resend API key

Ils doivent être placés dans :

- les Credentials n8n
- ou les variables d’environnement

---

## 5. Ordre d’exploitation recommandé

L’ordre recommandé est le suivant :

1. préparer ou recevoir les données prospect
2. lancer la génération du pack
3. stocker le pack en base
4. valider le pack en interne
5. approuver ou rejeter
6. envoyer au prospect si approuvé
7. attendre la soumission du formulaire d’audit
8. traiter ensuite le post-audit

---

## 6. Guide nœud par nœud

## 6.1 Déclencheurs

### `Manual Trigger`

**Rôle**

- lancer le workflow à la main

**Quand l’utiliser**

- test manuel
- démonstration
- recette fonctionnelle

### `Execute Workflow Trigger`

**Rôle**

- permettre un appel par un autre workflow n8n

**Quand l’utiliser**

- intégration CRM
- appels batch depuis un workflow parent

---

## 6.2 Préparation des données prospect

### `Set Target`

**Type**

- `Set`

**Rôle**

- normaliser les champs entrants du prospect
- fixer les valeurs minimales utilisées par les nœuds suivants

**Points de configuration importants**

- `website` doit être une vraie URL ou une chaîne vide
- ne jamais mettre `auto` dans `website`

**Valeur recommandée pour `website`**

```js
{{$json.website || ''}}
```

**Pourquoi ce nœud est critique**

Parce qu’il fixe les données de base qui serviront à :

- construire les URLs publiques
- appeler les modèles OpenAI
- générer la lettre
- stocker le pack

---

### `Build Source URLs`

**Type**

- `Code`

**Rôle**

- construire jusqu’à 5 URLs publiques à analyser
- partir du site web du prospect
- prioriser certaines pages : `/`, `/a-propos/`, `/services/`, etc.

**Entrées utilisées**

- `website`
- `custom_page_paths_csv`

**Sorties produites**

- `source_pages`
- `page_1_url`
- `page_2_url`
- `page_3_url`
- `page_4_url`
- `page_5_url`

**Point de vigilance**

Si `website` est vide, les nœuds `Fetch Public Page` échouent ensuite.

---

### `Fetch Public Page 1`
### `Fetch Public Page 2`
### `Fetch Public Page 3`
### `Fetch Public Page 4`
### `Fetch Public Page 5`

**Type**

- `HTTP Request`

**Rôle**

- récupérer le contenu HTML brut des pages publiques identifiées

**Configuration**

- `Method = GET`
- `Response format = text`
- `Never Error = true`

**Pourquoi il y en a cinq**

Le workflow lit plusieurs pages pour :

- comprendre l’activité du prospect
- capter les mots-clés métier
- enrichir la qualification

---

### `Normalize Public Signals`

**Type**

- `Code`

**Rôle**

- nettoyer les pages HTML
- transformer le HTML en texte lisible
- agréger les extraits utiles
- produire des indices métiers et ROI

**Sorties importantes**

- `page_texts`
- `public_text`
- `roi_clues`

---

### `Sanitize Prospect Data For LLM`

**Type**

- `Code`

**Rôle**

- préparer une version pseudonymisée et contrôlée des données
- limiter l’exposition d’informations sensibles avant appel OpenAI

**Sorties importantes**

- `llm_allowed_payload`
- `llm_generation_payload`
- `llm_redaction_summary`

---

## 6.3 Qualification et enrichissement IA

### `Call OpenAI Pre-Audit`

**Type**

- `HTTP Request`

**Rôle**

- générer une première lecture structurée du prospect
- proposer les hypothèses initiales d’analyse

**Sorties attendues**

- type d’organisation
- contexte métier
- besoins probables
- premiers angles d’audit

---

### `Call OpenAI Problems Solutions`

**Type**

- `HTTP Request`

**Rôle**

- relier les signaux publics à des problèmes probables
- faire émerger des quick wins et des cas d’usage crédibles

**Sorties attendues**

- `probable_problems`
- `probable_quick_wins`
- `recommended_use_case`
- `best_selling_use_case`

---

### `Call OpenAI ROI`

**Type**

- `HTTP Request`

**Rôle**

- produire des hypothèses prudentes de gains, de ROI, d’amélioration de service et de temps économisé

**Sorties attendues**

- `roi_hypothesis`
- `expected_time_savings`
- `expected_service_improvements`
- `expected_quick_wins`

---

### `Assemble Prospect Context`

**Type**

- `Code`

**Rôle**

- fusionner les données prospect, les signaux publics et les sorties OpenAI
- produire un contexte métier unique et propre

**Sorties importantes**

- `organization_summary`
- `entry_point_niche`
- `recommended_offer`
- `recommended_training_bundle`
- `commercial_priority_tier`
- `recommended_meeting_angle`
- `sector_pitches`

---

## 6.4 Génération des contenus du pack

### `Generate Executive Letter`

**Type**

- `HTTP Request`

**Rôle**

- produire le courrier exécutif principal

**Évolution récente**

Avant :

- le prompt utilisait un lien fixe vers `https://audit.transferai.ci/`

Maintenant :

- il utilise un token dynamique `{{AUDIT_FORM_URL}}`

**But**

- chaque prospect reçoit un lien d’audit individualisé

---

### `Generate Tailored Catalogue`

**Type**

- `HTTP Request`

**Rôle**

- produire un mini-catalogue ciblé par secteur et par besoin

**Contenu attendu**

- synthèse exécutive
- priorités métier
- cas d’usage
- formation
- gouvernance
- accompagnement

---

### `Generate Tailored Audit Form`

**Type**

- `HTTP Request`

**Rôle**

- générer une version texte / conceptuelle du formulaire d’audit ciblé

**Note**

Le vrai formulaire dynamique frontend va plus loin que ce texte.

---

### `Generate Deck Brief`

**Type**

- `HTTP Request`

**Rôle**

- générer le brief structuré du deck PowerPoint prospect

**Sortie**

- JSON propre avec objectifs, messages, cas d’usage, timeline et CTA

---

## 6.5 Construction du pack dynamique

### `Assemble Prospect Pack`

**Type**

- `Code`

**Rôle**

- construire le pack final
- générer le `pack_id`
- créer `audit_form_url`
- hydrater les tokens
- produire `executive_letter_html`

**Changement majeur**

Ce nœud remplace désormais :

- `{{ORGANIZATION_NAME}}`
- `{{DECISION_MAKER_NAME}}`
- `{{WEBSITE}}`
- `{{AUDIT_FORM_URL}}`

**Sorties critiques**

- `pack_id`
- `audit_form_url`
- `executive_letter`
- `executive_letter_html`
- `tailored_catalogue`
- `tailored_audit_form`
- `deck_brief`

---

## 6.6 Stockage et revue interne

### `Store Pack In Supabase`

**Type**

- `HTTP Request`

**Rôle**

- enregistrer le pack complet dans `ai_prospecting_packs`

**Configuration logique**

- `payload: $json` doit être conservé

**Pourquoi c’est important**

Parce que tout le flux d’approbation relit ensuite ce `payload`.

---

### `Build Approval Email`

**Type**

- `Code`

**Rôle**

- construire l’email de validation interne

**Ce qu’il affiche**

- organisation
- email cible
- cas d’usage
- offre recommandée
- tier commercial
- lien dynamique du formulaire
- pack id
- liens d’approbation et de rejet

---

### `Send Internal Approval Email`

**Type**

- `HTTP Request`

**Rôle**

- envoyer l’email de revue interne via Resend

---

## 6.7 Parcours d’approbation

### `Approval Webhook`

**Type**

- `Webhook`

**Rôle**

- recevoir la décision `approved` ou `rejected`

**Paramètres attendus**

- `pack_id`
- `decision`

---

### `Parse Approval Query`

**Type**

- `Code`

**Rôle**

- lire les query params du webhook
- normaliser la décision

---

### `Get Pack From Supabase`

**Type**

- `HTTP Request`

**Rôle**

- relire en base le pack correspondant au `pack_id`

---

### `Extract Pack Payload`

**Type**

- `Code`

**Rôle**

- réextraire les champs utiles du `payload`
- réinjecter le pack dans le flux d’envoi

**Champs importants remontés**

- `audit_form_url`
- `recommended_offer`
- `recommended_use_case`
- `commercial_priority_tier`
- `executive_letter_html`

**Point de compréhension**

Ce nœud ne retourne rien tant que le webhook d’approbation n’a pas été exécuté.

---

### `If Approved`

**Type**

- `If`

**Rôle**

- séparer le chemin :
  - approuvé
  - rejeté

---

## 6.8 Préparation de l’envoi externe

### `Build Send Context`

**Type**

- `Code`

**Rôle**

- reconstruire les pièces jointes
- valider le minimum d’envoi
- propager `audit_form_url`

**Ce que ce nœud vérifie**

- email cible présent
- lettre non vide
- exactement 2 pièces jointes
- 1 PDF
- 1 PPTX

**Sorties clés**

- `attachments`
- `attachments_count`
- `can_send`
- `send_failure_reason`

---

### `If Ready To Send`

**Type**

- `If`

**Rôle**

- envoyer seulement si le contexte est complet

---

### `Mark Pack Approved`

**Type**

- `HTTP Request`

**Rôle**

- marquer le pack comme approuvé avant l’envoi effectif

---

## 6.9 Envoi au prospect

### `Send External Prospect Email`

**Type**

- `HTTP Request`

**Rôle**

- envoyer au prospect :
  - la lettre exécutive
  - le mini-catalogue
  - le deck

**Point essentiel**

La lettre envoyée doit désormais contenir le vrai lien :

- `https://audit.transferai.ci/questionnaire-audit?pack_id=...`

---

### `Parse Send Result`

**Type**

- `Code`

**Rôle**

- relire la réponse Resend
- extraire l’identifiant du message
- horodater l’envoi

---

### `Mark Pack Sent`

**Type**

- `HTTP Request`

**Rôle**

- mettre à jour la ligne Supabase après envoi réussi

**Mise à jour attendue**

- `status = sent`
- `sent_at`
- `resend_message_id`

---

### `Log Outreach Attempt`

**Type**

- `HTTP Request`

**Rôle**

- tracer l’envoi dans la table d’historique des tentatives

---

### `Send Internal Sent Confirmation`

**Type**

- `HTTP Request`

**Rôle**

- envoyer une confirmation interne que le pack a bien été envoyé

---

## 6.10 Gestion des erreurs et des cas alternatifs

### `Mark Pack Approval Error`

**Rôle**

- marquer un pack en erreur si le chemin d’approbation échoue

### `Mark Pack Rejected`

**Rôle**

- marquer le pack comme rejeté

### `Update Prospect Target Sent`

**Rôle**

- refléter l’état “envoyé” dans la table CRM du prospect

### `Update Prospect Target Approval Error`

**Rôle**

- refléter l’erreur d’approbation dans la cible CRM

### `Update Prospect Target Rejected`

**Rôle**

- refléter le rejet dans la cible CRM

### `Respond to Webhook`
### `Respond Rejected`
### `Respond Approval Error`

**Rôle**

- renvoyer une réponse HTTP lisible à l’appelant du webhook

---

## 6.11 Génération des artefacts

### `Resolve Domain Catalogue`

**Rôle**

- choisir la variante catalogue la plus cohérente avec le domaine et le contexte

### `Build Catalogue Render Payload`

**Rôle**

- préparer toutes les données d’entrée du moteur de rendu catalogue

**Point important**

Ce nœud transporte aussi :

- `audit_form_url`
- `calendly_url`

### `render Catalogue Artifact`

**Rôle**

- appeler le service de rendu du mini-catalogue

### `Merge Catalogue Artifact`

**Rôle**

- réinjecter l’artefact catalogue dans le pack

### `Build Deck Render Payload`

**Rôle**

- préparer les données du deck PowerPoint

### `Render Deck Artifact`

**Rôle**

- appeler le moteur de rendu du deck

### `Merge Deck Artifact`

**Rôle**

- réinjecter l’artefact deck dans le pack

---

## 7. Ce qui a été configuré récemment

Les changements récemment opérés sont les suivants :

1. correction du champ `website` dans `Set Target`
2. vérification de `Build Source URLs`
3. mise à jour de `Generate Executive Letter`
4. mise à jour de `Assemble Prospect Pack`
5. validation de `Store Pack In Supabase`
6. validation de `Build Approval Email`
7. préparation de `Extract Pack Payload`
8. préparation de `Build Send Context`
9. préparation de `Send External Prospect Email`
10. préparation de `Mark Pack Sent`
11. ajout du schéma post-audit via `20260605150000_post_audit_schema.sql`
12. mise à jour de `save-form-response` pour persister `pack_id` et `context_snapshot`
13. déclenchement automatique du webhook n8n post-audit quand `completionPercentage >= 80`
14. création de la table de suivi `post_audit_follow_ups`

---

## 8. Lien avec le nouveau formulaire d’audit

Le nouveau formulaire premium du repo est préparé dans :

- [src/pages/ProspectAuditFormPage.tsx](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/src/pages/ProspectAuditFormPage.tsx)
- [src/lib/prospect-audit.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/src/lib/prospect-audit.ts)

La logique Supabase liée au formulaire est préparée dans :

- [supabase/functions/resolve-invitation/index.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/supabase/functions/resolve-invitation/index.ts)
- [supabase/functions/save-form-response/index.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/supabase/functions/save-form-response/index.ts)
- [supabase/functions/_shared/prospect-audit-context.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/supabase/functions/_shared/prospect-audit-context.ts)

Aujourd’hui :

- le workflow email sait déjà envoyer un lien dynamique
- le frontend d’audit utilise la chaîne `resolve-invitation` + `save-form-response`
- le workflow post-audit peut être déclenché automatiquement
- la table `post_audit_follow_ups` permet le suivi non-tech
- le domaine public et la chaîne post-audit peuvent être testés de bout en bout

---

## 9. Étapes recommandées après ce guide

Le build principal étant en place, les prochaines étapes recommandées sont :

1. tester le flux complet `V3 -> formulaire -> post-audit`
2. valider la création de `post_audit_follow_ups`
3. valider l’email expert et, si activé, l’alerte Slack
4. vérifier l’idempotence en cas de resoumission
5. monitorer les premiers cas réels en production

---

## 10. Références utiles

- [implementation-audit-dynamique-workflow.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/implementation-audit-dynamique-workflow.md)
- [modele-fiche-pre-rdv-audit-trilingue.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/modele-fiche-pre-rdv-audit-trilingue.md)
- [n8n-orientation-service-post-audit.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/n8n-orientation-service-post-audit.md)
- [71_Guide_Utilisateur_Workflow_Post_Audit_CRM_Aware.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/71_Guide_Utilisateur_Workflow_Post_Audit_CRM_Aware.md)
- [74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json)

---

## 69_Guide_Troubleshooting_Prospection_V3_CRM_Audit_Dynamique

Source : `docs/transferai-admin/69_Guide_Troubleshooting_Prospection_V3_CRM_Audit_Dynamique.md`

# Guide de Troubleshooting - Prospection V3 CRM + Audit Dynamique

## 1. Objet

Ce document recense les problèmes les plus fréquents rencontrés pendant l’implémentation et l’exploitation du workflow :

- [73_TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/73_TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed.json)
- [74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json)

Il doit servir de guide rapide de diagnostic et de correction.

---

## 2. Principe général de diagnostic

Quand un nœud ne fonctionne pas, il faut toujours vérifier dans cet ordre :

1. le nœud amont a-t-il vraiment été exécuté
2. les champs attendus sont-ils présents
3. la structure JSON a-t-elle changé
4. le nœud est-il dans le bon parcours du workflow
5. le service externe appelé répond-il correctement

---

## 3. Problèmes fréquents et correctifs

## 3.1 `Fetch Public Page 1` retourne `Invalid URL`

### Symptôme

Le nœud affiche :

- `Invalid URL`
- `URL must start with "http" or "https"`

### Cause la plus probable

Le champ `website` est vide ou mal renseigné dans `Set Target`.

### Vérification

Dans `Set Target`, regardez la valeur de :

- `website`

### Correctif

Utiliser :

```js
{{$json.website || ''}}
```

Ne jamais utiliser :

- `auto`
- une valeur non-URL

### Point complémentaire

Si vous êtes en test manuel, vous pouvez temporairement utiliser une vraie URL.

---

## 3.2 `Build Source URLs` produit des URLs vides

### Symptôme

Les champs :

- `page_1_url`
- `page_2_url`
- etc.

sont vides.

### Cause

Le champ `website` n’est pas disponible à l’entrée.

### Correctif

Corriger d’abord :

- `Set Target`

Puis réexécuter :

- `Build Source URLs`

---

## 3.3 La lettre contient encore `{{AUDIT_FORM_URL}}`

### Symptôme

Dans l’email reçu, on voit :

- `{{AUDIT_FORM_URL}}`

au lieu du vrai lien.

### Cause

`Generate Executive Letter` a bien produit le token, mais `Assemble Prospect Pack` ne l’a pas remplacé.

### Correctif

Vérifier que `Assemble Prospect Pack` :

1. génère `pack_id`
2. construit `audit_form_url`
3. remplace `{{AUDIT_FORM_URL}}`

### Contrôle attendu

Dans la sortie de `Assemble Prospect Pack`, `executive_letter` doit déjà contenir :

- `https://audit.transferai.ci/questionnaire-audit?pack_id=...`

---

## 3.4 `Store Pack In Supabase` fonctionne mais le lien n’apparaît pas ensuite

### Symptôme

Le pack est stocké, mais les nœuds aval ne retrouvent pas le lien.

### Cause

Le `payload` stocké ne contient pas la bonne version de `audit_form_url`.

### Correctif

Vérifier que `Store Pack In Supabase` conserve bien :

```js
payload: $json
```

et que l’entrée du nœud contient déjà :

- `audit_form_url`

---

## 3.5 `Build Approval Email` ne montre pas le lien du formulaire

### Symptôme

Le résumé interne ne contient pas le lien d’audit.

### Cause

Le résumé HTML n’utilise pas `pack.payload.audit_form_url`.

### Correctif

Ajouter dans le résumé :

```js
'Lien formulaire: ' + escapeHtml(safe(pack.payload && pack.payload.audit_form_url, 'a confirmer'))
```

---

## 3.6 `Extract Pack Payload` n’affiche rien

### Symptôme

Le nœud montre :

- `No output data`

### Cause réelle

Le nœud n’est pas en panne.

Il attend des données venant de :

- `Approval Webhook`
- `Parse Approval Query`
- `Get Pack From Supabase`

### Ce qu’il faut comprendre

`Extract Pack Payload` fait partie du parcours d’approbation, pas du parcours de génération initiale.

### Correctif

Déclencher le chemin d’approbation :

1. récupérer `approve_url` dans `Build Approval Email`
2. ouvrir ce lien
3. laisser le webhook alimenter `Extract Pack Payload`

---

## 3.7 `Build Send Context` produit `can_send = false`

### Symptôme

Le nœud retourne :

- `can_send = false`

### Causes possibles

1. `target_email` manquant
2. lettre vide
3. pas assez de pièces jointes
4. pas de PDF
5. pas de PPTX

### Vérifications

Contrôler :

- `attachments_count`
- `attachments`
- `executive_letter`
- `target_email`

### Correctif

S’assurer que :

- `catalogue_artifact.pdf_url` existe
- `deck_artifact.pptx_url` existe
- le prospect a un email valide

---

## 3.8 L’email au prospect part sans les pièces jointes

### Symptôme

L’email est reçu mais sans PDF ou sans PPTX.

### Causes possibles

1. `mail_attachments` vide
2. les artefacts n’ont pas été fusionnés
3. les URLs des artefacts sont absentes

### Correctif

Vérifier dans :

- `Merge Catalogue Artifact`
- `Merge Deck Artifact`
- `Build Send Context`

que les pièces jointes sont bien reconstruites.

---

## 3.9 `Mark Pack Sent` n’actualise pas le statut

### Symptôme

Le message est envoyé, mais Supabase ne reflète pas `status = sent`.

### Causes possibles

1. `pack_id` absent
2. `resend_id` absent
3. l’URL Supabase du `PATCH` est mauvaise

### Correctif

Vérifier :

- `pack_id`
- `sent_at`
- `resend_id`

et l’URL :

```js
https://.../ai_prospecting_packs?pack_id=eq....
```

---

## 3.10 Le formulaire public en ligne ne ressemble pas au nouveau formulaire local

### Symptôme

Le domaine `audit.transferai.ci` montre encore une ancienne interface.

### Cause

Le site public pointe encore vers l’ancienne build.

### Correctif

Déployer la nouvelle build frontend du repo vers le domaine public.

### À retenir

- la version locale peut être en avance
- la production n’est pas mise à jour automatiquement

---

## 3.11 Le formulaire local montre une erreur `Missing invite token`

### Symptôme

Le formulaire charge le shell mais affiche :

- `Missing invite token`

### Cause

Le navigateur affiche un ancien bundle ou le `pack_id` n’existe pas en base.

### Correctif possible

1. utiliser le mode aperçu local
2. forcer un nouveau `_reload`
3. recharger complètement le navigateur

---

## 3.12 `website` affiché comme `auto`

### Symptôme

Dans `Set Target`, `website` renvoie :

- `auto`

### Pourquoi c’est un problème

`website` doit être une vraie URL, sinon toute la lecture des pages publiques échoue.

### Correctif

Utiliser :

```js
{{$json.website || ''}}
```

et jamais :

```js
{{$json.website || 'auto'}}
```

---

## 3.13 Le prospect reçoit l’ancienne URL générique du formulaire

### Symptôme

Le courrier contient encore :

- `https://audit.transferai.ci/`

### Cause

Le prompt de `Generate Executive Letter` n’a pas été mis à jour.

### Correctif

Le prompt doit utiliser :

- `{{AUDIT_FORM_URL}}`

et non une URL statique.

---

## 3.14 Le parcours d’approbation ne déclenche rien

### Symptôme

Le clic sur le lien d’approbation ne donne aucun effet visible.

### Vérifications

1. le workflow est-il activé
2. le webhook pointe-t-il vers la bonne URL
3. le `pack_id` existe-t-il en base
4. la décision envoyée est-elle bien `approved` ou `rejected`

### Correctif

Tester l’URL complète :

```text
.../webhook/approve-prospect-pack-v3?pack_id=...&decision=approved
```

---

## 3.15 Le formulaire est soumis mais aucune fiche pré-RDV n’est produite

### Symptôme

Le formulaire est bien soumis, mais :

- aucun run n8n post-audit ne démarre
- aucune fiche pré-RDV n’est produite
- aucun email expert n’est envoyé

### Cause

Les causes les plus fréquentes sont :

1. `N8N_POST_AUDIT_WEBHOOK_URL` absent
2. le workflow `74` n’est pas importé ou pas actif
3. la soumission n’a pas atteint `completionPercentage >= 80`
4. `save-form-response` n’est pas déployé avec la bonne version

### Correctif

Vérifier dans cet ordre :

1. la variable `N8N_POST_AUDIT_WEBHOOK_URL`
2. l’activation du workflow `TransferAI Post-Audit Expert Routing V2`
3. la valeur `is_completed = true` dans `form_responses`
4. le déploiement effectif de `save-form-response`

---

## 3.16 `post_audit_follow_ups` reste vide

### Symptôme

Le workflow post-audit tourne, mais aucune ligne n’est créée dans :

- `post_audit_follow_ups`

### Cause

Les causes probables sont :

1. la migration `20260605150000_post_audit_schema.sql` n’est pas appliquée
2. le nœud `Upsert Follow-Up Tracking` écrit vers une table absente
3. `pack_id` est vide ou invalide

### Correctif

Vérifier :

1. l’existence de la table `post_audit_follow_ups`
2. la présence de `pack_id` dans `form_responses`
3. la présence de `pack_id` dans `ai_prospecting_packs`

---

## 3.17 Le webhook post-audit part plusieurs fois

### Symptôme

Plusieurs runs post-audit sont lancés pour le même prospect.

### Cause

Les causes possibles sont :

1. le formulaire est resoumis plusieurs fois
2. le workflow reconciliation est actif en plus du webhook
3. le contrôle d’idempotence métier n’est pas validé en recette

### Correctif

Contrôler :

1. `form_responses.is_completed`
2. `prospect_targets.last_sequence_result`
3. le comportement de `If Already Post-Audit Processed` dans le workflow `74`

---

## 3.18 Le workflow `74` est importé mais échoue immédiatement

### Symptôme

Le workflow n8n démarre, puis s’arrête sur un nœud HTTP ou sur l’email interne.

### Causes possibles

1. `SUPABASE_URL` absent dans n8n
2. `SUPABASE_SERVICE_ROLE_KEY` absent dans n8n
3. `OPENAI_API_KEY` absent
4. `RESEND_API_KEY` absent
5. `POST_AUDIT_INTERNAL_EMAIL` absent

### Correctif

Renseigner au minimum :

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `POST_AUDIT_INTERNAL_EMAIL`
- `BOOKING_LINK_45MIN`

---

## 4. Procédure de test minimale complète

Pour tester proprement le workflow, suivre cet ordre :

1. vérifier `Set Target`
2. vérifier `Build Source URLs`
3. vérifier `Generate Executive Letter`
4. vérifier `Assemble Prospect Pack`
5. vérifier `Store Pack In Supabase`
6. vérifier `Build Approval Email`
7. ouvrir `approve_url`
8. vérifier `Extract Pack Payload`
9. vérifier `Build Send Context`
10. vérifier `Send External Prospect Email`
11. vérifier `Mark Pack Sent`
12. ouvrir le lien du formulaire avec le `pack_id`
13. soumettre une réponse partielle puis une réponse complète
14. vérifier `form_responses.pack_id` et `form_responses.context_snapshot`
15. vérifier le déclenchement du workflow `74`
16. vérifier `post_audit_follow_ups`
17. vérifier l’email expert

---

## 5. Références utiles

- [68_Guide_Utilisateur_Prospection_V3_CRM_Audit_Dynamique.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/68_Guide_Utilisateur_Prospection_V3_CRM_Audit_Dynamique.md)
- [implementation-audit-dynamique-workflow.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/implementation-audit-dynamique-workflow.md)
- [n8n-orientation-service-post-audit.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/n8n-orientation-service-post-audit.md)
- [71_Guide_Utilisateur_Workflow_Post_Audit_CRM_Aware.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/71_Guide_Utilisateur_Workflow_Post_Audit_CRM_Aware.md)
- [74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json)

---

## 71_Guide_Utilisateur_Workflow_Post_Audit_CRM_Aware

Source : `docs/transferai-admin/71_Guide_Utilisateur_Workflow_Post_Audit_CRM_Aware.md`

# Guide Utilisateur - Workflow Post-Audit CRM-Aware

Référence de workflow actuellement utilisée :

- [74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json)

## 1. Objet du document

Ce document est la référence opérationnelle du workflow post-audit CRM-aware de TransferAI.

Il explique :

- pourquoi ce nouveau workflow existe par rapport à la V3
- ce que fait la V3
- ce que fait le workflow post-audit CRM-aware
- comment le workflow est structuré
- ce que fait chaque nœud
- comment le tester en mode manuel
- ce qui change entre la recette et la production

Ce guide complète le dispositif de prospection existant. Il ne remplace pas le guide V3 principal. Il décrit la couche qui prend le relais après le remplissage du formulaire d’audit.

---

## 2. Pourquoi un nouveau workflow après la V3

### 2.1 Ce que fait la V3

La V3 de prospection CRM Enhanced sert à :

- qualifier un prospect
- lire son site web et son contexte public
- générer un pack commercial personnalisé
- produire une Executive Letter
- produire un mini-catalogue et un brief de présentation
- stocker ce pack dans Supabase
- faire passer le pack par un circuit d’approbation
- envoyer au prospect un email contenant le lien du formulaire d’audit dynamique

En résumé, la V3 gère toute la partie **avant audit** :

1. on prépare l’approche commerciale
2. on envoie le pack prospect
3. on donne au prospect un lien d’audit personnalisé

### 2.2 Limite naturelle de la V3

La V3 ne suffit pas à elle seule pour exploiter la valeur du formulaire d’audit.

Une fois l’email envoyé au prospect, il reste à faire :

- récupérer ses réponses
- relier ces réponses au bon `pack_id`
- relire l’état CRM du prospect
- déterminer l’orientation TransferAI la plus pertinente
- produire une fiche pré-RDV interne pour l’équipe commerciale et l’équipe audit
- mettre à jour le CRM après l’audit

### 2.3 Ce que fait le workflow post-audit CRM-aware

Le nouveau workflow post-audit CRM-aware sert à :

- reprendre la main après la soumission du formulaire
- relire les données déjà générées par la V3
- vérifier si une réponse formulaire existe ou non
- fusionner pack, réponse formulaire et état CRM
- produire une fiche interne de préparation au rendez-vous
- mettre à jour `prospect_targets`
- envoyer cette fiche en interne

En résumé :

- **V3** = envoi vers le prospect
- **Post-audit CRM-aware** = exploitation interne après audit

### 2.4 État actuel du déploiement

Dans la version actuellement déployée :

- `save-form-response` déclenche automatiquement le webhook n8n quand `completionPercentage >= 80`
- la migration `20260605150000_post_audit_schema.sql` ajoute les colonnes et tables nécessaires
- le workflow `74` peut produire la fiche pré-RDV, mettre à jour le CRM et remplir `post_audit_follow_ups`

---

## 3. Vision d’ensemble du workflow post-audit

Le workflow post-audit se lit comme une chaîne de 4 blocs :

1. entrée du workflow
2. lecture des données sources
3. fusion et interprétation métier
4. sortie interne et mise à jour CRM

### 3.1 Entrée

Le workflow peut démarrer de deux manières :

- manuellement pour les tests
- automatiquement via webhook en production

### 3.2 Lecture des données

Le workflow relit trois sources :

- `ai_prospecting_packs`
- `form_responses`
- `prospect_targets`

### 3.3 Fusion métier

Le workflow construit ensuite un contexte consolidé :

- identité du prospect
- statut CRM
- contenu du pack
- réponses du formulaire
- orientation de service TransferAI

### 3.4 Sortie

Le workflow produit ensuite :

- une fiche interne pré-RDV
- une mise à jour CRM
- un email interne
- un résultat final consolidé

---

## 4. Prérequis

Avant d’utiliser ce workflow, les éléments suivants doivent être prêts.

### 4.1 Côté données

Les tables suivantes doivent être disponibles côté Supabase :

- `ai_prospecting_packs`
- `form_responses`
- `form_invitations`
- `prospect_targets`

### 4.2 Migration de base requise

Le schéma doit inclure les colonnes liées à l’audit dynamique, notamment :

- `form_responses.pack_id`
- `form_responses.context_snapshot`
- `form_invitations.pack_id`
- `form_invitations.response_email`
- `form_invitations.response_cc`
- `form_invitations.access_context`
- `post_audit_follow_ups`

### 4.3 APIs externes

Le workflow utilise :

- Supabase REST
- OpenAI
- Resend

### 4.4 Secrets

En production, il faut utiliser :

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `N8N_POST_AUDIT_WEBHOOK_URL`
- `POST_AUDIT_INTERNAL_EMAIL`
- `BOOKING_LINK_45MIN`

Variables optionnelles utiles :

- `POST_AUDIT_ROUTING_MAP_JSON`
- `POST_AUDIT_SLACK_WEBHOOK_URL`
- `POST_AUDIT_N8N_WEBHOOK_BEARER_TOKEN`
- `POST_AUDIT_NEXT_ACTION_DELAY_DAYS`

Pendant la recette, il est possible de tester avec des valeurs en dur dans les nœuds.

---

## 5. Structure générale du workflow

Le workflow recommandé comporte les nœuds suivants :

1. `Manual Trigger`
2. `Audit Completed Webhook`
3. `Set Post-Audit Manual Input`
4. `Parse Post-Audit Webhook`
5. `Normalize Post-Audit Request`
6. `Get Pack Row`
7. `Extract Pack Row`
8. `Get Latest Form Response`
9. `Extract Latest Form Response`
10. `Get Prospect Target Row`
11. `Extract Prospect Target Row`
12. `Build Post-Audit CRM Context`
13. `Generate Internal Pre-RDV Brief`
14. `Update Prospect Target Post-Audit`
15. `Send Internal Brief Email`
16. `Build Post-Audit Result`

Le nœud `Build Post-Audit CRM Context` est le point de bifurcation principal :

- branche A vers `Generate Internal Pre-RDV Brief`
- branche B vers `Update Prospect Target Post-Audit`

Puis :

- `Generate Internal Pre-RDV Brief` alimente `Send Internal Brief Email`
- `Send Internal Brief Email` alimente `Build Post-Audit Result`

Dans la version `74` actuellement utilisée, cette structure de base est enrichie par des nœuds supplémentaires, notamment :

- `Reconciliation Schedule Trigger`
- `If Audit Completed`
- `Get Invitation Row`
- `Extract Invitation Row`
- `If Already Post-Audit Processed`
- `Build Expert Routing`
- `Patch Pack Post-Audit Status`
- `Upsert Follow-Up Tracking`
- `If Slack Alerts Enabled`
- `Send Slack Expert Alert`
- `Build No-Op Result`

---

## 6. Guide nœud par nœud

## 6.1 Déclencheurs

### `Manual Trigger`

**Rôle**

- lancer le workflow manuellement

**Quand l’utiliser**

- recette
- démonstration
- validation d’un `pack_id`

**Remarque**

Ce nœud est idéal au début du projet, tant que le déclenchement automatique n’est pas encore branché.

### `Audit Completed Webhook`

**Rôle**

- déclencher automatiquement le workflow après un événement externe

**Quand l’utiliser**

- en production
- après soumission réelle du formulaire

**Ce qu’il reçoit**

- `pack_id`
- éventuellement `internal_email_to`
- éventuellement `next_action_delay_days`

---

## 6.2 Préparation de la requête

### `Set Post-Audit Manual Input`

**Rôle**

- fournir des valeurs de test quand on ne passe pas par le webhook

**Champs typiques**

- `pack_id`
- `internal_email_to`
- `next_action_delay_days`

**Usage recette**

Exemple de valeurs directes :

```text
pack_id = pack-1780594185996-4eb2jg4w
internal_email_to = marius.ayoro70@gmail.com
next_action_delay_days = 1
```

**Remarque**

Ce nœud sert uniquement à la recette manuelle. En production, les valeurs viendront du webhook ou d’un autre workflow.

### `Parse Post-Audit Webhook`

**Rôle**

- lire le body ou la query du webhook
- normaliser les paramètres reçus

**Utilité**

Éviter les variations de format entre un appel manuel, un appel HTTP ou un déclenchement par un autre workflow.

### `Normalize Post-Audit Request`

**Rôle**

- uniformiser le format des champs d’entrée

**Ce que le nœud fixe**

- `pack_id` sous forme de chaîne propre
- `internal_email_to` sous forme d’email exploitable
- `next_action_delay_days` sous forme numérique
- `trigger_source`

**Pourquoi ce nœud est important**

Il permet à tous les nœuds suivants d’utiliser un format stable, quelle que soit la source d’entrée.

---

## 6.3 Lecture du pack V3

### `Get Pack Row`

**Type**

- `HTTP Request`

**Rôle**

- relire la ligne du pack dans `ai_prospecting_packs`

**Ce qu’il utilise**

- `pack_id`

**Ce qu’il retourne**

- le pack complet
- le `payload`
- les métadonnées de génération

**Point de vigilance**

La base distante doit être à jour. Si le schéma Supabase est incomplet, ce nœud peut fonctionner alors que la suite échoue plus loin.

### `Extract Pack Row`

**Type**

- `Code`

**Rôle**

- extraire les champs utiles du pack
- stabiliser la structure de sortie

**Sorties importantes**

- `row_id`
- `pack_id`
- `prospect_id`
- `organization_name`
- `target_email`
- `status`
- `payload`

**Pourquoi ce nœud est utile**

Le payload du pack est riche. Ce nœud évite de répéter partout les mêmes accès au JSON brut.

---

## 6.4 Lecture de la réponse formulaire

### `Get Latest Form Response`

**Type**

- `HTTP Request`

**Rôle**

- récupérer la dernière réponse formulaire associée au `pack_id`

**Comportement attendu**

- si une réponse existe, elle est retournée
- sinon le nœud peut ne rien renvoyer

**Réglage recommandé**

Activez `Always Output Data` pour continuer à tester le workflow même si aucun formulaire n’a encore été soumis.

**Point de vigilance**

Dans ce projet, la base historique utilise `last_updated_at` et non `updated_at`. L’ordre doit donc tenir compte de cette colonne.

### `Extract Latest Form Response`

**Type**

- `Code`

**Rôle**

- normaliser la lecture de la réponse formulaire
- créer un indicateur métier simple

**Sorties importantes**

- `form_response_id`
- `submitted_at`
- `last_updated_at`
- `invitation_token`
- `session_id`
- `completion_percentage`
- `is_completed`
- `form_data`
- `context_snapshot`
- `form_response_missing`

**Lecture métier**

- `form_response_missing = true` : aucune vraie réponse n’a été trouvée
- `form_response_missing = false` : il existe une soumission exploitable

---

## 6.5 Lecture de l’état CRM

### `Get Prospect Target Row`

**Type**

- `HTTP Request`

**Rôle**

- relire la ligne CRM dans `prospect_targets`

**Ce qu’il utilise**

- `prospect_id`

**Comportement attendu**

- si le prospect existe en CRM, le nœud retourne une ligne
- sinon il peut ne rien retourner

**Réglage recommandé**

Activez `Always Output Data` pour continuer la recette même si le prospect n’existe pas encore dans `prospect_targets`.

### `Extract Prospect Target Row`

**Type**

- `Code`

**Rôle**

- normaliser les informations CRM
- exposer un indicateur simple de présence CRM

**Sorties importantes**

- `crm_row_id`
- `crm_status`
- `crm_paused`
- `crm_do_not_contact`
- `crm_last_response_status`
- `crm_last_sequence_result`
- `crm_stop_reason`
- `crm_niche_status`
- `crm_next_action_at`
- `crm_last_pack_id`
- `crm_record_missing`

**Lecture métier**

- `crm_record_missing = true` : aucune ligne CRM n’a été retrouvée
- `crm_record_missing = false` : le prospect existe déjà dans le CRM

---

## 6.6 Fusion métier et orientation TransferAI

### `Build Post-Audit CRM Context`

**Type**

- `Code`

**Rôle**

- fusionner le pack, la réponse formulaire et l’état CRM
- produire le contexte métier final utilisé par la suite

**Ce que ce nœud rassemble**

- identité de l’organisation
- contact principal
- langue du prospect
- secteur et type d’organisation
- recommandations issues du pack
- éventuelle recommandation issue du formulaire
- état CRM avant mise à jour

**Sorties importantes**

- `organization_name`
- `decision_maker_name`
- `target_email`
- `prospect_language`
- `recommended_offer`
- `recommended_use_case`
- `audit_form_url`
- `transferai_recommendation`
- `crm_next_action_at_after`
- `post_audit_ready`

**Interprétation**

- `post_audit_ready = false` : le contexte existe, mais pas encore de vraie soumission confirmée
- `post_audit_ready = true` : le dossier est prêt pour un traitement post-audit complet

**Pourquoi ce nœud est central**

C’est le cerveau du workflow. Tous les nœuds suivants doivent s’appuyer sur lui plutôt que sur les réponses brutes précédentes.

---

## 6.7 Génération de la fiche interne

### `Generate Internal Pre-RDV Brief`

**Type**

- `HTTP Request` vers OpenAI

**Rôle**

- transformer le contexte consolidé en fiche lisible pour l’équipe interne

**Ce que la fiche doit contenir**

- identification
- synthèse rapide
- diagnostic métier
- priorités exprimées
- orientation TransferAI recommandée
- prochaine étape recommandée
- points à vérifier en rendez-vous

**Gestion des langues**

Ce nœud doit être aligné avec la logique V1, V2 et V3 :

- `fr` → français professionnel standard
- `en` → anglais professionnel standard
- `es` → espagnol professionnel standard

**Cas sans vraie soumission**

Si `post_audit_ready = false`, la fiche doit préciser qu’il s’agit d’une préparation préliminaire fondée sur le pack et le contexte disponible.

**Sortie principale**

- `choices[0].message.content`

Cette sortie sert ensuite au mail interne et au résultat final.

---

## 6.8 Mise à jour CRM

### `Update Prospect Target Post-Audit`

**Type**

- `HTTP Request`

**Rôle**

- mettre à jour `prospect_targets` après lecture du contexte post-audit

**Branchement recommandé**

Ce nœud doit partir directement de `Build Post-Audit CRM Context`, et non de `Generate Internal Pre-RDV Brief`.

**Pourquoi**

Il a besoin du contexte métier structuré :

- `prospect_id`
- `post_audit_ready`
- `crm_next_action_at_after`
- `pack_id`

**Valeurs typiquement mises à jour**

- `status`
- `paused`
- `last_response_status`
- `last_sequence_result`
- `stop_reason`
- `niche_status`
- `next_action_at`
- `last_pack_id`
- `updated_at`

**Logique métier recommandée**

- si `post_audit_ready = false`
  - statut intermédiaire d’attente de soumission
- si `post_audit_ready = true`
  - statut de qualification après audit

---

## 6.9 Envoi interne

### `Send Internal Brief Email`

**Type**

- `HTTP Request` vers Resend

**Rôle**

- envoyer la fiche pré-RDV en interne

**Source du contenu**

- `Generate Internal Pre-RDV Brief`

**Source du destinataire**

- `Build Post-Audit CRM Context`

**Point de vigilance Resend**

En environnement de test avec `onboarding@resend.dev` :

- Resend n’autorise que les envois vers l’adresse propriétaire du compte
- il faut donc utiliser l’email de test autorisé

En production :

- il faut vérifier un domaine Resend
- et utiliser une adresse `from` de ce domaine

**Résultat attendu**

- une réponse contenant un `id`

---

## 6.10 Résultat final consolidé

### `Build Post-Audit Result`

**Type**

- `Code`

**Rôle**

- consolider le résultat final du workflow

**Ce que ce nœud rassemble**

- contexte CRM consolidé
- contenu de la fiche
- résultat Resend

**Sorties importantes**

- `status`
- `pack_id`
- `prospect_id`
- `organization_name`
- `post_audit_ready`
- `primary_service`
- `secondary_service`
- `confidence_label`
- `recommended_use_case_final`
- `crm_next_action_at_after`
- `brief_markdown`
- `internal_email_to`
- `resend_response`

**Lecture métier**

Quand tout est en ordre, on attend :

- `status = post_audit_processed`
- une fiche pré-RDV générée
- un identifiant Resend si l’email a été envoyé

---

## 7. Ordre de test recommandé

Pour une recette propre, l’ordre recommandé est :

1. `Set Post-Audit Manual Input`
2. `Normalize Post-Audit Request`
3. `Get Pack Row`
4. `Extract Pack Row`
5. `Get Latest Form Response`
6. `Extract Latest Form Response`
7. `Get Prospect Target Row`
8. `Extract Prospect Target Row`
9. `Build Post-Audit CRM Context`
10. `Generate Internal Pre-RDV Brief`
11. `Update Prospect Target Post-Audit`
12. `Send Internal Brief Email`
13. `Build Post-Audit Result`

---

## 8. Interprétation des états pendant la recette

### Cas 1 : `post_audit_ready = false`

Cela signifie :

- le pack existe
- le workflow fonctionne
- mais aucune vraie soumission formulaire n’a encore été trouvée

Le workflow peut quand même produire :

- une fiche préliminaire
- une prochaine action
- une mise à jour CRM de pré-attente

### Cas 2 : `post_audit_ready = true`

Cela signifie :

- une vraie réponse formulaire a été retrouvée
- le workflow peut produire une fiche post-audit complète

---

## 9. Différence entre recette et production

### En recette

- on utilise souvent `Manual Trigger`
- on fixe `pack_id` à la main
- on tolère l’absence de réponse formulaire
- on utilise une adresse email de test

### En production

- on déclenche via `Audit Completed Webhook`
- le `pack_id` est transmis automatiquement
- le formulaire a réellement été soumis
- le domaine Resend est vérifié
- le CRM est réellement mis à jour

---

## 10. Résumé final

Le workflow post-audit CRM-aware n’est pas un doublon de la V3.

Il sert à transformer un simple formulaire d’audit en dispositif opérationnel interne :

- la V3 envoie le prospect vers l’audit
- le workflow post-audit lit ce qui revient
- il oriente l’équipe TransferAI
- il prépare le rendez-vous
- il remet à jour le CRM

Autrement dit :

- **V3** ouvre la relation et envoie le lien
- **Post-audit CRM-aware** transforme la réponse en décision interne exploitable

---

## 75_Guide_Import_V6_Google_Sheets_Dashboard

Source : `docs/transferai-admin/75_Guide_Import_V6_Google_Sheets_Dashboard.md`

# V6 MVP - Guide d'import et de configuration

## Fichier exportable
- `docs/transferai-admin/75_n8n_Post_Audit_V6_Google_Sheets_Dashboard_Exportable.json`

## Ce que contient l'export
Cet export est une version du workflow post-audit V2 deja enrichie avec V6 :
- `Build V6 Dashboard Row`
- `Sync Google Sheets Dashboard`
- `If Expert Notification Enabled`
- `Send Expert Notification`
- `Build V6 Summary`

## Pre-requis
1. Creer un Google Sheet nomme `TransferAI - Audit Responses Dashboard`
2. Creer un onglet `responses_dashboard`
3. Ajouter en ligne 1 les colonnes suivantes :

```text
response_id | pack_id | submitted_at | organization_name | decision_maker_name | target_email | sector_guess | maturity_level | recommended_offer | completion_percentage | assigned_expert_email | workflow_status | next_action_at | booking_link | follow_up_status | commercial_notes
```

4. Creer le credential n8n : `Google Sheets TransferAI`
5. Verifier que `RESEND_API_KEY` est disponible dans l'environnement n8n

## Placeholders a remplacer apres import
### Nœud `Sync Google Sheets Dashboard`
- `documentId.value` : remplacer `REPLACE_WITH_GOOGLE_SHEET_ID` par l'ID du fichier Google Sheet
- attacher le credential Google Sheets OAuth2 approprie

### Nœud `Send Expert Notification`
- remplacer `REPLACE_WITH_GOOGLE_SHEET_ID` dans le lien Google Sheets du corps email
- verifier que l'expediteur `TransferAI <contact@transferai.ci>` est valide dans Resend

## Comportement
- V6 se declenche apres `Build Post-Audit Result`
- une ligne est ajoutee ou mise a jour dans Google Sheets a partir de `response_id`
- si `completion_percentage >= 80`, un email est envoye a l'expert assigne
- la sortie finale est `Build V6 Summary`

## Verification apres import
1. Importer le workflow JSON dans n8n
2. Ouvrir `Sync Google Sheets Dashboard`
3. Selectionner le credential Google Sheets
4. Verifier l'ID du document et le nom d'onglet
5. Ouvrir `Send Expert Notification`
6. Remplacer l'ID du Google Sheet dans le lien de l'email
7. Lancer un test post-audit reel ou manuel
8. Verifier :
   - la ligne apparait dans `responses_dashboard`
   - l'email expert part si completion >= 80
   - `Build V6 Summary` renvoie `status = v6_sync_completed`

---

## 76_Guide_Utilisateur_V4_Batch_Node_Par_Node_2026-06-08

Source : `docs/transferai-admin/76_Guide_Utilisateur_V4_Batch_Node_Par_Node_2026-06-08.md`

# Guide Utilisateur V4 Batch Node Par Node

Référence opérationnelle du workflow `TransferAI Prospecting Multi-Prospect V4 Batch Orchestrator`  
Version du 8 juin 2026

## Objectif

Le workflow V4 sert à :

- récupérer des prospects depuis une source CRM
- appliquer les règles de sélection et de quota
- appeler le workflow V3 pour chaque prospect retenu
- journaliser le batch dans Supabase

V4 n'écrit pas les contenus commerciaux du pack. Ce rôle reste porté par V3.

## Point important avant de rebrancher Airtable et Google Sheets

Rebrancher Airtable ou Google Sheets **ne modifie pas la logique interne de V3**.  
V3 continue à faire la même chose :

- générer le pack
- envoyer l'email d'approbation
- attendre l'approbation
- envoyer l'email prospect

En revanche, sur la V4 actuellement validée, le chemin final a été simplifié pour tester `Supabase` uniquement :

- `Normalize Supabase Prospects` alimente le merge final
- `Create Batch Run` + `Edit Fields` injectent le contexte batch

Donc :

- si tu rebranches Airtable et Google Sheets **sans rétablir un merge de sources propre**, tu peux casser la V4
- cela **n'affectera pas V3**, mais cela peut empêcher V4 d'alimenter V3 correctement

### Recommandation de prod

Pour la mise en production :

1. garder `source_backend = supabase` tant que la V4 nœud par nœud est stabilisée
2. réintroduire ensuite Airtable et Google Sheets avec une structure à deux merges :
3. `Merge Prospect Sources`
4. `Merge Prospects With Batch Run`

Architecture recommandée :

```text
Normalize Supabase Prospects ─┐
Normalize Airtable Prospects ─┼─> Merge Prospect Sources ─┐
Normalize Google Sheets Prospects ─┘                      │
                                                          ├─> Merge Prospects With Batch Run ─> Build Eligible Prospect Queue
Create Batch Run ─> Edit Fields ──────────────────────────┘
```

## Vue d'ensemble du flux V4

```text
Manual Trigger / Daily Schedule Trigger
→ Set Batch Config
→ Fetch Today Outreach Count
→ If Supabase Source / If Airtable Source / Google Sheets path
→ Normalize Source Prospects
→ Merge Prospects With Batch Run
→ Build Eligible Prospect Queue
→ If Prospect Eligible
→ Execute Prospect Workflow V3 / Mark Skipped In Batch
→ Log Processed Batch Item / Log Skipped Batch Item
→ Merge Batch Outcomes
→ Build Batch Summary
→ Finalize Batch Run
```

## Prérequis

### n8n

- workflow V3 accessible et actif
- workflow V4 importé
- compte Resend fonctionnel
- accès Supabase valide

### Supabase

Tables ou vues utilisées :

- `prospect_targets`
- `prospect_targets_ready_for_batch`
- `prospecting_batch_runs`
- `prospecting_batch_run_items`
- `ai_prospecting_packs`
- `outreach_attempts`

### Clés

À configurer dans les nœuds HTTP :

- `apikey`
- `Authorization: Bearer <service_role_key>`
- `Content-Type: application/json`

## Set Batch Config

### Rôle

Centralise tous les paramètres d'exécution.

### Champs recommandés

- `source_backend`
- `batch_fetch_limit`
- `daily_send_limit`
- `max_attempts_per_prospect`
- `min_confidence_score`
- `batch_run_label`
- `active_campaign_label`
- `active_niche_list_csv`
- `child_workflow_id_v3`
- `child_workflow_label_v3`
- `booking_link_45min`

### Valeurs de travail recommandées

```text
source_backend = supabase
batch_fetch_limit = 25
daily_send_limit = 5
max_attempts_per_prospect = 3
min_confidence_score = 0.45
batch_run_label = weekday-morning-run
active_campaign_label = S1-Assistanat-Administratif
active_niche_list_csv = assistant_direction_documentaire
child_workflow_id_v3 = PvralFMyr6MdWe8I
booking_link_45min = https://calendly.com/contact-transferai/30min
```

### Niche list utilisable

- `support_it_intelligent`
- `service_client_multicanal`
- `machine_contenu_marketing`
- `workflow_administratif`
- `assistant_direction_documentaire`
- `reporting_financier_assiste`
- `recrutement_onboarding_augmente`
- `telemedecine_triage_orientation`
- `banque_kyc_reporting`
- `operations_terrain_coordination`
- `commentaire_donnees_reporting`
- `energie_industrie_services`
- `formation_montee_en_competence`

## Fetch Today Outreach Count

### Rôle

Compter combien de prospects ont déjà été traités aujourd'hui pour appliquer le quota du jour.

### Réglage obligatoire

- `Always Output Data = ON`

### Pourquoi

Si aucun envoi n'a été fait aujourd'hui, le workflow doit quand même continuer avec `sent_today = 0`.

## If Supabase Source

### Rôle

Diriger l'exécution vers la bonne source.

### Condition

- `value1`
```text
{{ $json.source_backend }}
```
- opérateur
```text
is equal to
```
- `value2`
```text
supabase
```

### Câblage correct

Le nœud doit être alimenté depuis :

```text
Set Batch Config → If Supabase Source
```

Pas depuis `Fetch Today Outreach Count`.

## Fetch Prospects From Supabase

### Rôle

Lire les prospects prêts à traiter.

### Méthode

```text
GET
```

### URL recommandée

```text
{{ 'https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospect_targets?select=*&status=eq.ready&paused=eq.false&order=next_action_at.asc.nullslast,updated_at.asc&limit=' + $json.batch_fetch_limit }}
```

### Authentication

```text
None
```

### Headers

- `apikey = <SUPABASE_SERVICE_ROLE_KEY>`
- `Authorization = Bearer <SUPABASE_SERVICE_ROLE_KEY>`

### Réglage recommandé

- `Always Output Data = ON`

## Normalize Supabase Prospects

### Mode

```text
Run Once for All Items
```

### Code validé

```js
const items = $input.all().map((item) => item.json);

return items.map((row, index) => ({
  json: {
    prospect_id: row.prospect_id || row.id || `supabase-${index + 1}`,
    organization_name: row.organization_name || row.company_name || row.name || '',
    website: row.website || row.domain || '',
    country: row.country || "Côte d'Ivoire",
    organization_type: row.organization_type || row.account_type || 'organisation à qualifier',
    sector_guess: row.sector_guess || row.industry || 'secteur à confirmer',
    decision_maker_name: row.decision_maker_name || row.contact_name || 'Décideur à confirmer',
    target_email: row.target_email || row.email || '',
    custom_page_paths_csv: row.custom_page_paths_csv || '',
    booking_link_45min: 'https://calendly.com/contact-transferai/30min',
    commercial_priority_default: row.commercial_priority_default || 'tier1',
    research_scope: row.research_scope || 'public_web_only',
    source_backend: 'supabase',
    raw_source_id: row.id || null,
    outreach_attempt_count: Number(row.outreach_attempt_count || 0),
    last_response_status: row.last_response_status || '',
    last_sequence_result: row.last_sequence_result || '',
    stop_reason: row.stop_reason || '',
    paused: Boolean(row.paused),
    do_not_contact: Boolean(row.do_not_contact),
    niche_status: row.niche_status || '',
    next_action_at: row.next_action_at || null
  }
}));
```

## Fetch Prospects From Airtable

### Rôle

Source alternative si `source_backend = airtable`.

### Méthode

```text
GET
```

### URL recommandée

```text
{{ 'https://api.airtable.com/v0/' + ($json.airtable_base_id || 'COLLER_AIRTABLE_BASE_ID') + '/' + encodeURIComponent($json.airtable_table_name || 'prospect_targets') + '?maxRecords=' + ($json.batch_fetch_limit || '25') + '&view=' + encodeURIComponent($json.airtable_ready_view || 'Ready For Outreach') }}
```

### Header Authorization

```text
{{ 'Bearer ' + ($json.airtable_api_key || 'COLLER_VOTRE_AIRTABLE_PAT_ICI') }}
```

### Important

Dans l'environnement testé, éviter `$env.*` dans l'UI n8n. Préférer des valeurs injectées ou fixes.

## Normalize Airtable Prospects

### Rôle

Mapper les champs Airtable vers le format canonique prospect.

### Conseil

Utiliser la même structure de sortie que `Normalize Supabase Prospects`.

## Fetch Prospects From Google Sheets CSV

### Rôle

Source alternative légère pour des tests ou des campagnes rapides.

### Entrée

Une URL CSV publique ou publiée.

### Conseil

Utiliser un modèle de colonnes identique au format canonique :

- `prospect_id`
- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `target_email`
- `niche_status`

## Normalize Google Sheets Prospects

### Rôle

Transformer le CSV en items prospect canonique.

## Create Batch Run

### Rôle

Créer la ligne mère du batch dans Supabase.

### Méthode

```text
POST
```

### URL

```text
https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospecting_batch_runs
```

### JSON body recommandé

```text
{{ JSON.stringify({
  run_label: $json.batch_run_label || 'weekday-morning-run',
  source_backend: $json.source_backend || 'supabase',
  source_snapshot: $json,
  batch_fetch_limit: Number($json.batch_fetch_limit || 25),
  daily_send_limit: Number($json.daily_send_limit || 5),
  max_attempts_per_prospect: Number($json.max_attempts_per_prospect || 3),
  min_confidence_score: Number($json.min_confidence_score || 0.45),
  active_niche_list_csv: $json.active_niche_list_csv || '',
  active_campaign_label: $json.active_campaign_label || '',
  status: 'started',
  started_at: new Date().toISOString()
}) }}
```

## Edit Fields

### Rôle

Préparer un mini contexte batch propre à injecter dans les prospects.

### Champs à sortir

- `batch_run_id = {{ $json.id }}`
- `batch_run_label = {{ $json.run_label }}`
- `active_campaign_label = {{ $json.active_campaign_label || '' }}`
- `active_niche_list_csv = {{ $json.active_niche_list_csv || '' }}`

### Réglage

- `Manual Mapping`
- `Include Other Input Fields = OFF`

## Merge Prospects With Batch Run

### Rôle

Fusionner chaque prospect avec le contexte batch.

### Pour le test Supabase validé

- `Input 1 = Normalize Supabase Prospects`
- `Input 2 = Edit Fields`

### Configuration validée

- `Mode = Combine`
- `Combine By = All Possible Combinations`

### Résultat attendu

Chaque prospect doit porter :

- `batch_run_id`
- `batch_run_label`
- `active_campaign_label`
- `active_niche_list_csv`

## Build Eligible Prospect Queue

### Rôle

Filtrer les prospects selon :

- niche active
- do-not-contact
- pause
- statut de réponse
- nombre de tentatives
- quota quotidien

### Code validé

```js
function safeNode(name) {
  try {
    return $(name).first().json || {};
  } catch (e) {
    return {};
  }
}

const items = $input.all().map((item) => item.json);
const config = safeNode('Set Batch Config');

const todayOutreach = safeNode('Fetch Today Outreach Count');
const sentToday = Array.isArray(todayOutreach) ? todayOutreach.length : 0;

const dailyLimit = Number(config.daily_send_limit || 5);
const maxAttempts = Number(config.max_attempts_per_prospect || 3);
const remainingCapacity = Math.max(dailyLimit - sentToday, 0);
const activeNiches = String(config.active_niche_list_csv || '')
  .split(',')
  .map((n) => n.trim())
  .filter(Boolean);

let scheduled = 0;
const outputs = [];

for (const prospect of items) {
  let processDecision = 'skip';
  let stopReason = '';

  const prospectNiche = String(prospect.niche_status || '').trim();
  const nicheMatch = activeNiches.length === 0 || activeNiches.includes(prospectNiche);

  if (!nicheMatch) {
    stopReason = 'inactive_niche';
  } else if (!prospect.organization_name || !prospect.website) {
    stopReason = 'missing_minimum_profile';
  } else if (prospect.do_not_contact) {
    stopReason = 'do_not_contact';
  } else if (prospect.paused) {
    stopReason = 'prospect_paused';
  } else if (String(prospect.stop_reason || '').trim()) {
    stopReason = prospect.stop_reason;
  } else if (Number(prospect.outreach_attempt_count || 0) >= maxAttempts) {
    stopReason = 'max_attempts_reached';
  } else if (
    ['interested', 'meeting_booked', 'not_interested', 'unsubscribed']
      .includes(String(prospect.last_response_status || '').toLowerCase())
  ) {
    stopReason = 'sequence_already_closed';
  } else if (String(prospect.last_sequence_result || '').toLowerCase() === 'no_niche') {
    stopReason = 'niche_not_relevant';
  } else if (scheduled >= remainingCapacity) {
    stopReason = 'daily_quota_reached';
  } else {
    processDecision = 'process_now';
    scheduled += 1;
  }

  outputs.push({
    json: {
      ...prospect,
      batch_run_id: prospect.batch_run_id || null,
      batch_run_label: prospect.batch_run_label || config.batch_run_label || 'weekday-morning-run',
      active_campaign_label: prospect.active_campaign_label || config.active_campaign_label || null,
      active_niche_list_csv: prospect.active_niche_list_csv || config.active_niche_list_csv || '',
      daily_send_limit: dailyLimit,
      sent_today: sentToday,
      remaining_capacity: remainingCapacity,
      process_decision: processDecision,
      batch_stop_reason: stopReason || null
    }
  });
}

return outputs;
```

## If Prospect Eligible

### Condition

- `value1`
```text
{{ $json.process_decision }}
```
- opérateur
```text
is equal to
```
- `value2`
```text
process_now
```

### Résultat attendu en test

Avec `daily_send_limit = 1` :

- branche `true = 1 item`
- branche `false = le reste`

## Execute Prospect Workflow V3

### Rôle

Déclencher V3 pour le prospect retenu.

### Réglage conseillé

- `Wait for sub-workflow completion = OFF` si tu veux un dispatch rapide

### Paramètre clé

Le bon `workflow_id` V3 doit être injecté depuis `Set Batch Config`.

## Mark Dispatched To V3

### Rôle

Marquer dans l'item courant que le prospect a été dispatché vers V3.

### Conseil

Conserver :

- `batch_run_id`
- `prospect_id`
- `organization_name`
- `website`

## Mark Skipped In Batch

### Rôle

Préparer les items non retenus pour le logging batch.

## Log Processed Batch Item

### Table cible

```text
prospecting_batch_run_items
```

### URL

```text
https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospecting_batch_run_items
```

### JSON body recommandé

```text
{{ JSON.stringify({
  batch_run_id: $json.batch_run_id || null,
  prospect_id: $json.prospect_id || null,
  pack_id: $json.pack_id || null,
  organization_name: $json.organization_name || null,
  website: $json.website || null,
  process_decision: $json.process_decision || 'process_now',
  batch_status: $json.batch_status || 'dispatched_to_v3',
  batch_stop_reason: $json.batch_stop_reason || null,
  active_campaign_label: $json.active_campaign_label || null,
  niche_status: $json.niche_status || null
}) }}
```

## Log Skipped Batch Item

### URL

```text
https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospecting_batch_run_items
```

### JSON body recommandé

```text
{{ JSON.stringify({
  batch_run_id: $json.batch_run_id || null,
  prospect_id: $json.prospect_id || null,
  pack_id: $json.pack_id || null,
  organization_name: $json.organization_name || null,
  website: $json.website || null,
  process_decision: $json.process_decision || 'skip',
  batch_status: $json.batch_status || 'skipped_in_batch',
  batch_stop_reason: $json.batch_stop_reason || null,
  active_campaign_label: $json.active_campaign_label || null,
  niche_status: $json.niche_status || null
}) }}
```

## Merge Batch Outcomes

### Rôle

Réunir :

- le prospect envoyé
- les prospects skip

pour produire le résumé final.

### Réglage validé

- `Mode = append`

## Build Batch Summary

### Rôle

Calculer :

- `processed_count`
- `skipped_count`
- `skip_reasons`
- `batch_run_id`

### Sortie attendue

Un seul item avec le résumé agrégé.

## Finalize Batch Run

### Rôle

Clore la ligne du batch parent.

### Table correcte

```text
prospecting_batch_runs
```

### Méthode

```text
PATCH
```

### URL correcte

```text
{{ 'https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospecting_batch_runs?id=eq.' + encodeURIComponent($json.batch_run_id) }}
```

### JSON Body correct

```text
{{ JSON.stringify({
  processed_count: $json.processed_count,
  skipped_count: $json.skipped_count,
  status: 'completed',
  completed_at: new Date().toISOString(),
  failure_reason: null
}) }}
```

### Important

Ne jamais pointer ce nœud vers :

```text
prospecting_batch_run_items
```

## Configuration Supabase minimale

### `prospecting_batch_runs`

Colonnes nécessaires :

- `id`
- `run_label`
- `source_backend`
- `source_snapshot`
- `batch_fetch_limit`
- `daily_send_limit`
- `max_attempts_per_prospect`
- `min_confidence_score`
- `active_niche_list_csv`
- `active_campaign_label`
- `status`
- `started_at`
- `completed_at`
- `processed_count`
- `skipped_count`
- `failure_reason`
- `created_at`

### `prospecting_batch_run_items`

Colonnes nécessaires :

- `id`
- `batch_run_id`
- `prospect_id`
- `pack_id`
- `organization_name`
- `website`
- `process_decision`
- `batch_status`
- `batch_stop_reason`
- `active_campaign_label`
- `niche_status`
- `created_at`

## Checklist de passage en prod

1. conserver `source_backend = supabase`
2. remettre la vraie niche cible
3. valider un dernier run manuel à `daily_send_limit = 1`
4. passer à `daily_send_limit = 5`
5. publier V4
6. surveiller :
7. `prospecting_batch_runs`
8. `prospecting_batch_run_items`
9. V3 déclenché avec le bon prospect

## Conclusion

La V4 validée dans cette session est stable sur le chemin :

- Supabase
- 1 merge batch context
- quotas quotidiens
- dispatch vers V3
- logging batch
- finalisation batch

Pour rebrancher Airtable et Google Sheets, faire d'abord un merge de sources propre avant de remettre le workflow en multi-source complet.

---

## 77_Guide_Troubleshooting_V4_V3_Audit_Links_2026-06-08

Source : `docs/transferai-admin/77_Guide_Troubleshooting_V4_V3_Audit_Links_2026-06-08.md`

# Guide de Troubleshooting V4 V3 Audit Links

Résolution des incidents rencontrés pendant la stabilisation des workflows `V4 Batch` et `V3 CRM Approval AutoSend`  
Version du 8 juin 2026

## Objectif

Ce document récapitule :

- les pannes rencontrées
- leurs symptômes
- la vraie cause
- la correction définitive

Il couvre :

- la V4 batch
- la V3 CRM
- les emails Resend
- les liens du questionnaire d'audit
- les faux doublons observés dans Gmail

## Résumé exécutif

Les problèmes ont été répartis en quatre familles :

1. erreurs de câblage n8n
2. erreurs de schéma Supabase
3. erreurs de mapping de champs
4. erreurs de génération et de réutilisation du lien `audit_form_url`

## 1. `If Supabase Source` partait sur la mauvaise branche

### Symptôme

- la branche `false` partait alors que `source_backend = supabase`

### Cause

`If Supabase Source` recevait l'output de `Fetch Today Outreach Count`, parfois vide, au lieu de lire directement `Set Batch Config`.

### Fix

Recâblage :

```text
Set Batch Config → If Supabase Source
```

et non :

```text
Fetch Today Outreach Count → If Supabase Source
```

## 2. `Fetch Today Outreach Count` stoppait le batch quand il n'y avait aucun envoi

### Symptôme

- absence d'item
- la suite du workflow ne recevait rien

### Cause

Le nœud ne renvoyait rien quand le résultat était vide.

### Fix

Activer :

```text
Always Output Data = ON
```

## 3. `Create Batch Run` échouait sur colonnes manquantes

### Symptômes

- `active_campaign_label` column not found
- `run_label` null

### Causes

- colonnes manquantes dans `prospecting_batch_runs`
- exécution du nœud seul sans input amont

### Fixes

- ajout des colonnes manquantes dans Supabase
- fallback dans le body
- test via `Execute previous nodes`

## 4. `Normalize Supabase Prospects` retournait 0 output

### Symptôme

- le nœud affichait `No output data returned`

### Cause

Le code lisait `$json` comme un tableau unique alors que le nœud recevait déjà plusieurs items séparés.

### Fix

Utiliser :

```js
const items = $input.all().map((item) => item.json);
```

au lieu de :

```js
const rows = $json || [];
```

## 5. L'ancien lien Calendly 45 min polluait encore les prospects

### Symptôme

- certains prospects sortaient avec `https://calendly.com/transferai/45min`

### Cause

la valeur stockée dans Supabase était encore ancienne

### Fix

Forcer dans `Normalize Supabase Prospects` :

```js
booking_link_45min: 'https://calendly.com/contact-transferai/30min'
```

## 6. `Build Eligible Prospect Queue` ne voyait pas les nœuds amont

### Symptôme

- `Node 'Fetch Today Outreach Count' hasn't been executed`

### Cause

Le nœud était testé isolément et le code dépendait de nœuds non exécutés.

### Fix

Ajout d'un helper robuste :

```js
function safeNode(name) {
  try {
    return $(name).first().json || {};
  } catch (e) {
    return {};
  }
}
```

## 7. `batch_run_id` restait vide dans les logs

### Symptômes

- `batch_run_id = null`
- `null value in column "batch_run_id"`

### Cause

Le contexte batch n'était pas injecté dans les items prospect.

### Fix

- `Create Batch Run → Edit Fields`
- `Edit Fields → Merge Prospects With Batch Run`
- merge configuré en :
  - `Mode = Combine`
  - `Combine By = All Possible Combinations`

## 8. `prospecting_batch_run_items` avait des colonnes manquantes

### Symptômes

- `active_campaign_label column not found`
- `niche_status column not found`

### Cause

Le schéma de la table ne reflétait pas encore les nouveaux champs loggués.

### Fix

Ajout des colonnes :

- `active_campaign_label`
- `niche_status`
- `batch_stop_reason`
- `process_decision`
- `batch_status`
- `organization_name`
- `website`
- `prospect_id`
- `pack_id`

## 9. `Finalize Batch Run` écrivait dans la mauvaise table

### Symptôme

- `Could not find the 'completed_at' column of 'prospecting_batch_run_items'`

### Cause

Le nœud pointait vers `prospecting_batch_run_items` au lieu de `prospecting_batch_runs`.

### Fix

URL correcte :

```text
{{ 'https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospecting_batch_runs?id=eq.' + encodeURIComponent($json.batch_run_id) }}
```

## 10. L'email interne final arrivait vide

### Symptôme

- `Organisation :` vide
- `Email cible :` vide
- `Lien formulaire :` vide

### Cause

Le nœud `Send Internal Sent Confirmation` lisait parfois des champs absents sur l'item courant.

### Fix

Réécriture du body pour prioriser :

- `Build Send Context`
- puis `payload`

## 11. Le lien du questionnaire était cassé dans l'email prospect

### Symptôme

Dans le mail prospect, le lien apparaissait comme :

```text
https://www.transferai.ci/questionnaire-audit?pack_id=
```

### Cause réelle

Le contenu de la lettre générée par l'IA pouvait intégrer un lien questionnaire cassé avant que le vrai `pack_id` existe.

### Effet

Même si un autre bloc plus bas contenait le bon lien, l'utilisateur pouvait cliquer le premier lien cassé.

## 12. Le site disait `pack_id manquant`

### Symptôme

La page affichait :

```text
Aucun identifiant de pack fourni dans l'URL
```

### Cause

Le frontend recevait une URL sans `pack_id`, car le mail pointait vers un ancien lien cassé.

### Important

Ce n'était pas d'abord un bug frontend. Le frontend réagissait correctement à une URL incomplète.

## 13. Fix définitif du lien questionnaire

### Nœud 1 : `Assemble Prospect Pack`

Après calcul du vrai `auditFormUrl`, réparer la lettre :

```js
var executiveLetterHtml = String(executiveLetter || '').replace(/\n/g, '<br>');

var brokenAuditPattern = /https?:\/\/[^\s"'<>]*questionnaire-audit[^\s"'<>]*/gi;

if (auditFormUrl) {
  executiveLetterHtml = executiveLetterHtml.replace(brokenAuditPattern, auditFormUrl);
  executiveLetter = String(executiveLetter || '').replace(brokenAuditPattern, auditFormUrl);
}
```

### Nœud 2 : `Build Send Context`

Reconstruire l'URL canonique depuis `pack_id` et réparer le HTML avant envoi :

- extraction robuste de `pack_id`
- reconstruction de :
```text
https://www.transferai.ci/questionnaire-audit?pack_id=...
```
- remplacement regex de tout ancien lien cassé
- suppression des blocs formulaire dupliqués
- génération finale de `external_email_html`

### Nœud 3 : `Send External Prospect Email`

Le nœud doit utiliser en priorité :

```js
ctx.external_email_html
```

et non le vieux `executive_letter_html` si celui-ci n'a pas été réparé.

## 14. Pourquoi le problème semblait persister

### Cause

Gmail regroupait plusieurs anciens emails dans le même thread.

### Effet

Tu regardais parfois :

- un ancien email d'approbation
- un ancien email prospect
- un ancien `pack_id`

alors que le nouveau workflow générait déjà un lien correct.

### Conclusion

Le fix était bon, mais les anciens mails restaient inchangés.

## 15. Doublons observés : vrai doublon ou faux doublon ?

### Symptôme

Deux emails d'approbation reçus pour `Orange Côte d'Ivoire` avec deux `pack_id` différents.

### Vérification base

Contrôle de `prospect_targets` :

- pas de doublon exact trouvé sur :
  - `organization_name`
  - `target_email`
  - `website`

### Vraie explication

Il s'agissait de plusieurs packs historiques dans `ai_prospecting_packs`, pas d'un doublon CRM certain à supprimer.

### Recommandation

Ne pas supprimer de ligne prospect sans confirmation explicite.  
Si besoin de nettoyage, supprimer uniquement les **anciens packs de test**.

## 16. `Send External Prospect Email` avait une erreur de syntaxe

### Symptôme

- `invalid syntax` dans l'éditeur d'expression

### Cause

Mauvais échappement :

```js
d\\'audit
```

au lieu de :

```js
d\'audit
```

### Fix

Utiliser un apostrophe correctement échappé dans la chaîne JavaScript.

## 17. `can_send` passait à `false`

### Causes possibles

- `target_email` vide
- `executive_letter` vide
- moins de 2 pièces jointes
- PDF absent
- PPTX absent
- `pack_id` absent

### Règle validée

```js
var canSend = Boolean(
  src.target_email &&
  src.executive_letter &&
  src.executive_letter.trim().length > 0 &&
  attachments.length >= 2 &&
  hasPdf &&
  hasPptx &&
  packId
);
```

## 18. État final validé

### V4

- lecture Supabase
- normalisation
- contexte batch injecté
- quota journalier
- dispatch V3
- logs
- résumé
- finalisation

### V3

- pack généré
- email d'approbation correct
- email prospect avec lien corrigé
- email interne de confirmation correct

## 19. Procédure de retest propre

Toujours retester avec :

1. un **nouveau pack**
2. un **nouvel email d'approbation**
3. un **nouvel email prospect**
4. un **nouveau `pack_id`**

Ne jamais valider le fix en cliquant sur un ancien email du thread Gmail.

## 20. Conclusion opérationnelle

Le système est maintenant stabilisé sur :

- V4 batch Supabase
- V3 CRM approval autosend
- génération et injection du `pack_id`
- correction du lien questionnaire

Le point restant n'est plus un bug workflow.  
Le prochain chantier éventuel est la remise en place contrôlée des sources Airtable et Google Sheets avec un merge de sources complet dans V4.

---

## 83_Guide_Administrateur_Connexion_Pack_Prospect_Interfaces_Email_CRM_2026-06-11

Source : `docs/transferai-admin/83_Guide_Administrateur_Connexion_Pack_Prospect_Interfaces_Email_CRM_2026-06-11.md`

# Guide Administrateur - Connexion du Pack Prospect aux Interfaces Email CRM

Date : 11 juin 2026

## 1. Objet du document

Ce guide explique comment connecter le `pack prospect` genere par le `Workflow V3 principal` a une interface d'envoi admin compatible avec :

- `Zoho Mail`
- `Gmail`
- `Outlook / Microsoft 365`
- et, plus tard, tout autre fournisseur email sortant

Le pack prospect est le bloc commercial complet cree avant envoi au prospect. Il contient deja :

- le `courrier prospect`
- le `deck de presentation`
- le `mini-catalogue cible`
- et, plus tard, tout autre document joint

L'objectif n'est pas de faire envoyer les emails directement depuis le CRM, mais de mettre en place une `interface de validation et d'envoi` qui :

1. lit les prospects depuis le CRM ou Supabase
2. lit les packs depuis Supabase
3. permet une validation humaine avant envoi
4. appelle `n8n` pour executer l'envoi via le fournisseur email choisi

---

## 2. Principe d'architecture

Le modele recommande est le suivant :

```text
CRM / Base prospects
  -> alimente prospect_targets

Workflow V3 principal (n8n)
  -> genere le pack prospect
  -> stocke le pack dans ai_prospecting_packs

Interface Admin de validation
  -> affiche le courrier
  -> affiche le deck et le mini-catalogue
  -> permet Approuver / Rejeter / Regenerer / Envoyer

n8n backend
  -> execute l'action demandee
  -> envoie via Zoho, Gmail, Outlook ou autre
  -> journalise l'envoi dans outreach_attempts

Supabase
  -> reste la source de verite pour les statuts
```

En pratique :

- `le front admin` sert a piloter
- `Supabase` sert a stocker et relire
- `n8n` sert a agir
- `le fournisseur email` sert a expédier

---

## 3. Tables et objets deja utilises

Le dispositif repose deja sur les tables suivantes :

### 3.1 `prospect_targets`

Role :

- source canonique des prospects a traiter
- point d'entree CRM operationnel

Champs utiles minimaux :

- `prospect_id`
- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `target_email`
- `custom_page_paths_csv`
- `booking_link_45min`
- `commercial_priority_default`
- `status`
- `paused`
- `do_not_contact`
- `last_pack_id`

### 3.2 `ai_prospecting_packs`

Role :

- stocker le pack genere par le workflow V3

Champs utiles minimaux :

- `pack_id`
- `prospect_id`
- `organization_name`
- `decision_maker_name`
- `target_email`
- `status`
- `payload`
- `approved_at`
- `rejected_at`
- `sent_at`
- `resend_message_id`
- `reviewer_email`
- `error_reason`

### 3.3 `outreach_attempts`

Role :

- journaliser tout envoi reel

Champs utiles minimaux :

- `prospect_id`
- `pack_id`
- `organization_name`
- `target_email`
- `channel`
- `message_variant`
- `sent_at`
- `delivery_status`
- `response_status`
- `follow_up_due_at`

---

## 4. Ce que doit contenir le pack avant connexion a Zoho, Gmail ou Outlook

Avant tout branchement fournisseur, le pack doit etre complet et envoyable.

Le pack doit comporter :

- `pack_id`
- `target_email`
- `executive_letter` ou `executive_letter_html`
- `catalogue_artifact`
- `deck_artifact`
- `mail_attachments` ou une logique de reconstruction des pieces jointes
- `audit_form_url`
- `booking_link_45min`

Le controle fonctionnel minimum est :

- `attachments_count >= 2`
- presence du `PDF` du mini-catalogue
- presence du `PPTX` du deck
- `can_send = true`

Ces verifications doivent etre faites dans `n8n` avant l'envoi.

---

## 5. Les 3 etapes de creation de l'interface

## Etape 1 - Creer la couche de connexion fournisseur email

### Objectif

Construire une couche technique unique qui permet a l'interface admin d'envoyer un pack via :

- `Zoho`
- `Gmail`
- `Outlook`

Cette couche ne doit pas dependre du fournisseur choisi par l'admin.

### Ce qu'il faut creer

Une configuration fournisseur, par exemple `email_provider_configs`, ou un equivalent dans vos variables d'environnement / secrets.

### Entrants obligatoires de cette etape

- `provider_key`
- `provider_type`
- `transport_mode`
- `sender_name`
- `from_email`
- `reply_to_email`
- `auth_mode`
- `api_base_url` si mode API
- `smtp_host` si mode SMTP
- `smtp_port` si mode SMTP
- `oauth_client_id` si mode OAuth
- `oauth_client_secret_ref`
- `access_token_ref`
- `refresh_token_ref`
- `api_key_ref` si mode API key
- `default_bcc` optionnel
- `daily_send_limit`
- `per_minute_limit`
- `is_active`

### Valeurs attendues

#### Pour `provider_type`

- `zoho`
- `gmail`
- `outlook`
- `custom`

#### Pour `transport_mode`

- `api`
- `smtp`
- `oauth_api`

#### Pour `auth_mode`

- `api_key`
- `app_password`
- `oauth2`

### Rendu attendu de l'etape 1

La plateforme doit etre capable de dire :

- quel fournisseur est actif
- quel expediteur est utilise
- quel mode d'authentification est choisi
- si le fournisseur supporte les pieces jointes
- si un test d'envoi a ete valide

### Recommandation experte

Le plus propre est d'introduire un `provider adapter` dans `n8n`, avec une logique unique :

- le front demande `envoyer ce pack`
- `n8n` choisit le bon connecteur
- `n8n` transforme la requete en format Zoho, Gmail ou Outlook

Autrement dit :

- `le front ne connait pas le fournisseur`
- `n8n connait le fournisseur`

---

## Etape 2 - Creer l'interface admin de validation du pack

### Objectif

Permettre a l'administrateur de :

- voir le courrier prospect
- voir le deck
- voir le mini-catalogue
- verifier l'email cible
- approuver ou rejeter
- declencher l'envoi

### Ce que l'interface doit afficher

#### Bloc `Resume Prospect`

- organisation
- decideur
- secteur
- type d'organisation
- pays
- email cible
- priorite commerciale

#### Bloc `Courrier Pret a Partir`

- sujet
- corps du courrier
- version HTML ou texte formate

#### Bloc `Pieces Jointes`

- deck PPTX
- mini-catalogue PDF
- autres documents si ajoutes plus tard

#### Bloc `Diagnostic d'Envoi`

- `pack_id`
- `attachments_count`
- `can_send`
- presence du PDF
- presence du PPTX
- statut du pack
- motif d'erreur si bloquant

#### Bloc `Actions`

- `Generer pack`
- `Regenerer`
- `Approuver`
- `Rejeter`
- `Envoyer`

### Entrants obligatoires de cette etape

#### Entrants en lecture depuis `prospect_targets`

- `prospect_id`
- `organization_name`
- `decision_maker_name`
- `target_email`
- `sector_guess`
- `organization_type`
- `status`
- `last_pack_id`
- `next_action_at`

#### Entrants en lecture depuis `ai_prospecting_packs`

- `pack_id`
- `prospect_id`
- `organization_name`
- `target_email`
- `status`
- `payload`
- `approved_at`
- `rejected_at`
- `sent_at`
- `reviewer_email`
- `error_reason`

#### Entrants en lecture depuis `outreach_attempts`

- `pack_id`
- `prospect_id`
- `target_email`
- `sent_at`
- `delivery_status`
- `response_status`

### Rendu attendu de l'etape 2

L'admin doit pouvoir ouvrir une fiche pack et prendre une decision sans passer par `n8n` ni par Supabase en direct.

Le role du front est uniquement :

- afficher
- confirmer
- appeler l'action backend

---

## Etape 3 - Connecter l'interface au CRM et a n8n pour l'envoi reel

### Objectif

Faire le lien complet entre :

- le CRM
- les tables Supabase
- le workflow V3 principal
- le fournisseur email

### Flux metier recommande

1. le CRM ou la base alimente `prospect_targets`
2. l'admin ouvre l'interface
3. l'admin clique `Generer pack`
4. `n8n` execute le workflow V3
5. le pack est stocke dans `ai_prospecting_packs`
6. l'admin ouvre le pack et le valide
7. l'admin clique `Approuver et envoyer`
8. `n8n` envoie via Zoho, Gmail ou Outlook
9. `outreach_attempts` est alimente
10. `prospect_targets` est mis a jour

### Entrants obligatoires de cette etape

#### Entrants CRM vers `prospect_targets`

- `prospect_id`
- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `target_email`
- `custom_page_paths_csv`
- `booking_link_45min`
- `commercial_priority_default`
- `research_scope`
- `source_backend`
- `source_label`
- `raw_source_id`
- `niche_status`
- `last_response_status`
- `last_sequence_result`
- `prospect_language`

#### Entrants du front vers `n8n`

##### Bouton `Generer pack`

- `prospect_id`
- `triggered_by`
- `source = backoffice`
- `force`

##### Bouton `Regenerer`

- `pack_id`
- `prospect_id`
- `triggered_by`
- `reason`

##### Bouton `Approuver`

- `pack_id`
- `reviewer_email`
- `mode = approve_only`
- `notes`

##### Bouton `Approuver et envoyer`

- `pack_id`
- `reviewer_email`
- `mode = approve_and_send`
- `notes`

##### Bouton `Rejeter`

- `pack_id`
- `reviewer_email`
- `reason`
- `reset_prospect_to_ready`

##### Bouton `Envoyer`

- `pack_id`
- `reviewer_email`
- `force`

### Rendu attendu de l'etape 3

L'envoi doit fonctionner de la meme facon quel que soit le fournisseur :

- le front appelle `n8n`
- `n8n` verifie le pack
- `n8n` selectionne le connecteur email
- `n8n` envoie
- `n8n` met a jour Supabase
- le front recharge le statut

---

## 6. Webhooks `n8n` a creer pour cette interface

Je recommande les endpoints suivants.

### `POST /webhook/prospect-pack/generate`

Role :

- lancer V3 pour un prospect

Request :

```json
{
  "prospect_id": "fipme-001",
  "triggered_by": "marius@transferai.ci",
  "source": "backoffice",
  "force": false
}
```

Response minimale :

```json
{
  "ok": true,
  "action": "generate_pack",
  "status": "accepted",
  "prospect_id": "fipme-001",
  "message": "Generation lancee."
}
```

### `POST /webhook/prospect-pack/regenerate`

Role :

- reconstruire un pack existant

### `POST /webhook/prospect-pack/approve`

Role :

- approuver seulement
- ou approuver puis envoyer

### `POST /webhook/prospect-pack/reject`

Role :

- rejeter le pack
- remettre le prospect en correction

### `POST /webhook/prospect-pack/send`

Role :

- envoyer un pack valide

### `GET /webhook/approve-prospect-pack-v3`

Role :

- garder la compatibilite avec l'email interne d'approbation
- ne pas en faire l'interface admin principale

---

## 7. Mapping fournisseur email

L'interface admin doit rester identique. Seul le `provider adapter` change.

## 7.1 Zoho

Modes possibles :

- `SMTP`
- `API` si service transactionnel distinct utilise
- `OAuth` si integration geree en mode compte professionnel

Entrants minimum :

- `provider_type = zoho`
- `transport_mode`
- `from_email`
- `sender_name`
- `reply_to_email`
- `auth_mode`
- `secret_ref`

## 7.2 Gmail

Modes possibles :

- `SMTP`
- `OAuth2`
- `API Gmail`

Entrants minimum :

- `provider_type = gmail`
- `transport_mode`
- `from_email`
- `sender_name`
- `reply_to_email`
- `auth_mode`
- `secret_ref`

## 7.3 Outlook / Microsoft 365

Modes possibles :

- `SMTP`
- `OAuth2`
- `Graph API`

Entrants minimum :

- `provider_type = outlook`
- `transport_mode`
- `from_email`
- `sender_name`
- `reply_to_email`
- `auth_mode`
- `secret_ref`

### Regle importante

Le front ne doit jamais coder en dur :

- le host SMTP
- la cle API
- les tokens OAuth
- les limites du fournisseur

Tout cela doit vivre dans la couche backend / secrets.

---

## 8. Ce que `n8n` doit verifier avant envoi

Avant l'appel au fournisseur email, `n8n` doit valider :

- `pack_id` present
- `prospect_id` present si applicable
- `target_email` present
- `executive_letter` ou `executive_letter_html` present
- `attachments_count >= 2`
- `PDF` present
- `PPTX` present
- `can_send = true`
- fournisseur actif disponible

Si un point manque :

- le pack passe en `approval_error`
- le prospect passe en `paused`
- l'interface doit afficher le motif

---

## 9. Mises a jour de statut attendues

## 9.1 Si envoi reussi

### `ai_prospecting_packs`

- `status = sent`
- `sent_at`
- `reviewer_email`
- `provider_message_id` ou equivalent

### `outreach_attempts`

- insertion d'une ligne avec :
  - `channel = email`
  - `delivery_status = submitted`
  - `response_status = pending`

### `prospect_targets`

- `status = active`
- `last_sequence_result = sent_v3`
- `last_response_status = pending`
- `niche_status = outreach_started`
- `next_action_at = +5 jours`

## 9.2 Si rejet

### `ai_prospecting_packs`

- `status = rejected`
- `rejected_at`
- `reviewer_email`

### `prospect_targets`

- `status = ready`
- `last_sequence_result = rejected_internal_v3`
- `niche_status = needs_manual_revision`

## 9.3 Si erreur d'approbation ou erreur d'envoi

### `ai_prospecting_packs`

- `status = approval_error`
- `error_reason`

### `prospect_targets`

- `status = paused`
- `paused = true`
- `last_sequence_result = approval_error_v3`
- `niche_status = internal_fix_required`

---

## 10. Checklist administrateur avant mise en production

### Cote interface

- [ ] Vue `Prospects` disponible
- [ ] Vue `Packs` disponible
- [ ] Vue `Detail pack` disponible
- [ ] Boutons `Generer`, `Regenerer`, `Approuver`, `Rejeter`, `Envoyer` disponibles

### Cote Supabase

- [ ] lecture `prospect_targets`
- [ ] lecture `ai_prospecting_packs`
- [ ] lecture `outreach_attempts`
- [ ] ecriture par `n8n` verifiee

### Cote n8n

- [ ] webhook `generate` cree
- [ ] webhook `regenerate` cree
- [ ] webhook `approve` cree
- [ ] webhook `reject` cree
- [ ] webhook `send` cree
- [ ] compatibilite avec `approve-prospect-pack-v3` conservee

### Cote fournisseur email

- [ ] expediteur valide
- [ ] authentification valide
- [ ] test avec pieces jointes valide
- [ ] test sur un prospect interne valide

---

## 11. Recommandation finale

La bonne architecture n'est pas :

- `CRM -> email direct`

La bonne architecture est :

- `CRM -> prospect_targets -> V3 -> ai_prospecting_packs -> interface admin -> n8n -> fournisseur email -> outreach_attempts`

Cette approche permet :

- un controle humain avant envoi
- la relecture du courrier
- la verification des pieces jointes
- le choix du fournisseur email
- une traçabilite propre
- une compatibilite durable avec Zoho, Gmail, Outlook et futurs connecteurs

---

## 12. Entrees consolidees a prevoir dans le projet

Pour finaliser la mise en oeuvre, les entrants suivants doivent etre disponibles.

### Entrants metier

- prospect issu du CRM
- email cible
- langue prospect
- secteur
- organisation
- decideur

### Entrants documents

- courrier prospect
- deck PPTX
- mini-catalogue PDF
- futurs documents additionnels

### Entrants techniques

- webhook URLs n8n
- token admin
- configuration fournisseur email
- secret refs
- regles d'envoi

### Entrants de suivi

- statut pack
- statut envoi
- statut reponse
- prochaine relance

Ce sont ces entrants qui doivent etre formalises dans l'interface, dans Supabase et dans `n8n`.

---

## 92_Guide_Activation_Google_Forms_Social_Lead_Sequence_V1

Source : `docs/transferai-admin/92_Guide_Activation_Google_Forms_Social_Lead_Sequence_V1.md`

# Guide d’activation - Google Forms Social Lead Sequence V1

## Ce que vous faites maintenant

1. Importer le workflow [91_n8n_Google_Forms_Social_Lead_Sequence_V1_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/91_n8n_Google_Forms_Social_Lead_Sequence_V1_Exportable.json) dans n8n.
2. Vérifier les variables d’environnement :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `OUTREACH_FROM_EMAIL`
   - `BOOKING_LINK_45MIN`
3. Brancher vos Google Forms vers le webhook `google-forms-social-leads`.
4. Faire un test avec un faux lead du formulaire `assistant_training_interest`.
5. Faire un test avec un faux lead du formulaire `enterprise_ai_interest`.
6. Vérifier dans Supabase :
   - table `prospect_targets`
   - table `outreach_attempts`
7. Activer ensuite le workflow.

## Rôle du workflow

Ce workflow gère :

- l’entrée des leads issus de Google Forms
- la normalisation des réponses
- le scoring léger `hot / warm / cool`
- la décision d’autoriser ou non le 3e email
- l’envoi immédiat du 1er email
- la relance automatique du 2e email
- la relance automatique du 3e email si autorisée
- la mise à jour CRM dans `prospect_targets`
- la journalisation des emails dans `outreach_attempts`

## Deux formulaires couverts

### 1. Formation secrétaires / assistants

Le workflow détecte ce formulaire comme :

- `form_type = assistant_training_interest`

Il adapte le contenu des emails selon :

- les tâches choisies
- le besoin principal
- l’intérêt pour participer au lancement

### 2. IA entreprise Côte d’Ivoire

Le workflow détecte ce formulaire comme :

- `form_type = enterprise_ai_interest`

Il adapte le contenu des emails selon :

- le niveau d’usage actuel de l’IA
- les domaines d’intérêt
- la perception du niveau de sécurité
- le souhait d’être recontacté

## Règles métier intégrées

- si le prospect a laissé un email et reste réengageable, le 1er email part immédiatement
- le 2e email part automatiquement après le délai configuré
- le 3e email ne part que si `allow_third_email = true`
- si le prospect exprime un non clair ou un “pas pour le moment”, la séquence s’arrête
- si l’envoi échoue, le prospect passe en `paused`

## Délai par défaut

- email 1 : immédiat
- email 2 : `J+4`
- email 3 : `J+7` après le 2e email

Ces délais sont pilotés par :

- `follow_up_delay_1_days`
- `follow_up_delay_2_days`

## Important sur Google Forms

Google Forms n’envoie pas nativement un POST direct vers n8n.

En pratique, vous avez 2 options propres :

1. connecter le formulaire à Google Sheets puis pousser la ligne vers n8n
2. utiliser un Google Apps Script sur soumission de formulaire pour appeler le webhook n8n

## Résultat attendu

Quand tout est branché correctement :

- un nouveau lead entre dans `prospect_targets`
- le 1er email est envoyé
- une ligne est créée dans `outreach_attempts`
- `next_action_at` est positionné pour la relance
- le scheduler prend ensuite le relais pour email 2 puis email 3

---

## 95_Guide_Activation_WhatsApp_Auto_Reply_And_Followup

Source : `docs/transferai-admin/95_Guide_Activation_WhatsApp_Auto_Reply_And_Followup.md`

# Guide d'activation - WhatsApp auto-reply + relance RDV

Date : 18 juin 2026

## Objectif

Mettre en place un flux simple et exploitable tout de suite :

1. un prospect envoie un message WhatsApp
2. le système répond immédiatement avec un premier message de prise de contact
3. si le prospect ne répond pas encore, le système envoie automatiquement un second message avec proposition de rendez-vous

## Faut-il encore un workflow n8n ?

Non, pas pour cette version minimale.

Cette implémentation repose directement sur :

- `Twilio WhatsApp`
- `Supabase Edge Functions`
- `Supabase Cron`

Tu pourras ajouter `n8n` plus tard si tu veux :

- qualifier automatiquement le prospect avec IA
- router vers un humain selon le besoin
- enrichir le CRM
- pousser une logique de séquence plus avancée

Mais pour :

- `message 1` immédiat
- `message 2` de relance RDV

`n8n` n'est pas obligatoire.

## Fichiers concernés

- `supabase/functions/twilio-whatsapp-webhook/index.ts`
- `supabase/functions/whatsapp-followup-scheduler/index.ts`
- `supabase/functions/_shared/whatsapp-followups.ts`
- `supabase/migrations/20260618110000_create_whatsapp_followup_sequences.sql`
- `supabase/migrations/20260618111000_schedule_whatsapp_followup_scheduler.sql`

## Ce que fait désormais le système

### Premier message

Dès qu'un nouveau message entrant WhatsApp est reçu :

- il est stocké dans `whatsapp_inbound_messages`
- une notification interne email continue à partir
- une séquence de suivi est créée dans `whatsapp_followup_sequences`
- une réponse immédiate est renvoyée au prospect

### Deuxième message

Un scheduler tourne toutes les `15 minutes`.

Il vérifie les séquences en attente :

- si le prospect a déjà réécrit, la relance est annulée
- si le prospect n'a pas encore répondu et que le délai est écoulé, le second message est envoyé

## Messages par défaut

### Message 1

```text
Bonjour, merci pour votre message et votre intérêt pour TransferAI. Nous avons bien reçu votre demande. Pouvez-vous nous préciser en une phrase votre besoin principal afin que nous vous orientions rapidement ?
```

### Message 2

```text
Bonjour, je me permets de vous relancer. Si vous le souhaitez, vous pouvez déjà réserver un créneau d’échange avec notre équipe ici : https://calendly.com/marius-ayoro70/devis-quote-preparation-call. Si vous préférez, répondez simplement à ce message avec votre besoin principal.
```

## Variables d'environnement à renseigner

### Déjà nécessaires côté Twilio

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`

### Nouvelles variables recommandées

- `WHATSAPP_BOOKING_LINK`
- `WHATSAPP_FOLLOWUP_DELAY_HOURS`
- `WHATSAPP_AUTO_REPLY_FIRST`
- `WHATSAPP_AUTO_REPLY_SECOND`
- `WHATSAPP_SCHEDULER_TOKEN`

## Valeurs recommandées

### `WHATSAPP_BOOKING_LINK`

```text
https://calendly.com/marius-ayoro70/devis-quote-preparation-call
```

### `WHATSAPP_FOLLOWUP_DELAY_HOURS`

Valeur conseillée :

```text
20
```

Pourquoi `20` :

- cela reste dans la fenêtre opérationnelle WhatsApp de 24h après le message entrant
- cela évite une relance trop agressive

Si tu veux une relance beaucoup plus rapide, tu peux mettre par exemple :

- `2`
- `4`
- `6`

mais il faut rester `< 24`.

### `WHATSAPP_AUTO_REPLY_FIRST`

Exemple :

```text
Bonjour{{PROFILE_SUFFIX}}, merci pour votre message et votre intérêt pour TransferAI. Nous avons bien reçu votre demande. Pouvez-vous nous préciser en une phrase votre besoin principal afin que nous vous orientions rapidement ?
```

### `WHATSAPP_AUTO_REPLY_SECOND`

Exemple :

```text
Bonjour{{PROFILE_SUFFIX}}, je me permets de vous relancer. Si vous le souhaitez, vous pouvez déjà réserver un créneau d’échange avec notre équipe ici : {{BOOKING_LINK}}. Si vous préférez, répondez simplement à ce message avec votre besoin principal.
```

Tokens disponibles :

- `{{PROFILE_SUFFIX}}`
- `{{PROFILE_NAME}}`
- `{{BOOKING_LINK}}`

## Secret Vault à prévoir pour le scheduler

Le cron SQL attend un secret Vault nommé :

```text
transferai_whatsapp_scheduler_token
```

Il doit correspondre à :

```text
WHATSAPP_SCHEDULER_TOKEN
```

Le cron réutilise aussi :

```text
transferai_project_url
```

## Comment activer concrètement

### 1. Déployer les migrations

Appliquer :

- `20260618110000_create_whatsapp_followup_sequences.sql`
- `20260618111000_schedule_whatsapp_followup_scheduler.sql`

### 2. Déployer les Edge Functions

Déployer :

- `twilio-whatsapp-webhook`
- `whatsapp-followup-scheduler`

### 3. Renseigner les variables côté Supabase

Au minimum :

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `WHATSAPP_SCHEDULER_TOKEN`
- `WHATSAPP_BOOKING_LINK`
- `WHATSAPP_FOLLOWUP_DELAY_HOURS`

### 4. Renseigner le secret Vault du cron

Créer ou mettre à jour :

- `transferai_whatsapp_scheduler_token`

### 5. Tester le flux

Test simple :

1. envoyer un message WhatsApp depuis un vrai numéro
2. vérifier l'apparition dans `whatsapp_inbound_messages`
3. vérifier la création dans `whatsapp_followup_sequences`
4. vérifier la réponse immédiate
5. ne pas répondre
6. attendre le délai configuré
7. vérifier l'envoi de la relance RDV

### 6. Vérifier le comportement si le prospect répond avant la relance

1. envoyer un premier message
2. recevoir le message automatique
3. répondre avant l'échéance
4. vérifier que la séquence passe en `prospect_replied`
5. vérifier qu'aucun second message n'est envoyé

## États de séquence

La table `whatsapp_followup_sequences` peut contenir :

- `pending_second_followup`
- `second_followup_sent`
- `prospect_replied`
- `opted_out`
- `closed`
- `error`

## Recommandation d'exploitation

La version la plus simple à lancer maintenant est :

1. `message 1` sans lien RDV
2. `message 2` avec lien Calendly

Ensuite seulement, si le flux marche bien, tu peux ajouter :

1. qualification IA
2. création automatique de lead CRM
3. routage humain
4. séquence `message 3`
5. adaptation du message selon le type de besoin

## Décision concrète recommandée

Pour lancer maintenant :

- ne pas attendre un workflow `n8n`
- garder `Zoho` pour l'interne et l'email
- utiliser `Twilio + Supabase` pour les deux premiers messages WhatsApp

Cela te donne le chemin le plus court entre :

- message entrant prospect
- premier accusé de réception
- deuxième relance de prise de rendez-vous

sans rajouter une couche technique de plus.

---

## 96_Guide_Utilisateur_WhatsApp_Live_Chatwoot_IA_2026-06-18

Source : `docs/transferai-admin/96_Guide_Utilisateur_WhatsApp_Live_Chatwoot_IA_2026-06-18.md`

# Guide utilisateur - WhatsApp live + Chatwoot intelligent + IA

Date : 18 juin 2026

## 1. Objectif

Ce guide récapitule tout ce qui a été fait dans la matinée et explique comment passer de :

- un numéro WhatsApp Twilio fonctionnel
- un sandbox de test validé
- un Chatwoot Website déjà préparé
- un workflow `n8n + OpenAI` déjà corrigé

vers :

- un **numéro WhatsApp live** TransferAI capable de recevoir des prospects
- une **réponse automatique intelligente**
- une **centralisation dans Chatwoot**
- une **reprise humaine simple**
- une **qualification réutilisable** pour le CRM et les workflows V1 à V6

## 2. Résumé de ce qui a été réalisé aujourd'hui

### 2.1 WhatsApp Twilio / Supabase

Le flux technique minimal WhatsApp a été activé et validé :

- `Twilio WhatsApp Sandbox` activé
- `Supabase CLI` relié au projet
- secrets Supabase renseignés
- fonctions Edge déployées
- migrations SQL appliquées
- scheduler de relance créé
- premier message automatique WhatsApp validé
- lien Calendly corrigé vers :

```text
https://calendly.com/contact-transferai/30min
```

### 2.2 Numéro WhatsApp live

Le numéro WhatsApp entreprise est déjà enregistré comme sender Twilio live :

- numéro live : `+2250716573990`
- display name : `TransferAI Nettelecom`
- statut : `Online`

Le sandbox reste utile uniquement pour les tests isolés.

### 2.3 Chatwoot

Le socle Chatwoot a été préparé :

- workspace `TransferAI`
- inbox website `TransferAI`
- domaine `transferai.ci`
- collaborateurs rattachés
- webhook sortant vers n8n configuré
- account ID confirmé : `163278`
- base de travail prête pour labels, attributs et handoff humain

### 2.4 n8n / OpenAI / Chatwoot

Le workflow Chatwoot intelligent a été préparé puis corrigé.

Versions importantes :

- prototype simple : `20_n8n_Chatwoot_Auto_Reply_V1.json`
- workflow avancé initial : `30_n8n_Chatwoot_Auto_Reply_V5.5_Calendly.json`
- workflow corrigé recommandé : `31_n8n_Chatwoot_Auto_Reply_V5.5.2_Calendly.json`

La correction principale apportée sur `V5.5.2` :

- prise en charge de `conversation_created`
- prise en charge de `message_created`
- bon lien Calendly
- path webhook cohérent :

```text
chatwoot-inbound-v5-5
```

Webhook n8n attendu :

```text
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/chatwoot-inbound-v5-5
```

### 2.5 Base de connaissance IA

La base de connaissance a été enrichie pour éviter les hallucinations sur :

- le site `transferai.ci`
- les offres
- les CTA
- WhatsApp
- Chatwoot
- la logique de prospection
- l'architecture V1 à V6

Fichier de référence :

- `docs/transferai-admin/06_knowledge_base_chatbot.json`

## 3. Fichiers clés à connaître

### 3.1 WhatsApp / Supabase

- `supabase/functions/twilio-whatsapp-webhook/index.ts`
- `supabase/functions/whatsapp-followup-scheduler/index.ts`
- `supabase/functions/_shared/whatsapp-followups.ts`
- `supabase/migrations/20260618110000_create_whatsapp_followup_sequences.sql`
- `supabase/migrations/20260618111000_schedule_whatsapp_followup_scheduler.sql`
- `docs/transferai-admin/95_Guide_Activation_WhatsApp_Auto_Reply_And_Followup.md`

### 3.2 Chatwoot / n8n

- `docs/transferai-admin/17_Checklist_Chatwoot_Preparation.md`
- `docs/transferai-admin/18_Mapping_Chatwoot_Vers_n8n.md`
- `docs/transferai-admin/19_Prompts_Operationnels_Chatwoot_n8n_V1.md`
- `docs/transferai-admin/20_n8n_Chatwoot_Auto_Reply_V1.json`
- `docs/transferai-admin/30_n8n_Chatwoot_Auto_Reply_V5.5_Calendly.json`
- `docs/transferai-admin/31_n8n_Chatwoot_Auto_Reply_V5.5.2_Calendly.json`

### 3.3 Base de connaissance

- `docs/transferai-admin/06_knowledge_base_chatbot.json`

## 4. Résumé simple des workflows V1 à V6

### V1

Prototype manuel prospect unique.

But :

- prouver le concept
- générer un pack commercial sur un prospect

### V2

Prospect unique + stockage Supabase + approbation interne.

But :

- structurer le circuit de validation avant envoi

### V3

CRM enhanced approval + auto-send.

But :

- générer le pack
- faire approuver
- envoyer au prospect

### V4

Batch multi-prospects.

But :

- traiter des lots
- appliquer quotas
- dispatch vers les workflows enfants

### V5

CRM growth loop.

But :

- enrichir `prospect_targets`
- normaliser les leads
- pré-prioriser avant batch

### V6

Dashboard post-audit + synchronisation Google Sheets.

But :

- rendre le suivi métier lisible
- notifier les experts

## 5. Place de Chatwoot dans cet écosystème

Chatwoot n'est pas un remplacement de V1 à V6.

Chatwoot joue un autre rôle :

- surface de conversation visible
- point de reprise humaine
- lecture centralisée des échanges
- support aux réponses IA
- support à la qualification temps réel

En clair :

- `V1 à V6` = moteur commercial / prospection / CRM
- `Chatwoot` = moteur conversationnel visible
- `n8n` = orchestrateur
- `OpenAI` = cerveau de réponse et de qualification
- `Supabase` = stockage métier et back-office

## 6. Les 3 scénarios possibles

### Option 1 - WhatsApp live -> Chatwoot direct -> n8n

Le numéro live est connecté directement à Chatwoot.

Flux :

1. prospect écrit sur WhatsApp
2. Chatwoot reçoit la conversation
3. Chatwoot appelle n8n
4. n8n appelle OpenAI
5. n8n répond dans Chatwoot
6. Chatwoot affiche à l'équipe

Points forts :

- rapide à mettre en service
- une seule boîte de réception visible
- excellent pour la reprise humaine

Points faibles :

- moins de contrôle métier en amont
- dépend de ce que Chatwoot propose comme intégration

### Option 2 - WhatsApp live -> n8n -> Chatwoot

n8n devient le point d'entrée principal.

Flux :

1. prospect écrit sur WhatsApp
2. Twilio appelle n8n
3. n8n traite, qualifie, décide
4. n8n crée ou alimente la conversation Chatwoot
5. n8n répond
6. l'équipe suit ensuite dans Chatwoot

Points forts :

- très flexible
- excellent contrôle métier
- très bon pour brancher CRM, scoring, règles d'aiguillage

Points faibles :

- plus technique
- plus de risques de doublons si mal synchronisé

### Option 3 - WhatsApp live -> Supabase -> n8n -> Chatwoot

Supabase reste la source de vérité dès le premier message.

Flux :

1. prospect écrit sur WhatsApp
2. Twilio appelle Supabase
3. Supabase enregistre
4. n8n poursuit l'orchestration
5. Chatwoot sert de façade conversationnelle

Points forts :

- meilleure traçabilité data
- très cohérent avec le back-office actuel

Points faibles :

- architecture la plus lourde
- maintenance plus élevée

## 7. Recommandation actuelle

Pour répondre vite aux prospects qui commencent déjà à écrire sur WhatsApp, la meilleure phase 1 est :

### Recommandation immédiate

**Option 1**

Pourquoi :

- la plus rapide à mettre en service
- la plus simple pour l'équipe
- la plus directe pour répondre automatiquement aux prospects

### Recommandation moyen terme

Après stabilisation, migration progressive possible vers :

- `Option 2` si n8n doit devenir le cerveau central
- `Option 3` si Supabase doit devenir la source temps réel principale

## 8. Étapes détaillées pour réaliser l'Option 1 maintenant

## Étape 1 - Vérifier le sender live dans Twilio

Dans Twilio :

1. aller dans `Messaging`
2. aller dans `Senders`
3. ouvrir `WhatsApp senders`
4. cliquer sur le numéro `+2250716573990`

À vérifier :

- le statut est `Online`
- le numéro affiché est bien le numéro entreprise attendu
- le display name est correct

## Étape 2 - Identifier le webhook actuellement utilisé en live

Toujours dans Twilio, sur la fiche du sender live :

1. chercher les sections de type :
   - `Webhook`
   - `Inbound settings`
   - `When a message comes in`
   - `Callback URL`
2. noter l'URL actuelle

Objectif :

- savoir si le numéro live pointe encore vers Supabase
- éviter qu'il y ait deux moteurs qui répondent en même temps

## Étape 3 - Préparer la règle anti-double réponse

Avant la bascule, il faut décider du moteur principal.

Si tu passes en Option 1 :

- Chatwoot doit devenir le point de conversation principal
- l'ancien flux WhatsApp direct Supabase ne doit pas continuer à répondre en parallèle

Concrètement :

- soit tu retires l'ancienne logique de réponse directe sur le sender live
- soit tu réserves Supabase au sandbox ou aux logs

Objectif :

- un seul système répond

## Étape 4 - Créer l'inbox WhatsApp dans Chatwoot

Dans Chatwoot :

1. aller dans `Settings`
2. aller dans `Inboxes`
3. cliquer sur `Add Inbox`
4. choisir `WhatsApp`

Ensuite :

- si Chatwoot propose `Twilio`, choisir `Twilio`
- si Chatwoot ne propose pas Twilio pour ton environnement, arrêter l'Option 1 ici et basculer vers l'Option 2

## Étape 5 - Renseigner les informations demandées par Chatwoot

Selon l'écran affiché par Chatwoot, renseigner :

- `Twilio Account SID`
- `Twilio Auth Token`
- le numéro WhatsApp live `+2250716573990`
- éventuellement les informations de service ou de sender demandées

## Étape 6 - Récupérer l'URL callback de Chatwoot

Une fois l'inbox créée, Chatwoot fournit généralement une URL de callback ou un webhook à utiliser côté fournisseur.

Action :

1. copier cette URL
2. revenir dans Twilio
3. la coller dans le champ entrant du sender live WhatsApp

Objectif :

- faire en sorte que chaque message WhatsApp live crée une conversation dans Chatwoot

## Étape 7 - Tester le routage pur WhatsApp live -> Chatwoot

Faire un premier test sans IA.

Depuis un téléphone externe :

1. envoyer un message au numéro live
2. ouvrir Chatwoot
3. vérifier qu'une nouvelle conversation apparaît

Si la conversation n'apparaît pas :

- le problème est entre Twilio live et Chatwoot
- ne pas avancer plus loin avant résolution

## Étape 8 - Brancher le webhook Chatwoot vers n8n

Dans Chatwoot :

1. aller dans `Settings`
2. aller dans `Integrations`
3. ouvrir `Webhooks`
4. configurer l'URL suivante :

```text
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/chatwoot-inbound-v5-5
```

Événements à cocher :

- `Conversation Created`
- `Message created`

## Étape 9 - Importer et activer le workflow n8n recommandé

Dans n8n :

1. importer le fichier :

- `docs/transferai-admin/31_n8n_Chatwoot_Auto_Reply_V5.5.2_Calendly.json`

2. vérifier que le nœud `Chatwoot Webhook` a bien :

```text
chatwoot-inbound-v5-5
```

3. vérifier que les appels Chatwoot et OpenAI utilisent les bons tokens
4. publier le workflow

## Étape 10 - Tester l'IA dans Chatwoot

Faire un nouveau test depuis le vrai numéro WhatsApp live :

1. envoyer un message
2. ouvrir `n8n > Executions`
3. vérifier que l'exécution passe au moins par :
   - `Chatwoot Webhook`
   - `Filter Chatwoot event`
   - `Get conversation history`
   - `Build OpenAI reply payload`
   - `Call OpenAI reply`
   - `Send reply to Chatwoot`

## Étape 11 - Vérifier le résultat côté prospect

Sur le téléphone test :

1. vérifier qu'une réponse automatique est reçue
2. vérifier que le ton est correct
3. vérifier que le lien de réservation affiché est :

```text
https://calendly.com/contact-transferai/30min
```

## Étape 12 - Vérifier la qualification

Dans Chatwoot :

1. ouvrir la conversation
2. vérifier si les labels remontent
3. vérifier si les custom attributes sont enrichis
4. vérifier si un agent humain peut reprendre la main facilement

## 9. Test final recommandé

Faire 3 tests réels.

### Test A - Demande générale

Message :

```text
Bonjour, je souhaite en savoir plus sur vos services IA.
```

### Test B - Demande formation

Message :

```text
Bonjour, je cherche une formation IA pour mon entreprise.
```

### Test C - Demande de rendez-vous

Message :

```text
Bonjour, je souhaite réserver un échange avec votre équipe.
```

Objectif :

- vérifier la qualité de la réponse
- vérifier la proposition de prise de rendez-vous
- vérifier la qualification du besoin

## 10. Règle importante de sécurité

Des tokens Chatwoot / OpenAI ont été visibles dans certaines captures et certains exports.

À faire après stabilisation :

1. régénérer le token API Chatwoot utilisé dans les tests
2. régénérer la clé OpenAI si elle a été exposée
3. éviter les clés en dur dans les exports n8n
4. repasser à des credentials ou variables sécurisées

## 11. Décision recommandée

### Décision pour maintenant

Mettre en service **Option 1** pour répondre vite aux prospects WhatsApp.

### Décision pour plus tard

Préparer une évolution vers :

- `Option 2` si n8n doit devenir le cerveau central
- `Option 3` si Supabase doit devenir la source temps réel principale

## 12. Résumé exécutif

À l'heure actuelle :

- le numéro live existe
- le sandbox a été validé
- Supabase est prêt
- Chatwoot est prêt
- n8n V5.5.2 est prêt
- la base de connaissance est enrichie

La prochaine action utile n'est plus du développement supplémentaire.

La prochaine action utile est :

1. connecter le sender live Twilio à une inbox WhatsApp Chatwoot
2. brancher cette inbox sur le workflow n8n `V5.5.2`
3. faire un test live
4. vérifier la réponse automatique reçue par un vrai prospect

---

## 98_Guide_Utilisateur_Workflow_Google_Forms_Prospects_Ameliore_2026-06-20

Source : `docs/transferai-admin/98_Guide_Utilisateur_Workflow_Google_Forms_Prospects_Ameliore_2026-06-20.md`

# Guide Utilisateur - Workflow Google Forms Prospects Ameliore

Workflow de reference :

- `TransferAI Google Forms Social Lead Sequence V2 Clean Importable`
- Fichier : [93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json)

Date de mise a jour :

- `20 juin 2026`

## 1. Objet du guide

Ce guide explique comment utiliser le workflow Google Forms prospects ameliore de TransferAI.

Il couvre :

- la reception d'un prospect depuis Google Forms
- l'envoi automatique du premier email au prospect
- la creation ou mise a jour du prospect dans le CRM
- la notification interne admin
- les relances automatiques email 2 puis email 3
- les verifications a faire dans n8n apres chaque test ou en production

Ce guide est pense pour une utilisation operationnelle, sans devoir relire le workflow n8n noeud par noeud a chaque fois.

## 2. Ce que fait le workflow

Le workflow gere la chaine suivante :

1. un prospect remplit un Google Form
2. Google Sheets recoit la reponse
3. Google Apps Script pousse la reponse vers n8n
4. n8n normalise les reponses
5. n8n cree ou met a jour le prospect dans `prospect_targets`
6. n8n envoie le premier email au prospect
7. n8n journalise l'envoi dans `outreach_attempts`
8. n8n envoie une alerte interne a `contact@transferai.ci`
9. n8n prepare la relance automatique
10. le scheduler reprend ensuite la main pour email 2 puis email 3

## 3. Formulaires couverts

Le workflow reconnait actuellement deux grands cas :

### 3.1 Formation secretaires / assistants

Le type detecte est :

- `assistant_training_interest`

Ce cas sert a traiter les prospects qui manifestent un interet pour la formation IA destinee au secretariat, a l'assistanat et aux assistants de direction.

### 3.2 IA entreprise

Le type detecte est :

- `enterprise_ai_interest`

Ce cas sert a traiter les prospects entreprise qui demandent des services, solutions ou usages IA pour leur structure.

## 4. Architecture fonctionnelle simple

Le workflow a deux branches principales.

### 4.1 Branche nouvelle soumission

Flux principal :

1. `Google Forms Social Lead Webhook`
2. `Set Social Sequence Config`
3. `If New Lead Payload`
4. `Normalize Google Forms Lead`
5. `Prepare Social Prospect Record`
6. `Upsert Social Prospect Into CRM`
7. `Build Immediate Social Send Context`
8. `If Social Lead Ready To Send`
9. `Build Social Sequence Email`
10. `Send Social Sequence Email`
11. `Parse Social Send Result`
12. `If Social Email Sent`
13. `Log Social Outreach Attempt`
14. `Update Prospect After Social Send`

Branche admin en parallele depuis `Upsert Social Prospect Into CRM` :

1. `Build Admin Lead Alert Context`
2. `If Admin Alert Eligible`
3. `Build Admin Lead Alert Email`
4. `Send Admin Lead Alert`

### 4.2 Branche relances automatiques

Flux principal :

1. `Hourly Social Follow-Up Schedule`
2. `Set Social Sequence Config`
3. `If New Lead Payload`
4. `Fetch Social Prospect Snapshot`
5. `Build Due Social Follow-Ups`
6. `If Social Lead Ready To Send`
7. `Build Social Sequence Email`
8. `Send Social Sequence Email`
9. `Parse Social Send Result`
10. `If Social Email Sent`
11. `Log Social Outreach Attempt`
12. `Update Prospect After Social Send`

## 5. Prerequis pour que le workflow fonctionne

Avant exploitation, il faut verifier les points suivants.

### 5.1 Cote Google Forms / Google Sheets

- le formulaire est bien relie a une feuille Google Sheets
- la feuille recoit bien chaque nouvelle reponse
- le script Apps Script est colle dans la feuille de reponses
- le declencheur `On form submit` est bien cree cote Apps Script

### 5.2 Cote Apps Script

Le script doit pointer vers l'URL de production n8n :

```javascript
WEBHOOK_URL: 'https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/google-forms-social-leads'
```

Important :

- ne pas utiliser `webhook-test` en production
- ne pas lancer `onFormSubmitToN8n()` avec le bouton `Run`
- le script doit etre declenche par une vraie soumission du formulaire

### 5.3 Cote n8n

Le workflow doit etre :

- `Published`
- correctement configure avec les cles Supabase et Resend

### 5.4 Cote email admin

Le noeud `Send Admin Lead Alert` doit envoyer vers :

- `contact@transferai.ci`

## 6. Parametres de configuration a connaitre

Le noeud `Set Social Sequence Config` porte les principaux parametres.

Valeurs actuellement attendues :

- `source_backend = manual`
- `source_label_prefix = google_forms_social`
- `booking_link_45min = https://calendly.com/contact-transferai/30min`
- `follow_up_delay_1_days = 4`
- `follow_up_delay_2_days = 7`
- `follow_up_fetch_limit = 1`
- `default_country = Côte d'Ivoire`

Signification :

- `booking_link_45min` : lien de rendez-vous propose au prospect
- `follow_up_delay_1_days` : delai avant email 2
- `follow_up_delay_2_days` : delai avant email 3
- `follow_up_fetch_limit` : nombre de prospects relus a chaque cycle scheduler

## 7. Ce que fait chaque bloc metier

### 7.1 Normalisation du lead

Le noeud `Normalize Google Forms Lead` :

- lit le `body` du webhook
- extrait `answers`
- detecte le type de formulaire
- extrait nom, email, telephone, fonction, structure
- calcule `lead_temperature`
- decide si le troisieme email est autorise
- construit `prospect_id`

Sorties principales attendues :

- `prospect_id`
- `decision_maker_name`
- `organization_name`
- `target_email`
- `phone`
- `function_label`
- `form_type`
- `lead_temperature`
- `allow_third_email`
- `can_auto_sequence`

### 7.2 Preparation CRM

Le noeud `Prepare Social Prospect Record` prepare la ligne compatible avec `prospect_targets`.

Il remplit notamment :

- `status`
- `paused`
- `niche_status`
- `stop_reason`
- `next_action_at`
- `source_payload`

### 7.3 Envoi du premier email

Le noeud `Build Immediate Social Send Context` construit le contexte d'envoi immediat.

Le noeud `Build Social Sequence Email` genere :

- le sujet
- le texte
- le HTML
- la variante du message
- la date de prochaine action

Le noeud `Send Social Sequence Email` envoie ensuite l'email via Resend.

### 7.4 Notification admin

Le noeud `Build Admin Lead Alert Context` prepare les informations utiles pour l'equipe interne :

- nom du prospect
- email
- telephone
- structure
- fonction
- priorite
- besoin principal
- taches citees
- lien de rendez-vous

Le noeud `Send Admin Lead Alert` envoie ensuite cette alerte a :

- `contact@transferai.ci`

### 7.5 Relances automatiques

Le scheduler `Hourly Social Follow-Up Schedule` tourne selon la cron du workflow.

Il lit les prospects a relancer puis :

- envoie email 2
- ou envoie email 3 si autorise
- met a jour `next_action_at`
- met a jour `last_sequence_result`

## 8. Procedure d'utilisation quotidienne

### 8.1 Verifier qu'une nouvelle soumission est bien passee

Dans n8n :

1. ouvrir `Executions`
2. regarder la derniere execution en haut de la liste
3. verifier que le statut est `Succeeded`
4. cliquer sur l'execution
5. verifier que `Google Forms Social Lead Webhook` a bien recu un `body`

### 8.2 Verifier l'email prospect

Dans l'execution :

1. cliquer sur `Send Social Sequence Email`
2. verifier qu'un `id` est renvoye en `OUTPUT`

Si un `id` est present, Resend a accepte l'envoi.

### 8.3 Verifier l'alerte admin

Dans l'execution :

1. cliquer sur `Send Admin Lead Alert`
2. verifier qu'un `id` est renvoye en `OUTPUT`

Ensuite verifier la boite :

- `contact@transferai.ci`

### 8.4 Verifier le CRM

Dans Supabase, verifier dans `prospect_targets` :

- `prospect_id`
- `target_email`
- `status`
- `paused`
- `last_sequence_result`
- `last_response_status`
- `niche_status`
- `next_action_at`

Dans `outreach_attempts`, verifier :

- `prospect_id`
- `channel = email`
- `message_variant`
- `delivery_status = submitted`
- `response_status = pending`

## 9. Procedure de test propre

### 9.1 Test formulaire reel

Le test le plus fiable est :

1. remplir le Google Form avec une vraie adresse de test
2. attendre 10 a 30 secondes
3. ouvrir `Executions` dans n8n
4. cliquer sur la nouvelle execution
5. verifier la branche email prospect
6. verifier la branche alerte admin

### 9.2 Ce qu'il ne faut pas faire

- ne pas lancer Apps Script avec `Run`
- ne pas tester la production avec `webhook-test`
- ne pas oublier de `Publish` le workflow n8n
- ne pas laisser une ancienne adresse email admin dans `Send Admin Lead Alert`

## 10. Lecture rapide des statuts

### 10.1 Cote prospect

- `status = active` : la sequence est en cours
- `paused = false` : le workflow peut continuer
- `last_response_status = pending` : pas encore de reponse du prospect
- `last_sequence_result = social_email_1_sent` : email 1 envoye
- `last_sequence_result = social_email_2_sent` : email 2 envoye
- `last_sequence_result = social_email_3_sent` : email 3 envoye

### 10.2 Cote sequence

- `niche_status = social_form_inbound` : lead recu
- `niche_status = social_sequence_active` : sequence en cours
- `niche_status = social_sequence_completed` : sequence terminee
- `niche_status = social_form_review_only` : pas d'automatisation autorisee

## 11. Cas d'usage concret

Exemple de scenario type :

1. une secretaire remplit le formulaire de formation
2. la reponse entre dans Google Sheets
3. Apps Script pousse le payload vers n8n
4. le prospect est cree dans `prospect_targets`
5. le premier email de remerciement / prise de contact est envoye
6. l'equipe TransferAI recoit une alerte interne sur `contact@transferai.ci`
7. si le prospect ne repond pas, le scheduler gere ensuite les relances

## 12. Limites actuelles a connaitre

- `follow_up_fetch_limit = 1` limite la prise en charge a un prospect a la fois par cycle scheduler
- le workflow n'integre pas encore l'arret automatique sur reponse email lue cote Zoho ou Chatwoot
- le traitement inbound humain reste a brancher dans un workflow dedie

## 13. Recommandations d'exploitation

- verifier les executions n8n chaque matin
- verifier particulierement les executions rouges du scheduler
- faire un test complet apres chaque modification d'un noeud HTTP ou Code
- conserver le lien Calendly a jour dans `Set Social Sequence Config`
- verifier regulierement que l'alerte admin part toujours vers `contact@transferai.ci`

## 14. Fichiers de reference utiles

- [92_Guide_Activation_Google_Forms_Social_Lead_Sequence_V1.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/92_Guide_Activation_Google_Forms_Social_Lead_Sequence_V1.md)
- [93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json)
- [97_Plan_Integration_Zoho_Inbound_BackOffice_2026-06-19.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/97_Plan_Integration_Zoho_Inbound_BackOffice_2026-06-19.md)

---

## 99_Guide_Troubleshooting_Workflow_Google_Forms_Prospects_Ameliore_2026-06-20

Source : `docs/transferai-admin/99_Guide_Troubleshooting_Workflow_Google_Forms_Prospects_Ameliore_2026-06-20.md`

# Guide de Troubleshooting - Workflow Google Forms Prospects Ameliore

Workflow de reference :

- `TransferAI Google Forms Social Lead Sequence V2 Clean Importable`
- Fichier : [93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json)

Date de mise a jour :

- `20 juin 2026`

## 1. Objet du guide

Ce guide sert a diagnostiquer et corriger les problemes les plus frequents du workflow Google Forms prospects ameliore.

Il est base sur les incidents reels rencontres pendant :

- le branchement Google Forms -> Google Sheets -> Apps Script
- les tests `webhook-test`
- le passage en production `webhook`
- la mise a jour CRM Supabase
- les envois d'emails prospect
- les alertes admin
- le scheduler de relance

## 2. Methode de diagnostic recommandee

Quand un test ne marche pas, verifier toujours dans cet ordre :

1. la soumission Google Form est-elle bien entree dans Google Sheets
2. le trigger Apps Script s'est-il bien lance
3. le workflow n8n est-il `Published`
4. l'execution est-elle visible dans `Executions`
5. quel est le premier noeud rouge
6. le probleme vient-il du JSON, d'une condition, d'une URL, d'un secret ou d'un service externe

## 3. Problemes frequents et correctifs

## 3.1 Rien n'apparait dans n8n apres avoir rempli le formulaire

### Symptome

- le formulaire est rempli
- la feuille Google Sheets recoit bien la ligne
- aucune execution recente n'apparait dans n8n

### Causes probables

- Apps Script pointe encore vers `webhook-test`
- le workflow n8n n'est pas `Published`
- le trigger `On form submit` n'est pas cree
- le script a ete lance avec `Run` au lieu d'une vraie soumission

### Correctif

Verifier dans Apps Script :

```javascript
WEBHOOK_URL: 'https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/google-forms-social-leads'
```

Puis verifier :

- le trigger `On form submit`
- le statut `Published` du workflow

## 3.2 Apps Script affiche `Evenement de formulaire introuvable`

### Symptome

Dans `Execution log`, on voit :

- `Evenement de formulaire introuvable. Utilise un declencheur "On form submit".`

### Cause

La fonction `onFormSubmitToN8n(e)` a ete lancee manuellement avec le bouton `Run`.

### Correctif

Ne pas utiliser `Run`.

Il faut :

1. creer un trigger `On form submit`
2. remplir reellement le formulaire

## 3.3 Le webhook recoit le payload mais l'email part vers une mauvaise adresse

### Symptome

- le workflow s'execute
- mais l'email part vers une adresse de test ou une ancienne adresse

### Cause

Une adresse email est laissee en dur dans un noeud HTTP ou un noeud Code.

### Correctif

Verifier en priorite :

- `Prepare Social Prospect Record`
- `Send Social Sequence Email`
- `Send Admin Lead Alert`

Pour l'alerte admin, le noeud `Send Admin Lead Alert` doit utiliser :

```javascript
={{
({
  from: 'TransferAI <contact@transferai.ci>',
  to: 'contact@transferai.ci',
  subject: $json.admin_email_subject,
  html: $json.admin_email_html
})
}}
```

## 3.4 Les reponses comme `Oui, assez bien` sont cassees en plusieurs morceaux

### Symptome

Dans n8n, une reponse simple apparait comme une liste au lieu d'une chaine :

- `["Oui", "assez bien"]`

### Cause

Le script Apps Script essaye de splitter les valeurs contenant une virgule.

### Correctif

Utiliser la version simple et stable de `normalizeValue(rawValue)` :

```javascript
function normalizeValue(rawValue) {
  if (!Array.isArray(rawValue)) {
    return rawValue;
  }

  if (rawValue.length === 0) {
    return '';
  }

  if (rawValue.length === 1) {
    return String(rawValue[0] || '').trim();
  }

  return rawValue
    .map((item) => String(item || '').trim())
    .filter(Boolean);
}
```

## 3.5 Le noeud `Set Social Sequence Config` affiche des triangles rouges

### Symptome

- des alertes rouges apparaissent dans le noeud
- certaines lignes de configuration sont invalides

### Cause

Une ou plusieurs lignes `Name / Type / Value` sont incomplètes ou dupliquees.

### Correctif

Ne conserver que les lignes utiles :

- `source_backend`
- `source_label_prefix`
- `booking_link_45min`
- `follow_up_delay_1_days`
- `follow_up_delay_2_days`
- `follow_up_fetch_limit`
- `default_country`

## 3.6 Le scheduler tourne mais rien ne part

### Symptome

- l'execution du scheduler existe
- aucun email 2 ou email 3 n'est envoye

### Causes probables

- aucun prospect n'est du pour relance
- `Build Due Social Follow-Ups` renvoie `0 item`
- `follow_up_fetch_limit` est trop faible
- `next_action_at` n'est pas encore arrive
- le prospect est `paused = true`

### Correctif

Verifier dans `prospect_targets` :

- `next_action_at`
- `paused`
- `last_sequence_result`
- `last_response_status`
- `stop_reason`

Verifier ensuite la sortie de :

- `Fetch Social Prospect Snapshot`
- `Build Due Social Follow-Ups`

## 3.7 L'execution de minuit est rouge alors que le formulaire fonctionne

### Symptome

- les nouvelles soumissions Google Forms marchent
- mais une execution planifiee vers `00:00:00` passe en erreur

### Cause probable

Le probleme n'est pas dans la branche Google Forms. Il est dans la branche de relance ou dans la branche failure.

### Correctif

Cliquer sur l'execution rouge puis identifier le premier noeud rouge.

Si le noeud en erreur est `Update Prospect Social Failure`, voir section 3.8.

## 3.8 `Update Prospect Social Failure` affiche `JSON parameter needs to be valid JSON`

### Symptome

Le noeud montre :

- `JSON parameter needs to be valid JSON`

### Cause

Le body JSON du noeud est mal forme.

### Correctif

Configurer le noeud ainsi :

- `Method = PATCH`
- `Body Content Type = JSON`
- `Specify Body = Using JSON`

URL recommandee :

```javascript
={{'https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospect_targets?prospect_id=eq.' + encodeURIComponent($json.prospect_id)}}
```

Body JSON recommande :

```javascript
={{
({
  paused: true,
  last_sequence_result: 'social_email_send_failed',
  last_response_status: 'failed',
  niche_status: 'social_sequence_needs_review',
  stop_reason: 'social_email_send_failed',
  next_action_at: null
})
}}
```

## 3.9 Le mail prospect est bien recu mais tu ne retrouves pas la bonne execution

### Symptome

- le prospect a recu l'email
- mais tu penses que n8n n'a rien traite

### Cause

Tu regardes souvent :

- une ancienne execution
- une execution de test
- ou une execution du scheduler au lieu de la vraie execution Google Forms

### Correctif

Dans `Executions` :

1. trier par plus recent
2. cliquer tout en haut
3. verifier le noeud `Google Forms Social Lead Webhook`
4. verifier le `body` dans le panneau du bas

## 3.10 L'alerte admin ne part pas

### Symptome

- le prospect recoit le mail 1
- mais aucun mail n'arrive a `contact@transferai.ci`

### Causes probables

- `If Admin Alert Eligible` renvoie `false`
- `Send Admin Lead Alert` envoie encore vers une autre adresse
- la branche admin n'est pas connectee depuis `Upsert Social Prospect Into CRM`

### Correctif

Verifier l'ordre suivant :

1. `Build Admin Lead Alert Context` retourne bien `should_notify_admin = true`
2. `If Admin Alert Eligible` passe sur la branche `true`
3. `Build Admin Lead Alert Email` produit :
   - `admin_email_subject`
   - `admin_email_html`
4. `Send Admin Lead Alert` envoie bien vers `contact@transferai.ci`

## 3.11 `If Admin Alert Eligible` ne se declenche pas

### Symptome

- le noeud ne laisse rien passer

### Cause

La condition booleenne est mal ecrite ou la valeur n'est pas interpretee comme un vrai boolean.

### Correctif

Utiliser une condition simple sur :

- `{{$json.should_notify_admin}}`

avec l'operateur :

- `is true`

## 3.12 Le noeud `Send Social Sequence Email` ne renvoie pas d'id

### Symptome

- pas de `id` Resend dans la sortie
- ou erreur HTTP

### Causes probables

- cle Resend absente ou invalide
- body JSON incorrect
- `target_email` vide

### Correctif

Verifier :

- header `Authorization: Bearer ...`
- `to: $json.target_email`
- `subject: $json.email_subject`
- `html: $json.email_html`

Le body recommande reste :

```javascript
={{
({
  from: 'TransferAI <contact@transferai.ci>',
  to: $json.target_email,
  subject: $json.email_subject,
  html: $json.email_html
})
}}
```

## 3.13 Le workflow utilise encore `webhook-test`

### Symptome

- les tests marchent quand `Listen for test event` est actif
- mais rien ne marche en usage reel

### Cause

Apps Script ou un outil externe pointe encore vers :

- `/webhook-test/google-forms-social-leads`

### Correctif

Basculer en production sur :

- `/webhook/google-forms-social-leads`

## 3.14 `Lost connection to the server` apparait dans n8n

### Symptome

- message UI `Lost connection to the server`
- certains panneaux ne se chargent plus

### Cause

Il s'agit le plus souvent d'un probleme d'interface n8n, pas du workflow lui-meme.

### Correctif

1. rafraichir la page
2. rouvrir l'execution
3. verifier si l'execution a quand meme ete creee dans `Executions`

## 3.15 Le scheduler n'envoie qu'un seul prospect a la fois

### Symptome

- plusieurs prospects attendent
- mais un seul repart par cycle

### Cause

Le parametre :

- `follow_up_fetch_limit = 1`

et la logique actuelle de `Build Due Social Follow-Ups` ne laissent passer qu'un item.

### Correctif

Si l'objectif est de traiter plus d'un prospect par heure, il faudra :

1. augmenter `follow_up_fetch_limit`
2. adapter `Build Due Social Follow-Ups` pour renvoyer plusieurs items

## 4. Checklist de verification rapide apres chaque changement

Apres toute modification, refaire ce mini-test :

1. verifier que le workflow est `Published`
2. remplir le Google Form avec une adresse de test
3. verifier la nouvelle execution dans n8n
4. verifier l'email prospect
5. verifier l'alerte admin sur `contact@transferai.ci`
6. verifier `prospect_targets`
7. verifier `outreach_attempts`

## 5. Quand escalader vers une correction structurelle

Une correction plus profonde est necessaire si :

- les relances email 2 / email 3 ne se declenchent jamais
- la sequence continue alors que le prospect a deja repondu
- il faut brancher Zoho inbound ou Chatwoot pour stop automatique
- il faut notifier plusieurs admins
- il faut gerer plusieurs formulaires supplementaires

## 6. Fichiers de reference utiles

- [98_Guide_Utilisateur_Workflow_Google_Forms_Prospects_Ameliore_2026-06-20.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/98_Guide_Utilisateur_Workflow_Google_Forms_Prospects_Ameliore_2026-06-20.md)
- [92_Guide_Activation_Google_Forms_Social_Lead_Sequence_V1.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/92_Guide_Activation_Google_Forms_Social_Lead_Sequence_V1.md)
- [97_Plan_Integration_Zoho_Inbound_BackOffice_2026-06-19.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/97_Plan_Integration_Zoho_Inbound_BackOffice_2026-06-19.md)

---

## TransferAI_V3_V4_User_Troubleshooting_Guide

Source : `docs/transferai-admin/TransferAI_V3_V4_User_Troubleshooting_Guide.md`

# TransferAI Prospecting — Guide Utilisateur & Troubleshooting

**Configuration V4 · Rectification V3 · Résolution des problèmes**  
Version 1.0 — Juin 2026  
Préparé par : TransferAI NettelecomCI

---

## Table des matières

1. [Architecture générale du système](#1-architecture-générale)
2. [Configuration V4 — Workflow Batch](#2-configuration-v4)
3. [Configuration V3 — Workflow Prospect Individuel](#3-configuration-v3)
4. [Troubleshooting Guide Détaillé](#4-troubleshooting)
5. [Checklist de vérification](#5-checklist)
6. [Référence rapide — Codes des nœuds corrigés](#6-référence-rapide)
7. [Historique des corrections — Session du 8 juin 2026](#7-historique)

---

## 1. Architecture générale

### 1.1 Vue d'ensemble

Le système de prospection TransferAI est composé de deux workflows n8n imbriqués :

| Workflow | Rôle |
|----------|------|
| **V4 (Batch)** | Orchestre l'envoi en masse. Récupère les prospects depuis Supabase et appelle V3 pour chaque prospect. |
| **V3 (Prospect individuel)** | Génère la lettre commerciale, le catalogue PDF, le deck PPTX, stocke le pack dans Supabase, envoie l'email d'approbation, attend l'approbation, puis envoie l'email prospect. |

### 1.2 Flux de données complet

```
1. V4 Batch       → récupère les prospects depuis prospect_targets (status=ready)
2. V4             → appelle V3 via Execute Prospect Workflow V3
3. V3 OpenAI      → génère lettre, catalogue, audit form, deck
4. V3 Assemble    → construit pack_id et audit_form_url
5. V3 Store       → stocke dans ai_prospecting_packs (status=pending_approval)
6. V3 Email       → envoie email interne d'approbation (onboarding@resend.dev)
7. Approbateur    → clique "Approuver et envoyer"
8. V3 Webhook     → Approval Webhook → Parse Approval Query
9. V3             → Get Pack From Supabase → Extract Pack Payload
10. V3            → Build Send Context → Send External Prospect Email
```

### 1.3 Tables Supabase utilisées

| Table | Rôle |
|-------|------|
| `prospect_targets` | Liste des prospects à contacter |
| `ai_prospecting_packs` | Packs générés et stockés |
| `prospect_targets_ready_for_batch` | Vue filtrée des prospects prêts (status=ready, paused=false) |
| `prospecting_batch_runs` | Suivi des exécutions batch |
| `prospecting_batch_run_items` | Détail par prospect par run |
| `form_invitations` | Invitations au questionnaire d'audit |

---

## 2. Configuration V4

### 2.1 Prérequis

Avant de configurer V4, vérifier que :
- Le workflow V3 est actif dans n8n (pas en pause)
- Les prospects sont insérés dans `prospect_targets` avec `status='ready'`
- Les clés API sont configurées : OpenAI, Resend, Supabase Service Role Key
- Les fonctions Edge Supabase sont déployées : `catalogue-renderer`, `deck-renderer`

### 2.2 Nœuds clés de V4

#### SET BATCH CONFIG
- Définit le nombre de prospects par batch
- Paramètre principal : `max_per_day` (défaut : 5)

#### FETCH PROSPECTS FROM SUPABASE
- URL : `https://<project>.supabase.co/rest/v1/prospect_targets_ready_for_batch`
- Méthode : GET
- Headers requis : `apikey` + `Authorization: Bearer <service_role_key>`

#### EXECUTE PROSPECT WORKFLOW V3
- Appelle le workflow V3 pour chaque prospect
- Passe les données du prospect en paramètre input

#### MARK DISPATCHED TO V3
- Met à jour le statut du prospect à `dispatched`
- Évite les doublons lors du prochain batch

### 2.3 Configuration des headers Supabase

À appliquer sur **tous les nœuds HTTP Request qui appellent Supabase** :

```
apikey          : <SUPABASE_ANON_KEY ou SERVICE_ROLE_KEY>
Authorization   : Bearer <SUPABASE_SERVICE_ROLE_KEY>
Content-Type    : application/json
Prefer          : return=representation  (uniquement pour INSERT/UPDATE)
```

### 2.4 Colonnes requises dans `prospect_targets`

| Colonne | Type | Valeurs |
|---------|------|---------|
| `prospect_id` | text PRIMARY KEY | ex: `ci-orange-001` |
| `organization_name` | text | Nom de l'organisation |
| `target_email` | text | Email du décideur |
| `decision_maker_name` | text | Nom du décideur |
| `website` | text | Site web |
| `country` | text | Pays |
| `status` | text | `ready` \| `active` \| `dispatched` \| `paused` |
| `paused` | boolean | `true` pour exclure du batch |
| `do_not_contact` | boolean | `true` pour exclure définitivement |

### 2.5 Gestion des prospects de test

#### Créer un prospect de test
```sql
INSERT INTO prospect_targets (
  prospect_id, organization_name, target_email,
  decision_maker_name, website, country,
  status, paused, do_not_contact
) VALUES (
  'test-prospect-001',
  'Entreprise Test TransferAI',
  'votre-email@gmail.com',
  'Décideur Test',
  'https://www.test-entreprise.ci',
  'Cote d''Ivoire',
  'ready', false, false
);
```

#### Mettre en pause après test (recommandé — évite les doublons)
```sql
UPDATE prospect_targets
SET status = 'paused', paused = true
WHERE prospect_id = 'test-prospect-001';
```

#### Relancer pour un nouveau test
```sql
UPDATE prospect_targets
SET status = 'ready', paused = false
WHERE prospect_id = 'test-prospect-001';
```

---

## 3. Configuration V3

### 3.1 Nœuds critiques et leur rôle

#### ASSEMBLE PROSPECT PACK
**Rôle :** Génère le `pack_id`, construit `audit_form_url`, corrige les liens cassés dans la lettre.

> **IMPORTANT :** Ce nœud s'exécute APRÈS `Generate Executive Letter`. La lettre peut contenir un lien audit cassé (`?pack_id=` vide) car elle est générée avant que `pack_id` existe. Le fix corrige ce lien dans le même nœud via regex.

Points clés du code :
- `pack_id` généré : `ctx.pack_id || ('pack-' + Date.now() + '-' + Math.random().toString(36).slice(2,10))`
- `audit_form_url` construite : `auditBaseUrl + '?pack_id=' + encodeURIComponent(packId)`
- Correction du lien dans la lettre (après génération de `auditFormUrl`) :
```javascript
var brokenAuditPattern = /https?:\/\/[^\s"'<>]*questionnaire-audit[^\s"'<>]*/g;
executiveLetterHtml = executiveLetterHtml.replace(brokenAuditPattern, auditFormUrl);
executiveLetter = executiveLetter.replace(brokenAuditPattern, auditFormUrl);
```

---

#### STORE PACK IN SUPABASE
**Rôle :** Stocke le pack dans `ai_prospecting_packs`.

- **URL :** `POST https://<project>.supabase.co/rest/v1/ai_prospecting_packs?on_conflict=pack_id`
- **Body JSON correct :**

```javascript
{{JSON.stringify({
  pack_id: $json.pack_id,
  prospect_id: $json.prospect_id || null,
  organization_name: $json.organization_name || null,
  target_email: $json.target_email || null,
  status: 'pending_approval',
  payload: $json,
  llm_redaction_summary: $json.llm_redaction_summary || null
})}}
```

> **ATTENTION :** Ne jamais ajouter `organization_type` ni `sector_guess` — ces colonnes **n'existent pas** dans la table `ai_prospecting_packs`. Toutes les données enrichies sont accessibles via la colonne `payload` (JSONB).

---

#### BUILD SEND CONTEXT
**Rôle :** Prépare le contexte d'envoi, répare les liens audit cassés, valide les pièces jointes.

Points clés :
- Extraction `pack_id` depuis plusieurs sources (fallback chain)
- Reconstruction `audit_form_url` canonique depuis `pack_id`
- Réparation de `rawLetterHtml` par regex avant utilisation
- **Override de `executive_letter_html`** dans le return — crucial pour que `Send External Prospect Email` lise la version réparée

Return du nœud (fin du code) :
```javascript
return [{
  json: {
    ...src,
    pack_id: packId,
    audit_form_url: auditFormUrl,
    attachments: attachments,
    attachments_count: attachments.length,
    can_send: canSend,
    send_failure_reason: reason,
    external_email_html: externalEmailHtml,
    executive_letter_html: rawLetterHtml  // CRUCIAL : écrase la version cassée de Supabase
  }
}];
```

Conditions de `canSend = true` :
- `target_email` non vide
- `executive_letter` non vide
- Au minimum 2 pièces jointes (1 PDF + 1 PPTX)
- `pack_id` non vide

---

#### SEND EXTERNAL PROSPECT EMAIL
**Rôle :** Envoie l'email au prospect via Resend API.

- **URL :** `POST https://api.resend.com/emails`
- **Body JSON correct :**

```javascript
={{ (() => {
  const ctx = $('Build Send Context').first().json || {};
  const targetEmail = ctx.target_email || '';
  const bookingLink = ctx.booking_link_45min || 'https://calendly.com/contact-transferai/30min';
  return JSON.stringify({
    from: 'TransferAI <contact@transferai.ci>',
    to: [targetEmail],
    subject: "Proposition d'audit gratuit, d'accompagnement et de formation",
    html: ctx.external_email_html || '',
    attachments: ctx.attachments || []
  });
})() }}
```

> Utiliser `ctx.external_email_html` directement — ce champ est déjà assemblé et réparé par `Build Send Context`. Ne pas reconstruire le HTML depuis `ctx.executive_letter_html`.

---

#### PARSE APPROVAL QUERY
**Rôle :** Extrait `pack_id` et `decision` depuis l'URL du webhook d'approbation.

```javascript
const raw = $input.first().json;
const q = (raw.query && raw.query.pack_id) ? raw.query : raw;
const isApproved = q.decision === 'approved' || q.approved === 'true' || q.approved === true;
return [{ json: {
  approved:          isApproved,
  decision:          isApproved ? 'approved' : 'rejected',
  prospect_id:       q.prospect_id        || '',
  pack_id:           q.pack_id            || '',
  organization_name: q.organization_name  || '',
  target_email:      q.target_email       || ''
} }];
```

---

## 4. Troubleshooting

---

### 4.1 Lien questionnaire cassé (`?pack_id=` vide) dans l'email prospect

#### Symptôme
L'email prospect contient :
```
https://www.transferai.ci/questionnaire-audit?pack_id=
```
La page questionnaire affiche : **"Aucun identifiant de pack fourni dans l'URL (paramètre pack_id manquant)"**

#### Cause racine

`Generate Executive Letter` s'exécute **AVANT** qu'`Assemble Prospect Pack` génère le `pack_id`. Le prompt OpenAI reçoit `audit_form_url` avec `pack_id` vide (`$json.pack_id = ''`). L'IA intègre ce lien cassé dans la lettre. Ce texte est ensuite stocké dans Supabase (`payload.executive_letter_html`). Lors de l'approbation, le lien cassé ressort dans l'email prospect.

#### Solution (3 nœuds à corriger)

**Fix 1 — Assemble Prospect Pack**

Après la ligne `var executiveLetterHtml = executiveLetter.replace(/\n/g, '<br>');`, ajouter :

```javascript
// Remplace le lien audit cassé (pack_id vide) par l'URL correcte
var brokenAuditPattern = /https?:\/\/[^\s"'<>]*questionnaire-audit[^\s"'<>]*/g;
executiveLetterHtml = executiveLetterHtml.replace(brokenAuditPattern, auditFormUrl);
executiveLetter = executiveLetter.replace(brokenAuditPattern, auditFormUrl);
```

**Fix 2 — Build Send Context**

Remplacer la construction de `externalEmailHtml` :

```javascript
var rawLetterHtml = String(
  src.executive_letter_html || String(src.executive_letter || '').replace(/\n/g, '<br>')
);

// Répare le lien audit cassé dans la lettre
if (auditFormUrl) {
  var brokenAuditPattern = /https?:\/\/[^\s"'<>]*questionnaire-audit[^\s"'<>]*/g;
  rawLetterHtml = rawLetterHtml.replace(brokenAuditPattern, auditFormUrl);
}

var externalEmailHtml = rawLetterHtml + auditBlock;
```

Et dans le `return`, ajouter la ligne :
```javascript
executive_letter_html: rawLetterHtml
```

**Fix 3 — Send External Prospect Email**

Remplacer le JSON Body par la version simplifiée utilisant `ctx.external_email_html` directement (voir Section 3.1).

#### Pourquoi les 3 fixes sont nécessaires

| Fix | Protège |
|-----|---------|
| Fix 1 (Assemble Prospect Pack) | Les nouveaux packs — corrige le lien dès la génération avant stockage Supabase |
| Fix 2 (Build Send Context) | Les anciens packs déjà stockés avec lien cassé — répare à l'envoi |
| Fix 3 (Send External Prospect Email) | Évite toute reconstruction intermédiaire qui pourrait réintroduire le lien cassé |

#### Vérification
Dans l'email reçu, le lien doit contenir : `?pack_id=pack-XXXXXXXXXX-XXXXXXXX`  
La page questionnaire doit s'ouvrir sans erreur.

---

### 4.2 Erreur de syntaxe dans Send External Prospect Email

#### Symptôme
n8n affiche `[invalid syntax]` dans le panneau de droite du nœud JSON Body.

#### Cause
Utilisation de `\\'` au lieu de `\'` pour échapper une apostrophe dans une chaîne JavaScript.

#### Solution
Remplacer `d\\'audit` par `d\'audit` dans le JSON Body.

#### Règle
Dans une chaîne JavaScript entre apostrophes simples `'...'` :
- Correct : `\'` (un seul backslash)
- Incorrect : `\\'` (interprété comme backslash + fin de chaîne)

---

### 4.3 Deux pack_ids différents entre email approbation et email prospect

#### Symptôme
- Email d'approbation montre `pack_id=pack-AAAA`
- Email prospect montre `pack_id=pack-BBBB` (différent)

#### Cause
Le workflow traite le même prospect **deux fois** car il apparaît en doublon dans `prospect_targets`. Deux packs sont générés en parallèle avec des IDs différents.

#### Solution

**Étape 1 — Identifier les doublons :**
```sql
SELECT prospect_id, organization_name, target_email, status, created_at
FROM prospect_targets
WHERE organization_name ILIKE '%NomOrganisation%'
ORDER BY created_at DESC;
```

**Étape 2 — Supprimer le doublon (garde le plus récent) :**
```sql
DELETE FROM prospect_targets
WHERE prospect_id IN (
  SELECT prospect_id
  FROM (
    SELECT prospect_id,
           ROW_NUMBER() OVER (
             PARTITION BY organization_name
             ORDER BY created_at DESC
           ) AS rn
    FROM prospect_targets
    WHERE organization_name ILIKE '%NomOrganisation%'
  ) ranked
  WHERE rn > 1
);
```

#### Prévention
Utiliser un `prospect_id` unique basé sur le nom de l'organisation. Pour les tests, utiliser `status='paused'` plutôt que créer un nouveau prospect à chaque fois.

---

### 4.4 Erreur Store Pack In Supabase — colonne inexistante

#### Symptôme
```
Bad request - please check your parameters
Could not find the 'organization_type' column of 'ai_prospecting_packs' in the schema cache
```
ou
```
Could not find the 'sector_guess' column of 'ai_prospecting_packs' in the schema cache
```

#### Cause
Le JSON Body de `Store Pack In Supabase` référence des colonnes qui **n'existent pas** dans la table `ai_prospecting_packs`.

#### Colonnes valides dans `ai_prospecting_packs`
```
pack_id, prospect_id, organization_name, target_email,
status, payload, llm_redaction_summary
```

#### Solution — JSON Body correct
```javascript
{{JSON.stringify({
  pack_id: $json.pack_id,
  prospect_id: $json.prospect_id || null,
  organization_name: $json.organization_name || null,
  target_email: $json.target_email || null,
  status: 'pending_approval',
  payload: $json,
  llm_redaction_summary: $json.llm_redaction_summary || null
})}}
```

> Toutes les données enrichies (`sector_guess`, `organization_type`, etc.) sont stockées dans la colonne `payload` de type JSONB et restent accessibles.

---

### 4.5 Page questionnaire affiche "questionnaire non disponible"

#### Symptôme
La page `https://www.transferai.ci/questionnaire-audit?pack_id=pack-XXX` charge mais affiche :
> *"Le questionnaire personnalisé pour [Organisation] n'est pas encore disponible. Revenez dans quelques instants ou contactez notre équipe."*

Badges affichés : **SECTEUR A CONFIRMER**, **ORGANISATION A QUALIFIER**

#### Cause
Les champs `sector_guess` et `organization_type` ont les valeurs par défaut SQL (`'secteur à confirmer'`, `'organisation à qualifier'`) car le nœud `Store Pack In Supabase` essayait d'écrire dans des colonnes inexistantes — l'erreur 400 bloquait le stockage du pack.

#### Solution
Appliquer le fix 4.4 (retirer `organization_type` et `sector_guess` du JSON Body). Une fois le pack correctement stocké avec les données dans `payload`, la fonction Edge `resolve-invitation` lit `payload.sector_guess` et `payload.organization_type` via `buildAuditAccessContextFromPack`.

Pour les packs déjà stockés avec ce problème : relancer le workflow complet pour générer un nouveau pack.

---

### 4.6 Plusieurs emails d'approbation pour le même prospect

#### Symptôme
2 emails `onboarding@resend.dev` reçus au même moment pour la même organisation, avec des `pack_id` différents.

#### Cause
Le prospect apparaît plusieurs fois dans `prospect_targets` (doublon par `organization_name` mais `prospect_id` différent). Le batch V4 génère un pack pour chaque ligne.

#### Solution
Voir section 4.3.

#### Requête de détection préventive
Exécuter avant chaque run :
```sql
SELECT organization_name, COUNT(*) as nb
FROM prospect_targets
WHERE status = 'ready' AND paused = false
GROUP BY organization_name
HAVING COUNT(*) > 1;
```
Si cette requête retourne des lignes → doublons à traiter avant de lancer le batch.

---

### 4.7 `canSend = false` — email non envoyé

#### Symptôme
Le workflow s'exécute sans erreur visible mais l'email prospect n'est pas envoyé.  
Dans l'output de `Build Send Context` :
```
can_send: false
send_failure_reason: "Email cible, courrier, pack_id ou artefacts requis manquants. Attendus: 1 catalogue PDF et 1 deck PPTX."
```

#### Cause
Une ou plusieurs conditions manquantes :

| Condition | Vérification |
|-----------|-------------|
| `target_email` | Doit être un email valide non vide |
| `executive_letter` | Doit contenir du texte |
| Pièces jointes | Au minimum 2 : 1 fichier `.pdf` + 1 fichier `.pptx` |
| `pack_id` | Doit être non vide |

#### Solution
1. Vérifier l'output de `Build Send Context` — identifier quelle condition échoue
2. Si pièces jointes manquantes : vérifier que `render Catalogue Artifact` a retourné `pdf_url` et que `Render Deck Artifact` a retourné `pptx_url`
3. Si `pack_id` vide : vérifier `Assemble Prospect Pack` — `ctx.pack_id` ou génération automatique

---

### 4.8 `Parse Approval Query` retourne `pack_id` vide

#### Symptôme
Output de `Parse Approval Query` :
```json
{ "pack_id": "", "decision": "approved" }
```
`Get Pack From Supabase` retourne un pack différent de celui approuvé.

#### Cause
Le lien "Approuver et envoyer" dans l'email d'approbation ne contient pas `pack_id` dans les query parameters de l'URL webhook.

#### Vérification
Clic droit sur le lien "Approuver et envoyer" → "Copier l'adresse du lien".  
L'URL doit contenir : `?pack_id=pack-XXXX&decision=approved`

#### Solution
Vérifier le nœud `Build Approval Email` : le lien d'approbation doit être construit avec `pack_id` dans les paramètres de l'URL webhook.

---

## 5. Checklist de vérification

### 5.1 Avant chaque run V4

- [ ] Aucun doublon dans `prospect_targets` (requête section 4.6)
- [ ] Les prospects cibles ont `status='ready'` et `paused=false`
- [ ] Clé API OpenAI valide
- [ ] Clé API Resend valide
- [ ] Clé Service Role Supabase configurée dans les nœuds HTTP
- [ ] Workflow V3 actif dans n8n (pas en pause)
- [ ] Fonctions Edge Supabase déployées (`catalogue-renderer`, `deck-renderer`)

### 5.2 Après chaque run — vérification bout en bout

- [ ] Email d'approbation reçu avec lien formulaire complet (`pack_id` présent)
- [ ] Cliquer "Approuver et envoyer" sur le bon email
- [ ] Email prospect reçu avec lien questionnaire complet
- [ ] Cliquer le lien questionnaire → page s'ouvre sans erreur
- [ ] Page affiche le bon `PACK_ID` et le nom de l'organisation
- [ ] Vérifier pièces jointes : 1 PDF catalogue + 1 PPTX deck présents

### 5.3 Après un test — nettoyage

```sql
-- Remettre le prospect test en pause
UPDATE prospect_targets
SET status = 'paused', paused = true
WHERE prospect_id = 'test-prospect-001';

-- Vérifier qu'aucun pack pending_approval ne reste ouvert
SELECT pack_id, organization_name, status, created_at
FROM ai_prospecting_packs
WHERE status = 'pending_approval'
ORDER BY created_at DESC;
```

---

## 6. Référence rapide — Codes des nœuds corrigés

### 6.1 Store Pack In Supabase — JSON Body

```javascript
={{JSON.stringify({
  pack_id: $json.pack_id,
  prospect_id: $json.prospect_id || null,
  organization_name: $json.organization_name || null,
  target_email: $json.target_email || null,
  status: 'pending_approval',
  payload: $json,
  llm_redaction_summary: $json.llm_redaction_summary || null
})}}
```

---

### 6.2 Send External Prospect Email — JSON Body

```javascript
={{ (() => {
  const ctx = $('Build Send Context').first().json || {};
  const targetEmail = ctx.target_email || '';
  const bookingLink = ctx.booking_link_45min || 'https://calendly.com/contact-transferai/30min';
  return JSON.stringify({
    from: 'TransferAI <contact@transferai.ci>',
    to: [targetEmail],
    subject: "Proposition d'audit gratuit, d'accompagnement et de formation",
    html: ctx.external_email_html || '',
    attachments: ctx.attachments || []
  });
})() }}
```

---

### 6.3 Build Send Context — JavaScript Code (complet)

```javascript
var src = JSON.parse(JSON.stringify($('Extract Pack Payload').first().json));

function safeFileStem(value) {
  return String(value || 'Prospect')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function normalizeAttachment(att) {
  if (!att || !att.filename) return null;
  var normalized = { filename: String(att.filename) };
  if (att.content) normalized.content = String(att.content);
  if (att.path) normalized.path = String(att.path);
  if (!normalized.content && !normalized.path) return null;
  return normalized;
}

function dedupeAttachments(list) {
  var seen = {};
  var deduped = [];
  for (var i = 0; i < list.length; i++) {
    var att = list[i];
    var key = [att.filename || '', att.path || '', att.content || ''].join('|');
    if (seen[key]) continue;
    seen[key] = true;
    deduped.push(att);
  }
  return deduped;
}

function extractPackIdFromUrl(url) {
  var value = String(url || '');
  var match = value.match(/[?&]pack_id=([^&#]+)/i);
  return match ? decodeURIComponent(match[1]) : '';
}

var org = safeFileStem(src.organization_name || 'Prospect');
var attachments = [];
var payload = src.payload || {};

var providedAttachments = Array.isArray(payload.mail_attachments)
  ? payload.mail_attachments.map(normalizeAttachment).filter(Boolean)
  : [];

if (providedAttachments.length > 0) {
  attachments = providedAttachments;
} else {
  var rebuilt = [];
  if (payload.catalogue_artifact && payload.catalogue_artifact.pdf_url) {
    rebuilt.push({
      filename: String(payload.catalogue_artifact.filename_pdf || ('Mini_Catalogue_TransferAI_' + org + '.pdf')),
      path: String(payload.catalogue_artifact.pdf_url)
    });
  }
  if (payload.deck_artifact && payload.deck_artifact.pptx_url) {
    rebuilt.push({
      filename: String(payload.deck_artifact.filename_pptx || ('Deck_TransferAI_' + org + '.pptx')),
      path: String(payload.deck_artifact.pptx_url)
    });
  }
  attachments = rebuilt.map(normalizeAttachment).filter(Boolean);
}

attachments = dedupeAttachments(attachments);

var hasPdf  = attachments.some(function(att) { return /\.pdf$/i.test(String(att.filename || '')); });
var hasPptx = attachments.some(function(att) { return /\.pptx$/i.test(String(att.filename || '')); });

var packId =
  src.pack_id ||
  payload.pack_id ||
  extractPackIdFromUrl(src.audit_form_url) ||
  extractPackIdFromUrl(payload.audit_form_url) ||
  '';

var auditFormUrl = packId
  ? 'https://www.transferai.ci/questionnaire-audit?pack_id=' + encodeURIComponent(packId)
  : '';

var canSend = Boolean(
  src.target_email &&
  src.executive_letter &&
  src.executive_letter.trim().length > 0 &&
  attachments.length >= 2 &&
  hasPdf &&
  hasPptx &&
  packId
);

var reason = canSend
  ? null
  : 'Email cible, courrier, pack_id ou artefacts requis manquants. Attendus: 1 catalogue PDF et 1 deck PPTX.';

var auditBlock = auditFormUrl
  ? "<br><br><p><strong>Formulaire d'audit pre-RDV :</strong> <a href=\"" + auditFormUrl + "\">" + auditFormUrl + "</a></p><p>Merci de le remplir avant le rendez-vous afin que nos experts preparent un audit sur mesure.</p>"
  : "";

var rawLetterHtml = String(
  src.executive_letter_html || String(src.executive_letter || '').replace(/\n/g, '<br>')
);

// Répare le lien audit cassé dans la lettre si auditFormUrl est disponible
if (auditFormUrl) {
  var brokenAuditPattern = /https?:\/\/[^\s"'<>]*questionnaire-audit[^\s"'<>]*/g;
  rawLetterHtml = rawLetterHtml.replace(brokenAuditPattern, auditFormUrl);
}

var externalEmailHtml = rawLetterHtml + auditBlock;

return [{
  json: {
    ...src,
    pack_id: packId,
    audit_form_url: auditFormUrl,
    attachments: attachments,
    attachments_count: attachments.length,
    can_send: canSend,
    send_failure_reason: reason,
    external_email_html: externalEmailHtml,
    executive_letter_html: rawLetterHtml   // CRUCIAL : écrase la version cassée de Supabase
  }
}];
```

---

### 6.4 Requêtes SQL utiles

```sql
-- Voir tous les prospects actifs
SELECT prospect_id, organization_name, target_email, status, paused
FROM prospect_targets
WHERE paused = false
ORDER BY created_at DESC;

-- Détecter les doublons avant un run
SELECT organization_name, COUNT(*) as nb
FROM prospect_targets
WHERE status = 'ready' AND paused = false
GROUP BY organization_name
HAVING COUNT(*) > 1;

-- Voir les derniers packs générés
SELECT pack_id, organization_name, status, created_at
FROM ai_prospecting_packs
ORDER BY created_at DESC
LIMIT 20;

-- Remettre un prospect en ready
UPDATE prospect_targets
SET status = 'ready', paused = false
WHERE prospect_id = 'test-prospect-001';

-- Mettre en pause un prospect
UPDATE prospect_targets
SET status = 'paused', paused = true
WHERE prospect_id = 'test-prospect-001';

-- Supprimer un doublon (garder le plus récent)
DELETE FROM prospect_targets
WHERE prospect_id IN (
  SELECT prospect_id FROM (
    SELECT prospect_id,
           ROW_NUMBER() OVER (PARTITION BY organization_name ORDER BY created_at DESC) AS rn
    FROM prospect_targets
    WHERE organization_name ILIKE '%NomOrganisation%'
  ) ranked WHERE rn > 1
);
```

---

## 7. Historique des corrections — Session du 8 juin 2026

**Problème initial :** lien questionnaire cassé `?pack_id=` vide dans l'email prospect.

| # | Nœud modifié | Changement |
|---|--------------|-----------|
| 1 | `Send External Prospect Email` | JSON Body remplacé par version IIFE utilisant `ctx.executive_letter_html` |
| 2 | `Build Send Context` | Ajout reconstruction `pack_id` depuis plusieurs sources + `audit_form_url` canonique + validation pièces jointes |
| 3 | `Build Send Context` | Ajout regex de réparation des liens cassés dans `rawLetterHtml` |
| 4 | `Build Send Context` | Ajout `executive_letter_html: rawLetterHtml` dans le return pour écraser la version cassée de Supabase |
| 5 | `Send External Prospect Email` | Simplification pour utiliser `ctx.external_email_html` directement |
| 6 | `Assemble Prospect Pack` | Ajout réparation du lien dans la lettre dès la génération (fix préventif) |
| 7 | `Store Pack In Supabase` | Suppression des colonnes inexistantes `organization_type` et `sector_guess` |
| 8 | `prospect_targets` (Supabase) | Suppression du doublon `manual-prospect-001` |

**Résultat final :** email prospect avec lien correct + page questionnaire accessible + workflow sans erreur Supabase.

---

*Document généré le 8 juin 2026 — TransferAI NettelecomCI*

---

## 63_Guide_Installation_V3_Noeud_par_Noeud_2026-06-02

Source : `docs/transferai-admin/word/source/63_Guide_Installation_V3_Noeud_par_Noeud_2026-06-02.md`

# Guide d’installation V3

## Nœud par nœud

**Workflow :** TransferAI Prospecting V3 CRM Enhanced [FINAL]  
**Fichier de référence :** `docs/transferai-admin/62_n8n_Prospection_V3_CRM_final.json`  
**Version consolidée :** 2 juin 2026  
**État réel du workflow :** 50 nœuds  
**Référentiel utilisé :** workflow V3 final, renderers Supabase, guides utilisateur et troubleshooting, revue des branches locales et des répertoires Claude / OpenAI présents sur la machine.

## 1. Ce qui a changé depuis l’ancienne version du guide

- Le workflow n’est plus à 44 nœuds mais à **50 nœuds**.
- Le pipeline V3 inclut maintenant une vraie chaîne de rendu catalogue :
  - `Build Catalogue Render Payload`
  - `Render Catalogue Artifact`
  - `Merge Catalogue Artifact`
- Le pipeline V3 inclut maintenant une vraie chaîne de rendu deck PPTX :
  - `Build Deck Render Payload`
  - `Render Deck Artifact`
  - `Merge Deck Artifact`
- `Build Send Context` accepte désormais des pièces jointes avec `content` **ou** `path`.
- Le flux cible impose désormais **2 pièces jointes finales** :
  - 1 catalogue PDF
  - 1 deck PPTX
- Le fallback `Deck_Brief_[Prospect].json` ne fait plus partie du flux d’envoi cible.
- Les nœuds OpenAI du workflow versionné doivent s’appuyer sur `OPENAI_API_KEY` via variable d’environnement, et non sur une clé en dur.
- Le deck premium dynamique et le mini-catalogue s’appuient maintenant sur les fonctions Supabase `deck-renderer` et `catalogue-renderer`.

## 2. Prérequis d’installation

- Une instance n8n accessible et opérationnelle
- Le workflow JSON V3 final
- Un projet Supabase opérationnel
- Le bucket public `prospecting-artifacts`
- Les tables Supabase minimales :
  - `ai_prospecting_packs`
  - `outreach_attempts`
  - `prospect_targets`
- Les fonctions Supabase déployées :
  - `catalogue-renderer`
  - `deck-renderer`
- Un compte Resend opérationnel

## 3. Variables et secrets recommandés

### Variables n8n à définir

- `OPENAI_API_KEY`
- `CONTENT_ADMIN_TOKEN`
- `OUTREACH_FROM_EMAIL`
- `INTERNAL_REVIEW_EMAIL`

### Secrets à externaliser avant production

Le workflow de référence contient encore des tokens et clés directement dans certains nœuds REST Supabase et Resend. Avant production, il est recommandé de remplacer ces valeurs par des variables d’environnement ou des credentials n8n.

À externaliser en priorité :

- `apikey` Supabase dans les nœuds REST
- `Authorization: Bearer ...` Supabase dans les nœuds REST
- `Authorization: Bearer ...` Resend dans les nœuds email

## 4. Architecture actuelle

### Phases actuelles

1. Déclencheurs  
2. Initialisation  
3. Scraping web  
4. Normalisation et protection LLM  
5. Analyse IA  
6. Génération de contenu  
7. Assemblage et rendu d’artefacts  
8. Stockage et validation interne  
9. Approbation webhook  
10. Préparation d’envoi prospect  
11. Post-envoi, logs et statuts  
12. Rejet et erreurs

### Chaîne principale actuelle

`Assemble Prospect Pack -> Build Catalogue Render Payload -> Render Catalogue Artifact -> Merge Catalogue Artifact -> Build Deck Render Payload -> Render Deck Artifact -> Merge Deck Artifact -> Store Pack In Supabase -> Build Approval Email -> Send Internal Approval Email`

### Chaîne d’approbation et d’envoi

`Approval Webhook -> Parse Approval Query -> Get Pack From Supabase -> Extract Pack Payload -> If Approved -> Build Send Context -> If Ready To Send -> Mark Pack Approved -> Send External Prospect Email -> Parse Send Result -> Mark Pack Sent`

## 5. Règles critiques à connaître

- `Render Catalogue Artifact` et `Render Deck Artifact` utilisent :
  - `Authentication = None`
  - header `x-admin-token`
- `Store Pack In Supabase` doit recevoir la sortie de `Merge Deck Artifact`
- `Build Send Context` doit retourner :
  - `attachments_count = 2`
  - 1 fichier `.pdf`
  - 1 fichier `.pptx`
  - `can_send = true`
- Le deck premium dynamique doit rester dans une plage de **8 à 10 slides** selon la densité du contenu

## 6. Guide nœud par nœud

### Phase 1 — Déclencheurs

1. **Manual Trigger**  
   Type : `manualTrigger v1`  
   Rôle : déclenchement manuel depuis l’interface n8n.  
   Action : aucune configuration spécifique.

2. **Execute Workflow Trigger**  
   Type : `executeWorkflowTrigger v1`  
   Rôle : point d’entrée quand V4 ou un autre workflow appelle V3 automatiquement.  
   Action : aucune configuration spécifique.

### Phase 2 — Initialisation

3. **Set Target**  
   Type : `set v3.4`  
   Rôle : injecte les données prospect et applique les valeurs par défaut.  
   Points de vigilance :
   - `organization_name`
   - `website`
   - `country`
   - `organization_type`
   - `sector_guess`
   - `decision_maker_name`
   - `target_email`
   - `prospect_language`
   - `commercial_priority_default`
   - `booking_link_45min` pointe maintenant vers `https://calendly.com/contact-transferai/30min`

### Phase 3 — Scraping web

4. **Build Source URLs**  
   Type : `code v2`  
   Rôle : construit les URLs de scraping à partir du site prospect.
   Bon réflexe :
   - privilégier `/`, `/services/`, `/solutions/`, `/contact/` et `/blog/` par défaut
   - utiliser `custom_page_paths_csv` dès qu'un site a un slug spécifique comme `/la-smb/` au lieu de `/a-propos/`

5. **Fetch Public Page 1**  
   Type : `httpRequest v4.2`  
   Rôle : récupère la page 1 du site.
   Réglage recommandé :
   - `On Error -> Continue (regular output)`

6. **Fetch Public Page 2**  
   Type : `httpRequest v4.2`  
   Rôle : récupère la page 2 du site.
   Réglage recommandé :
   - `On Error -> Continue (regular output)`

7. **Fetch Public Page 3**  
   Type : `httpRequest v4.2`  
   Rôle : récupère la page 3 du site.
   Réglage recommandé :
   - `On Error -> Continue (regular output)`

8. **Fetch Public Page 4**  
   Type : `httpRequest v4.2`  
   Rôle : récupère la page 4 du site.
   Réglage recommandé :
   - `On Error -> Continue (regular output)`

9. **Fetch Public Page 5**  
   Type : `httpRequest v4.2`  
   Rôle : récupère la page 5 du site.
   Réglage recommandé :
   - `On Error -> Continue (regular output)`

10. **Normalize Public Signals**  
    Type : `code v2`  
    Rôle : agrège, nettoie et réduit le contenu textuel public.

### Phase 4 — Protection et analyse IA

11. **Sanitize Prospect Data For LLM**  
    Type : `code v2`  
    Rôle : pseudonymise et prépare les données pour les appels OpenAI.

12. **Call OpenAI Pre-Audit**  
    Type : `httpRequest v4.2`  
    Rôle : produit le pré-diagnostic prospect.  
    Changement clé :
    - l’autorisation OpenAI doit utiliser `{{$env.OPENAI_API_KEY}}`

13. **Call OpenAI Problems Solutions**  
    Type : `httpRequest v4.2`  
    Rôle : identifie les problèmes et solutions vendables.  
    Changement clé :
    - l’autorisation OpenAI doit utiliser `{{$env.OPENAI_API_KEY}}`

14. **Call OpenAI ROI**  
    Type : `httpRequest v4.2`  
    Rôle : estime hypothèses ROI, quick wins et timeline.  
    Changement clé :
    - l’autorisation OpenAI doit utiliser `{{$env.OPENAI_API_KEY}}`

15. **Assemble Prospect Context**  
    Type : `code v2`  
    Rôle : fusionne les sorties des 3 appels IA avec le contexte prospect.  
    Changement clé :
    - renforce les fallbacks métier pour `recommended_use_case`, `best_selling_use_case`, `commercial_priority_tier` et `recommended_offer`

### Phase 5 — Génération de contenu

16. **Generate Executive Letter**  
    Type : `httpRequest v4.2`  
    Rôle : génère le courrier prospect.  
    Changement clé :
    - français avec accents pour les prospects francophones

17. **Generate Tailored Catalogue**  
    Type : `httpRequest v4.2`  
    Rôle : génère le mini-catalogue personnalisé.  
    Changement clé :
    - prompts FR / EN / ES alignés avec accents pour FR et ES

18. **Generate Tailored Audit Form**  
    Type : `httpRequest v4.2`  
    Rôle : génère le formulaire d’audit pré-RDV.  
    Changement clé :
    - ton et langue harmonisés avec le reste du pack

19. **Generate Deck Brief**  
    Type : `httpRequest v4.2`  
    Rôle : génère le brief structuré du deck.  
    Changement clé :
    - prompts localisés, base du deck premium dynamique

### Phase 6 — Assemblage du pack et rendu catalogue

20. **Assemble Prospect Pack**  
    Type : `code v2`  
    Rôle : assemble tous les livrables intermédiaires dans un pack unique.

21. **Build Catalogue Render Payload**  
    Type : `code v2`  
    Rôle : construit le payload complet du `catalogue-renderer`.  
    Contient :
    - `pack_id`
    - `organization_name`
    - `decision_maker_name`
    - `website`
    - `sector_guess`
    - `organization_type`
    - `recommended_offer`
    - `recommended_use_case`
    - `best_selling_use_case`
    - `roi_hypothesis`
    - `delivery_timeline`
    - `recommended_training_bundle`
    - `tailored_catalogue_markdown`
    - `audit_form_url`
    - `calendly_url`
    - `storage`

22. **Render Catalogue Artifact**  
    Type : `httpRequest v4.2`  
    Rôle : appelle `catalogue-renderer`.  
    Configuration critique :
    - `POST`
    - `Authentication = None`
    - header `x-admin-token = {{$env.CONTENT_ADMIN_TOKEN}}`
    - header `Content-Type = application/json`
    - body `{{$json.catalogue_render_payload}}`

23. **Merge Catalogue Artifact**  
    Type : `code v2`  
    Rôle : fusionne le catalogue rendu dans le pack.  
    Changement clé :
    - lit maintenant l’entrée avec `$input.first().json`
    - normalise les attachments avec `content` ou `path`

### Phase 7 — Rendu deck premium

24. **Build Deck Render Payload**  
    Type : `code v2`  
    Rôle : construit le payload PPTX pour `deck-renderer`.  
    Contient :
    - `pack_id`
    - `organization_name`
    - `decision_maker_name`
    - `website`
    - `sector_guess`
    - `organization_type`
    - `recommended_offer`
    - `recommended_use_case`
    - `best_selling_use_case`
    - `roi_hypothesis`
    - `delivery_timeline`
    - `recommended_training_bundle`
    - `deck_brief`
    - `audit_form_url`
    - `calendly_url`
    - `storage`

25. **Render Deck Artifact**  
    Type : `httpRequest v4.2`  
    Rôle : appelle `deck-renderer` pour produire le `.pptx`.  
    Configuration critique :
    - `POST`
    - `Authentication = None`
    - header `x-admin-token = {{$env.CONTENT_ADMIN_TOKEN}}`
    - header `Content-Type = application/json`
    - body `{{$json.deck_render_payload}}`

26. **Merge Deck Artifact**  
    Type : `code v2`  
    Rôle : injecte le deck dans le pack et concatène les pièces jointes catalogue + deck.  
    Résultat attendu :
    - `attachments_count = 2`
    - 1 `.pdf`
    - 1 `.pptx`

### Phase 8 — Stockage et validation interne

27. **Store Pack In Supabase**  
    Type : `httpRequest v4.2`  
    Rôle : stocke le pack final enrichi dans `ai_prospecting_packs`.  
    Contenu minimal stocké :
    - `pack_id`
    - `prospect_id`
    - `organization_name`
    - `target_email`
    - `status = pending_approval`
    - `payload`
    - `llm_redaction_summary`

28. **Build Approval Email**  
    Type : `code v2`  
    Rôle : construit l’email interne d’approbation.  
    Changement clé :
    - affiche le décideur, le cas d’usage, le tier, `Pièces jointes préparées` et les noms de fichiers

29. **Send Internal Approval Email**  
    Type : `httpRequest v4.2`  
    Rôle : envoie l’email de validation interne via Resend.

### Phase 9 — Webhook d’approbation

30. **Approval Webhook**  
    Type : `webhook v2`  
    Rôle : reçoit les clics `approved` / `rejected`.

31. **Parse Approval Query**  
    Type : `code v2`  
    Rôle : normalise les paramètres webhook.

32. **Get Pack From Supabase**  
    Type : `httpRequest v4.2`  
    Rôle : recharge le pack stocké.

33. **Extract Pack Payload**  
    Type : `code v2`  
    Rôle : extrait le payload utile du pack pour l’envoi.

34. **If Approved**  
    Type : `if v1`  
    Rôle : sépare la branche approbation de la branche rejet.

### Phase 10 — Préparation et envoi prospect

35. **Build Send Context**  
    Type : `code v2`  
    Rôle : prépare le contexte final d’envoi.  
    Changement clé :
    - accepte `content` ou `path`
    - reconstruit depuis `catalogue_artifact` et `deck_artifact` si nécessaire
    - impose `attachments_count = 2`

36. **If Ready To Send**  
    Type : `if v1`  
    Rôle : autorise l’envoi uniquement si `can_send = true`.

37. **Mark Pack Approved**  
    Type : `httpRequest v4.2`  
    Rôle : marque le pack comme approuvé.

38. **Send External Prospect Email**  
    Type : `httpRequest v4.2`  
    Rôle : envoie l’email prospect via Resend avec les 2 pièces jointes.

39. **Parse Send Result**  
    Type : `code v2`  
    Rôle : extrait l’identifiant Resend et prépare `sent_at`.

40. **Mark Pack Sent**  
    Type : `httpRequest v4.2`  
    Rôle : met à jour le statut du pack à `sent`.

41. **Log Outreach Attempt**  
    Type : `httpRequest v4.2`  
    Rôle : journalise la tentative d’envoi dans `outreach_attempts`.

42. **Send Internal Sent Confirmation**  
    Type : `httpRequest v4.2`  
    Rôle : envoie une confirmation interne après expédition réussie.

### Phase 11 — Rejet et erreurs

43. **Mark Pack Approval Error**  
    Type : `httpRequest v4.2`  
    Rôle : passe le pack en `approval_error`.  
    Changement clé :
    - n’écrit plus `approval_error_at` si la colonne n’existe pas

44. **Mark Pack Rejected**  
    Type : `httpRequest v4.2`  
    Rôle : marque le pack comme rejeté.

45. **Update Prospect Target Sent**  
    Type : `httpRequest v4.2`  
    Rôle : met à jour `prospect_targets` après envoi réussi.

46. **Update Prospect Target Approval Error**  
    Type : `httpRequest v4.2`  
    Rôle : met à jour `prospect_targets` en cas d’erreur d’approbation.

47. **Update Prospect Target Rejected**  
    Type : `httpRequest v4.2`  
    Rôle : met à jour `prospect_targets` en cas de rejet.

48. **Respond to Webhook**  
    Type : `respondToWebhook v1.5`  
    Rôle : réponse texte simple après approbation.

49. **Respond Rejected**  
    Type : `respondToWebhook v1.5`  
    Rôle : réponse texte simple après rejet.

50. **Respond Approval Error**  
    Type : `respondToWebhook v1.5`  
    Rôle : réponse texte simple après erreur d’approbation.

## 7. Actions post-import recommandées

1. Vérifier que `OPENAI_API_KEY` est bien défini dans n8n.
2. Vérifier que `CONTENT_ADMIN_TOKEN` est bien défini dans n8n.
3. Vérifier que `OUTREACH_FROM_EMAIL` et `INTERNAL_REVIEW_EMAIL` sont bien définis.
4. Vérifier les clés Supabase et Resend encore intégrées en dur dans les nœuds HTTP, puis les remplacer par des variables ou credentials avant production.
5. Vérifier les URLs :
   - `catalogue-renderer`
   - `deck-renderer`
   - webhook d’approbation
6. Lancer un test complet et confirmer :
   - `Render Catalogue Artifact = success`
   - `Render Deck Artifact = success`
   - `Merge Deck Artifact -> attachments_count = 2`
   - `Build Send Context -> can_send = true`

## 8. Validation finale attendue

Le workflow V3 est correctement installé quand :

- le pack est généré sans erreur
- le catalogue PDF est généré
- le deck PPTX est généré
- les deux pièces jointes sont présentes
- l’email interne de validation affiche `Pièces jointes préparées : 2`
- l’approbation déclenche un envoi prospect réussi
- le pack est mis à jour à `sent`

## 9. Références liées

- `docs/transferai-admin/62_n8n_Prospection_V3_CRM_final.json`
- `supabase/functions/catalogue-renderer/index.ts`
- `supabase/functions/deck-renderer/index.ts`
- `outputs/manual-20260601-prospecting-guides/documents/user-guide/...`
- `outputs/manual-20260601-prospecting-guides/documents/troubleshooting-guide/...`

---

## 94_Guide_Utilisateur_Troubleshooting_Google_Forms_Social_Lead_Sequence_2026-06-15

Source : `docs/transferai-admin/word/source/94_Guide_Utilisateur_Troubleshooting_Google_Forms_Social_Lead_Sequence_2026-06-15.md`

# Guide utilisateur et troubleshooting - TransferAI Google Forms Social Lead Sequence

Workflow de référence : `TransferAI Google Forms Social Lead Sequence V2 Clean Importable`  
Fichier workflow : `docs/transferai-admin/93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json`  
Guide de base utilisé : `docs/transferai-admin/92_Guide_Activation_Google_Forms_Social_Lead_Sequence_V1.md`  
Date de consolidation : `15 juin 2026`

## 1. Objet du document

Ce document a été rédigé pour servir de référence opérationnelle sur le workflow Google Forms social lead mis en place pour TransferAI. Il regroupe deux besoins concrets :

- un guide utilisateur pas à pas, nœud par nœud
- un guide de dépannage fondé sur les incidents réellement rencontrés pendant la construction, les tests et la stabilisation du workflow

L’objectif est simple : permettre à une personne non technique ou semi-technique de comprendre ce que fait chaque nœud, quelles variables doivent être renseignées, comment faire un test propre, comment vérifier le bon fonctionnement dans Supabase et Resend, et comment corriger rapidement les erreurs les plus probables.

## 2. Ce que fait le workflow

Le workflow gère automatiquement la chaîne suivante :

1. réception d’un lead issu d’un Google Forms
2. normalisation des réponses du formulaire
3. création ou mise à jour du prospect dans `prospect_targets`
4. préparation d’un contexte d’envoi immédiat pour le premier email
5. envoi du premier email via Resend
6. journalisation de l’envoi dans `outreach_attempts`
7. mise à jour du statut CRM du prospect
8. relances automatiques via un scheduler horaire pour l’email 2 puis l’email 3

Le workflow couvre deux familles de formulaires :

- `assistant_training_interest`
- `enterprise_ai_interest`

## 3. Vue d’ensemble de l’architecture

Le workflow est structuré en deux branches principales :

### 3.1 Branche nouvelle soumission Google Forms

Cette branche part du webhook `Google Forms Social Lead Webhook` puis passe par :

1. `Set Social Sequence Config`
2. `If New Lead Payload`
3. `Normalize Google Forms Lead`
4. `Prepare Social Prospect Record`
5. `Upsert Social Prospect Into CRM`
6. `Build Immediate Social Send Context`
7. `If Social Lead Ready To Send`
8. `Build Social Sequence Email`
9. `Send Social Sequence Email`
10. `Parse Social Send Result`
11. `If Social Email Sent`
12. `Log Social Outreach Attempt`
13. `Update Prospect After Social Send`
14. ou `Update Prospect Social Failure`

### 3.2 Branche relances automatiques

Cette branche part du scheduler `Hourly Social Follow-Up Schedule` puis passe par :

1. `Set Social Sequence Config`
2. `If New Lead Payload`
3. `Fetch Social Prospect Snapshot`
4. `Build Due Social Follow-Ups`
5. `If Social Lead Ready To Send`
6. `Build Social Sequence Email`
7. `Send Social Sequence Email`
8. `Parse Social Send Result`
9. `If Social Email Sent`
10. `Log Social Outreach Attempt`
11. `Update Prospect After Social Send`
12. ou `Update Prospect Social Failure`

## 4. Variables, secrets et valeurs de configuration

### 4.1 Secrets indispensables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

Dans la version importable stabilisée, la base Supabase est déjà inscrite en dur dans les URL HTTP. En revanche, la clé service role Supabase et la clé Resend doivent être remplacées proprement dans les nœuds HTTP.

### 4.2 Paramètres fonctionnels portés par `Set Social Sequence Config`

- `source_backend`
- `source_label_prefix`
- `booking_link_45min`
- `follow_up_delay_1_days`
- `follow_up_delay_2_days`
- `follow_up_fetch_limit`
- `default_country`

### 4.3 Valeurs par défaut actuellement utilisées

- `source_backend = manual`
- `source_label_prefix = google_forms_social`
- `booking_link_45min = https://calendly.com/contact-transferai/30min`
- `follow_up_delay_1_days = 4`
- `follow_up_delay_2_days = 7`
- `follow_up_fetch_limit = 1`
- `default_country = Côte d'Ivoire`

### 4.4 Variables métier dérivées par le workflow

- `prospect_id`
- `decision_maker_name`
- `organization_name`
- `target_email`
- `phone`
- `function_label`
- `form_title`
- `form_type`
- `lead_temperature`
- `allow_third_email`
- `can_auto_sequence`
- `q3_needs`
- `assistant_q4_training_interest`
- `assistant_q5_main_need`
- `assistant_q6_launch_interest`
- `enterprise_q2_usage`
- `enterprise_q4_security`
- `enterprise_q5_visibility`
- `enterprise_q6_recontact_interest`
- `raw_answers`
- `sequence_step`
- `message_variant`
- `next_action_at_after`
- `is_final_step`
- `resend_id`
- `sent_at`
- `send_success`
- `send_api_response`
- `last_sequence_result`
- `last_response_status`
- `stop_reason`
- `niche_status`
- `next_action_at`

### 4.5 Remplacement concret des secrets dans les nœuds HTTP

Les nœuds suivants utilisent la clé service role Supabase :

- `Fetch Social Prospect Snapshot`
- `Upsert Social Prospect Into CRM`
- `Log Social Outreach Attempt`
- `Update Prospect After Social Send`
- `Update Prospect Social Failure`

Le nœud suivant utilise la clé Resend :

- `Send Social Sequence Email`

Les en-têtes attendus sont :

- `apikey: votre_cle_service_role_supabase`
- `Authorization: Bearer votre_cle_service_role_supabase`
- `Content-Type: application/json`
- `Prefer: return=representation` ou `resolution=merge-duplicates,return=representation` selon le nœud

Pour Resend :

- `Authorization: Bearer votre_cle_resend`
- `Content-Type: application/json`

## 5. Guide utilisateur pas à pas nœud par nœud

### 5.1 `Manual Trigger`

- Type : déclencheur manuel
- Rôle : lancer un test manuel depuis l’éditeur n8n
- Quand l’utiliser : pour tester la branche scheduler ou pour rejouer le workflow sans webhook
- Résultat attendu : aucune donnée métier en entrée, mais le workflow peut démarrer si la branche aval sait construire son contexte

### 5.2 `Hourly Social Follow-Up Schedule`

- Type : scheduler
- Rôle : chercher automatiquement les prospects en attente de relance
- Réglage clé : expression cron `0 * * * 1-6`
- Signification : exécution au début de chaque heure, du lundi au samedi
- Résultat attendu : le nœud passe la main à `Set Social Sequence Config`

### 5.3 `Google Forms Social Lead Webhook`

- Type : webhook POST
- Chemin : `google-forms-social-leads`
- Rôle : recevoir les nouvelles soumissions du formulaire
- Mode de réponse : immédiat
- Résultat attendu : le webhook reçoit un `body` contenant `form_title` et `answers`

### 5.4 `Set Social Sequence Config`

- Type : `Set`
- Rôle : injecter les paramètres de fonctionnement communs à tout le workflow
- Ce que vous devez vérifier :
- `booking_link_45min`
- `follow_up_delay_1_days`
- `follow_up_delay_2_days`
- `follow_up_fetch_limit`
- `default_country`
- Résultat attendu : un item enrichi avec les variables de configuration

### 5.5 `If New Lead Payload`

- Type : `If`
- Rôle : distinguer une nouvelle soumission Google Forms d’une simple exécution du scheduler
- Condition correcte :

```text
={{Boolean($json.body || $json.form_title || $json['Nom et prénom'] || $json.email || $json['Adresse e-mail'])}}
```

- Branche `true` : on traite un nouveau lead
- Branche `false` : on va chercher les relances dues dans Supabase

### 5.6 `Fetch Social Prospect Snapshot`

- Type : `HTTP Request`
- Rôle : charger dans Supabase les prospects actifs à relancer
- Table ciblée : `prospect_targets`
- Filtres clés :
- `status in (ready, active)`
- `paused = false`
- `do_not_contact = false`
- `stop_reason is null`
- `last_response_status = pending`
- Tri : `next_action_at`, puis `updated_at`
- Résultat attendu : une liste de prospects due pour relance

### 5.7 `Build Due Social Follow-Ups`

- Type : `Code`
- Rôle : sélectionner un prospect réellement dû et déterminer `sequence_step`
- Correctif important validé après tests :
- le nœud doit lire les entrées avec `$input.all()` en mode `Run Once for All Items`
- il ne faut pas se baser sur `$json` seul quand `Fetch Social Prospect Snapshot` renvoie plusieurs items
- Logique métier :
- si `last_sequence_result` est vide, alors `sequence_step = 1`
- si `last_sequence_result = social_email_1_sent`, alors `sequence_step = 2`
- si `last_sequence_result = social_email_2_sent` et `allow_third_email = true`, alors `sequence_step = 3`
- Résultat attendu : un seul item prêt à passer vers `If Social Lead Ready To Send`
- Vérification pratique :
- si ce nœud renvoie `0 item` alors aucun Email 2 ou Email 3 ne partira
- si ce nœud renvoie `1 item` avec `sequence_step = 2`, alors le workflow prépare Email 2
- si ce nœud renvoie `1 item` avec `sequence_step = 3`, alors le workflow prépare Email 3

### 5.8 `Normalize Google Forms Lead`

- Type : `Code`
- Rôle : convertir la charge utile brute du formulaire en structure métier propre
- Ce que fait le code :
- récupère `root` depuis `$json.body` ou `$json`
- récupère `answers`
- détecte le type de formulaire
- extrait nom, email, téléphone, fonction, entreprise
- prend en charge plusieurs variantes de libellés Google Forms avec ou sans accents
- prend en charge les différences d’apostrophes, d’espaces et de casse dans les questions
- déduit la température du lead
- déduit si le troisième email est autorisé
- construit `prospect_id`
- Résultat attendu :
- `prospect_id`
- `target_email`
- `form_type`
- `lead_temperature`
- `allow_third_email`
- `can_auto_sequence`
- `raw_answers`
- Correctif validé :
- la version finale ne doit contenir aucune adresse email de test en dur
- `target_email` doit être alimenté uniquement par l’email extrait du formulaire
- le mapping doit remonter le vrai `decision_maker_name` et le vrai `organization_name`

### 5.9 `Prepare Social Prospect Record`

- Type : `Code`
- Rôle : convertir le lead normalisé en ligne CRM prête pour `prospect_targets`
- Ce que le nœud prépare :
- `organization_type`
- `sector_guess`
- `commercial_priority_default`
- `source_payload`
- `status`
- `paused`
- `niche_status`
- `next_action_at`
- Résultat attendu : un objet complet compatible avec la table `prospect_targets`
- Correctif validé :
- toute constante de test du type `FORCED_TEST_EMAIL` doit être supprimée
- `target_email` doit rester `email || null`
- ce nœud ne doit plus contenir `marius.ayoro70@gmail.com` en dur dans la version de production

### 5.10 `Upsert Social Prospect Into CRM`

- Type : `HTTP Request`
- Méthode : `POST`
- Rôle : créer ou mettre à jour le prospect dans `prospect_targets`
- Point clé : `on_conflict=prospect_id`
- En-tête critique :
- `Prefer: resolution=merge-duplicates,return=representation`
- Résultat attendu : Supabase renvoie la ligne insérée ou mise à jour

### 5.11 `Build Immediate Social Send Context`

- Type : `Code`
- Rôle : préparer le contexte d’envoi immédiat du premier email
- Conditions de sortie :
- il faut un `target_email`
- le prospect ne doit pas être `paused`
- `stop_reason` ne doit pas être `low_recontact_intent`
- `source_payload.sequence_origin` doit être `google_forms_social`
- Résultat attendu :
- `sequence_step = 1` si aucun email n’a encore été envoyé
- `sequence_step = 2` si un premier email existe déjà

### 5.12 `If Social Lead Ready To Send`

- Type : `If`
- Rôle : vérifier que le contexte d’envoi est exploitable
- Condition correcte :

```text
={{Boolean($json.prospect_id && $json.target_email && $json.sequence_step)}}
```

- Branche `true` : on construit l’email
- Branche `false` : rien ne part

### 5.13 `Build Social Sequence Email`

- Type : `Code`
- Rôle : produire le sujet, le texte, le HTML et la logique de suite
- Ce que le nœud décide :
- quel modèle utiliser selon `form_type`
- quel email utiliser selon `sequence_step`
- quelle variante enregistrer dans les logs
- si la séquence continue ou se termine
- `next_action_at_after`
- `is_final_step`
- Résultat attendu :
- `email_subject`
- `email_text`
- `email_html`
- `message_variant`
- `next_action_at_after`
- `is_final_step`

### 5.14 `Send Social Sequence Email`

- Type : `HTTP Request`
- URL : `https://api.resend.com/emails`
- Rôle : envoyer l’email via Resend
- En-têtes requis :
- `Authorization: Bearer votre_cle_resend`
- `Content-Type: application/json`
- Corps JSON correct :

```text
={{({ from: 'TransferAI <contact@transferai.ci>', to: $json.target_email, subject: $json.email_subject, html: $json.email_html })}}
```

- Point critique : `to` doit être une chaîne simple et non un tableau
- Point critique 2 : ne pas laisser d’adresse de test figée dans le corps JSON final
- Résultat attendu : Resend renvoie un `id`

### 5.15 `Parse Social Send Result`

- Type : `Code`
- Rôle : fusionner le résultat Resend avec le contexte métier de l’email
- Ce que le nœud ajoute :
- `resend_id`
- `sent_at`
- `send_success`
- `send_api_response`
- Résultat attendu : un item complet pour la décision `If Social Email Sent`

### 5.16 `If Social Email Sent`

- Type : `If`
- Rôle : séparer le succès de l’échec d’envoi
- Condition correcte :

```text
={{$json.send_success}}
```

- Branche `true` :
- `Log Social Outreach Attempt`
- `Update Prospect After Social Send`
- Branche `false` :
- `Update Prospect Social Failure`

### 5.17 `Log Social Outreach Attempt`

- Type : `HTTP Request`
- Table ciblée : `outreach_attempts`
- Rôle : journaliser l’envoi effectué
- Champs attendus :
- `prospect_id`
- `channel = email`
- `message_variant`
- `sent_at`
- `delivery_status = submitted`
- `response_status = pending`
- `follow_up_due_at`
- `metadata.resend_message_id`
- Résultat attendu : une ligne supplémentaire dans `outreach_attempts`

### 5.18 `Update Prospect After Social Send`

- Type : `HTTP Request`
- Table ciblée : `prospect_targets`
- Rôle : mettre à jour le CRM après succès
- Champs clés mis à jour :
- `status = active`
- `paused = false`
- `last_sequence_result = social_email_1_sent` ou `social_email_2_sent` ou `social_email_3_sent`
- `last_response_status = pending`
- `niche_status = social_sequence_active` ou `social_sequence_completed`
- `next_action_at`
- Résultat attendu : le prospect est prêt pour la suite de séquence

### 5.19 `Update Prospect Social Failure`

- Type : `HTTP Request`
- Table ciblée : `prospect_targets`
- Rôle : figer le prospect en cas d’échec d’envoi
- Champs clés mis à jour :
- `status = paused`
- `paused = true`
- `last_sequence_result = social_email_send_error`
- `stop_reason = social_send_failed`
- `niche_status = social_sequence_fix_required`
- Résultat attendu : le prospect ne repart pas tout seul avant correction

## 6. Connexions à respecter entre les nœuds

Les connexions critiques validées sont les suivantes :

1. `If New Lead Payload`
- `true` vers `Normalize Google Forms Lead`
- `false` vers `Fetch Social Prospect Snapshot`

2. `If Social Lead Ready To Send`
- `true` vers `Build Social Sequence Email`

3. `If Social Email Sent`
- `true` vers `Log Social Outreach Attempt`
- `true` vers `Update Prospect After Social Send`
- `false` vers `Update Prospect Social Failure`

Point très important : `Update Prospect After Social Send` ne doit pas dépendre de la sortie de `Log Social Outreach Attempt`. Les deux nœuds doivent partir en parallèle depuis la branche `true` de `If Social Email Sent`.

## 7. Procédure de test complète

### 7.1 Test de bout en bout du webhook

1. Ouvrir le nœud `Google Forms Social Lead Webhook`
2. Cliquer sur `Listen for test event`
3. Copier l’URL de test `webhook-test`
4. Depuis Hoppscotch ou un outil équivalent, envoyer un `POST` JSON
5. Vérifier que le webhook reçoit bien `form_title` et `answers`

Exemple de payload de test :

```text
{
  "body": {
    "form_title": "Formulaire IA Côte d'Ivoire",
    "answers": {
      "Nom et prénom": "Awa Koné",
      "Nom de l'entreprise": "Société Demo CI",
      "Fonction": "Responsable administrative",
      "Téléphone": "+2250700000000",
      "Adresse e-mail": "awa.kone@example.com",
      "Votre entreprise utilise-t-elle déjà l’intelligence artificielle, même de manière partielle ?": "Pas encore, mais nous y réfléchissons",
      "Dans quel domaine l’intelligence artificielle pourrait-elle être la plus utile à votre entreprise aujourd’hui ?": [
        "Gestion administrative",
        "Relation client"
      ],
      "Pensez-vous que votre entreprise est suffisamment en sécurité face à Internet et à l’intelligence artificielle ?": "Pas totalement",
      "Avez-vous déjà essayé de voir ce que l’on trouve sur votre entreprise, ou même sur vous-même, sur Internet avec les outils d’intelligence artificielle ?": "Pas encore, mais cela m’intéresse",
      "Souhaitez-vous être recontacté pour découvrir des usages concrets de l’intelligence artificielle adaptés à votre entreprise ?": "Oui"
    }
  }
}
```

### 7.2 Vérification n8n après le test

Vous devez voir passer en vert, dans le meilleur cas :

1. `Google Forms Social Lead Webhook`
2. `Set Social Sequence Config`
3. `If New Lead Payload`
4. `Normalize Google Forms Lead`
5. `Prepare Social Prospect Record`
6. `Upsert Social Prospect Into CRM`
7. `Build Immediate Social Send Context`
8. `If Social Lead Ready To Send`
9. `Build Social Sequence Email`
10. `Send Social Sequence Email`
11. `Parse Social Send Result`
12. `If Social Email Sent`
13. `Log Social Outreach Attempt`
14. `Update Prospect After Social Send`

### 7.3 Vérification Supabase

Dans `prospect_targets`, vérifier :

- `last_sequence_result = social_email_1_sent`
- `niche_status = social_sequence_active`
- `next_action_at` est renseigné
- `paused = false`
- `status = active`

Dans `outreach_attempts`, vérifier :

- une nouvelle ligne a été créée
- `channel = email`
- `message_variant` est cohérent
- `sent_at` est renseigné
- `status` ou `delivery_status` reflète la soumission

### 7.4 Vérification Resend ou boîte email

Vérifier :

- que l’email apparaît bien dans le dashboard Resend
- que le destinataire réel reçoit bien l’email
- que le sujet correspond bien au modèle attendu

### 7.5 Validation spécifique Email 2

Dans `Supabase > public.prospect_targets`, sur la ligne du prospect de test :

- garder `target_email` sur une vraie boîte de test
- mettre `paused = false`
- mettre `status = active`
- mettre `last_sequence_result = social_email_1_sent`
- mettre `niche_status = social_sequence_active`
- mettre `last_response_status = pending`
- mettre `stop_reason = NULL`
- mettre `next_action_at` à une date passée

Ensuite :

1. lancer le workflow via `Manual Trigger` ou le scheduler
2. vérifier que `Build Due Social Follow-Ups` renvoie bien `sequence_step = 2`
3. vérifier que l’email 2 arrive dans la boîte de test
4. vérifier que `last_sequence_result` devient `social_email_2_sent`

### 7.6 Validation spécifique Email 3

Dans `Supabase > public.prospect_targets`, sur la ligne du prospect de test :

- garder `target_email` sur une vraie boîte de test
- mettre `paused = false`
- mettre `status = active`
- mettre `last_sequence_result = social_email_2_sent`
- mettre `niche_status = social_sequence_active`
- mettre `last_response_status = pending`
- mettre `stop_reason = NULL`
- mettre `next_action_at` à une date passée
- vérifier que `source_payload.allow_third_email = true`

Ensuite :

1. lancer le workflow via `Manual Trigger` ou le scheduler
2. vérifier que `Build Due Social Follow-Ups` renvoie bien `sequence_step = 3`
3. vérifier que l’email 3 arrive dans la boîte de test
4. vérifier que `last_sequence_result` devient `social_email_3_sent`

## 8. Mode test contrôlé avec une adresse réelle

Pendant les essais, nous avons utilisé un mode test temporaire pour forcer les emails vers une boîte réelle et éviter les faux destinataires du type `example.com`.

Adresse utilisée pour test réel :

- `marius.ayoro70@gmail.com`

Ce mode test peut être activé de deux façons :

### 8.1 Version rapide dans `Send Social Sequence Email`

Vous forcez temporairement le champ `to` :

```text
={{({ from: 'TransferAI <contact@transferai.ci>', to: 'marius.ayoro70@gmail.com', subject: $json.email_subject, html: $json.email_html })}}
```

### 8.2 Version plus forte dans les nœuds de préparation

Vous pouvez aussi forcer l’adresse dans :

- `Normalize Google Forms Lead`
- `Prepare Social Prospect Record`

Cette approche a été utile pendant les tests, mais elle ne doit pas rester en place en production.

Cette approche est utile si vous voulez que toute la chaîne soit cohérente, y compris dans `prospect_targets` et `outreach_attempts`.

## 9. Retour à la normale après validation

Une fois les tests terminés, il faut impérativement revenir à la logique normale :

- `target_email` doit venir du formulaire
- `to` dans `Send Social Sequence Email` doit redevenir `$json.target_email`
- les valeurs de test ne doivent pas rester en dur dans les nœuds de normalisation ou de préparation
- toute constante du type `FORCED_TEST_EMAIL` doit être supprimée
- `Prepare Social Prospect Record` doit utiliser `const email = cleanString(lead.target_email || '')`
- `Normalize Google Forms Lead` doit produire `target_email: email || null`

Le bon corps de requête final est :

```text
={{({ from: 'TransferAI <contact@transferai.ci>', to: $json.target_email, subject: $json.email_subject, html: $json.email_html })}}
```

Au moment du retour à la normale, vérifier en plus :

1. `Normalize Google Forms Lead` ne contient plus aucune adresse de test
2. `Prepare Social Prospect Record` ne contient plus `FORCED_TEST_EMAIL`
3. `Send Social Sequence Email` envoie bien vers `$json.target_email`
4. les anciens prospects de test créés avec `marius.ayoro70@gmail.com` sont identifiés comme données de test

## 10. Guide de troubleshooting

### 10.1 Symptôme : seul le webhook se coche et tout le reste ne part pas

- Cause probable : `If New Lead Payload` ne reconnaît pas la structure entrante
- Vérification : ouvrir `If New Lead Payload` et regarder si la branche `true` sort bien
- Correction : utiliser la condition stabilisée

```text
={{Boolean($json.body || $json.form_title || $json['Nom et prénom'] || $json.email || $json['Adresse e-mail'])}}
```

### 10.2 Symptôme : les exécutions durent seulement 4 à 5 ms

- Cause probable : le workflow ne fait pas vraiment le parcours complet
- Cause fréquente : seul le trigger a été touché, ou la branche `If` n’a rien laissé passer
- Correction :
- refaire un vrai test avec un payload complet
- vérifier que plusieurs nœuds passent en vert
- considérer qu’une exécution réaliste dure plutôt quelques centaines de millisecondes à quelques secondes

### 10.3 Symptôme : `The requested webhook "google-forms-social-leads" is not registered`

- Cause probable : utilisation de l’URL de test sans avoir cliqué sur `Listen for test event`
- Correction :
- pour l’URL `webhook-test`, cliquer sur `Listen for test event`
- pour l’URL de production, publier le workflow

### 10.4 Symptôme : `Network Error` dans Hoppscotch

- Cause probable : le body n’est pas réellement envoyé ou l’intercepteur réseau choisi dans Hoppscotch ne convient pas
- Correction :
- choisir `application/json`
- coller un vrai body JSON complet
- renvoyer la requête

### 10.5 Symptôme : `A 'json' property isn't an object [item 0]`

- Cause probable : le nœud `Code` renvoie un format incompatible
- Cas typique :
- retour d’un tableau brut en mode `Run once for each item`
- retour d’un objet sans clé `json`
- Correction :
- en `Run once for each item`, retourner `return { json: {...} }`
- en `Run once for all items`, retourner `return [{ json: {...} }]`

### 10.6 Symptôme : `access to env vars denied`

- Cause probable : n8n n’autorise pas l’accès à `$env` depuis l’interface sur ce contexte
- Correction :
- remplacer l’expression `$env` par une valeur explicite dans le nœud
- ou passer par des credentials n8n
- ou finaliser la gestion côté serveur au lieu de dépendre de la prévisualisation UI

### 10.7 Symptôme : `JSON parameter needs to be valid JSON`

- Cause probable : le corps JSON du nœud HTTP a reçu un objet mal formé, ou une expression avec une syntaxe invalide
- Correction :
- utiliser une expression simple et propre
- éviter les crochets ou accolades en trop
- si besoin, passer par `JSON.stringify(...)`

### 10.8 Symptôme : Resend renvoie `The 'to' field must be a string` ou `Missing 'to' field`

- Cause probable : le champ `to` a été envoyé sous forme de tableau ou n’a pas été rempli
- Mauvaise version :

```text
to: [$json.target_email]
```

- Bonne version :

```text
to: $json.target_email
```

### 10.9 Symptôme : `Cannot read properties of undefined (reading 'data')`

- Cause probable : un nœud aval suppose un format de réponse qui n’existe pas
- Cas rencontré : lecture de `response.data.id` alors que la réponse réelle était déjà au niveau racine
- Correction :
- sécuriser avec une double lecture

```text
const resendId = response.id || (response.data && response.data.id) || null;
```

### 10.10 Symptôme : `Build Due Social Follow-Ups` ne renvoie rien alors que le prospect existe et que `next_action_at` est passé

- Cause probable : le nœud lit mal les données d’entrée en mode `Run Once for All Items`
- Cas rencontré : `Fetch Social Prospect Snapshot` renvoie plusieurs items, mais le code lit seulement `$json`
- Correction :
- utiliser `const inputItems = $input.all()`
- aplatir les lignes avant la boucle métier
- vérifier ensuite que le nœud renvoie un item avec `sequence_step = 2` ou `sequence_step = 3`

### 10.11 Symptôme : `Invalid character in header content ["apikey"]`

- Cause probable : la clé collée dans le header contient un retour à la ligne ou un caractère parasite
- Correction :
- recoller la clé sur une seule ligne
- vérifier qu’il n’y a aucun espace ou saut de ligne caché

### 10.12 Symptôme : `If Social Email Sent` passe en `true` mais les nœuds suivants ne sont pas cohérents

- Cause probable : mauvaise connexion entre les branches
- Correction :
- la branche `true` doit partir vers `Log Social Outreach Attempt`
- la branche `true` doit partir aussi vers `Update Prospect After Social Send`
- la branche `false` doit partir vers `Update Prospect Social Failure`
- ne pas chaîner `Update Prospect After Social Send` derrière `Log Social Outreach Attempt`

### 10.13 Symptôme : l’email n’arrive pas dans Gmail mais on le voit dans Resend

- Cause probable : le destinataire est un faux email comme `awa.kone@example.com`
- Cause probable 2 : le dashboard Resend montre `Delivery Delayed`
- Correction :
- tester avec une vraie boîte comme `marius.ayoro70@gmail.com`
- vérifier l’adresse de destination dans `Send Social Sequence Email`
- vérifier le dashboard Resend sur la bonne ligne d’envoi

### 10.14 Symptôme : aucune nouvelle exécution visible dans l’onglet `Executions`

- Cause probable : le workflow testé n’est pas celui de l’éditeur courant
- Cause probable 2 : l’exécution de test a été faite hors écoute
- Correction :
- activer `Auto refresh`
- refaire le test après `Listen for test event`
- vérifier si le workflow a bien été publié

### 10.15 Symptôme : le workflow ne se déroule pas tout seul, mais seulement quand vous exécutez les nœuds manuellement

- Cause probable : le test a été fait nœud par nœud au lieu d’un lancement global
- Cause probable 2 : le trigger test a été lancé sans que le workflow soit réellement en écoute
- Correction :
- partir du webhook ou du scheduler
- lancer un vrai test de bout en bout
- ne pas utiliser `Execute step` comme validation finale du workflow complet

### 10.16 Symptôme : les emails partent bien, mais le contenu affiche `Prospect à confirmer` ou `Entreprise à confirmer`

- Cause probable : le mapping du nœud `Normalize Google Forms Lead` ne récupère pas correctement les libellés exacts du formulaire
- Correction :
- utiliser la version finale robuste du nœud `Normalize Google Forms Lead`
- vérifier dans sa sortie la présence de `decision_maker_name`, `organization_name` et `target_email`
- refaire un test webhook avec un payload réel du formulaire

## 11. Checklist d’exploitation

Avant mise en production, vérifier :

1. le workflow est publié
2. les clés Supabase et Resend sont propres
3. les URL Supabase pointent bien vers le bon projet
4. `If New Lead Payload` laisse passer un vrai payload
5. `If Social Lead Ready To Send` laisse passer un contexte avec email
6. `Send Social Sequence Email` utilise `to: $json.target_email`
7. `If Social Email Sent` est branché correctement
8. `prospect_targets` se met à jour
9. `outreach_attempts` reçoit une ligne
10. l’email est reçu dans une vraie boîte
11. `Build Due Social Follow-Ups` lit bien les entrées avec `$input.all()`
12. `Normalize Google Forms Lead` et `Prepare Social Prospect Record` ne contiennent plus de logique de test figée

## 12. Résultat attendu après stabilisation

Quand tout est correctement configuré :

- un lead Google Forms entre dans `prospect_targets`
- l’email 1 part immédiatement
- `outreach_attempts` reçoit un log d’envoi
- `last_sequence_result` devient `social_email_1_sent`
- `niche_status` devient `social_sequence_active`
- `next_action_at` est renseigné
- le scheduler peut ensuite envoyer l’email 2 puis l’email 3 selon les règles
- les tests validés montrent que la séquence complète Email 1, Email 2 et Email 3 fonctionne

## 13. Recommandation finale d’exploitation

Pour exploiter ce workflow proprement, il est recommandé de travailler en trois temps :

1. validation technique avec une adresse réelle de test
2. retour à la logique normale avec l’email provenant du formulaire
3. validation du mapping final nom, entreprise et email dans `Normalize Google Forms Lead`
4. mise en production avec publication du workflow et surveillance quotidienne de `prospect_targets`, `outreach_attempts` et Resend

Ce document doit être conservé comme référence de support interne tant que la V2 Clean Importable reste votre version opérationnelle.
