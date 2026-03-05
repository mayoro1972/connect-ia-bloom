import { Link } from "react-router-dom";
import logoTransferAI from "@/assets/logo-academie-ia-afrique.png";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-12 border-t" style={{ background: "hsl(225 55% 10%)", borderColor: "hsl(0 0% 100% / 0.08)" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logoTransferAI} alt="TransferAI Africa" className="h-9 w-9 rounded-lg object-contain" />
              <span className="font-heading font-semibold" style={{ color: "hsl(0 0% 92%)" }}>
                TransferAI Africa
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(210 20% 55%)" }}>
              {t("footer.desc")}
            </p>
          </div>
          {[
            {
              title: t("footer.formations"),
              links: [
                { label: t("footer.catalogue"), to: "/catalogue" },
                { label: t("footer.certification"), to: "/certification" },
                { label: t("footer.enterprises"), to: "/entreprises" },
                { label: t("footer.partners"), to: "/partenaires" },
              ],
            },
            {
              title: t("footer.resources"),
              links: [
                { label: t("footer.blog"), to: "/blog" },
                { label: t("footer.events"), to: "/evenements" },
                { label: t("footer.about"), to: "/a-propos" },
              ],
            },
            {
              title: t("footer.contact"),
              links: [
                { label: t("footer.requestQuote"), to: "/contact" },
                { label: t("footer.support"), to: "/contact" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-heading font-semibold text-sm mb-4 text-primary">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm hover:text-primary transition-colors" style={{ color: "hsl(210 20% 55%)" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t pt-8" style={{ borderColor: "hsl(0 0% 100% / 0.08)" }}>
          <p className="text-center text-xs" style={{ color: "hsl(210 20% 45%)" }}>
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
