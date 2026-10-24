import {test,expect} from '@playwright/test';
test('journey progress grows downwards and retreats upwards',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/Portfolio-YoungSliker/New/#journey');
 await expect(page.locator('[data-timeline-entry]').first()).toBeVisible();
 const progress=()=>page.locator('#journey').evaluate(el=>Number((el as HTMLElement).style.getPropertyValue('--journey-progress')));
 const move=async(fraction:number)=>{await page.evaluate(f=>{const items=[...document.querySelectorAll('[data-timeline-entry]')];const first=items[0].getBoundingClientRect().top+scrollY;const last=items.at(-1)!.getBoundingClientRect().top+scrollY;window.scrollTo({top:first+(last-first)*f-Math.max(150,innerHeight*.38),behavior:'instant'});},fraction);};
 await move(.6);await expect.poll(progress).toBeCloseTo(.6,1);
 await move(.2);await expect.poll(progress).toBeCloseTo(.2,1);
 await move(1);await expect.poll(progress).toBeCloseTo(1,1);
 await move(0);await expect.poll(progress).toBeCloseTo(0,1);
});
