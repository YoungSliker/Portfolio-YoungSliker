import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createAtlasScene, ballPose, phase, smooth } from '../lib/atlasScene';

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
    const canvas = element.querySelector<HTMLCanvasElement>('.ascii-canvas')!;
    const grid = element.querySelector<HTMLElement>('.ascii-grid')!;
    const meteor = element.querySelector<HTMLElement>('.ascii-meteor')!;
    const media = gsap.matchMedia();
    media.add({ reduced:'(prefers-reduced-motion: reduce)', normal:'(prefers-reduced-motion: no-preference)' }, context => {
      if (context.conditions!.reduced) {
        landing.inert = false; opening.inert = true;
        gsap.set(landing, { clipPath:'none' });
        element.dataset.scene = 'archive';
        return;
      }
      const scene = createAtlasScene(canvas);
      const entranceState = {figure:0,spark:0,copy:0,cue:0,grid:0};
      let entrance: gsap.core.Timeline | undefined;
      let p = 0, width = 0, height = 0, x = 0, y = 0, radius = 0;
      let frame = 0, lastTime = 0, focusFrame = 0;
      let preservingFocusScroll = false;
      const rotations = cards.map(card => gsap.getProperty(card, 'rotation') as number);
      const update = () => {
        const grow = smooth(phase(p, .36, .58));
        const pose = ballPose(width,height,p,{x,y,radius});
        const {dotX,dotY,dotRadius} = pose;
        const reveal = smooth(phase(p, .58, .78));
        const circle = p < .58 ? 0 : radius + reveal * Math.hypot(width, height);
        element.dataset.scene = p < .26 ? 'roll' : p < .32 ? 'settled' : p < .58 ? 'dot' : p < .78 ? 'reveal' : 'archive';
        element.dataset.progress = p.toFixed(4);
        landing.style.clipPath = p >= .78 ? 'none' : `circle(${circle}px at ${x}px ${y}px)`;
        landing.inert = p < .72;
        opening.inert = p > .1;
        opening.style.visibility = p >= .78 ? 'hidden' : 'visible';
        aperture.style.left = `${dotX}px`; aperture.style.top = `${dotY}px`;
        aperture.style.width = aperture.style.height = `${dotRadius * 2}px`;
        aperture.style.opacity = p < .58 ? String(entranceState.spark) : '0';
        aperture.style.background = grow > .9 ? '#eeeae3' : '#fffdf7';
        canvas.style.opacity = String(entranceState.figure);
        copy.style.opacity = String(entranceState.copy * (1 - phase(p, .015, .13)));
        copy.style.translate = `0 ${18 * (1 - entranceState.copy)}px`;
        cue.style.opacity = String(entranceState.cue * (1 - phase(p, 0, .07)));
        cue.inert = entranceState.cue < .95;
        const gridOpacity = entranceState.grid * (1 - phase(p,.32,.58));
        grid.style.opacity = String(gridOpacity);
        opening.dataset.gridActive = String(gridOpacity > .01 && p < .58);
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
        const impact = ballPose(width,height,0);
        meteor.querySelector<HTMLElement>('i')!.style.transform = `rotate(${Math.atan2(-height * .08 - impact.dotY,width * .96 - impact.dotX) * 180 / Math.PI}deg)`;
        scene.resize(width, height); update();
      };
      const trigger = ScrollTrigger.create({
        trigger:element, start:'top top', end:'bottom bottom', invalidateOnRefresh:true,
        onUpdate:self => {
          if (!preservingFocusScroll) {
            p = self.progress;
            if (p > .002 && entrance && entrance.progress() < 1) entrance.progress(1);
            update();
          }
        },
        onRefresh:self => { p = self.progress; measure(); },
      });
      measure();
      document.body.dataset.introEntering = 'true';
      element.dataset.entrance = 'meteor';
      entrance = gsap.timeline({
        onUpdate:update,
        onComplete:() => { element.dataset.entrance = 'ready'; delete document.body.dataset.introEntering; },
      });
      entrance.fromTo(meteor, {x:width * .96,y:-height * .08,opacity:0},
        {x:()=>ballPose(width,height,0).dotX,y:()=>ballPose(width,height,0).dotY,opacity:1,duration:.9,ease:'power2.in'},.15)
        .set(entranceState,{spark:1},1.05)
        .to(meteor,{opacity:0,duration:.2},1.05)
        .to(entranceState,{figure:1,duration:.65,ease:'power2.out',onStart:()=>{element.dataset.entrance='figure';}},1.1)
        .to(entranceState,{copy:1,duration:.55,ease:'power2.out',onStart:()=>{element.dataset.entrance='copy';}},1.8)
        .to(entranceState,{grid:1,duration:.55,onStart:()=>{element.dataset.entrance='grid';}},2.4)
        .to(entranceState,{cue:1,duration:.4,onStart:()=>{element.dataset.entrance='cue';}},2.95);
      if (p > .002) entrance.progress(1);
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
          scene.draw(p, time / 1000, {x,y,radius}); lastTime = time;
        }
        frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
      const observer = new ResizeObserver(() => { trigger.refresh(); });
      observer.observe(stage);
      return () => {
        observer.disconnect(); cancelAnimationFrame(frame); cancelAnimationFrame(focusFrame);
        landing.removeEventListener('focusin', keepFocusedControlInScene);
        entrance?.kill(); delete document.body.dataset.introEntering;
        canvas.style.removeProperty('filter'); aperture.style.removeProperty('filter');
        trigger.kill(); scene.dispose();
        landing.inert = false; opening.inert = false;
        gsap.set(cards, {clearProps:'transform,opacity'});
        gsap.set(element.querySelectorAll('.hero-title-group,.hero-description,.hero-meta,.scroll-cue'), {clearProps:'transform,opacity'});
      };
    }, element);
    return () => media.revert();
  }, [root]);
}
