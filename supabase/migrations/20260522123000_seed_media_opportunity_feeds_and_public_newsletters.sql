grant select on table public.newsletter_issues to anon, authenticated;

drop policy if exists "Public can read sent newsletter issues" on public.newsletter_issues;
create policy "Public can read sent newsletter issues"
on public.newsletter_issues
for select
to anon, authenticated
using (status = 'sent');

insert into public.source_feeds (
  name,
  url,
  feed_type,
  publisher,
  country_focus,
  region_focus,
  domain_focus,
  language,
  trust_score,
  is_active,
  notes
)
select
  seed.name,
  seed.url,
  seed.feed_type,
  seed.publisher,
  seed.country_focus,
  seed.region_focus,
  seed.domain_focus,
  seed.language,
  seed.trust_score,
  seed.is_active,
  seed.notes
from (
  values
    (
      'OpenAI News',
      'https://openai.com/news/rss.xml',
      'rss',
      'OpenAI',
      null,
      'International',
      'IT & Transformation Digitale',
      'en',
      95,
      true,
      'Source officielle produits, recherche et annonces IA.'
    ),
    (
      'Anthropic Newsroom',
      'https://www.anthropic.com/news/rss.xml',
      'rss',
      'Anthropic',
      null,
      'International',
      'IT & Transformation Digitale',
      'en',
      93,
      true,
      'Source officielle Claude, API et sécurité.'
    ),
    (
      'Google Research Blog',
      'https://research.google/blog/rss/',
      'rss',
      'Google Research',
      null,
      'International',
      'IT & Transformation Digitale',
      'en',
      92,
      true,
      'Recherche et cas d''usage IA à traduire en impacts métier.'
    ),
    (
      'Hugging Face Blog',
      'https://huggingface.co/blog/feed.xml',
      'rss',
      'Hugging Face',
      null,
      'International',
      'IT & Transformation Digitale',
      'en',
      89,
      true,
      'Open source, agents, modèles et guides pratiques.'
    ),
    (
      'Meta AI Blog',
      'https://ai.meta.com/blog/',
      'site',
      'Meta',
      null,
      'International',
      'Médias & Création de contenu',
      'en',
      84,
      true,
      'Scraping HTML des annonces Meta AI et open models.'
    ),
    (
      'Google DeepMind Blog',
      'https://deepmind.google/discover/blog/',
      'site',
      'Google DeepMind',
      null,
      'International',
      'IT & Transformation Digitale',
      'en',
      87,
      true,
      'Percées recherche et produits DeepMind.'
    ),
    (
      'Microsoft AI Blog',
      'https://blogs.microsoft.com/ai/',
      'site',
      'Microsoft',
      null,
      'International',
      'IT & Transformation Digitale',
      'en',
      82,
      true,
      'Copilot, agents, productivité et gouvernance.'
    ),
    (
      'NVIDIA AI Blog',
      'https://blogs.nvidia.com/blog/category/generative-ai/',
      'site',
      'NVIDIA',
      null,
      'International',
      'IT & Transformation Digitale',
      'en',
      83,
      true,
      'Infrastructure IA, agents et performance.'
    ),
    (
      'Emploi.ci IA',
      'https://www.emploi.ci/emploi-intelligence-artificielle',
      'site',
      'Emploi.ci',
      'Côte d''Ivoire',
      'Afrique de l''Ouest',
      'RH & Gestion des talents',
      'fr',
      78,
      true,
      'Source locale pour opportunités IA, data et transformation digitale.'
    ),
    (
      'JobIvoire',
      'https://www.jobivoire.ci/',
      'site',
      'JobIvoire',
      'Côte d''Ivoire',
      'Afrique de l''Ouest',
      'RH & Gestion des talents',
      'fr',
      72,
      true,
      'Source complémentaire pour fonctions data, digital et support.'
    ),
    (
      'JobExpress CI',
      'https://jobexpress.ci/',
      'site',
      'JobExpress',
      'Côte d''Ivoire',
      'Afrique de l''Ouest',
      'RH & Gestion des talents',
      'fr',
      70,
      true,
      'Opportunités locales emploi et stage.'
    ),
    (
      'Emploi-Stage CI',
      'https://emploistage.ci/',
      'site',
      'Emploi-Stage',
      'Côte d''Ivoire',
      'Afrique de l''Ouest',
      'RH & Gestion des talents',
      'fr',
      69,
      true,
      'Stages et premiers débouchés à relayer vers les talents.'
    ),
    (
      'We Work Remotely AI Jobs',
      'https://weworkremotely.com/remote-jobs-artificial-intelligence-ai',
      'site',
      'We Work Remotely',
      null,
      'International',
      'RH & Gestion des talents',
      'en',
      76,
      true,
      'Veille internationale sur les rôles IA remote.'
    ),
    (
      'Remote OK AI Jobs',
      'https://remoteok.com/remote-AI-jobs',
      'site',
      'Remote OK',
      null,
      'International',
      'RH & Gestion des talents',
      'en',
      74,
      true,
      'Missions et postes IA internationaux.'
    )
) as seed (
  name,
  url,
  feed_type,
  publisher,
  country_focus,
  region_focus,
  domain_focus,
  language,
  trust_score,
  is_active,
  notes
)
where not exists (
  select 1
  from public.source_feeds existing
  where existing.url = seed.url
);
