import {test,expect} from '@playwright/test';
test('legacy return restores the open overview and its screen position',async({page})=>{
 test.setTimeout(60000);await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/Portfolio-YoungSliker/New/#journey');
 const row=page.locator('#journey-suiyuan');await row.locator('.journey-work-link').click();
 await row.scrollIntoViewIfNeeded();
 const link=row.locator('.journey-detail-link');await link.scrollIntoViewIfNeeded();
 const before=await row.evaluate(el=>el.getBoundingClientRect().top);
 const images=await row.locator('.journey-overview img').evaluateAll(imgs=>imgs.map(img=>img.getAttribute('src')));
 await link.click();await expect(page).toHaveURL(/index.html\?work=suiyuan/);
 await page.getByRole('link',{name:'← 返回新版 · 继续浏览'}).click();
 await expect(row.locator('.journey-overview')).toBeVisible();
 await expect.poll(()=>row.evaluate(el=>el.getBoundingClientRect().top)).toBeCloseTo(before,0);
 expect(await row.locator('.journey-overview img').evaluateAll(imgs=>imgs.map(img=>img.getAttribute('src')))).toEqual(images);
});
