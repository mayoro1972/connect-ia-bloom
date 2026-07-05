# Prompts Higgsfield AI - Webinaire TransferAI

Date de préparation : 2026-07-04

## Objet

Ce document transforme les scripts TikTok et Facebook du webinaire TransferAI en prompts vidéo directement exploitables dans un workflow Higgsfield AI.

## Hypothèse de travail

La structure ci-dessous est pensée pour un usage pratique dans un générateur vidéo short-form :

- description du sujet
- décor et style
- type de caméra
- progression scène par scène
- texte écran
- voix off
- CTA

Ce n'est pas une reproduction d'un schéma d'import officiel Higgsfield. C'est un format optimisé pour le copier-coller dans un workflow de génération vidéo social ads.

## Règles visuelles communes

### TikTok

- format : `9:16`
- durée : `18 à 25 secondes`
- style : `UGC premium, smartphone, énergique, crédible`
- décor : `bureau moderne à Abidjan, coworking, salle de réunion, poste de travail réel`
- casting : `professionnels ivoiriens, étudiants ivoiriens, assistants, managers, entrepreneurs`
- lumière : `lumière naturelle douce, contraste réaliste, pas de surexposition`
- mouvement : `handheld léger, micro push-in, cuts rapides`
- rendu : `photoréaliste, peau naturelle, gestes naturels, physique réaliste`

### Facebook

- format : `4:5` pour le feed ou `9:16` pour Facebook Reels
- durée : `20 à 30 secondes`
- style : `social ad propre, humain, plus posé que TikTok`
- décor : `bureau professionnel, salle de réunion, open space, guichet client, environnement ivoirien crédible`
- lumière : `naturelle, premium, propre`
- mouvement : `caméra stable, petits travellings, alternance plan face caméra et B-roll`
- rendu : `photoréaliste, réaliste, corporate accessible`

## Bloc qualité à ajouter à tous les prompts

`physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

## 1. Test d'introduction TikTok

### TT00 - Test d'introduction

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 short-form social video, 22 seconds, authentic Ivorian office in Abidjan, young West African professional speaking directly to smartphone camera in French, premium UGC style, natural daylight, realistic skin texture, subtle handheld motion, energetic but credible tone. Scene 1: close selfie shot, serious expression, hook about losing hours every week at work, overlay "Des heures perdues chaque semaine ?". Scene 2: quick cut to laptop and professional letter being drafted, overlay "Courrier automatise". Scene 3: meeting notebook and audio waveform turning into a structured summary, overlay "Compte-rendu automatique". Scene 4: employee searching archive folders then instant answer appears on screen, overlay "Recherche documentaire instantanee". Scene 5: customer support desk and chat reply workflow, overlay "Assistant client 24/7". Scene 6: presenter points to screen with confident smile, overlay "10 usages concrets". Scene 7: final CTA card with clean brand look, overlay "17, 18 ou 19 juillet 2026 - Webinaire gratuit TransferAI". physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`En Côte d'Ivoire, beaucoup de professionnels perdent encore des heures sur des tâches répétitives. Rédiger un courrier. Faire un compte-rendu. Chercher un document. Répondre à des clients. TransferAI lance un webinaire gratuit pour montrer 10 usages concrets de l'IA, démontrés en direct, pour gagner du temps, mieux s'organiser et produire plus vite.`

Texte écran :
`Des heures perdues chaque semaine ? | Courrier automatise | Compte-rendu automatique | Recherche documentaire instantanee | Assistant client 24/7 | 10 usages concrets | 17, 18 ou 19 juillet 2026`

CTA :
`Choisissez votre date et reservez votre place gratuitement.`

## 2. Prompts TikTok

### TT01 - Constat fort

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 TikTok video, 20 seconds, authentic Abidjan workspace, Ivorian office employee speaking to camera, handheld smartphone feel, natural daylight, raw but premium UGC. Scene 1: direct face camera, concern about repetitive tasks stealing hours every week, overlay "Tu perds des heures ?". Scene 2: flashes of writing emails, taking meeting notes, searching files, answering customer calls. Scene 3: presenter says TransferAI will show 10 concrete AI use cases, overlay "10 usages concrets". Scene 4: final invitation card with dates and free webinar mention. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Courriers, comptes-rendus, recherche de documents, réponses clients... TransferAI prépare un webinaire gratuit pour montrer 10 usages concrets de l'IA en Côte d'Ivoire. Pas de théorie seule. Des démonstrations utiles.`

Texte écran :
`Tu perds des heures ? | 10 usages concrets | Webinaire gratuit | 17, 18 ou 19 juillet 2026`

CTA :
`Reserve ta place via [Lien d'inscription].`

### TT02 - Courrier professionnel

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 TikTok explainer, 18 seconds, female Ivorian administrative professional at office desk, smartphone camera, clean natural light, modern office realism. Scene 1: woman looks at camera and raises eyebrow, overlay "Et si ton courrier etait deja pret ?". Scene 2: screen with professional email draft appearing fast on laptop, hands editing final lines. Scene 3: close-up on human validation before send, overlay "Validation humaine". Scene 4: presenter smiles and points down to CTA with webinar dates. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI va montrer un usage simple : le courrier professionnel automatisé avec validation humaine. Tu gardes le contrôle, mais tu gagnes du temps.`

Texte écran :
`Courrier automatise | Validation humaine | Gain de temps`

CTA :
`Inscris-toi au webinaire gratuit.`

### TT03 - Données personnelles

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 TikTok style ad, 20 seconds, legal or compliance officer in an Ivorian office, realistic desk setup, smartphone handheld, natural light, serious trustworthy tone. Scene 1: presenter says AI is useful only if data stays protected, overlay "IA oui, exposition des donnees non". Scene 2: close-up of document with personal details blurred and anonymized on screen. Scene 3: presenter nods with secure professional tone, overlay "Anonymisation". Scene 4: clean webinar end card with dates and free registration. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`L'un des cas présentés par TransferAI concerne l'anonymisation des données personnelles avant partage ou analyse. Productivité et conformité peuvent aller ensemble.`

Texte écran :
`Anonymisation | Conformite | IA responsable`

CTA :
`17, 18 ou 19 juillet 2026.`

### TT04 - Réunion

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 short TikTok, 19 seconds, manager leaving meeting room in Abidjan office, smartphone perspective, realistic business environment, light handheld motion. Scene 1: direct face camera after a meeting, tired expression, overlay "Encore du temps perdu apres la reunion ?". Scene 2: audio waveform transforms into neat structured meeting summary on laptop. Scene 3: checklist of next actions appears, overlay "Actions a suivre". Scene 4: confident final invite to free webinar. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Imagine un compte-rendu de réunion automatique, déjà structuré avec les actions à suivre. C'est l'un des 10 usages concrets du webinaire TransferAI.`

Texte écran :
`Reunion | Compte-rendu automatique | Actions a suivre`

CTA :
`Reserve ta place.`

### TT05 - Recherche documentaire

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 UGC business video, 20 seconds, Ivorian employee at crowded desk with folders and laptop, smartphone camera, fast cuts, realistic office lighting. Scene 1: frustrated search through files and folders, overlay "20 minutes pour retrouver un document ?". Scene 2: digital archive search bar and instant answer appears. Scene 3: employee relieved and smiling, overlay "Recherche documentaire instantanee". Scene 4: final date card and free webinar mention. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI montrera comment une IA peut interroger tes propres archives et répondre en langage naturel. C'est la recherche documentaire instantanée.`

Texte écran :
`Archives internes | Reponse rapide | Recherche instantanee`

CTA :
`Inscription via [Lien d'inscription].`

### TT06 - Traduction

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 social video, 20 seconds, West African professional in diplomatic or institutional office, bilingual documents on desk, smartphone camera, elegant natural lighting, premium UGC. Scene 1: presenter asks if AI can help translate official documents faster, overlay "Traduction bilingue officielle". Scene 2: document in French and English switching cleanly. Scene 3: presenter in institution-like corridor, confident expression, overlay "Cas metier". Scene 4: webinar invitation with dates. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Parmi les usages du webinaire : la traduction bilingue officielle de documents professionnels. Un vrai cas métier, pas une promesse vague.`

Texte écran :
`Traduction bilingue | Documents officiels | Cas metier`

CTA :
`Choisis ta date.`

### TT07 - Finance / KYC

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 TikTok business explainer, 21 seconds, Ivorian finance professional in bank-like office, smartphone camera, realistic paperwork and dashboard screens, clean daylight. Scene 1: face camera with hook that AI is not only for marketing, overlay "Tu pensais que l'IA ne servait qu'au marketing ?". Scene 2: credit file review and KYC checklist on screen. Scene 3: regulatory headlines and compliance monitor, overlay "Veille reglementaire". Scene 4: presenter invites viewer to the free webinar. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI va aussi présenter un usage finance : dossier crédit, KYC et veille réglementaire. L'IA utile va bien au-delà des réseaux sociaux.`

Texte écran :
`Credit | KYC | Veille reglementaire`

CTA :
`Webinaire gratuit · [Lien d'inscription]`

### TT08 - Service client

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 short-form ad, 20 seconds, Ivorian customer support environment, young support professional speaking to camera, smartphone handheld, authentic office realism. Scene 1: overwhelmed support agent with phone and chat requests, overlay "Toujours les memes questions clients ?". Scene 2: intelligent chat assistant replies to common requests. Scene 3: support agent now handles only complex cases, overlay "Assistant client 24/7". Scene 4: CTA with free webinar dates. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Imagine un assistant client disponible 24/7 qui traite les demandes courantes et laisse les cas complexes à ton équipe. C'est l'un des cas abordés par TransferAI.`

Texte écran :
`Assistant client 24/7 | Questions courantes | Temps libere`

CTA :
`Reserve gratuitement ta place.`

### TT09 - Marketing local

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 TikTok marketing ad, 20 seconds, Ivorian entrepreneur or marketer at laptop, smartphone camera, colorful but realistic office scene, natural light. Scene 1: presenter asks if viewer wants faster content adapted to the Ivorian market, overlay "Contenu adapte au marche ivoirien ?". Scene 2: social posts, product copy and short captions appear on screen. Scene 3: presenter points to phrase "ton de marque conserve". Scene 4: final webinar invite card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI montrera aussi comment l'IA peut aider à produire du contenu marketing local en gardant ton ton et tes codes.`

Texte écran :
`Marketing local | Ton de marque | Production plus rapide`

CTA :
`17, 18 ou 19 juillet 2026.`

### TT10 - Facturation

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 business UGC video, 19 seconds, administrative manager in small office, smartphone camera, realistic desk with invoices and laptop, daylight. Scene 1: stressed person sorting unpaid invoices, overlay "Factures, relances, suivi ?". Scene 2: invoice reminders automate on screen. Scene 3: clean checklist and calendar appear, overlay "Rigueur + rapidite". Scene 4: confident webinar call-to-action. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Le webinaire TransferAI présente aussi la facturation et les relances automatisées pour gagner du temps sans perdre la rigueur de gestion.`

Texte écran :
`Facturation | Relances | Rigueur + rapidite`

CTA :
`Inscris-toi via [Lien d'inscription].`

### TT11 - RH

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 HR-focused TikTok ad, 20 seconds, Ivorian HR manager at desk reviewing CVs, smartphone camera, realistic office, natural light. Scene 1: presenter says HR can save time without losing judgment, overlay "RH : gagner du temps sans perdre ton jugement". Scene 2: candidate sorting and interview outline generation on screen. Scene 3: presenter closes laptop with confident nod, overlay "Decision assistee". Scene 4: dates and free webinar invite. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Tri de candidatures, préparation de trames d'entretien, aide à la décision RH : voilà un autre usage concret présenté par TransferAI.`

Texte écran :
`RH | Tri de candidatures | Decision assistee`

CTA :
`Reserve ta place.`

### TT12 - 13 domaines

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 TikTok promo, 21 seconds, montage of several Ivorian professionals in office contexts, smartphone-style edits, dynamic transitions, realistic business lighting. Scene 1: bold hook on camera, overlay "13 domaines d'activite". Scene 2: fast sequence of assistant, HR manager, banker, marketer, customer service agent, trainer. Scene 3: presenter says one AI approach can be adapted to each field, overlay "Une IA pour chacun". Scene 4: final free webinar card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Assistanat, RH, marketing, finance, juridique, service client, data... TransferAI lit l'IA par métier, pas par effet de mode.`

Texte écran :
`13 domaines | Lecture metier | IA pratique`

CTA :
`Choisis ta date.`

### TT13 - Pas de théorie seule

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 UGC direct-to-camera video, 18 seconds, confident Ivorian presenter in clean coworking space, handheld smartphone, natural light. Scene 1: presenter rejects vague AI talk, overlay "Pas envie d'un discours flou ?". Scene 2: quick punchy inserts of concrete work tasks. Scene 3: presenter says "pas de theorie seule", overlay exactly that phrase. Scene 4: CTA with webinar dates. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Parfait. TransferAI propose une mise en pratique concrète, pas de théorie seule. Le webinaire montre 10 usages reliés à de vrais besoins métier.`

Texte écran :
`Pas de theorie seule | Concret | Metier`

CTA :
`Webinaire gratuit · [Lien d'inscription]`

### TT14 - Diagnostic sur mesure

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 short-form professional video, 20 seconds, Ivorian consultant in meeting room, smartphone camera, premium natural light, realistic office. Scene 1: presenter says the starting point is not the tool but your job reality, overlay "Le point de depart, c'est ton metier". Scene 2: whiteboard or tablet showing audit steps and work tasks. Scene 3: presenter points to workflow map, overlay "Diagnostic sur mesure". Scene 4: final webinar invite card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`La différence TransferAI, c'est le diagnostic sur mesure. On part de la réalité du terrain pour identifier les usages IA qui ont du sens.`

Texte écran :
`Diagnostic sur mesure | Realite metier | Terrain`

CTA :
`17, 18 ou 19 juillet 2026.`

### TT15 - Trajectoire 90 jours

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 business TikTok, 20 seconds, Ivorian professional in office corridor then at planning desk, smartphone camera, dynamic but clean. Scene 1: presenter says discovering AI is not enough, overlay "Savoir quoi faire apres". Scene 2: calendar and milestone visuals appear. Scene 3: close-up on simple 90-day plan board, overlay "Trajectoire 90 jours". Scene 4: final CTA with registration dates. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI parle aussi de trajectoire 90 jours : des étapes claires pour transformer une découverte en action concrète.`

Texte écran :
`Trajectoire 90 jours | Etapes claires | Passer a l'action`

CTA :
`Reserve gratuitement ta place.`

### TT16 - Cas réels automatisés

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 social proof video, 19 seconds, consultant or trainer in Abidjan office, smartphone capture, authentic professional mood. Scene 1: presenter asks if viewer wants real working cases, overlay "Tu veux voir des cas qui tournent vraiment ?". Scene 2: workflow screens and task automation snippets. Scene 3: presenter emphasizes these are not mockups, overlay "Pas des maquettes". Scene 4: free webinar end card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI met en avant des cas d'usage réels automatisés, pas seulement des maquettes. C'est cette différence qu'on veut faire sentir dès le webinaire.`

Texte écran :
`Cas reels | Automatises | Pas des maquettes`

CTA :
`Inscription via [Lien d'inscription].`

### TT17 - Gouvernance

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 compliance-focused TikTok, 20 seconds, serious Ivorian presenter in secure office setting, smartphone camera, crisp daylight, clean desk. Scene 1: presenter warns that AI without governance is risky, overlay "L'IA sans gouvernance, c'est un risque". Scene 2: security icons, protected files, anonymized document. Scene 3: presenter points to words "Securite" and "Conformite". Scene 4: webinar invite card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Sécurité, conformité, protection des données : TransferAI intègre ces sujets dès le départ. Oui, l'IA doit faire gagner du temps. Mais pas à n'importe quel prix.`

Texte écran :
`Gouvernance | Securite | Conformite`

CTA :
`Choisis ta date.`

### TT18 - Accompagnement

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 warm UGC business video, 19 seconds, Ivorian trainer walking through coworking or workshop space, smartphone perspective, natural soft light. Scene 1: presenter says a demo alone is not enough, overlay "La difference, ce n'est pas juste la demo". Scene 2: coach-style interactions with professionals. Scene 3: presenter highlights follow-up over time, overlay "Accompagnement". Scene 4: final CTA with dates. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`La vraie différence, c'est l'accompagnement qui continue. TransferAI veut aider les professionnels à avancer dans la durée, pas seulement à regarder une vidéo.`

Texte écran :
`Accompagnement | Suivi | Dans la duree`

CTA :
`Webinaire gratuit · [Lien d'inscription]`

### TT19 - Continuité formation

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 short social promo, 20 seconds, confident Ivorian presenter in training venue or office, smartphone camera, premium UGC, realistic lighting. Scene 1: presenter says the webinar is only the beginning, overlay "Ce webinaire, c'est le debut". Scene 2: clips of practical workshop-style environment. Scene 3: phrase "puis aller plus loin" appears as presenter points to screen. Scene 4: CTA card with webinar dates. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI le présente comme une continuité vers la formation "L'IA au Bureau". Tu peux commencer par les 10 usages concrets, puis aller plus loin si tu veux passer à la pratique.`

Texte écran :
`Webinaire | Puis formation | Aller plus loin`

CTA :
`17, 18 ou 19 juillet 2026.`

### TT20 - Invitation finale

Format : `9:16`

Prompt Higgsfield :
`Vertical 9:16 final invitation TikTok, 21 seconds, diverse group of Ivorian professionals and students, authentic modern office and study scenes, smartphone-style fast montage, natural daylight. Scene 1: direct address to professionals, students, managers, assistants and entrepreneurs. Scene 2: quick clips of writing, meetings, customer support, marketing, studying. Scene 3: presenter says "gagner du temps, mieux t'organiser, produire plus vite", overlay those three phrases. Scene 4: strong final event card with TransferAI and dates. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI Africa t'invite à découvrir 10 usages concrets de l'IA pour transformer ton métier en Côte d'Ivoire. Gagner du temps. Mieux t'organiser. Produire plus vite.`

Texte écran :
`TransferAI Africa | 10 usages concrets | Webinaire gratuit | 17, 18 ou 19 juillet 2026`

CTA :
`Inscription via [Lien d'inscription].`

## 3. Prompts Facebook

### FB01 - Constat

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 Facebook feed video, 25 seconds, polished but human social ad, Ivorian office worker in Abidjan, stable camera with soft push-in, premium daylight, realistic office details. Scene 1: presenter asks why talk about AI now in Côte d'Ivoire, overlay "Pourquoi maintenant ?". Scene 2: B-roll of repetitive tasks: letters, meeting notes, file search, follow-up work. Scene 3: presenter explains professionals are losing hours every week, overlay "Des heures perdues". Scene 4: final event card for TransferAI free webinar. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Parce que beaucoup de professionnels perdent encore des heures chaque semaine sur des tâches répétitives : courrier, comptes-rendus, recherche documentaire, reformulation, suivi. TransferAI vous invite à un webinaire gratuit pour découvrir 10 usages concrets de l'IA.`

Texte écran :
`Pourquoi maintenant ? | Des heures perdues | 10 usages concrets`

CTA :
`Inscription : [Lien d'inscription]`

### FB02 - Courrier professionnel

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 Facebook video ad, 24 seconds, female office professional in Abidjan, stable camera, natural daylight, polished social ad tone. Scene 1: presenter asks if AI could help draft professional letters faster, overlay "Courriers plus vite". Scene 2: laptop screen with business letter draft appearing. Scene 3: human edits and validates before send, overlay "Validation humaine". Scene 4: final webinar invite card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`L'un des usages présentés par TransferAI est le courrier professionnel automatisé, avec validation humaine avant envoi. Le but n'est pas de remplacer votre jugement. Le but est de vous faire gagner du temps sur la première version.`

Texte écran :
`Courriers plus vite | Validation humaine | Webinaire gratuit`

CTA :
`17, 18 ou 19 juillet 2026 · [Lien d'inscription]`

### FB03 - Protection des données

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 Facebook explainer, 25 seconds, compliance professional in modern office, stable camera, calm trustworthy tone, daylight realism. Scene 1: presenter says useful AI also protects data, overlay "Productivite + protection". Scene 2: document anonymization visual with blurred names. Scene 3: presenter in office says governance is integrated from the start, overlay "Gouvernance des donnees". Scene 4: clean CTA card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Dans le webinaire TransferAI, nous aborderons aussi l'anonymisation des données personnelles avant partage ou analyse. Une approche pratique, reliée au terrain, avec gouvernance des données intégrée dès le départ.`

Texte écran :
`Productivite + protection | Anonymisation | Gouvernance des donnees`

CTA :
`Réservez votre place : [Lien d'inscription]`

### FB04 - Compte-rendu de réunion

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 Facebook business video, 25 seconds, Ivorian manager in meeting room, stable camera, polished natural light. Scene 1: presenter asks how much time is lost after meetings, overlay "Apres la reunion ?". Scene 2: meeting audio turns into structured summary on laptop. Scene 3: action list appears clearly, overlay "Actions a suivre". Scene 4: final invite to TransferAI webinar. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI montrera un usage concret : transformer l'audio d'une réunion en compte-rendu structuré avec actions à suivre. C'est exactement le type d'application simple et utile que nous voulons rendre accessible aux professionnels ivoiriens.`

Texte écran :
`Apres la reunion ? | Compte-rendu structure | Actions a suivre`

CTA :
`Webinaire gratuit · [Lien d'inscription]`

### FB05 - Recherche documentaire

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 office problem-solution video, 24 seconds, Ivorian employee at desk with files, stable camera, premium realism. Scene 1: overwhelmed search through folders and emails, overlay "Chercher partout ?". Scene 2: AI search into internal archives, instant answer appears. Scene 3: presenter says information becomes easier to exploit, overlay "Recherche documentaire instantanee". Scene 4: CTA card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`L'un des 10 usages du webinaire TransferAI est la recherche documentaire instantanée dans vos propres contenus. Une façon concrète de mieux exploiter l'information déjà disponible dans votre environnement de travail.`

Texte écran :
`Chercher partout ? | Reponse instantanee | Recherche documentaire`

CTA :
`Inscription gratuite : [Lien d'inscription]`

### FB06 - Traduction bilingue

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 professional Facebook ad, 24 seconds, diplomatic or institutional office, West African professional, stable camera, elegant daylight. Scene 1: presenter says AI can help on specialized tasks too, overlay "Usages specialises". Scene 2: official bilingual document handling. Scene 3: presenter explains official translation use case, overlay "Traduction bilingue officielle". Scene 4: final webinar card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Par exemple : la traduction bilingue officielle de documents pour la diplomatie, les institutions ou les organisations internationales. TransferAI vous montrera comment l'IA peut déjà intervenir sur ce type de besoin dans un cadre professionnel.`

Texte écran :
`Usages specialises | Traduction bilingue officielle`

CTA :
`17, 18 ou 19 juillet 2026 · [Lien d'inscription]`

### FB07 - Finance / conformité

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 finance-oriented social ad, 25 seconds, banker or finance officer in realistic office, stable camera, polished natural light. Scene 1: hook that AI also matters where rigor matters most, overlay "Finance, KYC, conformite". Scene 2: credit file review and KYC checklist. Scene 3: regulatory watch dashboard with BCEAO-UEMOA style context, overlay "Veille reglementaire". Scene 4: strong CTA card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI présentera un usage autour de l'analyse assistée de dossiers de crédit et KYC avec veille BCEAO-UEMOA en arrière-plan. Un exemple concret pour montrer que l'IA utile ne se limite pas au marketing ou à la rédaction.`

Texte écran :
`Finance | KYC | Veille reglementaire`

CTA :
`Réservez votre place : [Lien d'inscription]`

### FB08 - Service client

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 customer service Facebook ad, 24 seconds, realistic support desk in Côte d'Ivoire, stable camera, trustworthy light and tone. Scene 1: presenter says repeated customer questions consume time, overlay "Toujours les memes demandes ?". Scene 2: AI assistant replies to basic requests. Scene 3: complex case transferred to human, overlay "Assistant client 24/7". Scene 4: webinar CTA card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Parmi les 10 usages présentés dans le webinaire TransferAI : un assistant client disponible 24/7 pour traiter les demandes courantes et orienter les cas complexes.`

Texte écran :
`Toujours les memes demandes ? | Assistant client 24/7`

CTA :
`Inscription : [Lien d'inscription]`

### FB09 - Marketing local

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 polished social ad, marketer or entrepreneur in Abidjan office, stable camera, bright realistic daylight. Scene 1: presenter says local content creation is already a real business topic, overlay "Contenu marketing local". Scene 2: social posts and product copy adapted to Ivorian market. Scene 3: presenter highlights tone and local codes, overlay "Pas du contenu generique". Scene 4: webinar CTA card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI abordera aussi la génération de contenu marketing local pour les réseaux sociaux, fiches produits et messages de communication. Pas du contenu générique. Du contenu ancré dans votre ton, vos codes et votre réalité de terrain.`

Texte écran :
`Contenu marketing local | Ton de marque | Pas du contenu generique`

CTA :
`17, 18 ou 19 juillet 2026 · [Lien d'inscription]`

### FB10 - Administration / gestion

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 admin productivity video, 24 seconds, office administrator at desk with invoices, stable camera, realistic business setting. Scene 1: presenter says some repetitive administrative tasks consume too much energy, overlay "Facturation, relances, suivi". Scene 2: invoice tracking and reminders automate. Scene 3: calmer workspace and organized follow-up, overlay "Liberer du temps". Scene 4: CTA card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Dans ce webinaire gratuit, TransferAI montrera comment l'IA peut aider à automatiser une partie du suivi des factures et des relances. Un usage concret pour libérer du temps sans perdre en rigueur.`

Texte écran :
`Facturation, relances, suivi | Liberer du temps`

CTA :
`Inscrivez-vous ici : [Lien d'inscription]`

### FB11 - Ressources humaines

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 HR recruitment ad, 24 seconds, Ivorian HR professional at desk, stable camera, premium daylight, clean office. Scene 1: presenter says AI can help HR save time without replacing judgment, overlay "RH : gagner du temps sans perdre le jugement". Scene 2: CV sorting and interview guide preparation. Scene 3: presenter closes with human decides, overlay "L'outil accelere, l'humain decide". Scene 4: webinar CTA card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Nous verrons un cas d'usage autour du tri de candidatures et de la préparation de trames d'entretien assistés par IA. Le message est clair : l'outil accélère, mais l'humain décide.`

Texte écran :
`RH | Tri de candidatures | L'humain decide`

CTA :
`Webinaire gratuit TransferAI · [Lien d'inscription]`

### FB12 - 13 domaines

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 industry coverage ad, 25 seconds, polished montage of several Ivorian professions, stable camera and smooth transitions, modern office realism. Scene 1: title card "13 domaines d'activite, une IA pour chacun". Scene 2: quick scenes for assistant, HR, marketer, banker, customer service, IT, trainer. Scene 3: presenter explains TransferAI builds a job-based understanding of AI, overlay "Lecture metier". Scene 4: CTA card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Assistanat, RH, marketing, finance, juridique, service client, data, management, IT, pédagogie et plus encore : TransferAI construit une lecture métier de l'IA, pas une approche générique.`

Texte écran :
`13 domaines d'activite | Une IA pour chacun | Lecture metier`

CTA :
`Réservez votre place : [Lien d'inscription]`

### FB13 - Pas de théorie seule

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 clean social ad, confident Ivorian presenter in office, stable camera, natural premium light. Scene 1: presenter says viewer is not looking for vague AI speeches, overlay "Pas de theorie seule". Scene 2: inserts of concrete office tasks and useful outputs. Scene 3: presenter emphasizes practical demonstrations, overlay "Mise en pratique concrete". Scene 4: webinar event card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`C'est précisément l'approche TransferAI : mise en pratique concrète, pas de théorie seule. Pendant 60 minutes, nous vous montrerons 10 usages concrets pour transformer votre métier.`

Texte écran :
`Pas de theorie seule | Mise en pratique concrete | 10 usages concrets`

CTA :
`17, 18 ou 19 juillet 2026 · [Lien d'inscription]`

### FB14 - Diagnostic sur mesure

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 consulting-style Facebook ad, realistic meeting room in Abidjan, stable camera, daylight, clean professional tone. Scene 1: presenter says the real starting point is not the tool, overlay "Le point de depart, c'est votre metier". Scene 2: consultant mapping tasks on whiteboard or tablet. Scene 3: phrase "Diagnostic sur mesure" appears as presenter points to process. Scene 4: webinar CTA card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI défend une approche simple : partir de votre réalité professionnelle, identifier les tâches à fort impact, puis bâtir un diagnostic sur mesure.`

Texte écran :
`Votre metier d'abord | Diagnostic sur mesure`

CTA :
`Inscription : [Lien d'inscription]`

### FB15 - Trajectoire 90 jours

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 planning-oriented social ad, office strategy setting, stable camera, realistic lighting. Scene 1: presenter says discovering AI is good but knowing next steps is better, overlay "Et apres ?". Scene 2: calendar milestones and simple action plan. Scene 3: overlay "Trajectoire 90 jours" with confident planning visuals. Scene 4: CTA card for webinar registration. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Au-delà du webinaire, l'approche TransferAI repose sur une trajectoire 90 jours avec des étapes claires, datées et orientées résultat.`

Texte écran :
`Et apres ? | Trajectoire 90 jours | Etapes claires`

CTA :
`Réservez gratuitement votre place : [Lien d'inscription]`

### FB16 - Cas d'usage réels automatisés

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 proof-focused ad, realistic office automation visuals, stable camera, premium natural light. Scene 1: presenter says many people show mockups, overlay "Des maquettes ?". Scene 2: automation flows and actual work outputs. Scene 3: presenter answers with real operating cases, overlay "Des flux qui tournent vraiment". Scene 4: webinar CTA card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI veut faire passer le public du flou à l'opérationnel avec des cas d'usage réels automatisés, pas seulement des promesses.`

Texte écran :
`Des maquettes ? | Des flux qui tournent vraiment`

CTA :
`17, 18 ou 19 juillet 2026 · [Lien d'inscription]`

### FB17 - Gouvernance intégrée

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 trust-driven ad, serious Ivorian presenter in secure office environment, stable camera, crisp realistic daylight. Scene 1: presenter warns that AI without security or compliance is risky, overlay "La productivite sans gouvernance est un risque". Scene 2: protected files, anonymized data, compliance visuals. Scene 3: presenter says TransferAI thinks about data safety from the start, overlay "Gouvernance integree". Scene 4: final CTA card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Chez TransferAI, la gouvernance des données est pensée dès le départ. Le webinaire expliquera aussi pourquoi la productivité ne doit jamais être séparée de la protection des informations.`

Texte écran :
`Risque sans gouvernance | Gouvernance integree`

CTA :
`Inscription gratuite : [Lien d'inscription]`

### FB18 - Accompagnement

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 warm corporate social ad, trainer or consultant with professionals in workshop-style office, stable camera, soft natural light. Scene 1: presenter says what matters is not just the demo, overlay "Au-dela de la demonstration". Scene 2: supportive coaching interactions and follow-up moments. Scene 3: presenter says support continues over time, overlay "Accompagnement qui continue". Scene 4: CTA card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Ce qui fait la différence, ce n'est pas seulement la démonstration. C'est l'accompagnement qui continue. TransferAI met en avant un suivi actif et une logique de progression dans le temps.`

Texte écran :
`Au-dela de la demonstration | Accompagnement qui continue`

CTA :
`Choisissez votre date : [Lien d'inscription]`

### FB19 - Continuité vers la formation

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 pathway-style social video, polished office and training venue scenes, stable camera, realistic premium light. Scene 1: presenter says the webinar is an entry point, overlay "Une porte d'entree". Scene 2: concrete AI use cases in professional contexts. Scene 3: training room and practical workshop feeling, overlay "Puis aller plus loin". Scene 4: event CTA card. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`Ce webinaire gratuit est aussi une porte d'entrée vers la formation TransferAI "L'IA au Bureau". L'idée est simple : commencer par voir 10 usages concrets, puis aller plus loin avec des cas métier, des outils et une mise en pratique plus approfondie.`

Texte écran :
`Une porte d'entree | 10 usages concrets | Puis aller plus loin`

CTA :
`Inscription : [Lien d'inscription]`

### FB20 - Invitation finale

Format : `4:5`

Prompt Higgsfield :
`Vertical 4:5 final branded invitation video, diverse Ivorian professionals and students in realistic offices and study environments, stable camera, premium natural light, clean corporate social ad style. Scene 1: opening brand card with TransferAI Africa mention. Scene 2: montage of work situations: writing, meetings, finance, service client, marketing, study. Scene 3: presenter says the webinar helps people gain time, organize better and produce faster, overlay those three benefits. Scene 4: final clean event card with dates and free online format. physically correct motion, realistic hands and fingers, accurate eye contact, clean French text overlays, no broken anatomy, no floating objects, no overexposed skin, no garbled interface text, no duplicated people, no plastic AI look`

Voix off :
`TransferAI Africa, hub IA de NettelecomCI en Côte d'Ivoire, vous invite à un webinaire gratuit d'introduction. Objectif : vous montrer des applications réelles pour gagner du temps, mieux vous organiser et produire plus vite, sans théorie inutile.`

Texte écran :
`TransferAI Africa | Webinaire gratuit | Gagner du temps | Mieux s'organiser | Produire plus vite | 17, 18 ou 19 juillet 2026`

CTA :
`17 juillet 2026, 18 juillet 2026 ou 19 juillet 2026 · [Lien d'inscription]`

## 4. Conseils d'usage dans Higgsfield

- lancer d'abord `TT00`, `TT01`, `TT02`, `TT08` et `FB01`, car ce sont les plus larges et les plus faciles à tester
- si le rendu texte de l'IA est faible, générer la vidéo sans texte puis poser les overlays dans CapCut ou Canva
- conserver les prompts visuels tels quels, mais ajuster librement :
  - `homme` ou `femme`
  - `bureau`, `coworking`, `banque`, `salle de reunion`
  - `4:5` ou `9:16`
  - `22 seconds` ou `25 seconds`
- garder une cohérence de casting et de lumière entre plusieurs vidéos d'une même série
- remplacer `[Lien d'inscription]` dès que le lien final est disponible

## 5. Ordre recommandé de production

1. `TT00`
2. `TT01`
3. `TT02`
4. `TT04`
5. `TT08`
6. `FB01`
7. `FB09`
8. `FB20`

