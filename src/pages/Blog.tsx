import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

const articles = [
  {
    category: "Métiers & IA",
    categoryColor: "text-primary",
    title: "Comment l'IA révolutionne le métier d'assistant de direction en Afrique",
    desc: "Découvrez comment les outils d'IA transforment les tâches quotidiennes des assistants et secrétaires de direction.",
    readTime: "5 min",
    date: "2 Mars 2026",
  },
  {
    category: "Guides",
    categoryColor: "text-accent-foreground",
    title: "ChatGPT en entreprise : guide pratique pour les PME africaines",
    desc: "Un guide étape par étape pour intégrer ChatGPT dans vos processus d'entreprise, avec des cas d'usage concrets.",
    readTime: "8 min",
    date: "25 Février 2026",
  },
  {
    category: "Études de cas",
    categoryColor: "text-destructive",
    title: "Recrutement et IA : comment les DRH africains s'adaptent",
    desc: "Étude de cas sur l'utilisation de l'IA dans le recrutement au sein de grandes entreprises ivoiriennes.",
    readTime: "6 min",
    date: "18 Février 2026",
  },
  {
    category: "Guides",
    categoryColor: "text-accent-foreground",
    title: "Mesurer le ROI de la formation IA en entreprise",
    desc: "Méthodologie et indicateurs clés pour évaluer l'impact de vos investissements en formation IA.",
    readTime: "7 min",
    date: "10 Février 2026",
  },
];

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader title="Blog & Ressources" subtitle="Articles, guides pratiques et études de cas sur l'IA et les métiers en Afrique." />

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
                <span className={`text-xs font-semibold ${a.categoryColor}`}>{a.category}</span>
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
    </div>
  );
};

export default BlogPage;
