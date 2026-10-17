import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useHeroMotion(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (!root.current) return;
    const media = gsap.matchMedia();
    media.add({
      desktop:'(min-width: 768px) and (min-height: 521px)',
      mobile:'(max-width: 767px), (max-height: 520px)',
      reduced:'(prefers-reduced-motion: reduce)',
    }, context => {
      const { desktop, reduced } = context.conditions!;
      if (reduced) return;
      const select = gsap.utils.selector(root);
      const title = select('.hero-title-group');
      const cards = select('.hero-card');
      const timeline = gsap.timeline({
        defaults:{ease:'none'},
        scrollTrigger:{
          trigger:root.current,
          start:() => `top ${getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim()}`,
          end:'bottom bottom',
          scrub:true,
          invalidateOnRefresh:true,
        },
      });
      timeline.to(select('.scroll-cue'),{autoAlpha:0,y:-12,duration:.25},0)
        .to(select('.hero-description'),{autoAlpha:0,y:-35,duration:.32},0)
        .to(title,{yPercent:-65,scale:1.08,autoAlpha:0,duration:.65},0)
        .to(select('.hero-orbit'),{rotation:35,scale:1.25,opacity:.15,duration:1},0)
        .fromTo(select('.hero-bridge'),{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.4},.42);
      const directions = [[-1,-1],[1,-1],[-1,1],[1,1]];
      cards.forEach((card,index) => {
        const [x,y] = directions[index];
        timeline.to(card,{x:x*(desktop?180:70),y:y*(desktop?155:80),
          rotation:`+=${x*9}`,scale:desktop?.87:.92,autoAlpha:0,duration:.76},0);
      });
      return () => { timeline.kill(); };
    }, root);
    return () => media.revert();
  }, [root]);
}
