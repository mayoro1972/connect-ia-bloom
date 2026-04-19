import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle2, Clock, Globe, MapPin, Play, Users } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildContactPath } from "@/lib/site-links";

const liveFormatsCopy = {
  fr: {
    title: "Formats live & découverte",
    subtitle:
      "Une seule porte d'entrée pour les séminaires, webinaires et replays. Le bon format pour découvrir TransferAI Africa, monter en compétence rapidement et passer ensuite à l'inscription.",
    overviewTitle: "Pourquoi regrouper les formats live",
    overviewPoints: [
      "Le visiteur comprend immédiatement où commencer s'il veut tester avant de s'engager.",
      "Les séminaires et les webinaires remplissent la même fonction commerciale : faire découvrir l'offre et convertir vers une formation plus complète.",
      "Les replays rassurent et prouvent la qualité pédagogique avant la candidature ou l'inscription.",
    ],
    comparisonTitle: "Choisir le bon format",
    comparisonCards: [
      {
        title: "Séminaires intensifs",
        desc: "Formats courts en présentiel ou hybrides pour les équipes, promotions executives et groupes métier.",
        meta: "Idéal pour une montée en compétence rapide et concrète",
      },
      {
        title: "Webinaires pratiques",
        desc: "Sessions à distance pour découvrir un sujet, tester l'approche pédagogique et qualifier plus vite le besoin.",
        meta: "Idéal pour les prospects qui veulent commencer sans friction",
      },
      {
        title: "Replays sélectionnés",
        desc: "Contenus à revoir à la demande pour garder le lien avec les visiteurs et nourrir l'intention d'achat.",
        meta: "Idéal pour nourrir la newsletter et les campagnes de conversion",
      },
    ],
    seminarTitle: "Séminaires à venir",
    webinarTitle: "Webinaires à venir",
    replayTitle: "Replays à forte intention",
    register: "Demander ma place",
    replayCta: "Voir ce replay",
    ctaTitle: "Le meilleur usage commercial des formats live",
    ctaDesc:
      "Les formats live doivent servir d'entrée basse friction dans le parcours Éducation : découverte, réassurance, puis orientation vers la bonne formation ou la certification signature.",
    ctaPrimary: "Déposer ma candidature",
    ctaSecondary: "Demander une orientation",
  },
  en: {
    title: "Live formats & discovery",
    subtitle:
      "One clear entry point for seminars, webinars and replays. The right format to discover TransferAI Africa, upskill fast and then move toward registration.",
    overviewTitle: "Why bring live formats together",
    overviewPoints: [
      "Visitors instantly understand where to start if they want to test before committing.",
      "Seminars and webinars play the same commercial role: introduce the offer and convert into fuller training.",
      "Replays reassure prospects and prove teaching quality before application or registration.",
    ],
    comparisonTitle: "Choose the right format",
    comparisonCards: [
      {
        title: "Intensive seminars",
        desc: "Short in-person or hybrid formats for teams, executive cohorts and profession-based groups.",
        meta: "Best for fast, concrete upskilling",
      },
      {
        title: "Practical webinars",
        desc: "Remote sessions to discover a topic, test the teaching approach and capture qualified leads.",
        meta: "Best for prospects who want a low-friction starting point",
      },
      {
        title: "Selected replays",
        desc: "On-demand content that keeps visitors engaged and nurtures buying intent.",
        meta: "Best for newsletter growth and conversion campaigns",
      },
    ],
    seminarTitle: "Upcoming seminars",
    webinarTitle: "Upcoming webinars",
    replayTitle: "High-intent replays",
    register: "Request my seat",
    replayCta: "Watch this replay",
    ctaTitle: "The strongest commercial use of live formats",
    ctaDesc:
      "Live formats should work as the low-friction front door of your Education funnel: discovery, reassurance and then orientation toward the right training or signature certification.",
    ctaPrimary: "Apply now",
    ctaSecondary: "Request orientation",
  },
} as const;

const Seminaires = () => {
  const { language, t } = useLanguage();
  const copy = liveFormatsCopy[language === "en" ? "en" : "fr"];
  const seminaires = t("seminaires.items") as Array<Record<string, string>>;
  const upcoming = t("webinars.upcoming") as Array<Record<string, string>>;
  const replays = t("webinars.replays") as Array<Record<string, string>>;
  const priceLabel = t("pricing.availableOnRequest");

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={copy.title} subtitle={copy.subtitle} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-16 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-3xl border border-border bg-card p-8">
                <h2 className="mb-6 font-heading text-2xl font-bold text-card-foreground">{copy.overviewTitle}</h2>
                <div className="space-y-4">
                  {copy.overviewPoints.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                      <p className="text-sm leading-7 text-card-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-8">
                <h2 className="mb-6 font-heading text-2xl font-bold text-card-foreground">{copy.comparisonTitle}</h2>
                <div className="space-y-4">
                  {copy.comparisonCards.map((card) => (
                    <div key={card.title} className="rounded-2xl border border-border bg-background p-5">
                      <h3 className="font-heading text-lg font-semibold text-card-foreground">{card.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{card.desc}</p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary">{card.meta}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-16">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-heading text-2xl font-bold text-foreground">{copy.seminarTitle}</h2>
                <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {priceLabel}
                </span>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {seminaires.map((sem, i) => (
                  <motion.div
                    key={`${sem.title}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="rounded-3xl border border-border bg-card p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{sem.audience}</span>
                    </div>
                    <h3 className="mb-2 font-heading text-lg font-bold text-card-foreground">{sem.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{sem.desc}</p>
                    <div className="mb-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {sem.date}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {sem.location}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {sem.duration}</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {sem.capacity}</span>
                    </div>
                    <div className="flex items-center justify-end border-t border-border pt-4">
                      <Link
                        to={`/inscription?formation=${encodeURIComponent(sem.title)}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                      >
                        {copy.register} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-16">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
                  <Globe size={24} className="text-primary" /> {copy.webinarTitle}
                </h2>
                <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {priceLabel}
                </span>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((webinar, i) => {
                  const webinarHref = `/webinaires/inscription?topic=${encodeURIComponent(webinar.title)}&date=${encodeURIComponent(webinar.date)}`;
                  return (
                    <motion.div
                      key={`${webinar.title}-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.3)]"
                    >
                      <span className="mb-3 self-start rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">{webinar.audience}</span>
                      <Link
                        to={webinarHref}
                        className="mb-2 font-heading text-base font-bold text-card-foreground hover:text-primary transition-colors"
                      >
                        {webinar.title}
                      </Link>
                      <p className="mb-4 flex-1 text-sm text-muted-foreground">{webinar.desc}</p>
                      <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {webinar.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {webinar.time}</span>
                      </div>
                      <div className="flex items-center justify-end border-t border-border pt-3">
                        <Link to={webinarHref} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                          {copy.register} <ArrowRight size={12} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mb-16">
              <h2 className="mb-8 flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
                <Play size={24} className="text-primary" /> {copy.replayTitle}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {replays.map((replay, i) => (
                  <motion.div
                    key={`${replay.title}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-3xl border border-border bg-card p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.3)]"
                  >
                    <h3 className="mb-2 font-heading text-base font-semibold text-card-foreground">{replay.title}</h3>
                    <p className="mb-3 text-sm text-muted-foreground">{replay.desc}</p>
                    <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users size={12} /> {replay.viewers}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {replay.duration}</span>
                    </div>
                    <Link to={buildContactPath("demande-renseignement")} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                      {copy.replayCta} <ArrowRight size={12} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] bg-[linear-gradient(135deg,hsl(225_48%_14%),hsl(226_40%_10%))] p-8 text-center md:p-12">
              <h3 className="mb-4 font-heading text-3xl font-bold text-white">{copy.ctaTitle}</h3>
              <p className="mx-auto mb-8 max-w-3xl text-sm leading-7 text-white/75">{copy.ctaDesc}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/inscription"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {copy.ctaPrimary} <ArrowRight size={16} />
                </Link>
                <Link
                  to={buildContactPath("demande-renseignement")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5"
                >
                  {copy.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Seminaires;
