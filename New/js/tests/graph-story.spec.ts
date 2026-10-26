import {test,expect} from '@playwright/test';
for(const reduced of [true,false])test(`optional story steps and manual takeover reduced=${reduced}`,async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});await page.goto('/Portfolio-YoungSliker/New/#works');
 const graph=page.locator('.work-graph');await expect(graph).toHaveAttribute('data-mode','story');
 const before=await page.evaluate(()=>history.length);await expect(graph).toHaveAttribute('data-story-domain','aigc');
 const move=async(fraction:number)=>{await graph.evaluate((el,f)=>{const stage=el.querySelector('.graph-stage') as HTMLElement;const top=parseFloat(getComputedStyle(stage).top);window.scrollTo({top:scrollY+el.getBoundingClientRect().top-top+(el.clientHeight-stage.offsetHeight)*f,behavior:'instant'});},fraction);};
 await move(.48);await expect(graph).toHaveAttribute('data-story-domain','digital');await move(.82);await expect(graph).toHaveAttribute('data-story-domain','visual');
 await move(.1);await expect(graph).toHaveAttribute('data-story-domain','aigc');expect(await page.evaluate(()=>history.length)).toBe(before);
 await page.screenshot({path:`test-results/story-${reduced}.png`});
 await graph.locator('.react-flow__node[data-id="ai-video"] button').dispatchEvent('click');await expect(graph).toHaveAttribute('data-mode','explore');await expect(graph.locator('.react-flow__node[data-id="ai-extra-3"]')).toBeVisible();
 const old=await page.evaluate(()=>scrollY);await page.mouse.move(700,500);await page.mouse.wheel(0,700);await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(old);
});
test('story exits on resize and keeps touch hierarchy usable',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/Portfolio-YoungSliker/New/#works');await expect(page.locator('.work-graph')).toHaveAttribute('data-mode','story');
 await page.setViewportSize({width:375,height:812});await expect(page.locator('.work-graph')).toHaveAttribute('data-mode','explore');await expect(page.getByRole('navigation',{name:'作品分层浏览'})).toBeVisible();await expect(page.getByRole('button',{name:'随页浏览',exact:true})).toBeHidden();
});

test('drag and browser back release story control',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/Portfolio-YoungSliker/New/#works');
 const graph=page.locator('.work-graph');const start=page.getByRole('button',{name:'随页浏览',exact:true});await expect(graph).toHaveAttribute('data-mode','story');
 const node=graph.locator('.react-flow__node[data-id="aigc"]');await expect(node).toBeVisible();const box=await node.boundingBox();if(!box)throw new Error('Missing node');
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+70,box.y+box.height/2+40,{steps:12});await page.mouse.up();await expect(graph).toHaveAttribute('data-mode','explore');
 await start.click();await expect(graph).toHaveAttribute('data-mode','story');await page.goBack();await expect(graph).toHaveAttribute('data-mode','explore');
});
