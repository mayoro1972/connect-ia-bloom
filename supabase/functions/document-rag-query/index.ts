import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildRagContext, normalizeRetrievedDocuments } from "../_shared/document-rag.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const openAiApiKey = Deno.env.get("OPENAI_API_KEY") ?? "";
const answerModel = Deno.env.get("OPENAI_DOCUMENT_RAG_MODEL")?.trim() || "gpt-4o";
const embeddingModel = Deno.env.get("OPENAI_DOCUMENT_RAG_EMBEDDING_MODEL")?.trim() || "text-embedding-3-small";
const matchThreshold = Number(Deno.env.get("DOCUMENT_RAG_MATCH_THRESHOLD") ?? "0.72");
const matchCount = Number(Deno.env.get("DOCUMENT_RAG_MATCH_COUNT") ?? "8");
const maxSources = Number(Deno.env.get("DOCUMENT_RAG_MAX_SOURCES") ?? "6");
const maxCharsPerDocument = Number(Deno.env.get("DOCUMENT_RAG_MAX_CHARS_PER_DOCUMENT") ?? "900");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type RagRequestPayload = {
  question?: string;
  query?: string;
  message?: string;
  utilisateur?: string;
  user?: string;
  session_id?: string;
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const callOpenAi = async <T>(path: string, body: Record<string, unknown>): Promise<T> => {
  const response = await fetch(`https://api.openai.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`openai_${path.replace(/\//g, "_")}_${response.status}:${detail}`);
  }

  return await response.json() as T;
};

const extractResponseText = (payload: Record<string, unknown>): string => {
  const choices = Array.isArray(payload.choices) ? payload.choices : [];
  const firstChoice = choices[0];
  const firstChoiceRecord = firstChoice && typeof firstChoice === "object"
    ? firstChoice as Record<string, unknown>
    : null;
  const message = firstChoiceRecord?.message;
  const messageRecord = message && typeof message === "object"
    ? message as Record<string, unknown>
    : null;
  const content = messageRecord?.content;

  if (typeof content === "string" && content.trim()) {
    return content.trim();
  }

  return "";
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  if (!supabaseUrl || !serviceRoleKey || !openAiApiKey) {
    return jsonResponse({
      error: "missing_server_configuration",
      detail: "SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY et OPENAI_API_KEY sont requis.",
    }, 500);
  }

  let payload: RagRequestPayload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  const question = String(payload.question ?? payload.query ?? payload.message ?? "").trim();
  const utilisateur = String(payload.utilisateur ?? payload.user ?? "Participant").trim() || "Participant";
  const sessionId = String(payload.session_id ?? `sess-${Date.now()}`).trim();

  if (question.length < 3) {
    return jsonResponse({
      error: "invalid_question",
      detail: "La question doit contenir au moins 3 caracteres.",
    }, 400);
  }

  try {
    const embeddingResponse = await callOpenAi<{ data?: Array<{ embedding?: number[] }> }>("embeddings", {
      model: embeddingModel,
      input: question,
    });
    const embedding = embeddingResponse.data?.[0]?.embedding;

    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error("embedding_missing");
    }

    const { data: matches, error: matchError } = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    if (matchError) {
      throw new Error(`match_documents_failed:${matchError.message}`);
    }

    const normalized = normalizeRetrievedDocuments(matches);
    const ragContext = buildRagContext(normalized, {
      maxDocuments: maxSources,
      maxCharsPerDocument,
    });

    const completion = await callOpenAi<Record<string, unknown>>("chat/completions", {
      model: answerModel,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Tu es un assistant documentaire interne. Tu reponds uniquement a partir des documents fournis. Si l'information n'est pas presente dans les documents, dis-le clairement. Cite les sources utilisees a la fin de la reponse. Reponds en francais, de facon concise et professionnelle.",
        },
        {
          role: "user",
          content: `Question : ${question}\n\nDocuments disponibles :\n${ragContext.contexte}`,
        },
      ],
    });

    const reponse =
      extractResponseText(completion) ||
      "Je n'ai pas pu formuler une reponse exploitable a partir des documents indexes.";
    const timestamp = new Date().toISOString();

    // Best-effort logging: une erreur de log ne doit pas bloquer la reponse utilisateur.
    try {
      await supabase.from("rag_logs").insert({
        question,
        reponse,
        nb_sources: ragContext.nb_sources,
        sources: ragContext.sources,
        utilisateur,
        session_id: sessionId,
        created_at: timestamp,
      });
    } catch {
      // Ignore logging failures.
    }

    return jsonResponse({
      ok: true,
      reponse,
      question,
      sources: ragContext.sources,
      nb_sources: ragContext.nb_sources,
      timestamp,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown_error";
    return jsonResponse({ error: "document_rag_failed", detail }, 502);
  }
});
