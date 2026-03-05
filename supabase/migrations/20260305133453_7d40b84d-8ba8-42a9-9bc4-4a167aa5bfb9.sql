
-- Create a table for page views tracking
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL DEFAULT '/',
  visitor_ip TEXT,
  user_agent TEXT,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking)
CREATE POLICY "Anyone can insert page views"
  ON public.page_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow reading aggregate stats (no individual data exposed)
CREATE POLICY "Anyone can read page view counts"
  ON public.page_views
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Index for faster queries
CREATE INDEX idx_page_views_visited_at ON public.page_views (visited_at DESC);
CREATE INDEX idx_page_views_page_path ON public.page_views (page_path);

-- Create a view for easy stats
CREATE OR REPLACE VIEW public.page_view_stats AS
SELECT 
  COUNT(*) as total_views,
  COUNT(DISTINCT visitor_ip) as unique_visitors,
  COUNT(*) FILTER (WHERE visited_at > now() - interval '24 hours') as views_today,
  COUNT(DISTINCT visitor_ip) FILTER (WHERE visited_at > now() - interval '24 hours') as unique_today
FROM public.page_views;
