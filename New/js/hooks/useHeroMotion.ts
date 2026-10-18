import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { createAtlasScene, ballPose, phase, smooth } from '../lib/atlasScene';

// One automatic 5-second opening, independent of scrolling.
export function useHeroMotion(root: RefObject<HTMLElement | null>) {
 useLayoutEffect(()=>{
  const el=root.current;if(!el)return;
  const get=(s:string)=>el.querySelector<HTMLElement>(s)!;
  const stage=get('.hero-stage'),landing=get('.hero-landing'),opening=get('.ascii-opening');
  const aperture=get('.intro-aperture'),orbit=get('.hero-orbit'),grid=get('.ascii-grid'),atoms=get('.ascii-atoms'),meteor=get('.ascii-meteor');
  const canvas=el.querySelector<HTMLCanvasElement>('.ascii-canvas')!;
  const cards=Array.from(el.querySelectorAll<HTMLElement>('.hero-card'));
  const texts=el.querySelectorAll('.hero-title-group,.hero-description,.hero-meta,.scroll-cue');
  const media=gsap.matchMedia();
  media.add({reduced:'(prefers-reduced-motion: reduce)',normal:'(prefers-reduced-motion: no-preference)'},context=>{
   const state={p:0,figure:0,ball:0,spark:0,spiral:0,atoms:0,grid:0,flight:0};
   let width=0,height=0,x=0,y=0,radius=0,frame=0,disposed=false,complete=false;
   const rotations=cards.map(card=>gsap.getProperty(card,'rotation') as number);
   const scene=context.conditions!.reduced?null:createAtlasScene(canvas);
   const update=()=>{
    const p=state.p,grow=smooth(phase(p,.24,.58));
    const pose=ballPose(width,height,p,{x,y,radius});
    const reveal=smooth(phase(p,.58,.78));
    landing.style.clipPath=p>=.78?'none':`circle(${p<.58?0:radius+reveal*Math.hypot(width,height)}px at ${x}px ${y}px)`;
    landing.inert=p<.87;opening.inert=complete;opening.style.visibility=p>=.78?'hidden':'visible';
    el.dataset.progress=p.toFixed(4);
    el.dataset.scene=p===1?'archive':p>=.58?'reveal':p>=.36?'dot':p>=.26?'fade':p>0?'roll':state.spark?'impact':'meteor';
    aperture.style.left=`${pose.dotX}px`;aperture.style.top=`${pose.dotY}px`;
    aperture.style.width=aperture.style.height=`${pose.dotRadius*2}px`;
    aperture.style.opacity=p<.58?String(state.spark):'0';
    aperture.style.background=grow>.9?'#eeeae3':'#fffdf7';
    const impact=ballPose(width,height,0),startX=width*.96,startY=-height*.08;
    gsap.set(meteor,{x:startX+(impact.dotX-startX)*state.flight,y:startY+(impact.dotY-startY)*state.flight});
    meteor.querySelector<HTMLElement>('i')!.style.transform=`rotate(${Math.atan2(startY-impact.dotY,startX-impact.dotX)*180/Math.PI}deg)`;
    const fade=1-smooth(phase(p,0,.3));
    atoms.style.opacity=String(state.atoms*fade);atoms.dataset.active=String(state.atoms>0&&fade>0&&!complete);
    grid.style.opacity=String(state.grid*(1-phase(p,.32,.58)));
    opening.dataset.gridActive=String(state.grid>0&&p<.58&&!complete);
    gsap.set(texts,{opacity:smooth(phase(p,.62,.79)),y:24*(1-smooth(phase(p,.62,.79)))});
    cards.forEach((card,i)=>{const t=smooth(phase(p,.64+i*.025,.79+i*.025));gsap.set(card,{x:(i%2?1:-1)*width*.22*(1-t),y:(i<2?-1:1)*height*.3*(1-t),rotation:rotations[i]+(i%2?1:-1)*20*(1-t),scale:.7+.3*t,opacity:t});});
    scene?.draw(p,performance.now()/1000,{x,y,radius},state);
   };
   const measure=()=>{width=stage.clientWidth;height=stage.clientHeight;x=orbit.offsetLeft+orbit.offsetWidth/2;y=orbit.offsetTop+orbit.offsetHeight/2;radius=orbit.offsetWidth/2;scene?.resize(width,height);update();};
   const finish=()=>{complete=true;state.p=1;state.spark=1;update();el.dataset.entrance='ready';delete document.body.dataset.introEntering;cancelAnimationFrame(frame);};
   measure();
   const timeline=gsap.timeline({paused:true,onUpdate:update,onComplete:finish});
   const skip=()=>{timeline.pause();finish();};
   const onScroll=()=>{if(!complete&&scrollY>el.offsetTop+20)skip();};
   el.addEventListener('intro:skip',skip);window.addEventListener('scroll',onScroll,{passive:true});
   const observer=new ResizeObserver(measure);observer.observe(stage);
   if(context.conditions!.reduced||scrollY>el.offsetTop+20)finish();
   else {
    document.body.dataset.introEntering='true';el.dataset.entrance='loading';
    timeline.set(meteor,{opacity:1},.05)
     .to(state,{flight:1,duration:.7,ease:'power2.in'},.05)
     .to(state,{figure:1,duration:.25},.35)
     .set(state,{ball:1,spark:1},.75)
     .to(meteor,{opacity:0,duration:.15},.75)
     .to(state,{spiral:1,duration:.5,ease:'none'},.75)
     .to(state,{atoms:1,grid:1,duration:.25},.75)
     // One uninterrupted progress ramp; roll, fade and spark growth overlap.
     .to(state,{p:1,duration:2.65,ease:'none'},.95);
    const draw=()=>{if(disposed||complete)return;if(!document.hidden)scene?.draw(state.p,performance.now()/1000,{x,y,radius},state);frame=requestAnimationFrame(draw);};
    scene!.ready.then(()=>{if(disposed||complete)return;el.dataset.entrance='playing';timeline.timeScale(3.6/5).play();frame=requestAnimationFrame(draw);});
   }
   return ()=>{disposed=true;timeline.kill();cancelAnimationFrame(frame);observer.disconnect();scene?.dispose();el.removeEventListener('intro:skip',skip);window.removeEventListener('scroll',onScroll);delete document.body.dataset.introEntering;gsap.set(cards,{clearProps:'transform,opacity'});};
  },el);
  return ()=>media.revert();
 },[root]);
}

