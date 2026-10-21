import {test,expect} from '@playwright/test';
import {graphWorks} from '../../data/graph';
const base='/Portfolio-YoungSliker/New/';
for(const width of [375,844,1440,1920]){
 test(`graph branches, overview, reset and page scroll ${width}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:width===844?390:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base+'#works');
  const graph=page.locator('.work-graph');
  await expect(graph).toBeVisible();
  await graph.locator('.graph-canvas').scrollIntoViewIfNeeded();
  await page.screenshot({path:`docs/screenshots/phase4-radial-${width}.png`});
  const nav=graph.getByRole('navigation',{name:'作品图谱分类'});
  const paths=[
    ['AIGC设计','场景与叙事','scenes'],
    ['数字体验设计','新媒体交互','media'],
    ['数字体验设计','APP 设计','apps'],
    ['视觉传达设计','品牌设计','brand'],
    ['视觉传达设计','标志设计','logos'],
  ];
  for(const [category,label,id] of paths){
    await nav.getByRole('button',{name:category,exact:true}).click();
    if(id!=='scenes') await graph.locator('.graph-collection').getByRole('button',{name:new RegExp(label)}).click();
    const list=graph.locator('.graph-work-list');
    const works=graphWorks.filter(w=>w.group===id);
    await expect(list.getByRole('button')).toHaveCount(works.length);
    for(const work of works){
      const button=list.getByRole('button',{name:work.title,exact:true});
      await button.focus();await page.keyboard.press('Enter');
      const detail=graph.getByRole('region',{name:'作品概况'});
      await expect(detail.getByRole('heading')).toHaveText(work.title);
      await expect(detail).toBeFocused();
      await detail.scrollIntoViewIfNeeded();
      await expect.poll(()=>detail.locator('img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
      await page.keyboard.press('Escape');
      await expect(button).toBeFocused();
    }
  }
  await graph.getByRole('button',{name:'重置图谱',exact:true}).click();
  await expect(graph.locator('.graph-work-list button')).toHaveCount(3);
  await expect(graph.locator('.react-flow__node')).toHaveCount(7);
  // Exercise the actual graph nodes, not only the accessible navigation.
  await graph.locator('.react-flow__node[data-id="aigc"] button').click();
  await graph.locator('.react-flow__node[data-id="suiyuan"] button').click();
  await expect(graph.getByRole('region',{name:'作品概况'})).toContainText('绥远方志');
  await graph.getByRole('button',{name:'适应画布',exact:true}).click();
  const output=graph.getByLabel('图谱缩放比例');
  const before=await output.textContent();
  await graph.getByRole('button',{name:'放大图谱',exact:true}).click();
  await expect(output).not.toHaveText(before!);
  await graph.getByRole('button',{name:'适应画布',exact:true}).click();
  await graph.locator('.graph-canvas').scrollIntoViewIfNeeded();
  await page.screenshot({path:`docs/screenshots/phase4-graph-${width}.png`});
  const rect=await graph.locator('.graph-canvas').boundingBox();
  await page.mouse.move(rect!.x+10,Math.min(rect!.y+100,width===844?250:650));
  const scroll=await page.evaluate(()=>scrollY);
  const scale=await output.textContent();
  await page.mouse.wheel(0,220);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(scroll+50);
  await expect(output).toHaveText(scale!);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
 });
}
test('radial nodes drag directly, connections follow and reset restores positions',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto(base);
 await expect(page.locator('.work-graph')).toHaveCount(0);
 await page.locator('#works').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
 const graph=page.locator('.work-graph');
 await expect(graph).toBeVisible();
 await graph.locator('.graph-canvas').scrollIntoViewIfNeeded();
 const viewport=graph.locator('.react-flow__viewport');
 const pane=graph.locator('.react-flow__pane');
 await expect(pane).toHaveClass(/draggable/);
 const node=graph.locator('.react-flow__node[data-id="suiyuan"]');
 const original=await node.getAttribute('style');
 const neighbor=graph.locator('.react-flow__node[data-id="aigc"]');
 const neighborBefore=await neighbor.getAttribute('style');
 const edge=graph.locator('.react-flow__edge[data-id="scenes-suiyuan"] path').first();
 const path=await edge.getAttribute('d');
 const box=await node.locator('.archive-node-disc').boundingBox();
 await page.mouse.move(box!.x+box!.width/2,box!.y+box!.height/2);
 await page.mouse.down();await page.mouse.move(box!.x+box!.width/2+95,box!.y+box!.height/2+60,{steps:12});await page.mouse.up();
 await expect(node).not.toHaveAttribute('style',original!);
 await expect(neighbor).not.toHaveAttribute('style',neighborBefore!);
 await expect.poll(async()=>{
  const before=await neighbor.getAttribute('style');
  await page.waitForTimeout(150);
  return (await neighbor.getAttribute('style'))===before;
 },{timeout:7000}).toBe(true);
 await expect(edge).not.toHaveAttribute('d',path!);
 await expect(graph.getByRole('region',{name:'作品概况'})).toHaveCount(0);
 const previous=await viewport.getAttribute('style');
 const rect=await graph.locator('.graph-canvas').boundingBox();
 await page.mouse.move(rect!.x+30,rect!.y+100);
 await page.mouse.down();await page.mouse.move(rect!.x+160,rect!.y+160,{steps:10});await page.mouse.up();
 await expect(viewport).not.toHaveAttribute('style',previous!);
 const dragged=await viewport.getAttribute('style');
 await graph.getByRole('button',{name:'重置图谱',exact:true}).click();
 await expect(node).toHaveAttribute('style',original!);
 await expect(viewport).not.toHaveAttribute('style',dragged!);
 await graph.getByRole('navigation').getByRole('button',{name:'数字体验设计',exact:true}).click();
 await graph.locator('.graph-collection').getByRole('button',{name:/APP 设计/}).click();
 await graph.locator('.graph-work-list').getByRole('button',{name:'学伴',exact:true}).click();
 await expect(graph.getByRole('region',{name:'作品概况'})).toContainText('学伴');
});

test('all domains preserves expanded branches and AIGC starts open',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(base+'#works');
 const graph=page.locator('.work-graph'),nav=graph.getByRole('navigation');
 await expect(nav.getByRole('button',{name:'AIGC设计',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(graph.locator('.graph-work-list button')).toHaveCount(3);
 for(const [category,group] of [['数字体验设计','APP 设计'],['视觉传达设计','标志设计']]){
  await nav.getByRole('button',{name:category,exact:true}).click();
  await graph.locator('.graph-collection').getByRole('button',{name:new RegExp(group)}).click();
 }
 const count=await graph.locator('.react-flow__node').count();
 await nav.getByRole('button',{name:'全部领域',exact:true}).click();
 await expect(graph.locator('.react-flow__node')).toHaveCount(count);
 await expect(graph.locator('.react-flow__node[data-id="xueban"]')).toBeAttached();
 await expect(graph.locator('.react-flow__node[data-id="wanbu"]')).toBeAttached();
});
