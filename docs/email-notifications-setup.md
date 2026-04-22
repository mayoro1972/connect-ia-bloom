# Notifications email prospects

Ce projet envoie des emails depuis la fonction Supabase `send-prospect-emails`.

## Adresse de destination

- Boite commerciale principale : `contact@transferai.ci`
- Reponse au prospect : expediee avec `reply-to: contact@transferai.ci`

## Variables a configurer cote Supabase

Definir les secrets suivants avant mise en production :

```bash
supabase secrets set RESEND_API_KEY=your_key_here
supabase secrets set MAIL_FROM="TransferAI Africa <contact@transferai.ci>"
supabase secrets set MAIL_TO="contact@transferai.ci"
```

Important :

- le domaine `transferai.ci` doit etre verifie chez le fournisseur email choisi
- `MAIL_FROM` doit correspondre a une adresse autorisee par ce fournisseur
- si le calendrier final n'est pas encore connecte, la page RDV ouvre un email pre-rempli vers `contact@transferai.ci`
- le frontend Vite doit utiliser la cle `anon` JWT du projet dans `VITE_SUPABASE_PUBLISHABLE_KEY`, sinon l'appel a `send-prospect-emails` peut echouer depuis le navigateur

## Fonction concernee

- `supabase/functions/send-prospect-emails/index.ts`
- `supabase/functions/process-prospect-followups/index.ts`

## Suivi automatique du formulaire d'audit

Le probleme d'envoi differe du formulaire d'audit est regle pour les prochains prospects.

Il n'est pas necessaire de faire un push ou un declenchement manuel a chaque nouvelle demande. Le cron Supabase `transferai-audit-followups` est actif toutes les 5 minutes et appelle automatiquement la fonction `process-prospect-followups`.

Flux attendu :

1. Le prospect demande l'audit.
2. Il recoit l'accuse de reception immediatement.
3. La demande est mise en attente avec une echeance a environ 30 minutes.
4. Le cron passe toutes les 5 minutes.
5. Des que l'echeance est atteinte, l'email d'acces au portail securise est envoye automatiquement.

En pratique, l'email peut partir autour de 30 a 35 minutes apres la demande, selon le passage du cron.

Apres correction et verification, aucun suivi audit n'etait en retard ni en echec.

## Langue des emails

- si l'utilisateur navigue en `FR`, l'email interne et l'accuse de reception sont envoyes en francais
- si l'utilisateur navigue en `EN`, l'email interne et l'accuse de reception sont envoyes en anglais
- la langue est transmise par le frontend dans `payload.language`

## Modeles standards

### 1. Accuse de reception prospect

Objet :

`Nous avons bien recu votre demande - TransferAI Africa`

Exemple :

```text
Bonjour Aminata Kone,

Nous confirmons la bonne reception de votre demande de catalogue. Notre equipe va l'etudier et vous repondra depuis contact@transferai.ci dans les meilleurs delais.

Si votre demande concerne un rendez-vous, un devis ou une orientation formation, nous pourrons vous recontacter afin de preciser votre besoin avant l'etape suivante.

Recapitulatif de votre demande :
Type : Demande de catalogue
Domaine : Ressources Humaines
Formation : Non precise
Organisation : Nova Talent Cote d'Ivoire

Merci pour votre confiance,
TransferAI Africa
```

### 2. Email interne recu par l'equipe

Objet :

`[TransferAI] Demande de devis - Finance & Comptabilite`

Exemple :

```text
Nouvelle demande : Demande de devis
Nom : Jean-Marc Bamba
Email : jm.bamba@finaxis-group.com
Telephone : +2250500000000
Organisation : Finaxis Group
Fonction : Directeur Administratif et Financier
Ville / Pays : Abidjan, Cote d'Ivoire
Domaine : Finance & Comptabilite
Formation : Non precise
Participants : 12
Format : presentiel
Echeance : Avant fin de mois
Source : /contact

Message du prospect :
Merci de nous adresser une proposition pour une session intra-entreprise sur le domaine Finance & Comptabilite, avec un focus sur l'audit augmente par l'IA et le reporting automatise.
```

### 3. Accuse de reception inscription

Objet :

`Nous avons bien recu votre demande - TransferAI Africa`

Exemple :

```text
Bonjour Mariam Coulibaly,

Nous confirmons la bonne reception de votre inscription a une formation. Notre equipe va l'etudier et vous repondra depuis contact@transferai.ci dans les meilleurs delais.

Recapitulatif de votre demande :
Type : Inscription a une formation
Domaine : Non precise
Formation : ChatGPT pour les RH
Organisation : Orange CI

Merci pour votre confiance,
TransferAI Africa
```

### 4. Demande de prise de RDV

Objet :

`Demande de prise de RDV - Organisation - TransferAI`

Exemple :

```text
Bonjour TransferAI Africa,

Je souhaite reserver un rendez-vous de cadrage.

Source de la demande : Demande de renseignement
Nom : Lina Mensah
Organisation : BrandWorks Africa
Domaine : Marketing & Communication

Merci de me proposer un creneau ou de me recontacter par email.

Cordialement,
```
