import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Certification", href: "/certification" },
  { label: "Entreprises", href: "/entreprises" },
  { label: "Événements", href: "/evenements" },
  { label: "Blog", href: "/blog" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-deep/90 backdrop-blur-lg border-b border-gold/10">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gold-gradient font-heading font-bold text-navy-deep text-sm">
            IA
          </span>
          <span className="font-heading font-semibold text-card tracking-tight">
            Académie IA <span className="text-gradient-gold">Afrique</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-sm transition-colors font-medium ${
                location.pathname === link.href ? "text-gold" : ""
              }`}
              style={location.pathname !== link.href ? { color: "hsl(220 20% 70%)" } : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          to="/contact"
          className="hidden lg:inline-flex bg-gold-gradient font-semibold text-sm px-5 py-2.5 rounded-lg text-navy-deep hover:opacity-90 transition-opacity"
        >
          Demander un devis
        </Link>

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-card">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy-deep border-t border-gold/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm py-2 font-medium ${
                    location.pathname === link.href ? "text-gold" : ""
                  }`}
                  style={location.pathname !== link.href ? { color: "hsl(220 20% 70%)" } : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="bg-gold-gradient font-semibold text-sm px-5 py-2.5 rounded-lg text-navy-deep text-center mt-2"
              >
                Demander un devis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
