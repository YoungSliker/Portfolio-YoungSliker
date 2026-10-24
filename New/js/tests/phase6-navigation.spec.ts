import {test,expect} from '@playwright/test';
for(const width of [375,430,768,1440])test(`project deep link and scrolling at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/Portfolio-YoungSliker/New/?project=yanchage#works');
 const card=page.getByRole('region',{name:'作品概况'});await expect(card).toContainText('颜茶阁');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.reload();await expect(card).toContainText('颜茶阁');
 await page.getByRole('button',{name:'返回图谱 ×',exact:true}).click();await expect(card).toHaveCount(0);await expect(page).not.toHaveURL(/project=/);
 await page.goBack();await expect(card).toContainText('颜茶阁');
 await page.getByRole('button',{name:'返回图谱 ×',exact:true}).click();
 const before=await page.evaluate(()=>scrollY);await page.mouse.move(width/2,450);await page.mouse.wheel(0,600);await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before);
});
test('phone hierarchy opens all domains and supports going up',async({page})=>{
 await page.setViewportSize({width:375,height:812});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/Portfolio-YoungSliker/New/#works');
 const nav=page.getByRole('navigation',{name:'作品分层浏览'});await expect(nav).toBeVisible();
 await nav.getByRole('button',{name:'数字体验设计'}).click();await nav.getByRole('button',{name:/APP 设计/}).click();await nav.getByRole('button',{name:'颜茶阁'}).click();
 await expect(page.getByRole('region',{name:'作品概况'})).toBeVisible();await page.screenshot({path:'test-results/phase6-phone-detail.png'});
 await page.getByRole('button',{name:'返回图谱 ×',exact:true}).click();await nav.getByRole('button',{name:'返回分类'}).click();await nav.getByRole('button',{name:'返回领域'}).click();
 await nav.getByRole('button',{name:'AIGC设计'}).click();await nav.getByRole('button',{name:/视频/}).click();await nav.getByRole('button',{name:'跨画钓鱼'}).click();
 await page.getByRole('button',{name:'放大查看跨画钓鱼'}).click();await expect(page.locator('.graph-lightbox')).toBeVisible();await page.getByRole('button',{name:'关闭',exact:true}).click();
 await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
});
test('journey keeps overview local and explicitly locates the graph',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/Portfolio-YoungSliker/New/#journey');
 const row=page.locator('#journey-arti');await row.locator('.journey-work-link').click();await expect(row.locator('.journey-overview')).toBeVisible();await expect(page).toHaveURL(/#journey$/);
 await row.getByRole('link',{name:'在图谱中定位'}).click();await expect(page.getByRole('region',{name:'作品概况'})).toContainText('ARTI');
 await page.goBack();await expect(page).toHaveURL(/#journey$/);await expect(row.locator('.journey-overview')).toBeVisible();
});
