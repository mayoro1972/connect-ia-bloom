# Checklist de suivi opérationnel

**Programme :** Prospection TransferAI V3 - Phase 1 deck premium, catalogue dynamique et envoi prospect

**Date :** 2 juin 2026

**Objet :** fournir un tableau de suivi opérationnel simple à partager pour piloter la clôture de la phase 1.

**Périmètre :** workflow V3, renderers Supabase, qualité du deck premium, mini-catalogue, validation interne et envoi prospect.

## 1. Tableau de suivi opérationnel

| Lot | Élément | Statut | Responsable | Priorité | Prochaine action |
| --- | --- | --- | --- | --- | --- |
| Workflow V3 | Génération du catalogue dynamique par pack | Done | Technique | Haute | Conserver le flux actuel et vérifier ponctuellement les rendus PDF/DOCX sur de nouveaux packs. |
| Workflow V3 | Génération du deck PPTX par pack | Done | Technique | Haute | Continuer les tests de génération sur des prospects variés pour confirmer la stabilité. |
| Workflow V3 | Fusion des pièces jointes finales | Done | Technique | Haute | Contrôler régulièrement `attachments_count = 2` dans les exécutions critiques. |
| Workflow V3 | Validation interne puis envoi prospect | Done | Technique | Haute | Maintenir le protocole d’approbation sur le dernier email reçu uniquement. |
| Renderers | Déploiement de `catalogue-renderer` et `deck-renderer` | Done | Technique | Haute | Conserver les versions déployées et documenter toute évolution avant redéploiement. |
| Guides | Mise à jour des guides utilisateur et troubleshooting | Done | Documentation | Moyenne | Partager les nouvelles versions MD et Word avec l’équipe opérationnelle. |
| QA Deck | Validation visuelle du deck premium sur plusieurs prospects réels | Remaining | Commercial + Technique | Haute | Régénérer au moins 3 à 5 decks multi-secteurs et faire une revue slide par slide. |
| QA Catalogue | Validation visuelle du mini-catalogue sur plusieurs secteurs | Remaining | Commercial + Technique | Haute | Comparer les sorties Orange et hors Orange pour confirmer le niveau premium et la bonne personnalisation. |
| Localisation | Tests complets FR / EN / ES | Remaining | Technique | Haute | Exécuter un cas francophone, un anglophone et un hispanophone avec contrôle des accents et de la cohérence métier. |
| Fallbacks métier | Validation des cas incomplets ou faiblement documentés | Remaining | Technique + Ops | Moyenne | Tester des prospects sans décideur identifié, avec peu de signaux ou avec secteur incertain. |
| Production Email | Passage du sender de test au domaine de production | Remaining | Ops + Technique | Haute | Valider Resend sur le domaine TransferAI puis remplacer `onboarding@resend.dev` par `noreply@transferai.ci`. |
| Nettoyage | Retrait des cibles de test et des usages de validation temporaires | Remaining | Ops | Haute | Supprimer les adresses de démonstration et vérifier que l’envoi cible toujours le vrai prospect. |
| Audit Web | Finalisation du formulaire d’audit dynamique par `pack_id` | Blocking | Produit + Technique | Haute | Rendre le flux d’audit entièrement piloté par le pack, avec reprise native du contexte prospect. |
| QA Documentaire | Prévisualisation automatisée DOCX | Blocking partiel | Technique | Basse | Installer ou rendre disponible `soffice` pour une QA visuelle automatisée des documents Word. |
| Industrialisation | Grille de QA standard deck + catalogue | Nice to have | Ops | Moyenne | Créer une fiche de contrôle avant envoi couvrant lisibilité, langue, pièces jointes et CTA. |
| Industrialisation | Snapshots de rendu par langue et par secteur | Nice to have | Technique | Basse | Archiver quelques rendus de référence FR / EN / ES pour accélérer les validations futures. |
| Industrialisation | Guide interne go live production | Nice to have | Ops + Technique | Moyenne | Formaliser un document court sur Resend, audit dynamique, contrôles V3 et règles d’exploitation. |

## 2. Critère de sortie de phase 1

- Au moins 3 à 5 packs réels passent correctement avec catalogue et deck premium.
- Les deux pièces jointes finales sont systématiquement présentes : un PDF et un PPTX.
- Le rendu du deck et du mini-catalogue est jugé lisible, cohérent et premium sur plusieurs cas.
- Le formulaire d’audit dynamique par `pack_id` est validé fonctionnellement.
- L’envoi email est prêt à basculer sur le domaine de production.

## 3. Recommandation opérationnelle

La phase 1 n’est plus bloquée sur la chaîne technique principale. La priorité doit maintenant être mise sur la validation transverse, la qualité perçue des livrables et la sécurisation des usages de production.
