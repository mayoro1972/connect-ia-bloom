import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const FROM = Deno.env.get("MAIL_FROM") || Deno.env.get("FROM_EMAIL") || "TransferAI Africa <contact@transferai.ci>";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "contact@transferai.ci";

async function sendEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return { ok: false, error: "RESEND_API_KEY missing" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  const data = await res.json().catch(() => ({}));
  return res.ok ? { ok: true, id: data.id } : { ok: false, error: data.message || "send_failed" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("webinar_registrations")
      .select("created_at, full_name, email, phone, organization, domain_key, domain_other, formation_title, formation_other, scheduled_date, status, source_page, date_confirmed_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false });
    if (error) throw error;

    const rows = data ?? [];
    const total = rows.length;

    // Vue d'ensemble globale (pas seulement les 7 derniers jours) : combien d'invitations
    // proactives (registration_type=invited, source_page=outreach_invite_non_solicited) restent
    // à confirmer, tous statuts confondus.
    const { data: overviewRows, error: overviewError } = await supabase
      .from("webinar_registrations")
      .select("status, source_page");
    if (overviewError) throw overviewError;
    const statusCounts = { invited: 0, confirmed: 0, received: 0, other: 0 };
    (overviewRows ?? []).forEach((r) => {
      if (r.status === "invited") statusCounts.invited += 1;
      else if (r.status === "confirmed") statusCounts.confirmed += 1;
      else if (r.status === "received") statusCounts.received += 1;
      else statusCounts.other += 1;
    });

    // Confirmations des 7 derniers jours + canal (WhatsApp vs email) par recoupement temporel
    // avec les messages entrants bruts déjà journalisés par les 2 pipelines existants.
    const confirmedRecently = rows.filter((r) => r.date_confirmed_at && r.date_confirmed_at >= since);
    const [{ data: waMessages }, { data: zohoMessages }] = await Promise.all([
      supabase.from("whatsapp_inbound_messages").select("from_number, created_at").gte("created_at", since),
      supabase.from("zoho_inbound_messages").select("from_email, created_at").gte("created_at", since).then((r) => r).catch(() => ({ data: [] as { from_email: string; created_at: string }[] })),
    ]);
    const normalizeDigits = (v: string | null) => (v || "").replace(/[^\d]/g, "").slice(-8);
    const confirmationsHtml = confirmedRecently.length
      ? `<h3 style="margin-top:24px;color:#0d9488">✅ Confirmations reçues cette semaine (${confirmedRecently.length})</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead><tr style="background:#f3f4f6">
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Nom</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Email</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Canal</th>
            <th align="left" style="padding:6px;border:1px solid #e5e7eb">Confirmé le</th>
          </tr></thead>
          <tbody>
            ${confirmedRecently.map((r) => {
              const phoneSuffix = normalizeDigits(r.phone);
              const viaWhatsapp = phoneSuffix && (waMessages ?? []).some((m) => normalizeDigits(m.from_number) === phoneSuffix);
              const viaEmail = (zohoMessages ?? []).some((m) => (m.from_email || "").toLowerCase() === r.email.toLowerCase());
              const canal = viaWhatsapp ? "WhatsApp" : viaEmail ? "Email" : "—";
              return `<tr>
                <td style="padding:6px;border:1px solid #e5e7eb">${r.full_name}</td>
                <td style="padding:6px;border:1px solid #e5e7eb">${r.email}</td>
                <td style="padding:6px;border:1px solid #e5e7eb">${canal}</td>
                <td style="padding:6px;border:1px solid #e5e7eb">${new Date(r.date_confirmed_at!).toLocaleDateString("fr-FR")}</td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>`
      : `<p style="margin-top:24px;color:#666"><em>Aucune confirmation WhatsApp/email reçue cette semaine.</em></p>`;

    // Group by domain
    const byDomain = new Map<string, typeof rows>();
    rows.forEach((r) => {
      const k = r.domain_key || r.domain_other || "—";
      if (!byDomain.has(k)) byDomain.set(k, []);
      byDomain.get(k)!.push(r);
    });

    const groupsHtml = Array.from(byDomain.entries()).map(([domain, list]) => `
      <h3 style="margin-top:24px;color:#0d9488">${domain} <span style="color:#666;font-weight:normal">(${list.length})</span></h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr style="background:#f3f4f6">
          <th align="left" style="padding:6px;border:1px solid #e5e7eb">Date</th>
          <th align="left" style="padding:6px;border:1px solid #e5e7eb">Nom</th>
          <th align="left" style="padding:6px;border:1px solid #e5e7eb">Email</th>
          <th align="left" style="padding:6px;border:1px solid #e5e7eb">Organisation</th>
          <th align="left" style="padding:6px;border:1px solid #e5e7eb">Formation</th>
          <th align="left" style="padding:6px;border:1px solid #e5e7eb">Date prévue</th>
          <th align="left" style="padding:6px;border:1px solid #e5e7eb">Statut</th>
        </tr></thead>
        <tbody>
          ${list.map((r) => `<tr>
            <td style="padding:6px;border:1px solid #e5e7eb">${new Date(r.created_at).toLocaleDateString("fr-FR")}</td>
            <td style="padding:6px;border:1px solid #e5e7eb">${r.full_name}</td>
            <td style="padding:6px;border:1px solid #e5e7eb">${r.email}</td>
            <td style="padding:6px;border:1px solid #e5e7eb">${r.organization ?? "—"}</td>
            <td style="padding:6px;border:1px solid #e5e7eb">${r.formation_title ?? r.formation_other ?? "—"}</td>
            <td style="padding:6px;border:1px solid #e5e7eb">${r.scheduled_date}</td>
            <td style="padding:6px;border:1px solid #e5e7eb">${r.status}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    `).join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:760px;margin:0 auto;padding:24px;color:#1a1a1a">
        <h2 style="color:#0d9488">📊 Récap hebdo — Inscriptions webinaires</h2>
        <p><strong>${total}</strong> inscription(s) reçue(s) ces 7 derniers jours.</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin:16px 0">
          <tr style="background:#f3f4f6">
            <td style="padding:8px;border:1px solid #e5e7eb;text-align:center"><strong>${statusCounts.invited}</strong><br/><span style="color:#666">Invités (à confirmer)</span></td>
            <td style="padding:8px;border:1px solid #e5e7eb;text-align:center"><strong>${statusCounts.confirmed}</strong><br/><span style="color:#666">Confirmés</span></td>
            <td style="padding:8px;border:1px solid #e5e7eb;text-align:center"><strong>${statusCounts.received}</strong><br/><span style="color:#666">Inscrits volontaires</span></td>
          </tr>
        </table>
        ${confirmationsHtml}
        <p style="background:#fef3c7;padding:12px;border-radius:8px;margin-top:24px">
          ⚠️ Action recommandée : confirmer la date du webinaire et envoyer l'invitation aux inscrits par groupe / domaine.
        </p>
        ${total === 0 ? "<p><em>Aucune nouvelle inscription cette semaine.</em></p>" : groupsHtml}
        <p style="margin-top:32px">
          <a href="https://www.transferai.ci/back-office?tab=webinars" style="background:#0d9488;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">
            Ouvrir le BackOffice → Webinaires
          </a>
        </p>
      </div>`;

    const subject = `[Webinaires] Récap hebdomadaire — ${total} inscription(s)`;
    const result = await sendEmail(ADMIN_EMAIL, subject, html);
    return new Response(JSON.stringify({ ok: true, total, sent: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
