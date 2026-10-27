import {test,expect} from '@playwright/test';

for (const width of [1440,375]) test(`glass handoff preserves canvas size ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto('/Portfolio-YoungSliker/New/');
 const host=page.locator('.hero-glass-title');
 await expect(host).toHaveAttribute('data-title-ready','true');
 const samples=await page.evaluate(async()=>{
  const host=document.querySelector('.hero-glass-title')!;
  const canvas=host.querySelector('canvas')!;
  const samples:{w:number;h:number;complete:string|null}[]=[];
  const start=performance.now();
  await new Promise<void>(resolve=>{function frame(){
   samples.push({w:canvas.width,h:canvas.height,complete:host.getAttribute('data-fold-complete')});
   if(performance.now()-start<2400)requestAnimationFrame(frame);else resolve();
  }requestAnimationFrame(frame)});
  return samples;
 });
 expect(samples.some(s=>s.complete==='false')).toBe(true);
 expect(samples.some(s=>s.complete==='true')).toBe(true);
 expect(new Set(samples.map(s=>`${s.w}x${s.h}`)).size).toBe(1);
 await expect(host.locator('.fluid-glass')).toHaveAttribute('data-text-rendered','true');
});
