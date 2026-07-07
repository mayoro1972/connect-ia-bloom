import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const STARTER_PPTX =
  "/var/folders/f7/1lrzxdpx6jn4qd07rg786b4c0000gn/T/codex-presentations/manual-precloture-pii/tmp/template-starter.pptx";
const OUTPUT_PPTX =
  "/var/folders/f7/1lrzxdpx6jn4qd07rg786b4c0000gn/T/codex-presentations/manual-precloture-pii/tmp/precloture-bancaire-pii-updated.pptx";

function getSlide(presentation, index) {
  const slide = presentation.slides.items[index];
  if (!slide) {
    throw new Error(`Slide ${index + 1} introuvable.`);
  }
  return slide;
}

function getShape(slide, name) {
  const shape = slide.shapes.items.find((item) => item.name === name);
  if (!shape) {
    throw new Error(`Objet introuvable sur la slide ${slide.index + 1} : ${name}`);
  }
  return shape;
}

async function main() {
  const presentation = await PresentationFile.importPptx(await FileBlob.load(STARTER_PPTX));

  const complianceSlide = getSlide(presentation, 2);
  getShape(complianceSlide, "section-Cas d’usage").text = "Conformité";
  getShape(complianceSlide, "usecase-title").text =
    "Confidentialité bancaire : un cas d’usage maîtrisé";
  getShape(complianceSlide, "usecase-intro").text =
    "Avant l’appel IA, les données sensibles sont pseudonymisées afin de limiter l’exposition des informations à caractère personnel. Le modèle ne reçoit que les éléments utiles à l’analyse des écarts, tandis que les références détaillées restent sous contrôle interne et sous validation humaine.";
  getShape(complianceSlide, "automation-title").text = "Ce que fait la protection";
  getShape(complianceSlide, "automation-bullets").text =
    "Généricisation du nom de la banque pour l’étape IA.\nMasquage des e-mails, téléphones et identifiants longs.\nTroncature des numéros de compte et nettoyage des libellés libres.\nTransmission au modèle des seuls KPI et anomalies pseudonymisés.\nConservation des données détaillées dans le flux interne n8n.";
  getShape(complianceSlide, "manager-title").text = "Ce que cela garantit";
  getShape(complianceSlide, "manager-bullets").text =
    "Réduction du risque d’exposition des données sensibles.\nCommentaire IA produit sans dépendre d’identités réelles.\nMeilleure compatibilité avec les exigences conformité, risque et sécurité.\nValidation humaine maintenue avant diffusion, arbitrage ou usage officiel.";
  getShape(complianceSlide, "guardrail-text").text =
    "Garde-fou : pseudonymisation avant l’IA et validation humaine obligatoire avant toute diffusion.";
  getShape(complianceSlide, "footer-02").text = "03";

  getShape(getSlide(presentation, 3), "footer-03").text = "04";
  getShape(getSlide(presentation, 4), "footer-04").text = "05";
  getShape(getSlide(presentation, 5), "footer-05").text = "06";

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(OUTPUT_PPTX);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
