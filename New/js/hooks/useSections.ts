import { useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sections, type SectionId } from '../../data/content';

gsap.registerPlugin(ScrollTrigger);

export function useSections() {
  const [active, setActive] = useState<SectionId>('hero');
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      for (const section of sections) {
        ScrollTrigger.create({
          trigger: `#${section.id}`,
          start:()=>document.getElementById(section.id)!.offsetTop-innerHeight*.45,
          end:()=>{const el=document.getElementById(section.id)!;return el.offsetTop+el.offsetHeight-innerHeight*.45;},
          onToggle: self => { if (self.isActive) setActive(section.id); },
        });
      }
    });
    // No scroll animation in Phase 1: content is readable without GSAP.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const resize = new ResizeObserver(refresh);
    resize.observe(document.querySelector('main')!);
    // On a hash URL React's sections may mount after the browser's initial anchor lookup.
    let anchorFrame = 0;
    const restoreAnchor = () => {
      cancelAnimationFrame(anchorFrame);
      const section = sections.find(item => `#${item.id}` === location.hash || (!location.hash&&new URLSearchParams(location.search).has('project')&&item.id==='works'));
      if (!section && location.hash.startsWith('#work=')) {
        anchorFrame = requestAnimationFrame(() => {
          const workId=location.hash.slice(6);
          const target=document.getElementById(`work-${workId}`)??document.getElementById('works');
          target?.scrollIntoView({ block: 'start', behavior: 'instant' });
          if(target?.id!=='works')target?.focus({preventScroll:true});
        });
        return;
      }
      if (section) anchorFrame = requestAnimationFrame(() => {
        const target=document.getElementById(section.id);
        const headerHeight=document.querySelector('.site-header')?.getBoundingClientRect().height??80;
        if(target)window.scrollTo({top:Math.max(0,target.offsetTop-(section.id==='hero'?0:headerHeight)),behavior:'instant'});
      });
    };
    restoreAnchor();
    let disposed=false,interacted=false;
    const markInteraction=()=>{interacted=true;};
    const inputEvents=['pointerdown','keydown','wheel','touchstart'];
    inputEvents.forEach(event=>window.addEventListener(event,markInteraction,{passive:true}));
    const initialHash=location.hash;
    document.fonts.ready.then(()=>{if(!disposed&&!interacted&&initialHash&&location.hash===initialHash){ScrollTrigger.refresh();restoreAnchor();}});
    const restoreOnLoad=()=>{if(!interacted)restoreAnchor();};
    window.addEventListener('load',restoreOnLoad);
    window.addEventListener('hashchange', restoreAnchor);
    return () => {
      disposed=true;
      cancelAnimationFrame(anchorFrame);
      window.removeEventListener('load',restoreOnLoad);
      inputEvents.forEach(event=>window.removeEventListener(event,markInteraction));
      window.removeEventListener('hashchange', restoreAnchor);
      window.removeEventListener('load', refresh);
      resize.disconnect(); context.revert();
    };
  }, []);
  return active;
}
