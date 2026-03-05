import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Clock, Monitor, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

type Formation = {
  id: string;
  title: string;
  metier: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  format: "Présentiel" | "Hybride" | "En ligne";
  duration: string;
  price: string;
  tags: string[];
};

const formations: Formation[] = [
  { id: "assist-01", title: "ChatGPT pour Assistants de Direction", metier: "Assistanat & Secrétariat", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["ChatGPT", "Productivité"] },
  { id: "assist-02", title: "Gestion Intelligente de l'Agenda avec l'IA", metier: "Assistanat & Secrétariat", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Agenda", "Automatisation"] },
  { id: "assist-03", title: "Rédaction Professionnelle Assistée par IA", metier: "Assistanat & Secrétariat", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Rédaction", "ChatGPT"] },
  { id: "rh-01", title: "IA et Recrutement : Sourcing & Sélection", metier: "Ressources Humaines", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["Recrutement", "IA"] },
  { id: "rh-02", title: "Gestion Prévisionnelle des Emplois avec l'IA", metier: "Ressources Humaines", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["GPEC", "Prédictif"] },
  { id: "mkt-01", title: "Création de Contenu Marketing avec l'IA", metier: "Marketing & Communication", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["Contenu", "ChatGPT"] },
  { id: "mkt-02", title: "SEO Automatisé et IA", metier: "Marketing & Communication", level: "Intermédiaire", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["SEO", "Automatisation"] },
  { id: "fin-01", title: "IA et Analyse Financière Avancée", metier: "Finance & Comptabilité", level: "Avancé", format: "Présentiel", duration: "3 jours", price: "750 000 FCFA", tags: ["Finance", "Analyse"] },
  { id: "fin-02", title: "Détection de Fraudes avec l'IA", metier: "Finance & Comptabilité", level: "Intermédiaire", format: "Hybride", duration: "2 jours", price: "500 000 FCFA", tags: ["Fraude", "Machine Learning"] },
  { id: "jur-01", title: "Recherche Juridique Assistée par IA", metier: "Juridique & Conformité", level: "Débutant", format: "En ligne", duration: "1 jour", price: "350 000 FCFA", tags: ["Juridique", "Recherche"] },
  { id: "sc-01", title: "Chatbots Intelligents pour le Service Client", metier: "Service Client", level: "Intermédiaire", format: "Présentiel", duration: "2 jours", price: "500 000 FCFA", tags: ["Chatbot", "IA"] },
  { id: "data-01", title: "Visualisation de Données avec IA", metier: "Data & Analyse", level: "Débutant", format: "Présentiel", duration: "2 jours", price: "350 000 FCFA", tags: ["Data Viz", "IA"] },
  { id: "admin-01", title: "Automatisation Administrative avec l'IA", metier: "Administration & Gestion", level: "Débutant", format: "Hybride", duration: "1 jour", price: "350 000 FCFA", tags: ["Automatisation", "Admin"] },
  { id: "mgmt-01", title: "Leadership Data-Driven avec l'IA", metier: "Management & Leadership", level: "Avancé", format: "Présentiel", duration: "2 jours", price: "750 000 FCFA", tags: ["Leadership", "Data"] },
  { id: "it-01", title: "Intégration d'Outils IA en Entreprise", metier: "IT & Transformation Digitale", level: "Intermédiaire", format: "Présentiel", duration: "3 jours", price: "500 000 FCFA", tags: ["IT", "Intégration"] },
  { id: "form-01", title: "E-learning Adaptatif avec l'IA", metier: "Formation & Pédagogie", level: "Intermédiaire", format: "En ligne", duration: "2 jours", price: "500 000 FCFA", tags: ["E-learning", "Pédagogie"] },
];

const metiers = [...new Set(formations.map((f) => f.metier))];
const levels: Formation["level"][] = ["Débutant", "Intermédiaire", "Avancé"];
const formats: Formation["format"][] = ["Présentiel", "Hybride", "En ligne"];

const levelColors: Record<string, string> = {
  "Débutant": "bg-accent text-accent-foreground",
  "Intermédiaire": "bg-primary/10 text-primary",
  "Avancé": "bg-destructive/10 text-destructive",
};

const CataloguePage = () => {
  const [search, setSearch] = useState("");
  const [filterMetier, setFilterMetier] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterFormat, setFilterFormat] = useState("");

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader title="Catalogue de Formations IA" subtitle="120 formations pratiques pour 12 métiers. Filtrez par domaine, niveau et format." />

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <select value={filterMetier} onChange={(e) => setFilterMetier(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none">
              <option value="">Tous les métiers</option>
              {metiers.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none">
              <option value="">Tous les niveaux</option>
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none">
              <option value="">Tous les formats</option>
              {formats.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <p className="text-sm text-muted-foreground mb-6">{filtered.length} formation(s) trouvée(s)</p>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card border border-border rounded-xl p-5 hover-lift flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColors[f.level]}`}>{f.level}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Monitor size={12} />{f.format}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12} />{f.duration}</span>
                </div>
                <h3 className="font-heading font-semibold text-sm mb-3 text-card-foreground flex-1">{f.title}</h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {f.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-semibold text-sm text-card-foreground">{f.price}</span>
                  <span className="text-xs font-semibold text-primary cursor-pointer">Voir détails →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CataloguePage;
