import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Monitor, ChevronRight, Sparkles, BookOpen, Filter, X, CheckCircle2, Compass, ArrowRight, Layers, TrendingUp, Award, Route } from "lucide-react";
import {
  Briefcase, Users, Megaphone, Calculator, Scale, HeadphonesIcon,
  BarChart3, ClipboardList, Crown, GraduationCap, Heart, Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import { formations, type Formation } from "@/data/formations";
import { useLanguage } from "@/i18n/LanguageContext";
import { useFormationLocale } from "@/hooks/useFormationLocale";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { fixMojibake } from "@/lib/fixMojibake";
import { buildContactPath, resolveCertificationSlugFromSector, resolveToolSlugFromSector } from "@/lib/site-links";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";

const levelIcons: Record<string, React.ElementType> = {
  "Débutant": Layers,
  "Intermédiaire": TrendingUp,
  "Avancé": Award,
};

const domainIcons: Record<string, React.ElementType> = {
  "Assistanat & Secrétariat": Briefcase,
  "Ressources Humaines": Users,
  "Marketing & Communication": Megaphone,
  "Finance & Comptabilité": Calculator,
  "Juridique & Conformité": Scale,
  "Service Client": HeadphonesIcon,
  "Data & Analyse": BarChart3,
  "Administration & Gestion": ClipboardList,
  "Management & Leadership": Crown,
  "IT & Transformation Digitale": Monitor,
  "Formation & Pédagogie": GraduationCap,
  "Santé & Bien-être": Heart,
  "Diplomatie & Affaires Internationales": Globe,
};

const domainColors: Record<string, string> = {
  "Assistanat & Secrétariat": "from-primary/20 to-primary/5 border-primary/30",
  "Ressources Humaines": "from-[hsl(174,70%,42%)]/20 to-[hsl(174,70%,42%)]/5 border-[hsl(174,70%,42%)]/30",
  "Marketing & Communication": "from-[hsl(15,85%,57%)]/20 to-[hsl(15,85%,57%)]/5 border-[hsl(15,85%,57%)]/30",
  "Finance & Comptabilité": "from-[hsl(145,65%,42%)]/20 to-[hsl(145,65%,42%)]/5 border-[hsl(145,65%,42%)]/30",
  "Juridique & Conformité": "from-primary/20 to-primary/5 border-primary/30",
  "Service Client": "from-[hsl(174,70%,42%)]/20 to-[hsl(174,70%,42%)]/5 border-[hsl(174,70%,42%)]/30",
  "Data & Analyse": "from-[hsl(15,85%,57%)]/20 to-[hsl(15,85%,57%)]/5 border-[hsl(15,85%,57%)]/30",
  "Administration & Gestion": "from-[hsl(145,65%,42%)]/20 to-[hsl(145,65%,42%)]/5 border-[hsl(145,65%,42%)]/30",
  "Management & Leadership": "from-primary/20 to-primary/5 border-primary/30",
  "IT & Transformation Digitale": "from-[hsl(174,70%,42%)]/20 to-[hsl(174,70%,42%)]/5 border-[hsl(174,70%,42%)]/30",
  "Formation & Pédagogie": "from-[hsl(15,85%,57%)]/20 to-[hsl(15,85%,57%)]/5 border-[hsl(15,85%,57%)]/30",
  "Santé & Bien-être": "from-[hsl(145,65%,42%)]/20 to-[hsl(145,65%,42%)]/5 border-[hsl(145,65%,42%)]/30",
  "Diplomatie & Affaires Internationales": "from-primary/20 to-primary/5 border-primary/30",
};

const metiers = [...new Set(formations.map((f) => f.metier))];

const levelColors: Record<string, string> = {
  "Débutant": "bg-accent text-accent-foreground",
  "Intermédiaire": "bg-primary/10 text-primary",
  "Avancé": "bg-destructive/10 text-destructive",
};

// Formations considered "new" (last entries from each domain)
const newFormationIds = new Set([
  "diplo-01", "diplo-02", "diplo-03", "diplo-04", "diplo-05",
  "diplo-06", "diplo-07", "diplo-08", "diplo-09", "diplo-10",
  "sante-08", "sante-09", "sante-10",
  "form-08", "form-09", "form-10",
  "it-08", "it-09", "it-10",
  "mgmt-08", "mgmt-09", "mgmt-10",
]);

const FormationCard = ({ f, i, isNew = false }: { f: Formation; i: number; isNew?: boolean }) => {
  const { t } = useLanguage();
  const { getTitle, getDuration, getLevel, getFormat, getPrice } = useFormationLocale();
  return (
    <Link to={`/catalogue/${f.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(i * 0.03, 0.4) }}
        className="group bg-card border border-border rounded-xl p-5 hover-lift flex flex-col h-full relative overflow-hidden"
      >
        {isNew && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-[hsl(145,65%,42%)] text-[hsl(0,0%,100%)] text-[10px] font-bold px-2 py-0.5">
              <Sparkles size={10} className="mr-1" />
              NEW
            </Badge>
          </div>
        )}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColors[fixMojibake(f.level)]}`}>{getLevel(f)}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Monitor size={12} />{getFormat(f)}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12} />{getDuration(f)}</span>
        </div>
        <h3 className="font-heading font-semibold text-sm mb-3 text-card-foreground flex-1 group-hover:text-primary transition-colors">{getTitle(f)}</h3>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {f.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{fixMojibake(tag)}</span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <span className="font-semibold text-sm text-card-foreground">{getPrice(f)}</span>
          <span className="text-xs font-semibold text-primary flex items-center gap-1">
            {t("catalogue.details")} <ChevronRight size={12} />
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

const DomainCard = ({ domain, count, onClick }: { domain: string; count: number; onClick: () => void }) => {
  const { t } = useLanguage();
  const Icon = domainIcons[domain] || BookOpen;
  const colorClass = domainColors[domain] || "from-primary/20 to-primary/5 border-primary/30";
  const localizedDomain = fixMojibake(domain);

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`w-full text-left bg-gradient-to-br ${colorClass} border rounded-xl p-6 hover-lift transition-all group`}
    >
      <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
        <Icon size={22} className="text-primary" />
      </div>
      <h3 className="font-heading font-semibold text-base mb-1 text-card-foreground">{t(`catalogue.domains.${localizedDomain}`) || localizedDomain}</h3>
      <p className="text-sm text-muted-foreground mb-3">{count} {t("catalogue.availableFormations")}</p>
      <span className="text-xs font-semibold text-primary flex items-center gap-1">
        {t("catalogue.explore")} <ChevronRight size={14} />
      </span>
    </motion.button>
  );
};

const CataloguePage = () => {
  const { t, language } = useLanguage();
  const { getTitle, getLevel, getFormat } = useFormationLocale();
  const [activeTab, setActiveTab] = useState("explorer");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  // Search tab state
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterFormat, setFilterFormat] = useState("");
  const [filterMetier, setFilterMetier] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("request") === "1") {
      const next = new URLSearchParams(searchParams);
      next.delete("request");
      setSearchParams(next, { replace: true });
      // Redirect legacy ?request=1 deep-link to the structured contact form
      window.location.assign(buildContactPath("demande-catalogue"));
    }
  }, [searchParams, setSearchParams]);

  const levels = ["Débutant", "Intermédiaire", "Avancé"];
  const formats = ["Présentiel", "Hybride", "En ligne"];

  const domainGroups = useMemo(() => {
    const groups: Record<string, Formation[]> = {};
    formations.forEach((f) => {
      if (!groups[f.metier]) groups[f.metier] = [];
      groups[f.metier].push(f);
    });
    return groups;
  }, []);

  const searchFiltered = useMemo(() => {
    return formations.filter((f) => {
      const title = getTitle(f);
      const matchSearch =
        !search ||
        title.toLowerCase().includes(search.toLowerCase()) ||
        f.tags.some((tag) => fixMojibake(tag).toLowerCase().includes(search.toLowerCase()));
      const matchMetier = !filterMetier || f.metier === filterMetier;
      const matchLevel = !filterLevel || f.level === filterLevel;
      const matchFormat = !filterFormat || f.format === filterFormat;
      return matchSearch && matchMetier && matchLevel && matchFormat;
    });
  }, [search, filterMetier, filterLevel, filterFormat, getTitle]);

  const newFormations = useMemo(() => {
    return formations.filter(f => newFormationIds.has(f.id));
  }, []);

  const parcoursTrans = (language === "fr" ? fr : en).parcours;
  const metierParcours = useMemo(() => {
    return parcoursTrans.paths.map((path) => {
      const metierFormations = formations.filter((formation) => fixMojibake(formation.metier) === path.metierKey);
      return {
        ...path,
        levels: [
          { level: "Débutant" as const, formations: metierFormations.filter((f) => f.level === "Débutant") },
          { level: "Intermédiaire" as const, formations: metierFormations.filter((f) => f.level === "Intermédiaire") },
          { level: "Avancé" as const, formations: metierFormations.filter((f) => f.level === "Avancé") },
        ],
      };
    });
  }, [parcoursTrans]);

  const parcoursCopy = language === "fr"
    ? {
        tab: "Parcours thématiques",
        title: "Parcours guidés par domaine",
        desc: "Plutôt qu'une formation isolée, suivez une trajectoire claire : du socle aux usages avancés, dans votre domaine d'expertise.",
        coursesLabel: "formations",
        seeAll: "Voir toutes les formations du parcours",
      }
    : {
        tab: "Thematic paths",
        title: "Guided paths by domain",
        desc: "Rather than a standalone course, follow a clear trajectory: from fundamentals to advanced use, in your area of expertise.",
        coursesLabel: "courses",
        seeAll: "View all courses in this path",
      };

  const totalFormations = formations.length;
  const totalDomains = metiers.length;
  const guideCopy = language === "fr"
    ? {
        badge: "Catalogue",
        sectionIntroTitle: "Un catalogue plus clair pour choisir vite",
        sectionIntroDesc:
          "Parcourez l'offre par domaine, filtrez selon votre niveau et allez directement vers la bonne formation.",
        domainsTitle: "Explorer par domaine d'expertise",
        domainsDesc:
          "Chaque domaine regroupe les formations les plus utiles pour un même métier ou une même fonction.",
        searchTitle: "Rechercher une formation",
        searchDesc:
          "Utilisez la recherche si vous avez déjà un besoin précis, puis affinez avec les filtres.",
        newTitle: "Nouvelles formations à découvrir",
        newDesc:
          "Retrouvez ici les dernières formations ajoutées au catalogue.",
        finalTitle: "Besoin d'aide pour choisir votre formation ?",
        finalDesc:
          "Si vous hésitez, réservez un créneau avec un expert IA qui vous orientera. Si vous savez déjà ce que vous voulez, inscrivez-vous directement à la formation choisie.",
        primaryCta: "Parler à un expert IA",
        secondaryCta: "M'inscrire à une formation",
        quickLinks: [
          { title: "Certification", desc: "Objectifs, programme et valeur métier.", href: "/certification" },
          { title: "Outils IA", desc: "Stacks, workflows et outils recommandés.", href: "/outils-ia" },
          { title: "Expert IA", desc: "Recevoir une recommandation claire.", href: "/contact" },
        ],
      }
    : {
        badge: "Catalogue",
        sectionIntroTitle: "A clearer catalogue to choose faster",
        sectionIntroDesc:
          "Browse the offer by domain, filter by level, and move straight toward the right training.",
        domainsTitle: "Explore by area of expertise",
        domainsDesc:
          "Each domain groups the most useful training options for the same role or function.",
        searchTitle: "Search for a training",
        searchDesc:
          "Use search when you already have a specific need, then refine with filters.",
        newTitle: "New trainings to discover",
        newDesc:
          "Find the latest training additions to the catalogue here.",
        finalTitle: "Need help choosing your training?",
        finalDesc:
          "If you're unsure, book a slot with an AI expert who will guide you. If you already know what you want, enrol directly in the chosen training.",
        primaryCta: "Speak with an AI expert",
        secondaryCta: "Enrol in a training",
        quickLinks: [
          { title: "Certification", desc: "Goals, program, and business value.", href: "/certification" },
          { title: "AI tools", desc: "Stacks, workflows, and recommended tools.", href: "/outils-ia" },
          { title: "AI expert", desc: "Receive a clear recommendation.", href: "/contact" },
        ],
      };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={t("catalogue.title")} subtitle={t("catalogue.subtitle")} badge={guideCopy.badge} />

        <section className="py-6">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-heading text-lg font-semibold text-card-foreground">
                  {language === "fr" ? "Recevez le catalogue complet par email" : "Receive the full catalogue by email"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {language === "fr"
                    ? "PDF détaillé des 13 domaines et 130+ formations, livré en quelques minutes."
                    : "Detailed PDF of 13 domains and 130+ courses, delivered within minutes."}
                </p>
              </div>
              <Button asChild className="shrink-0 bg-coral-gradient text-white hover:opacity-90">
                <Link to="/demande-catalogue">
                  <Download size={16} className="mr-2" />
                  {language === "fr" ? "Demander le catalogue" : "Request catalogue"}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-6 rounded-3xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="max-w-3xl">
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">{guideCopy.sectionIntroTitle}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{guideCopy.sectionIntroDesc}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-card-foreground">
                    <BookOpen size={16} className="text-primary" />
                    <strong>{totalFormations}+</strong> {t("catalogue.formations")}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-card-foreground">
                    <BarChart3 size={16} className="text-primary" />
                    <strong>{totalDomains}</strong> {t("catalogue.domainsExpertise")}
                  </span>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {guideCopy.quickLinks.map((link) => (
                  <Link key={link.title} to={link.href} className="rounded-2xl border border-border bg-background p-4 transition hover:border-primary/30 hover:text-primary">
                    <h3 className="font-heading text-base font-semibold text-card-foreground">{link.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{link.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      {language === "fr" ? "Ouvrir" : "Open"} <ArrowRight size={14} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full sm:w-auto bg-muted/50 p-1 rounded-xl mb-8 h-auto flex-wrap">
                <TabsTrigger
                  value="explorer"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 py-2.5 text-sm font-semibold transition-all"
                >
                  <BookOpen size={16} className="mr-2" />
                  {t("catalogue.tabExplore")}
                </TabsTrigger>
                <TabsTrigger
                  value="rechercher"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 py-2.5 text-sm font-semibold transition-all"
                >
                  <Search size={16} className="mr-2" />
                  {t("catalogue.tabSearch")}
                </TabsTrigger>
                <TabsTrigger
                  value="parcours"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 py-2.5 text-sm font-semibold transition-all"
                >
                  <Route size={16} className="mr-2" />
                  {parcoursCopy.tab}
                </TabsTrigger>
                <TabsTrigger
                  value="nouveautes"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 py-2.5 text-sm font-semibold transition-all"
                >
                  <Sparkles size={16} className="mr-2" />
                  {t("catalogue.tabNew")}
                </TabsTrigger>
              </TabsList>

              {/* â•â•â• TAB 1: EXPLORER PAR DOMAINE â•â•â• */}
              <TabsContent value="explorer">
                <div className="mb-8">
                  <h3 className="font-heading text-xl font-bold text-card-foreground mb-2">{guideCopy.domainsTitle}</h3>
                  <p className="text-sm text-muted-foreground max-w-3xl">{guideCopy.domainsDesc}</p>
                </div>
                <AnimatePresence mode="wait">
                  {!selectedDomain ? (
                    <motion.div
                      key="domains-grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {metiers.map((domain) => (
                          <DomainCard
                            key={domain}
                            domain={domain}
                            count={domainGroups[domain]?.length || 0}
                            onClick={() => setSelectedDomain(domain)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="domain-detail"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <button
                        onClick={() => setSelectedDomain(null)}
                        className="flex items-center gap-2 text-sm font-semibold text-primary mb-6 hover:underline"
                      >
                        <ChevronRight size={16} className="rotate-180" />
                        {t("catalogue.backToDomains")}
                      </button>

                      <div className="flex items-center gap-4 mb-8">
                        {(() => {
                          const Icon = domainIcons[selectedDomain] || BookOpen;
                          const domainCertificationSlug = resolveCertificationSlugFromSector(selectedDomain);
                          const domainToolSlug = resolveToolSlugFromSector(selectedDomain);
                          return (
                            <>
                              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon size={28} className="text-primary" />
                              </div>
                              <div>
                                <h2 className="font-heading text-2xl font-bold text-card-foreground">{t(`catalogue.domains.${fixMojibake(selectedDomain)}`) || fixMojibake(selectedDomain)}</h2>
                                <p className="text-sm text-muted-foreground">{domainGroups[selectedDomain]?.length || 0} {t("catalogue.availableFormations")}</p>
                                <div className="mt-3 flex flex-wrap gap-3">
                                  <Link
                                    to={domainCertificationSlug ? `/certification?domaine=${domainCertificationSlug}` : "/certification"}
                                    className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-xs font-semibold text-primary hover:border-primary/40"
                                  >
                                    {language === "fr" ? "Voir la certification" : "View certification"}
                                  </Link>
                                  <Link
                                    to={domainToolSlug ? `/outils-ia?domaine=${domainToolSlug}` : "/outils-ia"}
                                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-card-foreground hover:border-primary/30 hover:text-primary"
                                  >
                                    {language === "fr" ? "Voir les outils IA" : "View AI tools"}
                                  </Link>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {(domainGroups[selectedDomain] || []).map((f, i) => (
                          <FormationCard key={f.id} f={f} i={i} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              {/* â•â•â• TAB 2: RECHERCHER â•â•â• */}
              <TabsContent value="rechercher">
                <div className="mb-8">
                  <h3 className="font-heading text-xl font-bold text-card-foreground mb-2">{guideCopy.searchTitle}</h3>
                  <p className="text-sm text-muted-foreground max-w-3xl">{guideCopy.searchDesc}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter size={18} className="text-muted-foreground" />
                    <h3 className="font-heading font-semibold text-sm text-card-foreground">{t("catalogue.advancedFilters")}</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder={t("catalogue.search")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <select value={filterMetier} onChange={(e) => setFilterMetier(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none">
                      <option value="">{t("catalogue.allMetiers")}</option>
                      {metiers.map((m) => <option key={m} value={m}>{t(`catalogue.domains.${fixMojibake(m)}`) || fixMojibake(m)}</option>)}
                    </select>
                    <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none">
                      <option value="">{t("catalogue.allLevels")}</option>
                      {levels.map((l) => <option key={l} value={l}>{getLevel({ level: l } as Formation)}</option>)}
                    </select>
                    <select value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none">
                      <option value="">{t("catalogue.allFormats")}</option>
                      {formats.map((f) => <option key={f} value={f}>{getFormat({ format: f } as Formation)}</option>)}
                    </select>
                  </div>

                  {/* Active filters */}
                  {(search || filterMetier || filterLevel || filterFormat) && (
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">{t("catalogue.activeFilters")}</span>
                      {search && (
                        <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setSearch("")}>
                          "{search}" <X size={12} />
                        </Badge>
                      )}
                      {filterMetier && (
                        <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setFilterMetier("")}>
                          {t(`catalogue.domains.${fixMojibake(filterMetier)}`) || fixMojibake(filterMetier)} <X size={12} />
                        </Badge>
                      )}
                      {filterLevel && (
                        <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setFilterLevel("")}>
                          {getLevel({ level: filterLevel } as Formation)} <X size={12} />
                        </Badge>
                      )}
                      {filterFormat && (
                        <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setFilterFormat("")}>
                          {getFormat({ format: filterFormat } as Formation)} <X size={12} />
                        </Badge>
                      )}
                      <button
                        onClick={() => { setSearch(""); setFilterMetier(""); setFilterLevel(""); setFilterFormat(""); }}
                        className="text-xs text-primary font-semibold hover:underline ml-2"
                      >
                        {t("catalogue.clearAll")}
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  {searchFiltered.length} {t("catalogue.found")}
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {searchFiltered.map((f, i) => (
                    <FormationCard key={f.id} f={f} i={i} />
                  ))}
                </div>

                {searchFiltered.length === 0 && (
                  <div className="text-center py-16">
                    <Search size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">{t("catalogue.noResults")}</h3>
                    <p className="text-sm text-muted-foreground">{t("catalogue.noResultsHint")}</p>
                  </div>
                )}
              </TabsContent>

              {/* â•â•â• TAB 3: NOUVEAUTÃ‰S â•â•â• */}
              <TabsContent value="nouveautes">
                <div className="mb-8">
                  <h3 className="font-heading text-xl font-bold text-card-foreground mb-2">{guideCopy.newTitle}</h3>
                  <p className="text-sm text-muted-foreground max-w-3xl">{guideCopy.newDesc}</p>
                </div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(145,65%,42%)]/10 flex items-center justify-center">
                    <Sparkles size={20} className="text-[hsl(145,65%,42%)]" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-card-foreground">{t("catalogue.recentFormations")}</h2>
                    <p className="text-sm text-muted-foreground">{newFormations.length} {t("catalogue.newFormationsAdded")}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {newFormations.map((f, i) => (
                    <FormationCard key={f.id} f={f} i={i} isNew />
                  ))}
                </div>
              </TabsContent>

              {/* TAB 4: PARCOURS THÉMATIQUES */}
              <TabsContent value="parcours">
                <div className="mb-8">
                  <h3 className="font-heading text-xl font-bold text-card-foreground mb-2">{parcoursCopy.title}</h3>
                  <p className="text-sm text-muted-foreground max-w-3xl">{parcoursCopy.desc}</p>
                </div>

                <div className="space-y-8">
                  {metierParcours.map((path) => {
                    const totalCourses = path.levels.reduce((sum, lg) => sum + lg.formations.length, 0);
                    if (totalCourses === 0) return null;
                    return (
                      <div key={path.title} className="bg-card border border-border rounded-2xl p-6 md:p-8">
                        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                          <div>
                            <h4 className="font-heading text-lg font-bold text-card-foreground">{path.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{path.desc}</p>
                          </div>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary inline-flex items-center gap-1 shrink-0">
                            <BookOpen size={14} />
                            {totalCourses} {parcoursCopy.coursesLabel}
                          </span>
                        </div>

                        <div className="space-y-5">
                          {path.levels.map((levelGroup) => {
                            if (levelGroup.formations.length === 0) return null;
                            const Icon = levelIcons[levelGroup.level];
                            return (
                              <div key={levelGroup.level}>
                                <div className="flex items-center gap-2 mb-3">
                                  <Icon size={16} className="text-primary" />
                                  <span className="font-semibold text-sm text-card-foreground">
                                    {t(`parcours.levels.${levelGroup.level}`) || levelGroup.level}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({levelGroup.formations.length})
                                  </span>
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {levelGroup.formations.slice(0, 3).map((formation) => (
                                    <Link
                                      key={formation.id}
                                      to={`/catalogue/${formation.id}`}
                                      className="p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 hover:border-primary/30 transition-colors group"
                                    >
                                      <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                                        {getTitle(formation)}
                                      </p>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="rounded-[32px] bg-[hsl(225,55%,12%)] px-8 py-10 md:px-12 md:py-12">
              <div className="max-w-3xl">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">{guideCopy.finalTitle}</h2>
                <p className="text-[hsl(210,20%,78%)] text-lg leading-relaxed mb-8">{guideCopy.finalDesc}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-coral-gradient font-semibold text-sm px-7 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ color: "hsl(0 0% 100%)" }}
                >
                  {guideCopy.primaryCta} <ArrowRight size={16} />
                </Link>
                <Link
                  to="/inscription"
                  className="inline-flex items-center gap-2 border border-white/20 bg-white/5 font-semibold text-sm px-7 py-3 rounded-lg hover:bg-white/10 transition-colors text-white"
                >
                  {guideCopy.secondaryCta}
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

export default CataloguePage;
