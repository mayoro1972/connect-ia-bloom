from pathlib import Path

from docx import Document


SOURCE = Path(
    "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/output/"
    "Proposition_Professionnelle_TransferAI_ELTON_CI_hub_ia.docx"
)
OUTPUT = Path(
    "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/output/"
    "Proposition_Professionnelle_TransferAI_ELTON_CI_hub_ia_v2.docx"
)


def main() -> None:
    doc = Document(str(SOURCE))

    for paragraph in doc.paragraphs:
        if paragraph.text.strip() == "3 tâches clés pour convaincre les décideurs d’inscrire ce public dès juillet":
            element = paragraph._element
            element.getparent().remove(element)
            break

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(OUTPUT))


if __name__ == "__main__":
    main()
