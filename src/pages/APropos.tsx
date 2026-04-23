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
    introTitle: "Transformer l'IA en décisions, compétences et résultats",
    introLead:
      "TransferAI Africa aide les professionnels, les entreprises et les institutions à cadrer leurs priorités IA, faire monter les équipes en compétence et déployer des usages réellement utiles.",
    introPoints: [
      "Un ancrage fort en Côte d'Ivoire, avec une ambition africaine claire.",
      "Un accompagnement de la stratégie au passage à l'action.",
      "Une équipe fondatrice renforcée par 6 consultants experts mobilisables.",
    ],
    missionTitle: "Notre mission",
    missionPillars: [
      {
        title: "Former utile",
        desc: "Développer des compétences IA directement activables dans les métiers, les équipes et les organisations.",
      },
      {
        title: "Cadrer les bons usages",
        desc: "Aider les structures à prioriser, choisir les bons cas d'usage et éviter la dispersion.",
      },
      {
        title: "Déployer avec impact",
        desc: "Transformer l'IA en gains concrets : productivité, qualité, gouvernance et meilleure prise de décision.",
      },
    ],
    trustTitle: "Ce qui nous distingue",
    trustItems: [
      {
        title: "Du cadrage à l'exécution",
        desc: "Nous ne nous arrêtons pas au conseil : nous relions diagnostic, formation, cas d'usage et mise en œuvre.",
      },
      {
        title: "Méthode métier, pas effet de mode",
        desc: "Chaque intervention part d'un besoin réel, d'un processus précis et d'un résultat attendu.",
      },
      {
        title: "Gouvernance et exigence",
        desc: "Nous intégrons pédagogie, conformité, qualité des livrables et maîtrise des risques dès le départ.",
      },
      {
        title: "Une équipe élargie et mobilisable",
        desc: "La structure combine 4 fondateurs et 6 consultants experts pour répondre à des besoins plus larges sans diluer la qualité.",
      },
    ],
    teamTitle: "Une équipe construite pour délivrer",
    teamIntro:
      "Notre équipe fondatrice et nos consultants experts combinent vision, développement, innovation et qualité pédagogique pour transformer les besoins en résultats.",
    teamMeta: {
      capacityLabel: "Jusqu'à 10 experts mobilisables",
      foundersLabel: "4 fondateurs",
      consultantsLabel: "6 consultants experts",
    },
    team: [
      {
        name: "Casimir Beda Kassi",
        category: "Fondateur",
        role: "Co-fondateur · Directeur Général",
        contribution: "Pilote la vision, les orientations stratégiques et le positionnement de TransferAI Africa.",
        specialties: ["OpenAI", "Claude · Anthropic", "MS Copilot", "Transformation digitale"],
      },
      {
        name: "Marius Ayoro",
        category: "Fondateur",
        role: "Fondateur · Directeur Développement & Partenariats",
        contribution: "Structure les demandes entreprises, les partenariats et la mise en relation avec l'offre TransferAI.",
        specialties: ["Transformation digitale", "Agents IA", "Pipelines RAG", "RAG / Chatbots", "Voice Agents", "n8n", "Automation", "RGPD · ICAO"],
      },
      {
        name: "Souleymane Konate",
        category: "Fondateur",
        role: "Co-fondateur · Directeur IA & Innovation",
        contribution: "Porte la logique IA, les cas d'usage avancés et la montée en compétence technologique.",
        specialties: ["PostgreSQL", "SQL", "Supabase", "Pinecone", "Vector DB"],
      },
      {
        name: "Eric N'Guessan",
        category: "Fondateur",
        role: "Co-fondateur · Directeur de l'Audit, Pédagogie & Certifications",
        contribution:
          "Porte le dispositif d'audit gratuit, garantit la qualité pédagogique, la cohérence des parcours et l'exigence des livrables.",
        specialties: ["Audit certifié", "RGPD", "ICAO", "Enterprise Security", "Audit & Compliance"],
      },
      {
        name: "Roland Coffi",
        category: "Consultant expert",
        role: "Consultant expert · Stratégie & transformation des organisations",
        contribution:
          "Accompagne le cadrage des priorités, la conduite du changement et l'adoption de l'IA dans les directions métier et les projets de transformation.",
        specialties: ["Stratégie IA", "Transformation", "Conduite du changement", "Adoption métier"],
      },
      {
        name: "Medard Seri",
        category: "Consultant expert",
        role: "Consultant expert · Data, pilotage & performance",
        contribution:
          "Intervient sur la structuration des données, le suivi des indicateurs et les usages IA qui améliorent l'analyse et la prise de décision.",
        specialties: ["Data", "Pilotage", "Tableaux de bord", "Aide à la décision"],
      },
      {
        name: "Christiane Konan",
        category: "Consultante experte",
        role: "Consultante experte · RH, pédagogie & montée en compétence",
        contribution:
          "Contribue aux parcours métiers, à l'accompagnement des équipes et aux dispositifs de formation utiles pour l'adoption de l'IA.",
        specialties: ["RH", "Formation", "Compétences IA", "Accompagnement"],
      },
      {
        name: "Emmanuelle Koffi",
        category: "Consultante experte",
        role: "Consultante experte · Marketing, contenus & expérience client",
        contribution:
          "Travaille sur les usages IA appliqués au marketing, à la production de contenu et à l'amélioration de l'expérience client.",
        specialties: ["Marketing IA", "Contenus", "Expérience client", "Productivité"],
      },
      {
        name: "Dorothy Blyo",
        category: "Consultante experte",
        role: "Consultante experte · Administration & efficacité opérationnelle",
        contribution:
          "Aide à simplifier les tâches administratives, la gestion documentaire et les processus de support grâce à des usages IA concrets.",
        specialties: ["Administration", "Organisation", "Support opérationnel", "Automatisation"],
      },
      {
        name: "Francois Adou",
        category: "Consultant expert",
        role: "Consultant expert · Risques, conformité & gouvernance",
        contribution:
          "Apporte une lecture orientée conformité, gestion des risques et gouvernance pour des déploiements IA crédibles et maîtrisés.",
        specialties: ["Conformité", "Gouvernance", "Gestion des risques", "IA responsable"],
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
    introTitle: "Turn AI into decisions, skills, and measurable results",
    introLead:
      "TransferAI Africa helps professionals, companies, and institutions frame their AI priorities, build team capability, and deploy use cases that actually matter.",
    introPoints: [
      "Strong Côte d'Ivoire grounding with a clear African ambition.",
      "Support that runs from strategy to execution.",
      "A founding team strengthened by 6 expert consultants ready to mobilize.",
    ],
    missionTitle: "Our mission",
    missionPillars: [
      {
        title: "Train for action",
        desc: "Build AI capabilities that teams can activate immediately in roles, workflows, and organizations.",
      },
      {
        title: "Frame the right use cases",
        desc: "Help organizations prioritize, choose the right use cases, and move forward without noise.",
      },
      {
        title: "Deploy for impact",
        desc: "Turn AI into concrete gains: productivity, quality, governance, and stronger decision-making.",
      },
    ],
    trustTitle: "What makes us different",
    trustItems: [
      {
        title: "From framing to execution",
        desc: "We do not stop at advisory: we connect diagnosis, training, use cases, and implementation.",
      },
      {
        title: "Business method, not hype",
        desc: "Every engagement starts from a real need, a defined process, and an expected outcome.",
      },
      {
        title: "Governance and rigor",
        desc: "We integrate pedagogy, compliance, delivery quality, and risk discipline from the start.",
      },
      {
        title: "A broader team you can mobilize",
        desc: "The structure combines 4 founders and 6 expert consultants to cover broader needs without losing quality.",
      },
    ],
    teamTitle: "A team built to deliver",
    teamIntro:
      "Our founding team and expert consultants combine vision, business development, innovation, and learning design to turn needs into results.",
    teamMeta: {
      capacityLabel: "Up to 10 experts available",
      foundersLabel: "4 founders",
      consultantsLabel: "6 expert consultants",
    },
    team: [
      {
        name: "Casimir Beda Kassi",
        category: "Founder",
        role: "Co-founder · CEO",
        contribution: "Leads the vision, strategic direction, and positioning of TransferAI Africa.",
        specialties: ["OpenAI", "Claude · Anthropic", "MS Copilot", "Digital transformation"],
      },
      {
        name: "Marius Ayoro",
        category: "Founder",
        role: "Founder · Director of Business Development & Partnerships",
        contribution: "Structures enterprise opportunities, partnerships, and alignment between client needs and the TransferAI offer.",
        specialties: ["Digital transformation", "AI agents", "RAG pipelines", "RAG / Chatbots", "Voice Agents", "n8n", "Automation", "GDPR · ICAO"],
      },
      {
        name: "Souleymane Konate",
        category: "Founder",
        role: "Co-founder · Director of AI & Innovation",
        contribution: "Drives the AI layer, advanced use cases, and technology capability building.",
        specialties: ["PostgreSQL", "SQL", "Supabase", "Pinecone", "Vector DB"],
      },
      {
        name: "Eric N'Guessan",
        category: "Founder",
        role: "Co-founder · Director of Audit, Learning & Certifications",
        contribution:
          "Leads the free audit process and ensures pedagogical quality, pathway coherence, and the quality of learning outcomes.",
        specialties: ["Certified Audit", "GDPR", "ICAO", "Enterprise Security", "Audit & Compliance"],
      },
      {
        name: "Roland Coffi",
        category: "Expert consultant",
        role: "Expert consultant · Strategy & organizational transformation",
        contribution:
          "Supports priority setting, change management, and practical AI adoption across business teams and transformation programs.",
        specialties: ["AI strategy", "Transformation", "Change management", "Business adoption"],
      },
      {
        name: "Medard Seri",
        category: "Expert consultant",
        role: "Expert consultant · Data, reporting & performance",
        contribution:
          "Works on data structuring, KPI tracking, and AI use cases that strengthen analysis and decision-making.",
        specialties: ["Data", "Reporting", "Dashboards", "Decision support"],
      },
      {
        name: "Christiane Konan",
        category: "Expert consultant",
        role: "Expert consultant · HR, learning & upskilling",
        contribution:
          "Contributes to role-based pathways, team enablement, and practical learning systems that accelerate AI adoption.",
        specialties: ["HR", "Learning", "AI skills", "Enablement"],
      },
      {
        name: "Emmanuelle Koffi",
        category: "Expert consultant",
        role: "Expert consultant · Marketing, content & customer experience",
        contribution:
          "Focuses on AI use cases for marketing, content production, and improving customer experience with stronger execution speed.",
        specialties: ["AI marketing", "Content", "Customer experience", "Productivity"],
      },
      {
        name: "Dorothy Blyo",
        category: "Expert consultant",
        role: "Expert consultant · Administration & operational efficiency",
        contribution:
          "Helps simplify administrative tasks, document workflows, and support processes through practical AI-enabled operations.",
        specialties: ["Administration", "Organization", "Operations support", "Automation"],
      },
      {
        name: "Francois Adou",
        category: "Expert consultant",
        role: "Expert consultant · Risk, compliance & governance",
        contribution:
          "Brings a compliance, risk, and governance lens to ensure AI deployments remain credible, controlled, and responsible.",
        specialties: ["Compliance", "Governance", "Risk management", "Responsible AI"],
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
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.teamTitle}</h2>
                  <p className="mt-4 max-w-4xl text-sm leading-7 text-muted-foreground">{copy.teamIntro}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary">
                    {copy.teamMeta.capacityLabel}
                  </span>
                  <span className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground">
                    {copy.teamMeta.foundersLabel}
                  </span>
                  <span className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground">
                    {copy.teamMeta.consultantsLabel}
                  </span>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {copy.team.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex h-full flex-col rounded-3xl border border-border bg-background p-5"
                  >
                    <div className="mb-4 h-32 w-full overflow-hidden rounded-2xl border border-primary/10 bg-muted md:h-36">
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
                    {"category" in member && member.category ? (
                      <div className="mb-3">
                        <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                          {member.category}
                        </span>
                      </div>
                    ) : null}
                    <h3 className="font-heading text-base font-semibold text-card-foreground md:text-lg">{member.name}</h3>
                    <p className="mt-1 text-sm font-medium leading-6 text-primary">{member.role}</p>
                    <p className="mt-3 line-clamp-5 text-sm leading-6 text-muted-foreground">{member.contribution}</p>
                    {"specialties" in member && member.specialties ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {member.specialties.slice(0, 5).map((specialty) => (
                          <span
                            key={specialty}
                            className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-muted-foreground"
                          >
                            {specialty}
                          </span>
                        ))}
                        {member.specialties.length > 5 ? (
                          <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary">
                            +{member.specialties.length - 5}
                          </span>
                        ) : null}
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
