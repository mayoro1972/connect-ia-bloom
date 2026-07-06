# Guide utilisateur - Workflow 143

Traduction internationale securisee avec PII, pseudonymisation locale, relecture qualite et gouvernance humaine

| Element | Configuration |
|---|---|
| Public cible | Organisations internationales, sommets, reunions sensibles, cabinets, institutions |
| Workflow | `143_n8n_Traduction_Officielle_Internationale_PII_Revamp_06juillet2026.json` |
| Mode securite | Detection PII, pseudonymisation locale, payload minimal LLM, purge |
| Decision critique | Validation humaine requise pour documents a sensibilite elevee |

## 1. Objet du guide

Ce document presente le workflow 143 de TransferAI pour la traduction internationale de documents sensibles. Il a ete concu pour les organisations internationales, institutions publiques, cabinets, directions generales, ambassades, ONG, agences onusiennes et equipes evenementielles qui manipulent des contenus officiels ou confidentiels.

Le workflow met en oeuvre une logique security-by-design : detection PII, anonymisation selective, pseudonymisation locale, envoi minimal au modele, reidentification uniquement dans n8n, puis validation humaine pour les cas a risque eleve.

## 2. Cas d'usage cibles

- Traduction de dossiers de visa, passeports, actes, notes verbales, invitations officielles, lettres administratives et documents de conformite.

- Traduction de documents de sommet international, reunion bilaterale, atelier regional, conference de presse, protocole et compte rendu sensible.

- Traduction d'accords, projets de contrat, memos, notes diplomatiques, supports de mission et pieces documentaires devant circuler entre plusieurs langues.

## 3. Principes de protection appliques

- Minimisation des donnees : seules les informations strictement necessaires a la traduction sont transmises au modele.

- Pseudonymisation locale : les identifiants directs sont remplaces par des jetons comme PERSON_001, ORG_001, EMAIL_001, REF_001 ou PASSPORT_001.

- Anonymisation contextuelle : les metadonnees accessoires ou non necessaires peuvent etre retirees ou generalisees.

- Reidentification locale uniquement : le fournisseur IA ne voit jamais les donnees reelles lorsque la pseudonymisation est active.

- Purge post-traitement : la table de correspondance sensible est detruite a la fin du traitement operationnel.

- Validation humaine : pour les visas, documents d'identite, actes d'etat civil, contenus diplomatiques et toute traduction critique, le workflow bascule en revue humaine avant diffusion.

## 4. Architecture du workflow

- Reception de la demande via webhook securise.

- Extraction des parametres et classification de sensibilite.

- Detection PII dans le texte et les champs structures.

- Pseudonymisation locale avant appel au modele.

- Traduction pseudonymisee via OpenAI.

- Relecture qualite pseudonymisee avec score et risques.

- Reidentification locale dans n8n.

- Routage automatique : envoi client direct ou envoi au validateur interne.

- Purge de la table sensible.

## 5. Champs d'entree recommandes

- `texte` ou `content` : texte a traduire.

- `langue_source` et `langue_cible` : codes courts comme `fr`, `en`, `es`, `ar`, `pt`.

- `type_document` : visa, note verbale, courrier officiel, contrat, compte rendu, etc.

- `demandeur`, `organisation`, `reference_dossier` : seulement si necessaire a l'orchestration interne.

- `email_retour` : destinataire final.

- `email_validateur` : validateur interne ou compliance officer pour les documents sensibles.

- `contexte_mission` : sommet, reunion internationale, mission terrain, immigration, protocole, cooperation, etc.

## 6. Exemple de charge utile

Exemple JSON :

```json
{
  "texte": "Nom : Fatou Diallo\nPassport No: AB1234567\nEmail: fatou.diallo@example.org\nObjet: demande de visa officiel pour le sommet regional.",
  "langue_source": "fr",
  "langue_cible": "en",
  "type_document": "Demande de visa officiel",
  "demandeur": "Fatou Diallo",
  "organisation": "Organisation regionale fictive",
  "reference_dossier": "VISA-2026-0041",
  "email_retour": "translation.office@example.org",
  "email_validateur": "compliance@example.org",
  "contexte_mission": "Sommet international"
}
```

## 7. Comportement de validation

Le workflow marque `review_required = true` dans trois cas principaux : document de sensibilite elevee, score qualite insuffisant, ou validation automatique negative.

Quand la revue est requise, le document n'est pas diffuse au client final. Il est adresse au validateur interne defini dans `email_validateur`.

Quand la revue n'est pas requise, le document bilingue est envoye directement au destinataire final via Resend.

## 8. Prerequis techniques

- Variable d'environnement `OPENAI_API_KEY` pour la traduction et la relecture.

- Variable d'environnement `RESEND_API_KEY` pour les envois email.

- Optionnel : `INTERNAL_REVIEW_EMAIL` pour definir un email de revue par defaut.

- Optionnel : `OUTREACH_FROM_EMAIL` pour l'adresse expediteur.

- Import du fichier JSON dans n8n, puis verification des credentials et tests sur un document fictif avant mise en production.

## 9. Recommandations operationnelles pour organisations internationales

- Toujours tester avec un document factice avant premier usage en production.

- Ne pas reutiliser des cles API en clair dans les noeuds ; utiliser exclusivement variables d'environnement ou credentials n8n.

- Definir une politique par type de document : visa, identite, diplomatique, legal, RH, medical, financier, media.

- Maintenir une validation humaine pour toute piece qui peut avoir un impact legal, migratoire, reputionnel ou diplomatique.

- Limiter les personnes pouvant consulter les executions n8n contenant encore des donnees reelles pendant la fenetre de traitement.

## 10. Checklist de mise en production

- Verifier que les cles API ont ete configurees hors workflow.

- Verifier que les executions n8n et les logs sont conformes a votre politique interne.

- Tester au moins un cas visa, un cas reunion internationale et un cas courrier officiel.

- Verifier la logique de routage vers `email_validateur`.

- Documenter qui peut approuver, corriger et diffuser le livrable final.

- Planifier une rotation immediate des secrets si un ancien workflow contenait des cles en dur.
