import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";

const ContactPage = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const trans = language === "fr" ? fr : en;
  const sectors = trans.contact.sectors;

  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", sector: "", city: "",
    participants: "", formations: "", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t("contact.toastTitle"), description: t("contact.toastDesc") });
    setForm({ name: "", email: "", phone: "", company: "", sector: "", city: "", participants: "", formations: "", message: "" });
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <PageTransition><div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedLogoWatermarks />
      <Navbar />
      <PageHeader title={t("contact.title")} subtitle={t("contact.subtitle")} />

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-2xl font-bold mb-6">{t("contact.formTitle")}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input placeholder={t("contact.name")} required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
                  <input placeholder={t("contact.email")} type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input placeholder={t("contact.phone")} required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
                  <input placeholder={t("contact.company")} required value={form.company} onChange={(e) => update("company", e.target.value)} className={inputClass} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <select value={form.sector} onChange={(e) => update("sector", e.target.value)} className={inputClass}>
                    <option value="">{t("contact.sector")}</option>
                    {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input placeholder={t("contact.city")} value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input placeholder={t("contact.participants")} value={form.participants} onChange={(e) => update("participants", e.target.value)} className={inputClass} />
                  <input placeholder={t("contact.formations")} value={form.formations} onChange={(e) => update("formations", e.target.value)} className={inputClass} />
                </div>
                <textarea placeholder={t("contact.message")} rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} className={inputClass + " resize-none"} />
                <button type="submit" className="bg-coral-gradient font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity" style={{ color: "hsl(0 0% 100%)" }}>
                  {t("contact.submit")}
                </button>
              </form>
            </div>

            <div className="space-y-5">
              <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-heading font-semibold mb-4">{t("contact.coordTitle")}</h3>
                <div className="space-y-3 text-sm">
                  <a href="tel:+2250700000000" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"><Phone size={16} /> +225 07 00 00 00 00</a>
                  <a href="mailto:contact@academie-ia-afrique.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"><Mail size={16} /> contact@academie-ia-afrique.com</a>
                  <div className="flex items-center gap-3 text-muted-foreground"><MapPin size={16} /> Abidjan, Plateau, Côte d'Ivoire</div>
                </div>
              </motion.div>

              <motion.a href="https://wa.me/2250700000000" target="_blank" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 hover-lift block">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"><MessageCircle size={20} className="text-primary" /></div>
                <div>
                  <p className="font-semibold text-sm text-card-foreground">{t("contact.whatsapp")}</p>
                  <p className="text-xs text-muted-foreground">{t("contact.whatsappDesc")}</p>
                </div>
              </motion.a>

              <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-heading font-semibold mb-2 flex items-center gap-2"><Calendar size={18} /> {t("contact.appointmentTitle")}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t("contact.appointmentDesc")}</p>
                <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="w-full bg-teal-gradient font-semibold py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity block text-center" style={{ color: "hsl(0 0% 100%)" }}>
                  {t("contact.appointmentCta")}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div></PageTransition>
  );
};

export default ContactPage;
