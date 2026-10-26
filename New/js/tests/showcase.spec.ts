import {test,expect} from '@playwright/test';
for(const width of [375,430,768,1024,1440,1920])test(`showcase lazy media and layout ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 const demoRequests:string[]=[];page.on('request',r=>{if(/\/(desktop|tablet|mobile)-[^/]+\.mp4/.test(r.url()))demoRequests.push(r.url());});
 await page.goto('/Portfolio-YoungSliker/New/#contact');
 const toggle=page.getByRole('button',{name:'浏览体验 · 多设备演示'});
 await expect(toggle).toHaveAttribute('aria-expanded','false');await expect(page.locator('#showcase')).toHaveCount(0);expect(demoRequests).toHaveLength(0);
 await toggle.click();const section=page.locator('#showcase');await section.scrollIntoViewIfNeeded();
 await expect(section.locator('.device-demo')).toHaveCount(3);await expect(section.locator('video')).toHaveCount(0);expect(demoRequests).toHaveLength(0);
 await expect.poll(()=>section.locator('img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).naturalWidth>0))).toBe(true);
 for(const name of ['桌面','平板','手机']){
  await section.getByRole('button',{name:`观看${name}演示`}).click();const video=section.locator('video');await expect(video).toHaveCount(1);
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>Number.isFinite(v.duration)&&v.duration>5)).toBe(true);
  expect(await video.evaluate((v:HTMLVideoElement)=>v.controls)).toBe(false);
  await section.getByRole('button',{name:'播放',exact:true}).click();await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(.1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await section.getByRole('button',{name:'收起演示 ×'}).click();await expect(section.locator('video')).toHaveCount(0);
 }
 await section.scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/showcase-${width}.png`,fullPage:false});
 await section.getByRole('button',{name:'观看桌面演示'}).click();await expect(section.locator('video')).toHaveCount(1);
 await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','false');await expect(page.locator('#showcase')).toHaveCount(0);await expect(page.locator('#contact video')).toHaveCount(0);
});

test('keyboard focus follows opening and closing device demo',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/Portfolio-YoungSliker/New/#contact');
 await page.getByRole('button',{name:'浏览体验 · 多设备演示'}).click();const section=page.locator('#showcase');const cover=section.getByRole('button',{name:'观看桌面演示'});await cover.focus();await page.keyboard.press('Enter');
 await expect(section.getByRole('button',{name:'播放',exact:true})).toBeFocused();
 await section.getByRole('button',{name:'收起演示 ×'}).focus();await page.keyboard.press('Enter');await expect(cover).toBeFocused();
});

test('showcase player has its own styles without graph mounting',async({page})=>{
 await page.addInitScript(()=>{
  const Observer=window.IntersectionObserver;
  window.IntersectionObserver=class extends Observer{constructor(callback:IntersectionObserverCallback,options?:IntersectionObserverInit){super((entries,observer)=>{const filtered=entries.filter(e=>!e.target.closest('#works'));if(filtered.length)callback(filtered,observer);},options);}};
 });
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/Portfolio-YoungSliker/New/#contact');await page.getByRole('button',{name:'浏览体验 · 多设备演示'}).click();await page.locator('#showcase').getByRole('button',{name:'观看手机演示'}).click();
 await expect(page.locator('.react-flow')).toHaveCount(0);await expect(page.locator('#showcase .graph-video-controls')).toHaveCSS('display','flex');
});
