# Tableau complet du workflow Google Forms prospects TransferAI - version opérationnelle

Workflow de référence :

- `TransferAI Google Forms Social Lead Sequence V2 Clean Importable`
- Version documentée : état opérationnel validé au `23/06/2026`

Date du document :

- `23 juin 2026`

## 1. Objet

Ce document présente le tableau complet du workflow Google Forms prospects dans sa version opérationnelle, c’est-à-dire la version réellement utilisée et validée après les correctifs et sécurisations réalisés entre le `19/06/2026` et le `23/06/2026`.

Il sert à :

- visualiser toute la chaîne de traitement de bout en bout ;
- comprendre le rôle précis de chaque nœud ;
- distinguer la branche prospect de la branche alerte interne ;
- identifier les contrôles anti-doublon ;
- faciliter l’exploitation quotidienne et la reprise du workflow.

## 2. Résultat opérationnel obtenu

À ce stade, le système permet de :

1. capter une réponse Google Forms via Google Sheets et Apps Script ;
2. créer ou mettre à jour un prospect dans Supabase ;
3. envoyer automatiquement le mail 1 au prospect ;
4. envoyer une alerte interne à `contact@transferai.ci` ;
5. empêcher les doublons côté prospect ;
6. empêcher les doublons côté alerte admin ;
7. préparer la logique des relances futures ;
8. historiser les envois dans le CRM opérationnel.

## 3. Vue d’ensemble des branches

Le workflow est organisé en quatre blocs :

1. `Entrée et configuration`
2. `Branche nouveau prospect`
3. `Branche relance / suivi`
4. `Branche alerte interne admin`

## 4. Tableau complet du workflow opérationnel

## 4.1 Entrée et configuration

| Ordre | Nœud | Type | Branche | Rôle opérationnel | Entrée principale | Sortie attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `Manual Trigger` | Trigger | Test | Lance des essais manuels du workflow | Exécution manuelle | Déclenche le flux pour contrôle | Actif pour tests |
| 2 | `Hourly Social Follow-Up Schedule` | Schedule Trigger | Relance | Déclenche les relances programmées | Heure planifiée | Envoie les prospects à relancer | Actif |
| 3 | `Google Forms Social Lead Webhook` | Webhook | Nouveau prospect | Reçoit le payload Apps Script venant de Google Sheets | Réponse Google Forms transmise par Apps Script | Payload brut du prospect | Actif en production |
| 4 | `Set Social Sequence Config` | Set | Configuration | Charge les variables métier du workflow | Déclencheur entrant | Paramètres normalisés de séquence | Actif |
| 5 | `If New Lead Payload` | If | Routage | Distingue un nouveau prospect d’une relance horaire | Payload entrant | Aiguillage vers branche nouveau lead ou branche suivi | Actif |

## 4.2 Branche relance / suivi

| Ordre | Nœud | Type | Branche | Rôle opérationnel | Entrée principale | Sortie attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 6 | `Fetch Social Prospect Snapshot` | HTTP Request | Relance | Récupère l’état du prospect dans Supabase | Déclenchement horaire | Données CRM actuelles du prospect | Actif |
| 7 | `Build Due Social Follow-Ups` | Code | Relance | Construit la liste des prospects à relancer selon les dates et statuts | Snapshot Supabase | Prospect(s) éligibles à une relance | Actif |

## 4.3 Branche nouveau prospect

| Ordre | Nœud | Type | Branche | Rôle opérationnel | Entrée principale | Sortie attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 8 | `Normalize Google Forms Lead` | Code | Nouveau prospect | Nettoie et normalise les réponses Google Forms | Payload webhook | Structure de données homogène | Actif |
| 9 | `Prepare Social Prospect Record` | Code | Nouveau prospect | Prépare l’enregistrement CRM à écrire dans Supabase | Lead normalisé | Objet prospect prêt pour upsert | Actif |
| 10 | `Upsert Social Prospect Into CRM` | HTTP Request | Nouveau prospect | Crée ou met à jour le prospect dans Supabase | Record prospect préparé | Prospect stocké ou mis à jour | Actif |
| 11 | `Build Immediate Social Send Context` | Code | Nouveau prospect | Prépare le contexte d’envoi immédiat du mail prospect | Prospect CRM | Contexte d’email 1 immédiat | Actif |

## 4.4 Porte d’entrée commune vers l’envoi prospect

| Ordre | Nœud | Type | Branche | Rôle opérationnel | Entrée principale | Sortie attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 12 | `If Social Lead Ready To Send` | If | Prospect | Vérifie si le prospect est prêt à recevoir un email | Contexte immédiat ou relance programmée | Prospect autorisé à entrer dans la séquence | Actif |
| 13 | `Build Social Sequence Email` | Code | Prospect | Génère le contenu du mail selon le type de formulaire et l’étape | Prospect prêt à envoyer | Sujet, HTML et métadonnées du mail | Actif |
| 14 | `Build Social Sent Guard` | Code | Prospect | Détermine si l’étape email concernée a déjà été envoyée | Données prospect + état CRM | Drapeau anti-doublon et champ d’horodatage ciblé | Actif |
| 15 | `If Social Send Allowed` | If | Prospect | Bloque l’envoi si le mail de cette étape a déjà été envoyé | Guard prospect | Aiguillage vrai ou faux | Actif |

## 4.5 Envoi prospect et journalisation

| Ordre | Nœud | Type | Branche | Rôle opérationnel | Entrée principale | Sortie attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 16 | `Send Social Sequence Email` | HTTP Request | Prospect | Envoie l’email prospect via Resend | Email généré et autorisé | Identifiant Resend de l’envoi | Actif |
| 17 | `Parse Social Send Result` | Code | Prospect | Analyse la réponse de l’envoi email | Réponse Resend | Résultat exploitable pour la suite | Actif |
| 18 | `Build Social Send Result` | Code | Prospect | Construit les champs CRM après envoi réussi | Résultat parse + état du prospect | Horodatage du bon email et statut de séquence | Actif |
| 19 | `If Social Email Sent` | If | Prospect | Vérifie que l’envoi prospect est bien confirmé | Résultat d’envoi prospect | Branche succès ou échec | Actif |
| 20 | `Log Social Outreach Attempt` | HTTP Request | Prospect | Enregistre la tentative d’outreach dans Supabase | Envoi confirmé | Log d’activité CRM | Actif |
| 21 | `Update Prospect After Social Send` | HTTP Request | Prospect | Met à jour le prospect après succès d’envoi | Résultat enrichi | CRM mis à jour avec statut, horodatage et suite | Actif |
| 22 | `Update Prospect Social Failure` | HTTP Request | Prospect | Met à jour le prospect en cas d’échec d’envoi | Branche échec | CRM mis à jour avec signal d’échec | Actif |

## 4.6 Branche alerte interne admin

| Ordre | Nœud | Type | Branche | Rôle opérationnel | Entrée principale | Sortie attendue | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 23 | `Build Admin Lead Alert Context` | Code | Admin | Prépare les informations à envoyer à l’équipe interne | Prospect CRM | Contexte complet d’alerte admin | Actif |
| 24 | `If Admin Alert Eligible` | If | Admin | Vérifie qu’une alerte interne doit être générée | Contexte admin | Branche éligible ou non | Actif |
| 25 | `Build Admin Lead Alert Email` | Code | Admin | Génère le sujet et le contenu du mail admin | Prospect éligible | Email interne prêt à envoyer | Actif |
| 26 | `Build Admin Alert Guard` | Code | Admin | Vérifie si une alerte admin a déjà été envoyée | Prospect + CRM | Drapeau anti-doublon admin | Actif |
| 27 | `If Admin Alert Allowed` | If | Admin | Autorise ou bloque l’envoi admin selon l’historique | Guard admin | Branche vraie ou fausse | Actif |
| 28 | `Send Admin Lead Alert` | HTTP Request | Admin | Envoie l’alerte à `contact@transferai.ci` via Resend | Email admin autorisé | Identifiant Resend admin | Actif |
| 29 | `Build Admin Alert Send Result` | Code | Admin | Construit les champs de retour après envoi admin | Réponse Resend admin | Horodatage admin et identifiant de message | Actif |
| 30 | `Update Prospect After Admin Alert` | HTTP Request | Admin | Met à jour le prospect après alerte admin envoyée | Résultat admin | `admin_alert_sent_at` et traçabilité mis à jour | Actif |

## 5. Colonnes opérationnelles de contrôle en base

Les colonnes de protection et de suivi suivantes sont utilisées dans Supabase :

- `admin_alert_sent_at`
- `social_email_1_sent_at`
- `social_email_2_sent_at`
- `social_email_3_sent_at`
- `last_sequence_result`
- `last_response_status`
- `next_action_at`
- `niche_status`
- `outreach_attempt_count`

## 6. Règles opérationnelles déjà en place

Les règles validées à ce jour sont les suivantes :

1. un seul point d’entrée Apps Script actif doit pousser les réponses vers n8n ;
2. un mail prospect déjà envoyé à une étape donnée ne doit pas être renvoyé ;
3. une alerte admin déjà envoyée ne doit pas être renvoyée ;
4. le mail prospect et l’alerte admin doivent rester sur deux circuits séparés ;
5. le lien de rendez-vous utilisé dans les communications est :
   - `https://calendly.com/contact-transferai/30min`

## 7. Lecture rapide pour exploitation

Pour contrôler rapidement si le workflow fonctionne, il faut vérifier :

1. qu’une nouvelle exécution apparaît dans `Executions` ;
2. que la branche prospect passe par `If Social Send Allowed` puis `Send Social Sequence Email` ;
3. que la branche admin passe par `If Admin Alert Allowed` puis `Send Admin Lead Alert` ;
4. que les mises à jour Supabase s’exécutent après les envois ;
5. que les champs `admin_alert_sent_at` et `social_email_X_sent_at` sont bien alimentés selon le cas.

## 8. Limites connues au 23/06/2026

Les éléments suivants sont préparés mais restent à étendre ou à finaliser :

- industrialisation complète du `mail 2` ;
- industrialisation complète du `mail 3` ;
- logique d’arrêt automatique en cas de réponse prospect détectée ;
- enrichissement du scoring métier ;
- tableau de bord d’exploitation consolidé.

## 9. Conclusion opérationnelle

Au `23 juin 2026`, le workflow Google Forms prospects TransferAI est opérationnel pour :

- capter les leads ;
- les écrire dans le CRM ;
- envoyer le mail 1 au prospect ;
- envoyer l’alerte admin ;
- éviter les doublons les plus critiques ;
- préparer l’extension vers les relances automatiques suivantes.
