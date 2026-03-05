import { motion } from "framer-motion";
import { CheckCircle, BookOpen, Award, Clock, MapPin, Monitor, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";

const objectives = [
  "Maîtriser les outils IA essentiels pour l'assistanat de direction",
  "Automatiser les tâches répétitives et gagner en productivité",
  "Rédiger des documents professionnels avec l'assistance de l'IA",
  "Gérer un agenda et des projets avec des outils intelligents",
  "Analyser des données et produire des synthèses avec l'IA",
];

const modules = [
  "Module 1 : Fondamentaux de l'IA pour l'Assistanat (1 jour)",
  "Module 2 : ChatGPT & Outils IA pour la Productivité (1 jour)",
  "Module 3 : Gestion d'Agenda et Organisation Intelligente (1 jour)",
  "Module 4 : Rédaction et Communication Assistées par IA (1 jour)",
  "Module 5 : Projet Pratique & Évaluation Finale (1 jour)",
];

const evalPoints = [
  "Évaluation continue tout au long de la formation",
  "Projet pratique : cas d'entreprise réel à résoudre avec l'IA",
  "Soutenance devant un jury de professionnels",
  "Score minimum requis : 70/100",
];

const CertificationPage = () => {
  return (
    <PageTransition><div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        badge="Certification Professionnelle"
        title="Assistant de Direction Augmenté par l'IA"
        subtitle="La première certification professionnelle IA dédiée aux assistants et secrétaires de direction en Afrique francophone."
      />

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Objectives */}
              <div>
                <h2 className="font-heading text-2xl font-bold mb-6">Objectifs de la certification</h2>
                <div className="space-y-4">
                  {objectives.map((obj) => (
                    <motion.div
                      key={obj}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle size={20} className="text-primary mt-0.5 shrink-0" />
                      <p className="text-card-foreground">{obj}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Programme */}
              <div>
                <h2 className="font-heading text-2xl font-bold mb-6">Programme (5 jours)</h2>
                <div className="space-y-3">
                  {modules.map((mod) => (
                    <div key={mod} className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
                      <BookOpen size={18} className="text-primary shrink-0" />
                      <p className="text-sm text-card-foreground">{mod}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluation */}
              <div>
                <h2 className="font-heading text-2xl font-bold mb-6">Évaluation</h2>
                <div className="space-y-3">
                  {evalPoints.map((ep) => (
                    <div key={ep} className="flex items-start gap-3">
                      <Award size={18} className="text-primary mt-0.5 shrink-0" />
                      <p className="text-card-foreground text-sm">{ep}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar pricing */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-xl p-8 sticky top-24"
              >
                <p className="text-sm text-muted-foreground text-center mb-2">Prix de la certification</p>
                <p className="font-heading text-4xl font-bold text-center text-card-foreground mb-1">1 500 000 FCFA</p>
                <p className="text-sm text-muted-foreground text-center mb-8">par participant</p>

                <div className="space-y-4 mb-8">
                  {[
                    { icon: Clock, label: "Durée", value: "5 jours (35h)" },
                    { icon: Monitor, label: "Format", value: "Présentiel" },
                    { icon: MapPin, label: "Lieu", value: "Abidjan, CI" },
                    { icon: Calendar, label: "Prochaine session", value: "Avril 2026" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <item.icon size={16} />
                        {item.label}
                      </span>
                      <span className="text-sm font-medium text-card-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="/contact"
                  className="block w-full bg-gold-gradient font-semibold py-3 rounded-lg text-navy-deep text-center hover:opacity-90 transition-opacity"
                >
                  S'inscrire / Demander un devis
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div></PageTransition>
  );
};

export default CertificationPage;
