# User Guide - Workflow 128 International Meeting Report OpenAI Sanitized

## Source File

- Main workflow: [128_n8n_CR_Reunion_International_OpenAI_Sanitized_V1.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/128_n8n_CR_Reunion_International_OpenAI_Sanitized_V1.json)

## Purpose

This workflow is designed to:

- receive a meeting recording from a manual upload, Google Drive, Zoom, Webex, Teams, or a dictaphone
- split and transcribe the audio
- pseudonymize sensitive data locally before any AI call
- generate a sanitized meeting report and/or client email
- send a preview to the validator
- send the final version to the recipient after human approval

## Recommended Use Case - Broader International Use

### Business Scenario

Workflow 128 can support several sensitive contexts:

- AI training sessions
- international organizations operating in Côte d'Ivoire
- chancelleries
- embassies
- public institutions or multi-country programmes

Meetings may be recorded using:

- Zoom cloud recording
- Webex recording
- Microsoft Teams recording
- dictaphone
- smartphone
- meeting room audio export

The goal is to produce quickly:

- a meeting report
- a client follow-up email
- a sanitized version that can be shared safely when confidential data is involved
- a final deliverable in `French`, `English`, or `Spanish`

### Practical Example

A coordination meeting between an international organization and local stakeholders is recorded on Teams.

The file or link is sent into the ingestion flow, then the workflow:

1. retrieves the audio
2. splits the audio if required
3. transcribes it with OpenAI
4. pseudonymizes names, emails, phone numbers, and identifiers locally
5. creates an internal report and a sanitized external deliverable
6. sends a validation email to the TransferAI team
7. sends the final deliverable to the client once approved

## Workflow Architecture

Workflow 128 is the central processing engine.

It follows 8 stages:

1. recording intake
2. metadata normalization
3. audio retrieval or reception
4. audio splitting
5. OpenAI transcription
6. local pseudonymization
7. AI generation of the sanitized report
8. human validation and final delivery

## Supported Input Modes

### Mode 1 - Manual Upload

Use the n8n form when the user has:

- a `.m4a` file
- a `.mp3` file
- a smartphone export
- a dictaphone export

### Mode 2 - Google Drive

Use the Drive link field or the watched folder when:

- the file is already stored in Google Drive
- an assistant uploads all recordings into one shared folder

### Mode 3 - Meeting Platform Webhook

Use the `cr-intl-source-ingest` webhook when:

- Zoom, Webex, or Teams sends the recording to an upstream workflow
- another workflow downloads the recording and then calls this central workflow

## Technical Prerequisites

Before importing and activating the workflow, check the following items in n8n.

### 1. Environment Variables

Define:

- `OPENAI_API_KEY`
- `RESEND_API_KEY`

Recommended option:

- `OPENAI_MODEL_REPORT = gpt-5`

Note:

- if `gpt-5` is not available on your account, replace it in the `OpenAI - Rapport structure sanitise` node with `gpt-4.1` or `gpt-4o`

### 2. External Services

Check:

- Google Drive OAuth is connected
- Resend is operational
- the audio splitting service is available on `http://n8n-pxlk-audio-splitter-1:8000/split`

### 3. Google Drive Folders

The workflow uses:

- a watched folder for new recordings
- an archive folder for final sanitized versions

## Step-by-Step Configuration

## Step 1 - Import the Workflow

In n8n:

1. open `Workflows`
2. click `Import from file`
3. select [128_n8n_CR_Reunion_International_OpenAI_Sanitized_V1.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/128_n8n_CR_Reunion_International_OpenAI_Sanitized_V1.json)
4. save the workflow

## Step 2 - Check the Entry Points

The workflow has 3 entry points:

- `Formulaire - Audio sensible`
- `Google Drive - Nouveau fichier audio`
- `Webhook - Ingestion plateforme meeting`

Recommended usage:

- pilot phase: start with `Formulaire - Audio sensible`
- day-to-day operations: use `Google Drive - Nouveau fichier audio`
- advanced Zoom / Teams / Webex integration: use `Webhook - Ingestion plateforme meeting`

## Step 3 - Configure the Form

In the `Formulaire - Audio sensible` node, check the following fields:

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

Recommended baseline values:

- `Livrable demande` = `Les deux`
- `Niveau de masquage` = `Strict`
- `Langue de sortie` = `Francais`, `Anglais`, or `Espagnol`

## Step 4 - Configure the Watched Google Drive Folder

In the `Google Drive - Nouveau fichier audio` node:

1. check the Google Drive credential
2. check the `folderToWatch` ID
3. confirm the `fileCreated` mode

Recommended setup:

- create a folder such as `TransferAI / Recordings / International Meetings`
- ask facilitators or assistants to upload all files into that folder

## Step 5 - Configure the Archive Folder

In the `Archiver version sanitisee` node:

1. check the Google Drive credential
2. check the `folderId`
3. test writing an archived HTML file

Best practice:

- keep the source folder and the archive folder separate
- never archive the re-identified internal version in a client-shared folder

## Step 6 - Configure Email Sending

The workflow uses Resend to:

- send the preview to the validator
- send the final deliverable to the recipient

Check the following nodes:

- `Envoyer au validateur`
- `Envoyer livrable final sanitise`

Items to verify:

- `RESEND_API_KEY`
- authorized sender domain
- `from` address

## Step 7 - Configure OpenAI

Check the following nodes:

- `OpenAI - Transcrire segment`
- `OpenAI - Rapport structure sanitise`

Expected configuration:

- audio transcription via `gpt-4o-transcribe`
- report generation via the `Responses API`
- `store: false`
- pseudonymization already completed before the AI call

## Step 8 - Configure the Validation Webhooks

Check the following nodes:

- `Webhook - Approuver`
- `Webhook - Rejeter`

The validator receives an email with two links:

- approval
- rejection

The workflow is already set up with the following domain:

- `https://n8n-pxlk.srv1480638.hstgr.cloud/webhook`

Make sure this remains the correct production domain.

## Step 9 - Test the Workflow with a Simple Case

Recommended test:

1. launch the form
2. upload a short `.m4a` file of 2 to 5 minutes
3. fill in:
   - subject
   - participants
   - recipient email
   - validator email
4. run the workflow
5. verify:
   - preview received
   - click on `Approuver`
   - final email sent
   - HTML archive created
   - output language consistency in `French`, `English`, or `Spanish`

## Meeting Source Configuration

## A. Dictaphone

### Simple Mode

1. export the file as `.m4a` or `.mp3`
2. upload it through the form

### Semi-Automated Mode

1. sync the dictaphone or smartphone to a Drive folder
2. let the Google Drive trigger start the workflow

## B. Zoom

### Recommended Architecture

Do not connect workflow 128 directly to the user's workstation.

Instead:

1. enable `Cloud Recording` in Zoom
2. enable the Zoom `recording.completed` webhook
3. let an upstream workflow download the recording
4. either place the file in Google Drive
5. or call `Webhook - Ingestion plateforme meeting` with:
   - `source_system = zoom`
   - `source_label = Zoom`
   - `meeting_title`
   - `meeting_date`
   - `recording_url` or binary file
   - `participants`
   - `email_destinataire`
   - `email_validateur`

### If You Want Full End-to-End Connectivity

You need a separate Zoom ingestion workflow that:

1. receives the Zoom event
2. verifies the signature
3. retrieves the metadata
4. downloads the audio or video
5. calls the `cr-intl-source-ingest` webhook

## C. Microsoft Teams

### Recommended Architecture

Teams stores recordings in:

- OneDrive
- SharePoint

The right flow is:

1. Teams meeting ends
2. the recording is created in OneDrive or SharePoint
3. a Graph or OneDrive workflow retrieves the file
4. it calls `cr-intl-source-ingest` or copies the file into Google Drive

### Data to Send to Workflow 128

- `source_system = teams`
- `source_label = Teams`
- `meeting_title`
- `meeting_date`
- `join_web_url` or `meeting_reference`
- `recording_url` or binary file
- `participants`
- `email_destinataire`
- `email_validateur`

## D. Webex

### Recommended Architecture

1. enable Webex recordings
2. use the Recordings API or an upstream webhook
3. download the file
4. call `cr-intl-source-ingest`

### Data to Send

- `source_system = webex`
- `source_label = Webex`
- `meeting_title`
- `meeting_date`
- `recording_id`
- `recording_url` or binary file
- `participants`
- `email_destinataire`
- `email_validateur`

## Expected Structure for the Ingestion Webhook

The `cr-intl-source-ingest` webhook should ideally accept:

```json
{
  "source_system": "teams",
  "source_label": "Teams",
  "recording_delivery": "Meeting platform webhook",
  "meeting_title": "Regional coordination project - follow-up meeting",
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
  "entites_sensibles": "Client Name, Phoenix Project, Account 7781"
}
```

If possible, the upstream workflow should send the audio binary directly in the n8n payload.

## Recommended Settings for Recurring International Use

### Source Folder Name

- `Recordings - International Meetings`

### Archive Folder Name

- `Sanitized Archives - International Meetings`

### Typical Subject Lines

- `Coordination mission - Scoping`
- `Coordination mission - Follow-up`
- `Coordination mission - Debrief`

### Recommended Operating Mode

- phase 1: manual upload + Drive folder
- phase 2: Teams or Zoom via upstream webhook
- phase 3: multi-platform standardization + multilingual outputs

## Node-by-Node Reading Guide

### Intake

- `Formulaire - Audio sensible`
- `Google Drive - Nouveau fichier audio`
- `Webhook - Ingestion plateforme meeting`

### Normalization

- `Normaliser les donnees`
- `Upload ou Drive ?`

### Audio Preparation

- `Telecharger audio Drive`
- `Decouper audio upload`
- `Decouper audio Drive`
- `Extraire segments audio`

### AI

- `OpenAI - Transcrire segment`
- `Fusionner transcription`
- `Pseudonymiser localement`
- `OpenAI - Rapport structure sanitise`
- `Parser sortie OpenAI`
- `Reidentifier version interne`

### Validation and Delivery

- `Construire pack validation`
- `Envoyer au validateur`
- `Webhook - Approuver`
- `Webhook - Rejeter`
- `Charger session validee`
- `Envoyer livrable final sanitise`
- `Preparer archive HTML`
- `Archiver version sanitisee`

## Go-Live Checklist

Before moving to production, verify:

- the workflow imports without error
- Google Drive is connected
- Resend is connected
- OpenAI is connected
- the audio splitting service responds
- the validator receives the preview
- the HTML archive is created correctly
- no re-identified version is ever sent to the client
- final deliverables are fully generated in the selected target language

## Current Limitations

Workflow 128 is a core processing engine.

It does not yet handle on its own:

- native Zoom authentication
- native Webex authentication
- native Microsoft Graph authentication
- automatic download from each source platform

For fully automated connectivity, you need separate ingestion workflows for each source.

## Final Recommendation

For progressive deployment with international clients, international organizations, chancelleries, and embassies:

1. start immediately with workflow 128 in `manual upload + Google Drive` mode
2. validate the business process, report quality, and `French / English / Spanish` output consistency
3. then add 3 dedicated ingestion workflows:
   - Zoom
   - Teams
   - Webex

This provides a fast, stable rollout that remains compatible with client confidentiality requirements.
