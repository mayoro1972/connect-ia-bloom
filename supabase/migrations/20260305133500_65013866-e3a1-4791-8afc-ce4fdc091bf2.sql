
-- Fix security definer view: recreate with security_invoker = true
DROP VIEW IF EXISTS public.page_view_stats;
CREATE OR REPLACE VIEW public.page_view_stats 
WITH (security_invoker = true) AS
SELECT 
  COUNT(*) as total_views,
  COUNT(DISTINCT visitor_ip) as unique_visitors,
  COUNT(*) FILTER (WHERE visited_at > now() - interval '24 hours') as views_today,
  COUNT(DISTINCT visitor_ip) FILTER (WHERE visited_at > now() - interval '24 hours') as unique_today
FROM public.page_views;
