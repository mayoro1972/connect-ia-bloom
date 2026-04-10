import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import BlogPage from "@/pages/Blog";
import { LanguageProvider } from "@/i18n/LanguageContext";

vi.mock("@/integrations/supabase/client", () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            order: vi.fn().mockResolvedValue({
              data: [
                {
                  id: "ea8606ef-9b5d-46c6-a824-532e4cdb61bc",
                  slug: "veille-it-transformation-digitale-afrique-cote-divoire-avril-2026",
                  category_key: "veille",
                  sector_key: "IT & Transformation Digitale",
                  title_fr: "Veille IT & Transformation Digitale : 6 signaux IA a suivre en Afrique, avec un focus Cote d'Ivoire",
                  title_en: "IT & Digital Transformation Watch: 6 AI signals to track across Africa, with a focus on Cote d'Ivoire",
                  excerpt_fr:
                    "Au 9 avril 2026, les signaux les plus utiles pour l'Afrique et la Cote d'Ivoire convergent autour de quatre leviers cles.",
                  excerpt_en:
                    "As of April 9, 2026, the most relevant AI signals for Africa and Cote d'Ivoire converge around four key levers.",
                  read_time_minutes: 6,
                  published_at: "2026-04-09T09:00:00.000Z",
                  source_name: "TransferAI Africa · veille editoriale multi-sources",
                  source_url: null,
                  tags: ["veille", "afrique", "cote-divoire", "it"],
                  is_featured: true,
                  is_new_manual: true,
                },
              ],
              error: null,
            }),
          }),
        }),
      }),
    }),
  },
}));

describe("blog page", () => {
  it("renders the dynamic watch item without crashing", async () => {
    window.localStorage.setItem("transferai-language", "fr");

    render(
      <LanguageProvider>
        <MemoryRouter>
          <BlogPage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(screen.getByRole("heading", { name: /blog & ressources/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /veille it & transformation digitale : 6 signaux ia/i,
        }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/veille dynamique/i)).toBeInTheDocument();
    expect(screen.getByText(/transferai africa · veille editoriale multi-sources/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /recevoir la veille ia afrique/i })).toBeInTheDocument();
  });
});
