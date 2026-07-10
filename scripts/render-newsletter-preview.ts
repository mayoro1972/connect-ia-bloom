import fs from "node:fs/promises";
import path from "node:path";
import { renderNewsletterHtml, type NewsletterIssueRecord } from "../supabase/functions/_shared/newsletter.ts";

const [inputArg, outputArg] = process.argv.slice(2);

if (!inputArg || !outputArg) {
  console.error("Usage: node --experimental-strip-types scripts/render-newsletter-preview.ts <input-json> <output-html>");
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputArg);
const outputPath = path.resolve(process.cwd(), outputArg);

const raw = await fs.readFile(inputPath, "utf8");
const issue = JSON.parse(raw) as NewsletterIssueRecord;
const html = renderNewsletterHtml(issue);

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, html, "utf8");

console.log(`Preview generated: ${outputPath}`);
