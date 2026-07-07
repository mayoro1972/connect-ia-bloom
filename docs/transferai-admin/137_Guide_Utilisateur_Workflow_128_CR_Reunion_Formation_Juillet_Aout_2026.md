# Guide utilisateur - Workflow 128 CR Reunion International OpenAI Sanitized

## Fichier source

- Workflow principal : [128_n8n_CR_Reunion_International_OpenAI_Sanitized_V1.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/128_n8n_CR_Reunion_International_OpenAI_Sanitized_V1.json)

## Objectif

Ce workflow permet de :

- recevoir un enregistrement de reunion depuis un upload manuel, Google Drive, Zoom, Webex, Teams ou un dictaphone
- decouper et transcrire l'audio
- pseudonymiser localement les donnees sensibles avant appel IA
- generer un compte rendu et/ou un email client sanitise
- envoyer un apercu au validateur
- envoyer la version finale au destinataire apres validation humaine

## Cas d'usage recommande - Usage elargi international

### Scenario metier

Le workflow 128 peut etre utilise pour plusieurs contextes sensibles :

- session de formation IA
- organisation internationale presente en Cote d'Ivoire
- chancellerie
- ambassade
- institution publique ou projet multi-pays

Les reunions peuvent etre enregistrees via :

- Zoom cloud recording
- Webex recording
- Microsoft Teams recording
- dictaphone
- smartphone
- salle de reunion avec export audio

Le besoin est de produire rapidement :

- un compte rendu de reunion
- un email de suivi client
- une version sanitisee exploitable avec des donnees confidentielles masquees
- un livrable final en `Francais`, `Anglais` ou `Espagnol`

### Exemple concret

Une reunion de coordination entre une organisation internationale et ses parties prenantes locales est enregistree sur Teams.

Le fichier ou le lien est depose dans le flux d'ingestion, puis le workflow :

1. recupere l'audio
2. decoupe l'audio si necessaire
3. transcrit avec OpenAI
4. pseudonymise localement noms, emails, numeros et identifiants
5. fabrique un rapport interne et un livrable externe sanitise
6. envoie un email de validation a l'equipe TransferAI
7. envoie le livrable final au client une fois approuve

## Architecture du workflow

Le workflow 128 est le moteur central de traitement.

Il suit 8 blocs :

1. entree du recording
2. normalisation des metadonnees
3. recuperation ou reception de l'audio
4. decoupage audio
5. transcription OpenAI
6. pseudonymisation locale
7. generation IA du rapport sanitise
8. validation humaine puis envoi final

## Modes d'entree supportes

### Mode 1 - Upload manuel

Utiliser le formulaire n8n si l'utilisateur a :

- un fichier `.m4a`
- un fichier `.mp3`
- un export smartphone
- un export dictaphone

### Mode 2 - Google Drive

Utiliser le champ lien Drive ou le dossier surveille si :

- le fichier est deja stocke dans Google Drive
- une assistante depose tous les recordings dans un dossier unique

### Mode 3 - Webhook plateforme meeting

Utiliser le webhook `cr-intl-source-ingest` si :

- Zoom, Webex ou Teams livre le recording a un workflow amont
- un autre workflow telecharge le recording puis appelle ce workflow central

## Pre-requis techniques

Avant import et activation, verifier les elements suivants dans n8n.

### 1. Variables d'environnement

Definir :

- `OPENAI_API_KEY`
- `RESEND_API_KEY`

Option recommandee :

- `OPENAI_MODEL_REPORT = gpt-5`

Note :

- si `gpt-5` n'est pas disponible sur votre compte, remplacer dans le noeud `OpenAI - Rapport structure sanitise` par `gpt-4.1` ou `gpt-4o`

### 2. Services externes

Verifier :

- Google Drive OAuth connecte
- Resend operationnel
- service de decoupage audio disponible sur `http://n8n-pxlk-audio-splitter-1:8000/split`

### 3. Dossier Google Drive

Le workflow utilise :

- un dossier surveille pour les nouveaux enregistrements
- un dossier d'archive pour les versions sanitisees finales

## Configuration pas a pas

## Etape 1 - Importer le workflow

Dans n8n :

1. ouvrir `Workflows`
2. cliquer sur `Import from file`
3. selectionner [128_n8n_CR_Reunion_International_OpenAI_Sanitized_V1.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/128_n8n_CR_Reunion_International_OpenAI_Sanitized_V1.json)
4. enregistrer le workflow

## Etape 2 - Verifier les entrees

Le workflow a 3 points d'entree :

- `Formulaire - Audio sensible`
- `Google Drive - Nouveau fichier audio`
- `Webhook - Ingestion plateforme meeting`

Usage recommande :

- phase pilote : commencer avec `Formulaire - Audio sensible`
- exploitation quotidienne : utiliser `Google Drive - Nouveau fichier audio`
- connexion avancee Zoom / Teams / Webex : utiliser `Webhook - Ingestion plateforme meeting`

## Etape 3 - Configurer le formulaire

Verifier dans le noeud `Formulaire - Audio sensible` les champs suivants :

- `Sujet de la reunion`
- `Participants (separes par virgule)`
- `Date de la reunion`
- `Source de l'enregistrement`
- `Mode d'ingestion`
- `Fichier audio`
- `Ou lien Google Drive`
- `URL directe du recording (optionnel)`
- `Reference meeting / join URL`
- `Objet source / dossier source`
- `Email destinataire final`
- `Email validateur`
- `Langue audio`
- `Langue de sortie`
- `Livrable demande`
- `Entites sensibles a masquer`
- `Niveau de masquage`

Recommandation generique :

- `Livrable demande` = `Les deux`
- `Niveau de masquage` = `Strict`
- `Langue de sortie` = `Francais`, `Anglais` ou `Espagnol`

## Etape 4 - Configurer le dossier Google Drive surveille

Dans le noeud `Google Drive - Nouveau fichier audio` :

1. verifier le credential Google Drive
2. verifier l'ID du dossier `folderToWatch`
3. confirmer le mode `fileCreated`

Usage conseille :

- creer un dossier du type `TransferAI / Recordings / Reunions Internationales`
- demander aux animateurs ou assistants de deposer tous les fichiers dans ce dossier

## Etape 5 - Configurer le dossier d'archive

Dans le noeud `Archiver version sanitisee` :

1. verifier le credential Google Drive
2. verifier l'ID du dossier `folderId`
3. tester l'ecriture d'un fichier HTML archive

Bonne pratique :

- separer le dossier source et le dossier archive
- ne jamais archiver la version interne reidentifiee dans un dossier partage client

## Etape 6 - Configurer l'envoi email

Le workflow utilise Resend pour :

- envoyer l'aperçu au validateur
- envoyer le livrable final au destinataire

Verifier les noeuds :

- `Envoyer au validateur`
- `Envoyer livrable final sanitise`

A controler :

- `RESEND_API_KEY`
- domaine expediteur autorise
- adresse `from`

## Etape 7 - Configurer OpenAI

Verifier les noeuds :

- `OpenAI - Transcrire segment`
- `OpenAI - Rapport structure sanitise`

Configuration attendue :

- transcription audio via `gpt-4o-transcribe`
- generation du rapport via `Responses API`
- `store: false`
- pseudonymisation deja faite avant l'appel IA

## Etape 8 - Configurer les webhooks de validation

Verifier les noeuds :

- `Webhook - Approuver`
- `Webhook - Rejeter`

Le validateur recoit un email avec deux liens :

- validation
- rejet

Le workflow est deja prepare avec le domaine :

- `https://n8n-pxlk.srv1480638.hstgr.cloud/webhook`

Verifier que ce domaine reste le bon en production.

## Etape 9 - Tester le workflow avec un cas simple

Test recommande :

1. lancer le formulaire
2. uploader un `.m4a` court de 2 a 5 minutes
3. renseigner :
   - sujet
   - participants
   - email destinataire
   - email validateur
4. lancer le workflow
5. verifier :
   - reception de l'aperçu
   - clic sur `Approuver`
   - envoi final
   - archive HTML
   - coherence de la langue de sortie choisie (`Francais`, `Anglais` ou `Espagnol`)

## Configuration des sources de reunion

## A. Dictaphone

### Mode simple

1. exporter le fichier en `.m4a` ou `.mp3`
2. uploader via le formulaire

### Mode semi-automatique

1. synchroniser le dictaphone ou le smartphone vers un dossier Drive
2. laisser le trigger Google Drive lancer le workflow

## B. Zoom

### Recommandation d'architecture

Ne pas brancher le workflow 128 directement au poste utilisateur.

Faire :

1. activer `Cloud Recording` dans Zoom
2. activer le webhook Zoom `recording.completed`
3. faire telecharger le recording par un workflow amont
4. soit deposer le fichier dans Google Drive
5. soit appeler `Webhook - Ingestion plateforme meeting` avec :
   - `source_system = zoom`
   - `source_label = Zoom`
   - `meeting_title`
   - `meeting_date`
   - `recording_url` ou fichier binaire
   - `participants`
   - `email_destinataire`
   - `email_validateur`

### Si tu veux une connexion totale

Il faut un workflow Zoom d'ingestion separe qui :

1. recoit l'evenement Zoom
2. verifie la signature
3. recupere les metadonnees
4. telecharge l'audio ou la video
5. appelle le webhook `cr-intl-source-ingest`

## C. Microsoft Teams

### Recommandation d'architecture

Teams stocke les recordings dans :

- OneDrive
- SharePoint

Le bon schema est :

1. Teams termine la reunion
2. le recording est produit dans OneDrive ou SharePoint
3. un workflow Graph ou OneDrive recupere le fichier
4. il appelle `cr-intl-source-ingest` ou copie le fichier vers Google Drive

### Donnees a transmettre au workflow 128

- `source_system = teams`
- `source_label = Teams`
- `meeting_title`
- `meeting_date`
- `join_web_url` ou `meeting_reference`
- `recording_url` ou binaire
- `participants`
- `email_destinataire`
- `email_validateur`

## D. Webex

### Recommandation d'architecture

1. activer les recordings Webex
2. utiliser l'API Recordings ou un webhook amont
3. telecharger le fichier
4. appeler `cr-intl-source-ingest`

### Donnees a transmettre

- `source_system = webex`
- `source_label = Webex`
- `meeting_title`
- `meeting_date`
- `recording_id`
- `recording_url` ou binaire
- `participants`
- `email_destinataire`
- `email_validateur`

## Structure attendue pour le webhook d'ingestion

Le webhook `cr-intl-source-ingest` accepte idealement :

```json
{
  "source_system": "teams",
  "source_label": "Teams",
  "recording_delivery": "Webhook plateforme",
  "meeting_title": "Coordination projet regional - reunion de suivi",
  "meeting_date": "2026-08-12",
  "participants": "Client A, Client B, TransferAI",
  "email_destinataire": "client@example.com",
  "email_validateur": "manager@transferai.ci",
  "langue_code": "fr",
  "langue_sortie": "Espagnol",
  "livrable": "Les deux",
  "niveau_masquage": "Strict",
  "meeting_reference": "https://teams.microsoft.com/l/meetup-join/...",
  "source_object": "recording-12345",
  "recording_url": "https://...",
  "entites_sensibles": "Nom Client, Projet Phoenix, Compte 7781"
}
```

Et si possible, le workflow amont transmet directement le binaire audio dans le payload n8n.

## Parametrage recommande pour un usage international recurrent

### Nom de dossier source

- `Recordings - Meetings International`

### Nom de dossier archive

- `Sanitized Archives - Meetings International`

### Sujet type

- `Mission de coordination - Cadrage`
- `Mission de coordination - Suivi`
- `Mission de coordination - Restitution`

### Mode d'exploitation recommande

- phase 1 : upload manuel + dossier Drive
- phase 2 : Teams ou Zoom via webhook amont
- phase 3 : standardisation multi-plateforme + sorties multilingues

## Lecture node par node

### Entree

- `Formulaire - Audio sensible`
- `Google Drive - Nouveau fichier audio`
- `Webhook - Ingestion plateforme meeting`

### Normalisation

- `Normaliser les donnees`
- `Upload ou Drive ?`

### Preparation audio

- `Telecharger audio Drive`
- `Decouper audio upload`
- `Decouper audio Drive`
- `Extraire segments audio`

### IA

- `OpenAI - Transcrire segment`
- `Fusionner transcription`
- `Pseudonymiser localement`
- `OpenAI - Rapport structure sanitise`
- `Parser sortie OpenAI`
- `Reidentifier version interne`

### Validation et livraison

- `Construire pack validation`
- `Envoyer au validateur`
- `Webhook - Approuver`
- `Webhook - Rejeter`
- `Charger session validee`
- `Envoyer livrable final sanitise`
- `Preparer archive HTML`
- `Archiver version sanitisee`

## Checklist d'activation

Avant passage en production, verifier :

- le workflow s'importe sans erreur
- Google Drive est connecte
- Resend est connecte
- OpenAI est connecte
- le service de decoupage audio repond
- le validateur recoit l'aperçu
- l'archive HTML est bien creee
- aucune version reidentifiee n'est envoyee au client
- les livrables finals sortent integralement dans la langue cible choisie

## Limites actuelles

Le workflow 128 est un coeur de traitement.

Il ne fait pas encore a lui seul :

- l'authentification native Zoom
- l'authentification native Webex
- l'authentification native Microsoft Graph
- le telechargement automatique depuis chaque plateforme

Pour une connexion totalement automatisee, il faut ajouter des workflows d'ingestion separes par source.

## Recommandation finale

Pour un deploiement progressif aupres de clients internationaux, organisations internationales, chancelleries et ambassades :

1. utiliser tout de suite le workflow 128 en mode `upload manuel + Google Drive`
2. valider le process metier, la qualite des rapports et la coherence des sorties `Francais / Anglais / Espagnol`
3. dans un second temps, ajouter 3 workflows d'ingestion dedies :
   - Zoom
   - Teams
   - Webex

Cela donne un demarrage rapide, stable et compatible avec la confidentialite client.
