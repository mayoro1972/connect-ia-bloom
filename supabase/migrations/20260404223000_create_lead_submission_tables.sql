CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  sector TEXT,
  city TEXT,
  participants INTEGER,
  requested_formations TEXT,
  message TEXT,
  source_page TEXT NOT NULL DEFAULT '/contact',
  language TEXT NOT NULL DEFAULT 'fr',
  CONSTRAINT contact_requests_participants_check
    CHECK (participants IS NULL OR participants > 0)
);

CREATE TABLE public.registration_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  position TEXT,
  formation_id TEXT,
  formation_title TEXT NOT NULL,
  participants INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  source_page TEXT NOT NULL DEFAULT '/inscription',
  language TEXT NOT NULL DEFAULT 'fr',
  CONSTRAINT registration_requests_participants_check
    CHECK (participants > 0)
);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact requests"
  ON public.contact_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can insert registration requests"
  ON public.registration_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
