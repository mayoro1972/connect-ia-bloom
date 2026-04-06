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
import { deepFixMojibake } from "@/lib/fixMojibake";

const categoryColors: Record<string, string> = {
  "Métiers & IA": "text-primary",
  "Professions & AI": "text-primary",
  Guides: "text-coral",
  "Études de cas": "text-destructive",
  "Case Studies": "text-destructive",
};

const BlogPage = () => {
  const { language } = useLanguage();
  const trans = deepFixMojibake(language === "fr" ? fr : en);
  const content = trans.blog;

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={content.title} subtitle={content.subtitle} />

        <section className="py-16">
          <div className="container mx-auto max-w-5xl px-4 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2">
              {content.articles.map((article, i) => (
                <motion.article
                  key={article.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="cursor-pointer rounded-xl border border-border bg-card p-6 hover-lift"
                >
                  <span className={`text-xs font-semibold ${categoryColors[article.category] || "text-primary"}`}>{article.category}</span>
                  <h3 className="mt-2 mb-3 font-heading text-lg font-bold text-card-foreground">{article.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{article.desc}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {article.readTime}
                    </span>
                    <span>{article.date}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default BlogPage;
