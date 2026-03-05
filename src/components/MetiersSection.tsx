import { motion } from "framer-motion";
import {
  Briefcase, Users, Megaphone, Calculator, Scale, HeadphonesIcon,
  BarChart3, ClipboardList, Crown, Monitor, GraduationCap, Heart,
} from "lucide-react";

const metiers = [
  { icon: Briefcase, title: "Assistanat & Secrétariat de Direction", desc: "Automatisation des tâches, gestion intelligente de l'agenda, rédaction assistée.", count: 10 },
  { icon: Users, title: "Ressources Humaines", desc: "Recrutement prédictif, gestion des talents, formation personnalisée.", count: 10 },
  { icon: Megaphone, title: "Marketing & Communication", desc: "Création de contenu, analyse d'audience, SEO automatisé.", count: 10 },
  { icon: Calculator, title: "Finance & Comptabilité", desc: "Prévisions budgétaires, détection de fraudes, reporting automatisé.", count: 10 },
  { icon: Scale, title: "Juridique & Conformité", desc: "Recherche juridique, analyse de contrats, veille réglementaire.", count: 10 },
  { icon: HeadphonesIcon, title: "Service Client & Relation Client", desc: "Chatbots intelligents, analyse de sentiment, support prédictif.", count: 10 },
  { icon: BarChart3, title: "Data & Analyse de Données", desc: "Visualisation, analyse prédictive, machine learning appliqué.", count: 10 },
  { icon: ClipboardList, title: "Administration & Gestion", desc: "Automatisation des processus, gestion documentaire, planification.", count: 10 },
  { icon: Crown, title: "Management & Leadership", desc: "Prise de décision data-driven, gestion d'équipe augmentée.", count: 10 },
  { icon: Monitor, title: "IT & Transformation Digitale", desc: "Intégration d'outils IA, cybersécurité, automatisation IT.", count: 10 },
  { icon: GraduationCap, title: "Formation & Pédagogie", desc: "Conception pédagogique assistée, e-learning adaptatif.", count: 10 },
  { icon: Heart, title: "Santé & Bien-être au Travail", desc: "Prévention des risques, analyse ergonomique, suivi du bien-être.", count: 10 },
];

const MetiersSection = () => {
  return (
    <section id="metiers" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            12 métiers, une transformation <span className="text-gradient-gold">IA</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Des formations conçues pour chaque fonction de l'entreprise, adaptées aux réalités du marché africain.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {metiers.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card rounded-xl p-6 border border-border hover-lift cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-gold-gradient transition-colors">
                <m.icon size={22} className="text-accent-foreground group-hover:text-navy-deep transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-base mb-2 text-card-foreground">{m.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{m.desc}</p>
              <span className="text-sm font-semibold text-primary">{m.count} formations →</span>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#cta"
            className="bg-gold-gradient font-semibold px-8 py-3 rounded-lg text-navy-deep inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            Voir tout le catalogue
          </a>
        </div>
      </div>
    </section>
  );
};

export default MetiersSection;
