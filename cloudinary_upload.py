# -*- coding: utf-8 -*-
# ALAN Art & Coffee - Cloudinary Upload Script
import os, re, csv, sys

sys.stdout.reconfigure(encoding='utf-8')

import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name = "dzimaffgf",
    api_key    = "271816194433282",
    api_secret = "AAxFP_m6nxQuoLhuLm5FQZS7fB4",
    secure     = True
)

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
OUTPUT_CSV = os.path.join(BASE_DIR, "cloudinary_urls.csv")
FOLDER     = "alan-art-coffee"
EXTS       = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".tiff", ".bmp"}

# Klasoru otomatik bul (eser ile baslayan, case-insensitive)
PHOTOS_DIR = None
for entry in os.listdir(BASE_DIR):
    if entry.lower().startswith("eser") and os.path.isdir(os.path.join(BASE_DIR, entry)):
        PHOTOS_DIR = os.path.join(BASE_DIR, entry)
        break

def parse_filename(filename):
    """
    Yeni format: 100_RENKLİ YUVARLAK BALIK_2.jpg
    Döndürür: (artwork_id, photo_number)
    Eski format: 1.aşil.jpeg -> (1, 1)
    """
    name = os.path.splitext(filename)[0]
    
    # Yeni format: SAYI_İSİM_SAYI
    m = re.match(r'^(\d+)_(.+)_(\d+)$', name)
    if m:
        return m.group(1), m.group(3)
    
    # Yeni format tek foto: SAYI_İSİM (foto numarası yok)
    m = re.match(r'^(\d+)_(.+)$', name)
    if m:
        return m.group(1), "1"
    
    # Eski format: SAYI.isim
    m = re.match(r'^(\d+)[._]', name)
    if m:
        return m.group(1), "1"
    
    return None, None

def main():
    print("=== ALAN Art & Coffee - Cloudinary Yukleme ===")

    if not PHOTOS_DIR:
        print("HATA: 'eser' ile baslayan fotograf klasoru bulunamadi!")
        return

    print(f"Klasor bulundu: {PHOTOS_DIR}")

    # Mevcut CSV'yi oku - unique key: filename
    existing_filenames = set()
    existing_rows = []
    if os.path.exists(OUTPUT_CSV):
        with open(OUTPUT_CSV, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                existing_filenames.add(row["filename"])
                existing_rows.append(row)
        print(f"Mevcut CSV: {len(existing_filenames)} kayit (atlanacak)")

    all_files = [f for f in os.listdir(PHOTOS_DIR)
                 if os.path.splitext(f)[1].lower() in EXTS]

    if not all_files:
        print("HATA: Klasorde fotograf bulunamadi!")
        return

    print(f"{len(all_files)} fotograf bulundu. Yukleme basliyor...\n")

    new_rows = []
    success = skip = error = 0

    for filename in sorted(all_files):
        if filename in existing_filenames:
            print(f"  ATLANDI: {filename}")
            skip += 1
            continue

        artwork_id, photo_num = parse_filename(filename)
        filepath = os.path.join(PHOTOS_DIR, filename)
        display  = f"[{artwork_id or '?'}]" 

        safe_name = re.sub(r'[^\w\-]', '_', os.path.splitext(filename)[0])
        public_id = f"{FOLDER}/eser_{safe_name}"

        try:
            print(f"  YUKLENIYOR {display} {filename}...", end=" ", flush=True)
            result = cloudinary.uploader.upload(
                filepath,
                public_id     = public_id,
                overwrite     = False,
                resource_type = "image",
                quality       = "auto:good",
                fetch_format  = "auto",
            )
            url = result["secure_url"]
            print(f"OK")
            print(f"    URL: {url}")
            new_rows.append({
                "id":             artwork_id or "",
                "photo_num":      photo_num or "1",
                "filename":       filename,
                "cloudinary_url": url,
                "public_id":      result["public_id"],
                "width":          result.get("width", ""),
                "height":         result.get("height", ""),
                "bytes":          result.get("bytes", ""),
            })
            success += 1
        except Exception as e:
            print(f"HATA: {e}")
            error += 1

    all_rows = existing_rows + new_rows
    if all_rows:
        fields = ["id","photo_num","filename","cloudinary_url","public_id","width","height","bytes"]
        with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fields)
            writer.writeheader()
            writer.writerows(all_rows)
        print(f"\nURL'ler kaydedildi: {OUTPUT_CSV}")

    print(f"""
==============================
  Basarili : {success}
  Atlandi  : {skip}
  Hata     : {error}
  Toplam   : {len(all_files)}
==============================""")

if __name__ == "__main__":
    main()
