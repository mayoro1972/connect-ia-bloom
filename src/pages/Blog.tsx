import { ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/i18n/LanguageContext";
import { isResourceNew, type ResourceCategoryKey } from "@/lib/resource-feed";
import { useResourceFeed } from "@/hooks/useResourceFeed";
import { slugifySiteValue } from "@/lib/site-links";

const categoryColors: Record<ResourceCategoryKey, string> = {
  "expertise-ai": "text-primary",
  guides: "text-coral",
  "case-studies": "text-destructive",
  veille: "text-[hsl(145,65%,42%)]",
};

const preferredSectorOrder = [
  "IT & Transformation Digitale",
  "Finance & Fintech",
  "Agriculture & AgroTech IA",
  "Éducation & EdTech IA",
  "Santé & IA médicale",
  "Logistique & Supply Chain",
  "Énergie & Transition énergétique",
  "RH & Gestion des talents",
  "Marketing & Communication IA",
  "Droit & LegalTech IA",
  "Immobilier & Smart City",
  "Tourisme & Hospitalité",
  "Médias & Création de contenu",
];

const BlogPage = () => {
  const { language, t } = useLanguage();
  const { items, isLoading } = useResourceFeed();
  const content = t("blog");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDomain = searchParams.get("domain") ?? "all";
  const activeType = searchParams.get("type") ?? "all";

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const availableSectors = Array.from(
    new Map(
      items
        .filter((item) => item.sectorKey)
        .map((item) => [slugifySiteValue(item.sectorKey as string), item.sectorKey as string]),
    ).entries(),
  )
    .map(([, value]) => value)
    .sort((left, right) => {
      const leftIndex = preferredSectorOrder.indexOf(left);
      const rightIndex = preferredSectorOrder.indexOf(right);

      if (leftIndex === -1 && rightIndex === -1) {
        return left.localeCompare(right);
      }

      if (leftIndex === -1) {
        return 1;
      }

      if (rightIndex === -1) {
        return -1;
      }

      return leftIndex - rightIndex;
    });

  const filteredItems = items.filter((item) => {
    const domainMatches =
      activeDomain === "all" ||
      (item.sectorKey ? slugifySiteValue(item.sectorKey) === activeDomain : false);
    const typeMatches = activeType === "all" || item.categoryKey === activeType;
    return domainMatches && typeMatches;
  });

  const featuredItems = filteredItems.filter((item) => item.isFeatured).slice(0, 3);
  const featuredIds = new Set(featuredItems.map((item) => item.id));
  const latestItems = filteredItems.filter((item) => !featuredIds.has(item.id));

  const updateFilters = (next: { domain?: string; type?: string }) => {
    const params = new URLSearchParams(searchParams);

    const domain = next.domain ?? activeDomain;
    const type = next.type ?? activeType;

    if (domain === "all") {
      params.delete("domain");
    } else {
      params.set("domain", domain);
    }

    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }

    setSearchParams(params);
  };

  const renderCard = (article: (typeof items)[number]) => {
    const title = language === "en" ? article.titleEn : article.titleFr;
    const excerpt = language === "en" ? article.excerptEn : article.excerptFr;
    const sectorLabel =
      article.sectorKey && (t(`catalogue.domains.${article.sectorKey}`) || article.sectorKey);
    const categoryLabel = t(`blog.categories.${article.categoryKey}`);
    const isRecent = isResourceNew(article.publishedAt, article.isNewManual);

    return (
      <div key={article.id}>
        <Link to={`/blog/${article.slug}`} className="group block rounded-xl border border-border bg-card p-6 hover-lift">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold ${categoryColors[article.categoryKey] || "text-primary"}`}>
              {categoryLabel}
            </span>
            {sectorLabel && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                {sectorLabel}
              </span>
            )}
            {isRecent && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primary-foreground">
                {content.newBadge}
              </span>
            )}
          </div>

          <h3 className="mb-3 mt-3 font-heading text-lg font-bold text-card-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-3">
              {article.readTimeMinutes ? (
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {article.readTimeMinutes} min
                </span>
              ) : null}
              <span>{formatDate(article.publishedAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              {article.sourceName ? <span>{content.sourceLabel}: {article.sourceName}</span> : null}
              <span className="inline-flex items-center gap-1 font-semibold text-primary">
                {content.readArticle}
                <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader title={content.title} subtitle={content.subtitle} />

      <section className="py-16">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles size={14} />
              {content.feedBadge}
            </span>
            {isLoading && <span className="text-sm text-muted-foreground">{content.loading}</span>}
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="font-heading text-2xl font-bold text-card-foreground">{content.emptyTitle}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{content.emptyDesc}</p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="rounded-[1.75rem] border border-border bg-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-card-foreground">{content.domainFilterTitle}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{content.domainFilterDesc}</p>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {filteredItems.length} {content.resultsLabel}
                  </div>
                </div>

                <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => updateFilters({ domain: "all" })}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      activeDomain === "all"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-card-foreground hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {content.allDomains}
                  </button>
                  {availableSectors.map((sector) => {
                    const slug = slugifySiteValue(sector);
                    const count = items.filter((item) => item.sectorKey === sector).length;

                    return (
                      <button
                        key={sector}
                        type="button"
                        onClick={() => updateFilters({ domain: slug })}
                        className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          activeDomain === slug
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-card-foreground hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        {t(`catalogue.domains.${sector}`) || sector} ({count})
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => updateFilters({ type: "all" })}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      activeType === "all"
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-card-foreground hover:border-primary/40"
                    }`}
                  >
                    {content.allFormats}
                  </button>
                  {(["veille", "guides", "case-studies", "expertise-ai"] as ResourceCategoryKey[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateFilters({ type })}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        activeType === type
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background text-card-foreground hover:border-primary/40"
                      }`}
                    >
                      {t(`blog.categories.${type}`)}
                    </button>
                  ))}
                </div>
              </div>

              {filteredItems.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-8 text-center">
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">{content.filteredEmptyTitle}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{content.filteredEmptyDesc}</p>
                </div>
              ) : (
                <>
                  {featuredItems.length > 0 ? (
                    <div>
                      <div className="mb-4 flex items-center gap-2 text-primary">
                        <Sparkles size={16} />
                        <span className="text-xs font-semibold uppercase tracking-[0.16em]">{content.featuredTitle}</span>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {featuredItems.map(renderCard)}
                      </div>
                    </div>
                  ) : null}

                  {latestItems.length > 0 ? (
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h2 className="font-heading text-2xl font-bold text-card-foreground">{content.latestTitle}</h2>
                          <p className="mt-2 text-sm text-muted-foreground">{content.latestDesc}</p>
                        </div>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2">
                        {latestItems.map(renderCard)}
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BlogPage;
