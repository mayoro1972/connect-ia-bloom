import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/i18n/LanguageContext";

const renderFooter = () =>
  render(
    <LanguageProvider>
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    </LanguageProvider>,
  );

describe("footer links", () => {
  it("points key French footer links to the expected destinations", () => {
    window.localStorage.setItem("transferai-language", "fr");

    renderFooter();

    expect(screen.getByRole("link", { name: "À propos" })).toHaveAttribute("href", "/a-propos");
    expect(screen.getByRole("link", { name: "Partenaires" })).toHaveAttribute("href", "/partenaires");
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "Événements" })).toHaveAttribute("href", "/evenements");
    expect(screen.getByRole("link", { name: "Hub formation" })).toHaveAttribute("href", "/education");
    expect(screen.getByRole("link", { name: "Catalogue complet" })).toHaveAttribute("href", "/catalogue");
    expect(screen.getByRole("link", { name: "Parcours guidés" })).toHaveAttribute("href", "/parcours");
    expect(screen.getByRole("link", { name: "Certification professionnelle" })).toHaveAttribute("href", "/certification");
    expect(screen.getByRole("link", { name: "Séminaires & formats live" })).toHaveAttribute("href", "/seminaires");
    expect(screen.getByRole("link", { name: "Webinaires gratuits" })).toHaveAttribute("href", "/webinaires-gratuits");
    expect(screen.getByRole("link", { name: "Entreprises" })).toHaveAttribute("href", "/entreprises");
    expect(screen.getByRole("link", { name: "Conseil & adoption" })).toHaveAttribute("href", "/consulting-ia");
    expect(screen.getByRole("link", { name: "Automatisation & solutions" })).toHaveAttribute("href", "/developpement-solutions-ia");
    expect(screen.getByRole("link", { name: "Média IA & opportunités" })).toHaveAttribute("href", "/createur-contenu-ia");
    expect(screen.getByRole("link", { name: "Audit IA gratuit" })).toHaveAttribute("href", "/audit-ia-gratuit");
    expect(screen.getByRole("link", { name: "Politique de confidentialité" })).toHaveAttribute("href", "/confidentialite");
    expect(screen.getByRole("link", { name: "Plan du site" })).toHaveAttribute("href", "/plan-du-site");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });
});
