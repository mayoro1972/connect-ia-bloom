import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";

const events = [
  {
    type: "Séminaire",
    title: "L'IA au service des dirigeants africains",
    desc: "Une journée pour comprendre comment l'IA transforme le leadership et la prise de décision en entreprise.",
    date: "15 Avril 2026",
    location: "Abidjan, Hôtel Ivoire",
    typeColor: "bg-primary/10 text-primary",
  },
  {
    type: "Webinaire",
    title: "ChatGPT pour les RH : cas pratiques",
    desc: "Découvrez comment les DRH utilisent ChatGPT au quotidien, avec des démonstrations en direct.",
    date: "22 Avril 2026",
    location: "En ligne",
    typeColor: "bg-accent text-accent-foreground",
  },
  {
    type: "Conférence",
    title: "Forum IA & Finance en Afrique",
    desc: "Le rendez-vous annuel des professionnels de la finance autour de l'IA. Tables rondes, ateliers, networking.",
    date: "10 Mai 2026",
    location: "Dakar, Sénégal",
    typeColor: "bg-destructive/10 text-destructive",
  },
  {
    type: "Webinaire",
    title: "IA et Marketing Digital : tendances 2026",
    desc: "Les dernières tendances en matière d'IA appliquée au marketing digital en Afrique francophone.",
    date: "28 Mai 2026",
    location: "En ligne",
    typeColor: "bg-accent text-accent-foreground",
  },
];

const EvenementsPage = () => {
  return (
    <PageTransition><div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader title="Événements" subtitle="Séminaires, webinaires et conférences autour de l'IA en Afrique." />

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="space-y-5">
            {events.map((e, i) => (
              <ScrollReveal
                key={e.title}
                delay={i * 0.1}
                direction="up"
              >
              <div className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4 hover-lift">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full self-start ${e.typeColor}`}>
                  {e.type}
                </span>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-bold text-card-foreground mb-1">{e.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{e.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={14} />{e.date}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} />{e.location}</span>
                  </div>
                </div>
                <a
                  href="/contact"
                  className="bg-gold-gradient font-semibold text-sm px-5 py-2.5 rounded-lg text-navy-deep hover:opacity-90 transition-opacity shrink-0"
                >
                  S'inscrire
                </a>
              </div></ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div></PageTransition>
  );
};

export default EvenementsPage;
