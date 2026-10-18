import {test,expect} from '@playwright/test';
const base='/Portfolio-YoungSliker/New/';
for(const width of [1440,375,844]) {
 test('white dot loading reveal at '+width,async({page})=>{
  await page.setViewportSize({width,height:width===844?390:width===375?812:900});
  await page.clock.install({time:new Date('2026-10-18T00:00:00Z')});
  await page.clock.pauseAt(new Date('2026-10-18T00:00:01Z'));
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  await expect(page.locator('.ascii-canvas,.ascii-atoms,.ascii-grid,.ascii-meteor')).toHaveCount(0);
  await expect(page.locator('.hero-landing')).toHaveAttribute('inert','');
  const initial=await page.locator('.intro-aperture').boundingBox();
  await page.clock.runFor(500);
  const grown=await page.locator('.intro-aperture').boundingBox();
  expect(grown!.width).toBeGreaterThan(initial!.width);
  await expect(page.locator('.intro-aperture')).toHaveCSS('filter','none');
  await page.screenshot({path:`docs/screenshots/loading-dot-${width}.png`});
  await page.clock.runFor(950);
  await expect(page.locator('#hero')).toHaveAttribute('data-entrance','ready');
  await expect(page.locator('.hero-landing')).not.toHaveAttribute('inert','');
  for(const card of await page.locator('.hero-card').all())await expect(card).toHaveCSS('opacity','1');
  expect(await page.evaluate(()=>scrollY)).toBe(0);
  await page.screenshot({path:`docs/screenshots/loading-archive-${width}.png`});
  await page.clock.resume();await page.locator('.scroll-cue').click();
  await expect(page.locator('#about h2')).toBeInViewport();
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await expect(page.locator('#hero')).toHaveAttribute('data-scene','archive');
  expect(errors).toEqual([]);
 });
}
test('reduced motion bypasses loading animation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base);
 await expect(page.locator('.loading-intro')).toBeHidden();
 await expect(page.locator('.hero-landing')).toHaveCSS('clip-path','none');
 await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'跳到主要内容'})).toBeFocused();
 await page.keyboard.press('Enter');await expect(page.locator('.site-header')).toBeVisible();
});
