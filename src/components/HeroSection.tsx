import { motion } from "framer-motion";
import { BookOpen, Users, Award, Globe, ArrowRight, Download } from "lucide-react";
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
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Équipe africaine en formation IA" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy-deep/80" />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, hsl(220 50% 8% / 0.4), hsl(220 50% 8% / 0.9))",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-24 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gold font-semibold uppercase tracking-[0.2em] text-sm mb-6"
          >
            Formation Professionnelle en Intelligence Artificielle
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
            style={{ color: "hsl(0 0% 96%)" }}
          >
            Formez vos équipes à l'
            <span className="text-gradient-gold">IA</span>
            <br />
            qui transforme l'Afrique
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: "hsl(220 20% 70%)" }}
          >
            120 formations pratiques, 12 métiers, des formats flexibles. Préparez votre entreprise à l'ère de l'Intelligence Artificielle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#cta"
              className="bg-gold-gradient font-semibold px-8 py-3.5 rounded-lg text-navy-deep inline-flex items-center gap-2 hover:opacity-90 transition-opacity text-base"
            >
              Demander un devis <ArrowRight size={18} />
            </a>
            <a
              href="#metiers"
              className="font-semibold px-8 py-3.5 rounded-lg inline-flex items-center gap-2 border transition-colors text-base"
              style={{
                borderColor: "hsl(0 0% 100% / 0.2)",
                color: "hsl(0 0% 90%)",
              }}
            >
              <Download size={18} /> Télécharger le catalogue
            </a>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-xl p-6 text-center"
            >
              <stat.icon className="mx-auto mb-3 text-gold" size={28} />
              <p className="font-heading text-3xl font-bold text-gold mb-1">{stat.value}</p>
              <p className="text-sm" style={{ color: "hsl(220 20% 70%)" }}>{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
