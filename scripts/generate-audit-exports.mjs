import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "docs", "transferai-audit");
const wordDir = path.join(docsDir, "word");
const pdfDir = path.join(docsDir, "pdf");
const DATE_STAMP = "2026-04-12";

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const loadAuditContent = () => {
  const filePath = path.join(rootDir, "src", "data", "audit-offer-content.ts");
  let source = fs.readFileSync(filePath, "utf8");

  source = source.replace(/export type [\s\S]*?\n};\n\n/g, "");
  source = source.replace(
    "const text = (fr: string, en: string): LocalizedText => ({ fr, en });",
    "const text = (fr, en) => ({ fr, en });"
  );
  source = source.replace("export const auditOfferContent =", "const auditOfferContent =");
  source = source.replace("export const auditDomainMessages: AuditDomainMessage[] =", "const auditDomainMessages =");
  source = source.replace("export const auditMessagesByDomain =", "const auditMessagesByDomain =");
  source += "\nreturn { auditOfferContent, auditDomainMessages, auditMessagesByDomain };";

  return Function(source)();
};

const { auditOfferContent, auditDomainMessages } = loadAuditContent();

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const renderStyles = () => `
  <style>
    @page { size: A4; margin: 18mm 14mm; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      background: #f7f6f2;
      color: #1f2a44;
      line-height: 1.58;
    }
    main { max-width: 980px; margin: 0 auto; padding: 24px; }
    .cover, .card {
      background: #ffffff;
      border: 1px solid #e8dcc9;
      border-radius: 24px;
      box-shadow: 0 18px 50px rgba(31, 42, 68, 0.06);
      padding: 28px;
      margin-bottom: 18px;
    }
    .cover {
      background: linear-gradient(180deg, #fffdf8 0%, #ffffff 100%);
    }
    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 12px;
      font-weight: 700;
      color: #ff7a1a;
      margin: 0 0 10px;
    }
    h1, h2, h3, h4 {
      color: #1d2640;
      margin: 0 0 10px;
    }
    h1 {
      font-size: 34px;
      line-height: 1.08;
    }
    h2 { font-size: 25px; margin-top: 22px; }
    h3 { font-size: 19px; }
    h4 { font-size: 16px; }
    p, li { font-size: 14px; }
    .muted { color: #60708b; }
    .stats, .triple, .double, .sector-grid {
      display: grid;
      gap: 14px;
    }
    .stats { grid-template-columns: repeat(3, 1fr); margin-top: 18px; }
    .triple { grid-template-columns: repeat(3, 1fr); }
    .double { grid-template-columns: repeat(2, 1fr); }
    .sector-grid { grid-template-columns: repeat(2, 1fr); margin-top: 18px; }
    .mini {
      background: #fff8ef;
      border: 1px solid #f3debf;
      border-radius: 18px;
      padding: 16px;
    }
    .stat strong {
      display: block;
      font-size: 24px;
      margin-bottom: 6px;
    }
    ul { margin: 10px 0 0 18px; padding: 0; }
    li { margin-bottom: 6px; }
    .cta-box {
      background: linear-gradient(135deg, #fff8ef, #fffdf8);
      border: 1px solid #f3debf;
    }
    .email-card {
      background: #ffffff;
      border: 1px solid #e8dcc9;
      border-radius: 20px;
      padding: 22px;
      margin-bottom: 18px;
      page-break-inside: avoid;
    }
    .email-meta {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 8px 14px;
      margin: 16px 0;
      font-size: 14px;
    }
    .email-meta strong {
      color: #1d2640;
    }
    .page-break { page-break-before: always; }
  </style>
`;

const onePagerHtml = `
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>TransferAI Africa - One Pager Audit IA Entreprise ${DATE_STAMP}</title>
    ${renderStyles()}
  </head>
  <body>
    <main>
      <section class="cover">
        <p class="eyebrow">TransferAI Africa · Audit IA gratuit</p>
        <h1>${escapeHtml(auditOfferContent.heroTitle.fr)}</h1>
        <p class="muted">${escapeHtml(auditOfferContent.heroLead.fr)}</p>
        <div class="stats">
          <div class="mini stat"><strong>100%</strong>gratuit et sans engagement</div>
          <div class="mini stat"><strong>13</strong>angles métier prêts à activer</div>
          <div class="mini stat"><strong>30 / 60 / 90</strong>jours pour cadrer la suite</div>
        </div>
      </section>

      <section class="card">
        <p class="eyebrow">${escapeHtml(auditOfferContent.whyTitle.fr)}</p>
        <div class="triple">
          ${auditOfferContent.whyItems
            .map(
              (item) => `
                <div class="mini">
                  <h3>${escapeHtml(item.title.fr)}</h3>
                  <p>${escapeHtml(item.desc.fr)}</p>
                </div>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="card">
        <p class="eyebrow">${escapeHtml(auditOfferContent.deliverablesTitle.fr)}</p>
        <div class="double">
          <div>
            <h3>Ce que l'entreprise reçoit</h3>
            <ul>
              ${auditOfferContent.deliverables.fr.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h3>Comment cela aide à décider</h3>
            <ul>
              <li>Voir clair avant d'acheter des outils.</li>
              <li>Prioriser les cas d'usage à ROI rapide.</li>
              <li>Identifier la bonne suite : formation, certification, accompagnement ou automatisation.</li>
              <li>Parler business, usages et résultats avant technologie.</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="card">
        <p class="eyebrow">${escapeHtml(auditOfferContent.processTitle.fr)}</p>
        <div class="triple">
          ${auditOfferContent.processSteps
            .map(
              (step) => `
                <div class="mini">
                  <p class="eyebrow">${escapeHtml(step.step)}</p>
                  <h3>${escapeHtml(step.title.fr)}</h3>
                  <p>${escapeHtml(step.desc.fr)}</p>
                </div>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="card">
        <p class="eyebrow">${escapeHtml(auditOfferContent.sectorsTitle.fr)}</p>
        <p class="muted">${escapeHtml(auditOfferContent.sectorsLead.fr)}</p>
        <div class="sector-grid">
          ${auditDomainMessages
            .map(
              (sector) => `
                <div class="mini">
                  <h3>${escapeHtml(sector.domain.fr)}</h3>
                  <p class="muted">${escapeHtml(sector.audience.fr)}</p>
                  <p>${escapeHtml(sector.whyAuditMatters.fr)}</p>
                </div>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="card cta-box">
        <p class="eyebrow">${escapeHtml(auditOfferContent.ctaTitle.fr)}</p>
        <h2>Commencer par un audit IA gratuit</h2>
        <p>${escapeHtml(auditOfferContent.ctaDesc.fr)}</p>
        <ul>
          <li>Point d'entrée idéal pour les entreprises encore en phase de cadrage.</li>
          <li>Document partageable avec direction, RH, transformation, métiers ou DSI.</li>
          <li>Complément naturel du catalogue et des certifications sectorielles.</li>
        </ul>
      </section>
    </main>
  </body>
</html>
`;

const emailMarkdown = `# Emails sectoriels Audit IA · TransferAI Africa

Version générée le ${DATE_STAMP}.  
Chaque email est prêt à être utilisé dans un workflow de prospection, de relance ou d'automatisation.

${auditDomainMessages
  .map(
    (sector, index) => `## ${index + 1}. ${sector.domain.fr}

**Objet**  
${sector.emailSubject.fr}

**Préheader**  
${sector.emailPreheader.fr}

**Corps**

Bonjour {{first_name}},

${sector.emailBody.intro.fr}

${sector.emailBody.diagnostic.fr}

${sector.emailBody.benefitsLead.fr}

${sector.emailBody.benefits.map((item) => `- ${item.fr}`).join("\n")}

${sector.emailBody.close.fr}

${sector.cta.fr}

Bien cordialement,  
TransferAI Africa
`
  )
  .join("\n")}
`;

const emailHtml = `
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>TransferAI Africa - Emails sectoriels Audit IA ${DATE_STAMP}</title>
    ${renderStyles()}
  </head>
  <body>
    <main>
      <section class="cover">
        <p class="eyebrow">TransferAI Africa · Emails sectoriels</p>
        <h1>13 emails prêts à envoyer autour de l'audit IA gratuit</h1>
        <p class="muted">
          Ce pack regroupe les messages FR à utiliser pour la prospection, la relance, le suivi inbound ou
          l'automatisation sectorielle autour de l'offre Audit IA Gratuit.
        </p>
      </section>

      ${auditDomainMessages
        .map(
          (sector, index) => `
            <section class="email-card ${index === 0 ? "" : "page-break"}">
              <p class="eyebrow">${escapeHtml(sector.domain.fr)}</p>
              <h2>${escapeHtml(sector.audience.fr)}</h2>
              <div class="email-meta">
                <strong>Objet</strong><span>${escapeHtml(sector.emailSubject.fr)}</span>
                <strong>Préheader</strong><span>${escapeHtml(sector.emailPreheader.fr)}</span>
                <strong>CTA</strong><span>${escapeHtml(sector.cta.fr)}</span>
              </div>

              <div class="mini">
                <p><strong>Bonjour {{first_name}},</strong></p>
                <p>${escapeHtml(sector.emailBody.intro.fr)}</p>
                <p>${escapeHtml(sector.emailBody.diagnostic.fr)}</p>
                <p><strong>${escapeHtml(sector.emailBody.benefitsLead.fr)}</strong></p>
                <ul>
                  ${sector.emailBody.benefits
                    .map((item) => `<li>${escapeHtml(item.fr)}</li>`)
                    .join("")}
                </ul>
                <p>${escapeHtml(sector.emailBody.close.fr)}</p>
                <p><strong>${escapeHtml(sector.cta.fr)}</strong></p>
                <p>Bien cordialement,<br>TransferAI Africa</p>
              </div>
            </section>
          `
        )
        .join("")}
    </main>
  </body>
</html>
`;

const automationJson = JSON.stringify(
  auditDomainMessages.map((sector) => ({
    domain_key: sector.key,
    domain_label_fr: sector.domain.fr,
    domain_label_en: sector.domain.en,
    audience_fr: sector.audience.fr,
    audience_en: sector.audience.en,
    email_subject_fr: sector.emailSubject.fr,
    email_subject_en: sector.emailSubject.en,
    email_preheader_fr: sector.emailPreheader.fr,
    email_preheader_en: sector.emailPreheader.en,
    body_intro_fr: sector.emailBody.intro.fr,
    body_intro_en: sector.emailBody.intro.en,
    body_diagnostic_fr: sector.emailBody.diagnostic.fr,
    body_diagnostic_en: sector.emailBody.diagnostic.en,
    body_benefits_lead_fr: sector.emailBody.benefitsLead.fr,
    body_benefits_lead_en: sector.emailBody.benefitsLead.en,
    body_benefits_fr: sector.emailBody.benefits.map((item) => item.fr),
    body_benefits_en: sector.emailBody.benefits.map((item) => item.en),
    body_close_fr: sector.emailBody.close.fr,
    body_close_en: sector.emailBody.close.en,
    cta_fr: sector.cta.fr,
    cta_en: sector.cta.en,
    suggested_channel: "email",
    status: "ready",
  })),
  null,
  2
);

const integrationMarkdown = `# Intégration technique · Audit IA Gratuit

## Objectif

Connecter la page Audit IA, le one-pager entreprise, les emails sectoriels et une future automatisation dans le site et le back-office.

## Source de vérité locale

- Référentiel principal : \`src/data/audit-offer-content.ts\`
- Page publique : \`src/pages/AuditIA.tsx\`
- Route publique : \`/audit-ia-gratuit\`
- Exports documentaires : \`docs/transferai-audit/\`

## Base de données recommandée dans Supabase

### 1. \`audit_domain_templates\`
- \`id\` uuid primary key
- \`domain_key\` text unique
- \`domain_label_fr\` text
- \`domain_label_en\` text
- \`audience_fr\` text
- \`audience_en\` text
- \`email_subject_fr\` text
- \`email_subject_en\` text
- \`email_preheader_fr\` text
- \`email_preheader_en\` text
- \`body_intro_fr\` text
- \`body_intro_en\` text
- \`body_diagnostic_fr\` text
- \`body_diagnostic_en\` text
- \`body_benefits_lead_fr\` text
- \`body_benefits_lead_en\` text
- \`body_benefits_fr\` jsonb
- \`body_benefits_en\` jsonb
- \`body_close_fr\` text
- \`body_close_en\` text
- \`cta_fr\` text
- \`cta_en\` text
- \`updated_at\` timestamptz

### 2. \`audit_enterprise_leads\`
- \`id\` uuid primary key
- \`created_at\` timestamptz
- \`full_name\` text
- \`email\` text
- \`phone\` text
- \`company\` text
- \`role\` text
- \`country\` text
- \`domain_key\` text
- \`sector_context\` text
- \`audit_need\` text
- \`status\` text default 'received'
- \`assigned_to\` text null
- \`notes\` text null

### 3. \`audit_email_runs\`
- \`id\` uuid primary key
- \`lead_id\` uuid references \`audit_enterprise_leads(id)\`
- \`domain_key\` text
- \`template_id\` uuid references \`audit_domain_templates(id)\`
- \`language\` text default 'fr'
- \`delivery_type\` text
- \`status\` text
- \`sent_at\` timestamptz null
- \`error_message\` text null

## Edge functions recommandées

### 1. \`audit-email-preview\`
But :
- prendre \`lead_id\` et \`domain_key\`
- injecter le template domaine
- produire un sujet, préheader et corps final personnalisés

### 2. \`audit-email-send\`
But :
- envoyer le mail réel au prospect
- journaliser l'envoi dans \`audit_email_runs\`

### 3. \`audit-weekly-followup\`
But :
- relancer automatiquement les leads audit non traités ou non convertis
- utiliser un modèle plus court orienté reprise de contact

## Back-office recommandé

Ajouter un onglet \`Audit IA\` avec :
- demandes reçues
- messages par domaine
- aperçu email
- envoi test
- envoi réel
- historique des relances

## Automatisation recommandée

### Niveau 1
- humain valide
- système envoie

### Niveau 2
- IA prépare un brouillon sectoriel
- humain ajuste
- système envoie

### Niveau 3
- planification hebdomadaire
- relances automatiques sur domaines prioritaires
- journal des performances d'ouverture et de clics

## Logique de conversion recommandée

1. page publique \`/audit-ia-gratuit\`
2. formulaire audit
3. accusé de réception
4. email sectoriel adapté
5. proposition de rendez-vous ou cadrage
6. orientation vers formation, certification ou accompagnement
`;

const indexMarkdown = `# TransferAI Africa · Audit IA Gratuit

Pack généré le ${DATE_STAMP}.

## Fichiers

- One-pager HTML : \`01_OnePager_Audit_Entreprise_${DATE_STAMP}.html\`
- Emails sectoriels HTML : \`02_Emails_Sectoriels_TransferAI_${DATE_STAMP}.html\`
- Emails sectoriels Markdown : \`02_Emails_Sectoriels_TransferAI.md\`
- Intégration technique : \`03_Integration_Technique_Audit_BackOffice.md\`
- Base messages automation : \`04_Audit_Domain_Message_DB.json\`
- Word : \`word/TransferAI_Africa_Audit_OnePager_${DATE_STAMP}.docx\`
- PDF : \`pdf/TransferAI_Africa_Audit_OnePager_${DATE_STAMP}.pdf\`
- Word emails : \`word/TransferAI_Africa_Audit_Emails_${DATE_STAMP}.docx\`
`;

ensureDir(docsDir);
ensureDir(wordDir);
ensureDir(pdfDir);

fs.writeFileSync(path.join(docsDir, "00_INDEX.md"), indexMarkdown, "utf8");
fs.writeFileSync(path.join(docsDir, `01_OnePager_Audit_Entreprise_${DATE_STAMP}.html`), onePagerHtml, "utf8");
fs.writeFileSync(path.join(docsDir, `02_Emails_Sectoriels_TransferAI_${DATE_STAMP}.html`), emailHtml, "utf8");
fs.writeFileSync(path.join(docsDir, "02_Emails_Sectoriels_TransferAI.md"), emailMarkdown, "utf8");
fs.writeFileSync(path.join(docsDir, "03_Integration_Technique_Audit_BackOffice.md"), integrationMarkdown, "utf8");
fs.writeFileSync(path.join(docsDir, "04_Audit_Domain_Message_DB.json"), automationJson, "utf8");

console.log(`Audit exports generated in ${docsDir}`);
