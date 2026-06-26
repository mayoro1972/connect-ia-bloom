import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { getMarketSectorDeckSpecs } from "./presentations/transferai-sector-decks/market-sector-specs.mjs";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const THREAD_ID = process.env.CODEX_THREAD_ID || "manual-20260613-transferai-market-sector-decks";
const SKILL_DIR =
  "/Users/marius_ayoro/.codex/plugins/cache/openai-primary-runtime/presentations/26.601.10930/skills/presentations";
const NODE_BIN = "/Users/marius_ayoro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node";

const slidesDir = path.join(ROOT, "scripts", "presentations", "transferai-sector-decks");
const buildScript = path.join(SKILL_DIR, "scripts", "build_artifact_deck.mjs");
const layoutCheck = path.join(SKILL_DIR, "scripts", "check_layout_quality.mjs");
const outputRoot = path.join(ROOT, "docs", "transferai-prospection", "decks-sectoriels-commerciaux-2026-06-13");
const outputDir = path.join(outputRoot, "pptx");
const onlySlugs = new Set(
  String(process.env.TRANSFERAI_SECTOR_ONLY || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

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

async function buildOneDeck(deckSpec) {
  const workspace = path.join(ROOT, "outputs", THREAD_ID, "presentations", deckSpec.slug);
  const previewDir = path.join(workspace, "preview");
  const layoutDir = path.join(workspace, "layout");
  const qaDir = path.join(workspace, "qa");
  const specPath = path.join(workspace, "spec.json");
  const finalPptx = path.join(outputDir, deckSpec.fileName);

  await fs.mkdir(previewDir, { recursive: true });
  await fs.mkdir(layoutDir, { recursive: true });
  await fs.mkdir(qaDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  await writeText(
    path.join(workspace, "profile-plan.txt"),
    [
      "task mode: create",
      "primary deck-profile: strategy-leadership",
      "secondary profile gates: gtm-growth, template-following",
      "required proof objects: sector pains, ROI hypotheses, use cases, 90-day path, trust framework, single CTA",
      "source/asset requirements: CRM sector mapping, domain catalogues, co-brand logo, reusable market-sector mapping",
      "known missing inputs: no prospect-specific company name inserted at this stage; this deck is reusable by commercial sector",
    ].join("\n"),
  );

  await writeText(
    path.join(workspace, "claim-spine.txt"),
    [
      `1. ${deckSpec.title} needs a sector-ready executive deck, not a generic catalogue.`,
      "2. The story must move from pain points to ROI hypotheses, then to use cases and a 90-day path.",
      "3. TransferAI must appear as a structure that audits, forms, governs and accompanies execution.",
      "4. The CTA remains a free AI audit followed by an expert exchange.",
    ].join("\n"),
  );

  await writeText(
    path.join(workspace, "design-system.txt"),
    [
      "palette: ivory background, deep navy, orange accent, teal secondary, gold trust accent",
      "type: Aptos Display for headlines, Aptos for body",
      "layout rhythm: editorial claims, dense but readable cards, premium whitespace, final dark CTA slide",
    ].join("\n"),
  );

  await fs.writeFile(specPath, JSON.stringify(deckSpec, null, 2), "utf8");

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
    `Deck build failed for ${deckSpec.title}`,
    { TRANSFERAI_SECTOR_SPEC: specPath },
  );

  const layoutFiles = (await fs.readdir(layoutDir))
    .filter((name) => name.endsWith(".json"))
    .sort();

  let qaLog = "";
  for (const file of layoutFiles) {
    const fullPath = path.join(layoutDir, file);
    qaLog += `## ${file}\n`;
    qaLog += run(NODE_BIN, [layoutCheck, "--layout", fullPath], `Layout QA failed for ${deckSpec.title}`, {
      TRANSFERAI_SECTOR_SPEC: specPath,
    });
    qaLog += "\n";
  }
  await fs.writeFile(path.join(qaDir, "layout-scorecard.txt"), qaLog, "utf8");

  return {
    title: deckSpec.title,
    slug: deckSpec.slug,
    fileName: deckSpec.fileName,
    output: finalPptx,
    sectors: deckSpec.crmSectors,
    courseCount: deckSpec.courseCount,
  };
}

async function writeIndex(results) {
  const nomenclature = [
    "# Nomenclature commerciale des decks sectoriels TransferAI",
    "",
    "Ces decks commerciaux s’appuient sur la logique V3, les catalogues par domaine et la lecture sectorielle du CRM TransferAI datée du 12 juin 2026.",
    "",
    "## Ce que contient chaque deck",
    "",
    "- une couverture orientée résultat",
    "- des irritants métier visibles",
    "- des hypothèses de ROI prudentes",
    "- quatre cas d’usage prioritaires",
    "- un parcours d’accompagnement sur 90 jours",
    "- une offre TransferAI en 4 briques",
    "- un cadre de confiance et un CTA unique",
    "",
    "## Fichiers commerciaux",
    "",
    ...results.flatMap((result, index) => [
      `${index + 1}. ${result.title}`,
      `   - PPTX : \`${result.fileName}\``,
      `   - Contextes proches : ${result.sectors.join(" ; ")}`,
    ]),
    "",
  ].join("\n");

  await writeText(path.join(outputRoot, "Nomenclature_Decks_Sectoriels_TransferAI_2026-06-13.md"), nomenclature);
}

async function main() {
  const allSpecs = await getMarketSectorDeckSpecs();
  const specs = onlySlugs.size > 0 ? allSpecs.filter((deckSpec) => onlySlugs.has(deckSpec.slug)) : allSpecs;
  const results = [];

  for (const deckSpec of specs) {
    results.push(await buildOneDeck(deckSpec));
  }

  await writeIndex(results);
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
