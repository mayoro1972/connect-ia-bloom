# Où le CRM entre dans le pipeline V4 / V5

Ce document répond à une question simple :

**à quel moment le CRM entre en ligne dans le workflow pour permettre de passer à 100 sociétés et plus ?**

La réponse courte est :

- le **CRM entre avant la prospection LLM**
- le **CRM devient la base maître des prospects**
- la **V4 lit le CRM**
- la **V5 alimente et enrichit le CRM**

## 1. Le vrai point d’entrée du CRM

Le CRM n’intervient pas à la fin.  
Il intervient **juste après la collecte et la normalisation des leads publics**.

Le flux cible est celui-ci :

1. scraping public / veille / recherche web / réseaux sociaux
2. normalisation des informations minimales
3. enregistrement dans le **CRM**
4. qualification et priorisation depuis le CRM
5. envoi au moteur prospect `V3`
6. retour des statuts dans le CRM

Autrement dit :

- le scraping alimente le CRM
- le CRM pilote la prospection
- le moteur LLM ne travaille que sur les prospects que le CRM a validés comme exploitables

## 2. Où apparaît le CRM dans la V4

Dans la logique actuelle, la **V4** est l’orchestrateur batch.

Son rôle est de :

- lire une liste de prospects depuis une source CRM
- normaliser cette liste
- appliquer les règles d’arrêt
- respecter les quotas
- pousser uniquement les prospects éligibles vers le workflow V3

Le CRM apparaît dans V4 à plusieurs endroits.

### a. Source de lecture

Dans `Set Batch Config`, on choisit le backend :

- `supabase`
- `airtable`
- `google_sheets`

Cela veut dire que **la V4 commence en lisant la base CRM**.

### b. Table CRM principale

Le point le plus robuste est :

- `prospect_targets`

Cette table joue le rôle de **CRM opérationnel maître**.

Elle contient notamment :

- `prospect_id`
- `organization_name`
- `website`
- `target_email`
- `sector_guess`
- `decision_maker_name`
- `outreach_attempt_count`
- `last_response_status`
- `last_sequence_result`
- `stop_reason`
- `paused`
- `do_not_contact`
- `niche_status`
- `next_action_at`

### c. Règles de décision CRM

La V4 ne pousse pas tous les prospects.

Elle lit les champs CRM pour décider :

- qui doit partir aujourd’hui
- qui est bloqué
- qui doit attendre
- qui doit sortir du pipeline

Donc le CRM n’est pas un simple fichier d’adresses.
Il devient le **cerveau opérationnel de la file de prospection**.

## 3. Où apparaît le CRM dans la V3

La **V3** n’est pas la base CRM, mais elle écrit dans le CRM élargi.

Elle crée ou alimente :

- `ai_prospecting_packs`
- `outreach_attempts`

Dans la variante V3 enrichie utilisée pour la suite, elle peut aussi générer les artefacts commerciaux rendus avant stockage :

- mini-catalogue prospect
- deck prospect

Ces tables servent à mémoriser :

- le pack généré
- la décision d’approbation
- l’envoi effectué
- l’historique des tentatives

Donc :

- `prospect_targets` = CRM maître des prospects
- `ai_prospecting_packs` = CRM des livrables générés
- `outreach_attempts` = CRM des interactions envoyées

## 4. Ce qui manquait avant la V5

Avant la V5, le système savait :

- lire le CRM
- traiter les prospects
- envoyer et journaliser

Mais il manquait une vraie **boucle de croissance CRM**.

Il fallait un workflow qui fasse explicitement ceci :

- recevoir les leads issus du scraping
- les transformer en fiches CRM propres
- dédupliquer
- upserter dans `prospect_targets`
- enrichir la base chaque jour
- puis déclencher la V4 si besoin

C’est exactement le rôle de la **V5**.

## 5. Ce que fait la V5

La V5 est la **boucle de croissance CRM**.

Elle prend en charge :

1. l’ingestion des leads publics scrappés
2. la normalisation dans le format prospect canonique
3. l’upsert dans `prospect_targets`
4. la mise à jour des champs de pilotage CRM
5. le déclenchement optionnel de la V4
6. la production d’un résumé de croissance CRM

En termes simples :

- **V5 remplit le CRM**
- **V4 exploite le CRM**
- **V3 contacte les prospects et renvoie les statuts**

## 6. Réponse à la question “quand le CRM entre en ligne ?”

Le CRM entre en ligne **au moment où les leads scrappés cessent d’être des données brutes et deviennent des fiches prospects pilotables**.

Donc le moment exact est :

**entre le scraping et l’envoi au moteur prospect V3**

Si tu veux passer à 100 sociétés et plus, il ne faut pas envoyer directement les leads scrappés vers V1, V2 ou V3.

Il faut :

1. les faire entrer dans `prospect_targets`
2. les qualifier dans le CRM
3. les laisser sortir via la V4

## 7. Architecture cible recommandée

Voici l’architecture que je recommande maintenant :

1. `V5`
Rôle :
ingestion quotidienne des leads scrappés et alimentation du CRM

2. `V4`
Rôle :
lecture du CRM, application des quotas et dispatch vers V3

Dans la mise à jour actuelle, la V4 peut aussi conserver dans son résumé batch des signaux sur les artefacts produits par la V3 enrichie :

- catalogues rendus
- decks rendus
- pièces jointes générées
- erreurs de rendu

3. `V3`
Rôle :
pré-audit, génération des actifs, rendu catalogue / deck, approbation, envoi et log

## 8. Résumé de gouvernance

Pour un pipeline propre :

- le scraping ne doit pas alimenter directement le LLM
- le scraping doit alimenter le CRM
- le CRM décide ce qui part en prospection
- le LLM ne voit que les signaux publics assainis

## 9. Fichiers à utiliser

- [V4 batch orchestrator](./47_n8n_Prospection_Multi_Prospect_V4_Batch.json)
- [Guide V4 quotas et règles d’arrêt](./49_Guide_V4_Batch_Quotas_Stop_Rules.md)
- [V5 growth loop CRM](./60_n8n_Prospection_CRM_V5_Growth_Loop.json)
- [Guide V5 CRM](./61_Guide_V5_CRM_Growth_Loop.md)

Pour la suite, le workflow enfant référencé par `N8N_CHILD_WORKFLOW_ID_V3` doit être la V3 enrichie qui produit aussi le mini-catalogue et le deck.
