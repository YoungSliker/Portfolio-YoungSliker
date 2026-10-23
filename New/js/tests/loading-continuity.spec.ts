import {test,expect} from '@playwright/test';
test('glass draws before the slower homepage reveal begins',async({page})=>{
 test.setTimeout(35000);
 await page.addInitScript(()=>{
  (window as any).__entrance=[];
  new MutationObserver(()=>{
   const hero=document.querySelector<HTMLElement>('#hero');if(!hero)return;
   const list=(window as any).__entrance;
   if(list.at(-1)?.state!==hero.dataset.entrance)list.push({state:hero.dataset.entrance,glass:!!hero.querySelector('[data-glass-ready="true"]')});
  }).observe(document,{subtree:true,attributes:true,attributeFilter:['data-entrance']});
 });
 await page.goto('/Portfolio-YoungSliker/New/');
 await expect(page.locator('#hero')).toHaveAttribute('data-entrance','ready',{timeout:20000});
 const states=await page.evaluate(()=>(window as any).__entrance);
 expect(states.find((x:any)=>x.state==='preparing')).toBeTruthy();
 expect(states.find((x:any)=>x.state==='playing')?.glass).toBe(true);
 await expect(page.locator('.fluid-glass')).toHaveAttribute('data-glass-ready','true');
});
test('visual detail close resumes the original work menu',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/Portfolio-YoungSliker/index.html?work=visual-8');
 const dialog=page.locator('.vm797-dialog[open]');await expect(dialog).toBeVisible();
 await dialog.getByRole('button',{name:'关闭大图'}).click();
 await expect(page.locator('.vm791-title')).toContainText('敕勒川');
 await expect(page.locator('.vm805-preview')).toBeVisible();
 await page.screenshot({path:'test-results/visual-return-restored.png'});
 await page.locator('.vm792-action').click();await expect(page.locator('.vm797-dialog[open]')).toBeVisible();
});
test('neon cycle staggers evenly across the entire period',async({page})=>{
 await page.goto('/Portfolio-YoungSliker/index.html?work=mine');
 const animation=await page.locator('.journey-loading-lights i').evaluateAll(items=>items.map(item=>{const s=getComputedStyle(item,'::after');return {duration:parseFloat(s.animationDuration),delay:parseFloat(s.animationDelay)};}));
 expect(animation).toHaveLength(6);for(let i=1;i<6;i++)expect(animation[i].delay-animation[i-1].delay).toBeCloseTo(animation[0].duration/6);
});
