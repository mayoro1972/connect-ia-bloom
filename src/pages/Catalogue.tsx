import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Clock, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import { formations, type Formation } from "@/data/formations";
import { useLanguage } from "@/i18n/LanguageContext";

const metiers = [...new Set(formations.map((f) => f.metier))];

const CataloguePage = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [filterMetier, setFilterMetier] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterFormat, setFilterFormat] = useState("");

  const levels: Formation["level"][] = ["Débutant", "Intermédiaire", "Avancé"];
  const formats: Formation["format"][] = ["Présentiel", "Hybride", "En ligne"];

  const levelColors: Record<string, string> = {
    "Débutant": "bg-accent text-accent-foreground",
    "Intermédiaire": "bg-primary/10 text-primary",
    "Avancé": "bg-destructive/10 text-destructive",
  };

  const filtered = useMemo(() => {
    return formations.filter((f) => {
      const matchSearch = !search || f.title.toLowerCase().includes(search.toLowerCase()) || f.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchMetier = !filterMetier || f.metier === filterMetier;
      const matchLevel = !filterLevel || f.level === filterLevel;
      const matchFormat = !filterFormat || f.format === filterFormat;
      return matchSearch && matchMetier && matchLevel && matchFormat;
    });
  }, [search, filterMetier, filterLevel, filterFormat]);

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader title={t("catalogue.title")} subtitle={t("catalogue.subtitle")} />

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-card rounded-xl border border-border p-6 mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder={t("catalogue.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <select value={filterMetier} onChange={(e) => setFilterMetier(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none">
              <option value="">{t("catalogue.allMetiers")}</option>
              {metiers.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none">
              <option value="">{t("catalogue.allLevels")}</option>
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none">
              <option value="">{t("catalogue.allFormats")}</option>
              {formats.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <p className="text-sm text-muted-foreground mb-6">{filtered.length} {t("catalogue.found")}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((f, i) => (
              <Link key={f.id} to={`/catalogue/${f.id}`}>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.5) }} className="bg-card border border-border rounded-xl p-5 hover-lift flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColors[f.level]}`}>{f.level}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Monitor size={12} />{f.format}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12} />{f.duration}</span>
                </div>
                <h3 className="font-heading font-semibold text-sm mb-3 text-card-foreground flex-1">{f.title}</h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {f.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-semibold text-sm text-card-foreground">{f.price}</span>
                  <span className="text-xs font-semibold text-primary">{t("catalogue.details")}</span>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
    </PageTransition>
  );
};

export default CataloguePage;
