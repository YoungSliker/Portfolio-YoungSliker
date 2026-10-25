import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
for(const [name,width,height] of [['desktop',1440,900],['tablet',1024,768],['mobile',390,844]] as const){
 test(`record real ${name} walkthrough`,async({browser})=>{
  test.skip(process.env.RECORD_DEMOS!=='1','Explicit recording run only');
  test.setTimeout(90000);
  const context=await browser.newContext({viewport:{width,height},recordVideo:{dir:'test-results/recordings',size:{width,height}},isMobile:name==='mobile',hasTouch:name!=='desktop'});
  const page=await context.newPage();const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/Portfolio-YoungSliker/New/');
  await expect(page.locator('#hero')).toHaveAttribute('data-entrance','ready',{timeout:20000});await page.waitForTimeout(1500);
  await fs.mkdir('assets/images/showcase',{recursive:true});await page.screenshot({path:`assets/images/showcase/${name}.png`});
  await page.locator('.scroll-cue').click();await page.waitForTimeout(1600);
  await page.locator('#journey-arti').scrollIntoViewIfNeeded();await page.locator('#journey-arti .journey-work-link').click();await page.waitForTimeout(1800);
  await page.locator('#journey-arti').getByRole('link',{name:'在图谱中定位'}).click();await expect(page.getByRole('region',{name:'作品概况'})).toContainText('ARTI');await page.waitForTimeout(1800);
  await page.getByRole('button',{name:'返回图谱 ×',exact:true}).click();
  if(name==='mobile'){
   const nav=page.getByRole('navigation',{name:'作品分层浏览'});await nav.scrollIntoViewIfNeeded();
   if(await nav.getByRole('button',{name:/返回分类/}).count())await nav.getByRole('button',{name:/返回分类/}).click();
   await nav.getByRole('button',{name:/返回领域/}).click();await nav.getByRole('button',{name:'数字体验设计',exact:true}).click();await nav.getByRole('button',{name:/APP 设计/}).click();await nav.getByRole('button',{name:'颜茶阁',exact:true}).click();
  }else{
   await page.getByRole('button',{name:'随页浏览',exact:true}).click();await page.waitForTimeout(1200);
   await page.locator('.work-graph').evaluate(el=>{const stage=el.querySelector('.graph-stage') as HTMLElement;window.scrollTo({top:scrollY+el.getBoundingClientRect().top-90+(el.clientHeight-stage.offsetHeight)*.5,behavior:'smooth'});});await page.waitForTimeout(1800);
   await page.getByRole('button',{name:'自由探索',exact:true}).click();
  }
  await page.waitForTimeout(1800);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
  await context.close();await page.video()!.saveAs(`test-results/${name}-demo.webm`);
 });
}
