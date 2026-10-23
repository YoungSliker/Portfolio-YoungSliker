"""Check catalog paths and produce a numbered contact sheet for visual review."""
from pathlib import Path
import json, re, sys
from PIL import Image, ImageOps, ImageDraw
root=Path(__file__).resolve().parents[1]
repo=root.parent
main=[dict(id=i,cover=c) for i,c in re.findall(r"\{id:'([^']+)'.*?cover:'([^']+)'",(root/'data/graph.ts').read_text(encoding='utf-8'))]
works=main+json.loads((root/'data/graph-extra.json').read_text(encoding='utf-8'))
sheet=Image.new('RGB',(1000,((len(works)+4)//5)*140),'#eee9df')
draw=ImageDraw.Draw(sheet)
missing=[]
for n,w in enumerate(works):
 if w.get('pending'):continue
 preview=root/f"assets/images/graph/{w['id']}.webp"
 if '--repair-alpha' in sys.argv and w.get('cover') and (repo/w['cover']).exists():
  with Image.open(repo/w['cover']) as source:
   if 'A' in source.getbands() or 'transparency' in source.info:
    fixed=ImageOps.exif_transpose(source).convert('RGBA')
    fixed.thumbnail((640,640),Image.Resampling.LANCZOS)
    fixed.save(preview,quality=82,method=6)
 if not preview.exists():missing.append(w['id']);continue
 with Image.open(preview) as im:
  im=ImageOps.contain(im.convert('RGBA'),(190,110))
  x=(n%5)*200;y=(n//5)*140
  sheet.paste(im,(x+(200-im.width)//2,y),im)
  draw.text((x+5,y+114),w['id'],fill='#222222')
sheet.save(root/'test-results/graph-cover-audit.jpg')
print(f'{len(works)} entries; missing previews: {missing}')
print('Missing cover sources:',[w['id'] for w in works if w.get('cover') and not (repo/w['cover']).exists()])
