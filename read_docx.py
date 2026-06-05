import zipfile
import xml.etree.ElementTree as ET
import os

def docx_to_text(docx_path, output_path):
    ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
    with zipfile.ZipFile(docx_path, 'r') as z:
        with z.open('word/document.xml') as f:
            tree = ET.parse(f)
    root = tree.getroot()
    lines = []
    for para in root.iter(f'{ns}p'):
        texts = [node.text for node in para.iter(f'{ns}t') if node.text]
        line = ''.join(texts).strip()
        if line:
            lines.append(line)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"OK: {output_path} ({len(lines)} satır)")

docx_to_text('ALAN - ESER BİLGİLERİ - FİYAT.docx', 'alan_eser.txt')
