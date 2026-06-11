import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  formData?: Record<string, unknown>;
  completionPercentage?: number;
  sessionId?: string;
  inviteToken?: string;
  responseId?: string;
  packId?: string;
  contextSnapshot?: Record<string, unknown>;
  internalEmailTo?: string;
  nextActionDelayDays?: number;
}

interface ExistingResponseLookup {
  id: string;
  is_completed: boolean | null;
  completion_percentage: number | null;
}

function getTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function clampPercentage(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

async function triggerPostAuditWebhookIfNeeded(payload: {
  packId: string | null;
  responseId: string;
  completionPercentage: number;
  isCompleted: boolean;
  internalEmailTo?: string;
  nextActionDelayDays?: number;
}) {
  if (!payload.isCompleted || !payload.packId) {
    return;
  }

  const webhookUrl = getTrimmedString(
    Deno.env.get("POST_AUDIT_N8N_WEBHOOK_URL") || Deno.env.get("N8N_POST_AUDIT_WEBHOOK_URL"),
  );

  if (!webhookUrl) {
    return;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const bearerToken = getTrimmedString(Deno.env.get("POST_AUDIT_N8N_WEBHOOK_BEARER_TOKEN"));

  if (bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  }

  const nextActionDelayDays = Number(
    payload.nextActionDelayDays ?? Deno.env.get("POST_AUDIT_NEXT_ACTION_DELAY_DAYS") ?? "1",
  );

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      pack_id: payload.packId,
      response_id: payload.responseId,
      completion_percentage: payload.completionPercentage,
      is_completed: payload.isCompleted,
      internal_email_to: payload.internalEmailTo || Deno.env.get("POST_AUDIT_INTERNAL_EMAIL") || "contact@transferai.ci",
      next_action_delay_days: Number.isFinite(nextActionDelayDays) ? nextActionDelayDays : 1,
      trigger_source: "save-form-response",
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text().catch(() => "");
    throw new Error(`Post-audit webhook failed: ${response.status} ${responseBody}`.trim());
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body: RequestBody = await req.json();
    const formData = body.formData && typeof body.formData === "object" && !Array.isArray(body.formData)
      ? body.formData
      : {};
    const completionPercentage = clampPercentage(body.completionPercentage);
    const sessionId = getTrimmedString(body.sessionId);
    const inviteToken = getTrimmedString(body.inviteToken);
    const incomingResponseId = getTrimmedString(body.responseId);
    const explicitPackId = getTrimmedString(body.packId);
    const explicitContextSnapshot = body.contextSnapshot &&
        typeof body.contextSnapshot === "object" &&
        !Array.isArray(body.contextSnapshot)
      ? body.contextSnapshot
      : {};
    const explicitInternalEmailTo = getTrimmedString(body.internalEmailTo);
    const explicitNextActionDelayDays = typeof body.nextActionDelayDays === "number" && Number.isFinite(body.nextActionDelayDays)
      ? body.nextActionDelayDays
      : undefined;

    if (!sessionId && !inviteToken) {
      return jsonResponse({ error: "Missing session or invitation token" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return jsonResponse({ error: "Supabase service role is not configured" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    let targetResponseId = "";
    let previousResponseState: ExistingResponseLookup | null = null;
    let invitationContext:
      | {
          contact_request_id: string | null;
          pack_id: string | null;
          sector_context: string | null;
          access_context: Record<string, unknown>;
        }
      | null = null;

    if (inviteToken) {
      const { data: invitationData, error: invitationError } = await supabase
        .from("form_invitations")
        .select("contact_request_id, pack_id, sector_context, access_context")
        .eq("invite_token", inviteToken)
        .maybeSingle();

      if (invitationError) {
        return jsonResponse({ error: invitationError.message }, 500);
      }

      invitationContext = invitationData
        ? {
            contact_request_id: invitationData.contact_request_id,
            pack_id: invitationData.pack_id,
            sector_context: invitationData.sector_context,
            access_context:
              invitationData.access_context &&
                typeof invitationData.access_context === "object" &&
                !Array.isArray(invitationData.access_context)
                ? invitationData.access_context as Record<string, unknown>
                : {},
          }
        : null;
    }

    if (incomingResponseId) {
      const { data: existingById } = await supabase
        .from("form_responses")
        .select("id, session_id, invitation_token, is_completed, completion_percentage")
        .eq("id", incomingResponseId)
        .maybeSingle();

      const matchesInvitation = inviteToken && existingById?.invitation_token === inviteToken;
      const matchesSession = sessionId && existingById?.session_id === sessionId;

      if (existingById && (matchesInvitation || matchesSession)) {
        targetResponseId = existingById.id;
        previousResponseState = {
          id: existingById.id,
          is_completed: existingById.is_completed,
          completion_percentage: existingById.completion_percentage,
        };
      }
    }

    if (!targetResponseId && inviteToken) {
      const { data: existingByInvitation } = await supabase
        .from("form_responses")
        .select("id, is_completed, completion_percentage")
        .eq("invitation_token", inviteToken)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingByInvitation?.id) {
        targetResponseId = existingByInvitation.id;
        previousResponseState = {
          id: existingByInvitation.id,
          is_completed: existingByInvitation.is_completed,
          completion_percentage: existingByInvitation.completion_percentage,
        };
      }
    }

    if (!targetResponseId && sessionId) {
      const { data: existingBySession } = await supabase
        .from("form_responses")
        .select("id, is_completed, completion_percentage")
        .eq("session_id", sessionId)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingBySession?.id) {
        targetResponseId = existingBySession.id;
        previousResponseState = {
          id: existingBySession.id,
          is_completed: existingBySession.is_completed,
          completion_percentage: existingBySession.completion_percentage,
        };
      }
    }

    const formDataToStore = {
      ...formData,
      pack_id: explicitPackId || getTrimmedString(formData.pack_id) || invitationContext?.pack_id || "",
      audit_sector: getTrimmedString(formData.audit_sector) || invitationContext?.sector_context || "",
      audit_context:
        invitationContext?.access_context && Object.keys(invitationContext.access_context).length > 0
          ? invitationContext.access_context
          : formData.audit_context,
    };

    const recommendationSnapshot =
      formDataToStore.transferai_recommendation &&
        typeof formDataToStore.transferai_recommendation === "object" &&
        !Array.isArray(formDataToStore.transferai_recommendation)
        ? formDataToStore.transferai_recommendation as Record<string, unknown>
        : null;

    const payload = {
      user_name: getTrimmedString(formDataToStore.c_nom),
      user_email: getTrimmedString(formDataToStore.c_email),
      user_position: getTrimmedString(formDataToStore.c_poste),
      user_entity: getTrimmedString(formDataToStore.c_entite),
      form_data: formDataToStore,
      is_completed: completionPercentage >= 80,
      completion_percentage: completionPercentage,
      session_id: sessionId,
      invitation_token: inviteToken,
      contact_request_id: invitationContext?.contact_request_id ?? null,
      pack_id: explicitPackId || invitationContext?.pack_id || getTrimmedString(formDataToStore.pack_id) || null,
      sector_context: invitationContext?.sector_context || getTrimmedString(formDataToStore.audit_sector) || null,
      context_snapshot:
        {
          ...(explicitContextSnapshot && Object.keys(explicitContextSnapshot).length > 0
            ? explicitContextSnapshot
            : {}),
          ...(invitationContext?.access_context && Object.keys(invitationContext.access_context).length > 0
            ? invitationContext.access_context
            : {}),
          ...(recommendationSnapshot
            ? {
                transferai_recommendation: recommendationSnapshot,
                transferai_recommendation_generated_at: getTrimmedString(
                  formDataToStore.transferai_recommendation_generated_at,
                ) || new Date().toISOString(),
              }
            : {}),
        },
    };

    if (targetResponseId) {
      const { error } = await supabase
        .from("form_responses")
        .update(payload)
        .eq("id", targetResponseId);

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }
    } else {
      const { data, error } = await supabase
        .from("form_responses")
        .insert(payload)
        .select("id")
        .single();

      if (error || !data) {
        return jsonResponse({ error: error?.message || "Unable to save response" }, 500);
      }

      targetResponseId = data.id;
    }

    if (inviteToken && targetResponseId) {
      const invitationUpdate: Record<string, unknown> = {
        response_id: targetResponseId,
      };

      if (completionPercentage >= 80) {
        invitationUpdate.status = "completed";
      }

      await supabase
        .from("form_invitations")
        .update(invitationUpdate)
        .eq("invite_token", inviteToken);
    }

    const hasJustCompleted = completionPercentage >= 80 && !Boolean(previousResponseState?.is_completed);

    if (hasJustCompleted) {
      void triggerPostAuditWebhookIfNeeded({
        packId: payload.pack_id,
        responseId: targetResponseId,
        completionPercentage,
        isCompleted: true,
        internalEmailTo: explicitInternalEmailTo,
        nextActionDelayDays: explicitNextActionDelayDays,
      }).catch((webhookError) => {
        console.error("[save-form-response] post-audit webhook trigger failed", webhookError);
      });
    }

    return jsonResponse({
      success: true,
      responseId: targetResponseId,
      completionPercentage,
      isCompleted: completionPercentage >= 80,
    });
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});
