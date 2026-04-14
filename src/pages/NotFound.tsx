import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  const copy =
    language === "fr"
      ? {
          title: "Oups ! Page introuvable",
          cta: "Retour à l'accueil",
        }
      : {
          title: "Oops! Page not found",
          cta: "Return to Home",
        };

  useEffect(() => {
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{copy.title}</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          {copy.cta}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
