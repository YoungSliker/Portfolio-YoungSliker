import { useEffect, type RefObject } from 'react';

export function useGraphGrowth(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const seen = new WeakSet<Element>();
    const running = new Set<Animation>();
    let visible = false;
    const grow = () => {
      const fresh = Array.from(root.querySelectorAll<HTMLElement>('.archive-node')).filter(el => !seen.has(el));
      if (!visible) { if (!reduce.matches) fresh.forEach(node => node.setAttribute('data-growth-wait', '')); return; }
      fresh.sort((a,b) => { const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect(); return Math.abs(ar.top-br.top)>12 ? ar.top-br.top : ar.left-br.left; });
      fresh.forEach((node, index) => {
        seen.add(node);
        node.removeAttribute('data-growth-wait');
        if (reduce.matches) return;
        const animation = node.animate([
          { opacity: 0, transform: 'scale(.18)' },
          { opacity: 1, transform: 'scale(1.045)', offset: .78 },
          { opacity: 1, transform: 'scale(1)' },
        ], { duration: 400, delay: Math.min(index * 70, 240), easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'backwards' });
        running.add(animation);
        animation.onfinish = () => { running.delete(animation); animation.cancel(); };
      });
    };
    const viewport = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .12);
      grow();
    }, { threshold: [0, .12], rootMargin: '0px 0px -3% 0px' });
    viewport.observe(root);
    const changes = new MutationObserver(grow);
    changes.observe(root, { childList: true, subtree: true });
    const finish = () => { running.forEach(animation => animation.cancel()); running.clear(); };
    const preference = () => { if (reduce.matches) { finish(); root.querySelectorAll('[data-growth-wait]').forEach(node=>node.removeAttribute('data-growth-wait')); } };
    root.addEventListener('pointerdown', finish);
    root.addEventListener('focusin', finish);
    reduce.addEventListener('change', preference);
    return () => { viewport.disconnect(); changes.disconnect(); finish(); root.removeEventListener('pointerdown', finish); root.removeEventListener('focusin', finish); reduce.removeEventListener('change', preference); };
  }, [ref]);
}
