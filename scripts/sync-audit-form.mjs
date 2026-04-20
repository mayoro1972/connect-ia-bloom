import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const envAuditDistDir = process.env.AUDIT_FORM_DIST_DIR ? resolve(process.env.AUDIT_FORM_DIST_DIR) : null;
const auditDistCandidates = [
  envAuditDistDir,
  resolve(rootDir, "..", "formulaire-audit-ia", "dist"),
  resolve(rootDir, "..", "formulaire-audit-ia-2", "dist"),
  resolve(rootDir, "..", "..", "Playground", "formulaire-audit-ia", "dist"),
].filter(Boolean);
const auditDistDir = auditDistCandidates.find((candidate) => candidate && existsSync(candidate));
const publicAuditDir = resolve(rootDir, "public", "formulaire-audit-ia");

if (!auditDistDir) {
  throw new Error(
    `Audit form build not found. Checked: ${auditDistCandidates.join(", ")}. Build the audit form first or set AUDIT_FORM_DIST_DIR.`,
  );
}

rmSync(publicAuditDir, { recursive: true, force: true });
mkdirSync(publicAuditDir, { recursive: true });
cpSync(auditDistDir, publicAuditDir, { recursive: true });

console.log(`Synced audit form into ${publicAuditDir}`);
