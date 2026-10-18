import {test,expect} from '@playwright/test';
import {enterArchive} from './hero-helpers';
const base='/Portfolio-YoungSliker/New/';
for(const width of [1440,375]) {
 test('whole random ticket crumples and changes at '+width,async({page})=>{
  test.setTimeout(60000);
  await page.setViewportSize({width,height:900});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await enterArchive(page);await page.mouse.move(0,0);
  const random=page.locator('.random-artwork');
  await expect(random).toHaveAttribute('data-crumple','ready',{timeout:20000});
  const old=await random.getAttribute('data-work');
  const qr=await random.locator('.artwork-ticket__qr').getAttribute('src');
  const fixed=await page.locator('.hero-card:not(.hero-card--2) .tear-ticket__image').evaluateAll(imgs=>imgs.map(img=>(img as HTMLImageElement).src));
  await page.screenshot({path:`docs/screenshots/random-flat-${width}.png`});
  await expect(random).toHaveAttribute('data-changing','true',{timeout:12000});
  await expect.poll(async()=>Number(await random.locator('.paper-crumple').getAttribute('data-fold'))).toBeGreaterThan(.5);
  await page.screenshot({path:`docs/screenshots/random-crumpled-${width}.png`});
  await expect(random).not.toHaveAttribute('data-work',old!,{timeout:10000});
  await expect(random).toHaveAttribute('data-changing','false',{timeout:10000});
  await expect(random.locator('.artwork-ticket__qr')).not.toHaveAttribute('src',qr!);
  await page.screenshot({path:`docs/screenshots/random-next-${width}.png`});
  expect(await page.locator('.hero-card:not(.hero-card--2) .tear-ticket__image').evaluateAll(imgs=>imgs.map(img=>(img as HTMLImageElement).src))).toEqual(fixed);
  let next=await random.getAttribute('data-work');
  if(width===1440) {
    await expect(random).not.toHaveAttribute('data-work',next!,{timeout:9000});
    await expect(random).toHaveAttribute('data-changing','false');
    next=await random.getAttribute('data-work');
  }
  await page.locator('#about').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
  await page.waitForTimeout(5500);
  await expect(random).toHaveAttribute('data-work',next!);
  expect(errors).toEqual([]);
 });
}
test('hover pauses rotation and reduced motion swaps without WebGL',async({page})=>{
 test.setTimeout(30000);
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base);
 const random=page.locator('.random-artwork');await random.hover();
 const initial=await random.getAttribute('data-work');
 await page.waitForTimeout(5500);await expect(random).toHaveAttribute('data-work',initial!);
 await page.mouse.move(0,0);
 await expect(random).not.toHaveAttribute('data-work',initial!,{timeout:7000});
 await expect(random.locator('canvas')).toHaveCount(0);
});
test('changing motion preference during a fold restores the visible ticket',async({page})=>{
 test.setTimeout(30000);await page.goto(base);await enterArchive(page);await page.mouse.move(0,0);
 const random=page.locator('.random-artwork');
 await expect(random).toHaveAttribute('data-crumple','ready',{timeout:15000});
 await expect(random).toHaveAttribute('data-changing','true',{timeout:10000});
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(random).toHaveAttribute('data-changing','false');
 await expect(random.locator('.random-artwork__live')).toHaveCSS('opacity','1');
 await expect(random.locator('canvas')).toHaveCount(0);
});
