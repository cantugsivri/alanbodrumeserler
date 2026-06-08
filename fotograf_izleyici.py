# -*- coding: utf-8 -*-
"""
ALAN Art & Coffee - Otomatik Fotograf Izleyici
=============================================
Bu scripti calistirinca, Eser_Fotograflari klasorunu
surekli izler. Yeni fotograf eklenince aninda Cloudinary'ye
yukler ve cloudinary_urls.csv dosyasini gunceller.

Durdurmak icin: Ctrl + C
"""
import os, re, csv, sys, time
sys.stdout.reconfigure(encoding='utf-8')

import cloudinary
import cloudinary.uploader
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# --- Cloudinary Bilgileri ---
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

# Klasoru otomatik bul
PHOTOS_DIR = None
for entry in os.listdir(BASE_DIR):
    if entry.lower().startswith("eser_") and os.path.isdir(os.path.join(BASE_DIR, entry)):
        PHOTOS_DIR = os.path.join(BASE_DIR, entry)
        break


def get_id(filename):
    m = re.match(r'^(\d+)', os.path.splitext(filename)[0])
    return m.group(1) if m else None


def load_existing_ids():
    """CSV'deki mevcut ID'leri oku"""
    ids = set()
    if os.path.exists(OUTPUT_CSV):
        with open(OUTPUT_CSV, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                ids.add(row["id"])
                if row.get("filename"):
                    ids.add(row["filename"])  # dosya adiyla da kontrol
    return ids


def save_to_csv(new_row):
    """Yeni satiri CSV'ye ekle"""
    fields = ["id", "filename", "cloudinary_url", "public_id", "width", "height", "bytes"]
    file_exists = os.path.exists(OUTPUT_CSV)
    with open(OUTPUT_CSV, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        if not file_exists:
            writer.writeheader()
        writer.writerow(new_row)


def upload_file(filepath):
    """Tek bir dosyayi Cloudinary'ye yukle"""
    filename   = os.path.basename(filepath)
    ext        = os.path.splitext(filename)[1].lower()

    if ext not in EXTS:
        return  # Desteklenmeyen dosya, atla

    artwork_id = get_id(filename)
    existing   = load_existing_ids()

    # Zaten yuklenmis mi?
    if artwork_id and artwork_id in existing:
        print(f"[ATLANDI] {filename} zaten yuklu.")
        return
    if filename in existing:
        print(f"[ATLANDI] {filename} zaten yuklu.")
        return

    safe_name = re.sub(r'[^\w\-]', '_', os.path.splitext(filename)[0])
    public_id = f"{FOLDER}/eser_{safe_name}"

    print(f"\n[YUKLENIYOR] {filename}...", flush=True)
    try:
        result = cloudinary.uploader.upload(
            filepath,
            public_id     = public_id,
            overwrite     = False,
            resource_type = "image",
            quality       = "auto:good",
            fetch_format  = "auto",
        )
        url = result["secure_url"]
        print(f"[TAMAM] ID {artwork_id} -> {url}")

        save_to_csv({
            "id":             artwork_id or "",
            "filename":       filename,
            "cloudinary_url": url,
            "public_id":      result["public_id"],
            "width":          result.get("width", ""),
            "height":         result.get("height", ""),
            "bytes":          result.get("bytes", ""),
        })
        print(f"[CSV GUNCELLENDI] cloudinary_urls.csv")

    except Exception as e:
        print(f"[HATA] {filename}: {e}")


class PhotoHandler(FileSystemEventHandler):
    """Klasordeki yeni dosyalari izler"""

    def on_created(self, event):
        if event.is_directory:
            return
        filepath = event.src_path
        ext = os.path.splitext(filepath)[1].lower()
        if ext in EXTS:
            # Dosyanin tamamen yazilmasini bekle (kopyalama bitmesi icin)
            time.sleep(1.5)
            upload_file(filepath)

    def on_moved(self, event):
        """Baska yerden bu klasore tasinan dosyalar icin"""
        if event.is_directory:
            return
        filepath = event.dest_path
        ext = os.path.splitext(filepath)[1].lower()
        if ext in EXTS:
            time.sleep(1.5)
            upload_file(filepath)


def main():
    if not PHOTOS_DIR:
        print("HATA: Eser_ klasoru bulunamadi!")
        return

    print("=" * 50)
    print("  ALAN Art & Coffee - Otomatik Fotograf Izleyici")
    print("=" * 50)
    print(f"Izlenen klasor: {PHOTOS_DIR}")
    print(f"CSV cikti     : {OUTPUT_CSV}")
    print("")
    print("Bekliyor... Klasore fotograf ekleyin!")
    print("Durdurmak icin Ctrl+C basin.")
    print("-" * 50)

    event_handler = PhotoHandler()
    observer = Observer()
    observer.schedule(event_handler, PHOTOS_DIR, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\nIzleyici durduruldu.")
    observer.join()


if __name__ == "__main__":
    main()
