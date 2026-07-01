from pathlib import Path

from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path("/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom")
PREVIEW_DIR = ROOT / "outputs" / "manual-20260628-secretariat-ia-formation" / "presentations" / "programme-ia-secretariat-direction" / "preview"
OUTPUT_PDF = ROOT / "docs" / "transferai-prospection" / "pdf" / "TransferAI_Programme_Formation_IA_Secretariat_Direction_2026-06-28.pdf"


def main() -> None:
    slides = sorted(PREVIEW_DIR.glob("slide-*.png"))
    if not slides:
        raise SystemExit("No slide previews found.")

    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(OUTPUT_PDF), pagesize=(1280, 720))

    for slide in slides:
        image = ImageReader(str(slide))
        pdf.drawImage(image, 0, 0, width=1280, height=720, preserveAspectRatio=True, mask="auto")
        pdf.showPage()

    pdf.save()
    print(OUTPUT_PDF)


if __name__ == "__main__":
    main()
