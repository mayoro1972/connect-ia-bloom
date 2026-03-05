import { ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import logoMiddlesex from "@/assets/logo-middlesex.png";
import logoNettelecom from "@/assets/logo-nettelecom.png";
import logoFdfp from "@/assets/logo-fdfp.png";

const partners = [
  {
    name: "Middlesex University",
    logo: logoMiddlesex,
    type: "Partenaire Académique",
    description:
      "Université britannique de renommée internationale, Middlesex University collabore avec l'Académie IA Afrique pour offrir des programmes certifiants reconnus à l'échelle mondiale.",
    highlights: [
      "Certifications co-délivrées reconnues internationalement",
      "Accès aux ressources pédagogiques universitaires",
      "Programmes alignés sur les standards britanniques",
      "Possibilité de passerelles vers des diplômes universitaires",
    ],
    color: "hsl(220 60% 50%)",
  },
  {
    name: "Nettelecom CI",
    logo: logoNettelecom,
    type: "Partenaire Entreprise",
    description:
      "Leader des télécommunications en Côte d'Ivoire, Nettelecom CI accompagne l'Académie IA Afrique dans le déploiement d'infrastructures numériques et la formation des talents du secteur télécom.",
    highlights: [
      "Infrastructure réseau et connectivité pour les formations",
      "Cas pratiques issus du secteur télécom",
      "Stages et opportunités professionnelles",
      "Co-développement de modules spécialisés télécom & IA",
    ],
    color: "hsl(174 70% 42%)",
  },
  {
    name: "FDFP",
    logo: logoFdfp,
    type: "Partenaire Formation",
    description:
      "Le FDFP (Fonds de Développement de la Formation Professionnelle) soutient activement la montée en compétences IA en Afrique. Ce partenariat permet de financer et rendre accessibles les formations professionnelles.",
    highlights: [
      "Financement de formations pour les professionnels",
      "Bourses d'études et aides à la formation",
      "Programmes de reconversion professionnelle vers l'IA",
      "Accompagnement administratif des dossiers de formation",
    ],
    color: "hsl(15 85% 57%)",
  },
];

const PartenairesPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageHeader
          title="Nos Partenaires"
          subtitle="Des partenariats stratégiques avec des institutions de premier plan pour garantir l'excellence de nos formations."
          badge="🤝 Partenaires Privilégiés"
        />

        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <div className="space-y-10">
              {partners.map((partner, i) => (
                <ScrollReveal key={partner.name} delay={i * 0.15} direction={i % 2 === 0 ? "left" : "right"}>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden hover-lift">
                    <div className="flex flex-col md:flex-row">
                      {/* Logo */}
                      <div
                        className="md:w-72 flex flex-col items-center justify-center p-8 gap-4"
                        style={{ background: `${partner.color}08` }}
                      >
                        <div className="w-48 h-36 flex items-center justify-center rounded-xl bg-white p-4">
                          <img
                            src={partner.logo}
                            alt={`Logo ${partner.name}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <span
                          className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{ background: `${partner.color}15`, color: partner.color }}
                        >
                          {partner.type}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-8">
                        <h3 className="font-heading text-2xl font-bold text-card-foreground mb-3">
                          {partner.name}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {partner.description}
                        </p>
                        <ul className="grid sm:grid-cols-2 gap-3">
                          {partner.highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2 text-sm text-card-foreground">
                              <span
                                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                style={{ background: partner.color }}
                              />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary-foreground mb-4">
                Devenir Partenaire
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Vous êtes une université, une entreprise ou une institution et souhaitez collaborer avec l'Académie IA Afrique ? Contactez-nous.
              </p>
              <a
                href="/contact"
                className="bg-coral-gradient font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                style={{ color: "hsl(0 0% 100%)" }}
              >
                Nous contacter <ExternalLink size={18} />
              </a>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default PartenairesPage;
