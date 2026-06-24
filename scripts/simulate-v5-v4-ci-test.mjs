import fs from "node:fs";
import path from "node:path";

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function domainFromWebsite(website) {
  return String(website || "")
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split("/")[0]
    .trim();
}

function canonicalize(row, source, index) {
  const website = row.website || row.domain || "";
  const domain = domainFromWebsite(website);

  return {
    prospect_id:
      row.prospect_id ||
      `crm-${slugify(domain || row.organization_name || row.company_name || "lead")}-${index + 1}`,
    organization_name: row.organization_name || row.company_name || row.name || "",
    website,
    country: row.country || source.default_country || "Côte d'Ivoire",
    organization_type:
      row.organization_type || source.default_organization_type || "organisation à qualifier",
    sector_guess: row.sector_guess || row.industry || source.default_sector_guess || "secteur à confirmer",
    decision_maker_name:
      row.decision_maker_name || row.contact_name || "Décideur à confirmer",
    target_email: row.target_email || row.email || "",
    custom_page_paths_csv: row.custom_page_paths_csv || "",
    booking_link_45min:
      row.booking_link_45min ||
      source.booking_link_45min ||
      "https://calendly.com/contact-transferai/30min",
    commercial_priority_default:
      row.commercial_priority_default || source.default_priority || "tier1",
    research_scope: row.research_scope || source.default_research_scope || "public_web_only",
    lead_origin: row.lead_origin || source.ingest_label || "public_scrape",
    source_backend: source.crm_backend || "supabase",
    raw_source_id: row.raw_source_id || row.id || domain || null,
    outreach_attempt_count: Number(row.outreach_attempt_count || 0),
    last_response_status: row.last_response_status || "",
    last_sequence_result: row.last_sequence_result || "",
    stop_reason: row.stop_reason || "",
    paused: Boolean(row.paused),
    do_not_contact: Boolean(row.do_not_contact),
    niche_status: row.niche_status || "not_assessed",
    next_action_at: row.next_action_at || null,
  };
}

function prepareCrmUpsert(lead, delayDays) {
  const nextActionAt = new Date(Date.now() + delayDays * 86400000).toISOString();
  return {
    ...lead,
    status: "ready",
    paused: false,
    do_not_contact: false,
    outreach_attempt_count: Number(lead.outreach_attempt_count || 0),
    last_response_status: lead.last_response_status || "",
    last_sequence_result: lead.last_sequence_result || "",
    stop_reason: "",
    niche_status: lead.niche_status || "not_assessed",
    next_action_at: lead.next_action_at || nextActionAt,
    updated_at: new Date().toISOString(),
  };
}

function evaluateBatchEligibility(prospects, config, sentToday = 0) {
  const dailyLimit = Number(config.daily_send_limit || 5);
  const maxAttempts = Number(config.max_attempts_per_prospect || 3);
  const remainingCapacity = Math.max(dailyLimit - sentToday, 0);
  let scheduled = 0;

  return prospects.map((prospect) => {
    let processDecision = "skip";
    let stopReason = "";

    if (!prospect.organization_name || !prospect.website) {
      stopReason = "missing_minimum_profile";
    } else if (prospect.do_not_contact) {
      stopReason = "do_not_contact";
    } else if (prospect.paused) {
      stopReason = "prospect_paused";
    } else if (prospect.stop_reason) {
      stopReason = prospect.stop_reason;
    } else if (Number(prospect.outreach_attempt_count || 0) >= maxAttempts) {
      stopReason = "max_attempts_reached";
    } else if (
      ["interested", "meeting_booked", "not_interested", "unsubscribed"].includes(
        String(prospect.last_response_status || "").toLowerCase(),
      )
    ) {
      stopReason = "sequence_already_closed";
    } else if (String(prospect.last_sequence_result || "").toLowerCase() === "no_niche") {
      stopReason = "niche_not_relevant";
    } else if (scheduled >= remainingCapacity) {
      stopReason = "daily_quota_reached";
    } else {
      processDecision = "process_now";
      scheduled += 1;
    }

    return {
      ...prospect,
      process_decision: processDecision,
      batch_stop_reason: stopReason || null,
      batch_status: processDecision === "process_now" ? "dispatched_to_v3" : "skipped_in_batch",
      sent_today: sentToday,
      remaining_capacity: remainingCapacity,
    };
  });
}

function buildMarkdownReport(input, normalized, valid, queue) {
  const dispatched = queue.filter((item) => item.process_decision === "process_now");
  const skipped = queue.filter((item) => item.process_decision !== "process_now");
  const invalid = normalized.filter(
    (row) => !valid.find((validRow) => validRow.prospect_id === row.prospect_id),
  );

  const lines = [
    "# Rapport de test V5 → V4",
    "",
    `Date du test : ${new Date().toISOString()}`,
    "",
    "## Hypothèse de test",
    "",
    "- Test local à blanc basé sur les règles exactes des nœuds V5 et V4.",
    "- Aucun appel réel à n8n, OpenAI, Resend ou Supabase n'a été effectué.",
    `- Quota journalier simulé : ${input.daily_send_limit}`,
    `- Limite de batch simulée : ${input.batch_fetch_limit}`,
    "",
    "## Lot fourni",
    "",
  ];

  for (const lead of input.leads) {
    lines.push(
      `- ${lead.organization_name} | ${lead.sector_guess} | ${lead.website || "site manquant"}`,
    );
  }

  lines.push("", "## Résultat V5", "");
  lines.push(`- Leads reçus : ${normalized.length}`);
  lines.push(`- Leads valides pour upsert CRM : ${valid.length}`);
  lines.push(`- Leads rejetés avant CRM : ${invalid.length}`);

  if (invalid.length) {
    lines.push("", "### Leads rejetés avant CRM");
    for (const row of invalid) {
      lines.push(`- ${row.organization_name} : website manquant ou profil minimal incomplet`);
    }
  }

  lines.push("", "## Résultat V4", "");
  lines.push(`- Prospects dispatchés vers V3 : ${dispatched.length}`);
  lines.push(`- Prospects bloqués / différés : ${skipped.length}`);

  if (dispatched.length) {
    lines.push("", "### Dispatchés vers V3");
    for (const row of dispatched) {
      lines.push(
        `- ${row.organization_name} | ${row.website} | tier ${row.commercial_priority_default} | batch_status=${row.batch_status}`,
      );
    }
  }

  if (skipped.length) {
    lines.push("", "### Bloqués / différés");
    for (const row of skipped) {
      lines.push(`- ${row.organization_name} : ${row.batch_stop_reason || "raison non précisée"}`);
    }
  }

  lines.push("", "## Lecture métier", "");
  lines.push(
    "- La Ligue Ivoirienne des Secrétaires permet de tester le contrôle qualité amont si le site n'est pas encore confirmé.",
  );
  lines.push(
    "- Orange Côte d'Ivoire et MTN Côte d'Ivoire représentent deux cas pertinents pour le terrain service client / relation client multicanal.",
  );
  lines.push(
    "- Si tu veux un test 100% dispatché vers V3, il faudra compléter un site web vérifié pour la Ligue Ivoirienne des Secrétaires.",
  );

  return lines.join("\n");
}

function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.error("Usage: node scripts/simulate-v5-v4-ci-test.mjs <input.json>");
    process.exit(1);
  }

  const absoluteInput = path.resolve(inputPath);
  const payload = JSON.parse(fs.readFileSync(absoluteInput, "utf8"));

  const source = {
    crm_backend: payload.crm_backend || "supabase",
    default_country: payload.default_country || "Côte d'Ivoire",
    default_organization_type: payload.default_organization_type || "organisation à qualifier",
    default_sector_guess: payload.default_sector_guess || "secteur à confirmer",
    default_priority: payload.default_priority || "tier1",
    default_research_scope: payload.default_research_scope || "public_web_only",
    next_action_delay_days: payload.next_action_delay_days || "1",
    ingest_label: payload.ingest_label || "manual-ci-test",
    booking_link_45min:
      payload.booking_link_45min || "https://calendly.com/contact-transferai/30min",
  };

  const normalized = (payload.leads || []).map((row, index) => canonicalize(row, source, index));
  const valid = normalized
    .filter((lead) => lead.organization_name && lead.website)
    .map((lead) => prepareCrmUpsert(lead, Number(source.next_action_delay_days || 1)));

  const batchConfig = {
    daily_send_limit: payload.daily_send_limit || "2",
    batch_fetch_limit: payload.batch_fetch_limit || "10",
    max_attempts_per_prospect: payload.max_attempts_per_prospect || "3",
    min_confidence_score: payload.min_confidence_score || "0.45",
    batch_run_label: payload.batch_run_label || "manual-ci-test-run",
  };

  const queue = evaluateBatchEligibility(valid, batchConfig, Number(payload.sent_today || 0));
  const report = buildMarkdownReport(
    { ...payload, ...batchConfig, leads: payload.leads || [] },
    normalized,
    valid,
    queue,
  );

  const outputBase = path.resolve(
    "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/tmp/v5-v4-ci-test-output",
  );
  fs.mkdirSync(outputBase, { recursive: true });

  const jsonOut = path.join(outputBase, "simulation-result.json");
  const mdOut = path.join(outputBase, "simulation-report.md");

  fs.writeFileSync(
    jsonOut,
    JSON.stringify(
      {
        source,
        batchConfig,
        normalized,
        validForCrmUpsert: valid,
        queue,
      },
      null,
      2,
    ),
  );
  fs.writeFileSync(mdOut, report);

  console.log(jsonOut);
  console.log(mdOut);
}

main();
