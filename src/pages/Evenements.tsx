import { Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { buildContactPath } from "@/lib/site-links";
import { fixMojibake } from "@/lib/fixMojibake";

const typeColors: Record<string, string> = {
  "Séminaire": "bg-primary/10 text-primary",
  Seminar: "bg-primary/10 text-primary",
  Webinaire: "bg-accent text-accent-foreground",
  Webinar: "bg-accent text-accent-foreground",
  "Conférence": "bg-destructive/10 text-destructive",
  Conference: "bg-destructive/10 text-destructive",
};

const EvenementsPage = () => {
  const { t, language } = useLanguage();
  const trans = language === "fr" ? fr : en;
  const events = trans.events.items;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={t("events.title")} subtitle={t("events.subtitle")} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <div className="space-y-5">
              {events.map((eventItem, i) => {
                const normalizedType = fixMojibake(eventItem.type);

                return (
                  <ScrollReveal key={eventItem.title} delay={i * 0.1} direction="up">
                    <div className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4 hover-lift">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full self-start ${typeColors[normalizedType] || "bg-accent text-accent-foreground"}`}>
                        {normalizedType}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-heading text-lg font-bold text-card-foreground mb-1">{eventItem.title}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{eventItem.desc}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar size={14} />{eventItem.date}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} />{eventItem.location}</span>
                        </div>
                      </div>
                      <Link to={buildContactPath("demande-renseignement")} className="bg-coral-gradient font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity shrink-0" style={{ color: "hsl(0 0% 100%)" }}>
                        {t("events.register")}
                      </Link>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default EvenementsPage;
