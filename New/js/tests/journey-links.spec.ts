import {test,expect} from '@playwright/test';
test('overview reshuffles, scoped cursor and legacy entry points',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/Portfolio-YoungSliker/New/#journey');
 const entry=page.locator('#journey-suiyuan'),toggle=entry.locator('.journey-work-link');
 await toggle.click();const first=await entry.locator('.journey-overview-images img').evaluateAll(imgs=>imgs.map(img=>img.getAttribute('src')).sort());
 await toggle.click();await toggle.click();
 const second=await entry.locator('.journey-overview-images img').evaluateAll(imgs=>imgs.map(img=>img.getAttribute('src')).sort());expect(second).not.toEqual(first);
 for(const id of ['mine','arti','lingsu','earthquake','suiyuan']){
  const row=page.locator(`#journey-${id}`);if(await row.locator('.journey-overview').count()===0)await row.locator('.journey-work-link').click();
  await expect(row.locator('.journey-detail-link')).toHaveAttribute('href',`/Portfolio-YoungSliker/index.html?work=${id}`);
 }
});
for(const [id,selector,title] of [['mine','#mine-eco','矿山'],['lingsu','#weiyuan','微元'],['suiyuan','#project-detail','绥远'],['arti','.drift-detail[open]','ARTI'],['earthquake','.drift-detail[open]','小马博士']]){
 test(`legacy direct entry ${id}`,async({page})=>{
  test.setTimeout(60000);
  await page.goto(`/Portfolio-YoungSliker/index.html?work=${id}`,{waitUntil:'domcontentloaded'});
  if(id==='mine'||id==='lingsu'){
   await expect.poll(()=>page.evaluate(()=>document.body.className),{timeout:30000}).toContain('is-project-open');
  }else await expect(page.locator(selector)).toBeVisible({timeout:30000});
  if(id==='arti'||id==='earthquake')await expect(page.locator('.drift-detail[open] h2')).toContainText(title);
 });
}
