import {test,expect} from '@playwright/test';
test('preview preserves groups, GIF, silent loop and playable films',async({page})=>{
 test.setTimeout(90000);await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/Portfolio-YoungSliker/New/#works');
 const activate=async(id:string)=>{await page.locator(`.react-flow__node[data-id="${id}"] button`).focus();await page.keyboard.press('Enter');};
 const card=page.getByRole('region',{name:'作品概况'});const dialog=page.locator('.graph-lightbox');
 await activate('aigc');await activate('ai-image');await activate('ai-extra-13');await card.locator('.graph-cover-button').click();
 await expect(dialog.locator('.graph-media-nav')).toContainText('1 / 3');const first=await dialog.locator('img').getAttribute('src');
 await dialog.getByRole('button',{name:'下一项'}).click();await expect(dialog.locator('img')).not.toHaveAttribute('src',first!);await page.keyboard.press('Escape');
 await activate('visual');await activate('logos');await activate('visual-8');await expect(card.locator('.graph-cover-button')).toHaveCount(0);
 await activate('visual-video');
 for(const id of ['visual-24','visual-29','visual-31']){
  await activate(id);await card.locator('.graph-cover-button').click();const video=dialog.locator('video');
  await expect(video).toHaveJSProperty('controls',false);
  if(id==='visual-31'){await expect(video).toHaveJSProperty('muted',true);await expect(video).toHaveJSProperty('loop',true);await expect(dialog.locator('.graph-video-controls')).toHaveCount(0);}
  else await dialog.getByRole('button',{name:'播放',exact:true}).click();
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime),{timeout:20000}).toBeGreaterThan(0);
  await page.keyboard.press('Escape');await expect(dialog.locator('video')).toHaveCount(0);
 }
});
