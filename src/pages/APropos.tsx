import { useMemo } from "react";
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
import teamEmmanuelle from "@/assets/team-emmanuelle.png";
import teamMedard from "@/assets/team-medard.png";
import teamRoland from "@/assets/team-roland.png";
import teamDorothe from "@/assets/team-dorothe.png";
import teamChristiane from "@/assets/team-christiane.png";
import teamFrancois from "@/assets/team-francois.png";
import teamAxel from "@/assets/team-axel.png";
import teamCelestin from "@/assets/team-celestin.png";

const teamPhotos: Record<string, string> = {
  "Casimir Beda Kassi": teamCasimir,
  "Marius Ayoro": teamMarius,
  "Souleymane Konate": teamSouleymane,
  "Eric N'Guessan": teamEric,
  "Emmanuelle Koffi": teamEmmanuelle,
  "Medard Sery": teamMedard,
  "Roland Coffi": teamRoland,
  "Dorothe Dano": teamDorothe,
  "Christiane Konan": teamChristiane,
  "Francois Tanoh": teamFrancois,
  "Axel N'Guessan": teamAxel,
  "Dr Yao Célestin Djé": teamCelestin,
};

const teamPhotoPosition: Record<string, string> = {
  "Casimir Beda Kassi": "center 28%",
  "Marius Ayoro": "center 22%",
  "Souleymane Konate": "center 6%",
  "Eric N'Guessan": "center 18%",
  "Emmanuelle Koffi": "center 18%",
  "Medard Sery": "center 18%",
  "Roland Coffi": "center 16%",
  "Dorothe Dano": "center 16%",
  "Christiane Konan": "center 16%",
  "Francois Tanoh": "center 18%",
  "Axel N'Guessan": "center 14%",
  "Dr Yao Célestin Djé": "center 14%",
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
      "Une équipe fondatrice renforcée par des consultants experts mobilisables.",
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
        desc: "La structure réunit une équipe fondatrice et des consultants experts pour répondre à des besoins plus larges sans diluer la qualité.",
      },
    ],
    teamTitle: "Une équipe fondatrice qui porte la vision",
    teamIntro:
      "L'équipe fondatrice réunit les profils qui structurent la vision, les partenariats, l'innovation, la pédagogie et l'exécution de TransferAI. Les consultants experts complètent ensuite ce socle dans le carousel dédié.",
    team: [
      {
        name: "Casimir Beda Kassi",
        category: "Co-fondateur",
        role: "Directeur Général",
        contribution: "Pilote la vision, les orientations stratégiques et le positionnement de TransferAI Africa.",
        specialties: ["OpenAI", "Claude · Anthropic", "MS Copilot", "Transformation digitale"],
      },
      {
        name: "Marius Ayoro",
        category: "Co-fondateur",
        role: "Directeur Développement & Partenariats",
        contribution: "Structure les demandes entreprises, les partenariats et la mise en relation avec l'offre TransferAI.",
        specialties: ["Transformation digitale", "Agents IA", "Pipelines RAG", "RAG / Chatbots", "Voice Agents", "n8n", "Automation", "RGPD · ICAO"],
      },
      {
        name: "Souleymane Konate",
        category: "Co-fondateur",
        role: "Directeur IA & Innovation",
        contribution: "Porte la logique IA, les cas d'usage avancés et la montée en compétence technologique.",
        specialties: ["PostgreSQL", "SQL", "Supabase", "Pinecone", "Vector DB"],
      },
      {
        name: "Eric N'Guessan",
        category: "Co-fondateur",
        role: "Directeur de l'Audit, Pédagogie & Certifications",
        contribution:
          "Porte le dispositif d'audit gratuit, garantit la qualité pédagogique, la cohérence des parcours et l'exigence des livrables.",
        specialties: ["Audit certifié", "RGPD", "ICAO", "Enterprise Security", "Audit & Compliance"],
      },
      {
        name: "Francois Tanoh",
        category: "Co-fondateur",
        role: "Consultant expert · Support digital, outils Microsoft & adoption IA",
        contribution:
          "Apporte une expertise de support digital senior, de résolution opérationnelle et d'accompagnement des usages, avec une forte maîtrise de l'écosystème Microsoft et des assistants IA comme Copilot, Claude et OpenAI.",
        specialties: ["Microsoft Certified", "MS Copilot", "OpenAI", "Claude", "Support digital", "Adoption IA"],
      },
      {
        name: "Medard Sery",
        category: "Co-fondateur",
        role: "Consultant expert · Data engineering, cloud & plateformes IA",
        contribution:
          "Conçoit des plateformes data scalables et des architectures cloud orientées IA, avec une forte expertise en Big Data, data engineering et industrialisation des pipelines.",
        specialties: ["Big Data", "Data Engineering", "AWS · Azure · GCP", "Spark", "Kafka", "Databricks"],
      },
      {
        name: "Emmanuelle Koffi",
        category: "Consultante experte",
        role: "Consultante experte · Automatisation, agents IA & workflows métier",
        contribution:
          "Conçoit des automatisations opérationnelles, des agents IA et des workflows orientés performance pour les équipes métier, avec une base solide en prompt engineering, RAG et déploiement cloud.",
        specialties: ["Automatisation", "Agents IA", "Prompt Engineering", "RAG", "n8n · Python", "Azure · AWS"],
      },
      {
        name: "Christiane Konan",
        category: "Consultante experte",
        role: "Consultante experte · RH, pédagogie & efficacité opérationnelle",
        contribution:
          "Intervient sur les parcours métiers, la formation, l'accompagnement des équipes et l'organisation opérationnelle afin de faciliter l'adoption de l'IA et la montée en compétence durable.",
        specialties: ["RH", "Formation", "Compétences IA", "Accompagnement", "Organisation", "Efficacité opérationnelle"],
      },
      {
        name: "Roland Coffi",
        category: "Consultant expert",
        role: "Consultant expert · Diplomatie, IA appliquée & formation",
        contribution:
          "Apporte une expertise croisée en diplomatie, transmission des savoirs et usages concrets de l'IA, pour aider les organisations à intégrer l'IA avec méthode, pédagogie et sens du contexte institutionnel.",
        specialties: ["Diplomatie", "IA appliquée", "Formation", "Communication stratégique", "Accompagnement", "Pédagogie"],
      },
      {
        name: "Dorothe Dano",
        category: "Consultante experte",
        role: "Consultante experte · Power BI, data visualisation & automatisation décisionnelle",
        contribution:
          "Conserve son positionnement orienté pilotage et efficacité opérationnelle, renforcé par une expertise en Power BI, modélisation de données, visualisation et solutions Microsoft pour les usages métier.",
        specialties: ["Power BI", "Data Visualisation", "Data Modeling", "Azure Fundamentals", "Power Platform", "Automatisation"],
      },
      {
        name: "Dr Yao Célestin Djé",
        category: "Consultant expert",
        role: "Consultant expert · Santé publique, droit médical & IA appliquée",
        contribution:
          "Intervient sur la santé publique, l'urgence médicale, le droit médical et l'accompagnement stratégique des institutions. Il apporte une lecture pragmatique de la transformation des systèmes de santé, de l'innovation médicale et de l'intégration de l'intelligence artificielle dans les projets à fort impact.",
        specialties: ["Santé publique", "Urgence médicale", "Droit médical", "Innovation médicale", "IA appliquée"],
      },
      {
        name: "Axel N'Guessan",
        category: "Consultant",
        role: "Consultant · Software engineering, IA appliquée & produits digitaux",
        contribution:
          "Contribue à la conception de produits web et mobiles, de bases de données, de briques IA en Python et de prototypes utiles, avec un profil alliant ingénierie logicielle, simulation et transmission technique.",
        specialties: ["Software Engineering", "Web & Mobile", "IA Python", "Bases de données", "3D & Simulation", "Pédagogie technique"],
      },
      {
        name: "Gabriel Sallah",
        category: "Consultant expert",
        role: "Consultant expert · IA, cloud computing & infrastructures de calcul",
        contribution:
          "Apporte une expertise senior en high-performance computing, cloud et infrastructures Big Data pour aider les organisations à concevoir des environnements IA robustes, scalables et orientés résultats.",
        specialties: ["AI Infrastructure", "Cloud Computing", "HPC", "Big Data", "Enterprise IT", "TOGAF"],
      },
      {
        name: "MD",
        category: "Consultant",
        role: "Consultant · Marketing, campagnes & expérience client",
        contribution:
          "Travaille sur les usages IA appliqués au marketing, au pilotage des campagnes et à l'amélioration de l'expérience client pour rendre les actions plus ciblées, plus fluides et plus mesurables.",
        specialties: ["Marketing IA", "Campagnes", "Expérience client", "Segmentation", "Performance"],
      },
      {
        name: "SD",
        category: "Consultant",
        role: "Consultant · Contenus, création & expérience client",
        contribution:
          "Travaille sur les usages IA appliqués à la production de contenu, à la création de supports et à l'amélioration de l'expérience client pour renforcer la clarté, l'engagement et la productivité.",
        specialties: ["Contenus", "Création de contenu", "Expérience client", "Productivité", "Activation"],
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
      "A founding team strengthened by expert consultants ready to mobilize.",
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
        desc: "The structure brings together a founding team and expert consultants to cover broader needs without losing quality.",
      },
    ],
    teamTitle: "A founding team that carries the vision",
    teamIntro:
      "The founding team brings together the profiles shaping TransferAI's vision, partnerships, innovation, learning design, and execution. Expert consultants then extend this foundation through the dedicated carousel below.",
    team: [
      {
        name: "Casimir Beda Kassi",
        category: "Co-founder",
        role: "CEO",
        contribution: "Leads the vision, strategic direction, and positioning of TransferAI Africa.",
        specialties: ["OpenAI", "Claude · Anthropic", "MS Copilot", "Digital transformation"],
      },
      {
        name: "Marius Ayoro",
        category: "Co-founder",
        role: "Director of Business Development & Partnerships",
        contribution: "Structures enterprise opportunities, partnerships, and alignment between client needs and the TransferAI offer.",
        specialties: ["Digital transformation", "AI agents", "RAG pipelines", "RAG / Chatbots", "Voice Agents", "n8n", "Automation", "GDPR · ICAO"],
      },
      {
        name: "Souleymane Konate",
        category: "Co-founder",
        role: "Director of AI & Innovation",
        contribution: "Drives the AI layer, advanced use cases, and technology capability building.",
        specialties: ["PostgreSQL", "SQL", "Supabase", "Pinecone", "Vector DB"],
      },
      {
        name: "Eric N'Guessan",
        category: "Co-founder",
        role: "Director of Audit, Learning & Certifications",
        contribution:
          "Leads the free audit process and ensures pedagogical quality, pathway coherence, and the quality of learning outcomes.",
        specialties: ["Certified Audit", "GDPR", "ICAO", "Enterprise Security", "Audit & Compliance"],
      },
      {
        name: "Francois Tanoh",
        category: "Co-founder",
        role: "Expert consultant · Digital support, Microsoft tools & AI adoption",
        contribution:
          "Brings senior digital support expertise, hands-on operational troubleshooting, and user enablement, with strong command of the Microsoft ecosystem and AI assistants such as Copilot, Claude, and OpenAI.",
        specialties: ["Microsoft Certified", "MS Copilot", "OpenAI", "Claude", "Digital support", "AI adoption"],
      },
      {
        name: "Medard Sery",
        category: "Co-founder",
        role: "Expert consultant · Data engineering, cloud & AI platforms",
        contribution:
          "Designs scalable data platforms and cloud architectures for AI, with strong depth in Big Data, data engineering, and pipeline industrialization.",
        specialties: ["Big Data", "Data Engineering", "AWS · Azure · GCP", "Spark", "Kafka", "Databricks"],
      },
      {
        name: "Emmanuelle Koffi",
        category: "Expert consultant",
        role: "Expert consultant · Automation, AI agents & business workflows",
        contribution:
          "Designs operational automations, AI agents, and performance-oriented workflows for business teams, with strong grounding in prompt engineering, RAG, and cloud deployment.",
        specialties: ["Automation", "AI agents", "Prompt Engineering", "RAG", "n8n · Python", "Azure · AWS"],
      },
      {
        name: "Christiane Konan",
        category: "Expert consultant",
        role: "Expert consultant · HR, learning & operational efficiency",
        contribution:
          "Supports role-based pathways, team enablement, learning systems, and operational organization to make AI adoption practical and sustainable.",
        specialties: ["HR", "Learning", "AI skills", "Enablement", "Organization", "Operational efficiency"],
      },
      {
        name: "Roland Coffi",
        category: "Expert consultant",
        role: "Expert consultant · Diplomacy, applied AI & training",
        contribution:
          "Brings combined expertise in diplomacy, knowledge transfer, and practical AI use to help organizations adopt AI with method, pedagogy, and institutional awareness.",
        specialties: ["Diplomacy", "Applied AI", "Training", "Strategic communication", "Enablement", "Pedagogy"],
      },
      {
        name: "Dorothe Dano",
        category: "Expert consultant",
        role: "Expert consultant · Power BI, data visualization & decision automation",
        contribution:
          "Keeps her operational efficiency positioning, strengthened by expertise in Power BI, data modeling, visualization, and Microsoft solutions for business-facing use cases.",
        specialties: ["Power BI", "Data Visualization", "Data Modeling", "Azure Fundamentals", "Power Platform", "Automation"],
      },
      {
        name: "Dr Yao Célestin Djé",
        category: "Expert consultant",
        role: "Expert consultant · Public health, medical law & applied AI",
        contribution:
          "Works across public health, emergency medicine, medical law, and strategic institutional support. He brings a pragmatic view of health-system transformation, medical innovation, and the integration of artificial intelligence into high-impact projects.",
        specialties: ["Public health", "Emergency medicine", "Medical law", "Medical innovation", "Applied AI"],
      },
      {
        name: "Axel N'Guessan",
        category: "Consultant",
        role: "Consultant · Software engineering, applied AI & digital products",
        contribution:
          "Contributes to web and mobile product design, database engineering, Python-based AI building blocks, and useful prototypes, combining software engineering, simulation, and technical enablement.",
        specialties: ["Software Engineering", "Web & Mobile", "Python AI", "Databases", "3D & Simulation", "Technical enablement"],
      },
      {
        name: "Gabriel Sallah",
        category: "Expert consultant",
        role: "Expert consultant · AI, cloud computing & compute infrastructure",
        contribution:
          "Brings senior expertise in high-performance computing, cloud, and Big Data infrastructure to help organizations design AI environments that are robust, scalable, and outcome-driven.",
        specialties: ["AI Infrastructure", "Cloud Computing", "HPC", "Big Data", "Enterprise IT", "TOGAF"],
      },
      {
        name: "MD",
        category: "Consultant",
        role: "Consultant · Marketing, campaigns & customer experience",
        contribution:
          "Works on AI use cases applied to marketing, campaign execution, and customer experience so outreach becomes more targeted, smoother, and easier to measure.",
        specialties: ["Marketing AI", "Campaigns", "Customer experience", "Segmentation", "Performance"],
      },
      {
        name: "SD",
        category: "Consultant",
        role: "Consultant · Content, creation & customer experience",
        contribution:
          "Works on AI use cases for content production, asset creation, and customer experience to improve clarity, engagement, and day-to-day productivity.",
        specialties: ["Content", "Content creation", "Customer experience", "Productivity", "Activation"],
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
  const founders = useMemo(
    () => copy.team.filter((member) => member.category === "Co-fondateur" || member.category === "Co-founder"),
    [copy.team],
  );
  const consultants = useMemo(
    () => copy.team.filter((member) => member.category !== "Co-fondateur" && member.category !== "Co-founder"),
    [copy.team],
  );

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
              <div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.teamTitle}</h2>
                  <p className="mt-4 max-w-4xl text-sm leading-7 text-muted-foreground">{copy.teamIntro}</p>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {language === "en" ? "Founding team" : "Équipe fondatrice"}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {founders.map((member, index) => (
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

              <div className="mt-10 rounded-3xl border border-border bg-background p-5 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {language === "en" ? "Consultants" : "Consultants"}
                    </p>
                    <h3 className="mt-3 font-heading text-xl font-semibold text-card-foreground">
                      {language === "en" ? "Consultant carousel" : "Carousel consultants"}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {language === "en"
                        ? "Scroll horizontally to explore the full consultant bench without overloading the page."
                        : "Faites défiler horizontalement pour découvrir l’ensemble des consultants sans surcharger la page."}
                    </p>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {language === "en" ? "Swipe or scroll" : "Glisser ou faire défiler"}
                  </p>
                </div>

                <div className="mt-6 flex gap-5 overflow-x-auto pb-2">
                  {consultants.map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06 }}
                      className="flex min-w-[280px] max-w-[320px] flex-col rounded-3xl border border-border bg-card p-5 md:min-w-[320px]"
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
                          <div className="flex h-full w-full items-center justify-center bg-accent font-heading text-4xl font-bold text-primary">
                            {member.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                        )}
                      </div>
                      {member.category ? (
                        <div className="mb-3">
                          <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                            {member.category}
                          </span>
                        </div>
                      ) : null}
                      <h3 className="font-heading text-lg font-semibold text-card-foreground">{member.name}</h3>
                      <p className="mt-1 text-sm font-medium leading-6 text-primary">{member.role}</p>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{member.contribution}</p>
                      {member.specialties ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {member.specialties.slice(0, 5).map((specialty) => (
                            <span
                              key={specialty}
                              className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold text-muted-foreground"
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
