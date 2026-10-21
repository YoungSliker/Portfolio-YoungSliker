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
        const incoming=gsap.fromTo(section.querySelectorAll('.about-chapter,.about-statement,.about-profile'),
          {y:36,opacity:0,filter:'blur(6px)'},
          {y:0,opacity:1,filter:'blur(0px)',duration:.65,stagger:.12,ease:'power2.out',paused:true});
        // The page position must track scroll exactly; lag exposes a gap beneath the header.
        // Content plays in real time after the slit opens, independent of wheel direction.
        const reveal=gsap.timeline({scrollTrigger:{trigger:section,start:()=>section.offsetTop-innerHeight*.92,end:()=>section.offsetTop-headerHeight(),scrub:true,invalidateOnRefresh:true,onUpdate:self=>{
          document.body.toggleAttribute('data-about-transition',self.progress>0&&self.progress<1);
          if(self.progress>=.98)incoming.play();
          else if(self.progress<.2)incoming.pause(0);
        }}});
        ScrollTrigger.create({trigger:section,start:()=>section.offsetTop-headerHeight(),onEnter:()=>incoming.play(),onEnterBack:()=>incoming.play()});
        gsap.fromTo(section.querySelectorAll('.about-fields-heading,.about-flowing-fields'),
          {y:24,opacity:0},{y:0,opacity:1,duration:.6,stagger:.1,ease:'power2.out',scrollTrigger:{trigger:section.querySelector('.about-fields-heading'),start:'top 90%',toggleActions:'play none none none'}});
        // First blur and clear the outgoing scene; only then open the incoming page.
        reveal.fromTo('.hero-stage',{filter:'blur(0px)',opacity:1},{filter:'blur(16px)',opacity:0,duration:.34,ease:'power1.in'},0)
          .fromTo(section,{y:()=>-(innerHeight*.92-headerHeight())},{y:0,duration:1,ease:'none'},0)
          .fromTo(section,{clipPath:'inset(0 49.8% 0 49.8%)',filter:'blur(2px)'},{clipPath:'inset(0 0% 0 0%)',filter:'blur(0px)',duration:.6,ease:'power2.inOut'},.4)
          .fromTo(section,{autoAlpha:0},{autoAlpha:1,duration:.03,ease:'none'},.38)
          // Individual translate leaves the loading animation's transforms intact.
          .fromTo('.hero-title-group,.hero-description,.hero-meta,.scroll-cue',{translate:'0px 0px'},{translate:'0px -64px',duration:.25,stagger:.025,ease:'power2.in'},0)
          .fromTo('.hero-card',{translate:'0px 0px'},{translate:(i:number)=>`${i%2?90:-90}px ${i<2?-65:65}px`,duration:.24,stagger:.025,ease:'power2.in'},.015)
;



      });
      return ()=>{context.revert();document.body.removeAttribute('data-about-transition');};
    });
    return ()=>media.revert();
  },[root]);
}
