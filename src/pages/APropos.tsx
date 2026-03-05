import { motion } from "framer-motion";
import { Target, Users, Award, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";

const stats = [
  { icon: Target, value: "120+", label: "Formations", sub: "Un catalogue complet couvrant 12 métiers" },
  { icon: Users, value: "500+", label: "Professionnels formés", sub: "Issus de banques, télécoms, ministères" },
  { icon: Award, value: "98%", label: "de satisfaction", sub: "Noté par nos participants" },
  { icon: Globe, value: "10+", label: "Pays", sub: "Côte d'Ivoire, Sénégal, Cameroun, etc." },
];

const team = [
  { initials: "CB", name: "Casimir Beda Kassi", role: "Directeur Général", desc: "Visionnaire et stratège, il pilote TransferAI Africa avec l'ambition de connecter la diaspora ivoirienne au continent." },
  { initials: "MA", name: "Marius Ayoro", role: "Responsable Entreprises", desc: "Spécialiste du développement business, il accompagne les entreprises dans leur transformation IA." },
  { initials: "SK", name: "Souleymane Konate", role: "Expert IA & Data", desc: "Data scientist et formateur, passionné par la démocratisation de l'IA en Afrique." },
  { initials: "EN", name: "Eric N'Guessan", role: "Directeur Pédagogique", desc: "Expert en ingénierie de formation, il conçoit des programmes adaptés aux réalités africaines." },
];

const AProposPage = () => {
  return (
    <PageTransition><div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="À propos de TransferAI Africa"
        subtitle="Notre mission : transférer l'expertise IA de la diaspora vers l'Afrique."
      />

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold mb-4">Notre Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              TransferAI Africa est née d'un constat simple : la diaspora ivoirienne regorge d'experts en Intelligence Artificielle. Notre mission est de créer un pont entre ces talents et le continent africain, en proposant des formations pratiques, accessibles et directement applicables au quotidien professionnel en Côte d'Ivoire et en Afrique francophone.
            </p>
          </motion.div>

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
                <div className="w-12 h-12 rounded-full bg-teal-gradient flex items-center justify-center font-heading font-bold mb-4" style={{ color: "hsl(0 0% 100%)" }}>
                  {t.initials}
                </div>
                <h3 className="font-heading font-semibold text-card-foreground">{t.name}</h3>
                <p className="text-sm text-coral mb-2">{t.role}</p>
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
