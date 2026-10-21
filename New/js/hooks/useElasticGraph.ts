import {placeExpandedNodes} from '../lib/graphPlacement';
import {useCallback,useEffect,useRef,useState} from 'react';
import {applyNodeChanges,type Edge,type Node,type NodeChange} from '@xyflow/react';

/** Short, bounded spring simulation: idle graphs do no animation work. */
export function useElasticGraph<N extends Node>(models:N[],edges:Edge[],resetVersion:number){
 const [nodes,setNodes]=useState(models);
 const current=useRef(models);
 const frame=useRef(0);
 const previousReset=useRef(resetVersion);
 const spring=useRef<{
  pinned:string;dragging:boolean;ticks:number;quiet:number;last:number;
  homes:Map<string,{x:number;y:number}>;
  velocities:Map<string,{x:number;y:number}>;
  links:{source:string;target:string;length:number}[];
 }|null>(null);
 const commit=useCallback((next:N[])=>{current.current=next;setNodes(next);},[]);
 const stop=useCallback(()=>{cancelAnimationFrame(frame.current);frame.current=0;spring.current=null;},[]);
 useEffect(()=>{
  stop();
  const reset=previousReset.current!==resetVersion;
  previousReset.current=resetVersion;
  commit(reset?models:placeExpandedNodes(models,current.current,edges));
 },[models,edges,resetVersion,commit,stop]);
 useEffect(()=>{
  const hide=()=>{if(document.hidden)stop();};
  document.addEventListener('visibilitychange',hide);
  window.addEventListener('scroll',stop,{passive:true});
  return()=>{stop();document.removeEventListener('visibilitychange',hide);window.removeEventListener('scroll',stop);};
 },[stop]);
 const tick=useCallback(function animate(now:number){
  const state=spring.current;
  if(!state){frame.current=0;return;}
  if(now-state.last<15){frame.current=requestAnimationFrame(animate);return;}
  state.last=now;state.ticks++;
  const byId=new Map(current.current.map(n=>[n.id,n]));
  const forces=new Map(current.current.map(n=>[n.id,{x:0,y:0}]));
  for(const link of state.links){
   const a=byId.get(link.source),b=byId.get(link.target);
   if(!a||!b)continue;
   const dx=b.position.x-a.position.x,dy=b.position.y-a.position.y;
   const distance=Math.max(1,Math.hypot(dx,dy));
   const pull=(distance-link.length)*.018;
   const fx=dx/distance*pull,fy=dy/distance*pull;
   const af=forces.get(a.id)!,bf=forces.get(b.id)!;
   af.x+=fx;af.y+=fy;bf.x-=fx;bf.y-=fy;
  }
  // Prevent nearby discs from collapsing into one another.
  const list=current.current;
  for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
   const a=list[i],b=list[j],dx=b.position.x-a.position.x,dy=b.position.y-a.position.y;
   const d=Math.max(1,Math.hypot(dx,dy));
   if(d<155){
    const push=(155-d)*.025,fx=(dx||1)/d*push,fy=dy/d*push;
    forces.get(a.id)!.x-=fx;forces.get(a.id)!.y-=fy;
    forces.get(b.id)!.x+=fx;forces.get(b.id)!.y+=fy;
   }
  }
  let speed=0;
  const next=list.map(node=>{
   if(node.id===state.pinned)return node;
   const home=state.homes.get(node.id)!,force=forces.get(node.id)!;
   const velocity=state.velocities.get(node.id)!;
   velocity.x=(velocity.x+force.x+(home.x-node.position.x)*.003)*.78;
   velocity.y=(velocity.y+force.y+(home.y-node.position.y)*.003)*.78;
   speed=Math.max(speed,Math.hypot(velocity.x,velocity.y));
   if(Math.abs(velocity.x)+Math.abs(velocity.y)<.015)return node;
   return {...node,position:{x:node.position.x+velocity.x,y:node.position.y+velocity.y}};
  });
  commit(next);
  state.quiet=speed<.08?state.quiet+1:0;
  if(!state.dragging&&(state.quiet>8||state.ticks>240)){stop();return;}
  frame.current=requestAnimationFrame(animate);
 },[commit,stop]);
 const onNodeDragStart=useCallback((_:unknown,node:N)=>{
  stop();
  const homes=new Map(current.current.map(n=>[n.id,{...n.position}]));
  spring.current={
   pinned:node.id,dragging:true,ticks:0,quiet:0,last:0,homes,
   velocities:new Map(current.current.map(n=>[n.id,{x:0,y:0}])),
   links:edges.flatMap(e=>{
    const a=homes.get(e.source),b=homes.get(e.target);
    return a&&b?[{source:e.source,target:e.target,length:Math.hypot(b.x-a.x,b.y-a.y)}]:[];
   }),
  };
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)frame.current=requestAnimationFrame(tick);
 },[edges,stop,tick]);
 const onNodeDragStop=useCallback(()=>{
  if(spring.current){spring.current.dragging=false;spring.current.ticks=0;}
  if(!frame.current)stop();
 },[stop]);
 const onNodesChange=useCallback((changes:NodeChange<N>[])=>{
  commit(applyNodeChanges(changes,current.current));
 },[commit]);
 return {nodes,onNodesChange,onNodeDragStart,onNodeDragStop};
}
