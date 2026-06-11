import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  buildAuditAccessContext,
  buildAuditAccessContextFromPack,
  buildAuditDraftFormData,
  buildAuditDraftFormDataFromPack,
  type ProspectAuditPackRow,
  type ProspectAuditRequestRow,
} from "../_shared/prospect-audit-context.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type RequestBody = {
  inviteToken?: string;
  packId?: string;
};

type InvitationRow = {
  invitee_name: string | null;
  invitee_email: string | null;
  expires_at: string;
  status: string | null;
  draft_form_data: Record<string, unknown> | null;
  response_id: string | null;
  contact_request_id: string | null;
  pack_id: string | null;
  sector_context: string | null;
  access_context: Record<string, unknown> | null;
};

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

const generateInviteToken = () => crypto.randomUUID().replaceAll("-", "");

const asObject = (value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const readInvitation = async (
  supabase: ReturnType<typeof createClient>,
  inviteToken: string,
) => {
  const invitationQuery = await supabase
    .from("form_invitations")
    .select("invitee_name, invitee_email, expires_at, status, draft_form_data, response_id, contact_request_id, pack_id, sector_context, access_context")
    .eq("invite_token", inviteToken)
    .maybeSingle();
  const data = invitationQuery.data as InvitationRow | null;
  const error = invitationQuery.error;

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Invitation invalide ou introuvable.");
  }

  if (new Date(data.expires_at).getTime() < Date.now()) {
    await supabase
      .from("form_invitations")
      .update({ status: "expired" })
      .eq("invite_token", inviteToken);

    throw new Error("Cette invitation a expire.");
  }

  let savedFormData: Record<string, unknown> | null = null;

  if (data.response_id) {
    const { data: responseData, error: responseError } = await supabase
      .from("form_responses")
      .select("form_data")
      .eq("id", data.response_id)
      .maybeSingle();

    if (responseError) {
      throw new Error(responseError.message);
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
      .eq("invitation_token", inviteToken)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestResponseError) {
      throw new Error(latestResponseError.message);
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

  return {
    inviteToken,
    invitation: {
      invitee_name: data.invitee_name,
      invitee_email: data.invitee_email,
      expires_at: data.expires_at,
      status: data.status,
      response_id: data.response_id,
      contact_request_id: data.contact_request_id,
      pack_id: data.pack_id,
      sector_context: data.sector_context,
      access_context: asObject(data.access_context),
      draft_form_data: {
        ...draftFormData,
        ...(savedFormData ?? {}),
      },
    },
  };
};

const getOrCreateInvitationForPack = async (
  supabase: ReturnType<typeof createClient>,
  packId: string,
) => {
  const packQuery = await supabase
    .from("ai_prospecting_packs")
    .select("pack_id, organization_name, organization_type, target_email, payload")
    .eq("pack_id", packId)
    .maybeSingle();
  const pack = packQuery.data as ProspectAuditPackRow | null;
  const packError = packQuery.error;

  if (packError) {
    throw new Error(packError.message);
  }

  if (!pack) {
    throw new Error("Pack introuvable.");
  }

  const existingInvitationQuery = await supabase
    .from("form_invitations")
    .select("invite_token, expires_at, status")
    .eq("pack_id", packId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const existingInvitation = existingInvitationQuery.data as {
    invite_token: string | null;
    expires_at: string | null;
    status: string | null;
  } | null;
  const existingInvitationError = existingInvitationQuery.error;

  if (existingInvitationError) {
    throw new Error(existingInvitationError.message);
  }

  if (
    existingInvitation?.invite_token &&
    existingInvitation.status !== "expired" &&
    new Date(existingInvitation.expires_at ?? 0).getTime() > Date.now()
  ) {
    return existingInvitation.invite_token;
  }

  let requestRow: ProspectAuditRequestRow | null = null;
  const targetEmail = pack.target_email?.trim();

  if (targetEmail) {
    const requestQuery = await supabase
      .from("contact_requests")
      .select("id, full_name, email, company, profession, sector, message, ai_maturity, use_cases, engagement_format, scoping_horizon, budget_range")
      .eq("email", targetEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const request = requestQuery.data as ProspectAuditRequestRow | null;
    const requestError = requestQuery.error;

    if (requestError) {
      throw new Error(requestError.message);
    }

    requestRow = request ?? null;
  }

  const accessContext = requestRow
    ? buildAuditAccessContext(requestRow, pack)
    : buildAuditAccessContextFromPack(pack);
  const draftFormData = requestRow
    ? buildAuditDraftFormData(requestRow, accessContext)
    : buildAuditDraftFormDataFromPack(pack, accessContext);

  const inviteToken = generateInviteToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

  const { error: insertError } = await supabase.from("form_invitations").insert({
    contact_request_id: requestRow?.id ?? null,
    pack_id: accessContext.packId,
    invitee_name: requestRow?.full_name ?? pack.organization_name ?? null,
    invitee_email: requestRow?.email ?? pack.target_email ?? null,
    invite_token: inviteToken,
    expires_at: expiresAt,
    status: "pending",
    sector_context: accessContext.sectorLabel,
    access_context: accessContext,
    draft_form_data: draftFormData,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  if (requestRow?.id) {
    await supabase
      .from("contact_requests")
      .update({
        audit_invite_token: inviteToken,
        audit_invite_expires_at: expiresAt,
        last_portal_login_at: new Date().toISOString(),
      })
      .eq("id", requestRow.id);
  }

  return inviteToken;
};

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { inviteToken, packId } = (await request.json().catch(() => ({}))) as RequestBody;
    const normalizedInviteToken = inviteToken?.trim();
    const normalizedPackId = packId?.trim();

    if (!normalizedInviteToken && !normalizedPackId) {
      return jsonResponse({ error: "Missing invite token or pack_id" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return jsonResponse({ error: "Supabase service role is not configured" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const finalInviteToken = normalizedInviteToken || await getOrCreateInvitationForPack(supabase, normalizedPackId!);
    const resolved = await readInvitation(supabase, finalInviteToken);

    return jsonResponse({
      success: true,
      inviteToken: resolved.inviteToken,
      invitation: resolved.invitation,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status =
      message === "Pack introuvable." || message === "Invitation invalide ou introuvable."
        ? 404
        : message === "Cette invitation a expire."
          ? 410
          : 500;

    return jsonResponse(
      {
        error: message,
      },
      status,
    );
  }
});
