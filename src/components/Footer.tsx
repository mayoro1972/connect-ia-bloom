import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import logoTransferAI from "@/assets/logo-transferai-nettelecom.png";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildContactPath, contactDetails, directLinks, socialLinks } from "@/lib/site-links";

const Footer = () => {
  const { language, t } = useLanguage();

  const copy =
    language === "fr"
      ? {
          company: "TransferAI",
          companyLinks: [
            { label: "A propos", to: "/a-propos" },
            { label: "Partenaires", to: "/partenaires" },
            { label: "Blog", to: "/blog" },
            { label: "Evenements", to: "/evenements" },
          ],
          product: "Formations",
          productLinks: [
            { label: "Vue d'ensemble", to: "/education" },
            { label: "Catalogue complet", to: "/catalogue" },
            { label: "Parcours guides", to: "/parcours" },
            { label: "Certification signature", to: "/certification" },
            { label: "Formats live", to: "/seminaires" },
          ],
          resources: "Services",
          resourceLinks: [
            { label: "Vue d'ensemble", to: "/services" },
            { label: "Audit IA gratuit", to: "/audit-ia-gratuit" },
            { label: "Conseil & adoption", to: "/consulting-ia" },
            { label: "Automatisation & solutions", to: "/developpement-solutions-ia" },
            { label: "Media, veille & emploi", to: "/createur-contenu-ia" },
            { label: "Demander un devis", to: buildContactPath("contact-devis") },
          ],
          legal: "Juridique",
          legalLinks: [
            { label: "Politique de confidentialite", to: "/confidentialite" },
            { label: "Contact", to: "/contact" },
            { label: "Email", href: directLinks.email },
            { label: "WhatsApp", href: directLinks.whatsapp },
            { label: "Google Maps", href: directLinks.map },
          ],
          community: "Communaute",
          contactTitle: "Coordonnees",
          rights: t("footer.rights"),
        }
      : {
          company: "TransferAI",
          companyLinks: [
            { label: "About", to: "/a-propos" },
            { label: "Partners", to: "/partenaires" },
            { label: "Blog", to: "/blog" },
            { label: "Events", to: "/evenements" },
          ],
          product: "Training",
          productLinks: [
            { label: "Overview", to: "/education" },
            { label: "Full catalogue", to: "/catalogue" },
            { label: "Guided paths", to: "/parcours" },
            { label: "Signature certification", to: "/certification" },
            { label: "Live formats", to: "/seminaires" },
          ],
          resources: "Services",
          resourceLinks: [
            { label: "Overview", to: "/services" },
            { label: "Free AI audit", to: "/audit-ia-gratuit" },
            { label: "Advisory & adoption", to: "/consulting-ia" },
            { label: "Automation & solutions", to: "/developpement-solutions-ia" },
            { label: "Media, watch & jobs", to: "/createur-contenu-ia" },
            { label: "Request a quote", to: buildContactPath("contact-devis") },
          ],
          legal: "Legal",
          legalLinks: [
            { label: "Privacy policy", to: "/confidentialite" },
            { label: "Contact", to: "/contact" },
            { label: "Email", href: directLinks.email },
            { label: "WhatsApp", href: directLinks.whatsapp },
            { label: "Google Maps", href: directLinks.map },
          ],
          community: "Community",
          contactTitle: "Contact details",
          rights: t("footer.rights"),
        };

  const footerColumns = [
    { title: copy.company, links: copy.companyLinks },
    { title: copy.product, links: copy.productLinks },
    { title: copy.resources, links: copy.resourceLinks },
    { title: copy.legal, links: copy.legalLinks },
    {
      title: copy.community,
      links: socialLinks
        .filter((item) => item.label !== "WhatsApp")
        .map((item) => ({
        label: item.label,
        href: item.href,
      })),
    },
  ];

  return (
    <footer className="border-t border-stone-200 bg-[#f7f2ea] py-16 text-slate-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-10 border-b border-stone-200 pb-12 lg:grid-cols-[1.35fr_2.65fr] xl:grid-cols-[1.45fr_2.55fr]">
          <div className="max-w-[30rem]">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoTransferAI}
                alt="TransferAI Africa"
                className="h-10 w-auto max-w-[142px] object-contain mix-blend-multiply"
              />
              <span className="font-heading text-lg font-semibold tracking-[-0.03em] text-slate-950">
                Transfer<span className="text-[hsl(20_92%_52%)]">AI</span> Africa
              </span>
            </Link>

            <p className="mt-5 max-w-[28rem] text-sm leading-7 text-slate-600">{t("footer.desc")}</p>

            <div className="mt-8 max-w-[29rem] space-y-3 text-sm text-slate-700">
              <a href={directLinks.phone} className="flex items-start gap-2.5 transition-colors hover:text-[hsl(20_92%_42%)]">
                <Phone size={16} className="mt-0.5 shrink-0 text-[hsl(20_92%_52%)]" />
                {contactDetails.phoneDisplay}
              </a>
              <a
                href={directLinks.email}
                className="flex items-start gap-2.5 transition-colors hover:text-[hsl(20_92%_42%)] hover:underline hover:underline-offset-4"
              >
                <Mail size={16} className="mt-0.5 shrink-0 text-[hsl(20_92%_52%)]" />
                {contactDetails.email}
              </a>
              <a
                href={directLinks.map}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 leading-6 transition-colors hover:text-[hsl(20_92%_42%)]"
              >
                <MapPin size={16} className="mt-0.5 shrink-0 text-[hsl(20_92%_52%)]" />
                {contactDetails.addressShort}
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="font-heading text-[15px] font-semibold tracking-[-0.01em] text-slate-950">{column.title}</h4>
                <ul className="mt-5 space-y-3.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {"to" in link ? (
                        <Link to={link.to} className="text-[15px] leading-6 text-slate-700 transition-colors hover:text-[hsl(20_92%_42%)]">
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[15px] leading-6 text-slate-700 transition-colors hover:text-[hsl(20_92%_42%)]"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between">
          <p>{copy.rights}</p>
          <p>{copy.contactTitle}: {contactDetails.addressShort}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
