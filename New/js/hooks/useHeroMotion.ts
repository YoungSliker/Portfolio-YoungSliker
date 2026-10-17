import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createAtlasScene, phase, smooth } from '../lib/atlasScene';

gsap.registerPlugin(ScrollTrigger);

// One reversible scroll track: roll -> zoom -> dot/orbit match -> archive reveal.
export function useHeroMotion(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const stage = element.querySelector<HTMLElement>('.hero-stage')!;
    const landing = element.querySelector<HTMLElement>('.hero-landing')!;
    const opening = element.querySelector<HTMLElement>('.ascii-opening')!;
    const aperture = element.querySelector<HTMLElement>('.intro-aperture')!;
    const orbit = element.querySelector<HTMLElement>('.hero-orbit')!;
    const cards = Array.from(element.querySelectorAll<HTMLElement>('.hero-card'));
    const copy = element.querySelector<HTMLElement>('.ascii-copy')!;
    const cue = element.querySelector<HTMLElement>('.ascii-scroll')!;
    const media = gsap.matchMedia();
    media.add({ reduced:'(prefers-reduced-motion: reduce)', normal:'(prefers-reduced-motion: no-preference)' }, context => {
      if (context.conditions!.reduced) {
        landing.inert = false; opening.inert = true;
        gsap.set(landing, { clipPath:'none' });
        element.dataset.scene = 'archive';
        return;
      }
      const scene = createAtlasScene(element.querySelector<HTMLCanvasElement>('canvas')!);
      let p = 0, width = 0, height = 0, x = 0, y = 0, radius = 0;
      let frame = 0, lastTime = 0, focusFrame = 0;
      let preservingFocusScroll = false;
      const rotations = cards.map(card => gsap.getProperty(card, 'rotation') as number);
      const update = () => {
        const grow = smooth(phase(p, .4, .58));
        const reveal = smooth(phase(p, .58, .78));
        const circle = p < .58 ? 0 : radius + reveal * Math.hypot(width, height);
        const dotRadius = 2 + grow * (radius - 2);
        element.dataset.scene = p < .19 ? 'roll' : p < .4 ? 'zoom' : p < .58 ? 'dot' : p < .78 ? 'reveal' : 'archive';
        element.dataset.progress = p.toFixed(4);
        landing.style.clipPath = p >= .78 ? 'none' : `circle(${circle}px at ${x}px ${y}px)`;
        landing.inert = p < .72;
        opening.inert = p > .1;
        opening.style.visibility = p >= .78 ? 'hidden' : 'visible';
        aperture.style.left = `${x}px`; aperture.style.top = `${y}px`;
        aperture.style.width = aperture.style.height = `${dotRadius * 2}px`;
        aperture.style.opacity = p >= .4 && p < .58 ? '1' : '0';
        aperture.style.background = grow > .9 ? '#eeeae3' : '#fffdf7';
        copy.style.opacity = String(1 - phase(p, .015, .13));
        cue.style.opacity = String(1 - phase(p, 0, .07));
        const entry = smooth(phase(p, .62, .79));
        const text = element.querySelectorAll('.hero-title-group,.hero-description,.hero-meta,.scroll-cue');
        gsap.set(text, { opacity:entry, y:24 * (1 - entry) });
        const directions = [[-1,-1],[1,-1],[-1,1],[1,1]];
        cards.forEach((card,i) => {
          const t = smooth(phase(p, .64 + i * .015, .79 + i * .015));
          gsap.set(card, { x:directions[i][0] * width * .22 * (1-t),
            y:directions[i][1] * height * .3 * (1-t),
            rotation:rotations[i] + directions[i][0] * 20 * (1-t), scale:.7 + .3*t, opacity:t });
        });
      };
      const measure = () => {
        width = stage.clientWidth; height = stage.clientHeight;
        x = orbit.offsetLeft + orbit.offsetWidth / 2;
        y = orbit.offsetTop + orbit.offsetHeight / 2;
        radius = orbit.offsetWidth / 2;
        scene.resize(width, height); update();
      };
      const trigger = ScrollTrigger.create({
        trigger:element, start:'top top', end:'bottom bottom', invalidateOnRefresh:true,
        onUpdate:self => { if (!preservingFocusScroll) { p = self.progress; update(); } },
        onRefresh:self => { p = self.progress; measure(); },
      });
      measure();
      // Native focus may scroll a transformed control back to its unpinned
      // layout position. Keep the already visible archive still while focusing.
      const keepFocusedControlInScene = (event: FocusEvent) => {
        if (p < .78 || !(event.target instanceof Element) || !event.target.closest('.tear-ticket')) return;
        const position = scrollY;
        preservingFocusScroll = true;
        cancelAnimationFrame(focusFrame);
        focusFrame = requestAnimationFrame(() => {
          window.scrollTo({top:position, behavior:'instant'});
          preservingFocusScroll = false;
          trigger.update();
        });
      };
      landing.addEventListener('focusin', keepFocusedControlInScene);
      const draw = (time: number) => {
        if (time - lastTime >= 33 && !document.hidden && p < .78 && element.getBoundingClientRect().bottom > 0) {
          scene.draw(p, time / 1000, y); lastTime = time;
        }
        frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
      const observer = new ResizeObserver(() => { trigger.refresh(); });
      observer.observe(stage);
      return () => {
        observer.disconnect(); cancelAnimationFrame(frame); cancelAnimationFrame(focusFrame);
        landing.removeEventListener('focusin', keepFocusedControlInScene);
        trigger.kill(); scene.dispose();
        landing.inert = false; opening.inert = false;
        gsap.set(cards, {clearProps:'transform,opacity'});
        gsap.set(element.querySelectorAll('.hero-title-group,.hero-description,.hero-meta,.scroll-cue'), {clearProps:'transform,opacity'});
      };
    }, element);
    return () => media.revert();
  }, [root]);
}
