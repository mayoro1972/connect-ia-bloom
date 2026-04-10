import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import BlogNewsletterSignup from "@/components/BlogNewsletterSignup";
import { useLanguage } from "@/i18n/LanguageContext";
import { useResourceFeed } from "@/hooks/useResourceFeed";
import { isResourceNew, type ResourceCategoryKey } from "@/lib/resource-feed";
import { buildContactPath, resolveCatalogueSlugFromSector } from "@/lib/site-links";
import { getBlogSectorSlug, resolveBlogSectorFromSlug, resolveBlogSectorLabel } from "@/lib/blog-domains";

const categoryColors: Record<ResourceCategoryKey, string> = {
  "expertise-ai": "text-primary",
  guides: "text-coral",
  "case-studies": "text-destructive",
  veille: "text-[hsl(145,65%,42%)]",
};

const setMetaTag = (attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const setCanonicalLink = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

const buildAbsoluteUrl = (pathname: string) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.transferai.ci";
  return new URL(pathname, origin).toString();
};

const BlogDomainPage = () => {
  const { domainSlug } = useParams();
  const { language, t } = useLanguage();
  const { items, isLoading } = useResourceFeed();
  const content = t("blog");

  const sector = useMemo(
    () => resolveBlogSectorFromSlug(items, domainSlug),
    [domainSlug, items],
  );
  const sectorLabel = resolveBlogSectorLabel(sector, t);

  const filteredItems = useMemo(
    () => items.filter((item) => (sector ? getBlogSectorSlug(item.sectorKey ?? "") === getBlogSectorSlug(sector) : false)),
    [items, sector],
  );

  const catalogueSlug = resolveCatalogueSlugFromSector(sector);

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

  useEffect(() => {
    if (!sector || !sectorLabel) {
      return;
    }

    const title =
      language === "en"
        ? `${sectorLabel} AI watch in Africa | TransferAI Africa`
        : `Veille IA ${sectorLabel} en Côte d’Ivoire et en Afrique | TransferAI Africa`;
    const description =
      language === "en"
        ? `Explore TransferAI Africa's articles, watch items and practical resources for ${sectorLabel}, with a focus on Côte d'Ivoire and African business use cases.`
        : `Explorez les articles, veilles et ressources TransferAI Africa consacrés à ${sectorLabel}, avec un angle Côte d’Ivoire, Afrique et usages métiers concrets.`;
    const canonical = buildAbsoluteUrl(`/blog/domaine/${domainSlug}`);

    document.title = title;
    setMetaTag("name", "description", description);
    setMetaTag("name", "robots", "index,follow");
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", canonical);
    setMetaTag("property", "og:image", buildAbsoluteUrl("/placeholder.svg"));
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", buildAbsoluteUrl("/placeholder.svg"));
    setCanonicalLink(canonical);
  }, [domainSlug, language, sector, sectorLabel]);

  const renderCard = (article: (typeof items)[number]) => {
    const title = language === "en" ? article.titleEn : article.titleFr;
    const excerpt = language === "en" ? article.excerptEn : article.excerptFr;
    const categoryLabel = t(`blog.categories.${article.categoryKey}`);
    const isRecent = isResourceNew(article.publishedAt, article.isNewManual);

    return (
      <Link key={article.id} to={`/blog/${article.slug}`} className="group flex h-full min-h-[400px] flex-col rounded-xl border border-border bg-card p-6 hover-lift">
        <div className="flex min-h-[52px] items-start justify-between gap-3">
          <span className={`text-xs font-semibold ${categoryColors[article.categoryKey] || "text-primary"}`}>
            {categoryLabel}
          </span>
          {isRecent ? (
            <span className="inline-flex shrink-0 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] leading-none text-primary-foreground">
              {content.newBadge}
            </span>
          ) : (
            <span className="h-6 w-[72px] shrink-0" aria-hidden="true" />
          )}
        </div>

        <h2 className="mt-4 min-h-[7rem] line-clamp-4 font-heading text-xl font-bold leading-snug text-card-foreground transition-colors group-hover:text-primary">
          {title}
        </h2>
        <p className="mt-3 min-h-[6.75rem] line-clamp-4 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3">
            {article.readTimeMinutes ? (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {article.readTimeMinutes} min
              </span>
            ) : null}
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary">
            {content.readArticle}
            <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title={sectorLabel || content.domainPageFallbackTitle}
        subtitle={
          sectorLabel
            ? content.domainPageSubtitle.replace("{domain}", sectorLabel)
            : content.domainPageFallbackDesc
        }
      />

      <main className="py-16">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft size={16} />
            {content.backToFeed}
          </Link>

          {!sector && isLoading ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">{content.loading}</p>
            </div>
          ) : !sector ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="font-heading text-2xl font-bold text-card-foreground">{content.domainPageFallbackTitle}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{content.domainPageFallbackDesc}</p>
            </div>
          ) : (
            <>
              <section className="mt-8 rounded-[1.75rem] border border-border bg-card p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      <Sparkles size={14} />
                      {content.feedBadge}
                    </span>
                    <h1 className="mt-4 font-heading text-3xl font-bold text-card-foreground">
                      {content.domainPageHeading.replace("{domain}", sectorLabel || sector)}
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                      {content.domainPageIntro.replace("{domain}", sectorLabel || sector)}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {filteredItems.length} {content.resultsLabel}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={catalogueSlug ? `/catalogues-domaines/${catalogueSlug}` : "/catalogue"}
                    className="inline-flex items-center justify-center rounded-full bg-orange-gradient px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                  >
                    {catalogueSlug ? content.articlePrimaryCta : content.articleFallbackCta}
                  </Link>
                  <Link
                    to={buildContactPath("demande-renseignement", sector)}
                    className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-card-foreground hover:border-primary/40 hover:text-primary"
                  >
                    {content.articleSecondaryCta}
                  </Link>
                </div>
              </section>

              <section className="mt-10">
                {isLoading ? (
                  <div className="rounded-2xl border border-border bg-card p-8 text-center">
                    <p className="text-sm text-muted-foreground">{content.loading}</p>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-card p-8 text-center">
                    <h2 className="font-heading text-2xl font-bold text-card-foreground">{content.filteredEmptyTitle}</h2>
                    <p className="mt-3 text-sm text-muted-foreground">{content.filteredEmptyDesc}</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {filteredItems.map(renderCard)}
                  </div>
                )}
              </section>

              <section className="mt-10">
                <BlogNewsletterSignup
                  availableSectors={sector ? [sector] : []}
                  defaultSector={sector}
                  sourcePage={`/blog/domaine/${domainSlug ?? ""}`}
                  compact
                />
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDomainPage;
