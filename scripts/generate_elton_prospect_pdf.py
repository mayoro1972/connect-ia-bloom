from __future__ import annotations

import re
import sys
from datetime import datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


TITLE_BLUE = colors.HexColor("#12355B")
TEXT = colors.HexColor("#1F2937")
MUTED = colors.HexColor("#6B7280")
ACCENT = colors.HexColor("#C95B25")
LIGHT_FILL = colors.HexColor("#FCEDE4")
RULE = colors.HexColor("#5B7DB1")


def clean_inline(text: str) -> str:
    text = re.sub(r"\[(.*?)\]\((.*?)\)", r"\1", text)
    text = text.replace("**", "").replace("__", "")
    text = text.replace("`", "")
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;").replace(">", "&gt;")
    return text.strip()


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="TAHeader",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=11,
            textColor=MUTED,
            alignment=TA_LEFT,
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TATitle",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=28,
            leading=32,
            textColor=TITLE_BLUE,
            alignment=TA_LEFT,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TASubtitle",
            parent=styles["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=13,
            leading=16,
            textColor=MUTED,
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TAMeta",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=12,
            textColor=MUTED,
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TABody",
            parent=styles["Normal"],
            fontName="Times-Roman",
            fontSize=11.5,
            leading=15,
            textColor=TEXT,
            spaceAfter=7,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TAHeading1",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            textColor=TITLE_BLUE,
            spaceBefore=12,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TAHeading2",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=TITLE_BLUE,
            spaceBefore=10,
            spaceAfter=5,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TAHeading3",
            parent=styles["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=12.5,
            leading=16,
            textColor=ACCENT,
            spaceBefore=8,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TABullet",
            parent=styles["Normal"],
            fontName="Times-Roman",
            fontSize=11.5,
            leading=15,
            leftIndent=14,
            firstLineIndent=-8,
            bulletIndent=0,
            spaceAfter=4,
            textColor=TEXT,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TANumber",
            parent=styles["Normal"],
            fontName="Times-Roman",
            fontSize=11.5,
            leading=15,
            leftIndent=16,
            firstLineIndent=-12,
            spaceAfter=4,
            textColor=TEXT,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TASource",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=13,
            leftIndent=10,
            firstLineIndent=-6,
            spaceAfter=3,
            textColor=TEXT,
        )
    )
    return styles


def add_cover(story, styles, title: str, subtitle: str, header_text: str, callout: str | None):
    story.append(Paragraph(clean_inline(header_text), styles["TAHeader"]))
    story.append(Paragraph(clean_inline(title), styles["TATitle"]))
    story.append(Paragraph(clean_inline(subtitle), styles["TASubtitle"]))

    line_width = stringWidth(clean_inline(title), "Helvetica-Bold", 28)
    rule = Table([[""]], colWidths=[min(max(line_width, 220), 468)])
    rule.setStyle(
        TableStyle(
            [
                ("LINEBELOW", (0, 0), (-1, -1), 1, RULE),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(rule)
    story.append(Spacer(1, 0.12 * inch))
    story.append(
        Paragraph(
            f"Document de prospection | Généré le {datetime.now().strftime('%d/%m/%Y')}",
            styles["TAMeta"],
        )
    )

    if callout:
        callout_table = Table([[Paragraph(clean_inline(callout), styles["TAHeading3"])]], colWidths=[6.1 * inch])
        callout_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), LIGHT_FILL),
                    ("LEFTPADDING", (0, 0), (-1, -1), 8),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )
        story.append(callout_table)
        story.append(Spacer(1, 0.15 * inch))


def add_markdown(story, styles, markdown_path: Path):
    lines = markdown_path.read_text(encoding="utf-8").splitlines()
    skip_first_title = True
    in_sources = False

    for raw_line in lines:
        stripped = raw_line.strip()
        if not stripped:
            continue

        if stripped.startswith("# "):
            if skip_first_title:
                skip_first_title = False
                continue
            heading = clean_inline(stripped[2:])
            story.append(Paragraph(heading, styles["TAHeading1"]))
            in_sources = heading.lower() == "sources"
            continue

        if stripped.startswith("## "):
            heading = clean_inline(stripped[3:])
            story.append(Paragraph(heading, styles["TAHeading1"]))
            in_sources = heading.lower() == "sources"
            continue

        if stripped.startswith("### "):
            story.append(Paragraph(clean_inline(stripped[4:]), styles["TAHeading2"]))
            continue

        if stripped.startswith("#### "):
            story.append(Paragraph(clean_inline(stripped[5:]), styles["TAHeading3"]))
            continue

        if stripped.startswith("- "):
            content = clean_inline(stripped[2:])
            if in_sources:
                story.append(Paragraph(f"• {content}", styles["TASource"]))
            else:
                story.append(Paragraph(content, styles["TABullet"], bulletText="•"))
            continue

        number_match = re.match(r"^(\d+)\.\s+(.*)$", stripped)
        if number_match:
            story.append(Paragraph(clean_inline(number_match.group(2)), styles["TANumber"], bulletText=f"{number_match.group(1)}."))
            continue

        text = clean_inline(stripped)
        if ":" in text and not text.startswith("http"):
            label, rest = text.split(":", 1)
            story.append(Paragraph(f"<b>{label} :</b>{rest}", styles["TABody"]))
        else:
            story.append(Paragraph(text, styles["TABody"]))


def build_pdf(markdown_path: Path, output_path: Path, title: str, subtitle: str, header_text: str, callout: str | None):
    styles = build_styles()
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=LETTER,
        leftMargin=1 * inch,
        rightMargin=1 * inch,
        topMargin=1 * inch,
        bottomMargin=1 * inch,
        title=title,
        author="TransferAI Africa",
    )
    story = []
    add_cover(story, styles, title, subtitle, header_text, callout)
    add_markdown(story, styles, markdown_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.build(story)


def main() -> int:
    if len(sys.argv) < 6:
        print(
            "Usage: python generate_elton_prospect_pdf.py <input.md> <output.pdf> <title> <subtitle> <header_text> [callout]"
        )
        return 1

    markdown_path = Path(sys.argv[1]).resolve()
    output_path = Path(sys.argv[2]).resolve()
    title = sys.argv[3]
    subtitle = sys.argv[4]
    header_text = sys.argv[5]
    callout = sys.argv[6] if len(sys.argv) > 6 else None

    if not markdown_path.exists():
        print(f"Input file not found: {markdown_path}")
        return 1

    build_pdf(markdown_path, output_path, title, subtitle, header_text, callout)
    print(output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
