const Footer = () => {
  return (
    <footer className="bg-navy-deep py-12 border-t" style={{ borderColor: "hsl(0 0% 100% / 0.08)" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-gradient font-heading font-bold text-navy-deep text-xs">
                IA
              </span>
              <span className="font-heading font-semibold" style={{ color: "hsl(0 0% 90%)" }}>
                Académie IA Afrique
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(220 20% 55%)" }}>
              La référence en formation professionnelle IA en Afrique.
            </p>
          </div>
          {[
            {
              title: "Formations",
              links: ["Catalogue", "Certification", "Métiers", "Formats"],
            },
            {
              title: "Entreprise",
              links: ["À propos", "Blog", "Événements", "Partenaires"],
            },
            {
              title: "Contact",
              links: ["Demander un devis", "Support", "FAQ"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-heading font-semibold text-sm mb-4 text-gold">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-gold transition-colors" style={{ color: "hsl(220 20% 55%)" }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t pt-8" style={{ borderColor: "hsl(0 0% 100% / 0.08)" }}>
          <p className="text-center text-xs" style={{ color: "hsl(220 20% 45%)" }}>
            © 2026 Académie IA Afrique. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
