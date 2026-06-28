"""
Mini-catalogue prospect TransferAI — PDF premium
Layout aéré, pied de page sur chaque page, couverture pleine, zéro en-tête répété.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame,
    Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, NextPageTemplate, PageBreak,
    FrameBreak,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus.flowables import Flowable
import os, sys, json, re, unicodedata

# ── Palette ───────────────────────────────────────────────────────────
C_BLEU     = colors.HexColor("#10263F")
C_BLEU_MOY = colors.HexColor("#163556")
C_BLEU_CLR = colors.HexColor("#244667")
C_ORANGE   = colors.HexColor("#E76F1D")
C_OR       = colors.HexColor("#C88C3A")
C_TEAL     = colors.HexColor("#1C8A78")
C_BLANC    = colors.white
C_CREME    = colors.HexColor("#F5EFE7")
C_CREME_R  = colors.HexColor("#FAECE7")
C_CREME_V  = colors.HexColor("#E1F5EE")
C_BLEU_TX  = colors.HexColor("#617086")
C_BLEU_PL  = colors.HexColor("#CFE0F0")
C_GRIS     = colors.HexColor("#C9D4E1")
C_GRIS_LT  = colors.HexColor("#F1EFE8")

W, H = A4
ML = 2.2 * cm   # marge gauche
MR = 2.2 * cm   # marge droite
MT = 2.0 * cm   # marge haut (page contenu)
MB = 2.2 * cm   # marge bas
FH = 1.1 * cm   # hauteur footer
TW = W - ML - MR  # largeur texte


# ════════════════════════════════════════════════════════════════════
# PIED DE PAGE — dessiné sur chaque page sauf couverture
# ════════════════════════════════════════════════════════════════════
def draw_footer(canvas, doc):
    canvas.saveState()
    y = MB - 0.6 * cm
    # Ligne orange
    canvas.setStrokeColor(C_ORANGE)
    canvas.setLineWidth(1.2)
    canvas.line(ML, y + 0.45*cm, W - MR, y + 0.45*cm)
    # Texte footer gauche
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(C_BLEU_TX)
    canvas.drawString(ML, y + 0.12*cm,
        "TransferAI Africa  ·  Hub IA de NettelecomCI  ·  www.transferai.ci  ·  contact@transferai.ci")
    # Numéro de page à droite
    canvas.setFillColor(C_ORANGE)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawRightString(W - MR, y + 0.12*cm, f"{doc.page}")
    canvas.restoreState()


def draw_footer_cover(canvas, doc):
    """Footer minimaliste pour la couverture."""
    canvas.saveState()
    canvas.setFillColor(C_BLANC)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawCentredString(W/2, MB - 0.4*cm,
        "www.transferai.ci  ·  contact@transferai.ci  ·  +225 07 16 57 39 90")
    canvas.restoreState()


# ════════════════════════════════════════════════════════════════════
# STYLES
# ════════════════════════════════════════════════════════════════════
def mk_styles():
    s = {}

    def st(name, **kw):
        s[name] = ParagraphStyle(name, **kw)

    st("cover_tag",    fontSize=8.5,  textColor=C_OR,      bold=1, leading=11, spaceAfter=6)
    st("cover_h1",     fontSize=26,   textColor=C_BLANC,   bold=1, leading=30, spaceAfter=4)
    st("cover_h2",     fontSize=26,   textColor=C_ORANGE,  bold=1, leading=30, spaceAfter=10)
    st("cover_sub",    fontSize=10.5, textColor=C_BLEU_PL, leading=15, spaceAfter=8)
    st("cover_enjeu",  fontSize=10.5, textColor=C_BLANC,   leading=15, spaceAfter=5, leftIndent=6)
    st("cover_intro",  fontSize=10,   textColor=C_BLEU_PL, leading=14, spaceAfter=0,
       italic=1, alignment=TA_JUSTIFY)
    st("section_num",  fontSize=7.5,  textColor=C_ORANGE,  bold=1, leading=10, spaceAfter=1)
    st("section_h",    fontSize=15,   textColor=C_BLEU,    bold=1, leading=18, spaceAfter=8)
    st("enjeu_num",    fontSize=20,   textColor=C_ORANGE,  bold=1, leading=22)
    st("enjeu_titre",  fontSize=12,   textColor=C_BLANC,   bold=1, leading=15)
    st("body",         fontSize=10.5, textColor=C_BLEU,    leading=15, spaceAfter=6,
       alignment=TA_JUSTIFY)
    st("body_muted",   fontSize=10.5, textColor=C_BLEU_TX, leading=15, spaceAfter=6,
       italic=1, alignment=TA_JUSTIFY)
    st("signal_label", fontSize=8.5,  textColor=C_ORANGE,  bold=1, leading=11)
    st("signal_val",   fontSize=9,    textColor=C_BLEU_TX, leading=12, italic=1)
    st("form_tag",     fontSize=8,    textColor=C_BLANC,   bold=1, leading=10)
    st("form_h",       fontSize=13,   textColor=C_BLANC,   bold=1, leading=16)
    st("meta_label",   fontSize=7.5,  textColor=C_ORANGE,  bold=1, leading=10)
    st("meta_val",     fontSize=9.5,  textColor=C_BLEU,    leading=13)
    st("sub_h",        fontSize=10,   textColor=C_BLEU,    bold=1, leading=13, spaceAfter=5, spaceBefore=10)
    st("bullet",       fontSize=10.5, textColor=C_BLEU,    leading=15, spaceAfter=4, leftIndent=14)
    st("bullet_teal",  fontSize=10.5, textColor=C_TEAL,    leading=15, spaceAfter=4, leftIndent=14, bold=1)
    st("tag_av",       fontSize=7.5,  textColor=colors.HexColor("#993C1D"), bold=1, leading=10)
    st("tag_ap",       fontSize=7.5,  textColor=colors.HexColor("#0F6E56"), bold=1, leading=10)
    st("cell_av",      fontSize=10,   textColor=colors.HexColor("#712B13"), leading=14, alignment=TA_JUSTIFY)
    st("cell_ap",      fontSize=10,   textColor=colors.HexColor("#085041"), leading=14, alignment=TA_JUSTIFY)
    st("gain_txt",     fontSize=10,   textColor=C_BLANC,   bold=1, leading=13)
    st("step_delay",   fontSize=16,   textColor=C_ORANGE,  bold=1, leading=18)
    st("step_titre",   fontSize=10,   textColor=C_BLEU,    bold=1, leading=14)
    st("step_desc",    fontSize=9,    textColor=C_BLEU_TX, leading=13)
    st("cta_label",    fontSize=9,    textColor=C_OR,      bold=1, leading=12)
    st("cta_url",      fontSize=8.5,  textColor=C_BLANC,   leading=12, italic=1)
    st("footer_txt",   fontSize=7,    textColor=C_BLEU_TX, leading=10, alignment=TA_CENTER)
    return s


# ════════════════════════════════════════════════════════════════════
# COMPOSANTS
# ════════════════════════════════════════════════════════════════════

class AccentBar(Flowable):
    """Barre verticale orange + titre de section."""
    def __init__(self, num, title, ST, bar_color=C_ORANGE):
        Flowable.__init__(self)
        self.num = num
        self.title = title
        self.ST = ST
        self.bar_color = bar_color
        self.height = 40
        self.width  = TW

    def draw(self):
        c = self.canv
        c.setFillColor(self.bar_color)
        c.rect(0, 8, 4, 26, stroke=0, fill=1)
        c.setFillColor(C_ORANGE)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(12, 28, self.num)
        c.setFillColor(C_BLEU)
        c.setFont("Helvetica-Bold", 15)
        c.drawString(12, 10, self.title)


def colored_block(text, bg=C_BLEU, fg=C_BLANC, size=10.5, pad_v=8, pad_h=10, bold=False):
    st = ParagraphStyle("_cb", fontSize=size, textColor=fg, bold=bold,
                        leading=size*1.4, alignment=TA_JUSTIFY)
    t = Table([[Paragraph(text, st)]], colWidths=[TW])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), bg),
        ("TOPPADDING",    (0,0), (-1,-1), pad_v),
        ("BOTTOMPADDING", (0,0), (-1,-1), pad_v),
        ("LEFTPADDING",   (0,0), (-1,-1), pad_h),
        ("RIGHTPADDING",  (0,0), (-1,-1), pad_h),
    ]))
    return t


def enjeu_card(num, titre, constat, signal, ST):
    # En-tête enjeu
    hdr_data = [[
        Paragraph(num, ST["enjeu_num"]),
        Paragraph(titre, ST["enjeu_titre"]),
    ]]
    hdr = Table(hdr_data, colWidths=[1.4*cm, TW - 1.4*cm - 4])
    hdr.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), C_BLEU_MOY),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING",   (0,0), (0,-1),  10),
        ("LEFTPADDING",   (1,0), (1,-1),  6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
    ]))

    # Corps
    body_items = [
        Paragraph(constat, ST["body"]),
        Spacer(1, 4),
        Table([[
            Paragraph("Signaux observés", ST["signal_label"]),
            Paragraph(signal, ST["signal_val"]),
        ]], colWidths=[3.2*cm, TW - 3.2*cm - 20],
        style=TableStyle([
            ("TOPPADDING",    (0,0),(-1,-1), 5),
            ("BOTTOMPADDING", (0,0),(-1,-1), 5),
            ("LEFTPADDING",   (0,0),(0,-1),  0),
            ("LEFTPADDING",   (1,0),(1,-1),  8),
            ("VALIGN",        (0,0),(-1,-1), "TOP"),
        ])),
    ]
    body_tbl = Table([[body_items]], colWidths=[TW])
    body_tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), C_GRIS_LT),
        ("TOPPADDING",    (0,0),(-1,-1), 10),
        ("BOTTOMPADDING", (0,0),(-1,-1), 8),
        ("LEFTPADDING",   (0,0),(-1,-1), 12),
        ("RIGHTPADDING",  (0,0),(-1,-1), 12),
        ("LINEBELOW",     (0,0),(-1,-1), 0.5, C_GRIS),
        ("LINEBEFORE",    (0,0),(0,-1),  3.0, C_ORANGE),
    ]))

    return KeepTogether([hdr, body_tbl, Spacer(1, 14)])


def formation_card(f, ST):
    elems = []

    # ── Bandeau titre ────────────────────────────────────────────────
    hdr = Table([[
        Paragraph(f["num"], ParagraphStyle("_fn", fontSize=9, textColor=C_ORANGE,
                                           bold=1, leading=11)),
        Paragraph(f["intitule"], ST["form_h"]),
    ]], colWidths=[1.2*cm, TW - 1.2*cm])
    hdr.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), C_BLEU),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING",   (0,0), (0,-1),  10),
        ("LEFTPADDING",   (1,0), (1,-1),  6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
        ("LINEABOVE",     (0,0), (-1,0),  3, C_ORANGE),
    ]))
    elems.append(hdr)

    # ── Méta (public / durée / niveau) ───────────────────────────────
    meta = Table([
        [Paragraph("Public cible", ST["meta_label"]),
         Paragraph("Durée",        ST["meta_label"]),
         Paragraph("Niveau",       ST["meta_label"])],
        [Paragraph(f["public"],  ST["meta_val"]),
         Paragraph(f["duree"],   ST["meta_val"]),
         Paragraph(f["niveau"],  ST["meta_val"])],
    ], colWidths=[TW*0.45, TW*0.28, TW*0.27])
    meta.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), C_CREME),
        ("TOPPADDING",    (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("INNERGRID",     (0,0), (-1,-1), 0.4, C_GRIS),
        ("LINEBELOW",     (0,-1),(-1,-1), 0.4, C_GRIS),
    ]))
    elems.append(meta)
    elems.append(Spacer(1, 10))

    # ── Avant / Après ────────────────────────────────────────────────
    col = (TW - 4) / 2
    aa = Table([[
        [Paragraph("AVANT", ST["tag_av"]), Spacer(1, 3),
         Paragraph(f["probleme"], ST["cell_av"])],
        [Paragraph("APRÈS", ST["tag_ap"]), Spacer(1, 3),
         Paragraph(f["apres"], ST["cell_ap"])],
    ]], colWidths=[col, col])
    aa.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (0,-1), C_CREME_R),
        ("BACKGROUND",    (1,0), (1,-1), C_CREME_V),
        ("TOPPADDING",    (0,0), (-1,-1), 9),
        ("BOTTOMPADDING", (0,0), (-1,-1), 9),
        ("LEFTPADDING",   (0,0), (-1,-1), 10),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("INNERGRID",     (0,0), (-1,-1), 0.4, C_GRIS),
        ("BOX",           (0,0), (-1,-1), 0.4, C_GRIS),
    ]))
    elems.append(aa)
    elems.append(Spacer(1, 12))

    # ── Objectifs ─────────────────────────────────────────────────────
    elems.append(Paragraph("Objectifs pédagogiques", ST["sub_h"]))
    for obj in f["objectifs"]:
        elems.append(Paragraph(f"▸  {obj}", ST["bullet"]))
    elems.append(Spacer(1, 10))

    # ── Livrables ────────────────────────────────────────────────────
    elems.append(Paragraph("Livrables remis à la fin", ST["sub_h"]))
    for liv in f["livrables"]:
        elems.append(Paragraph(f"▸  {liv}", ST["bullet_teal"]))
    elems.append(Spacer(1, 10))

    # ── Gain ─────────────────────────────────────────────────────────
    gain = Table([[Paragraph(f"  Gain attendu  ·  {f['gain']}", ST["gain_txt"])]],
                 colWidths=[TW])
    gain.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), C_BLEU_MOY),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING",   (0,0), (-1,-1), 12),
    ]))
    elems.append(gain)
    elems.append(Spacer(1, 22))

    return elems


def plan_table(etapes, ST):
    rows = []
    for delai, titre, desc in etapes:
        rows.append([
            Paragraph(delai, ST["step_delay"]),
            [Paragraph(titre, ST["step_titre"]), Spacer(1,3), Paragraph(desc, ST["step_desc"])],
        ])
    t = Table(rows, colWidths=[2.4*cm, TW - 2.4*cm])
    style = TableStyle([
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING",   (0,0), (0,-1),  12),
        ("LEFTPADDING",   (1,0), (1,-1),  12),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
        ("LINEBELOW",     (0,0), (-1,-2), 0.5, C_GRIS),
        ("BOX",           (0,0), (-1,-1), 0.5, C_GRIS),
        ("LINEBEFORE",    (0,0), (0,-1),  3.0, C_ORANGE),
    ])
    for i in range(len(etapes)):
        bg = C_BLANC if i % 2 == 0 else C_GRIS_LT
        style.add("BACKGROUND", (0,i), (-1,i), bg)
    t.setStyle(style)
    return t


# ════════════════════════════════════════════════════════════════════
# COUVERTURE — dessinée directement sur le canvas (pleine page)
# ════════════════════════════════════════════════════════════════════

def draw_cover(canvas, doc, prospect, secteur, pays, date_doc, enjeux):
    canvas.saveState()

    # Fond bleu foncé
    canvas.setFillColor(C_BLEU)
    canvas.rect(0, 0, W, H, stroke=0, fill=1)

    # Bande droite
    canvas.setFillColor(C_BLEU_MOY)
    canvas.rect(W * 0.62, 0, W * 0.38, H, stroke=0, fill=1)

    # Barre orange gauche
    canvas.setFillColor(C_ORANGE)
    canvas.rect(ML, H * 0.12, 4, H * 0.76, stroke=0, fill=1)

    # Barre orange bas couverture
    canvas.setFillColor(C_ORANGE)
    canvas.rect(ML, 1.6*cm, TW, 2, stroke=0, fill=1)

    # ── Contenu gauche ───────────────────────────────────────────────
    # Largeur utile zone gauche (hors barre orange + marge)
    left_w = W * 0.62 - ML - 1.0*cm
    x0 = ML + 0.7*cm

    # Tag
    canvas.setFillColor(C_OR)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(x0, H - 2.8*cm, "MINI-CATALOGUE PERSONNALISÉ")

    # Titre — taille réduite pour tenir dans la zone gauche
    canvas.setFillColor(C_BLANC)
    canvas.setFont("Helvetica-Bold", 20)
    canvas.drawString(x0, H - 3.8*cm, "Formations IA prioritaires")
    canvas.drawString(x0, H - 4.55*cm, "recommandées pour")

    # Nom prospect en orange
    canvas.setFillColor(C_ORANGE)
    canvas.setFont("Helvetica-Bold", 20)
    canvas.drawString(x0, H - 5.3*cm, prospect)

    # Secteur · Pays · Date
    canvas.setFillColor(C_BLEU_PL)
    canvas.setFont("Helvetica", 9.5)
    canvas.drawString(x0, H - 6.15*cm, f"{secteur}  ·  {pays}  ·  {date_doc}")

    # Séparateur
    canvas.setStrokeColor(C_ORANGE)
    canvas.setLineWidth(1)
    canvas.line(x0, H - 6.65*cm, x0 + 7*cm, H - 6.65*cm)

    # 3 enjeux résumés
    canvas.setFillColor(C_BLANC)
    canvas.setFont("Helvetica", 9.5)
    for i, ej in enumerate(enjeux[:3]):
        y = H - 7.3*cm - i * 0.72*cm
        canvas.setFillColor(C_ORANGE)
        canvas.circle(x0 + 0.15*cm, y + 0.15*cm, 2.5, stroke=0, fill=1)
        canvas.setFillColor(C_BLANC)
        canvas.drawString(x0 + 0.45*cm, y, ej["titre"])

    # Bloc intro (fond bleu clair)
    bx, by, bw, bh = x0, H * 0.12 + 0.4*cm, W*0.62 - ML - 1.0*cm, 1.9*cm
    canvas.setFillColor(C_BLEU_CLR)
    canvas.roundRect(bx, by, bw, bh, 4, stroke=0, fill=1)
    canvas.setFillColor(C_BLANC)
    canvas.setFont("Helvetica-Oblique", 9.5)
    intro = ("Ce document a été construit à partir de votre pré-audit TransferAI. "
             "Il sélectionne les formations les plus utiles pour vos équipes.")
    # Découpe texte sur 2 lignes
    canvas.drawString(bx + 0.4*cm, by + bh - 0.7*cm, intro[:68])
    canvas.drawString(bx + 0.4*cm, by + bh - 1.35*cm, intro[68:])

    # ── Contenu droit ─────────────────────────────────────────────────
    rx = W * 0.62 + 0.8*cm
    rw = W * 0.38 - 1.2*cm

    canvas.setFillColor(C_OR)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(rx, H - 3.0*cm, "TransferAI Africa")

    canvas.setFillColor(C_BLANC)
    canvas.setFont("Helvetica-Bold", 12)
    canvas.drawString(rx, H - 3.9*cm, "Hub IA de NettelecomCI")

    # Ligne séparateur
    canvas.setStrokeColor(C_ORANGE)
    canvas.setLineWidth(0.8)
    canvas.line(rx, H - 4.4*cm, rx + 4.5*cm, H - 4.4*cm)

    canvas.setFillColor(C_BLEU_PL)
    canvas.setFont("Helvetica", 10)
    lines = [
        "Présence locale en Côte d'Ivoire",
        "Expertise internationale",
        "Audit · Formation · 90 jours",
    ]
    for i, l in enumerate(lines):
        canvas.drawString(rx, H - 5.0*cm - i*0.75*cm, l)

    # CTA bloc
    canvas.setFillColor(C_ORANGE)
    canvas.setFont("Helvetica-Bold", 9.5)
    canvas.drawString(rx, H * 0.47, "Rendez-vous expert →")
    canvas.setFillColor(C_BLEU_PL)
    canvas.setFont("Helvetica-Oblique", 8.5)
    canvas.drawString(rx, H * 0.47 - 0.55*cm, "calendly.com/contact-transferai")

    canvas.setFillColor(C_ORANGE)
    canvas.setFont("Helvetica-Bold", 9.5)
    canvas.drawString(rx, H * 0.38, "Formulaire d'audit →")
    canvas.setFillColor(C_BLEU_PL)
    canvas.setFont("Helvetica-Oblique", 8.5)
    canvas.drawString(rx, H * 0.38 - 0.55*cm, "transferai.ci/questionnaire-audit")

    # Footer couverture
    canvas.setFillColor(C_BLANC)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawCentredString(W/2, 1.0*cm,
        "www.transferai.ci  ·  contact@transferai.ci  ·  +225 07 16 57 39 90")

    canvas.restoreState()


# ════════════════════════════════════════════════════════════════════
# BUILD PRINCIPAL
# ════════════════════════════════════════════════════════════════════

def build_pdf(data, out_path):
    ST = mk_styles()

    prospect  = data["prospect"]
    secteur   = data["secteur"]
    pays      = data.get("pays", "")
    date_doc  = data.get("date_doc", "2026")
    pack_id   = data.get("pack_id", "")
    enjeux    = data["enjeux_audit"]
    formations = data["formations"]
    calendly  = data.get("calendly_url", "https://calendly.com/contact-transferai/30min")
    audit_url = data.get("audit_url",
        f"https://www.transferai.ci/questionnaire-audit?pack_id={pack_id}" if pack_id
        else "https://www.transferai.ci/questionnaire-audit")

    # ── Document avec templates de page ──────────────────────────────
    doc = BaseDocTemplate(
        out_path, pagesize=A4,
        leftMargin=ML, rightMargin=MR,
        topMargin=MT, bottomMargin=MB + FH,
    )

    # Frame couverture (pleine page, pas de footer géré ici)
    frame_cover = Frame(0, 0, W, H, id="cover", showBoundary=0)

    # Frame contenu standard
    frame_content = Frame(ML, MB + FH, TW, H - MT - MB - FH,
                          id="content", showBoundary=0)

    def page_cover(canvas, doc):
        draw_cover(canvas, doc, prospect, secteur, pays, date_doc, enjeux)

    def page_content(canvas, doc):
        draw_footer(canvas, doc)

    doc.addPageTemplates([
        PageTemplate(id="Cover",   frames=[frame_cover],   onPage=page_cover),
        PageTemplate(id="Content", frames=[frame_content], onPage=page_content),
    ])

    story = []

    # ── PAGE 1 — COUVERTURE (frame cover, dessinée canvas) ────────────
    story.append(NextPageTemplate("Content"))
    story.append(PageBreak())

    # ── PAGE 2+ — CONTENU ─────────────────────────────────────────────

    # SECTION 00
    story.append(AccentBar("00", f"Ce document vous est adressé — {prospect}", ST))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        f"À la suite de votre pré-audit TransferAI, nous avons identifié des enjeux "
        f"prioritaires dans vos opérations en <b>{secteur}</b>. Ce mini-catalogue "
        f"sélectionne uniquement les formations qui correspondent à ce que vos équipes "
        f"vivent réellement aujourd'hui — pas un catalogue générique.",
        ST["body"]))
    story.append(Paragraph(
        "Chaque formation inclut : la situation constatée avant, ce qui change après, "
        "les objectifs pédagogiques, les livrables remis et le gain mesurable attendu.",
        ST["body_muted"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_GRIS,
                             spaceBefore=12, spaceAfter=16))

    # SECTION 01 — Enjeux
    story.append(AccentBar("01", "Ce que le pré-audit révèle", ST))
    story.append(Spacer(1, 12))
    for e in enjeux:
        story.append(enjeu_card(e["num"], e["titre"], e["constat"], e["signal"], ST))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_GRIS,
                             spaceBefore=4, spaceAfter=16))

    # SECTION 02 — Formations
    story.append(AccentBar("02", "Formations prioritaires recommandées", ST))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        f"Ces formations ont été sélectionnées spécifiquement pour <b>{prospect}</b> "
        "sur la base des enjeux détectés. Elles sont conçues pour être opérationnelles "
        "dès la fin de la session.",
        ST["body_muted"]))
    story.append(Spacer(1, 14))

    for f in formations:
        story.extend(formation_card(f, ST))

    story.append(HRFlowable(width="100%", thickness=0.5, color=C_GRIS,
                             spaceBefore=4, spaceAfter=16))

    # SECTION 03 — Livrables globaux
    story.append(AccentBar("03", "Livrables remis à l'issue du dispositif", ST))
    story.append(Spacer(1, 10))
    for liv in data.get("livrables_globaux", []):
        story.append(Paragraph(f"▸  {liv}", ST["bullet"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_GRIS,
                             spaceBefore=14, spaceAfter=16))

    # SECTION 04 — Plan 90 jours (titre + tableau solidaires)
    etapes = data.get("plan_90j", [
        ("J+0",  "Audit & cadrage",      "Confirmation des enjeux, sélection formations, KPI définis."),
        ("J+15", "Premières formations", "F1 et F2 avec équipes ciblées."),
        ("J+45", "Pilote & F3",          "Copilote déployé, base connaissances lancée."),
        ("J+90", "Mesure & extension",   "Revue des KPI, décision d'extension."),
    ])
    story.append(KeepTogether([
        AccentBar("04", "Parcours recommandé sur 90 jours", ST),
        Spacer(1, 10),
        plan_table(etapes, ST),
    ]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_GRIS,
                             spaceBefore=22, spaceAfter=28))

    # SECTION 05 — CTA
    story.append(AccentBar("05", "Prochaine étape", ST))
    story.append(Spacer(1, 14))
    story.append(colored_block(
        "Planifier un audit de cadrage gratuit (30 minutes) pour confirmer les priorités "
        "et définir ensemble le périmètre des premières formations.",
        bg=C_BLEU, size=11))
    story.append(Spacer(1, 8))

    col = (TW - 4) / 2
    cta = Table([[
        [Paragraph("Rendez-vous expert →", ST["cta_label"]),
         Spacer(1,3), Paragraph(calendly, ST["cta_url"])],
        [Paragraph("Formulaire d'audit →", ST["cta_label"]),
         Spacer(1,3), Paragraph(audit_url, ST["cta_url"])],
    ]], colWidths=[col, col])
    cta.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), C_BLEU_CLR),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING",   (0,0), (-1,-1), 12),
        ("RIGHTPADDING",  (0,0), (-1,-1), 12),
        ("INNERGRID",     (0,0), (-1,-1), 0.5, C_BLEU_MOY),
        ("BOX",           (0,0), (-1,-1), 0.5, C_BLEU_MOY),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))
    story.append(cta)

    doc.build(story)
    print(f"✓ PDF : {out_path}")
    return out_path


# ════════════════════════════════════════════════════════════════════
# DONNÉES DE RÉFÉRENCE — Orange CI
# ════════════════════════════════════════════════════════════════════

DATA_ORANGE_CI = {
    "prospect":  "Orange Côte d'Ivoire",
    "secteur":   "Télécommunications",
    "pays":      "Côte d'Ivoire",
    "date_doc":  "Juin 2026",
    "pack_id":   "pack-1780665567601-jp48u6z4",
    "calendly_url": "https://calendly.com/contact-transferai/30min",

    "enjeux_audit": [
        {
            "num": "01",
            "titre": "Qualité et cohérence des réponses service client",
            "constat": (
                "Les canaux de réponse (téléphone, email, WhatsApp, agences) produisent des réponses "
                "hétérogènes selon les agents et les équipes. Les réclamations récurrentes manquent "
                "de scripts unifiés, entraînant des délais allongés et une insatisfaction mesurable."
            ),
            "signal": "Temps moyen de réponse élevé · Réclamations répétées · Qualité inégale entre canaux",
        },
        {
            "num": "02",
            "titre": "Préparation et exploitation des reportings managériaux",
            "constat": (
                "La consolidation des indicateurs (churn, NPS, incidents réseau, mobile money) "
                "reste manuelle et chronophage. Les comités disposent de données brutes sans synthèses "
                "exploitables, ce qui ralentit les prises de décision opérationnelles."
            ),
            "signal": "Temps de préparation des comités · Délai d'analyse des verbatims · Décisions ralenties",
        },
        {
            "num": "03",
            "titre": "Structuration et diffusion des procédures terrain",
            "constat": (
                "Les procédures opérationnelles, scripts et bonnes pratiques sont dispersés dans des "
                "fichiers non centralisés. L'onboarding des nouveaux agents est long et la montée en "
                "compétences reste inégale selon les équipes et les régions."
            ),
            "signal": "Durée d'onboarding · Écarts de qualité inter-agences · Procédures non à jour",
        },
    ],

    "formations": [
        {
            "num": "F1",
            "intitule": "Copilote service client multicanal avec l'IA",
            "public": "Superviseurs service client, chefs d'équipe front office, responsables relation client",
            "duree": "2 jours — présentiel ou hybride",
            "niveau": "Débutant à intermédiaire",
            "probleme": (
                "Les agents répondent différemment selon leur expérience. Les scripts sont éparpillés, "
                "rarement mis à jour et peu utilisés en situation réelle."
            ),
            "apres": (
                "Chaque agent dispose d'un copilote IA pour formuler et valider ses réponses selon le canal. "
                "Les réponses sont homogènes, traçables et conformes à la charte qualité."
            ),
            "objectifs": [
                "Utiliser un assistant IA pour structurer les réponses client en temps réel",
                "Adapter le ton et le format selon le canal et le motif de contact",
                "Réduire les escalades inutiles grâce à une meilleure qualification initiale",
                "Mettre en place une supervision humaine des réponses générées par l'IA",
            ],
            "livrables": [
                "Bibliothèque de scripts IA validés pour les 10 motifs de contact les plus fréquents",
                "Canevas de contrôle qualité des réponses assistées par IA",
                "Plan de déploiement du copilote sur les équipes ciblées",
            ],
            "gain": "− 30 à 50 % sur le délai moyen · + homogénéité mesurable dès J+30",
        },
        {
            "num": "F2",
            "intitule": "Synthèse IA des reportings et pilotage par les données",
            "public": "Directeurs, managers opérationnels, responsables qualité et contrôle de gestion",
            "duree": "1 jour — présentiel, format décideurs",
            "niveau": "Intermédiaire",
            "probleme": (
                "Les données existent mais les synthèses sont réalisées manuellement par 2 ou 3 personnes. "
                "Les signaux de churn et d'insatisfaction sont détectés trop tard pour agir efficacement."
            ),
            "apres": (
                "Les managers reçoivent des synthèses automatisées avant chaque comité. Les verbatims "
                "clients sont analysés en quelques minutes. Les signaux de churn remontent automatiquement."
            ),
            "objectifs": [
                "Produire des synthèses managériales à partir des données existantes (CRM, tickets, NPS)",
                "Analyser automatiquement les verbatims et classer les motifs d'insatisfaction",
                "Détecter les signaux de churn et construire un tableau de bord IA simple",
                "Définir un cadre de validation humaine avant diffusion des analyses IA",
            ],
            "livrables": [
                "Modèle de synthèse IA pour comité de direction — format hebdomadaire",
                "Tableau de bord des signaux clients priorisés",
                "Procédure de validation et de diffusion des analyses IA",
            ],
            "gain": "− 60 % sur le temps de préparation reporting · Décisions prises sur données fraîches",
        },
        {
            "num": "F3",
            "intitule": "Base de connaissances IA et onboarding accéléré",
            "public": "Responsables formation, chefs de service terrain, RH et encadrement opérationnel",
            "duree": "1 jour présentiel + 1 session suivi en ligne à J+30",
            "niveau": "Débutant",
            "probleme": (
                "Les procédures sont dispersées dans des fichiers Word et drives partagés rarement à jour. "
                "L'onboarding d'un agent prend de 3 à 6 semaines. Les écarts entre agences sont importants."
            ),
            "apres": (
                "Une base de connaissances IA centralise toutes les procédures et scripts. "
                "Les nouveaux agents la consultent directement. L'onboarding est réduit à 1-2 semaines."
            ),
            "objectifs": [
                "Structurer les procédures dans une base IA interrogeable en moins de 30 secondes",
                "Permettre à chaque agent de trouver la bonne réponse en situation réelle",
                "Réduire le temps d'onboarding des nouveaux agents par un guide IA interactif",
                "Définir un processus de mise à jour mensuelle validé par les responsables terrain",
            ],
            "livrables": [
                "Architecture de la base de connaissances IA — structure, catégories, droits d'accès",
                "Guide de migration des procédures existantes vers la base IA",
                "Protocole de mise à jour mensuelle validé par les responsables terrain",
            ],
            "gain": "Onboarding − 50 % · Procédures accessibles en temps réel · Qualité homogène inter-agences",
        },
    ],

    "livrables_globaux": [
        "Note de cadrage Télécommunications : enjeux confirmés, périmètre du pilote et premières décisions.",
        "Bibliothèque de scripts IA validés pour les motifs de contact les plus fréquents.",
        "Modèle de synthèse IA hebdomadaire pour les comités de direction.",
        "Architecture de la base de connaissances terrain avec procédures centralisées.",
        "Plan d'action à 90 jours : KPI cibles, équipes formées, supervision et critères d'extension.",
    ],

    "plan_90j": [
        ("J+0",  "Audit & cadrage",       "Confirmation des 3 enjeux, sélection des formations prioritaires, KPI définis."),
        ("J+15", "Premières formations",  "Formation F1 (service client) et F2 (reporting) avec équipes ciblées."),
        ("J+45", "Pilote & formation F3", "Copilote déployé, base de connaissances lancée, formation terrain réalisée."),
        ("J+90", "Mesure & extension",    "Revue des KPI, décision d'extension sur les autres équipes et usages."),
    ],
}


if __name__ == "__main__":
    if len(sys.argv) > 1:
        data = json.loads(sys.argv[1])
    else:
        data = DATA_ORANGE_CI

    org_safe = re.sub(r"[^a-zA-Z0-9]+", "_",
        unicodedata.normalize("NFD", data["prospect"])
        .encode("ascii", "ignore").decode()).strip("_")
    pack_id = data.get("pack_id", "pack-unknown")
    out = f"/Users/marius_ayoro/Downloads/MiniCatalogue_TransferAI_{org_safe}_V2.pdf"
    build_pdf(data, out)
