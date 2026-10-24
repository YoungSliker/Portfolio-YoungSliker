"""Preserve legacy media semantics instead of reducing each work to a cover."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1];repo=root.parent
def catalog(name):
 s=(repo/'js'/name).read_text(encoding='utf-8')
 return json.JSONDecoder().raw_decode(s[s.index('[{"title"'):].replace('\\\\','\\').replace('\\`','`'))[0]
visual=catalog('visual-menu-813.js');aigc=catalog('drift-735.js')
entries=json.loads((root/'data/graph-extra.json').read_text(encoding='utf-8'))
media={};routes={'kulun':'visual-0','wanbu':'visual-1','guisui':'visual-2','xueban':'app-0','yanchage':'app-1','zhucanbang':'app-2','shuyun':'media-0','kinect-face':'media-1','kinect-water':'media-2'}
def visual_media(i):
 w=visual[i]; items=[]
 if w['kind']=='logo':return [{'src':w.get('originalGif') or w.get('gif') or w.get('original') or w['full'],'type':'image'}]
 if w.get('originalGif') or w.get('gif'):items.append({'src':w.get('originalGif') or w['gif'],'type':'image'})
 if w['kind']=='video':items.append({'src':w['full'],'type':'video' if i in [24,25,26,27,28,29] else 'loop'})
 else:
  paths=w.get('gallery') or [w.get('full') or w.get('original')]
  if w['kind']=='museum':paths=[str(p.relative_to(repo)).replace('\\','/') for p in sorted((repo/'视觉传达设计/版面设计').glob('赤峰博物馆导览手册*')) if p.suffix.lower() in ['.png','.jpg','.jpeg']]
  for same in visual:
   if sum(x['title']==w['title'] for x in visual)>1 and same['title']==w['title'] and same.get('original') and same['original'] not in paths and same['kind']!='video' and not same['original'].endswith('.svg'):paths.append(same['original'])
  for path in paths:
   if path and (repo/path).exists():items.append({'src':path,'type':'image'})
 return items
for id,i in [('wanbu',1),('guisui',2)]:media[id]=visual_media(i)
for w in entries:
 id=w['id']
 if w.get('pending'):continue
 if id.startswith('visual-'):
  i=int(id.split('-')[1]);routes[id]=id;media[id]=visual_media(i)
 elif id.startswith('ai-extra-'):
  i=int(id.split('-')[-1]);routes[id]='aigc-'+str(i)
  w=aigc[i]; paths=list(dict.fromkeys(w.get('images',[])+w.get('variants',[])))
  media[id]=[{'src':p,'type':'image'} for p in paths if isinstance(p,str) and (repo/p).exists()]
  media[id]+=[{'src':v['src'].replace('背景/网页预览/694/','背景/掌中建筑设计/694/'),'type':'video'} for v in w.get('videos',[])]
 elif id.startswith('media-'):routes[id]=id
for id in ['ai-extra-9','ai-extra-11']:
 media[id]=[item for item in media[id] if item['type']=='video'][:1]
for id,name in [('domestic-human','国内仿真人'),('international-human','国外仿真人')]:
 media[id]=[{'src':'New/assets/videos/03 The Journey/'+name+'.mp4','type':'video'}]
(root/'data/work-media.json').write_text(json.dumps(media,ensure_ascii=False,indent=2),encoding='utf-8')
(root/'data/work-routes.json').write_text(json.dumps(routes,ensure_ascii=False,indent=2),encoding='utf-8')
(repo/'js/work-entry-data.js').write_text('window.portfolioAigcTitles='+json.dumps([w['title'] for w in aigc],ensure_ascii=False)+';\nwindow.portfolioVisualMedia='+json.dumps({str(i):visual_media(i) for i in range(len(visual))},ensure_ascii=False)+';\n',encoding='utf-8')
missing=[x['src'] for items in media.values() for x in items if not (repo/x['src']).exists()]
print('Routes:',len(routes),'Preview sets:',len(media),'Missing:',missing)
