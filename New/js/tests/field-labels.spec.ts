import {test,expect} from '@playwright/test';
import {enterArchive} from './hero-helpers';
for(const width of [375,1440])test(`field labels enter and remain interactive ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto('/Portfolio-YoungSliker/New/');await enterArchive(page);
 await page.locator('.scroll-cue').click();
 await page.waitForTimeout(1000);
 const labels=page.locator('.flowing-menu__label-text .blur-text');
 await expect(labels).toHaveCount(3);
 for(const label of await labels.all()){
  await label.scrollIntoViewIfNeeded();
  await expect(label).toHaveAttribute('data-blur-phase','in');
  await expect(label.locator('[aria-hidden=true]').last()).toHaveCSS('filter','blur(0px)');
 }
 const button=page.getByRole('button',{name:'数字体验设计',exact:true});
 await button.click();
 await expect(page.locator('.about-field-summary')).toContainText('从观看走向参与');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
