from pathlib import Path

from docx import Document
from docx.oxml import OxmlElement
from docx.text.paragraph import Paragraph


SOURCE = Path(
    "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/output/"
    "Proposition_Professionnelle_TransferAI_ELTON_CI_hub_ia_v4.docx"
)
OUTPUT = Path(
    "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/output/"
    "Proposition_Professionnelle_TransferAI_ELTON_CI_hub_ia_v5.docx"
)


def insert_paragraph_before(paragraph: Paragraph, text: str = "", style_name: str | None = None) -> Paragraph:
    new_p = OxmlElement("w:p")
    paragraph._p.addprevious(new_p)
    new_para = Paragraph(new_p, paragraph._parent)
    if text:
        new_para.text = text
    if style_name:
        new_para.style = style_name
    return new_para


def main() -> None:
    doc = Document(str(SOURCE))

    formation9_para = None
    for paragraph in doc.paragraphs:
        text = paragraph.text.strip()
        if text == "Les formations ci-dessous répondent en priorité aux cas d’usage métier identifiés pour ELTON CI, en lien avec la direction, les opérations, la finance, l’audit, la relation client, l’optimisation des processus et la gouvernance.":
            paragraph.text = (
                "Les formations 1 à 8 ci-dessous répondent en priorité aux cas d’usage "
                "métier identifiés pour ELTON CI, en lien avec la direction, les "
                "opérations, la finance, l’audit, la relation client, l’optimisation "
                "des processus et la gouvernance."
            )
        elif text.startswith("Formation 9 - IA pour Secrétaires & Assistants de Direction"):
            formation9_para = paragraph
            paragraph.text = (
                "Formation 9 - IA pour Secrétaires & Assistants de Direction : "
                "Renforcer l’accueil, la coordination administrative, la préparation "
                "des dossiers et la qualité de circulation de l’information."
            )
        elif text.startswith("Enfin, dans le prolongement des éléments mis en avant"):
            paragraph.text = (
                "Au-delà des formations 1 à 8 directement liées aux cas d’usage métier, "
                "la formation 9 constitue un autre volet, à caractère exceptionnel. "
                "Elle s’inscrit dans le cadre d’un séminaire de formation programmé "
                "pour le mois de juillet et mérite une attention particulière, car la "
                "secrétaire demeure la porte d’entrée de toute structure : elle oriente "
                "l’information, organise les priorités, prépare les interactions de "
                "direction et contribue directement à l’image, à la réactivité et à la "
                "qualité d’exécution de l’entreprise."
            )
        elif text == "Dans la perspective du lancement prévu en juillet, cette montée en compétences permettra notamment de :":
            paragraph.text = (
                "Dans le cadre de ce séminaire prévu en juillet, cette montée en "
                "compétences permettra notamment de :"
            )

    if formation9_para is None:
        raise RuntimeError("Formation 9 paragraph not found")

    insert_paragraph_before(
        formation9_para,
        "Volet complémentaire exceptionnel : Séminaire IA pour le secrétariat",
        "Heading 2",
    )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(OUTPUT))


if __name__ == "__main__":
    main()
