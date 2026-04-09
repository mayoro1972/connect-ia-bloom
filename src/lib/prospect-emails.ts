import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { contactDetails } from "@/lib/site-links";

export type ProspectEmailIntent =
  | "demande-catalogue"
  | "demande-renseignement"
  | "contact-devis"
  | "inscription"
  | "prise-rdv";

export type ProspectEmailPayload = {
  intent: ProspectEmailIntent;
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  role?: string | null;
  city?: string | null;
  domain?: string | null;
  formationTitle?: string | null;
  participants?: number | null;
  format?: string | null;
  timeline?: string | null;
  message?: string | null;
  sourcePage?: string | null;
  language?: string | null;
  appointmentUrl?: string | null;
};

export const resolveOutboundLanguage = (preferred?: string | null): "fr" | "en" => {
  let storedLanguage: string | null = null;

  if (typeof window !== "undefined") {
    try {
      storedLanguage = window.localStorage.getItem("transferai-language");
    } catch {
      storedLanguage = null;
    }
  }

  const candidates = [
    preferred,
    typeof document !== "undefined" ? document.documentElement.lang : null,
    typeof document !== "undefined" ? document.body.getAttribute("data-language") : null,
    storedLanguage,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().toLowerCase().startsWith("en")) {
      return "en";
    }
  }

  return "fr";
};

export const buildAppointmentMailto = (payload: {
  source: string;
  domain?: string;
  company?: string;
  fullName?: string;
  language?: "fr" | "en";
}) => {
  const isEnglish = payload.language === "en";
  const subject = isEnglish
    ? `Appointment request - ${payload.company || payload.fullName || "Prospect"} - TransferAI`
    : `Demande de prise de RDV - ${payload.company || payload.fullName || "Prospect"} - TransferAI`;
  const body = isEnglish
    ? [
        "Hello TransferAI Africa,",
        "",
        "I would like to book a discovery call.",
        "",
        `Request source: ${payload.source || "Website"}`,
        `Name: ${payload.fullName || ""}`,
        `Organization: ${payload.company || ""}`,
        `Domain: ${payload.domain || ""}`,
        "",
        "Please share a suitable slot or contact me back by email.",
        "",
        "Best regards,",
      ].join("\n")
    : [
        "Bonjour TransferAI Africa,",
        "",
        "Je souhaite reserver un rendez-vous de cadrage.",
        "",
        `Source de la demande : ${payload.source || "Site web"}`,
        `Nom : ${payload.fullName || ""}`,
        `Organisation : ${payload.company || ""}`,
        `Domaine : ${payload.domain || ""}`,
        "",
        "Merci de me proposer un créneau ou de me recontacter par email.",
        "",
        "Cordialement,",
      ].join("\n");

  return `mailto:${contactDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const sendProspectEmailNotifications = async (payload: ProspectEmailPayload) => {
  try {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: new Error("Supabase is not configured."),
      };
    }

    const language = resolveOutboundLanguage(payload.language);
    return await supabase.functions.invoke("send-prospect-emails", {
      body: {
        ...payload,
        language,
      },
    });
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
};
