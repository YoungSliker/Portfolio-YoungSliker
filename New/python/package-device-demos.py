"""Package real Playwright recordings. Run after RECORD_DEMOS=1 recording tests."""
from pathlib import Path
import subprocess, json
from PIL import Image, ImageDraw, ImageFont
root=Path(__file__).resolve().parents[1]
out=root/'assets/videos/showcase';out.mkdir(parents=True,exist_ok=True)
for name,w,h in [('desktop',1440,900),('tablet',1024,768),('mobile',390,844)]:
    source=root/f'test-results/{name}-demo.webm'
    duration=float(json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_format','-of','json',str(source)]))['format']['duration'])
    banner=Image.new('RGB',(w,48),'#f6f3eb');draw=ImageDraw.Draw(banner)
    font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',14)
    draw.text((18,16),f'{name.upper()} / {w} x {h}',font=font,fill='#282822')
    if w>600:draw.text((w-240,16),'YOUNGSLIKER / LIVE DEMO',font=font,fill='#a93812')
    label=root/f'test-results/{name}-label.png';banner.save(label)
    filters=f'[0:v]fps=30,pad=iw:ih+48:0:48:color=0xf6f3eb[base];[base][1:v]overlay=0:0,fade=t=in:st=0:d=0.3,fade=t=out:st={max(0,duration-.4)}:d=0.4,format=yuv420p[v]'
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(source),'-i',str(label),'-filter_complex',filters,'-map','[v]','-an','-c:v','libx264','-preset','medium','-crf','24','-movflags','+faststart',str(out/f'{name}.mp4')],check=True)
    image=root/f'assets/images/showcase/{name}.png';im=Image.open(image);im.thumbnail((1100,900));im.save(image.with_suffix('.webp'),quality=82)
    print(name,round(duration,2),'seconds',round((out/f'{name}.mp4').stat().st_size/1024/1024,2),'MiB')
