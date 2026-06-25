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
