import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import BlogArticlePage from "@/pages/BlogArticle";
import { LanguageProvider } from "@/i18n/LanguageContext";

vi.mock("@/hooks/useResourcePost", () => ({
  useResourcePost: () => ({
    item: {
      id: "ea8606ef-9b5d-46c6-a824-532e4cdb61bc",
      slug: "veille-it-transformation-digitale-afrique-cote-divoire-avril-2026",
      categoryKey: "veille",
      sectorKey: "IT & Transformation Digitale",
      titleFr: "Veille IT & Transformation Digitale : 6 signaux IA a suivre en Afrique, avec un focus Cote d'Ivoire",
      titleEn: "IT & Digital Transformation Watch: 6 AI signals to track across Africa, with a focus on Cote d'Ivoire",
      excerptFr: "Resume FR",
      excerptEn: "EN summary",
      contentFr: "Pourquoi cette veille maintenant\n\nLe contenu complet s'affiche correctement.",
      contentEn: "Why this watch matters now\n\nFull content renders correctly.",
      readTimeMinutes: 6,
      publishedAt: "2026-04-09T09:00:00.000Z",
      sourceName: "TransferAI Africa",
      sourceUrl: "https://www.transferai.ci/blog",
      tags: ["veille", "afrique"],
      isFeatured: true,
      isNewManual: true,
      sources: [{ label: "OpenAI", url: "https://openai.com", publisher: "OpenAI", publishedAt: "2026-04-08" }],
      seoTitleFr: null,
      seoTitleEn: null,
      seoDescriptionFr: null,
      seoDescriptionEn: null,
      coverImageUrl: null,
    },
    isLoading: false,
    notFound: false,
  }),
}));

vi.mock("@/hooks/useResourceFeed", () => ({
  useResourceFeed: () => ({
    items: [
      {
        id: "related-1",
        slug: "related-article",
        categoryKey: "veille",
        sectorKey: "IT & Transformation Digitale",
        titleFr: "Autre veille IT",
        titleEn: "Other IT watch",
        excerptFr: "Extrait",
        excerptEn: "Excerpt",
        readTimeMinutes: 5,
        publishedAt: "2026-04-08T09:00:00.000Z",
        sourceName: "TransferAI Africa",
        sourceUrl: null,
        tags: [],
        isFeatured: false,
        isNewManual: false,
      },
    ],
    isLoading: false,
    hasDynamicSource: true,
  }),
}));

describe("blog article page", () => {
  it("renders the article body, sources and CTA", () => {
    window.localStorage.setItem("transferai-language", "fr");

    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/blog/veille-it-transformation-digitale-afrique-cote-divoire-avril-2026"]}>
          <Routes>
            <Route path="/blog/:slug" element={<BlogArticlePage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(screen.getByRole("heading", { name: /veille it & transformation digitale/i })).toBeInTheDocument();
    expect(screen.getByText(/le contenu complet s'affiche correctement/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /sources & références/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /découvrir les formations liées/i })).toBeInTheDocument();
  });
});
