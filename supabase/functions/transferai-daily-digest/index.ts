import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const FROM = Deno.env.get("MAIL_FROM") || Deno.env.get("FROM_EMAIL") || "TransferAI Africa <contact@transferai.ci>";

const getRecipients = () => {
  const raw = [
    Deno.env.get("ADMIN_EMAIL"),
    Deno.env.get("MAIL_TO"),
    "marius.ayoro70@gmail.com",
    "contact@transferai.ci",
  ];
  return Array.from(new Set(raw.filter((v): v is string => Boolean(v?.trim())).map((v) => v.trim().toLowerCase())));
};

async function sendEmail(to: string[], subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return { ok: false, error: "RESEND_API_KEY missing" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  const data = await res.json().catch(() => ({}));
  return res.ok ? { ok: true, id: data.id } : { ok: false, error: data.message || "send_failed" };
}

const normalizeDigits = (v: string | null) => (v || "").replace(/[^\d]/g, "").slice(-8);

const esc = (v: unknown) =>
  String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // --- Webinaire ---
    const { data: webinarRows, error: webinarError } = await supabase
      .from("webinar_registrations")
      .select("created_at, full_name, email, phone, organization, position, sector, sector_other, domain_key, domain_other, formation_title, formation_other, scheduled_date, status, date_confirmed_at")
      .order("created_at", { ascending: false });
    if (webinarError) throw webinarError;

    const allWebinar = webinarRows ?? [];
    const newWebinar = allWebinar.filter((r) => r.created_at >= since);
    const webinarStatusCounts = { invited: 0, confirmed: 0, received: 0, other: 0 };
    allWebinar.forEach((r) => {
      if (r.status === "invited") webinarStatusCounts.invited += 1;
      else if (r.status === "confirmed") webinarStatusCounts.confirmed += 1;
      else if (r.status === "received") webinarStatusCounts.received += 1;
      else webinarStatusCounts.other += 1;
    });

    const confirmedRecently = allWebinar.filter((r) => r.date_confirmed_at && r.date_confirmed_at >= since);
    const [{ data: waMessages }, zohoResult] = await Promise.all([
      supabase.from("whatsapp_inbound_messages").select("from_number, created_at").gte("created_at", since),
      supabase
        .from("zoho_inbound_messages")
        .select("from_email, created_at")
        .gte("created_at", since)
        .then((r) => r)
        .catch(() => ({ data: [] as { from_email: string; created_at: string }[] })),
    ]);
    const zohoMessages = (zohoResult as { data: { from_email: string; created_at: string }[] | null }).data ?? [];

    const webinarConfirmationsHtml = confirmedRecently.length
      ? `<h3 style="margin-top:20px;color:#0d9488">Confirmations WhatsApp/email reçues (24h) — ${confirmedRecently.length}</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead><tr style="background:#f3f4f6">
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Nom</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Email</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Canal</th>
          </tr></thead>
          <tbody>
            ${confirmedRecently.map((r) => {
              const phoneSuffix = normalizeDigits(r.phone);
              const viaWhatsapp = phoneSuffix && (waMessages ?? []).some((m) => normalizeDigits(m.from_number) === phoneSuffix);
              const viaEmail = zohoMessages.some((m) => (m.from_email || "").toLowerCase() === r.email.toLowerCase());
              const canal = viaWhatsapp ? "WhatsApp" : viaEmail ? "Email" : "—";
              return `<tr>
                <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.full_name)}</td>
                <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.email)}</td>
                <td style="padding:6px;border:1px solid #e5e7eb">${esc(canal)}</td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>`
      : `<p style="margin-top:16px;color:#666"><em>Aucune confirmation WhatsApp/email reçue dans les dernières 24h.</em></p>`;

    const webinarNewHtml = newWebinar.length
      ? `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:12px">
          <thead><tr style="background:#f3f4f6">
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Nom</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Organisation</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Poste</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Secteur</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Centre d'intérêt</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Date prévue</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Statut</th>
          </tr></thead>
          <tbody>
            ${newWebinar.map((r) => `<tr>
              <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.full_name)}</td>
              <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.organization)}</td>
              <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.position)}</td>
              <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.sector || r.sector_other)}</td>
              <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.domain_key || r.domain_other)}</td>
              <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.scheduled_date)}</td>
              <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.status)}</td>
            </tr>`).join("")}
          </tbody>
        </table>`
      : `<p style="color:#666"><em>Aucune nouvelle inscription webinaire dans les dernières 24h.</em></p>`;

    // --- Formation ---
    const { data: formationRows, error: formationError } = await supabase
      .from("prospect_targets")
      .select("created_at, organization_name, decision_maker_name, target_email, sector_guess, organization_type, status, notes_internal")
      .in("status", ["formation_interest", "email2_sent", "email3_sent"])
      .order("created_at", { ascending: false });
    if (formationError) throw formationError;

    const allFormation = formationRows ?? [];
    const newFormation = allFormation.filter((r) => r.created_at >= since);
    const formationStatusCounts = { formation_interest: 0, email2_sent: 0, email3_sent: 0 };
    allFormation.forEach((r) => {
      if (r.status in formationStatusCounts) {
        formationStatusCounts[r.status as keyof typeof formationStatusCounts] += 1;
      }
    });

    const formationNewHtml = newFormation.length
      ? `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:12px">
          <thead><tr style="background:#f3f4f6">
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Organisation</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Contact</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Email</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Secteur</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Type</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Statut</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Notes</th>
          </tr></thead>
          <tbody>
            ${newFormation.map((r) => `<tr>
              <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.organization_name)}</td>
              <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.decision_maker_name)}</td>
              <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.target_email)}</td>
              <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.sector_guess)}</td>
              <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.organization_type)}</td>
              <td style="padding:6px;border:1px solid #e5e7eb">${esc(r.status)}</td>
              <td style="padding:6px;border:1px solid #e5e7eb;font-size:12px;color:#555">${esc((r.notes_internal || "").slice(0, 140))}</td>
            </tr>`).join("")}
          </tbody>
        </table>`
      : `<p style="color:#666"><em>Aucun nouveau prospect formation dans les dernières 24h.</em></p>`;

    const today = new Date().toLocaleDateString("fr-FR", { timeZone: "Africa/Abidjan", day: "2-digit", month: "long", year: "numeric" });

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:780px;margin:0 auto;padding:24px;color:#1a1a1a">
        <h2 style="color:#0d9488">📊 Point quotidien inscriptions — ${esc(today)}</h2>

        <h3 style="color:#12233f;border-bottom:2px solid #0d9488;padding-bottom:6px">Webinaire gratuit "IA pratique"</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin:12px 0">
          <tr style="background:#f3f4f6">
            <td style="padding:8px;border:1px solid #e5e7eb;text-align:center"><strong>${webinarStatusCounts.invited}</strong><br/><span style="color:#666">Invités (à confirmer)</span></td>
            <td style="padding:8px;border:1px solid #e5e7eb;text-align:center"><strong>${webinarStatusCounts.confirmed}</strong><br/><span style="color:#666">Confirmés</span></td>
            <td style="padding:8px;border:1px solid #e5e7eb;text-align:center"><strong>${webinarStatusCounts.received}</strong><br/><span style="color:#666">Inscrits volontaires</span></td>
            <td style="padding:8px;border:1px solid #e5e7eb;text-align:center"><strong>${allWebinar.length}</strong><br/><span style="color:#666">Total à date</span></td>
          </tr>
        </table>
        <p><strong>${newWebinar.length}</strong> nouvelle(s) inscription(s) dans les dernières 24h :</p>
        ${webinarNewHtml}
        ${webinarConfirmationsHtml}

        <h3 style="color:#12233f;border-bottom:2px solid #0d9488;padding-bottom:6px;margin-top:32px">Formation "L'IA au Bureau"</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin:12px 0">
          <tr style="background:#f3f4f6">
            <td style="padding:8px;border:1px solid #e5e7eb;text-align:center"><strong>${formationStatusCounts.formation_interest}</strong><br/><span style="color:#666">Intérêt exprimé</span></td>
            <td style="padding:8px;border:1px solid #e5e7eb;text-align:center"><strong>${formationStatusCounts.email2_sent}</strong><br/><span style="color:#666">Relance J+1 envoyée</span></td>
            <td style="padding:8px;border:1px solid #e5e7eb;text-align:center"><strong>${formationStatusCounts.email3_sent}</strong><br/><span style="color:#666">Relance J+4 envoyée</span></td>
          </tr>
        </table>
        <p><strong>${newFormation.length}</strong> nouveau(x) prospect(s) formation dans les dernières 24h :</p>
        ${formationNewHtml}

        <p style="margin-top:32px">
          <a href="https://www.transferai.ci/back-office?tab=webinars" style="background:#0d9488;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">
            Ouvrir le BackOffice
          </a>
        </p>
      </div>`;

    const subject = `[TransferAI] Point quotidien — ${newWebinar.length} webinaire(s) / ${newFormation.length} formation(s) — ${today}`;
    const result = await sendEmail(getRecipients(), subject, html);
    return new Response(JSON.stringify({ ok: true, newWebinar: newWebinar.length, newFormation: newFormation.length, sent: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
