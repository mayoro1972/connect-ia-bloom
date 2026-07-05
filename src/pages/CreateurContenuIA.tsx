import { useEffect, useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock,
  ExternalLink,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Mic,
  Music2,
  PlayCircle,
  Radar,
  Rss,
  Sparkles,
  Users,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import BlogNewsletterSignup from "@/components/BlogNewsletterSignup";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildEmploymentContactPath, buildReplayWatchUrl } from "@/lib/site-links";
import { isResourceNew } from "@/lib/resource-feed";
import { useJobFeed } from "@/hooks/useJobFeed";
import { useNewsletterIssues } from "@/hooks/useNewsletterIssues";
import { useSocialVideoFeed } from "@/hooks/useSocialVideoFeed";
import {
  opportunitySources,
  replaySources,
  watchSources,
  type MediaOpportunitySource,
} from "@/lib/media-opportunity-sources";

const creatorHubCopy = {
  fr: {
    title: "Média IA & opportunités",
    subtitle:
      "Le pôle média et opportunités de TransferAI : produire des contenus courts, valoriser les replays, orienter vers la newsletter et connecter les talents aux débouchés IA.",
    missionTitle: "Notre mission : transformer l'IA en avantage concret",
    missionDesc:
      "Cette page présente le dispositif média et opportunités de TransferAI. Elle concentre désormais la lecture de la newsletter hebdomadaire, les replays, les sources à surveiller et les opportunités IA à convertir en débouchés concrets.",
    growthTitle: "Le moteur média pour convertir l'audience en abonnés puis en apprenants",
    growthItems: [
      {
        title: "Newsletter métier hebdomadaire",
        desc: "Chaque édition peut maintenant être lue ici sur le site, tout en restant branchée au flux d'abonnement et à la segmentation par domaines.",
      },
      {
        title: "Micro-contenus à forte portée",
        desc: "TikTok et Shorts orientés résultats : astuces en 30 à 60 secondes, avant/après, workflows simples et appels à l'action vers la newsletter.",
      },
      {
        title: "Opportunités IA + mise en relation",
        desc: "Un espace dédié aux emplois, missions, stages et collaborations IA à qualifier avant contact humain ou orientation vers les partenaires.",
      },
    ],
    newsletterTitle: "Newsletter hebdomadaire lisible sur le site",
    newsletterSubtitle:
      "Les abonnés peuvent s'inscrire puis relire ici les dernières éditions envoyées : signaux clés, action de la semaine, outil à tester, prompt métier et prochaine étape.",
    newsletterBadge: "Newsletter branchée",
    newsletterLatest: "Dernière édition",
    newsletterArchive: "Archives récentes",
    newsletterReadCta: "Ouvrir la newsletter",
    newsletterEmpty:
      "Dès qu'une édition est envoyée depuis le back-office, elle devient lisible ici automatiquement.",
    newsletterLoading: "Chargement des éditions envoyées...",
    newsletterPrompt: "Prompt métier",
    newsletterTool: "Outil recommandé",
    newsletterAction: "Action cette semaine",
    newsletterSignal: "Signal à retenir",
    newsletterDomains: "Domaines",
    sourceDirectoryTitle: "Sources à brancher pour nourrir cette rubrique",
    sourceDirectorySubtitle:
      "Un annuaire prioritaire de sites web à scrapper ou surveiller pour alimenter en continu la veille, les capsules, les opportunités et les replays.",
    sourceDirectoryBadge: "Feed map",
    sourceGroups: {
      watch: "Veille & actualités IA",
      opportunities: "Opportunités & emplois IA",
      replays: "Replays & amplification",
    },
    sourceScope: {
      "cote-divoire": "Côte d'Ivoire",
      africa: "Afrique",
      international: "International",
    },
    sourceFeedType: {
      rss: "RSS",
      site: "Site",
      channel: "Canal",
      internal: "Interne",
    },
    channelsTitle: "Les canaux à privilégier pour attirer et retenir",
    featuredVideoLabel: "Capsule en avant",
    featuredVideoCta: "Voir la vidéo",
    featuredVideoLoading: "Chargement de la capsule publiée...",
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
        desc: "Le point d'entrée éditorial pour transformer la veille en abonnés actifs et en lecteurs réguliers sur le site.",
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
        title: "Opportunités & mise en relation",
        desc: "Rubrique vivante pour qualifier les opportunités emploi/freelance et faciliter les demandes de mise en relation pertinentes.",
        frequency: "mise à jour continue",
        icon: Radar,
        color: "text-primary",
        bg: "bg-primary/10",
      },
    ],
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
      sources: "Sources actives",
    },
    jobsEmptyTitle: "La rubrique emploi IA est prête à être alimentée",
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
    replaysTitle: "Replays & masterclass",
    replaysSubtitle:
      "Reprenez à la demande nos webinaires passés et masterclass métier. Idéal pour découvrir notre approche pédagogique avant de vous inscrire à une session live.",
    replaysBadge: "À regarder à la demande",
    replaysCta: "Voir ce replay",
    replaysEmpty: "De nouveaux replays seront ajoutés ici régulièrement.",
    replaysLiveLink: "Voir les prochains webinaires en direct",
    ctaTitle: "Construire la communauté, former et ouvrir des débouchés",
    ctaDesc:
      "La page est maintenant pensée comme un hub complet : newsletter lisible sur le site, contenus courts, replays, opportunités emploi et connexion directe avec les talents.",
    ctaPrimary: "Voir Ressources & Veille IA",
    ctaSecondary: "Parler emploi & mise en relation",
  },
  en: {
    title: "AI media & opportunities",
    subtitle:
      "TransferAI's media and opportunities hub: produce short-form content, highlight replays, route visitors to the newsletter and connect talent with AI opportunities.",
    missionTitle: "Our mission: turn AI into concrete advantage",
    missionDesc:
      "This page presents TransferAI's media and opportunities system. It now centralizes newsletter reading, replays, source websites to monitor and AI opportunities to turn into real outcomes.",
    growthTitle: "The media engine to convert audiences into subscribers and learners",
    growthItems: [
      {
        title: "Weekly job-focused newsletter",
        desc: "Each issue can now be read here on the website while staying connected to the subscription flow and domain-based segmentation.",
      },
      {
        title: "High-reach short-form content",
        desc: "TikTok and Shorts focused on outcomes: 30 to 60 second tips, before/after examples, simple workflows and calls to action back to the newsletter.",
      },
      {
        title: "AI opportunities + introductions",
        desc: "A dedicated space for AI jobs, missions, internships and collaborations to qualify before human follow-up or partner routing.",
      },
    ],
    newsletterTitle: "Weekly newsletter readable on the website",
    newsletterSubtitle:
      "Subscribers can join, then re-read the latest sent issues here: key signals, weekly action, tool to test, role-specific prompt and next step.",
    newsletterBadge: "Newsletter connected",
    newsletterLatest: "Latest issue",
    newsletterArchive: "Recent archive",
    newsletterReadCta: "Open newsletter",
    newsletterEmpty:
      "As soon as an issue is sent from the back office, it will appear here automatically.",
    newsletterLoading: "Loading sent issues...",
    newsletterPrompt: "Role prompt",
    newsletterTool: "Recommended tool",
    newsletterAction: "Action this week",
    newsletterSignal: "Key signal",
    newsletterDomains: "Domains",
    sourceDirectoryTitle: "Source websites to connect to this hub",
    sourceDirectorySubtitle:
      "A priority directory of websites to scrape or monitor in order to feed the watch, short-form content, opportunities and replays continuously.",
    sourceDirectoryBadge: "Feed map",
    sourceGroups: {
      watch: "AI watch & updates",
      opportunities: "AI opportunities & jobs",
      replays: "Replays & amplification",
    },
    sourceScope: {
      "cote-divoire": "Côte d'Ivoire",
      africa: "Africa",
      international: "International",
    },
    sourceFeedType: {
      rss: "RSS",
      site: "Website",
      channel: "Channel",
      internal: "Internal",
    },
    channelsTitle: "Channels to prioritize for reach and retention",
    featuredVideoLabel: "Featured clip",
    featuredVideoCta: "Watch video",
    featuredVideoLoading: "Loading published clip...",
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
        desc: "The editorial entry point that turns the watch into active subscribers and repeat readers on the site.",
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
        title: "Opportunities & introductions",
        desc: "A live section to qualify jobs and freelance opportunities, then support relevant introduction requests.",
        frequency: "continuous updates",
        icon: Radar,
        color: "text-primary",
        bg: "bg-primary/10",
      },
    ],
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
      sources: "Active sources",
    },
    jobsEmptyTitle: "The AI jobs section is ready to be populated",
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
    replaysTitle: "Replays & masterclasses",
    replaysSubtitle:
      "Catch up on our past webinars and profession masterclasses on demand. A great way to test our teaching approach before joining a live session.",
    replaysBadge: "Watch on demand",
    replaysCta: "Watch this replay",
    replaysEmpty: "New replays will be added here regularly.",
    replaysLiveLink: "See upcoming live webinars",
    ctaTitle: "Build the community, train people and open career paths",
    ctaDesc:
      "The page is now designed as a full hub: newsletter readable on-site, short-form content, replays, job opportunities and direct links with talent.",
    ctaPrimary: "Open Resources & AI Watch",
    ctaSecondary: "Talk jobs & introductions",
  },
} as const;

const getNewsletterBodyPreview = (bodyMarkdown: string | null, bodyHtml: string | null) => {
  if (bodyMarkdown?.trim()) {
    return bodyMarkdown.trim();
  }

  if (!bodyHtml?.trim()) {
    return "";
  }

  return bodyHtml
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
};

const SourceDirectoryGroup = ({
  title,
  icon,
  items,
  language,
  copy,
}: {
  title: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  items: MediaOpportunitySource[];
  language: "fr" | "en";
  copy: (typeof creatorHubCopy)["fr"];
}) => {
  const Icon = icon;

  return (
    <div className="rounded-[1.75rem] border border-border bg-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
          <Icon size={20} className="text-primary" />
        </div>
      <h3 className="font-heading text-xl font-bold text-card-foreground">{title}</h3>
    </div>

    <div className="space-y-4">
      {items.map((source) => (
        <a
          key={source.id}
          href={source.url}
          target={source.url.startsWith("/") ? undefined : "_blank"}
          rel={source.url.startsWith("/") ? undefined : "noreferrer"}
          className="block rounded-2xl border border-border bg-background/70 p-4 transition hover:-translate-y-0.5 hover:border-primary/30"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-card-foreground">{source.title}</span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {copy.sourceFeedType[source.feedType]}
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              {copy.sourceScope[source.scope]}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {language === "en" ? source.descriptionEn : source.descriptionFr}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{source.publisher}</span>
            <span>{language === "en" ? source.cadenceEn : source.cadenceFr}</span>
          </div>
          <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
            {source.url.replace(/^https?:\/\//, "")}
            <ExternalLink size={12} />
          </div>
        </a>
      ))}
    </div>
    </div>
  );
};

const CreateurContenuIA = () => {
  const { language, t } = useLanguage();
  const normalizedLanguage = language === "en" ? "en" : "fr";
  const copy = creatorHubCopy[normalizedLanguage];
  const { items: jobs, stats: jobStats, isLoading: jobsLoading } = useJobFeed();
  const { featured: featuredTikTok, isLoading: isTikTokLoading } = useSocialVideoFeed("tiktok");
  const { items: newsletterIssues, featured: featuredNewsletter, isLoading: newsletterLoading } =
    useNewsletterIssues(normalizedLanguage);
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string | null>(null);
  const highlightedJobs = jobs.slice(0, 6);
  const replays = (t("webinars.replays") as Array<Record<string, string>>) ?? [];

  useEffect(() => {
    if (!selectedNewsletterId && featuredNewsletter?.id) {
      setSelectedNewsletterId(featuredNewsletter.id);
    }

    if (selectedNewsletterId && !newsletterIssues.some((issue) => issue.id === selectedNewsletterId)) {
      setSelectedNewsletterId(featuredNewsletter?.id ?? null);
    }
  }, [featuredNewsletter?.id, newsletterIssues, selectedNewsletterId]);

  const selectedNewsletter =
    newsletterIssues.find((issue) => issue.id === selectedNewsletterId) ?? featuredNewsletter ?? null;

  const formatDate = (value: string) => {
    const date = new Date(`${value}T00:00:00Z`);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(normalizedLanguage === "en" ? "en-GB" : "fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      timeZone: "UTC",
    }).format(date);
  };

  const emploiContactLink = buildEmploymentContactPath("Emploi IA & mise en relation");
  const featuredTikTokTitle = normalizedLanguage === "en" ? featuredTikTok?.titleEn : featuredTikTok?.titleFr;
  const featuredTikTokSummary = normalizedLanguage === "en" ? featuredTikTok?.summaryEn : featuredTikTok?.summaryFr;
  const featuredTikTokCtaLabel =
    normalizedLanguage === "en"
      ? featuredTikTok?.ctaLabelEn || copy.featuredVideoCta
      : featuredTikTok?.ctaLabelFr || copy.featuredVideoCta;
  const featuredTikTokFrequency =
    normalizedLanguage === "en" ? featuredTikTok?.frequencyLabelEn : featuredTikTok?.frequencyLabelFr;
  const featuredTikTokLink = featuredTikTok?.ctaUrl || featuredTikTok?.videoUrl || null;
  const newsletterBodyPreview = selectedNewsletter
    ? getNewsletterBodyPreview(selectedNewsletter.body_markdown, selectedNewsletter.body_html)
    : "";
  const opportunitySourceCount = opportunitySources.length;

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

            <div className="mb-16 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
              <BlogNewsletterSignup
                availableSectors={[]}
                defaultSector="Médias & Création de contenu"
                sourcePage="/createur-contenu-ia"
                compact
              />

              <div className="rounded-[1.75rem] border border-border bg-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      <Mail size={14} />
                      {copy.newsletterBadge}
                    </span>
                    <h2 className="mt-4 font-heading text-2xl font-bold text-card-foreground">{copy.newsletterTitle}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.newsletterSubtitle}</p>
                  </div>
                  {newsletterLoading ? <span className="text-sm text-muted-foreground">{copy.newsletterLoading}</span> : null}
                </div>

                {selectedNewsletter ? (
                  <div className="mt-6 space-y-5">
                    <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                            {copy.newsletterLatest}
                          </p>
                          <h3 className="mt-3 font-heading text-xl font-bold text-card-foreground">
                            {selectedNewsletter.title}
                          </h3>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(selectedNewsletter.sent_at || selectedNewsletter.issue_date)}
                        </span>
                      </div>
                      {selectedNewsletter.preheader ? (
                        <p className="mt-3 text-sm text-muted-foreground">{selectedNewsletter.preheader}</p>
                      ) : null}
                      {selectedNewsletter.target_domains.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {selectedNewsletter.target_domains.map((domain) => (
                            <span
                              key={domain}
                              className="rounded-full bg-background px-3 py-1 text-[11px] font-medium text-card-foreground"
                            >
                              {domain}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {selectedNewsletter.intro ? (
                      <div className="rounded-2xl border border-border bg-background/70 p-5">
                        <p className="text-sm leading-relaxed text-muted-foreground">{selectedNewsletter.intro}</p>
                      </div>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-2">
                      {(selectedNewsletter.highlight_title || selectedNewsletter.highlight_summary) ? (
                        <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.newsletterSignal}</p>
                          {selectedNewsletter.highlight_title ? (
                            <h4 className="mt-3 font-semibold text-card-foreground">{selectedNewsletter.highlight_title}</h4>
                          ) : null}
                          {selectedNewsletter.highlight_summary ? (
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                              {selectedNewsletter.highlight_summary}
                            </p>
                          ) : null}
                          {selectedNewsletter.highlight_url ? (
                            <a
                              href={selectedNewsletter.highlight_url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                            >
                              {copy.newsletterReadCta} <ExternalLink size={13} />
                            </a>
                          ) : null}
                        </div>
                      ) : null}

                      {(selectedNewsletter.tip_title || selectedNewsletter.tip_body) ? (
                        <div className="rounded-2xl border border-border bg-card p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.newsletterAction}</p>
                          {selectedNewsletter.tip_title ? (
                            <h4 className="mt-3 font-semibold text-card-foreground">{selectedNewsletter.tip_title}</h4>
                          ) : null}
                          {selectedNewsletter.tip_body ? (
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selectedNewsletter.tip_body}</p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    {(selectedNewsletter.tool_name || selectedNewsletter.tool_summary) ? (
                      <div className="rounded-2xl border border-border bg-card p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.newsletterTool}</p>
                        {selectedNewsletter.tool_name ? (
                          <h4 className="mt-3 font-semibold text-card-foreground">{selectedNewsletter.tool_name}</h4>
                        ) : null}
                        {selectedNewsletter.tool_category ? (
                          <p className="mt-1 text-xs text-muted-foreground">{selectedNewsletter.tool_category}</p>
                        ) : null}
                        {selectedNewsletter.tool_summary ? (
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selectedNewsletter.tool_summary}</p>
                        ) : null}
                      </div>
                    ) : null}

                    {(selectedNewsletter.prompt_title || selectedNewsletter.prompt_body) ? (
                      <div className="rounded-2xl border border-border bg-card p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.newsletterPrompt}</p>
                        {selectedNewsletter.prompt_title ? (
                          <h4 className="mt-3 font-semibold text-card-foreground">{selectedNewsletter.prompt_title}</h4>
                        ) : null}
                        {selectedNewsletter.prompt_body ? (
                          <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-background p-4 text-xs leading-6 text-muted-foreground">
                            {selectedNewsletter.prompt_body}
                          </pre>
                        ) : null}
                      </div>
                    ) : null}

                    {newsletterBodyPreview ? (
                      <div className="rounded-2xl border border-border bg-card p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                          {copy.newsletterReadCta}
                        </p>
                        <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                          {newsletterBodyPreview}
                        </div>
                        {selectedNewsletter.cta_label && selectedNewsletter.cta_url ? (
                          <a
                            href={selectedNewsletter.cta_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-gradient px-4 py-2 text-sm font-semibold text-white"
                          >
                            {selectedNewsletter.cta_label} <ArrowRight size={14} />
                          </a>
                        ) : null}
                      </div>
                    ) : null}

                    {newsletterIssues.length > 1 ? (
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                          {copy.newsletterArchive}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {newsletterIssues.map((issue) => (
                            <button
                              key={issue.id}
                              type="button"
                              onClick={() => setSelectedNewsletterId(issue.id)}
                              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                issue.id === selectedNewsletter.id
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background text-card-foreground hover:border-primary/40 hover:text-primary"
                              }`}
                            >
                              {formatDate(issue.sent_at || issue.issue_date)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground">
                    {copy.newsletterEmpty}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-16">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    <Rss size={14} />
                    {copy.sourceDirectoryBadge}
                  </span>
                  <h2 className="mt-4 font-heading text-2xl font-bold text-foreground">{copy.sourceDirectoryTitle}</h2>
                  <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{copy.sourceDirectorySubtitle}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                  {watchSources.length + opportunitySources.length + replaySources.length} sources prioritaires
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <SourceDirectoryGroup
                  title={copy.sourceGroups.watch}
                  icon={Rss}
                  items={watchSources}
                  language={normalizedLanguage}
                  copy={copy}
                />
                <SourceDirectoryGroup
                  title={copy.sourceGroups.opportunities}
                  icon={Globe2}
                  items={opportunitySources}
                  language={normalizedLanguage}
                  copy={copy}
                />
                <SourceDirectoryGroup
                  title={copy.sourceGroups.replays}
                  icon={FileText}
                  items={replaySources}
                  language={normalizedLanguage}
                  copy={copy}
                />
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
                  {channel.title === "TikTok" ? (
                    <>
                      <div className="mb-4 overflow-hidden rounded-2xl border border-border bg-[linear-gradient(135deg,hsl(225_48%_14%),hsl(226_40%_10%))]">
                        {featuredTikTok?.thumbnailUrl ? (
                          <a
                            href={featuredTikTokLink ?? "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative block aspect-[9/16] w-full overflow-hidden"
                          >
                            <img
                              src={featuredTikTok.thumbnailUrl}
                              alt={featuredTikTokTitle ?? channel.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-black/25" />
                            <div className="absolute inset-x-0 bottom-3 flex justify-center">
                              <span className="inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white">
                                <PlayCircle size={14} />
                                {copy.featuredVideoCta}
                              </span>
                            </div>
                          </a>
                        ) : (
                          <a
                            href={featuredTikTokLink ?? "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="relative flex aspect-[9/16] w-full flex-col justify-between overflow-hidden p-5"
                          >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(25_95%_58%/.16),transparent_40%),radial-gradient(circle_at_bottom_right,hsl(330_95%_58%/.16),transparent_35%)]" />
                            <div className="relative flex items-start justify-between gap-3">
                              <div className={`w-12 h-12 rounded-xl ${channel.bg} flex items-center justify-center shadow-sm`}>
                                <channel.icon size={24} className={channel.color} />
                              </div>
                              <span className="inline-flex max-w-[9.5rem] items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
                                {copy.featuredVideoLabel}
                              </span>
                            </div>
                            <div className="relative space-y-2.5">
                              <h3 className="font-heading text-xl font-bold text-white">
                                {featuredTikTokTitle ?? channel.title}
                              </h3>
                              <p className="line-clamp-4 text-sm leading-relaxed text-white/75">
                                {isTikTokLoading ? copy.featuredVideoLoading : featuredTikTokSummary ?? channel.desc}
                              </p>
                              <div className="flex items-center justify-between gap-3 pt-1">
                                <span className="text-xs text-white/65">
                                  {featuredTikTokFrequency ?? channel.frequency}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900">
                                  {featuredTikTokCtaLabel} <ExternalLink size={12} />
                                </span>
                              </div>
                            </div>
                          </a>
                        )}
                      </div>
                      <h3 className="font-heading font-bold text-base text-card-foreground mb-2">{channel.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isTikTokLoading ? copy.featuredVideoLoading : featuredTikTokSummary ?? channel.desc}
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground">
                          {featuredTikTokFrequency ?? channel.frequency}
                        </span>
                        {featuredTikTokLink ? (
                          <a
                            href={featuredTikTokLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            {featuredTikTokCtaLabel} <ExternalLink size={12} />
                          </a>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`w-12 h-12 rounded-xl ${channel.bg} flex items-center justify-center mb-4`}>
                        <channel.icon size={24} className={channel.color} />
                      </div>
                      <h3 className="font-heading font-bold text-base text-card-foreground mb-2">{channel.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{channel.desc}</p>
                      <span className="text-xs text-muted-foreground">{channel.frequency}</span>
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            <div id="replays" className="mb-16 scroll-mt-24">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
                    <PlayCircle size={24} className="text-primary" />
                    {copy.replaysTitle}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{copy.replaysSubtitle}</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {copy.replaysBadge}
                </span>
              </div>

              {replays.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                  {copy.replaysEmpty}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {replays.map((replay, index) => (
                    <motion.div
                      key={`${replay.title}-${index}`}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col rounded-2xl border border-border bg-card p-5 hover-lift"
                    >
                      <div className="mb-4 flex aspect-video w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,hsl(225_48%_18%),hsl(226_40%_12%))]">
                        <PlayCircle size={40} className="text-white/80" />
                      </div>
                      <h3 className="font-heading text-base font-semibold text-card-foreground mb-2 line-clamp-2">{replay.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{replay.desc}</p>
                      <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users size={12} /> {replay.viewers}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {replay.duration}</span>
                      </div>
                      <a
                        href={buildReplayWatchUrl(replay.title)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                      >
                        {copy.replaysCta} <ArrowRight size={14} />
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <Link
                  to="/seminaires"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  {copy.replaysLiveLink} <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="mb-16">
              <div className="mb-8">
                <h2 className="font-heading text-2xl font-bold text-foreground">{copy.jobsTitle}</h2>
                <p className="mt-3 max-w-3xl text-muted-foreground">{copy.jobsSubtitle}</p>
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
                  <p className="font-heading text-3xl font-bold text-card-foreground">{opportunitySourceCount}</p>
                </div>
              </div>

              <div className="mb-6 flex flex-wrap gap-3">
                {opportunitySources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-primary"
                  >
                    {source.title}
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
                    const summary = normalizedLanguage === "en" ? job.summaryEn : job.summaryFr;
                    const location = normalizedLanguage === "en" ? job.locationEn : job.locationFr;
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
                          <span>{copy.jobsSourceLabel}: {job.sourceName}</span>
                          <span>{formatDate(job.publishedAt)}</span>
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
                    to="/blog"
                    className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ color: "hsl(0 0% 100%)" }}
                  >
                    {copy.ctaPrimary}
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    to={emploiContactLink}
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
