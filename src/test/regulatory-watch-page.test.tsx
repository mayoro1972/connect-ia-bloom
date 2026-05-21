import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import VeilleReglementaireIAPage from "@/pages/VeilleReglementaireIA";
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
                  id: "1",
                  slug: "veille-bceao-gouvernance-ia",
                  category_key: "veille",
                  sector_key: "Finance & Fintech",
                  title_fr: "Veille BCEAO : gouvernance IA et exigences de conformité bancaire",
                  title_en: "BCEAO watch: AI governance and banking compliance requirements",
                  excerpt_fr: "Un signal utile pour les banques ivoiriennes qui structurent leurs usages IA.",
                  excerpt_en: "A useful signal for Ivorian banks structuring their AI usage.",
                  read_time_minutes: 5,
                  published_at: "2026-05-08T09:00:00.000Z",
                  source_name: "BCEAO",
                  source_url: "https://example.com/bceao",
                  tags: ["veille", "bceao", "compliance", "banque"],
                  is_featured: true,
                  is_new_manual: true,
                },
                {
                  id: "2",
                  slug: "veille-marketing-reels",
                  category_key: "veille",
                  sector_key: "Marketing & Communication IA",
                  title_fr: "Veille marketing : nouvelles tendances Reels",
                  title_en: "Marketing watch: new Reels trends",
                  excerpt_fr: "Un contenu media qui ne doit pas remonter dans la veille réglementaire.",
                  excerpt_en: "A media item that should not appear in the regulatory watch.",
                  read_time_minutes: 4,
                  published_at: "2026-05-07T09:00:00.000Z",
                  source_name: "Media Lab",
                  source_url: "https://example.com/reels",
                  tags: ["veille", "social-media"],
                  is_featured: false,
                  is_new_manual: true,
                },
              ],
              error: null,
            }),
          }),
        }),
      }),
    }),
    channel: () => ({
      on: () => ({
        subscribe: () => ({ unsubscribe: vi.fn() }),
      }),
    }),
    removeChannel: vi.fn(),
  },
}));

describe("regulatory watch page", () => {
  it("shows only banking and regulatory watch items", async () => {
    window.localStorage.setItem("transferai-language", "fr");

    render(
      <LanguageProvider>
        <MemoryRouter>
          <VeilleReglementaireIAPage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(
      screen.getByRole("heading", { name: /veille réglementaire ia pour la banque en côte d'ivoire/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /veille bceao : gouvernance ia et exigences de conformité bancaire/i }),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(/nouvelles tendances reels/i)).not.toBeInTheDocument();
    expect(screen.getByText(/flux dynamique connecté/i)).toBeInTheDocument();
  });
});
