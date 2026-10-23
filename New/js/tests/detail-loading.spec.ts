import {test,expect} from '@playwright/test';
test('detail loading panel is visible while waiting and clears when ready',async({page})=>{
 let release!:()=>void;const gate=new Promise<void>(resolve=>{release=resolve;});
 await page.route('**/js/journey-entry.js',async route=>{await gate;await route.continue();});
 await page.goto('/Portfolio-YoungSliker/index.html?work=mine',{waitUntil:'commit'});
 try{
  await expect(page.locator('#journey-loading')).toBeVisible();
  await expect(page.locator('.journey-loading-lights i')).toHaveCount(6);
  await page.locator('#journey-loading').screenshot({path:'test-results/detail-loading.png'});
 }finally{release();}
 await expect(page.locator('html')).not.toHaveAttribute('data-journey-direct','true',{timeout:30000});
 await expect(page.locator('#journey-loading')).not.toBeVisible();
 await expect(page.locator('#mine-eco-detail')).toBeVisible();
});
