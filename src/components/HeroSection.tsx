import { motion } from "framer-motion";
import { BookOpen, Users, Award, Globe, ArrowRight, Download } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { icon: BookOpen, value: "120+", label: "Formations IA" },
  { icon: Users, value: "12", label: "Métiers couverts" },
  { icon: Award, value: "3", label: "Formats flexibles" },
  { icon: Globe, value: "10+", label: "Pays couverts" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax-like scale */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <img src={heroBg} alt="Équipe africaine en formation IA" className="w-full h-full object-cover" />
        {/* Overlay: lighter to let image shine */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, hsl(225 55% 10% / 0.65), hsl(30 80% 30% / 0.45))",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, hsl(225 55% 10% / 0.3) 0%, hsl(225 55% 10% / 0.7) 100%)",
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-24 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-semibold uppercase tracking-[0.2em] text-sm mb-6"
            style={{ color: "hsl(30 90% 65%)" }}
          >
            Formation Professionnelle en Intelligence Artificielle
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
            style={{ color: "hsl(0 0% 98%)" }}
          >
            Formez vos équipes à l'
            <span className="text-gradient-orange">IA</span>
            <br />
            qui transforme l'Afrique
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: "hsl(210 20% 80%)" }}
          >
            120 formations pratiques, 12 métiers, des formats flexibles. Préparez votre entreprise à l'ère de l'Intelligence Artificielle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#cta"
              className="bg-orange-gradient font-semibold px-8 py-3.5 rounded-lg inline-flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105 text-base"
              style={{ color: "hsl(0 0% 100%)" }}
            >
              Demander un devis <ArrowRight size={18} />
            </a>
            <a
              href="#metiers"
              className="font-semibold px-8 py-3.5 rounded-lg inline-flex items-center gap-2 border transition-all hover:scale-105 text-base"
              style={{
                borderColor: "hsl(0 0% 100% / 0.25)",
                color: "hsl(0 0% 95%)",
              }}
            >
              <Download size={18} /> Télécharger le catalogue
            </a>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={0.8 + i * 0.1} direction="up">
              <div className="glass-card rounded-xl p-6 text-center hover-lift">
                <stat.icon className="mx-auto mb-3" size={28} style={{ color: "hsl(30 90% 60%)" }} />
                <p className="font-heading text-3xl font-bold mb-1" style={{ color: "hsl(145 65% 50%)" }}>{stat.value}</p>
                <p className="text-sm" style={{ color: "hsl(210 20% 75%)" }}>{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
