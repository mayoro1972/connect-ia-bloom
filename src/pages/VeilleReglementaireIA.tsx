import { useMemo, useState } from "react";
import { BellRing, Building2, ExternalLink, Landmark, RefreshCcw, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { useResourceFeed } from "@/hooks/useResourceFeed";
import {
  isRegulatoryWatchCandidate,
  regulatoryWatchSearchText,
  resolveRegulatoryImpactLevel,
  resolveRegulatoryJurisdiction,
  type RegulatoryImpactLevel,
  type RegulatoryJurisdiction,
} from "@/lib/regulatory-watch";

const watchCopy = {
  fr: {
    badge: "Banque · Côte d'Ivoire · conformité",
    title: "Veille réglementaire IA pour la banque en Côte d'Ivoire",
    subtitle:
      "Un flux dynamique pour suivre les signaux utiles autour de l'IA, de la conformité, de la gouvernance et des exigences applicables aux acteurs bancaires ivoiriens et régionaux.",
    live: "Flux dynamique connecté",
    liveOff: "Mode démonstration",
    liveDesc:
      "Les nouvelles publications apparaissent automatiquement dès qu'elles sont ajoutées au pipeline éditorial.",
    liveOffDesc:
      "Le flux reste consultable avec les contenus de démonstration tant que Supabase n'est pas connecté.",
    searchPlaceholder: "Rechercher une autorité, un thème, une obligation, un mot-clé",
    allJurisdictions: "Tous les périmètres",
    allImpacts: "Tous les niveaux",
    results: "signal(s) affiché(s)",
    newWindow: "nouveaux sur 30 jours",
    sources: "sources actives",
    timelineTitle: "Fil de veille",
    timelineDesc:
      "Chaque carte peut devenir un article de fond, une note de conformité ou une synthèse de direction selon votre mode d'exploitation.",
    methodologyTitle: "Comment opérer la veille",
    methodologyPoints: [
      "Ajouter les sources prioritaires: BCEAO, UEMOA, ARTCI, autorités de protection des données, régulateurs internationaux utiles.",
      "Déposer manuellement un nouveau signal dès qu'un texte, une note ou une annonce arrive.",
      "Lancer la classification puis la génération de brouillons depuis le back-office.",
      "Publier les notes validées pour alimenter automatiquement ce flux.",
    ],
    managePipeline: "Ouvrir le back-office éditorial",
    openArticle: "Lire la note",
    source: "Source",
    emptyTitle: "Aucun signal ne correspond aux filtres",
    emptyDesc:
      "Essayez un autre périmètre ou relâchez les mots-clés. Le flux se remplit au fur et à mesure des publications.",
    jurisdiction: {
      "cote-divoire": "Côte d'Ivoire",
      "uemoa-bceao": "UEMOA / BCEAO",
      afrique: "Afrique",
      international: "International",
    },
    impact: {
      high: "Impact élevé",
      medium: "Impact moyen",
      monitor: "À surveiller",
    },
  },
  en: {
    badge: "Banking · Côte d'Ivoire · compliance",
    title: "AI regulatory watch for banking in Côte d'Ivoire",
    subtitle:
      "A dynamic feed to track useful signals around AI, compliance, governance and requirements relevant to Ivorian and regional banking actors.",
    live: "Live connected feed",
    liveOff: "Demo mode",
    liveDesc:
      "New publications appear automatically as soon as they are added to the editorial pipeline.",
    liveOffDesc:
      "The feed remains available with demo content while Supabase is not connected.",
    searchPlaceholder: "Search an authority, a topic, an obligation or a keyword",
    allJurisdictions: "All scopes",
    allImpacts: "All levels",
    results: "signal(s) shown",
    newWindow: "new in 30 days",
    sources: "active sources",
    timelineTitle: "Watch stream",
    timelineDesc:
      "Each card can become a full article, a compliance note or an executive briefing depending on your operating model.",
    methodologyTitle: "How to operate the watch",
    methodologyPoints: [
      "Add the priority sources: BCEAO, UEMOA, ARTCI, data protection authorities and useful international regulators.",
      "Create a manual signal as soon as a new text, memo or announcement arrives.",
      "Run classification and then draft generation from the back office.",
      "Publish validated notes to feed this stream automatically.",
    ],
    managePipeline: "Open editorial back office",
    openArticle: "Read note",
    source: "Source",
    emptyTitle: "No signal matches the filters",
    emptyDesc:
      "Try another scope or relax the keywords. The feed fills up as publications are added.",
    jurisdiction: {
      "cote-divoire": "Côte d'Ivoire",
      "uemoa-bceao": "UEMOA / BCEAO",
      afrique: "Africa",
      international: "International",
    },
    impact: {
      high: "High impact",
      medium: "Medium impact",
      monitor: "Monitor",
    },
  },
} as const;

const impactTone: Record<RegulatoryImpactLevel, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  monitor: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const VeilleReglementaireIAPage = () => {
  const { language } = useLanguage();
  const copy = language === "en" ? watchCopy.en : watchCopy.fr;
  const { items, isLoading, hasDynamicSource } = useResourceFeed();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeJurisdiction, setActiveJurisdiction] = useState<RegulatoryJurisdiction | "all">("all");
  const [activeImpact, setActiveImpact] = useState<RegulatoryImpactLevel | "all">("all");

  const watchItems = useMemo(
    () => items.filter(isRegulatoryWatchCandidate),
    [items],
  );

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return watchItems.filter((item) => {
      const jurisdiction = resolveRegulatoryJurisdiction(item);
      const impact = resolveRegulatoryImpactLevel(item);
      const matchesJurisdiction = activeJurisdiction === "all" || jurisdiction === activeJurisdiction;
      const matchesImpact = activeImpact === "all" || impact === activeImpact;
      const matchesSearch =
        normalizedSearch.length === 0 || regulatoryWatchSearchText(item).includes(normalizedSearch.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

      return matchesJurisdiction && matchesImpact && matchesSearch;
    });
  }, [activeImpact, activeJurisdiction, searchTerm, watchItems]);

  const freshCount = useMemo(() => {
    const now = Date.now();
    return watchItems.filter((item) => {
      const publishedAt = new Date(item.publishedAt).getTime();
      return Number.isFinite(publishedAt) && now - publishedAt <= 30 * 24 * 60 * 60 * 1000;
    }).length;
  }, [watchItems]);

  const sourceCount = useMemo(
    () => new Set(watchItems.map((item) => item.sourceName).filter(Boolean)).size,
    [watchItems],
  );

  const jurisdictionOptions: Array<RegulatoryJurisdiction | "all"> = ["all", "cote-divoire", "uemoa-bceao", "afrique", "international"];
  const impactOptions: Array<RegulatoryImpactLevel | "all"> = ["all", "high", "medium", "monitor"];

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(language === "en" ? "en-GB" : "fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader title={copy.title} subtitle={copy.subtitle} badge={copy.badge} />

      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    <RefreshCcw size={14} />
                    {hasDynamicSource ? copy.live : copy.liveOff}
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                    {hasDynamicSource ? copy.liveDesc : copy.liveOffDesc}
                  </p>
                </div>

                <Link to="/back-office?tab=editorial">
                  <Button className="rounded-full">{copy.managePipeline}</Button>
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    <BellRing size={14} />
                    {copy.results}
                  </div>
                  <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{filteredItems.length}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    <ShieldCheck size={14} />
                    {copy.newWindow}
                  </div>
                  <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{freshCount}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    <Landmark size={14} />
                    {copy.sources}
                  </div>
                  <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{sourceCount}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-card-foreground">{copy.methodologyTitle}</h2>
              <div className="mt-4 space-y-3">
                {copy.methodologyPoints.map((point) => (
                  <div key={point} className="rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm leading-7 text-muted-foreground">
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.timelineTitle}</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{copy.timelineDesc}</p>
              </div>
              {isLoading ? <p className="text-sm text-muted-foreground">Chargement...</p> : null}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {jurisdictionOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setActiveJurisdiction(option)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      activeJurisdiction === option
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-card-foreground hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {option === "all" ? copy.allJurisdictions : copy.jurisdiction[option]}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {impactOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setActiveImpact(option)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      activeImpact === option
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-card-foreground hover:border-primary/40"
                    }`}
                  >
                    {option === "all" ? copy.allImpacts : copy.impact[option]}
                  </button>
                ))}
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-border bg-background/60 p-10 text-center">
                <Building2 className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-4 font-heading text-2xl font-bold text-card-foreground">{copy.emptyTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.emptyDesc}</p>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {filteredItems.map((item) => {
                  const jurisdiction = resolveRegulatoryJurisdiction(item);
                  const impact = resolveRegulatoryImpactLevel(item);
                  const title = language === "en" ? item.titleEn : item.titleFr;
                  const excerpt = language === "en" ? item.excerptEn : item.excerptFr;

                  return (
                    <article key={item.id} className="rounded-[1.5rem] border border-border bg-background/70 p-5">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{copy.jurisdiction[jurisdiction]}</Badge>
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${impactTone[impact]}`}>
                              {copy.impact[impact]}
                            </span>
                            {item.sectorKey ? <Badge variant="outline">{item.sectorKey}</Badge> : null}
                          </div>

                          <h3 className="mt-4 font-heading text-2xl font-bold leading-tight text-card-foreground">
                            {title}
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-muted-foreground">{excerpt}</p>

                          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span>{formatDate(item.publishedAt)}</span>
                            {item.sourceName ? <span>{copy.source}: {item.sourceName}</span> : null}
                          </div>

                          {item.tags.length > 0 ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {item.tags.slice(0, 6).map((tag) => (
                                <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          {item.sourceUrl ? (
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-card-foreground transition-colors hover:border-primary/40 hover:text-primary"
                            >
                              {copy.source}
                              <ExternalLink size={14} />
                            </a>
                          ) : null}
                          <Link
                            to={`/blog/${item.slug}`}
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                          >
                            {copy.openArticle}
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VeilleReglementaireIAPage;
