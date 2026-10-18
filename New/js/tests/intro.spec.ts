import { test, expect } from '@playwright/test';
const base='/Portfolio-YoungSliker/New/';
for(const width of [1440,375,844]) {
 test('automatic 5s opening and archive at '+width,async({page})=>{
  await page.setViewportSize({width,height:width===844?390:width===375?812:900});
  await page.clock.install({time:new Date('2026-10-18T00:00:00Z')});
  await page.clock.pauseAt(new Date('2026-10-18T00:00:01Z'));
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  await expect(page.locator('.ascii-canvas')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.ascii-copy')).toHaveCount(0);
  await expect(page.locator('.ascii-scroll')).toHaveCount(0);
  await expect(page.locator('.ascii-atom')).toHaveCount(3);
  await expect(page.locator('.hero-landing')).toHaveAttribute('inert','');
  await page.clock.runFor(694);
  await expect(page.locator('#hero')).toHaveAttribute('data-scene','meteor');
  await page.screenshot({path:`docs/screenshots/auto-figure-${width}.png`});
  await page.clock.runFor(556);
  await expect(page.locator('#hero')).toHaveAttribute('data-scene','impact');
  await expect(page.locator('.ascii-atoms')).toHaveAttribute('data-active','true');
  await page.screenshot({path:`docs/screenshots/auto-impact-${width}.png`});
  await page.clock.runFor(1944);
  await expect(page.locator('#hero')).toHaveAttribute('data-scene','dot');
  await expect(page.locator('.ascii-canvas')).toHaveCSS('filter','none');
  await page.screenshot({path:`docs/screenshots/auto-dot-${width}.png`});
  await page.clock.runFor(1875);
  await expect(page.locator('#hero')).toHaveAttribute('data-entrance','ready');
  await expect(page.locator('.hero-landing')).not.toHaveAttribute('inert','');
  await expect(page.locator('.hero-title-group')).toHaveCSS('opacity','1');
  for(const card of await page.locator('.hero-card').all())await expect(card).toHaveCSS('opacity','1');
  expect(await page.evaluate(()=>scrollY)).toBe(0);
  expect(await page.locator('#hero').evaluate(e=>e.clientHeight<=innerHeight)).toBe(true);
  await expect(page.locator('.ascii-atoms')).toHaveAttribute('data-active','false');
  await page.screenshot({path:`docs/screenshots/auto-archive-${width}.png`});
  await page.clock.resume();
  await page.locator('.scroll-cue').click();
  await expect(page.locator('#about h2')).toBeInViewport();
  await expect(page.locator('.site-header')).toBeVisible();
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await expect(page.locator('#hero')).toHaveAttribute('data-scene','archive');
  expect(errors).toEqual([]);
 });
}
test('reduced motion opens archive immediately',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base);
 await expect(page.locator('.ascii-opening')).toBeHidden();
 await expect(page.locator('.hero-landing')).toHaveCSS('clip-path','none');
 await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'跳到主要内容'})).toBeFocused();
 await page.keyboard.press('Enter');await expect(page.locator('.site-header')).toBeVisible();
});


