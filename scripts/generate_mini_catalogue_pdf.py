"""
Générateur de mini-catalogue prospect TransferAI — PDF natif via ReportLab
Fonctionne en local (Mac) et sur VPS Linux (n8n).
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os, sys, json

# ── Palette ───────────────────────────────────────────────────────────
C_BLEU      = colors.HexColor("#10263F")
C_BLEU_MOY  = colors.HexColor("#163556")
C_BLEU_CLR  = colors.HexColor("#244667")
C_ORANGE    = colors.HexColor("#E76F1D")
C_OR        = colors.HexColor("#C88C3A")
C_TEAL      = colors.HexColor("#1C8A78")
C_BLANC     = colors.white
C_CREME     = colors.HexColor("#F5EFE7")
C_CREME_R   = colors.HexColor("#FAECE7")
C_CREME_V   = colors.HexColor("#E1F5EE")
C_BLEU_TX   = colors.HexColor("#617086")
C_BLEU_PALE = colors.HexColor("#CFE0F0")
C_GRIS      = colors.HexColor("#C9D4E1")

W, H = A4
MARGE = 2.0 * cm


def styles():
    s = getSampleStyleSheet()

    def add(name, **kw):
        if name in s:
            s[name].__dict__.update(kw)
        else:
            s.add(ParagraphStyle(name=name, **kw))

    add("Header",     fontSize=8,   textColor=C_BLEU_TX, alignment=TA_CENTER, leading=10)
    add("Surtitre",   fontSize=8,   textColor=C_ORANGE,  bold=1, spaceAfter=2)
    add("TitreGrand", fontSize=22,  textColor=C_BLEU,    bold=1, spaceAfter=4, leading=26)
    add("TitreOrange",fontSize=22,  textColor=C_ORANGE,  bold=1, spaceAfter=6, leading=26)
    add("Sous",       fontSize=10,  textColor=C_BLEU_TX, spaceAfter=10, leading=13)
    add("Label",      fontSize=13,  textColor=C_ORANGE,  bold=1, spaceBefore=14, spaceAfter=4)
    add("Body",       fontSize=10.5,textColor=C_BLEU,    spaceAfter=5,  leading=14, alignment=TA_JUSTIFY)
    add("BodyMuted",  fontSize=10.5,textColor=C_BLEU_TX, spaceAfter=5,  leading=14, italic=1, alignment=TA_JUSTIFY)
    add("Bullet",     fontSize=10.5,textColor=C_BLEU,    spaceAfter=3,  leading=14, leftIndent=12, bulletIndent=0)
    add("BulletTeal", fontSize=10.5,textColor=C_TEAL,    spaceAfter=3,  leading=14, leftIndent=12, bold=1)
    add("Small",      fontSize=8,   textColor=C_BLEU_TX, spaceAfter=2,  leading=10)
    add("CellLabel",  fontSize=8,   textColor=C_ORANGE,  bold=1, leading=10)
    add("CellBody",   fontSize=9.5, textColor=C_BLEU,    leading=13)
    add("CellWhite",  fontSize=9,   textColor=C_BLANC,   leading=12)
    add("CellOr",     fontSize=9,   textColor=C_OR,      bold=1, leading=12)
    add("CellBefore", fontSize=10,  textColor=colors.HexColor("#712B13"), leading=14, alignment=TA_JUSTIFY)
    add("CellAfter",  fontSize=10,  textColor=colors.HexColor("#085041"), leading=14, alignment=TA_JUSTIFY)
    add("TagBefore",  fontSize=8,   textColor=colors.HexColor("#993C1D"), bold=1)
    add("TagAfter",   fontSize=8,   textColor=colors.HexColor("#0F6E56"), bold=1)
    add("Gain",       fontSize=10,  textColor=C_BLANC,   bold=1, leading=13)
    add("StepDelai",  fontSize=16,  textColor=C_ORANGE,  bold=1, leading=18)
    add("StepTitre",  fontSize=10,  textColor=C_BLEU,    bold=1, leading=13)
    add("StepDesc",   fontSize=9,   textColor=C_BLEU_TX, leading=12)
    add("Footer",     fontSize=7.5, textColor=C_BLEU_TX, alignment=TA_CENTER, leading=10)
    return s


def banner(text, bg=C_BLEU, fg=C_BLANC, size=10.5, bold=False):
    st = ParagraphStyle("_b", fontSize=size, textColor=fg,
                        bold=bold, leading=size*1.3, alignment=TA_JUSTIFY)
    t = Table([[Paragraph(text, st)]],
              colWidths=[W - 2*MARGE])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), bg),
        ("TOPPADDING",    (0,0), (-1,-1), 7),
        ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ("LEFTPADDING",   (0,0), (-1,-1), 10),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
    ]))
    return t


def section_title(text, ST):
    return Paragraph(f"▌ {text}", ST["Label"])


def avant_apres(avant_text, apres_text, ST):
    av = [
        Paragraph("AVANT", ST["TagBefore"]),
        Spacer(1, 3),
        Paragraph(avant_text, ST["CellBefore"]),
    ]
    ap = [
        Paragraph("APRÈS", ST["TagAfter"]),
        Spacer(1, 3),
        Paragraph(apres_text, ST["CellAfter"]),
    ]
    col = (W - 2*MARGE) / 2 - 3
    t = Table([[av, ap]], colWidths=[col, col])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (0,-1), C_CREME_R),
        ("BACKGROUND",    (1,0), (1,-1), C_CREME_V),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("TOPPADDING",    (0,0), (-1,-1), 7),
        ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("LINEABOVE",     (0,0), (-1,0), 0.5, C_GRIS),
        ("LINEBELOW",     (0,-1), (-1,-1), 0.5, C_GRIS),
        ("LINEBEFORE",    (0,0), (0,-1), 0.5, C_GRIS),
        ("LINEAFTER",     (-1,0), (-1,-1), 0.5, C_GRIS),
        ("INNERGRID",     (0,0), (-1,-1), 0.5, C_GRIS),
    ]))
    return t


def meta_row(public, duree, niveau, ST):
    cells = [
        [Paragraph("Public cible", ST["CellLabel"]), Paragraph(public, ST["CellBody"])],
        [Paragraph("Durée", ST["CellLabel"]),        Paragraph(duree, ST["CellBody"])],
        [Paragraph("Niveau", ST["CellLabel"]),       Paragraph(niveau, ST["CellBody"])],
    ]
    col = (W - 2*MARGE) / 3 - 2
    t = Table(cells, colWidths=[col, col, col])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), C_CREME),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("INNERGRID",     (0,0), (-1,-1), 0.5, C_GRIS),
        ("BOX",           (0,0), (-1,-1), 0.5, C_GRIS),
    ]))
    return t


def gain_row(gain_text, ST):
    t = Table([[Paragraph(f"  Gain attendu  ·  {gain_text}", ST["Gain"])]],
              colWidths=[W - 2*MARGE])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), C_BLEU_MOY),
        ("TOPPADDING",    (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING",   (0,0), (-1,-1), 10),
    ]))
    return t


def plan_table(etapes, ST):
    cells = []
    for delai, titre, desc in etapes:
        cells.append([
            Paragraph(delai, ST["StepDelai"]),
            Paragraph(titre, ST["StepTitre"]),
            Paragraph(desc,  ST["StepDesc"]),
        ])
    col_w = [(W - 2*MARGE) * r for r in [0.12, 0.25, 0.63]]
    t = Table(cells, colWidths=col_w)
    for i in range(len(etapes)):
        bg = C_CREME if i % 2 == 0 else colors.HexColor("#EDE8E2")
        t.setStyle(TableStyle([
            ("BACKGROUND",    (0,i), (-1,i), bg),
            ("TOPPADDING",    (0,i), (-1,i), 6),
            ("BOTTOMPADDING", (0,i), (-1,i), 6),
            ("LEFTPADDING",   (0,i), (-1,i), 6),
            ("RIGHTPADDING",  (0,i), (-1,i), 6),
            ("VALIGN",        (0,i), (-1,i), "MIDDLE"),
            ("LINEBELOW",     (0,i), (-1,i), 0.5, C_GRIS),
        ]))
    t.setStyle(TableStyle([
        ("BOX", (0,0), (-1,-1), 0.5, C_GRIS),
    ]))
    return t


def cta_table(calendly, audit_url, ST):
    col = (W - 2*MARGE) / 2 - 2
    cells = [[
        [Paragraph("Rendez-vous expert →", ST["CellOr"]),
         Spacer(1,2),
         Paragraph(calendly, ST["CellWhite"])],
        [Paragraph("Formulaire d'audit →", ST["CellOr"]),
         Spacer(1,2),
         Paragraph(audit_url, ST["CellWhite"])],
    ]]
    t = Table(cells, colWidths=[col, col])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), C_BLEU_CLR),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING",   (0,0), (-1,-1), 10),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
        ("INNERGRID",     (0,0), (-1,-1), 0.5, C_BLEU_MOY),
        ("BOX",           (0,0), (-1,-1), 0.5, C_BLEU_MOY),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
    ]))
    return t


# ════════════════════════════════════════════════════════════════════
# BUILD
# ════════════════════════════════════════════════════════════════════

def build_pdf(data, out_path):
    ST = styles()

    doc = SimpleDocTemplate(
        out_path, pagesize=A4,
        leftMargin=MARGE, rightMargin=MARGE,
        topMargin=1.6*cm, bottomMargin=1.6*cm,
    )

    prospect     = data["prospect"]
    secteur      = data["secteur"]
    pays         = data.get("pays", "")
    date_doc     = data.get("date_doc", "2026")
    pack_id      = data.get("pack_id", "")
    enjeux       = data["enjeux_audit"]
    formations   = data["formations"]
    calendly_url = data.get("calendly_url", "https://calendly.com/contact-transferai/30min")
    audit_url    = data.get("audit_url",
        f"https://www.transferai.ci/questionnaire-audit?pack_id={pack_id}" if pack_id
        else "https://www.transferai.ci/questionnaire-audit")

    story = []

    # ── EN-TÊTE ──────────────────────────────────────────────────────
    story.append(Paragraph(
        "TransferAI Africa  ·  www.transferai.ci  ·  IA Assistant / WhatsApp : +225 07 16 57 39 90",
        ST["Header"]))
    story.append(HRFlowable(width="100%", thickness=1, color=C_ORANGE, spaceAfter=8))

    # ── COUVERTURE ────────────────────────────────────────────────────
    story.append(Paragraph("MINI-CATALOGUE PERSONNALISÉ", ST["Surtitre"]))
    story.append(Paragraph("Formations IA prioritaires recommandées pour", ST["TitreGrand"]))
    story.append(Paragraph(prospect, ST["TitreOrange"]))
    story.append(Paragraph(f"{secteur}  ·  {pays}  ·  {date_doc}", ST["Sous"]))
    story.append(banner(
        "Ce document a été construit à partir des enjeux identifiés lors de votre pré-audit "
        "TransferAI. Il ne présente pas un catalogue général — il sélectionne les formations "
        "les plus utiles pour vos équipes, avec les gains attendus, les livrables remis et le "
        "plan d'action associé.",
        bg=C_BLEU, size=10.5))
    story.append(HRFlowable(width="100%", thickness=1, color=C_GRIS, spaceBefore=8, spaceAfter=8))

    # ── SECTION 00 ────────────────────────────────────────────────────
    story.append(section_title(f"00 — Ce document vous est adressé, {prospect}", ST))
    story.append(Paragraph(
        f"À la suite de votre pré-audit TransferAI, nous avons identifié des enjeux "
        f"prioritaires dans vos opérations {secteur.lower()}. Ce mini-catalogue sélectionne "
        f"uniquement les formations qui correspondent à ce que vos équipes vivent réellement "
        f"aujourd'hui — pas un catalogue générique.",
        ST["Body"]))
    story.append(Paragraph(
        "Chaque formation inclut : la situation constatée, ce qui change après la formation, "
        "les objectifs pédagogiques, les livrables remis et le gain mesurable attendu.",
        ST["BodyMuted"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_GRIS, spaceBefore=6, spaceAfter=6))

    # ── SECTION 01 — Enjeux ──────────────────────────────────────────
    story.append(section_title("01 — Ce que le pré-audit révèle", ST))

    for enjeu in enjeux:
        block = [
            banner(f"{enjeu['num']}  ·  {enjeu['titre']}", bg=C_BLEU_MOY, size=11),
            Spacer(1, 4),
            Paragraph(enjeu["constat"], ST["Body"]),
            Spacer(1, 3),
            Paragraph(
                f"<b><font color='#E76F1D'>Signaux observés  ·  </font></b>"
                f"<i><font color='#617086'>{enjeu['signal']}</font></i>",
                ParagraphStyle("_sig", fontSize=10, leading=13)),
            Spacer(1, 10),
        ]
        story.extend(block)

    story.append(HRFlowable(width="100%", thickness=0.5, color=C_GRIS, spaceBefore=2, spaceAfter=6))

    # ── SECTION 02 — Formations ───────────────────────────────────────
    story.append(section_title("02 — Formations prioritaires recommandées", ST))
    story.append(Paragraph(
        f"Ces formations ont été sélectionnées spécifiquement pour {prospect} "
        "sur la base des enjeux détectés. Elles sont conçues pour être opérationnelles "
        "dès la fin de la session.",
        ST["BodyMuted"]))
    story.append(Spacer(1, 8))

    for f in formations:
        block = [
            # En-tête formation
            banner(f"{f['num']}  ·  {f['intitule']}", bg=C_ORANGE, fg=C_BLANC, size=12, bold=True),
            Spacer(1, 4),
            # Méta
            meta_row(f["public"], f["duree"], f["niveau"], ST),
            Spacer(1, 8),
            # Avant / Après
            Paragraph("<b>Situation actuelle → Ce qui change</b>",
                      ParagraphStyle("_sac", fontSize=10, textColor=C_BLEU, leading=13, spaceBefore=2, spaceAfter=4)),
            avant_apres(f["probleme"], f["apres"], ST),
            Spacer(1, 8),
            # Objectifs
            Paragraph("<b>Objectifs pédagogiques</b>",
                      ParagraphStyle("_obj", fontSize=10, textColor=C_BLEU, bold=1, leading=13, spaceAfter=4)),
        ]
        for obj in f["objectifs"]:
            block.append(Paragraph(f"•  {obj}", ST["Bullet"]))
        block.append(Spacer(1, 6))

        # Livrables
        block.append(Paragraph("<b>Livrables remis à la fin</b>",
            ParagraphStyle("_liv", fontSize=10, textColor=C_TEAL, bold=1, leading=13, spaceAfter=4)))
        for liv in f["livrables"]:
            block.append(Paragraph(f"•  {liv}", ST["BulletTeal"]))
        block.append(Spacer(1, 6))

        # Gain
        block.append(gain_row(f["gain"], ST))
        block.append(Spacer(1, 16))

        story.append(KeepTogether(block[:6]))
        story.extend(block[6:])

    story.append(HRFlowable(width="100%", thickness=0.5, color=C_GRIS, spaceBefore=2, spaceAfter=6))

    # ── SECTION 03 — Livrables globaux ───────────────────────────────
    story.append(section_title("03 — Livrables remis à l'issue du dispositif", ST))
    for liv in data.get("livrables_globaux", []):
        story.append(Paragraph(f"•  {liv}", ST["Bullet"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_GRIS, spaceBefore=8, spaceAfter=6))

    # ── SECTION 04 — Plan 90 jours ────────────────────────────────────
    story.append(section_title("04 — Parcours recommandé sur 90 jours", ST))
    etapes = data.get("plan_90j", [
        ("J+0",  "Audit & cadrage",       "Confirmation des enjeux, sélection des formations prioritaires."),
        ("J+15", "Premières formations",  "Formation F1 et F2 avec équipes ciblées."),
        ("J+45", "Pilote & formation F3", "Déploiement copilote, base de connaissances."),
        ("J+90", "Mesure & extension",    "Revue des KPI, décision d'extension."),
    ])
    story.append(plan_table(etapes, ST))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_GRIS, spaceBefore=8, spaceAfter=6))

    # ── SECTION 05 — CTA ─────────────────────────────────────────────
    story.append(section_title("05 — Prochaine étape", ST))
    story.append(banner(
        "Planifier un audit de cadrage gratuit (30 minutes) pour confirmer les priorités "
        "et définir le périmètre des premières formations.",
        bg=C_BLEU, size=10.5))
    story.append(Spacer(1, 6))
    story.append(cta_table(calendly_url, audit_url, ST))
    story.append(Spacer(1, 12))

    # ── PIED DE PAGE ─────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_GRIS, spaceBefore=4, spaceAfter=4))
    story.append(Paragraph(
        "TransferAI Africa  ·  Hub IA de NettelecomCI  ·  www.transferai.ci  "
        "·  contact@transferai.ci  ·  +225 07 16 57 39 90",
        ST["Footer"]))

    doc.build(story)
    print(f"✓ PDF : {out_path}")
    return out_path


# ════════════════════════════════════════════════════════════════════
# DONNÉES ORANGE CI — exemple de référence
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
                "de scripts unifiés, entraînant des délais de traitement allongés et une insatisfaction mesurable."
            ),
            "signal": "Temps moyen de réponse élevé · Taux de réclamations répétées · Qualité inégale entre canaux",
        },
        {
            "num": "02",
            "titre": "Préparation et exploitation des reportings managériaux",
            "constat": (
                "La consolidation des indicateurs de performance (churn, NPS, incidents réseau, "
                "mobile money) reste manuelle et chronophage. Les comités disposent de données "
                "sans synthèses exploitables, ce qui ralentit les prises de décision."
            ),
            "signal": "Temps de préparation des comités · Délai d'analyse des verbatims · Décisions ralenties",
        },
        {
            "num": "03",
            "titre": "Structuration et diffusion des procédures terrain",
            "constat": (
                "Les procédures opérationnelles, scripts et bonnes pratiques sont dispersés dans des "
                "fichiers non centralisés. L'onboarding de nouveaux agents est long, la montée en "
                "compétences inégale selon les équipes et les régions."
            ),
            "signal": "Durée d'onboarding · Écarts de qualité entre régions · Procédures non à jour",
        },
    ],

    "formations": [
        {
            "num": "F1",
            "intitule": "Copilote service client multicanal avec l'IA",
            "public": "Superviseurs service client, chefs d'équipe front office, responsables relation client",
            "duree": "2 jours (présentiel ou hybride)",
            "niveau": "Débutant à intermédiaire",
            "probleme": (
                "Les agents répondent différemment selon leur expérience. Les scripts sont éparpillés, "
                "rarement mis à jour et peu utilisés en situation réelle."
            ),
            "apres": (
                "Chaque agent dispose d'un copilote IA pour formuler et valider ses réponses selon le "
                "canal. Les réponses sont homogènes, traçables et conformes à la charte qualité."
            ),
            "objectifs": [
                "Utiliser un assistant IA pour structurer les réponses client en temps réel",
                "Adapter le ton et le format selon le canal et le motif de contact",
                "Réduire les escalades inutiles grâce à une meilleure qualification initiale",
                "Mettre en place une supervision humaine des réponses générées",
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
            "duree": "1 jour (présentiel, format décideurs)",
            "niveau": "Intermédiaire",
            "probleme": (
                "Les données existent mais les synthèses sont réalisées manuellement par 2 ou 3 personnes. "
                "Les signaux de churn et d'insatisfaction sont détectés trop tard."
            ),
            "apres": (
                "Les managers reçoivent des synthèses automatisées avant chaque comité. Les verbatims "
                "clients sont analysés en quelques minutes. Les signaux de churn remontent automatiquement."
            ),
            "objectifs": [
                "Produire des synthèses managériales à partir des données existantes (CRM, tickets, NPS)",
                "Analyser automatiquement les verbatims et classer les motifs d'insatisfaction",
                "Détecter les signaux de churn et construire un tableau de bord IA simple",
                "Définir un cadre de validation humaine avant diffusion des analyses",
            ],
            "livrables": [
                "Modèle de synthèse IA pour comité de direction (format hebdomadaire)",
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
                "L'onboarding d'un agent prend entre 3 et 6 semaines. Les écarts entre agences sont importants."
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
                "Architecture de la base de connaissances IA (structure, catégories, droits d'accès)",
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
        ("J+0",  "Audit & cadrage",       "Confirmation des 3 enjeux, sélection formations prioritaires, KPI définis."),
        ("J+15", "Premières formations",  "Formation F1 (service client) et F2 (reporting) avec équipes ciblées."),
        ("J+45", "Pilote & formation F3", "Copilote déployé, base de connaissances lancée, formation terrain réalisée."),
        ("J+90", "Mesure & extension",    "Revue des KPI, décision d'extension sur les autres équipes et usages."),
    ],
}


if __name__ == "__main__":
    import unicodedata, re

    if len(sys.argv) > 1:
        data = json.loads(sys.argv[1])
    else:
        data = DATA_ORANGE_CI

    org_safe = re.sub(r"[^a-zA-Z0-9]+", "_",
        unicodedata.normalize("NFD", data["prospect"])
        .encode("ascii", "ignore").decode()).strip("_")
    pack_id = data.get("pack_id", "pack-unknown")
    out = f"/Users/marius_ayoro/Downloads/MiniCatalogue_TransferAI_{org_safe}_{pack_id}.pdf"

    build_pdf(data, out)
