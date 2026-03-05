import { motion } from "framer-motion";
import { FileText, Target, Users, Settings, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

const solutions = [
  {
    icon: FileText,
    title: "Formation Intra-Entreprise",
    desc: "Des sessions dédiées pour vos équipes, dans vos locaux ou les nôtres. Contenu adapté à votre secteur et vos outils.",
    features: ["Programme sur-mesure", "Dans vos locaux ou en ligne", "Jusqu'à 15 participants", "Support post-formation"],
  },
  {
    icon: Target,
    title: "Audit & Diagnostic IA",
    desc: "Évaluation complète de la maturité IA de votre organisation et recommandations stratégiques.",
    features: ["Cartographie des processus", "Identification des cas d'usage IA", "Plan de transformation", "ROI estimé"],
  },
  {
    icon: Users,
    title: "Accompagnement Continu",
    desc: "Un programme d'accompagnement sur 6 à 12 mois pour ancrer durablement l'IA dans vos pratiques.",
    features: ["Coach IA dédié", "Sessions mensuelles", "Support par email", "Tableau de bord de progression"],
  },
  {
    icon: Settings,
    title: "Formation Sur-Mesure",
    desc: "Conception d'un programme entièrement personnalisé selon vos besoins spécifiques.",
    features: ["Analyse des besoins", "Conception pédagogique", "Livrables personnalisés", "Évaluation sur-mesure"],
  },
];

const EntreprisesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Solutions Entreprises"
        subtitle="Des programmes de formation IA adaptés aux besoins de votre organisation. Banques, télécoms, ministères — nous vous accompagnons."
      />

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {solutions.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-8 hover-lift"
              >
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-5">
                  <s.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-card-foreground">{s.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{s.desc}</p>
                <ul className="space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-card-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/contact"
              className="bg-gold-gradient font-semibold px-8 py-3 rounded-lg text-navy-deep inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              Demander un devis entreprise <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EntreprisesPage;
