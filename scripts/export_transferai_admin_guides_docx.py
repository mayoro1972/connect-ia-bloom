from __future__ import annotations

from datetime import date
from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
SCRIPTS_DIR = ROOT / "scripts"
DOCS_DIR = ROOT / "docs" / "transferai-admin"
WORD_DIR = DOCS_DIR / "word"
WORD_EXPORTS_DIR = WORD_DIR / "exports-guides-md"
WORD_SOURCE_DIR = WORD_DIR / "source"
TODAY = date.today().isoformat()

sys.path.insert(0, str(SCRIPTS_DIR))
from export_markdown_to_docx import markdown_to_docx  # noqa: E402


def is_guide_markdown(path: Path) -> bool:
    return path.suffix.lower() == ".md" and "guide" in path.name.lower()


def collect_guides() -> list[Path]:
    guides = sorted(
        path
        for path in DOCS_DIR.rglob("*.md")
        if is_guide_markdown(path)
    )
    return guides


def export_individual_guides(guides: list[Path]) -> list[Path]:
    WORD_EXPORTS_DIR.mkdir(parents=True, exist_ok=True)
    outputs: list[Path] = []
    for guide in guides:
        output = WORD_EXPORTS_DIR / f"{guide.stem}.docx"
        markdown_to_docx(guide, output)
        outputs.append(output)
    return outputs


def build_merged_markdown(guides: list[Path]) -> Path:
    WORD_SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    merged_md = WORD_SOURCE_DIR / f"TransferAI_Recueil_Guides_Markdown_{TODAY}.md"

    lines: list[str] = []
    lines.append("# Recueil des guides Markdown TransferAI")
    lines.append("")
    lines.append(f"Date d'export : {TODAY}")
    lines.append("")
    lines.append("Ce document regroupe tous les guides disponibles en format Markdown dans `docs/transferai-admin` au moment de l'export.")
    lines.append("")
    lines.append("## Index des guides inclus")
    lines.append("")
    for guide in guides:
        relative_path = guide.relative_to(ROOT)
        lines.append(f"- `{relative_path}`")
    lines.append("")

    for guide in guides:
        relative_path = guide.relative_to(ROOT)
        content = guide.read_text(encoding="utf-8").strip()
        lines.append("---")
        lines.append("")
        lines.append(f"## {guide.stem}")
        lines.append("")
        lines.append(f"Source : `{relative_path}`")
        lines.append("")
        lines.append(content)
        lines.append("")

    merged_md.write_text("\n".join(lines), encoding="utf-8")
    return merged_md


def export_merged_docx(merged_md: Path) -> Path:
    WORD_DIR.mkdir(parents=True, exist_ok=True)
    output = WORD_DIR / f"TransferAI_Recueil_Guides_Markdown_{TODAY}.docx"
    markdown_to_docx(merged_md, output)
    return output


def export_requested_recent_guides() -> list[Path]:
    targets = [
        DOCS_DIR / "100_Guide_Utilisateur_Workflow_Google_Forms_Prospects_Chronologie_2026-06-23.md",
        DOCS_DIR / "101_Guide_Troubleshooting_Workflow_Google_Forms_Prospects_Chronologie_2026-06-23.md",
    ]
    outputs: list[Path] = []
    for target in targets:
        if target.exists():
            output = WORD_DIR / f"{target.stem}.docx"
            markdown_to_docx(target, output)
            outputs.append(output)
    return outputs


def main() -> None:
    guides = collect_guides()
    if not guides:
        raise SystemExit("Aucun guide Markdown n'a été trouvé dans docs/transferai-admin.")

    recent_outputs = export_requested_recent_guides()
    export_individual_guides(guides)
    merged_md = build_merged_markdown(guides)
    merged_docx = export_merged_docx(merged_md)

    print("Guides Markdown trouvés :", len(guides))
    for output in recent_outputs:
        print("Guide exporté :", output)
    print("Recueil Markdown source :", merged_md)
    print("Recueil DOCX :", merged_docx)


if __name__ == "__main__":
    main()
