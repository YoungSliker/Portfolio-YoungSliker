import {test,expect} from '@playwright/test';
test('legacy return restores expanded graph and selected work',async({page,context})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/Portfolio-YoungSliker/New/#works');
 for(const id of ['visual','logos','wanbu']){await page.locator(`.react-flow__node[data-id="${id}"] button`).focus();await page.keyboard.press('Enter');}
 const link=page.locator('.graph-detail-link');
 const [legacy]=await Promise.all([context.waitForEvent('page'),link.click()]);
 await legacy.getByText('← 返回新版 · 继续浏览',{exact:true}).click();
 await expect(legacy.locator('.react-flow__node[data-id="visual"] button')).toHaveAttribute('aria-expanded','true');
 await expect(legacy.locator('.react-flow__node[data-id="logos"] button')).toHaveAttribute('aria-expanded','true');
 await expect(legacy.getByRole('region',{name:'作品概况'})).toContainText('万部华严经塔');
 await legacy.getByRole('button',{name:'重置图谱',exact:true}).click();
 await expect(legacy.locator('.react-flow__node[data-id="logos"]')).toHaveCount(0);
});
