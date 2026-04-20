import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Contact from "./Contact";

const ParlerEmploiPage = () => {
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
    if (next.get("flow") !== "emploi") {
      next.set("flow", "emploi");
      mutated = true;
    }
    if (!next.get("domain")) {
      next.set("domain", "Emploi IA & mise en relation");
      mutated = true;
    }

    if (mutated) {
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return <Contact />;
};

export default ParlerEmploiPage;
