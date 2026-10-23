import {test,expect} from '@playwright/test';
const base='/Portfolio-YoungSliker/New/';
test('reload from About returns to the opening and prepares glass',async({page})=>{
 await page.goto(base+'#about');await expect(page.locator('#about h2')).toBeInViewport();
 await page.reload({waitUntil:'domcontentloaded'});await expect(page).toHaveURL(new RegExp('/New/$'));
 expect(await page.evaluate(()=>scrollY)).toBe(0);
 await expect(page.locator('#hero')).toHaveAttribute('data-entrance','ready',{timeout:20000});
 await expect(page.locator('.fluid-glass')).toHaveAttribute('data-glass-ready','true');
});
for(const width of [1440,375,844])test(`prepared opening at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:width===844?390:width===375?812:900});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await expect(page.locator('#hero')).toHaveAttribute('data-entrance','ready',{timeout:20000});
 await expect(page.locator('.hero-landing')).not.toHaveAttribute('inert','');
 await expect(page.locator('.loading-intro')).toBeHidden();
 for(const card of await page.locator('.hero-card').all())await expect(card).toHaveCSS('opacity','1');
 expect(await page.evaluate(()=>scrollY)).toBe(0);
 await page.locator('.scroll-cue').click();await expect(page.locator('#about h2')).toBeInViewport();
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await expect(page.locator('#hero')).toHaveAttribute('data-scene','archive');
 expect(errors).toEqual([]);
});
test('reduced motion bypasses loading animation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base);
 await expect(page.locator('.loading-intro')).toBeHidden();await expect(page.locator('.hero-landing')).toHaveCSS('clip-path','none');
 await expect(page.locator('.fluid-glass')).toHaveCount(0);
});
test('skip remains usable when WebGL is unavailable',async({page})=>{
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:any,...args:any[]){return type==='webgl2'?null:(original as any).call(this,type,...args)} as any;});
 await page.goto(base);await page.getByRole('button',{name:'跳过开场'}).click();
 await expect(page.locator('#hero')).toHaveAttribute('data-entrance','ready');
});
