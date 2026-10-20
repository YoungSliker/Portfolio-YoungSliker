import {test,expect} from '@playwright/test';
test('continuous node drag frame sample',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/Portfolio-YoungSliker/New/#works');
 const graph=page.locator('.work-graph');
 await expect(graph).toBeVisible();
 await graph.locator('.graph-canvas').scrollIntoViewIfNeeded();
 const node=graph.locator('.react-flow__node[data-id="aigc"]');
 const box=await node.locator('.archive-node-disc').boundingBox();
 await page.evaluate(()=>{
  const samples:number[]=[];let previous=performance.now();
  (window as any).__graphSample={samples,active:true};
  const frame=(now:number)=>{samples.push(now-previous);previous=now;if((window as any).__graphSample.active)requestAnimationFrame(frame);};
  requestAnimationFrame(frame);
 });
 await page.mouse.move(box!.x+box!.width/2,box!.y+box!.height/2);
 await page.mouse.down();
 for(let i=0;i<90;i++)await page.mouse.move(box!.x+box!.width/2+Math.sin(i/15)*90,box!.y+box!.height/2+i);
 await page.mouse.up();
 const stats=await page.evaluate(()=>{
  const sample=(window as any).__graphSample;sample.active=false;
  const frames=sample.samples.slice(2).sort((a:number,b:number)=>a-b);
  return {frames:frames.length,median:frames[Math.floor(frames.length*.5)],p95:frames[Math.floor(frames.length*.95)],over50:frames.filter((n:number)=>n>50).length};
 });
 console.log('drag frame sample',JSON.stringify(stats));
 expect(stats.frames).toBeGreaterThan(5);
 await expect(graph.getByRole('region',{name:'作品概况'})).toHaveCount(0);
});
