#!/usr/bin/env python3
"""
mini_catalogue_cli.py — Générateur mini-catalogue PDF pour le pipeline V3
Appelé par n8n via Execute Command, même architecture que deck_generator_cli.py

Usage:
  python3 mini_catalogue_cli.py '<JSON>'

JSON minimal attendu (construit par n8n depuis le pack GPT) :
{
  "prospect": "Orange Côte d'Ivoire",
  "secteur": "Télécommunications",
  "pays": "Côte d'Ivoire",
  "pack_id": "pack-xxx",
  "enjeux_audit": [
    {"num":"01","titre":"...","constat":"...","signal":"..."},
    ...
  ],
  "formations": [
    {"num":"F1","intitule":"...","public":"...","duree":"...","niveau":"...",
     "probleme":"...","apres":"...","objectifs":[...],"livrables":[...],"gain":"..."},
    ...
  ],
  "livrables_globaux": ["...", ...],
  "plan_90j": [["J+0","Titre","Desc"], ...],
  "supabase_url": "https://wlhznciwuofueffyoflo.supabase.co",
  "supabase_service_key": "eyJ..."
}

Sortie stdout JSON :
{
  "ok": true,
  "pdf_url": "https://...supabase.co/storage/v1/object/public/prospect-decks/MiniCatalogue_xxx.pdf",
  "filename_pdf": "MiniCatalogue_TransferAI_OrangeCI_pack-xxx.pdf",
  "catalogue_artifact": { "pdf_url": "...", "filename_pdf": "..." }
}
"""

import sys, json, os, re, tempfile, unicodedata, urllib.request

# ── Import du moteur PDF ──────────────────────────────────────────────
try:
    from generate_mini_catalogue_pdf import build_pdf
except ImportError:
    # Fallback : chercher dans le même dossier
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    try:
        from generate_mini_catalogue_pdf import build_pdf
    except ImportError:
        print(json.dumps({"ok": False, "error": "generate_mini_catalogue_pdf.py introuvable"}))
        sys.exit(1)


def safe_name(value):
    value = unicodedata.normalize("NFD", str(value)).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-zA-Z0-9]+", "_", value).strip("_")


def upload(file_path, filename, supabase_url, service_key):
    bucket = "prospect-decks"
    url = f"{supabase_url}/storage/v1/object/{bucket}/{filename}"
    with open(file_path, "rb") as f:
        data = f.read()
    req = urllib.request.Request(
        url, data=data, method="POST",
        headers={
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/pdf",
            "x-upsert": "true",
        }
    )
    try:
        with urllib.request.urlopen(req) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Upload échoué ({e.code}): {e.read().decode()}")
    return f"{supabase_url}/storage/v1/object/public/{bucket}/{filename}"


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"ok": False, "error": "Argument JSON manquant"}))
        sys.exit(1)

    try:
        d = json.loads(sys.argv[1])
    except json.JSONDecodeError as e:
        print(json.dumps({"ok": False, "error": f"JSON invalide: {e}"}))
        sys.exit(1)

    supabase_url = d.get("supabase_url", "")
    service_key  = d.get("supabase_service_key", "")
    dry_run = (not supabase_url or supabase_url == "SKIP" or
               not service_key or service_key == "SKIP")

    org_safe  = safe_name(d.get("prospect", "Prospect"))
    pack_id   = d.get("pack_id", "pack-unknown")
    fn_pdf    = f"MiniCatalogue_TransferAI_{org_safe}_{pack_id}.pdf"

    with tempfile.TemporaryDirectory() as tmp:
        pdf_path = os.path.join(tmp, fn_pdf)
        build_pdf(d, pdf_path)

        if dry_run:
            print(json.dumps({
                "ok": True, "dry_run": True,
                "pdf_url": None, "filename_pdf": fn_pdf,
                "catalogue_artifact": None,
                "note": "Mode test — upload Supabase ignoré"
            }))
            return

        pdf_url = upload(pdf_path, fn_pdf, supabase_url, service_key)

    result = {
        "ok":       True,
        "pdf_url":  pdf_url,
        "filename_pdf": fn_pdf,
        "catalogue_artifact": {
            "pdf_url":      pdf_url,
            "filename_pdf": fn_pdf,
        }
    }
    print(json.dumps(result))


if __name__ == "__main__":
    main()
