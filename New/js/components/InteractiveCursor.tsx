import {useEffect,useRef} from 'react';

export function InteractiveCursor(){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=ref.current!;if(!matchMedia('(pointer:fine)').matches)return;
  let x=0,y=0,visible=false,raf=0;
  const paint=()=>{
   raf=0;el.toggleAttribute('data-visible',visible);if(!visible)return;
   el.style.left=`${x}px`;el.style.top=`${y}px`;
   const hit=document.elementFromPoint(x,y);
   const ticket=hit?.closest('.artwork-ticket');
   const target=ticket||hit?.closest('a[href],button:not(:disabled),[role="button"]');
   const scoped=target?.querySelector('[data-cursor-bound]')||target;
   el.toggleAttribute('data-active',!!scoped);
   const markers=ticket?.querySelectorAll('[data-cursor-corner]');
   const rect=scoped?.getBoundingClientRect();
   const points=markers?.length===4?Array.from(markers).map(m=>{const r=m.getBoundingClientRect();return {x:r.x,y:r.y};}):rect?[{x:rect.left,y:rect.top},{x:rect.right,y:rect.top},{x:rect.right,y:rect.bottom},{x:rect.left,y:rect.bottom}]:[{x:x-24,y:y-24},{x:x+24,y:y-24},{x:x+24,y:y+24},{x:x-24,y:y+24}];
   el.querySelectorAll<HTMLElement>('.cursor-corner').forEach((corner,i)=>{
    const p=points[i],next=points[(i+1)%4],prev=points[(i+3)%4];
    const unit=(q:{x:number;y:number})=>{const d=Math.hypot(q.x-p.x,q.y-p.y)||1;return {x:(q.x-p.x)/d,y:(q.y-p.y)/d};};
    const u=unit(next),v=unit(prev);
    corner.style.transform=`matrix(${u.x},${u.y},${v.x},${v.y},${p.x-x},${p.y-y})`;
   });
   if(ticket)raf=requestAnimationFrame(paint);
  };
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(paint);};
  const move=(e:PointerEvent)=>{x=e.clientX;y=e.clientY;visible=true;document.documentElement.classList.add('portfolio-cursor-enabled');schedule();};
  const leave=()=>{visible=false;el.removeAttribute('data-visible');document.documentElement.classList.remove('portfolio-cursor-enabled');};
  const press=()=>el.setAttribute('data-pressed','');const release=()=>el.removeAttribute('data-pressed');
  document.addEventListener('pointerdown',press);document.addEventListener('pointerup',release);
  document.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',leave);window.addEventListener('blur',leave);window.addEventListener('scroll',schedule,true);
  return()=>{cancelAnimationFrame(raf);leave();document.removeEventListener('pointerdown',press);document.removeEventListener('pointerup',release);document.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',leave);window.removeEventListener('blur',leave);window.removeEventListener('scroll',schedule,true);};
 },[]);
 return <div ref={ref} className="interactive-cursor" aria-hidden="true"><i className="interactive-cursor__dot"/><span className="cursor-spin">{[0,1,2,3].map(i=><i key={i} className="cursor-corner"/>)}</span></div>;
}
