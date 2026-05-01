# Tableau de suivi de journée - binôme V1 Agent IA

## Informations de session

- Date :
- Heure de début :
- Heure de fin :
- Personne A :
- Personne B :
- Lien Calendly validé :

## Objectif du jour

Livrer une **V1 fonctionnelle** de l'agent IA TransferAI capable de :

- recevoir un message WhatsApp entrant
- qualifier un prospect
- comprendre le besoin
- proposer une démo si le prospect est sérieux
- enregistrer le lead
- permettre un handoff humain

## Rappel des 3 questions obligatoires

- [ ] Nom de l’entreprise
- [ ] Secteur d’activité
- [ ] Besoin principal : formation, veille ou automatisation

## Tableau de suivi heure par heure

| Créneau | Tâches Personne A | Tâches Personne B | Statut | Notes |
|---|---|---|---|---|
| 9h00 - 9h30 | Cadrage métier, ton, définition du prospect sérieux | Cadrage technique, validation du périmètre V1 | ☐ À faire ☐ En cours ☐ Fait | |
| 9h30 - 10h30 | Finaliser prompt système, qualification initiale, relance courte | Créer le squelette du workflow n8n | ☐ À faire ☐ En cours ☐ Fait | |
| 10h30 - 11h30 | Finaliser qualification JSON, scoring, démo, handoff, note interne | Brancher OpenAI qualification + scoring + réponse | ☐ À faire ☐ En cours ☐ Fait | |
| 11h30 - 12h15 | Relecture des réponses et qualité métier | Premier test technique WhatsApp / n8n / OpenAI | ☐ À faire ☐ En cours ☐ Fait | |
| 12h15 - 13h00 | Corriger ton, clarté, relances | Corriger mappings, JSON, fallbacks | ☐ À faire ☐ En cours ☐ Fait | |
| 14h00 - 15h00 | Valider règles de démo et handoff humain | Implémenter les conditions IF / Switch | ☐ À faire ☐ En cours ☐ Fait | |
| 15h00 - 16h00 | Définir résumé CRM, note interne, statuts | Brancher stockage Supabase / CRM / logs | ☐ À faire ☐ En cours ☐ Fait | |
| 16h00 - 17h00 | Jouer les scénarios de test métier | Vérifier les scénarios de test techniques | ☐ À faire ☐ En cours ☐ Fait | |
| 17h00 - 17h45 | Harmoniser le ton final | Nettoyer les nœuds, nommage, export workflow | ☐ À faire ☐ En cours ☐ Fait | |
| 17h45 - 18h00 | Validation finale V1 | Validation finale V1 | ☐ À faire ☐ En cours ☐ Fait | |

## Checklist de cadrage initial

- [ ] Objectif V1 validé ensemble
- [ ] Lien Calendly validé
- [ ] Ton de voix validé
- [ ] Définition du prospect sérieux validée
- [ ] Cas de handoff humain validés
- [ ] Services prioritaires du jour validés

## Checklist prompts

- [ ] Prompt système maître validé
- [ ] Prompt qualification initiale validé
- [ ] Prompt qualification JSON validé
- [ ] Prompt scoring lead validé
- [ ] Prompt proposition de démo validé
- [ ] Prompt relance si infos manquantes validé
- [ ] Prompt handoff humain validé
- [ ] Prompt note interne validé

## Checklist workflow n8n

- [ ] Webhook Twilio créé
- [ ] Normalisation du message créée
- [ ] Récupération historique branchée
- [ ] Nœud OpenAI qualification branché
- [ ] Nœud OpenAI scoring branché
- [ ] Nœud OpenAI réponse branché
- [ ] Nœud IF / Switch configuré
- [ ] Enregistrement base / CRM branché
- [ ] Réponse WhatsApp sortante branchée
- [ ] Notification interne branchée si prévue

## Checklist Chatwoot

- [ ] Inbox Chatwoot vérifiée
- [ ] Prompt système injecté
- [ ] Attributs contact créés
- [ ] Test conversation Chatwoot lancé
- [ ] Handoff humain vérifié

## Checklist de tests

### Scénarios

- [ ] Message vague : “Bonjour, je veux en savoir plus”
- [ ] Message formation
- [ ] Message audit IA
- [ ] Message automatisation
- [ ] Message partenariat
- [ ] Message sérieux demandant une démo

### Vérifications à chaque test

- [ ] Message reçu côté canal
- [ ] Workflow déclenché
- [ ] Qualification correcte
- [ ] Réponse correcte
- [ ] Démo proposée au bon moment
- [ ] Données enregistrées
- [ ] Note interne générée
- [ ] Handoff humain si nécessaire

## Définition du prospect sérieux

Le prospect est considéré comme sérieux si :

- [ ] l’entreprise est identifiée
- [ ] le secteur est identifié
- [ ] le besoin est concret
- [ ] l’intention est B2B ou opérationnelle
- [ ] le prospect montre un projet réel
- [ ] la demande concerne formation, audit ou automatisation avec un besoin clair

## Conditions de handoff humain

Déclencher un handoff humain si :

- [ ] demande stratégique
- [ ] demande institutionnelle
- [ ] partenariat important
- [ ] besoin complexe
- [ ] prospect très qualifié
- [ ] demande urgente
- [ ] insatisfaction ou situation sensible

## Bloc de suivi des bugs

| Heure | Bug / point bloquant | Impact | Responsable | Corrigé |
|---|---|---|---|---|
| | | | | ☐ |
| | | | | ☐ |
| | | | | ☐ |
| | | | | ☐ |
| | | | | ☐ |

## Bloc de suivi des décisions

| Heure | Décision prise | Motif | Validé par |
|---|---|---|---|
| | | | |
| | | | |
| | | | |
| | | | |

## Validation finale V1

- [ ] WhatsApp reçoit et répond correctement
- [ ] Les 3 questions de qualification sont bien posées
- [ ] Le besoin est correctement compris
- [ ] La démo est proposée quand le lead est sérieux
- [ ] Le handoff humain est possible
- [ ] Le lead est enregistré
- [ ] La note interne est générée
- [ ] La version du jour est jugée démontrable

## Actions à reporter à demain

- [ ]
- [ ]
- [ ]
- [ ]
- [ ]

## Conclusion de session

- V1 validée : ☐ Oui ☐ Non
- Niveau de confiance : ☐ Faible ☐ Moyen ☐ Bon ☐ Très bon
- Recommandation de prochaine étape :

