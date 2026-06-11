import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  type ProspectAuditPackRow,
  buildAuditAccessContext,
  buildAuditDraftFormData,
} from "../_shared/prospect-audit-context.ts";

type AccessPayload = {
  identifier?: string | null;
  passwordHash?: string | null;
  packId?: string | null;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const SITE_URL = (Deno.env.get("PUBLIC_SITE_URL") ?? "https://www.transferai.ci").replace(/\/$/, "");
const rawAuditFormUrl =
  (Deno.env.get("PUBLIC_AUDIT_FORM_URL") ?? `${SITE_URL}/questionnaire-audit`).trim();
const AUDIT_FORM_URL = rawAuditFormUrl.includes("/formulaire-audit-ia/index.html")
  ? `${SITE_URL}/questionnaire-audit`
  : rawAuditFormUrl;

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

const normalize = (value?: string | null) => (value ?? "").trim().toLowerCase();
const normalizePackId = (value?: string | null) => (value ?? "").trim();

const generateInviteToken = () => crypto.randomUUID().replaceAll("-", "");

const buildAuditAccessUrl = (token: string) =>
  `${AUDIT_FORM_URL}${AUDIT_FORM_URL.includes("?") ? "&" : "?"}invite=${encodeURIComponent(token)}`;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!supabase) {
    return new Response(JSON.stringify({ error: "supabase_not_configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const body = (await request.json().catch(() => ({}))) as AccessPayload;
  const identifier = normalize(body.identifier);
  const passwordHash = normalize(body.passwordHash);
  const requestedPackId = normalizePackId(body.packId);

  if (!identifier || !passwordHash) {
    return new Response(JSON.stringify({ error: "invalid_credentials" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: rows, error } = await supabase
    .from("contact_requests")
    .select("id, full_name, email, profession, company, country, sector, message, ai_maturity, use_cases, engagement_format, scoping_horizon, budget_range, prospect_username, prospect_password_hash, prospect_portal_status, audit_invite_token, audit_invite_expires_at")
    .eq("request_intent", "demande-audit")
    .or(`email.eq.${identifier},prospect_username.eq.${identifier}`)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const row = (rows ?? []).find((item) =>
    normalize(item.prospect_password_hash) === passwordHash &&
    item.prospect_portal_status !== "disabled",
  );

  if (!row) {
    return new Response(JSON.stringify({ error: "invalid_credentials" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let packRow: ProspectAuditPackRow | null = null;

  if (requestedPackId) {
    const { data: requestedPack, error: packError } = await supabase
      .from("ai_prospecting_packs")
      .select("pack_id, organization_name, organization_type, target_email, payload")
      .eq("pack_id", requestedPackId)
      .maybeSingle();

    if (packError) {
      return new Response(JSON.stringify({ error: packError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!requestedPack) {
      return new Response(JSON.stringify({ error: "invalid_pack" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const packEmail = normalize(typeof requestedPack.target_email === "string" ? requestedPack.target_email : "");
    if (packEmail && packEmail !== normalize(row.email)) {
      return new Response(JSON.stringify({ error: "invalid_pack" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    packRow = requestedPack;
  } else {
    const { data: latestPack, error: latestPackError } = await supabase
      .from("ai_prospecting_packs")
      .select("pack_id, organization_name, organization_type, target_email, payload")
      .eq("target_email", row.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestPackError) {
      return new Response(JSON.stringify({ error: latestPackError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    packRow = latestPack ?? null;
  }

  const accessContext = buildAuditAccessContext(row, packRow);
  const draftFormData = buildAuditDraftFormData(row, accessContext);

  const existingTokenStillValid =
    row.audit_invite_token &&
    row.audit_invite_expires_at &&
    new Date(row.audit_invite_expires_at).getTime() > Date.now();

  let inviteToken = row.audit_invite_token ?? null;
  let inviteExpiresAt = row.audit_invite_expires_at ?? null;
  let existingInviteStillValid = false;

  if (existingTokenStillValid && inviteToken) {
    const { data: existingInvitation, error: existingInvitationError } = await supabase
      .from("form_invitations")
      .select("expires_at, status")
      .eq("invite_token", inviteToken)
      .maybeSingle();

    if (existingInvitationError) {
      return new Response(JSON.stringify({ error: existingInvitationError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    existingInviteStillValid =
      Boolean(existingInvitation) &&
      existingInvitation?.status !== "expired" &&
      new Date(existingInvitation?.expires_at ?? 0).getTime() > Date.now();
  }

  if (!existingInviteStillValid) {
    inviteToken = generateInviteToken();
    inviteExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

    const invitationPayload = {
      contact_request_id: row.id,
      pack_id: accessContext.packId,
      invitee_name: row.full_name,
      invitee_email: row.email,
      invite_token: inviteToken,
      expires_at: inviteExpiresAt,
      status: "pending",
      sector_context: accessContext.sectorLabel,
      access_context: accessContext,
      draft_form_data: draftFormData,
    };

    const { error: invitationError } = await supabase.from("form_invitations").insert(invitationPayload);

    if (invitationError) {
      return new Response(JSON.stringify({ error: invitationError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: updateError } = await supabase
      .from("contact_requests")
      .update({
        audit_invite_token: inviteToken,
        audit_invite_expires_at: inviteExpiresAt,
        last_portal_login_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } else {
    await supabase
      .from("form_invitations")
      .update({
        contact_request_id: row.id,
        pack_id: accessContext.packId,
        invitee_name: row.full_name,
        invitee_email: row.email,
        sector_context: accessContext.sectorLabel,
        access_context: accessContext,
        draft_form_data: draftFormData,
      })
      .eq("invite_token", inviteToken!);

    await supabase
      .from("contact_requests")
      .update({ last_portal_login_at: new Date().toISOString() })
      .eq("id", row.id);
  }

  return new Response(
    JSON.stringify({
      ok: true,
      accessUrl: buildAuditAccessUrl(inviteToken!),
      inviteToken,
      expiresAt: inviteExpiresAt,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
