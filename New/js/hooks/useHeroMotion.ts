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
   const setTextOpacity=gsap.quickSetter(texts,'opacity');
   const setTextY=gsap.quickSetter(texts,'y','px');
   const cardSetters=cards.map(card=>({x:gsap.quickSetter(card,'x','px'),y:gsap.quickSetter(card,'y','px'),rotation:gsap.quickSetter(card,'rotation','deg'),scale:gsap.quickSetter(card,'scale'),opacity:gsap.quickSetter(card,'opacity')}));
   const update=()=>{
    const p=state.p,grow=smooth(phase(p,0,.55)),reveal=smooth(phase(p,.55,.9));
    const dotY=height/2+(y-height/2)*grow;
    const r=3+(radius-3)*grow;
    landing.style.clipPath=p>=.9?'none':`circle(${p<.55?0:radius+reveal*Math.hypot(width,height)}px at ${x}px ${y}px)`;
    landing.inert=p<.95;opening.inert=complete;opening.style.visibility=p>=.9?'hidden':'visible';
    el.dataset.progress=p.toFixed(4);el.dataset.scene=p===1?'archive':p<.55?'dot':'reveal';
    aperture.style.transform=`translate3d(${x-radius}px,${dotY-radius}px,0) scale(${r/radius})`;
    aperture.style.opacity=p<.55?'1':'0';
    aperture.style.background=grow>.9?'#eeeae3':'#fff';
    const entry=smooth(phase(p,.62,.88));setTextOpacity(entry);setTextY(20*(1-entry));
    cards.forEach((card,i)=>{const t=smooth(phase(p,.64+i*.02,.86+i*.02));const set=cardSetters[i];set.x((i%2?1:-1)*width*.15*(1-t));set.y((i<2?-1:1)*height*.2*(1-t));set.rotation(rotations[i]+(i%2?1:-1)*12*(1-t));set.scale(.85+.15*t);set.opacity(t);});
   };
   const measure=()=>{width=stage.clientWidth;height=stage.clientHeight;x=orbit.offsetLeft+orbit.offsetWidth/2;y=orbit.offsetTop+orbit.offsetHeight/2;radius=Math.max(1,orbit.offsetWidth/2);aperture.style.width=aperture.style.height=`${radius*2}px`;aperture.style.left=aperture.style.top='0px';update();};
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
