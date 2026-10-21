import {test,expect} from '@playwright/test';
for(const width of [375,1440]){
 test(`chapter navigation has no preceding-section band ${width}`,async({page},testInfo)=>{
  await page.setViewportSize({width,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/Portfolio-YoungSliker/New/#about');
  for(const id of ['journey','works','about','about']){
   await page.locator(`.site-header nav a[href="#${id}"]`).click();
   await expect.poll(()=>page.evaluate(id=>{
    const header=document.querySelector('.site-header')!.getBoundingClientRect();
    const section=document.getElementById(id)!.getBoundingClientRect();
    return Math.abs(section.top-header.bottom);
   },id)).toBeLessThan(2);
   await page.screenshot({path:testInfo.outputPath(`nav-seam-${id}-${width}-${Date.now()}.png`)});
  }
 });
}
