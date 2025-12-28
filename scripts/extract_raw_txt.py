from pypdf import PdfReader
import re
from pathlib import Path

PDF_PATH = Path("data/raw/DPDP_Act_2023.pdf")
OUT_PATH = Path("data/processed/raw_text.txt")

reader = PdfReader(PDF_PATH)

text = ""
for page in reader.pages:
    t = page.extract_text()
    if t:
        text += t + "\n"

# Clean headers / footers / noise / Hindi / side-noise
text = re.sub(r"THE GAZETTE OF INDIA EXTRAORDINARY.*?\n", "", text)
text = re.sub(r"MINISTRY OF LAW AND JUSTICE.*?\n", "", text)
text = re.sub(r"\(Legislative Department\).*?\n", "", text)
text = re.sub(r"New Delhi, the.*?\n", "", text)
text = re.sub(r"The following Act of Parliament received the assent.*?\n", "", text)
text = re.sub(r"CG-DL-E-\d+-?\d+", "", text)
text = re.sub(r"सी.जी.-डी.एल.-अ.-\d+-?\d+", "", text)

# Remove Hindi text block artifacts
text = re.sub(r"[\u0900-\u097F]+", "", text)

# Remove page markers like "SEC. 1]" or "2", "4", "6", "8" etc which are page numbers in the footer
# These often appear as a number on a line by itself
text = re.sub(r"\n\s*\d+\s*\n", "\n", text)
text = re.sub(r"SEC\.\s*1\]", "", text)

text = re.sub(r"UPLOADED BY THE MANAGER.*", "", text, flags=re.DOTALL)

# Normalize section starts: Ensure "1. (1)" or "2. In this Act" format
text = re.sub(r"(\n)(\d+[A-Z]?)\s+(\()", r"\1\2. \3", text)

# Remove excessive whitespace but keep structure
text = re.sub(r" {2,}", " ", text)
text = re.sub(r"\n{3,}", "\n\n", text)

OUT_PATH.parent.mkdir(exist_ok=True)
OUT_PATH.write_text(text.strip(), encoding="utf-8")

print("Clean raw text extracted and normalized")
