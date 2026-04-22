import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { supabase, isSupabaseConfigured, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { getBlogSectorSlug, resolveBlogSectorLabel, transferAiNewsletterDomains } from "@/lib/blog-domains";
import { toast } from "@/components/ui/use-toast";

type BlogNewsletterSignupProps = {
  availableSectors: string[];
  sourcePage: string;
  defaultSector?: string | null;
  compact?: boolean;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const BlogNewsletterSignup = ({
  availableSectors,
  sourcePage,
  defaultSector,
  compact = false,
}: BlogNewsletterSignupProps) => {
  const { language, t } = useLanguage();
  const content = t("blog");
  const [email, setEmail] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!defaultSector) {
      return;
    }

    setSelectedSectors((current) => (current.includes(defaultSector) ? current : [defaultSector, ...current]));
  }, [defaultSector]);

  const suggestedSectors = useMemo(
    () =>
      Array.from(
        new Map(
          [...transferAiNewsletterDomains, ...availableSectors].map((sector) => [
            getBlogSectorSlug(sector),
            sector,
          ]),
        ).values(),
      ),
    [availableSectors],
  );

  const toggleSector = (sector: string) => {
    setSelectedSectors((current) =>
      current.includes(sector) ? current.filter((item) => item !== sector) : [...current, sector],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      toast({
        title: content.newsletterInvalidTitle,
        description: content.newsletterInvalidDesc,
        variant: "destructive",
      });
      return;
    }

    if (selectedSectors.length === 0) {
      toast({
        title: content.newsletterDomainRequiredTitle,
        description: content.newsletterDomainRequiredDesc,
        variant: "destructive",
      });
      return;
    }

    if (!isSupabaseConfigured) {
      toast({
        title: content.newsletterErrorTitle,
        description: supabaseUnavailableMessage,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.functions.invoke("newsletter-subscribe", {
      body: {
        email: email.trim(),
        language,
        subscribed_domains: selectedSectors,
        source_page: sourcePage,
      },
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: content.newsletterErrorTitle,
        description: content.newsletterErrorDesc,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: content.newsletterSuccessTitle,
      description: content.newsletterSuccessDesc,
    });
  };

  return (
    <section className={`rounded-[1.75rem] border border-border bg-card ${compact ? "p-6" : "p-8"}`}>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Sparkles size={14} />
            {content.newsletterBadge}
          </span>
          <h2 className={`mt-4 font-heading font-bold text-card-foreground ${compact ? "text-2xl" : "text-3xl"}`}>
            {content.newsletterTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{content.newsletterDesc}</p>
        </div>

        <div className="rounded-2xl bg-background px-4 py-3 text-sm text-muted-foreground">
          {selectedSectors.length > 0 ? (
            <>
              <span className="font-semibold text-card-foreground">{selectedSectors.length}</span>{" "}
              {content.newsletterSelectedLabel}
            </>
          ) : (
            <span className="font-semibold text-card-foreground">{content.newsletterSelectedEmptyLabel}</span>
          )}
        </div>
      </div>

      <div className={`mt-6 grid gap-6 ${compact ? "lg:grid-cols-[1.2fr_0.8fr]" : "lg:grid-cols-[1.4fr_0.6fr]"}`}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-[1.5rem] border border-primary/15 bg-primary/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {content.newsletterWeeklyTitle}
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                content.newsletterWeeklyPoint1,
                content.newsletterWeeklyPoint2,
                content.newsletterWeeklyPoint3,
                content.newsletterWeeklyPoint4,
                content.newsletterWeeklyPoint5,
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-card-foreground">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="newsletter-email" className="text-sm font-semibold text-card-foreground">
              {content.newsletterEmailLabel}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={content.newsletterEmailPlaceholder}
                  className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm text-card-foreground outline-none transition focus:border-primary/50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-orange-gradient px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? content.newsletterSubmitting : content.newsletterPrimaryCta}
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-card-foreground">{content.newsletterDomainsLabel}</p>
            <div className="flex flex-wrap gap-3">
              {suggestedSectors.map((sector) => {
                const isSelected = selectedSectors.includes(sector);
                return (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => toggleSector(sector)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-card-foreground hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {resolveBlogSectorLabel(sector, t)}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">{content.newsletterMoreDomains}</p>
          </div>
        </form>

        <div className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{content.newsletterWhyTitle}</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {[content.newsletterWhyPoint1, content.newsletterWhyPoint2, content.newsletterWhyPoint3].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {isSubmitted ? (
            <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-card-foreground">
              {content.newsletterSuccessInline}
            </div>
          ) : (
            <div className="mt-5 text-xs leading-relaxed text-muted-foreground">
              {content.newsletterHelp}
              {selectedSectors.length > 0 ? (
                <>
                  {" "}
                  {selectedSectors
                    .map((sector) => resolveBlogSectorLabel(sector, t))
                    .join(", ")}
                  .
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogNewsletterSignup;
