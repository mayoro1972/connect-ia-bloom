import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, FileText, Link2, Mail, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageHeader from "@/components/PageHeader";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { catalogueStats, domainPreviews, getFormationsByDomain, getLocalizedDomainPreview } from "@/lib/catalogue-preview";
import { useLanguage } from "@/i18n/LanguageContext";

const PreviewHub = () => {
  const { language } = useLanguage();

  const copy =
    language === "fr"
      ? {
          badge: "Catalogues par domaine",
          title: "Choisir le bon catalogue, puis la bonne suite",
          subtitle:
            "Explorez les catalogues par domaine, identifiez le bon point d'entrée et avancez simplement vers une demande ou un échange avec notre équipe.",
          stats: [
            { label: "Domaines couverts", value: catalogueStats.totalDomains.toString() },
            { label: "Formations listées", value: `${catalogueStats.totalFormations}+` },
            { label: "Formats disponibles", value: `${catalogueStats.totalFormats}` },
            { label: "Prix dans le catalogue", value: "Sur demande" },
          ],
          journeyBadge: "Parcours simple",
          journeyTitle: "Un parcours plus clair pour passer du catalogue à la bonne action",
          journeyText:
            "Le visiteur commence par le domaine qui l'intéresse, accède au bon catalogue, puis choisit la suite la plus utile : demander des informations, parler à un expert IA ou préparer une demande plus structurée.",
          cards: {
            cataloguesTitle: "13 catalogues sectoriels",
            cataloguesDesc: "Chaque domaine dispose de sa propre page, avec une lecture plus simple et un accès direct au catalogue correspondant.",
            leadsTitle: "Demandes guidées",
            leadsDesc: "Le visiteur peut demander un catalogue, une orientation ou un accompagnement sans passer par un formulaire trop générique.",
            appointmentTitle: "Échange avec un expert",
            appointmentDesc: "Quand le besoin est plus avancé, la page oriente vers un échange utile plutôt que vers une étape floue.",
            consistencyTitle: "Parcours cohérent",
            consistencyDesc: "Le passage du catalogue à la demande puis à l'échange se fait dans un ordre plus naturel et plus rassurant.",
          },
          sectionBadge: "Catalogue par domaine",
          sectionTitle: "Explorer les 13 catalogues sectoriels",
          formsCta: "Parler à un expert",
          domainLabel: "Domaine",
          formationsSuffix: "formations",
          viewCatalogue: "Voir le catalogue",
          quickBadge: "Accès utiles",
          quickTitle: "Accéder rapidement à la bonne suite",
          leadCardsTitle: "Faire une demande",
          leadCardsDesc: "Demander un catalogue, une orientation ou une réponse adaptée à votre besoin.",
          appointmentFlowTitle: "Parler à un expert IA",
          appointmentFlowDesc: "Passer directement à un échange plus qualifié lorsque le besoin est déjà mûr.",
          installedBadge: "Ce que cette page permet",
          installed: [
            'Le bouton "Télécharger le catalogue" mène vers une page domaine plus claire.',
            "Chaque domaine renvoie ensuite vers la bonne action sans faire perdre de temps au visiteur.",
            "Le parcours prépare mieux la conversion vers une demande, une orientation ou un échange expert.",
          ],
        }
      : {
          badge: "Domain catalogues",
          title: "Choose the right catalogue, then the right next step",
          subtitle:
            "Explore domain catalogues, identify the right entry point, and move smoothly toward a request or a conversation with our team.",
          stats: [
            { label: "Domains covered", value: catalogueStats.totalDomains.toString() },
            { label: "Courses listed", value: `${catalogueStats.totalFormations}+` },
            { label: "Available formats", value: `${catalogueStats.totalFormats}` },
            { label: "Pricing in catalogue", value: "On request" },
          ],
          journeyBadge: "Simple journey",
          journeyTitle: "A clearer path from catalogue to the right next action",
          journeyText:
            "Visitors start from the domain they care about, access the right catalogue, then choose the most useful next step: request information, speak with an AI expert, or submit a more structured request.",
          cards: {
            cataloguesTitle: "13 sector catalogues",
            cataloguesDesc: "Each domain has its own page with simpler reading and direct access to the relevant catalogue.",
            leadsTitle: "Guided requests",
            leadsDesc: "Visitors can request a catalogue, guidance, or support without going through an overly generic form.",
            appointmentTitle: "Conversation with an expert",
            appointmentDesc: "When the need is more advanced, the page points toward a useful conversation instead of a vague step.",
            consistencyTitle: "Consistent journey",
            consistencyDesc: "The transition from catalogue to request to expert conversation feels more natural and reassuring.",
          },
          sectionBadge: "Domain catalogue",
          sectionTitle: "Explore the 13 sector catalogues",
          formsCta: "Speak with an expert",
          domainLabel: "Domain",
          formationsSuffix: "courses",
          viewCatalogue: "View catalogue",
          quickBadge: "Useful access points",
          quickTitle: "Move quickly to the right next step",
          leadCardsTitle: "Submit a request",
          leadCardsDesc: "Request a catalogue, guidance, or a response adapted to your need.",
          appointmentFlowTitle: "Speak with an AI expert",
          appointmentFlowDesc: "Move directly to a more qualified conversation when the need is already mature.",
          installedBadge: "What this page now enables",
          installed: [
            'The "Download catalogue" button leads to a clearer domain page.',
            "Each domain then points visitors to the right next action without friction.",
            "The journey better prepares conversion toward a request, guidance, or an expert conversation.",
          ],
        };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader badge={copy.badge} title={copy.title} subtitle={copy.subtitle} />

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8 space-y-10">
            <div className="grid gap-4 md:grid-cols-4">
              {copy.stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-card/80 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 font-heading text-3xl font-bold text-card-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.journeyBadge}</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-card-foreground">{copy.journeyTitle}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.journeyText}</p>
                </div>

                <div className="grid gap-3 text-sm text-card-foreground sm:grid-cols-2">
                  <div className="rounded-2xl bg-background/80 p-4">
                    <div className="flex items-center gap-2 font-semibold">
                      <FileText size={16} className="text-primary" /> {copy.cards.cataloguesTitle}
                    </div>
                    <p className="mt-2 text-muted-foreground">{copy.cards.cataloguesDesc}</p>
                  </div>
                  <div className="rounded-2xl bg-background/80 p-4">
                    <div className="flex items-center gap-2 font-semibold">
                      <Mail size={16} className="text-primary" /> {copy.cards.leadsTitle}
                    </div>
                    <p className="mt-2 text-muted-foreground">{copy.cards.leadsDesc}</p>
                  </div>
                  <div className="rounded-2xl bg-background/80 p-4">
                    <div className="flex items-center gap-2 font-semibold">
                      <CalendarDays size={16} className="text-primary" /> {copy.cards.appointmentTitle}
                    </div>
                    <p className="mt-2 text-muted-foreground">{copy.cards.appointmentDesc}</p>
                  </div>
                  <div className="rounded-2xl bg-background/80 p-4">
                    <div className="flex items-center gap-2 font-semibold">
                      <ShieldCheck size={16} className="text-primary" /> {copy.cards.consistencyTitle}
                    </div>
                    <p className="mt-2 text-muted-foreground">{copy.cards.consistencyDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-border bg-card/80 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.sectionBadge}</p>
                    <h2 className="mt-2 font-heading text-2xl font-bold text-card-foreground">{copy.sectionTitle}</h2>
                  </div>
                  <Link to={language === "fr" ? "/contact?intent=demande-renseignement" : "/contact?intent=demande-renseignement"} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-card-foreground hover:bg-muted">
                    {copy.formsCta} <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {domainPreviews.map((domain) => {
                    const localizedDomain = getLocalizedDomainPreview(domain, language);

                    return (
                      <Link
                        key={domain.slug}
                        to={`/catalogues-domaines/${domain.slug}`}
                        className="group rounded-2xl border border-border bg-background/80 p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                          {copy.domainLabel} {String(getFormationsByDomain(domain.domain).length).padStart(2, "0")}
                        </p>
                        <h3 className="mt-3 font-heading text-lg font-bold text-card-foreground">{localizedDomain.domain}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{localizedDomain.summary}</p>
                        <div className="mt-4 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {getFormationsByDomain(domain.domain).length} {copy.formationsSuffix}
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold text-primary">
                            {copy.viewCatalogue} <ArrowRight size={14} />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-card/80 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.quickBadge}</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-card-foreground">{copy.quickTitle}</h2>
                  <div className="mt-6 space-y-4">
                    <Link to="/contact?intent=demande-renseignement" className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4 hover:border-primary/40">
                      <FileText size={18} className="mt-1 text-primary" />
                      <div>
                        <p className="font-semibold text-card-foreground">{copy.leadCardsTitle}</p>
                        <p className="text-sm text-muted-foreground">{copy.leadCardsDesc}</p>
                      </div>
                    </Link>
                    <Link to="/contact?intent=demande-renseignement" className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4 hover:border-primary/40">
                      <CalendarDays size={18} className="mt-1 text-primary" />
                      <div>
                        <p className="font-semibold text-card-foreground">{copy.appointmentFlowTitle}</p>
                        <p className="text-sm text-muted-foreground">{copy.appointmentFlowDesc}</p>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card/80 p-6">
                  <div className="flex items-center gap-2 text-primary">
                    <Link2 size={18} />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]">{copy.installedBadge}</p>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {copy.installed.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default PreviewHub;
