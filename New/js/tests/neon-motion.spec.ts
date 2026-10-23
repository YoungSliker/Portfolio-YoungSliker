import {test,expect} from '@playwright/test';
import fs from 'node:fs';
test('neon motion has no held poses and joins seamlessly',async({page})=>{
 const css=fs.readFileSync('../css/journey-loading.css','utf8');
 await page.setContent(`<style>${css}</style><div class="journey-loading-lights"><span style="--n:0"><i></i></span></div>`);
 const result=await page.locator('i').evaluate(el=>{
  const animation=el.getAnimations({subtree:true}).find(a=>(a as CSSAnimation).animationName==='journey-switch')!;
  animation.pause();const samples:string[]=[];
  for(let time=0;time<=2400;time+=20){animation.currentTime=time;const s=getComputedStyle(el,'::after');samples.push(`${s.opacity}/${s.transform}`);}
  let longest=0,run=0;for(let i=1;i<samples.length;i++){run=samples[i]===samples[i-1]?run+1:0;longest=Math.max(longest,run);}
  return {longest,first:samples[0],last:samples.at(-1)};
 });
 expect(result.longest).toBeLessThan(4);
 expect(result.first).toBe(result.last);
});
