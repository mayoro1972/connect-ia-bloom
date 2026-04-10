import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import BlogDomainPage from "@/pages/BlogDomainPage";
import { LanguageProvider } from "@/i18n/LanguageContext";

vi.mock("@/hooks/useResourceFeed", () => ({
  useResourceFeed: () => ({
    items: [
      {
        id: "finance-1",
        slug: "veille-finance-fintech-afrique-ouest",
        categoryKey: "veille",
        sectorKey: "Finance & Fintech",
        titleFr: "Veille Finance & Fintech : 5 signaux IA",
        titleEn: "Finance & Fintech Watch: 5 AI signals",
        excerptFr: "Resume finance",
        excerptEn: "Finance summary",
        readTimeMinutes: 5,
        publishedAt: "2026-04-09T09:00:00.000Z",
        sourceName: "TransferAI Africa",
        sourceUrl: null,
        tags: ["finance"],
        isFeatured: true,
        isNewManual: true,
      },
      {
        id: "rh-1",
        slug: "veille-rh-talents-cote-divoire",
        categoryKey: "veille",
        sectorKey: "RH & Gestion des talents",
        titleFr: "Veille RH & Talents",
        titleEn: "HR & Talent Watch",
        excerptFr: "Resume RH",
        excerptEn: "HR summary",
        readTimeMinutes: 5,
        publishedAt: "2026-04-08T09:00:00.000Z",
        sourceName: "TransferAI Africa",
        sourceUrl: null,
        tags: ["rh"],
        isFeatured: false,
        isNewManual: false,
      },
    ],
    isLoading: false,
    hasDynamicSource: true,
  }),
}));

describe("blog domain page", () => {
  it("renders the filtered domain hub and related CTA", () => {
    window.localStorage.setItem("transferai-language", "fr");

    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/blog/domaine/finance-fintech"]}>
          <Routes>
            <Route path="/blog/domaine/:domainSlug" element={<BlogDomainPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(screen.getByRole("heading", { name: /^veille ia pour finance & fintech$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explorer le catalogue/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /veille finance & fintech : 5 signaux ia/i })).toBeInTheDocument();
    expect(screen.queryByText(/veille rh & talents/i)).not.toBeInTheDocument();
  });
});
