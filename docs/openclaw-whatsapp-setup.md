# OpenClaw WhatsApp Setup For TransferAI Africa

This project now includes a ready-to-adapt prompt and a public WhatsApp example config for OpenClaw:

- `openclaw/TRANSFERAI_AGENT.md`
- `openclaw/openclaw.whatsapp.public.example.jsonc`

## Goal

Allow any prospect to start a conversation with the TransferAI Africa AI assistant directly from WhatsApp on mobile.

## Contact details wired into the site

- Email: `contact@transferai.ci`
- Phone / WhatsApp: `+225071657733990`
- Address: `Nettelecomci, Residence de la Paix, Riviera 3, carrefour Sainte Famille, Abidjan, Cote d'Ivoire`

## Recommended deployment flow

1. Prepare a dedicated WhatsApp number for the assistant.
2. Install OpenClaw on the host that will run the agent.
3. Add your model/API credentials in OpenClaw.
4. Enable the WhatsApp channel in OpenClaw.
5. Scan the QR code from the WhatsApp account tied to the business number.
6. Load the TransferAI prompt from `openclaw/TRANSFERAI_AGENT.md`.
7. Start with direct messages only.
8. Test from 2 or 3 real mobile numbers before public launch.

## Important safety notes

- OpenClaw's own documentation recommends using a dedicated WhatsApp number.
- OpenClaw also recommends explicitly controlling `channels.whatsapp.allowFrom`, especially on a personal machine.
- The public example config in this repo uses `allowFrom: ["*"]` only because the target use case here is a public-facing assistant.
- For a safer launch, replace `["*"]` with a limited allowlist first.

## Suggested first production scope

- direct messages only
- no group conversations
- catalogue orientation
- quote qualification
- meeting handoff
- no command execution
- no file-writing actions

## What is already done in this repo

- the public WhatsApp number is now exposed in the site contact flows
- the contact email has been updated
- the Nettelecom-compatible address has been added with a Google Maps link
- the AI assistant prompt has been drafted for TransferAI Africa

## What still must be done manually outside this repo

- install and run OpenClaw on your host
- connect the real WhatsApp number by QR code
- add the final model credentials
- validate the final WhatsApp access policy

## Suggested launch test cases

1. "Bonjour, je cherche une formation IA pour les RH."
2. "Je veux le catalogue Marketing & Communication."
3. "Nous sommes 20 personnes et nous voulons un devis."
4. "Je ne sais pas quelle formation choisir."
5. "Je veux prendre rendez-vous."
