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
          trigger: `#${section.id}`, start: 'top 45%', end: 'bottom 45%',
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
      const section = sections.find(item => `#${item.id}` === location.hash);
      if (section) anchorFrame = requestAnimationFrame(() => {
        document.getElementById(section.id)?.scrollIntoView({ block: 'start', behavior: 'instant' });
      });
    };
    restoreAnchor();
    window.addEventListener('hashchange', restoreAnchor);
    return () => {
      cancelAnimationFrame(anchorFrame);
      window.removeEventListener('hashchange', restoreAnchor);
      window.removeEventListener('load', refresh);
      resize.disconnect(); context.revert();
    };
  }, []);
  return active;
}
