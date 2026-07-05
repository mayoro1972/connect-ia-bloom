from __future__ import annotations

import zipfile
from copy import deepcopy
from pathlib import Path

from docx import Document
from lxml import etree
from PIL import Image


ROOT = Path("/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom")
WORK_DIR = ROOT / "outputs/manual-20260705-transferai-background-doc"
SOURCE_DOCX = WORK_DIR / "source.docx"
LOGO_PATH = ROOT / "src/assets/logo-transferai-nettelecom.png"
BACKGROUND_PNG = WORK_DIR / "transferai-background-page.png"
INTERMEDIATE_DOCX = WORK_DIR / "with-inline-header-image.docx"
OUTPUT_DOCX = WORK_DIR / "Programme_Formation_IA_Appliquee_Votre_Metier_Session_29_30_juillet_2026_background_transferai.docx"

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
WP_NS = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
PIC_NS = "http://schemas.openxmlformats.org/drawingml/2006/picture"
A_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
V_NS = "urn:schemas-microsoft-com:vml"
O_NS = "urn:schemas-microsoft-com:office:office"

NS = {
    "w": W_NS,
    "wp": WP_NS,
    "pic": PIC_NS,
    "a": A_NS,
    "r": R_NS,
    "v": V_NS,
    "o": O_NS,
}


def w(tag: str) -> str:
    return f"{{{W_NS}}}{tag}"


def v(tag: str) -> str:
    return f"{{{V_NS}}}{tag}"


def o(tag: str) -> str:
    return f"{{{O_NS}}}{tag}"


def build_background_image() -> None:
    page = Image.new("RGBA", (2550, 3300), (255, 255, 255, 0))
    logo = Image.open(LOGO_PATH).convert("RGBA")

    target_width = int(page.width * 0.74)
    target_height = int(logo.height * (target_width / logo.width))
    logo = logo.resize((target_width, target_height), Image.LANCZOS)

    alpha = logo.getchannel("A").point(lambda value: int(value * 0.09))
    logo.putalpha(alpha)

    x = (page.width - logo.width) // 2
    y = (page.height - logo.height) // 2
    page.alpha_composite(logo, (x, y))
    page.save(BACKGROUND_PNG, dpi=(300, 300))


def add_inline_header_image() -> None:
    doc = Document(str(SOURCE_DOCX))

    for section in doc.sections:
        section.different_first_page_header_footer = False
        header = section.header
        if not header.paragraphs:
            header.add_paragraph("")
        paragraph = header.paragraphs[0]
        paragraph.clear()
        run = paragraph.add_run()
        run.add_picture(str(BACKGROUND_PNG), width=section.page_width, height=section.page_height)

    doc.save(str(INTERMEDIATE_DOCX))


def make_vml_picture(rel_id: str, width_pt: float, height_pt: float) -> etree._Element:
    pict = etree.Element(w("pict"), nsmap={"v": V_NS, "o": O_NS, "r": R_NS})
    shape = etree.SubElement(
        pict,
        v("shape"),
        {
            "id": "TransferAIBackground",
            o("spid"): "_x0000_s2049",
            "type": "#_x0000_t75",
            "style": (
                "position:absolute;"
                f"width:{width_pt:.2f}pt;height:{height_pt:.2f}pt;"
                "z-index:-251654144;"
                "mso-wrap-edited:f;"
                "mso-position-horizontal:center;"
                "mso-position-horizontal-relative:page;"
                "mso-position-vertical:center;"
                "mso-position-vertical-relative:page;"
            ),
            "stroked": "f",
        },
    )
    etree.SubElement(shape, v("imagedata"), {f"{{{R_NS}}}id": rel_id, o("title"): "TransferAI background"})
    return pict


def patch_header_to_background() -> None:
    with zipfile.ZipFile(INTERMEDIATE_DOCX, "r") as zin:
        header_names = [name for name in zin.namelist() if name.startswith("word/header") and name.endswith(".xml")]
        overrides: dict[str, bytes] = {}

        for header_name in header_names:
            root = etree.fromstring(zin.read(header_name))
            first_drawing = root.find(".//w:drawing", namespaces=NS)
            if first_drawing is None:
                continue

            extent = first_drawing.find(".//wp:extent", namespaces=NS)
            blip = first_drawing.find(".//a:blip", namespaces=NS)
            if extent is None or blip is None:
                continue

            rel_id = blip.get(f"{{{R_NS}}}embed")
            cx = int(extent.get("cx"))
            cy = int(extent.get("cy"))
            width_pt = cx / 12700
            height_pt = cy / 12700

            run = first_drawing.getparent()
            run.remove(first_drawing)
            run.append(make_vml_picture(rel_id, width_pt, height_pt))

            overrides[header_name] = etree.tostring(
                root,
                xml_declaration=True,
                encoding="UTF-8",
                standalone="yes",
            )

        with zipfile.ZipFile(OUTPUT_DOCX, "w", zipfile.ZIP_DEFLATED) as zout:
            for info in zin.infolist():
                data = overrides.get(info.filename, zin.read(info.filename))
                zout.writestr(info, data)


def main() -> None:
    WORK_DIR.mkdir(parents=True, exist_ok=True)
    build_background_image()
    add_inline_header_image()
    patch_header_to_background()
    print(OUTPUT_DOCX)


if __name__ == "__main__":
    main()
