import {test,expect} from '@playwright/test';
import {graphWorks,graphDetailKeys} from '../../data/graph';
import media from '../../data/work-media.json' with {type:'json'};
import fs from 'node:fs';
import path from 'node:path';
test('all published graph entries have full routes and existing preview media',()=>{
 for(const w of graphWorks.filter(w=>!w.pending))expect(graphDetailKeys[w.id]||w.original.endsWith('.mp4'),w.title).toBeTruthy();
 for(const items of Object.values(media))for(const item of items)expect(fs.existsSync(path.resolve('..',item.src)),item.src).toBe(true);
 expect(media['visual-24'][0]).toMatchObject({type:'video',src:expect.stringContaining('.mp4')});
 expect(media['visual-29'][0]).toMatchObject({type:'video'});
 expect(media['visual-8'][0].src).toMatch(/\.gif$/);
 expect(media['visual-34'].length).toBeGreaterThan(1);
 expect(media['ai-extra-5'].length).toBe(9);
});
for(const [route,title,selector] of [
 ['visual-0','库伦荞麦','.vm797-kulun'],['app-2','助残帮','.ap-viewer'],
 ['app-0','学伴','.ap-viewer'],['app-1','颜茶阁','.ap-viewer'],
 ['visual-24','小王子','.vm797-dialog'],['visual-29','造型基础','.vm797-dialog'],
 ['visual-8','敕勒川','.vm797-dialog'],['visual-34','海报版式','.vm797-dialog'],
 ['aigc-5','老人','.drift-detail'],['media-0','川剧','.mg-detail']
])test(`full detail ${route} ${title}`,async({page})=>{
 test.setTimeout(60000);await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(`/Portfolio-YoungSliker/index.html?work=${route}`,{waitUntil:'domcontentloaded'});
 const dialog=page.locator(`${selector}[open]`);await expect(dialog).toBeVisible({timeout:25000});
 await expect(dialog).toContainText(title);
 if(route==='visual-24'||route==='visual-29'){
  const video=dialog.locator('video').first();
  await expect(video).toHaveAttribute('src',/\.mp4/);
  await video.evaluate((v:HTMLVideoElement)=>{v.muted=true;return v.play();});
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime),{timeout:15000}).toBeGreaterThan(0);
 }
 if(route==='visual-8')await expect(dialog.locator('img').first()).toHaveAttribute('src',/\.gif/);
});
