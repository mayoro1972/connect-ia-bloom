# TransferAI — Le Journal

Édition du 11 septembre 2026, domaine Éducation & EdTech IA, métier formateur professionnel.

Cette présentation premium est le modèle par défaut de toutes les prochaines newsletters hebdomadaires, conformément à la demande de Marius AYORO. Les consignes persistantes figurent dans le fichier `AGENTS.md` dans ce dossier. Réutiliser la mise en page tout en renouvelant intégralement les éléments propres à chaque semaine. Le présent script génère l'édition du 11 septembre ; ce n'est pas encore un générateur hebdomadaire paramétrable.

## Présentation

L’édition publiée se trouve dans `public/previews/transferai-newsletter-premium-2026-09-11.html`. Après génération, ouvrir `newsletter-complete.html` ou `newsletter-premium.html` dans un navigateur. Les deux fichiers présentent la même édition complète, avec une mise en page de journal adaptée au mobile, un éditorial signé Marius AYORO, des solutions métier et un dossier gouvernance/souveraineté/ARTCI.

Le portrait est celui publié sur la page officielle https://www.transferai.ci/a-propos et chargé depuis https://www.transferai.ci/assets/team-marius-DLn2j3sv.jpg . Il n'a pas été généré ni retouché. La photo et les polices Google nécessitent une connexion ; des polices de remplacement sont définies.

## Sources et génération

- `newsletter-content.html` : contenu éditorial et sources documentaires.
- `premium.css` : présentation du journal.
- `build-premium.py` : génération des deux présentations autonomes.
- `audit-et-ligne-editoriale.md` : audit initial et règles pour les prochaines éditions.

Python 3 et le paquet `lxml` sont nécessaires pour régénérer les fichiers :

```sh
python3 -m pip install lxml
python3 build-premium.py
```

La présentation est un aperçu navigateur. L'adaptation et la vérification dans les clients email, le raccordement au générateur de campagnes et les liens personnalisés de désabonnement restent à réaliser. Le lien de cette édition est intégré au back-office TransferAI. Le push sur main déclenche le déploiement Cloudflare Pages du site, sans envoyer de newsletter.

## Éditions hebdomadaires automatisées (depuis le 18 septembre 2026)

Chaque édition vit dans `editions/AAAA-MM-JJ/` (date du vendredi) : `newsletter-body.html` (contenu, conteneur `#transferai-formateurs` requis par `premium.css`), `meta.json` (titre, objet, pré-en-tête, domaine, métier, sujet brûlant, sources) et `README.md` (points à relire).

```sh
node --experimental-strip-types scripts/newsletter-journal.ts build AAAA-MM-JJ    # génère newsletter-premium.html (page) et newsletter-email.html (email)
node --experimental-strip-types scripts/newsletter-journal.ts review AAAA-MM-JJ   # brouillon back-office + email [TEST] au validateur
```

La version email (`scripts/newsletter-journal-email.ts`) reconstruit l'édition en tableaux, une colonne de 600 px et styles en ligne, lisible dans Gmail, Outlook et Apple Mail ; c'est elle que `newsletter-send` expédie telle quelle (`meta.email_format = journal-email-v1`).

`review` nécessite `CONTENT_ADMIN_TOKEN` dans `.env.local` (non versionné). L'édition est déposée en statut `draft`, avec `scheduled_for` au vendredi 01:00 (Africa/Abidjan).

Calendrier :

1. Jeudi 23:59 : la tâche planifiée Claude « newsletter-hebdo-transferai-journal » repère le sujet IA de la semaine, rédige l'édition, puis lance `build` et `review`.
2. L'email [TEST] contient les boutons **Approuver**, **Modifier** et **Rejeter**. Approuver et Rejeter ouvrent `/newsletter-validation` sur le site (liens signés, valables 7 jours, confirmation obligatoire) ; Modifier ouvre le back-office. Rejeter archive l'édition.
3. Seules les éditions approuvées partent aux abonnés, via le cron Supabase `transferai-newsletter-send-weekly` (vendredi 08:30 UTC).

Fonctions concernées : `newsletter-send` (bandeau de validation dans les seuls emails de test), `newsletter-review` (applique l'approbation ou le rejet), `_shared/review-links.ts` (signature HMAC dérivée de `CONTENT_ADMIN_TOKEN`).
