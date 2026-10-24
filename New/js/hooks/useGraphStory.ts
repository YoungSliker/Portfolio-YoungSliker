import {useEffect,type RefObject} from 'react';

/** Passive page scrolling; only update React when a domain boundary is crossed. */
export function useGraphStory(enabled:boolean,root:RefObject<HTMLDivElement|null>,stage:RefObject<HTMLDivElement|null>,onStage:(index:number)=>void,onExit:()=>void){
 useEffect(()=>{
  if(!enabled)return;
  let frame=0,previous=-1;
  const measure=()=>{
   frame=0;if(innerWidth<768||innerHeight<650){onExit();return;}
   if(!root.current||!stage.current)return;
   const top=parseFloat(getComputedStyle(stage.current).top)||0;
   const travel=Math.max(1,root.current.offsetHeight-stage.current.offsetHeight);
   const progress=Math.max(0,Math.min(.999,(top-root.current.getBoundingClientRect().top)/travel));
   const index=Math.floor(progress*3);
   if(index!==previous){previous=index;onStage(index);}
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure);};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);schedule();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
 },[enabled,root,stage,onStage,onExit]);
}
