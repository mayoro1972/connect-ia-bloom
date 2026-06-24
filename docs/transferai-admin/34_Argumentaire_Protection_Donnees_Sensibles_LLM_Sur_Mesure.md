# Argumentaire client - protection des donnees sensibles et LLM sur mesure

Date: 2026-05-22

## Objet

Ce document rassemble les elements cles sur lesquels TransferAI Africa peut s'appuyer pour rassurer une entreprise sur la protection de ses donnees sensibles et sur notre approche de conception de LLM sur mesure.

L'objectif n'est pas de faire des promesses vagues, mais de montrer une posture claire:

- nous prenons la sensibilite des donnees au serieux;
- nous appliquons une logique de minimisation et de controle;
- nous concevons les usages LLM autour des exigences de l'organisation cliente;
- nous cherchons a reduire le risque avant de chercher la performance.

## Message directeur a porter aux entreprises

TransferAI Africa ne traite pas les donnees sensibles comme un simple carburant pour l'IA.

Nous concevons des dispositifs IA et des LLM sur mesure avec une logique de gouvernance, de minimisation, de cloisonnement et de controle afin que l'entreprise garde la maitrise de ce qui peut ou non etre expose a un modele.

## 1. Nos principes de protection des donnees sensibles

### 1. Minimisation des donnees

Nous ne faisons pas circuler plus de donnees que necessaire.

Ce que cela veut dire concretement:

- chaque cas d'usage est traite avec une logique de `need-to-know`;
- seuls les champs strictement utiles au workflow IA sont autorises;
- les donnees brutes, libres ou identifiantes sont exclues par defaut;
- nous privilegions les tags, variables structurees, agrégats et resumes controles.

### 2. Deny-by-default pour les LLM

Notre principe de base est simple:

- aucune donnee sensible ne part vers un LLM par defaut;
- tout ce qui est nominatif, libre, confidentiel ou technique est bloque tant qu'il n'a pas ete qualifie;
- seuls les usages explicitement approuves sont ouverts.

Ce positionnement est important a dire aux clients, car il montre que nous partons du risque et non de la commodite.

### 3. Pseudonymisation avant exposition

Quand un cas d'usage IA le permet, nous remplacons les identifiants directs par des references techniques ou des variables neutres.

Exemples:

- nom, email, telephone, entreprise nominative;
- messages libres;
- identifiants de session;
- tokens, references internes ou identifiants de portail.

Le modele travaille alors sur une version controlee de l'information, et non sur le dossier brut.

### 4. Cloisonnement des usages

Nous separons les usages IA selon leur niveau de sensibilite.

Par exemple:

- un usage d'analyse statistique agrégée ne doit pas exposer les memes donnees qu'un assistant operationnel;
- un copilote interne ne doit pas avoir acces aux memes donnees qu'un agent conversationnel externe;
- un module de qualification marketing ne doit pas toucher aux secrets, tokens ou journaux bruts.

### 5. Chiffrement et controle d'acces

Nous nous appuyons sur des mecanismes de protection qui doivent etre visibles et explicables:

- chiffrement en transit et au repos selon l'architecture retenue;
- controle d'acces par roles;
- segmentation des droits selon les equipes et les fonctions;
- restriction des acces aux donnees sensibles, techniques et administratives.

### 6. Traçabilite et journalisation

Un client doit pouvoir comprendre qui accede a quoi, et dans quel cadre.

Nous cherchons donc a mettre en place:

- une journalisation des flux sensibles;
- une trace des champs autorises vers les modules IA;
- une separation claire entre donnees source, donnees transformees et sorties IA;
- une documentation des regles de protection appliquees.

### 7. Revue humaine sur les cas sensibles

Nous ne defendons pas une automatisation aveugle.

Sur les usages sensibles, nous recommandons:

- une validation humaine;
- une revue de l'extract avant exposition au modele;
- un controle des sorties sur les cas metier, juridiques, RH, financiers ou conformite.

## 2. Ce que nous considerons comme donnees sensibles ou a haut risque

Dans un contexte entreprise, nous traitons avec prudence:

- les identifiants directs: nom, prenom, email, telephone, WhatsApp, fonction nominative;
- les donnees d'entreprise nominatives ou reliees a des personnes;
- les textes libres: messages, demandes, notes, conversations, commentaires, irritants, priorites;
- les donnees de gouvernance, securite, conformite, systemes et architecture;
- les mots de passe, hashes, tokens, sessions, liens d'invitation, identifiants techniques;
- les journaux de diffusion, payloads bruts, logs de conversations et meta techniques detaillees;
- les donnees strategiques, commerciales ou operationnelles pouvant reveler des projets, contraintes ou decisions internes.

## 3. Comment nous concevons un LLM sur mesure pour une organisation

Quand nous parlons de `LLM sur mesure`, cela ne veut pas seulement dire personnaliser un prompt.

Cela signifie concevoir un systeme adapte au cadre de l'organisation:

- ses cas d'usage reels;
- son niveau de sensibilite;
- ses exigences juridiques et conformite;
- son niveau d'acceptation du risque;
- son architecture de donnees;
- ses besoins de gouvernance et d'audit.

## 4. Les piliers de notre approche LLM sur mesure

### 1. Cadrage par cas d'usage

Nous demarrons par les questions suivantes:

- quel probleme metier veut-on resoudre;
- quelle donnee est vraiment necessaire;
- quelle donnee ne doit jamais etre exposee;
- quel niveau d'autonomie est acceptable;
- quel niveau de revue humaine est obligatoire.

### 2. Architecture de protection avant performance

Avant de parler de finesse de reponse ou d'automatisation, nous cadrons:

- les donnees autorisees;
- les donnees interdites;
- les transformations obligatoires;
- les controles d'acces;
- les traces de supervision;
- les conditions de retention et de suppression.

### 3. Parametrage selon la criticite

Une entreprise n'a pas le meme niveau d'exigence selon les usages.

Nous pouvons concevoir differents niveaux:

- usage contenu / marketing avec donnees faibles;
- usage support interne avec donnees pseudonymisees;
- usage metier plus sensible avec garde-fous renforces;
- usage critique avec cloisonnement fort, revue humaine et environnement dedie.

### 4. Gouvernance des fournisseurs et de l'hebergement

Un LLM sur mesure ne se limite pas au modele lui-meme.

Il faut aussi cadrer:

- quel fournisseur est utilise;
- quelles donnees transitent chez lui;
- dans quelle region;
- selon quelles regles de retention;
- avec quel cadre contractuel;
- et avec quel niveau d'isolation technique.

### 5. Evaluation et amelioration continue

Nous cherchons a installer une logique de pilotage dans la duree:

- tests sur cas sensibles;
- controle des erreurs et hallucinations;
- revue des jeux de donnees exposes;
- revalidation des regles si le cas d'usage evolue;
- audit periodique des acces et des flux.

## 5. Ce que nous pouvons dire de facon forte aux entreprises

Voici des formulations solides et credibles:

- `Nous ne partons pas du principe que tout peut etre donne a un modele.`
- `Nous definissons d'abord ce qui doit rester hors LLM, puis seulement ce qui peut etre exploite.`
- `Nous concevons des LLM sur mesure autour de vos contraintes de confidentialite, de conformite et de gouvernance.`
- `Nous privilegions la minimisation, la pseudonymisation et le cloisonnement avant toute exposition de donnees.`
- `Nous adaptons l'architecture IA au niveau de sensibilite de votre organisation et non l'inverse.`
- `Nous integrons des controles d'acces, des regles d'usage et des mecanismes de tracabilite pour garder la maitrise des flux sensibles.`
- `Sur les cas critiques, nous maintenons une revue humaine et des garde-fous explicites.`

## 6. Preuves concretes a montrer en rendez-vous

Pour etre credible, il faut montrer des artefacts concrets et pas seulement des intentions.

Nous pouvons nous appuyer sur:

- l'inventaire des donnees collectees par point de collecte;
- la matrice de protection LLM par famille de donnees;
- la distinction `bloque / pseudonymiser / agrege uniquement / autorise sous controle`;
- une allowlist de champs par workflow IA;
- un schema de roles et d'acces;
- une politique de retention / suppression;
- un processus de revue humaine sur usages sensibles;
- un cadre de journalisation des appels LLM.

## 7. Reponse courte a reutiliser en presentation commerciale

`Chez TransferAI Africa, nous concevons des solutions IA et des LLM sur mesure avec une logique de protection by design. Nous commencons par identifier les donnees sensibles, definir ce qui reste hors modele, pseudonymiser ce qui peut l'etre, puis mettre en place des controles d'acces, de traçabilite et de revue humaine. Notre approche consiste a adapter l'IA a la gouvernance de l'entreprise, pas a demander a l'entreprise de s'adapter au modele.`

## 8. Version orale plus executive

`Nous voulons que nos clients sachent une chose simple: nous faisons attention a leurs donnees. Nous ne branchons pas un LLM directement sur des informations sensibles. Nous concevons un cadre sur mesure avec minimisation, pseudonymisation, controle d'acces, tracabilite et validation humaine quand c'est necessaire. C'est cette rigueur qui permet de deployer une IA utile sans compromettre la confidentialite.`

## 9. Ce qu'il vaut mieux eviter de promettre

Pour rester credibles, il vaut mieux eviter les formules absolues si elles ne sont pas juridiquement et techniquement couvertes.

A eviter sans preuve ou dispositif formel:

- `vos donnees sont 100% securisees`;
- `aucune faille n'est possible`;
- `le modele ne voit jamais rien` si ce n'est pas strictement vrai;
- `nous sommes conformes a tout` sans cadre contractuel, technique et documentaire correspondant.

Mieux vaut dire:

- `nous appliquons des garde-fous stricts`;
- `nous structurons les usages pour reduire fortement le risque`;
- `nous adaptons l'architecture au niveau de sensibilite et aux exigences de conformite du client`;
- `nous documentons les donnees autorisees, interdites et transformees avant usage IA`.

## 10. Conclusion

Le bon message a porter est le suivant:

TransferAI Africa ne propose pas seulement des experiences IA interessantes.

Nous proposons une approche responsable de l'IA en contexte entreprise, dans laquelle la confidentialite, la gouvernance et la maitrise des donnees sensibles font partie du design de la solution, en particulier lorsque nous concevons des LLM sur mesure pour une organisation.
