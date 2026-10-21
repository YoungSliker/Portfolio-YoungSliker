import type {Edge,Node} from '@xyflow/react';

/** Keep dragged nodes; place each new child near its live parent in an empty slot. */
export function placeExpandedNodes<N extends Node>(models:N[],previous:N[],edges:Edge[]):N[]{
 const old=new Map(previous.map(n=>[n.id,n]));
 const template=new Map(models.map(n=>[n.id,n]));
 const placed=new Map<string,N>();
 for(const model of models){const existing=old.get(model.id);if(existing)placed.set(model.id,{...existing,data:model.data});}
 const size=(n:N)=>({w:Math.max(n.measured?.width??0,190),h:Math.max(n.measured?.height??0,190)});
 for(const model of models){
  if(placed.has(model.id))continue;
  const parentId=edges.find(e=>e.target===model.id)?.source;
  const parent=parentId?placed.get(parentId):undefined;
  if(!parent){placed.set(model.id,model);continue;}
  const base=template.get(parent.id)!;
  const angle=Math.atan2(model.position.y-base.position.y,model.position.x-base.position.x);
  const own=size(model);
  let position={...parent.position},found=false;
  // Increasing rings guarantee enough room even for the full logo collection.
  for(let ring=0;ring<30&&!found;ring++){
   const radius=260+ring*160,slots=Math.ceil(2*Math.PI*radius/220);
   for(let step=0;step<slots;step++){
    const offset=step===0?0:Math.ceil(step/2)*(step%2?1:-1);
    const theta=angle+offset*2*Math.PI/slots;
    const point={x:parent.position.x+Math.cos(theta)*radius,y:parent.position.y+Math.sin(theta)*radius};
    const clear=[...placed.values()].every(other=>{const box=size(other);return Math.abs(point.x-other.position.x)>(own.w+box.w)/2+30||Math.abs(point.y-other.position.y)>(own.h+box.h)/2+30;});
    if(clear){position=point;found=true;break;}
   }
  }
  placed.set(model.id,{...model,position});
 }
 return models.map(model=>placed.get(model.id)!);
}
