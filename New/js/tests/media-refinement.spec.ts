import {test,expect} from '@playwright/test';
test('range requests support seeking without restarting the file',async({request})=>{
 const url='/Portfolio-YoungSliker/'+encodeURI('AIGC/背景/蛇祖漫剧/1.mp4');
 const response=await request.get(url,{headers:{Range:'bytes=1024-2047'}});
 expect(response.status()).toBe(206);expect(response.headers()['content-range']).toMatch(/^bytes 1024-2047\//);expect((await response.body()).length).toBe(1024);
 const invalid=await request.get(url,{headers:{Range:'bytes=900000000000-'}});expect(invalid.status()).toBe(416);
});
test('revised graph media and APP previews',async({page})=>{
 test.setTimeout(90000);await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/Portfolio-YoungSliker/New/#works');
 const activate=async(id:string)=>{await page.locator(`.react-flow__node[data-id="${id}"] button`).dispatchEvent('click');};
 const card=page.getByRole('region',{name:'作品概况'}),dialog=page.locator('.graph-lightbox');
 await activate('aigc');await activate('ai-video');
 for(const id of ['ai-extra-3','ai-extra-9','ai-extra-11','domestic-human','international-human']){
  await activate(id);await card.locator('.graph-cover-button').click();
  await expect(dialog.locator('video')).toHaveCount(id==='ai-extra-3'?4:1);
  const video=dialog.locator('video').first();
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.duration),{timeout:20000}).toBeGreaterThan(0);
  if(id==='ai-extra-3'){
   const range=dialog.getByRole('slider').first();await range.fill('600');await range.dispatchEvent('change');
   await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime/v.duration)).toBeCloseTo(.6,1);
   await dialog.getByRole('button',{name:'播放',exact:true}).first().click();
   await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused&&v.readyState>=2&&!v.seeking)).toBe(true);
   await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime/v.duration)).toBeGreaterThan(.62);
   await dialog.getByRole('button',{name:'暂停',exact:true}).first().click();
   await range.fill('200');await range.dispatchEvent('change');
   await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime/v.duration)).toBeCloseTo(.2,1);
   await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.readyState>=2&&!v.seeking)).toBe(true);
   await page.mouse.move(5,5);
   await page.screenshot({path:'test-results/video-grid-refined.png'});
  }
  await page.keyboard.press('Escape');
 }
 await activate('ai-tutorial');await activate('ai-extra-6');await card.locator('.graph-cover-button').click();await expect(dialog.locator('video')).toHaveCount(4);await page.keyboard.press('Escape');
 await activate('digital');await activate('apps');
 for(const id of ['xueban','yanchage','zhucanbang']){
  await activate(id);await expect(card.locator('.graph-app-preview')).toBeVisible();await expect(card.locator('.graph-cover-button')).toHaveCount(0);
  if(id!=='yanchage'){const v=card.locator('video');await expect(v).toHaveJSProperty('muted',true);await expect(v).toHaveJSProperty('controls',false);await expect.poll(()=>v.evaluate((x:HTMLVideoElement)=>x.currentTime),{timeout:20000}).toBeGreaterThan(0);}
  await card.screenshot({path:`test-results/app-${id}.png`});
 }
 await activate('visual');await activate('logos');await activate('wanbu');await expect(card.locator('.graph-cover-button')).toHaveCount(0);
 await expect(card.locator('.graph-detail-link')).toContainText('查看完整作品');
});
