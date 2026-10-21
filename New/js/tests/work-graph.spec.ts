import {test,expect} from '@playwright/test';
import {graphGroups,graphWorks} from '../../data/graph';
const base='/Portfolio-YoungSliker/New/';
for(const width of [375,844,1440,1920]) test(`collapsed graph, branch toggle and content ${width}`,async({page})=>{
 await page.setViewportSize({width,height:width===844?390:900});await page.emulateMedia({reducedMotion:'reduce'});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'#works');
 const graph=page.locator('.work-graph');
 const node=(id:string)=>graph.locator(`.react-flow__node[data-id="${id}"] button`);
 const activate=async(id:string)=>{await node(id).focus();await page.keyboard.press('Enter');};
 await expect(graph.locator('.react-flow__node')).toHaveCount(4);
 await expect(node('root')).toHaveAccessibleName('我的作品');
 await graph.scrollIntoViewIfNeeded();await page.screenshot({path:`docs/screenshots/graph-collapsed-${width}.png`});
 await activate('aigc');await expect(graph.locator('.react-flow__node')).toHaveCount(10);
 await activate('aigc');await expect(graph.locator('.react-flow__node')).toHaveCount(4);
 for(const category of ['aigc','digital','visual']){
  await activate(category);
  for(const group of graphGroups.filter(g=>g.category===category)){
   if(group.id!=='scenes')await activate(group.id);
   for(const work of graphWorks.filter(w=>w.group===group.id)){
    await activate(work.id);
    const detail=graph.getByRole('region',{name:'作品概况'});await expect(detail.getByRole('heading')).toHaveText(work.title);
    if(work.pending)await expect(detail).toContainText('待加入');
    else await expect.poll(()=>detail.locator('img').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
    await page.keyboard.press('Escape');await expect(node(work.id)).toBeFocused();
   }
   if(group.id!=='scenes')await activate(group.id);
  }
  await activate(category);
 }
 await expect(graph.locator('.react-flow__node')).toHaveCount(4);
 await activate('root');await expect(graph.locator('.react-flow__node')).toHaveCount(16);
 await activate('root');await expect(graph.locator('.react-flow__node')).toHaveCount(4);
 await expect(graph.locator('.graph-breadcrumb,.graph-work-list')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
test('drag moves neighbors, date appears only on hover and reset collapses',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto(base+'#works');
 const graph=page.locator('.work-graph');await graph.locator('.graph-canvas').scrollIntoViewIfNeeded();
 await graph.getByRole('button',{name:'AIGC设计',exact:true}).click();
 const node=graph.locator('.react-flow__node[data-id="suiyuan"]');const neighbor=graph.locator('.react-flow__node[data-id="aigc"]');
 await expect(node.locator('.graph-date-tail')).toHaveCSS('opacity','0');await node.hover();await expect(node.locator('.graph-date-tail')).toHaveCSS('opacity','1');
 const before=await neighbor.getAttribute('style');const rect=await node.locator('.archive-node-disc').boundingBox();
 await page.mouse.move(rect!.x+rect!.width/2,rect!.y+rect!.height/2);await page.mouse.down();await page.mouse.move(rect!.x+rect!.width/2+65,rect!.y+rect!.height/2+50,{steps:12});await page.mouse.up();
 await expect(neighbor).not.toHaveAttribute('style',before!);
 await graph.getByRole('button',{name:'重置图谱',exact:true}).click();await expect(graph.locator('.react-flow__node')).toHaveCount(4);
});

test('video and image branches coexist without overlapping cards',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'#works');
 const graph=page.locator('.work-graph');
 for(const id of ['aigc','ai-video','ai-image']){const button=graph.locator(`.react-flow__node[data-id="${id}"] button`);await button.focus();await page.keyboard.press('Enter');}
 await graph.getByRole('button',{name:'适应画布',exact:true}).click();
 const boxes=await graph.locator('.react-flow__node').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}));
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];expect(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y).toBe(true);}
 await graph.locator('.graph-canvas').screenshot({path:'docs/screenshots/graph-video-image-spaced.png'});
});
