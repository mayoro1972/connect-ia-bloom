import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const THREAD_ID = process.env.CODEX_THREAD_ID || "manual-cofounders";
const SKILL_DIR = "/Users/marius_ayoro/.codex/plugins/cache/openai-primary-runtime/presentations/26.506.11943/skills/presentations";
const NODE_BIN = "/Users/marius_ayoro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node";

const workspace = path.join(ROOT, "outputs", THREAD_ID, "presentations", "reunion-cofondateurs-10min");
const slidesDir = path.join(ROOT, "scripts", "presentations", "cofounders-10min");
const previewDir = path.join(workspace, "preview");
const layoutDir = path.join(workspace, "layout");
const outputDir = path.join(ROOT, "docs", "transferai-prospection");
const finalPptx = path.join(outputDir, "TransferAI_Reunion_CoFondateurs_10min_2026-05-16.pptx");
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
  await fs.mkdir(outputDir, { recursive: true });

  run(
    NODE_BIN,
    [
      buildScript,
      "--workspace", workspace,
      "--slides-dir", slidesDir,
      "--out", finalPptx,
      "--preview-dir", previewDir,
      "--layout-dir", layoutDir,
      "--slide-count", "6"
    ],
    "10-minute deck build failed"
  );

  const layoutFiles = (await fs.readdir(layoutDir)).filter((name) => name.endsWith(".json")).sort();
  for (const file of layoutFiles) {
    run(NODE_BIN, [layoutCheck, "--layout", path.join(layoutDir, file)], `Layout check failed for ${file}`);
  }

  console.log(finalPptx);
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
