import {test,expect} from '@playwright/test';
const base='/Portfolio-YoungSliker/New/';
for(const width of [375,844,1440,1920]) {
 test(`timeline navigation, reading and reverse scroll ${width}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:width===844?390:900});
  await page.goto(base+'#journey');
  await expect(page.locator('#journey h2')).toBeInViewport();
  await expect(page.locator('.journey-entry')).toHaveCount(9);
  await expect(page.locator('.journey-review')).toHaveCount(0);
  const nav=page.getByRole('navigation',{name:'经历年份'});
  for(const [year,id] of [['2025','suiyuan'],['2024','arti'],['2022','award-0'],['2021','education']]) {
   const button=nav.getByRole('button',{name:new RegExp(year)});
   await button.focus();await page.keyboard.press('Enter');
   await expect(page.locator(`#journey-${id}`)).toHaveAttribute('data-current','true');
   await expect(nav.locator('[aria-current="step"]')).toHaveCount(1);
   await expect(page.locator('.journey-entry[data-current="true"]')).toHaveCount(1);
  }
  await page.screenshot({path:`docs/screenshots/phase3-journey-${width}.png`});
  await page.locator('#journey-internship').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
  await expect(page.locator('#journey-internship')).toHaveAttribute('data-current','true');
  await page.locator('#journey-lingsu').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
  await expect(page.locator('#journey-lingsu')).toHaveAttribute('data-current','true');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
 });
}
test('project targets, browser history and resume facts',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(base+'#journey');
 await expect(page.locator('.journey-awards')).toContainText('第一届亚洲大学生创意设计展');
 await expect(page.locator('.journey-awards')).not.toContainText('第二届');
 await expect(page.locator('#journey-suiyuan')).toContainText('2025.01 — 2025.07');
 await expect(page.locator('.journey-awards')).toContainText('2022.09');
 await expect(page.locator('.journey-awards')).toContainText('2024.06');
 for(const id of ['mine','lingsu','suiyuan','arti','internship','earthquake']) {
  const button=page.locator(`#journey-${id} .journey-work-link`);await button.click();
  await expect(page.locator(`#overview-${id}`)).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded','true');
  await expect(page).toHaveURL(/#journey$/);
  await expect(page.locator('.journey-overview')).toHaveCount(1);
  await button.click();await expect(page.locator('.journey-overview')).toHaveCount(0);
 }
});
