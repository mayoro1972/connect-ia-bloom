# Guide premium client — Workflow 143

Traduction internationale sécurisée, installation pas à pas, gouvernance des données sensibles et argumentaire de présentation

| Élément | Information essentielle |
|---|---|
| Nom du workflow | Workflow 143 — traduction officielle internationale sécurisée |
| Public cible | Organisations internationales, sommets, ambassades, institutions, cabinets, ONG |
| Objectif | Traduire des documents importants sans exposer inutilement les données sensibles |
| Décision clé | Validation humaine obligatoire ou fortement recommandée selon la sensibilité du document |

## 1. Résumé exécutif

Le workflow 143 a été conçu pour permettre à TransferAI de traiter des traductions internationales sensibles dans un cadre beaucoup plus sûr qu’un flux classique envoyé en clair à un modèle d’IA.

Il répond à un besoin très concret : traduire vite, bien et de manière professionnelle, tout en réduisant l’exposition des noms, numéros de dossier, identifiants, adresses e-mail, références de visa, données personnelles et informations confidentielles.

Ce document a été pensé pour servir à la fois de support d’installation, de support de démonstration et de support commercial lors des visites clients.

## 2. Pourquoi ce workflow est important

- Parce que les documents de visa, les pièces d’identité, les actes, les notes verbales, les courriers officiels et certains comptes rendus contiennent souvent des données sensibles.
- Parce qu’un client institutionnel doit comprendre non seulement que l’IA produit un résultat utile, mais aussi que le traitement respecte une logique de confidentialité.
- Parce qu’en contexte international, la confiance, la conformité, la traçabilité et la validation humaine comptent autant que la qualité de traduction.

## 3. Définitions à expliquer à toute audience

**PII** : PII signifie Personal Identifiable Information, c’est-à-dire les informations permettant d’identifier directement ou indirectement une personne. Exemples : nom complet, e-mail, numéro de téléphone, numéro de passeport, référence de dossier, date de naissance, adresse.

**Anonymisation** : L’anonymisation consiste à retirer ou à transformer des informations de manière à ce qu’il ne soit plus possible de retrouver l’identité de la personne à partir des données traitées. Dans un workflow, cela revient à supprimer définitivement certaines données ou à les remplacer par une forme non réversible.

**Pseudonymisation** : La pseudonymisation consiste à remplacer les données identifiantes par des jetons techniques, par exemple PERSON_001 ou PASSPORT_001. La différence avec l’anonymisation est qu’une table de correspondance peut exister localement pour rétablir les vraies valeurs à la fin du traitement, sans jamais les exposer au fournisseur d’IA.

## 4. Pourquoi appliquer PII, anonymisation et pseudonymisation

- Pour réduire le risque d’exposition de données sensibles pendant le traitement.
- Pour limiter ce que le modèle externe voit réellement.
- Pour rassurer les organisations internationales, les cabinets, les directions générales et les équipes conformité.
- Pour prouver que le workflow ne se contente pas de traduire, mais applique une gouvernance sérieuse des données.
- Pour rendre le service plus crédible lors des visites clients, démonstrations et discussions de cadrage.

## 5. Ce que le workflow 143 fait concrètement

1. Reçoit une demande de traduction via webhook n8n.
2. Analyse les métadonnées du document et classe son niveau de sensibilité.
3. Détecte les éléments PII présents dans les champs structurés et dans le texte.
4. Pseudonymise localement les éléments sensibles avant tout appel au modèle.
5. Envoie au modèle uniquement la version pseudonymisée du contenu.
6. Récupère la traduction et lance une relecture qualité également sur une version pseudonymisée.
7. Ré-identifie localement les jetons après traitement.
8. Assemble un document bilingue propre avec score de qualité.
9. Route soit vers le client final, soit vers un validateur humain interne si le document est sensible ou si le score est insuffisant.
10. Purge la table de correspondance sensible en fin de traitement.

## 6. Installation pas à pas dans n8n

### Étape 1 — Préparer l’environnement

Vérifiez que votre instance n8n est accessible, que vous pouvez créer ou importer des workflows et que vous disposez d’un espace de test séparé avant la mise en production.

### Étape 2 — Importer le JSON

Dans n8n, ouvrez Workflows, choisissez l’option d’import, puis collez ou importez le fichier JSON du workflow 143 prêt à l’emploi.

### Étape 3 — Configurer la clé OpenAI

Créez ou mettez à jour la variable d’environnement OPENAI_API_KEY. Elle sera utilisée pour la traduction pseudonymisée et la relecture qualité pseudonymisée.

### Étape 4 — Configurer la clé Resend

Créez ou mettez à jour la variable d’environnement RESEND_API_KEY pour les envois e-mail sortants.

### Étape 5 — Définir l’adresse de revue interne

Ajoutez INTERNAL_REVIEW_EMAIL si vous souhaitez qu’un validateur reçoive automatiquement les documents nécessitant une vérification humaine.

### Étape 6 — Définir l’adresse expéditeur

Ajoutez OUTREACH_FROM_EMAIL pour maîtriser l’adresse utilisée lors de l’envoi des documents ou des demandes de validation.

### Étape 7 — Vérifier les nœuds sensibles

Contrôlez les nœuds de détection PII, de pseudonymisation, de traduction, de relecture, d’envoi validateur et d’envoi client afin de confirmer que les variables sont bien référencées et qu’aucune clé n’est inscrite en dur.

### Étape 8 — Tester avec un document fictif

Envoyez un document de test contenant des données fictives, par exemple un faux dossier de visa, pour vérifier la bonne détection des champs sensibles et le bon routage du workflow.

### Étape 9 — Vérifier le comportement de validation

Confirmez qu’un document déclaré très sensible, ou un document au score insuffisant, est bien envoyé au validateur humain et non directement au client final.

### Étape 10 — Passer en production

Une fois les tests validés, activez le workflow, documentez les rôles de validation et limitez l’accès aux exécutions n8n contenant encore temporairement des données réelles.

## 7. Paramètres attendus à l’entrée du workflow

- `texte` ou `content` : contenu à traduire.
- `langue_source` : langue d’origine, par exemple `fr`.
- `langue_cible` : langue de destination, par exemple `en`.
- `type_document` : visa, note verbale, courrier officiel, contrat, compte rendu, etc.
- `demandeur` : nom du demandeur, si nécessaire à l’orchestration interne.
- `organisation` : structure cliente ou institution concernée.
- `reference_dossier` : identifiant de suivi interne.
- `email_retour` : destinataire final du document.
- `email_validateur` : destinataire interne de la validation humaine.
- `contexte_mission` : sommet international, mission terrain, protocole, coopération, immigration, etc.

## 8. Ce que l’IA voit et ce qu’elle ne voit pas

| Élément | Traitement appliqué |
|---|---|
| Nom réel du demandeur | Remplacé par un jeton comme PERSON_001 |
| Numéro de passeport | Remplacé par un jeton comme PASSPORT_001 |
| E-mail réel | Remplacé par un jeton comme EMAIL_001 |
| Référence de dossier | Remplacée par un jeton comme REF_001 |
| Texte métier utile à la traduction | Conservé si nécessaire au résultat |
| Table de correspondance | Conservée localement dans n8n puis purgée |

## 9. Cas d’usage recommandés

- Traduction de documents de visa et d’immigration.
- Traduction de lettres administratives ou institutionnelles.
- Traduction de notes verbales et de correspondances diplomatiques.
- Traduction de contrats, avenants, projets d’accord et documents juridiques à valider.
- Traduction de documents de sommet, ateliers régionaux, réunions bilatérales et événements internationaux.

## 10. Messages clés à utiliser lors des visites clients

- Notre workflow ne se limite pas à traduire : il applique une couche de protection des données avant même l’appel à l’IA.
- Le modèle ne voit pas les identifiants sensibles en clair lorsque la pseudonymisation est activée.
- La ré-identification n’a lieu que localement dans le workflow, sous votre contrôle opérationnel.
- Les documents les plus critiques peuvent être bloqués pour validation humaine avant diffusion.
- Cette approche aide l’organisation à concilier productivité, qualité linguistique et confidentialité.

## 11. Checklist de mise en production

- Vérifier que les clés API sont stockées hors workflow.
- Tester le flux avec des documents fictifs réalistes.
- Vérifier que les documents sensibles sont bien routés vers la validation humaine.
- Contrôler les journaux d’exécution et la politique de conservation.
- Définir qui approuve, qui corrige et qui diffuse les livrables finaux.
- Effectuer immédiatement une rotation des secrets si un ancien JSON contenait des clés en clair.

## 12. Référence du JSON prêt à coller dans n8n

La dernière version locale du workflow prête à importer ou à coller dans n8n est : 143_n8n_Traduction_Officielle_Internationale_PII_Revamp_06juillet2026.json.

Cette version est la version sécurisée à utiliser de préférence à l’ancien fichier de démonstration présent dans Downloads, lequel contenait des secrets en clair et ne mettait pas en œuvre de vraie pseudonymisation locale.

## Exemple de charge utile

```json
{
  "texte": "Nom : Fatou Diallo\nPassport No: AB1234567\nEmail: fatou.diallo@example.org\nObjet : demande de visa officiel pour le sommet régional.",
  "langue_source": "fr",
  "langue_cible": "en",
  "type_document": "Demande de visa officiel",
  "demandeur": "Fatou Diallo",
  "organisation": "Organisation régionale fictive",
  "reference_dossier": "VISA-2026-0041",
  "email_retour": "translation.office@example.org",
  "email_validateur": "compliance@example.org",
  "contexte_mission": "Sommet international"
}
```
