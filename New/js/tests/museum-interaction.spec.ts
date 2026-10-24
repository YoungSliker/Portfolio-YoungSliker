import {test,expect} from '@playwright/test';
test('museum reader keeps content clicks local and all pages load',async({page})=>{
 await page.goto('/Portfolio-YoungSliker/index.html?work=visual-37');
 const dialog=page.locator('.vm797-dialog[open]');await expect(dialog).toBeVisible();
 const img=dialog.locator('.vm798-reader-image');
 await expect.poll(()=>img.evaluate((i:HTMLImageElement)=>i.naturalWidth)).toBeGreaterThan(0);
 await img.click({position:{x:30,y:40}});await expect(dialog).toBeVisible();
 await expect(dialog.locator('.vm798-region')).toHaveCount(0);
 await dialog.locator('.vm798-reader-tools button').last().click();
 await expect.poll(()=>img.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
 await expect(dialog).not.toContainText('图片暂未加载');
 await expect(dialog.locator('.vm797-close')).not.toBeFocused();
 await dialog.locator('.vm797-close').click();await expect(dialog).toHaveCount(0);
});
