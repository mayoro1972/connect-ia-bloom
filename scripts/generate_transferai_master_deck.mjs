import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const THREAD_ID = process.env.CODEX_THREAD_ID || "manual-20260613-master-prospect-deck";
const SKILL_DIR =
  "/Users/marius_ayoro/.codex/plugins/cache/openai-primary-runtime/presentations/26.601.10930/skills/presentations";
const NODE_BIN = "/Users/marius_ayoro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node";
const slidesDir = path.join(ROOT, "scripts", "presentations", "transferai-sector-decks");
const buildScript = path.join(SKILL_DIR, "scripts", "build_artifact_deck.mjs");
const layoutCheck = path.join(SKILL_DIR, "scripts", "check_layout_quality.mjs");
const specPath = path.join(
  ROOT,
  "docs",
  "transferai-prospection",
  "master-templates",
  "transferai_master_deck_spec.json",
);
const outputRoot = path.join(ROOT, "outputs", "master-templates");
const finalDir = path.join(outputRoot, "final");
const finalPptx = path.join(finalDir, "TransferAI_Master_Deck_Prospect_Sectoriel.pptx");
const workspace = path.join(ROOT, "outputs", THREAD_ID, "presentations", "master-prospect-sectoriel");
const previewDir = path.join(workspace, "preview");
const layoutDir = path.join(workspace, "layout");
const qaDir = path.join(workspace, "qa");

function run(command, args, label, extraEnv = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    env: {
      ...process.env,
      ...extraEnv,
    },
  });

  if (result.status !== 0) {
    throw new Error([label, result.stdout, result.stderr].filter(Boolean).join("\n"));
  }

  return result.stdout;
}

async function writeText(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
}

async function main() {
  await fs.mkdir(previewDir, { recursive: true });
  await fs.mkdir(layoutDir, { recursive: true });
  await fs.mkdir(qaDir, { recursive: true });
  await fs.mkdir(finalDir, { recursive: true });

  await writeText(
    path.join(workspace, "profile-plan.txt"),
    [
      "task mode: create",
      "primary deck-profile: strategy-leadership",
      "secondary profile gates: template-following, gtm-growth",
      "required proof objects: pains, ROI hypotheses, use cases, 90-day path, trust framework, CTA",
      "source/asset requirements: telecom reference deck + TransferAI sector deck system + placeholder manifest",
      "known missing inputs: final prospect data must replace placeholders before sending",
    ].join("\n"),
  );

  await writeText(
    path.join(workspace, "claim-spine.txt"),
    [
      "1. This master deck must feel presentation-ready even before personalization.",
      "2. The user should be able to replace placeholders without breaking layout rhythm.",
      "3. The story must remain executive, sector-aware and aligned with the V3 CRM logic.",
      "4. The CTA, trust layer and 90-day accompaniment must stay visible throughout the deck.",
    ].join("\n"),
  );

  await writeText(
    path.join(workspace, "design-system.txt"),
    [
      "palette: ivory background, deep navy, orange accent, teal secondary, gold trust accent",
      "type: Aptos Display for headlines, Aptos for body",
      "layout rhythm: editorial claims, premium cards, balanced whitespace, strong CTA close",
    ].join("\n"),
  );

  run(
    NODE_BIN,
    [
      buildScript,
      "--workspace",
      workspace,
      "--slides-dir",
      slidesDir,
      "--out",
      finalPptx,
      "--preview-dir",
      previewDir,
      "--layout-dir",
      layoutDir,
      "--slide-count",
      "10",
    ],
    "Master deck build failed",
    { TRANSFERAI_SECTOR_SPEC: specPath },
  );

  const layoutFiles = (await fs.readdir(layoutDir))
    .filter((name) => name.endsWith(".json"))
    .sort();

  let qaLog = "";
  for (const file of layoutFiles) {
    const fullPath = path.join(layoutDir, file);
    qaLog += `## ${file}\n`;
    qaLog += run(NODE_BIN, [layoutCheck, "--layout", fullPath], "Master deck layout QA failed", {
      TRANSFERAI_SECTOR_SPEC: specPath,
    });
    qaLog += "\n";
  }

  await fs.writeFile(path.join(qaDir, "layout-scorecard.txt"), qaLog, "utf8");

  const manifest = {
    final_pptx: finalPptx,
    preview_dir: previewDir,
    layout_dir: layoutDir,
    qa_scorecard: path.join(qaDir, "layout-scorecard.txt"),
    spec_path: specPath,
  };

  await fs.writeFile(path.join(outputRoot, "master-deck-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log(JSON.stringify(manifest, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
