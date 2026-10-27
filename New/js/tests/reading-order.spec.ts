import {test,expect} from '@playwright/test';
import {enterArchive} from './hero-helpers';

for(const width of [375,1440]) test(`visible text resolves within reading window ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/Portfolio-YoungSliker/New/');await enterArchive(page);
 for(const selector of ['#about-title','#journey-title','#journey-education','#works','.contact-methods']){
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(2400);
  const waiting=await page.locator('.blur-text').evaluateAll(els=>els.filter(el=>{
   const r=el.getBoundingClientRect();
   if(r.top<80||r.bottom>innerHeight-50||r.width===0)return false;
   for(let p=el.parentElement;p;p=p.parentElement){const s=getComputedStyle(p);if(p.inert||s.visibility==='hidden'||Number(s.opacity)<.1)return false;}
   return el.getAttribute('data-blur-phase')==='from' || [...el.querySelectorAll('span[aria-hidden]')].some(piece=>{
    const blur=getComputedStyle(piece).filter.match(/blur\(([\d.]+)px\)/);
    return blur && Number(blur[1])>.5;
   });
  }).map(el=>el.textContent?.slice(0,70)));
  expect(waiting,selector).toEqual([]);
 }
 expect(errors).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
