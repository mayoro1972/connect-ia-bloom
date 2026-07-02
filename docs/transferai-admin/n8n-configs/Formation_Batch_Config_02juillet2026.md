# Formation Batch Scheduler — 30/jour
**ID workflow n8n :** `SEf9Qhy5XoQQuUPe`  
**Mis à jour :** 02 juillet 2026

## Corrections appliquées le 02/07/2026
1. **URL invalide** : `={'https://...'}` → URL directe sans wrapper expression JS
2. **Filtre Supabase** : `do_not_contact=is.false` → `do_not_contact=not.is.true` (inclut les NULL)
3. **Heure cron** : `0 9 * * *` = 9h serveur UTC+1 = **8h00 Abidjan**

## Configuration actuelle
- Cron : `0 9 * * *` (9h serveur = 8h Abidjan)
- Filtre : `campaign_type=eq.formation_juillet&status=not.in.(sent,paused,do_not_contact)&do_not_contact=not.is.true`
- Limite : 30 prospects/jour (order=created_at.asc)
- Webhook trigger V3 : `https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/formation-batch-trigger-v3`

## Historique
- 01/07/2026 : 0 envois (erreur silencieuse — URL cassée)
- 02/07/2026 : 0 envois (même erreur, URL pas encore corrigée)
- 03/07/2026 : prévu 30 envois à 8h Abidjan ✅
