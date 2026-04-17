import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { resolveAuditDomainAccess } from "../_shared/audit-domain-access.ts";

type AccessPayload = {
  identifier?: string | null;
  passwordHash?: string | null;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const SITE_URL = (Deno.env.get("PUBLIC_SITE_URL") ?? "https://www.transferai.ci").replace(/\/$/, "");
const AUDIT_FORM_URL =
  (Deno.env.get("PUBLIC_AUDIT_FORM_URL") ?? `${SITE_URL}/formulaire-audit-ia/index.html`).trim();

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

  if (!identifier || !passwordHash) {
    return new Response(JSON.stringify({ error: "invalid_credentials" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: rows, error } = await supabase
    .from("contact_requests")
    .select("id, full_name, email, profession, company, country, sector, prospect_username, prospect_password_hash, prospect_portal_status, audit_invite_token, audit_invite_expires_at")
    .eq("request_intent", "demande-audit")
    .or(`email.eq.${identifier},prospect_username.eq.${identifier}`)
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

  const existingInviteStillValid =
    row.audit_invite_token &&
    row.audit_invite_expires_at &&
    new Date(row.audit_invite_expires_at).getTime() > Date.now();

  let inviteToken = row.audit_invite_token ?? null;
  let inviteExpiresAt = row.audit_invite_expires_at ?? null;

  if (!existingInviteStillValid) {
    inviteToken = generateInviteToken();
    inviteExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
    const { domainKey } = resolveAuditDomainAccess(row.sector);

    const invitationPayload = {
      invitee_name: row.full_name,
      invitee_email: row.email,
      invite_token: inviteToken,
      expires_at: inviteExpiresAt,
      status: "pending",
      draft_form_data: {
        c_nom: row.full_name,
        c_email: row.email,
        c_entite: row.company,
        c_poste: row.profession ?? "",
        c_domaine: domainKey,
      },
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
