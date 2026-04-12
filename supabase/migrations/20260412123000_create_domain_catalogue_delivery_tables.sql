create table if not exists public.domain_catalogue_assets (
  id uuid primary key default gen_random_uuid(),
  domain_key text not null unique,
  domain_label_fr text not null,
  domain_label_en text not null,
  slug text not null unique,
  version text not null default '2026-04-12',
  html_url text not null,
  pdf_url text not null,
  docx_url text not null,
  page_url text not null,
  html_path text not null,
  pdf_path text not null,
  docx_path text not null,
  course_count integer not null default 0,
  certification_slug text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalogue_delivery_logs (
  id uuid primary key default gen_random_uuid(),
  contact_request_id uuid references public.contact_requests(id) on delete cascade,
  domain_key text not null,
  recipient_email text not null,
  delivery_channel text not null default 'email',
  asset_id uuid references public.domain_catalogue_assets(id) on delete set null,
  status text not null default 'queued',
  delivery_context jsonb not null default '{}'::jsonb,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_domain_catalogue_assets_domain_key
  on public.domain_catalogue_assets(domain_key);

create index if not exists idx_catalogue_delivery_logs_contact_request
  on public.catalogue_delivery_logs(contact_request_id);

create index if not exists idx_catalogue_delivery_logs_domain_key
  on public.catalogue_delivery_logs(domain_key);

create index if not exists idx_catalogue_delivery_logs_status
  on public.catalogue_delivery_logs(status);

create or replace function public.set_domain_catalogue_assets_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_domain_catalogue_assets_updated_at on public.domain_catalogue_assets;

create trigger trg_domain_catalogue_assets_updated_at
before update on public.domain_catalogue_assets
for each row
execute function public.set_domain_catalogue_assets_updated_at();

insert into public.domain_catalogue_assets (
  domain_key,
  domain_label_fr,
  domain_label_en,
  slug,
  html_url,
  pdf_url,
  docx_url,
  page_url,
  html_path,
  pdf_path,
  docx_path,
  course_count,
  certification_slug
)
values
  ('assistanat-et-secretariat', 'Assistanat & Secretariat', 'Executive Assistance & Secretariat', 'assistanat-et-secretariat', '/catalogues-domaines-assets/assistanat-et-secretariat/catalogue.html', '/catalogues-domaines-assets/assistanat-et-secretariat/catalogue.pdf', '/catalogues-domaines-assets/assistanat-et-secretariat/catalogue.docx', '/catalogues-domaines/assistanat-et-secretariat', 'catalogues-domaines-assets/assistanat-et-secretariat/catalogue.html', 'catalogues-domaines-assets/assistanat-et-secretariat/catalogue.pdf', 'catalogues-domaines-assets/assistanat-et-secretariat/catalogue.docx', 10, 'executive-support'),
  ('ressources-humaines', 'Ressources Humaines', 'Human Resources', 'ressources-humaines', '/catalogues-domaines-assets/ressources-humaines/catalogue.html', '/catalogues-domaines-assets/ressources-humaines/catalogue.pdf', '/catalogues-domaines-assets/ressources-humaines/catalogue.docx', '/catalogues-domaines/ressources-humaines', 'catalogues-domaines-assets/ressources-humaines/catalogue.html', 'catalogues-domaines-assets/ressources-humaines/catalogue.pdf', 'catalogues-domaines-assets/ressources-humaines/catalogue.docx', 10, 'human-resources'),
  ('marketing-et-communication', 'Marketing & Communication', 'Marketing & Communication', 'marketing-et-communication', '/catalogues-domaines-assets/marketing-et-communication/catalogue.html', '/catalogues-domaines-assets/marketing-et-communication/catalogue.pdf', '/catalogues-domaines-assets/marketing-et-communication/catalogue.docx', '/catalogues-domaines/marketing-et-communication', 'catalogues-domaines-assets/marketing-et-communication/catalogue.html', 'catalogues-domaines-assets/marketing-et-communication/catalogue.pdf', 'catalogues-domaines-assets/marketing-et-communication/catalogue.docx', 10, 'marketing-communication'),
  ('finance-et-comptabilite', 'Finance & Comptabilite', 'Finance & Accounting', 'finance-et-comptabilite', '/catalogues-domaines-assets/finance-et-comptabilite/catalogue.html', '/catalogues-domaines-assets/finance-et-comptabilite/catalogue.pdf', '/catalogues-domaines-assets/finance-et-comptabilite/catalogue.docx', '/catalogues-domaines/finance-et-comptabilite', 'catalogues-domaines-assets/finance-et-comptabilite/catalogue.html', 'catalogues-domaines-assets/finance-et-comptabilite/catalogue.pdf', 'catalogues-domaines-assets/finance-et-comptabilite/catalogue.docx', 10, 'finance-accounting'),
  ('juridique-et-conformite', 'Juridique & Conformite', 'Legal & Compliance', 'juridique-et-conformite', '/catalogues-domaines-assets/juridique-et-conformite/catalogue.html', '/catalogues-domaines-assets/juridique-et-conformite/catalogue.pdf', '/catalogues-domaines-assets/juridique-et-conformite/catalogue.docx', '/catalogues-domaines/juridique-et-conformite', 'catalogues-domaines-assets/juridique-et-conformite/catalogue.html', 'catalogues-domaines-assets/juridique-et-conformite/catalogue.pdf', 'catalogues-domaines-assets/juridique-et-conformite/catalogue.docx', 10, 'legal-compliance'),
  ('service-client', 'Service Client', 'Customer Service', 'service-client', '/catalogues-domaines-assets/service-client/catalogue.html', '/catalogues-domaines-assets/service-client/catalogue.pdf', '/catalogues-domaines-assets/service-client/catalogue.docx', '/catalogues-domaines/service-client', 'catalogues-domaines-assets/service-client/catalogue.html', 'catalogues-domaines-assets/service-client/catalogue.pdf', 'catalogues-domaines-assets/service-client/catalogue.docx', 10, 'customer-service'),
  ('data-analyse', 'Data & Analyse', 'Data & Analytics', 'data-analyse', '/catalogues-domaines-assets/data-analyse/catalogue.html', '/catalogues-domaines-assets/data-analyse/catalogue.pdf', '/catalogues-domaines-assets/data-analyse/catalogue.docx', '/catalogues-domaines/data-analyse', 'catalogues-domaines-assets/data-analyse/catalogue.html', 'catalogues-domaines-assets/data-analyse/catalogue.pdf', 'catalogues-domaines-assets/data-analyse/catalogue.docx', 10, 'data-analytics'),
  ('administration-et-gestion', 'Administration & Gestion', 'Administration & Operations', 'administration-et-gestion', '/catalogues-domaines-assets/administration-et-gestion/catalogue.html', '/catalogues-domaines-assets/administration-et-gestion/catalogue.pdf', '/catalogues-domaines-assets/administration-et-gestion/catalogue.docx', '/catalogues-domaines/administration-et-gestion', 'catalogues-domaines-assets/administration-et-gestion/catalogue.html', 'catalogues-domaines-assets/administration-et-gestion/catalogue.pdf', 'catalogues-domaines-assets/administration-et-gestion/catalogue.docx', 10, 'administration-operations'),
  ('management-et-leadership', 'Management & Leadership', 'Management & Leadership', 'management-et-leadership', '/catalogues-domaines-assets/management-et-leadership/catalogue.html', '/catalogues-domaines-assets/management-et-leadership/catalogue.pdf', '/catalogues-domaines-assets/management-et-leadership/catalogue.docx', '/catalogues-domaines/management-et-leadership', 'catalogues-domaines-assets/management-et-leadership/catalogue.html', 'catalogues-domaines-assets/management-et-leadership/catalogue.pdf', 'catalogues-domaines-assets/management-et-leadership/catalogue.docx', 10, 'management-leadership'),
  ('it-et-transformation-digitale', 'IT & Transformation Digitale', 'IT & Digital Transformation', 'it-et-transformation-digitale', '/catalogues-domaines-assets/it-et-transformation-digitale/catalogue.html', '/catalogues-domaines-assets/it-et-transformation-digitale/catalogue.pdf', '/catalogues-domaines-assets/it-et-transformation-digitale/catalogue.docx', '/catalogues-domaines/it-et-transformation-digitale', 'catalogues-domaines-assets/it-et-transformation-digitale/catalogue.html', 'catalogues-domaines-assets/it-et-transformation-digitale/catalogue.pdf', 'catalogues-domaines-assets/it-et-transformation-digitale/catalogue.docx', 10, 'it-digital-transformation'),
  ('formation-et-pedagogie', 'Formation & Pedagogie', 'Learning & Instructional Design', 'formation-et-pedagogie', '/catalogues-domaines-assets/formation-et-pedagogie/catalogue.html', '/catalogues-domaines-assets/formation-et-pedagogie/catalogue.pdf', '/catalogues-domaines-assets/formation-et-pedagogie/catalogue.docx', '/catalogues-domaines/formation-et-pedagogie', 'catalogues-domaines-assets/formation-et-pedagogie/catalogue.html', 'catalogues-domaines-assets/formation-et-pedagogie/catalogue.pdf', 'catalogues-domaines-assets/formation-et-pedagogie/catalogue.docx', 10, 'learning-pedagogy'),
  ('sante-et-bien-etre', 'Sante & Bien-etre', 'Health & Workplace Well-being', 'sante-et-bien-etre', '/catalogues-domaines-assets/sante-et-bien-etre/catalogue.html', '/catalogues-domaines-assets/sante-et-bien-etre/catalogue.pdf', '/catalogues-domaines-assets/sante-et-bien-etre/catalogue.docx', '/catalogues-domaines/sante-et-bien-etre', 'catalogues-domaines-assets/sante-et-bien-etre/catalogue.html', 'catalogues-domaines-assets/sante-et-bien-etre/catalogue.pdf', 'catalogues-domaines-assets/sante-et-bien-etre/catalogue.docx', 10, 'health-wellbeing'),
  ('diplomatie-et-affaires-internationales', 'Diplomatie & Affaires Internationales', 'Diplomacy & International Affairs', 'diplomatie-et-affaires-internationales', '/catalogues-domaines-assets/diplomatie-et-affaires-internationales/catalogue.html', '/catalogues-domaines-assets/diplomatie-et-affaires-internationales/catalogue.pdf', '/catalogues-domaines-assets/diplomatie-et-affaires-internationales/catalogue.docx', '/catalogues-domaines/diplomatie-et-affaires-internationales', 'catalogues-domaines-assets/diplomatie-et-affaires-internationales/catalogue.html', 'catalogues-domaines-assets/diplomatie-et-affaires-internationales/catalogue.pdf', 'catalogues-domaines-assets/diplomatie-et-affaires-internationales/catalogue.docx', 10, 'diplomacy-international-affairs')
on conflict (domain_key) do update set
  domain_label_fr = excluded.domain_label_fr,
  domain_label_en = excluded.domain_label_en,
  slug = excluded.slug,
  version = excluded.version,
  html_url = excluded.html_url,
  pdf_url = excluded.pdf_url,
  docx_url = excluded.docx_url,
  page_url = excluded.page_url,
  html_path = excluded.html_path,
  pdf_path = excluded.pdf_path,
  docx_path = excluded.docx_path,
  course_count = excluded.course_count,
  certification_slug = excluded.certification_slug,
  updated_at = now();
