import base64
import io
import json
import re
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

TRANSCRIPT = Path(
    r"C:\Users\moush\.cursor\projects\c-Users-moush-Downloads-sense-o-vita\agent-transcripts"
    r"\a5fc6064-8271-443c-a23d-7fe80e3b0645\a5fc6064-8271-443c-a23d-7fe80e3b0645.jsonl"
)

b64 = None
for line in TRANSCRIPT.read_text(encoding="utf-8").splitlines():
    if "data:image/jpeg;base64," in line and "4AAQSkZJRg" in line:
        m = re.search(r"data:image/jpeg;base64,([A-Za-z0-9+/=]+)", line)
        if m:
            b64 = m.group(1)
            break

if not b64:
    raise SystemExit("Could not find user base64 image in transcript")

raw = base64.b64decode(b64)
src_path = Path("images/_candidates/user_hero_source.jpg")
src_path.parent.mkdir(parents=True, exist_ok=True)
src_path.write_bytes(raw)

img = Image.open(io.BytesIO(raw)).convert("RGB")
w, h = img.size
print("source size", w, h)

# Sharpen lightly — user said current hero looks blurry
img = ImageEnhance.Sharpness(img).enhance(1.35)
img = ImageEnhance.Contrast(img).enhance(1.06)

# 4:3 landscape crop centered on content
target_ratio = 4 / 3
new_h = int(w / target_ratio)
if new_h <= h:
    top = max(0, (h - new_h) // 2)
    hero = img.crop((0, top, w, top + new_h))
else:
    new_w = int(h * target_ratio)
    left = (w - new_w) // 2
    hero = img.crop((left, 0, left + new_w, h))

hero = hero.resize((1200, 900), Image.Resampling.LANCZOS)

quality = 90
while quality >= 60:
    buf = io.BytesIO()
    hero.save(buf, format="JPEG", optimize=True, quality=quality)
    if buf.tell() <= 300 * 1024:
        break
    quality -= 3

Path("images/hero.jpg").write_bytes(buf.getvalue())
print("hero.jpg", hero.size, round(buf.tell() / 1024, 1), "KB", "q=", quality)
