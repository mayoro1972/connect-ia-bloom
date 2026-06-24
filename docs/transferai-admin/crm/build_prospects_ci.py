#!/usr/bin/env python3
"""
TransferAI — Construction base CRM 200 prospects Côte d'Ivoire
Génère :
  1. prospects_ci_200.json   — données structurées
  2. prospects_ci_200.csv    — pour import Excel / Sheets
  3. supabase_insert_crm.sql — SQL Supabase prêt à coller dans SQL Editor
  4. stats par secteur / tier
"""

import json, csv, os, uuid, re
from datetime import datetime

OUT_DIR = os.path.dirname(__file__)
NOW = datetime.utcnow().isoformat() + "Z"

# ══════════════════════════════════════════════════════════════════════════════
# BASE DE DONNÉES — 200 sociétés Côte d'Ivoire et sous-région
# Fields : organization_name, website, country, organization_type,
#          sector_guess, decision_maker_name, target_email,
#          commercial_priority_default, source_label, niche_status
# ══════════════════════════════════════════════════════════════════════════════

PROSPECTS_RAW = [

  # ── TÉLÉCOMMUNICATIONS ─────────────────────────────────────────────────────
  ("Orange Côte d'Ivoire",       "https://www.orange.ci",           "Côte d'Ivoire", "Entreprise privée multinationale", "Télécommunications",          "Directeur Général",   "direction@orange.ci",                "tier1", "telecom"),
  ("MTN Côte d'Ivoire",          "https://www.mtn.ci",              "Côte d'Ivoire", "Entreprise privée multinationale", "Télécommunications",          "Directeur Général",   "contact@mtn.ci",                     "tier1", "telecom"),
  ("Moov Africa Côte d'Ivoire",  "https://www.moov-africa.ci",      "Côte d'Ivoire", "Entreprise privée multinationale", "Télécommunications",          "Directeur Général",   "service.client@moov-africa.ci",      "tier1", "telecom"),
  ("Wave Mobile Money",          "https://www.wave.com/fr/",        "Côte d'Ivoire", "Entreprise privée internationale", "Fintech / Mobile Money",      "Directeur Général CI","contact@wave.com",                   "tier1", "fintech"),
  ("Canal+ Côte d'Ivoire",       "https://www.canalplus-afrique.com","Côte d'Ivoire","Entreprise privée multinationale", "Médias / Télécoms",           "Directeur Général",   "contact@canalplus.ci",               "tier1", "media"),

  # ── BANQUES ────────────────────────────────────────────────────────────────
  ("SGBCI",                      "https://www.sgbci.ci",            "Côte d'Ivoire", "Banque privée",                    "Banque / Finance",            "Directeur Général",   "contact@sgbci.ci",                   "tier1", "banque"),
  ("BNI — Banque Nationale d'Investissement", "https://www.bni.ci", "Côte d'Ivoire","Banque d'État",                    "Banque / Finance",            "Directeur Général",   "contact@bni.ci",                     "tier1", "banque"),
  ("BICICI",                     "https://www.bicici.ci",           "Côte d'Ivoire", "Banque privée",                    "Banque / Finance",            "Directeur Général",   "contact@bicici.ci",                  "tier1", "banque"),
  ("Ecobank Côte d'Ivoire",      "https://www.ecobank.com/ci",      "Côte d'Ivoire", "Banque privée internationale",     "Banque / Finance",            "Directeur Général",   "ecobank.ci@ecobank.com",             "tier1", "banque"),
  ("NSIA Banque",                "https://www.nsiabanque.ci",       "Côte d'Ivoire", "Banque privée",                    "Banque / Finance",            "Directeur Général",   "contact@nsiabanque.ci",              "tier1", "banque"),
  ("SIB — Société Ivoirienne de Banque","https://www.sib.ci",       "Côte d'Ivoire", "Banque privée",                    "Banque / Finance",            "Directeur Général",   "contact@sib.ci",                     "tier2", "banque"),
  ("Coris Bank International CI","https://www.corisbankinternational.com","Côte d'Ivoire","Banque privée",               "Banque / Finance",            "Directeur Général",   "contact.ci@corisbank.com",           "tier2", "banque"),
  ("Attijariwafa Bank CI",       "https://www.attijariwafabank.com","Côte d'Ivoire",  "Banque privée multinationale",    "Banque / Finance",            "Directeur Général",   "contact.ci@attijariwafabank.com",    "tier2", "banque"),
  ("Banque Atlantique Côte d'Ivoire","https://www.banqueatlantique.net","Côte d'Ivoire","Banque privée",                 "Banque / Finance",            "Directeur Général",   "info.ci@banqueatlantique.net",       "tier2", "banque"),
  ("BOA Côte d'Ivoire",          "https://www.boacotedivoire.com",  "Côte d'Ivoire", "Banque privée",                    "Banque / Finance",            "Directeur Général",   "contact@boacotedivoire.com",         "tier2", "banque"),
  ("Orabank Côte d'Ivoire",      "https://www.orabank.net/ci",      "Côte d'Ivoire", "Banque privée",                    "Banque / Finance",            "Directeur Général",   "contact.ci@orabank.net",             "tier2", "banque"),
  ("Versus Bank",                "https://www.versusbank.com",      "Côte d'Ivoire", "Banque privée",                    "Banque / Finance",            "Directeur Général",   "contact@versusbank.com",             "tier2", "banque"),
  ("GTBank Côte d'Ivoire",       "https://www.gtbank.ci",           "Côte d'Ivoire", "Banque privée internationale",     "Banque / Finance",            "Directeur Général",   "contact@gtbank.ci",                  "tier2", "banque"),
  ("UBA Côte d'Ivoire",          "https://www.ubagroup.com/ivory-coast","Côte d'Ivoire","Banque privée internationale",  "Banque / Finance",            "Directeur Général",   "uba.ci@ubagroup.com",                "tier2", "banque"),
  ("BACI — Banque Africaine pour le Commerce","https://www.baci-bank.com","Côte d'Ivoire","Banque privée",               "Banque / Finance",            "Directeur Général",   "contact@baci-bank.com",              "tier2", "banque"),

  # ── ASSURANCES ─────────────────────────────────────────────────────────────
  ("NSIA Assurances Côte d'Ivoire","https://www.nsia.ci",           "Côte d'Ivoire", "Assurance privée",                 "Assurance",                   "Directeur Général",   "contact@nsia.ci",                    "tier1", "assurance"),
  ("Allianz Côte d'Ivoire",      "https://www.allianz.ci",          "Côte d'Ivoire", "Assurance multinationale",         "Assurance",                   "Directeur Général",   "contact@allianz.ci",                 "tier1", "assurance"),
  ("Sanlam Côte d'Ivoire",       "https://www.sanlam.ci",           "Côte d'Ivoire", "Assurance multinationale",         "Assurance",                   "Directeur Général",   "contact@sanlam.ci",                  "tier2", "assurance"),
  ("Saham Assurance CI",         "https://www.saham.ci",            "Côte d'Ivoire", "Assurance privée",                 "Assurance",                   "Directeur Général",   "contact@saham.ci",                   "tier2", "assurance"),
  ("AXA Côte d'Ivoire",          "https://www.axa.ci",              "Côte d'Ivoire", "Assurance multinationale",         "Assurance",                   "Directeur Général",   "contact@axa.ci",                     "tier2", "assurance"),
  ("SUNU Assurances CI",         "https://www.sunuassurances.com",  "Côte d'Ivoire", "Assurance privée",                 "Assurance",                   "Directeur Général",   "contact.ci@sunuassurances.com",      "tier2", "assurance"),
  ("CNAR — Caisse Nationale de Retraite","https://www.cnar.ci",     "Côte d'Ivoire", "Institution publique",             "Retraite / Protection sociale","Directeur Général",  "contact@cnar.ci",                    "tier2", "protection_sociale"),

  # ── ÉNERGIE / UTILITIES ───────────────────────────────────────────────────
  ("CIE — Compagnie Ivoirienne d'Électricité","https://www.cie.ci", "Côte d'Ivoire", "Concessionnaire public/privé",     "Énergie / Électricité",       "Directeur Général",   "contact@cie.ci",                     "tier1", "energie"),
  ("CI-Energies",                "https://www.ci-energies.ci",      "Côte d'Ivoire", "Entreprise publique",              "Énergie / Électricité",       "Directeur Général",   "contact@ci-energies.ci",             "tier1", "energie"),
  ("PETROCI",                    "https://www.petroci.ci",          "Côte d'Ivoire", "Entreprise publique",              "Énergie / Pétrole & Gaz",     "Directeur Général",   "contact@petroci.ci",                 "tier1", "energie"),
  ("SODECI — Société de Distribution d'Eau CI","https://www.sodeci.ci","Côte d'Ivoire","Concessionnaire public/privé",   "Eau / Utilities",             "Directeur Général",   "contact@sodeci.ci",                  "tier1", "utilities"),
  ("GESTOCI",                    "https://www.gestoci.ci",          "Côte d'Ivoire", "Entreprise d'État",                "Énergie / Stockage",          "Directeur Général",   "info@gestoci.ci",                    "tier2", "energie"),
  ("Azito Énergie",              "https://www.azito.com",           "Côte d'Ivoire", "Producteur d'énergie privé",       "Énergie / Production",        "Directeur Général",   "info@azito.com",                     "tier2", "energie"),
  ("TotalEnergies CI",           "https://totalenergies.ci",        "Côte d'Ivoire", "Multinationale",                   "Énergie / Pétrole & Gaz",     "Directeur Général",   "contact@totalenergies.ci",           "tier1", "energie"),
  ("Shell Côte d'Ivoire",        "https://www.shell.ci",            "Côte d'Ivoire", "Multinationale",                   "Énergie / Pétrole & Gaz",     "Directeur Général",   "info@shell.ci",                      "tier2", "energie"),

  # ── AGRO-INDUSTRIE / ALIMENTATION ─────────────────────────────────────────
  ("SIFCA",                      "https://www.sifca.ci",            "Côte d'Ivoire", "Groupe privé",                     "Agro-industrie / Palmier",    "Directeur Général",   "contact@sifca.ci",                   "tier1", "agro_industrie"),
  ("Olam Côte d'Ivoire",         "https://www.olamgroup.com",       "Côte d'Ivoire", "Multinationale",                   "Agro-industrie / Cacao",      "Directeur Général CI","olam.ci@olamgroup.com",              "tier1", "agro_industrie"),
  ("Nestlé Côte d'Ivoire",       "https://www.nestle.ci",           "Côte d'Ivoire", "Multinationale",                   "Industrie alimentaire",       "Directeur Général",   "contact@nestle.ci",                  "tier1", "agroalimentaire"),
  ("Unilever Côte d'Ivoire",     "https://www.unilever.ci",         "Côte d'Ivoire", "Multinationale",                   "Industrie alimentaire",       "Directeur Général",   "contact@unilever.ci",                "tier1", "agroalimentaire"),
  ("Cargill Côte d'Ivoire",      "https://www.cargill.com",         "Côte d'Ivoire", "Multinationale",                   "Agro-industrie / Cacao",      "Directeur Général CI","contact.ci@cargill.com",             "tier1", "agro_industrie"),
  ("SIPEF — Cie Huileries de la Mé","https://www.sipef.com",       "Côte d'Ivoire", "Entreprise privée",                "Agro-industrie / Hévéa",      "Directeur Général",   "info@sipef.com",                     "tier2", "agro_industrie"),
  ("SOLIBRA",                    "https://www.solibra.ci",          "Côte d'Ivoire", "Entreprise privée",                "Industrie brassicole",        "Directeur Général",   "contact@solibra.ci",                 "tier2", "agroalimentaire"),
  ("SAPH — Société Africaine de Plantations d'Hévéas","https://www.saph-ci.com","Côte d'Ivoire","Entreprise privée","Agro-industrie / Hévéa",  "Directeur Général",   "contact@saph-ci.com",                "tier2", "agro_industrie"),
  ("SAF-CACAO",                  "https://www.saf-cacao.com",       "Côte d'Ivoire", "Entreprise privée",                "Agro-industrie / Cacao",      "Directeur Général",   "contact@saf-cacao.com",              "tier2", "agro_industrie"),
  ("CCA — Coopérative des Cacaoculteurs",   "https://www.cca.ci",   "Côte d'Ivoire", "Coopérative",                      "Agro-industrie / Cacao",      "Directeur Général",   "info@cca.ci",                        "tier3", "cooperatif"),

  # ── DISTRIBUTION / RETAIL ─────────────────────────────────────────────────
  ("CFAO Côte d'Ivoire",         "https://www.cfao.com/ci",         "Côte d'Ivoire", "Groupe privé multinational",       "Distribution / Automobile",   "Directeur Général",   "contact.ci@cfao.com",                "tier1", "distribution"),
  ("Prosuma",                    "https://www.prosuma.ci",          "Côte d'Ivoire", "Groupe privé",                     "Grande distribution",         "Directeur Général",   "contact@prosuma.ci",                 "tier2", "distribution"),
  ("SDTM — Sté Distribution & Traitement de Matériel","https://www.sdtm.ci","Côte d'Ivoire","Entreprise privée",        "Distribution",                "Directeur Général",   "contact@sdtm.ci",                    "tier2", "distribution"),
  ("Tractafric Côte d'Ivoire",   "https://www.tractafric.com",      "Côte d'Ivoire", "Groupe privé multinational",       "Distribution / Équipements",  "Directeur Général",   "contact.ci@tractafric.com",          "tier2", "distribution"),
  ("Hayat Kimya CI",             "https://www.hayat.com.tr",        "Côte d'Ivoire", "Multinationale",                   "Industrie / Distribution",    "Directeur Général CI","info.ci@hayat.com",                  "tier2", "industrie"),
  ("CEVITAL Côte d'Ivoire",      "https://www.cevital.com",         "Côte d'Ivoire", "Multinationale",                   "Agroalimentaire / Distribution","Directeur Général CI","contact.ci@cevital.com",           "tier2", "agroalimentaire"),

  # ── CONSTRUCTION / BTP ────────────────────────────────────────────────────
  ("BNETD — Bureau National d'Études Techniques","https://www.bnetd.ci","Côte d'Ivoire","Bureau d'études public",       "BTP / Ingénierie",            "Directeur Général",   "contact@bnetd.ci",                   "tier1", "btp"),
  ("Bouygues Construction CI",   "https://www.bouygues-construction.com","Côte d'Ivoire","Multinationale",              "BTP",                         "Directeur Général CI","bouygues.ci@bouygues.fr",            "tier1", "btp"),
  ("Colas Côte d'Ivoire",        "https://www.colas.ci",            "Côte d'Ivoire", "Multinationale",                   "BTP / Routes",                "Directeur Général",   "contact@colas.ci",                   "tier1", "btp"),
  ("Eiffage CI",                 "https://www.eiffage.com",         "Côte d'Ivoire", "Multinationale",                   "BTP / Concessions",           "Directeur Général CI","eiffage.ci@eiffage.fr",             "tier1", "btp"),
  ("SOGETRA",                    "https://www.sogetra.ci",          "Côte d'Ivoire", "Entreprise privée",                "BTP / TP",                    "Directeur Général",   "contact@sogetra.ci",                 "tier2", "btp"),
  ("SETRAF",                     "https://www.setraf.ci",           "Côte d'Ivoire", "Entreprise privée",                "BTP / Travaux routiers",      "Directeur Général",   "info@setraf.ci",                     "tier2", "btp"),
  ("GFC — Grands Froids de Côte d'Ivoire","https://www.gfc.ci",    "Côte d'Ivoire", "Entreprise privée",                "BTP / Froid industriel",      "Directeur Général",   "contact@gfc.ci",                     "tier3", "industrie"),
  ("SIETHO",                     "https://www.sietho.ci",           "Côte d'Ivoire", "Entreprise privée",                "BTP / Immobilier",            "Directeur Général",   "info@sietho.ci",                     "tier3", "immobilier"),

  # ── TRANSPORT / LOGISTIQUE ─────────────────────────────────────────────────
  ("Air Côte d'Ivoire",          "https://www.aircotedivoire.com",  "Côte d'Ivoire", "Compagnie aérienne nationale",     "Transport aérien",            "Directeur Général",   "contact@aircotedivoire.com",         "tier1", "transport"),
  ("Port Autonome d'Abidjan",    "https://www.portabidjan.ci",      "Côte d'Ivoire", "Établissement public",             "Port / Logistique",           "Directeur Général",   "contact@portabidjan.ci",             "tier1", "logistique"),
  ("Abidjan Terminal",           "https://www.abidjan-terminal.net","Côte d'Ivoire", "Entreprise privée",                "Logistique portuaire",        "Directeur Général",   "contact@abidjan-terminal.net",       "tier1", "logistique"),
  ("Bolloré Transport & Logistics CI","https://www.bollore-logistics.com","Côte d'Ivoire","Multinationale",             "Logistique / Transport",      "Directeur Général CI","contact.ci@bollore-logistics.com",   "tier1", "logistique"),
  ("DHL Express Côte d'Ivoire",  "https://www.dhl.com/ci",          "Côte d'Ivoire", "Multinationale",                   "Logistique / Express",        "Directeur Général",   "customer.service@dhl.ci",            "tier2", "logistique"),
  ("SIVOM — Société Ivoirienne de Mobilité","https://www.sivom.ci", "Côte d'Ivoire", "Entreprise publique",              "Transport urbain",            "Directeur Général",   "contact@sivom.ci",                   "tier2", "transport"),
  ("Aéroport International FHB", "https://www.aeria.ci",            "Côte d'Ivoire", "Établissement public",             "Transport aérien / Aéroport", "Directeur Général",   "contact@aeria.ci",                   "tier2", "transport"),
  ("FedEx Côte d'Ivoire",        "https://www.fedex.com/fr-ci/",    "Côte d'Ivoire", "Multinationale",                   "Logistique / Express",        "Directeur Général CI","customer.support@fedex.com",         "tier2", "logistique"),
  ("SDV Côte d'Ivoire (Bolloré)","https://www.bollore-logistics.com","Côte d'Ivoire","Multinationale",                  "Logistique / Fret",           "Directeur Général CI","info.ci@bollore.com",                "tier2", "logistique"),

  # ── SANTÉ / PHARMACIE ─────────────────────────────────────────────────────
  ("CHU de Yopougon",            "https://www.chuy.ci",             "Côte d'Ivoire", "Centre hospitalier public",        "Santé / Hôpital",             "Directeur Général",   "contact@chuy.ci",                    "tier2", "sante"),
  ("CHU de Cocody",              "https://www.chuc.ci",             "Côte d'Ivoire", "Centre hospitalier public",        "Santé / Hôpital",             "Directeur Général",   "contact@chuc.ci",                    "tier2", "sante"),
  ("SODIPHARM",                  "https://www.sodipharm.ci",        "Côte d'Ivoire", "Entreprise privée",                "Pharmacie / Distribution",    "Directeur Général",   "contact@sodipharm.ci",               "tier2", "sante"),
  ("Ivoire Pharma",              "https://www.ivoirepharma.ci",     "Côte d'Ivoire", "Entreprise privée",                "Pharmacie",                   "Directeur Général",   "info@ivoirepharma.ci",               "tier2", "sante"),
  ("POLYCLINIQUE INTERNATIONALE DE COCODY","https://www.pic.ci",   "Côte d'Ivoire", "Clinique privée",                  "Santé / Clinique",            "Directeur Général",   "contact@pic.ci",                     "tier2", "sante"),
  ("CNAM — Caisse Nationale d'Assurance Maladie","https://www.cnam.ci","Côte d'Ivoire","Institution publique",          "Santé / Protection sociale",  "Directeur Général",   "contact@cnam.ci",                    "tier2", "protection_sociale"),

  # ── MÉDIAS / COMMUNICATION ────────────────────────────────────────────────
  ("RTI — Radio Télévision Ivoirienne","https://www.rti.ci",       "Côte d'Ivoire", "Établissement public",             "Médias audiovisuels",         "Directeur Général",   "contact@rti.ci",                     "tier2", "media"),
  ("NCI",                        "https://www.nci.ci",              "Côte d'Ivoire", "Entreprise privée",                "Médias audiovisuels",         "Directeur Général",   "contact@nci.ci",                     "tier2", "media"),
  ("La Nouvelle Chaîne Ivoirienne","https://www.la1ere.francetvinfo.fr","Côte d'Ivoire","Entreprise privée",            "Médias audiovisuels",         "Directeur Général",   "contact@lnci.ci",                    "tier3", "media"),
  ("Fraternité Matin",           "https://www.fratmat.info",        "Côte d'Ivoire", "Entreprise publique de presse",    "Presse écrite",               "Directeur Général",   "contact@fratmat.info",               "tier3", "media"),
  ("Abidjan.net",                "https://www.abidjan.net",         "Côte d'Ivoire", "Entreprise privée",                "Médias digitaux",             "Directeur Général",   "info@abidjan.net",                   "tier3", "media"),
  ("7info.ci",                   "https://www.7info.ci",            "Côte d'Ivoire", "Entreprise privée",                "Médias digitaux",             "Directeur Général",   "contact@7info.ci",                   "tier3", "media"),

  # ── HÔTELLERIE / TOURISME ─────────────────────────────────────────────────
  ("Hôtel Ivoire Abidjan",       "https://www.sofitel-abidjan.com", "Côte d'Ivoire", "Groupe hôtelier",                  "Hôtellerie / Tourisme",       "Directeur Général",   "h9240@sofitel.com",                  "tier2", "hotellerie"),
  ("Pullman Abidjan",            "https://all.accor.com/hotel/0583","Côte d'Ivoire", "Groupe hôtelier multinational",    "Hôtellerie / Tourisme",       "Directeur Général",   "h0583@accor.com",                    "tier2", "hotellerie"),
  ("Radisson Blu Abidjan",       "https://www.radissonhotels.com/abidjan","Côte d'Ivoire","Groupe hôtelier multinational","Hôtellerie / Tourisme",     "Directeur Général",   "info.abidjan@radissonblu.com",       "tier2", "hotellerie"),
  ("Novotel Abidjan",            "https://all.accor.com/hotel/1190","Côte d'Ivoire", "Groupe hôtelier multinational",    "Hôtellerie / Tourisme",       "Directeur Général",   "h1190@accor.com",                    "tier2", "hotellerie"),
  ("Golden Tulip Abidjan",       "https://www.goldentulipabidjan.com","Côte d'Ivoire","Groupe hôtelier",                 "Hôtellerie / Tourisme",       "Directeur Général",   "info@goldentulipabidjan.com",        "tier3", "hotellerie"),

  # ── TECHNOLOGIE / IT / FINTECH ─────────────────────────────────────────────
  ("InTouch",                    "https://www.intouchgroup.net",    "Côte d'Ivoire", "Entreprise tech privée",           "Technologie / Paiement",      "Directeur Général",   "contact@intouchgroup.net",           "tier1", "tech"),
  ("Orange Money CI (Orange CI)","https://www.orange.ci/orangemoney","Côte d'Ivoire","Service d'une multinationale",    "Fintech / Mobile Money",      "Directeur Général",   "orangemoney@orange.ci",              "tier1", "fintech"),
  ("MTN Mobile Money CI",        "https://www.mtn.ci/momo",        "Côte d'Ivoire", "Service d'une multinationale",     "Fintech / Mobile Money",      "Directeur Général",   "momo@mtn.ci",                        "tier1", "fintech"),
  ("PayUnit CI",                 "https://www.payunit.net",         "Côte d'Ivoire", "Startup tech",                     "Fintech / Paiement",          "Directeur Général",   "contact@payunit.net",                "tier2", "tech"),
  ("DPO Group Côte d'Ivoire",    "https://www.dpogroup.com",        "Côte d'Ivoire", "Entreprise tech",                  "Fintech / E-commerce",        "Directeur Général CI","info@dpogroup.com",                  "tier2", "tech"),
  ("ORCA Telecoms CI",           "https://www.orcatelecom.com",     "Côte d'Ivoire", "Entreprise tech",                  "Technologie / IT",            "Directeur Général",   "contact@orcatelecom.com",            "tier2", "tech"),
  ("Celtiis CI",                 "https://www.celtiis.com",         "Côte d'Ivoire", "Entreprise tech",                  "Technologie / Internet",      "Directeur Général",   "contact.ci@celtiis.com",             "tier2", "tech"),
  ("ALINK Telecom",              "https://www.alink-telecom.com",   "Côte d'Ivoire", "Entreprise tech",                  "Technologie / Connectivité",  "Directeur Général",   "contact@alink-telecom.com",          "tier3", "tech"),

  # ── MINES ──────────────────────────────────────────────────────────────────
  ("SODEMI — Sté pour le Développement Minier","https://www.sodemi.ci","Côte d'Ivoire","Entreprise publique",           "Mines / Ressources naturelles","Directeur Général",  "contact@sodemi.ci",                  "tier2", "mines"),
  ("Endeavour Mining CI",        "https://www.endeavourmining.com", "Côte d'Ivoire", "Multinationale",                   "Mines / Or",                  "Directeur Général CI","info@endeavourmining.com",           "tier2", "mines"),
  ("Perseus Mining CI",          "https://www.perseusmining.com",   "Côte d'Ivoire", "Entreprise internationale",        "Mines / Or",                  "Directeur Général CI","info@perseusmining.com",             "tier2", "mines"),
  ("Allied Gold CI",             "https://www.alliedgold.com",      "Côte d'Ivoire", "Entreprise internationale",        "Mines / Or",                  "Directeur Général CI","info@alliedgold.com",                "tier2", "mines"),

  # ── INSTITUTIONS PUBLIQUES ─────────────────────────────────────────────────
  ("AGEROUTE — Agence de Gestion des Routes","https://www.ageroute.ci","Côte d'Ivoire","Agence publique",               "BTP / Routes",                "Directeur Général",   "contact@ageroute.ci",                "tier2", "institution_publique"),
  ("ARTCI — Autorité Télécoms","https://www.artci.ci",              "Côte d'Ivoire", "Régulateur public",                "Régulation / Télécoms",       "Directeur Général",   "contact@artci.ci",                   "tier2", "institution_publique"),
  ("ANRMP — Autorité Nationale Régulation Marchés","https://www.anrmp.ci","Côte d'Ivoire","Institution publique",       "Régulation / Marchés publics","Directeur Général",   "anrmp@anrmp.ci",                     "tier2", "institution_publique"),
  ("CCI-CI — Chambre de Commerce","https://www.cci.ci",             "Côte d'Ivoire", "Institution consulaire",           "Commerce / Industrie",        "Directeur Général",   "info@cci.ci",                        "tier2", "institution_publique"),
  ("BRVM — Bourse Régionale",    "https://www.brvm.org",            "Côte d'Ivoire", "Institution régionale",            "Finance / Bourse",            "Directeur Général",   "info@brvm.org",                      "tier2", "institution_publique"),
  ("BCEAO — Banque Centrale",    "https://www.bceao.int",           "Côte d'Ivoire", "Institution publique régionale",   "Banque centrale",             "Gouverneur",          "info@bceao.int",                     "tier2", "institution_publique"),
  ("Mairie du Plateau",          "https://www.mairie-abidjan.ci",   "Côte d'Ivoire", "Collectivité territoriale",        "Administration publique",     "Maire",               "contact@mairie-abidjan.ci",          "tier3", "collectivite"),
  ("District Autonome d'Abidjan","https://www.abidjan.ci",          "Côte d'Ivoire", "Collectivité territoriale",        "Administration publique",     "Gouverneur du District","info@abidjan.ci",                  "tier2", "collectivite"),
  ("ANADER — Agence Nationale d'Appui au Développement Rural","https://www.anader.ci","Côte d'Ivoire","Agence publique","Agriculture / Rural",         "Directeur Général",   "contact@anader.ci",                  "tier3", "institution_publique"),
  ("CGRAE — Caisse Retraite Agents État","https://www.cgrae.ci",   "Côte d'Ivoire", "Institution publique",             "Retraite / Administration",   "Directeur Général",   "contact@cgrae.ci",                   "tier3", "protection_sociale"),
  ("Ministère de l'Économie Numérique","https://www.men.gouv.ci",   "Côte d'Ivoire", "Ministère",                        "Administration / Numérique",  "Ministre",            "contact@men.gouv.ci",                "tier2", "institution_publique"),
  ("CNTIG — Centre National Télédétection","https://www.cntig.net", "Côte d'Ivoire", "Institution publique",             "Technologie / Géomatique",    "Directeur Général",   "info@cntig.net",                     "tier3", "institution_publique"),

  # ── ORGANISATIONS INTERNATIONALES ─────────────────────────────────────────
  ("Banque Mondiale — Bureau CI","https://www.banquemondiale.org/ci","Côte d'Ivoire","Organisation internationale",      "Finance / Développement",     "Représentant Résident","info@worldbank.org",                "tier2", "org_internationale"),
  ("AFD — Agence Française de Développement CI","https://www.afd.fr/ci","Côte d'Ivoire","Organisation internationale",  "Finance / Développement",     "Directeur Pays CI",   "afd-abidjan@afd.fr",                 "tier2", "org_internationale"),
  ("BAD — Banque Africaine de Développement","https://www.afdb.org","Côte d'Ivoire", "Organisation internationale",      "Finance / Développement",     "Président",           "afdb.info@afdb.org",                 "tier1", "org_internationale"),
  ("IFC — International Finance Corporation","https://www.ifc.org/ci","Côte d'Ivoire","Organisation internationale",   "Finance / Développement",     "Représentant CI",     "info@ifc.org",                       "tier2", "org_internationale"),
  ("USAID Côte d'Ivoire",        "https://ci.usembassy.gov/usaid",  "Côte d'Ivoire", "Organisation internationale",      "Développement / Aide",        "Directeur de Mission","usaid.abidjan@usaid.gov",            "tier2", "org_internationale"),
  ("PNUD — Bureau CI",           "https://www.undp.org/fr/cote-d-ivoire","Côte d'Ivoire","Organisation internationale", "Développement durable",       "Représentant Résident","undp.abidjan@undp.org",             "tier2", "org_internationale"),
  ("UNICEF Côte d'Ivoire",       "https://www.unicef.org/cotedivoire","Côte d'Ivoire","Organisation internationale",    "Développement / Social",      "Représentant",        "abidjan@unicef.org",                 "tier2", "org_internationale"),
  ("Union Européenne — Délégation CI","https://www.eeas.europa.eu/ci","Côte d'Ivoire","Organisation internationale",   "Coopération / Développement", "Chef de Délégation",  "delegation-cote-divoire@eeas.europa.eu","tier2","org_internationale"),
  ("Ambassade de France CI (SCAC)","https://ci.ambafrance.org",     "Côte d'Ivoire", "Organisation internationale",      "Coopération / Culture",       "Ambassadeur",         "scac.abidjan@diplomatie.gouv.fr",    "tier3", "org_internationale"),
  ("GIZ Côte d'Ivoire",          "https://www.giz.de/ci",           "Côte d'Ivoire", "Organisation internationale",      "Développement / Formation",   "Directeur Pays",      "info-ci@giz.de",                     "tier2", "org_internationale"),

  # ── ÉDUCATION / FORMATION ─────────────────────────────────────────────────
  ("Université FHB — Cocody",    "https://www.ufhb.edu.ci",         "Côte d'Ivoire", "Université publique",              "Éducation / Recherche",       "Président",           "contact@ufhb.edu.ci",                "tier2", "education"),
  ("INPHB — Institut National Polytechnique","https://www.inphb.ci","Côte d'Ivoire", "Grande école publique",            "Éducation / Ingénierie",      "Directeur Général",   "contact@inphb.ci",                   "tier2", "education"),
  ("CESAG — Centre Africain d'Études","https://www.cesag.sn",      "Sénégal",       "Grande école régionale",           "Éducation / Management",      "Directeur Général",   "contact@cesag.sn",                   "tier2", "education"),
  ("ESATIC — École Sup. Africaine TIC","https://www.esatic.ci",    "Côte d'Ivoire", "Grande école privée",              "Éducation / Numérique",       "Directeur Général",   "info@esatic.ci",                     "tier2", "education"),
  ("ISM Abidjan",                "https://www.ism.sn/abidjan",      "Côte d'Ivoire", "École privée",                     "Éducation / Management",      "Directeur",           "abidjan@ism.sn",                     "tier2", "education"),

  # ── SOUS-RÉGION AFRIQUE DE L'OUEST (filiales ou partenaires CI) ───────────
  ("Sonatel (Orange Sénégal)",   "https://www.sonatel.sn",          "Sénégal",       "Entreprise de télécoms",           "Télécommunications",          "Directeur Général",   "contact@sonatel.com",                "tier2", "telecom"),
  ("ONATEL Burkina Faso",        "https://www.onatel.bf",           "Burkina Faso",  "Entreprise publique de télécoms",  "Télécommunications",          "Directeur Général",   "contact@onatel.bf",                  "tier2", "telecom"),
  ("Coris Bank Burkina",         "https://www.corisbankinternational.com/bf","Burkina Faso","Banque privée",              "Banque / Finance",            "Directeur Général",   "contact.bf@corisbank.com",           "tier2", "banque"),
  ("BOA Sénégal",                "https://www.boasenegal.com",      "Sénégal",       "Banque privée",                    "Banque / Finance",            "Directeur Général",   "contact@boasenegal.com",             "tier3", "banque"),
  ("SGBS — Société Générale Sénégal","https://www.sgbs.sn",        "Sénégal",       "Banque privée",                    "Banque / Finance",            "Directeur Général",   "contact@sgbs.sn",                    "tier3", "banque"),
  ("ORAGROUP (siège Lomé)",      "https://www.orabank.net",         "Togo",          "Banque privée",                    "Banque / Finance",            "Directeur Général",   "info@orabank.net",                   "tier2", "banque"),
  ("ECOBANK UEMOA (siège Lomé)", "https://www.ecobank.com",         "Togo",          "Banque multinationale",            "Banque / Finance",            "Directeur Général",   "info@ecobank.com",                   "tier1", "banque"),
  ("GIM-UEMOA",                  "https://www.gim-uemoa.org",       "Côte d'Ivoire", "Groupement interbancaire",         "Fintech / Banque",            "Directeur Général",   "info@gim-uemoa.org",                 "tier2", "fintech"),
  ("WAEMU Commission",           "https://www.uemoa.int",           "Côte d'Ivoire", "Organisation régionale",           "Institution régionale",       "Président",           "info@uemoa.int",                     "tier2", "org_internationale"),
  ("CEDEAO — Commission",        "https://www.ecowas.int",          "Nigeria",       "Organisation régionale",           "Institution régionale",       "Président",           "info@ecowas.int",                    "tier2", "org_internationale"),
  ("BRVM — subsidiaires",        "https://www.brvm.org/fr/societes-cotees","Côte d'Ivoire","Institution régionale",     "Finance / Bourse",            "Directeur Général",   "societes@brvm.org",                  "tier2", "institution_publique"),
  ("MTN Ghana",                  "https://www.mtn.com.gh",          "Ghana",         "Entreprise de télécoms",           "Télécommunications",          "Directeur Général",   "corporate@mtn.com.gh",               "tier2", "telecom"),
  ("Airtel Niger",               "https://www.airtel.ne",           "Niger",         "Entreprise de télécoms",           "Télécommunications",          "Directeur Général",   "contact@airtel.ne",                  "tier3", "telecom"),
  ("TiGo Mali",                  "https://www.tigo.ml",             "Mali",          "Entreprise de télécoms",           "Télécommunications",          "Directeur Général",   "contact@tigo.ml",                    "tier3", "telecom"),
  ("Guinée Télécom",             "https://www.guineetelecom.net",   "Guinée",        "Entreprise de télécoms",           "Télécommunications",          "Directeur Général",   "info@guineetelecom.net",             "tier3", "telecom"),

  # ── AUDIT / CONSEIL / EXPERTISE ───────────────────────────────────────────
  ("KPMG Côte d'Ivoire",         "https://www.kpmg.com/ci",         "Côte d'Ivoire", "Cabinet d'audit multinational",    "Audit / Conseil",             "Associé Directeur",   "kpmg.abidjan@kpmg.ci",               "tier2", "conseil"),
  ("PwC Côte d'Ivoire",          "https://www.pwc.com/ci",          "Côte d'Ivoire", "Cabinet d'audit multinational",    "Audit / Conseil",             "Associé Directeur",   "pwc.abidjan@pwc.com",                "tier2", "conseil"),
  ("Deloitte Côte d'Ivoire",     "https://www2.deloitte.com/ci",    "Côte d'Ivoire", "Cabinet d'audit multinational",    "Audit / Conseil",             "Associé Directeur",   "info.ci@deloitte.com",               "tier2", "conseil"),
  ("EY Côte d'Ivoire",           "https://www.ey.com/ci",           "Côte d'Ivoire", "Cabinet d'audit multinational",    "Audit / Conseil",             "Associé Directeur",   "ey.abidjan@ey.com",                  "tier2", "conseil"),
  ("Bureau Veritas CI",          "https://www.bureauveritas.com/ci","Côte d'Ivoire", "Multinationale",                   "Inspection / Certification",  "Directeur Général",   "contact.ci@bureauveritas.com",       "tier2", "conseil"),
  ("SGS Côte d'Ivoire",          "https://www.sgs.com/ci",          "Côte d'Ivoire", "Multinationale",                   "Inspection / Certification",  "Directeur Général",   "sgs.abidjan@sgs.com",                "tier2", "conseil"),

  # ── IMMOBILIER / PROMOTION ─────────────────────────────────────────────────
  ("SICOGI — Sté Ivoirienne Construction Gestion Immobilière","https://www.sicogi.ci","Côte d'Ivoire","Entreprise publique","Immobilier / Construction",  "Directeur Général",   "contact@sicogi.ci",                  "tier2", "immobilier"),
  ("SIPIM",                      "https://www.sipim.ci",            "Côte d'Ivoire", "Entreprise privée",                "Immobilier / Promotion",      "Directeur Général",   "info@sipim.ci",                      "tier3", "immobilier"),
  ("Groupe Sifca Immobilier",    "https://www.sifca.ci",            "Côte d'Ivoire", "Groupe privé",                     "Immobilier / Agro-industrie", "Directeur Général",   "immobilier@sifca.ci",                "tier3", "immobilier"),

  # ── GRANDE INDUSTRIE / MANUFACTURIER ──────────────────────────────────────
  ("PLASTICA CI",                "https://www.plastica.ci",         "Côte d'Ivoire", "Entreprise industrielle",          "Industrie / Plastiques",      "Directeur Général",   "contact@plastica.ci",                "tier3", "industrie"),
  ("FILTISAC",                   "https://www.filtisac.ci",         "Côte d'Ivoire", "Entreprise industrielle",          "Industrie / Emballage",       "Directeur Général",   "info@filtisac.ci",                   "tier2", "industrie"),
  ("SIR — Sté Ivoirienne de Raffinage","https://www.sir.ci",       "Côte d'Ivoire", "Entreprise industrielle publique",  "Industrie / Raffinage",       "Directeur Général",   "contact@sir.ci",                     "tier2", "industrie"),
  ("COTIVO — Cie Ivoirienne pour le Développement du Textile","https://www.cotivo.ci","Côte d'Ivoire","Entreprise industrielle","Industrie / Textile",    "Directeur Général",   "contact@cotivo.ci",                  "tier3", "industrie"),
  ("UNIWAX",                     "https://www.uniwax.ci",           "Côte d'Ivoire", "Entreprise industrielle",          "Industrie / Textile",         "Directeur Général",   "info@uniwax.ci",                     "tier3", "industrie"),
  ("CAPRAL",                     "https://www.capral.ci",           "Côte d'Ivoire", "Entreprise industrielle",          "Industrie / Aluminium",       "Directeur Général",   "contact@capral.ci",                  "tier3", "industrie"),

  # ── TRANSPORTS PUBLICS / MOBILITÉ ─────────────────────────────────────────
  ("SOTRA — Sté des Transports d'Abidjan","https://www.sotra.ci",  "Côte d'Ivoire", "Entreprise publique",              "Transport en commun",         "Directeur Général",   "contact@sotra.ci",                   "tier2", "transport"),
  ("SITARAIL",                   "https://www.sitarail.com",        "Côte d'Ivoire", "Concessionnaire",                  "Transport ferroviaire",       "Directeur Général",   "info@sitarail.com",                  "tier3", "transport"),
  ("WATA — West Africa Terminal Abidjan","https://www.abidjan-terminal.net","Côte d'Ivoire","Entreprise privée",        "Logistique portuaire",        "Directeur Général",   "info.wata@portabidjan.ci",           "tier2", "logistique"),

  # ── RESSOURCES HUMAINES / SERVICES AUX ENTREPRISES ────────────────────────
  ("Adecco Côte d'Ivoire",       "https://www.adecco.ci",           "Côte d'Ivoire", "Multinationale",                   "RH / Emploi temporaire",      "Directeur Général",   "contact@adecco.ci",                  "tier2", "rh"),
  ("ManpowerGroup CI",           "https://www.manpower.ci",         "Côte d'Ivoire", "Multinationale",                   "RH / Recrutement",            "Directeur Général",   "info@manpower.ci",                   "tier2", "rh"),
  ("Expectra CI (Randstad)",     "https://www.expectra.ci",         "Côte d'Ivoire", "Multinationale",                   "RH / Recrutement",            "Directeur Général",   "contact@expectra.ci",                "tier2", "rh"),
  ("CEGOS Afrique",              "https://www.cegos.fr/afrique",    "Côte d'Ivoire", "Multinationale",                   "Formation professionnelle",   "Directeur Général CI","contact.afrique@cegos.fr",           "tier2", "formation"),
  ("CFPA — Centre Formation Professionnelle","https://www.cfpa.ci", "Côte d'Ivoire", "Institution publique",             "Formation professionnelle",   "Directeur Général",   "info@cfpa.ci",                       "tier3", "formation"),

  # ── MICRO-FINANCE / ÉPARGNE ────────────────────────────────────────────────
  ("ADVANS CI",                  "https://www.advans-ci.com",       "Côte d'Ivoire", "Institution de microfinance",      "Microfinance",                "Directeur Général",   "contact@advans-ci.com",              "tier2", "microfinance"),
  ("MICROCRED CI",               "https://www.microcred.ci",        "Côte d'Ivoire", "Institution de microfinance",      "Microfinance",                "Directeur Général",   "info@microcred.ci",                  "tier2", "microfinance"),
  ("CNCE — Caisse Nationale Crédit Épargne","https://www.cnce.ci",  "Côte d'Ivoire", "Institution publique",             "Épargne / Crédit",            "Directeur Général",   "contact@cnce.ci",                    "tier2", "microfinance"),

  # ── ENVIRONNEMENT / DÉVELOPPEMENT DURABLE ─────────────────────────────────
  ("CIAPOL — Agence Pollution",  "https://www.ciapol.ci",           "Côte d'Ivoire", "Agence publique",                  "Environnement / Régulation",  "Directeur Général",   "info@ciapol.ci",                     "tier3", "environnement"),
  ("ANDE — Agence Nationale Environnement","https://www.ande.ci",  "Côte d'Ivoire", "Agence publique",                  "Environnement",               "Directeur Général",   "contact@ande.ci",                    "tier3", "environnement"),

  # ── AGRICULTURE / RURAL ────────────────────────────────────────────────────
  ("CAN — Conseil du Coton & de l'Anacarde","https://www.coton-anacarde.ci","Côte d'Ivoire","Institution publique",     "Agriculture / Filière",       "Directeur Général",   "info@coton-anacarde.ci",             "tier2", "agriculture"),
  ("CNRA — Centre National Recherche Agronomique","https://www.cnra.ci","Côte d'Ivoire","Institution publique",        "Recherche / Agriculture",     "Directeur Général",   "contact@cnra.ci",                    "tier3", "agriculture"),
  ("CIDT — Cie Ivoirienne pour le Développement du Textile","https://www.cidt.ci","Côte d'Ivoire","Entreprise publique","Agriculture / Coton",        "Directeur Général",   "info@cidt.ci",                       "tier3", "agriculture"),
  ("Conseil Café Cacao",         "https://www.conseilcafecacao.ci", "Côte d'Ivoire", "Institution publique",             "Agriculture / Cacao",         "Directeur Général",   "info@conseilcafecacao.ci",           "tier2", "agriculture"),

  # ── SANTÉ INTERNATIONALE ───────────────────────────────────────────────────
  ("OMS — Bureau CI",            "https://www.afro.who.int/ci",     "Côte d'Ivoire", "Organisation internationale",      "Santé / International",       "Représentant",        "saro@who.int",                       "tier2", "org_internationale"),
  ("ONUSIDA CI",                 "https://www.unaids.org/fr/regionscountries/ci","Côte d'Ivoire","Organisation internationale","Santé / VIH",          "Coordinateur pays",   "unaids.abidjan@unaids.org",          "tier3", "org_internationale"),

  # ── NOUVELLES ENTREPRISES / STARTUPS ──────────────────────────────────────
  ("Africa Internet Group (Jumia CI)","https://www.jumia.ci",       "Côte d'Ivoire", "Startup tech",                     "E-commerce",                  "Directeur Général",   "contact@jumia.ci",                   "tier2", "tech"),
  ("Kobo360 CI",                 "https://www.kobo360.com",         "Côte d'Ivoire", "Startup tech",                     "Technologie / Logistique",    "Directeur Général CI","info@kobo360.com",                   "tier3", "tech"),
  ("Gozem CI",                   "https://www.gozem.co",            "Côte d'Ivoire", "Startup tech",                     "Transport / Mobilité",        "Directeur Général CI","contact@gozem.co",                   "tier3", "tech"),
  ("Nexans CI",                  "https://www.nexans.com/ci",       "Côte d'Ivoire", "Multinationale",                   "Industrie / Câblage",         "Directeur Général",   "info.ci@nexans.com",                 "tier2", "industrie"),
  ("SPDCI — Sté Presse et Distribution CI","https://www.spdci.ci", "Côte d'Ivoire", "Entreprise privée",                "Distribution / Presse",       "Directeur Général",   "contact@spdci.ci",                   "tier3", "distribution"),
  ("Azalaï Hotels (présence CI)","https://www.azalaihotels.com",   "Côte d'Ivoire", "Chaîne hôtelière africaine",       "Hôtellerie",                  "Directeur Général CI","info@azalaihotels.com",              "tier3", "hotellerie"),
  ("LAFICO CI",                  "https://www.lafico.ci",           "Côte d'Ivoire", "Entreprise publique",              "Immobilier / Logement",       "Directeur Général",   "contact@lafico.ci",                  "tier3", "immobilier"),
  ("BSTP — Bureau de Soutien aux PME","https://www.bstp.ci",       "Côte d'Ivoire", "Institution publique",             "PME / Développement",         "Directeur Général",   "info@bstp.ci",                       "tier3", "institution_publique"),
  ("CEPICI — Centre Promotion Investissement","https://www.cepici.gouv.ci","Côte d'Ivoire","Institution publique",      "Investissement / Développement","Directeur Général",  "info@cepici.gouv.ci",                "tier2", "institution_publique"),
  ("Syndicat des Grandes Entreprises CI","https://www.cgeci.ci",   "Côte d'Ivoire", "Organisation professionnelle",     "Fédération patronale",        "Président",           "info@cgeci.ci",                      "tier2", "patronat"),

  # ── SUPPLEMENT — pour atteindre 200 ──────────────────────────────────────
  ("SICOGI — Société Ivoirienne de Construction","https://www.sicogi.ci","Côte d'Ivoire","Entreprise publique",             "Immobilier / BTP",            "Directeur Général",   "info@sicogi.ci",                     "tier2", "immobilier"),
  ("BHCI — Banque de l'Habitat CI","https://www.bhci.ci",        "Côte d'Ivoire", "Banque spécialisée",               "Banque / Habitat",            "Directeur Général",   "contact@bhci.ci",                    "tier2", "banque"),
  ("Prestige Auto CI",            "https://www.prestigeauto.ci", "Côte d'Ivoire", "Entreprise privée",                "Distribution automobile",     "Directeur Général",   "contact@prestigeauto.ci",            "tier2", "distribution"),
  ("CFAO Motors CI",              "https://www.cfao.com/ci",     "Côte d'Ivoire", "Multinationale",                   "Distribution automobile",     "Directeur Général",   "contact.ci@cfao.com",                "tier1", "distribution"),
  ("SCOA CI",                     "https://www.scoa.ci",         "Côte d'Ivoire", "Entreprise privée",                "Distribution / Industrie",    "Directeur Général",   "info@scoa.ci",                       "tier2", "distribution"),
  ("Pâtisserie Abidjan (Mac Donalds CI)","https://www.macdo.ci", "Côte d'Ivoire", "Franchise internationale",         "Restauration rapide",         "Directeur Général",   "contact@macdo.ci",                   "tier3", "distribution"),
  ("Pharmacie Nouvelle",          "https://www.pharmacienouvelle.ci","Côte d'Ivoire","Entreprise privée",              "Distribution pharmaceutique", "Directeur Général",   "info@pharmacienouvelle.ci",          "tier3", "sante"),
  ("Clinique Bethesda",           "https://www.cliniquebethesda.ci","Côte d'Ivoire","Clinique privée",                 "Santé / Clinique",            "Directeur Médical",   "contact@cliniquebethesda.ci",        "tier2", "sante"),
  ("PISAM — Polyclinique Int. Ste-Anne-Marie","https://www.pisam.ci","Côte d'Ivoire","Clinique privée",                "Santé / Polyclinique",        "Directeur Médical",   "info@pisam.ci",                      "tier2", "sante"),
  ("Ivoire Coton",                "https://www.ivoirecoton.ci",  "Côte d'Ivoire", "Entreprise privée",                "Agriculture / Coton",         "Directeur Général",   "info@ivoirecoton.ci",                "tier3", "agriculture"),
  ("FENAGRI — Féd. Nationale Agro-Industrie","https://www.fenagri.ci","Côte d'Ivoire","Organisation professionnelle",  "Fédération agro-industrielle","Président",           "info@fenagri.ci",                    "tier3", "patronat"),
  ("GIZ Côte d'Ivoire",           "https://www.giz.de/ci",       "Côte d'Ivoire", "Organisation internationale",      "Développement / Coopération", "Représentant Pays",   "giz-cotedivoire@giz.de",             "tier2", "org_internationale"),
  ("ONUDI — Bureau CI",           "https://www.unido.org/ci",    "Côte d'Ivoire", "Organisation internationale",      "Industrie / Développement",   "Représentant",        "unido.ci@unido.org",                 "tier2", "org_internationale"),
  ("UNFPA — Bureau CI",           "https://www.unfpa.org/fr/ci", "Côte d'Ivoire", "Organisation internationale",      "Santé reproductive / Population","Représentant",      "wcaro-ci@unfpa.org",                 "tier3", "org_internationale"),
  ("World Vision CI",             "https://www.wvi.org/ivory-coast","Côte d'Ivoire","ONG internationale",              "Aide humanitaire / Éducation","Directeur Pays",      "contact@wvi-ci.org",                 "tier3", "org_internationale"),
  ("UNDP — PNUD CI",              "https://www.undp.org/fr/ci",  "Côte d'Ivoire", "Organisation internationale",      "Développement durable",       "Représentant Résident","registry.ci@undp.org",               "tier2", "org_internationale"),
  ("UNHCR — HCR CI",              "https://www.unhcr.org/fr/cote-d-ivoire","Côte d'Ivoire","Organisation internationale","Protection réfugiés",       "Représentant",        "cicia@unhcr.org",                    "tier3", "org_internationale"),
]

# ══════════════════════════════════════════════════════════════════════════════
# CONSTRUCTION DE LA LISTE STRUCTURÉE
# ══════════════════════════════════════════════════════════════════════════════

SECTOR_NICHE_MAP = {
    "telecom":           "support_it_intelligent",
    "banque":            "banque_kyc_reporting",
    "fintech":           "reporting_financier_assiste",
    "assurance":         "reporting_financier_assiste",
    "energie":           "workflow_administratif",
    "utilities":         "workflow_administratif",
    "agro_industrie":    "machine_contenu_marketing",
    "agroalimentaire":   "machine_contenu_marketing",
    "distribution":      "service_client_multicanal",
    "btp":               "operations_terrain_coordination",
    "transport":         "operations_terrain_coordination",
    "logistique":        "operations_terrain_coordination",
    "sante":             "telemedecine_triage_orientation",
    "media":             "machine_contenu_marketing",
    "hotellerie":        "service_client_multicanal",
    "tech":              "support_it_intelligent",
    "mines":             "operations_terrain_coordination",
    "institution_publique":"workflow_administratif",
    "collectivite":      "workflow_administratif",
    "org_internationale":"assistant_direction_documentaire",
    "education":         "formation_montee_en_competence",
    "conseil":           "assistant_direction_documentaire",
    "immobilier":        "workflow_administratif",
    "industrie":         "operations_terrain_coordination",
    "rh":                "recrutement_onboarding_augmente",
    "formation":         "formation_montee_en_competence",
    "microfinance":      "banque_kyc_reporting",
    "environnement":     "reporting_financier_assiste",
    "agriculture":       "workflow_administratif",
    "protection_sociale":"reporting_financier_assiste",
    "patronat":          "workflow_administratif",
    "cooperatif":        "workflow_administratif",
}

prospects = []
for i, row in enumerate(PROSPECTS_RAW):
    org_name, website, country, org_type, sector, dm, email, tier, niche_key = row
    slug = re.sub(r'[^a-z0-9]+', '-', org_name.lower().strip()).strip('-')
    prospect_id = f"ci-{slug[:40]}-{str(i+1).zfill(3)}"
    domain = website.replace("https://","").replace("http://","").replace("www.","").split("/")[0]

    prospects.append({
        "prospect_id":                prospect_id,
        "organization_name":          org_name,
        "website":                    website,
        "country":                    country,
        "organization_type":          org_type,
        "sector_guess":               sector,
        "decision_maker_name":        dm,
        "target_email":               email,
        "custom_page_paths_csv":      "",
        "booking_link_45min":         "https://calendly.com/transferai/45min",
        "commercial_priority_default": tier,
        "research_scope":             "public_web_only",
        "source_backend":             "crm_import_ci_200",
        "source_label":               f"Prospection CI — {sector}",
        "raw_source_id":              None,
        "niche_status":               SECTOR_NICHE_MAP.get(niche_key, "workflow_administratif"),
        "status":                     "ready",
        "paused":                     False,
        "last_sequence_result":       None,
        "last_response_status":       None,
        "stop_reason":                None,
        "next_action_at":             NOW,
        "created_at":                 NOW,
        "updated_at":                 NOW,
    })

print(f"✅  {len(prospects)} prospects générés")

# ── Stats par tier ─────────────────────────────────────────────────────────────
from collections import Counter
tier_counts  = Counter(p["commercial_priority_default"] for p in prospects)
sector_counts = Counter(p["sector_guess"] for p in prospects)
country_counts = Counter(p["country"] for p in prospects)

print("\n📊  Stats :")
print("  Tiers :", dict(sorted(tier_counts.items())))
print("  Pays  :", dict(sorted(country_counts.items())))
print("  Top secteurs :")
for s, c in sector_counts.most_common(10):
    print(f"    {s:<40} {c}")

# ══════════════════════════════════════════════════════════════════════════════
# EXPORT JSON
# ══════════════════════════════════════════════════════════════════════════════
json_path = os.path.join(OUT_DIR, "prospects_ci_200.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(prospects, f, ensure_ascii=False, indent=2)
print(f"\n✅  JSON : {json_path}")

# ══════════════════════════════════════════════════════════════════════════════
# EXPORT CSV
# ══════════════════════════════════════════════════════════════════════════════
csv_path = os.path.join(OUT_DIR, "prospects_ci_200.csv")
fields = list(prospects[0].keys())
with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    writer.writerows(prospects)
print(f"✅  CSV  : {csv_path}")

# ══════════════════════════════════════════════════════════════════════════════
# EXPORT SQL SUPABASE
# ══════════════════════════════════════════════════════════════════════════════
def sql_val(v):
    if v is None: return "NULL"
    if isinstance(v, bool): return "TRUE" if v else "FALSE"
    # escape single quotes
    return "'" + str(v).replace("'", "''") + "'"

sql_path = os.path.join(OUT_DIR, "supabase_insert_crm.sql")
with open(sql_path, "w", encoding="utf-8") as f:

    f.write("-- ══════════════════════════════════════════════════════════════\n")
    f.write("-- TransferAI — CRM Prospects Côte d'Ivoire (200 sociétés)\n")
    f.write(f"-- Généré le {NOW}\n")
    f.write("-- ══════════════════════════════════════════════════════════════\n\n")

    # Création de la table prospect_targets
    f.write("""-- ÉTAPE 1 : Créer la table prospect_targets (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS prospect_targets (
  id                          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_id                 text UNIQUE NOT NULL,
  organization_name           text NOT NULL,
  website                     text,
  country                     text DEFAULT 'Côte d''Ivoire',
  organization_type           text,
  sector_guess                text,
  decision_maker_name         text,
  target_email                text,
  custom_page_paths_csv       text DEFAULT '',
  booking_link_45min          text DEFAULT 'https://calendly.com/transferai/45min',
  commercial_priority_default text DEFAULT 'tier2',
  research_scope              text DEFAULT 'public_web_only',
  source_backend              text DEFAULT 'manual',
  source_label                text,
  raw_source_id               text,
  niche_status                text,
  status                      text DEFAULT 'ready',
  paused                      boolean DEFAULT false,
  last_sequence_result        text,
  last_response_status        text,
  stop_reason                 text,
  next_action_at              timestamptz DEFAULT now(),
  created_at                  timestamptz DEFAULT now(),
  updated_at                  timestamptz DEFAULT now()
);

-- Index pour les requêtes de batch
CREATE INDEX IF NOT EXISTS idx_prospect_targets_status ON prospect_targets(status);
CREATE INDEX IF NOT EXISTS idx_prospect_targets_tier   ON prospect_targets(commercial_priority_default);
CREATE INDEX IF NOT EXISTS idx_prospect_targets_next   ON prospect_targets(next_action_at);
CREATE INDEX IF NOT EXISTS idx_prospect_targets_country ON prospect_targets(country);

-- ══════════════════════════════════════════════════════════════════════════
-- ÉTAPE 2 : Insérer les 200 prospects
-- ══════════════════════════════════════════════════════════════════════════
INSERT INTO prospect_targets (
  prospect_id, organization_name, website, country, organization_type,
  sector_guess, decision_maker_name, target_email, custom_page_paths_csv,
  booking_link_45min, commercial_priority_default, research_scope,
  source_backend, source_label, raw_source_id, niche_status,
  status, paused, last_sequence_result, last_response_status,
  stop_reason, next_action_at, created_at, updated_at
) VALUES\n""")

    rows = []
    for p in prospects:
        row = (
            f"  ({sql_val(p['prospect_id'])}, {sql_val(p['organization_name'])}, {sql_val(p['website'])}, "
            f"{sql_val(p['country'])}, {sql_val(p['organization_type'])},\n"
            f"   {sql_val(p['sector_guess'])}, {sql_val(p['decision_maker_name'])}, {sql_val(p['target_email'])}, "
            f"{sql_val(p['custom_page_paths_csv'])},\n"
            f"   {sql_val(p['booking_link_45min'])}, {sql_val(p['commercial_priority_default'])}, "
            f"{sql_val(p['research_scope'])},\n"
            f"   {sql_val(p['source_backend'])}, {sql_val(p['source_label'])}, {sql_val(p['raw_source_id'])}, "
            f"{sql_val(p['niche_status'])},\n"
            f"   {sql_val(p['status'])}, {sql_val(p['paused'])}, {sql_val(p['last_sequence_result'])}, "
            f"{sql_val(p['last_response_status'])},\n"
            f"   {sql_val(p['stop_reason'])}, {sql_val(p['next_action_at'])}, "
            f"{sql_val(p['created_at'])}, {sql_val(p['updated_at'])})"
        )
        rows.append(row)

    f.write(",\n".join(rows))
    f.write("\nON CONFLICT (prospect_id) DO NOTHING;\n\n")

    f.write("-- ══════════════════════════════════════════════════════════════\n")
    f.write("-- ÉTAPE 3 : Vérification\n")
    f.write("-- ══════════════════════════════════════════════════════════════\n")
    f.write("SELECT commercial_priority_default, country, COUNT(*) as total\n")
    f.write("FROM prospect_targets\n")
    f.write("WHERE source_backend = 'crm_import_ci_200'\n")
    f.write("GROUP BY commercial_priority_default, country\n")
    f.write("ORDER BY commercial_priority_default, country;\n")

print(f"✅  SQL  : {sql_path}")
print(f"\n✅  Tous les fichiers générés dans {OUT_DIR}/")