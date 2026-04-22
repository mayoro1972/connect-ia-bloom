import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type RequestBody = {
  inviteToken?: string;
};

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { inviteToken } = (await request.json().catch(() => ({}))) as RequestBody;
    const normalizedInviteToken = inviteToken?.trim();

    if (!normalizedInviteToken) {
      return jsonResponse({ error: "Missing invite token" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return jsonResponse({ error: "Supabase service role is not configured" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { data, error } = await supabase
      .from("form_invitations")
      .select("invitee_name, invitee_email, expires_at, status, draft_form_data, response_id")
      .eq("invite_token", normalizedInviteToken)
      .maybeSingle();

    if (error) {
      return jsonResponse({ error: error.message }, 500);
    }

    if (!data) {
      return jsonResponse({ error: "Invitation invalide ou introuvable." }, 404);
    }

    if (new Date(data.expires_at).getTime() < Date.now()) {
      await supabase
        .from("form_invitations")
        .update({ status: "expired" })
        .eq("invite_token", normalizedInviteToken);

      return jsonResponse({ error: "Cette invitation a expire." }, 410);
    }

    let savedFormData: Record<string, unknown> | null = null;

    if (data.response_id) {
      const { data: responseData, error: responseError } = await supabase
        .from("form_responses")
        .select("form_data")
        .eq("id", data.response_id)
        .maybeSingle();

      if (responseError) {
        return jsonResponse({ error: responseError.message }, 500);
      }

      savedFormData =
        responseData?.form_data && typeof responseData.form_data === "object" && !Array.isArray(responseData.form_data)
          ? responseData.form_data
          : null;
    }

    if (!savedFormData) {
      const { data: latestResponse, error: latestResponseError } = await supabase
        .from("form_responses")
        .select("form_data")
        .eq("invitation_token", normalizedInviteToken)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestResponseError) {
        return jsonResponse({ error: latestResponseError.message }, 500);
      }

      savedFormData =
        latestResponse?.form_data && typeof latestResponse.form_data === "object" && !Array.isArray(latestResponse.form_data)
          ? latestResponse.form_data
          : null;
    }

    const draftFormData =
      data.draft_form_data && typeof data.draft_form_data === "object" && !Array.isArray(data.draft_form_data)
        ? data.draft_form_data
        : {};

    return jsonResponse({
      success: true,
      invitation: {
        invitee_name: data.invitee_name,
        invitee_email: data.invitee_email,
        expires_at: data.expires_at,
        status: data.status,
        draft_form_data: {
          ...draftFormData,
          ...(savedFormData ?? {}),
        },
      },
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
