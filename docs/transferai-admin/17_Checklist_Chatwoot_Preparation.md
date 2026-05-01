# Checklist Chatwoot prête à cocher

## 1. Objectif

Cette checklist sert à préparer **Chatwoot** avant de brancher la logique `n8n + OpenAI`.

Le but est de s'assurer que Chatwoot est déjà prêt comme :

- couche conversationnelle visible
- interface de reprise humaine
- support de qualification
- surface de lecture des conversations

## 2. Workspace

- [ ] Créer le workspace `TransferAI Africa`
- [ ] Vérifier l'accès administrateur principal
- [ ] Définir l'email administrateur principal
- [ ] Vérifier que l'espace est opérationnel

## 3. Membres et agents

- [ ] Ajouter Personne A
- [ ] Ajouter Personne B
- [ ] Définir les rôles d'accès
- [ ] Définir qui reprend les handoffs humains
- [ ] Définir qui supervise les conversations entrantes

## 4. Inboxes

- [ ] Créer l'inbox `Website - TransferAI`
- [ ] Vérifier que l'inbox est active
- [ ] Récupérer le script widget si besoin
- [ ] Décider si WhatsApp passera aussi visuellement dans Chatwoot plus tard

## 5. Sécurité et API

- [ ] Générer ou récupérer la clé API Chatwoot
- [ ] Vérifier que la clé API fonctionne
- [ ] Tester la lecture d'une conversation via API
- [ ] Tester la création d'un message via API
- [ ] Vérifier les permissions du compte utilisé pour l'automatisation

## 6. Attributs custom

- [ ] Créer `company_name`
- [ ] Créer `sector`
- [ ] Créer `email`
- [ ] Créer `phone`
- [ ] Créer `country`
- [ ] Créer `contact_role`
- [ ] Créer `need_type`
- [ ] Créer `intent`
- [ ] Créer `lead_score`
- [ ] Créer `lead_seriousness`
- [ ] Créer `recommended_route`
- [ ] Créer `demo_proposed`
- [ ] Créer `human_handoff`
- [ ] Créer `qualification_status`
- [ ] Créer `internal_summary`
- [ ] Créer `next_best_action`

## 7. Tags

- [ ] Créer `formation`
- [ ] Créer `audit-ia`
- [ ] Créer `automatisation`
- [ ] Créer `catalogue`
- [ ] Créer `partenariat`
- [ ] Créer `emploi`
- [ ] Créer `support`
- [ ] Créer `lead-chaud`
- [ ] Créer `infos-manquantes`
- [ ] Créer `demo-proposee`
- [ ] Créer `handoff-humain`
- [ ] Créer `a-rappeler`
- [ ] Créer `reponse-envoyee`
- [ ] Créer `priorite-haute`

## 8. Macros

- [ ] Créer `Accueil TransferAI`
- [ ] Créer `Relance infos manquantes`
- [ ] Créer `Proposer démo`
- [ ] Créer `Reprise humaine`
- [ ] Créer `Cloture polie`
- [ ] Créer `Orientation audit IA`
- [ ] Créer `Orientation formation`

## 9. Webhooks sortants

- [ ] Identifier l'écran Webhooks dans Chatwoot
- [ ] Préparer l'URL webhook n8n
- [ ] Activer `message_created`
- [ ] Activer `conversation_created`
- [ ] Activer les événements complémentaires utiles
- [ ] Tester qu'un événement part bien vers n8n

## 10. Règles métier

- [ ] Valider les 3 questions obligatoires
- [ ] Valider la définition du prospect sérieux
- [ ] Valider les cas de handoff humain
- [ ] Valider le lien Calendly
- [ ] Valider le ton de voix de l'assistant

## 11. Tests minimum

- [ ] Test message entrant website
- [ ] Test mise à jour des attributs
- [ ] Test tags
- [ ] Test note interne
- [ ] Test réponse IA
- [ ] Test handoff humain

## 12. Validation finale

- [ ] Chatwoot est prêt à recevoir n8n
- [ ] Les attributs nécessaires existent
- [ ] Les tags sont utilisables
- [ ] Les macros de secours sont prêtes
- [ ] La clé API est fonctionnelle
- [ ] Les webhooks sont prêts
- [ ] L'équipe est capable de reprendre une conversation manuellement
