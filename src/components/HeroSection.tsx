import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Award, Globe, Eye } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import heroBg from "@/assets/hero-bg.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

const sectionCopy = {
  fr: {
    badge: "Formation · Certification · Services IA",
    title1: "L'",
    titleHighlight: "IA",
    title2: " utile pour les talents, les entreprises et les institutions d'Afrique",
    subtitle:
      "TransferAI Africa forme en Côte d'Ivoire et en Afrique des professionnels, étudiants, entrepreneurs et équipes qui veulent apprendre l'IA, l'appliquer concrètement à leur métier et créer de vraies opportunités de croissance.",
    stats: {
      formations: "Formations",
      metiers: "Domaines d'expertise",
      services: "Piliers de services",
      pays: "Pays couverts",
      visiteurs: "Visiteurs",
    },
  },
  en: {
    badge: "Training · Certification · AI Services",
    title1: "",
    titleHighlight: "AI",
    title2: " that serves African talent, companies, and institutions",
    subtitle:
      "TransferAI Africa trains professionals, students, entrepreneurs, and teams in Côte d'Ivoire and across Africa to learn AI, apply it concretely to their work, and unlock real growth opportunities.",
    stats: {
      formations: "Courses",
      metiers: "Areas of expertise",
      services: "Service pillars",
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
    if (!isSupabaseConfigured) {
      return;
    }

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
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-5">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={0.8 + i * 0.1} direction="up" className="h-full">
              <div className="hover-lift flex h-full min-h-[168px] flex-col items-center justify-center rounded-[22px] border border-white/18 bg-[linear-gradient(180deg,hsl(226_28%_18%_/_0.72),hsl(224_24%_14%_/_0.64))] px-5 py-6 text-center shadow-[0_22px_38px_-26px_rgba(15,23,42,0.5)] backdrop-blur-xl">
                <stat.icon className="mx-auto mb-3" size={28} style={{ color: "hsl(32 96% 64%)" }} />
                <p className="mb-2 font-heading text-3xl font-bold tracking-[-0.03em]" style={{ color: "hsl(145 78% 56%)" }}>
                  {stat.value}
                </p>
                <p
                  className="max-w-[12ch] text-sm font-semibold leading-snug text-[hsl(0_0%_100%_/_0.94)]"
                  style={{ textShadow: "0 1px 2px rgba(15, 23, 42, 0.55)" }}
                >
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
