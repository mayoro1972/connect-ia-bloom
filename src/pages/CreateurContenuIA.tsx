import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  ExternalLink,
  Mail,
  MapPin,
  Mic,
  Music2,
  Newspaper,
  Radar,
  Sparkles,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildContactPath } from "@/lib/site-links";
import { isResourceNew } from "@/lib/resource-feed";
import { useResourceFeed } from "@/hooks/useResourceFeed";
import { useJobFeed } from "@/hooks/useJobFeed";

const creatorHubCopy = {
  fr: {
    title: "Media, veille & opportunites IA",
    subtitle:
      "Le hub éditorial pour apprendre l'IA, suivre les nouveautés utiles, nourrir la newsletter et faire remonter les opportunités qui comptent pour l'Afrique et la Côte d'Ivoire.",
    missionTitle: "Notre mission : transformer l'IA en avantage concret",
    missionDesc:
      "Nous ne publions pas du contenu pour faire joli. Nous construisons un média utile pour les professionnels, étudiants, entrepreneurs et talents africains qui veulent gagner du temps, trouver des cas d'usage métier, comprendre les nouveautés IA et accéder plus vite aux opportunités de formation et d'emploi.",
    growthTitle: "Le moteur éditorial pour viser une forte audience qualifiée",
    growthItems: [
      {
        title: "Newsletter métier hebdomadaire",
        desc: "Chaque semaine : 3 outils utiles, 3 prompts actionnables, 1 cas d'usage africain, 1 nouveauté IA importante et 1 opportunité à surveiller.",
      },
      {
        title: "Micro-contenus à forte portée",
        desc: "TikTok et Shorts orientés résultats : astuces en 30 à 60 secondes, avant/après, workflows simples et appels à l'action vers la newsletter.",
      },
      {
        title: "Veille IA Afrique + emploi",
        desc: "Une veille ciblée sur ce qui peut réellement impacter la Côte d'Ivoire, les secteurs africains clés et les missions freelance ou jobs liés à l'IA.",
      },
    ],
    channelsTitle: "Les canaux à privilégier pour attirer et retenir",
    channels: [
      {
        title: "YouTube",
        desc: "Tutoriels métier, démonstrations complètes, décryptages d'outils et cas d'usage détaillés pour les 13 secteurs clés.",
        frequency: "2 vidéos / semaine",
        icon: Youtube,
        color: "text-[#FF0000]",
        bg: "bg-[#FF0000]/10",
      },
      {
        title: "TikTok",
        desc: "Hooks puissants, astuces concrètes, formats courts à forte viralité pour capter les nouveaux visiteurs et les renvoyer vers le site.",
        frequency: "5 capsules / semaine",
        icon: Music2,
        color: "text-[#ff0050]",
        bg: "bg-[#ff0050]/10",
      },
      {
        title: "Newsletter",
        desc: "Le format le plus rentable pour former dans le day-to-day job : outils, prompts, modèles, liens utiles, veille et opportunités.",
        frequency: "1 édition / semaine",
        icon: Mail,
        color: "text-[hsl(174,70%,42%)]",
        bg: "bg-[hsl(174,70%,42%)]/10",
      },
      {
        title: "Podcast",
        desc: "Paroles de terrain, diaspora, dirigeants et recruteurs pour donner de la profondeur et créer la confiance autour de la marque.",
        frequency: "2 épisodes / mois",
        icon: Mic,
        color: "text-[hsl(145,65%,42%)]",
        bg: "bg-[hsl(145,65%,42%)]/10",
      },
      {
        title: "Veille IA & opportunités",
        desc: "Rubrique vivante pour pousser les nouveautés, les usages qui comptent pour l'Afrique et les opportunités emploi/freelance les plus pertinentes.",
        frequency: "mise à jour continue",
        icon: Radar,
        color: "text-primary",
        bg: "bg-primary/10",
      },
    ],
    recentTitle: "Contenus récents et signaux à forte valeur",
    recentBadge: "Flux dynamique",
    newBadge: "Nouveau",
    sourceLabel: "Source",
    jobsTitle: "Emploi IA & opportunités",
    jobsSubtitle:
      "Une rubrique pensée pour aider tes apprenants à voir le marché, repérer les offres pertinentes et demander une mise en relation quand cela a du sens.",
    jobsStats: {
      total: "Opportunités publiées",
      ci: "Côte d'Ivoire",
      africa: "Afrique",
      intl: "International",
      sources: "Sources à suivre",
    },
    jobSources: [
      { label: "Sites emploi ivoiriens", href: "https://www.jobafrique.com/" },
      { label: "Plateformes Afrique francophone", href: "https://www.jobafrique.com/" },
      { label: "Upwork", href: "https://www.upwork.com/" },
      { label: "Fiverr", href: "https://www.fiverr.com/" },
      { label: "PeoplePerHour", href: "https://www.peopleperhour.com/" },
      { label: "Veille missions remote IA", href: "https://remotive.com/remote-jobs/software-dev" },
    ],
    jobsEmptyTitle: "La veille emploi IA est prête à être alimentée",
    jobsEmptyDesc:
      "La structure est en place pour publier des offres filtrées, qualifiées et orientées IA. Dès qu'une source est branchée ou qu'une veille manuelle est publiée, cette section devient active.",
    jobsLoading: "Chargement des opportunités...",
    jobsWorkMode: {
      remote: "Remote",
      hybrid: "Hybride",
      onsite: "Présentiel",
    },
    jobsType: {
      job: "Emploi",
      freelance: "Freelance",
      mission: "Mission",
      internship: "Stage",
    },
    jobsSourceLabel: "Plateforme",
    jobsApply: "Voir l'offre",
    jobsContact: "Demander une mise en relation",
    ctaTitle: "Construire la communauté, former et ouvrir des débouchés",
    ctaDesc:
      "Nous pouvons faire de cette rubrique un vrai moteur d'acquisition et de transformation: contenus dynamiques, veille sectorielle, opportunités emploi et contact direct pour la mise en relation.",
    ctaPrimary: "Recevoir la newsletter",
    ctaSecondary: "Parler emploi & mise en relation",
  },
  en: {
    title: "Media, watch & AI opportunities",
    subtitle:
      "The editorial hub to learn AI, track useful updates, power the newsletter and surface the opportunities that matter for Africa and Côte d'Ivoire.",
    missionTitle: "Our mission: turn AI into concrete advantage",
    missionDesc:
      "We do not publish content for vanity. We are building a useful media layer for professionals, students, entrepreneurs and African talent who want to save time, find business use cases, understand what is new in AI and access training and job opportunities faster.",
    growthTitle: "The editorial engine to build a large qualified audience",
    growthItems: [
      {
        title: "Weekly job-focused newsletter",
        desc: "Every week: 3 useful tools, 3 actionable prompts, 1 African use case, 1 important AI update and 1 opportunity worth tracking.",
      },
      {
        title: "High-reach short-form content",
        desc: "TikTok and Shorts focused on outcomes: 30 to 60 second tips, before/after examples, simple workflows and calls to action back to the newsletter.",
      },
      {
        title: "Africa + jobs AI watch",
        desc: "A focused watch on what can truly impact Côte d'Ivoire, key African sectors and freelance or job opportunities related to AI.",
      },
    ],
    channelsTitle: "Channels to prioritize for reach and retention",
    channels: [
      {
        title: "YouTube",
        desc: "Business tutorials, full demonstrations, tool breakdowns and detailed use cases for the 13 key sectors.",
        frequency: "2 videos / week",
        icon: Youtube,
        color: "text-[#FF0000]",
        bg: "bg-[#FF0000]/10",
      },
      {
        title: "TikTok",
        desc: "Strong hooks, practical tips and short-form pieces designed to attract new visitors and send them back to the site.",
        frequency: "5 posts / week",
        icon: Music2,
        color: "text-[#ff0050]",
        bg: "bg-[#ff0050]/10",
      },
      {
        title: "Newsletter",
        desc: "The highest-value format to teach daily-job AI: tools, prompts, templates, links, watch updates and opportunities.",
        frequency: "1 issue / week",
        icon: Mail,
        color: "text-[hsl(174,70%,42%)]",
        bg: "bg-[hsl(174,70%,42%)]/10",
      },
      {
        title: "Podcast",
        desc: "Ground-level conversations with diaspora experts, hiring managers and practitioners to build trust and depth around the brand.",
        frequency: "2 episodes / month",
        icon: Mic,
        color: "text-[hsl(145,65%,42%)]",
        bg: "bg-[hsl(145,65%,42%)]/10",
      },
      {
        title: "AI watch & opportunities",
        desc: "A live section to push important updates, Africa-relevant use cases and the most relevant AI jobs and freelance opportunities.",
        frequency: "continuous updates",
        icon: Radar,
        color: "text-primary",
        bg: "bg-primary/10",
      },
    ],
    recentTitle: "Recent content and high-value signals",
    recentBadge: "Dynamic feed",
    newBadge: "New",
    sourceLabel: "Source",
    jobsTitle: "AI jobs & opportunities",
    jobsSubtitle:
      "A section designed to help your learners understand the market, spot relevant opportunities and request warm introductions when appropriate.",
    jobsStats: {
      total: "Published opportunities",
      ci: "Côte d'Ivoire",
      africa: "Africa",
      intl: "International",
      sources: "Sources to monitor",
    },
    jobSources: [
      { label: "Ivorian job boards", href: "https://www.jobafrique.com/" },
      { label: "Francophone African platforms", href: "https://www.jobafrique.com/" },
      { label: "Upwork", href: "https://www.upwork.com/" },
      { label: "Fiverr", href: "https://www.fiverr.com/" },
      { label: "PeoplePerHour", href: "https://www.peopleperhour.com/" },
      { label: "Remote AI mission watch", href: "https://remotive.com/remote-jobs/software-dev" },
    ],
    jobsEmptyTitle: "The AI jobs watch is ready to be populated",
    jobsEmptyDesc:
      "The structure is in place to publish filtered, qualified and AI-focused roles. As soon as a source is connected or a manual watch entry is published, this section becomes active.",
    jobsLoading: "Loading opportunities...",
    jobsWorkMode: {
      remote: "Remote",
      hybrid: "Hybrid",
      onsite: "On-site",
    },
    jobsType: {
      job: "Job",
      freelance: "Freelance",
      mission: "Mission",
      internship: "Internship",
    },
    jobsSourceLabel: "Platform",
    jobsApply: "View role",
    jobsContact: "Request an introduction",
    ctaTitle: "Build the community, train people and open career paths",
    ctaDesc:
      "We can turn this section into a true acquisition and conversion engine: dynamic content, sector watch, job opportunities and direct contact for introductions.",
    ctaPrimary: "Get the newsletter",
    ctaSecondary: "Talk jobs & introductions",
  },
} as const;

const resourceCategoryColors = {
  "expertise-ai": "text-primary",
  guides: "text-coral",
  "case-studies": "text-destructive",
  veille: "text-[hsl(145,65%,42%)]",
} as const;

const CreateurContenuIA = () => {
  const { language, t } = useLanguage();
  const copy = creatorHubCopy[language === "en" ? "en" : "fr"];
  const { items: resources } = useResourceFeed();
  const { items: jobs, stats: jobStats, isLoading: jobsLoading } = useJobFeed();
  const highlightedResources = resources.slice(0, 6);
  const highlightedJobs = jobs.slice(0, 6);

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const jobSourceCount = copy.jobSources.length;
  const emploiContactLink = buildContactPath("demande-renseignement", "Emploi IA");
  const newsletterContactLink = buildContactPath("demande-renseignement", "Newsletter IA");

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={copy.title} subtitle={copy.subtitle} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto mb-16 max-w-4xl text-center">
              <Sparkles size={40} className="text-primary mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{copy.missionTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">{copy.missionDesc}</p>
            </div>

            <div className="mb-16 rounded-[28px] border border-primary/10 bg-[linear-gradient(135deg,hsl(225_48%_14%),hsl(226_40%_10%))] p-8 md:p-10">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: "hsl(0 0% 98%)" }}>
                {copy.growthTitle}
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {copy.growthItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <h3 className="font-heading text-lg font-semibold mb-2" style={{ color: "hsl(0 0% 98%)" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "hsl(210 20% 78%)" }}>
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">{copy.channelsTitle}</h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6 mb-16">
              {copy.channels.map((channel, index) => (
                <motion.div
                  key={channel.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-card border border-border rounded-xl p-6 hover-lift"
                >
                  <div className={`w-12 h-12 rounded-xl ${channel.bg} flex items-center justify-center mb-4`}>
                    <channel.icon size={24} className={channel.color} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-card-foreground mb-2">{channel.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{channel.desc}</p>
                  <span className="text-xs text-muted-foreground">{channel.frequency}</span>
                </motion.div>
              ))}
            </div>

            <div className="mb-16">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-heading text-2xl font-bold text-foreground">{copy.recentTitle}</h2>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  <Newspaper size={14} />
                  {copy.recentBadge}
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {highlightedResources.map((resource, index) => {
                  const title = language === "en" ? resource.titleEn : resource.titleFr;
                  const excerpt = language === "en" ? resource.excerptEn : resource.excerptFr;
                  const categoryLabel = t(`blog.categories.${resource.categoryKey}`);
                  const sourceUrl = resource.sourceUrl;
                  const recent = isResourceNew(resource.publishedAt, resource.isNewManual);

                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="bg-card border border-border rounded-xl p-5 hover-lift h-full">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`text-xs font-bold ${resourceCategoryColors[resource.categoryKey] || "text-primary"}`}>
                            {categoryLabel}
                          </span>
                          {recent ? (
                            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primary-foreground">
                              {copy.newBadge}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="font-heading font-semibold text-base text-card-foreground mb-2">{title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{excerpt}</p>
                        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                          <span>{formatDate(resource.publishedAt)}</span>
                          <div className="flex items-center gap-2">
                            {resource.sourceName ? <span>{copy.sourceLabel}: {resource.sourceName}</span> : null}
                            {sourceUrl ? (
                              <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-primary hover:opacity-80">
                                <ExternalLink size={14} />
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mb-16">
              <div className="mb-8">
                <h2 className="font-heading text-2xl font-bold text-foreground">{copy.jobsTitle}</h2>
                <p className="mt-3 text-muted-foreground lg:text-[0.95rem] lg:whitespace-nowrap">{copy.jobsSubtitle}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-5 mb-8">
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">{copy.jobsStats.total}</p>
                  <p className="font-heading text-3xl font-bold text-card-foreground">{jobStats.total}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">{copy.jobsStats.ci}</p>
                  <p className="font-heading text-3xl font-bold text-card-foreground">{jobStats.coteDIvoire}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">{copy.jobsStats.africa}</p>
                  <p className="font-heading text-3xl font-bold text-card-foreground">{jobStats.africa}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">{copy.jobsStats.intl}</p>
                  <p className="font-heading text-3xl font-bold text-card-foreground">{jobStats.international}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">{copy.jobsStats.sources}</p>
                  <p className="font-heading text-3xl font-bold text-card-foreground">{jobSourceCount}</p>
                </div>
              </div>

              <div className="mb-6 flex flex-wrap gap-3">
                {copy.jobSources.map((source) => (
                  <a
                    key={source.label}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {source.label}
                    <ExternalLink size={12} />
                  </a>
                ))}
              </div>

              {highlightedJobs.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BriefcaseBusiness size={22} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-card-foreground">{copy.jobsEmptyTitle}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.jobsEmptyDesc}</p>
                      {jobsLoading ? <p className="mt-3 text-xs text-muted-foreground">{copy.jobsLoading}</p> : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                  {highlightedJobs.map((job, index) => {
                    const summary = language === "en" ? job.summaryEn : job.summaryFr;
                    const location = language === "en" ? job.locationEn : job.locationFr;
                    const recent = isResourceNew(job.publishedAt, job.isNewManual);

                    return (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-card border border-border rounded-xl p-6 hover-lift"
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="text-xs font-bold text-primary">{copy.jobsType[job.opportunityType]}</span>
                          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                            {copy.jobsWorkMode[job.workMode]}
                          </span>
                          {recent ? (
                            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primary-foreground">
                              {copy.newBadge}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">{job.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{summary}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-5">
                          <span className="flex items-center gap-1">
                            <MapPin size={13} />
                            {location}
                          </span>
                          {job.sourceUrl ? (
                            <a
                              href={job.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:opacity-80"
                            >
                              {copy.jobsSourceLabel}: {job.sourceName}
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span>{copy.jobsSourceLabel}: {job.sourceName}</span>
                          )}
                          <span>{formatDate(job.publishedAt)}</span>
                          {job.compensationLabel ? <span>{job.compensationLabel}</span> : null}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {job.applyUrl ? (
                            <a
                              href={job.applyUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-4 py-2 text-sm font-semibold"
                              style={{ color: "hsl(0 0% 100%)" }}
                            >
                              {copy.jobsApply} <ExternalLink size={14} />
                            </a>
                          ) : null}
                          <Link
                            to={emploiContactLink}
                            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-card-foreground hover:bg-muted"
                          >
                            {copy.jobsContact} <ArrowRight size={14} />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mb-16">
              <div className="rounded-[28px] border border-primary/10 bg-[linear-gradient(135deg,hsl(225_48%_14%),hsl(226_40%_10%))] p-8">
                <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: "hsl(0 0% 98%)" }}>
                  {copy.ctaTitle}
                </h3>
                <p className="text-sm leading-relaxed mb-8" style={{ color: "hsl(210 20% 78%)" }}>
                  {copy.ctaDesc}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to={newsletterContactLink}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-5 py-3 text-sm font-semibold"
                    style={{ color: "hsl(0 0% 100%)" }}
                  >
                    {copy.ctaPrimary}
                  </Link>
                  <Link
                    to={newsletterContactLink}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5"
                    style={{ color: "hsl(0 0% 98%)" }}
                  >
                    {copy.ctaSecondary}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CreateurContenuIA;
