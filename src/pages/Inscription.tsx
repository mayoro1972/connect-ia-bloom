import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import { formations } from "@/data/formations";
import { useLanguage } from "@/i18n/LanguageContext";
import { useFormationLocale } from "@/hooks/useFormationLocale";

const InscriptionPage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { getTitle } = useFormationLocale();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("formation") || "";

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", company: "",
    position: "", formation: preselected, participants: "1", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t("inscription.toastTitle"), description: t("inscription.toastDesc") });
    setForm({ firstName: "", lastName: "", email: "", phone: "", company: "", position: "", formation: "", participants: "1", message: "" });
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageHeader title={t("inscription.title")} subtitle={t("inscription.subtitle")} />

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.firstName")}</label>
                  <input required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.lastName")}</label>
                  <input required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.email")}</label>
                  <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.phone")}</label>
                  <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.company")}</label>
                  <input required value={form.company} onChange={(e) => update("company", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.position")}</label>
                  <input value={form.position} onChange={(e) => update("position", e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.formation")}</label>
                <select required value={form.formation} onChange={(e) => update("formation", e.target.value)} className={inputClass}>
                  <option value="">{t("inscription.selectFormation")}</option>
                  {formations.map((f) => <option key={f.id} value={f.title}>{getTitle(f)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.participants")}</label>
                <input type="number" min="1" value={form.participants} onChange={(e) => update("participants", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.message")}</label>
                <textarea rows={3} value={form.message} onChange={(e) => update("message", e.target.value)} className={inputClass + " resize-none"} />
              </div>
              <button type="submit" className="bg-orange-gradient font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity w-full" style={{ color: "hsl(0 0% 100%)" }}>
                {t("inscription.submit")}
              </button>
            </form>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default InscriptionPage;
