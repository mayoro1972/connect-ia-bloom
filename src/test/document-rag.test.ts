import { describe, expect, it } from "vitest";
import { buildRagContext, normalizeRetrievedDocuments } from "../../supabase/functions/_shared/document-rag";

describe("document-rag helpers", () => {
  it("normalizes array and wrapped payload shapes", () => {
    const direct = normalizeRetrievedDocuments([
      { id: 1, titre: "Guide A", contenu: "Contenu A", similarity: 0.91, url: "https://example.com/a" },
    ]);
    const wrapped = normalizeRetrievedDocuments({
      body: [
        { id: 2, title: "Guide B", content: "Contenu B", score: 0.42 },
      ],
    });

    expect(direct).toHaveLength(1);
    expect(direct[0].titre).toBe("Guide A");
    expect(direct[0].similarity).toBeCloseTo(0.91);

    expect(wrapped).toHaveLength(1);
    expect(wrapped[0].titre).toBe("Guide B");
    expect(wrapped[0].contenu).toBe("Contenu B");
    expect(wrapped[0].similarity).toBeCloseTo(0.42);
  });

  it("deduplicates documents and truncates the context", () => {
    const longText = "A".repeat(1200);
    const context = buildRagContext(
      [
        {
          id: 1,
          titre: "Source 1",
          contenu: longText,
          similarity: 0.9,
          url: "https://example.com/1",
          source_id: "doc-1",
          chunk_index: 0,
          modified_at: null,
        },
        {
          id: 2,
          titre: "Source 1 duplicate",
          contenu: "Doublon",
          similarity: 0.89,
          url: "https://example.com/1",
          source_id: "doc-1",
          chunk_index: 0,
          modified_at: null,
        },
      ],
      { maxDocuments: 6, maxCharsPerDocument: 120 },
    );

    expect(context.nb_sources).toBe(1);
    expect(context.sources[0].titre).toBe("Source 1");
    expect(context.contexte).toContain("[Document 1]");
    expect(context.contexte).toContain("similarite: 90%");
    expect(context.contexte.endsWith("…")).toBe(true);
  });
});
