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
    const packId = getTrimmedString(body.packId);
    const contextSnapshot = body.contextSnapshot && typeof body.contextSnapshot === "object" && !Array.isArray(body.contextSnapshot)
      ? body.contextSnapshot
      : {};
    const internalEmailTo = getTrimmedString(body.internalEmailTo);
    const nextActionDelayDays = typeof body.nextActionDelayDays === "number" ? body.nextActionDelayDays : 1;

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

    if (incomingResponseId) {
      const { data: existingById } = await supabase
        .from("form_responses")
        .select("id, session_id, invitation_token")
        .eq("id", incomingResponseId)
        .maybeSingle();

      const matchesInvitation = inviteToken && existingById?.invitation_token === inviteToken;
      const matchesSession = sessionId && existingById?.session_id === sessionId;

      if (existingById && (matchesInvitation || matchesSession)) {
        targetResponseId = existingById.id;
      }
    }

    if (!targetResponseId && inviteToken) {
      const { data: existingByInvitation } = await supabase
        .from("form_responses")
        .select("id")
        .eq("invitation_token", inviteToken)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingByInvitation?.id) {
        targetResponseId = existingByInvitation.id;
      }
    }

    if (!targetResponseId && sessionId) {
      const { data: existingBySession } = await supabase
        .from("form_responses")
        .select("id")
        .eq("session_id", sessionId)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingBySession?.id) {
        targetResponseId = existingBySession.id;
      }
    }

    const payload: Record<string, unknown> = {
      user_name: getTrimmedString(formData.c_nom),
      user_email: getTrimmedString(formData.c_email),
      user_position: getTrimmedString(formData.c_poste),
      user_entity: getTrimmedString(formData.c_entite),
      form_data: formData,
      is_completed: completionPercentage >= 80,
      completion_percentage: completionPercentage,
      session_id: sessionId,
      invitation_token: inviteToken,
      context_snapshot: contextSnapshot,
    };
    if (packId) payload.pack_id = packId;

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

    if (completionPercentage >= 80) {
      const n8nWebhookUrl = Deno.env.get("N8N_POST_AUDIT_WEBHOOK_URL");
      if (n8nWebhookUrl) {
        const webhookPayload = {
          pack_id: packId || null,
          response_id: targetResponseId,
          completion_percentage: completionPercentage,
          is_completed: true,
          trigger_source: "save-form-response",
          internal_email_to: internalEmailTo || Deno.env.get("POST_AUDIT_INTERNAL_EMAIL") || "contact@transferai.ci",
          next_action_delay_days: nextActionDelayDays,
        };
        fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookPayload),
        }).catch(() => {});
      }
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
