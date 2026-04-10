import { isSupabaseConfigured } from "@/integrations/supabase/client";

export type AdminEntity = "resource" | "job" | "analytics" | "editorial" | "newsletter";
export type AdminAction = "list" | "create" | "set-status" | "create-feed" | "save";

type AdminRequest = {
  entity: AdminEntity;
  action: AdminAction;
  payload?: Record<string, unknown>;
};

export async function invokeContentAdmin<T>(token: string, request: AdminRequest): Promise<T> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase n'est pas configuré localement.");
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonJwt =
    import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
    import.meta.env.VITE_SUPABASE_LEGACY_ANON_KEY?.trim();

  if (!supabaseUrl || !anonJwt) {
    throw new Error("Ajoutez VITE_SUPABASE_ANON_KEY pour appeler le back-office admin.");
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/content-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonJwt,
      Authorization: `Bearer ${anonJwt}`,
      "x-admin-token": token,
    },
    body: JSON.stringify(request),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(typeof data?.error === "string"
      ? data.error
      : typeof data?.message === "string"
        ? data.message
        : "La requête admin a échoué.");
  }

  return (data ?? {}) as T;
}

export async function invokeAdminEdgeFunction<T>(
  token: string,
  functionName: string,
  payload: Record<string, unknown>,
): Promise<T> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase n'est pas configuré localement.");
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const publishableKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
    import.meta.env.VITE_SUPABASE_LEGACY_ANON_KEY?.trim();

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Ajoutez VITE_SUPABASE_PUBLISHABLE_KEY pour appeler les fonctions edge admin.");
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
      "x-admin-token": token,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(typeof data?.error === "string"
      ? data.error
      : typeof data?.message === "string"
        ? data.message
        : `La fonction ${functionName} a échoué.`);
  }

  return (data ?? {}) as T;
}
