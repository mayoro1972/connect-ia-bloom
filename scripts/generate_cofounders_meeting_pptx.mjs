import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const THREAD_ID = process.env.CODEX_THREAD_ID || "manual-cofounders";
const SKILL_DIR = "/Users/marius_ayoro/.codex/plugins/cache/openai-primary-runtime/presentations/26.506.11943/skills/presentations";
const NODE_BIN = "/Users/marius_ayoro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node";

const workspace = path.join(ROOT, "outputs", THREAD_ID, "presentations", "reunion-cofondateurs");
const slidesDir = path.join(ROOT, "scripts", "presentations", "cofounders");
const previewDir = path.join(workspace, "preview");
const layoutDir = path.join(workspace, "layout");
const qaDir = path.join(workspace, "qa");
const outputDir = path.join(ROOT, "docs", "transferai-prospection");
const finalPptx = path.join(outputDir, "TransferAI_Reunion_CoFondateurs_2026-05-16.pptx");
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
      "secondary profile gates: none",
      "required proof objects: priority matrix, top-domain cards, 90-day roadmap",
      "source/asset requirements: internal playbook and cofounders pack data only",
      "known missing inputs: no external reference deck provided"
    ].join("\n"),
    "utf8"
  );

  await fs.writeFile(
    path.join(workspace, "claim-spine.txt"),
    [
      "1. TransferAI a déjà 13 domaines, mais la croissance court terme doit se concentrer sur 5.",
      "2. Les domaines les plus vendeurs sont ceux qui rendent le ROI visible en moins de 90 jours.",
      "3. Le modèle commercial doit suivre une séquence simple : audit, bootcamp, pilote.",
      "4. Les 90 prochains jours doivent produire démonstrations, pipeline et premiers pilotes."
    ].join("\n"),
    "utf8"
  );

  await fs.writeFile(
    path.join(workspace, "design-system.txt"),
    [
      "palette: ivory, deep navy, orange accent, muted stone gray",
      "type: Aptos Display for headlines, Aptos for body",
      "layout rhythm: editorial blocks, high whitespace, no generic card wall"
    ].join("\n"),
    "utf8"
  );

  run(
    NODE_BIN,
    [
      buildScript,
      "--workspace", workspace,
     "--slides-dir", slidesDir,
      "--out", finalPptx,
      "--preview-dir", previewDir,
      "--layout-dir", layoutDir,
      "--slide-count", "9"
    ],
    "Deck build failed"
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

  await fs.writeFile(path.join(qaDir, "comeback-scorecard.txt"), qaLog, "utf8");
  console.log(finalPptx);
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
