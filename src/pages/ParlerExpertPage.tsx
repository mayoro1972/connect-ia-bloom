import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Contact from "./Contact";

/**
 * Page dédiée "Parler à un expert IA" / demande de cadrage.
 * Réutilise la page Contact en forçant l'intent "demande-renseignement"
 * et le mode compact (masque la section "Parler à la bonne porte d'entrée"
 * + colonne contacts directs).
 */
const ParlerExpertPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    let mutated = false;
    if (next.get("intent") !== "demande-renseignement") {
      next.set("intent", "demande-renseignement");
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

export default ParlerExpertPage;
