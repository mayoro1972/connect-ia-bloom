export type JobOpportunity = {
  id: string;
  slug: string;
  title: string;
  summaryFr: string;
  summaryEn: string;
  marketKey: "cote-divoire" | "africa" | "international";
  sourceName: string;
  sourceUrl: string | null;
  applyUrl: string | null;
  locationFr: string;
  locationEn: string;
  workMode: "remote" | "hybrid" | "onsite";
  opportunityType: "job" | "freelance" | "mission" | "internship";
  compensationLabel: string | null;
  publishedAt: string;
  isFeatured: boolean;
  isNewManual: boolean;
};

export const jobFeedFallback: JobOpportunity[] = [
  {
    id: "job-ai-specialist-upwork",
    slug: "ai-specialist-upwork-long-term-remote",
    title: "AI Specialist",
    summaryFr:
      "Mission freelance mondiale de plus de 30h par semaine, orientée conception, entraînement et déploiement de solutions IA et machine learning, avec potentiel d'évolution vers un contrat plus durable.",
    summaryEn:
      "Worldwide freelance role for more than 30 hours per week, focused on designing, training, and deploying AI and machine learning solutions, with potential to evolve into a longer-term engagement.",
    marketKey: "international",
    sourceName: "Upwork",
    sourceUrl: "https://www.upwork.com/freelance-jobs/apply/Specialist_~022013268796739478222/",
    applyUrl: "https://www.upwork.com/freelance-jobs/apply/Specialist_~022013268796739478222/",
    locationFr: "A distance - mondial",
    locationEn: "Remote - worldwide",
    workMode: "remote",
    opportunityType: "freelance",
    compensationLabel: "$15-$30/hour",
    publishedAt: "2026-04-17T08:00:00.000Z",
    isFeatured: true,
    isNewManual: true,
  },
  {
    id: "job-ai-expert-upwork",
    slug: "ai-expert-long-term-workflows-agents",
    title: "AI Expert - Long Term Opportunity",
    summaryFr:
      "Mission long terme sur audit de processus, automatisation métier et déploiement d'agents IA connectés à des outils comme Make, n8n, Zapier, Airtable ou Slack.",
    summaryEn:
      "Long-term opportunity focused on process audits, business automation, and deployment of AI agents connected to tools such as Make, n8n, Zapier, Airtable, or Slack.",
    marketKey: "international",
    sourceName: "Upwork",
    sourceUrl: "https://www.upwork.com/freelance-jobs/apply/Expert-Long-Term-Opportunity_~021955787603491282211/",
    applyUrl: "https://www.upwork.com/freelance-jobs/apply/Expert-Long-Term-Opportunity_~021955787603491282211/",
    locationFr: "A distance - mondial",
    locationEn: "Remote - worldwide",
    workMode: "remote",
    opportunityType: "freelance",
    compensationLabel: null,
    publishedAt: "2026-04-17T09:00:00.000Z",
    isFeatured: true,
    isNewManual: true,
  },
  {
    id: "job-ai-agent-creation-upwork",
    slug: "ai-agent-creation-ecommerce",
    title: "AI Agent Creation for E-commerce",
    summaryFr:
      "Mission freelance orientee e-commerce pour concevoir des agents IA sur support client, recommandations produits, suivi de commandes et automatisations metier.",
    summaryEn:
      "Freelance e-commerce project to design AI agents for customer support, product recommendations, order tracking, and business automations.",
    marketKey: "international",
    sourceName: "Upwork",
    sourceUrl: "https://www.upwork.com/freelance-jobs/apply/Agent-Creation_~022014062927052952383/",
    applyUrl: "https://www.upwork.com/freelance-jobs/apply/Agent-Creation_~022014062927052952383/",
    locationFr: "A distance - mondial",
    locationEn: "Remote - worldwide",
    workMode: "remote",
    opportunityType: "freelance",
    compensationLabel: "$800 fixed",
    publishedAt: "2026-04-17T10:00:00.000Z",
    isFeatured: false,
    isNewManual: true,
  },
  {
    id: "job-ai-engineer-hyperiondev",
    slug: "hyperiondev-ai-engineer-johannesburg",
    title: "AI Engineer - HyperionDev",
    summaryFr:
      "Poste axe sur des produits developpeur assistes par IA generative, avec base a Johannesburg et flexibilite hybride ou remote dans un contexte africain concret.",
    summaryEn:
      "Role focused on developer products powered by generative AI, with a Johannesburg base and hybrid or remote flexibility in a concrete African market context.",
    marketKey: "africa",
    sourceName: "Greenhouse / HyperionDev",
    sourceUrl: "https://boards.greenhouse.io/embed/job_app?token=8017819002",
    applyUrl: "https://boards.greenhouse.io/embed/job_app?token=8017819002",
    locationFr: "Johannesburg - hybride / remote",
    locationEn: "Johannesburg - hybrid / remote",
    workMode: "hybrid",
    opportunityType: "job",
    compensationLabel: null,
    publishedAt: "2026-04-12T09:00:00.000Z",
    isFeatured: false,
    isNewManual: false,
  },
];

export const sortJobFeed = (items: JobOpportunity[]) =>
  [...items].sort((left, right) => {
    const featuredDelta = Number(right.isFeatured) - Number(left.isFeatured);

    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });
