from __future__ import annotations

import shutil
from pathlib import Path

from generate_priority_sector_catalogues import build_all_sectors, commercial_pdf_filename


ROOT = Path("/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom")
DEFAULT_SOURCE_DIRS = [
    ROOT / "outputs/manual-20260612-sector-audit-v3",
    ROOT / "outputs/manual-20260612-all-priority-sector-pdfs-clean-v2",
]
COMMERCIAL_EXPORT_DIR = (
    ROOT / "docs/transferai-prospection/catalogues-sectoriels-premium-2026-06-12/catalogues-commerciaux-pdf"
)


def resolve_source_dirs() -> list[Path]:
    directories = [directory for directory in DEFAULT_SOURCE_DIRS if directory.exists()]
    if not directories:
        raise FileNotFoundError("Aucun dossier source PDF n’a été trouvé pour l’export commercial.")
    return directories


def find_source_pdf(source_dirs: list[Path], slug: str) -> Path | None:
    for source_dir in source_dirs:
        pdf_match = next((source_dir / slug).glob("*.pdf"), None)
        if pdf_match is not None:
            return pdf_match
    return None


def export_catalogues() -> list[Path]:
    source_dirs = resolve_source_dirs()
    COMMERCIAL_EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    exported: list[Path] = []

    for sector in build_all_sectors():
        source_pdf = find_source_pdf(source_dirs, sector["slug"])
        if source_pdf is None:
            continue
        target_pdf = COMMERCIAL_EXPORT_DIR / commercial_pdf_filename(sector)
        shutil.copy2(source_pdf, target_pdf)
        exported.append(target_pdf)

    return exported


def main() -> None:
    for pdf_path in export_catalogues():
        print(pdf_path)


if __name__ == "__main__":
    main()
