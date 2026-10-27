import { useEffect, type RefObject } from 'react';

/** Reveal once the subject, rather than its first few pixels, is in view. */
export function useEntrance(ref: RefObject<HTMLElement | null>, selector: string, stagger = 0) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));
    const animations = new Map<Element, Animation>();
    const observer = new IntersectionObserver(entries => {
      const entering = entries.filter(entry => entry.isIntersecting && entry.intersectionRatio >= .12);
      entering.sort((a,b) => Math.abs(a.boundingClientRect.top-b.boundingClientRect.top)>12 ? a.boundingClientRect.top-b.boundingClientRect.top : a.boundingClientRect.left-b.boundingClientRect.left);
      entering.forEach((entry, index) => {
        observer.unobserve(entry.target);
        const animation = animations.get(entry.target);
        if (!animation) return;
        animation.effect?.updateTiming({ delay: Math.min(index * stagger, 180) });
        animation.play();
      });
    }, { threshold: [0, .12], rootMargin: '0px 0px -3% 0px' });
    targets.forEach(element => {
      element.dataset.entrancePending = 'true';
      const animation = element.animate([
        { opacity: 0, transform: 'translateY(38px) scale(.97)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ], { duration: 650, easing: 'cubic-bezier(.25,.65,.25,1)', fill: 'both' });
      animation.pause();
      animation.onfinish = () => { delete element.dataset.entrancePending; animation.cancel(); };
      animations.set(element, animation);
      observer.observe(element);
    });
    const finish = () => { observer.disconnect(); animations.forEach((animation, element) => { delete (element as HTMLElement).dataset.entrancePending; animation.cancel(); }); };
    const reduce = () => { if (preference.matches) finish(); };
    preference.addEventListener('change', reduce);
    root.addEventListener('focusin', finish);
    root.addEventListener('pointerdown', finish);
    return () => {
      finish();
      preference.removeEventListener('change', reduce);
      root.removeEventListener('focusin', finish);
      root.removeEventListener('pointerdown', finish);
    };
  }, [ref, selector, stagger]);
}
