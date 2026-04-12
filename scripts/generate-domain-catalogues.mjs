import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "docs", "transferai-catalogues", "domaines");
const publicDir = path.join(rootDir, "public", "catalogues-domaines-assets");
const DATE_STAMP = "2026-04-12";

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "et")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const loadFormations = () => {
  const filePath = path.join(rootDir, "src", "data", "formations.ts");
  let source = fs.readFileSync(filePath, "utf8");

  source = source.replace(/import .*?\n/g, "");
  source = source.replace(/export type Formation = \{[\s\S]*?\n\};\n\n/, "");
  source = source.replace("export const FORMATION_PRICE_ON_REQUEST =", "const FORMATION_PRICE_ON_REQUEST =");
  source = source.replace("const rawFormations: Formation[] = [", "const rawFormations = [");
  source = source.replace(
    "export const formations = deepFixMojibake(rawFormations) as Formation[];",
    "const formations = deepFixMojibake(rawFormations);"
  );
  source += "\nreturn { formations, FORMATION_PRICE_ON_REQUEST };";

  return Function("deepFixMojibake", source)((value) => value);
};

const loadCertificationProfiles = () => {
  const filePath = path.join(rootDir, "src", "data", "certification-curricula.ts");
  let source = fs.readFileSync(filePath, "utf8");

  source = source.replace(/export type LocalizedText = \{[\s\S]*?\n\};\n\n/, "");
  source = source.replace(/export type CertificationModule = \{[\s\S]*?\n\};\n\n/, "");
  source = source.replace(/export type CertificationDomainProfile = \{[\s\S]*?\n\};\n\n/, "");
  source = source.replace(
    "const text = (fr: string, en: string): LocalizedText => ({ fr, en });",
    "const text = (fr, en) => ({ fr, en });"
  );
  source = source.replace(
    "const list = (fr: string[], en: string[]) => ({ fr, en });",
    "const list = (fr, en) => ({ fr, en });"
  );
  source = source.replace("export const certificationMethodology =", "const certificationMethodology =");
  source = source.replace(
    "export const certificationDomainProfiles: CertificationDomainProfile[] = [",
    "const certificationDomainProfiles = ["
  );
  source = source.replace(
    "export const getCertificationDomainProfile = (slug?: string | null) =>",
    "const getCertificationDomainProfile = (slug) =>"
  );
  source = source.replace(/^export const /gm, "const ");
  source += "\nreturn { certificationMethodology, certificationDomainProfiles };";

  return Function(source)();
};

const loadCertificationMeta = () => {
  const filePath = path.join(rootDir, "src", "data", "certification-meta.ts");
  let source = fs.readFileSync(filePath, "utf8");

  source = source.replace(/export type CertificationMetaText = \{[\s\S]*?\n\};\n\n/, "");
  source = source.replace(/export type CertificationOfferMeta = \{[\s\S]*?\n\};\n\n/, "");
  source = source.replace(
    "const text = (fr: string, en: string): CertificationMetaText => ({ fr, en });",
    "const text = (fr, en) => ({ fr, en });"
  );
  source = source.replace(
    "export const baseCertificationOfferMeta: CertificationOfferMeta =",
    "const baseCertificationOfferMeta ="
  );
  source = source.replace(
    /export const certificationOfferOverrides: .*? = \{\};/,
    "const certificationOfferOverrides = {};"
  );
  source = source.replace(
    "export const getCertificationOfferMeta = (domainSlug?: string | null): CertificationOfferMeta => {",
    "const getCertificationOfferMeta = (domainSlug) => {"
  );
  source = source.replace(/^export const /gm, "const ");
  source += "\nreturn { getCertificationOfferMeta };";

  return Function(source)();
};

const loadDomainPreviews = () => {
  const filePath = path.join(rootDir, "src", "lib", "catalogue-preview.ts");
  let source = fs.readFileSync(filePath, "utf8");

  source = source.split("type LocalizedDomainContent =")[0];

  source = source.replace(/import .*?\n/g, "");
  source = source.replace(/export type DomainPreview = \{[\s\S]*?\n\};\n\n/, "");
  source = source.replace(
    "const domainPreviewContent: Omit<DomainPreview, \"slug\">[] = [",
    "const domainPreviewContent = ["
  );
  source = source.replace(
    "export const domainPreviews: DomainPreview[] = domainPreviewContent.map((item) => ({",
    "const domainPreviews = domainPreviewContent.map((item) => ({"
  );
  source = source.replace(
    "export const domainPreviewMap = new Map(domainPreviews.map((item) => [item.domain, item]));",
    "const domainPreviewMap = new Map(domainPreviews.map((item) => [item.domain, item]));"
  );
  source = source.replace(
    "export const domainPreviewSlugMap = new Map(domainPreviews.map((item) => [item.slug, item]));",
    "const domainPreviewSlugMap = new Map(domainPreviews.map((item) => [item.slug, item]));"
  );
  source = source.replace(/^export const /gm, "const ");
  source += "\nreturn { domainPreviews };";

  return Function("formations", "slugifySiteValue", "language", source)([], slugify, "fr");
};

const { formations } = loadFormations();
const { certificationDomainProfiles } = loadCertificationProfiles();
const { getCertificationOfferMeta } = loadCertificationMeta();
const { domainPreviews } = loadDomainPreviews();

const canonicalSlugMap = {
  "data-et-analyse": "data-analyse",
};

const certificationByDomain = new Map(
  certificationDomainProfiles.map((profile) => [slugify(profile.domainKey), profile])
);

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
      line-height: 1.6;
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
    .cover { background: linear-gradient(180deg, #fffdf8 0%, #ffffff 100%); }
    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 12px;
      font-weight: 700;
      color: #ff7a1a;
      margin: 0 0 10px;
    }
    h1, h2, h3, h4 { color: #1d2640; margin: 0 0 10px; }
    h1 { font-size: 34px; line-height: 1.08; }
    h2 { font-size: 24px; }
    h3 { font-size: 18px; }
    h4 { font-size: 15px; }
    p, li, td, th { font-size: 14px; }
    .muted { color: #60708b; }
    .two-col, .triple {
      display: grid;
      gap: 16px;
    }
    .two-col { grid-template-columns: repeat(2, 1fr); }
    .triple { grid-template-columns: repeat(3, 1fr); }
    .mini {
      background: #fff8ef;
      border: 1px solid #f3debf;
      border-radius: 18px;
      padding: 16px;
    }
    .badge-row { display:flex; flex-wrap:wrap; gap:8px; margin: 12px 0 0; }
    .badge {
      display:inline-flex;
      align-items:center;
      border: 1px solid #e5d5bd;
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      color: #1d2640;
      background: #fffdfa;
    }
    .catalogue-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
    }
    .catalogue-table th, .catalogue-table td {
      border: 1px solid #e8dcc9;
      padding: 10px 12px;
      vertical-align: top;
      text-align: left;
    }
    .catalogue-table th {
      background: #fff8ef;
      color: #1d2640;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .timeline { display:grid; gap:12px; margin-top: 12px; }
    .timeline-item {
      display:grid;
      grid-template-columns: 90px 1fr;
      gap: 14px;
      padding: 14px;
      border: 1px solid #e8dcc9;
      border-radius: 16px;
      background: #fffdfa;
    }
    .timeline-day {
      font-size: 12px;
      font-weight: 700;
      color: #ff7a1a;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .page-break { page-break-before: always; }
    .page-break-inside-avoid { page-break-inside: avoid; }
  </style>
`;

const parseDurationDays = (duration) => {
  const match = duration.match(/(\d+)/);
  return match ? Number(match[1]) : 1;
};

const getCourseObjectives = (formation) => {
  const mainTag = formation.tags[0] ?? "IA";
  const secondaryTag = formation.tags[1] ?? formation.tags[0] ?? "productivité";

  return [
    `Comprendre les usages de ${mainTag} appliqués au domaine ${formation.metier}.`,
    `Mettre en pratique ${secondaryTag.toLowerCase()} sur des cas concrets liés à « ${formation.title} ».`,
    "Repartir avec une méthode de travail, des prompts utiles et des livrables directement transférables en entreprise.",
  ];
};

const getCourseProgram = (formation) => {
  const days = parseDurationDays(formation.duration);
  const tagText = formation.tags.slice(0, 2).join(" / ");
  const dayTemplates = {
    1: [
      `Cadrage métier, fondamentaux, démonstrations guidées et atelier express autour de ${tagText || formation.title}.`,
    ],
    2: [
      `Jour 1 : cadrage des cas d'usage, prise en main des outils et premières productions autour de ${formation.title}.`,
      `Jour 2 : ateliers pratiques, structuration des livrables et plan d'application immédiate dans l'entreprise.`,
    ],
    3: [
      `Jour 1 : cadrage métier, fondamentaux et critères de qualité pour ${formation.title}.`,
      `Jour 2 : ateliers guidés, prompts, workflows et exercices appliqués aux priorités terrain.`,
      `Jour 3 : cas fil rouge, livrables finaux, validation et feuille de route de déploiement.`,
    ],
  };

  if (dayTemplates[days]) {
    return dayTemplates[days];
  }

  return Array.from({ length: days }, (_, index) => `Jour ${index + 1} : atelier et application progressive de ${formation.title}.`);
};

const renderList = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;

const renderFormationTable = (formationsForDomain) => `
  <table class="catalogue-table">
    <thead>
      <tr>
        <th>Formation</th>
        <th>Niveau</th>
        <th>Format</th>
        <th>Durée</th>
        <th>Repères</th>
      </tr>
    </thead>
    <tbody>
      ${formationsForDomain
        .map(
          (formation) => `
            <tr>
              <td><strong>${escapeHtml(formation.title)}</strong></td>
              <td>${escapeHtml(formation.level)}</td>
              <td>${escapeHtml(formation.format)}</td>
              <td>${escapeHtml(formation.duration)}</td>
              <td>${escapeHtml(formation.tags.join(" · "))}</td>
            </tr>`
        )
        .join("")}
    </tbody>
  </table>
`;

const renderCertificationBlock = (profile) => {
  const offerMeta = getCertificationOfferMeta(profile.slug);

  return `
    <section class="card page-break-inside-avoid">
      <p class="eyebrow">Certification sectorielle</p>
      <h2>${escapeHtml(profile.label.fr)}</h2>
      <p>${escapeHtml(profile.companyPitch.fr)}</p>
      <div class="two-col">
        <div class="mini"><strong>Durée</strong><br>${escapeHtml(offerMeta.durationValue.fr)}</div>
        <div class="mini"><strong>Format</strong><br>${escapeHtml(offerMeta.formatValue.fr)}</div>
        <div class="mini"><strong>Lieu</strong><br>${escapeHtml(offerMeta.locationValue.fr)}</div>
        <div class="mini"><strong>Tarif</strong><br>${escapeHtml(offerMeta.price.fr)}</div>
      </div>
      <div class="two-col" style="margin-top:16px;">
        <div>
          <h3>Objectifs</h3>
          ${renderList(profile.objectives.fr)}
        </div>
        <div>
          <h3>Résultats attendus</h3>
          ${renderList(profile.businessOutcomes.fr)}
        </div>
      </div>
      <div style="margin-top:16px;">
        <h3>Programme 5 jours</h3>
        <div class="timeline">
          ${profile.program
            .map(
              (day) => `
                <div class="timeline-item">
                  <div class="timeline-day">Jour ${day.day}</div>
                  <div>
                    <strong>${escapeHtml(day.title.fr)}</strong>
                    <p>${escapeHtml(day.summary.fr)}</p>
                  </div>
                </div>`
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
};

const renderFormationSheet = (formation) => `
  <section class="card page-break-inside-avoid">
    <p class="eyebrow">${escapeHtml(formation.metier)}</p>
    <h3>${escapeHtml(formation.title)}</h3>
    <p class="muted"><strong>Niveau :</strong> ${escapeHtml(formation.level)} · <strong>Format :</strong> ${escapeHtml(formation.format)} · <strong>Durée :</strong> ${escapeHtml(formation.duration)}</p>
    <div class="badge-row">
      ${formation.tags.map((tag) => `<span class="badge">${escapeHtml(tag)}</span>`).join("")}
    </div>
    <div class="two-col" style="margin-top:16px;">
      <div>
        <h4>Objectifs pédagogiques</h4>
        ${renderList(getCourseObjectives(formation))}
      </div>
      <div>
        <h4>Programme</h4>
        ${renderList(getCourseProgram(formation))}
      </div>
    </div>
  </section>
`;

const domainEntries = domainPreviews.map((preview) => {
  const slug = canonicalSlugMap[preview.slug] ?? preview.slug;
  const formationsForDomain = formations.filter((formation) => {
    const formationSlug = canonicalSlugMap[slugify(formation.metier)] ?? slugify(formation.metier);
    return formationSlug === slug;
  });
  const certification = certificationByDomain.get(slug);
  return {
    ...preview,
    slug,
    formations: formationsForDomain,
    certification,
  };
});

const registry = [];

for (const domain of domainEntries) {
  const docsDomainDir = path.join(docsDir, domain.slug);
  const publicDomainDir = path.join(publicDir, domain.slug);
  ensureDir(docsDomainDir);
  ensureDir(publicDomainDir);

  const html = `
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>TransferAI Africa - Catalogue ${escapeHtml(domain.domain)} ${DATE_STAMP}</title>
    ${renderStyles()}
  </head>
  <body>
    <main>
      <section class="cover page-break-inside-avoid">
        <p class="eyebrow">TransferAI Africa · Catalogue domaine</p>
        <h1>${escapeHtml(domain.domain)}</h1>
        <p>${escapeHtml(domain.headline)}</p>
        <p class="muted">${escapeHtml(domain.summary)}</p>
      </section>

      <section class="card page-break-inside-avoid">
        <div class="two-col">
          <div>
            <h3>Profils concernés</h3>
            ${renderList(domain.audience)}
          </div>
          <div>
            <h3>Résultats attendus</h3>
            ${renderList(domain.outcomes)}
          </div>
        </div>
        <div class="two-col" style="margin-top:16px;">
          <div>
            <h3>Ce que contient le catalogue</h3>
            ${renderList(domain.deliverables)}
          </div>
          <div>
            <h3>Demandes typiques</h3>
            ${renderList(domain.requestFocus)}
          </div>
        </div>
      </section>

      <section class="card page-break-inside-avoid">
        <p class="eyebrow">Portefeuille du domaine</p>
        <h2>${domain.formations.length} formation(s) disponibles</h2>
        <p>Ce domaine regroupe des formations courtes, opérationnelles et prêtes à être déployées en inter ou en intra-entreprise.</p>
        ${renderFormationTable(domain.formations)}
      </section>

      ${domain.certification ? renderCertificationBlock(domain.certification) : ""}

      ${domain.formations.map((formation) => renderFormationSheet(formation)).join("")}
    </main>
  </body>
</html>
`;

  const datedBaseName = `TransferAI_Africa_Catalogue_${domain.slug}_${DATE_STAMP}`;
  fs.writeFileSync(path.join(docsDomainDir, `${datedBaseName}.html`), html, "utf8");
  fs.writeFileSync(path.join(publicDomainDir, "catalogue.html"), html, "utf8");

  registry.push({
    domain_key: domain.slug,
    domain_label_fr: domain.domain,
    domain_label_en: domain.domain,
    slug: domain.slug,
    version: DATE_STAMP,
    course_count: domain.formations.length,
    certification_slug: domain.certification?.slug ?? null,
    public_urls: {
      html: `/catalogues-domaines-assets/${domain.slug}/catalogue.html`,
      pdf: `/catalogues-domaines-assets/${domain.slug}/catalogue.pdf`,
      docx: `/catalogues-domaines-assets/${domain.slug}/catalogue.docx`,
      page: `/catalogues-domaines/${domain.slug}`,
    },
    storage_paths: {
      html: `catalogues-domaines-assets/${domain.slug}/catalogue.html`,
      pdf: `catalogues-domaines-assets/${domain.slug}/catalogue.pdf`,
      docx: `catalogues-domaines-assets/${domain.slug}/catalogue.docx`,
    },
  });
}

const indexMarkdown = `# Catalogues domaine TransferAI Africa

Exports générés le ${DATE_STAMP}.

## Objectif

Créer 13 catalogues domaine prêts à être envoyés automatiquement lorsqu'un prospect formule une demande précise.

## Emplacements

- Version publique : \`public/catalogues-domaines-assets/<slug>/\`
- Version documentation : \`docs/transferai-catalogues/domaines/<slug>/\`
- Registre JSON public : \`public/catalogues-domaines-assets/catalogue-assets.json\`
- Registre JSON docs : \`docs/transferai-catalogues/domaines/catalogue-assets.json\`
`;

fs.writeFileSync(path.join(docsDir, "00_INDEX.md"), indexMarkdown, "utf8");
fs.writeFileSync(path.join(docsDir, "catalogue-assets.json"), JSON.stringify(registry, null, 2), "utf8");
fs.writeFileSync(path.join(publicDir, "catalogue-assets.json"), JSON.stringify(registry, null, 2), "utf8");

console.log(`Domain catalogue exports generated in ${docsDir} and ${publicDir}`);
