# Checklist de construction n8n prête à cocher

## 1. Préparation

- [ ] Accès n8n validé
- [ ] Accès OpenAI validé
- [ ] Accès Twilio validé
- [ ] Accès Supabase validé
- [ ] Accès Resend validé
- [ ] Lien Calendly validé
- [ ] Personne A et Personne B alignées sur l'objectif V1

## 2. Variables d'environnement

- [ ] `OPENAI_API_KEY` ajouté
- [ ] `OPENAI_MODEL` ajouté
- [ ] `TWILIO_ACCOUNT_SID` ajouté
- [ ] `TWILIO_AUTH_TOKEN` ajouté
- [ ] `TWILIO_WHATSAPP_FROM` ajouté
- [ ] `CALENDLY_LINK` ajouté
- [ ] `SUPABASE_URL` ajouté
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ajouté
- [ ] `RESEND_API_KEY` ajouté si notification interne prévue

## 3. Construction du workflow principal

### Déclenchement

- [ ] Créer le nœud `Twilio Inbound Webhook`
- [ ] Configurer la méthode `POST`
- [ ] Copier l'URL du webhook
- [ ] Vérifier que Twilio appelle la bonne URL

### Normalisation

- [ ] Créer le nœud `Normalize Input`
- [ ] Mapper `Body`
- [ ] Mapper `From`
- [ ] Mapper `To`
- [ ] Mapper `ProfileName`
- [ ] Mapper `MessageSid`
- [ ] Mapper `WaId`
- [ ] Mapper `NumMedia`

### Historique

- [ ] Créer le nœud `Get Message History`
- [ ] Lire `whatsapp_inbound_messages`
- [ ] Filtrer par `from_number`
- [ ] Trier par `created_at desc`
- [ ] Limiter à 10 messages

### Contexte IA

- [ ] Créer le nœud `Build Context`
- [ ] Construire `message_text`
- [ ] Construire `history`
- [ ] Injecter `calendly_link`

## 4. Qualification OpenAI

- [ ] Créer le nœud `OpenAI Qualification JSON`
- [ ] Coller le prompt de qualification JSON
- [ ] Vérifier que la sortie est bien structurée
- [ ] Créer le nœud `Parse Qualification JSON`
- [ ] Prévoir un fallback si JSON invalide

## 5. Scoring et routage

- [ ] Créer le nœud `OpenAI Lead Scoring`
- [ ] Coller le prompt scoring lead
- [ ] Créer le nœud `Parse Scoring JSON`
- [ ] Créer le nœud `OpenAI Route Service`
- [ ] Coller le prompt routage service
- [ ] Créer le nœud `Parse Route JSON`

## 6. Note interne

- [ ] Créer le nœud `OpenAI Internal Note`
- [ ] Coller le prompt note interne
- [ ] Fusionner la note avec le contexte final

## 7. Décisions métier

- [ ] Créer le nœud `Decision Switch`
- [ ] Branche `missing_fields` configurée
- [ ] Branche `handoff` configurée
- [ ] Branche `demo` configurée
- [ ] Branche `standard` configurée

## 8. Réponses IA

- [ ] Créer `Reply Ask Missing Info`
- [ ] Créer `Reply Human Handoff`
- [ ] Créer `Reply Offer Demo`
- [ ] Créer `Reply Standard`
- [ ] Créer `Prepare Final Reply`
- [ ] Vérifier que `reply_text` est bien produit

## 9. Stockage

- [ ] Créer `Upsert Lead`
- [ ] Choisir la table cible
- [ ] Enregistrer :
  - [ ] `contact_name`
  - [ ] `company_name`
  - [ ] `sector`
  - [ ] `need_type`
  - [ ] `intent`
  - [ ] `lead_seriousness`
  - [ ] `score`
  - [ ] `summary`
  - [ ] `recommended_route`
  - [ ] `internal_note`
- [ ] Créer `Insert Automation Log`

## 10. Réponse sortante WhatsApp

- [ ] Créer `Send WhatsApp Reply`
- [ ] Vérifier `To`
- [ ] Vérifier `From`
- [ ] Vérifier `Body`
- [ ] Tester un envoi réel

## 11. Notification interne facultative

- [ ] Créer `Notify Internal Team`
- [ ] Déclencher seulement si lead fort ou handoff humain
- [ ] Créer `Send Internal Email`
- [ ] Vérifier les destinataires
- [ ] Tester l'email

## 12. Tests minimums

- [ ] Test message vague
- [ ] Test message formation
- [ ] Test message audit IA
- [ ] Test message automatisation
- [ ] Test message partenariat
- [ ] Test message sérieux avec demande de démo

## 13. Vérifications à chaque test

- [ ] Twilio reçoit
- [ ] Webhook n8n déclenche
- [ ] Qualification JSON est correcte
- [ ] Scoring est correct
- [ ] Routage est cohérent
- [ ] Réponse est courte et professionnelle
- [ ] Le lead est enregistré
- [ ] La note interne est générée
- [ ] La démo est proposée si pertinent
- [ ] Le handoff humain est possible

## 14. Conditions métier à confirmer

### Prospect sérieux

- [ ] entreprise identifiée
- [ ] secteur identifié
- [ ] besoin concret
- [ ] logique B2B
- [ ] intérêt réel pour audit, automatisation ou accompagnement

### Handoff humain

- [ ] demande stratégique
- [ ] demande institutionnelle
- [ ] besoin complexe
- [ ] partenariat important
- [ ] prospect très qualifié
- [ ] insatisfaction

## 15. Critères de validation V1

- [ ] V1 répond sur WhatsApp
- [ ] V1 pose les 3 questions si elles manquent
- [ ] V1 comprend formation / veille / automatisation
- [ ] V1 propose une démo au bon moment
- [ ] V1 n'invente pas d'information
- [ ] V1 stocke les données utiles
- [ ] V1 permet un handoff humain

## 16. Problèmes à noter

- [ ]
- [ ]
- [ ]
- [ ]
- [ ]

## 17. Décision finale

- [ ] V1 validée
- [ ] V1 partiellement validée
- [ ] Corrections nécessaires avant déploiement

## 18. Suite recommandée après V1

- [ ] brancher Chatwoot
- [ ] ajouter le traitement email entrant
- [ ] ajouter un résumé CRM plus complet
- [ ] ajouter du reporting
- [ ] ajouter la supervision équipe
