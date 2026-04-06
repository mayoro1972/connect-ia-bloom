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
          title: "Catalogue & Parcours Prospect",
          subtitle:
            "Explore les catalogues par domaine, les formulaires de demande et le parcours de prise de rendez-vous pensés pour transformer une demande en échange qualifié.",
          stats: [
            { label: "Domaines couverts", value: catalogueStats.totalDomains.toString() },
            { label: "Formations listées", value: `${catalogueStats.totalFormations}+` },
            { label: "Formats disponibles", value: `${catalogueStats.totalFormats}` },
            { label: "Prix dans le catalogue", value: "Sur demande" },
          ],
          journeyBadge: "Parcours mis en place",
          journeyTitle: "Le téléchargement catalogue, les demandes et la prise de RDV sont maintenant structurés dans un parcours complet.",
          journeyText:
            "Le téléchargement catalogue devient un parcours par domaine. Les formulaires sont spécialisés par besoin. La prise de RDV devient l'étape suivante logique après une demande de catalogue, de renseignement ou de devis.",
          cards: {
            cataloguesTitle: "Catalogues par domaine",
            cataloguesDesc: "1 page dédiée par domaine, sans prix affichés, prête pour un téléchargement domaine par domaine.",
            leadsTitle: "Fiches prospects",
            leadsDesc: "Demande de catalogue, demande de renseignement et fiche contact/devis avec contenus enrichis.",
            appointmentTitle: "Prise de RDV",
            appointmentDesc: "Flux de rendez-vous attaché à la demande pour fluidifier la conversion avant intégration du calendrier final.",
            consistencyTitle: "Parcours cohérent",
            consistencyDesc: "Le visiteur peut désormais passer d'un catalogue à une demande puis à une prise de rendez-vous sans rupture.",
          },
          sectionBadge: "Catalogue par domaine",
          sectionTitle: "Explorer les 13 catalogues sectoriels",
          formsCta: "Voir les fiches",
          domainLabel: "Domaine",
          formationsSuffix: "formations",
          viewCatalogue: "Voir le catalogue",
          quickBadge: "Parcours disponibles",
          quickTitle: "Accès rapides au parcours prospect",
          leadCardsTitle: "Fiches prospects",
          leadCardsDesc: "Demande de catalogue, renseignement, contact/devis.",
          appointmentFlowTitle: "Flux RDV",
          appointmentFlowDesc: "Page de rendez-vous rattachée au formulaire et prête à recevoir le lien calendrier final.",
          installedBadge: "Parcours en place",
          installed: [
            'Le bouton "Télécharger le catalogue" mène désormais vers les catalogues par domaine.',
            "Les demandes orientent ensuite vers la bonne fiche prospect selon le besoin exprimé.",
            "La prise de RDV peut être reliée au lien calendrier final dès que tu me donnes l'URL de réservation.",
          ],
        }
      : {
          badge: "Domain catalogues",
          title: "Catalogue & Prospect Journey",
          subtitle:
            "Explore domain catalogues, request forms and the appointment flow designed to turn an inquiry into a qualified conversation.",
          stats: [
            { label: "Domains covered", value: catalogueStats.totalDomains.toString() },
            { label: "Courses listed", value: `${catalogueStats.totalFormations}+` },
            { label: "Available formats", value: `${catalogueStats.totalFormats}` },
            { label: "Pricing in catalogue", value: "On request" },
          ],
          journeyBadge: "Journey now in place",
          journeyTitle: "Catalogue download, requests and booking are now organized as one complete prospect journey.",
          journeyText:
            "Catalogue access now starts by domain. Forms are specialized by intent. Booking becomes the natural next step after a catalogue request, information request or quote request.",
          cards: {
            cataloguesTitle: "Domain catalogues",
            cataloguesDesc: "One dedicated page per domain, with no prices shown, ready for domain-by-domain download.",
            leadsTitle: "Prospect forms",
            leadsDesc: "Catalogue request, information request and contact/quote forms with richer content.",
            appointmentTitle: "Booking flow",
            appointmentDesc: "Appointment flow attached to the request to improve conversion before the final calendar is integrated.",
            consistencyTitle: "Consistent journey",
            consistencyDesc: "Visitors can now move from a catalogue to a request and then to booking without friction.",
          },
          sectionBadge: "Domain catalogue",
          sectionTitle: "Explore the 13 sector catalogues",
          formsCta: "View forms",
          domainLabel: "Domain",
          formationsSuffix: "courses",
          viewCatalogue: "View catalogue",
          quickBadge: "Available journeys",
          quickTitle: "Quick access to the prospect flow",
          leadCardsTitle: "Prospect forms",
          leadCardsDesc: "Catalogue request, information request, contact/quote.",
          appointmentFlowTitle: "Booking flow",
          appointmentFlowDesc: "Appointment page connected to the form and ready for the final calendar link.",
          installedBadge: "Journey already connected",
          installed: [
            'The "Download catalogue" button now leads to domain catalogues.',
            "Requests then route visitors to the right form depending on their need.",
            "The booking step can be connected to the final calendar link as soon as you share the booking URL.",
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
                  <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-card-foreground hover:bg-muted">
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
                    <Link to="/contact" className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4 hover:border-primary/40">
                      <FileText size={18} className="mt-1 text-primary" />
                      <div>
                        <p className="font-semibold text-card-foreground">{copy.leadCardsTitle}</p>
                        <p className="text-sm text-muted-foreground">{copy.leadCardsDesc}</p>
                      </div>
                    </Link>
                    <Link to="/prise-rdv" className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4 hover:border-primary/40">
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
