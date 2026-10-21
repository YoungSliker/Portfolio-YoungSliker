import {test} from '@playwright/test';
for(const glass of [true,false])test(`startup probe glass=${glass}`,async({page})=>{
 await page.addInitScript(({glass})=>{
  if(!glass){const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:any,...args:any[]){return type==='webgl2'?null:(get as any).call(this,type,...args)} as any;}
  const gaps:number[]=[];let last=performance.now();const start=last;
  function frame(now:number){gaps.push(now-last);last=now;if(now-start<3500)requestAnimationFrame(frame);else (window as any).__startup=gaps;};requestAnimationFrame(frame);
 },{glass});
 await page.goto('/Portfolio-YoungSliker/New/');await page.waitForFunction(()=>(window as any).__startup);
 console.log({glass,...await page.evaluate(()=>{const gaps=(window as any).__startup as number[];return {worst:Math.round(Math.max(...gaps)),over50:gaps.filter(n=>n>50).length,frames:gaps.length}})});
});

