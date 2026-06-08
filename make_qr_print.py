import qrcode
from PIL import Image
import os


# ── Ayarlar ──────────────────────────────────────────────────
URL        = "https://alanbodrumeserler.vercel.app"
OUT_DIR    = "qrkodbaskı"
DPI        = 300
CM         = 5          # hedef boyut
PX         = int(CM * DPI / 2.54)   # 591 px

# ── Çıktı klasörü ────────────────────────────────────────────
os.makedirs(OUT_DIR, exist_ok=True)

# ── QR kod üret ──────────────────────────────────────────────
qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=2,
)
qr.add_data(URL)
qr.make(fit=True)

img = qr.make_image(fill_color="#1C1B1A", back_color="white")

# PIL görüntüsüne çevir ve 591x591'e yeniden boyutlandır
img_pil = img.convert("RGB")
img_pil = img_pil.resize((PX, PX), Image.LANCZOS)

# ── PNG kaydet (300 DPI meta verisiyle) ──────────────────────
png_path = os.path.join(OUT_DIR, "alan_qr_5x5cm_300dpi.png")
img_pil.save(png_path, dpi=(DPI, DPI))
print(f"PNG kaydedildi: {png_path}  ({PX}x{PX} px @ {DPI} DPI)")

# ── PDF kaydet (baskıya direkt gönderilebilir) ────────────────
pdf_path = os.path.join(OUT_DIR, "alan_qr_5x5cm_300dpi.pdf")
img_pil.save(pdf_path, "PDF", resolution=DPI)
print(f"PDF kaydedildi: {pdf_path}")

print(f"\nBoyut: {CM}x{CM} cm  |  {PX}x{PX} piksel  |  {DPI} DPI")
print("Baski icin hazir!")
