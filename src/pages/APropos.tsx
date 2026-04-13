import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Globe, ShieldCheck, Sparkles, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { directLinks } from "@/lib/site-links";
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

const teamPhotoPosition: Record<string, string> = {
  "Casimir Beda Kassi": "center 28%",
  "Marius Ayoro": "center 22%",
  "Souleymane Konate": "center 6%",
  "Eric N'Guessan": "center 18%",
};

const trustIcons = [Target, ShieldCheck, Globe, Award];

const pageCopy = {
  fr: {
    title: "TransferAI Africa, une IA utile, crédible et ancrée dans le réel",
    subtitle:
      "Nous relions l'expertise IA, les besoins concrets des organisations et les réalités du marché africain pour former, accompagner et faire passer à l'action.",
    introBadge: "En bref",
    introTitle: "Une structure pensée pour rassurer, former et faire avancer",
    introLead:
      "TransferAI Africa aide les professionnels, les entreprises et les institutions à intégrer l'IA avec méthode, impact concret et exigence de qualité.",
    introPoints: [
      "Un ancrage fort en Côte d'Ivoire, avec une ambition africaine claire.",
      "Une approche orientée usages métier, pas démonstration technologique.",
      "Un lien direct entre expertise, besoin terrain et mise en action.",
    ],
    missionTitle: "Notre mission",
    missionPillars: [
      {
        title: "Former utile",
        desc: "Développer des compétences IA directement utilisables dans les métiers, les équipes et les organisations.",
      },
      {
        title: "Accompagner sérieusement",
        desc: "Aider les structures à cadrer leurs priorités et choisir les bons cas d'usage sans dispersion.",
      },
      {
        title: "Ancrer l'impact",
        desc: "Transformer l'IA en résultats concrets : productivité, qualité et meilleure prise de décision.",
      },
    ],
    trustTitle: "Pourquoi nous faire confiance",
    trustItems: [
      {
        title: "Expertise reliée au terrain",
        desc: "Notre approche relie l'exigence technique aux réalités des entreprises, institutions et équipes africaines.",
      },
      {
        title: "Approche métier avant tout",
        desc: "Nous partons des usages, des processus et des résultats attendus, pas d'un discours trop abstrait.",
      },
      {
        title: "Ancrage Côte d'Ivoire, portée Afrique",
        desc: "Nos contenus sont pensés pour les réalités locales tout en gardant un niveau de lecture international.",
      },
      {
        title: "Crédibilité pédagogique et opérationnelle",
        desc: "Nous combinons formation, conseil, cas d'usage sectoriels et logique d'exécution concrète.",
      },
    ],
    teamTitle: "Une équipe construite pour délivrer",
    teamIntro:
      "Notre équipe combine vision, développement, innovation et qualité pédagogique pour transformer les besoins en résultats.",
    team: [
      {
        name: "Casimir Beda Kassi",
        role: "Co-fondateur · Directeur Général",
        contribution: "Pilote la vision, les orientations stratégiques et le positionnement de TransferAI Africa.",
        specialties: ["OpenAI", "Claude · Anthropic", "MS Copilot", "Transformation digitale"],
      },
      {
        name: "Marius Ayoro",
        role: "Fondateur · Directeur Développement & Partenariats",
        contribution: "Structure les demandes entreprises, les partenariats et la mise en relation avec l'offre TransferAI.",
        specialties: ["Transformation digitale", "Agents IA", "Pipelines RAG", "RAG / Chatbots", "Voice Agents", "n8n", "Automation", "RGPD · ICAO"],
      },
      {
        name: "Souleymane Konate",
        role: "Co-fondateur · Directeur IA & Innovation",
        contribution: "Porte la logique IA, les cas d'usage avancés et la montée en compétence technologique.",
        specialties: ["PostgreSQL", "SQL", "Supabase", "Pinecone", "Vector DB"],
      },
      {
        name: "Eric N'Guessan",
        role: "Co-fondateur · Directeur de l'Audit, Pédagogie & Certifications",
        contribution:
          "Porte le dispositif d'audit gratuit, garantit la qualité pédagogique, la cohérence des parcours et l'exigence des livrables.",
        specialties: ["Audit certifié", "RGPD", "ICAO", "Enterprise Security", "Audit & Compliance"],
      },
    ],
    ctaBadge: "Prochaine étape",
    ctaTitle: "Découvrir l'offre, cadrer le besoin ou entrer en contact",
    ctaDesc:
      "Si vous voulez aller plus vite, commencez par l'option la plus adaptée : audit IA gratuit, catalogue ou page entreprises.",
    ctas: [
      { label: "Réserver un audit IA gratuit", to: directLinks.auditLanding, primary: true },
      { label: "Voir le catalogue", to: "/catalogue", primary: false },
      { label: "Explorer la page Entreprises", to: "/entreprises", primary: false },
    ],
  },
  en: {
    title: "TransferAI Africa, practical AI with credibility and real-world relevance",
    subtitle:
      "We connect AI expertise, concrete organizational needs, and African market realities to train, advise, and help teams move into action.",
    introBadge: "At a glance",
    introTitle: "A structure built to reassure, train, and move teams forward",
    introLead:
      "TransferAI Africa helps professionals, companies, and institutions adopt AI with method, practical impact, and a strong standard of quality.",
    introPoints: [
      "Strong Côte d'Ivoire grounding with a clear African ambition.",
      "A use-case and business-first approach rather than technology theater.",
      "A direct bridge between expertise, local needs, and practical execution.",
    ],
    missionTitle: "Our mission",
    missionPillars: [
      {
        title: "Train for action",
        desc: "Build AI capabilities that can be used immediately in jobs, teams, and organizations.",
      },
      {
        title: "Guide with rigor",
        desc: "Help organizations frame priorities, choose the right use cases, and move forward without noise.",
      },
      {
        title: "Create measurable impact",
        desc: "Turn AI into concrete outcomes: productivity, quality, and better decision-making.",
      },
    ],
    trustTitle: "Why trust us",
    trustItems: [
      {
        title: "Expertise connected to reality",
        desc: "Our approach links technical rigor with the operational realities of African companies, institutions, and teams.",
      },
      {
        title: "Business-first approach",
        desc: "We begin with use cases, processes, and expected outcomes rather than abstract AI narratives.",
      },
      {
        title: "Côte d'Ivoire roots, African scope",
        desc: "Our content is grounded in local realities while keeping an international level of quality.",
      },
      {
        title: "Pedagogical and operational credibility",
        desc: "We combine training, advisory, sector use cases, and implementation logic.",
      },
    ],
    teamTitle: "A team built to deliver",
    teamIntro:
      "Our team combines vision, business development, innovation, and learning design to turn needs into results.",
    team: [
      {
        name: "Casimir Beda Kassi",
        role: "Co-founder · CEO",
        contribution: "Leads the vision, strategic direction, and positioning of TransferAI Africa.",
        specialties: ["OpenAI", "Claude · Anthropic", "MS Copilot", "Digital transformation"],
      },
      {
        name: "Marius Ayoro",
        role: "Founder · Director of Business Development & Partnerships",
        contribution: "Structures enterprise opportunities, partnerships, and alignment between client needs and the TransferAI offer.",
        specialties: ["Digital transformation", "AI agents", "RAG pipelines", "RAG / Chatbots", "Voice Agents", "n8n", "Automation", "GDPR · ICAO"],
      },
      {
        name: "Souleymane Konate",
        role: "Co-founder · Director of AI & Innovation",
        contribution: "Drives the AI layer, advanced use cases, and technology capability building.",
        specialties: ["PostgreSQL", "SQL", "Supabase", "Pinecone", "Vector DB"],
      },
      {
        name: "Eric N'Guessan",
        role: "Co-founder · Director of Audit, Learning & Certifications",
        contribution:
          "Leads the free audit process and ensures pedagogical quality, pathway coherence, and the quality of learning outcomes.",
        specialties: ["Certified Audit", "GDPR", "ICAO", "Enterprise Security", "Audit & Compliance"],
      },
    ],
    ctaBadge: "Next step",
    ctaTitle: "Explore the offer, frame the need, or start the conversation",
    ctaDesc:
      "If you want to move faster, start with the entry point that fits best: free AI audit, catalogue, or the enterprise page.",
    ctas: [
      { label: "Book a free AI audit", to: directLinks.auditLanding, primary: true },
      { label: "View the catalogue", to: "/catalogue", primary: false },
      { label: "Explore the enterprise page", to: "/entreprises", primary: false },
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
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 grid gap-6 rounded-3xl border border-border bg-card p-8 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.introBadge}</p>
                <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-card-foreground">{copy.introTitle}</h2>
                <p className="mt-4 text-base leading-8 text-card-foreground">{copy.introLead}</p>
              </div>
              <div className="space-y-3">
                {copy.introPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4 text-sm leading-7 text-muted-foreground">
                    <Sparkles size={16} className="mt-1 shrink-0 text-primary" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="mb-10">
              <h2 className="mb-6 font-heading text-2xl font-bold text-card-foreground">{copy.missionTitle}</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {copy.missionPillars.map((pillar, index) => (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-3xl border border-border bg-card p-6"
                  >
                    <p className="font-heading text-lg font-semibold text-card-foreground">{pillar.title}</p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h2 className="mb-6 font-heading text-2xl font-bold text-card-foreground">{copy.trustTitle}</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {copy.trustItems.map((item, index) => {
                  const Icon = trustIcons[index];
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="rounded-3xl border border-border bg-card p-6"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <p className="mt-4 font-heading text-lg font-semibold text-card-foreground">{item.title}</p>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mb-10 rounded-3xl border border-border bg-card p-8">
              <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.teamTitle}</h2>
              <p className="mt-4 max-w-4xl text-sm leading-7 text-muted-foreground">{copy.teamIntro}</p>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {copy.team.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-3xl border border-border bg-background p-6"
                  >
                    <div className="mb-4 h-40 w-full overflow-hidden rounded-2xl border border-primary/10 bg-muted">
                      {teamPhotos[member.name] ? (
                        <img
                          src={teamPhotos[member.name]}
                          alt={member.name}
                          className="h-full w-full object-cover"
                          style={{ objectPosition: teamPhotoPosition[member.name] ?? "center 20%" }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-accent font-heading text-3xl font-bold text-primary">
                          {member.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-card-foreground">{member.name}</h3>
                    <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{member.contribution}</p>
                    {"specialties" in member && member.specialties ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {member.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-primary/20 bg-primary/5 p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.ctaBadge}</p>
              <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-card-foreground">{copy.ctaTitle}</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">{copy.ctaDesc}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {copy.ctas.map((cta) => (
                  <Link
                    key={cta.label}
                    to={cta.to}
                    className={
                      cta.primary
                        ? "inline-flex items-center gap-2 rounded-full bg-orange-gradient px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        : "inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-card-foreground hover:bg-muted"
                    }
                  >
                    {cta.label} <ArrowRight size={16} />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default AProposPage;
