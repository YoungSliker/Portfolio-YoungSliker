import {test,expect} from '@playwright/test';
test('overview sits on the right and award opens a dismissible image',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/Portfolio-YoungSliker/New/#journey');
 const mine=page.locator('#journey-mine');await mine.locator('.journey-work-link').click();
 const copy=await mine.locator('.journey-entry-copy').boundingBox(),panel=await mine.locator('.journey-overview').boundingBox();
 expect(panel!.x).toBeGreaterThan(copy!.x+copy!.width);expect(Math.abs(panel!.y-copy!.y)).toBeLessThan(2);
 const award=page.locator('#journey-award-1');await award.locator('.journey-work-link').click();
 const thumb=award.locator('.journey-certificate img');await expect(thumb).toBeVisible();expect(await thumb.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
 await award.locator('.journey-certificate').click();const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
 await expect(dialog).toHaveCSS('backdrop-filter','blur(12px)');
 await dialog.click({position:{x:5,y:500}});await expect(dialog).not.toBeVisible();
 await award.locator('.journey-certificate').click();await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
});

