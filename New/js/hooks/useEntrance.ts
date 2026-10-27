import { useEffect, type RefObject } from 'react';

/** One-shot entrances on real visibility; content stays usable if motion is disabled. */
export function useEntrance(ref: RefObject<HTMLElement | null>, selector: string, stagger = 0) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const index = Array.from(root.querySelectorAll(selector)).indexOf(entry.target);
        animations.push(entry.target.animate([
          { opacity: 0, transform: 'translateY(22px) scale(.985)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ], { duration: 680, delay: Math.max(0, index) * stagger, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }));
      }
    }, { threshold: .08 });
    root.querySelectorAll(selector).forEach(element => observer.observe(element));
    const finish = () => animations.forEach(animation => animation.cancel());
    const reduce = () => { if (preference.matches) finish(); };
    preference.addEventListener('change', reduce);
    root.addEventListener('focusin', finish);
    root.addEventListener('pointerdown', finish);
    return () => {
      observer.disconnect(); finish();
      preference.removeEventListener('change', reduce);
      root.removeEventListener('focusin', finish);
      root.removeEventListener('pointerdown', finish);
    };
  }, [ref, selector, stagger]);
}
