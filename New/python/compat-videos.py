from pathlib import Path
import subprocess
for p in (Path(__file__).resolve().parents[2]/'视觉传达设计').glob('*.mkv'):
 out=p.with_suffix('.mp4')
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(p),'-map','0:v:0','-map','0:a?','-vf','scale=1280:-2','-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',str(out)],check=True)
 print(str(out),out.stat().st_size,flush=True)
