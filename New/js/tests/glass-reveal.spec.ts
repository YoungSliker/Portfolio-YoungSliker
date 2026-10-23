import {test,expect} from '@playwright/test';
test('glass is live during the reveal, before entrance completion',async({page})=>{
 await page.addInitScript(()=>{
  const draws:{progress:number;time:number}[]=[];(window as any).__glassRevealDraws=draws;
  const original=WebGL2RenderingContext.prototype.drawArrays;
  WebGL2RenderingContext.prototype.drawArrays=function(...args:Parameters<typeof original>){
   const hero=document.querySelector<HTMLElement>('#hero');
   if((this.canvas as HTMLCanvasElement).closest?.('.fluid-glass')&&hero?.dataset.entrance==='playing')draws.push({progress:Number(hero.dataset.progress),time:performance.now()});
   return original.apply(this,args);
  };
 });
 await page.goto('/Portfolio-YoungSliker/New/',{waitUntil:'domcontentloaded'});
 await page.mouse.move(800,400);
 await expect(page.locator('#hero')).toHaveAttribute('data-entrance','ready',{timeout:20000});
 const draws=await page.evaluate(()=>(window as any).__glassRevealDraws as {progress:number;time:number}[]);
 expect(draws.length).toBeGreaterThan(3);
 expect(draws[0].progress).toBeLessThan(.62);
 expect(draws.some(d=>d.progress>.7&&d.progress<.95)).toBe(true);
});
