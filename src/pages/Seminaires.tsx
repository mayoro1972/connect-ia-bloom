import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle2, Clock, Globe, Loader2, MapPin, Play, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildContactPath } from "@/lib/site-links";
import { useLiveFormatProposals, type LiveFormatProposal } from "@/hooks/useLiveFormatProposals";

const liveFormatsCopy = {
  fr: {
    title: "Formats live & découverte",
    subtitle:
      "Programme renouvelé tous les 15 jours en fonction des tendances détectées par IA en Côte d'Ivoire et Afrique de l'Ouest.",
    overviewTitle: "Pourquoi ce programme évolue chaque quinzaine",
    overviewPoints: [
      "Nos thématiques sont générées à partir de signaux de marché scrappés en temps réel sur les médias économiques ivoiriens et ouest-africains.",
      "Chaque cycle propose 2 séminaires et 3 webinaires alignés sur les besoins immédiats des entreprises et institutions.",
      "Les sessions live permettent de qualifier rapidement votre besoin et de tester notre approche avant inscription.",
    ],
    seminarTitle: "Séminaires de la quinzaine",
    webinarTitle: "Webinaires de la quinzaine",
    cycleLabel: "Cycle en cours",
    trendBadge: "Tendance détectée par IA",
    sectorsLabel: "Secteurs cibles",
    audienceLabel: "Pour qui",
    benefitsLabel: "Bénéfices clés",
    agendaLabel: "Au programme",
    speakerLabel: "Intervenant",
    replayBannerTitle: "Vous avez manqué un webinaire ?",
    replayBannerDesc:
      "Retrouvez tous nos replays et masterclasses dans notre médiathèque éditoriale.",
    replayBannerCta: "Voir tous les replays",
    register: "Demander ma place",
    loadingMsg: "Chargement du programme du cycle…",
    emptyMsg: "Le prochain cycle de séminaires sera publié sous peu. Revenez très vite.",
    ctaTitle: "Le meilleur usage commercial des formats live",
    ctaDesc:
      "Les formats live servent d'entrée basse friction dans le parcours Éducation : découverte, réassurance, puis orientation vers la formation ou la certification adaptée.",
    ctaPrimary: "Déposer ma candidature",
    ctaSecondary: "Demander une orientation",
  },
  en: {
    title: "Live formats & discovery",
    subtitle:
      "Programme refreshed every two weeks based on AI-detected trends in Côte d'Ivoire and West Africa.",
    overviewTitle: "Why this programme evolves every fortnight",
    overviewPoints: [
      "Topics are generated from market signals scraped in real time across Ivorian and West African business media.",
      "Each cycle features 2 seminars and 3 webinars aligned with the immediate needs of companies and institutions.",
      "Live sessions help us qualify your needs quickly and let you test our approach before registering.",
    ],
    seminarTitle: "This fortnight's seminars",
    webinarTitle: "This fortnight's webinars",
    cycleLabel: "Current cycle",
    trendBadge: "AI-detected trend",
    sectorsLabel: "Target sectors",
    audienceLabel: "For whom",
    benefitsLabel: "Key benefits",
    agendaLabel: "Programme",
    speakerLabel: "Speaker",
    replayBannerTitle: "Missed a webinar?",
    replayBannerDesc:
      "Find all our replays and masterclasses in the editorial media hub.",
    replayBannerCta: "Browse all replays",
    register: "Request my seat",
    loadingMsg: "Loading the current cycle…",
    emptyMsg: "The next cycle will be published shortly. Check back soon.",
    ctaTitle: "The strongest commercial use of live formats",
    ctaDesc:
      "Live formats work as the low-friction front door of your Education funnel: discovery, reassurance, then orientation toward the right training or certification.",
    ctaPrimary: "Apply now",
    ctaSecondary: "Request orientation",
  },
} as const;

const formatCycleLabel = (date: string, lang: "fr" | "en") => {
  try {
    return new Date(date).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return date;
  }
};

const Seminaires = () => {
  const { language } = useLanguage();
  const lang: "fr" | "en" = language === "en" ? "en" : "fr";
  const copy = liveFormatsCopy[lang];
  const { seminars, webinars, loading } = useLiveFormatProposals();
  const cycle = seminars[0]?.cycle_start_date ?? webinars[0]?.cycle_start_date;

  const pickTitle = (p: LiveFormatProposal) => (lang === "en" ? p.title_en : p.title_fr);
  const pickDesc = (p: LiveFormatProposal) => (lang === "en" ? p.description_en : p.description_fr);
  const pickSectors = (p: LiveFormatProposal) => (lang === "en" ? p.target_sectors_en : p.target_sectors_fr);
  const pickBenefits = (p: LiveFormatProposal) => (lang === "en" ? p.key_benefits_en : p.key_benefits_fr);
  const pickAgenda = (p: LiveFormatProposal) => (lang === "en" ? p.agenda_en : p.agenda_fr);
  const pickAudience = (p: LiveFormatProposal) => (lang === "en" ? p.target_audience_en : p.target_audience_fr);
  const pickSpeaker = (p: LiveFormatProposal) => (lang === "en" ? p.speaker_profile_en : p.speaker_profile_fr);

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={copy.title} subtitle={copy.subtitle} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12 rounded-3xl border border-border bg-card p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Sparkles size={18} className="text-primary" />
                <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.overviewTitle}</h2>
                {cycle && (
                  <span className="ml-auto rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                    {copy.cycleLabel} : {formatCycleLabel(cycle, lang)}
                  </span>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {copy.overviewPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                    <p className="text-sm leading-7 text-card-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="text-sm">{copy.loadingMsg}</p>
              </div>
            ) : seminars.length === 0 && webinars.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-12 text-center">
                <p className="text-muted-foreground">{copy.emptyMsg}</p>
              </div>
            ) : (
              <>
                {seminars.length > 0 && (
                  <div className="mb-16">
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                      <h2 className="font-heading text-2xl font-bold text-foreground">{copy.seminarTitle}</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {seminars.map((sem, i) => (
                        <motion.div
                          key={sem.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]"
                        >
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                              <Sparkles className="mr-1 inline size-3" /> {copy.trendBadge}
                            </span>
                            {sem.format_label_fr && (
                              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{lang === "en" ? sem.format_label_en : sem.format_label_fr}</span>
                            )}
                          </div>
                          <h3 className="mb-2 font-heading text-lg font-bold text-card-foreground">{pickTitle(sem)}</h3>
                          <p className="mb-4 text-sm text-muted-foreground">{pickDesc(sem)}</p>

                          {pickSectors(sem)?.length > 0 && (
                            <div className="mb-3">
                              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{copy.sectorsLabel}</p>
                              <div className="flex flex-wrap gap-1">
                                {pickSectors(sem).map((s) => (
                                  <span key={s} className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent-foreground">{s}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {pickAgenda(sem) && pickAgenda(sem)!.length > 0 && (
                            <div className="mb-3 rounded-lg bg-muted/40 p-3">
                              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{copy.agendaLabel}</p>
                              <ul className="ml-4 list-disc space-y-0.5 text-xs text-card-foreground">
                                {pickAgenda(sem)!.slice(0, 5).map((a, idx) => <li key={idx}>{a}</li>)}
                              </ul>
                            </div>
                          )}

                          <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            {sem.duration_minutes && (
                              <span className="flex items-center gap-1"><Clock size={14} /> {Math.round(sem.duration_minutes / 60)}h</span>
                            )}
                            <span className="flex items-center gap-1"><MapPin size={14} /> Abidjan</span>
                            {pickAudience(sem) && (
                              <span className="flex items-center gap-1"><Users size={14} /> {pickAudience(sem)}</span>
                            )}
                          </div>

                          <div className="mt-auto flex items-center justify-end border-t border-border pt-4">
                            <Link
                              to={`/inscription?formation=${encodeURIComponent(pickTitle(sem))}`}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                            >
                              {copy.register} <ArrowRight size={14} />
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {webinars.length > 0 && (
                  <div className="mb-16">
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                      <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
                        <Globe size={24} className="text-primary" /> {copy.webinarTitle}
                      </h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {webinars.map((web, i) => {
                        const webinarHref = `/webinaires/demande-place?topic=${encodeURIComponent(pickTitle(web))}`;
                        return (
                          <motion.div
                            key={web.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.3)]"
                          >
                            <span className="mb-3 self-start rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                              <Sparkles className="mr-1 inline size-3" /> {copy.trendBadge}
                            </span>
                            <Link
                              to={webinarHref}
                              className="mb-2 font-heading text-base font-bold text-card-foreground transition-colors hover:text-primary"
                            >
                              {pickTitle(web)}
                            </Link>
                            <p className="mb-3 flex-1 text-sm text-muted-foreground">{pickDesc(web)}</p>

                            {pickSectors(web)?.length > 0 && (
                              <div className="mb-3 flex flex-wrap gap-1">
                                {pickSectors(web).slice(0, 3).map((s) => (
                                  <span key={s} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{s}</span>
                                ))}
                              </div>
                            )}

                            <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                              {web.duration_minutes && (
                                <span className="flex items-center gap-1"><Clock size={12} /> {web.duration_minutes} min</span>
                              )}
                              <span className="flex items-center gap-1"><Globe size={12} /> Online</span>
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
                )}
              </>
            )}

            <div className="mb-16 rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Play size={22} />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground">{copy.replayBannerTitle}</h2>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{copy.replayBannerDesc}</p>
                  </div>
                </div>
                <Link
                  to="/createur-contenu-ia#replays"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {copy.replayBannerCta} <ArrowRight size={14} />
                </Link>
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

