import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logoTransferAI from "@/assets/logo-academie-ia-afrique.png";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Certification", href: "/certification" },
  { label: "Entreprises", href: "/entreprises" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Événements", href: "/evenements" },
  { label: "Blog", href: "/blog" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b" style={{ background: "hsl(225 55% 10% / 0.92)", borderColor: "hsl(30 90% 50% / 0.15)" }}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoTransferAI} alt="TransferAI Africa" className="h-10 w-10 rounded-lg object-contain" />
          <span className="font-heading font-semibold tracking-tight" style={{ color: "hsl(0 0% 96%)" }}>
            Transfer<span className="text-gradient-orange">AI</span> Africa
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-sm transition-colors font-medium ${
                location.pathname === link.href ? "text-primary" : ""
              }`}
              style={location.pathname !== link.href ? { color: "hsl(210 20% 72%)" } : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          to="/contact"
          className="hidden lg:inline-flex bg-orange-gradient font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          style={{ color: "hsl(0 0% 100%)" }}
        >
          Demander un devis
        </Link>

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden" style={{ color: "hsl(0 0% 96%)" }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t"
            style={{ background: "hsl(225 55% 10%)", borderColor: "hsl(30 90% 50% / 0.1)" }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm py-2 font-medium ${
                    location.pathname === link.href ? "text-primary" : ""
                  }`}
                  style={location.pathname !== link.href ? { color: "hsl(210 20% 72%)" } : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="bg-orange-gradient font-semibold text-sm px-5 py-2.5 rounded-lg text-center mt-2"
                style={{ color: "hsl(0 0% 100%)" }}
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
