import { motion } from "framer-motion";
import { Clock, ExternalLink, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/i18n/LanguageContext";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { isResourceNew, type ResourceCategoryKey } from "@/lib/resource-feed";
import { useResourceFeed } from "@/hooks/useResourceFeed";

const categoryColors: Record<ResourceCategoryKey, string> = {
  "expertise-ai": "text-primary",
  guides: "text-coral",
  "case-studies": "text-destructive",
  veille: "text-[hsl(145,65%,42%)]",
};

const BlogPage = () => {
  const { language, t } = useLanguage();
  const { items, isLoading } = useResourceFeed();
  const content = t("blog");

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

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
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
              <div className="grid gap-6 md:grid-cols-2">
                {items.map((article, index) => {
                  const title = language === "en" ? article.titleEn : article.titleFr;
                  const excerpt = language === "en" ? article.excerptEn : article.excerptFr;
                  const sectorLabel =
                    article.sectorKey && (t(`catalogue.domains.${article.sectorKey}`) || article.sectorKey);
                  const categoryLabel = t(`blog.categories.${article.categoryKey}`);
                  const isRecent = isResourceNew(article.publishedAt, article.isNewManual);
                  const Wrapper = article.sourceUrl ? "a" : "article";

                  return (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <Wrapper
                        {...(article.sourceUrl
                          ? {
                              href: article.sourceUrl,
                              target: "_blank",
                              rel: "noreferrer",
                            }
                          : {})}
                        className="group block rounded-xl border border-border bg-card p-6 hover-lift"
                      >
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
                            {article.sourceName ? (
                              <span>
                                {content.sourceLabel}: {article.sourceName}
                              </span>
                            ) : null}
                            {article.sourceUrl ? <ExternalLink size={14} /> : null}
                          </div>
                        </div>
                      </Wrapper>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default BlogPage;
