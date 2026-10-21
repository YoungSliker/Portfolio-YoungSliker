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
          .fromTo(section,{autoAlpha:0},{autoAlpha:1,duration:.03,ease:'none'},.38)
          // Individual translate leaves the loading animation's transforms intact.
          .fromTo('.hero-title-group,.hero-description,.hero-meta,.scroll-cue',{translate:'0px 0px'},{translate:'0px -64px',duration:.25,stagger:.025,ease:'power2.in'},0)
          .fromTo('.hero-card',{translate:'0px 0px'},{translate:(i:number)=>`${i%2?90:-90}px ${i<2?-65:65}px`,duration:.24,stagger:.025,ease:'power2.in'},.015)
          .fromTo(section.querySelectorAll('.about-chapter,.about-statement,.about-profile,.about-fields-heading,.about-flowing-fields'),
            {y:55,opacity:0,filter:'blur(8px)'},
            {y:0,opacity:1,filter:'blur(0px)',duration:.22,stagger:.045,ease:'power2.out'},.6);



      });
      return ()=>context.revert();
    });
    return ()=>media.revert();
  },[root]);
}
