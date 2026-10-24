import {test,expect} from '@playwright/test';
test('browser back and forward restore graph navigation without leaving the page',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/Portfolio-YoungSliker/New/#works');
 const choose=async(id:string)=>page.locator(`.react-flow__node[data-id="${id}"] button`).dispatchEvent('click');
 await choose('digital');await choose('apps');await choose('yanchage');
 const card=page.getByRole('region',{name:'作品概况'});
 await expect(card.locator('.graph-phone-screen img')).toHaveAttribute('src',/闪屏页|%E9%97%AA/);
 await page.goBack();await expect(card).toHaveCount(0);await expect(page.locator('.react-flow__node[data-id="yanchage"]')).toBeVisible();
 await page.goBack();await expect(page.locator('.react-flow__node[data-id="yanchage"]')).toHaveCount(0);
 await page.goForward();await expect(page.locator('.react-flow__node[data-id="yanchage"]')).toBeVisible();
 await page.goForward();await expect(card).toContainText('颜茶阁');
 await card.screenshot({path:'test-results/yanchage-splash.png'});
});
