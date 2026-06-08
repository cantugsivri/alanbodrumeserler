from PIL import Image, ImageDraw, ImageFont
import qrcode
import os

# ── Boyutlar (6 x 9 cm @ 300 DPI) ───────────────────────────
DPI   = 300
W     = int(6.0 * DPI / 2.54)   # ~709 px
H     = int(9.0 * DPI / 2.54)   # ~1063 px
OUT   = "qrkodbaskı"
os.makedirs(OUT, exist_ok=True)

# ── Renkler ──────────────────────────────────────────────────
CREAM  = (252, 250, 246)
GOLD   = (197, 160, 89)
DARK   = (28,  27,  26)
MUTED  = (163, 159, 151)
WHITE  = (255, 255, 255)
BORDER = (232, 227, 215)

# ── Fontlar ──────────────────────────────────────────────────
FONT_DIR = r"C:\Windows\Fonts"
def font(name, size):
    try:
        return ImageFont.truetype(os.path.join(FONT_DIR, name), size)
    except:
        return ImageFont.load_default()

f_text = font("georgiai.ttf", 27)
f_hint = font("calibri.ttf",  22)

# ── Canvas ───────────────────────────────────────────────────
img  = Image.new("RGB", (W, H), CREAM)
draw = ImageDraw.Draw(img)

# ── Üst altın çizgi ──────────────────────────────────────────
bar_h = 5
for x in range(W):
    t = x / W
    alpha = 4 * t * (1 - t)
    r = int(CREAM[0] + (GOLD[0] - CREAM[0]) * alpha)
    g = int(CREAM[1] + (GOLD[1] - CREAM[1]) * alpha)
    b = int(CREAM[2] + (GOLD[2] - CREAM[2]) * alpha)
    draw.line([(x, 0), (x, bar_h)], fill=(r, g, b))

# ── Logo görseli ─────────────────────────────────────────────
logo_path = os.path.join("src", "assets", "logo.jpeg")
logo_src  = Image.open(logo_path).convert("RGB")

# Logonun çevresindeki koyu border'ı kırp (%7 her kenardan)
lw, lh = logo_src.size
crop_x = int(lw * 0.07)
crop_y = int(lh * 0.07)
logo_src = logo_src.crop((crop_x, crop_y, lw - crop_x, lh - crop_y))

logo_w = int(W * 0.50)
ratio  = logo_src.height / logo_src.width
logo_h = int(logo_w * ratio)
logo   = logo_src.resize((logo_w, logo_h), Image.LANCZOS)

logo_x = (W - logo_w) // 2
logo_y = 28
img.paste(logo, (logo_x, logo_y))

y = logo_y + logo_h  # logo bitişinden devam et


# ── QR Kod ───────────────────────────────────────────────────
qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=2,
)
qr.add_data("https://alanbodrumeserler.vercel.app")
qr.make(fit=True)

qr_size = int(W * 0.70)
qr_img  = qr.make_image(fill_color=DARK, back_color=WHITE).convert("RGB")
qr_img  = qr_img.resize((qr_size, qr_size), Image.LANCZOS)

# QR çerçeve (border)
pad    = 14
frame  = Image.new("RGB", (qr_size + pad * 2, qr_size + pad * 2), WHITE)
fd     = ImageDraw.Draw(frame)
fd.rectangle([0, 0, frame.width - 1, frame.height - 1], outline=BORDER, width=2)
frame.paste(qr_img, (pad, pad))

qr_y = y + 12
qr_x = (W - frame.width) // 2
img.paste(frame, (qr_x, qr_y))


# ── Altın yatay çizgi ────────────────────────────────────────
div_y = qr_y + frame.height + 14
div_w = 50
div_x = (W - div_w) // 2
draw.line([(div_x, div_y), (div_x + div_w, div_y)], fill=GOLD, width=2)

# ── Türkçe davet metni (2 satır) ─────────────────────────────────
tr_line1 = "Eserleri dijital arşivden"
tr_line2 = "keşfetmek için tarayın"
y_text = div_y + 12

bbox1 = draw.textbbox((0, 0), tr_line1, font=f_text)
draw.text(((W - (bbox1[2]-bbox1[0])) // 2, y_text), tr_line1, font=f_text, fill=DARK)
y_text += (bbox1[3] - bbox1[1]) + 2

bbox2 = draw.textbbox((0, 0), tr_line2, font=f_text)
draw.text(((W - (bbox2[2]-bbox2[0])) // 2, y_text), tr_line2, font=f_text, fill=DARK)
y_text += (bbox2[3] - bbox2[1]) + 5

# ── İngilizce davet metni (2 satır) ────────────────────────────────
en_line1 = "Scan to explore"
en_line2 = "our art collection"

bbox3 = draw.textbbox((0, 0), en_line1, font=f_text)
draw.text(((W - (bbox3[2]-bbox3[0])) // 2, y_text), en_line1, font=f_text, fill=DARK)
y_text += (bbox3[3] - bbox3[1]) + 2

bbox4 = draw.textbbox((0, 0), en_line2, font=f_text)
draw.text(((W - (bbox4[2]-bbox4[0])) // 2, y_text), en_line2, font=f_text, fill=DARK)

# ── Alt altın çizgi ──────────────────────────────────────────
for x in range(W):
    t = x / W
    alpha = 4 * t * (1 - t)
    r = int(CREAM[0] + (GOLD[0] - CREAM[0]) * alpha)
    g = int(CREAM[1] + (GOLD[1] - CREAM[1]) * alpha)
    b = int(CREAM[2] + (GOLD[2] - CREAM[2]) * alpha)
    draw.line([(x, H - bar_h), (x, H - 1)], fill=(r, g, b))

# ── Kaydet ───────────────────────────────────────────────────
png_path = os.path.join(OUT, "alan_qr_kart_BASKI.png")
pdf_path = os.path.join(OUT, "alan_qr_kart_BASKI.pdf")

img.save(png_path, dpi=(DPI, DPI))
img.save(pdf_path, "PDF", resolution=DPI)

print(f"PNG -> {png_path}")
print(f"PDF -> {pdf_path}")
print(f"Boyut: 8.5 x 12 cm @ {DPI} DPI ({W}x{H} px)")
print("Baskiya hazir!")
