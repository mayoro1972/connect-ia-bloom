import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 border-t" style={{ background: "hsl(225 55% 10%)", borderColor: "hsl(0 0% 100% / 0.08)" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-gradient font-heading font-bold text-xs" style={{ color: "hsl(0 0% 100%)" }}>
                IA
              </span>
              <span className="font-heading font-semibold" style={{ color: "hsl(0 0% 92%)" }}>
                Académie IA Afrique
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(210 20% 55%)" }}>
              La référence en formation professionnelle IA en Afrique.
            </p>
          </div>
          {[
            {
              title: "Formations",
              links: [
                { label: "Catalogue", to: "/catalogue" },
                { label: "Certification", to: "/certification" },
                { label: "Entreprises", to: "/entreprises" },
                { label: "Partenaires", to: "/partenaires" },
              ],
            },
            {
              title: "Ressources",
              links: [
                { label: "Blog", to: "/blog" },
                { label: "Événements", to: "/evenements" },
                { label: "À propos", to: "/a-propos" },
              ],
            },
            {
              title: "Contact",
              links: [
                { label: "Demander un devis", to: "/contact" },
                { label: "Support", to: "/contact" },
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
            © 2026 Académie IA Afrique. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
