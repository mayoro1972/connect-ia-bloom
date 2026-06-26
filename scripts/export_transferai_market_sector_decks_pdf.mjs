import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const outputRoot = path.join(ROOT, "docs", "transferai-prospection", "decks-sectoriels-commerciaux-2026-06-13");
const pptxDir = path.join(outputRoot, "pptx");
const pdfDir = path.join(outputRoot, "pdf");
const appleScript = path.join(ROOT, "scripts", "export_powerpoint_to_pdf.applescript");

async function main() {
  await fs.mkdir(pdfDir, { recursive: true });
  const files = (await fs.readdir(pptxDir)).filter((name) => name.endsWith(".pptx")).sort();

  for (const file of files) {
    const input = path.join(pptxDir, file);
    const output = path.join(pdfDir, file.replace(/\.pptx$/i, ".pdf"));
    const result = spawnSync("osascript", [appleScript, input, output], {
      encoding: "utf8",
    });
    if (result.status !== 0) {
      throw new Error([`PDF export failed for ${file}`, result.stdout, result.stderr].filter(Boolean).join("\n"));
    }
    console.log(output);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
