import { test, expect } from '@playwright/test';
import { enterArchive } from './hero-helpers';
for (const width of [375, 844, 1440, 1920]) {
 test(`About reading and interaction ${width}`, async ({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:width===844?390:900});
  await page.goto('/Portfolio-YoungSliker/New/');await enterArchive(page);
  await page.locator('.scroll-cue').click();
  await expect(page.locator('#about h2')).toBeInViewport();
  await expect(page.locator('.site-header')).toBeVisible();
  await expect(page.locator('.reading-footer')).toContainText('02 / 06');
  await page.locator('.scroll-cue').evaluate(e=>(e as HTMLElement).blur());
  await page.screenshot({path:`docs/screenshots/phase2-about-top-${width}.png`});
  for(const id of ['aigc','digital','visual']) {
   const button=page.locator(`#field-${id}`);await button.focus();await page.keyboard.press('Enter');
   await expect(button).toHaveAttribute('aria-expanded','true');
   await expect(page.locator(`#field-panel-${id}`)).toBeVisible();
   await expect(page.locator('.about-field-body:visible')).toHaveCount(1);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`docs/screenshots/phase2-about-fields-${width}.png`});
  await page.getByRole('link',{name:'YoungSliker 返回封面'}).click();
  await expect(page.locator('.hero-stage')).toHaveCSS('opacity','1');
  await expect(page.locator('#hero')).toHaveAttribute('data-entrance','ready');
  expect(errors).toEqual([]);
 });
}
test('About reduced motion and works link',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/Portfolio-YoungSliker/New/#about');
 for(const item of await page.locator('[data-about-reveal]').all())await expect(item).toHaveCSS('opacity','1');
 await page.getByRole('link',{name:'浏览我的作品'}).click();
 await expect(page.locator('#works h2')).toBeInViewport();
});
