import {test,expect} from '@playwright/test';
import {enterArchive} from './hero-helpers';
test('pointer bursts do not synchronously measure every fold title',async({page})=>{
 await page.goto('/Portfolio-YoungSliker/New/');await enterArchive(page);
 const sample=()=>page.evaluate(()=>{
  const original=Element.prototype.getBoundingClientRect;let reads=0;
  Element.prototype.getBoundingClientRect=function(){if(this.classList.contains('fold-text'))reads++;return original.call(this);};
  for(let i=0;i<60;i++)window.dispatchEvent(new PointerEvent('pointermove',{clientX:500+i,clientY:350}));
  Element.prototype.getBoundingClientRect=original;return reads;
 });
 expect(await sample()).toBe(0);
 await page.locator('#journey-title').scrollIntoViewIfNeeded();
 expect(await sample()).toBe(0);
 await page.waitForTimeout(1900);
 expect(await sample()).toBe(0);
 const title=page.locator('#journey-title .fold-text').first();
 const box=await title.boundingBox();
 await page.mouse.move(box!.x+box!.width/2,box!.y+box!.height/2);
 await expect.poll(()=>title.locator('.fold-text-piece').first().evaluate(el=>getComputedStyle(el).transform)).not.toBe('none');
});
