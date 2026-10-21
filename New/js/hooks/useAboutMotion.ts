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
        const headerHeight=()=>document.querySelector('.site-header')?.getBoundingClientRect().height??80;
        const reveal=gsap.timeline({scrollTrigger:{trigger:section,start:()=>section.offsetTop-innerHeight*.92,end:()=>section.offsetTop-headerHeight(),scrub:.25,invalidateOnRefresh:true}});
        reveal.fromTo(section,{y:()=>-(innerHeight*.92-headerHeight())},{y:0,duration:1,ease:'none'},0)
          .fromTo(section,{clipPath:'inset(0 49.8% 0 49.8%)',filter:'blur(2px)'},{clipPath:'inset(0 0% 0 0%)',filter:'blur(0px)',duration:1,ease:'power2.inOut'},0)
          .fromTo(section,{autoAlpha:0},{autoAlpha:1,duration:.03,ease:'none'},0);


      });
      return ()=>context.revert();
    });
    return ()=>media.revert();
  },[root]);
}
