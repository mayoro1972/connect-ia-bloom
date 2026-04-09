import { isSupabaseConfigured } from "@/integrations/supabase/client";

export type AdminEntity = "resource" | "job" | "analytics";
export type AdminAction = "list" | "create" | "set-status";

type AdminRequest = {
  entity: AdminEntity;
  action: AdminAction;
  payload?: Record<string, unknown>;
};

const getAdminEndpoint = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();

  if (!supabaseUrl) {
    return null;
  }

  return `${supabaseUrl}/functions/v1/content-admin`;
};

export async function invokeContentAdmin<T>(token: string, request: AdminRequest): Promise<T> {
  const endpoint = getAdminEndpoint();

  if (!isSupabaseConfigured || !endpoint) {
    throw new Error("Supabase n'est pas configuré localement.");
  }

  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: publishableKey ?? "",
      Authorization: `Bearer ${publishableKey ?? ""}`,
      "x-admin-token": token,
    },
    body: JSON.stringify(request),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(typeof data?.error === "string" ? data.error : "La requête admin a échoué.");
  }

  return data as T;
}
