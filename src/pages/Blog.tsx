import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";

const categoryColors: Record<string, string> = {
  "Métiers & IA": "text-primary",
  "Professions & AI": "text-primary",
  "Guides": "text-coral",
  "Études de cas": "text-destructive",
  "Case Studies": "text-destructive",
};

const BlogPage = () => {
  const { t, language } = useLanguage();
  const trans = language === "fr" ? fr : en;
  const articles = trans.blog.articles;

  return (
    <PageTransition><div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedLogoWatermarks />
      <Navbar />
      <PageHeader title={t("blog.title")} subtitle={t("blog.subtitle")} />

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((a, i) => (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-6 hover-lift cursor-pointer"
              >
                <span className={`text-xs font-semibold ${categoryColors[a.category] || "text-primary"}`}>{a.category}</span>
                <h3 className="font-heading text-lg font-bold text-card-foreground mt-2 mb-3">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{a.desc}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock size={14} />{a.readTime}</span>
                  <span>{a.date}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div></PageTransition>
  );
};

export default BlogPage;
