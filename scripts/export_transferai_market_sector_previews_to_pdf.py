from __future__ import annotations

from pathlib import Path
from PIL import Image
from reportlab.pdfgen import canvas


ROOT = Path("/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom")
OUTPUT_ROOT = ROOT / "docs" / "transferai-prospection" / "decks-sectoriels-commerciaux-2026-06-13"
PPTX_DIR = OUTPUT_ROOT / "pptx"
PDF_DIR = OUTPUT_ROOT / "pdf"
OUTPUTS_DIR = ROOT / "outputs"


def file_stem_to_slug(file_name: str) -> str:
    stem = Path(file_name).stem
    stem = stem.replace("TransferAI_Deck_", "")
    return stem.lower().replace("_", "-")


def find_preview_dir(slug: str) -> Path:
    candidates = sorted(OUTPUTS_DIR.glob(f"*/presentations/{slug}/preview"))
    if not candidates:
      raise FileNotFoundError(f"No preview directory found for {slug}")
    return candidates[-1]


def build_pdf(preview_dir: Path, output_pdf: Path) -> None:
    png_files = sorted(preview_dir.glob("slide-*.png"))
    if not png_files:
        raise FileNotFoundError(f"No preview PNG files found in {preview_dir}")

    output_pdf.parent.mkdir(parents=True, exist_ok=True)
    pdf = None

    for png_path in png_files:
        with Image.open(png_path) as image:
            width, height = image.size
        if pdf is None:
            pdf = canvas.Canvas(str(output_pdf), pagesize=(width, height))
        else:
            pdf.setPageSize((width, height))
        pdf.drawImage(str(png_path), 0, 0, width=width, height=height)
        pdf.showPage()

    if pdf is not None:
        pdf.save()


def main() -> None:
    if not PPTX_DIR.exists():
        raise FileNotFoundError(f"PPTX directory not found: {PPTX_DIR}")

    for pptx_path in sorted(PPTX_DIR.glob("TransferAI_Deck_*.pptx")):
        slug = file_stem_to_slug(pptx_path.name)
        preview_dir = find_preview_dir(slug)
        output_pdf = PDF_DIR / f"{pptx_path.stem}.pdf"
        build_pdf(preview_dir, output_pdf)
        print(output_pdf)


if __name__ == "__main__":
    main()
