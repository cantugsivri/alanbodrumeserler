import re

# ---- Kaynak veri ----
raw_lines = open('alan_eser.txt', encoding='utf-8').read().splitlines()

# Bölüm başlıkları
SECTIONS = {
    'SOL DUVAR': 'Sol Duvar',
    'BAR ALTI, YER, SOKAK': 'Bar Altı, Yer, Sokak',
    'SAĞ DUVAR': 'Sağ Duvar',
    'ANTRE': 'Antre',
    'TUVALET': 'Tuvalet',
}

def clean(s):
    return s.strip().strip('\r').strip()

def parse_price(text):
    """'500 Euro / 25000 TL'  →  (500, 25000)"""
    eur = re.search(r'(\d[\d.,]*)\s*Euro', text, re.IGNORECASE)
    tl  = re.search(r'(\d[\d.,]*)\s*TL',  text, re.IGNORECASE)
    eur_val = int(re.sub(r'[.,]', '', eur.group(1))) if eur else 0
    tl_val  = int(re.sub(r'[.,]', '', tl.group(1)))  if tl  else 0
    return eur_val, tl_val

def parse_dims(text):
    m = re.search(r'(\d+[\*xX]\d+|\d+\s*cm\s*[çÇ]ap|[çÇ]ap[ıi]?\s*\d+|\d+\s*cm)', text)
    return m.group(0).strip() if m else ''

def parse_material(text):
    keywords = [
        'mermer', 'doğal taş', 'taştan', 'taş', 'cam', 'vitray', 'seramik',
        'kum', 'suluboya', 'boyama', 'kabartmalı'
    ]
    found = []
    low = text.lower()
    for kw in keywords:
        if kw in low and kw not in [f.lower() for f in found]:
            found.append(kw.capitalize())
    return ', '.join(found) if found else 'Doğal Malzeme'

# ---- Parser ----
artworks = []
current_section = 'Genel'
uid = 1

i = 0
while i < len(raw_lines):
    line = clean(raw_lines[i])
    if not line:
        i += 1
        continue

    # Bölüm başlığı mı?
    if line in SECTIONS:
        current_section = SECTIONS[line]
        i += 1
        continue

    # Fiyat bilgisi var mı bu satırda?
    has_price = bool(re.search(r'Euro|TL', line, re.IGNORECASE))

    # Alt eser mi? (1:, 2:, 1-, vb. ile başlayan)
    sub_match = re.match(r'^(\d+)\s*[:ve\-]\s*', line)

    if has_price and not sub_match:
        # Tek satırlık eser
        # İsim: iki nokta öncesi
        parts = line.split(':', 1)
        name = clean(parts[0])
        rest = parts[1] if len(parts) > 1 else ''
        price_eur, price_tl = parse_price(line)
        dims = parse_dims(rest)
        mat = parse_material(rest)

        artworks.append({
            'id': uid,
            'artwork_name': name,
            'cafe_location': current_section,
            'material': mat,
            'dimensions': dims,
            'price_eur': price_eur,
            'price_tl': price_tl,
            'category': 'Mozaik',
            'artist': 'ALAN Art Studio',
            'status': 'active',
            'image_url': '',
            'description': ''
        })
        uid += 1

    elif not has_price and not sub_match:
        # Başlık satırı — sonraki satırlar alt eserler
        parts = line.split(':', 1)
        parent_name = clean(parts[0])
        parent_desc  = clean(parts[1]) if len(parts) > 1 else ''

        i += 1
        while i < len(raw_lines):
            sub = clean(raw_lines[i])
            if not sub:
                i += 1
                break
            if sub in SECTIONS:
                break
            sub_m = re.match(r'^(\d+)\s*[:ve\-und ]\s*(.*)', sub)
            if sub_m and re.search(r'Euro|TL', sub, re.IGNORECASE):
                num = sub_m.group(1)
                rest2 = sub_m.group(2)
                price_eur, price_tl = parse_price(sub)
                dims = parse_dims(rest2 + ' ' + parent_desc)
                mat = parse_material(parent_desc + ' ' + rest2)
                artworks.append({
                    'id': uid,
                    'artwork_name': f'{parent_name} {num}',
                    'cafe_location': current_section,
                    'material': mat,
                    'dimensions': dims,
                    'price_eur': price_eur,
                    'price_tl': price_tl,
                    'category': 'Mozaik',
                    'artist': 'ALAN Art Studio',
                    'status': 'active',
                    'image_url': '',
                    'description': parent_desc
                })
                uid += 1
                i += 1
            else:
                # Alt eser değil, yeni ana eser
                break
        continue

    i += 1

# ---- CSV çıktısı ----
import csv, io

fieldnames = ['id','artwork_name','cafe_location','material','dimensions',
              'price_eur','price_tl','category','artist','status','image_url','description']

with open('alan_eserler.csv', 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(artworks)

print(f"Toplam {len(artworks)} eser -> alan_eserler.csv")

for a in artworks:
    print(f"  [{a['id']:3}] {a['cafe_location']:<25} {a['artwork_name']}")
