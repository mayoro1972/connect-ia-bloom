import { useState } from "react";
import { X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

interface CatalogueDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CatalogueDownloadModal = ({ isOpen, onClose }: CatalogueDownloadModalProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: "", company: "", name: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t("download.toastTitle"), description: t("download.toastDesc") });
    setForm({ email: "", company: "", name: "" });
    onClose();
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "hsl(0 0% 0% / 0.6)" }} onClick={onClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-xl p-8 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-card-foreground transition-colors">
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Download size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-card-foreground">{t("download.title")}</h3>
                <p className="text-xs text-muted-foreground">{t("download.subtitle")}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder={t("download.name")} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              <input placeholder={t("download.email")} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
              <input placeholder={t("download.company")} required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass} />
              <button type="submit" className="bg-orange-gradient font-semibold text-sm px-5 py-3 rounded-lg hover:opacity-90 transition-opacity w-full flex items-center justify-center gap-2" style={{ color: "hsl(0 0% 100%)" }}>
                <Download size={16} /> {t("download.cta")}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CatalogueDownloadModal;
