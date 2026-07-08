import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const loadWorkflow = (relativePath: string) =>
  JSON.parse(readFileSync(resolve(process.cwd(), relativePath), "utf8")) as {
    nodes: Array<{ name: string; parameters: Record<string, unknown> }>;
  };

const byName = (workflow: ReturnType<typeof loadWorkflow>) =>
  Object.fromEntries(workflow.nodes.map((node) => [node.name, node]));

describe("Recherche_Documentaire_RAG workflow export", () => {
  it("uses portable raw JSON requests for OpenAI and Supabase", () => {
    const workflow = byName(
      loadWorkflow("docs/transferai-admin/124_n8n_Demo_Recherche_Documentaire_RAG_Formation_01juillet2026.json"),
    );

    const embeddingNode = workflow["Créer embedding question"];
    const matchNode = workflow["Recherche Supabase Vector"];
    const answerNode = workflow["Réponse IA avec sources"];
    const logNode = workflow["Journaliser dans Supabase"];

    expect(embeddingNode.parameters.authentication).toBeUndefined();
    expect(embeddingNode.parameters.contentType).toBe("raw");
    expect(embeddingNode.parameters.rawContentType).toBe("application/json");
    expect(String(embeddingNode.parameters.body)).toContain("JSON.stringify");
    expect(String(embeddingNode.parameters.body)).toContain("text-embedding-3-small");

    expect(matchNode.parameters.authentication).toBeUndefined();
    expect(matchNode.parameters.contentType).toBe("raw");
    expect(String(matchNode.parameters.url)).toContain("SUPABASE_URL");
    expect(String(matchNode.parameters.body)).toContain("match_count");
    expect(String(matchNode.parameters.body)).toContain("8");

    expect(answerNode.parameters.authentication).toBeUndefined();
    expect(answerNode.parameters.contentType).toBe("raw");
    expect(String(answerNode.parameters.body)).toContain("gpt-4o");

    expect(logNode.parameters.authentication).toBeUndefined();
    expect(logNode.parameters.contentType).toBe("raw");
    expect(String(logNode.parameters.body)).toContain("JSON.stringify");
  });
});

describe("Drive ingestion workflow exports", () => {
  it.each([
    "docs/transferai-admin/Ingestion_Documents_Drive_Recursif_fixed_2026-07-04.json",
    "docs/transferai-admin/Ingestion_Documents_Drive_Recursif_V2_recursive_2026-07-04.json",
  ])("serializes OpenAI and Supabase payloads explicitly in %s", (relativePath) => {
    const workflow = byName(loadWorkflow(relativePath));
    const embeddingNode = workflow["Créer embedding chunk"];
    const upsertNode = workflow["Insérer dans Supabase (upsert)"];

    expect(embeddingNode.parameters.contentType).toBe("raw");
    expect(embeddingNode.parameters.rawContentType).toBe("application/json");
    expect(String(embeddingNode.parameters.body)).toContain("JSON.stringify");
    expect(String(embeddingNode.parameters.body)).toContain("text-embedding-3-small");

    expect(upsertNode.parameters.contentType).toBe("raw");
    expect(upsertNode.parameters.rawContentType).toBe("application/json");
    expect(String(upsertNode.parameters.body)).toContain("JSON.stringify");
  });
});
