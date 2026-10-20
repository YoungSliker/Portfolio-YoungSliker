from pathlib import Path
import re
from PIL import Image, ImageOps
root = Path(__file__).resolve().parents[1]
repo = root.parent
output = root / 'assets/images/graph'
output.mkdir(parents=True, exist_ok=True)
for work_id, cover in re.findall(r"\{id:'([^']+)'.*?cover:'([^']+)'", (root/'data/graph.ts').read_text(encoding='utf-8')):
    with Image.open(repo / cover) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        image.thumbnail((640, 640), Image.Resampling.LANCZOS)
        image.save(output / f'{work_id}.webp', quality=82, method=6)
print('Graph previews:', len(list(output.glob('*.webp'))))
