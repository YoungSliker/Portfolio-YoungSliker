"""Import verified legacy entries; collapse repeated views, create small graph previews."""
from pathlib import Path
import json, subprocess
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
repo = root.parent
def legacy(name):
    source = (repo / name).read_text(encoding='utf-8')
    source = source[source.index('[{"title"'):].replace('\\\\', '\\').replace('\\`', '`')
    return json.JSONDecoder().raw_decode(source)[0]

items = []
def add(id, group, title, cover='', original='', date='', pending=False):
    item = dict(id=id, group=group, title=title, cover=cover, summary=title+'。' if not pending else '作品待加入。', source='旧版作品清单' if not pending else '用户计划加入', date=date, pending=pending, original=original)
    if cover and (repo/cover).is_file():
        try:
            with Image.open(repo/cover) as im:
                im=ImageOps.exif_transpose(im).convert('RGB'); im.thumbnail((480,480),Image.Resampling.LANCZOS)
                im.save(root/f'assets/images/graph/{id}.webp',quality=80)
        except (OSError,ValueError): pass
    elif original and (repo/original).suffix.lower()=='.mp4' and (repo/original).exists():
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-ss','1','-i',str(repo/original),'-frames:v','1','-vf','scale=480:-1','-y',str(root/f'assets/images/graph/{id}.webp')],check=True)
    items.append(item)

video_names=['跨画钓鱼','伞下','蛇祖','智慧助老','小马博士']
for i,w in enumerate(legacy('js/drift-735.js')):
    title=w['title']; group='ai-video' if any(n in title for n in video_names) else 'ai-tutorial' if 'ARTI' in title or 'Stable Diffusion' in title else 'ai-image'
    short=next((label for term,label in [('ARTI','ARTI'),('Stable Diffusion','SD 经验分享'),('元宇宙','元宇宙空间设计'),('心脏','心脏 AI'),('老人','老人 LOGO'),('智慧助老','智慧助老'),('小马博士','小马博士'),('黄河','黄河 IP')] if term in title),title)
    if '智慧助老' in title: short='智慧助老'
    cover=(w.get('tiles') or [{}])[0].get('image') or (w.get('covers') or w.get('images') or [''])[0]
    original=(w.get('videos') or [{}])[0].get('src') or (w.get('images') or [''])[0]
    add('ai-extra-'+str(i),group,short,cover,original,w.get('date',''))
for id,title in [('domestic-human','国内仿真人'),('international-human','国外仿真人')]: add(id,'ai-video',title,pending=True)
source=(repo/'js/gallery-data-742.js').read_text(encoding='utf-8')
media=json.JSONDecoder().raw_decode(source[source.index('['):])[0]
for w in media[3:]: add('media-'+str(w['id']),'media',w['title'],w['poster'],(w.get('videos') or [{}])[0].get('src',''))
seen=set()
for i,w in enumerate(legacy('js/visual-menu-813.js')):
    if i in [0,1,2] or w['title'] in seen: continue
    seen.add(w['title'])
    group='logos' if w['kind']=='logo' else 'visual-video' if w['kind']=='video' else 'layout'
    original=w.get('original') or w.get('full') or ''
    cover=w.get('coverSource') or (original if Path(original).suffix.lower() in ['.png','.jpg','.webp','.jpeg'] else '')
    alternatives={31:'视觉传达设计/版面设计/托县剪纸珍藏馆.mp4',34:'视觉传达设计/版面设计/海报版式练习1.png',36:'视觉传达设计/版面设计/舞动的植物-半日花信息可视化.png'}
    if i in alternatives: original=alternatives[i]; cover=original if i!=31 else ''
    add('visual-'+str(i),group,w['title'],cover,original)
(root/'data/graph-extra.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf-8')
print('Imported additional unique works:',len(items))
