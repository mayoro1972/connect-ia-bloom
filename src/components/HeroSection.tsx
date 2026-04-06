import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Award, Globe, ArrowRight, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import heroBg from "@/assets/hero-bg.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { supabase } from "@/integrations/supabase/client";
import { buildContactPath } from "@/lib/site-links";

const sectionCopy = {
  fr: {
    badge: "Éducation · Consulting · Solutions IA",
    title1: "Devenez le partenaire stratégique ",
    titleHighlight: "IA",
    title2: "que les entreprises s'arrachent",
    subtitle:
      "Des milliers d'entreprises cherchent urgemment des experts pour réussir leurs transitions IA. En quelques mois, devenez le partenaire stratégique IA que les entreprises paieront cher, même si vous partez de zéro.",
    cta: "Commencer maintenant",
    catalogue: "Télécharger le catalogue",
    stats: {
      formations: "Formations IA",
      metiers: "Domaines d'expertise",
      services: "Services experts",
      pays: "Pays couverts",
      visiteurs: "Visiteurs",
    },
  },
  en: {
    badge: "Education · Consulting · AI Solutions",
    title1: "Become the strategic ",
    titleHighlight: "AI",
    title2: "partner companies are snapping up",
    subtitle:
      "Thousands of companies are urgently looking for experts to succeed in their AI transitions. In a matter of months, become the AI strategic partner that companies will pay dearly for, even if you're starting from scratch.",
    cta: "Get started now",
    catalogue: "Download the catalogue",
    stats: {
      formations: "AI training",
      metiers: "Areas of expertise",
      services: "Expert services",
      pays: "Countries covered",
      visiteurs: "Visitors",
    },
  },
} as const;

const HeroSection = () => {
  const { language } = useLanguage();
  const activeLanguage = resolveActiveLanguage(language);
  const copy = sectionCopy[activeLanguage];
  const [totalViews, setTotalViews] = useState<number | null>(null);

  useEffect(() => {
    const fetchViews = async () => {
      const { data } = await supabase.rpc("get_public_page_view_stats");
      const stats = Array.isArray(data) ? data[0] : null;

      if (stats?.total_views != null) {
        setTotalViews(stats.total_views);
      }
    };

    fetchViews();
  }, []);

  const stats = [
    { icon: BookOpen, value: "130+", label: copy.stats.formations },
    { icon: Users, value: "13", label: copy.stats.metiers },
    { icon: Award, value: "3", label: copy.stats.services },
    { icon: Globe, value: "10+", label: copy.stats.pays },
    { icon: Eye, value: totalViews !== null ? totalViews.toLocaleString() : "-", label: copy.stats.visiteurs },
  ];

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: [1, 1.06, 1.03, 1.08], x: [0, -10, 5, -15], y: [0, -8, 4, -10] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, hsl(225 55% 10% / 0.65), hsl(30 80% 30% / 0.45))" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, hsl(225 55% 10% / 0.3) 0%, hsl(225 55% 10% / 0.7) 100%)" }}
        />
      </motion.div>

      <div className="container relative z-10 mx-auto px-4 pb-12 pt-28 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 text-sm font-heading font-bold uppercase tracking-[0.22em]"
            style={{ color: "hsl(30 90% 65%)" }}
          >
            {copy.badge}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-6 font-heading text-4xl font-bold leading-[1.02] md:text-6xl lg:text-7xl"
            style={{ color: "hsl(0 0% 98%)" }}
          >
            {copy.title1}
            <span className="text-gradient-orange">{copy.titleHighlight}</span>
            <br />
            {copy.title2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-slate-200/85 md:text-xl"
          >
            {copy.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to={buildContactPath("demande-renseignement")}
              aria-label="Contacter TransferAI Africa"
              className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-8 py-3.5 text-base font-heading font-bold uppercase tracking-[0.08em] text-white shadow-[0_20px_40px_-24px_hsl(32_94%_52%_/_0.75)] transition-all hover:scale-105 hover:opacity-95"
            >
              {copy.cta} <ArrowRight size={18} />
            </Link>
            <Link
              to="/catalogues-domaines"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-8 py-3.5 text-base font-heading font-bold uppercase tracking-[0.08em] text-white/95 transition-all hover:scale-105 hover:bg-white/[0.08]"
            >
              <Download size={18} /> {copy.catalogue}
            </Link>
          </motion.div>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-5">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={0.8 + i * 0.1} direction="up">
              <div className="glass-card hover-lift rounded-xl p-6 text-center">
                <stat.icon className="mx-auto mb-3" size={28} style={{ color: "hsl(30 90% 60%)" }} />
                <p className="mb-1 font-heading text-3xl font-bold" style={{ color: "hsl(145 65% 50%)" }}>
                  {stat.value}
                </p>
                <p className="text-sm text-slate-200/78">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
