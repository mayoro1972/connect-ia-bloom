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
