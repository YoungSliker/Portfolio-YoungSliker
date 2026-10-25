"""Build a standalone Pages copy. Originals are never modified; URLs/formats stay intact."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
import hashlib, json, subprocess
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
repo = root.parent
destination = root / 'release' / 'site'
allowed = {'index.html', 'css', 'js', 'AIGC', '数字体验设计', '视觉传达设计', '主界面', 'Fonts', '简历_中文版.svg'}
tracked = subprocess.check_output(['git', 'ls-files', '-z'], cwd=repo).decode().split('\0')
sources = {p: repo / p for p in tracked if p and p.split('/')[0] in allowed and (repo / p).is_file()}
for name in ['好书推荐-《小王子》-我和书.mp4', '设计学院造型基础展览视频.mp4']:
    sources['视觉传达设计/' + name] = repo / '视觉传达设计' / name
if not (root / 'dist/index.html').is_file():
    raise SystemExit('Build New first')
sources.update({'New/' + p.relative_to(root / 'dist').as_posix(): p for p in (root / 'dist').rglob('*') if p.is_file()})
destination.mkdir(parents=True, exist_ok=True)
# Refuse stale content instead of deleting potentially user-owned files.
unexpected = [p for p in destination.rglob('*') if p.is_file() and p.relative_to(destination).as_posix() not in sources and p.name != '.nojekyll']
if unexpected:
    raise SystemExit(f'Unexpected files in release directory: {unexpected[:3]}')

def prepare(item):
    relative, source = item
    original = source.read_bytes()
    data = original
    dimensions = None
    if source.suffix.lower() in {'.jpg', '.jpeg', '.png'} and len(original) > 200_000:
        with Image.open(BytesIO(original)) as image:
            if not getattr(image, 'is_animated', False):
                image = ImageOps.exif_transpose(image)
                # Retain long vertical layouts; width, not height, controls reduction.
                if image.width > 1920:
                    image = image.resize((1920, round(image.height * 1920 / image.width)), Image.Resampling.LANCZOS)
                dimensions = list(image.size)
                buffer = BytesIO()
                if source.suffix.lower() in {'.jpg', '.jpeg'}:
                    image.convert('RGB').save(buffer, 'JPEG', quality=88, optimize=True, progressive=True)
                else:
                    alpha = image.convert('RGBA').getchannel('A').getextrema()
                    # Transparent logos retain full color/alpha. Opaque large PNGs use a dithered palette.
                    if alpha == (255, 255) and len(original) > 500_000:
                        image = image.convert('RGB').quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
                    image.save(buffer, 'PNG', optimize=True)
                if len(buffer.getvalue()) < len(original):
                    data = buffer.getvalue()
    target = destination / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    return {'path': relative, 'originalBytes': len(original), 'bytes': len(data), 'dimensions': dimensions,
            'sourceSha256': hashlib.sha256(original).hexdigest(), 'sha256': hashlib.sha256(data).hexdigest()}

with ThreadPoolExecutor(max_workers=3) as pool:
    records = list(pool.map(prepare, sources.items()))
(destination / '.nojekyll').write_text('', encoding='utf-8')
total = sum(row['bytes'] for row in records)
report = {'files': len(records), 'originalBytes': sum(row['originalBytes'] for row in records), 'publishedBytes': total,
          'limitBytes': 1_000_000_000, 'filesDetail': records}
(root / 'release/pages-manifest.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({k: v for k, v in report.items() if k != 'filesDetail'}, ensure_ascii=False), flush=True)
if total >= 950_000_000:
    raise SystemExit('Release exceeds 950 MB safety budget; do not publish')
