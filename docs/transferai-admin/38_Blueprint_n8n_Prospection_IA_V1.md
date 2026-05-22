# Blueprint n8n V1 - Prospection IA ciblée

Date : 2026-05-22

## Objet

Ce document traduit la vision métier de la prospection automatisée en une première architecture **n8n V1**.

L'objectif n'est pas de créer un robot qui envoie automatiquement des messages à grande échelle.

L'objectif est de construire un système qui :

- collecte des signaux publics ;
- enrichit une CRM ;
- prépare un pré-audit utile ;
- prépare une hypothèse de ROI ou de gains potentiels ;
- recommande une offre adaptée ;
- génère les actifs commerciaux nécessaires ;
- et n'envoie qu'après contrôle de qualité et de conformité.

## 1. Principe directeur

Le système repose sur trois niveaux :

1. **Collecter et structurer**
2. **Qualifier et recommander**
3. **Préparer puis décider d'envoyer**

Dans cette architecture, **n8n** orchestre les étapes et l'**assistant IA** intervient comme moteur d'analyse, pas comme autorité finale autonome.

## 1.1 Priorités commerciales à encoder

Le système ne doit pas proposer toutes les offres avec la même probabilité.

Il doit privilégier, par défaut, les domaines et cas d'usage les plus vendables à court terme :

- `IT & Transformation Digitale`
- `Service Client`
- `Marketing & Communication`
- `Administration & Gestion`
- `Assistanat & Secrétariat`

Cas d'usage à favoriser :

- `support_it_intelligent`
- `service_client_multicanal`
- `machine_contenu_marketing`
- `workflow_administratif`
- `assistant_direction_documentaire`

## 2. Workflows recommandés

Je recommande de découper le système en 6 workflows principaux.

## Workflow 1 - Veille et collecte quotidienne

### Rôle

Récupérer chaque jour des signaux publics sur de nouvelles structures ou sur des structures déjà présentes dans la CRM.

### Déclencheur

- `Cron`

### Nœuds recommandés

1. `Cron`
2. `Set` : définir les sources du jour
3. `HTTP Request` : interroger les pages ou APIs autorisées
4. `HTML Extract` ou `Code` : extraire les informations utiles
5. `IF` : éliminer les pages vides ou non exploitables
6. `Merge` : regrouper les signaux
7. `Code` : normaliser le payload
8. `Supabase` ou base cible : créer une ligne dans `organization_research`
9. `Execute Workflow` : envoyer vers le workflow de normalisation

### Sortie attendue

- une ou plusieurs fiches de recherche brutes mais structurées.

## Workflow 2 - Normalisation CRM

### Rôle

Transformer les données collectées en fiches CRM propres.

### Déclencheur

- `Execute Workflow`

### Nœuds recommandés

1. `Execute Workflow Trigger`
2. `Code` : dédupliquer par nom de structure, domaine et pays
3. `Supabase` : rechercher une organisation existante
4. `IF`
5. `Supabase` : créer l'organisation si absente
6. `Supabase` : mettre à jour l'organisation si déjà présente
7. `Code` : extraire les contacts visibles
8. `Supabase` : créer ou mettre à jour les personnes
9. `Execute Workflow` : envoyer la fiche vers l'enrichissement IA

### Sortie attendue

- une fiche `organizations` propre ;
- une ou plusieurs fiches `people` si disponibles.

## Workflow 3 - Qualification par l'assistant IA

### Rôle

Demander à l'assistant IA d'interpréter les signaux publics et de produire une lecture commerciale.

### Déclencheur

- `Execute Workflow`

### Nœuds recommandés

1. `Execute Workflow Trigger`
2. `Supabase` : charger la fiche organisation et ses signaux
3. `AI Agent` ou nœud LLM encadré
4. `Structured Output Parser` ou `Code` : valider la structure attendue
5. `IF` : rejeter les sorties trop faibles ou incohérentes
6. `Supabase` : écrire dans `organization_analysis`
7. `Execute Workflow` : envoyer vers la génération des actifs

### Sortie attendue

- résumé de la structure ;
- besoins probables ;
- niche ou porte d'entrée ;
- offre recommandée ;
- séquence d'offre recommandée ;
- formation recommandée ;
- cas d'usage suggéré ;
- cas d'usage best-seller recommandé ;
- tier commercial recommandé ;
- hypothèse de ROI ou de gains attendus ;
- variante sectorielle recommandée ;
- feuille de route de déploiement ;
- canal recommandé ;
- recommandation `envoyer`, `enrichir`, `attendre` ou `abandonner`.

## Workflow 4 - Génération du prospect pack

### Rôle

Créer les livrables commerciaux adaptés à la structure.

### Déclencheur

- `Execute Workflow`

### Nœuds recommandés

1. `Execute Workflow Trigger`
2. `Supabase` : charger l'analyse
3. `Switch` : choisir le secteur ou le type d'organisation
4. `Set` : sélectionner le bon modèle de courrier
5. `Set` : sélectionner le bon mini-catalogue
6. `Set` : sélectionner le bon deck ou le bon template PowerPoint
7. `AI Agent` ou nœud LLM : générer les textes adaptés
8. `Code` : assembler le prospect pack
9. `Supabase` : stocker les actifs dans `outreach_assets`
10. `Execute Workflow` : envoyer vers le contrôle avant envoi

### Sortie attendue

- courrier ou e-mail ;
- message court ;
- mini-catalogue recommandé ;
- adaptation du deck ;
- note de cas d'usage ;
- hypothèse de ROI ;
- jalons `J+0`, `J+15`, `J+45`, `J+90` ;
- appel à l'action principal unique ;
- recommandation de rendez-vous.

## Workflow 5 - Contrôle avant envoi

### Rôle

Bloquer les envois faibles, risqués ou non conformes.

### Déclencheur

- `Execute Workflow`

### Nœuds recommandés

1. `Execute Workflow Trigger`
2. `Supabase` : vérifier le statut CRM
3. `IF` : vérifier `do_not_contact`
4. `IF` : vérifier l'existence d'un contact professionnel défendable
5. `IF` : vérifier le score de confiance
6. `IF` : vérifier l'absence de doublon récent
7. `IF` : vérifier le canal autorisé
8. `Code` : calculer la décision finale
9. `Supabase` : journaliser la décision
10. `IF` : envoyer vers file d'envoi ou vers file d'attente

### Sortie attendue

- `approved_for_send`
- `manual_review_required`
- `stopped`

## Workflow 6 - Envoi, suivi et arrêt

### Rôle

Envoyer un petit volume de messages qualifiés, suivre les retours et arrêter si les signaux sont mauvais.

### Déclencheur

- `Cron`
- ou `Manual Trigger` pour validation humaine

### Nœuds recommandés

1. `Cron` ou `Manual Trigger`
2. `Supabase` : récupérer les prospects approuvés
3. `Code` : limiter à 3 à 5 envois
4. `Split In Batches`
5. `Email` ou `HTTP Request` vers le service d'envoi
6. `Supabase` : enregistrer dans `outreach_attempts`
7. `Wait`
8. `Supabase` ou webhook de retour : lire réponses, rebonds ou oppositions
9. `IF`
10. `Supabase` : mettre à jour le statut

### Règles d'arrêt

- pas plus de 5 envois qualifiés par cycle ;
- pas plus d'une relance sans réponse ;
- arrêt immédiat en cas d'opposition ;
- arrêt si le score de niche devient trop faible ;
- arrêt si le canal n'est plus défendable ;
- arrêt si le contact n'est pas suffisamment qualifié.

## 3. Données minimales avant envoi

Aucun envoi ne doit partir sans ces éléments :

- nom de la structure ;
- secteur ou mission identifiable ;
- URL publique principale ;
- hypothèse de besoin raisonnablement reliée à des signaux visibles ;
- hypothèse de valeur ou de ROI raisonnablement formulée ;
- offre TransferAI cohérente ;
- contact professionnel ou canal défendable ;
- décision IA lisible ;
- validation métier ou règle d'approbation satisfaite.

## 4. Ce que l'assistant IA doit décider

L'assistant doit aider à décider :

- s'il y a un intérêt probable pour l'IA ;
- quel angle commercial privilégier ;
- quelle offre présenter en premier ;
- quelle formation ou quel accompagnement mettre en avant ;
- quel cas d'usage préparer pour le rendez-vous ;
- si le prospect doit être contacté maintenant, enrichi davantage ou abandonné.

## 5. Ce que l'humain doit garder

L'humain doit garder la main sur :

- les grands comptes ;
- les institutions publiques ;
- les messages sensibles ;
- le choix d'écrire à une personne physique ;
- les canaux privés ;
- la validation finale des relances.

## 6. KPI de départ

Je recommande de commencer avec peu d'indicateurs, mais utiles :

- nombre de nouvelles structures qualifiées par semaine ;
- nombre de prospects approuvés pour contact ;
- nombre d'envois réellement effectués ;
- taux de réponse ;
- taux d'opposition ;
- taux de rendez-vous obtenus ;
- taux d'arrêt avant envoi ;
- secteurs les plus réactifs ;
- offres les plus pertinentes par segment.

## 7. Position finale

La version V1 doit rester simple :

- un petit nombre de sources publiques ;
- une CRM propre ;
- un assistant IA très encadré ;
- des stop rules claires ;
- une validation humaine sur les cas sensibles ;
- et une logique de qualité avant volume.

La bonne promesse n'est donc pas :

**envoyer plus**

mais :

**mieux cibler, mieux préparer et envoyer seulement quand cela a du sens.**
