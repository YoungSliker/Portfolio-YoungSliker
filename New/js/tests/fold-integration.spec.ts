import {test,expect} from '@playwright/test';
import {enterArchive} from './hero-helpers';
for(const width of [375,1440]) test(`fold text and journey magnets ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/Portfolio-YoungSliker/New/');await enterArchive(page);
 await expect(page.locator('#hero-title .fold-text')).toBeVisible();
 await page.waitForTimeout(1600);
 await page.screenshot({path:`test-results/fold-hero-${width}.png`});
 await page.locator('#journey-education').scrollIntoViewIfNeeded();
 await expect(page.locator('#journey-education .fold-text')).toHaveCount(2);
 await expect(page.locator('#journey-education .journey-tag-magnet')).toHaveCount(5);
 await page.waitForTimeout(2400);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`test-results/fold-journey-${width}.png`});
 await page.locator('#journey-education .journey-work-link').click();
 await expect(page.locator('#overview-education')).toBeVisible();
 expect(errors).toEqual([]);
});
