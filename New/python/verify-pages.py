"""Check the published copy and confirm source assets have not changed."""
from pathlib import Path
from io import BytesIO
import hashlib, json
from PIL import Image, ImageOps, ImageDraw

root = Path(__file__).resolve().parents[1]
report = json.loads((root / 'release/pages-manifest.json').read_text(encoding='utf-8'))
site = root / 'release/site'
image_count = 0
for row in report['filesDetail']:
    source = root / 'dist' / row['path'][4:] if row['path'].startswith('New/') else root.parent / row['path']
    assert hashlib.sha256(source.read_bytes()).hexdigest() == row['sourceSha256'], source
    target = site / row['path']
    assert hashlib.sha256(target.read_bytes()).hexdigest() == row['sha256'], target
    if target.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp', '.gif'}:
        with Image.open(target) as image:
            image.verify()
        if target.suffix.lower() == '.png' and row['originalBytes'] != row['bytes']:
            with Image.open(source) as original, Image.open(target) as output:
                original = ImageOps.exif_transpose(original).convert('RGBA')
                if original.size != output.size:
                    original = original.resize(output.size, Image.Resampling.LANCZOS)
                assert original.getchannel('A').tobytes() == output.convert('RGBA').getchannel('A').tobytes(), target
        image_count += 1
assert sum(p.stat().st_size for p in site.rglob('*') if p.is_file()) < 950_000_000
# Side-by-side top savings, at a practical preview size. Not included in deployment.
rows = sorted(report['filesDetail'], key=lambda r:r['originalBytes']-r['bytes'], reverse=True)[:6]
canvas = Image.new('RGB', (1200, 6 * 340), '#ddd8ce')
draw = ImageDraw.Draw(canvas)
for i, row in enumerate(rows):
    for j, path in enumerate([root.parent / row['path'], site / row['path']]):
        with Image.open(path) as im:
            im = ImageOps.exif_transpose(im).convert('RGBA')
            background = Image.new('RGBA', im.size, 'white')
            im = Image.alpha_composite(background, im).convert('RGB')
            im.thumbnail((580, 300))
            canvas.paste(im, (j * 600 + (600-im.width)//2, i * 340 + 25))
    draw.text((10, i*340+5), f'{i+1} ORIGINAL / RELEASE', fill='black')
canvas.save(root / 'release/image-quality-review.jpg', quality=94)
print(json.dumps({'verifiedFiles':len(report['filesDetail']), 'decodedImages':image_count, 'sourceHashesUnchanged':True, 'publishedBytes':report['publishedBytes']}))
