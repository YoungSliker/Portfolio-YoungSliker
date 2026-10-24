import {test,expect} from '@playwright/test';
test('portrait controls, single heart preview and compact app cards',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/Portfolio-YoungSliker/New/#works');
 const choose=async(id:string)=>page.locator(`.react-flow__node[data-id="${id}"] button`).dispatchEvent('click');
 const card=page.getByRole('region',{name:'作品概况'}),dialog=page.locator('.graph-lightbox');
 await choose('aigc');await choose('ai-video');await choose('ai-extra-1');await card.locator('.graph-cover-button').click();
 const v=dialog.locator('video');await expect.poll(()=>v.evaluate((x:HTMLVideoElement)=>x.videoHeight)).toBeGreaterThan(0);
 await expect(v).toHaveJSProperty('disablePictureInPicture',true);await expect(v).toHaveJSProperty('controls',false);
 const widths=await dialog.evaluate(d=>[d.querySelector('video')!.getBoundingClientRect().width,d.querySelector('.graph-video-controls')!.getBoundingClientRect().width]);expect(Math.abs(widths[0]-widths[1])).toBeLessThan(2);
 await page.screenshot({path:'test-results/portrait-controls.png'});await page.keyboard.press('Escape');
 await choose('ai-image');await choose('ai-extra-8');await card.locator('.graph-cover-button').click();await expect(dialog.locator('img')).toHaveAttribute('src',/b\.png$/);await expect(dialog.locator('.graph-media-nav')).toHaveCount(0);await page.keyboard.press('Escape');
 await choose('digital');await choose('apps');
 for(const id of ['xueban','yanchage','zhucanbang']){await choose(id);expect(await card.evaluate(el=>el.scrollHeight<=el.clientHeight)).toBe(true);await expect(card.locator('.graph-detail-link')).toBeVisible();await card.screenshot({path:`test-results/compact-${id}.png`});}
});
