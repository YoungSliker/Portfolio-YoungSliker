import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
const phase=(p:number,a:number,b:number)=>Math.max(0,Math.min(1,(p-a)/(b-a)));
const smooth=(p:number)=>p*p*(3-2*p);

export function useHeroMotion(root:RefObject<HTMLElement|null>) {
 useLayoutEffect(()=>{
  const el=root.current;if(!el)return;
  const get=(s:string)=>el.querySelector<HTMLElement>(s)!;
  const stage=get('.hero-stage'),landing=get('.hero-landing'),opening=get('.loading-intro');
  const aperture=get('.intro-aperture'),orbit=get('.hero-orbit');
  const cards=Array.from(el.querySelectorAll<HTMLElement>('.hero-card'));
  const texts=el.querySelectorAll('.hero-title-group,.hero-description,.hero-meta,.scroll-cue');
  const media=gsap.matchMedia();
  media.add({reduced:'(prefers-reduced-motion: reduce)',normal:'(prefers-reduced-motion: no-preference)'},context=>{
   const state={p:0};let width=0,height=0,x=0,y=0,radius=0,complete=false;
   const rotations=cards.map(card=>gsap.getProperty(card,'rotation') as number);
   const update=()=>{
    const p=state.p,grow=smooth(phase(p,0,.55)),reveal=smooth(phase(p,.55,.9));
    const dotY=height/2+(y-height/2)*grow;
    const r=3+(radius-3)*grow;
    landing.style.clipPath=p>=.9?'none':`circle(${p<.55?0:radius+reveal*Math.hypot(width,height)}px at ${x}px ${y}px)`;
    landing.inert=p<.95;opening.inert=complete;opening.style.visibility=p>=.9?'hidden':'visible';
    el.dataset.progress=p.toFixed(4);el.dataset.scene=p===1?'archive':p<.55?'dot':'reveal';
    aperture.style.left=`${x}px`;aperture.style.top=`${dotY}px`;
    aperture.style.width=aperture.style.height=`${r*2}px`;
    aperture.style.opacity=p<.55?'1':'0';
    aperture.style.background=grow>.9?'#eeeae3':'#fff';
    const entry=smooth(phase(p,.62,.88));gsap.set(texts,{opacity:entry,y:20*(1-entry)});
    cards.forEach((card,i)=>{const t=smooth(phase(p,.64+i*.02,.86+i*.02));gsap.set(card,{x:(i%2?1:-1)*width*.15*(1-t),y:(i<2?-1:1)*height*.2*(1-t),rotation:rotations[i]+(i%2?1:-1)*12*(1-t),scale:.85+.15*t,opacity:t});});
   };
   const measure=()=>{width=stage.clientWidth;height=stage.clientHeight;x=orbit.offsetLeft+orbit.offsetWidth/2;y=orbit.offsetTop+orbit.offsetHeight/2;radius=orbit.offsetWidth/2;update();};
   const finish=()=>{complete=true;state.p=1;update();el.dataset.entrance='ready';delete document.body.dataset.introEntering;};
   measure();
   const timeline=gsap.timeline({paused:true,onUpdate:update,onComplete:finish}).to(state,{p:1,duration:1.4,ease:'none'});
   const skip=()=>{timeline.pause();finish();};
   const onScroll=()=>{if(!complete&&scrollY>el.offsetTop+20)skip();};
   el.addEventListener('intro:skip',skip);window.addEventListener('scroll',onScroll,{passive:true});
   const observer=new ResizeObserver(measure);observer.observe(stage);
   if(context.conditions!.reduced||scrollY>el.offsetTop+20)finish();
   else {document.body.dataset.introEntering='true';el.dataset.entrance='playing';timeline.play();}
   return ()=>{timeline.kill();observer.disconnect();el.removeEventListener('intro:skip',skip);window.removeEventListener('scroll',onScroll);delete document.body.dataset.introEntering;gsap.set(cards,{clearProps:'transform,opacity'});};
  },el);
  return ()=>media.revert();
 },[root]);
}
