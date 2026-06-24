import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const THREAD_ID = process.env.CODEX_THREAD_ID || "manual-20260522-transferai-company-confidentiality";
const SKILL_DIR =
  "/Users/marius_ayoro/.codex/plugins/cache/openai-primary-runtime/presentations/26.515.10909/skills/presentations";
const NODE_BIN = "/Users/marius_ayoro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node";

const workspace = path.join(ROOT, "outputs", THREAD_ID, "presentations", "presentation-transferai-entreprise-confidentialite");
const slidesDir = path.join(ROOT, "scripts", "presentations", "transferai-company-confidentiality");
const previewDir = path.join(workspace, "preview");
const layoutDir = path.join(workspace, "layout");
const qaDir = path.join(workspace, "qa");
const outputDir = path.join(ROOT, "docs", "transferai-prospection");
const finalPptx = path.join(outputDir, "TransferAI_Presentation_Entreprise_2026-05-22_Confidentialite.pptx");
const buildScript = path.join(SKILL_DIR, "scripts", "build_artifact_deck.mjs");
const layoutCheck = path.join(SKILL_DIR, "scripts", "check_layout_quality.mjs");

function run(command, args, label) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error([label, result.stdout, result.stderr].filter(Boolean).join("\n"));
  }
  return result.stdout;
}

async function main() {
  await fs.mkdir(previewDir, { recursive: true });
  await fs.mkdir(layoutDir, { recursive: true });
  await fs.mkdir(qaDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  await fs.writeFile(
    path.join(workspace, "profile-plan.txt"),
    [
      "task mode: create",
      "primary deck-profile: strategy-leadership",
      "secondary profile gates: gtm-growth, engineering-platform",
      "required proof objects: service offer, commercial CTA, confidentiality chapter, custom-LLM design logic",
      "source/asset requirements: existing enterprise deck and internal data-governance argumentaire only",
      "known missing inputs: no external brand reference deck supplied",
    ].join("\n"),
    "utf8",
  );

  await fs.writeFile(
    path.join(workspace, "claim-spine.txt"),
    [
      "1. TransferAI Africa should present a clear entry point through audit and advisory.",
      "2. Trust increases when confidentiality and governance are explained as design choices, not slogans.",
      "3. A custom LLM offer becomes credible when framed by data filtering, access control and human review.",
    ].join("\n"),
    "utf8",
  );

  await fs.writeFile(
    path.join(workspace, "design-system.txt"),
    [
      "palette: ivory background, deep navy, orange accent, soft green highlight",
      "type: Aptos Display for headlines, Aptos for body",
      "layout rhythm: editorial panels, spacious cards, strong CTA then trust chapter",
    ].join("\n"),
    "utf8",
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
      "12",
    ],
    "Deck build failed",
  );

  const layoutFiles = (await fs.readdir(layoutDir))
    .filter((name) => name.endsWith(".json"))
    .sort();

  let qaLog = "";
  for (const file of layoutFiles) {
    const fullPath = path.join(layoutDir, file);
    qaLog += `## ${file}\n`;
    qaLog += run(NODE_BIN, [layoutCheck, "--layout", fullPath], `Layout check failed for ${file}`);
    qaLog += "\n";
  }

  await fs.writeFile(path.join(qaDir, "layout-scorecard.txt"), qaLog, "utf8");
  console.log(finalPptx);
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
