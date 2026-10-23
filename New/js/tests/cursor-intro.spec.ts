import {test,expect} from '@playwright/test';
test('rotated ticket corners, scoped links, modal cursor and intro timing',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 await page.addInitScript(()=>{
  (window as any).introGaps=[];let previous=0;
  const tick=(now:number)=>{if(document.body?.dataset.introEntering==='true'&&previous)(window as any).introGaps.push(now-previous);previous=now;if(!document.querySelector('#hero[data-entrance="ready"]'))requestAnimationFrame(tick);};requestAnimationFrame(tick);
 });
 await page.goto('/Portfolio-YoungSliker/New/');
 await expect(page.locator('#hero')).toHaveAttribute('data-entrance','ready');
 console.log('Intro frame gaps (ms)',await page.evaluate(()=>{const a=(window as any).introGaps as number[];return {frames:a.length,max:Math.max(...a),over50:a.filter(n=>n>50).length};}));
 const ticket=page.locator('.hero-card--2 .artwork-ticket');await ticket.hover();
 await expect(page.locator('.interactive-cursor')).toHaveAttribute('data-active','');
 await page.waitForTimeout(300);
 const error=await page.evaluate(()=>{
  const points=Array.from(document.querySelectorAll('.hero-card--2 [data-cursor-corner]')).map(e=>e.getBoundingClientRect());
  const cursor=document.querySelector('.interactive-cursor')!.getBoundingClientRect();
  return Array.from(document.querySelectorAll('.interactive-cursor .cursor-corner')).map((el,i)=>{const m=new DOMMatrix(getComputedStyle(el).transform);return Math.hypot(cursor.x+m.e-points[i].x,cursor.y+m.f-points[i].y);});
 });expect(Math.max(...error)).toBeLessThan(4);
 await page.screenshot({path:'test-results/ticket-cursor.png'});
 await page.locator('.about-next').scrollIntoViewIfNeeded();await page.locator('.about-next [data-cursor-bound]').hover();
 await expect(page.locator('.interactive-cursor')).toHaveAttribute('data-active','');
 const award=page.locator('#journey-award-1');await award.locator('.journey-work-link').click();await award.locator('.journey-certificate').click();
 await page.locator('.journey-lightbox-close').hover();await expect(page.locator('dialog .interactive-cursor')).toHaveAttribute('data-visible','');
 await page.screenshot({path:'test-results/certificate-cursor.png'});
});
