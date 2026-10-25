"""Create an overlay package; existing legacy files must remain at their URLs."""
from pathlib import Path
import subprocess,json,zipfile,hashlib
root=Path(__file__).resolve().parents[1];repo=root.parent
allowed={'index.html','css','js','AIGC','数字体验设计','视觉传达设计','主界面','Fonts','简历_中文版.svg'}
tracked=subprocess.check_output(['git','ls-files','-z'],cwd=repo).decode('utf-8').split('\0')
legacy=[repo/p for p in tracked if p and p.split('/')[0] in allowed and (repo/p).is_file()]
converted=[repo/'视觉传达设计'/name for name in ['好书推荐-《小王子》-我和书.mp4','设计学院造型基础展览视频.mp4']]
for p in converted:
 if not p.is_file():raise SystemExit(f'Missing compatible video: {p}')
 if p not in legacy:legacy.append(p)
built=list((root/'dist').rglob('*')); built=[p for p in built if p.is_file()]
if not (root/'dist/index.html').exists():raise SystemExit('Run npm run build first')
report={'legacyBytes':sum(p.stat().st_size for p in legacy),'newBuiltBytes':sum(p.stat().st_size for p in built),'legacyFiles':len(legacy),'newBuiltFiles':len(built),'largestLegacy':[{'path':p.relative_to(repo).as_posix(),'bytes':p.stat().st_size} for p in sorted(legacy,key=lambda p:p.stat().st_size,reverse=True)[:10]]}
report['combinedBytes']=report['legacyBytes']+report['newBuiltBytes']
(root/'docs/deployment-inventory.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
release=root/'release';release.mkdir(exist_ok=True)
compat=[p for p in legacy if p.relative_to(repo).parts[0] in {'index.html','js','css'} or p in converted]
with zipfile.ZipFile(release/'new-overlay.zip','w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in built:z.write(p,'New/'+p.relative_to(root/'dist').as_posix())
 for p in compat:z.write(p,p.relative_to(repo).as_posix())
 z.writestr('README.txt','Extract at the existing portfolio site root. This package includes the current legacy index.html/js/css for deep links and return navigation. Existing media directories must match this repository. This package is NOT a standalone site. Public base path: /Portfolio-YoungSliker/New/.')
manifest=[{'path':'New/'+p.relative_to(root/'dist').as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in built]
manifest.extend({'path':p.relative_to(repo).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in compat)
(release/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
