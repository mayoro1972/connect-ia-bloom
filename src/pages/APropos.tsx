import { motion } from "framer-motion";
import { Target, Users, Award, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";

const stats = [
  { icon: Target, value: "120+", label: "Formations", sub: "Un catalogue complet couvrant 12 métiers" },
  { icon: Users, value: "500+", label: "Professionnels formés", sub: "Issus de banques, télécoms, ministères" },
  { icon: Award, value: "98%", label: "de satisfaction", sub: "Noté par nos participants" },
  { icon: Globe, value: "10+", label: "Pays", sub: "Côte d'Ivoire, Sénégal, Cameroun, etc." },
];

const team = [
  { initials: "D", name: "Dr. Kouamé Assi", role: "Directeur Général", desc: "Expert en IA et transformation digitale, 15 ans d'expérience en conseil." },
  { initials: "M", name: "Mariam Touré", role: "Directrice Pédagogique", desc: "Spécialiste en ingénierie de formation et e-learning adaptatif." },
  { initials: "Y", name: "Yves N'Guessan", role: "Responsable Entreprises", desc: "Ancien DRH, spécialiste de la formation professionnelle en entreprise." },
  { initials: "A", name: "Aïcha Diop", role: "Experte IA & Data", desc: "Data scientist et formatrice, passionnée par la démocratisation de l'IA." },
];

const AProposPage = () => {
  return (
    <PageTransition><div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="À propos de l'Académie IA Afrique"
        subtitle="Notre mission : démocratiser l'Intelligence Artificielle dans les entreprises africaines."
      />

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Mission */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold mb-4">Notre Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              L'Académie IA Afrique est née d'un constat simple : l'Intelligence Artificielle transforme tous les métiers, mais les formations disponibles sont rarement adaptées aux réalités du marché africain. Notre mission est de combler ce fossé en proposant des formations pratiques, accessibles et directement applicables au quotidien professionnel en Côte d'Ivoire et en Afrique francophone.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 gap-4 mb-16">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <s.icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-heading font-bold text-card-foreground">{s.value} {s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Team */}
          <h2 className="font-heading text-2xl font-bold mb-6">Notre Équipe</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {team.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center font-heading font-bold text-navy-deep mb-4">
                  {t.initials}
                </div>
                <h3 className="font-heading font-semibold text-card-foreground">{t.name}</h3>
                <p className="text-sm text-primary mb-2">{t.role}</p>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div></PageTransition>
  );
};

export default AProposPage;
