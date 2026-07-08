-- Le vrai workflow n8n "TransferAI — Support IT Intelligent" (actif depuis le 17/05/2026,
-- voir docs/transferai-admin/150_n8n_Support_IT_Intelligent_REEL_Corrige_08juillet2026.json)
-- envoie un email de résolution/accusé directement à l'utilisateur : nom, email et
-- département sont donc désormais requis par la page de démo, pas seulement titre/description.

ALTER TABLE public.it_support_demo_tickets
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS requester_email text,
  ADD COLUMN IF NOT EXISTS department text,
  ADD COLUMN IF NOT EXISTS n8n_ticket_id text;
