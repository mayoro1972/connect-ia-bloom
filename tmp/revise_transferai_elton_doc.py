from pathlib import Path

from docx import Document
from docx.enum.style import WD_STYLE_TYPE
from docx.text.paragraph import Paragraph
from docx.oxml import OxmlElement


SOURCE = Path(
    "/Users/marius_ayoro/Library/Mobile Documents/com~apple~CloudDocs/"
    "Catalogue_Professionnel_TransferAI_ELTON_CI_1.docx"
)
OUTPUT = Path(
    "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/output/"
    "Proposition_Professionnelle_TransferAI_ELTON_CI_revisee.docx"
)


def insert_paragraph_after(paragraph: Paragraph, text: str = "", style_name: str | None = None) -> Paragraph:
    new_p = OxmlElement("w:p")
    paragraph._p.addnext(new_p)
    new_para = Paragraph(new_p, paragraph._parent)
    if text:
        new_para.text = text
    if style_name:
        new_para.style = style_name
    return new_para


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = Document(str(SOURCE))

    paragraphs = doc.paragraphs

    paragraphs[0].text = "PROPOSITION PROFESSIONNELLE\nTRANSFERAI AFRICA"
    paragraphs[1].text = "Solutions IA & Formations Stratégiques\npour ELTON CÔTE D’IVOIRE"
    paragraphs[27].text = "Programme de Formations Prioritaires"

    if not paragraphs[2].text.strip():
        empty_p = paragraphs[2]._element
        empty_p.getparent().remove(empty_p)

    training_intro = insert_paragraph_after(
        paragraphs[27],
        (
            "Dans la perspective du lancement, au mois de juillet, d’une formation dédiée "
            "aux secrétaires et assistants de direction, nous recommandons d’intégrer ce "
            "public parmi les priorités de montée en compétences IA."
        ),
        "Normal",
    )

    importance_para = insert_paragraph_after(
        training_intro,
        (
            "Ces fonctions occupent une place stratégique dans la circulation de "
            "l’information, la préparation des décisions et la qualité d’exécution "
            "administrative. Lorsqu’ils sont bien formés à l’IA, les secrétaires et "
            "assistants de direction deviennent un levier direct de productivité, de "
            "réactivité et de fiabilité pour l’ensemble de l’organisation."
        ),
        "Normal",
    )

    secretary_training = insert_paragraph_after(
        importance_para,
        (
            "IA pour Secrétaires & Assistants de Direction : Structurer les comptes rendus, "
            "préparer les dossiers, accélérer les courriers et fiabiliser le suivi des "
            "échéances de direction."
        ),
        "List Number",
    )

    cursor = secretary_training
    for text in [
        "IA pour Dirigeants : Vision & Stratégie : Comprendre les enjeux IA et construire une stratégie d’adoption adaptée.",
        "Gestion de Flotte & Logistique IA : Optimiser les opérations et l’analyse des données de flotte.",
        "Reporting Financier Automatisé : Automatiser les rapports et accélérer la prise de décision.",
        "Comptabilité Automatisée avec l’IA : Réduire les tâches répétitives et améliorer la fiabilité comptable.",
        "Audit Interne Augmenté par l’IA : Renforcer les contrôles et l’analyse des risques.",
        "CRM Intelligent & IA : Améliorer le suivi client et les actions commerciales.",
        "Optimisation des Processus Métier : Identifier et automatiser les tâches à faible valeur ajoutée.",
        "Protection des Données & Gouvernance IA : Maîtriser les bonnes pratiques de sécurité et conformité.",
    ]:
        cursor = insert_paragraph_after(cursor, text, "List Number")

    # Remove the original numbered list items now that the revised sequence is in place.
    for index in range(28, 36):
        p = paragraphs[index]._element
        p.getparent().remove(p)

    impact_heading = insert_paragraph_after(
        cursor,
        "3 tâches clés pour convaincre les décideurs d’inscrire ce public dès juillet",
        "Heading 2",
    )
    impact_1 = insert_paragraph_after(
        impact_heading,
        (
            "Rédiger et synthétiser les réunions de direction avec des comptes rendus, "
            "plans d’action et relances produits plus rapidement."
        ),
        "List Bullet",
    )
    impact_2 = insert_paragraph_after(
        impact_1,
        (
            "Préparer les notes, courriers, présentations et dossiers décisionnels avec "
            "un meilleur niveau de qualité rédactionnelle et moins de temps de production."
        ),
        "List Bullet",
    )
    insert_paragraph_after(
        impact_2,
        (
            "Suivre les agendas, échéances, validations et demandes transverses afin de "
            "réduire les oublis et de fluidifier la coordination entre directions."
        ),
        "List Bullet",
    )

    doc.save(str(OUTPUT))


if __name__ == "__main__":
    main()
