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
