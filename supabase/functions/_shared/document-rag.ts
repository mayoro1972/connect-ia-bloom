export type RetrievedDocument = {
  id: number | string | null;
  titre: string;
  contenu: string;
  url: string | null;
  similarity: number;
  source_id: string | null;
  chunk_index: number | null;
  modified_at: string | null;
};

export type RagSource = {
  titre: string;
  url: string | null;
  similarite: number;
};

export type RagContext = {
  contexte: string;
  sources: RagSource[];
  nb_sources: number;
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const toText = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ \u00A0]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const toOptionalText = (value: unknown): string | null => {
  const text = toText(value);
  return text ? text : null;
};

const toAbsoluteUrl = (value: unknown): string | null => {
  const text = toText(value);
  if (!text) {
    return null;
  }

  try {
    const parsed = new URL(text);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? text : null;
  } catch {
    return null;
  }
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const pickDocumentArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  const record = asRecord(payload);
  if (!record) {
    return [];
  }

  const candidates = [record.body, record.data, record.documents, record.matches];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  if (
    "titre" in record ||
    "title" in record ||
    "contenu" in record ||
    "content" in record
  ) {
    return [record];
  }

  return [];
};

export const normalizeRetrievedDocuments = (payload: unknown): RetrievedDocument[] => {
  return pickDocumentArray(payload)
    .map((entry) => {
      const record = asRecord(entry);
      if (!record) {
        return null;
      }

      const contenu = toText(record.contenu ?? record.content ?? record.chunk_text);
      if (!contenu) {
        return null;
      }

      return {
        id: (record.id as number | string | null | undefined) ?? null,
        titre: toText(record.titre ?? record.title ?? record.source_file ?? "Document") || "Document",
        contenu,
        url: toAbsoluteUrl(record.url ?? record.source_url ?? record.webViewLink),
        similarity: toNumber(record.similarity ?? record.score),
        source_id: toOptionalText(record.source_id),
        chunk_index:
          record.chunk_index === null || record.chunk_index === undefined
            ? null
            : Math.trunc(toNumber(record.chunk_index)),
        modified_at: toOptionalText(record.modified_at ?? record.modifiedTime),
      };
    })
    .filter((entry): entry is RetrievedDocument => Boolean(entry))
    .sort((left, right) => right.similarity - left.similarity);
};

const truncate = (value: string, maxChars: number): string => {
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`;
};

export const buildRagContext = (
  documents: RetrievedDocument[],
  options: { maxDocuments?: number; maxCharsPerDocument?: number } = {},
): RagContext => {
  const maxDocuments = options.maxDocuments ?? 6;
  const maxCharsPerDocument = options.maxCharsPerDocument ?? 900;
  const seen = new Set<string>();
  const selected: RetrievedDocument[] = [];

  for (const document of documents) {
    const fingerprint = [
      document.source_id ?? document.titre,
      document.chunk_index ?? "na",
      document.url ?? "no-url",
    ].join("::");

    if (seen.has(fingerprint)) {
      continue;
    }

    seen.add(fingerprint);
    selected.push(document);

    if (selected.length >= maxDocuments) {
      break;
    }
  }

  const contexte = selected
    .map((document, index) => {
      const similarity = Math.round(Math.max(0, Math.min(1, document.similarity)) * 100);
      const contenu = truncate(document.contenu, maxCharsPerDocument);

      return `[Document ${index + 1}] ${document.titre} (similarite: ${similarity}%)\n${contenu}`;
    })
    .join("\n\n---\n\n");

  return {
    contexte: contexte || "Aucun document pertinent n'a ete trouve dans la base documentaire.",
    sources: selected.map((document) => ({
      titre: document.titre,
      url: document.url,
      similarite: Math.round(Math.max(0, Math.min(1, document.similarity)) * 100),
    })),
    nb_sources: selected.length,
  };
};
