#!/usr/bin/env node
/**
 * generate-catalogue-pdfs.mjs
 *
 * Régénère les 13 PDF des catalogues de domaines depuis les fichiers HTML
 * stockés dans public/catalogues-domaines-assets/<slug>/catalogue.html.
 *
 * Sortie : public/catalogues-domaines-pdf/<slug>.pdf
 *
 * Utilise Puppeteer (Chromium headless) pour produire des PDF propres,
 * sans en-tête/pied-de-page navigateur.
 *
 * Usage :
 *   npm run generate:catalogue-pdfs              # tous les domaines
 *   npm run generate:catalogue-pdfs -- <slug>    # un seul domaine
 */

import { readFile, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const SOURCE_DIR = path.join(ROOT, "public", "catalogues-domaines-assets");
const OUT_DIR = path.join(ROOT, "public", "catalogues-domaines-pdf");
const ASSETS_INDEX = path.join(SOURCE_DIR, "catalogue-assets.json");

const PDF_OPTIONS = {
  format: "A4",
  printBackground: true,
  margin: { top: "12mm", right: "12mm", bottom: "14mm", left: "12mm" },
  displayHeaderFooter: false,
  preferCSSPageSize: true,
};

async function loadDomains() {
  if (existsSync(ASSETS_INDEX)) {
    const raw = await readFile(ASSETS_INDEX, "utf8");
    const list = JSON.parse(raw);
    return list.map((entry) => entry.slug || entry.domain_key).filter(Boolean);
  }
  // Fallback : liste les sous-dossiers
  const entries = await readdir(SOURCE_DIR);
  const slugs = [];
  for (const entry of entries) {
    const full = path.join(SOURCE_DIR, entry);
    const s = await stat(full);
    if (s.isDirectory() && existsSync(path.join(full, "catalogue.html"))) {
      slugs.push(entry);
    }
  }
  return slugs;
}

async function loadPuppeteer() {
  try {
    return await import("puppeteer");
  } catch {
    console.error(
      "\n❌ Puppeteer n'est pas installé.\n" +
        "   Installe-le avec :  npm install --save-dev puppeteer\n",
    );
    process.exit(1);
  }
}

async function generatePdfForSlug(browser, slug) {
  const htmlPath = path.join(SOURCE_DIR, slug, "catalogue.html");
  if (!existsSync(htmlPath)) {
    console.warn(`⚠️  HTML introuvable pour "${slug}" → ${htmlPath}`);
    return false;
  }
  const outPath = path.join(OUT_DIR, `${slug}.pdf`);
  const fileUrl = pathToFileURL(htmlPath).href;

  const page = await browser.newPage();
  try {
    await page.emulateMediaType("print");
    await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 60_000 });
    // Petit délai pour fonts/images
    await new Promise((r) => setTimeout(r, 500));
    await page.pdf({ ...PDF_OPTIONS, path: outPath });
    console.log(`✅ ${slug}.pdf`);
    return true;
  } catch (err) {
    console.error(`❌ ${slug} : ${err.message}`);
    return false;
  } finally {
    await page.close();
  }
}

async function main() {
  const filterArg = process.argv[2];
  await mkdir(OUT_DIR, { recursive: true });

  let slugs = await loadDomains();
  if (filterArg) {
    slugs = slugs.filter((s) => s === filterArg);
    if (slugs.length === 0) {
      console.error(`❌ Aucun domaine trouvé pour "${filterArg}".`);
      process.exit(1);
    }
  }

  console.log(`📚 Régénération de ${slugs.length} catalogue(s) PDF…\n`);

  const puppeteer = await loadPuppeteer();
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let ok = 0;
  let fail = 0;
  try {
    for (const slug of slugs) {
      const success = await generatePdfForSlug(browser, slug);
      success ? ok++ : fail++;
    }
  } finally {
    await browser.close();
  }

  console.log(`\n📦 Terminé : ${ok} succès, ${fail} erreur(s).`);
  console.log(`📁 Sortie : ${path.relative(ROOT, OUT_DIR)}/`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error("❌ Erreur fatale :", err);
  process.exit(1);
});
