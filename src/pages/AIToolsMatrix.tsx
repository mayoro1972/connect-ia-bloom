import { useMemo } from "react";
import { ArrowUpRight, Blocks, Bot, BriefcaseBusiness, Layers, Search, Workflow } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveCatalogueSlugFromSector } from "@/lib/site-links";
import {
  domainToolPlans,
  getDomainToolPlan,
  getToolById,
  toolCategoryLabels,
  toolLevelLabels,
  type DomainToolPlan,
  type LocalizedText,
  type ToolCategory,
} from "@/data/domain-tools-catalogue";

const iconByCategory: Record<ToolCategory, typeof Bot> = {
  copilot: Bot,
  workflow: Workflow,
  "low-code": Layers,
  "no-code": Blocks,
  research: Search,
  builder: BriefcaseBusiness,
};

const localize = (language: "fr" | "en", value: LocalizedText) => (language === "en" ? value.en : value.fr);

const pageCopy = {
  fr: {
    badge: "Matrice officielle des outils IA",
    title: "Outils IA par domaine : la stack à enseigner, déployer et citer",
    subtitle:
      "Une page de référence TransferAI Africa pour relier chaque domaine métier à ses outils les plus pertinents, ses usages prioritaires et ses formats de formation recommandés.",
    matrixTitle: "Matrice officielle par domaine",
    matrixDesc:
      "Chaque domaine dispose d'une stack recommandée, d'usages prioritaires et d'un format de montée en compétences adapté aux besoins réels des entreprises.",
    selectedTitle: "Stack recommandée pour ce domaine",
    useCasesTitle: "Usages prioritaires",
    formatsTitle: "Catalogue de formation par domaine",
    toolsTitle: "Outils recommandés",
    browseDomains: "Explorer les 13 domaines",
    viewCertification: "Voir la certification sectorielle",
    viewCatalogue: "Voir le catalogue du domaine",
    categoryLabel: "Catégorie",
    levelLabel: "Niveau",
    toolLabel: "Outil",
    officialSite: "Site officiel",
    strategicBlock: "Domaine prioritaire",
  },
  en: {
    badge: "Official AI tools matrix",
    title: "AI tools by domain: the stack to teach, deploy, and reference",
    subtitle:
      "A TransferAI Africa reference page connecting each domain to the most relevant tools, priority use cases, and recommended training formats.",
    matrixTitle: "Official domain matrix",
    matrixDesc:
      "Each domain comes with a recommended stack, top use cases, and an upskilling format aligned with real business needs.",
    selectedTitle: "Recommended stack for this domain",
    useCasesTitle: "Priority use cases",
    formatsTitle: "Domain training catalogue",
    toolsTitle: "Recommended tools",
    browseDomains: "Explore the 13 domains",
    viewCertification: "View sector certification",
    viewCatalogue: "View domain catalogue",
    categoryLabel: "Category",
    levelLabel: "Level",
    toolLabel: "Tool",
    officialSite: "Official site",
    strategicBlock: "Priority domain",
  },
} as const;

const AIToolsMatrixPage = () => {
  const { language } = useLanguage();
  const copy = pageCopy[language];
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSlug = searchParams.get("domaine");
  const selectedPlan = getDomainToolPlan(selectedSlug);
  const catalogueSlug = resolveCatalogueSlugFromSector(selectedPlan.domainKey);

  const selectedTools = useMemo(
    () => selectedPlan.recommendedToolIds.map((id) => getToolById(id)).filter(Boolean),
    [selectedPlan]
  );

  const updateDomain = (plan: DomainToolPlan) => {
    const params = new URLSearchParams(searchParams);
    params.set("domaine", plan.slug);
    setSearchParams(params);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageHeader badge={copy.badge} title={copy.title} subtitle={copy.subtitle} />

        <main className="py-16">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <section className="rounded-[1.75rem] border border-border bg-card p-8">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.strategicBlock}</p>
                  <h2 className="mt-3 font-heading text-3xl font-bold text-card-foreground">{localize(language, selectedPlan.label)}</h2>
                  <p className="mt-3 text-sm font-medium text-primary">{localize(language, selectedPlan.trendLabel)}</p>
                  <p className="mt-4 leading-7 text-muted-foreground">{localize(language, selectedPlan.summary)}</p>
                  <p className="mt-4 text-sm leading-7 text-card-foreground">{localize(language, selectedPlan.sectorPitch)}</p>
                </div>

                <div className="flex flex-col gap-3 sm:min-w-[260px]">
                  <Link
                    to={`/certification?domaine=${selectedPlan.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-orange-gradient px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                  >
                    {copy.viewCertification}
                  </Link>
                  <Link
                    to={catalogueSlug ? `/catalogues-domaines/${catalogueSlug}` : "/catalogue"}
                    className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-card-foreground hover:border-primary/40 hover:text-primary"
                  >
                    {copy.viewCatalogue}
                  </Link>
                </div>
              </div>
            </section>

            <section className="mt-10 rounded-[1.75rem] border border-border bg-card p-8">
              <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.matrixTitle}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{copy.matrixDesc}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {domainToolPlans.map((plan) => (
                  <button
                    key={plan.slug}
                    type="button"
                    onClick={() => updateDomain(plan)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      plan.slug === selectedPlan.slug
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-card-foreground hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {localize(language, plan.label)}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[1.75rem] border border-border bg-card p-8">
                <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.toolsTitle}</h2>
                <div className="mt-6 space-y-4">
                  {selectedTools.map((tool) => {
                    if (!tool) return null;
                    const Icon = iconByCategory[tool.category];
                    return (
                      <div key={tool.id} className="rounded-2xl border border-border bg-background p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                              <Icon size={20} className="text-primary" />
                            </div>
                            <div>
                              <h3 className="font-heading text-lg font-semibold text-card-foreground">{tool.name}</h3>
                              <p className="mt-1 text-sm text-muted-foreground">{tool.vendor}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              {copy.categoryLabel}: {localize(language, toolCategoryLabels[tool.category])}
                            </span>
                            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                              {copy.levelLabel}: {localize(language, toolLevelLabels[tool.level])}
                            </span>
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground">{localize(language, tool.positioning)}</p>
                        <a
                          href={tool.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                        >
                          {copy.officialSite}
                          <ArrowUpRight size={14} />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[1.75rem] border border-border bg-card p-8">
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.useCasesTitle}</h2>
                  <div className="mt-6 space-y-4">
                    {selectedPlan.topUseCases.map((useCase) => (
                      <div key={useCase.fr} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                        <Workflow size={18} className="mt-0.5 shrink-0 text-primary" />
                        <p className="text-sm leading-7 text-card-foreground">{localize(language, useCase)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-border bg-card p-8">
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.formatsTitle}</h2>
                  <div className="mt-6 space-y-4">
                    {selectedPlan.trainingFormats.map((format) => (
                      <div key={format.title.fr} className="rounded-2xl border border-border bg-background p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h3 className="font-heading text-lg font-semibold text-card-foreground">{localize(language, format.title)}</h3>
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {localize(language, format.duration)}
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-medium text-card-foreground">{localize(language, format.audience)}</p>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{localize(language, format.promise)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default AIToolsMatrixPage;
