import { Link } from "react-router-dom";
import { Linkedin, Facebook, Instagram, Youtube, Twitter, MessageCircle, Send, Music2, AtSign } from "lucide-react";
import logoTransferAI from "@/assets/logo-transferai-nettelecom.png";
import { useLanguage } from "@/i18n/LanguageContext";

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/transferai-africa", label: "LinkedIn", color: "hover:text-[#0A66C2]" },
  { icon: Facebook, href: "https://www.facebook.com/transferai.africa", label: "Facebook", color: "hover:text-[#1877F2]" },
  { icon: Instagram, href: "https://www.instagram.com/transferai.africa", label: "Instagram", color: "hover:text-[#E4405F]" },
  { icon: Youtube, href: "https://www.youtube.com/@transferai-africa", label: "YouTube", color: "hover:text-[#FF0000]" },
  { icon: Twitter, href: "https://x.com/transferai_afr", label: "X (Twitter)", color: "hover:text-[#1DA1F2]" },
  { icon: Music2, href: "https://www.tiktok.com/@transferai.africa", label: "TikTok", color: "hover:text-[#ff0050]" },
  { icon: AtSign, href: "https://www.threads.net/@transferai.africa", label: "Threads", color: "hover:text-[#000000] dark:hover:text-white" },
  { icon: Send, href: "https://t.me/transferaiafrica", label: "Telegram", color: "hover:text-[#26A5E4]" },
  { icon: MessageCircle, href: "https://wa.me/2250700000000", label: "WhatsApp", color: "hover:text-[#25D366]" },
];

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-12 border-t" style={{ background: "hsl(225 55% 10%)", borderColor: "hsl(0 0% 100% / 0.08)" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logoTransferAI} alt="TransferAI Africa" className="h-9 w-9 rounded-lg object-contain" />
              <span className="font-heading font-semibold" style={{ color: "hsl(0 0% 92%)" }}>
                TransferAI Africa
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "hsl(210 20% 55%)" }}>
              {t("footer.desc")}
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${social.color}`} style={{ background: "hsl(0 0% 100% / 0.06)", color: "hsl(210 20% 55%)" }}>
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
          {[
            {
              title: t("footer.educationIA"),
              links: [
                { label: t("footer.catalogue"), to: "/catalogue" },
                { label: t("footer.certification"), to: "/certification" },
                { label: t("footer.seminaires"), to: "/seminaires" },
                { label: t("footer.webinars"), to: "/webinars" },
                { label: t("footer.enterprises"), to: "/entreprises" },
              ],
            },
            {
              title: t("footer.services"),
              links: [
                { label: t("footer.contenuIA"), to: "/createur-contenu-ia" },
                { label: t("footer.consultingIA"), to: "/consulting-ia" },
                { label: t("footer.devSolutionsIA"), to: "/developpement-solutions-ia" },
              ],
            },
            {
              title: t("footer.resources"),
              links: [
                { label: t("footer.events"), to: "/evenements" },
                { label: t("footer.blog"), to: "/blog" },
                { label: t("footer.partners"), to: "/partenaires" },
                { label: t("footer.about"), to: "/a-propos" },
                { label: t("footer.requestQuote"), to: "/contact" },
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
