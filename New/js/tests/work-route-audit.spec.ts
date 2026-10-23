import {test,expect} from '@playwright/test';
import routes from '../../data/work-routes.json' with {type:'json'};
for(const route of [...new Set(Object.values(routes))])test(`catalog route ${route}`,async({page})=>{
 test.setTimeout(45000);await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(`/Portfolio-YoungSliker/index.html?work=${route}`,{waitUntil:'domcontentloaded'});
 const selector=route.startsWith('visual-')?'.vm797-dialog':route.startsWith('app-')?'.ap-viewer':route.startsWith('media-')?'.mg-detail':'.drift-detail';
 const detail=page.locator(`${selector}[open]`);await expect(detail).toBeVisible({timeout:25000});
 await expect(page.locator('html')).not.toHaveAttribute('data-journey-direct',/.+/);
 const images=detail.locator('img:visible');
 if(await images.count())await expect.poll(()=>images.first().evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0),{timeout:12000}).toBe(true);
 await expect(detail.locator('.journey-return-link')).toBeVisible();
});
