import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, ExternalLink, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { useResourceFeed } from "@/hooks/useResourceFeed";
import { useResourcePost } from "@/hooks/useResourcePost";
import { isResourceNew, type ResourceCategoryKey, type ResourceSource } from "@/lib/resource-feed";
import { buildContactPath, resolveCatalogueSlugFromSector } from "@/lib/site-links";

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

const replaceDynamicTokens = (value: string, language: "fr" | "en") => {
  const currentDate = new Intl.DateTimeFormat(language === "en" ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return value
    .replaceAll("{{CURRENT_DATE}}", currentDate)
    .replaceAll("{{CURRENT_DATE_FR}}", new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date()))
    .replaceAll("{{CURRENT_DATE_EN}}", new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date()));
};

const resolveSectorLabel = (
  sector: string | null | undefined,
  translate: (key: string) => string,
) => {
  if (!sector) {
    return null;
  }

  const translated = translate(`catalogue.domains.${sector}`);
  return translated !== `catalogue.domains.${sector}` ? translated : sector;
};

const BlogArticlePage = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const { item, isLoading, notFound } = useResourcePost(slug);
  const { items } = useResourceFeed();
  const content = t("blog");

  const title = language === "en" ? item?.titleEn : item?.titleFr;
  const excerpt = language === "en" ? item?.excerptEn : item?.excerptFr;
  const body = replaceDynamicTokens(
    (language === "en" ? item?.contentEn || item?.contentFr : item?.contentFr || item?.contentEn) || excerpt || "",
    language,
  );
  const sectorLabel = resolveSectorLabel(item?.sectorKey, t);
  const categoryLabel = item ? t(`blog.categories.${item.categoryKey}`) : "";
  const catalogueSlug = resolveCatalogueSlugFromSector(item?.sectorKey);

  const sources = useMemo<ResourceSource[]>(() => {
    if (!item) {
      return [];
    }

    if (item.sources.length > 0) {
      return item.sources;
    }

    if (item.sourceName && item.sourceUrl) {
      return [
        {
          label: item.sourceName,
          url: item.sourceUrl,
          publisher: item.sourceName,
        },
      ];
    }

    return [];
  }, [item]);

  const relatedItems = useMemo(
    () =>
      items
        .filter((entry) => entry.slug !== item?.slug && (!item?.sectorKey || entry.sectorKey === item.sectorKey))
        .slice(0, 3),
    [item?.sectorKey, item?.slug, items],
  );

  useEffect(() => {
    if (!item || !title || !excerpt) {
      return;
    }

    const seoTitle =
      language === "en"
        ? item.seoTitleEn || `${title} | TransferAI Africa`
        : item.seoTitleFr || `${title} | TransferAI Africa`;
    const seoDescription =
      language === "en"
        ? item.seoDescriptionEn || excerpt
        : item.seoDescriptionFr || excerpt;
    const canonical = buildAbsoluteUrl(`/blog/${item.slug}`);

    document.title = seoTitle;
    setMetaTag("name", "description", seoDescription);
    setMetaTag("name", "robots", "index,follow");
    setMetaTag("property", "og:type", "article");
    setMetaTag("property", "og:title", seoTitle);
    setMetaTag("property", "og:description", seoDescription);
    setMetaTag("property", "og:url", canonical);
    setMetaTag("property", "og:image", buildAbsoluteUrl(item.coverImageUrl || "/placeholder.svg"));
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", seoTitle);
    setMetaTag("name", "twitter:description", seoDescription);
    setMetaTag("name", "twitter:image", buildAbsoluteUrl(item.coverImageUrl || "/placeholder.svg"));
    setCanonicalLink(canonical);
  }, [excerpt, item, language, title]);

  const formatDate = (value?: string | null) => {
    if (!value) {
      return "";
    }

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-12">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft size={16} />
            {content.backToFeed}
          </Link>

          {isLoading ? (
            <div className="mt-8 rounded-3xl border border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">{content.loadingArticle}</p>
            </div>
          ) : notFound || !item ? (
            <div className="mt-8 rounded-3xl border border-border bg-card p-10 text-center">
              <h1 className="font-heading text-3xl font-bold text-card-foreground">{content.articleNotFoundTitle}</h1>
              <p className="mt-3 text-sm text-muted-foreground">{content.articleNotFoundDesc}</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <article className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-semibold uppercase tracking-[0.14em] ${categoryColors[item.categoryKey]}`}>
                    {categoryLabel}
                  </span>
                  {sectorLabel ? (
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {sectorLabel}
                    </span>
                  ) : null}
                  {isResourceNew(item.publishedAt, item.isNewManual) ? (
                    <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primary-foreground">
                      {content.newBadge}
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-card-foreground">
                  {title}
                </h1>

                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{excerpt}</p>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {item.readTimeMinutes ? (
                    <span className="inline-flex items-center gap-2">
                      <Clock size={16} />
                      {item.readTimeMinutes} min
                    </span>
                  ) : null}
                  <span>{formatDate(item.publishedAt)}</span>
                  {item.sourceName ? <span>{content.sourceLabel}: {item.sourceName}</span> : null}
                </div>

                <div className="mt-10 whitespace-pre-line text-base leading-8 text-card-foreground">
                  {body}
                </div>

                {sources.length > 0 ? (
                  <section className="mt-12 rounded-2xl border border-border bg-muted/35 p-6">
                    <h2 className="font-heading text-xl font-bold text-card-foreground">{content.articleSourcesTitle}</h2>
                    <div className="mt-4 space-y-3">
                      {sources.map((source) => (
                        <a
                          key={`${source.label}-${source.url}`}
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3 text-sm hover:border-primary/40"
                        >
                          <div>
                            <p className="font-semibold text-card-foreground">{source.label}</p>
                            <p className="text-muted-foreground">
                              {[source.publisher, formatDate(source.publishedAt)].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                          <ExternalLink size={16} className="mt-0.5 shrink-0 text-primary" />
                        </a>
                      ))}
                    </div>
                  </section>
                ) : null}
              </article>

              <aside className="space-y-6">
                <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    <Sparkles size={14} />
                    {content.articleSidebarBadge}
                  </span>
                  <h2 className="mt-4 font-heading text-2xl font-bold text-card-foreground">{content.articleSidebarTitle}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{content.articleSidebarDesc}</p>

                  <div className="mt-6 grid gap-3">
                    {catalogueSlug ? (
                      <Link
                        to={`/catalogues-domaines/${catalogueSlug}`}
                        className="inline-flex items-center justify-center rounded-xl bg-orange-gradient px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
                      >
                        {content.articlePrimaryCta}
                      </Link>
                    ) : (
                      <Link
                        to="/catalogue"
                        className="inline-flex items-center justify-center rounded-xl bg-orange-gradient px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
                      >
                        {content.articleFallbackCta}
                      </Link>
                    )}
                    <Link
                      to={buildContactPath("demande-renseignement", item.sectorKey ?? undefined)}
                      className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-semibold text-card-foreground hover:border-primary/40 hover:text-primary"
                    >
                      {content.articleSecondaryCta}
                    </Link>
                  </div>
                </div>

                {relatedItems.length > 0 ? (
                  <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-primary">
                      <BookOpen size={16} />
                      <span className="text-xs font-semibold uppercase tracking-[0.14em]">{content.relatedTitle}</span>
                    </div>
                    <div className="mt-4 space-y-4">
                      {relatedItems.map((related) => {
                        const relatedTitle = language === "en" ? related.titleEn : related.titleFr;
                        const relatedExcerpt = language === "en" ? related.excerptEn : related.excerptFr;

                        return (
                          <Link
                            key={related.id}
                            to={`/blog/${related.slug}`}
                            className="block rounded-2xl border border-border px-4 py-4 hover:border-primary/40"
                          >
                            <p className="font-semibold text-card-foreground">{relatedTitle}</p>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">{relatedExcerpt}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogArticlePage;
