import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function useAboutMotion(root:RefObject<HTMLElement|null>) {
  useLayoutEffect(()=>{
    const section=root.current;
    if(!section)return;
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      const context=gsap.context(()=>{
        gsap.to('.hero-stage',{y:-30,opacity:0,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom 20%',scrub:true}});
        section.querySelectorAll('[data-about-reveal]').forEach(element=>{
          gsap.fromTo(element,{y:32,opacity:.15},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:element,start:'top 98%',end:'top 76%',scrub:true}});
        });
      });
      return ()=>context.revert();
    });
    return ()=>media.revert();
  },[root]);
}
