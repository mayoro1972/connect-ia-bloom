import ScrollReveal from "@/components/ScrollReveal";
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
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            12 métiers, une transformation <span className="text-gradient-teal">IA</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Des formations conçues pour chaque fonction de l'entreprise, adaptées aux réalités du marché africain.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {metiers.map((m, i) => (
            <ScrollReveal
              key={m.title}
              delay={i * 0.06}
              direction="up"
              distance={30}
            >
              <div className="group bg-card rounded-xl p-6 border border-border hover-lift cursor-pointer h-full">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-teal-gradient transition-all duration-300">
                  <m.icon size={22} className="text-accent-foreground group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-heading font-semibold text-base mb-2 text-card-foreground">{m.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{m.desc}</p>
                <span className="text-sm font-semibold text-coral">{m.count} formations →</span>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3} className="text-center mt-12">
          <a
            href="#cta"
            className="bg-coral-gradient font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105"
            style={{ color: "hsl(0 0% 100%)" }}
          >
            Voir tout le catalogue
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default MetiersSection;
