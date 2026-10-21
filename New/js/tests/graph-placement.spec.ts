import {test,expect} from '@playwright/test';
import {placeExpandedNodes} from '../lib/graphPlacement';
import type {Node,Edge} from '@xyflow/react';
const node=(id:string,x:number,y:number):Node=>({id,position:{x,y},data:{}});
test('expansion follows moved parent and avoids concurrent branches',()=>{
 const parents=[node('videos',0,0),node('images',100,-100)];
 const children=Array.from({length:15},(_,i)=>node(`work-${i}`,-200,i*20));
 const models=[...parents,...children];const edges:Edge[]=children.map((n,i)=>({id:n.id,source:i<7?'videos':'images',target:n.id}));
 const moved=[node('videos',2600,1800),node('images',2700,1700)];
 const first=placeExpandedNodes(models.slice(0,9),moved,edges);
 const full=placeExpandedNodes(models,first,edges);
 for(const a of full)for(const b of full){if(a.id===b.id||parents.some(p=>p.id===a.id)&&parents.some(p=>p.id===b.id))continue;expect(Math.abs(a.position.x-b.position.x)>219||Math.abs(a.position.y-b.position.y)>219).toBe(true);}
 for(const child of full.slice(2)){expect(child.position.x).toBeGreaterThan(1400);expect(child.position.y).toBeGreaterThan(600);}
 for(const existing of first)expect(full.find(n=>n.id===existing.id)!.position).toEqual(existing.position);
 const reopened=placeExpandedNodes(models,moved,edges);expect(reopened[2].position.x).toBeGreaterThan(1400);
});
