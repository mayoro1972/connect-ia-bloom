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
    id: "unicef-academia-4-sbc-nairobi",
    slug: "unicef-academia-4-sbc-parenting-hub-kenya",
    title: "Digital Platforms: Academia 4 SBC and Parenting Hub consultancy",
    summaryFr:
      "Consultance UNICEF basée à Nairobi et à distance pour créer une plateforme reliant les universités africaines, avec un angle sur le partage de ressources, la pédagogie et la montée en compétences.",
    summaryEn:
      "UNICEF consultancy based in Nairobi and remote to build a platform connecting African universities, with an angle on shared resources, pedagogy and skills development.",
    marketKey: "africa",
    sourceName: "UNICEF Careers",
    sourceUrl:
      "https://jobs.unicef.org/en-us/job/593037/digital-platforms-academia-4-sbc-and-parenting-hub-consultancy-global-programme-division-gpd-sbc11-months-coe-nairobi-kenya-remote-593037",
    applyUrl:
      "https://jobs.unicef.org/en-us/job/593037/digital-platforms-academia-4-sbc-and-parenting-hub-consultancy-global-programme-division-gpd-sbc11-months-coe-nairobi-kenya-remote-593037",
    locationFr: "Nairobi, Kenya (remote)",
    locationEn: "Nairobi, Kenya (remote)",
    workMode: "remote",
    opportunityType: "freelance",
    compensationLabel: null,
    publishedAt: "2026-05-14T00:00:00.000Z",
    isFeatured: true,
    isNewManual: true,
  },
  {
    id: "unicef-behavioural-data-science-kenya",
    slug: "unicef-behavioural-data-science-kenya",
    title: "Behavioural Data Science Consultant, GPD/Social and Behaviour Change, 11 months, CoE Nairobi, Kenya (Remote)",
    summaryFr:
      "Consultance data science et comportementale pour soutenir un projet UNICEF en Ouganda et au Kenya, avec traitement de texte à grande échelle, NLP, expérimentation et usage d'IA/LLM.",
    summaryEn:
      "Data science and behavioural consultancy supporting a UNICEF project in Uganda and Kenya, including large-scale text processing, NLP, experimentation and AI/LLM use.",
    marketKey: "africa",
    sourceName: "UNICEF Careers",
    sourceUrl: "https://jobs.unicef.org/en-us/job/593159",
    applyUrl: "https://jobs.unicef.org/en-us/job/593159",
    locationFr: "Kenya (remote)",
    locationEn: "Kenya (remote)",
    workMode: "remote",
    opportunityType: "freelance",
    compensationLabel: null,
    publishedAt: "2026-05-19T00:00:00.000Z",
    isFeatured: true,
    isNewManual: true,
  },
  {
    id: "unicef-digital-impact-ai-apps-valencia",
    slug: "unicef-digital-impact-ai-applications-developer-valencia",
    title: "Digital Impact Officer (AI Applications Developer)",
    summaryFr:
      "Poste fixe pour concevoir, tester, déployer et maintenir des applications et services d'IA au sein de la division Digital Impact de l'UNICEF.",
    summaryEn:
      "Fixed-term role to design, test, deploy and maintain AI-powered applications and services within UNICEF's Digital Impact division.",
    marketKey: "international",
    sourceName: "UNICEF Careers",
    sourceUrl: "https://jobs.unicef.org/en-us/job/593075/",
    applyUrl: "https://jobs.unicef.org/en-us/job/593075/",
    locationFr: "Valence, Espagne",
    locationEn: "Valencia, Spain",
    workMode: "onsite",
    opportunityType: "job",
    compensationLabel: null,
    publishedAt: "2026-05-19T00:00:00.000Z",
    isFeatured: true,
    isNewManual: true,
  },
  {
    id: "unicef-ai-practice-training-material-south-asia",
    slug: "unicef-ai-practice-training-material-south-asia",
    title: "Individual Consultant: Artificial Intelligence (AI) Practice Training Material",
    summaryFr:
      "Consultance à distance pour produire un paquet de formation IA de 72 heures avec prototypes, notebooks, datasets et un angle politique et opérationnel.",
    summaryEn:
      "Remote consultancy to produce a 72-hour AI training package with prototypes, notebooks, datasets and a policy-and-operations angle.",
    marketKey: "international",
    sourceName: "UNICEF Careers",
    sourceUrl:
      "https://jobs.unicef.org/fr/job/588461/individual-consultant-artificial-intelligence-ai-practice-training-material-unicef-regional-office-for-south-asia-remote-till-30-june-2026",
    applyUrl:
      "https://jobs.unicef.org/fr/job/588461/individual-consultant-artificial-intelligence-ai-practice-training-material-unicef-regional-office-for-south-asia-remote-till-30-june-2026",
    locationFr: "Népal (remote)",
    locationEn: "Nepal (remote)",
    workMode: "remote",
    opportunityType: "freelance",
    compensationLabel: null,
    publishedAt: "2025-12-15T00:00:00.000Z",
    isFeatured: false,
    isNewManual: true,
  },
  {
    id: "unesco-digital-business-solutions-internship",
    slug: "unesco-digital-business-solutions-internship",
    title: "INTERNSHIP: Digital Business Solutions",
    summaryFr:
      "Stage UNESCO orienté infrastructure digitale, cybersécurité, automatisation et support à des modèles IA/GAI en environnement multilingue.",
    summaryEn:
      "UNESCO internship focused on digital infrastructure, cybersecurity, automation and support for AI/GAI models in a multilingual environment.",
    marketKey: "international",
    sourceName: "UNESCO Careers",
    sourceUrl: "https://careers.unesco.org/job/Multiple-INTERNSHIP-Digital-Business-Solutions-1/1347770857/",
    applyUrl: "https://careers.unesco.org/job/Multiple-INTERNSHIP-Digital-Business-Solutions-1/1347770857/",
    locationFr: "Paris ou remote",
    locationEn: "Paris or remote",
    workMode: "remote",
    opportunityType: "internship",
    compensationLabel: null,
    publishedAt: "2026-05-01T00:00:00.000Z",
    isFeatured: false,
    isNewManual: true,
  },
  {
    id: "unesco-applied-ai-research-scientist",
    slug: "unesco-applied-ai-associate-research-scientist",
    title: "Associate Research Scientist (Applied AI)",
    summaryFr:
      "Poste UNESCO/ICTP en AI appliquée à Trieste, utile pour les profils data et recherche qui veulent travailler sur des systèmes IA avancés.",
    summaryEn:
      "UNESCO/ICTP applied AI role in Trieste, relevant for data and research profiles working on advanced AI systems.",
    marketKey: "international",
    sourceName: "UNESCO Careers",
    sourceUrl: "https://careers.unesco.org/job/Trieste-Associate-Research-Scientist-%28Applied-AI%29/1359193257/",
    applyUrl: "https://careers.unesco.org/job/Trieste-Associate-Research-Scientist-%28Applied-AI%29/1359193257/",
    locationFr: "Trieste, Italie",
    locationEn: "Trieste, Italy",
    workMode: "onsite",
    opportunityType: "job",
    compensationLabel: null,
    publishedAt: "2026-05-20T00:00:00.000Z",
    isFeatured: false,
    isNewManual: true,
  },
  {
    id: "unesco-digital-technologies-iraq",
    slug: "unesco-digital-technologies-iraqi-education-system",
    title: "Individual Consultant - Integration of Digital Technologies into the Iraqi Education system",
    summaryFr:
      "Consultance UNESCO pour intégrer des outils numériques et des fonctionnalités IA dans l'éducation secondaire en Irak.",
    summaryEn:
      "UNESCO consultancy to integrate digital tools and AI-enabled features into secondary education in Iraq.",
    marketKey: "international",
    sourceName: "UNESCO Careers",
    sourceUrl: "https://careers.unesco.org/job/Baghdad-Individual-Consultant-Integration-of-Digital-Technologies-into-the-Iraqi-Education-system/1360539457/",
    applyUrl: "https://careers.unesco.org/job/Baghdad-Individual-Consultant-Integration-of-Digital-Technologies-into-the-Iraqi-Education-system/1360539457/",
    locationFr: "Bagdad, Irak (remote)",
    locationEn: "Baghdad, Iraq (remote)",
    workMode: "remote",
    opportunityType: "freelance",
    compensationLabel: null,
    publishedAt: "2026-05-22T00:00:00.000Z",
    isFeatured: false,
    isNewManual: true,
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
