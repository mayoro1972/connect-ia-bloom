import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { LanguageProvider } from "@/i18n/LanguageContext";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: vi.fn().mockResolvedValue({
      data: [{ total_views: 88 }],
      error: null,
    }),
  },
}));

describe("homepage language switch", () => {
  it("renders French by default and switches to English on click", async () => {
    window.localStorage.setItem("transferai-language", "fr");

    render(
      <LanguageProvider>
        <MemoryRouter>
          <Navbar />
          <HeroSection />
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(screen.getByText("ACCUEIL")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Devenez le partenaire stratégique/i })).toBeInTheDocument();
    expect(screen.getByText("Télécharger le catalogue")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    await waitFor(() => {
      expect(screen.getByText("HOME")).toBeInTheDocument();
    });

    expect(screen.getByRole("heading", { name: /Become the strategic/i })).toBeInTheDocument();
    expect(screen.getByText("Download the catalogue")).toBeInTheDocument();
  });
});
