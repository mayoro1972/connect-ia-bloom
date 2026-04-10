import { motion } from "framer-motion";
import { CheckCircle, BookOpen, Award, Clock, MapPin, Monitor, Calendar, BriefcaseBusiness } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { deepFixMojibake } from "@/lib/fixMojibake";
import { certificationDomainProfiles, getCertificationDomainProfile, type LocalizedText } from "@/data/certification-curricula";
import { resolveCatalogueSlugFromSector, resolveToolSlugFromSector } from "@/lib/site-links";

const CertificationPage = () => {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const trans = deepFixMojibake(language === "fr" ? fr : en);
  const content = trans.certification;
  const domainSlug = searchParams.get("domaine");
  const activeProfile = getCertificationDomainProfile(domainSlug);

  const localize = (value: LocalizedText) => (language === "en" ? value.en : value.fr);
  const profileLabel = localize(activeProfile.label);
  const profilePitch = localize(activeProfile.shortPitch);
  const profileCompanyPitch = localize(activeProfile.companyPitch);
  const profileTargets = language === "en" ? activeProfile.targetProfiles.en : activeProfile.targetProfiles.fr;
  const profileObjectives = language === "en" ? activeProfile.objectives.en : activeProfile.objectives.fr;
  const profileOutcomes = language === "en" ? activeProfile.businessOutcomes.en : activeProfile.businessOutcomes.fr;
  const profileDeliverables = language === "en" ? activeProfile.deliverables.en : activeProfile.deliverables.fr;
  const featuredTargets = profileTargets.slice(0, 3);
  const featuredOutcomes = profileOutcomes.slice(0, 3);
  const toolSlug = resolveToolSlugFromSector(activeProfile.domainKey);
  const catalogueSlug = resolveCatalogueSlugFromSector(activeProfile.domainKey);

  const selectDomain = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("domaine", slug);
    setSearchParams(params);
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader badge={content.badge} title={content.title} subtitle={content.subtitle} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="space-y-12 lg:col-span-2">
                <div className="rounded-3xl border border-border bg-card p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <BriefcaseBusiness size={24} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-card-foreground">{content.positioningTitle}</h2>
                    </div>
                  </div>
                  <p className="mb-6 leading-7 text-muted-foreground">{content.positioningDesc}</p>
                  <div>
                    <h3 className="mb-4 font-heading text-lg font-semibold text-card-foreground">{content.domainsTitle}</h3>
                    <p className="mb-4 text-sm leading-7 text-muted-foreground">{content.domainSelectorDesc}</p>
                    <div className="flex flex-wrap gap-3">
                      {certificationDomainProfiles.map((profile) => {
                        const label = localize(profile.label);
                        const isActive = profile.slug === activeProfile.slug;

                        return (
                          <button
                            key={profile.slug}
                            type="button"
                            onClick={() => selectDomain(profile.slug)}
                            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                              isActive
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-card-foreground hover:border-primary/40 hover:text-primary"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{content.sectorPitchTitle}</p>
                      <h3 className="mt-3 font-heading text-2xl font-bold text-card-foreground">{profileLabel}</h3>
                      <p className="mt-3 leading-7 text-muted-foreground">{profileCompanyPitch}</p>
                      <p className="mt-3 text-sm leading-7 text-card-foreground">{profilePitch}</p>
                      <div className="mt-5 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-primary/10 bg-background/80 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                            {language === "en" ? "Profiles concerned" : "Profils concernés"}
                          </p>
                          <div className="mt-3 space-y-3">
                            {featuredTargets.map((item) => (
                              <div key={item} className="flex items-start gap-2">
                                <CheckCircle size={16} className="mt-1 shrink-0 text-primary" />
                                <p className="text-sm leading-6 text-card-foreground">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-primary/10 bg-background/80 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                            {language === "en" ? "Expected business impact" : "Impacts attendus"}
                          </p>
                          <div className="mt-3 space-y-3">
                            {featuredOutcomes.map((item) => (
                              <div key={item} className="flex items-start gap-2">
                                <Award size={16} className="mt-1 shrink-0 text-coral" />
                                <p className="text-sm leading-6 text-card-foreground">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                          to={toolSlug ? `/outils-ia?domaine=${toolSlug}` : "/outils-ia"}
                          className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-background px-4 py-2 text-sm font-semibold text-primary hover:border-primary/40"
                        >
                          {language === "en" ? "See recommended AI tools" : "Voir les outils recommandés"}
                        </Link>
                        <Link
                          to={catalogueSlug ? `/catalogues-domaines/${catalogueSlug}` : "/catalogue"}
                          className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-card-foreground hover:border-primary/30 hover:text-primary"
                        >
                          {language === "en" ? "See related training" : "Voir les formations liées"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-3xl border border-border bg-card p-8">
                    <h2 className="mb-6 font-heading text-2xl font-bold text-card-foreground">{content.forWhoTitle}</h2>
                    <div className="space-y-4">
                      {profileTargets.map((profile) => (
                        <div key={profile} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                          <CheckCircle size={18} className="mt-0.5 shrink-0 text-primary" />
                          <p className="text-sm leading-7 text-card-foreground">{profile}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border bg-card p-8">
                    <h2 className="mb-6 font-heading text-2xl font-bold text-card-foreground">{content.valueTitle}</h2>
                    <div className="space-y-4">
                      {profileOutcomes.map((point) => (
                        <div key={point} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                          <Award size={18} className="mt-0.5 shrink-0 text-coral" />
                          <p className="text-sm leading-7 text-card-foreground">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="mb-6 font-heading text-2xl font-bold">{content.objectivesTitle}</h2>
                  <div className="space-y-4">
                    {profileObjectives.map((objective) => (
                      <motion.div key={objective} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-start gap-3">
                        <CheckCircle size={20} className="mt-0.5 shrink-0 text-primary" />
                        <p className="text-card-foreground">{objective}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-6 font-heading text-2xl font-bold">{content.programTitle}</h2>
                  <div className="space-y-3">
                    {activeProfile.program.map((module) => (
                      <div key={`${activeProfile.slug}-${module.day}`} className="rounded-2xl border border-border bg-card p-5">
                        <div className="flex items-start gap-3">
                          <div className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                            {module.day}
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                              {content.programDayLabel} {module.day}
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <BookOpen size={18} className="shrink-0 text-primary" />
                              <p className="text-sm font-semibold text-card-foreground">{localize(module.title)}</p>
                            </div>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground">{localize(module.summary)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-8">
                  <h2 className="mb-6 font-heading text-2xl font-bold text-card-foreground">{content.deliverablesTitle}</h2>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {profileDeliverables.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                        <BookOpen size={18} className="mt-0.5 shrink-0 text-primary" />
                        <p className="text-sm leading-7 text-card-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-8">
                  <h2 className="mb-4 font-heading text-2xl font-bold text-card-foreground">{content.specializationTitle}</h2>
                  <p className="mb-4 leading-7 text-muted-foreground">{content.specializationIntro}</p>
                  <p className="leading-7 text-muted-foreground">{content.specializationDesc}</p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {certificationDomainProfiles.map((profile) => (
                      <button
                        key={profile.slug}
                        type="button"
                        onClick={() => selectDomain(profile.slug)}
                        className={`rounded-2xl border p-5 text-left transition ${
                          profile.slug === activeProfile.slug
                            ? "border-primary bg-primary/5"
                            : "border-border bg-background hover:border-primary/30"
                        }`}
                      >
                        <h3 className="font-heading text-lg font-semibold text-card-foreground">{localize(profile.label)}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{localize(profile.shortPitch)}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 font-heading text-2xl font-bold">{content.strategicTitle}</h2>
                  <p className="text-card-foreground leading-7">{content.strategicDesc}</p>
                </div>

                <div className="rounded-3xl border border-border bg-card p-8">
                  <h2 className="mb-6 font-heading text-2xl font-bold text-card-foreground">{content.applyNowTitle}</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {content.applyNowPoints.map((point) => (
                      <div key={point} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                        <CheckCircle size={18} className="mt-0.5 shrink-0 text-primary" />
                        <p className="text-sm leading-7 text-card-foreground">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-6 font-heading text-2xl font-bold">{content.evalTitle}</h2>
                  <div className="space-y-3">
                    {content.evalPoints.map((point) => (
                      <div key={point} className="flex items-start gap-3">
                        <Award size={18} className="mt-0.5 shrink-0 text-coral" />
                        <p className="text-sm text-card-foreground">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="sticky top-24 rounded-xl border border-border bg-card p-8">
                  <p className="mb-2 text-center text-sm text-muted-foreground">{content.priceLabel}</p>
                  <p className="mb-1 text-center font-heading text-3xl font-bold leading-tight text-card-foreground">{content.price}</p>
                  <p className="mb-8 text-center text-sm text-muted-foreground">{content.perParticipant}</p>

                  <div className="mb-8 space-y-4">
                    {[
                      { icon: Clock, label: content.duration, value: content.durationValue },
                      { icon: Monitor, label: content.format, value: content.formatValue },
                      { icon: MapPin, label: content.location, value: content.locationValue },
                      { icon: Calendar, label: content.nextSession, value: content.nextSessionValue },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          <item.icon size={16} /> {item.label}
                        </span>
                        <span className="text-sm font-medium text-card-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/inscription?formation=certification-signature&domaine=${activeProfile.slug}`}
                    className="block w-full rounded-lg bg-coral-gradient py-3 text-center font-semibold transition-opacity hover:opacity-90"
                    style={{ color: "hsl(0 0% 100%)" }}
                  >
                    {content.enrollCta}
                  </Link>
                  <p className="mt-4 text-center text-xs leading-6 text-muted-foreground">{content.cohortNote}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CertificationPage;
