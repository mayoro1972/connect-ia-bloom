import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  buildSecondFollowupReply,
  normalizeWhatsappAddress,
  sendTwilioWhatsappMessage,
} from "../_shared/whatsapp-followups.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-scheduler-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const schedulerToken = Deno.env.get("WHATSAPP_SCHEDULER_TOKEN") ?? "";
const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID") ?? "";
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN") ?? "";
const twilioWhatsappFrom = Deno.env.get("TWILIO_WHATSAPP_FROM") ?? "";
const batchSize = Number.parseInt(Deno.env.get("WHATSAPP_FOLLOWUP_BATCH_SIZE") ?? "20", 10);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const json = (status: number, payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

const requireScheduler = (request: Request) => {
  const token = request.headers.get("x-scheduler-token") ?? "";
  if (schedulerToken.length > 0 && token === schedulerToken) {
    return true;
  }

  const authHeader = request.headers.get("authorization") ?? "";
  if (authHeader.startsWith("Bearer ") && serviceRoleKey.length > 0) {
    return authHeader.slice(7) === serviceRoleKey;
  }

  return false;
};

type FollowupRow = {
  id: string;
  from_number: string;
  profile_name: string | null;
  trigger_message_sid: string;
  latest_inbound_message_sid: string;
  status: string;
  second_followup_due_at: string | null;
  first_auto_reply_sent_at: string | null;
  booking_link: string | null;
};

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  if (!requireScheduler(request)) {
    return json(401, { error: "unauthorized" });
  }

  if (!supabaseUrl || !serviceRoleKey || !twilioAccountSid || !twilioAuthToken || !twilioWhatsappFrom) {
    return json(500, { error: "missing_scheduler_configuration" });
  }

  const limit = Number.isFinite(batchSize) && batchSize > 0 ? batchSize : 20;

  const { data, error } = await supabase
    .from("whatsapp_followup_sequences")
    .select("id, from_number, profile_name, trigger_message_sid, latest_inbound_message_sid, status, second_followup_due_at, first_auto_reply_sent_at, booking_link")
    .eq("status", "pending_second_followup")
    .eq("opt_out", false)
    .not("second_followup_due_at", "is", null)
    .lte("second_followup_due_at", new Date().toISOString())
    .order("second_followup_due_at", { ascending: true })
    .limit(limit);

  if (error) {
    return json(500, { error: error.message });
  }

  const rows = (data ?? []) as FollowupRow[];
  const results: Array<Record<string, unknown>> = [];

  for (const row of rows) {
    try {
      if (row.latest_inbound_message_sid !== row.trigger_message_sid) {
        await supabase
          .from("whatsapp_followup_sequences")
          .update({
            status: "prospect_replied",
            closed_at: new Date().toISOString(),
            last_error: null,
          })
          .eq("id", row.id);

        results.push({
          id: row.id,
          action: "closed_without_followup",
          reason: "prospect_replied_before_second_message",
        });
        continue;
      }

      const replyText = buildSecondFollowupReply(row.profile_name, row.booking_link);
      const providerResult = await sendTwilioWhatsappMessage({
        accountSid: twilioAccountSid,
        authToken: twilioAuthToken,
        from: twilioWhatsappFrom,
        to: row.from_number,
        body: replyText,
      });

      await supabase
        .from("whatsapp_followup_sequences")
        .update({
          status: "second_followup_sent",
          second_followup_sent_at: new Date().toISOString(),
          last_error: null,
          meta: {
            provider: "twilio",
            provider_message_id: providerResult?.sid ?? null,
            second_reply_preview: replyText,
            booking_link: row.booking_link ?? null,
          },
        })
        .eq("id", row.id);

      results.push({
        id: row.id,
        action: "second_followup_sent",
        provider_message_id: providerResult?.sid ?? null,
        to: normalizeWhatsappAddress(row.from_number),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "unknown_followup_error";

      await supabase
        .from("whatsapp_followup_sequences")
        .update({
          status: "error",
          last_error: errorMessage,
        })
        .eq("id", row.id);

      results.push({
        id: row.id,
        action: "error",
        error: errorMessage,
      });
    }
  }

  return json(200, {
    ok: true,
    processed: rows.length,
    results,
  });
});
