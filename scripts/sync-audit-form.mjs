import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const auditDistDir = resolve(rootDir, "..", "formulaire-audit-ia-2", "dist");
const publicAuditDir = resolve(rootDir, "public", "formulaire-audit-ia");

if (!existsSync(auditDistDir)) {
  throw new Error(
    `Audit form build not found at ${auditDistDir}. Run the audit form build first in ../formulaire-audit-ia-2.`,
  );
}

rmSync(publicAuditDir, { recursive: true, force: true });
mkdirSync(publicAuditDir, { recursive: true });
cpSync(auditDistDir, publicAuditDir, { recursive: true });

console.log(`Synced audit form into ${publicAuditDir}`);
