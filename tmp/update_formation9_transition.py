from pathlib import Path

from docx import Document


SOURCE = Path(
    "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/output/"
    "Proposition_Professionnelle_TransferAI_ELTON_CI_hub_ia_v3.docx"
)
OUTPUT = Path(
    "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/output/"
    "Proposition_Professionnelle_TransferAI_ELTON_CI_hub_ia_v4.docx"
)


def main() -> None:
    doc = Document(str(SOURCE))

    for paragraph in doc.paragraphs:
        if paragraph.text.strip().startswith("IA pour Secrétaires & Assistants de Direction"):
            paragraph.text = (
                "Formation 9 - IA pour Secrétaires & Assistants de Direction : "
                "Renforcer l’accueil, la coordination administrative, la préparation "
                "des dossiers et la qualité de circulation de l’information."
            )
        elif paragraph.text.strip().startswith("Bien que ce corps de métier ne constitue pas le coeur"):
            paragraph.text = (
                "Enfin, dans le prolongement des éléments mis en avant dans les captures "
                "ci-jointes, la formation 9 consacrée à l’IA pour secrétaire mérite une "
                "attention particulière. Bien que ce corps de métier ne constitue pas le "
                "coeur des cas d’usage opérationnels présentés dans cette proposition, "
                "cette formation demeure essentielle, car la secrétaire reste la porte "
                "d’entrée de toute structure : elle oriente l’information, organise les "
                "priorités, prépare les interactions de direction et contribue "
                "directement à l’image, à la réactivité et à la qualité d’exécution de "
                "l’entreprise."
            )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(OUTPUT))


if __name__ == "__main__":
    main()
