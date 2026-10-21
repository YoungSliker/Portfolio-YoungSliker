import { test, expect } from '@playwright/test';
import { enterArchive } from './hero-helpers';
for (const width of [375, 844, 1440, 1920]) {
 test(`About reading and interaction ${width}`, async ({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:width===844?390:900});
  await page.goto('/Portfolio-YoungSliker/New/');await enterArchive(page);
  await page.locator('.scroll-cue').click();
  await expect(page.locator('#about h2')).toBeInViewport();
  await expect(page.locator('.site-header')).toBeVisible();
  await expect(page.locator('.reading-footer')).toContainText('02 / 06');
  await page.locator('.scroll-cue').evaluate(e=>(e as HTMLElement).blur());
  await page.screenshot({path:`docs/screenshots/phase2-about-top-${width}.png`});
  const menu=page.getByRole('navigation',{name:'创作领域'});
  for(const [label,text] of [['AIGC设计','场景的构建'],['数字体验设计','从观看走向参与'],['视觉传达设计','清晰的形态']]) {
   const button=menu.getByRole('button',{name:label,exact:true});await button.focus();await page.keyboard.press('Enter');
   await expect(page.locator('.about-field-summary')).toContainText(text);
   await expect(menu.locator('.flowing-menu__float')).toBeVisible();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`docs/screenshots/phase2-about-fields-${width}.png`});
  await page.getByRole('link',{name:'YoungSliker 返回封面'}).click();
  await expect(page.locator('.hero-stage')).toHaveCSS('opacity','1');
  await expect(page.locator('#hero')).toHaveAttribute('data-entrance','ready');
  expect(errors).toEqual([]);
 });
}
test('About reduced motion and works link',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/Portfolio-YoungSliker/New/#about');
 for(const item of await page.locator('[data-about-reveal]').all())await expect(item).toHaveCSS('opacity','1');
 await page.getByRole('link',{name:'浏览我的作品'}).click();
 await expect(page.locator('#works h2')).toBeInViewport();
});

test('flowing menu reverses colors and carries project images on hover',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/Portfolio-YoungSliker/New/#about');
 const menu=page.getByRole('navigation',{name:'创作领域'});
 await expect(menu).toHaveCSS('background-color','rgb(238, 234, 227)');
 for(const label of ['AIGC设计','数字体验设计','视觉传达设计']) {
  await menu.getByRole('button',{name:label,exact:true}).hover();
  const band=menu.locator('.flowing-menu__float');
  await expect(band).toBeVisible();
  await expect(band).toHaveCSS('background-color','rgb(23, 23, 23)');
  await expect(band).toHaveCSS('color','rgb(250, 249, 246)');
  await expect(band.locator('.flowing-menu__image').first()).toHaveCSS('background-image',/webp/);
 }
 await menu.screenshot({path:'docs/screenshots/about-flowing-hover.png'});
 await page.mouse.move(0,0);
 await expect(menu.locator('.flowing-menu__float')).toBeHidden();
});

test('development StrictMode menu starts after cleanup and remount',async({page})=>{
 await page.goto('http://127.0.0.1:5173/Portfolio-YoungSliker/New/#about');
 const menu=page.getByRole('navigation',{name:'创作领域'});
 await menu.getByRole('button',{name:'AIGC设计',exact:true}).hover();
 await expect(menu.locator('.flowing-menu__float')).toBeVisible();
 const track=menu.locator('.flowing-menu__float-layer').first().locator('.flowing-menu__track');
 const transform=await track.getAttribute('style');await expect(track).not.toHaveAttribute('style',transform!);
});

test('About opens from a central slit as the page scrolls',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/Portfolio-YoungSliker/New/');
 await page.getByRole('button',{name:'跳过开场'}).click();
 const portal=page.locator('#about');
 await page.evaluate(()=>scrollTo({top:document.getElementById('about')!.offsetTop-innerHeight*.9,behavior:'instant'}));
 await expect(portal).not.toHaveCSS('clip-path','none');
 await page.waitForTimeout(450);const initial=await portal.evaluate(e=>getComputedStyle(e).clipPath);
 await page.screenshot({path:'docs/screenshots/about-slit-start.png'});
 await page.evaluate(()=>scrollTo({top:document.getElementById('about')!.offsetTop-innerHeight*.5,behavior:'instant'}));
 await page.waitForTimeout(450);await page.screenshot({path:'docs/screenshots/about-slit-middle.png'});
 await page.evaluate(()=>scrollTo({top:document.getElementById('about')!.offsetTop-80,behavior:'instant'}));
 await expect(portal).toHaveCSS('clip-path','inset(0px 0%)');
 expect(await portal.evaluate(e=>getComputedStyle(e).clipPath)).not.toBe(initial);
 await page.screenshot({path:'docs/screenshots/about-slit-open.png'});
});

test('outgoing home clears before the About slit appears',async({page})=>{
 await page.goto('/Portfolio-YoungSliker/New/');await page.getByRole('button',{name:'跳过开场'}).click();
 const scrub=async(progress:number)=>{await page.evaluate(p=>{const about=document.getElementById('about')!,h=document.querySelector('.site-header')!.getBoundingClientRect().height;const start=about.offsetTop-innerHeight*.92;const end=about.offsetTop-h;scrollTo({top:start+(end-start)*p,behavior:'instant'});},progress);};
 await scrub(.2);await expect(page.locator('.hero-stage')).not.toHaveCSS('filter','blur(0px)');await expect(page.locator('#about')).toHaveCSS('visibility','hidden');
 await scrub(.36);await expect(page.locator('.hero-stage')).toHaveCSS('opacity','0');await expect(page.locator('#about')).toHaveCSS('visibility','hidden');
 await scrub(.7);await expect(page.locator('#about')).toHaveCSS('visibility','visible');await expect(page.locator('.hero-stage')).toHaveCSS('opacity','0');
 await page.screenshot({path:'docs/screenshots/about-cleared-before-opening.png'});
});
