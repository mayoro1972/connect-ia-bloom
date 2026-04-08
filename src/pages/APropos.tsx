import { motion } from "framer-motion";
import { Target, Users, Award, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import teamCasimir from "@/assets/team-casimir.jpg";
import teamMarius from "@/assets/team-marius.jpg";
import teamSouleymane from "@/assets/team-souleymane.jpg";
import teamEric from "@/assets/team-eric.jpg";

const teamPhotos: Record<string, string> = {
  "Casimir Beda Kassi": teamCasimir,
  "Marius Ayoro": teamMarius,
  "Souleymane Konate": teamSouleymane,
  "Eric N'Guessan": teamEric,
};

const iconMap = [Target, Users, Award, Globe];

const pageCopy = {
  fr: {
    title: "A propos de TransferAI Africa",
    subtitle: "Notre mission : transférer l'expertise IA de la diaspora vers l'Afrique.",
    missionTitle: "Notre Mission",
    missionText: [
      "TransferAI Africa est née d'une conviction forte : la diaspora ivoirienne et africaine regorge d'experts de haut niveau en Intelligence Artificielle, en data science et en transformation digitale, des talents souvent méconnus ou sous-exploités par le continent.",
      "Notre mission est de bâtir un pont durable entre cette diaspora d'excellence et les entreprises, institutions et professionnels d'Afrique francophone. En mobilisant ces experts comme formateurs, mentors et consultants, nous assurons un transfert de compétences concret en digital et en IA, au service du développement économique de la Côte d'Ivoire et du continent.",
      "Pour garantir l'excellence et l'ancrage institutionnel de nos programmes, nous nous appuyons sur des partenariats stratégiques avec des acteurs de référence : Middlesex University pour la dimension académique internationale, le FDFP pour le financement de la formation professionnelle, la SNDI et l'IADS pour l'accompagnement institutionnel, et Nettelecom CI pour l'infrastructure digitale.",
      "Nos formations sont pratiques, ancrées dans les réalités africaines et immédiatement applicables. Parce que la transformation digitale de l'Afrique passera par ses propres talents, ceux d'ici et ceux de la diaspora.",
    ],
    stats: [
      { value: "130+", label: "Formations", sub: "Un catalogue complet couvrant 13 domaines d'expertise" },
      { value: "500+", label: "Professionnels formés", sub: "Issus de banques, télécoms, ministères" },
      { value: "98%", label: "de satisfaction", sub: "Noté par nos participants" },
      { value: "10+", label: "Pays", sub: "Côte d'Ivoire, Sénégal, Cameroun, etc." },
    ],
    teamTitle: "Notre Équipe",
    team: [
      {
        name: "Casimir Beda Kassi",
        role: "Directeur Général & Co-fondateur",
        desc: "15+ ans d'expérience en stratégie digitale. Il pilote la vision de TransferAI Africa pour faire de l'IA un levier de croissance en Afrique.",
      },
      {
        name: "Marius Ayoro",
        role: "Directeur Développement & Partenariats",
        desc: "Expert en transformation digitale des entreprises. Il conçoit des solutions IA sur mesure pour les secteurs banque, télécom et industrie.",
      },
      {
        name: "Souleymane Konate",
        role: "Directeur IA & Innovation",
        desc: "PhD en Data Science, il dirige la R&D et forme les professionnels aux technologies IA de pointe : machine learning, NLP et vision par ordinateur.",
      },
      {
        name: "Eric N'Guessan",
        role: "Directeur Pédagogique & Certifications",
        desc: "Ingénieur pédagogique certifié, il supervise la qualité des formations et les partenariats académiques internationaux.",
      },
    ],
  },
  en: {
    title: "About TransferAI Africa",
    subtitle: "Our mission: transfer AI expertise from the diaspora to Africa.",
    missionTitle: "Our Mission",
    missionText: [
      "TransferAI Africa was born from a strong conviction: the Ivorian and African diaspora is home to world-class experts in Artificial Intelligence, data science and digital transformation, talents often overlooked or underutilized by the continent.",
      "Our mission is to build a lasting bridge between this diaspora of excellence and the businesses, institutions and professionals of francophone Africa. By mobilizing these experts as trainers, mentors and consultants, we deliver concrete skills transfer in digital and AI, driving the economic development of Côte d'Ivoire and the continent.",
      "To ensure the excellence and institutional grounding of our programs, we rely on strategic partnerships with key players: Middlesex University for international academic standards, the FDFP for professional training funding, SNDI and IADS for institutional support, and Nettelecom CI for digital infrastructure.",
      "Our courses are practical, rooted in African realities and immediately applicable. Because Africa's digital transformation will be driven by its own talents, those at home and those in the diaspora.",
    ],
    stats: [
      { value: "130+", label: "Courses", sub: "A comprehensive catalogue covering 13 areas of expertise" },
      { value: "500+", label: "Professionals trained", sub: "From banks, telecoms and ministries" },
      { value: "98%", label: "satisfaction rate", sub: "Rated by our participants" },
      { value: "10+", label: "Countries", sub: "Côte d'Ivoire, Senegal, Cameroon, etc." },
    ],
    teamTitle: "Our Team",
    team: [
      {
        name: "Casimir Beda Kassi",
        role: "CEO & Co-founder",
        desc: "15+ years in digital strategy. He drives TransferAI Africa's vision to make AI a growth lever across the continent.",
      },
      {
        name: "Marius Ayoro",
        role: "Director of Business Development",
        desc: "Enterprise transformation expert. He designs tailored AI solutions for banking, telecom and industry sectors.",
      },
      {
        name: "Souleymane Konate",
        role: "Director of AI & Innovation",
        desc: "PhD in Data Science, he leads R&D and trains professionals in cutting-edge AI: machine learning, NLP and computer vision.",
      },
      {
        name: "Eric N'Guessan",
        role: "Director of Education & Certifications",
        desc: "Certified learning engineer, he oversees training quality and international academic partnerships.",
      },
    ],
  },
} as const;

const AProposPage = () => {
  const { language } = useLanguage();
  const copy = pageCopy[resolveActiveLanguage(language)];

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={copy.title} subtitle={copy.subtitle} />

        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="mb-4 font-heading text-2xl font-bold">{copy.missionTitle}</h2>
              {copy.missionText.map((para, i) => (
                <p key={i} className="mb-4 leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))}
            </motion.div>

            <div className="mb-16 grid gap-4 sm:grid-cols-2">
              {copy.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                    {(() => {
                      const Icon = iconMap[i];
                      return <Icon size={20} className="text-primary" />;
                    })()}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-card-foreground">
                      {s.value} {s.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <h2 className="mb-6 font-heading text-2xl font-bold">{copy.teamTitle}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {copy.team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-md hover-lift"
                >
                  <div className="mb-4 h-40 w-40 overflow-hidden rounded-2xl border-4 border-primary/20 bg-muted shadow-lg">
                    {teamPhotos[member.name] ? (
                      <img src={teamPhotos[member.name]} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center bg-teal-gradient font-heading text-3xl font-bold"
                        style={{ color: "hsl(0 0% 100%)" }}
                      >
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-heading font-semibold text-card-foreground">{member.name}</h3>
                  <p className="mb-2 text-sm font-medium text-coral">{member.role}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{member.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default AProposPage;
