# Cloudflare: formulaire d'audit sur le meme site

Objectif :

- site principal a la racine
- formulaire d'audit publie sous `/formulaire-audit-ia/`

Exemple :

- `https://transferai.ci/`
- `https://transferai.ci/formulaire-audit-ia/`

## Principe retenu

Le formulaire d'audit vit dans un depot separe :

- `../formulaire-audit-ia-2`

Pour Cloudflare, le plus simple est d'embarquer le build du formulaire dans le site principal, dans :

- `public/formulaire-audit-ia/`

Ainsi, Cloudflare ne deploie qu'un seul projet web.

## Workflow local

### 1. Build du formulaire d'audit

Dans `formulaire-audit-ia-2` :

```powershell
npm run build
```

### 2. Synchronisation dans le site principal

Dans `connect-ia-bloom-2` :

```powershell
npm run sync:audit-form
```

Cela copie le contenu de :

- `../formulaire-audit-ia-2/dist`

vers :

- `public/formulaire-audit-ia`

### 3. Build du site principal

```powershell
npm run build
```

## Ce qui est deja configure

- le site principal ouvre le formulaire d'audit :
  - en local vers `http://127.0.0.1:4175/`
  - en production vers `/formulaire-audit-ia/`
- le formulaire d'audit build avec la base Vite `/formulaire-audit-ia/`

## Variables a verifier

### Formulaire d'audit

Dans `formulaire-audit-ia-2/.env.local` :

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Site principal

En production, aucune variable supplementaire n'est obligatoire si le formulaire est servi sous :

`/formulaire-audit-ia/`

Optionnellement, pour un autre emplacement :

```env
VITE_AUDIT_FORM_URL=https://votre-url/
```

## Resend pour les pieces jointes

Si tu utilises Resend pour l'envoi des pieces jointes du formulaire d'audit :

- garde `RESEND_API_KEY` dans les secrets Supabase du projet du formulaire
- verifie l'adresse d'envoi du domaine
- teste un envoi complet apres publication

Cloudflare n'a pas besoin d'une integration speciale pour cela :
- Cloudflare sert les fichiers statiques
- Supabase + Resend gerent les donnees et les emails

## Checklist avant publication Cloudflare

1. `formulaire-audit-ia-2` build sans erreur
2. `npm run sync:audit-form` dans le site principal
3. verifier que `public/formulaire-audit-ia/index.html` existe
4. `npm run build` du site principal
5. deployer le site principal sur Cloudflare
6. tester :
   - `/`
   - `/developpement-solutions-ia`
   - `/formulaire-audit-ia/`
7. remplir un formulaire test
8. verifier Supabase
9. verifier les emails / pieces jointes
