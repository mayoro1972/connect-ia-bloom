import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Contact from "./Contact";

/**
 * Page dédiée à la demande de catalogue de domaine.
 * Réutilise la page Contact en forçant l'intent et en activant le mode compact
 * (masque la section "Parler à la bonne porte d'entrée" + colonne contacts directs).
 */
const DemandeCataloguePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    let mutated = false;
    if (next.get("intent") !== "demande-catalogue") {
      next.set("intent", "demande-catalogue");
      mutated = true;
    }
    if (next.get("compact") !== "1") {
      next.set("compact", "1");
      mutated = true;
    }
    if (mutated) {
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return <Contact />;
};

export default DemandeCataloguePage;
