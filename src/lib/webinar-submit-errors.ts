type SupportedLanguage = "fr" | "en";

type SupabaseLikeError = {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
};

const copy = {
  fr: {
    unavailable:
      "Le formulaire de webinaire est temporairement indisponible. Merci de réessayer un peu plus tard ou de nous contacter directement.",
  },
  en: {
    unavailable:
      "The webinar form is temporarily unavailable. Please try again later or contact us directly.",
  },
} as const;

export const getWebinarSubmitErrorMessage = (
  error: unknown,
  language: SupportedLanguage,
  fallback: string,
) => {
  const supabaseError = error as SupabaseLikeError | null;
  const message = supabaseError?.message?.trim() ?? "";
  const details = supabaseError?.details?.trim() ?? "";
  const hint = supabaseError?.hint?.trim() ?? "";

  if (
    supabaseError?.code === "PGRST202" ||
    supabaseError?.code === "PGRST205" ||
    message.includes("schema cache") ||
    message.includes("Requested function was not found")
  ) {
    return copy[language].unavailable;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  const bestSupabaseMessage = [message, details, hint].find((value) => value.length > 0);
  return bestSupabaseMessage ?? fallback;
};
