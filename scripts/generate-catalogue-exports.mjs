import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "docs", "transferai-catalogues");
const wordDir = path.join(docsDir, "word");
const pdfDir = path.join(docsDir, "pdf");

const DATE_STAMP = "2026-04-12";

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "et")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

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
  source += "\nreturn { baseCertificationOfferMeta, getCertificationOfferMeta };";

  return Function(source)();
};

const { formations } = loadFormations();
const { certificationMethodology, certificationDomainProfiles } = loadCertificationProfiles();
const { getCertificationOfferMeta } = loadCertificationMeta();

const certificationByDomain = new Map(
  certificationDomainProfiles.map((profile) => [slugify(profile.domainKey), profile])
);

const domains = certificationDomainProfiles.map((profile) => {
  const key = slugify(profile.domainKey);
  const domainFormations = formations.filter((formation) => slugify(formation.metier) === key);
  return {
    key,
    label: profile.label.fr,
    labelEn: profile.label.en,
    profile,
    formations: domainFormations,
    levelCounts: {
      debutant: domainFormations.filter((formation) => formation.level === "Débutant").length,
      intermediaire: domainFormations.filter((formation) => formation.level === "Intermédiaire").length,
      avance: domainFormations.filter((formation) => formation.level === "Avancé").length,
    },
  };
});

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

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const renderBadges = (items) =>
  items
    .map((item) => `<span class="badge">${escapeHtml(item)}</span>`)
    .join("");

const renderList = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;

const renderFormationTable = (domain) => `
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
      ${domain.formations
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
    <section class="cert-card">
      <p class="eyebrow">Certification sectorielle</p>
      <h3>${escapeHtml(profile.label.fr)}</h3>
      <p>${escapeHtml(profile.companyPitch.fr)}</p>
      <div class="meta-grid">
        <div><strong>Durée</strong><br>${escapeHtml(offerMeta.durationValue.fr)}</div>
        <div><strong>Format</strong><br>${escapeHtml(offerMeta.formatValue.fr)}</div>
        <div><strong>Lieu</strong><br>${escapeHtml(offerMeta.locationValue.fr)}</div>
        <div><strong>Tarif</strong><br>${escapeHtml(offerMeta.price.fr)}</div>
      </div>
      <div class="two-col">
        <div>
          <h4>Objectifs</h4>
          ${renderList(profile.objectives.fr)}
        </div>
        <div>
          <h4>Résultats attendus</h4>
          ${renderList(profile.businessOutcomes.fr)}
        </div>
      </div>
      <div>
        <h4>Programme 5 jours</h4>
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
  <section class="sheet card page-break-inside-avoid">
    <p class="eyebrow">${escapeHtml(formation.metier)}</p>
    <h3>${escapeHtml(formation.title)}</h3>
    <p class="muted"><strong>Niveau :</strong> ${escapeHtml(formation.level)} · <strong>Format :</strong> ${escapeHtml(formation.format)} · <strong>Durée :</strong> ${escapeHtml(formation.duration)}</p>
    <div class="badge-row">${renderBadges(formation.tags)}</div>
    <div class="two-col">
      <div>
        <h4>Objectifs pédagogiques</h4>
        ${renderList(getCourseObjectives(formation))}
      </div>
      <div>
        <h4>Programme jour par jour</h4>
        ${renderList(getCourseProgram(formation))}
      </div>
    </div>
  </section>
`;

const renderStyles = () => `
  <style>
    @page { size: A4; margin: 18mm 14mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      color: #1f2a44;
      line-height: 1.55;
      margin: 0;
      background: #f7f6f2;
    }
    main { max-width: 980px; margin: 0 auto; padding: 24px; }
    .cover, .card, .domain-block, .cert-card {
      background: #ffffff;
      border: 1px solid #e8dcc9;
      border-radius: 22px;
      box-shadow: 0 14px 40px rgba(31, 42, 68, 0.06);
    }
    .cover {
      padding: 36px;
      margin-bottom: 24px;
      background: linear-gradient(180deg, #fffdf8 0%, #ffffff 100%);
    }
    .cover h1 {
      font-size: 34px;
      line-height: 1.1;
      margin: 10px 0 14px;
    }
    .cover p {
      font-size: 17px;
      color: #53617d;
      margin: 0 0 14px;
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
    h2 { font-size: 28px; margin-top: 30px; }
    h3 { font-size: 23px; }
    h4 { font-size: 17px; margin-top: 14px; }
    p, li, td, th {
      font-size: 14px;
    }
    .muted { color: #62718d; }
    .intro-grid, .meta-grid, .two-col, .domain-grid {
      display: grid;
      gap: 16px;
    }
    .intro-grid { grid-template-columns: repeat(3, 1fr); margin-top: 18px; }
    .two-col { grid-template-columns: repeat(2, 1fr); }
    .domain-grid { grid-template-columns: 1.25fr 1fr; align-items: start; }
    .mini-card {
      background: #fff8ef;
      border: 1px solid #ffe0c0;
      border-radius: 18px;
      padding: 16px;
    }
    .domain-block, .card, .cert-card { padding: 24px; margin: 18px 0; }
    .badge-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 14px; }
    .badge {
      display: inline-flex;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid #e8dcc9;
      background: #fffdfa;
      font-size: 12px;
      font-weight: 600;
    }
    .catalogue-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .catalogue-table th, .catalogue-table td {
      padding: 10px 8px;
      border-bottom: 1px solid #ece8df;
      text-align: left;
      vertical-align: top;
    }
    .catalogue-table th {
      color: #53617d;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .timeline {
      display: grid;
      gap: 12px;
      margin-top: 10px;
    }
    .timeline-item {
      display: grid;
      grid-template-columns: 88px 1fr;
      gap: 14px;
      align-items: start;
      padding: 12px 14px;
      background: #fffaf4;
      border: 1px solid #f3debf;
      border-radius: 16px;
    }
    .timeline-day {
      font-weight: 700;
      color: #ff7a1a;
    }
    .summary-list {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 18px;
    }
    .summary-stat {
      background: #fff8ef;
      border: 1px solid #f3debf;
      border-radius: 18px;
      padding: 16px;
    }
    .summary-stat strong {
      display: block;
      font-size: 22px;
      color: #1d2640;
      margin-bottom: 6px;
    }
    .toc {
      columns: 2;
      gap: 24px;
      padding-left: 18px;
    }
    .toc li { margin-bottom: 6px; }
    .page-break { page-break-before: always; }
    .page-break-inside-avoid { page-break-inside: avoid; }
    .footer-note {
      margin-top: 28px;
      font-size: 12px;
      color: #6c7890;
    }
  </style>
`;

const renderMasterCatalogue = () => `
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>TransferAI Africa - Catalogue Master ${DATE_STAMP}</title>
    ${renderStyles()}
  </head>
  <body>
    <main>
      <section class="cover page-break-inside-avoid">
        <p class="eyebrow">TransferAI Africa · Catalogue Master</p>
        <h1>Catalogue complet des formations IA & certifications sectorielles</h1>
        <p>Document de référence structuré pour présenter l'ensemble de l'offre TransferAI Africa : 130+ formations classées par domaine, plus 13 certifications sectorielles détaillées.</p>
        <p>Version Word & PDF ready conçue pour diffusion, partage et personnalisation commerciale.</p>
        <div class="summary-list">
          <div class="summary-stat"><strong>${formations.length}</strong>formations listées</div>
          <div class="summary-stat"><strong>${domains.length}</strong>domaines couverts</div>
          <div class="summary-stat"><strong>${certificationDomainProfiles.length}</strong>certifications sectorielles</div>
          <div class="summary-stat"><strong>FR</strong>version prioritaire</div>
        </div>
      </section>

      <section class="card page-break-inside-avoid">
        <h2>Comment lire ce catalogue</h2>
        <div class="intro-grid">
          <div class="mini-card">
            <h4>Partie 1</h4>
            <p>Vue d'ensemble des domaines, du volume de formation et de la logique de certification.</p>
          </div>
          <div class="mini-card">
            <h4>Partie 2</h4>
            <p>Annexe pédagogique détaillée avec objectifs et trame jour par jour pour chaque formation.</p>
          </div>
          <div class="mini-card">
            <h4>Partie 3</h4>
            <p>Certifications sectorielles avec objectifs, résultats attendus et programme complet sur 5 jours.</p>
          </div>
        </div>
        <div class="footer-note">
          Note éditoriale : les certifications s'appuient sur un programme exact issu du référentiel. Les formations courtes sont présentées avec une trame pédagogique exploitable, structurée selon leur durée et leur objectif métier.
        </div>
      </section>

      <section class="card page-break-inside-avoid">
        <h2>Sommaire</h2>
        <ol class="toc">
          ${domains.map((domain) => `<li>${escapeHtml(domain.label)}</li>`).join("")}
          <li>Annexe A · Fiches pédagogiques des formations</li>
          <li>Annexe B · Certifications sectorielles</li>
        </ol>
      </section>

      <section class="page-break"></section>
      ${domains
        .map(
          (domain) => `
            <section class="domain-block page-break-inside-avoid">
              <p class="eyebrow">${escapeHtml(domain.label)}</p>
              <div class="domain-grid">
                <div>
                  <h3>${escapeHtml(domain.profile.shortPitch.fr)}</h3>
                  <p>${escapeHtml(domain.profile.companyPitch.fr)}</p>
                  <h4>Profils concernés</h4>
                  ${renderList(domain.profile.targetProfiles.fr)}
                </div>
                <div class="mini-card">
                  <h4>Repères rapides</h4>
                  <ul>
                    <li><strong>${domain.formations.length}</strong> formations dans ce domaine</li>
                    <li><strong>${domain.levelCounts.debutant}</strong> débutant · <strong>${domain.levelCounts.intermediaire}</strong> intermédiaire · <strong>${domain.levelCounts.avance}</strong> avancé</li>
                    <li>Certification sectorielle 5 jours disponible</li>
                    <li>Formats : présentiel, hybride et en ligne selon les modules</li>
                  </ul>
                </div>
              </div>
              <h4>Portefeuille de formations</h4>
              ${renderFormationTable(domain)}
              <div class="footer-note">
                Certification associée : ${escapeHtml(domain.profile.label.fr)} · ${escapeHtml(getCertificationOfferMeta(domain.profile.slug).durationValue.fr)} · ${escapeHtml(getCertificationOfferMeta(domain.profile.slug).price.fr)}
              </div>
            </section>`
        )
        .join("")}

      <section class="page-break"></section>
      <section class="card page-break-inside-avoid">
        <p class="eyebrow">Annexe A</p>
        <h2>Fiches pédagogiques des 130+ formations</h2>
        <p>Chaque fiche ci-dessous présente les objectifs et une trame jour par jour directement exploitable pour la préparation d'une brochure, d'une proposition ou d'un cadrage commercial.</p>
      </section>
      ${formations.map((formation) => renderFormationSheet(formation)).join("")}

      <section class="page-break"></section>
      <section class="card page-break-inside-avoid">
        <p class="eyebrow">Annexe B</p>
        <h2>Certifications sectorielles · objectifs et programme 5 jours</h2>
        <p>${escapeHtml(certificationMethodology.description.fr)}</p>
        ${renderList(certificationMethodology.points.fr)}
      </section>
      ${certificationDomainProfiles.map((profile) => renderCertificationBlock(profile)).join("")}

      <section class="card page-break-inside-avoid">
        <h2>Prochaine étape recommandée</h2>
        <p>Pour convertir plus vite ce catalogue, TransferAI Africa recommande de l'utiliser avec un audit IA gratuit, un échange d'orientation ou une demande de devis par domaine.</p>
        <ul>
          <li>Audit IA gratuit pour identifier les priorités métier.</li>
          <li>Envoi ciblé du domaine pertinent plutôt que du catalogue complet quand le prospect a déjà un besoin précis.</li>
          <li>Version entreprise à privilégier pour les DRH, directions générales, institutions et responsables transformation.</li>
        </ul>
      </section>
    </main>
  </body>
</html>
`;

const renderEnterpriseCatalogue = () => `
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>TransferAI Africa - Catalogue Entreprise ${DATE_STAMP}</title>
    ${renderStyles()}
  </head>
  <body>
    <main>
      <section class="cover page-break-inside-avoid">
        <p class="eyebrow">TransferAI Africa · Catalogue Entreprise</p>
        <h1>Catalogue entreprise des formations IA, certifications et trajectoires de déploiement</h1>
        <p>Version conçue pour les entreprises, institutions et directions métiers qui veulent comprendre rapidement les domaines, les bénéfices, les formats et la logique de montée en compétence TransferAI Africa.</p>
        <p>Ce document classe l'offre par domaine, met en avant les bénéfices business, puis rattache chaque certification à une logique claire d'impact, de livrables et de déploiement.</p>
      </section>

      <section class="card page-break-inside-avoid">
        <h2>Pourquoi partager cette version entreprise</h2>
        <div class="intro-grid">
          <div class="mini-card">
            <h4>Parler business avant outil</h4>
            <p>Chaque domaine est présenté par bénéfices, métiers concernés et résultats attendus.</p>
          </div>
          <div class="mini-card">
            <h4>Montrer la progression</h4>
            <p>Les entreprises voient la différence entre modules courts, montée en compétence et certification.</p>
          </div>
          <div class="mini-card">
            <h4>Faciliter la décision</h4>
            <p>Le document aide à choisir entre audit, formation ciblée, intra-entreprise et certification sectorielle.</p>
          </div>
        </div>
      </section>

      ${domains
        .map(
          (domain) => `
            <section class="domain-block page-break-inside-avoid">
              <p class="eyebrow">${escapeHtml(domain.label)}</p>
              <h2>${escapeHtml(domain.profile.label.fr)}</h2>
              <p>${escapeHtml(domain.profile.companyPitch.fr)}</p>
              <div class="two-col">
                <div>
                  <h4>Profils et équipes concernés</h4>
                  ${renderList(domain.profile.targetProfiles.fr)}
                  <h4>Objectifs de la montée en compétence</h4>
                  ${renderList(domain.profile.objectives.fr)}
                </div>
                <div>
                  <h4>Résultats business attendus</h4>
                  ${renderList(domain.profile.businessOutcomes.fr)}
                  <h4>Livrables visibles</h4>
                  ${renderList(domain.profile.deliverables.fr)}
                </div>
              </div>
              <h4>Portefeuille de formations disponibles</h4>
              ${renderFormationTable(domain)}
              ${renderCertificationBlock(domain.profile)}
            </section>
          `
        )
        .join("")}

      <section class="card page-break-inside-avoid">
        <h2>Modalités d'intervention recommandées</h2>
        <div class="two-col">
          <div>
            <h4>Formats possibles</h4>
            <ul>
              <li>Sessions inter-entreprises</li>
              <li>Formats intra-entreprise</li>
              <li>Parcours hybrides et cohortes</li>
              <li>Audit IA avant déploiement</li>
            </ul>
          </div>
          <div>
            <h4>Bon usage commercial</h4>
            <ul>
              <li>Commencer par le domaine métier principal.</li>
              <li>Utiliser la certification quand l'entreprise veut structurer une pratique durable.</li>
              <li>Utiliser l'audit gratuit pour clarifier les cas d'usage avant devis.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`;

const renderIndex = () => `
# Catalogues TransferAI Africa

Exports générés le ${DATE_STAMP}.

## Fichiers principaux

- HTML Word/PDF ready : \`TransferAI_Africa_Catalogue_Master_${DATE_STAMP}.html\`
- HTML Word/PDF ready : \`TransferAI_Africa_Catalogue_Entreprise_${DATE_STAMP}.html\`
- Word : \`word/TransferAI_Africa_Catalogue_Master_${DATE_STAMP}.docx\`
- Word : \`word/TransferAI_Africa_Catalogue_Entreprise_${DATE_STAMP}.docx\`
- PDF : \`pdf/TransferAI_Africa_Catalogue_Master_${DATE_STAMP}.pdf\`
- PDF : \`pdf/TransferAI_Africa_Catalogue_Entreprise_${DATE_STAMP}.pdf\`

## Logique éditoriale

- version master : catalogue complet classé par domaine avec annexe pédagogique détaillée
- version entreprise : angle business, résultats attendus, formats et certifications sectorielles
- données issues de \`src/data/formations.ts\`, \`src/data/certification-curricula.ts\` et \`src/data/certification-meta.ts\`

## Note

Les certifications utilisent leur programme exact sur 5 jours.  
Les formations courtes utilisent une trame pédagogique structurée par durée pour produire une version exportable immédiatement exploitable.
`;

const files = [
  {
    path: path.join(docsDir, `TransferAI_Africa_Catalogue_Master_${DATE_STAMP}.html`),
    content: renderMasterCatalogue(),
  },
  {
    path: path.join(docsDir, `TransferAI_Africa_Catalogue_Entreprise_${DATE_STAMP}.html`),
    content: renderEnterpriseCatalogue(),
  },
  {
    path: path.join(docsDir, "00_INDEX.md"),
    content: renderIndex(),
  },
];

ensureDir(docsDir);
ensureDir(wordDir);
ensureDir(pdfDir);

for (const file of files) {
  fs.writeFileSync(file.path, file.content, "utf8");
}

console.log(`Catalogue exports generated in ${docsDir}`);
