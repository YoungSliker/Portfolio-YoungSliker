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
        const headerHeight=()=>document.querySelector('.site-header')?.getBoundingClientRect().height??80;
        const reveal=gsap.timeline({scrollTrigger:{trigger:section,start:()=>section.offsetTop-innerHeight*.92,end:()=>section.offsetTop-headerHeight(),scrub:.25,invalidateOnRefresh:true}});
        // First blur and clear the outgoing scene; only then open the incoming page.
        reveal.fromTo('.hero-stage',{filter:'blur(0px)',opacity:1},{filter:'blur(16px)',opacity:0,duration:.34,ease:'power1.in'},0)
          .fromTo(section,{y:()=>-(innerHeight*.92-headerHeight())},{y:0,duration:1,ease:'none'},0)
          .fromTo(section,{clipPath:'inset(0 49.8% 0 49.8%)',filter:'blur(2px)'},{clipPath:'inset(0 0% 0 0%)',filter:'blur(0px)',duration:.6,ease:'power2.inOut'},.4)
          .fromTo(section,{autoAlpha:0},{autoAlpha:1,duration:.03,ease:'none'},.38);



      });
      return ()=>context.revert();
    });
    return ()=>media.revert();
  },[root]);
}
